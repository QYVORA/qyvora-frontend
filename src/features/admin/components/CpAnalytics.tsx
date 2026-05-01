import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp, TrendingDown, Activity, Users, Coins,
  ArrowUpRight, ArrowDownLeft, RefreshCw, ChevronDown,
  BarChart2, Zap, Award,
} from 'lucide-react';
import api from '../../../core/services/api';
import CpLogo from '../../../shared/components/CpLogo';

// ─── Types ────────────────────────────────────────────────────────────────────
interface CpTx {
  _id: string;
  type: string;
  points: number;
  balanceAfter: number;
  note: string;
  createdAt: string;
  user?: { name?: string; email?: string; hackerHandle?: string };
}

interface KpiData {
  totalIssued: number;
  totalBurned: number;
  netFlow: number;
  uniqueUsers: number;
  avgPerTx: number;
  topEarner: string;
}

type Range = '7d' | '30d' | '90d';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString();
const fmtShort = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
};

function buildKpis(txs: CpTx[], days: number): KpiData {
  const cutoff = Date.now() - days * 86_400_000;
  const recent = txs.filter(t => new Date(t.createdAt).getTime() >= cutoff);
  let totalIssued = 0, totalBurned = 0;
  const userEarnings = new Map<string, number>();
  for (const tx of recent) {
    const pts = Number(tx.points || 0);
    if (pts > 0) {
      totalIssued += pts;
      const uid = tx.user?.hackerHandle || tx.user?.email || 'unknown';
      userEarnings.set(uid, (userEarnings.get(uid) ?? 0) + pts);
    } else {
      totalBurned += Math.abs(pts);
    }
  }
  const uniqueUsers = new Set(recent.map(t => t.user?.email || t._id)).size;
  const avgPerTx = recent.length ? Math.round((totalIssued + totalBurned) / recent.length) : 0;
  const topEarner = [...userEarnings.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  return { totalIssued, totalBurned, netFlow: totalIssued - totalBurned, uniqueUsers, avgPerTx, topEarner };
}

// ─── OHLC candle builder ──────────────────────────────────────────────────────
interface Candle {
  date: string; open: number; high: number; low: number; close: number;
  volume: number; issued: number; burned: number; txCount: number; bullish: boolean;
}

function buildCandles(txs: CpTx[], days: number): Candle[] {
  const now = Date.now();
  const keys: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * 86_400_000);
    keys.push(d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));
  }
  const buckets = new Map<string, { issued: number; burned: number; txCount: number }>();
  keys.forEach(k => buckets.set(k, { issued: 0, burned: 0, txCount: 0 }));
  const cutoff = now - days * 86_400_000;
  for (const tx of txs) {
    const ts = new Date(tx.createdAt).getTime();
    if (ts < cutoff) continue;
    const key = new Date(ts).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const b = buckets.get(key);
    if (!b) continue;
    const pts = Number(tx.points || 0);
    if (pts > 0) b.issued += pts; else b.burned += Math.abs(pts);
    b.txCount++;
  }
  let runningNet = 0;
  return keys.map(key => {
    const b = buckets.get(key)!;
    const dayNet = b.issued - b.burned;
    const open = runningNet;
    const close = runningNet + dayNet;
    const high = Math.max(open, close) + b.issued * 0.05;
    const low = Math.min(open, close) - b.burned * 0.05;
    runningNet = close;
    return { date: key, open, high, low, close, volume: b.issued + b.burned, issued: b.issued, burned: b.burned, txCount: b.txCount, bullish: close >= open };
  });
}

function sma(candles: Candle[], period: number): (number | null)[] {
  return candles.map((_, i) => {
    if (i < period - 1) return null;
    return candles.slice(i - period + 1, i + 1).reduce((s, c) => s + c.close, 0) / period;
  });
}

