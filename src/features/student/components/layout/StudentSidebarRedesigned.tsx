import React, { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
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
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import api from '@/core/services/api';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import { Avatar } from '@/shared/components/ui';

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
    title: 'Learn',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: Home, to: '/dashboard' },
      { key: 'labs', label: 'Labs', icon: BookOpen, to: '/dashboard/labs' },
    ],
  },
  {
    title: 'Practice',
    collapsible: true,
    defaultCollapsed: false,
    items: [
      { key: 'bootcamp', label: 'Bootcamp', icon: ShieldCheck, to: '/dashboard/bootcamps' },
      { key: 'networks', label: 'Network', icon: Network, to: '/dashboard/networks' },
      { key: 'terminal', label: 'Terminal', icon: TerminalIcon, to: '/dashboard/tools/terminal' },
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
    title: 'Account',
    items: [
      { key: 'profile', label: 'Profile', icon: User, to: '/dashboard/profile' },
      { key: 'certificates', label: 'Certificates', icon: Award, to: '/dashboard/certificates' },
      { key: 'notifications', label: 'Notifications', icon: Bell, to: '/dashboard/notifications', badgeKey: 'notifications' },
      { key: 'marketplace', label: 'Marketplace', icon: ShoppingBag, to: '/dashboard/marketplace' },
      { key: 'settings', label: 'Settings', icon: Settings, to: '/dashboard/settings' },
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
        className="fixed inset-0 z-[120] bg-canvas/80 backdrop-blur-sm lg:hidden"
        onClick={onMobileClose}
        aria-hidden="true"
      />

      {/* Full-screen sidebar — intentionally covers the topbar on mobile. */}
      <aside
        className="fixed inset-0 z-[130] flex h-dvh w-full flex-col overflow-hidden border-r border-border-subtle bg-surface pt-[var(--app-safe-top,0px)] lg:hidden"
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
        <div className="flex h-20 items-center justify-between px-5">
          <span className="type-label uppercase tracking-[0.12em] text-text-tertiary">
            Menu
          </span>

          <div className="flex items-center gap-1">
            {isMobile && (
              <button
                type="button"
                onClick={onMobileClose}
                aria-label="Close menu"
                className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
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
                <Avatar name={userDisplayName} size={48} ring />

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[15px] font-medium text-text-primary">
                      {userDisplayName}
                    </p>
                  </div>
                  <p className="text-sm text-text-muted">
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
                            <h3 className="text-xs font-medium uppercase tracking-[0.08em] text-text-muted">
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
                                  className={`relative flex min-h-[48px] items-center gap-3 rounded-lg px-3 py-2 text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
                                    active ? 'bg-accent/10 font-medium text-accent' : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
                                  }`}
                                >
                                  <Icon
                                    className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-accent' : 'text-text-muted'}`}
                                    strokeWidth={active ? 2.2 : 1.8}
                                    aria-hidden="true"
                                  />
                                  <span className="flex-1 truncate">{item.label}</span>
                                  {item.badgeKey === 'notifications' && unread > 0 && (
                                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-medium text-on-accent tabular-nums">
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
            className="flex min-h-[48px] w-full items-center gap-3 rounded-lg border border-semantic-danger/30 px-3 py-2 text-[15px] font-medium text-semantic-danger transition-colors hover:bg-semantic-danger/10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-semantic-danger"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            <span>Sign out</span>
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
