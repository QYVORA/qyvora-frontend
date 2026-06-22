import { Link, useLocation } from 'react-router-dom';
import { Wallet, ShoppingBag, Settings, Radio } from 'lucide-react';

const RAIL_LINKS = [
  { icon: Radio,       path: '/dashboard/news',         label: 'Cyber Feed' },
  { icon: Wallet,      path: '/dashboard/wallet',        label: 'Wallet'    },
  { icon: ShoppingBag, path: '/dashboard/marketplace',   label: 'Store'     },
  { icon: Settings,    path: '/dashboard/settings',      label: 'Settings'  },
];

const StudentRightRail = () => {
  const location = useLocation();

  return (
    <aside
      className="hidden lg:flex fixed right-6 z-30 flex-col items-center gap-3"
      style={{
        // Start below the topbar (96px) and end above the bottom of the viewport.
        // top/bottom define the available band; translate centers the rail within it.
        top: '6rem',   // matches md:h-24 topbar height
        bottom: '1.5rem',
        justifyContent: 'center',
      }}
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
