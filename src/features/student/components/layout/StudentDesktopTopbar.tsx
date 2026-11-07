import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Target,
  Swords,
  Trophy,
  Terminal as TerminalIcon,
  Network,
  Bug,
  ShieldCheck,
  Search,
  Bell,
  Menu,
  ChevronDown,
  User,
  Maximize,
  Minimize,
} from 'lucide-react';
import { Logo } from '@/shared/components/brand';
import { useAuth } from '@/core/contexts/AuthContext';
import api from '@/core/services/api';
import Button from '@/shared/components/ui/Button';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import { extractCpBalance } from '@/shared/utils/cpBalance';
import { useFullscreen } from '@/shared/hooks/useFullscreen';
import CpLogo from '@/shared/components/CpLogo';
import StreakIcon from '@/shared/components/icons/StreakIcon';
import StudentSearchDialog from './StudentSearchDialog';

interface StudentDesktopTopbarProps {
  onMobileMenuOpen?: () => void;
}

/**
 * StudentDesktopTopbar — TryHackMe-inspired horizontal navigation bar for desktop
 * 
 * Desktop (lg+): Full horizontal navigation with dropdowns
 * - Logo
 * - Primary nav links: Dashboard, Learn, Practice (dropdown), Compete (dropdown), Develop (dropdown)
 * - Right utilities: Search, Notifications, Go Premium, CP Points, Streak, User Avatar
 * 
 * Mobile (<lg): Compact topbar with hamburger menu and essential utilities
 * - Hamburger button to open mobile sidebar
 * - Logo
 * - Notifications
 * - CP Points
 */
