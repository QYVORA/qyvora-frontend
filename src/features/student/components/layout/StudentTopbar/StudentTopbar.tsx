import { Link, useLocation, useNavigate, useMatch } from 'react-router-dom';
import {
  Zap, BookOpen, Bell, LogOut, ChevronRight, ArrowLeft, Menu, List, Terminal, Search, Flame, X
} from 'lucide-react';
import { BOOTCAMP_CONFIG } from '../../../constants/bootcampConfig';
import { getCourseById } from '../../../data/courses/courseData';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { useToast } from '../../../../../core/contexts/ToastContext';
import Logo from '../../../../../shared/components/brand/Logo';
import CpLogo from '../../../../../shared/components/CpLogo';
import Identicon from '../../../../../shared/components/Identicon';
import { useEffect, useRef, useState } from 'react';
import api from '../../../../../core/services/api';
import MobileNotificationsSheet from './MobileNotificationsSheet';
import MobileMoreSheet from './MobileMoreSheet';
import NotificationsDropdown from './NotificationsDropdown';
import { MOBILE_PRIMARY } from './mobileNav';
import SearchBar from '../SearchBar';
import { NotificationItem } from './types';

const NOTIF_PREVIEW_LIMIT = 6;

const StudentTopbar = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // ── Bootcamp & Course route detection ─────────────────────────────────────
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

  // ── Shared state ───────────────────────────────────────────────────────────
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notificationsPreview, setNotificationsPreview] = useState<NotificationItem[]>([]);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
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
    } catch {
      // Silently fail — notification still shows but won't disappear
    }
  };

  useEffect(() => { loadNotificationsSnapshot(); }, [location.pathname]);
  useEffect(() => { setMoreOpen(false); setNotifOpen(false); }, [location.pathname]);

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

  return (
    <>
      {/* ── Skip to content ── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-bg focus:rounded-lg focus:text-sm focus:font-bold focus:outline-none"
      >
        Skip to main content
      </a>

      {/* ── Desktop topbar ── */}
      <header className="fixed top-0 left-0 w-full z-40 bg-bg border-b border-border">
        {isRoomPage ? (
          isCoursePage ? (
            /* ══ COURSE MODE ══ */
            <>
              <div className="max-w-[1600px] mx-auto px-2 md:px-6 h-20 md:h-24 flex flex-col">
                <div className="flex-1 flex items-center gap-1.5 md:gap-3 min-w-0">
                  <button
                    onClick={() => navigate('/dashboard/courses')}
                    className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl text-text-muted hover:text-accent transition-colors"
                    aria-label="Back to courses"
                  >
                    <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                  <button
                    onClick={openSidebar}
                    className="md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-muted hover:text-accent transition-colors"
                    aria-label="Toggle lessons sidebar"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                  <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-text-muted min-w-0 flex-1">
                    <Link to="/dashboard/courses" className="hover:text-accent transition-colors shrink-0">
                      Courses
                    </Link>
                    {courseConfig && (
                      <>
                        <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />
                        <span className="text-text-primary font-black truncate max-w-[200px]">{courseConfig.title}</span>
                      </>
                    )}
                  </div>
                  <div className="flex sm:hidden flex-col min-w-0 flex-1">
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-accent leading-none mb-0.5">
                      Course
                    </span>
                    <span className="text-sm font-black text-text-primary truncate leading-tight">
                      {courseConfig?.title ?? 'Course'}
                    </span>
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
          onClick={() => setMobileSearchOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-4 min-h-[68px] active:bg-accent-dim/30 transition-colors"
          aria-label="Search"
        >
          <Search className="w-6 h-6 text-text-muted" />
          <span className="text-[11px] font-bold uppercase tracking-wide text-text-muted">Search</span>
        </button>

                          <button
                              onClick={openSidebar}
                              className="md:hidden flex items-center gap-1 px-2 py-1.5 rounded-lg bg-bg-elevated text-text-muted text-[9px] font-black uppercase tracking-widest border border-border"
                            >
                              <List className="h-3 w-3" /> Lessons
                            </button>
                      </>
                    )}
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('qyvora:open-terminal'))}
                      className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center text-text-muted hover:text-green-400 transition-colors rounded-xl hover:bg-green-400/10"
                      aria-label="Open terminal"
                    >
                      <Terminal className="w-4 h-4 md:w-5 md:h-5" />
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
            </>
          ) : (
            /* ══ BOOTCAMP ROOM MODE ══ */
            <div className="max-w-[1600px] mx-auto px-2 md:px-6 h-20 md:h-24 flex items-center gap-1.5 md:gap-3">

              {/* Back to curriculum */}
              <button
                onClick={() => navigate(`/dashboard/bootcamps/${roomBootcampId}`)}
                className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl text-text-muted hover:text-accent transition-colors"
                aria-label="Back to curriculum"
              >
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
              </button>

              {/* Mobile Sidebar Toggle */}
              <button
                onClick={openSidebar}
                className="md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-muted hover:text-accent transition-colors"
                aria-label="Toggle curriculum sidebar"
              >
                <Menu className="h-4 w-4" />
              </button>

              {/* Breadcrumb — desktop */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-text-muted min-w-0 flex-1">
                <Link to={`/dashboard/bootcamps/${roomBootcampId}`} className="hover:text-accent transition-colors shrink-0">
                  Curriculum
                </Link>
                {roomPhaseConfig && (
                  <>
                    <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />
                    <span className="text-accent shrink-0">{roomPhaseConfig.codename}</span>
                  </>
                )}
                {roomConfig && (
                  <>
                    <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />
                    <span className="text-text-primary font-black truncate">{roomConfig.title}</span>
                  </>
                )}
              </div>

              {/* Mobile: phase + room title */}
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

              {/* Right: terminal + profile */}
              <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('qyvora:open-terminal'))}
                  className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center text-text-muted hover:text-green-400 transition-colors rounded-xl hover:bg-green-400/10"
                  aria-label="Open terminal"
                >
                  <Terminal className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <Link to="/dashboard/profile" className="w-9 h-9 md:w-11 md:h-11 rounded-xl border-2 border-border overflow-hidden flex-none hover:border-accent/60 transition-colors">
                  <Identicon value={user?.uid || user?.username || '?'} size={44} className="w-full h-full" />
                </Link>
              </div>
            </div>
          )

        ) : (
          <div className="max-w-[1600px] mx-auto px-2 md:px-8 h-20 md:h-24 flex items-center justify-end md:justify-between gap-4">

          {/* Left: Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <SearchBar />
          </div>

          {/* Center-right: Stats cluster */}
          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-bg-elevated/40 border border-border/20">
              <div className="flex items-center gap-1.5">
                <CpLogo className="w-4 h-4" />
                <span className="font-mono text-sm font-black text-text-primary">{user?.cp?.toLocaleString() ?? 0}</span>
              </div>
              <span className="w-px h-4 bg-border/30" />
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="font-mono text-sm font-black text-orange-400">0d</span>
              </div>
            </div>
            <Link
              to="/dashboard/bootcamps/bc_1775270338500"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-black uppercase tracking-widest hover:bg-accent/20 transition-colors"
            >
              <Zap className="w-4 h-4" />
              Continue
            </Link>
          </div>

          {/* Right: terminal + notifications + search + profile */}
          <div className="flex items-center gap-1 md:gap-3">

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('qyvora:open-terminal'))}
              className="hidden md:flex p-3 md:p-3.5 items-center justify-center text-text-muted hover:text-green-400 transition-colors rounded-xl hover:bg-green-400/10"
              aria-label="Open terminal"
              title="Open terminal (Ctrl+`)"
            >
              <Terminal className="w-5 h-5" />
            </button>

            <div ref={notifRef} className="relative">
              <button
                onClick={() => { const next = !notifOpen; setNotifOpen(next); if (next) loadNotificationsSnapshot(); }}
                className="relative p-2.5 md:p-3.5 flex items-center justify-center text-text-muted hover:text-accent transition-colors rounded-xl hover:bg-accent-dim/50"
                  aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount > 9 ? '9+' : unreadCount} unread)` : ''}`}
                >
                  <Bell className="w-5 h-5 md:w-6 md:h-6" />
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
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden p-2.5 flex items-center justify-center text-text-muted hover:text-accent transition-colors rounded-xl hover:bg-accent-dim/50"
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              to="/dashboard/profile"
              aria-label="Go to profile"
              className="w-9 h-9 md:w-12 md:h-12 rounded-xl border-2 border-border overflow-hidden flex-none hover:border-accent/60 transition-colors"
            >
              <Identicon value={user?.uid || user?.username || '?'} size={48} className="w-full h-full" />
            </Link>

            <button
              onClick={handleLogout}
              className="hidden md:flex p-3 md:p-3.5 text-text-muted hover:text-red-400 transition-colors rounded-xl hover:bg-red-400/10"
              aria-label="Log out"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
        )}
      </header>

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
              <item.icon className={`w-6 h-6 transition-colors ${active ? 'text-accent' : 'text-text-muted'}`} />
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
          <Zap className="w-6 h-6 text-text-muted" />
          <span className="text-[11px] font-bold uppercase tracking-wide text-text-muted">More</span>
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-[calc(50%-14px)] w-4 h-4 bg-accent text-bg text-[9px] font-black rounded-full flex items-center justify-center leading-none">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </nav>

      {mobileSearchOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileSearchOpen(false)} />
          <div className="absolute top-0 left-0 right-0 bg-bg border-b border-border p-4 pt-6">
            <div className="flex items-center gap-3">
              <SearchBar compact onClose={() => setMobileSearchOpen(false)} />
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="shrink-0 p-2 text-text-muted hover:text-text-primary"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

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
