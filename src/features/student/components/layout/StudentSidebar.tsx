import React, { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Terminal as TerminalIcon,
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
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
} from 'lucide-react';
import { QyvoraMark, Logo } from '@/shared/components/brand';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import api from '@/core/services/api';
import { Tooltip, TooltipProvider } from '@/shared/components/ui/Tooltip';
import { useLearningContext } from '@/core/hooks/useLearningContext';
import { LearningCurriculumTree } from '@/shared/components/learning/LearningCurriculumTree';
import Button from '@/shared/components/ui/Button';

interface NavEntry {
  key: string;
  label: string;
  icon: React.ElementType;
  to: string;
  badgeKey?: 'notifications';
}

const NAV_SECTIONS: { title: string; items: NavEntry[] }[] = [
  {
    title: 'Main',
    items: [
      { key: 'dashboard', label: 'Home', icon: Home, to: '/dashboard' },
      { key: 'courses', label: 'Courses', icon: BookOpen, to: '/dashboard/courses' },
      { key: 'bootcamp', label: 'Bootcamp', icon: ShieldCheck, to: '/dashboard/bootcamps' },
      { key: 'labs', label: 'Labs', icon: Bug, to: '/dashboard/labs' },
      { key: 'marketplace', label: 'Marketplace', icon: ShoppingBag, to: '/dashboard/marketplace' },
    ],
  },
  {
    title: 'Practice',
    items: [
      { key: 'competitive', label: 'Competitive', icon: Swords, to: '/dashboard/competitive' },
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
    ],
  },
];

/**
 * StudentSidebar — desktop (lg+) fixed navigation rail. Main / Practice /
 * Account sections, utilities (terminal · code · network) and quick logout.
 * Companion to the mobile StudentBottomNav. `collapsed` narrows the rail to
 * icons only; the collapse control is owned by the App shell.
 */
