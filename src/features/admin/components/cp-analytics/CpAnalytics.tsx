import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TrendingUp, RefreshCw, Zap, BarChart2 } from 'lucide-react';
import api from '../../../../core/services/api';
import { CpTx, Range } from './types';
import { buildCandles, buildKpis } from './utils';
import TradingChart from './TradingChart';
import BarChart from './BarChart';
import KpiCard from './KpiCard';
import PointsControl from './PointsControl';
import TransactionLedger from './TransactionLedger';
import { ArrowDownLeft, ArrowUpRight, Activity, Users, Award } from 'lucide-react';

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
      addToast('Failed to load CP transactions', 'error');
    } finally {
      setLoading(false);
    }
  }, [txFilter, txSearch, addToast]);

  useEffect(() => { void loadTxs(1); }, [txFilter, txSearch]);

  const [allTxs, setAllTxs] = useState<CpTx[]>([]);
  useEffect(() => {
    api.get('/admin/cp/transactions?limit=500&page=1')
      .then(res => setAllTxs(res.data?.items ?? []))
      .catch(() => {});
  }, []);

  const candles = useMemo(() => buildCandles(allTxs, rangeDays), [allTxs, rangeDays]);
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
      credit: '#58A366', signup: '#58A366', grant: '#58A366',
      purchase: '#f87171', deduct: '#f87171',
      set: '#60a5fa',
    };
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value, color: colors[label] ?? '#6b7280' }));
  }, [allTxs, rangeDays]);

  const runCpAction = async () => {
    if (!cpUserId) { addToast('Select a user first.', 'error'); return; }
    if (cpAction !== 'set' && cpValue <= 0) { addToast('Points must be > 0.', 'error'); return; }
    setSaving(true);
    try {
      if (cpAction === 'grant') await api.post('/admin/cp/grant', { userIds: [cpUserId], points: cpValue, reason: cpReason });
      else if (cpAction === 'deduct') await api.post('/admin/cp/deduct', { userIds: [cpUserId], points: cpValue, reason: cpReason });
      else await api.post('/admin/cp/set', { userIds: [cpUserId], value: cpValue, reason: cpReason });
      addToast('Points operation completed', 'success');
      setCpValue(0); setCpReason('');
      void loadTxs(1);
    } catch (e: any) {
      addToast(e?.response?.data?.error || 'Points operation failed', 'error');
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
                 CP Economy
               </h2>
          <p className="text-xs text-text-muted mt-0.5">Real-time Cyber Points flow — issued, burned, net</p>
        </div>
        <div className="flex items-center gap-2">
          {(['7d','30d','90d'] as Range[]).map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${
                range === r ? 'bg-accent text-bg' : 'border border-border text-text-muted hover:border-accent/30 hover:text-accent'
              }`}>
              {r}
            </button>
          ))}
          <button onClick={() => void loadTxs(1)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-bold text-text-muted hover:text-accent hover:border-accent/30 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <KpiCard
          label={`CP Issued (${range})`}
          value={fmtShort(kpis.totalIssued)}
          icon={<ArrowDownLeft className="w-4 h-4" />}
          trend="up" accent
        />
        <KpiCard
          label={`CP Burned (${range})`}
          value={fmtShort(kpis.totalBurned)}
          icon={<ArrowUpRight className="w-4 h-4" />}
          trend="down"
        />
        <KpiCard
          label={`Net Flow (${range})`}
          value={(kpis.netFlow >= 0 ? '+' : '') + fmtShort(kpis.netFlow)}
          icon={<Activity className="w-4 h-4" />}
          trend={kpis.netFlow >= 0 ? 'up' : 'down'}
        />
        <KpiCard
          label="Active Users"
          value={String(kpis.uniqueUsers)}
          icon={<Users className="w-4 h-4" />}
          trend="neutral"
        />
        <KpiCard
          label="Avg per Tx"
          value={fmtShort(kpis.avgPerTx)}
          sub="CP per transaction"
          icon={<BarChart2 className="w-4 h-4" />}
          trend="neutral"
        />
        <KpiCard
          label="Top Earner"
          value={kpis.topEarner.length > 12 ? kpis.topEarner.slice(0, 12) + '…' : kpis.topEarner}
          sub={`in last ${range}`}
          icon={<Award className="w-4 h-4" />}
          trend="up"
        />
      </div>

      <div className="rounded-2xl border-2 border-border bg-bg-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-sm font-black uppercase tracking-wide text-text-primary">CP Trading Chart</span>
          <span className="text-[10px] font-mono text-text-muted">candlestick · SMA · volume</span>
        </div>
        <div className="p-4 md:p-5">
          {loading && allTxs.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
            </div>
          ) : candles.every(c => c.volume === 0) ? (
            <div className="h-[260px] flex items-center justify-center text-sm text-text-muted">
              No CP activity in this period
            </div>
          ) : (
            <TradingChart candles={candles} range={range} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-border bg-bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-accent" />
            <span className="text-sm font-black uppercase tracking-wide text-text-primary">By Type</span>
          </div>
          {typeBreakdown.length === 0 ? (
            <div className="text-sm text-text-muted py-4 text-center">No data</div>
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