// ─── Trading Chart (candlestick + volume + SMA) ───────────────────────────────
const TradingChart: React.FC<{ candles: Candle[]; range: Range }> = ({ candles, range }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<{ idx: number; x: number } | null>(null);

  const W = 900, MAIN_H = 280, VOL_H = 60, PAD = { top: 24, right: 16, bottom: 8, left: 64 };
  const chartW = W - PAD.left - PAD.right;
  const mainH = MAIN_H - PAD.top - PAD.bottom;
  const totalH = MAIN_H + VOL_H + 28;

  const n = candles.length;
  const gap = chartW / Math.max(n, 1);
  const candleW = Math.max(2, Math.floor(gap * 0.65));

  const prices = candles.flatMap(c => [c.high, c.low]);
  const maxP = Math.max(...prices, 1);
  const minP = Math.min(...prices, 0);
  const priceRange = maxP - minP || 1;
  const maxVol = Math.max(...candles.map(c => c.volume), 1);

  const toX = (i: number) => PAD.left + i * gap + gap / 2;
  const toY = (v: number) => PAD.top + mainH - ((v - minP) / priceRange) * mainH;
  const toVolY = (v: number) => MAIN_H + VOL_H - (v / maxVol) * (VOL_H - 4);

  const sma7 = sma(candles, 7);
  const sma20 = sma(candles, 20);

  const smaPath = (vals: (number | null)[], color: string) => {
    let d = '';
    vals.forEach((v, i) => {
      if (v === null) return;
      d += d === '' ? `M ${toX(i)} ${toY(v)}` : ` L ${toX(i)} ${toY(v)}`;
    });
    return d ? <path d={d} fill="none" stroke={color} strokeWidth="1.5" opacity="0.75" strokeLinejoin="round" /> : null;
  };

  const yTicks = 5;
  const yLabels = Array.from({ length: yTicks + 1 }, (_, i) => {
    const v = minP + (priceRange * i) / yTicks;
    return { y: toY(v), label: fmtShort(Math.round(v)) };
  });
  const xStep = Math.max(1, Math.floor(n / 8));
  const hoveredCandle = hovered !== null ? candles[hovered.idx] : null;

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || !n) return;
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.round((svgX - PAD.left) / gap - 0.5);
    const clamped = Math.max(0, Math.min(n - 1, idx));
    setHovered({ idx: clamped, x: toX(clamped) });
  }, [n, gap]);

  const GREEN = '#88ad7c', RED = '#f87171', GRID = 'rgba(255,255,255,0.04)';

  return (
    <div className="relative w-full select-none">
      {/* Ticker header */}
      <div className="flex flex-wrap items-center gap-4 px-1 pb-3 border-b border-border/50 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base font-black font-mono text-text-primary">CP/NET</span>
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">HSOCIETY CHAIN · {range}</span>
        </div>
        {hoveredCandle ? (
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
            <span className="text-text-muted">{hoveredCandle.date}</span>
            <span className="text-text-muted">O <span className="text-text-primary">{fmtShort(hoveredCandle.open)}</span></span>
            <span className="text-text-muted">H <span style={{ color: hoveredCandle.bullish ? GREEN : RED }}>{fmtShort(hoveredCandle.high)}</span></span>
            <span className="text-text-muted">L <span style={{ color: hoveredCandle.bullish ? GREEN : RED }}>{fmtShort(hoveredCandle.low)}</span></span>
            <span className="text-text-muted">C <span style={{ color: hoveredCandle.bullish ? GREEN : RED }}>{fmtShort(hoveredCandle.close)}</span></span>
            <span className="text-text-muted">Vol <span className="text-text-primary">{fmtShort(hoveredCandle.volume)}</span></span>
            <span className="text-text-muted">+{fmt(hoveredCandle.issued)} <span style={{ color: GREEN }}>issued</span></span>
            <span className="text-text-muted">-{fmt(hoveredCandle.burned)} <span style={{ color: RED }}>burned</span></span>
            <span className="text-text-muted">{hoveredCandle.txCount} tx</span>
          </div>
        ) : candles.length > 0 ? (() => {
          const last = candles[candles.length - 1];
          const prev = candles[candles.length - 2];
          const chg = prev ? last.close - prev.close : 0;
          const pct = prev && prev.close !== 0 ? ((chg / Math.abs(prev.close)) * 100).toFixed(2) : '0.00';
          const up = chg >= 0;
          return (
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
              <span className="text-xl font-black" style={{ color: up ? GREEN : RED }}>{fmtShort(last.close)}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: up ? 'var(--color-accent-dim)' : 'rgba(248,113,113,0.15)', color: up ? GREEN : RED }}>
                {up ? '▲' : '▼'} {Math.abs(Number(pct))}%
              </span>
              <span className="text-text-muted">SMA7 <span style={{ color: '#60a5fa' }}>{fmtShort(Math.round(sma7[sma7.length - 1] ?? 0))}</span></span>
              <span className="text-text-muted">SMA20 <span style={{ color: '#f59e0b' }}>{fmtShort(Math.round(sma20[sma20.length - 1] ?? 0))}</span></span>
            </div>
          );
        })() : null}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${totalH}`}
        className="w-full"
        style={{ height: Math.round(totalH * 0.58) }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Grid */}
        {yLabels.map((t, i) => (
          <line key={i} x1={PAD.left} y1={t.y} x2={W - PAD.right} y2={t.y} stroke={GRID} strokeWidth="1" />
        ))}
        <line x1={PAD.left} y1={MAIN_H} x2={W - PAD.right} y2={MAIN_H} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* Y labels */}
        {yLabels.map((t, i) => (
          <text key={i} x={PAD.left - 6} y={t.y + 4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.3)" fontFamily="monospace">{t.label}</text>
        ))}
        <text x={PAD.left - 6} y={MAIN_H + 14} textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.22)" fontFamily="monospace">VOL</text>

        {/* Candles + volume bars */}
        {candles.map((c, i) => {
          const x = toX(i);
          const bodyTop = toY(Math.max(c.open, c.close));
          const bodyBot = toY(Math.min(c.open, c.close));
          const bodyH = Math.max(1, bodyBot - bodyTop);
          const color = c.bullish ? GREEN : RED;
          const isHov = hovered?.idx === i;
          return (
            <g key={i}>
              <line x1={x} y1={toY(c.high)} x2={x} y2={toY(c.low)} stroke={color} strokeWidth="1" opacity={isHov ? 1 : 0.8} />
              <rect x={x - candleW / 2} y={bodyTop} width={candleW} height={bodyH} fill={color} opacity={isHov ? 1 : 0.85} rx="0.5" />
              <rect x={x - candleW / 2} y={toVolY(c.volume)} width={candleW} height={MAIN_H + VOL_H - toVolY(c.volume)} fill={color} opacity={isHov ? 0.7 : 0.3} rx="0.5" />
            </g>
          );
        })}

        {/* SMA lines */}
        {smaPath(sma7, '#60a5fa')}
        {smaPath(sma20, '#f59e0b')}

        {/* Crosshair */}
        {hovered && (
          <>
            <line x1={hovered.x} y1={PAD.top} x2={hovered.x} y2={MAIN_H + VOL_H} stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="3 3" />
            {hoveredCandle && (
              <line x1={PAD.left} y1={toY(hoveredCandle.close)} x2={W - PAD.right} y2={toY(hoveredCandle.close)} stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 3" />
            )}
          </>
        )}

        {/* X labels */}
        {candles.map((c, i) => {
          if (i % xStep !== 0 && i !== n - 1) return null;
          return <text key={i} x={toX(i)} y={totalH - 4} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.28)" fontFamily="monospace">{c.date}</text>;
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 pt-2 px-1">
        {[
          { color: '#60a5fa', label: 'SMA 7', line: true },
          { color: '#f59e0b', label: 'SMA 20', line: true },
          { color: GREEN, label: 'Bullish (net +CP)', line: false },
          { color: RED, label: 'Bearish (net −CP)', line: false },
        ].map(({ color, label, line }) => (
          <div key={label} className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted">
            {line
              ? <span className="w-5 h-0.5 inline-block rounded" style={{ background: color }} />
              : <span className="w-3 h-3 inline-block rounded-sm opacity-85" style={{ background: color }} />
            }
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Bar chart for type breakdown ─────────────────────────────────────────────
const BarChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-20 text-[10px] font-mono text-text-muted uppercase tracking-wider truncate">{d.label}</div>
          <div className="flex-1 h-5 bg-bg rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: d.color }}
            />
          </div>
          <div className="w-16 text-right text-[10px] font-mono text-text-secondary">{fmtShort(d.value)}</div>
        </div>
      ))}
    </div>
  );
};

// ─── KPI card ─────────────────────────────────────────────────────────────────
const KpiCard: React.FC<{
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  accent?: boolean;
}> = ({ label, value, sub, icon, trend, accent }) => (
  <div className={`relative overflow-hidden rounded-2xl border-2 p-4 md:p-5 ${
    accent ? 'border-accent/30 bg-accent-dim/40' : 'border-border bg-bg-card'
  }`}>
    <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-10"
      style={{ background: accent ? 'var(--color-accent)' : 'transparent' }} />
    <div className="flex items-start justify-between gap-2 mb-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
        accent ? 'border-accent/30 bg-accent/10 text-accent' : 'border-border bg-bg text-text-muted'
      }`}>
        {icon}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] font-bold rounded-lg px-2 py-1 ${
          trend === 'up' ? 'text-accent bg-accent/10' :
          trend === 'down' ? 'text-red-400 bg-red-400/10' :
          'text-text-muted bg-border/30'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
           trend === 'down' ? <TrendingDown className="w-3 h-3" /> :
           <Activity className="w-3 h-3" />}
        </div>
      )}
    </div>
    <div className={`text-2xl font-black font-mono tabular-nums md:text-3xl ${accent ? 'text-accent' : 'text-text-primary'}`}>
      {value}
    </div>
    <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">{label}</div>
    {sub && <div className="mt-0.5 text-[10px] text-text-muted truncate">{sub}</div>}
  </div>
);

