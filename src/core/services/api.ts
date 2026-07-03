/**
 * api.ts
 *
 * The central Axios HTTP client for all backend communication.
 *
 * This file owns three concerns:
 *   1. Token management  — access token (in-memory), CSRF token (localStorage),
 *                          and a session hint flag that controls silent refresh.
 *   2. Request pipeline  — attaches auth and CSRF headers to every outgoing request.
 *   3. Response pipeline — extracts tokens from responses and silently refreshes
 *                          an expired access token on a 401 before retrying.
 *
 * Security model (read this before making changes):
 *   - The access token lives in a JS variable ONLY. It is never written to
 *     localStorage or sessionStorage. This means it cannot be stolen by an
 *     XSS payload that reads storage — it is lost on page refresh, which is
 *     intentional and correct.
 *   - The refresh token is an httpOnly cookie managed entirely by the browser.
 *     JS cannot read it. The browser sends it automatically on requests to the
 *     backend when withCredentials: true is set.
 *   - The CSRF token is stored in localStorage and sent as a custom header
 *     (X-CSRF-Token). Because custom headers cannot be sent by cross-origin
 *     forms or simple requests, this satisfies the CSRF protection contract.
 *   - The session hint flag is a lightweight boolean in localStorage that tells
 *     the app "a session has existed before". It lets us skip the 401-triggering
 *     /auth/me call for first-time guest visitors, avoiding noisy console errors.
 *     It carries no sensitive information and is not a security control.
 */

import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from 'axios';

// ─── Storage keys ─────────────────────────────────────────────────────────────
// Centralised here so a key name change never requires a grep across the codebase.
const CSRF_TOKEN_KEY        = 'qyvora_csrf_token';
const AUTH_SESSION_HINT_KEY = 'qyvora_auth_session_hint';

// ─── API base URL ─────────────────────────────────────────────────────────────
// Read from the Vite environment at build time. Falls back to '/api' so the
// app works out-of-the-box with a local reverse proxy (e.g. vite.config.ts
// proxy rule) without any .env file required.
const DEFAULT_API_BASE = '/api';
const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE).trim();

// ─── In-memory auth state ─────────────────────────────────────────────────────

// The short-lived access token. Kept as a plain module-level variable so it
// exists only in JS heap memory and is never accessible via storage APIs.
// It is reset to an empty string on logout or when a refresh attempt fails.
let accessToken: string = '';

// The CSRF token seeded from localStorage on module load (survives page refresh).
// Updated whenever the backend rotates it (detected in the response interceptor).
let csrfToken: string = localStorage.getItem(CSRF_TOKEN_KEY) || '';

// Holds the in-flight refresh promise so multiple simultaneous 401 responses
// all wait on the same single refresh call instead of firing N parallel refreshes.
// Set to null once the refresh resolves or rejects.
let refreshPromise: Promise<string | null> | null = null;

// Seeded from localStorage on module load. True if the user has previously
// authenticated in this browser. Used to skip unnecessary refresh attempts
// for unauthenticated visitors. Not a security control.
let authSessionHint = localStorage.getItem(AUTH_SESSION_HINT_KEY) === '1';

// ─── Token persistence helpers ────────────────────────────────────────────────

/**
 * Updates the in-memory access token and, if a non-empty token is provided,
 * sets the session hint flag so future page loads attempt silent restoration.
 *
 * Deliberately does NOT write the token to any persistent storage.
 * The comment below is intentional documentation of that security decision —
 * do not remove it or "fix" it by adding localStorage.setItem.
 */
const persistAccessToken = (token: string) => {
  accessToken = token || '';
  if (accessToken) {
    authSessionHint = true;
    localStorage.setItem(AUTH_SESSION_HINT_KEY, '1');
  }
  // intentionally NOT persisted to localStorage — memory only
};

/**
 * Updates the CSRF token both in-memory and in localStorage so it survives
 * page refreshes. If an empty string is passed (e.g. on logout) the stored
 * value is removed entirely rather than storing an empty string.
 */
const persistCsrfToken = (token: string) => {
  csrfToken = token || '';
  if (csrfToken) localStorage.setItem(CSRF_TOKEN_KEY, csrfToken);
  else localStorage.removeItem(CSRF_TOKEN_KEY);
};

// ─── Public exports (used by AuthContext and other modules) ───────────────────

/** Returns the current in-memory access token. Empty string if not logged in. */
export const getAccessToken = () => accessToken;

