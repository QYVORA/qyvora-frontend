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

// ─── Layouts (lazy-loaded) ─────────────────────────────────────────────────────


const LandingLayout = lazy(() => import('../shared/layouts/LandingLayout'));
const StudentLayout = lazy(() => import('../features/student/layouts/StudentLayout'));
const AdminLayout = lazy(() => import('../features/admin/layouts/AdminLayout'));

// Shared pages
import NotFoundPage from '../shared/pages/NotFoundPage';

// ─── Lazy page imports ────────────────────────────────────────────────────────
const LandingPage       = lazy(() => import('../features/marketing/pages/LandingPage'));
const ServicesPage      = lazy(() => import('../features/marketing/pages/ServicesPage'));
const TermsPage         = lazy(() => import('../features/marketing/pages/TermsPage'));
const AnansiPage        = lazy(() => import('../features/marketing/pages/AnansiPage'));
const LearnPage         = lazy(() => import('../features/marketing/pages/LearnPage'));
const LeaderboardPage   = lazy(() => import('../features/marketing/pages/LeaderboardPage'));
const LeaderboardAllPage = lazy(() => import('../features/marketing/pages/LeaderboardAllPage'));
const BlogPostPage      = lazy(() => import('../features/marketing/pages/BlogsPage/BlogPostPage'));

// Auth pages
const LoginPage         = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage      = lazy(() => import('../features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'));
const VerifyEmailPage    = lazy(() => import('../features/auth/pages/VerifyEmailPage'));
const ChangePasswordPage = lazy(() => import('../features/auth/pages/ChangePasswordPage'));

// Courses pages
const CourseInfoPage    = lazy(() => import('../features/marketing/pages/CourseInfoPage'));

// Student pages
const DashboardPage     = lazy(() => import('../features/student/pages/DashboardPage'));
const MarketplacePage   = lazy(() => import('../features/student/pages/MarketplacePage'));

const ProfilePage       = lazy(() => import('../features/student/pages/ProfilePage'));
const PublicProfilePage = lazy(() => import('../features/marketing/pages/PublicProfilePage'));
const NotificationsPage = lazy(() => import('../features/student/pages/NotificationsPage'));
const SettingsPage      = lazy(() => import('../features/student/pages/SettingsPage'));
const BootcampCoursePage= lazy(() => import('../features/student/pages/BootcampCoursePage'));
const BootcampRoomPage  = lazy(() => import('../features/student/pages/BootcampRoomPage'));
const MyCoursesPage     = lazy(() => import('../features/student/pages/MyCoursesPage'));
const CourseLessonPage  = lazy(() => import('../features/student/pages/CourseLessonPage'));
const CompetitivePage   = lazy(() => import('../features/student/pages/CompetitivePage'));
const NetworksPage      = lazy(() => import('../features/student/pages/NetworksPage'));

// Lab pages
const LabsPage          = lazy(() => import('../features/student/pages/labs/LabsPage'));
const PrivescLab        = lazy(() => import('../features/student/pages/labs/PrivescLab'));
const PasswordLab       = lazy(() => import('../features/student/pages/labs/PasswordLab'));
const SqlInjectionLab   = lazy(() => import('../features/student/pages/labs/SqlInjectionLab'));
const OsintLab          = lazy(() => import('../features/student/pages/labs/OsintLab'));
const KillChainLab      = lazy(() => import('../features/student/pages/labs/KillChainLab'));

// Tool full-screen pages
const IdeToolPage         = lazy(() => import('../features/student/pages/tools/IdeToolPage'));
const TerminalToolPage    = lazy(() => import('../features/student/pages/tools/TerminalToolPage'));
const NetworkVizToolPage  = lazy(() => import('../features/student/pages/tools/NetworkVizToolPage'));

// Admin pages
const AdminDashboardPage= lazy(() => import('../features/admin/pages/AdminDashboardPage'));

// ─── Loading fallback ─────────────────────────────────────────────────────────
import PageLoader from '../shared/components/PageLoader';
import CommunityPopup from '../shared/components/CommunityPopup';

