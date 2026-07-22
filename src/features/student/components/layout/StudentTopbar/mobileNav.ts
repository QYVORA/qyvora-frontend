import i18n from '@/i18n';
import {
  IconDashboard,
  IconCode,
  IconMarketplace,
  IconSettings,
  IconTerminal,
} from '@/shared/components/icons';
import { Globe } from 'lucide-react';

export const MOBILE_PRIMARY = [
  { label: i18n.t('nav.dashboard'),     icon: IconDashboard, path: '/dashboard'  },
  { label: i18n.t('nav.courses'),  icon: IconCode,        path: '/dashboard/courses'  },
  { label: i18n.t('nav.marketplace'),   icon: IconMarketplace,     path: '/dashboard/marketplace' },
];

export const MOBILE_MORE = [
  { label: i18n.t('nav.hpb'),           icon: IconTerminal,      path: '/dashboard/bootcamps/bc_1775270338500' },
  { label: i18n.t('nav.networkLab'),   icon: Globe,             path: '/dashboard/networks' },
  { label: i18n.t('nav.settings'),      icon: IconSettings,      path: '/dashboard/settings'      },
];

