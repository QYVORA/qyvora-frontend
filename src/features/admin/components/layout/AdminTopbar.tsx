import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LogOut, Bell, Shield, Users, Database, Coins,
  AlertTriangle, Mail, BookOpen, X, ChevronDown, Link2,
  LayoutDashboard, FileText,
} from 'lucide-react';
import { useAuth } from '../../../../core/contexts/AuthContext';
import { useToast } from '../../../../core/contexts/ToastContext';
import Logo from '../../../../shared/components/brand/Logo';
import { useEffect, useRef, useState } from 'react';
import api from '../../../../core/services/api';
import { AnimatePresence, motion } from 'motion/react';
import { BottomSheet, BottomSheetClose, BottomSheetContent } from '../../../../shared/components/ui/BottomSheet';
import { useScrollLock } from '../../../../core/hooks/useScrollLock';


const _0x5a2b = atob('L21yLXJvYm90');

// ── Nav groups ────────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: 'Manage',
    items: [
      { label: 'Users',        icon: Users,         path: `${_0x5a2b}/dashboard?tab=users`,        desc: 'Manage operators'       },
      { label: 'Bootcamps',    icon: Shield,        path: `${_0x5a2b}/dashboard?tab=bootcamps`,    desc: 'Phase control'          },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Market',   icon: Database,      path: `${_0x5a2b}/dashboard?tab=zero_day`, desc: 'Zero-day vault'         },
      { label: 'Points',   icon: Coins,         path: `${_0x5a2b}/dashboard?tab=cp`,       desc: 'CP analytics'           },
      { label: 'Chain',    icon: Link2,         path: `${_0x5a2b}/dashboard?tab=chain`,    desc: 'Chain explorer'         },
    ],
  },
  {
    label: 'Monitor',
    items: [
      { label: 'Security', icon: AlertTriangle, path: `${_0x5a2b}/dashboard?tab=security`, desc: 'Security events'        },
      { label: 'Contacts', icon: Mail,          path: `${_0x5a2b}/dashboard?tab=contacts`, desc: 'Contact messages'       },
    ],
  },
];

// ── Mobile bottom primary tabs ────────────────────────────────────────────────
const MOBILE_PRIMARY = [
  { label: 'Users',     icon: Users,    path: `${_0x5a2b}/dashboard?tab=users`     },
  { label: 'Bootcamps', icon: Shield,   path: `${_0x5a2b}/dashboard?tab=bootcamps` },
  { label: 'Market',    icon: Database, path: `${_0x5a2b}/dashboard?tab=zero_day`  },
  { label: 'Points',    icon: Coins,    path: `${_0x5a2b}/dashboard?tab=cp`        },
];

const MOBILE_MORE = [
  { label: 'Chain',        icon: Link2,         path: `${_0x5a2b}/dashboard?tab=chain`        },
  { label: 'Security',     icon: AlertTriangle, path: `${_0x5a2b}/dashboard?tab=security`     },
  { label: 'Contacts',     icon: Mail,          path: `${_0x5a2b}/dashboard?tab=contacts`     },
];

interface NotificationItem {
  id: string; title: string; message: string; read: boolean; createdAt?: string;
}

const NOTIF_PREVIEW_LIMIT = 6;

