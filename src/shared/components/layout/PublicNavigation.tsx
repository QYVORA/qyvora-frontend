import React, { useState } from 'react';
import {
  BookOpen,
  CircleUserRound,
  FlaskConical,
  GraduationCap,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import PwaInstallButton from '@/shared/components/ui/PwaInstallButton';
import { useAuth } from '@/core/contexts/AuthContext';
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

/**
 * PublicNavigation — thin wrapper around the shared SiteTopbar. Public items
 * only; the account slot shows auth CTAs or the shared AvatarMenu.
 */
const PublicNavigation: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const footer = user ? (
    <AvatarMenu />
  ) : (
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
            onClose={() => setOpen(false)}
            items={PUBLIC_ITEMS}
            footer={footer}
            title="Menu"
          />
        }
      />
    </>
  );
};

PublicNavigation.displayName = 'PublicNavigation';

export default PublicNavigation;
