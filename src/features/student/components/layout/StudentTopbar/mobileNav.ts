import {
  IconDashboard,
  IconCode,
  IconMarketplace,
  IconSettings,
  IconBootcamp,
} from '@/shared/components/icons';
import { Radio, Globe } from 'lucide-react';

export const MOBILE_PRIMARY = [
  { label: 'Home',     icon: IconDashboard, path: '/dashboard'  },
  { label: 'Courses',  icon: IconCode,        path: '/dashboard/courses'  },
  { label: 'Market',   icon: IconMarketplace,     path: '/dashboard/marketplace' },
];

export const MOBILE_MORE = [
  { label: 'HPB',           icon: IconBootcamp,      path: '/dashboard/bootcamps/bc_1775270338500' },
  { label: 'Network Lab',   icon: Globe,             path: '/dashboard/networks' },
  { label: 'Cyber Feed',    icon: Radio,         path: '/dashboard/news'         },
  { label: 'Settings',      icon: IconSettings,      path: '/dashboard/settings'      },
];

