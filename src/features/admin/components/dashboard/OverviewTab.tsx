import { Users, Activity, UserPlus, Award, BookOpen, XCircle, Server, ShieldAlert, Ban } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  if (status === 'error') {
    return <ErrorState message={t('admin.overview.unavailable')} title={t('admin.dataUnavailable')} />;
  }

  if (status === 'loading' || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="status">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/50 bg-bg-card p-5 space-y-3 animate-pulse">
            <div className="h-4 w-24 bg-border/30 rounded" />
            <div className="h-8 w-20 bg-border/30 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const health = data.systemHealth;

  const statCards = [
    { icon: <Users className="w-5 h-5 text-text-muted" />, label: t('admin.overview.totalUsers'), value: data.users.total, accent: false },
    { icon: <Activity className="w-5 h-5 text-accent" />, label: t('admin.overview.active24h'), value: data.users.active24h, accent: true },
    { icon: <UserPlus className="w-5 h-5 text-text-muted" />, label: t('admin.overview.newThisWeek'), value: data.newSignupsWeek, accent: false },
    { icon: <Award className="w-5 h-5 text-accent" />, label: t('admin.overview.totalCpMinted'), value: Number(data.totalCpMinted).toLocaleString(), accent: true },
    { icon: <BookOpen className="w-5 h-5 text-text-muted" />, label: t('admin.overview.bootcampEnrollment'), value: `${Math.round(data.bootcampEnrollmentRate * 100)}%`, accent: false },
    {
      icon: data.chainReachable === 'unreachable' ? <XCircle className="w-5 h-5 text-red-400" /> : data.chainReachable === true ? <IconCheck size={20} className="text-accent" /> : <Server className="w-5 h-5 text-text-muted" />,
      label: t('admin.overview.chainStatus'),
      value:
        data.chainReachable === 'unreachable'
          ? t('admin.overview.unreachable')
          : data.chainReachable === 'not_configured'
            ? t('admin.overview.notConfigured')
            : t('admin.overview.reachable'),
      accent: data.chainReachable !== 'unreachable',
    },
  ];

  const healthCards = health ? [
    {
      icon: <Server className={`w-5 h-5 ${health.mongodb ? 'text-accent' : 'text-red-400'}`} />,
      label: t('admin.overview.databaseStatus'),
      value: health.mongodb ? t('admin.overview.connected') : t('admin.overview.degraded'),
      accent: health.mongodb,
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-text-muted" />,
      label: t('admin.overview.openIncidents'),
      value: `${health.incidentsOpen}${health.incidentsCriticalOpen > 0 ? ` · ${health.incidentsCriticalOpen} ${t('admin.overview.critical')}` : ''}`,
      accent: false,
    },
    {
      icon: <Ban className="w-5 h-5 text-text-muted" />,
      label: t('admin.overview.blockedAccounts'),
      value: health.blockedAccounts,
      accent: false,
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-accent" />,
      label: t('admin.overview.authFailures24h'),
      value: health.authFailures24h,
      accent: true,
    },
  ] : [];

  const signupColumns: Column<OverviewData['recentSignups'][number]>[] = [
    { key: 'name', header: t('form.name'), render: (u) => <div><div className="text-sm font-bold text-text-primary">{u.name || t('common2.unknown')}</div><div className="text-xs text-text-muted font-mono">{u.email}</div></div> },
    { key: 'createdAt', header: t('common2.date'), render: (u) => <span className="text-[10px] text-text-muted font-mono">{new Date(u.createdAt).toLocaleDateString()}</span>, className: 'text-right' },
  ];

  const signupMobileCard = (u: OverviewData['recentSignups'][number]) => (
    <div className="bg-bg-card border border-border/50 rounded-2xl p-4 space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-bold text-text-primary truncate">{u.name || t('common2.unknown')}</div>
          <div className="text-xs text-text-muted font-mono truncate">{u.email}</div>
        </div>
        <span className="text-[10px] text-text-muted font-mono whitespace-nowrap shrink-0">{new Date(u.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...statCards, ...healthCards].map((card) => (
          <StatCard key={card.label} icon={card.icon} label={card.label} value={card.value} accent={card.accent} />
        ))}
      </div>

      {health?.bootcamp && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<BookOpen className="w-5 h-5 text-text-muted" />} label={t('admin.overview.bootcampEnrolled')} value={health.bootcamp.enrolled} />
          <StatCard icon={<Activity className="w-5 h-5 text-accent" />} label={t('admin.overview.bootcampActive')} value={health.bootcamp.active} accent />
          <StatCard icon={<Users className="w-5 h-5 text-text-muted" />} label={t('admin.overview.bootcampEngagement')} value={health.bootcamp.engagementCurrentModule} />
          <StatCard
            icon={<BookOpen className="w-5 h-5 text-accent" />}
            label={t('admin.overview.currentModule')}
            value={health.bootcamp.currentModuleId != null ? String(health.bootcamp.currentModuleId).padStart(2, '0') : '-'}
            accent
          />
        </div>
      )}

      <div className="rounded-2xl border border-border/50 bg-bg-card p-5">
        <h3 className="text-sm font-black uppercase tracking-wide text-text-primary mb-4 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-accent" /> {t('admin.overview.recentSignups')}
        </h3>
        <DataTable
          data={data.recentSignups}
          columns={signupColumns}
          keyExtractor={(u) => u.id}
          mobileCard={signupMobileCard}
          emptyTitle={t('admin.overview.noRecentSignups')}
          pageSize={5}
          minWidth="min-w-[400px]"
        />
      </div>
    </div>
  );
};

export default OverviewTab;
