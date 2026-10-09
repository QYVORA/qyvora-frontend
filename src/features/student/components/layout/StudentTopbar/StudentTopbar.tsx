import { Link, useLocation, useMatch } from 'react-router-dom';
import { IconNotification } from '@/shared/components/icons';
import { getCourseById } from '../../../data/courses';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import Logo from '../../../../../shared/components/brand/Logo';
import CpLogo from '../../../../../shared/components/CpLogo';
import Breadcrumb, { type BreadcrumbItem } from '@/shared/components/ui/Breadcrumb';
import { useEffect, useState } from 'react';
import api from '../../../../../core/services/api';
import { extractCpBalance } from '@/shared/utils/cpBalance';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import MobileNotificationsSheet from './MobileNotificationsSheet';
import NotificationsDialog from './NotificationsDialog';
import type { NotificationItem } from './types';

// One shell row for every dashboard context (PROMPT §14: height, typography,
// gutters and spacing are shared, so the same product owns every screen).
const BAR = 'h-20 md:h-24';
const GUTTER = 'px-3 md:px-4 lg:px-6';

// Single definition of the mobile CP badge. Every topbar mode renders this one
// component so the `tour-cp-mobile` tour anchor is defined exactly once.
const MobileCpBadge = ({ balance }: { balance: number }) => (
  <div data-tour-id="tour-cp-mobile" className="flex min-h-[44px] items-center gap-2 px-3 rounded-xl bg-surface">
    <CpLogo className="w-4 h-4" />
    <span className="text-xs font-black text-accent">{balance.toLocaleString()}</span>
  </div>
);

/**
 * StudentTopbar — lightweight context bar for the dashboard shell.
 *
 * It is NOT a second navigation surface: the sidebar rail owns primary
 * navigation at `lg+` and StudentBottomNav owns it below `lg`, so this bar only
 * carries (a) the nested-route hierarchy (context crumbs) on learning pages,
 * (b) account utilities (CP balance, notifications), and (c) a course progress
 * hairline. Primary navigation is deliberately absent here.
 */
const StudentTopbar = ({ railCollapsed = false }: { railCollapsed?: boolean }) => {
  const { user } = useAuth();

  const location = useLocation();

  const roomMatch = useMatch('/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId');
  const roomMatchLegacy = useMatch('/dashboard/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId');
  const courseMatch = useMatch('/dashboard/courses/:courseId');
  const labMatch = useMatch('/dashboard/labs/:labType');

  const isCoursePage = Boolean(courseMatch);
  const isLabPage = Boolean(labMatch);
  const activeRoomMatch = roomMatch ?? roomMatchLegacy;
  const isRoomPage = Boolean(activeRoomMatch);
  const isLearningPage = isRoomPage || isCoursePage || isLabPage;

  const roomBootcampId = activeRoomMatch?.params?.bootcampId ?? '';
  const roomPhaseId = roomMatch?.params?.phaseId
    ?? (roomMatchLegacy?.params?.moduleId ? `phase${roomMatchLegacy.params.moduleId}` : '');
  const roomRoomId = activeRoomMatch?.params?.roomId ?? '';

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
  const courseTitle = courseId ? getCourseById(courseId)?.title : undefined;

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
  const [notifDialogOpen, setNotifDialogOpen] = useState(false);
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

  const openNotifications = () => {
    loadNotificationsSnapshot();
    if (typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches) {
      setNotifDialogOpen(true);
    } else {
      setNotifOpen(true);
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

  // One crumb chain for every nested learning route, so the hierarchy reads the
  // same on a course lesson, a bootcamp room and a lab walkthrough.
  // Exit navigation is owned by the sidebar rail; these crumbs are context only.
  let crumbs: BreadcrumbItem[] = [];

  if (isRoomPage) {
    crumbs = [
      ...(roomBreadcrumb?.phaseTitle ? [{ label: roomBreadcrumb.phaseTitle }] : []),
      { label: roomBreadcrumb?.roomTitle ?? 'Room' },
    ];
  } else if (isCoursePage) {
    crumbs = [{ label: courseTitle ?? 'Course' }];
  } else if (isLabPage) {
    crumbs = [{ label: (labMatch?.params?.labType ?? 'Lab').replace(/-/g, ' ') }];
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-on-accent focus:rounded-lg focus:text-sm focus:font-bold focus:outline-none"
      >
        {"Skip to content"}
      </a>

      <header
        className={`chrome-fixed fixed top-0 inset-x-0 z-[100] pt-[env(safe-area-inset-top)] ${
          railCollapsed ? 'lg:left-[76px]' : 'lg:left-[264px]'
        } transition-[left] duration-[var(--dur-base)] ease-[var(--ease-smooth)]`}
      >
        {isLearningPage ? (
          /* ══ LEARNING CONTEXT — back + nested hierarchy + utilities ══ */
          <div className={`flex flex-col ${BAR}`}>
            <div className={`flex flex-1 items-center gap-2 md:gap-3 ${GUTTER}`}>
              <Breadcrumb items={crumbs} className="flex-1" />

              <div className="flex shrink-0 items-center gap-1.5 md:gap-2.5">
                {isCoursePage && courseMeta && (
                  <span className="hidden min-h-[44px] items-center rounded-xl border border-border-subtle bg-surface px-3 font-mono text-xs font-bold text-text-primary sm:flex">
                    {courseMeta.currentLessonIdx + 1}/{courseMeta.totalLessons}
                  </span>
                )}
                <div className="md:hidden">
                  <MobileCpBadge balance={cpBalance} />
                </div>
              </div>
            </div>

            {isCoursePage && courseMeta && (
              <div className="h-1 bg-bg-elevated" aria-hidden="true">
                <div
                  className="h-full bg-accent transition-[width] duration-500"
                  style={{ width: `${courseMeta.progress}%` }}
                />
              </div>
            )}
          </div>
        ) : (
          /* ══ DASHBOARD CONTEXT — identity + account utilities only ══ */
          <div className={`flex items-center gap-2 md:gap-3 ${BAR} ${GUTTER}`}>
            <Link to="/dashboard" className="flex-none shrink-0 lg:hidden" data-tour-id="tour-nav-md">
              <Logo size="md" variant="mark" />
            </Link>

            <div className="hidden flex-1 lg:block" aria-hidden="true" />

            <div className="ml-auto flex shrink-0 items-center gap-1.5 md:gap-2.5">
              <div
                className="hidden items-center gap-2 rounded-xl bg-surface px-3 py-2 md:flex"
                data-tour-id="tour-cp-desktop"
              >
                <CpLogo className="w-5 h-5" />
                <span className="text-xs font-black text-accent">{cpBalance.toLocaleString()}</span>
              </div>

              <button
                type="button"
                onClick={openNotifications}
                className="relative flex min-h-12 min-w-12 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-surface-raised hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
              >
                <IconNotification size={22} />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-xs font-black leading-none text-on-accent">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <div className="md:hidden">
                <MobileCpBadge balance={cpBalance} />
              </div>
            </div>
          </div>
        )}
      </header>

      <NotificationsDialog
        open={notifDialogOpen}
        onOpenChange={setNotifDialogOpen}
        unreadCount={unreadCount}
        notifLoading={notifLoading}
        notificationsPreview={notificationsPreview}
        markAllNotificationsRead={markAllNotificationsRead}
        onMarkRead={markNotificationRead}
      />

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
