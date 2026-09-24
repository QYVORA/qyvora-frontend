import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Logo, QyvoraMark } from '@/shared/components/brand';
import { NAV_GROUPS } from '@/features/admin/components/layout/AdminTopbar/navGroups';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import ADMIN_PATH from '@/shared/utils/adminPath';
import { Tooltip } from '@/shared/components/ui/Tooltip';

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

/**
 * AdminSidebar — desktop (lg+) fixed navigation rail for the admin console.
 * Mirror of the student dashboard rail: sectioned NAV_GROUPS catalogue, active
 * state driven by the `?tab=` URL param, collapsible 264↔76px. Companion to the
 * mobile AdminBottomNav (below lg). Replaces the topbar quick tabs on desktop,
 * which become tablet-only.
 */
const AdminSidebar = ({ collapsed = false, onToggleCollapse }: AdminSidebarProps) => {
  const { logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';

  const handleLogout = async () => {
    await logout();
    addToast("Session terminated", 'info');
    navigate(ADMIN_PATH);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-[90] hidden flex-col border-r border-border-subtle bg-canvas transition-[width] duration-[var(--dur-base)] ease-[var(--ease-smooth)] lg:flex ${
        collapsed ? 'w-[76px]' : 'w-[264px]'
      }`}
    >
      <div className={`flex h-[80px] items-center border-b border-border-subtle ${collapsed ? 'justify-center px-0' : 'px-5'}`}>
        {collapsed ? <QyvoraMark className="h-7 w-7" /> : <Logo size="md" />}
      </div>

      <nav aria-label={"Admin"} className="custom-scrollbar flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <section key={group.title} className="mb-5">
            {!collapsed && (
              <h3 className="mb-1 type-label px-3 text-text-tertiary uppercase tracking-[0.12em]">
                {group.title}
              </h3>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = item.tab === currentTab;
                return (
                  <li key={item.path} className={collapsed ? 'flex justify-center' : ''}>
                    <Tooltip content={item.label} side="right" disabled={!collapsed}>
                      <Link
                        to={item.path}
                        className={`relative flex min-h-[48px] items-center rounded-xl py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
                          collapsed ? 'h-12 w-12 justify-center px-0' : 'gap-3 px-3'
                        } ${
                          active ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
                        }`}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-accent" aria-hidden="true" />
                        )}
                        <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                      </Link>
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>

      <div className="border-t border-border-subtle px-3 py-3">
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
          className={`flex min-h-[48px] w-full items-center rounded-xl py-2 text-sm text-text-secondary transition-colors hover:bg-semantic-danger/5 hover:text-semantic-danger focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
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

AdminSidebar.displayName = 'AdminSidebar';

export default AdminSidebar;