/**
 * router.tsx
 *
 * Declares the complete route map for the application and renders the correct
 * page component for the current URL. This is the single source of truth for
 * all client-side routes.
 *
 * Key responsibilities:
 *   - Code-split every page via React.lazy() so users only download the JS
 *     they actually visit, keeping the initial bundle small.
 *   - Guard authenticated routes with role-aware redirect components
 *     (StudentOnly, AdminOnly) so the server never needs to enforce
 *     client-side routing rules — this is defence-in-depth only; the API
 *     enforces real access control independently.
 *   - Wrap every route in an ErrorBoundary + Suspense so a broken or
 *     slow-loading page never crashes the entire app.
 *   - Animate page transitions via AnimatePresence so navigations feel
 *     smooth rather than abrupt.
 */

import { Suspense, lazy } from 'react';
import type { ReactNode } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '../core/contexts/AuthContext';
import ErrorBoundary from '../shared/components/ErrorBoundary';

// ─── Layouts ──────────────────────────────────────────────────────────────────
// Layouts are imported eagerly (not lazy) because they are shared shells used
// by many routes. Lazy-loading them would cause a layout flash on first render.
import PublicLayout from '../shared/layouts/PublicLayout';
import LandingLayout from '../shared/layouts/LandingLayout';
import StudentLayout from '../shared/layouts/StudentLayout';
import AdminLayout from '../shared/layouts/AdminLayout';

// Shared pages (eager — always needed, very small)
import NotFoundPage from '../shared/pages/NotFoundPage';

// ─── Lazy page imports ────────────────────────────────────────────────────────
// Each page is split into its own JS chunk. React only downloads and executes
// the chunk when the user actually navigates to that route.
// The Suspense fallback (<PageLoader />) is shown while the chunk is loading.

// Marketing pages
const LandingPage       = lazy(() => import('../features/marketing/pages/LandingPage'));
const TermsPage         = lazy(() => import('../features/marketing/pages/TermsPage'));

// Auth pages
// Note: all auth flows (login, register, forgot-password, etc.) share LoginPage.
// The page internally reads the current path to decide which form to render.
const LoginPage         = lazy(() => import('../features/auth/pages/LoginPage'));

// Student pages
const DashboardPage     = lazy(() => import('../features/student/pages/DashboardPage'));
const BootcampPage      = lazy(() => import('../features/student/pages/BootcampPage'));
const MarketplacePage   = lazy(() => import('../features/student/pages/MarketplacePage'));
const WalletPage        = lazy(() => import('../features/student/pages/WalletPage'));
const ProfilePage       = lazy(() => import('../features/student/pages/ProfilePage'));
const PublicProfilePage = lazy(() => import('../features/marketing/pages/PublicProfilePage'));
const LeaderboardPage   = lazy(() => import('../features/student/pages/LeaderboardPage'));
const NotificationsPage = lazy(() => import('../features/student/pages/NotificationsPage'));
const SettingsPage      = lazy(() => import('../features/student/pages/SettingsPage'));
const BootcampCoursePage= lazy(() => import('../features/student/pages/BootcampCoursePage'));
const BootcampRoomPage  = lazy(() => import('../features/student/pages/BootcampRoomPage'));
const CtfPage           = lazy(() => import('../features/student/pages/CtfPage'));

// Admin pages
const AdminDashboardPage= lazy(() => import('../features/admin/pages/AdminDashboardPage'));

// ─── Loading fallback ─────────────────────────────────────────────────────────

/**
 * Shown while a lazy page chunk is being downloaded, or while auth state is
 * being resolved. A centred spinner on the app background colour avoids
 * a jarring white flash during loading.
 */
const PageLoader = () => (
  <div className="h-screen w-full bg-bg flex items-center justify-center">
    {/* Spinning ring using Tailwind's animate-spin and accent colour */}
    <div className="w-10 h-10 rounded-full border-4 border-border border-t-accent animate-spin" />
  </div>
);

// ─── Route wrapper ────────────────────────────────────────────────────────────

/**
 * Wrap — combines ErrorBoundary + Suspense + page transition animation into
 * a single reusable wrapper applied to every route element.
 *
 * @param children - The lazy page component to render.
 * @param scope    - A human-readable label passed to ErrorBoundary for error
 *                   reporting (e.g. "Dashboard", "Login"). Helps identify
 *                   which page crashed in production error logs.
 *
 * Animation:
 *   Pages fade in (opacity 0 → 1) and fade out (opacity 1 → 0) over 0.25 s.
 *   This is intentionally shorter than the global MotionConfig default because
 *   page transitions should feel snappy, not sluggish.
 */
const Wrap = ({ children, scope }: { children: ReactNode; scope?: string }) => (
  <ErrorBoundary scope={scope}>
    <motion.div
      initial={{ opacity: 0 }}   // Start invisible on enter
      animate={{ opacity: 1 }}   // Fade in to fully visible
      exit={{ opacity: 0 }}      // Fade out when navigating away
      transition={{ duration: 0.25 }}
    >
      {/* Suspense shows PageLoader until the lazy chunk has finished loading */}
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </motion.div>
  </ErrorBoundary>
);

