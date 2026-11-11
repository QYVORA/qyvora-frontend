import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BadgeCheck,
  Bell,
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Maximize,
  Minimize,
  Settings,
  Sun,
  Moon,
  User,
} from 'lucide-react';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import { useFullscreen } from '@/shared/hooks/useFullscreen';
import { LIGHT_THEME_ENABLED, useThemeContext } from '@/core/contexts/ThemeContext';
import { Avatar, Badge, Menu, MenuItem, MenuSeparator } from '@/shared/components/ui';

export interface AvatarMenuStats {
  streakDays: number;
  cp: number;
  rank: string;
}

interface AvatarMenuProps {
  unread?: number;
  stats?: AvatarMenuStats;
}

/**
 * AvatarMenu — the signed-in account menu shared by public and app topbars.
 * Reads identity from `useAuth()` only; stats are passed in by the shell that
 * already fetched them. "Dashboard" appears only when off the dashboard.
 */
const AvatarMenu: React.FC<AvatarMenuProps> = ({ unread = 0, stats }) => {
  const { user, logout } = useAuth();
  const { addToast, clearToasts } = useToast();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { mode, toggleTheme } = useThemeContext();

  if (!user) return null;

  const userDisplayName = user.username || user.email || 'User';
  const showDashboard = !pathname.startsWith('/dashboard');

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    clearToasts();
    addToast('Signed out successfully.', 'info');
    navigate('/login');
  };

  return (
    <div className="relative">
      <button
        type="button"
        data-menu-trigger
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="relative flex h-10 items-center gap-1.5 rounded-full pl-0.5 pr-2 transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Avatar name={userDisplayName} size={32} />
        <ChevronDown
          className={`h-4 w-4 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
        {unread > 0 && (
          <span
            className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-surface-raised bg-accent"
            aria-label={`${unread} unread notifications`}
          />
        )}
      </button>

      <Menu
        open={open}
        onClose={() => setOpen(false)}
        className="absolute right-0 top-full mt-2 w-[300px]"
        labelledBy="avatar-menu-label"
      >
        <div id="avatar-menu-label" className="px-3 pb-3 pt-2">
          <div className="flex items-center gap-3">
            <Avatar name={userDisplayName} size={40} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-medium text-text-primary">{userDisplayName}</p>
              <p className="truncate text-sm text-text-muted">{user.email}</p>
            </div>
            {stats?.rank && <Badge variant="accent" pill>{stats.rank}</Badge>}
          </div>
          {stats && (
            <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-border-subtle pt-3">
              <div className="text-center">
                <dd className="text-base font-medium tabular-nums text-text-primary">{stats.streakDays}</dd>
                <dt className="text-xs text-text-muted">Day streak</dt>
              </div>
              <div className="text-center">
                <dd className="text-base font-medium tabular-nums text-text-primary">{stats.cp}</dd>
                <dt className="text-xs text-text-muted">CP</dt>
              </div>
              <div className="text-center">
                <dd className="truncate text-base font-medium text-text-primary">{stats.rank}</dd>
                <dt className="text-xs text-text-muted">Rank</dt>
              </div>
            </dl>
          )}
        </div>
        <MenuSeparator />
        <MenuItem icon={<User />} to="/dashboard/profile" onClick={() => setOpen(false)}>
          View profile
        </MenuItem>
        {showDashboard && (
          <MenuItem icon={<LayoutDashboard />} to="/dashboard" onClick={() => setOpen(false)}>
            Dashboard
          </MenuItem>
        )}
        <MenuItem
          icon={<Bell />}
          to="/dashboard/notifications"
          onClick={() => setOpen(false)}
          trailing={unread > 0 ? unread : undefined}
        >
          Notifications
        </MenuItem>
        <MenuItem icon={<Settings />} to="/dashboard/settings" onClick={() => setOpen(false)}>
          Settings
        </MenuItem>
        <MenuSeparator />
        <MenuItem icon={<BadgeCheck />} to="/dashboard/certificates" onClick={() => setOpen(false)}>
          Certificates
        </MenuItem>
        <MenuItem icon={<BookOpen />} to="/dashboard/marketplace" onClick={() => setOpen(false)}>
          Marketplace
        </MenuItem>
        <MenuSeparator />
        <MenuItem icon={isFullscreen ? <Minimize /> : <Maximize />} onClick={toggleFullscreen}>
          {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        </MenuItem>
        {LIGHT_THEME_ENABLED && (
          <MenuItem icon={mode === 'dark' ? <Sun /> : <Moon />} onClick={toggleTheme}>
            {mode === 'dark' ? 'Light mode' : 'Dark mode'}
          </MenuItem>
        )}
        <MenuSeparator />
        <MenuItem icon={<LogOut />} danger onClick={handleLogout}>
          Log out
        </MenuItem>
      </Menu>
    </div>
  );
};

export default AvatarMenu;
