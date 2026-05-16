/**
 * AuthContext.tsx
 *
 * Provides application-wide authentication state via React Context.
 * Any component that needs to know who is logged in, or needs to
 * trigger a login/logout, should consume this context via `useAuth()`.
 *
 * Architecture notes:
 * - A single AuthProvider wraps the entire app (usually in main.tsx / App.tsx).
 * - Authentication state is bootstrapped once on mount by calling the
 *   /auth/me endpoint — but only when an internal session hint indicates
 *   that a session is likely active, to avoid noisy 401s for guest visitors.
 * - The context value is memoized so child components only re-render when
 *   `user` or `loading` actually change.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import api, {
  clearAuthStorage,   // Wipes all locally stored auth data on logout / auth failure
  setAccessToken,     // Stores a short-lived access token returned after login
  setAuthSessionHint, // Marks that a session likely exists, avoids 401 noise for guests
  hasAuthSessionHint, // Reads that hint before attempting silent token refresh
} from '../services/api';
import { extractCpBalance } from '../../shared/utils/cpBalance';

// ─── Domain types ────────────────────────────────────────────────────────────

/**
 * The shape of the user object that the rest of the frontend works with.
 * This is intentionally different from BackendUser — the backend shape is
 * an implementation detail that callers of useAuth() should never depend on.
 */
interface User {
  uid: string;
  username: string;    // Displayed handle (hackerHandle preferred over real name)
  email: string;
  rank: string;        // Human-readable rank derived from CP thresholds (see toFrontendUser)
  cp: number;          // Cyber Points balance
  isAdmin: boolean;
  role: string;        // Raw role string from backend ('admin', 'student', etc.)
  bootcampId: string;
  bootcampStatus: string;
}

/**
 * Thrown by `login()` when the backend signals the user must change their
 * password before continuing. The caller (LoginPage) catches this and
 * redirects to the change-password flow instead of showing a login error.
 *
 * The `passwordChangeToken` is a short-lived, single-use token issued by the
 * backend that authorises the password-change request. It must not be stored
 * beyond the immediate redirect — treat it like a one-time-password.
 */
export class MustChangePasswordError extends Error {
  passwordChangeToken: string;
  constructor(token: string) {
    super('Password change required');
    this.name = 'MustChangePasswordError';
    this.passwordChangeToken = token;
  }
}

/** Public API that consumers of AuthContext receive via useAuth(). */
interface AuthContextType {
  user: User | null;          // null = not authenticated
  loading: boolean;           // true while the initial session check is in flight
  login: (credentials: { email?: string; password?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>; // Re-fetches the current user from /auth/me
}

/**
 * Raw shape returned by the backend's /auth/me and /auth/login endpoints.
 * Fields are optional because the backend may omit them for certain roles or
 * in partial response scenarios — toFrontendUser() handles all the defaults.
 */
interface BackendUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  hackerHandle?: string;
  cpPoints?: number;
  bootcampId?: string;
  bootcampStatus?: string;
}

// ─── Context creation ─────────────────────────────────────────────────────────

/**
 * The raw React context. Components should never consume this directly —
 * use the `useAuth()` hook instead, which provides a clear error message
 * if the provider is missing from the tree.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Data transformation ──────────────────────────────────────────────────────

/**
 * Converts a raw backend user object into the frontend User shape.
 *
 * Rank thresholds (CP-based, ascending):
 *   0–149    → Candidate
 *   150–449  → Contributor
 *   450–899  → Specialist
 *   900–1499 → Architect
 *   1500+    → Vanguard
 *   (admin)  → Administrator (role overrides CP rank)
 *
 * All field access uses safe fallbacks so a partially formed backend response
 * never causes a runtime crash in the frontend.
 */
const toFrontendUser = (backendUser: BackendUser): User => {
  const role = String(backendUser?.role || 'student');

  // CP balance: prefer the dedicated extractor (handles edge cases like
  // nested objects or alternate field names), fall back to cpPoints.
  const cp = extractCpBalance(backendUser) ?? Number(backendUser?.cpPoints || 0);

  // Use the hacker handle as the display name. Fall back to the real name only
  // if the handle has not been set. Never display a blank string or a dash.
  const username = String(backendUser?.hackerHandle || backendUser?.name || '').trim();

  return {
    uid: String(backendUser?.id || ''),
    username,
    email: String(backendUser?.email || ''),
    rank:
      role === 'admin'
        ? 'Administrator'
        : cp >= 1500
        ? 'Vanguard'
        : cp >= 900
        ? 'Architect'
        : cp >= 450
        ? 'Specialist'
        : cp >= 150
        ? 'Contributor'
        : 'Candidate',
    cp,
    isAdmin: role === 'admin',
    role,
    bootcampId: String(backendUser?.bootcampId || ''),
    bootcampStatus: String(backendUser?.bootcampStatus || 'not_enrolled'),
  };
};

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * AuthProvider — wrap this around the root of the app (or the subtree that
 * needs authentication). It owns the canonical `user` state and exposes
 * login / logout / refreshMe actions to any descendant via useAuth().
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // `user` is null when unauthenticated; populated after a successful login
  // or after a successful silent session restoration on mount.
  const [user, setUser] = useState<User | null>(null);