const StudentDesktopTopbar: React.FC<StudentDesktopTopbarProps> = ({ onMobileMenuOpen }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  // Fetch student statistics
  const { data: overview } = useStudentOverview();

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

  // Calculate statistics
  const streakDays = overview?.xpSummary?.streakDays ?? 0;
  const cpBalance = extractCpBalance(overview?.xpSummary) ?? user?.cp ?? 0;

  // Get user display info
  const userDisplayName = user?.username || user?.email || "User";
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  /**
   * Desktop nav buttons use icon-over-label so the five primary sections stay
   * compact at lg widths. That prevents the right-hand utility cluster from
   * being pushed out of the header on narrow laptops/tablets.
   */
  const desktopItemClass = (isActive: boolean) =>
    `group flex min-h-[62px] min-w-[58px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-colors xl:min-w-[68px] xl:px-3 xl:text-[11px] xl:tracking-wider ${
      isActive
        ? 'bg-accent/10 text-accent'
        : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
    }`;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-on-accent focus:rounded-lg focus:text-sm focus:font-bold focus:outline-none"
      >
        Skip to content
      </a>

      <header className="chrome-fixed chrome-fixed-overflow fixed top-0 inset-x-0 z-[100] border-b border-border-subtle bg-canvas pt-[env(safe-area-inset-top)]">
        <div className="flex h-20 min-w-0 items-center gap-2 px-3 md:h-24 md:gap-3 md:px-4 lg:gap-4 lg:px-6">
          {/* Mobile hamburger menu (hidden on desktop) */}
          <button
            type="button"
            onClick={onMobileMenuOpen}
            aria-label="Open menu"
            className="flex min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-surface-raised hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Logo - Desktop only */}
          <Link
            to="/dashboard"
            aria-label="QYVORA — Home"
            className="group hidden shrink-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:block"
          >
            <Logo
              className="h-8 transition-transform duration-[var(--dur-fast)] ease-[var(--ease-smooth)] group-hover:scale-105"
              aria-hidden="true"
            />
          </Link>

          {/* Desktop Navigation Links (hidden on mobile) */}
          <nav className="hidden min-w-0 items-center gap-0.5 overflow-visible lg:flex xl:gap-1" aria-label="Primary">
            {/* Dashboard */}
            <NavLink to="/dashboard" end className={({ isActive }) => desktopItemClass(isActive)}>
              {({ isActive }) => (
                <>
                  <Home
                    className="h-[18px] w-[18px] shrink-0"
                    strokeWidth={isActive ? 2.5 : 2}
                    aria-hidden="true"
                  />
                  <span>Dashboard</span>
                </>
              )}
            </NavLink>

            {/* Learn */}
            <NavLink to="/dashboard/courses" className={({ isActive }) => desktopItemClass(isActive)}>
              {({ isActive }) => (
                <>
                  <BookOpen
                    className="h-[18px] w-[18px] shrink-0"
                    strokeWidth={isActive ? 2.5 : 2}
                    aria-hidden="true"
                  />
                  <span>Learn</span>
                </>
              )}
            </NavLink>

            {/* Practice Dropdown */}
            <div className="group relative z-[150]">
              <button type="button" className={desktopItemClass(false)}>
                <Target className="h-[18px] w-[18px] shrink-0" strokeWidth={2} aria-hidden="true" />
                <span className="flex items-center gap-1 whitespace-nowrap">
                  Practice
                  <ChevronDown className="h-3 w-3 transition-transform duration-[var(--dur-base)] group-hover:rotate-180" aria-hidden="true" />
                </span>
              </button>

              <div className="absolute left-0 top-full hidden min-w-[200px] pt-2 group-hover:block group-focus-within:block">
                <div className="animate-slide-down rounded-xl border border-border-subtle bg-canvas p-2 shadow-lg">
                  <Link
                    to="/dashboard/bootcamps"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-all duration-[var(--dur-fast)] hover:bg-surface-raised hover:text-text-primary hover:translate-x-1 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                  >
                    <ShieldCheck className="h-[18px] w-[18px]" aria-hidden="true" />
                    <span>Bootcamp</span>
                  </Link>
                  <Link
                    to="/dashboard/labs"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-all duration-[var(--dur-fast)] hover:bg-surface-raised hover:text-text-primary hover:translate-x-1 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                  >
                    <Bug className="h-[18px] w-[18px]" aria-hidden="true" />
                    <span>Labs</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Compete Dropdown */}
            <div className="group relative z-[150]">
              <button type="button" className={desktopItemClass(false)}>
                <Trophy className="h-[18px] w-[18px] shrink-0" strokeWidth={2} aria-hidden="true" />
                <span className="flex items-center gap-1 whitespace-nowrap">
                  Compete
                  <ChevronDown className="h-3 w-3 transition-transform duration-[var(--dur-base)] group-hover:rotate-180" aria-hidden="true" />
                </span>
              </button>

              <div className="absolute left-0 top-full hidden min-w-[200px] pt-2 group-hover:block group-focus-within:block">
                <div className="animate-slide-down rounded-xl border border-border-subtle bg-canvas p-2 shadow-lg">
                  <Link
                    to="/dashboard/competitive"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-all duration-[var(--dur-fast)] hover:bg-surface-raised hover:text-text-primary hover:translate-x-1 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                  >
                    <Swords className="h-[18px] w-[18px]" aria-hidden="true" />
                    <span>Competitive</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Develop Dropdown */}
            <div className="group relative z-[150]">
              <button type="button" className={desktopItemClass(false)}>
                <TerminalIcon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} aria-hidden="true" />
                <span className="flex items-center gap-1 whitespace-nowrap">
                  Develop
                  <ChevronDown className="h-3 w-3 transition-transform duration-[var(--dur-base)] group-hover:rotate-180" aria-hidden="true" />
                </span>
              </button>

              <div className="absolute left-0 top-full hidden min-w-[200px] pt-2 group-hover:block group-focus-within:block">
                <div className="animate-slide-down rounded-xl border border-border-subtle bg-canvas p-2 shadow-lg">
                  <Link
                    to="/dashboard/networks"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-all duration-[var(--dur-fast)] hover:bg-surface-raised hover:text-text-primary hover:translate-x-1 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                  >
                    <Network className="h-[18px] w-[18px]" aria-hidden="true" />
                    <span>Networks</span>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Spacer */}
          <div className="flex-1" aria-hidden="true" />

          {/* Right Side Utilities */}
          <div className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2">
            {/* Fullscreen (desktop) */}
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              className="hidden h-10 w-10 shrink-0 items-center justify-center text-text-secondary transition-all duration-[var(--dur-fast)] hover:text-accent hover:scale-105 active:scale-[0.92] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent md:h-12 md:w-12 lg:flex lg:rounded-xl lg:hover:bg-surface-raised"
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Maximize className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            {/* Search (all screens) */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              title="Search (Ctrl+K)"
              className="flex h-10 w-10 shrink-0 items-center justify-center text-text-secondary transition-all duration-[var(--dur-fast)] hover:text-accent hover:scale-105 active:scale-[0.92] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent md:h-12 md:w-12 lg:rounded-xl lg:hover:bg-surface-raised"
            >
              <Search className="h-5 w-5 transition-transform duration-[var(--dur-fast)]" aria-hidden="true" />
            </button>

            {/* Notifications */}
            <button
              type="button"
              onClick={() => navigate('/dashboard/notifications')}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center text-text-secondary transition-all duration-[var(--dur-fast)] hover:text-accent hover:scale-105 active:scale-[0.92] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent md:h-12 md:w-12 lg:rounded-xl lg:hover:bg-surface-raised"
              aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
            >
              <Bell className="h-5 w-5 transition-transform duration-[var(--dur-fast)]" aria-hidden="true" />
              {unread > 0 && (
                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-black leading-none text-on-accent tabular-nums animate-in fade-in zoom-in duration-[var(--dur-base)]">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>

            {/* Streak Counter - Natural, no background */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <StreakIcon size={24} className="shrink-0 transition-transform duration-200 hover:scale-110" />
              <span className="text-base font-black text-text-primary tabular-nums sm:text-lg">{streakDays}</span>
            </div>

            {/* User Avatar */}
            <Link
              to="/dashboard/profile"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-surface text-sm font-black text-accent transition-all duration-200 hover:shadow-lg hover:shadow-accent/20 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:h-12 md:w-12"
              aria-label="Profile"
            >
              {userInitial}
            </Link>
          </div>
        </div>
      </header>

      <StudentSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};

export default StudentDesktopTopbar;
