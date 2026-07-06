import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LogOut, Bell, Shield, LayoutDashboard, ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import Logo from '@/shared/components/brand/Logo';
import ADMIN_PATH from '@/shared/utils/adminPath';
import { useEffect, useRef, useState } from 'react';
import api from '@/core/services/api';
import { NAV_GROUPS, MOBILE_PRIMARY } from './navGroups';
import { AnimatePresence, motion } from 'motion/react';
import { useScrollLock } from '@/core/hooks/useScrollLock';
import NotificationsDropdown from './NotificationsDropdown';
import MobileNotificationsSheet from './MobileNotificationsSheet';
import MobileMoreSheet from './MobileMoreSheet';
import type { NotificationItem } from './types';

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
    if (!notifOpen) return;
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
    navigate(ADMIN_PATH);
  };

  const isTabActive = (path: string) => {
    const tab = new URLSearchParams(path.split('?')[1] || '').get('tab');
    return tab === currentTab;
  };

  return (
    <>
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-bg focus:rounded-lg focus:text-sm focus:font-bold focus:outline-none"
      >
        Skip to main content
      </a>

      <header className="fixed top-0 left-0 w-full z-40 bg-bg border-b border-border">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-3">
              <Link to={`${ADMIN_PATH}/dashboard`}><Logo size="md" /></Link>
              <div className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-accent/20 bg-accent-dim/40 px-2 py-0.5">
                <Shield className="h-3 w-3 text-accent" />
                <span className="text-[9px] font-black text-accent font-mono tracking-[0.2em]">ADMIN</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
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

          <div className="flex items-center gap-2 md:gap-3">
            <div ref={notifRef} className="relative">
              <button
                onClick={() => { const next = !notifOpen; setNotifOpen(next); if (next) loadNotificationsSnapshot(); }}
                className="relative p-3 md:p-3.5 min-h-12 min-w-12 flex items-center justify-center text-text-muted hover:text-accent transition-colors rounded-xl hover:bg-accent-dim/50"
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount > 9 ? '9+' : unreadCount} unread)` : ''}`}
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

            <div
              aria-label="Admin profile"
              className="w-11 h-11 md:w-12 md:h-12 rounded-xl border-2 border-accent/30 bg-accent-dim flex items-center justify-center text-accent font-black text-base flex-none hover:border-accent/60 transition-colors cursor-default"
            >
              {(user?.username || user?.email || 'A').substring(0, 2).toUpperCase()}
            </div>

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

      {moreOpen && (
        <MobileMoreSheet
          open={moreOpen}
          onOpenChange={setMoreOpen}
          user={user}
          handleLogout={handleLogout}
        />
      )}

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

        <button
          onClick={() => setMoreOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-4 min-h-[68px] active:bg-accent-dim/30 transition-colors"
        >
          <Shield className="w-6 h-6 text-text-muted" />
          <span className="text-[11px] font-bold uppercase tracking-wide text-text-muted">More</span>
        </button>
      </nav>
    </>
  );
};

export default AdminTopbar;
