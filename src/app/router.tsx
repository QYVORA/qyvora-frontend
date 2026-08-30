/**
 * router.tsx
 *
 * Declares the complete route map for the application and renders the correct
 * page component for the current URL. This is the single source of truth for
 * all client-side routes.
 */

import { useEffect, useState, Suspense, lazy } from 'react';
import type { ReactNode } from 'react';
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Bot, X } from 'lucide-react';
import { useAuth } from '../core/contexts/AuthContext';
import ErrorBoundary from '../shared/components/ErrorBoundary';
import Dobia from '../shared/components/Dobia';

// ─── Layouts (lazy-loaded) ─────────────────────────────────────────────────────


const LandingLayout = lazy(() => import('../shared/layouts/LandingLayout'));
const ToolDocLayout = lazy(() => import('../shared/layouts/ToolDocLayout'));
const StudentLayout = lazy(() => import('../features/student/layouts/StudentLayout'));
const AdminLayout = lazy(() => import('../features/admin/layouts/AdminLayout'));

// Shared pages
import NotFoundPage from '../shared/pages/NotFoundPage';

// ─── Lazy page imports ────────────────────────────────────────────────────────
const LandingPage       = lazy(() => import('../features/marketing/pages/LandingPage'));
const TermsPage         = lazy(() => import('../features/marketing/pages/TermsPage'));
const BlogPostPage      = lazy(() => import('../features/marketing/pages/BlogsPage/BlogPostPage'));

// Public marketing pages
const CoursesPage       = lazy(() => import('../features/marketing/pages/public/CoursesPage'));
const HpbPage           = lazy(() => import('../features/marketing/pages/public/HpbPage'));
const HpbPhasePage      = lazy(() => import('../features/marketing/pages/public/HpbPhasePage'));
const PublicLabsPage     = lazy(() => import('../features/marketing/pages/public/LabsPage'));
const ServicesPage      = lazy(() => import('../features/marketing/pages/public/ServicesPage'));
const BasicPentestPage  = lazy(() => import('../features/marketing/pages/public/services/BasicPentestPage'));
const StandardPentestPage = lazy(() => import('../features/marketing/pages/public/services/StandardPentestPage'));
const EmployeeBootcampPage = lazy(() => import('../features/marketing/pages/public/services/EmployeeBootcampPage'));
const LeaderboardPage   = lazy(() => import('../features/marketing/pages/public/LeaderboardPage'));
const MarketPage        = lazy(() => import('../features/marketing/pages/public/MarketPage'));
const AnansiPage        = lazy(() => import('../features/marketing/pages/public/AnansiPage'));
const Toha3eePage       = lazy(() => import('../features/marketing/pages/public/Toha3eePage'));
const JabariPage        = lazy(() => import('../features/marketing/pages/public/JabariPage'));
const AksumPage         = lazy(() => import('../features/marketing/pages/public/AksumPage'));
const ShakaPage         = lazy(() => import('../features/marketing/pages/public/ShakaPage'));
const BlogsPage         = lazy(() => import('../features/marketing/pages/public/BlogsPage'));
const TeamPage          = lazy(() => import('../features/marketing/pages/public/TeamPage'));
const QuiteRootPage     = lazy(() => import('../features/marketing/pages/public/QuiteRootPage'));
const SimulationsPage   = lazy(() => import('../features/marketing/pages/public/SimulationsPage'));
const SimulationPage    = lazy(() => import('../features/marketing/pages/public/SimulationPage'));
const CyberCoinPage     = lazy(() => import('../features/marketing/pages/public/CyberCoinPage'));

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
const IdeToolPage         = lazy(() => import('../features/student/pages/tools/IdeToolPage'));
const TerminalToolPage    = lazy(() => import('../features/student/pages/tools/TerminalToolPage'));
const NetworkVizToolPage  = lazy(() => import('../features/student/pages/tools/NetworkVizToolPage'));

// Admin pages
const AdminDashboardPage= lazy(() => import('../features/admin/pages/AdminDashboardPage'));

// ─── Loading fallback ─────────────────────────────────────────────────────────
import PageLoader, { DelayedPageLoader } from '../shared/components/PageLoader';
import CommunityPopup from '../shared/components/CommunityPopup';

import ADMIN_PATH from '@/shared/utils/adminPath';

const DOBIA_TIPS = [
  'Check out the attack labs',
  'Try the bootcamp',
  'Explore courses',
  'Join the leaderboard',
  'Visit Zero Day Market',
];

