import type { ElementType } from 'react';
import { Users, Database, Coins, Mail, Megaphone, OctagonAlert } from 'lucide-react';
import { IconShield, IconClock, IconWarning, IconDashboard } from '@/shared/components/icons';
import ADMIN_PATH from '@/shared/utils/adminPath';

export interface AdminNavItem {
  labelKey: string;
  descKey: string;
  icon: ElementType;
  path: string;
  tab: string;
}

export interface AdminNavGroup {
  titleKey: string;
  items: AdminNavItem[];
}

export const NAV_GROUPS: AdminNavGroup[] = [
  {
    titleKey: 'admin.navGroups.manage',
    items: [
      { labelKey: 'admin.tabs.overview', descKey: 'admin.navDescs.overview',   icon: IconDashboard, tab: 'overview',  path: `${ADMIN_PATH}/dashboard?tab=overview` },
      { labelKey: 'admin.tabs.users',    descKey: 'admin.navDescs.users',      icon: Users,         tab: 'users',     path: `${ADMIN_PATH}/dashboard?tab=users` },
      { labelKey: 'admin.tabs.bootcamps', descKey: 'admin.navDescs.bootcamps', icon: IconShield,    tab: 'bootcamps', path: `${ADMIN_PATH}/dashboard?tab=bootcamps` },
    ],
  },
  {
    titleKey: 'admin.navGroups.content',
    items: [
      { labelKey: 'admin.tabs.market', descKey: 'admin.navDescs.market', icon: Database, tab: 'zero_day', path: `${ADMIN_PATH}/dashboard?tab=zero_day` },
      { labelKey: 'admin.tabs.points', descKey: 'admin.navDescs.points', icon: Coins,    tab: 'cp',       path: `${ADMIN_PATH}/dashboard?tab=cp` },
    ],
  },
  {
    titleKey: 'admin.navGroups.communications',
    items: [
      { labelKey: 'admin.tabs.inbox',     descKey: 'admin.navDescs.inbox',     icon: Mail,      tab: 'inbox',     path: `${ADMIN_PATH}/dashboard?tab=inbox` },
      { labelKey: 'admin.tabs.broadcast', descKey: 'admin.navDescs.broadcast', icon: Megaphone, tab: 'broadcast', path: `${ADMIN_PATH}/dashboard?tab=broadcast` },
    ],
  },
  {
    titleKey: 'admin.navGroups.monitor',
    items: [
      { labelKey: 'admin.tabs.audit',     descKey: 'admin.navDescs.audit',     icon: IconClock,    tab: 'audit',     path: `${ADMIN_PATH}/dashboard?tab=audit` },
      { labelKey: 'admin.tabs.security',  descKey: 'admin.navDescs.security',  icon: IconWarning,  tab: 'security',  path: `${ADMIN_PATH}/dashboard?tab=security` },
      { labelKey: 'admin.tabs.incidents', descKey: 'admin.navDescs.incidents', icon: OctagonAlert, tab: 'incidents', path: `${ADMIN_PATH}/dashboard?tab=incidents` },
    ],
  },
];

// Topbar quick tabs — mirror the student dashboard desktop nav pattern.
export const ADMIN_QUICK_TABS: AdminNavItem[] = [
  { labelKey: 'admin.tabs.overview', descKey: 'admin.navDescs.overview',  icon: IconDashboard, tab: 'overview',  path: `${ADMIN_PATH}/dashboard?tab=overview` },
  { labelKey: 'admin.tabs.users',    descKey: 'admin.navDescs.users',     icon: Users,         tab: 'users',     path: `${ADMIN_PATH}/dashboard?tab=users` },
  { labelKey: 'admin.tabs.bootcamps', descKey: 'admin.navDescs.bootcamps', icon: IconShield,   tab: 'bootcamps', path: `${ADMIN_PATH}/dashboard?tab=bootcamps` },
  { labelKey: 'admin.tabs.points',   descKey: 'admin.navDescs.points',    icon: Coins,         tab: 'cp',        path: `${ADMIN_PATH}/dashboard?tab=cp` },
];