// ─── Main CpAnalytics component ───────────────────────────────────────────────
interface CpAnalyticsProps {
  users: Array<{ id: string; hackerHandle?: string; name?: string; email?: string }>;
  addToast: (msg: string, type: string) => void;
}

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

  // Load all txs for chart (up to 500 most recent — enough for 90d)
  const [allTxs, setAllTxs] = useState<CpTx[]>([]);
  useEffect(() => {
    api.get('/admin/cp/transactions?limit=500&page=1')
      .then(res => setAllTxs(res.data?.items ?? []))
      .catch(() => {});
  }, []);

  const candles = useMemo(() => buildCandles(allTxs, rangeDays), [allTxs, rangeDays]);
  const kpis = useMemo(() => buildKpis(allTxs, rangeDays), [allTxs, rangeDays]);

  // Type breakdown for bar chart
  const typeBreakdown = useMemo(() => {
    const cutoff = Date.now() - rangeDays * 86_400_000;
    const counts = new Map<string, number>();
    for (const tx of allTxs) {
      if (new Date(tx.createdAt).getTime() < cutoff) continue;
      const t = tx.type || 'unknown';
      counts.set(t, (counts.get(t) ?? 0) + Math.abs(Number(tx.points || 0)));
    }
    const colors: Record<string, string> = {
      credit: '#88ad7c', signup: '#88ad7c', grant: '#88ad7c',
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

      {/* ── Header row ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black uppercase tracking-tight text-text-primary">CP Economy</h2>
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

      {/* ── KPI cards ── */}
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

      {/* ── Trading chart ── */}
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

      {/* ── Two-col: type breakdown + points control ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Type breakdown */}
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

        {/* Points control */}
        <div className="rounded-2xl border-2 border-border bg-bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Coins className="w-4 h-4 text-accent" />
            <span className="text-sm font-black uppercase tracking-wide text-text-primary">Points Control</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase text-text-muted tracking-widest block mb-1.5">User</label>
              <div className="relative">
                <select
                  value={cpUserId}
                  onChange={e => setCpUserId(e.target.value)}
                  className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent appearance-none pr-8"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.hackerHandle || u.name || u.email}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['grant','deduct','set'] as const).map(a => (
                <button key={a} onClick={() => setCpAction(a)}
                  className={`py-2 rounded-xl border text-xs font-bold uppercase tracking-wide transition-colors ${
                    cpAction === a
                      ? a === 'deduct' ? 'border-red-500/40 text-red-400 bg-red-500/10'
                        : 'border-accent/40 text-accent bg-accent-dim'
                      : 'border-border text-text-muted hover:border-accent/30'
                  }`}>
                  {a}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={cpValue || ''}
              onChange={e => setCpValue(Number(e.target.value || 0))}
              placeholder={cpAction === 'set' ? 'Target value' : 'Points amount'}
              className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
            />
            <input
              value={cpReason}
              onChange={e => setCpReason(e.target.value)}
              placeholder="Reason (optional)"
              className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
            />
            <button
              onClick={() => void runCpAction()}
              disabled={saving}
              className="w-full py-3 rounded-xl border border-accent/40 text-accent bg-accent-dim hover:bg-accent/20 text-sm font-black uppercase tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <><div className="w-4 h-4 rounded-full border-2 border-accent/30 border-t-accent animate-spin" /> Processing…</> : 'Execute'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Transaction ledger ── */}
      <div className="rounded-2xl border-2 border-border bg-bg-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent" />
            <span className="text-sm font-black uppercase tracking-wide text-text-primary">Transaction Ledger</span>
            <span className="text-[10px] font-mono text-text-muted">{txTotal} total</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={txSearch}
              onChange={e => setTxSearch(e.target.value)}
              placeholder="Search user…"
              className="bg-bg border border-border rounded-xl px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent w-36"
            />
            <select
              value={txFilter}
              onChange={e => setTxFilter(e.target.value as any)}
              className="bg-bg border border-border rounded-xl px-2 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="all">All types</option>
              <option value="credit">Credit</option>
              <option value="purchase">Purchase</option>
              <option value="deduct">Deduct</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="divide-y divide-border/50">
            {[0,1,2,3,4].map(i => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-accent-dim/30 flex-none" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-accent-dim/30 rounded w-1/3" />
                  <div className="h-2 bg-accent-dim/20 rounded w-1/2" />
                </div>
                <div className="w-16 h-4 bg-accent-dim/20 rounded flex-none" />
              </div>
            ))}
          </div>
        ) : txs.length === 0 ? (
          <div className="py-12 text-center text-sm text-text-muted">No transactions found.</div>
        ) : (
          <>
            {/* Mobile */}
            <div className="md:hidden divide-y divide-border/50">
              {txs.map(tx => {
                const pts = Number(tx.points || 0);
                const isCredit = pts >= 0;
                return (
                  <div key={tx._id} className="px-4 py-3 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-none border ${
                      isCredit ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-red-400/10 border-red-400/20 text-red-400'
                    }`}>
                      {isCredit ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-text-primary truncate">
                        {tx.user?.hackerHandle || tx.user?.name || tx.user?.email || '—'}
                      </div>
                      <div className="text-[10px] text-text-muted truncate">{tx.note || tx.type}</div>
                      <div className="text-[10px] text-text-muted font-mono">
                        {new Date(tx.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </div>
                    </div>
                    <div className={`text-sm font-mono font-bold flex-none ${isCredit ? 'text-accent' : 'text-red-400'}`}>
                      {isCredit ? '+' : ''}{fmt(pts)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead className="border-b border-border bg-bg">
                  <tr>
                    {['User','Type','Points','Balance After','Note','Date'].map(h => (
                      <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-widest text-text-muted">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {txs.map(tx => {
                    const pts = Number(tx.points || 0);
                    const isCredit = pts >= 0;
                    return (
                      <tr key={tx._id} className="hover:bg-accent-dim/10 transition-colors">
                        <td className="px-4 py-3">
                          <div className="text-xs font-bold text-text-primary">
                            {tx.user?.hackerHandle || tx.user?.name || '—'}
                          </div>
                          <div className="text-[10px] text-text-muted">{tx.user?.email || ''}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg border ${
                            isCredit ? 'text-accent border-accent/20 bg-accent/5' : 'text-red-400 border-red-400/20 bg-red-400/5'
                          }`}>{tx.type || '—'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-mono font-bold inline-flex items-center gap-1 ${isCredit ? 'text-accent' : 'text-red-400'}`}>
                            {isCredit ? '+' : ''}{fmt(pts)} <CpLogo className="w-3 h-3" />
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-text-secondary">
                          {tx.balanceAfter != null ? fmt(Number(tx.balanceAfter)) : '—'}
                        </td>
                        <td className="px-4 py-3 text-xs text-text-muted max-w-[180px] truncate">{tx.note || '—'}</td>
                        <td className="px-4 py-3 text-[10px] font-mono text-text-muted whitespace-nowrap">
                          {new Date(tx.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-3">
                <span className="text-xs text-text-muted">
                  Page {txPage} of {totalPages} · {txTotal} transactions
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => void loadTxs(txPage - 1)}
                    disabled={txPage <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-muted disabled:opacity-40 hover:border-accent/30 hover:text-accent transition-colors text-xs"
                  >‹</button>
                  <button
                    onClick={() => void loadTxs(txPage + 1)}
                    disabled={txPage >= totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-muted disabled:opacity-40 hover:border-accent/30 hover:text-accent transition-colors text-xs"
                  >›</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CpAnalytics;
