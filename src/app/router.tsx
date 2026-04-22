import { Suspense, lazy } from 'react';
import type { ReactNode } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '../core/contexts/AuthContext';

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

// Auth pages
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));

// Student pages
const DashboardPage = lazy(() => import('../features/student/pages/DashboardPage'));
const LearnPage = lazy(() => import('../features/student/pages/LearnPage'));
const BootcampPage = lazy(() => import('../features/student/pages/BootcampPage'));
const MarketplacePage = lazy(() => import('../features/student/pages/MarketplacePage'));
const WalletPage = lazy(() => import('../features/student/pages/WalletPage'));
const ProfilePage = lazy(() => import('../features/student/pages/ProfilePage'));
const LeaderboardPage = lazy(() => import('../features/student/pages/LeaderboardPage'));
const RoomsPage = lazy(() => import('../features/student/pages/RoomsPage'));
const NotificationsPage = lazy(() => import('../features/student/pages/NotificationsPage'));
const SettingsPage = lazy(() => import('../features/student/pages/SettingsPage'));
const BootcampCoursePage = lazy(() => import('../features/student/pages/BootcampCoursePage'));
const StudentPaymentsPage = lazy(() => import('../features/student/pages/StudentPaymentsPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('../features/admin/pages/AdminDashboardPage'));

const PageLoader = () => (
  <div className="h-screen w-full bg-bg flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full shadow-[0_0_15px_rgba(136,173,124,0.3)]"
    />
  </div>
);

const Wrap = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
  >
    <Suspense fallback={<PageLoader />}>{children}</Suspense>
  </motion.div>
);

const StudentOnly = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.isAdmin) return <Navigate to="/mr-robot" replace />;
  return <>{children}</>;
};

const AdminOnly = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

export const AppRouter = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Wrap><LandingPage /></Wrap>} />
          <Route path="/contact" element={<Wrap><ContactPage /></Wrap>} />
          <Route path="/services" element={<Wrap><ServicesPage /></Wrap>} />
          <Route path="/leaderboard" element={<Wrap><LeaderboardPage /></Wrap>} />
          <Route path="/zero-day-market" element={<Wrap><MarketplacePage /></Wrap>} />
        </Route>

        {/* Auth routes (no layout) */}
        <Route path="/login" element={<Wrap><LoginPage /></Wrap>} />
        <Route path="/register" element={<Wrap><LoginPage /></Wrap>} />
        <Route path="/forgot-password" element={<Wrap><LoginPage /></Wrap>} />
        <Route path="/reset-password" element={<Wrap><LoginPage /></Wrap>} />
        <Route path="/verify-email" element={<Wrap><LoginPage /></Wrap>} />
        <Route path="/change-password" element={<Wrap><LoginPage /></Wrap>} />

        {/* Student routes */}
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<Wrap><StudentOnly><DashboardPage /></StudentOnly></Wrap>} />
          <Route path="/learn" element={<Wrap><StudentOnly><LearnPage /></StudentOnly></Wrap>} />
          <Route path="/bootcamps" element={<Wrap><StudentOnly><BootcampPage /></StudentOnly></Wrap>} />
          <Route path="/bootcamps/:bootcampId" element={<Wrap><StudentOnly><BootcampCoursePage /></StudentOnly></Wrap>} />
          <Route path="/marketplace" element={<Wrap><StudentOnly><MarketplacePage /></StudentOnly></Wrap>} />
          <Route path="/wallet" element={<Wrap><StudentOnly><WalletPage /></StudentOnly></Wrap>} />
          <Route path="/profile" element={<Wrap><StudentOnly><ProfilePage /></StudentOnly></Wrap>} />
          <Route path="/profile/:username" element={<Wrap><StudentOnly><ProfilePage /></StudentOnly></Wrap>} />
          <Route path="/rooms" element={<Wrap><StudentOnly><RoomsPage /></StudentOnly></Wrap>} />
          <Route path="/notifications" element={<Wrap><StudentOnly><NotificationsPage /></StudentOnly></Wrap>} />
          <Route path="/settings" element={<Wrap><StudentOnly><SettingsPage /></StudentOnly></Wrap>} />
          <Route path="/student-payments" element={<Wrap><StudentOnly><StudentPaymentsPage /></StudentOnly></Wrap>} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminLayout />}>
          <Route path="/mr-robot" element={<Wrap><AdminOnly><AdminDashboardPage /></AdminOnly></Wrap>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Wrap><NotFoundPage /></Wrap>} />
      </Routes>
    </AnimatePresence>
  );
};
