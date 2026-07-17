import { Link, useLocation, useNavigate, useMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, Globe } from 'lucide-react';
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
import api from '../../../../../core/services/api';
import { extractCpBalance } from '@/shared/utils/cpBalance';
import MobileNotificationsSheet from './MobileNotificationsSheet';
import NotificationsDropdown from './NotificationsDropdown';
import { NotificationItem } from './types';

const NOTIF_PREVIEW_LIMIT = 6;

const StudentTopbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const DESKTOP_NAV_ITEMS = [
    { label: t('nav.dashboard'), icon: IconDashboard, path: '/dashboard' },
    { label: t('nav.myCourses'), icon: IconCode, path: '/dashboard/courses' },
    { label: t('nav.bootcamp'), icon: IconBootcamp, path: '/dashboard/bootcamps' },
    { label: t('nav.labs'), icon: IconLabs, path: '/dashboard/labs' },
    { label: t('nav.networkLab'), icon: Globe, path: '/dashboard/networks' },
    { label: t('nav.marketplace'), icon: IconMarketplace, path: '/dashboard/marketplace' },
    { label: t('nav.settings'), icon: IconSettings, path: '/dashboard/settings' },
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
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notificationsPreview, setNotificationsPreview] = useState<NotificationItem[]>([]);
  const [cpBalance, setCpBalance] = useState<number>(user?.cp ?? 0);
  const notifRef = useRef<HTMLDivElement>(null);

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
  useEffect(() => { setNotifOpen(false); }, [location.pathname]);

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
              <div className="px-4 md:px-6 h-20 md:h-24 flex flex-col">
              <div className="flex-1 flex items-center gap-1.5 md:gap-3 min-w-0">
                <button
                  onClick={() => navigate('/dashboard/courses')}
                  className={`flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl transition-colors text-text-muted hover:text-accent`}
                  aria-label="Back to courses"
                >
                  <IconArrowLeft size={20} />
                </button>
                <button
                  onClick={openSidebar}
                  className={`md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors text-text-muted hover:text-accent`}
                  aria-label="Toggle lessons sidebar"
                >
                  <IconMenu size={20} />
                </button>
                <div className={`hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest min-w-0 flex-1 text-text-muted`}>
                  <Link to="/dashboard/courses" className={`transition-colors shrink-0 hover:text-accent`}>
                    Courses
                  </Link>
                  {courseConfig && (
                    <>
                      <IconChevronRight size={12} className={`opacity-40 shrink-0 `} />
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
            <div className="px-4 md:px-6 h-20 md:h-24 flex items-center gap-1.5 md:gap-3">
              <button
                onClick={() => navigate(`/dashboard/bootcamps/${roomBootcampId}`)}
                className={`flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl transition-colors text-text-muted hover:text-accent`}
                aria-label="Back to curriculum"
              >
                <IconArrowLeft size={20} />
              </button>
              <button
                onClick={openSidebar}
                className={`md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors text-text-muted hover:text-accent`}
                aria-label="Toggle curriculum sidebar"
              >
                <IconMenu size={16} />
              </button>
              <div className={`hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest min-w-0 flex-1 text-text-muted`}>
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
                  className={`w-9 h-9 md:w-11 md:h-11 flex items-center justify-center transition-colors rounded-xl text-text-muted hover:text-accent hover:bg-accent-dim/50`}
                  aria-label="Open terminal"
                >
                  <IconTerminal size={20} />
                </button>
                <Link to="/dashboard/profile" className={`w-9 h-9 md:w-11 md:h-11 rounded-xl border-2 overflow-hidden flex-none transition-colors border-border hover:border-accent/60`}>
                  <Identicon value={user?.uid || user?.username || '?'} size={44} className="w-full h-full" />
                </Link>
              </div>
            </div>
          )
        ) : isLabPage ? (
          /* ══ LAB MODE ══ */
          <div className="px-4 md:px-6 h-20 md:h-24 flex items-center gap-1.5 md:gap-3">
            <button
              onClick={() => navigate('/dashboard/labs')}
              className={`flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl transition-colors text-text-muted hover:text-accent`}
              aria-label="Back to labs"
            >
              <IconArrowLeft size={20} />
            </button>
            <div className={`hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest min-w-0 flex-1 text-text-muted`}>
              <Link to="/dashboard/labs" className="hover:text-accent transition-colors shrink-0">
                Labs
              </Link>
              <IconChevronRight size={12} className="opacity-40 shrink-0" />
              <span className="text-text-primary font-black truncate">
                {labMatch?.params?.labType?.replace(/-/g, ' ') || 'Lab'}
              </span>
            </div>
            <div className="flex sm:hidden flex-col min-w-0 flex-1">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-accent leading-none mb-0.5">Lab</span>
              <span className="text-sm font-black text-text-primary truncate leading-tight">
                {labMatch?.params?.labType?.replace(/-/g, ' ') || 'Lab'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('qyvora:open-terminal'))}
                className={`w-9 h-9 md:w-11 md:h-11 flex items-center justify-center transition-colors rounded-xl text-text-muted hover:text-accent hover:bg-accent-dim/50`}
                aria-label="Open terminal"
              >
                <IconTerminal size={20} />
              </button>
              <Link to="/dashboard/profile" className={`w-9 h-9 md:w-11 md:h-11 rounded-xl border-2 overflow-hidden flex-none transition-colors border-border hover:border-accent/60`}>
                <Identicon value={user?.uid || user?.username || '?'} size={44} className="w-full h-full" />
              </Link>
            </div>
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
              aria-label="Open navigation"
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
                    className="relative flex flex-col items-center gap-1.5 px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-colors shrink-0 text-text-muted hover:text-text-primary"
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
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => { const next = !notifOpen; setNotifOpen(next); if (next) loadNotificationsSnapshot(); }}
                  className={`relative p-3 md:p-3.5 flex items-center justify-center transition-colors rounded-xl text-text-muted hover:text-accent hover:bg-accent-dim/50`}
                  aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount > 9 ? '9+' : unreadCount} unread)` : ''}`}
                >
                  <span className="inline-flex"><IconNotification size={28} /></span>
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
                className={`w-12 h-12 md:w-13 md:h-13 flex items-center justify-center transition-colors rounded-xl text-text-muted hover:text-accent hover:bg-accent-dim/50`}
                aria-label="Open terminal"
              >
                <IconTerminal size={28} />
              </button>

              <Link
                to="/dashboard/profile"
                aria-label="Go to profile"
                className={`w-11 h-11 md:w-12 md:h-12 rounded-xl border-2 overflow-hidden flex-none transition-colors border-border hover:border-accent/60`}
              >
                <Identicon value={user?.uid || user?.username || '?'} size={48} className="w-full h-full" />
              </Link>

              <button
                onClick={handleLogout}
                className={`hidden md:flex p-3 transition-colors rounded-xl text-text-muted hover:text-red-400 hover:bg-red-400/10`}
                aria-label={t('button.logOut')}
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </header>


    </>
  );
};

export default StudentTopbar;
