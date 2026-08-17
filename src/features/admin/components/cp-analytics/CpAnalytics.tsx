import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TrendingUp, RefreshCw, BarChart2, ArrowDownLeft, ArrowUpRight, Activity, Users, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '@/core/services/api';
import { StatCard } from '@/shared/components/dashboard';
import { CpTx, Range } from './types';
import { buildKpis } from './utils';
import BarChart from './BarChart';
import PointsControl from './PointsControl';
import TransactionLedger from './TransactionLedger';

interface CpAnalyticsProps {
  users: Array<{ id: string; hackerHandle?: string; name?: string; email?: string }>;
  addToast: (msg: string, type: string) => void;
}

const fmtShort = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
};

const CpAnalytics: React.FC<CpAnalyticsProps> = ({ users, addToast }) => {
  const { t } = useTranslation();
  const [txs, setTxs] = useState<CpTx[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<Range>('30d');
  const [txPage, setTxPage] = useState(1);
  const [txTotal, setTxTotal] = useState(0);
  const [txFilter, setTxFilter] = useState<'all' | 'credit' | 'purchase' | 'deduct'>('all');
  const [txSearch, setTxSearch] = useState('');
  const [cpAction, setCpAction] = useState<'grant' | 'deduct' | 'set'>('grant');
  const [cpUserId, setCpUserId] = useState(users[0]?.id || '');
  const [cpValue, setCpValue] = useState(0);
  const [cpReason, setCpReason] = useState('');
  const [saving, setSaving] = useState(false);
  const TX_PAGE_SIZE = 20;

  const rangeDays = range === '7d' ? 7 : range === '30d' ? 30 : 90;

  const loadTxs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(TX_PAGE_SIZE),
        page: String(page),
      });
      if (txFilter !== 'all') params.set('type', txFilter);
      if (txSearch.trim()) params.set('search', txSearch.trim());
      const res = await api.get(`/admin/cp/transactions?${params}`);
      setTxs(res.data?.items ?? []);
      setTxTotal(Number(res.data?.total ?? 0));
      setTxPage(page);
    } catch {
      addToast(t('admin.cp.loadTransactionsFailed'), 'error');
    } finally {
      setLoading(false);
    }
  }, [txFilter, txSearch, addToast, t]);

  useEffect(() => { void loadTxs(1); }, [txFilter, txSearch]);

  const [allTxs, setAllTxs] = useState<CpTx[]>([]);
  useEffect(() => {
    api.get('/admin/cp/transactions?limit=500&page=1')
      .then(res => setAllTxs(res.data?.items ?? []))
      .catch(() => {});
  }, []);

  const kpis = useMemo(() => buildKpis(allTxs, rangeDays), [allTxs, rangeDays]);

  const typeBreakdown = useMemo(() => {
    const cutoff = Date.now() - rangeDays * 86_400_000;
    const counts = new Map<string, number>();
    for (const tx of allTxs) {
      if (new Date(tx.createdAt).getTime() < cutoff) continue;
      const t = tx.type || 'unknown';
      counts.set(t, (counts.get(t) ?? 0) + Math.abs(Number(tx.points || 0)));
    }
    const colors: Record<string, string> = {
      credit: 'var(--color-accent)', signup: 'var(--color-accent)', grant: 'var(--color-accent)',
      purchase: '#f87171', deduct: '#f87171',
      set: '#60a5fa',
    };
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value, color: colors[label] ?? '#6b7280' }));
  }, [allTxs, rangeDays]);

  const runCpAction = async () => {
    if (!cpUserId) { addToast(t('admin.cp.selectUser'), 'error'); return; }
    if (cpAction !== 'set' && cpValue <= 0) { addToast(t('admin.cp.pointsMustBePositive'), 'error'); return; }
    setSaving(true);
    try {
      if (cpAction === 'grant') await api.post('/admin/cp/grant', { userIds: [cpUserId], points: cpValue, reason: cpReason });
      else if (cpAction === 'deduct') await api.post('/admin/cp/deduct', { userIds: [cpUserId], points: cpValue, reason: cpReason });
      else await api.post('/admin/cp/set', { userIds: [cpUserId], value: cpValue, reason: cpReason });
      addToast(t('admin.cp.operationCompleted'), 'success');
      setCpValue(0); setCpReason('');
      void loadTxs(1);
    } catch (e: any) {
      addToast(e?.response?.data?.error || t('admin.cp.operationFailed'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(txTotal / TX_PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black uppercase tracking-tight text-text-primary flex items-center gap-2">
                 <TrendingUp className="h-4 w-4 text-accent" />
                 {t('admin.cp.economy')}
               </h2>
          <p className="text-xs text-text-muted mt-0.5">{t('admin.cp.economyDescription')}</p>
        </div>
        <div className="flex items-center gap-2">
          {(['7d','30d','90d'] as Range[]).map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                range === r ? 'btn-primary' : 'btn-secondary'
              }`}>
              {r}
            </button>
          ))}
          <button onClick={() => void loadTxs(1)}
            className="btn-secondary flex items-center gap-1.5 px-3 py-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard
          icon={<ArrowDownLeft className="w-5 h-5 text-accent" />}
          label={t('admin.cp.issued', { range })}
          value={fmtShort(kpis.totalIssued)}
          accent
        />
        <StatCard
          icon={<ArrowUpRight className="w-5 h-5 text-text-muted" />}
          label={t('admin.cp.burned', { range })}
          value={fmtShort(kpis.totalBurned)}
        />
        <StatCard
          icon={<Activity className="w-5 h-5 text-accent" />}
          label={t('admin.cp.netFlow', { range })}
          value={(kpis.netFlow >= 0 ? '+' : '') + fmtShort(kpis.netFlow)}
          accent={kpis.netFlow >= 0}
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-text-muted" />}
          label={t('admin.cp.activeUsers')}
          value={String(kpis.uniqueUsers)}
        />
        <StatCard
          icon={<BarChart2 className="w-5 h-5 text-text-muted" />}
          label={t('admin.cp.avgPerTx')}
          value={fmtShort(kpis.avgPerTx)}
        />
        <StatCard
          icon={<Award className="w-5 h-5 text-accent" />}
          label={t('admin.cp.topEarner')}
          value={kpis.topEarner.length > 12 ? kpis.topEarner.slice(0, 12) + '…' : kpis.topEarner}
          accent
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-accent" />
            <span className="text-sm font-black uppercase tracking-wide text-text-primary">{t('admin.cp.byType')}</span>
          </div>
          {typeBreakdown.length === 0 ? (
            <div className="text-sm text-text-muted py-4 text-center">{t('admin.cp.noData')}</div>
          ) : (
            <BarChart data={typeBreakdown} />
          )}
        </div>

        <PointsControl
          users={users}
          cpUserId={cpUserId}
          setCpUserId={setCpUserId}
          cpAction={cpAction}
          setCpAction={setCpAction}
          cpValue={cpValue}
          setCpValue={setCpValue}
          cpReason={cpReason}
          setCpReason={setCpReason}
          runCpAction={runCpAction}
          saving={saving}
        />
      </div>

      <TransactionLedger
        txs={txs}
        txTotal={txTotal}
        txPage={txPage}
        txFilter={txFilter}
        setTxFilter={setTxFilter}
        txSearch={txSearch}
        setTxSearch={setTxSearch}
        loadTxs={loadTxs}
        loading={loading}
        totalPages={totalPages}
      />
    </div>
  );
};

export default CpAnalytics;
