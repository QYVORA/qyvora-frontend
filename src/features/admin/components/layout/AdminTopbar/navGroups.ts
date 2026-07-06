import { Users, Shield, Database, Coins, Mail, Megaphone, Clock, AlertTriangle, LayoutDashboard } from 'lucide-react';
import ADMIN_PATH from '@/shared/utils/adminPath';

export const NAV_GROUPS = [
  {
    label: 'Manage',
    items: [
      { label: 'Overview',    icon: LayoutDashboard, path: `${ADMIN_PATH}/dashboard?tab=overview`, desc: 'System overview'       },
      { label: 'Users',       icon: Users,           path: `${ADMIN_PATH}/dashboard?tab=users`,      desc: 'Manage operators'       },
      { label: 'Bootcamps',   icon: Shield,          path: `${ADMIN_PATH}/dashboard?tab=bootcamps`,  desc: 'Phase control'          },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Market',    icon: Database, path: `${ADMIN_PATH}/dashboard?tab=zero_day`, desc: 'Zero-day vault' },
      { label: 'Points',    icon: Coins,    path: `${ADMIN_PATH}/dashboard?tab=cp`,        desc: 'CP analytics'    },
    ],
  },
  {
    label: 'Communications',
    items: [
      { label: 'Inbox',     icon: Mail,       path: `${ADMIN_PATH}/dashboard?tab=inbox`,     desc: 'Contact & service requests' },
      { label: 'Broadcast', icon: Megaphone,  path: `${ADMIN_PATH}/dashboard?tab=broadcast`, desc: 'Send announcements' },
    ],
  },
  {
    label: 'Monitor',
    items: [
      { label: 'Audit',     icon: Clock,         path: `${ADMIN_PATH}/dashboard?tab=audit`,     desc: 'Admin action log'   },
      { label: 'Security',  icon: AlertTriangle, path: `${ADMIN_PATH}/dashboard?tab=security`, desc: 'Security events'     },
    ],
  },
];

export const MOBILE_PRIMARY = [
  { label: 'Overview',  icon: LayoutDashboard, path: `${ADMIN_PATH}/dashboard?tab=overview`  },
  { label: 'Users',     icon: Users,           path: `${ADMIN_PATH}/dashboard?tab=users`     },
  { label: 'Bootcamps', icon: Shield,          path: `${ADMIN_PATH}/dashboard?tab=bootcamps` },
  { label: 'Points',    icon: Coins,           path: `${ADMIN_PATH}/dashboard?tab=cp`        },
];

export const MOBILE_MORE = [
  { label: 'Market',    icon: Database,       path: `${ADMIN_PATH}/dashboard?tab=zero_day` },
  { label: 'Inbox',     icon: Mail,           path: `${ADMIN_PATH}/dashboard?tab=inbox`    },
  { label: 'Broadcast', icon: Megaphone,      path: `${ADMIN_PATH}/dashboard?tab=broadcast` },
  { label: 'Audit',     icon: Clock,          path: `${ADMIN_PATH}/dashboard?tab=audit`    },
  { label: 'Security',  icon: AlertTriangle,  path: `${ADMIN_PATH}/dashboard?tab=security` },
];
