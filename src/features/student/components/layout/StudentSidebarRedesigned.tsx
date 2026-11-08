import React, { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Bug,
  ShieldCheck,
  ShoppingBag,
  Swords,
  Network,
  Terminal as TerminalIcon,
  User,
  Bell,
  Award,
  Settings,
  LogOut,
  X,
  Trophy,
  Hash,
  ChevronDown,
  Maximize,
  Minimize,
} from 'lucide-react';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import api from '@/core/services/api';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import StreakIcon from '@/shared/components/icons/StreakIcon';
import { useFullscreen } from '@/shared/hooks/useFullscreen';

interface NavEntry {
  key: string;
  label: string;
  icon: React.ElementType;
  to: string;
  badgeKey?: 'notifications';
}

interface NavSection {
  title: string;
  items: NavEntry[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Main',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: Home, to: '/dashboard' },
      { key: 'courses', label: 'Learn', icon: BookOpen, to: '/dashboard/courses' },
    ],
  },
  {
    title: 'Practice',
    collapsible: true,
    defaultCollapsed: false,
    items: [
      { key: 'bootcamp', label: 'Bootcamp', icon: ShieldCheck, to: '/dashboard/bootcamps' },
      { key: 'labs', label: 'Labs', icon: Bug, to: '/dashboard/labs' },
    ],
  },
  {
    title: 'Compete',
    collapsible: true,
    defaultCollapsed: false,
    items: [
      { key: 'competitive', label: 'Competitive', icon: Swords, to: '/dashboard/competitive' },
    ],
  },
  {
    title: 'Develop',
    collapsible: true,
    defaultCollapsed: false,
    items: [
      { key: 'networks', label: 'Network', icon: Network, to: '/dashboard/networks' },
      { key: 'terminal', label: 'Terminal', icon: TerminalIcon, to: '/dashboard/tools/terminal' },
    ],
  },
  {
    title: 'Account',
    items: [
      { key: 'profile', label: 'Profile', icon: User, to: '/dashboard/profile' },
      { key: 'certificates', label: 'Certificates', icon: Award, to: '/dashboard/certificates' },
      { key: 'notifications', label: 'Notifications', icon: Bell, to: '/dashboard/notifications', badgeKey: 'notifications' },
      { key: 'settings', label: 'Settings', icon: Settings, to: '/dashboard/settings' },
      { key: 'marketplace', label: 'Marketplace', icon: ShoppingBag, to: '/dashboard/marketplace' },
    ],
  },
];

interface StudentSidebarRedesignedProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

