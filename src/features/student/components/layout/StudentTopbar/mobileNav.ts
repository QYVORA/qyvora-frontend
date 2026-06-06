import { LayoutDashboard, BookOpen, Radar, ShoppingBag, Wallet, Trophy, User, Bell, Settings } from 'lucide-react';

export const MOBILE_PRIMARY = [
  { label: 'Home',     icon: LayoutDashboard, path: '/dashboard'  },
  { label: 'HPB', icon: BookOpen,        path: '/dashboard/bootcamps/bc_1775270338500'  },
  { label: 'Market',   icon: ShoppingBag,     path: '/dashboard/marketplace' },
];

export const MOBILE_MORE = [
  { label: 'Market',        icon: ShoppingBag, path: '/dashboard/marketplace'   },
  { label: 'Wallet',        icon: Wallet,    path: '/dashboard/wallet'        },
  { label: 'Achievements',  icon: Trophy,    path: '/dashboard/achievements'  },
  { label: 'Profile',       icon: User,      path: '/dashboard/profile'       },
  { label: 'Notifications', icon: Bell,      path: '/dashboard/notifications' },
  { label: 'Settings',      icon: Settings,  path: '/dashboard/settings'      },
];
