import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Map, BookOpen, Swords, Globe, BarChart3,
  ShoppingBag, Bell, Settings,
} from 'lucide-react';
import Logo from '@/shared/components/brand/Logo';

const PRIMARY_NAV = [
  { label: 'Dashboard',    icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Learning Paths', icon: Map,           path: '/dashboard/bootcamps' },
  { label: 'Rooms',        icon: BookOpen,        path: '/dashboard/bootcamps/bc_1775270338500' },
  { label: 'Competitive',  icon: Swords,          path: '/dashboard/competitive' },
  { label: 'Networks',     icon: Globe,           path: '/dashboard/networks' },
  { label: 'My Progress',  icon: BarChart3,       path: '/dashboard/profile' },
];

const SECONDARY_NAV = [
  { label: 'Market',      icon: ShoppingBag, path: '/dashboard/marketplace' },
  { label: 'Notifications', icon: Bell,      path: '/dashboard/notifications' },
  { label: 'Settings',    icon: Settings,    path: '/dashboard/settings' },
];

const Sidebar = () => {
  const { pathname } = useLocation();

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[240px] bg-bg border-r border-border z-40">
      {/* Logo */}
      <div className="h-20 md:h-24 flex items-center px-6 border-b border-border">
        <Link to="/dashboard">
          <Logo size="lg" />
        </Link>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3 pt-4 overflow-y-auto">
        {PRIMARY_NAV.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${
                active
                  ? 'text-accent bg-accent-dim'
                  : 'text-text-muted hover:text-text-primary hover:bg-accent-dim/50'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Divider + secondary nav */}
      <div className="px-3 pb-4 border-t border-border pt-3">
        {SECONDARY_NAV.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${
                active
                  ? 'text-accent bg-accent-dim'
                  : 'text-text-muted hover:text-text-primary hover:bg-accent-dim/50'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