/** Stores a new access token received after login or token refresh. */
export const setAccessToken = (token: string) => persistAccessToken(token);

/**
 * Reads the session hint directly from localStorage.
 * Used by AuthContext on mount to decide whether to attempt silent
 * session restoration without triggering a 401 for guest visitors.
 */
export const hasAuthSessionHint = () => localStorage.getItem(AUTH_SESSION_HINT_KEY) === '1';

/**
 * Explicitly sets or clears the session hint.
 * Call with `true` after a successful login, `false` after a logout.
 */
export const setAuthSessionHint = (value: boolean) => {
  authSessionHint = value;
  if (value) localStorage.setItem(AUTH_SESSION_HINT_KEY, '1');
  else localStorage.removeItem(AUTH_SESSION_HINT_KEY);
};

/**
 * Wipes all client-side auth state — access token, CSRF token, and session hint.
 * Called on logout and whenever a refresh attempt fails unrecoverably.
 * After this call the app is in a clean, fully unauthenticated state.
 */
export const clearAuthStorage = () => {
  persistAccessToken('');
  persistCsrfToken('');
  setAuthSessionHint(false);
};

// ─── Response token extraction ────────────────────────────────────────────────

/**
 * Inspects a response body and headers for freshly issued auth tokens and
 * persists any it finds. Called on every successful response and after a
 * successful token refresh so the in-memory state always reflects the latest
 * tokens the backend has issued.
 *
 * Token sources checked (in order of preference):
 *   - Access token : response body { token: "..." }
 *   - CSRF token   : response body { csrfToken: "..." }
 *                    OR response header x-csrf-token / X-CSRF-Token
 *
 * All field accesses use safe coercions so a malformed or partial response
 * body never causes a runtime error.
 */
const maybeUpdateAuthArtifacts = (payload: unknown, headers?: Record<string, unknown>) => {
  // Extract access token from the response body if present
  const tokenFromBody =
    typeof payload === 'object' && payload !== null
      ? String((payload as { token?: unknown }).token || '')
      : '';
  if (tokenFromBody) persistAccessToken(tokenFromBody);

  // Extract CSRF token — prefer body field, fall back to response header.
  // Both header casings are checked because HTTP headers are case-insensitive
  // but different backends/proxies may normalise them differently.
  const csrfFromBody =
    typeof payload === 'object' && payload !== null
      ? String((payload as { csrfToken?: unknown }).csrfToken || '')
      : '';
  const csrfFromHeader = String(headers?.['x-csrf-token'] || headers?.['X-CSRF-Token'] || '');
  const resolvedCsrf = csrfFromBody || csrfFromHeader;
  if (resolvedCsrf) persistCsrfToken(resolvedCsrf);
};

// ─── Axios header utility ─────────────────────────────────────────────────────

/**
 * Ensures that config.headers is a proper AxiosHeaders instance.
 * Axios can occasionally provide a plain object instead of an AxiosHeaders
 * instance in interceptors — this normalises it so we can safely call .set().
 */
const ensureHeaders = (config: InternalAxiosRequestConfig): AxiosHeaders => {
  if (!config.headers) config.headers = new AxiosHeaders();
  return config.headers as AxiosHeaders;
};

// ─── Axios instances ──────────────────────────────────────────────────────────

/**
 * `api` — the primary client used by all feature modules.
 *
 * Has the full request + response interceptor stack:
 *   - Attaches Authorization (Bearer access token) + X-CSRF-Token on every request.
 *   - Automatically retries a failed request once after silently refreshing
 *     the access token on a 401 response.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Sends the httpOnly refresh-token cookie automatically
  headers: { 'Content-Type': 'application/json' },
});

/**
 * `authApi` — a secondary client used exclusively for the /auth/refresh call.
 *
 * Deliberately separate from `api` to avoid an infinite retry loop:
 * if the refresh endpoint itself returns a 401, `api`'s response interceptor
 * would try to refresh again, causing an infinite cycle. `authApi` has no
 * response interceptor, so a failed refresh fails immediately and cleanly.
 *
 * Sends the CSRF token but NOT the Bearer token (there is no valid access
 * token to send — that is why we are refreshing in the first place).
 */
const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptors ─────────────────────────────────────────────────────

/**
 * Attaches the current access token (as a Bearer header) and the CSRF token
 * to every outgoing request made via `api`.
 * Both headers are only attached when the respective token is non-empty.
 */
const attachHeaders = (config: InternalAxiosRequestConfig) => {
  const headers = ensureHeaders(config);
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  if (csrfToken)   headers.set('X-CSRF-Token', csrfToken);
  return config;
};