const MSG_INTERVAL = 8000;

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

// Legacy /courses/:courseId links stay inside the student dashboard.
const LegacyCourseRedirect = () => {
  const { courseId } = useParams();
  return <Navigate to={`/dashboard/courses/${courseId ?? ''}`} replace />;
};

// ─── Router ───────────────────────────────────────────────────────────────────
export const AppRouter = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const [dobiaExpr, setDobiaExpr] = useState<'greeting' | 'confused' | 'alert' | 'waving'>('waving');
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<'confused' | 'alert' | 'greeting' | 'waving'>).detail;
      setDobiaExpr(detail || 'waving');
    };
    window.addEventListener('dobia-expression', handler);
    return () => window.removeEventListener('dobia-expression', handler);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % DOBIA_TIPS.length);
    }, MSG_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const immersiveStudentPaths = [
    '/dashboard/labs/privesc',
    '/dashboard/labs/passwords',
    '/dashboard/labs/sql-injection',
    '/dashboard/labs/osint',
    '/dashboard/labs/kill-chain',
    '/dashboard/networks',
    '/dashboard/courses/',
    '/dashboard/tools',
  ];

  const isBootcampRoom =
    location.pathname.startsWith('/dashboard/bootcamps/') &&
    location.pathname.includes('/rooms/');

  const isToolScreen = location.pathname.startsWith('/dashboard/tools/');
  const isAdminArea =
    location.pathname === ADMIN_PATH ||
    location.pathname.startsWith(`${ADMIN_PATH}/`);
  const isAuthRoute = ['/login', '/register', '/change-password'].includes(location.pathname);

  // Dobia visibility policy:
  // - landing ('/') → hidden until the user summons it
  // - immersive student areas (labs, rooms, courses, networks, tools) → hidden, summonable
  // - every other page → visible by default, dismissible
  // - auth screens, admin area and full-screen tools → never shown, no toggle
  const dobiaBlocked = isAuthRoute || isAdminArea || isToolScreen;
  const dobiaHiddenByDefault =
    location.pathname === '/' ||
    location.pathname === '/dashboard' ||
    immersiveStudentPaths.some((p) => location.pathname.startsWith(p)) ||
    isBootcampRoom;

  const [dobiaOverride, setDobiaOverride] = useState<boolean | null>(null);

  useEffect(() => {
    setDobiaOverride(null);
  }, [location.pathname]);

  const dobiaVisible = !dobiaBlocked && (dobiaOverride ?? !dobiaHiddenByDefault);

  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

        {/* ── Public marketing routes ─────────────────── */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<Wrap scope="Landing"><LandingPage /></Wrap>} />
          <Route path="/terms" element={<Wrap scope="Terms of Service"><TermsPage /></Wrap>} />
          
          {/* Public marketing pages (formerly redirects to landing sections) */}
          <Route path="/courses" element={<Wrap scope="Courses"><CoursesPage /></Wrap>} />
          <Route path="/hpb" element={<Wrap scope="HPB"><HpbPage /></Wrap>} />
          <Route path="/hpb/:phaseId" element={<Wrap scope="HPB Phase"><HpbPhasePage /></Wrap>} />
          <Route path="/learn" element={<Navigate to="/hpb" replace />} />
          <Route path="/labs" element={<Wrap scope="Labs"><PublicLabsPage /></Wrap>} />
          <Route path="/services" element={<Wrap scope="Services"><ServicesPage /></Wrap>} />
          <Route path="/services/basic-web-application-pentest" element={<Wrap scope="Basic Pentest"><BasicPentestPage /></Wrap>} />
          <Route path="/services/standard-web-application-pentest" element={<Wrap scope="Standard Pentest"><StandardPentestPage /></Wrap>} />
          <Route path="/services/employee-cybersecurity-bootcamp" element={<Wrap scope="Employee Bootcamp"><EmployeeBootcampPage /></Wrap>} />
          <Route path="/leaderboard" element={<Wrap scope="Leaderboard"><LeaderboardPage /></Wrap>} />
          <Route path="/leaderboard/all" element={<Navigate to="/leaderboard" replace />} />
          <Route path="/zero-day-market" element={<Wrap scope="Market"><MarketPage /></Wrap>} />
          <Route path="/blogs" element={<Wrap scope="Blogs"><BlogsPage /></Wrap>} />
          <Route path="/team" element={<Wrap scope="Team"><TeamPage /></Wrap>} />
          <Route path="/quiteroot" element={<Wrap scope="QuiteRoot"><QuiteRootPage /></Wrap>} />
          <Route path="/simulations" element={<Wrap scope="Simulations"><SimulationsPage /></Wrap>} />
          <Route path="/simulations/:slug" element={<Wrap scope="Simulation"><SimulationPage /></Wrap>} />
          <Route path="/cp" element={<Wrap scope="Cyber Coin"><CyberCoinPage /></Wrap>} />
          
          {/* Legacy slug redirect — "hacker-protocol-book" → "hacker-protocol-bootcamp" */}
          <Route path="/blogs/hacker-protocol-book" element={<Navigate to="/blogs/hacker-protocol-bootcamp" replace />} />

          {/* Blog post route (individual posts still accessible) */}
          <Route path="/blogs/:slug" element={<Wrap scope="Blog"><BlogPostPage /></Wrap>} />
        </Route>

        {/* ── Tool documentation routes (no public navbar) ────────── */}
        <Route element={<ToolDocLayout />}>
          <Route path="/anansi" element={<Wrap scope="Anansi"><AnansiPage /></Wrap>} />
          <Route path="/toha3ee" element={<Wrap scope="Toha3ee"><Toha3eePage /></Wrap>} />
          <Route path="/jabari" element={<Wrap scope="Jabari"><JabariPage /></Wrap>} />
          <Route path="/aksum" element={<Wrap scope="Aksum"><AksumPage /></Wrap>} />
          <Route path="/shaka" element={<Wrap scope="Shaka"><ShakaPage /></Wrap>} />
        </Route>

        {/* ── Auth routes ───────── */}
        <Route path="/login"           element={<Wrap scope="Login"><LoginPage /></Wrap>} />
        <Route path="/register"        element={<Wrap scope="Register"><RegisterPage /></Wrap>} />
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
    {dobiaVisible && (
      <div className="fixed bottom-[76px] right-4 z-[9999] pointer-events-none flex flex-col items-end overflow-hidden">

        {/* 128px – mobile */}
        <div className="block min-[420px]:hidden" style={{ marginRight: -26 }}>
          <div className="flex flex-col items-end">
            <div key={msgIdx} className="animate-fade-in" style={{ marginRight: 32, marginBottom: -7 }}>
              <span className="block px-2 py-1 rounded-xl bg-bg-card border border-border/50 text-[8px] font-mono text-text-secondary leading-relaxed max-w-[min(120px,45vw)] text-right whitespace-normal break-words">{DOBIA_TIPS[msgIdx]}</span>
              <div className="flex justify-end -mt-px"><div className="w-1.5 h-1.5 rotate-45 bg-bg-card border-r border-b border-border/50 mr-3" /></div>
            </div>
            <div><Dobia expression={dobiaExpr} size={128} /></div>
          </div>
        </div>

        {/* 160px – min-[420px] */}
        <div className="hidden min-[420px]:block sm:hidden" style={{ marginRight: -33 }}>
          <div className="flex flex-col items-end">
            <div key={msgIdx} className="animate-fade-in" style={{ marginRight: 41, marginBottom: -9 }}>
              <span className="block px-2.5 py-1 rounded-xl bg-bg-card border border-border/50 text-[8px] font-mono text-text-secondary leading-relaxed max-w-[min(140px,50vw)] text-right whitespace-normal break-words">{DOBIA_TIPS[msgIdx]}</span>
              <div className="flex justify-end -mt-px"><div className="w-1.5 h-1.5 rotate-45 bg-bg-card border-r border-b border-border/50 mr-3.5" /></div>
            </div>
            <div><Dobia expression={dobiaExpr} size={160} /></div>
          </div>
        </div>

        {/* 192px – sm */}
        <div className="hidden sm:block md:hidden" style={{ marginRight: -40 }}>
          <div className="flex flex-col items-end">
            <div key={msgIdx} className="animate-fade-in" style={{ marginRight: 50, marginBottom: -11 }}>
              <span className="block px-2.5 py-1.5 rounded-xl bg-bg-card border border-border/50 text-[9px] font-mono text-text-secondary leading-relaxed max-w-[min(160px,55vw)] text-right whitespace-normal break-words">{DOBIA_TIPS[msgIdx]}</span>
              <div className="flex justify-end -mt-px"><div className="w-2 h-2 rotate-45 bg-bg-card border-r border-b border-border/50 mr-4" /></div>
            </div>
            <div><Dobia expression={dobiaExpr} size={192} /></div>
          </div>
        </div>

        {/* 256px – md */}
        <div className="hidden md:block lg:hidden" style={{ marginRight: -53 }}>
          <div className="flex flex-col items-end">
            <div key={msgIdx} className="animate-fade-in" style={{ marginRight: 65, marginBottom: -14 }}>
              <span className="block px-3 py-1.5 rounded-xl bg-bg-card border border-border/50 text-[10px] font-mono text-text-secondary leading-relaxed max-w-[min(200px,55vw)] text-right whitespace-normal break-words">{DOBIA_TIPS[msgIdx]}</span>
              <div className="flex justify-end -mt-px"><div className="w-2 h-2 rotate-45 bg-bg-card border-r border-b border-border/50 mr-5" /></div>
            </div>
            <div><Dobia expression={dobiaExpr} size={256} /></div>
          </div>
        </div>

        {/* 320px – lg */}
        <div className="hidden lg:block xl:hidden" style={{ marginRight: -66 }}>
          <div className="flex flex-col items-end">
            <div key={msgIdx} className="animate-fade-in" style={{ marginRight: 82, marginBottom: -18 }}>
              <span className="block px-3 py-1.5 rounded-xl bg-bg-card border border-border/50 text-[10px] font-mono text-text-secondary leading-relaxed max-w-[min(240px,55vw)] text-right whitespace-normal break-words">{DOBIA_TIPS[msgIdx]}</span>
              <div className="flex justify-end -mt-px"><div className="w-2 h-2 rotate-45 bg-bg-card border-r border-b border-border/50 mr-6" /></div>
            </div>
            <div><Dobia expression={dobiaExpr} size={320} /></div>
          </div>
        </div>

        {/* 400px – xl */}
        <div className="hidden xl:block 2xl:hidden" style={{ marginRight: -83 }}>
          <div className="flex flex-col items-end">
            <div key={msgIdx} className="animate-fade-in" style={{ marginRight: 103, marginBottom: -22 }}>
              <span className="block px-4 py-2 rounded-xl bg-bg-card border border-border/50 text-[11px] font-mono text-text-secondary leading-relaxed max-w-[min(280px,55vw)] text-right whitespace-normal break-words">{DOBIA_TIPS[msgIdx]}</span>
              <div className="flex justify-end -mt-px"><div className="w-2.5 h-2.5 rotate-45 bg-bg-card border-r border-b border-border/50 mr-7" /></div>
            </div>
            <div><Dobia expression={dobiaExpr} size={400} /></div>
          </div>
        </div>

        {/* 480px – 2xl+ */}
        <div className="hidden 2xl:block" style={{ marginRight: -99 }}>
          <div className="flex flex-col items-end">
            <div key={msgIdx} className="animate-fade-in" style={{ marginRight: 123, marginBottom: -27 }}>
              <span className="block px-4 py-2 rounded-xl bg-bg-card border border-border/50 text-[12px] font-mono text-text-secondary leading-relaxed max-w-[min(320px,55vw)] text-right whitespace-normal break-words">{DOBIA_TIPS[msgIdx]}</span>
              <div className="flex justify-end -mt-px"><div className="w-2.5 h-2.5 rotate-45 bg-bg-card border-r border-b border-border/50 mr-8" /></div>
            </div>
            <div><Dobia expression={dobiaExpr} size={480} /></div>
          </div>
        </div>

      </div>
    )}
    {!dobiaBlocked && (
      <button
        type="button"
        onClick={() => setDobiaOverride(!dobiaVisible)}
        aria-label={t(dobiaVisible ? 'aria.dobiaDismiss' : 'aria.dobiaSummon')}
        className="fixed bottom-4 right-4 z-[50] w-11 h-11 aspect-square shrink-0 rounded-full border border-border/50 bg-bg-card text-text-secondary hover:text-accent hover:border-accent/40 active:scale-95 flex items-center justify-center transition-[color,border-color,transform] duration-[var(--dur-fast)] ease-[var(--ease-smooth)] shadow-lg"
      >
        {dobiaVisible ? <X size={18} /> : <Bot size={20} />}
      </button>
    )}
  </div>
  );
};

const MotionCommunityPopup = () => (
  <Suspense fallback={null}>
    <CommunityPopup />
  </Suspense>
);


