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
  User,
  Bell,
  Award,
  Settings,
  LogOut,
  X,
  Trophy,
  Hash,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react';
import { QyvoraMark, Logo } from '@/shared/components/brand';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import api from '@/core/services/api';
import { useLearningContext } from '@/core/hooks/useLearningContext';
import { LearningCurriculumTree } from '@/shared/components/learning/LearningCurriculumTree';
import Button from '@/shared/components/ui/Button';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import { extractCpBalance } from '@/shared/utils/cpBalance';
import StreakIcon from '@/shared/components/icons/StreakIcon';

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
      { key: 'networks', label: 'Networks', icon: Network, to: '/dashboard/networks' },
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
  collapsed?: boolean;
  onToggleCollapse?: () => void;
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
 * - Learning mode curriculum tree
 * - Footer with Terminal, Network, Logout
 * 
 * Desktop (lg+): Hidden - desktop uses horizontal topbar navigation
 */
const StudentSidebarRedesigned: React.FC<StudentSidebarRedesignedProps> = ({
  collapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  // Detect if we're on a learning page
  const learningContext = useLearningContext();
  const isLearningMode = Boolean(learningContext);
  
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
    addToast("Security session terminated.", 'info');
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
  
  // Helper to get current curriculum item ID based on learning context
  const getCurrentCurriculumItemId = (context: typeof learningContext) => {
    if (!context) return '';
    
    if (context.type === 'bootcamp' && context.roomId) {
      return context.roomId;
    }
    
    if (context.type === 'course' && context.currentLessonIdx !== undefined) {
      return `lesson-${context.currentLessonIdx}`;
    }
    
    if (context.type === 'lab' && context.currentScenarioIdx !== undefined) {
      return `scenario-${context.currentScenarioIdx}`;
    }
    
    return '';
  };
  
  // Calculate statistics
  const streakDays = overview?.xpSummary?.streakDays ?? 0;
  const cpBalance = extractCpBalance(overview?.xpSummary) ?? user?.cp ?? 0;
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
        className="fixed inset-0 z-[120] bg-canvas/80 backdrop-blur-sm lg:hidden"
        onClick={onMobileClose}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-[130] flex w-full flex-col border-r border-border-subtle bg-canvas lg:hidden"
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
        {/* Brand Header */}
        <div className={`flex h-16 items-center md:h-20 ${
          showFullContent ? 'justify-between px-5' : 'justify-center px-0'
        }`}>
          <Link
            to="/dashboard"
            onClick={handleNavClick}
            aria-label="QYVORA — Home"
            className="group rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {showFullContent ? (
              <Logo
                className="h-8 transition-transform duration-[var(--dur-fast)] ease-[var(--ease-smooth)] group-hover:scale-105"
                aria-hidden="true"
              />
            ) : (
              <QyvoraMark
                className="h-8 w-8 shrink-0 transition-transform duration-[var(--dur-fast)] ease-[var(--ease-smooth)] group-hover:scale-105"
                aria-hidden="true"
              />
            )}
          </Link>
          
          {/* Close button (mobile only) */}
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
        
        {/* Scrollable Content */}
        <div className="custom-scrollbar sidebar-scroll flex-1 overflow-y-auto">
          {/* User Profile Section (only when expanded/mobile) */}
          {showFullContent && !isLearningMode && (
            <div className="px-5 py-5">
              <Link
                to="/dashboard/profile"
                onClick={handleNavClick}
                className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
              >
                {/* Avatar */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-border-subtle bg-surface text-lg font-black text-accent">
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
          
          {/* Statistics Cards (only when expanded/mobile, not in learning mode) - REMOVED */}
          {/* We'll show stats naturally in the navigation flow instead */}
                  <StreakIcon size={20} className="mb-2" />
                  <p className="text-lg font-black text-text-primary tabular-nums">
                    {streakDays}
                  </p>
          
          {/* Navigation */}
          <nav aria-label={isLearningMode ? "Learning curriculum" : "Primary"} className="px-3 py-4">
            {isLearningMode && learningContext ? (
              /* ══════════════════════════════════════════════════════════════
                 LEARNING MODE - Curriculum tree navigation
                 ══════════════════════════════════════════════════════════════ */
              <>
                {/* Back to Dashboard button */}
                {showFullContent && (
                  <div className="mb-4">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate(learningContext.exitPath);
                        handleNavClick();
                      }}
                      className="-ml-2 w-full justify-start gap-2 text-text-secondary hover:text-accent"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Dashboard
                    </Button>
                  </div>
                )}
                
                {/* Context title */}
                {showFullContent && (
                  <div className="mb-3">
                    <h3 className="type-label px-3 text-text-tertiary uppercase tracking-[0.12em]">
                      {learningContext.title}
                    </h3>
                  </div>
                )}
                
                {/* Curriculum tree */}
                <LearningCurriculumTree
                  items={learningContext.curriculum}
                  activeId={getCurrentCurriculumItemId(learningContext)}
                  collapsed={collapsed && !isMobile}
                />
              </>
            ) : (
              /* ══════════════════════════════════════════════════════════════
                 DASHBOARD MODE - Standard navigation sections
                 ══════════════════════════════════════════════════════════════ */
              <>
                {/* Menu heading */}
                <div className="mb-4 px-3">
                  <h2 className="text-sm font-bold text-text-primary">Menu</h2>
                </div>
                
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
                                className="flex h-6 w-6 items-center justify-center rounded text-text-tertiary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
                              >
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${isSectionCollapsed ? '-rotate-90' : ''}`}
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
                                    className={`h-[18px] w-[18px] shrink-0 transition-transform duration-[var(--dur-fast)] ease-[var(--ease-smooth)] group-hover:translate-x-0.5 ${
                                      active ? 'text-accent' : ''
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
              </>
            )}
          </nav>
        </div>
        
        {/* Footer - Logout only */}
        <div className="px-3 py-4">
          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-[48px] w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-semantic-danger/10 hover:text-semantic-danger focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
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
