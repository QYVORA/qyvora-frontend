import { useEffect, useState } from 'react';
import { Users, Activity, UserPlus, Award, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import api from '@/core/services/api';
import { StatCard } from '@/shared/components/dashboard';
import { DataTable } from '@/shared/components/dashboard';
import type { Column } from '@/shared/components/dashboard';

interface OverviewData {
  users: { total: number; active24h: number; byRole: Record<string, number> };
  recentSignups: Array<{ id: string; name: string; email: string; createdAt: string }>;
  newSignupsWeek: number;
  totalCpMinted: number;
  bootcampEnrollmentRate: number;
  chainReachable: boolean;
}

const OverviewTab = () => {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      try {
        const [ovRes, usersRes] = await Promise.all([
          api.get('/admin/overview'),
          api.get('/admin/users').catch(() => null),
        ]);
        if (cancelled) return;
        const ov = ovRes?.data || {};
        const allUsers = Array.isArray(usersRes?.data) ? usersRes.data : [];
        const weekAgo = Date.now() - 7 * 86_400_000;
        const recent = allUsers
          .filter((u: any) => new Date(u.createdAt).getTime() > weekAgo)
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        setData({
          users: { total: ov.users?.total || 0, active24h: ov.users?.active24h || 0, byRole: ov.users?.byRole || {} },
          recentSignups: recent,
          newSignupsWeek: recent.length,
          totalCpMinted: ov.totalCpMinted || 0,
          bootcampEnrollmentRate: ov.bootcampEnrollmentRate || 0,
          chainReachable: ov.chainReachable !== false,
        });
      } catch {
        /* silent */
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  const statCards = [
    { icon: <Users className="w-5 h-5 text-text-muted" />, label: 'Total Users', value: data?.users.total ?? 0, accent: false },
    { icon: <Activity className="w-5 h-5 text-accent" />, label: 'Active 24h', value: data?.users.active24h ?? 0, accent: true },
    { icon: <UserPlus className="w-5 h-5 text-text-muted" />, label: 'New This Week', value: data?.newSignupsWeek ?? 0, accent: false },
    { icon: <Award className="w-5 h-5 text-accent" />, label: 'Total CP Minted', value: Number(data?.totalCpMinted ?? 0).toLocaleString(), accent: true },
    { icon: <BookOpen className="w-5 h-5 text-text-muted" />, label: 'Bootcamp Enrollment', value: `${Math.round((data?.bootcampEnrollmentRate ?? 0) * 100)}%`, accent: false },
    { icon: data?.chainReachable ? <CheckCircle className="w-5 h-5 text-accent" /> : <XCircle className="w-5 h-5 text-red-400" />, label: 'Chain Status', value: data?.chainReachable ? 'Reachable' : 'Unreachable', accent: data?.chainReachable ?? false },
  ];

  const signupColumns: Column<any>[] = [
    { key: 'name', header: 'Name', render: (u) => <div><div className="text-sm font-bold text-text-primary">{u.name || 'Unknown'}</div><div className="text-xs text-text-muted font-mono">{u.email}</div></div> },
    { key: 'createdAt', header: 'Date', render: (u) => <span className="text-[10px] text-text-muted font-mono">{new Date(u.createdAt).toLocaleDateString()}</span>, className: 'text-right' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} icon={card.icon} label={card.label} value={card.value} accent={card.accent} loading={loading} />
        ))}
      </div>

      <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
        <h3 className="text-sm font-black uppercase tracking-wide text-text-primary mb-4 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-accent" /> Recent Signups
        </h3>
        <DataTable
          data={data?.recentSignups ?? []}
          columns={signupColumns}
          keyExtractor={(u) => u.id}
          loading={loading}
          emptyTitle="No recent signups"
          pageSize={5}
          minWidth="min-w-[400px]"
        />
      </div>
    </div>
  );
};

export default OverviewTab;
