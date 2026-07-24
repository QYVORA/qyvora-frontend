import { Link, useLocation, useNavigate, useMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  IconTerminal,
  IconLabs,
  IconMarketplace,
  IconArrowLeft,
  IconMenu,
  IconCode,
  IconChevronRight,
} from '@/shared/components/icons';
import ProfileDropdown from './ProfileDropdown';
import MobileProfileSheet from './MobileProfileSheet';
import { BOOTCAMP_CONFIG } from '../../../constants/bootcampConfig';
import { getCourseById } from '../../../data/courses/courseData';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { useToast } from '../../../../../core/contexts/ToastContext';
import Logo from '../../../../../shared/components/brand/Logo';
import CpLogo from '../../../../../shared/components/CpLogo';
import { useEffect, useRef, useState } from 'react';
import api from '../../../../../core/services/api';
import { extractCpBalance } from '@/shared/utils/cpBalance';
import Identicon from '@/shared/components/Identicon';

const StudentTopbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const DESKTOP_NAV_ITEMS = [
    { label: t('nav.myCourses'), icon: IconCode, path: '/dashboard/courses' },
    { label: t('nav.bootcamp'), icon: IconTerminal, path: '/dashboard/bootcamps' },
    { label: t('nav.labs'), icon: IconLabs, path: '/dashboard/labs' },
    { label: t('nav.marketplace'), icon: IconMarketplace, path: '/dashboard/marketplace' },
  ];

  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const roomMatch = useMatch('/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId');
  const roomMatchLegacy = useMatch('/dashboard/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId');
  const courseMatch = useMatch('/dashboard/courses/:courseId');
  const labMatch = useMatch('/dashboard/labs/:labType');

  const isCoursePage = Boolean(courseMatch);
  const isLabPage = Boolean(labMatch);
  const activeRoomMatch = roomMatch ?? roomMatchLegacy;
  const isRoomPage = Boolean(activeRoomMatch) || isCoursePage;

  const roomBootcampId = activeRoomMatch?.params?.bootcampId ?? '';
  const roomPhaseId = roomMatch?.params?.phaseId
    ?? (roomMatchLegacy?.params?.moduleId ? `phase${roomMatchLegacy.params.moduleId}` : '');
  const roomRoomId = activeRoomMatch?.params?.roomId ?? '';
  const roomPhaseConfig = BOOTCAMP_CONFIG.phases.find((p) => p.id === roomPhaseId);
  const roomConfig = roomPhaseConfig?.rooms.find((r) => r.id === roomRoomId);

  const courseId = courseMatch?.params?.courseId ?? '';
  const courseConfig = getCourseById(courseId);

  interface CourseLessonMeta {
    currentLessonIdx: number;
    totalLessons: number;
    progress: number;
    lesson: { hasTerminal?: boolean; hasCodePlayground?: boolean; quiz?: { length: number } } | null;
  }
  const [courseMeta, setCourseMeta] = useState<CourseLessonMeta | null>(null);

  useEffect(() => {
    const handler = (e: CustomEvent<CourseLessonMeta>) => { setCourseMeta(e.detail); };
    window.addEventListener('course:updateMeta', handler as EventListener);
    return () => window.removeEventListener('course:updateMeta', handler as EventListener);
  }, []);

  const openSidebar = () => window.dispatchEvent(new CustomEvent(isCoursePage ? 'course:openSidebar' : 'bootcamp:openSidebar'));
  const [unreadCount, setUnreadCount] = useState(0);
  const [cpBalance, setCpBalance] = useState<number>(user?.cp ?? 0);
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const lastNotifFetchRef = useRef<number>(0);
  const NOTIF_THROTTLE_MS = 30000;

  const loadNotificationsSnapshot = async () => {
    try {
      const res = await api.get('/notifications');
      const items = Array.isArray(res.data) ? res.data : [];
      setUnreadCount(items.filter((n: any) => !n.read).length);
    } catch {
      /* silent */
    }
  };

  useEffect(() => {
    const now = Date.now();
    if (now - lastNotifFetchRef.current < NOTIF_THROTTLE_MS) return;
    lastNotifFetchRef.current = now;
    loadNotificationsSnapshot();
  }, [location.pathname]);

  useEffect(() => {
    setProfileSheetOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let mounted = true;
    api.get('/student/overview').then((res) => {
      if (!mounted) return;
      const overview = res.data || null;
      const cp = extractCpBalance(overview?.xpSummary) ?? user?.cp ?? 0;
      setCpBalance(cp);
    }).catch((err) => { console.warn('[Topbar] overview failed:', err?.response?.status || err?.message); });
    return () => { mounted = false; };
  }, [user?.uid]);

  const handleLogout = async () => {
    await logout();
    addToast(t('toast.sessionTerminated'), 'info');
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-bg focus:rounded-lg focus:text-sm focus:font-bold focus:outline-none"
      >
        {t('aria.skipToContent')}
      </a>

      <header className="fixed top-0 left-0 w-full z-40 bg-bg border-b border-border pt-[env(safe-area-inset-top)]">
        {isRoomPage ? (
          isCoursePage ? (
            /* ══ COURSE MODE ══ */
              <div className="px-4 md:px-6 h-20 md:h-24 flex flex-col">
              <div className="flex-1 flex items-center gap-1.5 md:gap-3 min-w-0">
                <button
                  onClick={() => navigate('/dashboard/courses')}
                  className={`flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl transition-colors text-text-muted hover:text-accent active:scale-95`}
                  aria-label={t('aria.backToCourses')}
                >
                  <IconArrowLeft size={20} />
                </button>
                <button
                  onClick={openSidebar}
                  className={`md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors text-text-muted hover:text-accent active:scale-95`}
                  aria-label={t('aria.toggleLessons')}
                >
                  <IconMenu size={20} />
                </button>
                <div className={`hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest min-w-0 flex-1 text-text-muted`}>
                  <Link to="/dashboard/courses" className={`transition-colors shrink-0 hover:text-accent active:opacity-70`}>
                    {t('student.topbar.breadcrumb.courses')}
                  </Link>
                  {courseConfig && (
                    <>
                      <IconChevronRight size={12} className={`opacity-40 shrink-0 `} />
                      <span className="text-text-primary font-black truncate max-w-[200px]">{courseConfig.title}</span>
                    </>
                  )}
                </div>
                <div className="flex sm:hidden flex-col min-w-0 flex-1">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-accent leading-none mb-0.5">{t('student.topbar.breadcrumb.course')}</span>
                  <span className="text-sm font-black text-text-primary truncate leading-tight">{courseConfig?.title ?? t('student.topbar.breadcrumb.course')}</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 shrink-0 ml-auto">
                  {courseMeta && (
                    <>
                      <span className="text-[10px] font-mono text-text-muted hidden sm:inline">
                        {courseMeta.currentLessonIdx + 1}/{courseMeta.totalLessons}
                      </span>
                      <div className="hidden md:flex items-center gap-1 mr-2">
                        {courseMeta.lesson?.hasTerminal && (
                          <span className="px-1.5 py-0.5 rounded bg-accent/10 text-[8px] font-black uppercase tracking-widest text-accent">TERM</span>
                        )}
                        {courseMeta.lesson?.hasCodePlayground && (
                          <span className="px-1.5 py-0.5 rounded bg-accent/10 text-[8px] font-black uppercase tracking-widest text-accent">CODE</span>
                        )}
                        {courseMeta.lesson?.quiz && courseMeta.lesson.quiz.length > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-accent/10 text-[8px] font-black uppercase tracking-widest text-accent">QUIZ</span>
                        )}
                      </div>
                      <button
                        onClick={openSidebar}
                        className="md:hidden flex items-center gap-1 px-2 py-1.5 rounded-lg bg-bg-elevated text-text-muted text-[9px] font-black uppercase tracking-widest border border-border"
                      >
                        {t('student.topbar.breadcrumb.lessons')}
                      </button>
                    </>
                  )}

                  <ProfileDropdown
                    user={user}
                    unreadCount={unreadCount}
                    onOpenNotifications={() => window.location.href = '/dashboard/notifications'}
                    onOpenTerminal={() => window.dispatchEvent(new CustomEvent('qyvora:open-terminal'))}
                    onOpenIDE={() => window.dispatchEvent(new CustomEvent('qyvora:open-ide'))}
                    onOpenNetworkVisualizer={() => window.dispatchEvent(new CustomEvent('qyvora:open-network-visualizer'))}
                    handleLogout={handleLogout}
                  />
                </div>

                {/* Mobile profile trigger */}
                <button
                  onClick={() => setProfileSheetOpen(true)}
                  className="md:hidden w-9 h-9 flex-none rounded-lg overflow-hidden transition-colors"
                  aria-label="Open profile menu"
                >
                  <Identicon value={user?.username || '?'} size={36} className="w-full h-full border-transparent bg-transparent" />
                </button>

                <MobileProfileSheet
                  open={profileSheetOpen}
                  onOpenChange={setProfileSheetOpen}
                  user={user}
                  unreadCount={unreadCount}
                  onOpenTerminal={() => window.dispatchEvent(new CustomEvent('qyvora:open-terminal'))}
                  onOpenIDE={() => window.dispatchEvent(new CustomEvent('qyvora:open-ide'))}
                  onOpenNetworkVisualizer={() => window.dispatchEvent(new CustomEvent('qyvora:open-network-visualizer'))}
                  handleLogout={handleLogout}
                />
              </div>
              {courseMeta && (
                <div className="h-1 bg-bg-elevated">
                  <div className="h-full bg-accent transition-all duration-500" style={{ width: `${courseMeta.progress}%` }} />
                </div>
              )}
            </div>
          ) : (
            /* ══ BOOTCAMP ROOM MODE ══ */
            <div className="px-4 md:px-6 h-20 md:h-24 flex items-center gap-1.5 md:gap-3">
              <button
                onClick={() => navigate(`/dashboard/bootcamps/${roomBootcampId}`)}
                className={`flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl transition-colors text-text-muted hover:text-accent active:scale-95`}
                aria-label={t('aria.backToCurriculum')}
              >
                <IconArrowLeft size={20} />
              </button>
              <button
                onClick={openSidebar}
                className={`md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors text-text-muted hover:text-accent active:scale-95`}
                aria-label={t('aria.toggleCurriculum')}
              >
                <IconMenu size={16} />
              </button>
              <div className={`hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest min-w-0 flex-1 text-text-muted`}>
                <Link to={`/dashboard/bootcamps/${roomBootcampId}`} className="hover:text-accent active:opacity-70 transition-colors shrink-0">
                  {t('student.topbar.breadcrumb.curriculum')}
                </Link>
                {roomPhaseConfig && (
                  <>
                    <IconChevronRight size={12} className="opacity-40 shrink-0" />
                    <span className="text-accent shrink-0">{roomPhaseConfig.codename}</span>
                  </>
                )}
                {roomConfig && (
                  <>
                    <IconChevronRight size={12} className="opacity-40 shrink-0" />
                    <span className="text-text-primary font-black truncate">{roomConfig.title}</span>
                  </>
                )}
              </div>
              <div className="flex sm:hidden flex-col min-w-0 flex-1">
                {roomPhaseConfig && (
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-accent leading-none mb-0.5">
                    {roomPhaseConfig.codename}
                  </span>
                )}
                <span className="text-sm font-black text-text-primary truncate leading-tight">
                  {roomConfig?.title ?? t('student.topbar.breadcrumb.room')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                <ProfileDropdown
                  user={user}
                  unreadCount={unreadCount}
                  onOpenNotifications={() => window.location.href = '/dashboard/notifications'}
                  onOpenTerminal={() => window.dispatchEvent(new CustomEvent('qyvora:open-terminal'))}
                  onOpenIDE={() => window.dispatchEvent(new CustomEvent('qyvora:open-ide'))}
                  onOpenNetworkVisualizer={() => window.dispatchEvent(new CustomEvent('qyvora:open-network-visualizer'))}
                  handleLogout={handleLogout}
                />
              </div>

              {/* Mobile profile trigger */}
              <button
                onClick={() => setProfileSheetOpen(true)}
                className="md:hidden w-9 h-9 flex-none rounded-lg overflow-hidden transition-colors"
                aria-label="Open profile menu"
              >
                <Identicon value={user?.username || '?'} size={36} className="w-full h-full border-transparent bg-transparent" />
              </button>

              <MobileProfileSheet
                open={profileSheetOpen}
                onOpenChange={setProfileSheetOpen}
                user={user}
                unreadCount={unreadCount}
                onOpenTerminal={() => window.dispatchEvent(new CustomEvent('qyvora:open-terminal'))}
                onOpenIDE={() => window.dispatchEvent(new CustomEvent('qyvora:open-ide'))}
                onOpenNetworkVisualizer={() => window.dispatchEvent(new CustomEvent('qyvora:open-network-visualizer'))}
                handleLogout={handleLogout}
              />
            </div>
          )
        ) : isLabPage ? (
          /* ══ LAB MODE ══ */
          <div className="px-4 md:px-6 h-20 md:h-24 flex items-center gap-1.5 md:gap-3">
            <button
              onClick={() => navigate('/dashboard/labs')}
              className={`flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl transition-colors text-text-muted hover:text-accent active:scale-95`}
              aria-label={t('aria.backToLabs')}
            >
              <IconArrowLeft size={20} />
            </button>
            <div className={`hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest min-w-0 flex-1 text-text-muted`}>
              <Link to="/dashboard/labs" className="hover:text-accent active:opacity-70 transition-colors shrink-0">
                {t('student.topbar.breadcrumb.labs')}
              </Link>
              <IconChevronRight size={12} className="opacity-40 shrink-0" />
              <span className="text-text-primary font-black truncate">
                {labMatch?.params?.labType?.replace(/-/g, ' ') || 'Lab'}
              </span>
            </div>
            <div className="flex sm:hidden flex-col min-w-0 flex-1">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-accent leading-none mb-0.5">{t('student.topbar.breadcrumb.lab')}</span>
              <span className="text-sm font-black text-text-primary truncate leading-tight">
                {labMatch?.params?.labType?.replace(/-/g, ' ') || t('student.topbar.breadcrumb.lab')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
              <ProfileDropdown
                user={user}
                unreadCount={unreadCount}
                onOpenNotifications={() => window.location.href = '/dashboard/notifications'}
                onOpenTerminal={() => window.dispatchEvent(new CustomEvent('qyvora:open-terminal'))}
                onOpenIDE={() => window.dispatchEvent(new CustomEvent('qyvora:open-ide'))}
                onOpenNetworkVisualizer={() => window.dispatchEvent(new CustomEvent('qyvora:open-network-visualizer'))}
                handleLogout={handleLogout}
              />
            </div>

            {/* Mobile profile trigger */}
            <button
              onClick={() => setProfileSheetOpen(true)}
              className="md:hidden w-9 h-9 flex-none rounded-lg overflow-hidden transition-colors"
              aria-label="Open profile menu"
            >
              <Identicon value={user?.username || '?'} size={36} className="w-full h-full border-transparent bg-transparent" />
            </button>

            <MobileProfileSheet
              open={profileSheetOpen}
              onOpenChange={setProfileSheetOpen}
              user={user}
              unreadCount={unreadCount}
              onOpenTerminal={() => window.dispatchEvent(new CustomEvent('qyvora:open-terminal'))}
              onOpenIDE={() => window.dispatchEvent(new CustomEvent('qyvora:open-ide'))}
              onOpenNetworkVisualizer={() => window.dispatchEvent(new CustomEvent('qyvora:open-network-visualizer'))}
              handleLogout={handleLogout}
            />
          </div>

        ) : (
          /* ══ DASHBOARD MODE ══ */
          <div className=" px-3 md:px-4 lg:px-6 h-20 md:h-24 flex items-center gap-2 md:gap-3">

            {/* Logo */}
            <Link to="/dashboard" className="flex-none shrink-0">
              <Logo size="md" variant="mark" />
            </Link>

            {/* Hamburger — visible on mobile only */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('qyvora:open-main-sidebar'))}
              className={`lg:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ml-auto text-text-muted hover:text-accent`}
              aria-label={t('aria.openNav')}
            >
              <IconMenu size={24} />
            </button>

            {/* Nav tabs — desktop only (lg+), flex-1 pushes right actions to the far right */}
            <nav className="hidden lg:flex items-center justify-start flex-1 min-w-0 gap-1">
              {DESKTOP_NAV_ITEMS.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative flex flex-col items-center gap-1.5 px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-colors shrink-0 text-text-muted hover:text-text-primary active:opacity-70"
                  >
                    <item.icon size={32} />
                    <span>{item.label}</span>
                    {active && (
                      <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-accent" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions — separated from nav by flex-1 spacer */}
            <div className="hidden md:flex items-center gap-1.5 md:gap-2.5 shrink-0">
              {/* CP Coin badge */}
              <div className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-accent/20 bg-accent/5`}>
                <CpLogo className="w-5 h-5" />
                <span className="text-xs font-black text-accent">{cpBalance.toLocaleString()}</span>
              </div>

              <ProfileDropdown
                user={user}
                unreadCount={unreadCount}
                onOpenNotifications={() => window.location.href = '/dashboard/notifications'}
                onOpenTerminal={() => window.dispatchEvent(new CustomEvent('qyvora:open-terminal'))}
                onOpenIDE={() => window.dispatchEvent(new CustomEvent('qyvora:open-ide'))}
                onOpenNetworkVisualizer={() => window.dispatchEvent(new CustomEvent('qyvora:open-network-visualizer'))}
                handleLogout={handleLogout}
              />
            </div>

            {/* Mobile profile trigger */}
            <button
              onClick={() => setProfileSheetOpen(true)}
              className="md:hidden w-9 h-9 md:w-11 md:h-11 flex-none rounded-lg overflow-hidden transition-colors"
              aria-label="Open profile menu"
            >
              <Identicon value={user?.username || '?'} size={44} className="w-full h-full border-transparent bg-transparent" />
            </button>

            <MobileProfileSheet
              open={profileSheetOpen}
              onOpenChange={setProfileSheetOpen}
              user={user}
              unreadCount={unreadCount}
              onOpenTerminal={() => window.dispatchEvent(new CustomEvent('qyvora:open-terminal'))}
              onOpenIDE={() => window.dispatchEvent(new CustomEvent('qyvora:open-ide'))}
              onOpenNetworkVisualizer={() => window.dispatchEvent(new CustomEvent('qyvora:open-network-visualizer'))}
              handleLogout={handleLogout}
            />
          </div>
        )}
      </header>


    </>
  );
};

export default StudentTopbar;
