import { Users, Shield, Database, Coins, Mail, Megaphone, Clock, AlertTriangle, LayoutDashboard } from 'lucide-react';

const ADMIN_PREFIX = atob('L21yLXJvYm90');

export const NAV_GROUPS = [
  {
    label: 'Manage',
    items: [
      { label: 'Overview',    icon: LayoutDashboard, path: `${ADMIN_PREFIX}/dashboard?tab=overview`, desc: 'System overview'       },
      { label: 'Users',       icon: Users,           path: `${ADMIN_PREFIX}/dashboard?tab=users`,      desc: 'Manage operators'       },
      { label: 'Bootcamps',   icon: Shield,          path: `${ADMIN_PREFIX}/dashboard?tab=bootcamps`,  desc: 'Phase control'          },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Market',    icon: Database, path: `${ADMIN_PREFIX}/dashboard?tab=zero_day`, desc: 'Zero-day vault' },
      { label: 'Points',    icon: Coins,    path: `${ADMIN_PREFIX}/dashboard?tab=cp`,        desc: 'CP analytics'    },
    ],
  },
  {
    label: 'Communications',
    items: [
      { label: 'Inbox',     icon: Mail,       path: `${ADMIN_PREFIX}/dashboard?tab=inbox`,     desc: 'Contact & service requests' },
      { label: 'Broadcast', icon: Megaphone,  path: `${ADMIN_PREFIX}/dashboard?tab=broadcast`, desc: 'Send announcements' },
    ],
  },
  {
    label: 'Monitor',
    items: [
      { label: 'Audit',     icon: Clock,         path: `${ADMIN_PREFIX}/dashboard?tab=audit`,     desc: 'Admin action log'   },
      { label: 'Security',  icon: AlertTriangle, path: `${ADMIN_PREFIX}/dashboard?tab=security`, desc: 'Security events'     },
    ],
  },
];

export const MOBILE_PRIMARY = [
  { label: 'Overview',  icon: LayoutDashboard, path: `${ADMIN_PREFIX}/dashboard?tab=overview`  },
  { label: 'Users',     icon: Users,           path: `${ADMIN_PREFIX}/dashboard?tab=users`     },
  { label: 'Bootcamps', icon: Shield,          path: `${ADMIN_PREFIX}/dashboard?tab=bootcamps` },
  { label: 'Points',    icon: Coins,           path: `${ADMIN_PREFIX}/dashboard?tab=cp`        },
];

export const MOBILE_MORE = [
  { label: 'Market',    icon: Database,       path: `${ADMIN_PREFIX}/dashboard?tab=zero_day` },
  { label: 'Inbox',     icon: Mail,           path: `${ADMIN_PREFIX}/dashboard?tab=inbox`    },
  { label: 'Broadcast', icon: Megaphone,      path: `${ADMIN_PREFIX}/dashboard?tab=broadcast` },
  { label: 'Audit',     icon: Clock,          path: `${ADMIN_PREFIX}/dashboard?tab=audit`    },
  { label: 'Security',  icon: AlertTriangle,  path: `${ADMIN_PREFIX}/dashboard?tab=security` },
];
