/**
 * router.tsx
 *
 * Declares the complete route map for the application and renders the correct
 * page component for the current URL. This is the single source of truth for
 * all client-side routes.
 */

import { Suspense, lazy } from 'react';
import type { ReactNode } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '../core/contexts/AuthContext';
import ErrorBoundary from '../shared/components/ErrorBoundary';

// ─── Layouts ──────────────────────────────────────────────────────────────────
import PublicLayout from '../shared/layouts/PublicLayout';
import LandingLayout from '../shared/layouts/LandingLayout';
import StudentLayout from '../shared/layouts/StudentLayout';
import AdminLayout from '../shared/layouts/AdminLayout';

// Shared pages
import NotFoundPage from '../shared/pages/NotFoundPage';

// ─── Lazy page imports ────────────────────────────────────────────────────────
const LandingPage       = lazy(() => import('../features/marketing/pages/LandingPage'));
const TermsPage         = lazy(() => import('../features/marketing/pages/TermsPage'));

// Auth pages
const LoginPage         = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage      = lazy(() => import('../features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'));
const VerifyEmailPage    = lazy(() => import('../features/auth/pages/VerifyEmailPage'));
const ChangePasswordPage = lazy(() => import('../features/auth/pages/ChangePasswordPage'));

// Student pages
const DashboardPage     = lazy(() => import('../features/student/pages/DashboardPage'));
const BootcampPage      = lazy(() => import('../features/student/pages/BootcampPage'));
const MarketplacePage   = lazy(() => import('../features/student/pages/MarketplacePage'));
const WalletPage        = lazy(() => import('../features/student/pages/WalletPage'));
const ProfilePage       = lazy(() => import('../features/student/pages/ProfilePage'));
const PublicProfilePage = lazy(() => import('../features/marketing/pages/PublicProfilePage'));
const NotificationsPage = lazy(() => import('../features/student/pages/NotificationsPage'));
const SettingsPage      = lazy(() => import('../features/student/pages/SettingsPage'));
const BootcampCoursePage= lazy(() => import('../features/student/pages/BootcampCoursePage'));
const BootcampRoomPage  = lazy(() => import('../features/student/pages/BootcampRoomPage'));

// Admin pages
const AdminDashboardPage= lazy(() => import('../features/admin/pages/AdminDashboardPage'));

// ─── Loading fallback ─────────────────────────────────────────────────────────
import PageLoader from '../shared/components/PageLoader';
import CommunityPopup from '../shared/components/CommunityPopup';

// ─── Route wrapper ────────────────────────────────────────────────────────────
const Wrap = ({ children, scope }: { children: ReactNode; scope?: string }) => (
  <ErrorBoundary scope={scope}>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </motion.div>
  </ErrorBoundary>
);

// ─── Route guards ─────────────────────────────────────────────────────────────
const StudentOnly = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.isAdmin) return <Navigate to="/mr-robot/dashboard" replace />;
  return <>{children}</>;
};

const AdminOnly = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/mr-robot" replace />;
  if (!user.isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

// ─── Router ───────────────────────────────────────────────────────────────────
export const AppRouter = () => {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

        {/* ── Public marketing routes ─────────────────── */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<Wrap scope="Landing"><LandingPage /></Wrap>} />
          <Route path="/terms" element={<Wrap scope="Terms of Service"><TermsPage /></Wrap>} />
        </Route>

        {/* ── Auth routes ───────── */}
        <Route path="/login"           element={<Wrap scope="Login"><LoginPage /></Wrap>} />
        <Route path="/register"        element={<Wrap scope="Register"><RegisterPage /></Wrap>} />
        <Route path="/forgot-password" element={<Wrap scope="Forgot Password"><ForgotPasswordPage /></Wrap>} />
        <Route path="/reset-password"  element={<Wrap scope="Reset Password"><ForgotPasswordPage /></Wrap>} />
        <Route path="/verify-email"    element={<Wrap scope="Verify Email"><VerifyEmailPage /></Wrap>} />
        <Route path="/change-password" element={<Wrap scope="Change Password"><ChangePasswordPage /></Wrap>} />
        <Route path="/mr-robot"        element={<Wrap scope="Admin Login"><LoginPage /></Wrap>} />

        {/* ── Student routes ──────────────── */}
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<Wrap scope="Dashboard"><StudentOnly><DashboardPage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/bootcamps" element={<Navigate to="/dashboard/bootcamps/bc_1775270338500" replace />} />
          <Route path="/dashboard/bootcamps/:bootcampId" element={<Wrap scope="Bootcamp Course"><StudentOnly><BootcampCoursePage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId" element={<Wrap scope="Bootcamp Room"><StudentOnly><BootcampRoomPage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId"  element={<Wrap scope="Bootcamp Room"><StudentOnly><BootcampRoomPage /></StudentOnly></Wrap>} />

          <Route path="/dashboard/marketplace"   element={<Wrap scope="Market"><StudentOnly><MarketplacePage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/wallet"        element={<Wrap scope="Wallet"><StudentOnly><WalletPage /></StudentOnly></Wrap>} />
          
          <Route path="/dashboard/profile"       element={<Wrap scope="Profile"><StudentOnly><ProfilePage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/profile/:username" element={<Wrap scope="Profile"><StudentOnly><ProfilePage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/notifications" element={<Wrap scope="Notifications"><StudentOnly><NotificationsPage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/settings"      element={<Wrap scope="Settings"><StudentOnly><SettingsPage /></StudentOnly></Wrap>} />

          {/* Legacy redirects */}
          <Route path="/bootcamps"        element={<Navigate to="/dashboard/bootcamps/bc_1775270338500" replace />} />
          <Route path="/marketplace"      element={<Navigate to="/dashboard/marketplace" replace />} />
          <Route path="/wallet"           element={<Navigate to="/dashboard/wallet" replace />} />
          <Route path="/profile"          element={<Navigate to="/dashboard/profile" replace />} />
          <Route path="/notifications"    element={<Navigate to="/dashboard/notifications" replace />} />
          <Route path="/settings"         element={<Navigate to="/dashboard/settings" replace />} />
        </Route>

        {/* ── Admin routes ───────────────────────────────────────────────── */}
        <Route element={<AdminLayout />}>
          <Route path="/mr-robot/dashboard" element={<Wrap scope="Admin Dashboard"><AdminOnly><AdminDashboardPage /></AdminOnly></Wrap>} />
        </Route>

        {/* ── 404 fallback ───────────────────────────────────────────────── */}
        {/* Handle profile routes that start with @ */}
        <Route path="/@:handle" element={<Wrap scope="Profile"><PublicProfilePage /></Wrap>} />
        
        {/* Catch-all 404 for any other invalid routes */}
        <Route path="*" element={<Wrap><NotFoundPage /></Wrap>} />

      </Routes>
    </AnimatePresence>
    <MotionCommunityPopup />
  </>
  );
};

const MotionCommunityPopup = () => (
  <Suspense fallback={null}>
    <CommunityPopup />
  </Suspense>
);
