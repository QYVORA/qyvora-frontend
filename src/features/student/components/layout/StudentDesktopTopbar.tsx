import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  BadgeCheck,
  Trophy,
  Terminal as TerminalIcon,
  Network,
  ShieldCheck,
  Bell,
  Menu as MenuIcon,
  ChevronDown,
  Maximize,
  Minimize,
  Search,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import api from '@/core/services/api';
import { useFullscreen } from '@/shared/hooks/useFullscreen';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import { LIGHT_THEME_ENABLED, useThemeContext } from '@/core/contexts/ThemeContext';
import { Logo } from '@/shared/components/brand';
import { Avatar, Badge, Breadcrumb, Menu, MenuItem, MenuSeparator } from '@/shared/components/ui';
import type { BreadcrumbItem } from '@/shared/components/ui';
import StudentSearchDialog from './StudentSearchDialog';
import { useScrollDirection } from '@/shared/hooks/useScrollDirection';

interface StudentDesktopTopbarProps {
  onMobileMenuOpen?: () => void;
  mobileMenuOpen?: boolean;
}

type TopbarMenu = 'practice' | 'develop';

const CRUMB_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  labs: 'Labs',
  courses: 'Labs',
  bootcamps: 'Bootcamp',
  competitive: 'Competitive',
  certificates: 'Certificates',
  notifications: 'Notifications',
  profile: 'Profile',
  settings: 'Settings',
  marketplace: 'Marketplace',
  networks: 'Network',
  tools: 'Tools',
  terminal: 'Terminal',
  qose: 'QOSE',
  'ui-kit': 'UI kit',
};

/** Section crumb + optional sub-page crumb for the topbar. */
function deriveBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const parts = pathname.replace(/^\/+|\/+$/g, '').split('/');
  if (parts[0] !== 'dashboard' || parts.length < 2) {
    return [{ label: 'Dashboard', href: '/dashboard' }];
  }
  const section = parts[1];
  const sectionLabel = CRUMB_LABELS[section] ?? section;
  const items: BreadcrumbItem[] = [{ label: sectionLabel, href: `/dashboard/${section}` }];
  const rest = parts.slice(2).filter((part) => !part.match(/^[0-9a-f-]{8,}$/i));
  if (rest.length > 0) {
    const last = rest[rest.length - 1];
    items.push({ label: CRUMB_LABELS[last] ?? last.replace(/-/g, ' ') });
  }
  return items;
}

/**
 * StudentDesktopTopbar — signed-in app chrome.
 *
 * Left: hamburger (mobile), logo, section breadcrumb. Centre: primary nav.
 * Right: search and the account menu (identity, stats, profile, notifications,
 * settings, fullscreen, theme, sign out). No inline streak / fullscreen /
 * profile chips — those live in the menu.
 */
