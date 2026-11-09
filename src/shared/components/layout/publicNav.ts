import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  CircleUserRound,
  FlaskConical,
  GraduationCap,
  ShieldCheck,
  Wrench,
} from 'lucide-react';

export interface PublicPrimaryLink {
  key: string;
  label: string;
  to: string;
  icon: LucideIcon;
}

export interface PublicFooterColumn {
  title: string;
  links: { key: string; label: string; to: string }[];
}

/**
 * Shared public navigation data. The top nav and mobile bottom nav both read
 * from this list so the primary sections cannot drift apart.
 */
export const PUBLIC_PRIMARY_LINKS: PublicPrimaryLink[] = [
  { key: 'learn', label: 'Learn', to: '/learn', icon: BookOpen },
  { key: 'bootcamp', label: 'Bootcamp', to: '/hpb', icon: GraduationCap },
  { key: 'tools', label: 'Tools', to: '/tools', icon: Wrench },
  { key: 'research', label: 'Research', to: '/blogs', icon: FlaskConical },
  { key: 'services', label: 'Services', to: '/services', icon: ShieldCheck },
  { key: 'about', label: 'About', to: '/about', icon: CircleUserRound },
];

/**
 * Footer wayfinding only. Legal and trust pages live here rather than in the
 * top nav, which keeps the primary header focused on the six main sections.
 */
export const PUBLIC_FOOTER_COLUMNS: PublicFooterColumn[] = [
  {
    title: 'Learning',
    links: [
      { key: 'learn', label: 'Learn', to: '/learn' },
      { key: 'bootcamp', label: 'HPB Bootcamp', to: '/hpb' },
      { key: 'qose', label: 'QOSE', to: '/qose' },
      { key: 'simulations', label: 'Simulations', to: '/simulations' },
      { key: 'blogs', label: 'Blogs', to: '/blogs' },
      { key: 'resources', label: 'Cheat sheets', to: '/resources' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { key: 'tools', label: 'All tools', to: '/tools' },
      { key: 'anansi', label: 'anansi', to: '/anansi' },
      { key: 'shaka', label: 'shaka', to: '/shaka' },
      { key: 'nzinga', label: 'nzinga', to: '/nzinga' },
      { key: 'imhotep', label: 'imhotep', to: '/imhotep' },
      { key: 'changelog', label: 'Changelog', to: '/changelog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { key: 'about', label: 'About', to: '/about' },
      { key: 'team', label: 'Team', to: '/team' },
      { key: 'leadership', label: 'Leadership', to: '/leadership' },
      { key: 'quiteroot', label: 'Quiteroot', to: '/quiteroot' },
      { key: 'services', label: 'Services', to: '/services' },
      { key: 'contact', label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Credentials',
    links: [
      { key: 'credentials', label: 'Credentials', to: '/credentials' },
      { key: 'verify', label: 'Verify a Credential', to: '/verify' },
      { key: 'status', label: 'System Status', to: '/status' },
      { key: 'acceptable-use', label: 'Community Guidelines', to: '/acceptable-use' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { key: 'privacy', label: 'Privacy Policy', to: '/privacy' },
      { key: 'cookies', label: 'Cookie Policy', to: '/cookies' },
      { key: 'security', label: 'Security', to: '/security' },
      { key: 'refunds', label: 'Refund & Cancellation', to: '/refund-policy' },
      { key: 'accessibility', label: 'Accessibility', to: '/accessibility' },
      { key: 'terms', label: 'Terms of Service', to: '/terms' },
    ],
  },
];