const StudentSidebar: React.FC<{ collapsed?: boolean; onToggleCollapse?: () => void }> = ({
  collapsed = false,
  onToggleCollapse,
}) => {
  const { logout } = useAuth();
  const { addToast, clearToasts } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  
  // Detect if we're on a learning page
  const learningContext = useLearningContext();
  const isLearningMode = Boolean(learningContext);

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

  const openTerminal = () => window.dispatchEvent(new CustomEvent('qyvora:open-terminal'));
  const openNetwork = () => window.dispatchEvent(new CustomEvent('qyvora:open-network-visualizer'));

  const handleLogout = async () => {
    await logout();
    clearToasts();
    addToast('Signed out successfully.', 'info');
    navigate('/login');
  };

  const isSectionActive = useCallback(
    (to: string) =>
      to === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(to),
    [location.pathname],
  );
  
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

  return (
    <aside
      className={`chrome-fixed fixed inset-y-0 left-0 z-[90] hidden flex-col border-r border-border-subtle bg-canvas transition-[width] duration-[var(--dur-base)] ease-[var(--ease-smooth)] lg:flex ${
        collapsed ? 'w-[76px]' : 'w-[264px]'
      }`}
    >
      {/* Brand header height matches the shell topbar so the two horizontal
          rules line up across the sidebar / content divide. The identity block
          renders the mark + logotype + status LED directly — no cropped
          wordmark wrapper — so it reads as a terminal identity plate. */}
      <div className={`flex h-20 items-center border-b border-border-subtle md:h-24 ${collapsed ? 'justify-center px-0' : 'px-5'}`}>
        <Link
          to="/dashboard"
          aria-label="QYVORA — Home"
          className="group rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {collapsed ? (
            <QyvoraMark
              className="h-8 w-8 shrink-0 transition-transform duration-[var(--dur-fast)] ease-[var(--ease-smooth)] group-hover:scale-105"
              aria-hidden="true"
            />
          ) : (
            <Logo
              className="h-8 transition-transform duration-[var(--dur-fast)] ease-[var(--ease-smooth)] group-hover:scale-105"
              aria-hidden="true"
            />
          )}
        </Link>
      </div>

      <nav aria-label={isLearningMode ? "Learning curriculum" : "Primary"} className="custom-scrollbar sidebar-scroll flex-1 overflow-y-auto px-3 py-4">
        {isLearningMode && learningContext ? (
          /* ══════════════════════════════════════════════════════════════
             LEARNING MODE - Curriculum tree navigation
             ══════════════════════════════════════════════════════════════ */
          <>
            {/* Back to Dashboard button */}
            {!collapsed && (
              <div className="mb-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate(learningContext.exitPath)}
                  className="-ml-2 w-full justify-start gap-2 text-text-secondary hover:text-accent"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </div>
            )}
            
            {/* Context title */}
            {!collapsed && (
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
              collapsed={collapsed}
            />
          </>
        ) : (
          /* ══════════════════════════════════════════════════════════════
             DASHBOARD MODE - Standard navigation sections
             ══════════════════════════════════════════════════════════════ */
          <>
            {NAV_SECTIONS.map((section) => (
          <section key={section.title} className="mb-5">
            {!collapsed && (
              <h3 className="mb-1 type-label px-3 text-text-tertiary uppercase tracking-[0.12em]">
                {section.title}
              </h3>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isSectionActive(item.to);
                return (
                  <li key={item.key} className={collapsed ? 'flex justify-center' : ''}>
                    <Tooltip content={item.label} side="right" disabled={!collapsed}>
                      <NavLink
                        to={item.to}
                        data-tour-id={item.key === 'profile' ? 'tour-profile-sidebar' : undefined}
                        className={`group relative flex min-h-[48px] items-center rounded-xl py-2 text-sm transition-colors duration-[var(--dur-fast)] ease-[var(--ease-smooth)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
                          collapsed ? 'h-12 w-12 justify-center px-0' : 'gap-3 px-3'
                        } ${
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
                        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                        {item.badgeKey === 'notifications' && unread > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-accent px-1 text-[10px] font-black text-on-accent tabular-nums">
                            {unread > 99 ? '99+' : unread}
                          </span>
                        )}
                      </NavLink>
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
          </>
        )}
      </nav>

      <div className="border-t border-border-subtle px-3 py-3">
        {/* Utility cluster — tools that live outside the page navigation tree.
            Persistent navigation stays in the sections above, so Settings is
            not repeated here. */}
        {!collapsed && (
          <p className="type-label mb-1.5 px-3 text-[10px] uppercase tracking-[0.14em] text-text-tertiary">
            <span aria-hidden="true" className="text-accent">
              //&nbsp;
            </span>
            Tools
          </p>
        )}
        <div
          className={`mb-2 flex items-center justify-center gap-1.5 rounded-xl bg-surface-raised p-1.5 ${
            collapsed ? 'flex-col' : ''
          }`}
        >
          <TooltipProvider>
            <Tooltip content={"Terminal"}>
              <button type="button" onClick={openTerminal} aria-label={"Terminal"} className={`flex min-h-[48px] min-w-[48px] ${collapsed ? 'w-full' : 'flex-1'} items-center justify-center rounded-xl border border-transparent text-text-secondary transition-colors hover:border-border-subtle hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent`}>
                <TerminalIcon className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
            </Tooltip>
            <Tooltip content={"Network Lab"}>
              <button type="button" onClick={openNetwork} aria-label={"Network Lab"} className={`flex min-h-[48px] min-w-[48px] ${collapsed ? 'w-full' : 'flex-1'} items-center justify-center rounded-xl border border-transparent text-text-secondary transition-colors hover:border-border-subtle hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent`}>
                <Network className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
            </Tooltip>
          </TooltipProvider>
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`flex min-h-[48px] w-full items-center rounded-xl py-2 text-sm text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
            collapsed ? 'justify-center px-0' : 'gap-3 px-3'
          }`}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          )}
          {!collapsed && <span>{"Collapse sidebar"}</span>}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          title="Log out"
          aria-label="Log out"
          className={`flex min-h-[48px] w-full items-center rounded-xl border border-semantic-danger/25 bg-semantic-danger/10 py-2 text-sm font-bold text-semantic-danger transition-colors hover:bg-semantic-danger/15 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-semantic-danger ${
            collapsed ? 'justify-center px-0' : 'gap-3 px-3'
          }`}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          {!collapsed && <span>{"Log Out"}</span>}
        </button>
      </div>
    </aside>
  );
};

StudentSidebar.displayName = 'StudentSidebar';

export default React.memo(StudentSidebar);