// Register the header-attachment interceptor on both clients.
// `authApi` only gets the CSRF token — no Bearer token (see authApi comment above).
api.interceptors.request.use(attachHeaders);
authApi.interceptors.request.use((config) => {
  const headers = ensureHeaders(config);
  if (csrfToken) headers.set('X-CSRF-Token', csrfToken);
  return config;
});

// ─── Token refresh logic ──────────────────────────────────────────────────────

/**
 * Calls /auth/refresh to obtain a new access token using the httpOnly
 * refresh-token cookie. The browser sends the cookie automatically because
 * authApi has withCredentials: true.
 *
 * De-duplication: if a refresh is already in-flight (another request also
 * received a 401 at the same moment), all callers await the same promise
 * rather than firing duplicate refresh requests. `refreshPromise` is reset
 * to null in the finally block so the next refresh cycle starts fresh.
 *
 * Returns the new access token string on success, or null on failure.
 * On failure, clearAuthStorage() is called to fully reset client auth state.
 */
const tryRefreshToken = async (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = authApi
      .post('/auth/refresh', {})
      .then((res) => {
        // Extract and persist any tokens the refresh endpoint returns
        maybeUpdateAuthArtifacts(res.data, res.headers as Record<string, unknown>);
        return getAccessToken() || null;
      })
      .catch(() => {
        // Refresh failed (refresh token expired, revoked, or server error).
        // Wipe all auth state so the user is treated as fully logged out.
        clearAuthStorage();
        return null;
      })
      .finally(() => {
        // Always clear the shared promise so future 401s trigger a new refresh
        // cycle rather than awaiting a long-settled promise.
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

// ─── Response interceptor ─────────────────────────────────────────────────────

api.interceptors.response.use(
  // ── Success handler ────────────────────────────────────────────────────────
  // On every successful response, check whether the backend has rotated any
  // tokens and update our in-memory state accordingly.
  (response) => {
    maybeUpdateAuthArtifacts(response.data, response.headers as Record<string, unknown>);
    return response;
  },

  // ── Error handler (401 retry + 403 CSRF recovery) ─────────────────────────
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status;
    const data = error.response?.data as Record<string, unknown> | undefined;

    if (!original || original._retry) {
      return Promise.reject(error);
    }

    // ── CSRF token recovery (403) ──────────────────────────────────────────
    // If the backend rejects with "Invalid/Missing CSRF token", our local CSRF
    // token is out of sync with the cookie. Try to get a fresh token from
    // /auth/me (a GET request, therefore CSRF-exempt) and retry once.
    // We send the Bearer token explicitly because authApi doesn't attach it,
    // and the access_token cookie may be stale.
    const csrfError =
      data?.error === 'Invalid CSRF token' || data?.error === 'Missing CSRF token';
    if (status === 403 && csrfError && authSessionHint) {
      original._retry = true;
      try {
        const meRes = await authApi.get('/auth/me', {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        });
        maybeUpdateAuthArtifacts(meRes.data, meRes.headers as Record<string, unknown>);
        if (csrfToken) {
          const headers = ensureHeaders(original);
          if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
          headers.set('X-CSRF-Token', csrfToken);
          return api(original);
        }
      } catch {
        // Fall through — heal failed, reject the original error
      }
      return Promise.reject(error);
    }

    // ── Token refresh on 401 ────────────────────────────────────────────────
    if (status !== 401) {
      return Promise.reject(error);
    }

    // Skip the refresh attempt if we have no reason to believe a session exists.
    if (!authSessionHint) {
      return Promise.reject(error);
    }

    // Mark this request as retried so if the retry itself returns 401 we do
    // not enter another refresh cycle.
    original._retry = true;

    const refreshedToken = await tryRefreshToken();

    // If refresh failed (expired refresh token, network error, etc.) reject
    // the original error — the caller (AuthContext, etc.) handles the fallout.
    if (!refreshedToken) {
      return Promise.reject(error);
    }

    // Refresh succeeded — update the original request's headers with the new
    // access token and CSRF token, then replay the request transparently.
    const headers = ensureHeaders(original);
    headers.set('Authorization', `Bearer ${refreshedToken}`);
    if (csrfToken) headers.set('X-CSRF-Token', csrfToken);

    return api(original);
  }
);

// The default export is the fully configured `api` instance.
// All feature modules import this and call api.get() / api.post() etc.
export default api;