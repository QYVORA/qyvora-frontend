import { Link, useLocation, useNavigate, useMatch } from 'react-router-dom';
import {
  IconArrowLeft,
  IconChevronRight,
  IconNotification,
} from '@/shared/components/icons';
import { BookOpen, ShieldCheck, Bug, ShoppingBag } from 'lucide-react';
import { getCourseById } from '../../../data/courses';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import Logo from '../../../../../shared/components/brand/Logo';
import CpLogo from '../../../../../shared/components/CpLogo';
import { useEffect, useState } from 'react';
import api from '../../../../../core/services/api';
import { extractCpBalance } from '@/shared/utils/cpBalance';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import MobileNotificationsSheet from './MobileNotificationsSheet';
import type { NotificationItem } from './types';

// Single definition of the mobile CP badge. Every topbar mode renders this one
// component so the `tour-cp-mobile` tour anchor is defined exactly once.
const MobileCpBadge = ({ balance }: { balance: number }) => (
  <div data-tour-id="tour-cp-mobile" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface">
    <CpLogo className="w-4 h-4" />
    <span className="text-xs font-black text-accent">{balance.toLocaleString()}</span>
  </div>
);

const StudentTopbar = ({ railCollapsed = false }: { railCollapsed?: boolean }) => {
  const { user } = useAuth();

  const DESKTOP_NAV_ITEMS = [
    { label: "My Courses", icon: BookOpen, path: '/dashboard/courses' },
    { label: "Bootcamp", icon: ShieldCheck, path: '/dashboard/bootcamps' },
    { label: "Labs", icon: Bug, path: '/dashboard/labs' },
    { label: "Marketplace", icon: ShoppingBag, path: '/dashboard/marketplace' },
  ];

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

  // The sidebar rail is the single dashboard navigation component on every
  // student page, so the topbar always insets to the content column and never
  // renders on top of the rail.
  const hasRail = true;

  const roomBootcampId = activeRoomMatch?.params?.bootcampId ?? '';
  const roomPhaseId = roomMatch?.params?.phaseId
    ?? (roomMatchLegacy?.params?.moduleId ? `phase${roomMatchLegacy.params.moduleId}` : '');
  const roomRoomId = activeRoomMatch?.params?.roomId ?? '';

  // Student topbars (dashboard, courses, bootcamps, labs, rooms, settings):
  // static and fully transparent — only the buttons on it show. On lg+, the
  // bar spans only the content column so it never covers the sidebar rail.
  const [roomBreadcrumb, setRoomBreadcrumb] = useState<{ phaseTitle?: string; roomTitle?: string } | null>(null);

  useEffect(() => {
    if (!roomBootcampId || !roomPhaseId || !roomRoomId) { setRoomBreadcrumb(null); return; }
    let mounted = true;
    api.get(`/student/course?bootcampId=${encodeURIComponent(roomBootcampId)}`)
      .then((res) => {
        if (!mounted || !res.data?.modules) return;
        const phaseNum = parseInt(roomPhaseId.replace('phase', ''), 10) || 0;
        const roomNum = parseInt(roomRoomId.replace('room', ''), 10) || 0;
        const mod = res.data.modules.find((m: any) => Number(m.moduleId) === phaseNum) || res.data.modules[phaseNum - 1];
        const room = mod?.rooms?.[roomNum - 1];
        setRoomBreadcrumb({ phaseTitle: mod?.title, roomTitle: room?.title });
      })
      .catch(() => { if (mounted) setRoomBreadcrumb(null); });
    return () => { mounted = false; };
  }, [roomBootcampId, roomPhaseId, roomRoomId]);

  const courseId = courseMatch?.params?.courseId ?? '';
  const courseConfig = getCourseById(courseId);

  interface CourseLessonMeta {
    currentLessonIdx: number;
    totalLessons: number;
    progress: number;
  }
  const [courseMeta, setCourseMeta] = useState<CourseLessonMeta | null>(null);

  useEffect(() => {
    const handler = (e: CustomEvent<CourseLessonMeta>) => { setCourseMeta(e.detail); };
    window.addEventListener('course:updateMeta', handler as EventListener);
    return () => window.removeEventListener('course:updateMeta', handler as EventListener);
  }, []);

  const [cpBalance, setCpBalance] = useState<number>(user?.cp ?? 0);

  const { data: overview } = useStudentOverview();

  useEffect(() => {
    if (overview) {
      const cp = extractCpBalance(overview?.xpSummary) ?? user?.cp ?? 0;
      setCpBalance(cp);
    }
  }, [overview, user?.uid]);

  // Notifications — surfaced in the topbar below `lg`. On desktop the sidebar
  // rail owns the notifications link, so the bell is hidden there.
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsPreview, setNotificationsPreview] = useState<NotificationItem[]>([]);

  const loadNotificationsSnapshot = async () => {
    setNotifLoading(true);
    try {
      const res = await api.get('/notifications');
      const items = Array.isArray(res.data) ? res.data : [];
      setUnreadCount(items.filter((n: { read?: boolean }) => !n.read).length);
      setNotificationsPreview(
        items.slice(0, 6).map((item: NotificationItem) => ({
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

  const markNotificationRead = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/read`, {});
      setNotificationsPreview((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      /* ignore */
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.post('/notifications/read-all', {});
      setUnreadCount(0);
      setNotificationsPreview((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    loadNotificationsSnapshot();
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-on-accent focus:rounded-lg focus:text-sm focus:font-bold focus:outline-none"
      >
        {"Skip to content"}
      </a>

      <header
        className={`fixed top-0 inset-x-0 z-[100] pt-[env(safe-area-inset-top)] ${
          railCollapsed ? 'lg:left-[76px] transition-[left] duration-[var(--dur-base)] ease-[var(--ease-smooth)]' : 'lg:left-[264px] transition-[left] duration-[var(--dur-base)] ease-[var(--ease-smooth)]'
        }`}
      >
        {isRoomPage ? (
          isCoursePage ? (
            /* ══ COURSE MODE ══ */
              <div className="px-4 md:px-6 h-20 md:h-24 flex flex-col">
              <div className="flex-1 flex items-center gap-1.5 md:gap-3 min-w-0">
                <button
                  onClick={() => navigate('/dashboard/courses')}
                  className={`flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl transition-colors text-text-secondary hover:text-accent active:scale-95`}
                  aria-label={"Back to courses"}
                >
                  <IconArrowLeft size={20} strokeWidth={2.5} />
                </button>
                <div className={`hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest min-w-0 flex-1 text-text-muted`}>
                  <Link to="/dashboard/courses" className={`transition-colors shrink-0 hover:text-accent active:opacity-70`}>
                    {"Courses"}
                  </Link>
                  {courseConfig && (
                    <>
                      <IconChevronRight size={12} className={`opacity-40 shrink-0 `} />
                      <span className="text-text-primary font-black truncate max-w-[200px]">{courseConfig.title}</span>
                    </>
                  )}
                </div>
                <div className="flex sm:hidden flex-col min-w-0 flex-1">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-accent leading-none mb-0.5">{"Course"}</span>
                  <span className="text-sm font-black text-text-primary truncate leading-tight">{courseConfig?.title ?? "Course"}</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 shrink-0 ml-auto">
                  {courseMeta && (
                    <>
                      <span className="text-xs font-mono text-text-muted hidden sm:inline">
                        {courseMeta.currentLessonIdx + 1}/{courseMeta.totalLessons}
                      </span>
                    </>
                  )}
                </div>

            {/* Mobile CP badge — right-aligned */}
            <div className="md:hidden flex items-center gap-2 ml-auto">
              <MobileCpBadge balance={cpBalance} />
            </div>
              </div>
              {courseMeta && (
                <div className="h-1 bg-bg-elevated">
                  <div className="h-full bg-accent transition-[width] duration-500" style={{ width: `${courseMeta.progress}%` }} />
                </div>
              )}
            </div>
          ) : (
            /* ══ BOOTCAMP ROOM MODE ══ */
            <div className="px-4 md:px-6 h-20 md:h-24 flex items-center gap-1.5 md:gap-3">
              <button
                onClick={() => navigate(`/dashboard/bootcamps/${roomBootcampId}`)}
                className={`flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl transition-colors text-text-secondary hover:text-accent active:scale-95`}
                aria-label={"Back to curriculum"}
              >
                <IconArrowLeft size={20} strokeWidth={2.5} />
              </button>
              <div className={`hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest min-w-0 flex-1 text-text-muted`}>
                <Link to={`/dashboard/bootcamps/${roomBootcampId}`} className="hover:text-accent active:opacity-70 transition-colors shrink-0">
                  {"Curriculum"}
                </Link>
                {roomBreadcrumb?.phaseTitle && (
                  <>
                    <IconChevronRight size={12} className="opacity-40 shrink-0" />
                    <span className="text-accent shrink-0">{roomBreadcrumb.phaseTitle}</span>
                  </>
                )}
                {roomBreadcrumb?.roomTitle && (
                  <>
                    <IconChevronRight size={12} className="opacity-40 shrink-0" />
                    <span className="text-text-primary font-black truncate">{roomBreadcrumb.roomTitle}</span>
                  </>
                )}
              </div>
              <div className="flex sm:hidden flex-col min-w-0 flex-1">
                {roomBreadcrumb?.phaseTitle && (
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-accent leading-none mb-0.5">
                    {roomBreadcrumb.phaseTitle}
                  </span>
                )}
                <span className="text-sm font-black text-text-primary truncate leading-tight">
                  {roomBreadcrumb?.roomTitle ?? "Room"}
                </span>
              </div>

              {/* Mobile CP badge — right-aligned */}
              <div className="md:hidden flex items-center gap-2 ml-auto">
                <MobileCpBadge balance={cpBalance} />
              </div>
            </div>
          )
        ) : isLabPage ? (
          /* ══ LAB MODE ══ */
          <div className="px-4 md:px-6 h-20 md:h-24 flex items-center gap-1.5 md:gap-3">
            <button
              onClick={() => navigate('/dashboard/labs')}
              className={`flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl transition-colors text-text-secondary hover:text-accent active:scale-95`}
              aria-label={"Back to labs"}
            >
              <IconArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <div className={`hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest min-w-0 flex-1 text-text-muted`}>
              <Link to="/dashboard/labs" className="hover:text-accent active:opacity-70 transition-colors shrink-0">
                {"Labs"}
              </Link>
              <IconChevronRight size={12} className="opacity-40 shrink-0" />
              <span className="text-text-primary font-black truncate">
                {labMatch?.params?.labType?.replace(/-/g, ' ') || 'Lab'}
              </span>
            </div>
            <div className="flex sm:hidden flex-col min-w-0 flex-1">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-accent leading-none mb-0.5">{"Lab"}</span>
              <span className="text-sm font-black text-text-primary truncate leading-tight">
                {labMatch?.params?.labType?.replace(/-/g, ' ') || "Lab"}
              </span>
            </div>

            {/* Mobile CP badge — right-aligned */}
            <div className="md:hidden flex items-center gap-2 ml-auto">
              <MobileCpBadge balance={cpBalance} />
            </div>
            </div>

        ) : (
          /* ══ DASHBOARD MODE ══ */
          <div className=" px-3 md:px-4 lg:px-6 h-20 md:h-24 flex items-center gap-2 md:gap-3">

{/* Logo — tour nav anchor fallback; primary nav lives in the sidebar rail (lg+) or the tabs below */}
            <Link to="/dashboard" className="lg:hidden flex-none shrink-0" data-tour-id="tour-nav-md">
              <Logo size="xl" variant="mark" />
            </Link>

            {/* Nav tabs — md..lg only (lg+ the sidebar rail owns primary nav),
                flex-1 pushes right actions to the far right */}
            <nav className="hidden md:flex lg:hidden items-center justify-start flex-1 min-w-0 gap-1" data-tour-id="tour-nav-desktop">
              {DESKTOP_NAV_ITEMS.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative flex flex-col items-center gap-1.5 px-5 py-2 text-xs font-black uppercase tracking-widest transition-colors shrink-0 text-text-secondary hover:text-text-primary active:opacity-70"
                  >
                    <item.icon size={32} strokeWidth={2.5} />
                    <span>{item.label}</span>
                    {active && (
                      <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-accent" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Spacer — keeps right actions right-aligned on lg+, where the nav tabs are hidden and the sidebar rail owns nav */}
            <div className="hidden lg:block flex-1" aria-hidden="true" />

            {/* Right actions — separated from nav by flex-1 */}
            <div className="flex items-center gap-1.5 md:gap-2.5 shrink-0 ml-auto">
              {/* CP Coin badge — tablet and up */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-surface" data-tour-id="tour-cp-desktop">
                <CpLogo className="w-5 h-5" />
                <span className="text-xs font-black text-accent">{cpBalance.toLocaleString()}</span>
              </div>

              {/* Notifications — below lg (desktop sidebar owns notifications) */}
              <button
                type="button"
                onClick={() => { loadNotificationsSnapshot(); setNotifOpen(true); }}
                className="lg:hidden relative flex min-h-12 min-w-12 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-surface hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
              >
                <IconNotification size={22} />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-xs font-black leading-none text-on-accent">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Mobile CP badge */}
              <div className="md:hidden flex items-center gap-2">
                <MobileCpBadge balance={cpBalance} />
              </div>
            </div>
          </div>
        )}
      </header>

      <MobileNotificationsSheet
        open={notifOpen}
        onOpenChange={setNotifOpen}
        unreadCount={unreadCount}
        notifLoading={notifLoading}
        notificationsPreview={notificationsPreview}
        markAllNotificationsRead={markAllNotificationsRead}
        onMarkRead={markNotificationRead}
      />
    </>
  );
};

export default StudentTopbar;