import ADMIN_PATH from '@/shared/utils/adminPath';

// ─── Route wrapper ────────────────────────────────────────────────────────────
const Wrap = ({ children, scope }: { children: ReactNode; scope?: string }) => (
  <ErrorBoundary scope={scope}>
    <motion.div
      className="w-full flex-1 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </motion.div>
  </ErrorBoundary>
);

// ─── Route guards ─────────────────────────────────────────────────────────────
const StudentOnly = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.isAdmin) return <Navigate to={`${ADMIN_PATH}/dashboard`} replace />;
  return <>{children}</>;
};

const AdminOnly = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to={ADMIN_PATH} replace />;
  if (!user.isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

// ─── Router ───────────────────────────────────────────────────────────────────
export const AppRouter = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

        {/* ── Public marketing routes ─────────────────── */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<Wrap scope="Landing"><LandingPage /></Wrap>} />
          <Route path="/terms" element={<Wrap scope="Terms of Service"><TermsPage /></Wrap>} />
          <Route path="/anansi" element={<Wrap scope="Anansi CLI"><AnansiPage /></Wrap>} />
          <Route path="/services" element={<Wrap scope="Services"><ServicesPage /></Wrap>} />
          <Route path="/hpb" element={<Wrap scope="HPB"><LearnPage /></Wrap>} />
          <Route path="/learn" element={<Navigate to="/hpb" replace />} />
          <Route path="/leaderboard" element={<Wrap scope="Leaderboard"><LeaderboardPage /></Wrap>} />
          <Route path="/leaderboard/all" element={<Wrap scope="Leaderboard"><LeaderboardAllPage /></Wrap>} />
          <Route path="/courses" element={<Navigate to="/#courses" replace />} />
          <Route path="/courses/:courseId" element={<Wrap scope="Course"><CourseInfoPage /></Wrap>} />
          
          {/* Redirects for merged pages */}
          <Route path="/team" element={<Navigate to="/#team" replace />} />
          <Route path="/quiteroot" element={<Navigate to="/#quiteroot" replace />} />
          <Route path="/blogs" element={<Navigate to="/#blogs" replace />} />
          <Route path="/zero-day-market" element={<Navigate to="/#market" replace />} />
          
          {/* Blog post route (individual posts still accessible) */}
          <Route path="/blogs/:slug" element={<Wrap scope="Blog"><BlogPostPage /></Wrap>} />
        </Route>

        {/* ── Auth routes ───────── */}
        <Route path="/login"           element={<Wrap scope="Login"><LoginPage /></Wrap>} />
        <Route path="/register"        element={<Wrap scope="Register"><RegisterPage /></Wrap>} />
        <Route path="/forgot-password" element={<Wrap scope="Forgot Password"><ForgotPasswordPage /></Wrap>} />
        <Route path="/reset-password"  element={<Wrap scope="Reset Password"><ForgotPasswordPage /></Wrap>} />
        <Route path="/verify-email"    element={<Wrap scope="Verify Email"><VerifyEmailPage /></Wrap>} />
        <Route path="/change-password" element={<Wrap scope="Change Password"><ChangePasswordPage /></Wrap>} />
        <Route path={ADMIN_PATH}        element={<Wrap scope="Admin Login"><LoginPage /></Wrap>} />

        {/* ── Student routes ──────────────── */}
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<Wrap scope="Dashboard"><StudentOnly><DashboardPage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/bootcamps" element={<Navigate to="/dashboard/bootcamps/bc_1775270338500" replace />} />
          <Route path="/dashboard/bootcamps/:bootcampId" element={<Wrap scope="Bootcamp Course"><StudentOnly><BootcampCoursePage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId" element={<Wrap scope="Bootcamp Room"><StudentOnly><BootcampRoomPage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId"  element={<Wrap scope="Bootcamp Room"><StudentOnly><BootcampRoomPage /></StudentOnly></Wrap>} />

          <Route path="/dashboard/courses" element={<Wrap scope="Courses"><StudentOnly><MyCoursesPage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/courses/:courseId" element={<Wrap scope="Course"><StudentOnly><CourseLessonPage /></StudentOnly></Wrap>} />

          <Route path="/dashboard/marketplace"   element={<Wrap scope="Market"><StudentOnly><MarketplacePage /></StudentOnly></Wrap>} />
          
          <Route path="/dashboard/profile"       element={<Wrap scope="Profile"><StudentOnly><ProfilePage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/profile/:username" element={<Wrap scope="Profile"><StudentOnly><ProfilePage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/notifications" element={<Wrap scope="Notifications"><StudentOnly><NotificationsPage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/settings"      element={<Wrap scope="Settings"><StudentOnly><SettingsPage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/competitive"  element={<Wrap scope="Competitive"><StudentOnly><CompetitivePage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/networks"    element={<Wrap scope="Networks"><StudentOnly><NetworksPage /></StudentOnly></Wrap>} />

          {/* Lab routes */}
          <Route path="/dashboard/labs" element={<Wrap scope="Attack Labs"><StudentOnly><LabsPage /></StudentOnly></Wrap>} />
          <Route path="/dashboard/labs/privesc" element={<Wrap scope="Privesc Lab"><StudentOnly><PrivescLab /></StudentOnly></Wrap>} />
          <Route path="/dashboard/labs/passwords" element={<Wrap scope="Password Lab"><StudentOnly><PasswordLab /></StudentOnly></Wrap>} />
          <Route path="/dashboard/labs/sql-injection" element={<Wrap scope="SQL Injection Lab"><StudentOnly><SqlInjectionLab /></StudentOnly></Wrap>} />
          <Route path="/dashboard/labs/osint" element={<Wrap scope="OSINT Lab"><StudentOnly><OsintLab /></StudentOnly></Wrap>} />
          <Route path="/dashboard/labs/kill-chain" element={<Wrap scope="Kill Chain Lab"><StudentOnly><KillChainLab /></StudentOnly></Wrap>} />

          {/* Legacy redirects */}
          <Route path="/bootcamps"        element={<Navigate to="/dashboard/bootcamps/bc_1775270338500" replace />} />
          <Route path="/marketplace"      element={<Navigate to="/dashboard/marketplace" replace />} />
          <Route path="/profile"          element={<Navigate to="/dashboard/profile" replace />} />
          <Route path="/notifications"    element={<Navigate to="/dashboard/notifications" replace />} />
          <Route path="/settings"         element={<Navigate to="/dashboard/settings" replace />} />
        </Route>

        {/* ── Tool full-screen pages (no layout chrome) ──────── */}
        <Route path="/dashboard/tools/ide" element={<Wrap scope="IDE Tool"><StudentOnly><IdeToolPage /></StudentOnly></Wrap>} />
        <Route path="/dashboard/tools/terminal" element={<Wrap scope="Terminal Tool"><StudentOnly><TerminalToolPage /></StudentOnly></Wrap>} />
        <Route path="/dashboard/tools/network-visualizer" element={<Wrap scope="Network Visualizer Tool"><StudentOnly><NetworkVizToolPage /></StudentOnly></Wrap>} />

        {/* ── Admin routes ───────────────────────────────────────────────── */}
        <Route element={<AdminLayout />}>
          <Route path={`${ADMIN_PATH}/dashboard`} element={<Wrap scope="Admin Dashboard"><AdminOnly><AdminDashboardPage /></AdminOnly></Wrap>} />
        </Route>

        {/* ── Public profile route — validates @ prefix inside component ─────── */}
        <Route path="/:handle" element={<Wrap scope="Profile"><PublicProfilePage /></Wrap>} />
        
        {/* Catch-all 404 for any other invalid routes */}
        <Route path="*" element={<Wrap><NotFoundPage /></Wrap>} />

      </Routes>
    </AnimatePresence>
    <MotionCommunityPopup />
  </div>
  );
};

const MotionCommunityPopup = () => (
  <Suspense fallback={null}>
    <CommunityPopup />
  </Suspense>
);
