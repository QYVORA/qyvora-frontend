import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Zap, Terminal, ShoppingBag, User, LogOut, Bell, Settings,
  X, BookOpen, Wallet, Sun, Moon, ChevronDown, LayoutDashboard, Trophy,
} from 'lucide-react';
import { useAuth } from '../../../../core/contexts/AuthContext';
import { useToast } from '../../../../core/contexts/ToastContext';
import { useTheme } from '../../../../core/contexts/ThemeContext';
import Logo from '../../../../shared/components/brand/Logo';
import { useEffect, useRef, useState } from 'react';
import api from '../../../../core/services/api';
import { AnimatePresence, motion } from 'motion/react';

// ── Nav dropdown groups ──────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: 'Learn',
    items: [
      { label: 'Dashboard',   icon: LayoutDashboard, path: '/dashboard',   desc: 'Your operator hub' },
      { label: 'Learn',       icon: Terminal,        path: '/learn',        desc: 'Modules & lessons' },
      { label: 'Bootcamp',    icon: BookOpen,        path: '/bootcamps',    desc: 'Phased training programs' },
    ],
  },
  {
    label: 'Operate',
    items: [
      { label: 'Marketplace', icon: ShoppingBag, path: '/marketplace', desc: 'Zero-day market' },
      { label: 'Wallet',      icon: Wallet,      path: '/wallet',      desc: 'CP balance & history' },
      { label: 'Leaderboard', icon: Trophy,      path: '/leaderboard', desc: 'Hall of Shadows' },
    ],
  },
];

// ── Mobile bottom primary tabs ───────────────────────────────────────────────
const MOBILE_PRIMARY = [
  { label: 'Home',     icon: LayoutDashboard, path: '/dashboard'   },
  { label: 'Learn',    icon: Terminal,        path: '/learn'        },
  { label: 'Bootcamp', icon: BookOpen,        path: '/bootcamps'    },
  { label: 'Market',   icon: ShoppingBag,     path: '/marketplace'  },
];

const MOBILE_MORE = [
  { label: 'Wallet',        icon: Wallet,    path: '/wallet'        },
  { label: 'Profile',       icon: User,      path: '/profile'       },
  { label: 'Notifications', icon: Bell,      path: '/notifications' },
  { label: 'Settings',      icon: Settings,  path: '/settings'      },
  { label: 'Leaderboard',   icon: Trophy,    path: '/leaderboard'   },
];

interface NotificationItem {
  id: string; title: string; message: string; read: boolean; createdAt?: string;
}

const NOTIF_PREVIEW_LIMIT = 6;

