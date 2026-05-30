import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  accent?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, sub, icon, trend, accent }) => (
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

export default KpiCard;
