/**
 * router.tsx
 *
 * Declares the complete route map for the application and renders the correct
 * page component for the current URL. This is the single source of truth for
 * all client-side routes.
 */

import { Suspense, lazy } from 'react';
import type { ReactNode } from 'react';
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '../core/contexts/AuthContext';
import ErrorBoundary from '../shared/components/ErrorBoundary';
import ConsentBanner from '../shared/components/ConsentBanner';
import ContactModalHost from '@/features/marketing/components/ContactModal';
import ServiceRequestModalHost from '@/features/marketing/components/ServiceRequestModal';
import ToolInstallModalHost from '@/features/marketing/components/ToolInstallModal';

// ─── Layouts (lazy-loaded) ─────────────────────────────────────────────────────


const PublicShell = lazy(() => import('../shared/layouts/PublicShell'));
const AppShell = lazy(() => import('../features/student/layouts/AppShell'));
const AdminLayout = lazy(() => import('../features/admin/layouts/AdminLayout'));

// Shared pages
import NotFoundPage from '../shared/pages/NotFoundPage';

// ─── Lazy page imports ────────────────────────────────────────────────────────
const LandingPage       = lazy(() => import('../features/marketing/pages/LandingPage'));
const TermsPage         = lazy(() => import('../features/marketing/pages/TermsPage'));
const BlogPostPage      = lazy(() => import('../features/marketing/pages/BlogsPage/BlogPostPage'));

// Public marketing pages
const HpbPage           = lazy(() => import('../features/marketing/pages/public/HpbPage'));
const ServicesPage      = lazy(() => import('../features/marketing/pages/public/ServicesPage'));
const BasicPentestPage  = lazy(() => import('../features/marketing/pages/public/services/BasicPentestPage'));
const StandardPentestPage = lazy(() => import('../features/marketing/pages/public/services/StandardPentestPage'));
const EmployeeBootcampPage = lazy(() => import('../features/marketing/pages/public/services/EmployeeBootcampPage'));
const LeaderboardPage   = lazy(() => import('../features/marketing/pages/public/LeaderboardPage'));
const MarketPage        = lazy(() => import('../features/marketing/pages/public/MarketPage'));
const ToolsIndexPage    = lazy(() => import('../features/marketing/pages/public/ToolsIndexPage'));
const LearnPage         = lazy(() => import('../features/marketing/pages/public/LearnPage'));
const AboutPage         = lazy(() => import('../features/marketing/pages/public/AboutPage'));
const AnansiPage        = lazy(() => import('../features/marketing/pages/public/AnansiPage'));
const Toha3eePage       = lazy(() => import('../features/marketing/pages/public/Toha3eePage'));
const JabariPage        = lazy(() => import('../features/marketing/pages/public/JabariPage'));
const AksumPage         = lazy(() => import('../features/marketing/pages/public/AksumPage'));
const ShakaPage         = lazy(() => import('../features/marketing/pages/public/ShakaPage'));
const NzingaPage        = lazy(() => import('../features/marketing/pages/public/NzingaPage'));
const SekhmetPage       = lazy(() => import('../features/marketing/pages/public/SekhmetPage'));
const MansaPage         = lazy(() => import('../features/marketing/pages/public/MansaPage'));
const AmanirenasPage    = lazy(() => import('../features/marketing/pages/public/AmanirenasPage'));
const SundiataPage      = lazy(() => import('../features/marketing/pages/public/SundiataPage'));
const TimbuktuPage      = lazy(() => import('../features/marketing/pages/public/TimbuktuPage'));
const KushPage          = lazy(() => import('../features/marketing/pages/public/KushPage'));
const ImhotepPage       = lazy(() => import('../features/marketing/pages/public/ImhotepPage'));
const BlogsPage         = lazy(() => import('../features/marketing/pages/public/BlogsPage'));
const TeamPage          = lazy(() => import('../features/marketing/pages/public/TeamPage'));
const QuiteRootPage     = lazy(() => import('../features/marketing/pages/public/QuiteRootPage'));
const SimulationsPage   = lazy(() => import('../features/marketing/pages/public/SimulationsPage'));
const SimulationPage    = lazy(() => import('../features/marketing/pages/public/SimulationPage'));
const CyberCoinPage     = lazy(() => import('../features/marketing/pages/public/CyberCoinPage'));
const ContactPage       = lazy(() => import('../features/marketing/pages/public/ContactPage'));

