import { ShoppingBag, Wallet, Radar, Trophy } from 'lucide-react';

export const NAV_GROUPS = [
  {
    label: 'Operate',
    items: [
      { label: 'Marketplace',  icon: ShoppingBag, path: '/dashboard/marketplace',  desc: 'Zero-day market'    },
      { label: 'Wallet',       icon: Wallet,      path: '/dashboard/wallet',       desc: 'CP balance & history' },
    ],
  },
];