// ─── Route guards ─────────────────────────────────────────────────────────────

/**
 * StudentOnly — protects routes that require a logged-in, non-admin user.
 *
 * Redirect logic:
 *   - Still loading auth state → show PageLoader (avoids a premature redirect
 *     before we know if the user is actually logged in).
 *   - No user (unauthenticated) → redirect to /login.
 *   - User is an admin → redirect to the admin dashboard.
 *     Admins should not access student pages; this prevents confusion and
 *     accidental data mutations on the wrong interface.
 *   - Authenticated student → render children normally.
 *
 * IMPORTANT: This is a UX guard, not a security boundary. The backend API
 * enforces real authorisation on every request. Never rely on client-side
 * guards alone to protect sensitive data or actions.
 */
const StudentOnly = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.isAdmin) return <Navigate to="/mr-robot/dashboard" replace />;
  return <>{children}</>;
};

/**
 * AdminOnly — protects routes that require an authenticated admin user.
 *
 * Redirect logic:
 *   - Still loading → show PageLoader.
 *   - No user (unauthenticated) → redirect to the admin login page (/mr-robot),
 *     not the student login, to keep the admin entry point separate.
 *   - User is not an admin → redirect to the student dashboard.
 *     Students who somehow reach an admin URL are silently redirected away.
 *   - Authenticated admin → render children normally.
 *
 * Same caveat as StudentOnly: this is a UX guard only. The backend enforces
 * admin-only access control independently on every protected endpoint.
 */
