import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { IconShield, IconNotification } from '@/shared/components/icons';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import Logo from '@/shared/components/brand/Logo';
import ADMIN_PATH from '@/shared/utils/adminPath';
import { useEffect, useRef, useState } from 'react';
import api from '@/core/services/api';
import NotificationsDropdown from './NotificationsDropdown';
import { NAV_GROUPS } from './navGroups';
import MobileMenu from '@/shared/components/layout/MobileMenu';
import type { NavItem } from '@/shared/components/layout/NavDropdown';
import MobileNotificationsSheet from './MobileNotificationsSheet';
import type { NotificationItem } from './types';

const NOTIF_PREVIEW_LIMIT = 6;

const AdminTopbar = ({ railCollapsed = false }: { railCollapsed?: boolean }) => {
  const { user, logout } = useAuth();
  const { addToast, clearToasts } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsPreview, setNotificationsPreview] = useState<NotificationItem[]>([]);

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
          type: item?.type ? String(item.type) : undefined,
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
      addToast("Marked as read", 'success');
    } catch {
      addToast("Failed to mark as read", 'error');
    }
  };

  useEffect(() => { loadNotificationsSnapshot(); }, [location.pathname]);
  useEffect(() => { setNotifOpen(false); }, [location.search]);

  useEffect(() => {
    if (!notifOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!notifRef.current || notifRef.current.contains(e.target as Node)) return;
      setNotifOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNotifOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [notifOpen]);

  const handleLogout = async () => {
    await logout();
    clearToasts();
    addToast('Signed out successfully.', 'info');
    navigate(ADMIN_PATH);
  };

  const overviewPath = `${ADMIN_PATH}/dashboard?tab=overview`;

  const menuItems: NavItem[] = NAV_GROUPS.map((group) => ({
    key: group.title,
    label: group.title,
    icon: group.items[0].icon as LucideIcon,
    children: group.items.map((item) => ({
      label: item.label,
      to: item.path,
      icon: item.icon as LucideIcon,
    })),
  }));

  return (
    <>
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-on-accent focus:rounded-lg focus:text-sm focus:font-bold focus:outline-none"
      >
        {"Skip to main content"}
      </a>

      <header
        className={`chrome-fixed chrome-fixed-overflow fixed top-0 inset-x-0 z-[100] pt-[var(--app-safe-top,0px)] transition-[left] duration-[var(--dur-base)] ease-[var(--ease-smooth)] ${
          railCollapsed ? 'lg:left-[76px]' : 'lg:left-[264px]'
        }`}
      >
        <div className="px-3 md:px-4 lg:px-6 h-20 md:h-24 flex items-center gap-2 md:gap-3">
          {/* Logo + ADMIN badge — lg:hidden; the sidebar rail owns branding at lg+ */}
          <Link to={overviewPath} className="lg:hidden flex items-center gap-3 flex-none shrink-0" aria-label={"Admin Console"}>
            <Logo size="md" variant="mark" />
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-accent/20 bg-accent-dim/40 px-2 py-0.5">
              <IconShield size={12} className="text-accent" />
              <span className="text-xs font-black text-accent font-mono tracking-[0.2em]">{"ADMIN"}</span>
            </span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-auto">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="flex h-12 w-12 items-center justify-center rounded-md text-accent transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div ref={notifRef} className="relative">
              <button
                onClick={() => { const next = !notifOpen; setNotifOpen(next); if (next) loadNotificationsSnapshot(); }}
                className="relative flex h-12 w-12 items-center justify-center rounded-md text-accent transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:h-[52px] md:w-[52px]"
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount > 9 ? '9+' : unreadCount} unread)` : ''}`}
              >
                <IconNotification size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 min-w-4 h-4 px-1 bg-accent text-on-accent text-xs font-black rounded-full flex items-center justify-center leading-none">
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

            {/* Admin profile chip — desktop */}
            <div
              aria-label={"Admin profile"}
              className="hidden md:flex h-[52px] w-[52px] rounded-md border border-accent/30 bg-accent-dim items-center justify-center text-accent font-black text-base flex-none"
            >
              {(user?.username || user?.email || 'A').substring(0, 2).toUpperCase()}
            </div>

            {/* Logout — desktop */}
            <button
              onClick={handleLogout}
              className="hidden md:flex h-[52px] w-[52px] items-center justify-center rounded-md border border-semantic-danger/25 bg-semantic-danger/10 text-semantic-danger transition-colors hover:bg-semantic-danger/15 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-semantic-danger"
              title="Log out"
              aria-label={"Log out"}
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={menuItems}
        title="Admin menu"
        footer={
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-[48px] w-full items-center gap-3 rounded-md px-3 text-base text-semantic-danger transition-colors hover:bg-semantic-danger/10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-semantic-danger"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            Log out
          </button>
        }
      />

      <MobileNotificationsSheet
        open={notifOpen}
        onOpenChange={setNotifOpen}
        unreadCount={unreadCount}
        notifLoading={notifLoading}
        notificationsPreview={notificationsPreview}
        markAllNotificationsRead={markAllNotificationsRead}
      />
    </>
  );
};

export default AdminTopbar;