import { CpTx, KpiData, Candle } from './types';

export const fmt = (n: number) => n.toLocaleString();

export const fmtShort = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
};

export function buildKpis(txs: CpTx[], days: number): KpiData {
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

export function buildCandles(txs: CpTx[], days: number): Candle[] {
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

export function sma(candles: Candle[], period: number): (number | null)[] {
  return candles.map((_, i) => {
    if (i < period - 1) return null;
    return candles.slice(i - period + 1, i + 1).reduce((s, c) => s + c.close, 0) / period;
  });
}
