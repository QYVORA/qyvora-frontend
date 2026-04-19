import { Twitter, Linkedin, MessageSquare } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface SocialLink {
  label: string;
  handle: string;
  desc: string;
  icon: LucideIcon;
  action: string;
  href: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Follow the Signal',
    handle: '@hsocietyoffsec',
    desc: 'Ops updates, alerts, and announcements.',
    icon: Twitter,
    action: 'Follow',
    href: 'https://x.com/hsocietyoffsec',
  },
  {
    label: 'Network Ingress',
    handle: 'HSOCIETY OFFSEC',
    desc: 'Company updates and operator wins.',
    icon: Linkedin,
    action: 'Connect',
    href: 'https://www.linkedin.com/company/hsociety-offsec/',
  },
  {
    label: 'The War Room',
    handle: 'HSOCIETY OFFSEC',
    desc: 'Join the community briefing room.',
    icon: MessageSquare,
    action: 'Join',
    href: 'https://chat.whatsapp.com/Ja8pR0FZQAI2pceGjQpji5',
  },
];
