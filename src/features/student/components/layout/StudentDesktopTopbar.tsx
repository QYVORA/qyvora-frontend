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
} from 'lucide-react';
import { Logo } from '@/shared/components/brand';
import { useAuth } from '@/core/contexts/AuthContext';
import api from '@/core/services/api';
import Button from '@/shared/components/ui/Button';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import { extractCpBalance } from '@/shared/utils/cpBalance';
import CpLogo from '@/shared/components/CpLogo';
import StreakIcon from '@/shared/components/icons/StreakIcon';

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

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-on-accent focus:rounded-lg focus:text-sm focus:font-bold focus:outline-none"
      >
        Skip to content
      </a>

      <header className="fixed top-0 inset-x-0 z-[100] border-b border-border-subtle bg-canvas pt-[env(safe-area-inset-top)]">
        <div className="flex h-16 items-center gap-3 px-3 md:h-20 md:gap-4 md:px-4 lg:h-24 lg:gap-6 lg:px-6">
          {/* Mobile hamburger menu (hidden on desktop) */}
          <button
            type="button"
            onClick={onMobileMenuOpen}
            aria-label="Open menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-secondary transition-all duration-200 hover:bg-surface-raised hover:text-accent hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent md:h-12 md:w-12 lg:hidden"
          >
            <Menu className="h-5 w-5 transition-transform duration-200" aria-hidden="true" />
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
          <nav className="hidden items-center gap-1 overflow-visible lg:flex" aria-label="Primary">
            {/* Dashboard */}
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `group flex min-h-[48px] items-center gap-2 rounded-xl px-4 py-2 text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-accent/10 font-bold text-accent scale-[1.02]'
                    : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary hover:scale-[1.02]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Home
                    className="h-[18px] w-[18px] shrink-0 transition-transform duration-200"
                    strokeWidth={isActive ? 2.5 : 2}
                    aria-hidden="true"
                  />
                  <span>Dashboard</span>
                </>
              )}
            </NavLink>

            {/* Learn */}
            <NavLink
              to="/dashboard/courses"
              className={({ isActive }) =>
                `group flex min-h-[48px] items-center gap-2 rounded-xl px-4 py-2 text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-accent/10 font-bold text-accent scale-[1.02]'
                    : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary hover:scale-[1.02]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <BookOpen
                    className="h-[18px] w-[18px] shrink-0 transition-transform duration-200"
                    strokeWidth={isActive ? 2.5 : 2}
                    aria-hidden="true"
                  />
                  <span>Learn</span>
                </>
              )}
            </NavLink>

            {/* Practice Dropdown */}
            <div className="group relative z-[150]">
              <button
                type="button"
                className="flex min-h-[48px] items-center gap-2 rounded-xl px-4 py-2 text-sm text-text-secondary transition-all duration-200 hover:bg-surface-raised hover:text-text-primary hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
              >
                <Target className="h-[18px] w-[18px] shrink-0 transition-transform duration-200" strokeWidth={2} aria-hidden="true" />
                <span>Practice</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" aria-hidden="true" />
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute left-0 top-full z-[150] hidden min-w-[200px] pt-2 group-hover:block group-focus-within:block">
                <div className="rounded-xl border border-border-subtle bg-canvas p-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    to="/dashboard/bootcamps"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-all duration-150 hover:bg-surface-raised hover:text-text-primary hover:translate-x-1"
                  >
                    <ShieldCheck className="h-[18px] w-[18px]" aria-hidden="true" />
                    <span>Bootcamp</span>
                  </Link>
                  <Link
                    to="/dashboard/labs"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-all duration-150 hover:bg-surface-raised hover:text-text-primary hover:translate-x-1"
                  >
                    <Bug className="h-[18px] w-[18px]" aria-hidden="true" />
                    <span>Labs</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Compete Dropdown */}
            <div className="group relative z-[150]">
              <button
                type="button"
                className="flex min-h-[48px] items-center gap-2 rounded-xl px-4 py-2 text-sm text-text-secondary transition-all duration-200 hover:bg-surface-raised hover:text-text-primary hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
              >
                <Trophy className="h-[18px] w-[18px] shrink-0 transition-transform duration-200" strokeWidth={2} aria-hidden="true" />
                <span>Compete</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" aria-hidden="true" />
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute left-0 top-full z-[150] hidden min-w-[200px] pt-2 group-hover:block group-focus-within:block">
                <div className="rounded-xl border border-border-subtle bg-canvas p-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    to="/dashboard/competitive"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-all duration-150 hover:bg-surface-raised hover:text-text-primary hover:translate-x-1"
                  >
                    <Swords className="h-[18px] w-[18px]" aria-hidden="true" />
                    <span>Competitive</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Develop Dropdown */}
            <div className="group relative z-[150]">
              <button
                type="button"
                className="flex min-h-[48px] items-center gap-2 rounded-xl px-4 py-2 text-sm text-text-secondary transition-all duration-200 hover:bg-surface-raised hover:text-text-primary hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
              >
                <TerminalIcon className="h-[18px] w-[18px] shrink-0 transition-transform duration-200" strokeWidth={2} aria-hidden="true" />
                <span>Develop</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" aria-hidden="true" />
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute left-0 top-full z-[150] hidden min-w-[200px] pt-2 group-hover:block group-focus-within:block">
                <div className="rounded-xl border border-border-subtle bg-canvas p-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    to="/dashboard/networks"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-all duration-150 hover:bg-surface-raised hover:text-text-primary hover:translate-x-1"
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
          <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4 lg:flex-none lg:gap-2">
            {/* Search (all screens) */}
            <button
              type="button"
              onClick={() => {
                // TODO: Implement search functionality
                console.log('Search clicked');
              }}
              aria-label="Search"
              className="flex h-10 w-10 shrink-0 items-center justify-center text-text-secondary transition-all duration-200 hover:text-accent hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent md:h-12 md:w-12 lg:rounded-xl lg:hover:bg-surface-raised"
            >
              <Search className="h-5 w-5 transition-transform duration-200" aria-hidden="true" />
            </button>

            {/* Notifications */}
            <button
              type="button"
              onClick={() => navigate('/dashboard/notifications')}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center text-text-secondary transition-all duration-200 hover:text-accent hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent md:h-12 md:w-12 lg:rounded-xl lg:hover:bg-surface-raised"
              aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
            >
              <Bell className="h-5 w-5 transition-transform duration-200" aria-hidden="true" />
              {unread > 0 && (
                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-black leading-none text-on-accent tabular-nums animate-in fade-in zoom-in duration-200">
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
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-border-subtle bg-surface text-sm font-black text-accent transition-all duration-200 hover:border-accent hover:shadow-md hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:h-12 md:w-12"
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