const AdminTopbar = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = new URLSearchParams(location.search).get('tab') || 'users';

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notificationsPreview, setNotificationsPreview] = useState<NotificationItem[]>([]);
  const [moreOpen, setMoreOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useScrollLock(moreOpen);

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
  useEffect(() => { setMoreOpen(false); setNotifOpen(false); setActiveDropdown(null); }, [location.search]);

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
    navigate(_0x5a2b);
  };

  const isTabActive = (path: string) => {
    const tab = new URLSearchParams(path.split('?')[1] || '').get('tab');
    return tab === currentTab;
  };

  return (
    <>
      {/* ── Desktop topbar ── */}
      <header className="fixed top-0 left-0 w-full z-40 bg-bg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">

          {/* Left: Logo + admin badge + nav */}
          <div className="flex items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-3">
              <Link to={`${_0x5a2b}/dashboard`}><Logo size="md" /></Link>
              <div className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-accent/20 bg-accent-dim/40 px-2 py-0.5">
                <Shield className="h-3 w-3 text-accent" />
                <span className="text-[9px] font-black text-accent font-mono tracking-[0.2em]">ADMIN</span>
              </div>
            </div>

            {/* Desktop nav — dropdown groups */}
            <nav className="hidden md:flex items-center gap-1">
              {/* Operator view link */}
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors text-text-muted hover:text-text-primary hover:bg-accent-dim/50"
              >
                <LayoutDashboard className="w-4 h-4" />
                Operator
              </Link>

              {NAV_GROUPS.map((group) => (
                <div
                  key={group.label}
                  className="relative h-20 md:h-24 flex items-center"
                  onMouseEnter={() => setActiveDropdown(group.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${
                      activeDropdown === group.label
                        ? 'text-accent bg-accent-dim'
                        : group.items.some(i => isTabActive(i.path))
                        ? 'text-accent bg-accent-dim'
                        : 'text-text-muted hover:text-text-primary hover:bg-accent-dim/50'
                    }`}
                  >
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
                        className="absolute top-full mt-1 w-64 bg-bg-card border border-border rounded-xl shadow-2xl p-2 z-[80] left-0 right-auto max-w-[calc(100vw-2rem)]"
                      >
                        <div className="space-y-1.5">
                        {group.items.map((item) => {
                          const active = isTabActive(item.path);
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              className={`flex items-center gap-3 px-4 py-3.5 rounded-lg border border-transparent transition-colors ${
                                active
                                  ? 'bg-accent-dim text-accent'
                                  : 'text-text-secondary hover:bg-accent-dim/60 hover:text-text-primary'
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

          {/* Right: notifications + profile + logout */}
          <div className="flex items-center gap-2 md:gap-3">

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
                    className="hidden md:block absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-bg-card shadow-2xl z-[80] overflow-hidden"
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
                      <button
                        onClick={() => setNotifOpen(false)}
                        className="block w-full text-center text-xs font-bold text-accent hover:underline"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile notification bottom sheet */}
            <BottomSheet open={notifOpen} onOpenChange={setNotifOpen}>
              <BottomSheetContent ariaLabel="Notifications" className="z-[70] md:hidden max-h-[75svh] flex flex-col">
                    <div className="flex justify-center pt-3 pb-1 flex-none">
                      <div className="w-10 h-1 rounded-full bg-border" />
                    </div>
                    <div className="px-5 py-3 border-b border-border flex items-center justify-between flex-none">
                      <div>
                        <div className="text-sm font-black uppercase tracking-widest text-text-primary">Notifications</div>
                        <div className="text-[10px] text-text-muted">{unreadCount} unread</div>
                      </div>
                      <div className="flex items-center gap-3">
                        {unreadCount > 0 && (
                          <button onClick={markAllNotificationsRead} className="text-[10px] font-bold text-accent">Mark all read</button>
                        )}
                        <BottomSheetClose className="p-1.5 text-text-muted hover:text-accent transition-colors">
                          <X className="w-5 h-5" />
                        </BottomSheetClose>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-border/50">
                      {notifLoading ? (
                        <div className="p-5 text-sm text-text-muted text-center">Loading...</div>
                      ) : notificationsPreview.length === 0 ? (
                        <div className="p-5 text-sm text-text-muted text-center">No notifications yet.</div>
                      ) : notificationsPreview.map((item) => (
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
                      ))}
                    </div>
                    <div className="px-5 py-4 border-t border-border flex-none">
                      <button
                        onClick={() => setNotifOpen(false)}
                        className="block w-full text-center py-3 rounded-xl border border-accent/30 text-sm font-bold text-accent hover:bg-accent-dim transition-colors"
                      >
                        Close
                      </button>
                    </div>
              </BottomSheetContent>
            </BottomSheet>

            {/* Profile avatar */}
            <div
              aria-label="Admin profile"
              className="w-11 h-11 md:w-12 md:h-12 rounded-xl border-2 border-accent/30 bg-accent-dim flex items-center justify-center text-accent font-black text-base flex-none hover:border-accent/60 transition-colors cursor-default"
            >
              {(user?.username || user?.email || 'A').substring(0, 2).toUpperCase()}
            </div>

            {/* Logout — desktop */}
            <button
              onClick={handleLogout}
              className="hidden md:flex p-3 md:p-3.5 text-text-muted hover:text-red-400 transition-colors rounded-xl hover:bg-red-400/10 active:scale-95"
              aria-label="Log out"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile bottom nav ── */}
      <>
        <nav
          className="fixed bottom-0 left-0 w-full bg-bg-card/95 backdrop-blur-md border-t border-border flex md:hidden z-50"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {MOBILE_PRIMARY.map((item) => {
            const active = isTabActive(item.path);
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

          {/* More button */}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-4 min-h-[68px] active:bg-accent-dim/30 transition-colors"
          >
            <Shield className="w-6 h-6 text-text-muted" />
            <span className="text-[11px] font-bold uppercase tracking-wide text-text-muted">More</span>
          </button>
        </nav>

        {/* Mobile "More" sheet */}
        <AnimatePresence>
          {moreOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                onClick={() => setMoreOpen(false)}
              />
              <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="md:hidden fixed bottom-0 left-0 right-0 z-[70] bg-bg-card border-t border-border rounded-t-2xl"
                style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 5rem)' }}
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <span className="text-sm font-black uppercase tracking-widest text-text-primary">More</span>
                  <button
                    onClick={() => setMoreOpen(false)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-text-muted hover:text-accent transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <nav className="grid grid-cols-3 gap-2 p-4">
                  {MOBILE_MORE.map((item) => {
                    const active = isTabActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMoreOpen(false)}
                        className={`flex flex-col items-center gap-1.5 rounded-2xl border px-3 py-4 transition-colors ${
                          active
                            ? 'border-accent/30 bg-accent-dim text-accent'
                            : 'border-border bg-bg text-text-muted hover:border-accent/20 hover:text-text-primary'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-wide">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
                <div className="px-4 pb-2 border-t border-border pt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-dim text-xs font-black text-accent">
                      {(user?.email || user?.username || 'A').substring(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold text-text-primary">{user?.username || 'Admin'}</div>
                      <div className="truncate text-[10px] text-text-muted">{user?.email || ''}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase text-text-muted border border-border rounded-xl hover:text-red-400 hover:border-red-500/30 transition-colors shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    </>
  );
};

export default AdminTopbar;