  // `loading` stays true until the initial session check resolves.
  // UI layers (route guards, layouts) should gate their render on this flag
  // to avoid a flash of unauthenticated content.
  const [loading, setLoading] = useState(true);

  // Prevents the bootstrap effect from running twice in React Strict Mode,
  // which intentionally double-invokes effects in development.
  const bootstrapRanRef = useRef(false);

  /**
   * Fetches the current user from the backend and updates state.
   * Called on mount (silent session restoration) and after any action that
   * may have changed the user's profile on the server.
   *
   * Throws on network error or 401 — callers are responsible for catching.
   */
  const refreshMe = async () => {
    const meRes = await api.get('/auth/me');
    // /auth/me succeeding confirms a valid session exists — record the hint
    // so future page loads know to attempt silent restoration.
    setAuthSessionHint(true);
    setUser(toFrontendUser(meRes.data || {}));
  };

  /**
   * Bootstrap effect — runs once after the initial render.
   *
   * We only attempt a session restoration when the session hint flag is set.
   * This avoids firing an authenticated request (and logging a 401 to the
   * console) for users who have never logged in or who have fully logged out.
   */
  useEffect(() => {
    if (bootstrapRanRef.current) return;
    bootstrapRanRef.current = true;

    if (!hasAuthSessionHint()) {
      // No hint → treat the visitor as a guest immediately.
      setLoading(false);
      return;
    }

    (async () => {
      try {
        await refreshMe();
      } catch {
        // Session restoration failed (token expired, cookie cleared, etc.).
        // Clear any leftover auth data to ensure a clean guest state.
        // The error is intentionally swallowed here — it is an expected
        // outcome for expired sessions, not an application error.
        setUser(null);
        clearAuthStorage();
      } finally {
        // Always clear the loading flag, even on failure, so the UI unblocks.
        setLoading(false);
      }
    })();
  }, []); // Empty dependency array — run exactly once on mount.

  /**
   * Authenticates a user with email + password credentials.
   *
   * Possible outcomes:
   *   1. Success → user state is populated, session hint is set.
   *   2. MustChangePasswordError → caller must redirect to the password-change flow.
   *   3. Any other error → propagated to the caller for display (e.g. wrong password).
   *
   * Credentials are sanitised (trimmed, coerced to string) before being sent
   * to prevent accidental whitespace issues or type confusion from form inputs.
   */
  const login = async (credentials: { email?: string; password?: string }) => {
    const email = String(credentials?.email || '').trim();
    const password = String(credentials?.password || '');

    const res = await api.post('/auth/login', { email, password });

    // The backend signals a forced password change by returning this flag.
    // We throw a typed error rather than returning a special value so the
    // calling code (LoginPage) can handle it in a catch block cleanly.
    if (res.data?.mustChangePassword && res.data?.passwordChangeToken) {
      throw new MustChangePasswordError(String(res.data.passwordChangeToken));
    }

    // Persist the short-lived access token for subsequent API calls.
    // setAccessToken handles the storage details internally.
    if (res.data?.token) setAccessToken(String(res.data.token));

    // Record that a session now exists for future page loads.
    setAuthSessionHint(true);

    // If the login response already includes the user object, use it directly
    // to avoid an extra round-trip to /auth/me.
    if (res.data?.user) {
      setUser(toFrontendUser(res.data.user));
      return;
    }

    // Fallback: fetch the user separately. This handles backends that return
    // only the token on login and expect a follow-up /auth/me call.
    await refreshMe();
  };

  /**
   * Logs the current user out.
   *
   * Always clears local auth state regardless of whether the server-side
   * logout call succeeded. This ensures the user is never stuck in a
   * half-logged-in state due to a network failure.
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch {
      // Network errors during logout are non-fatal — we always clear local
      // state in the finally block below, so the user will be logged out
      // on the client even if the server request failed.
    } finally {
      clearAuthStorage();
      setUser(null);
    }
  };

  /**
   * Memoize the context value so that components consuming useAuth() only
   * re-render when `user` or `loading` actually change — not on every render
   * of AuthProvider itself.
   */
  const value = useMemo(
    () => ({ user, loading, login, logout, refreshMe }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useAuth — the primary way to access authentication state and actions.
 *
 * Must be called from a component that is a descendant of AuthProvider.
 * Throws a descriptive error if used outside the provider tree so
 * misconfigured component trees fail loudly during development.
 *
 * @example
 *   const { user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};