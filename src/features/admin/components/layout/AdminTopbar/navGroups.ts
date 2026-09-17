import type { ElementType } from 'react';
import { Users, Database, Coins, Mail, Megaphone, OctagonAlert } from 'lucide-react';
import { IconShield, IconClock, IconWarning, IconDashboard } from '@/shared/components/icons';
import ADMIN_PATH from '@/shared/utils/adminPath';

export interface AdminNavItem {
  label: string;
  desc: string;
  icon: ElementType;
  path: string;
  tab: string;
}

export interface AdminNavGroup {
  title: string;
  items: AdminNavItem[];
}

export const NAV_GROUPS: AdminNavGroup[] = [
  {
    title: 'Manage',
    items: [
      { label: 'Overview', desc: 'System overview, health and signups', icon: IconDashboard, tab: 'overview',  path: `${ADMIN_PATH}/dashboard?tab=overview` },
      { label: 'Users', desc: 'Manage operators and access control', icon: Users, tab: 'users', path: `${ADMIN_PATH}/dashboard?tab=users` },
      { label: 'Bootcamps', desc: 'Phase admission and enrollment', icon: IconShield, tab: 'bootcamps', path: `${ADMIN_PATH}/dashboard?tab=bootcamps` },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Market', desc: 'Zero-day vault catalogue', icon: Database, tab: 'zero_day', path: `${ADMIN_PATH}/dashboard?tab=zero_day` },
      { label: 'Points', desc: 'Cyber Point analytics and balances', icon: Coins, tab: 'cp', path: `${ADMIN_PATH}/dashboard?tab=cp` },
    ],
  },
  {
    title: 'Communications',
    items: [
      { label: 'Inbox', desc: 'Contact and service requests', icon: Mail, tab: 'inbox', path: `${ADMIN_PATH}/dashboard?tab=inbox` },
      { label: 'Broadcast', desc: 'Send announcements to users', icon: Megaphone, tab: 'broadcast', path: `${ADMIN_PATH}/dashboard?tab=broadcast` },
    ],
  },
  {
    title: 'Monitor',
    items: [
      { label: 'Audit', desc: 'Admin action log', icon: IconClock, tab: 'audit', path: `${ADMIN_PATH}/dashboard?tab=audit` },
      { label: 'Security', desc: 'Security events and summary', icon: IconWarning, tab: 'security', path: `${ADMIN_PATH}/dashboard?tab=security` },
      { label: 'Incidents', desc: 'Incident tracking and resolution', icon: OctagonAlert, tab: 'incidents', path: `${ADMIN_PATH}/dashboard?tab=incidents` },
    ],
  },
];

// Topbar quick tabs — mirror the student dashboard desktop nav pattern.
export const ADMIN_QUICK_TABS: AdminNavItem[] = [
  { label: 'Overview', desc: 'System overview, health and signups', icon: IconDashboard, tab: 'overview', path: `${ADMIN_PATH}/dashboard?tab=overview` },
  { label: 'Users', desc: 'Manage operators and access control', icon: Users, tab: 'users', path: `${ADMIN_PATH}/dashboard?tab=users` },
  { label: 'Bootcamps', desc: 'Phase admission and enrollment', icon: IconShield, tab: 'bootcamps', path: `${ADMIN_PATH}/dashboard?tab=bootcamps` },
  { label: 'Points', desc: 'Cyber Point analytics and balances', icon: Coins, tab: 'cp', path: `${ADMIN_PATH}/dashboard?tab=cp` },
];