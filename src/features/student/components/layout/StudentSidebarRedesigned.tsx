import React, { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Home,
  BookOpen,
  ShieldCheck,
  Swords,
  User,
  Settings,
  LogOut,
  X,
  ChevronDown,
  Flame,
  Coins,
  Trophy,
} from 'lucide-react';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import api from '@/core/services/api';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import { Logo } from '@/shared/components/brand';
import { Avatar } from '@/shared/components/ui';
import { CompactStatCard } from '@/shared/components/ui/CompactStatCard';
import { formatCompact } from '@/shared/utils/formatCompact';
import { cn } from '@/shared/utils/cn';

interface NavChild {
  key: string;
  label: string;
  to: string;
  badgeKey?: 'notifications';
}

interface NavRow {
  key: string;
  label: string;
  icon: React.ElementType;
  to?: string;
  children?: NavChild[];
}

const NAV_ROWS: NavRow[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    to: '/dashboard',
  },
  {
    key: 'learn',
    label: 'Learn',
    icon: BookOpen,
    children: [
      { key: 'labs', label: 'Labs', to: '/dashboard/labs' },
    ],
  },
  {
    key: 'practice',
    label: 'Practice',
    icon: ShieldCheck,
    children: [
      { key: 'bootcamp', label: 'Bootcamp', to: '/dashboard/bootcamps' },
      { key: 'networks', label: 'Network', to: '/dashboard/networks' },
      { key: 'terminal', label: 'Terminal', to: '/dashboard/tools/terminal' },
    ],
  },
  {
    key: 'compete',
    label: 'Compete',
    icon: Swords,
    children: [
      { key: 'competitive', label: 'Competitive', to: '/dashboard/competitive' },
    ],
  },
  {
    key: 'account',
    label: 'Account',
    icon: User,
    children: [
      { key: 'profile', label: 'Profile', to: '/dashboard/profile' },
      { key: 'certificates', label: 'Certificates', to: '/dashboard/certificates' },
      { key: 'notifications', label: 'Notifications', to: '/dashboard/notifications', badgeKey: 'notifications' },
      { key: 'marketplace', label: 'Marketplace', to: '/dashboard/marketplace' },
      { key: 'settings', label: 'Settings', to: '/dashboard/settings' },
    ],
  },
];

const ACCOUNT_ITEMS = [
  { key: 'profile', label: 'View Profile', icon: User, to: '/dashboard/profile' },
  { key: 'settings', label: 'Settings', icon: Settings, to: '/dashboard/settings' },
] as const;

const matchesPath = (pathname: string, to: string) => {
  if (to === '/dashboard') return pathname === '/dashboard';
  return pathname === to || pathname.startsWith(`${to}/`);
};

interface StudentSidebarRedesignedProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

/**
 * StudentSidebarRedesigned — Mobile-only sidebar for student dashboard
 *
 * Mobile (<lg): Full-screen overlay sidebar
 * - Opens from hamburger in topbar
 * - Full viewport width and height
 * - Close X button, backdrop click, navigation selection, or Escape key
 * - User profile section with avatar, name, rank
 * - Three statistics cards: Streak, CP Points, Rank
 * - Expandable navigation rows that preserve the app's real groups
 * - User row toggles an account card with profile, settings and logout
 *
 * Desktop (lg+): Hidden - desktop uses horizontal topbar navigation
 */
