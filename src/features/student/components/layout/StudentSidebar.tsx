import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  Settings,
  LogOut,
  Cog,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { Logo, QyvoraMark } from '@/shared/components/brand';
import CpLogo from '@/shared/components/CpLogo';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import { extractCpBalance } from '@/shared/utils/cpBalance';
import api from '@/core/services/api';
import { Tooltip, TooltipProvider } from '@/shared/components/ui/Tooltip';

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
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: overview } = useStudentOverview();
  const [cpBalance, setCpBalance] = useState(user?.cp ?? 0);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (overview) setCpBalance(extractCpBalance(overview?.xpSummary) ?? user?.cp ?? 0);
  }, [overview, user?.uid]);

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
    addToast("Security session terminated.", 'info');
    navigate('/login');
  };

  const isSectionActive = (to: string) =>
    to === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(to);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-[90] hidden flex-col border-r border-border-subtle bg-canvas transition-[width] duration-[var(--dur-base)] ease-[var(--ease-smooth)] lg:flex ${
        collapsed ? 'w-[76px]' : 'w-[264px]'
      }`}
    >
      <div className={`flex h-[80px] items-center border-b border-border-subtle ${collapsed ? 'justify-center px-0' : 'px-5'}`}>
        {collapsed ? <QyvoraMark className="h-7 w-7" /> : <Logo size="md" />}
      </div>

      <nav aria-label={"Primary"} className="flex-1 overflow-y-auto px-3 py-4">
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
                        className={`flex min-h-[44px] items-center rounded-lg py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
                          collapsed ? 'h-11 w-11 justify-center px-0' : 'gap-3 px-3'
                        } ${
                          active ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
                        }`}
                      >
                        <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} aria-hidden="true" />
                        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                        {item.badgeKey === 'notifications' && unread > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-on-accent tabular-nums">
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
      </nav>

      <div className="border-t border-border-subtle px-3 py-3">
        {!collapsed && (
          <div className="mb-2 flex items-center justify-between gap-2 px-2">
            <CpLogo className="h-4 w-4" />
            <span className="type-label font-bold text-accent tabular-nums">{cpBalance.toLocaleString()}</span>
          </div>
        )}

        <div
          className={`mb-2 flex items-center justify-center gap-1.5 rounded-lg bg-surface-raised p-1.5 ${
            collapsed ? 'flex-col' : ''
          }`}
        >
          <TooltipProvider>
            <Tooltip content={"Terminal"}>
              <button type="button" onClick={openTerminal} aria-label={"Terminal"} className={`flex min-h-[44px] min-w-[44px] ${collapsed ? 'w-full' : 'flex-1'} items-center justify-center rounded-lg border border-transparent text-text-secondary transition-colors hover:border-border-subtle hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent`}>
                <TerminalIcon className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
            </Tooltip>
            <Tooltip content={"Network Lab"}>
              <button type="button" onClick={openNetwork} aria-label={"Network Lab"} className={`flex min-h-[44px] min-w-[44px] ${collapsed ? 'w-full' : 'flex-1'} items-center justify-center rounded-lg border border-transparent text-text-secondary transition-colors hover:border-border-subtle hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent`}>
                <Network className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
            </Tooltip>
            <Tooltip content={"Settings"}>
              <button type="button" onClick={() => navigate('/dashboard/settings')} aria-label={"Settings"} className={`flex min-h-[44px] min-w-[44px] ${collapsed ? 'w-full' : 'flex-1'} items-center justify-center rounded-lg border border-transparent text-text-secondary transition-colors hover:border-border-subtle hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent`}>
                <Cog className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
            </Tooltip>
          </TooltipProvider>
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`flex min-h-[44px] w-full items-center rounded-lg py-2 text-sm text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
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
          className={`flex min-h-[44px] w-full items-center rounded-lg py-2 text-sm text-text-secondary transition-colors hover:bg-semantic-danger/5 hover:text-semantic-danger focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
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

export default StudentSidebar;