// Auth pages
const LoginPage         = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage      = lazy(() => import('../features/auth/pages/RegisterPage'));
const ChangePasswordPage = lazy(() => import('../features/auth/pages/ChangePasswordPage'));

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
const TerminalToolPage    = lazy(() => import('../features/student/pages/tools/TerminalToolPage'));
const NetworkVizToolPage  = lazy(() => import('../features/student/pages/tools/NetworkVizToolPage'));

// Admin pages
const AdminDashboardPage= lazy(() => import('../features/admin/pages/AdminDashboardPage'));

// ─── Loading fallback ─────────────────────────────────────────────────────────
import PageLoader, { DelayedPageLoader } from '../shared/components/PageLoader';
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
      transition={{ duration: 0.15 }}
    >
      <Suspense fallback={<DelayedPageLoader />}>
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

/**
 * StudentShellGate — gates the student AppShell chrome itself.
 *
 * Previously the dashboard shell (topbar/sidebar/bottom-nav, plus several
 * overlay hosts) mounted unconditionally because the route guard only wrapped
 * the leaf page content nested inside an already-mounted layout. That caused a
 * flash of the dashboard chrome for unauthenticated visitors navigating straight
 * to a /dashboard/* route — the guards redirected, but not before the shell
 * rendered a frame.
 *
 * By gating at the layout-element level we guarantee the dashboard chrome is
 * never mounted, not even for a single frame, unless the observer has a valid
 * authenticated user. While the auth session is still being restored the
 * full-screen boot PageLoader covers the whole viewport instead.
 */
const StudentShellGate = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.isAdmin) return <Navigate to={ADMIN_PATH} replace />;
  return <>{children}</>;
};

// Legacy /courses/:courseId links stay inside the student dashboard.
const LegacyCourseRedirect = () => {
  const { courseId } = useParams();
  return <Navigate to={`/dashboard/courses/${courseId ?? ''}`} replace />;
};

