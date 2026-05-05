import { Link, useLocation } from 'react-router-dom';
import { Users, Shield, Database, Coins, AlertTriangle, Mail } from 'lucide-react';

const RAIL_LINKS = [
  { icon: Users,         path: '/mr-robot/dashboard?tab=users',        label: 'Users'     },
  { icon: Shield,        path: '/mr-robot/dashboard?tab=bootcamps',    label: 'Bootcamps' },
  { icon: Database,      path: '/mr-robot/dashboard?tab=zero_day',     label: 'Market'    },
  { icon: Coins,         path: '/mr-robot/dashboard?tab=cp',           label: 'Points'    },
  { icon: AlertTriangle, path: '/mr-robot/dashboard?tab=security',     label: 'Security'  },
  { icon: Mail,          path: '/mr-robot/dashboard?tab=contacts',     label: 'Contacts'  },
];

const AdminRightRail = () => {
  const location = useLocation();
  const currentTab = new URLSearchParams(location.search).get('tab') || 'users';

  return (
    <aside
      className="hidden lg:flex fixed right-6 z-30 flex-col items-center gap-3"
      style={{
        top: '6rem',   // matches md:h-24 topbar height
        bottom: '1.5rem',
        justifyContent: 'center',
      }}
      aria-label="Admin quick navigation"
    >
      {RAIL_LINKS.map(({ icon: Icon, path, label }) => {
        const tab = new URLSearchParams(path.split('?')[1] || '').get('tab');
        const active = tab === currentTab;
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

export default AdminRightRail;