const StudentTopbar = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notificationsPreview, setNotificationsPreview] = useState<NotificationItem[]>([]);
  const [moreOpen, setMoreOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const sheetRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!moreOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [moreOpen]);

  const handleLogout = async () => {
    await logout();
    addToast('Security session terminated.', 'info');
    navigate('/login');
  };

  return (
    <>
      {/* ── Desktop topbar ── */}
      <header className="fixed top-0 left-0 w-full z-40 bg-bg/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 md:h-24 flex items-center justify-between">

          {/* Left: Logo + dropdown nav */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard"><Logo size="md" /></Link>

            {/* Desktop dropdown nav */}
            <nav className="hidden lg:flex items-center gap-1">
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
                        className={`absolute top-full mt-1 w-64 bg-bg-card border border-border rounded-xl shadow-2xl p-2 z-[80] ${
                          group.label === 'Operate' ? 'right-0' : 'left-0'
                        }`}
                      >
                        {group.items.map((item) => {
                          const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </div>

          {/* Right: notifications + settings + profile */}
          <div className="flex items-center gap-2 md:gap-3">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="hidden md:flex p-3 md:p-3.5 text-text-muted hover:text-accent transition-colors rounded-xl hover:bg-accent-dim/50"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>

            {/* Notifications */}
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

              {/* Desktop dropdown */}
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="hidden md:block absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-bg-card shadow-2xl z-[80] overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <div>
                        <div className="text-xs font-black uppercase tracking-widest text-text-primary">Notifications</div>
                        <div className="text-[10px] text-text-muted">{unreadCount} unread</div>
                      </div>
                      {unreadCount > 0 && (
                        <button onClick={markAllNotificationsRead} className="text-[10px] font-bold text-accent hover:underline whitespace-nowrap">
                          Mark all read
                        </button>
                      )}
                    </div>
                    {notifLoading ? (
                      <div className="p-4 text-xs text-text-muted">Loading...</div>
                    ) : notificationsPreview.length === 0 ? (
                      <div className="p-4 text-xs text-text-muted">No notifications yet.</div>
                    ) : (
                      <div className="max-h-80 overflow-auto divide-y divide-border/50">
                        {notificationsPreview.map((item) => (
                          <div key={item.id} className={`px-4 py-3 ${item.read ? 'opacity-60' : ''}`}>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-text-primary line-clamp-1">{item.title}</span>
                              {!item.read && <span className="w-1.5 h-1.5 rounded-full bg-accent flex-none" />}
                            </div>
                            <p className="text-[11px] text-text-secondary line-clamp-2 mt-0.5">{item.message}</p>
                            <div className="text-[10px] text-text-muted mt-1">
                              {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="px-4 py-3 border-t border-border">
                      <Link to="/notifications" onClick={() => setNotifOpen(false)} className="block w-full text-center text-xs font-bold text-accent hover:underline">
                        View all notifications
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile notification bottom sheet — rendered outside the header via portal logic in AnimatePresence */}
            <AnimatePresence>
              {notifOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    onClick={() => setNotifOpen(false)}
                  />
                  <motion.div
                    initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    className="md:hidden fixed bottom-0 left-0 right-0 z-[70] bg-bg-card border-t border-border rounded-t-2xl max-h-[75svh] flex flex-col"
                    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
                  >
                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-1 flex-none">
                      <div className="w-10 h-1 rounded-full bg-border" />
                    </div>
                    {/* Header */}
                    <div className="px-5 py-3 border-b border-border flex items-center justify-between flex-none">
                      <div>
                        <div className="text-sm font-black uppercase tracking-widest text-text-primary">Notifications</div>
                        <div className="text-[10px] text-text-muted">{unreadCount} unread</div>
                      </div>
                      <div className="flex items-center gap-3">
                        {unreadCount > 0 && (
                          <button onClick={markAllNotificationsRead} className="text-[10px] font-bold text-accent">
                            Mark all read
                          </button>
                        )}
                        <button onClick={() => setNotifOpen(false)} className="p-1.5 text-text-muted hover:text-accent transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {/* List */}
                    <div className="flex-1 overflow-y-auto divide-y divide-border/50">
                      {notifLoading ? (
                        <div className="p-5 text-sm text-text-muted text-center">Loading...</div>
                      ) : notificationsPreview.length === 0 ? (
                        <div className="p-5 text-sm text-text-muted text-center">No notifications yet.</div>
                      ) : (
                        notificationsPreview.map((item) => (
                          <div key={item.id} className={`px-5 py-4 ${item.read ? 'opacity-60' : ''}`}>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-text-primary line-clamp-1">{item.title}</span>
                              {!item.read && <span className="w-2 h-2 rounded-full bg-accent flex-none" />}
                            </div>
                            <p className="text-xs text-text-secondary line-clamp-2 mt-1">{item.message}</p>
                            <div className="text-[10px] text-text-muted mt-1">
                              {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {/* Footer */}
                    <div className="px-5 py-4 border-t border-border flex-none">
                      <Link
                        to="/notifications"
                        onClick={() => setNotifOpen(false)}
                        className="block w-full text-center py-3 rounded-xl border border-accent/30 text-sm font-bold text-accent hover:bg-accent-dim transition-colors"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Settings */}
            <Link
              to="/settings"
              className="hidden md:flex p-3 md:p-3.5 text-text-muted hover:text-accent transition-colors rounded-xl hover:bg-accent-dim/50"
              aria-label="Settings"
            >
              <Settings className="w-6 h-6" />
            </Link>

            {/* Profile avatar */}
            <Link
              to="/profile"
              aria-label="Go to profile"
              className="w-11 h-11 md:w-12 md:h-12 rounded-xl border-2 border-border bg-accent-dim flex items-center justify-center text-accent font-black text-base flex-none hover:border-accent/60 transition-colors"
            >
              {user?.username?.substring(0, 2).toUpperCase() || 'OP'}
            </Link>

            {/* Logout — desktop */}
            <button
              onClick={handleLogout}
              className="hidden md:flex p-3 md:p-3.5 text-text-muted hover:text-red-400 transition-colors rounded-xl hover:bg-red-400/10"
              aria-label="Log out"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile bottom nav ── */}
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

        {/* More */}
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

      {/* ── Mobile "More" bottom sheet ── */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              ref={sheetRef}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[70] md:hidden bg-bg-card border-t border-border rounded-t-2xl max-h-[82svh] overflow-y-auto"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border border-border bg-accent-dim flex items-center justify-center text-accent font-black text-sm">
                    {user?.username?.substring(0, 2).toUpperCase() || 'OP'}
                  </div>
                  <div>
                    <div className="text-sm font-black text-text-primary uppercase tracking-widest">{user?.username || 'Operator'}</div>
                    <div className="text-[10px] text-text-muted">{user?.rank || 'Candidate'}</div>
                  </div>
                </div>
                <button onClick={() => setMoreOpen(false)} className="p-2 text-text-muted hover:text-accent transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
                {MOBILE_MORE.map((item) => {
                  const active = location.pathname === item.path;
                  const isNotif = item.path === '/notifications';
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all active:scale-95 ${
                        active ? 'bg-accent-dim border-accent/30 text-accent' : 'bg-bg border-border text-text-muted hover:border-accent/30 hover:text-accent'
                      }`}
                    >
                      <item.icon className="w-6 h-6" />
                      <span className="text-[11px] font-bold uppercase tracking-wide text-center leading-tight">{item.label}</span>
                      {isNotif && unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-4 h-4 bg-accent text-bg text-[9px] font-black rounded-full flex items-center justify-center leading-none">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Bottom actions */}
              <div className="px-4 pb-4 space-y-3">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-border text-text-muted text-sm font-bold uppercase tracking-widest hover:border-accent/40 hover:text-accent transition-all active:scale-95"
                >
                  {theme === 'dark' ? <><Sun className="w-4 h-4" /> Light Mode</> : <><Moon className="w-4 h-4" /> Dark Mode</>}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-red-400/20 text-red-400 text-sm font-bold uppercase tracking-widest hover:bg-red-400/10 transition-all active:scale-95"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default StudentTopbar;
