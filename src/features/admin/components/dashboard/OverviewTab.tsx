import { Users, Activity, UserPlus, Award, BookOpen, XCircle, Server, ShieldAlert, Ban } from 'lucide-react';
import type { ReactNode } from 'react';
import { IconCheck } from '@/shared/components/icons';
import { StatCard, DataTable } from '@/shared/components/dashboard';
import type { Column } from '@/shared/components/dashboard';
import { ErrorState } from '@/shared/components/ui';
import type { OverviewData, SectionStatus } from '../../pages/AdminDashboardPage';

interface OverviewTabProps {
  data: OverviewData | null;
  status: SectionStatus;
  onRetry: () => void;
}

const OverviewTab = ({ data, status, onRetry }: OverviewTabProps) => {

  if (status === 'error') {
    return <ErrorState message={"Overview data could not be loaded."} title={"Data currently unavailable"} />;
  }

  if (status === 'loading' || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="status">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border-subtle bg-surface p-5 space-y-3 animate-pulse">
            <div className="h-4 w-24 bg-border/30 rounded" />
            <div className="h-8 w-20 bg-border/30 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const health = data.systemHealth;

  const statCards = [
    { icon: <Users className="w-5 h-5 text-text-muted" />, label: "Total Users", value: data.users.total, accent: false },
    { icon: <Activity className="w-5 h-5 text-accent" />, label: "Active 24h", value: data.users.active24h, accent: true },
    { icon: <UserPlus className="w-5 h-5 text-text-muted" />, label: "New This Week", value: data.newSignupsWeek, accent: false },
    { icon: <Award className="w-5 h-5 text-accent" />, label: "Total CP Minted", value: Number(data.totalCpMinted).toLocaleString(), accent: true },
    { icon: <BookOpen className="w-5 h-5 text-text-muted" />, label: "Bootcamp Enrollment", value: `${Math.round(data.bootcampEnrollmentRate * 100)}%`, accent: false },
    {
      icon: data.chainReachable === 'unreachable' ? <XCircle className="w-5 h-5 text-danger" /> : data.chainReachable === true ? <IconCheck size={20} className="text-accent" /> : <Server className="w-5 h-5 text-text-muted" />,
      label: "Chain Status",
      value:
        data.chainReachable === 'unreachable'
          ? "Unreachable"
          : data.chainReachable === 'not_configured'
            ? "Not configured"
            : "Reachable",
      accent: data.chainReachable !== 'unreachable',
    },
  ];

  const healthCards = health ? [
    {
      icon: <Server className={`w-5 h-5 ${health.mongodb ? 'text-accent' : 'text-danger'}`} />,
      label: "Database",
      value: health.mongodb ? "Connected" : "Degraded",
      accent: health.mongodb,
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-text-muted" />,
      label: "Open incidents",
      value: `${health.incidentsOpen}${health.incidentsCriticalOpen > 0 ? ` · ${health.incidentsCriticalOpen} ${"critical"}` : ''}`,
      accent: false,
    },
    {
      icon: <Ban className="w-5 h-5 text-text-muted" />,
      label: "Blocked accounts",
      value: health.blockedAccounts,
      accent: false,
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-accent" />,
      label: "Auth failures (24h)",
      value: health.authFailures24h,
      accent: true,
    },
  ] : [];

  const signupColumns: Column<OverviewData['recentSignups'][number]>[] = [
    { key: 'name', header: "Name", render: (u) => <div><div className="text-sm font-bold text-text-primary">{u.name || "Unknown"}</div><div className="text-xs text-text-muted font-mono">{u.email}</div></div> },
    { key: 'createdAt', header: "Date", render: (u) => <span className="text-xs text-text-muted font-mono">{new Date(u.createdAt).toLocaleDateString()}</span>, className: 'text-right' },
  ];

  const signupMobileCard = (u: OverviewData['recentSignups'][number]) => (
    <div className="bg-surface border border-border-subtle rounded-2xl p-4 space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-bold text-text-primary truncate">{u.name || "Unknown"}</div>
          <div className="text-xs text-text-muted font-mono truncate">{u.email}</div>
        </div>
        <span className="text-xs text-text-muted font-mono whitespace-nowrap shrink-0">{new Date(u.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );

  const StatSection = ({ title, className, children }: { title: string; className: string; children: ReactNode }) => (
    <section>
      <h3 className="mb-3 type-label text-accent uppercase tracking-[0.12em] font-black">{title}</h3>
      <div className={className}>{children}</div>
    </section>
  );

  return (
    <div className="space-y-8">
      <StatSection title={"Platform"} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <StatCard key={card.label} icon={card.icon} label={card.label} value={card.value} accent={card.accent} />
        ))}
      </StatSection>

      {health && healthCards.length > 0 && (
        <StatSection title={"System health"} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {healthCards.map((card) => (
            <StatCard key={card.label} icon={card.icon} label={card.label} value={card.value} accent={card.accent} />
          ))}
        </StatSection>
      )}

      {health?.bootcamp && (
        <StatSection title={"Bootcamp health"} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={<BookOpen className="w-5 h-5 text-text-muted" />} label={"Bootcamp enrolled"} value={health.bootcamp.enrolled} />
          <StatCard icon={<Activity className="w-5 h-5 text-accent" />} label={"Bootcamp active"} value={health.bootcamp.active} accent />
          <StatCard icon={<Users className="w-5 h-5 text-text-muted" />} label={"In current module"} value={health.bootcamp.engagementCurrentModule} />
          <StatCard
            icon={<BookOpen className="w-5 h-5 text-accent" />}
            label={"Current module"}
            value={health.bootcamp.currentModuleId != null ? String(health.bootcamp.currentModuleId).padStart(2, '0') : '-'}
            accent
          />
        </StatSection>
      )}

      <StatSection title={"Recent Signups"} className="grid grid-cols-1 gap-4">
        <div className="rounded-2xl border border-border-subtle bg-surface p-5">
          <DataTable
            data={data.recentSignups}
            columns={signupColumns}
            keyExtractor={(u) => u.id}
            mobileCard={signupMobileCard}
            emptyTitle={"No recent signups"}
            pageSize={5}
            minWidth="min-w-[400px]"
          />
        </div>
      </StatSection>
    </div>
  );
};

export default OverviewTab;
