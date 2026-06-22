import { LayoutDashboard, BookOpen, Radar, ShoppingBag, Wallet, Trophy, Settings, Radio } from 'lucide-react';

export const MOBILE_PRIMARY = [
  { label: 'Home',     icon: LayoutDashboard, path: '/dashboard'  },
  { label: 'HPB', icon: BookOpen,        path: '/dashboard/bootcamps/bc_1775270338500'  },
  { label: 'Market',   icon: ShoppingBag,     path: '/dashboard/marketplace' },
];

export const MOBILE_MORE = [
  { label: 'Cyber Feed',   icon: Radio,      path: '/dashboard/news'         },
  { label: 'Market',        icon: ShoppingBag, path: '/dashboard/marketplace'   },
  { label: 'Wallet',        icon: Wallet,      path: '/dashboard/wallet'        },
  { label: 'Settings',      icon: Settings,    path: '/dashboard/settings'      },
];
