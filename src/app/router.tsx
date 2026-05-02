import { Suspense, lazy } from 'react';
import type { ReactNode } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '../core/contexts/AuthContext';
import ErrorBoundary from '../shared/components/ErrorBoundary';

// Layouts
import PublicLayout from '../shared/layouts/PublicLayout';
import StudentLayout from '../shared/layouts/StudentLayout';
import AdminLayout from '../shared/layouts/AdminLayout';

// Shared pages
import NotFoundPage from '../shared/pages/NotFoundPage';

// Marketing pages
const LandingPage = lazy(() => import('../features/marketing/pages/LandingPage'));
const ContactPage = lazy(() => import('../features/marketing/pages/ContactPage'));
const ServicesPage = lazy(() => import('../features/marketing/pages/ServicesPage'));
const CyberPointsPage = lazy(() => import('../features/marketing/pages/CyberPointsPage'));
const ChainPage = lazy(() => import('../features/marketing/pages/ChainPage'));
const PublicMarketplacePage = lazy(() => import('../features/marketing/pages/PublicMarketplacePage'));

// Auth pages
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));

// Student pages
const DashboardPage = lazy(() => import('../features/student/pages/DashboardPage'));
const LearnPage = lazy(() => import('../features/student/pages/LearnPage'));
const BootcampPage = lazy(() => import('../features/student/pages/BootcampPage'));
const MarketplacePage = lazy(() => import('../features/student/pages/MarketplacePage'));
const WalletPage = lazy(() => import('../features/student/pages/WalletPage'));
const ProfilePage = lazy(() => import('../features/student/pages/ProfilePage'));
const PublicProfilePage = lazy(() => import('../features/marketing/pages/PublicProfilePage'));
const LeaderboardPage = lazy(() => import('../features/student/pages/LeaderboardPage'));
const NotificationsPage = lazy(() => import('../features/student/pages/NotificationsPage'));
const SettingsPage = lazy(() => import('../features/student/pages/SettingsPage'));
const BootcampCoursePage = lazy(() => import('../features/student/pages/BootcampCoursePage'));
const BootcampRoomPage = lazy(() => import('../features/student/pages/BootcampRoomPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('../features/admin/pages/AdminDashboardPage'));

const PageLoader = () => (
  <div className="h-screen w-full bg-bg flex items-center justify-center">
    <div className="w-10 h-10 rounded-full border-4 border-border border-t-accent animate-spin" />
  </div>
);

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

export const AppRouter = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        {/* Public routes — no auth required */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Wrap scope="Landing"><LandingPage /></Wrap>} />
          <Route path="/contact" element={<Wrap scope="Contact"><ContactPage /></Wrap>} />
          <Route path="/services" element={<Wrap scope="Services"><ServicesPage /></Wrap>} />
          <Route path="/cyber-points" element={<Wrap scope="Cyber Points"><CyberPointsPage /></Wrap>} />
          <Route path="/chain" element={<Wrap scope="HSOCIETY Chain"><ChainPage /></Wrap>} />
          <Route path="/leaderboard" element={<Wrap scope="Leaderboard"><LeaderboardPage /></Wrap>} />
          <Route path="/zero-day-market" element={<Wrap scope="Market"><PublicMarketplacePage /></Wrap>} />
          <Route path="/u/:handle" element={<Wrap scope="Profile"><PublicProfilePage /></Wrap>} />
        </Route>

        {/* Auth routes (no layout) */}
        <Route path="/login" element={<Wrap scope="Login"><LoginPage /></Wrap>} />
        <Route path="/register" element={<Wrap scope="Register"><LoginPage /></Wrap>} />
        <Route path="/forgot-password" element={<Wrap scope="Forgot Password"><LoginPage /></Wrap>} />
        <Route path="/reset-password" element={<Wrap scope="Reset Password"><LoginPage /></Wrap>} />
        <Route path="/verify-email" element={<Wrap scope="Verify Email"><LoginPage /></Wrap>} />
        <Route path="/change-password" element={<Wrap scope="Change Password"><LoginPage /></Wrap>} />
        <Route path="/mr-robot" element={<Wrap scope="Admin Login"><LoginPage /></Wrap>} />

        {/* Student routes — auth required */}
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<Wrap scope="Dashboard"><StudentOnly><DashboardPage /></StudentOnly></Wrap>} />
          <Route path="/learn" element={<Wrap scope="Learn"><StudentOnly><LearnPage /></StudentOnly></Wrap>} />
          <Route path="/bootcamps" element={<Wrap scope="Bootcamps"><StudentOnly><BootcampPage /></StudentOnly></Wrap>} />
          <Route path="/bootcamps/:bootcampId" element={<Wrap scope="Bootcamp Course"><StudentOnly><BootcampCoursePage /></StudentOnly></Wrap>} />
          {/* Legacy route — moduleId maps to phaseId by number: module 1 = phase1, etc. */}
          <Route path="/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId" element={<Wrap scope="Bootcamp Room"><StudentOnly><BootcampRoomPage /></StudentOnly></Wrap>} />
          <Route path="/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId" element={<Wrap scope="Bootcamp Room"><StudentOnly><BootcampRoomPage /></StudentOnly></Wrap>} />
          <Route path="/marketplace" element={<Wrap scope="Marketplace"><StudentOnly><MarketplacePage /></StudentOnly></Wrap>} />
          <Route path="/wallet" element={<Wrap scope="Wallet"><StudentOnly><WalletPage /></StudentOnly></Wrap>} />
          <Route path="/profile" element={<Wrap scope="Profile"><StudentOnly><ProfilePage /></StudentOnly></Wrap>} />
          <Route path="/notifications" element={<Wrap scope="Notifications"><StudentOnly><NotificationsPage /></StudentOnly></Wrap>} />
          <Route path="/settings" element={<Wrap scope="Settings"><StudentOnly><SettingsPage /></StudentOnly></Wrap>} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminLayout />}>
          <Route path="/mr-robot/dashboard" element={<Wrap scope="Admin Dashboard"><AdminOnly><AdminDashboardPage /></AdminOnly></Wrap>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Wrap><NotFoundPage /></Wrap>} />
      </Routes>
    </AnimatePresence>
  );
};
