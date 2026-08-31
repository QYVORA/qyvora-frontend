import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IconShield, IconNotification } from '@/shared/components/icons';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import Logo from '@/shared/components/brand/Logo';
import ADMIN_PATH from '@/shared/utils/adminPath';
import { useEffect, useRef, useState } from 'react';
import api from '@/core/services/api';
import { ADMIN_QUICK_TABS } from './navGroups';
import AdminNavPanel from './AdminNavPanel';
import { NavMenuTrigger } from '@/features/student/components/layout/StudentNavPanel/StudentNavPanel';
import NotificationsDropdown from './NotificationsDropdown';
import MobileNotificationsSheet from './MobileNotificationsSheet';
import type { NotificationItem } from './types';

const NOTIF_PREVIEW_LIMIT = 6;

const AdminTopbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notificationsPreview, setNotificationsPreview] = useState<NotificationItem[]>([]);
  const [navOpen, setNavOpen] = useState(false);

  // Mirrors the student dashboard topbar: auto-hide while scrolling down past
  // the first viewport, reveal again on scroll up. Layout reservation stays
  // static — the bar slides over content, giving the admin more reading space.
  const [topbarHidden, setTopbarHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (navOpen) setTopbarHidden(false);
  }, [navOpen]);

  useEffect(() => {
    setTopbarHidden(false);
    lastScrollYRef.current = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (navOpen) {
        setTopbarHidden(false);
        return;
      }
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const prev = lastScrollYRef.current;
        if (y <= 80) {
          setTopbarHidden(false);
        } else if (y > prev + 8) {
          setTopbarHidden(true);
        } else if (y < prev - 8) {
          setTopbarHidden(false);
        }
        lastScrollYRef.current = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname, navOpen]);

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
      addToast(t('nav.notifications.markedAsRead'), 'success');
    } catch {
      addToast(t('nav.notifications.markAsReadFailed'), 'error');
    }
  };

  useEffect(() => { loadNotificationsSnapshot(); }, [location.pathname]);
  useEffect(() => { setNotifOpen(false); setNavOpen(false); }, [location.search]);

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
    addToast(t('aria.sessionTerminated'), 'info');
    navigate(ADMIN_PATH);
  };

  const isTabActive = (tab: string) => tab === currentTab;

  const overviewPath = `${ADMIN_PATH}/dashboard?tab=overview`;

  return (
    <>
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-on-accent focus:rounded-lg focus:text-sm focus:font-bold focus:outline-none"
      >
        {t('aria.skipToMain')}
      </a>

      <header
        className={`fixed top-0 left-0 w-full z-[100] bg-transparent pt-[env(safe-area-inset-top)] transition-transform duration-300 ${topbarHidden ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="px-3 md:px-4 lg:px-6 h-20 md:h-24 flex items-center gap-2 md:gap-3">
          {/* Logo + ADMIN badge */}
          <Link to={overviewPath} className="flex items-center gap-3 flex-none shrink-0" aria-label={t('nav.adminConsole')}>
            <Logo size="md" variant="mark" />
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-accent/20 bg-accent-dim/40 px-2 py-0.5">
              <IconShield size={12} className="text-accent" />
              <span className="text-[9px] font-black text-accent font-mono tracking-[0.2em]">{t('nav.admin')}</span>
            </span>
          </Link>

          {/* Quick tabs — desktop only (lg+), flex-1 pushes right actions to the far right */}
          <nav className="hidden lg:flex items-center justify-start flex-1 min-w-0 gap-1">
            {ADMIN_QUICK_TABS.map((item) => {
              const Icon = item.icon;
              const active = isTabActive(item.tab);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex flex-col items-center gap-1.5 px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-colors shrink-0 ${
                    active ? 'text-accent' : 'text-text-secondary hover:text-text-primary active:opacity-70'
                  }`}
                >
                  <Icon size={32} strokeWidth={2.5} className={active ? 'text-accent' : 'text-text-secondary'} />
                  <span>{t(item.labelKey)}</span>
                  {active && (
                    <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-accent" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Spacer — keeps right actions right-aligned on md..lg, where the desktop nav (flex-1) is hidden */}
          <div className="hidden lg:hidden md:flex flex-1" aria-hidden="true" />

          {/* Right actions */}
          <div className="flex items-center gap-1.5 md:gap-2.5 shrink-0 ml-auto">
            <div ref={notifRef} className="relative">
              <button
                onClick={() => { const next = !notifOpen; setNotifOpen(next); if (next) loadNotificationsSnapshot(); }}
                className="relative p-3 md:p-3.5 min-h-12 min-w-12 flex items-center justify-center text-text-muted hover:text-accent transition-colors rounded-xl hover:bg-accent-dim/50"
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount > 9 ? '9+' : unreadCount} unread)` : ''}`}
              >
                <IconNotification size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 min-w-4 h-4 px-1 bg-accent text-on-accent text-[9px] font-black rounded-full flex items-center justify-center leading-none">
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
              aria-label={t('aria.adminProfile')}
              className="hidden md:flex w-11 h-11 md:w-12 md:h-12 rounded-xl border border-accent/30 bg-accent-dim items-center justify-center text-accent font-black text-base flex-none"
            >
              {(user?.username || user?.email || 'A').substring(0, 2).toUpperCase()}
            </div>

            {/* Logout — desktop */}
            <button
              onClick={handleLogout}
              className="hidden md:flex p-3 md:p-3.5 text-text-muted hover:text-danger transition-colors rounded-xl hover:bg-danger/10 active:scale-95"
              aria-label={t('aria.logOut')}
            >
              <LogOut className="w-6 h-6" />
            </button>

            {/* Single menu trigger — opens the full admin navigation panel on
                all breakpoints (mirrors the student dashboard dropdown). */}
            <NavMenuTrigger open={navOpen} onClick={() => setNavOpen((v) => !v)} />
          </div>
        </div>
      </header>

      <MobileNotificationsSheet
        open={notifOpen}
        onOpenChange={setNotifOpen}
        unreadCount={unreadCount}
        notifLoading={notifLoading}
        notificationsPreview={notificationsPreview}
        markAllNotificationsRead={markAllNotificationsRead}
      />

      <AdminNavPanel open={navOpen} onOpenChange={setNavOpen} handleLogout={handleLogout} />
    </>
  );
};

export default AdminTopbar;