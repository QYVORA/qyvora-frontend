import { Users, Shield, Database, Coins, Link2, AlertTriangle, Mail } from 'lucide-react';

const ADMIN_PREFIX = atob('L21yLXJvYm90');

export const NAV_GROUPS = [
  {
    label: 'Manage',
    items: [
      { label: 'Users',        icon: Users,         path: `${ADMIN_PREFIX}/dashboard?tab=users`,        desc: 'Manage operators'       },
      { label: 'Bootcamps',    icon: Shield,        path: `${ADMIN_PREFIX}/dashboard?tab=bootcamps`,    desc: 'Phase control'          },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Market',   icon: Database,      path: `${ADMIN_PREFIX}/dashboard?tab=zero_day`, desc: 'Zero-day vault'         },
      { label: 'Points',   icon: Coins,         path: `${ADMIN_PREFIX}/dashboard?tab=cp`,       desc: 'CP analytics'           },
      { label: 'Chain',    icon: Link2,         path: `${ADMIN_PREFIX}/dashboard?tab=chain`,    desc: 'Chain explorer'         },
    ],
  },
  {
    label: 'Monitor',
    items: [
      { label: 'Security', icon: AlertTriangle, path: `${ADMIN_PREFIX}/dashboard?tab=security`, desc: 'Security events'        },
      { label: 'Contacts', icon: Mail,          path: `${ADMIN_PREFIX}/dashboard?tab=contacts`, desc: 'Contact messages'       },
    ],
  },
];

export const MOBILE_PRIMARY = [
  { label: 'Users',     icon: Users,    path: `${ADMIN_PREFIX}/dashboard?tab=users`     },
  { label: 'Bootcamps', icon: Shield,   path: `${ADMIN_PREFIX}/dashboard?tab=bootcamps` },
  { label: 'Market',    icon: Database, path: `${ADMIN_PREFIX}/dashboard?tab=zero_day`  },
  { label: 'Points',    icon: Coins,    path: `${ADMIN_PREFIX}/dashboard?tab=cp`        },
];

export const MOBILE_MORE = [
  { label: 'Chain',        icon: Link2,         path: `${ADMIN_PREFIX}/dashboard?tab=chain`        },
  { label: 'Security',     icon: AlertTriangle, path: `${ADMIN_PREFIX}/dashboard?tab=security`     },
  { label: 'Contacts',     icon: Mail,          path: `${ADMIN_PREFIX}/dashboard?tab=contacts`     },
];
