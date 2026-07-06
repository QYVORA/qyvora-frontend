import { useEffect, useState } from 'react';
import { Users, Activity, UserPlus, Award, BookOpen, Shield, CheckCircle, XCircle } from 'lucide-react';
import api from '@/core/services/api';
import { Skeleton } from '@/shared/components/ui';

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
          users: {
            total: ov.users?.total || 0,
            active24h: ov.users?.active24h || 0,
            byRole: ov.users?.byRole || {},
          },
          recentSignups: recent,
          newSignupsWeek: recent.length,
          totalCpMinted: ov.totalCpMinted || 0,
          bootcampEnrollmentRate: ov.bootcampEnrollmentRate || 0,
          chainReachable: ov.chainReachable !== false,
        });
      } catch {
        // fallback
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/30 bg-bg-card p-5 space-y-3">
            <Skeleton className="h-4 w-24 bg-border/30" />
            <Skeleton className="h-8 w-20 bg-border/30" />
            <Skeleton className="h-3 w-32 bg-border/30" />
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    { icon: Users, label: 'Total Users', value: data?.users.total ?? 0, accent: false },
    { icon: Activity, label: 'Active 24h', value: data?.users.active24h ?? 0, accent: true },
    { icon: UserPlus, label: 'New This Week', value: data?.newSignupsWeek ?? 0, accent: false },
    { icon: Award, label: 'Total CP Minted', value: Number(data?.totalCpMinted ?? 0).toLocaleString(), accent: true },
    { icon: BookOpen, label: 'Bootcamp Enrollment', value: `${Math.round((data?.bootcampEnrollmentRate ?? 0) * 100)}%`, accent: false },
    { icon: data?.chainReachable ? CheckCircle : XCircle, label: 'Chain Status', value: data?.chainReachable ? 'Reachable' : 'Unreachable', accent: data?.chainReachable ?? false },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl border border-border/30 bg-bg-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.accent ? 'bg-accent/10' : 'bg-bg-elevated'}`}>
                  <Icon className={`w-5 h-5 ${card.accent ? 'text-accent' : 'text-text-muted'}`} />
                </div>
              </div>
              <div className="text-2xl font-black text-text-primary">{card.value}</div>
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider mt-1">{card.label}</div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
        <h3 className="text-sm font-black uppercase tracking-wide text-text-primary mb-4 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-accent" /> Recent Signups
        </h3>
        {data?.recentSignups?.length ? (
          <div className="space-y-2">
            {data.recentSignups.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-2 border-b border-border/10 last:border-0">
                <div>
                  <div className="text-sm font-bold text-text-primary">{u.name || 'Unknown'}</div>
                  <div className="text-xs text-text-muted font-mono">{u.email}</div>
                </div>
                <div className="text-[10px] text-text-muted font-mono">
                  {new Date(u.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-text-muted py-4 text-center">No recent signups</div>
        )}
      </div>
    </div>
  );
};

export default OverviewTab;
