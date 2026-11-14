import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ChevronDown,
  CircleUserRound,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  User,
  Wrench,
} from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import PwaInstallButton from '@/shared/components/ui/PwaInstallButton';
import { Avatar } from '@/shared/components/ui';
import { Logo } from '@/shared/components/brand';
import { cn } from '@/shared/utils/cn';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import SiteTopbar from './SiteTopbar';
import type { NavItem } from './SiteTopbar';
import MobileMenu from './MobileMenu';
import AvatarMenu from './AvatarMenu';

const ICONS = {
  learn: BookOpen,
  bootcamp: GraduationCap,
  tools: Wrench,
  research: FlaskConical,
  services: ShieldCheck,
  about: CircleUserRound,
} as const;

const PUBLIC_ITEMS: NavItem[] = [
  {
    key: 'learn',
    label: 'Learn',
    to: '/learn',
    icon: ICONS.learn,
    children: [
      { label: 'Labs', to: '/learn?tab=labs', icon: BookOpen },
      { label: 'Bootcamp', to: '/hpb', icon: GraduationCap },
      { label: 'Simulations', to: '/simulations', icon: FlaskConical },
      { label: 'CyberPoints', to: '/cp', icon: ShieldCheck },
    ],
  },
  {
    key: 'services',
    label: 'Services',
    to: '/services',
    icon: ICONS.services,
    children: [
      { label: 'All services', to: '/services' },
      { label: 'Basic web app pentest', to: '/services/basic-web-application-pentest' },
      { label: 'Standard web app pentest', to: '/services/standard-web-application-pentest' },
      { label: 'Employee bootcamp', to: '/services/employee-cybersecurity-bootcamp' },
    ],
  },
  {
    key: 'tools',
    label: 'Tools',
    to: '/tools',
    icon: ICONS.tools,
    children: [
      { label: 'All tools', to: '/tools' },
      { label: 'anansi', to: '/anansi' },
      { label: 'toha3ee', to: '/toha3ee' },
      { label: 'jabari', to: '/jabari' },
      { label: 'nzinga', to: '/nzinga' },
      { label: 'shaka', to: '/shaka' },
      { label: 'imhotep', to: '/imhotep' },
    ],
  },
  { key: 'blogs', label: 'Blogs', to: '/blogs', icon: ICONS.research },
  { key: 'resources', label: 'Resources', to: '/resources', icon: ICONS.bootcamp },
  { key: 'about', label: 'About', to: '/about', icon: ICONS.about },
];

const isActive = (item: NavItem, pathname: string) => {
  if (item.key === 'learn') {
    return pathname === '/learn' || pathname === '/hpb' || pathname === '/simulations' || pathname === '/cp';
  }
  if (item.key === 'tools') {
    return pathname.startsWith('/tools') || ['/anansi', '/toha3ee', '/jabari', '/nzinga', '/shaka', '/imhotep'].includes(pathname);
  }
  if (item.key === 'services') return pathname.startsWith('/services');
  if (item.key === 'blogs') return pathname.startsWith('/blogs');
  if (item.key === 'resources') return pathname.startsWith('/resources');
  return pathname.startsWith(item.to ?? '');
};

const MOBILE_ACCOUNT_LINKS = [
  { key: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { key: 'profile', label: 'View profile', to: '/dashboard/profile', icon: User },
  { key: 'settings', label: 'Settings', to: '/dashboard/settings', icon: Settings },
] as const;

/**
 * PublicNavigation — thin wrapper around the shared SiteTopbar. Public items
 * only; the account slot shows auth CTAs or the shared AvatarMenu.
 */
const PublicNavigation: React.FC = () => {
  const { user, logout } = useAuth();
  const { addToast, clearToasts } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
    setAccountOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    clearToasts();
    addToast('Signed out successfully.', 'info');
    closeMenu();
    navigate('/login');
  };

  const userDisplayName = user?.username || user?.email || 'User';

  const footer = user ? undefined : (
    <div className="flex flex-col gap-2">
      <Button to="/register" className="w-full">
        Get started
      </Button>
      <Button to="/login" variant="secondary" className="w-full">
        Log in
      </Button>
      <PwaInstallButton variant="ghost" size="md" label="Install app" className="w-full" />
    </div>
  );

  const mobileBrand = (
    <Link
      to="/"
      onClick={closeMenu}
      aria-label="QYVORA home"
      className="flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <Logo variant="mark" size="md" />
    </Link>
  );

  const mobileAccount = user ? (
    <div className="rounded-xl border border-border-subtle bg-surface p-2">
      <button
        type="button"
        onClick={() => setAccountOpen((current) => !current)}
        aria-expanded={accountOpen}
        aria-controls="public-mobile-account-panel"
        className="flex min-h-[60px] w-full items-center gap-[14px] rounded-xl px-2 text-left transition-colors hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
      >
        <Avatar name={userDisplayName} size={60} shape="square" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[24px] font-bold leading-tight text-text-primary">
            {userDisplayName}
          </span>
          <span className="mt-0.5 block truncate text-[16px] leading-tight text-text-muted">
            {user.rank || 'Member'}
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

      {accountOpen && (
        <div id="public-mobile-account-panel" className="mt-1 border-t border-border-subtle pt-1">
          {MOBILE_ACCOUNT_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                to={item.to}
                onClick={closeMenu}
                className="flex min-h-[56px] items-center gap-5 rounded-xl px-2 text-[18px] font-medium text-text-primary transition-colors hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
              >
                <Icon className="h-[24px] w-[24px] shrink-0 text-text-muted" strokeWidth={1.8} aria-hidden="true" />
                <span className="flex-1 truncate">{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-[56px] w-full items-center gap-5 rounded-xl px-2 text-left text-[18px] font-medium text-text-primary transition-colors hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
          >
            <LogOut className="h-[24px] w-[24px] shrink-0 text-text-muted" strokeWidth={1.8} aria-hidden="true" />
            <span className="flex-1 truncate">Log out</span>
          </button>
        </div>
      )}
    </div>
  ) : undefined;

  const rightSlot = user ? (
    <AvatarMenu />
  ) : (
    <>
      <Button to="/login" variant="secondary" size="sm" className="hidden sm:inline-flex">
        Log in
      </Button>
      <Button to="/register" size="sm">
        Get started
      </Button>
    </>
  );

  return (
    <>
      <SiteTopbar
        items={PUBLIC_ITEMS}
        activeMatcher={isActive}
        rightSlot={rightSlot}
        onMobileMenuOpen={() => setOpen(true)}
        mobileMenuOpen={open}
        logoTo="/"
        mobileMenu={
          <MobileMenu
            open={open}
            onClose={closeMenu}
            items={PUBLIC_ITEMS}
            footer={footer}
            brand={mobileBrand}
            account={mobileAccount}
            title="Menu"
            variant="fullscreen"
            activeMatcher={isActive}
          />
        }
      />
    </>
  );
};

PublicNavigation.displayName = 'PublicNavigation';

export default PublicNavigation;