/**
 * StudentSidebarRedesigned — Mobile-only sidebar for student dashboard
 * 
 * Mobile (<lg): Full-screen overlay sidebar with collapsible sections
 * - Opens from hamburger in topbar
 * - Full viewport width and height
 * - Close X button, backdrop click, navigation selection, or Escape key
 * - User profile section with avatar, name, rank
 * - Three statistics cards: Streak, CP Points, Rank
 * - Collapsible navigation sections (Practice, Compete, Develop)
 * - Footer with Terminal, Network, Logout
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
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  // Initialize collapsed sections state (sections can be collapsed by default)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    NAV_SECTIONS.forEach(section => {
      if (section.collapsible && section.defaultCollapsed) {
        initial.add(section.title);
      }
    });
    return initial;
  });
  
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
  
  // Prevent background scrolling when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isMobileOpen]);
  
  // Close mobile sidebar on Escape key
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

  const isSectionActive = useCallback(
    (to: string) =>
      to === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(to),
    [location.pathname],
  );
  
  const toggleSection = (title: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };
  
  const rankName = overview?.xpSummary?.progression?.rank ?? user?.rank ?? "Candidate";
  
  // Get user display info
  const userDisplayName = user?.username || user?.email || "User";
  const userInitial = userDisplayName.charAt(0).toUpperCase();
  
  // Handle navigation click on mobile
  const handleNavClick = () => {
    if (isMobileOpen) {
      onMobileClose?.();
    }
  };
  
  // Only render mobile sidebar (desktop uses horizontal topbar)
  const mobileSidebar = isMobileOpen && (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-x-0 bottom-0 top-[calc(3.5rem+env(safe-area-inset-top))] z-[90] bg-canvas/80 backdrop-blur-sm md:top-[calc(4rem+env(safe-area-inset-top))] lg:hidden"
        onClick={onMobileClose}
        aria-hidden="true"
      />

      {/* Sidebar — starts below the fixed topbar so the dashboard header stays visible. */}
      <aside
        className="fixed inset-x-0 bottom-0 left-0 top-[calc(3.5rem+env(safe-area-inset-top))] z-[95] flex w-full flex-col border-r border-border-subtle bg-canvas md:top-[calc(4rem+env(safe-area-inset-top))] lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {renderSidebarContent(true)}
      </aside>
    </>
  );
  
  function renderSidebarContent(isMobile: boolean) {
    const showFullContent = true; // Mobile sidebar always shows full content
    
    return (
      <>
        {/* Menu toolbar */}
        <div className="flex h-16 items-center justify-between px-5">
          <span className="type-label uppercase tracking-[0.12em] text-text-tertiary">
            Menu
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-surface-raised hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Maximize className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            {isMobile && (
              <button
                type="button"
                onClick={onMobileClose}
                aria-label="Close menu"
                className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-surface-raised hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="custom-scrollbar sidebar-scroll flex-1 overflow-y-auto">
          {/* User Profile Section (only when expanded/mobile) */}
          {showFullContent && (
            <div className="px-5 py-5">
              <Link
                to="/dashboard/profile"
                onClick={handleNavClick}
                className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
              >
                {/* Avatar */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-surface text-lg font-black text-accent transition-all duration-200 group-hover:shadow-lg group-hover:shadow-accent/20">
                  {userInitial}
                </div>
                
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-mono text-sm font-bold text-text-primary">
                      {userDisplayName}
                    </p>
                    <ChevronDown className="h-3 w-3 text-text-tertiary" aria-hidden="true" />
                  </div>
                  <p className="type-meta text-text-muted">
                    {rankName}
                  </p>
                </div>
              </Link>
            </div>
          )}
          
          {/* Navigation */}
          <nav aria-label="Primary" className="px-3 py-4">
            {NAV_SECTIONS.map((section) => {
                  const isSectionCollapsed = collapsedSections.has(section.title);
                  const showSectionContent = !isSectionCollapsed || !showFullContent;
                  
                  return (
                    <section key={section.title} className="mb-6">
                      {showFullContent && (
                        <div className="mb-2 px-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-wider text-text-tertiary">
                              {section.title}
                            </h3>
                            {section.collapsible && (
                              <button
                                type="button"
                                onClick={() => toggleSection(section.title)}
                                aria-expanded={!isSectionCollapsed}
                                className="flex h-6 w-6 items-center justify-center rounded text-accent transition-all duration-200 hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                              >
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform duration-200 ${isSectionCollapsed ? '-rotate-90' : ''}`}
                                  aria-hidden="true"
                                />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {showSectionContent && (
                        <ul className="space-y-0.5">
                          {section.items.map((item) => {
                            const Icon = item.icon;
                            const active = isSectionActive(item.to);
                            return (
                              <li key={item.key}>
                                <NavLink
                                  to={item.to}
                                  onClick={handleNavClick}
                                  data-tour-id={item.key === 'profile' ? 'tour-profile-sidebar' : undefined}
                                  className={`group relative flex min-h-[48px] items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors duration-[var(--dur-fast)] ease-[var(--ease-smooth)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
                                    active ? 'bg-accent/10 font-medium text-accent' : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
                                  }`}
                                >
                                  {active && (
                                    <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-accent" aria-hidden="true" />
                                  )}
                                  <Icon
                                    className={`h-[18px] w-[18px] shrink-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:scale-110 ${
                                      active ? 'text-accent' : 'text-accent/70'
                                    }`}
                                    strokeWidth={active ? 2.5 : 2}
                                    aria-hidden="true"
                                  />
                                  <span className="flex-1 truncate">{item.label}</span>
                                  {item.badgeKey === 'notifications' && unread > 0 && (
                                    <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-accent px-1 text-[10px] font-black text-on-accent tabular-nums">
                                      {unread > 99 ? '99+' : unread}
                                    </span>
                                  )}
                                </NavLink>
                              </li>
                            );
                      })}
                        </ul>
                      )}
                    </section>
                  );
                })}
          </nav>
        </div>
        
        {/* Footer - Logout only */}
        <div className="px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
            className="flex min-h-[48px] w-full items-center gap-3 rounded-xl border border-semantic-danger/25 bg-semantic-danger/10 px-3 py-2 text-sm font-bold text-semantic-danger transition-colors hover:bg-semantic-danger/15 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-semantic-danger"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            <span>Log Out</span>
          </button>
        </div>
      </>
    );
  }
  
  return (
    <>
      {mobileSidebar}
    </>
  );
};

StudentSidebarRedesigned.displayName = 'StudentSidebarRedesigned';

export default React.memo(StudentSidebarRedesigned);