const StudentDesktopTopbar: React.FC<StudentDesktopTopbarProps> = ({ onMobileMenuOpen, mobileMenuOpen = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast, clearToasts } = useToast();
  const [unread, setUnread] = useState(0);
  const [openMenu, setOpenMenu] = useState<TopbarMenu | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { mode, toggleTheme } = useThemeContext();
  const { data: overview } = useStudentOverview();
  const headerRef = useRef<HTMLElement | null>(null);
  const [focusWithin, setFocusWithin] = useState(false);
  const barHidden = useScrollDirection({
    disabled: mobileMenuOpen,
    forceVisible: focusWithin || accountOpen || openMenu !== null || searchOpen,
    resetKey: location.pathname,
  });

  useEffect(() => {
    let mounted = true;
    api
      .get('/notifications')
      .then((res) => {
        if (!mounted) return;
        const items = Array.isArray(res.data) ? res.data : [];
        setUnread(items.filter((n: { read?: boolean }) => !n.read).length);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setAccountOpen(false);
    setFocusWithin(false);
  }, [location.pathname]);

  const userDisplayName = user?.username || user?.email || 'User';
  const streakDays = overview?.xpSummary?.streakDays ?? 0;
  const cp = user?.cp ?? overview?.xpSummary?.cp ?? 0;
  const rank = overview?.xpSummary?.progression?.rank ?? user?.rank ?? 'Candidate';

  const isLabsRoute =
    location.pathname.startsWith('/dashboard/labs') ||
    location.pathname.startsWith('/dashboard/courses');
  const isPracticeRoute =
    location.pathname.startsWith('/dashboard/bootcamps') ||
    location.pathname.startsWith('/dashboard/competitive');
  const isDevelopRoute =
    location.pathname.startsWith('/dashboard/networks') ||
    location.pathname.startsWith('/dashboard/tools');

  const desktopItemClass = (isActive: boolean) =>
    `flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm transition-colors ${
      isActive
        ? 'bg-accent/10 font-medium text-accent'
        : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
    }`;

  const dropdownLinkClass =
    'flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent';

  const toggleMenu = (menu: TopbarMenu) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const handleLogout = async () => {
    setAccountOpen(false);
    await logout();
    clearToasts();
    addToast('Signed out successfully.', 'info');
    navigate('/login');
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-on-accent focus:rounded-lg focus:text-sm focus:font-medium focus:outline-none"
      >
        Skip to content
      </a>

      <header
        ref={headerRef}
        onFocusCapture={() => setFocusWithin(true)}
        onBlurCapture={(event) => {
          if (!headerRef.current?.contains(event.relatedTarget as Node | null)) {
            setFocusWithin(false);
          }
        }}
        style={{ transform: barHidden ? 'translateY(-100%)' : 'translateY(0)' }}
        className="chrome-fixed chrome-fixed-overflow fixed top-0 inset-x-0 z-[100] border-b border-border-subtle bg-surface pt-[env(safe-area-inset-top)] transition-transform duration-200 ease-out motion-reduce:duration-0"
      >
        <div className="flex h-[var(--app-topbar-h,4rem)] min-w-0 items-center gap-2 px-[var(--app-gutter,12px)] md:gap-3">
          <button
            type="button"
            onClick={onMobileMenuOpen}
            aria-label="Open menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
          >
            <MenuIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          <Link
            to="/dashboard"
            aria-label="QYVORA dashboard"
            className="flex shrink-0 items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Logo variant="mark" size="sm" className="lg:hidden" />
            <Logo variant="full" size="sm" className="hidden lg:block" />
          </Link>

          <div className="hidden min-w-0 xl:flex">
            <Breadcrumb items={deriveBreadcrumbs(location.pathname)} className="max-w-[240px]" />
          </div>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex" aria-label="Primary">
            <NavLink to="/dashboard" end className={({ isActive }) => desktopItemClass(isActive)}>
              Dashboard
            </NavLink>

            <NavLink to="/dashboard/labs" className={() => desktopItemClass(isLabsRoute)}>
              Labs
            </NavLink>

            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu('practice')}
                aria-haspopup="true"
                aria-expanded={openMenu === 'practice'}
                aria-controls="topbar-practice-menu"
                className={desktopItemClass(isPracticeRoute)}
              >
                Practice
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${openMenu === 'practice' ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {openMenu === 'practice' && (
                <div id="topbar-practice-menu" className="absolute left-0 top-full min-w-[200px] pt-2">
                  <div className="rounded-2xl border border-border-subtle bg-surface-raised p-1.5">
                    <Link to="/dashboard/bootcamps" className={dropdownLinkClass}>
                      <ShieldCheck className="h-[18px] w-[18px] text-accent" aria-hidden="true" />
                      <span>Bootcamp</span>
                    </Link>
                    <Link to="/dashboard/competitive" className={dropdownLinkClass}>
                      <Trophy className="h-[18px] w-[18px] text-accent" aria-hidden="true" />
                      <span>Competitive</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <NavLink to="/dashboard/certificates" className={({ isActive }) => desktopItemClass(isActive)}>
              Certificates
            </NavLink>

            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu('develop')}
                aria-haspopup="true"
                aria-expanded={openMenu === 'develop'}
                aria-controls="topbar-develop-menu"
                className={desktopItemClass(isDevelopRoute)}
              >
                Develop
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${openMenu === 'develop' ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {openMenu === 'develop' && (
                <div id="topbar-develop-menu" className="absolute left-0 top-full min-w-[200px] pt-2">
                  <div className="rounded-2xl border border-border-subtle bg-surface-raised p-1.5">
                    <Link to="/dashboard/networks" className={dropdownLinkClass}>
                      <Network className="h-[18px] w-[18px] text-accent" aria-hidden="true" />
                      <span>Network</span>
                    </Link>
                    <Link to="/dashboard/tools/terminal" className={dropdownLinkClass}>
                      <TerminalIcon className="h-[18px] w-[18px] text-accent" aria-hidden="true" />
                      <span>Terminal</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="flex-1 lg:hidden" aria-hidden="true" />

          <div className="flex shrink-0 items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search learning rooms"
              title="Search learning rooms (Ctrl+K)"
              className="flex h-10 min-w-10 items-center justify-center gap-2 rounded-lg px-2.5 text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent xl:min-w-[180px] xl:justify-start xl:border xl:border-border-subtle xl:bg-canvas"
            >
              <Search className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="hidden text-sm text-text-muted xl:inline">Search…</span>
            </button>

            <div className="relative">
              <button
                type="button"
                data-menu-trigger
                onClick={() => setAccountOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                aria-label="Account menu"
                className="relative flex h-10 items-center gap-1.5 rounded-full pl-0.5 pr-2 transition-colors hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Avatar name={userDisplayName} size={32} />
                <ChevronDown
                  className={`h-4 w-4 text-text-muted transition-transform ${accountOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
                {unread > 0 && (
                  <span
                    className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-accent"
                    aria-label={`${unread} unread notifications`}
                  />
                )}
              </button>

              <Menu
                open={accountOpen}
                onClose={() => setAccountOpen(false)}
                className="absolute right-0 top-full mt-2 w-[300px]"
                labelledBy="account-menu-label"
              >
                <div id="account-menu-label" className="px-3 pb-3 pt-2">
                  <div className="flex items-center gap-3">
                    <Avatar name={userDisplayName} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-medium text-text-primary">{userDisplayName}</p>
                      <p className="truncate text-sm text-text-muted">{user?.email}</p>
                    </div>
                    <Badge variant="accent" pill>{rank}</Badge>
                  </div>
                  <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-border-subtle pt-3">
                    <div className="text-center">
                      <dd className="text-base font-medium tabular-nums text-text-primary">{streakDays}</dd>
                      <dt className="text-xs text-text-muted">Day streak</dt>
                    </div>
                    <div className="text-center">
                      <dd className="text-base font-medium tabular-nums text-text-primary">{cp}</dd>
                      <dt className="text-xs text-text-muted">CP</dt>
                    </div>
                    <div className="text-center">
                      <dd className="truncate text-base font-medium text-text-primary">{rank}</dd>
                      <dt className="text-xs text-text-muted">Rank</dt>
                    </div>
                  </dl>
                </div>
                <MenuSeparator />
                <MenuItem icon={<User />} to="/dashboard/profile" onClick={() => setAccountOpen(false)}>
                  Profile
                </MenuItem>
                <MenuItem
                  icon={<Bell />}
                  to="/dashboard/notifications"
                  onClick={() => setAccountOpen(false)}
                  trailing={unread > 0 ? unread : undefined}
                >
                  Notifications
                </MenuItem>
                <MenuItem icon={<Settings />} to="/dashboard/settings" onClick={() => setAccountOpen(false)}>
                  Settings
                </MenuItem>
                <MenuSeparator />
                <MenuItem icon={isFullscreen ? <Minimize /> : <Maximize />} onClick={toggleFullscreen}>
                  {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                </MenuItem>
                {LIGHT_THEME_ENABLED && (
                  <MenuItem icon={mode === 'dark' ? <Sun /> : <Moon />} onClick={toggleTheme}>
                    {mode === 'dark' ? 'Light mode' : 'Dark mode'}
                  </MenuItem>
                )}
                <MenuSeparator />
                <MenuItem
                  icon={<BadgeCheck />}
                  to="/dashboard/certificates"
                  onClick={() => setAccountOpen(false)}
                >
                  Certificates
                </MenuItem>
                <MenuItem icon={<BookOpen />} to="/dashboard/marketplace" onClick={() => setAccountOpen(false)}>
                  Marketplace
                </MenuItem>
                <MenuSeparator />
                <MenuItem icon={<LogOut />} danger onClick={handleLogout}>
                  Sign out
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </header>
      <StudentSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};

export default StudentDesktopTopbar;