// ─── Router ───────────────────────────────────────────────────────────────────
export const AppRouter = () => {
  const location = useLocation();

  return (
    <div className="min-h-dvh flex flex-col relative">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

        {/* ── Public marketing routes ─────────────────── */}
        <Route
          element={
            <PublicShell
              overlayHosts={
                <>
                  <ContactModalHost />
                  <ServiceRequestModalHost />
                  <ToolInstallModalHost />
                  <ConsentBanner />
                </>
              }
            />
          }
        >
          <Route path="/" element={<Wrap scope="Landing"><LandingPage /></Wrap>} />
          <Route path="/terms" element={<Wrap scope="Terms of Service"><TermsPage /></Wrap>} />
          
          {/* Public marketing pages (formerly redirects to landing sections) */}
          <Route path="/hpb" element={<Wrap scope="HPB"><HpbPage /></Wrap>} />
          <Route path="/learn" element={<Wrap scope="Learn"><LearnPage /></Wrap>} />
          <Route path="/services" element={<Wrap scope="Services"><ServicesPage /></Wrap>} />
          <Route path="/services/basic-web-application-pentest" element={<Wrap scope="Basic Pentest"><BasicPentestPage /></Wrap>} />
          <Route path="/services/standard-web-application-pentest" element={<Wrap scope="Standard Pentest"><StandardPentestPage /></Wrap>} />
          <Route path="/services/employee-cybersecurity-bootcamp" element={<Wrap scope="Employee Bootcamp"><EmployeeBootcampPage /></Wrap>} />
          <Route path="/leaderboard" element={<Wrap scope="Leaderboard"><LeaderboardPage /></Wrap>} />
          <Route path="/leaderboard/all" element={<Navigate to="/leaderboard" replace />} />
          <Route path="/tools" element={<Wrap scope="Tools"><ToolsIndexPage /></Wrap>} />
          <Route path="/about" element={<Wrap scope="About"><AboutPage /></Wrap>} />
          <Route path="/zero-day-market" element={<Wrap scope="Market"><MarketPage /></Wrap>} />
          <Route path="/blogs" element={<Wrap scope="Blogs"><BlogsPage /></Wrap>} />
          <Route path="/team" element={<Wrap scope="Team"><TeamPage /></Wrap>} />
          <Route path="/quiteroot" element={<Wrap scope="QuiteRoot"><QuiteRootPage /></Wrap>} />
          <Route path="/simulations" element={<Wrap scope="Simulations"><SimulationsPage /></Wrap>} />
          <Route path="/simulations/:slug" element={<Wrap scope="Simulation"><SimulationPage /></Wrap>} />
          <Route path="/cp" element={<Wrap scope="Cyber Coin"><CyberCoinPage /></Wrap>} />
          <Route path="/contact" element={<Wrap scope="Contact"><ContactPage /></Wrap>} />
          
          {/* Legacy slug redirect — "hacker-protocol-book" → "hacker-protocol-bootcamp" */}
          <Route path="/blogs/hacker-protocol-book" element={<Navigate to="/blogs/hacker-protocol-bootcamp" replace />} />

          {/* Blog post route (individual posts still accessible) */}
          <Route path="/blogs/:slug" element={<Wrap scope="Blog"><BlogPostPage /></Wrap>} />

          {/* Public profile route — validates @ prefix inside component */}
          <Route path="/:handle" element={<Wrap scope="Profile"><PublicProfilePage /></Wrap>} />

          {/* Tool documentation routes (read in the public shell) */}
          <Route path="/anansi" element={<Wrap scope="Anansi"><AnansiPage /></Wrap>} />
          <Route path="/toha3ee" element={<Wrap scope="Toha3ee"><Toha3eePage /></Wrap>} />
          <Route path="/jabari" element={<Wrap scope="Jabari"><JabariPage /></Wrap>} />
          <Route path="/aksum" element={<Wrap scope="Aksum"><AksumPage /></Wrap>} />
          <Route path="/shaka" element={<Wrap scope="Shaka"><ShakaPage /></Wrap>} />
          <Route path="/nzinga" element={<Wrap scope="Nzinga"><NzingaPage /></Wrap>} />
          <Route path="/sekhmet" element={<Wrap scope="Sekhmet"><SekhmetPage /></Wrap>} />
          <Route path="/mansa" element={<Wrap scope="Mansa"><MansaPage /></Wrap>} />
          <Route path="/amanirenas" element={<Wrap scope="Amanirenas"><AmanirenasPage /></Wrap>} />
          <Route path="/sundiata" element={<Wrap scope="Sundiata"><SundiataPage /></Wrap>} />
          <Route path="/timbuktu" element={<Wrap scope="Timbuktu"><TimbuktuPage /></Wrap>} />
          <Route path="/kush" element={<Wrap scope="Kush"><KushPage /></Wrap>} />
          <Route path="/imhotep" element={<Wrap scope="Imhotep"><ImhotepPage /></Wrap>} />
        </Route>

        {/* ── Auth routes ───────── */}
        <Route path="/login"           element={<Wrap scope="Login"><LoginPage /></Wrap>} />
        <Route path="/register"        element={<Wrap scope="Register"><RegisterPage /></Wrap>} />
        <Route path="/change-password" element={<Wrap scope="Change Password"><ChangePasswordPage /></Wrap>} />
        <Route path={ADMIN_PATH}        element={<Wrap scope="Admin Login"><LoginPage /></Wrap>} />

        {/* ── Student routes ──────────────── */}
        {/* The AppShell (dashboard chrome) itself is gated through
            StudentShellGate so the topbar/sidebar/bottom-nav never mount
            for guests or while the session is still being restored — no
            dashboard flash for unauthenticated visitors. */}
        <Route element={<StudentShellGate><AppShell /></StudentShellGate>}>
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
          <Route path="/dashboard/settings/:section" element={<Wrap scope="Settings"><StudentOnly><SettingsPage /></StudentOnly></Wrap>} />
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
          <Route path="/courses/:courseId" element={<LegacyCourseRedirect />} />
        </Route>

        {/* ── Tool full-screen pages (no layout chrome) ──────── */}
        <Route path="/dashboard/tools/terminal" element={<Wrap scope="Terminal Tool"><StudentOnly><TerminalToolPage /></StudentOnly></Wrap>} />
        <Route path="/dashboard/tools/network-visualizer" element={<Wrap scope="Network Visualizer Tool"><StudentOnly><NetworkVizToolPage /></StudentOnly></Wrap>} />

        {/* ── Admin routes ───────────────────────────────────────────────── */}
        <Route element={<AdminLayout />}>
          <Route path={`${ADMIN_PATH}/dashboard`} element={<Wrap scope="Admin Dashboard"><AdminOnly><AdminDashboardPage /></AdminOnly></Wrap>} />
        </Route>

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


