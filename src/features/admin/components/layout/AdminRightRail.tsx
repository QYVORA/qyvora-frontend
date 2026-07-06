import { Link, useLocation } from 'react-router-dom';
import { Users, Shield, Database, Coins, Mail, Megaphone, Clock, AlertTriangle, LayoutDashboard } from 'lucide-react';
import ADMIN_PATH from '@/shared/utils/adminPath';

const RAIL_LINKS = [
  { icon: LayoutDashboard, path: `${ADMIN_PATH}/dashboard?tab=overview`,  label: 'Overview'  },
  { icon: Users,           path: `${ADMIN_PATH}/dashboard?tab=users`,     label: 'Users'     },
  { icon: Shield,          path: `${ADMIN_PATH}/dashboard?tab=bootcamps`,  label: 'Bootcamps' },
  { icon: Database,        path: `${ADMIN_PATH}/dashboard?tab=zero_day`,   label: 'Market'    },
  { icon: Coins,           path: `${ADMIN_PATH}/dashboard?tab=cp`,         label: 'Points'    },
  { icon: Mail,            path: `${ADMIN_PATH}/dashboard?tab=inbox`,      label: 'Inbox'     },
  { icon: Megaphone,       path: `${ADMIN_PATH}/dashboard?tab=broadcast`,  label: 'Broadcast' },
  { icon: Clock,           path: `${ADMIN_PATH}/dashboard?tab=audit`,      label: 'Audit'     },
  { icon: AlertTriangle,   path: `${ADMIN_PATH}/dashboard?tab=security`,   label: 'Security'  },
];

const AdminRightRail = () => {
  const location = useLocation();
  const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';

  return (
    <aside
      className="hidden lg:flex fixed right-6 z-30 flex-col items-center gap-3"
      style={{ top: '6rem', bottom: '1.5rem', justifyContent: 'center' }}
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
