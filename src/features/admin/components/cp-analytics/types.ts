export interface CpTx {
  _id: string;
  type: string;
  points: number;
  balanceAfter: number;
  note: string;
  createdAt: string;
  user?: { name?: string; email?: string; hackerHandle?: string };
}

export interface KpiData {
  totalIssued: number;
  totalBurned: number;
  netFlow: number;
  uniqueUsers: number;
  avgPerTx: number;
  topEarner: string;
}

export interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  issued: number;
  burned: number;
  txCount: number;
  bullish: boolean;
}

export type Range = '7d' | '30d' | '90d';