const AdminOnly = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/mr-robot" replace />;
  if (!user.isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

// ─── Router ───────────────────────────────────────────────────────────────────

/**
 * AppRouter — renders the route tree and handles page-level transitions.
 *
 * AnimatePresence (mode="wait"):
 *   Waits for the current page's exit animation to fully complete before
 *   mounting the next page. Without "wait", the enter and exit animations
 *   would overlap, causing both pages to be visible simultaneously.
 *
 *   `location` is passed as the key so AnimatePresence can detect when the
 *   URL changes and trigger the exit animation for the outgoing page.
 */
export const AppRouter = () => {
  // useLocation() gives us the current URL object. Passing it to both
  // AnimatePresence and <Routes> keeps them in sync during transitions.
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>

        {/* ── Public marketing routes (no auth required) ─────────────────── */}

        {/*
          LandingLayout wraps the homepage. It is a separate layout from
          PublicLayout to allow the landing page to have a distinct hero
          treatment (e.g. full-bleed sections, no standard header).
        */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<Wrap scope="Landing"><LandingPage /></Wrap>} />
        </Route>

        {/*
          PublicLayout wraps standard public pages that need the normal
          header/footer shell (scroll, nav, footer included).
        */}
        <Route element={<PublicLayout />}>
          {/* /contact is deprecated — redirect to homepage rather than 404 */}
          <Route path="/contact" element={<Navigate to="/" replace />} />

          {/* Public hacker profile page — accessible without logging in */}
          <Route path="/u/:handle" element={<Wrap scope="Profile"><PublicProfilePage /></Wrap>} />

          <Route path="/terms" element={<Wrap scope="Terms of Service"><TermsPage /></Wrap>} />
        </Route>

        {/* ── Auth routes (no layout shell — full-page auth forms) ───────── */}
        {/*
          All auth flows reuse LoginPage. The component reads the current
          pathname to determine which form to render (login, register,
          reset-password, etc.). This keeps auth UI logic centralised.

          /mr-robot is the admin login entry point. It uses the same LoginPage
          component but renders an admin-specific form variant. The obscure
          path is intentional — it is not security through obscurity (the API
          enforces admin auth), but it reduces automated scanning noise.
        */}
        <Route path="/login"           element={<Wrap scope="Login"><LoginPage /></Wrap>} />
        <Route path="/register"        element={<Wrap scope="Register"><LoginPage /></Wrap>} />
        <Route path="/forgot-password" element={<Wrap scope="Forgot Password"><LoginPage /></Wrap>} />
        <Route path="/reset-password"  element={<Wrap scope="Reset Password"><LoginPage /></Wrap>} />
        <Route path="/verify-email"    element={<Wrap scope="Verify Email"><LoginPage /></Wrap>} />
        <Route path="/change-password" element={<Wrap scope="Change Password"><LoginPage /></Wrap>} />
        <Route path="/mr-robot"        element={<Wrap scope="Admin Login"><LoginPage /></Wrap>} />

        {/* ── Student routes (auth required, StudentLayout) ──────────────── */}
        {/*
          StudentLayout provides the authenticated shell: top navigation bar,
          mobile bottom nav, and the content area. No public footer.
          Every child route is wrapped in StudentOnly to enforce authentication.
        */}
        <Route element={<StudentLayout />}>

          {/* ── Primary /dashboard/* routes ──────────────────────────────── */}
          <Route path="/dashboard" element={<Wrap scope="Dashboard"><StudentOnly><DashboardPage /></StudentOnly></Wrap>} />

          {/* Bootcamp list */}
          <Route path="/dashboard/bootcamps" element={<Wrap scope="Bootcamps"><StudentOnly><BootcampPage /></StudentOnly></Wrap>} />

          {/* Individual bootcamp overview — :bootcampId is the bootcamp's unique identifier */}
          <Route path="/dashboard/bootcamps/:bootcampId" element={<Wrap scope="Bootcamp Course"><StudentOnly><BootcampCoursePage /></StudentOnly></Wrap>} />

          {/*
            Bootcamp room routes — two URL shapes are supported because the
            backend uses both module-based and phase-based room structures.
            Both resolve to the same BootcampRoomPage component.
          */}
          <Route path="/dashboard/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId" element={<Wrap scope="Bootcamp Room"><StudentOnly><BootcampRoomPage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId"  element={<Wrap scope="Bootcamp Room"><StudentOnly><BootcampRoomPage /></StudentOnly></Wrap>} />

          {/* CTF (Capture the Flag) challenge page — :moduleId identifies the challenge set */}
          <Route path="/dashboard/ctf/:moduleId" element={<Wrap scope="CTF Challenge"><StudentOnly><CtfPage /></StudentOnly></Wrap>} />

          <Route path="/dashboard/marketplace"   element={<Wrap scope="Market"><StudentOnly><MarketplacePage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/leaderboard"   element={<Wrap scope="Leaderboard"><StudentOnly><LeaderboardPage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/wallet"        element={<Wrap scope="Wallet"><StudentOnly><WalletPage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/profile"       element={<Wrap scope="Profile"><StudentOnly><ProfilePage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/notifications" element={<Wrap scope="Notifications"><StudentOnly><NotificationsPage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/settings"      element={<Wrap scope="Settings"><StudentOnly><SettingsPage /></StudentOnly></Wrap>} />

          {/*
            ── Legacy routes (short paths without /dashboard prefix) ─────────
            These existed before the /dashboard/* restructure. They are kept
            to avoid breaking any bookmarks or external links that users may
            have saved. They render the same pages as the canonical routes above.
            If you want to redirect them instead, replace the page component
            with <Navigate to="/dashboard/..." replace />.
          */}
          <Route path="/bootcamps"        element={<Wrap scope="Bootcamps"><StudentOnly><BootcampPage /></StudentOnly></Wrap>} />
          <Route path="/bootcamps/:bootcampId" element={<Wrap scope="Bootcamp Course"><StudentOnly><BootcampCoursePage /></StudentOnly></Wrap>} />
          <Route path="/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId" element={<Wrap scope="Bootcamp Room"><StudentOnly><BootcampRoomPage /></StudentOnly></Wrap>} />
          <Route path="/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId"  element={<Wrap scope="Bootcamp Room"><StudentOnly><BootcampRoomPage /></StudentOnly></Wrap>} />
          <Route path="/ctf/:moduleId"    element={<Wrap scope="CTF Challenge"><StudentOnly><CtfPage /></StudentOnly></Wrap>} />
          <Route path="/marketplace"      element={<Wrap scope="Market"><StudentOnly><MarketplacePage /></StudentOnly></Wrap>} />
          <Route path="/leaderboard"      element={<Wrap scope="Leaderboard"><StudentOnly><LeaderboardPage /></StudentOnly></Wrap>} />
          <Route path="/wallet"           element={<Wrap scope="Wallet"><StudentOnly><WalletPage /></StudentOnly></Wrap>} />
          <Route path="/profile"          element={<Wrap scope="Profile"><StudentOnly><ProfilePage /></StudentOnly></Wrap>} />
          <Route path="/notifications"    element={<Wrap scope="Notifications"><StudentOnly><NotificationsPage /></StudentOnly></Wrap>} />
          <Route path="/settings"         element={<Wrap scope="Settings"><StudentOnly><SettingsPage /></StudentOnly></Wrap>} />
        </Route>

        {/* ── Admin routes ───────────────────────────────────────────────── */}
        {/*
          AdminLayout provides the admin shell (sidebar, admin nav).
          Every child is wrapped in AdminOnly to enforce admin-role access.
        */}
        <Route element={<AdminLayout />}>
          <Route path="/mr-robot/dashboard" element={<Wrap scope="Admin Dashboard"><AdminOnly><AdminDashboardPage /></AdminOnly></Wrap>} />
        </Route>

        {/* ── 404 fallback ───────────────────────────────────────────────── */}
        {/*
          The wildcard "*" catches every URL that didn't match any route above.
          No scope is passed because NotFoundPage is always intentional —
          it doesn't represent a crashed component that needs error tracking.
        */}
        <Route path="*" element={<Wrap><NotFoundPage /></Wrap>} />

      </Routes>
    </AnimatePresence>
  );
};