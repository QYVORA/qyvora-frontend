import { Link, useLocation, useNavigate, useMatch } from 'react-router-dom';
import {
  LogOut, Loader2,
} from 'lucide-react';
import { IconX } from '@/shared/components/icons';
import AnimatedIcon from '@/shared/components/AnimatedIcon';
import { gsap } from '@/shared/utils/gsapSetup';
import {
  IconDashboard,
  IconBootcamp,
  IconLabs,
  IconMarketplace,
  IconSettings,
  IconNotification,
  IconArrowLeft,
  IconMenu,
  IconTerminal,
  IconCode,
  IconChevronRight,
} from '@/shared/components/icons';
import { BOOTCAMP_CONFIG } from '../../../constants/bootcampConfig';
import { getCourseById } from '../../../data/courses/courseData';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { useToast } from '../../../../../core/contexts/ToastContext';
import Logo from '../../../../../shared/components/brand/Logo';
import CpLogo from '../../../../../shared/components/CpLogo';
import Identicon from '../../../../../shared/components/Identicon';
import { useEffect, useRef, useState } from 'react';
import { useScrollLock } from '../../../../../core/hooks/useScrollLock';
import api from '../../../../../core/services/api';
import { extractCpBalance } from '@/shared/utils/cpBalance';
import MobileNotificationsSheet from './MobileNotificationsSheet';
import MobileMoreSheet from './MobileMoreSheet';
import NotificationsDropdown from './NotificationsDropdown';
import { MOBILE_PRIMARY } from './mobileNav';
import { NotificationItem } from './types';

const NOTIF_PREVIEW_LIMIT = 6;

const DESKTOP_NAV_ITEMS = [
  { label: 'Dashboard', icon: IconDashboard, path: '/dashboard' },
  { label: 'Courses',   icon: IconCode,      path: '/dashboard/courses' },
  { label: 'Bootcamp',  icon: IconBootcamp,  path: '/dashboard/bootcamps' },
  { label: 'Labs',      icon: IconLabs,      path: '/dashboard/labs' },
  { label: 'Market',    icon: IconMarketplace, path: '/dashboard/marketplace' },
  { label: 'Settings',  icon: IconSettings,  path: '/dashboard/settings' },
];

const ALL_NAV_ITEMS = [
  ...DESKTOP_NAV_ITEMS,
  { label: 'Competitive', icon: IconDashboard, path: '/dashboard/competitive' },
  { label: 'Notifications', icon: IconNotification, path: '/dashboard/notifications' },
];

