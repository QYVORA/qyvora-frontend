import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Target,
  BadgeCheck,
  Trophy,
  Terminal as TerminalIcon,
  Network,
  Bug,
  ShieldCheck,
  Bell,
  Menu,
  ChevronDown,
  Maximize,
  Minimize,
} from 'lucide-react';
import { useAuth } from '@/core/contexts/AuthContext';
import api from '@/core/services/api';
import { useFullscreen } from '@/shared/hooks/useFullscreen';

interface StudentDesktopTopbarProps {
  onMobileMenuOpen?: () => void;
}

type TopbarMenu = 'practice' | 'develop';

/**
 * StudentDesktopTopbar — compact horizontal dashboard navigation.
 *
 * Dashboard chrome intentionally has no logo: the five primary sections
 * (Dashboard, Learn, Practice, Complete, Develop) are the visual anchor. The
 * utility cluster is limited to fullscreen, notifications and profile so the
 * header stays short and the nav never gets squeezed on narrow laptops.
 *
 * Dropdowns are click-toggled (not hover-only) so they work for touch, keyboard
 * and pointer users alike. The five primary icons always use the accent colour;
 * only the labels change on active/hover states.
 */
const StudentDesktopTopbar: React.FC<StudentDesktopTopbarProps> = ({ onMobileMenuOpen }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [openMenu, setOpenMenu] = useState<TopbarMenu | null>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const navRef = useRef<HTMLElement | null>(null);

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
  }, [location.pathname]);

  useEffect(() => {
    if (!openMenu) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(null);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openMenu]);

  const userDisplayName = user?.username || user?.email || 'User';
  const userInitial = userDisplayName.charAt(0).toUpperCase();
  const isPracticeRoute =
    location.pathname.startsWith('/dashboard/bootcamps') ||
    location.pathname.startsWith('/dashboard/labs') ||
    location.pathname.startsWith('/dashboard/competitive');
  const isDevelopRoute =
    location.pathname.startsWith('/dashboard/networks') ||
    location.pathname.startsWith('/dashboard/tools');

  const desktopItemClass = (isActive: boolean) =>
    `group flex h-12 min-w-[58px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-[10px] font-bold uppercase tracking-wide transition-colors xl:min-w-[68px] xl:px-3 xl:text-[11px] xl:tracking-wider ${
      isActive
        ? 'bg-accent/10 text-accent'
        : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
    }`;

  const dropdownLinkClass =
    'flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors duration-150 hover:bg-surface-raised hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent';

  const toggleMenu = (menu: TopbarMenu) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-on-accent focus:rounded-lg focus:text-sm focus:font-bold focus:outline-none"
      >
        Skip to content
      </a>

      <header className="chrome-fixed chrome-fixed-overflow fixed top-0 inset-x-0 z-[100] border-b border-border-subtle bg-canvas pt-[env(safe-area-inset-top)]">
        <div className="flex h-14 min-w-0 items-center gap-2 px-3 md:h-16 md:gap-3 md:px-4 lg:px-6">
          {/* Mobile hamburger menu (hidden on desktop) */}
          <button
            type="button"
            onClick={onMobileMenuOpen}
            aria-label="Open menu"
            className="flex min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-surface-raised hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Desktop navigation */}
          <nav
            ref={navRef}
            className="hidden min-w-0 items-center gap-0.5 overflow-visible lg:flex xl:gap-1"
            aria-label="Primary"
          >
            <NavLink to="/dashboard" end className={({ isActive }) => desktopItemClass(isActive)}>
              {({ isActive }) => (
                <>
                  <Home
                    className="h-[18px] w-[18px] shrink-0 text-accent"
                    strokeWidth={isActive ? 2.5 : 2}
                    aria-hidden="true"
                  />
                  <span>Dashboard</span>
                </>
              )}
            </NavLink>

            <NavLink to="/dashboard/courses" className={({ isActive }) => desktopItemClass(isActive)}>
              {({ isActive }) => (
                <>
                  <BookOpen
                    className="h-[18px] w-[18px] shrink-0 text-accent"
                    strokeWidth={isActive ? 2.5 : 2}
                    aria-hidden="true"
                  />
                  <span>Learn</span>
                </>
              )}
            </NavLink>

            {/* Practice dropdown — click/touch toggle, not hover-only. */}
            <div className="relative z-[150]">
              <button
                type="button"
                onClick={() => toggleMenu('practice')}
                aria-haspopup="true"
                aria-expanded={openMenu === 'practice'}
                aria-controls="topbar-practice-menu"
                className={desktopItemClass(isPracticeRoute)}
              >
                <Target className="h-[18px] w-[18px] shrink-0 text-accent" strokeWidth={2} aria-hidden="true" />
                <span className="flex items-center gap-1 whitespace-nowrap">
                  Practice
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-200 ${openMenu === 'practice' ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </span>
              </button>

              {openMenu === 'practice' && (
                <div
                  id="topbar-practice-menu"
                  className="absolute left-0 top-full min-w-[200px] pt-2"
                >
                  <div className="animate-slide-down rounded-xl border border-border-subtle bg-canvas p-2 shadow-lg">
                    <Link to="/dashboard/bootcamps" className={dropdownLinkClass}>
                      <ShieldCheck className="h-[18px] w-[18px] text-accent" aria-hidden="true" />
                      <span>Bootcamp</span>
                    </Link>
                    <Link to="/dashboard/labs" className={dropdownLinkClass}>
                      <Bug className="h-[18px] w-[18px] text-accent" aria-hidden="true" />
                      <span>Labs</span>
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
              {({ isActive }) => (
                <>
                  <BadgeCheck
                    className="h-[18px] w-[18px] shrink-0 text-accent"
                    strokeWidth={isActive ? 2.5 : 2}
                    aria-hidden="true"
                  />
                  <span>Complete</span>
                </>
              )}
            </NavLink>

            {/* Develop dropdown — Network and Terminal are real existing routes. */}
            <div className="relative z-[150]">
              <button
                type="button"
                onClick={() => toggleMenu('develop')}
                aria-haspopup="true"
                aria-expanded={openMenu === 'develop'}
                aria-controls="topbar-develop-menu"
                className={desktopItemClass(isDevelopRoute)}
              >
                <TerminalIcon className="h-[18px] w-[18px] shrink-0 text-accent" strokeWidth={2} aria-hidden="true" />
                <span className="flex items-center gap-1 whitespace-nowrap">
                  Develop
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-200 ${openMenu === 'develop' ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </span>
              </button>

              {openMenu === 'develop' && (
                <div
                  id="topbar-develop-menu"
                  className="absolute left-0 top-full min-w-[200px] pt-2"
                >
                  <div className="animate-slide-down rounded-xl border border-border-subtle bg-canvas p-2 shadow-lg">
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

          <div className="flex-1" aria-hidden="true" />

          {/* Right side utilities */}
          <div className="flex shrink-0 items-center justify-end gap-1 md:gap-1.5 lg:gap-2">
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-secondary transition-colors duration-150 hover:bg-surface-raised hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent md:h-11 md:w-11 lg:flex"
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Maximize className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard/notifications')}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-secondary transition-colors duration-150 hover:bg-surface-raised hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent md:h-11 md:w-11"
              aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-black leading-none text-on-accent tabular-nums">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>

            <Link
              to="/dashboard/profile"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-surface text-sm font-black text-accent transition-colors duration-150 hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:h-11 md:w-11"
              aria-label="Profile"
            >
              {userInitial}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default StudentDesktopTopbar;