const StudentSidebarRedesigned: React.FC<StudentSidebarRedesignedProps> = ({
  isMobileOpen = false,
  onMobileClose,
}) => {
  const { user, logout } = useAuth();
  const { addToast, clearToasts } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [accountOpen, setAccountOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(() => new Set());

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

  useEffect(() => {
    if (!isMobileOpen) {
      setAccountOpen(false);
    }
  }, [isMobileOpen]);

  useEffect(() => {
    if (!isMobileOpen) return;
    setExpandedRows((prev) => {
      const next = new Set(prev);
      NAV_ROWS.forEach((row) => {
        if (row.children?.some((child) => matchesPath(location.pathname, child.to))) {
          next.add(row.key);
        }
      });
      return next;
    });
  }, [isMobileOpen, location.pathname]);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isMobileOpen]);

  useEffect(() => {
    if (!isMobileOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onMobileClose?.();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMobileOpen, onMobileClose]);

  const handleLogout = async () => {
    await logout();
    clearToasts();
    addToast('Signed out successfully.', 'info');
    navigate('/login');
    onMobileClose?.();
  };

  const isPathActive = useCallback(
    (to: string) => matchesPath(location.pathname, to),
    [location.pathname],
  );

  const isRowActive = useCallback(
    (row: NavRow) => {
      if (row.to) return isPathActive(row.to);
      return Boolean(row.children?.some((child) => isPathActive(child.to)));
    },
    [isPathActive],
  );

  const toggleRow = (key: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const rankName = overview?.xpSummary?.progression?.rank ?? user?.rank ?? null;
  const userDisplayName = user?.username || user?.email || 'User';
  const streakDays = overview?.xpSummary?.streakDays;
  const streakValue =
    typeof streakDays === 'number' && Number.isFinite(streakDays) ? streakDays : null;
  const overviewCp = overview?.xpSummary?.cp;
  const cpValue = typeof user?.cp === 'number' ? user.cp : overviewCp;
  const rankDisplay = rankName || '-';

  const statCards = [
    { key: 'streak', label: 'Streak', value: streakValue ?? '-', icon: Flame, accent: true, isRank: false },
    { key: 'cp', label: 'Points', value: typeof cpValue === 'number' && Number.isFinite(cpValue) ? formatCompact(cpValue) : '-', icon: Coins, accent: false, isRank: false },
    { key: 'rank', label: 'Rank', value: rankDisplay, icon: Trophy, accent: false, isRank: true },
  ];

  const handleNavClick = () => {
    if (isMobileOpen) {
      onMobileClose?.();
    }
  };

  const renderUserRow = () => (
    <button
      type="button"
      onClick={() => setAccountOpen((open) => !open)}
      aria-expanded={accountOpen}
      aria-controls="mobile-account-panel"
      className="flex min-h-[60px] w-full items-center gap-[14px] rounded-xl px-2 text-left transition-colors hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
    >
      <Avatar name={userDisplayName} size={60} shape="square" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[24px] font-bold leading-tight text-text-primary">
          {userDisplayName}
        </span>
        <span className="mt-0.5 block truncate text-[16px] leading-tight text-text-muted">
          {rankDisplay}
        </span>
      </span>
      <ChevronDown
        className={cn(
          'h-6 w-6 shrink-0 text-text-muted transition-transform duration-150',
          accountOpen && 'rotate-180',
        )}
        aria-hidden="true"
      />
    </button>
  );

  const renderNavRow = (row: NavRow) => {
    const Icon = row.icon;
    const active = isRowActive(row);
    const hasChildren = Boolean(row.children?.length);
    const expanded = expandedRows.has(row.key);
    const rowClass = cn(
      'flex min-h-[64px] w-full items-center gap-5 rounded-xl px-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
      active ? 'bg-accent/10 text-accent' : 'text-text-primary hover:bg-surface-raised',
    );
    const labelClass = 'flex-1 truncate text-[20px] font-semibold';

    if (!hasChildren && row.to) {
      return (
        <NavLink
          key={row.key}
          to={row.to}
          end={row.to === '/dashboard'}
          onClick={handleNavClick}
          className={rowClass}
        >
          <Icon className="h-[26px] w-[26px] shrink-0 text-accent" strokeWidth={2} aria-hidden="true" />
          <span className={labelClass}>{row.label}</span>
        </NavLink>
      );
    }

    return (
      <div key={row.key}>
        <button
          type="button"
          onClick={() => toggleRow(row.key)}
          aria-expanded={expanded}
          aria-controls={`mobile-nav-${row.key}`}
          className={rowClass}
        >
          <Icon className="h-[26px] w-[26px] shrink-0 text-accent" strokeWidth={2} aria-hidden="true" />
          <span className={labelClass}>{row.label}</span>
          <ChevronDown
            className={cn(
              'h-6 w-6 shrink-0 text-text-muted transition-transform duration-150',
              expanded && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </button>

        {expanded && row.children?.length ? (
          <ul id={`mobile-nav-${row.key}`} className="mt-1 space-y-1">
            {row.children.map((child) => {
              const childActive = isPathActive(child.to);
              return (
                <li key={child.key}>
                  <NavLink
                    to={child.to}
                    onClick={handleNavClick}
                    className={cn(
                      'flex min-h-[56px] items-center gap-3 rounded-xl pl-[46px] pr-3 text-[18px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
                      childActive
                        ? 'bg-accent/10 font-medium text-accent'
                        : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary',
                    )}
                  >
                    <span className="flex-1 truncate">{child.label}</span>
                    {child.badgeKey === 'notifications' && unread > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-medium tabular-nums text-on-accent">
                        {unread > 99 ? '99+' : unread}
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    );
  };

  const renderAccountPanel = () => (
    <div className="px-5 pb-1 pt-2">
      <div className="rounded-xl border border-border-subtle bg-surface p-2">
        {ACCOUNT_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.key}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  'flex min-h-[64px] items-center gap-5 rounded-xl px-2 text-[20px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
                  isActive ? 'text-accent' : 'text-text-primary hover:bg-surface-raised',
                )
              }
            >
              <Icon className="h-[26px] w-[26px] shrink-0" strokeWidth={1.8} aria-hidden="true" />
              <span className="flex-1 truncate">{item.label}</span>
            </NavLink>
          );
        })}

        <button
          type="button"
          onClick={handleLogout}
          className="flex min-h-[64px] w-full items-center gap-5 rounded-xl px-2 text-left text-[20px] font-medium text-text-primary transition-colors hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
        >
          <LogOut className="h-[26px] w-[26px] shrink-0" strokeWidth={1.8} aria-hidden="true" />
          <span className="flex-1 truncate">Log Out</span>
        </button>
      </div>
    </div>
  );

  const renderSidebarContent = () => (
    <>
      <div className="flex h-[120px] shrink-0 items-center justify-between px-5">
        <Link
          to="/dashboard"
          onClick={handleNavClick}
          aria-label="QYVORA dashboard"
          className="flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Logo variant="mark" size="lg" />
        </Link>

        <button
          type="button"
          onClick={onMobileClose}
          aria-label="Close menu"
          className="flex h-11 w-11 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
        >
          <X className="h-7 w-7" aria-hidden="true" />
        </button>
      </div>

      <div className="custom-scrollbar sidebar-scroll flex-1 overflow-y-auto pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="px-5 pt-2">{renderUserRow()}</div>

        <div id="mobile-account-panel">
          <AnimatePresence initial={false}>
            {accountOpen && (
              <motion.div
                key="mobile-account-panel-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                {renderAccountPanel()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 grid grid-cols-[repeat(3,minmax(0,1fr))] gap-3 px-5">
          {statCards.map(({ key, label, value, icon: Icon, accent, isRank }) => (
            <CompactStatCard
              key={key}
              label={label}
              value={value}
              icon={<Icon aria-hidden="true" />}
              accent={accent}
              isRank={isRank}
            />
          ))}
        </div>

        <p className="mb-3 mt-7 px-6 text-[14px] text-text-muted">Menu</p>

        <nav aria-label="Primary" className="px-3">
          {NAV_ROWS.map(renderNavRow)}
        </nav>
      </div>
    </>
  );

  const mobileSidebar = isMobileOpen && (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[120] bg-canvas/80 backdrop-blur-sm lg:hidden"
        onClick={onMobileClose}
        aria-hidden="true"
      />

      {/* Full-screen sidebar — intentionally covers the topbar on mobile. */}
      <aside
        className="fixed inset-0 z-[130] flex h-dvh w-full flex-col overflow-hidden bg-canvas pt-[var(--app-safe-top,0px)] lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {renderSidebarContent()}
      </aside>
    </>
  );

  return (
    <>
      {mobileSidebar}
    </>
  );
};

StudentSidebarRedesigned.displayName = 'StudentSidebarRedesigned';

export default React.memo(StudentSidebarRedesigned);
