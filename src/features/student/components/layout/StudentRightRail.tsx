import { Link, useLocation } from 'react-router-dom';
import { Wallet, ShoppingBag, Bell, Settings } from 'lucide-react';

const RAIL_LINKS = [
  { icon: Wallet,      path: '/wallet',        label: 'Wallet'    },
  { icon: ShoppingBag, path: '/marketplace',   label: 'Store'     },
  { icon: Bell,        path: '/notifications', label: 'Alerts'    },
  { icon: Settings,    path: '/settings',      label: 'Settings'  },
];

const StudentRightRail = () => {
  const location = useLocation();

  return (
    <aside
      className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-3"
      aria-label="Quick navigation"
    >
      {RAIL_LINKS.map(({ icon: Icon, path, label }) => {
        const active = location.pathname === path;
        return (
          <Link
            key={path}
            to={path}
            title={label}
            aria-label={label}
            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
              active
                ? 'border-accent/50 bg-accent-dim text-accent'
                : 'border-border bg-bg-card text-text-muted hover:border-accent/40 hover:text-accent'
            }`}
          >
            <Icon className="h-5 w-5" />
          </Link>
        );
      })}
    </aside>
  );
};

export default StudentRightRail;
