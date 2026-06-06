import { Link, useLocation, useNavigate, useMatch } from 'react-router-dom';
import {
  Zap, BookOpen, Bell, LogOut, ChevronDown, ChevronRight, ArrowLeft, ClipboardList
} from 'lucide-react';
import { BOOTCAMP_CONFIG } from '../../../constants/bootcampConfig';
import { useAuth } from '../../../../../core/contexts/AuthContext';
import { useToast } from '../../../../../core/contexts/ToastContext';
import Logo from '../../../../../shared/components/brand/Logo';
import { useEffect, useRef, useState } from 'react';
import api from '../../../../../core/services/api';
import { AnimatePresence, motion } from 'motion/react';
import MobileNotificationsSheet from './MobileNotificationsSheet';
import MobileMoreSheet from './MobileMoreSheet';
import NotificationsDropdown from './NotificationsDropdown';
import { NAV_GROUPS } from './navGroups';
import { MOBILE_PRIMARY } from './mobileNav';
import { NotificationItem } from './types';

const NOTIF_PREVIEW_LIMIT = 6;

const StudentTopbar = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // ── Bootcamp room route detection ─────────────────────────────────────────
  const roomMatch = useMatch('/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId');
  const roomMatchLegacy = useMatch('/dashboard/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId');
  const activeRoomMatch = roomMatch ?? roomMatchLegacy;
  const isRoomPage = Boolean(activeRoomMatch);

  const roomBootcampId = activeRoomMatch?.params?.bootcampId ?? '';
  const roomPhaseId = roomMatch?.params?.phaseId
    ?? (roomMatchLegacy?.params?.moduleId ? `phase${roomMatchLegacy.params.moduleId}` : '');
  const roomRoomId = activeRoomMatch?.params?.roomId ?? '';
  const roomPhaseConfig = BOOTCAMP_CONFIG.phases.find((p) => p.id === roomPhaseId);
  const roomConfig = roomPhaseConfig?.rooms.find((r) => r.id === roomRoomId);

  const openQuiz = () => window.dispatchEvent(new CustomEvent('bootcamp:openQuiz'));

  // ── Shared state ───────────────────────────────────────────────────────────
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notificationsPreview, setNotificationsPreview] = useState<NotificationItem[]>([]);
  const [moreOpen, setMoreOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

  useEffect(() => { loadNotificationsSnapshot(); }, [location.pathname]);
  useEffect(() => { setMoreOpen(false); setNotifOpen(false); setActiveDropdown(null); }, [location.pathname]);

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
      {/* ── Desktop topbar ── */}
      <header className="fixed top-0 left-0 w-full z-40 bg-bg border-b border-border">
        {isRoomPage ? (
          /* ══ BOOTCAMP ROOM MODE ══ */
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center gap-3">

            {/* Back to curriculum */}
            <button
              onClick={() => navigate(`/dashboard/bootcamps/${roomBootcampId}`)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-card text-text-muted hover:text-accent hover:border-accent/40 transition-colors"
              aria-label="Back to curriculum"
            >
              <ArrowLeft className="h-5 w-5" />
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

            {/* Right: quiz + notif + profile */}
            <div className="flex items-center gap-2 shrink-0">
              {!roomConfig?.isAssignment && (
                <button
                  onClick={openQuiz}
                  className="flex items-center gap-2 h-11 px-4 rounded-xl border-2 border-accent/40 bg-accent-dim text-accent hover:border-accent/70 hover:bg-accent-dim/70 transition-colors text-sm font-black uppercase tracking-wide"
                >
                  <ClipboardList className="h-4 w-4" />
                  <span className="hidden sm:inline">Quiz</span>
                </button>
              )}

              <div ref={notifRef} className="relative">
                <button
                  onClick={() => { const next = !notifOpen; setNotifOpen(next); if (next) loadNotificationsSnapshot(); }}
                  className="relative p-3 min-h-11 min-w-11 flex items-center justify-center text-text-muted hover:text-accent transition-colors rounded-xl hover:bg-accent-dim/50"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 min-w-4 h-4 px-1 bg-accent text-bg text-[9px] font-black rounded-full flex items-center justify-center leading-none">
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
                />
              </div>

              <MobileNotificationsSheet
                open={notifOpen}
                onOpenChange={setNotifOpen}
                unreadCount={unreadCount}
                notifLoading={notifLoading}
                notificationsPreview={notificationsPreview}
                markAllNotificationsRead={markAllNotificationsRead}
              />

              <Link to="/dashboard/profile" className="w-11 h-11 rounded-xl border-2 border-border bg-accent-dim flex items-center justify-center text-accent font-black text-sm flex-none hover:border-accent/60 transition-colors">
                {user?.username?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || '??'}
              </Link>
            </div>
          </div>

        ) : (
          <div className="max-w-7xl mx-auto px-2 md:px-10 h-20 md:h-24 flex items-center justify-between">

          {/* Left: Logo + dropdown nav */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard"><Logo size="md" /></Link>

            {/* Desktop nav — HPB direct link + Operate dropdown */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                to="/dashboard/bootcamps/bc_1775270338500"
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${
                  location.pathname.startsWith('/dashboard/bootcamps')
                    ? 'text-accent bg-accent-dim'
                    : 'text-text-muted hover:text-text-primary hover:bg-accent-dim/50'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                HPB
              </Link>

              {NAV_GROUPS.map((group) => (
                <div
                  key={group.label}
                  className="relative h-20 md:h-24 flex items-center"
                  onMouseEnter={() => setActiveDropdown(group.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${
                    activeDropdown === group.label ? 'text-accent bg-accent-dim' : 'text-text-muted hover:text-text-primary hover:bg-accent-dim/50'
                  }`}>
                    {group.label}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === group.label ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === group.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute top-full mt-1 w-64 bg-bg-card border border-border rounded-xl shadow-2xl p-2 z-[80]
                          ${group.label === 'Operate' ? 'right-0 left-auto' : 'left-0 right-auto'}
                          max-w-[calc(100vw-2rem)]`}
                      >
                        <div className="space-y-1.5">
                        {group.items.map((item) => {
                          const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              className={`flex items-center gap-3 px-4 py-3.5 rounded-lg border border-transparent transition-colors ${
                                active ? 'bg-accent-dim text-accent' : 'text-text-secondary hover:bg-accent-dim/60 hover:text-text-primary'
                              }`}
                            >
                              <item.icon className="w-5 h-5 flex-none" />
                              <div>
                                <div className="text-sm font-bold">{item.label}</div>
                                <div className="text-[10px] text-text-muted">{item.desc}</div>
                              </div>
                            </Link>
                          );
                        })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </div>

          {/* Right: notifications + profile */}
          <div className="flex items-center gap-2 md:gap-3">

            <div ref={notifRef} className="relative">
              <button
                onClick={() => { const next = !notifOpen; setNotifOpen(next); if (next) loadNotificationsSnapshot(); }}
                className="relative p-3 md:p-3.5 min-h-12 min-w-12 flex items-center justify-center text-text-muted hover:text-accent transition-colors rounded-xl hover:bg-accent-dim/50"
                aria-label="Notifications"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 min-w-4 h-4 px-1 bg-accent text-bg text-[9px] font-black rounded-full flex items-center justify-center leading-none">
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
              />
            </div>

            <MobileNotificationsSheet
              open={notifOpen}
              onOpenChange={setNotifOpen}
              unreadCount={unreadCount}
              notifLoading={notifLoading}
              notificationsPreview={notificationsPreview}
              markAllNotificationsRead={markAllNotificationsRead}
            />

            <Link
              to="/dashboard/profile"
              aria-label="Go to profile"
              className="w-11 h-11 md:w-12 md:h-12 rounded-xl border-2 border-border bg-accent-dim flex items-center justify-center text-accent font-black text-base flex-none hover:border-accent/60 transition-colors"
            >
              {user?.username?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || '??'}
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