const StudentTopbar = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const roomMatch = useMatch('/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId');
  const roomMatchLegacy = useMatch('/dashboard/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId');
  const courseMatch = useMatch('/dashboard/courses/:courseId');

  const isCoursePage = Boolean(courseMatch);
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
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notificationsPreview, setNotificationsPreview] = useState<NotificationItem[]>([]);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cpBalance, setCpBalance] = useState<number>(user?.cp ?? 0);
  const notifRef = useRef<HTMLDivElement>(null);
  useScrollLock(mobileNavOpen);

  const loadNotificationsSnapshot = async () => {
    setNotifLoading(true);
    try {
      const res = await api.get('/notifications');
      const items = Array.isArray(res.data) ? res.data : [];
      setUnreadCount(items.filter((n: any) => !n.read).length);
      setNotificationsPreview(
        items.slice(0, NOTIF_PREVIEW_LIMIT).map((item: any) => ({
          id: String(item?.id || ''),
          title: String(item?.title || 'Notification'),
          message: String(item?.message || ''),
          read: Boolean(item?.read),
          createdAt: String(item?.createdAt || ''),
        }))
      );
    } catch {
      setNotificationsPreview([]);
    } finally {
      setNotifLoading(false);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.post('/notifications/read-all', {});
      setUnreadCount(0);
      setNotificationsPreview((prev) => prev.map((item) => ({ ...item, read: true })));
      addToast('All notifications marked as read.', 'success');
    } catch {
      addToast('Could not mark notifications as read.', 'error');
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/read`, {});
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotificationsPreview((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: true } : item))
      );
    } catch { /* silent */ }
  };

  useEffect(() => { loadNotificationsSnapshot(); }, [location.pathname]);

  useEffect(() => {
    let mounted = true;
    api.get('/student/overview').then((res) => {
      if (!mounted) return;
      const overview = res.data || null;
      const cp = extractCpBalance(overview?.xpSummary) ?? user?.cp ?? 0;
      setCpBalance(cp);
    }).catch(() => {});
    return () => { mounted = false; };
  }, [user?.uid]);
  useEffect(() => { setMoreOpen(false); setNotifOpen(false); setMobileNavOpen(false); }, [location.pathname]);

  const bellRef = useRef<HTMLSpanElement>(null);
  const prevUnreadRef = useRef(unreadCount);
  useEffect(() => {
    if (unreadCount > prevUnreadRef.current && bellRef.current) {
      gsap.fromTo(bellRef.current,
        { rotation: 0 },
        { rotation: 15, duration: 0.1, yoyo: true, repeat: 5, ease: 'power1.inOut', transformOrigin: '50% 100%' }
      );
    }
    prevUnreadRef.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    if (!notifOpen) return undefined;
    const onPointerDown = (e: MouseEvent) => {
      if (!notifRef.current || notifRef.current.contains(e.target as Node)) return;
      setNotifOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [notifOpen]);

  const handleLogout = async () => {
    await logout();
    addToast('Security session terminated.', 'info');
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
        Skip to main content
      </a>

      <header className="fixed top-0 left-0 w-full z-40 bg-bg border-b border-border">
        {isRoomPage ? (
          isCoursePage ? (
            /* ══ COURSE MODE ══ */
            <div className="max-w-[1600px] mx-auto px-2 md:px-6 h-20 md:h-24 flex flex-col">
              <div className="flex-1 flex items-center gap-1.5 md:gap-3 min-w-0">
                <button
                  onClick={() => navigate('/dashboard/courses')}
                  className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl text-text-muted hover:text-accent transition-colors"
                  aria-label="Back to courses"
                >
                  <IconArrowLeft size={20} />
                </button>
                <button
                  onClick={openSidebar}
                  className="md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-muted hover:text-accent transition-colors"
                  aria-label="Toggle lessons sidebar"
                >
                  <IconMenu size={20} />
                </button>
                <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-text-muted min-w-0 flex-1">
                  <Link to="/dashboard/courses" className="hover:text-accent transition-colors shrink-0">
                    Courses
                  </Link>
                  {courseConfig && (
                    <>
                      <IconChevronRight size={12} className="opacity-40 shrink-0" />
                      <span className="text-text-primary font-black truncate max-w-[200px]">{courseConfig.title}</span>
                    </>
                  )}
                </div>
                <div className="flex sm:hidden flex-col min-w-0 flex-1">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-accent leading-none mb-0.5">Course</span>
                  <span className="text-sm font-black text-text-primary truncate leading-tight">{courseConfig?.title ?? 'Course'}</span>
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
                        Lessons
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('qyvora:open-terminal'))}
                    className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center text-text-muted hover:text-accent transition-colors rounded-xl hover:bg-accent-dim/50"
                    aria-label="Open terminal"
                  >
                    <IconTerminal size={20} />
                  </button>
                  <Link to="/dashboard/profile" className="w-9 h-9 md:w-11 md:h-11 rounded-xl border-2 border-border overflow-hidden flex-none hover:border-accent/60 transition-colors">
                    <Identicon value={user?.uid || user?.username || '?'} size={44} className="w-full h-full" />
                  </Link>
                </div>
              </div>
              {courseMeta && (
                <div className="h-1 bg-bg-elevated">
                  <div className="h-full bg-accent transition-all duration-500" style={{ width: `${courseMeta.progress}%` }} />
                </div>
              )}
            </div>
          ) : (
            /* ══ BOOTCAMP ROOM MODE ══ */
            <div className="max-w-[1600px] mx-auto px-2 md:px-6 h-20 md:h-24 flex items-center gap-1.5 md:gap-3">
              <button
                onClick={() => navigate(`/dashboard/bootcamps/${roomBootcampId}`)}
                className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl text-text-muted hover:text-accent transition-colors"
                aria-label="Back to curriculum"
              >
                <IconArrowLeft size={20} />
              </button>
              <button
                onClick={openSidebar}
                className="md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-muted hover:text-accent transition-colors"
                aria-label="Toggle curriculum sidebar"
              >
                <IconMenu size={16} />
              </button>
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-text-muted min-w-0 flex-1">
                <Link to={`/dashboard/bootcamps/${roomBootcampId}`} className="hover:text-accent transition-colors shrink-0">
                  Curriculum
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
                  {roomConfig?.title ?? 'Room'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('qyvora:open-terminal'))}
                  className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center text-text-muted hover:text-accent transition-colors rounded-xl hover:bg-accent-dim/50"
                  aria-label="Open terminal"
                >
                  <IconTerminal size={20} />
                </button>
                <Link to="/dashboard/profile" className="w-9 h-9 md:w-11 md:h-11 rounded-xl border-2 border-border overflow-hidden flex-none hover:border-accent/60 transition-colors">
                  <Identicon value={user?.uid || user?.username || '?'} size={44} className="w-full h-full" />
                </Link>
              </div>
            </div>
          )

        ) : (
          /* ══ DASHBOARD MODE ══ */
          <div className="max-w-[1600px] mx-auto px-2 md:px-6 h-20 md:h-24 flex items-center gap-2 md:gap-4">

            {/* Logo */}
            <Link to="/dashboard" className="flex-none shrink-0">
              <Logo size="md" />
            </Link>

            {/* Desktop icon tabs — spread across full width */}
            <nav className="hidden lg:flex items-center justify-between flex-1 min-w-0">
              {DESKTOP_NAV_ITEMS.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center gap-1.5 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      active
                        ? 'bg-accent text-bg'
                        : 'text-text-muted hover:text-text-primary hover:bg-accent-dim/50'
                    }`}
                  >
                    {active ? (
                      <AnimatedIcon trigger="mount" duration={0.6}>
                        <item.icon size={26} />
                      </AnimatedIcon>
                    ) : (
                      <AnimatedIcon trigger="hover" duration={0.5}>
                        <item.icon size={26} />
                      </AnimatedIcon>
                    )}
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile: hamburger */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-muted hover:text-accent transition-colors"
              aria-label="Open navigation"
            >
              <IconMenu size={22} />
            </button>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 md:gap-2.5 shrink-0 ml-auto">
              {/* CP Coin badge */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-accent/20 bg-accent/5">
                <CpLogo className="w-5 h-5" />
                <span className="text-xs font-black text-accent">{cpBalance.toLocaleString()}</span>
              </div>
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => { const next = !notifOpen; setNotifOpen(next); if (next) loadNotificationsSnapshot(); }}
                  className="relative p-3 md:p-3.5 flex items-center justify-center text-text-muted hover:text-accent transition-colors rounded-xl hover:bg-accent-dim/50"
                  aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount > 9 ? '9+' : unreadCount} unread)` : ''}`}
                >
                  <span ref={bellRef} className="inline-flex"><IconNotification size={26} /></span>
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 min-w-3.5 h-3.5 px-1 bg-accent text-bg text-[8px] font-black rounded-full flex items-center justify-center leading-none">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                <NotificationsDropdown
                  open={notifOpen}
                  onClose={() => setNotifOpen(false)}
                  unreadCount={unreadCount}
                  notifLoading={notifLoading}
                  notificationsPreview={notificationsPreview}
                  markAllNotificationsRead={markAllNotificationsRead}
                  onMarkRead={markNotificationRead}
                />
              </div>

              <MobileNotificationsSheet
                open={notifOpen}
                onOpenChange={setNotifOpen}
                unreadCount={unreadCount}
                notifLoading={notifLoading}
                notificationsPreview={notificationsPreview}
                markAllNotificationsRead={markAllNotificationsRead}
                onMarkRead={markNotificationRead}
              />

              <button
                onClick={() => window.dispatchEvent(new CustomEvent('qyvora:open-terminal'))}
                className="w-12 h-12 md:w-13 md:h-13 flex items-center justify-center text-text-muted hover:text-accent transition-colors rounded-xl hover:bg-accent-dim/50"
                aria-label="Open terminal"
              >
                <IconTerminal size={26} />
              </button>

              <Link
                to="/dashboard/profile"
                aria-label="Go to profile"
                className="w-11 h-11 md:w-12 md:h-12 rounded-xl border-2 border-border overflow-hidden flex-none hover:border-accent/60 transition-colors"
              >
                <Identicon value={user?.uid || user?.username || '?'} size={48} className="w-full h-full" />
              </Link>

              <button
                onClick={handleLogout}
                className="hidden md:flex p-3 text-text-muted hover:text-red-400 transition-colors rounded-xl hover:bg-red-400/10"
                aria-label="Log out"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile nav overlay ── */}
      {mobileNavOpen && (
        <>
          <div
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 z-[90] bg-black/65 backdrop-blur-sm lg:hidden"
          />
          <div className="fixed inset-y-0 left-0 z-[95] w-[85vw] max-w-[320px] flex flex-col bg-bg border-r border-border lg:hidden overflow-y-auto">
            {/* Header */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-border shrink-0">
              <Link to="/dashboard" onClick={() => setMobileNavOpen(false)}>
                <Logo size="md" />
              </Link>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-2 rounded-xl text-text-muted hover:text-accent hover:bg-accent-dim/50 transition-colors"
                aria-label="Close navigation"
              >
                <IconX size={20} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 pt-4">
              {ALL_NAV_ITEMS.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${
                      active
                        ? 'text-accent bg-accent-dim'
                        : 'text-text-muted hover:text-text-primary hover:bg-accent-dim/50'
                    }`}
                  >
                    <item.icon size={22} className="shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom actions */}
            <div className="px-3 pb-4 border-t border-border pt-3 space-y-2">
              <button
                onClick={() => { handleLogout(); setMobileNavOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-400/20 text-red-400 text-sm font-bold uppercase tracking-widest hover:bg-red-400/10 transition-all"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Mobile bottom nav — hidden on room pages ── */}
      {!isRoomPage && (
        <>
          <nav
            className="fixed bottom-0 left-0 w-full bg-bg-card/95 backdrop-blur-md border-t border-border flex md:hidden z-50"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {MOBILE_PRIMARY.map((item) => {
              const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex-1 flex flex-col items-center justify-center gap-1 py-4 min-h-[68px] active:bg-accent-dim/30 transition-colors"
                  aria-current={active ? 'page' : undefined}
                >
                  <item.icon size={26} className={`transition-colors ${active ? 'text-accent' : 'text-text-muted'}`} />
                  <span className={`text-[11px] font-bold uppercase tracking-wide transition-colors ${active ? 'text-accent' : 'text-text-muted'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}

            <button
              onClick={() => setMoreOpen(true)}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-4 min-h-[68px] active:bg-accent-dim/30 transition-colors relative"
              aria-label="More"
              aria-expanded={moreOpen}
            >
              <IconNotification size={26} className="text-text-muted" />
              <span className="text-[11px] font-bold uppercase tracking-wide text-text-muted">More</span>
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-[calc(50%-14px)] w-4 h-4 bg-accent text-bg text-[9px] font-black rounded-full flex items-center justify-center leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </nav>

          <MobileMoreSheet
            open={moreOpen}
            onOpenChange={setMoreOpen}
            user={user}
            unreadCount={unreadCount}
            handleLogout={handleLogout}
          />
        </>
      )}
    </>
  );
};

export default StudentTopbar;
