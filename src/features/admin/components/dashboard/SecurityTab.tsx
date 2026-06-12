import React from 'react';
import { SecurityEventItem } from '../../types/admin.types';

interface SecurityTabProps { securitySummary: any; securityEvents: SecurityEventItem[]; }

const StatCard = ({ label, value }: { label: string; value: number | string }) => (
  <div className="rounded-2xl border border-border/40 bg-bg-card p-5 md:p-6 shadow-sm">
    <div className="mb-2 text-xs font-bold uppercase tracking-widest text-text-muted">{label}</div>
    <div className="text-3xl font-black tabular-nums text-text-primary md:text-4xl">{value}</div>
  </div>
);

const SecurityTab: React.FC<SecurityTabProps> = ({ securitySummary, securityEvents }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Events 24h" value={Number(securitySummary?.events24h || 0)} />
        <StatCard label="Unique IPs 24h" value={Number(securitySummary?.uniqueIps24h || 0)} />
        <StatCard label="Auth Failures 24h" value={Number(securitySummary?.authFailures24h || 0)} />
      </div>

      <div className="md:hidden space-y-6">
        {securityEvents.map(item => (
          <div key={item.id} className="bg-bg-card border border-border/40 rounded-2xl p-5 space-y-3 text-xs shadow-lg shadow-black/5">
            <div className="flex justify-between items-center">
              <span className="font-black text-accent uppercase tracking-[0.2em] text-[10px]">{item.eventType}</span>
              <span className="text-[9px] text-text-muted/60 font-mono">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}</span>
            </div>
            <div className="font-black text-text-primary uppercase tracking-tighter text-sm">{item.action}</div>
            <div className="bg-bg px-4 py-3 rounded-xl font-mono text-[10px] text-accent/70 border border-border/40 break-all overflow-x-auto whitespace-nowrap shadow-sm">
              {item.path || '—'}
            </div>
            <div className="flex justify-between items-center pt-2 text-[10px] font-black text-text-muted/40 uppercase tracking-widest">
              <span className={Number(item.statusCode) >= 400 ? 'text-red-400' : 'text-accent'}>HTTP {item.statusCode}</span>
              <span className="font-mono">{item.ipAddress || '—'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block bg-bg-card border border-border/40 rounded-2xl overflow-hidden shadow-xl shadow-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[860px]">
            <thead className="bg-bg-elevated/50 border-b border-border/40 backdrop-blur-sm">
              <tr>{['Time','Type','Action','Path','Code','IP'].map(h => <th key={h} className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.25em] text-text-muted/60">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {securityEvents.map(item => (
                <tr key={item.id} className="text-xs hover:bg-accent-dim/5 transition-colors group">
                  <td className="px-6 py-6 text-text-muted/60 font-mono whitespace-nowrap">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}</td>
                  <td className="px-6 py-6"><span className="px-2.5 py-1 rounded-lg bg-accent-dim text-[9px] font-black uppercase tracking-widest text-accent whitespace-nowrap border border-accent/10">{item.eventType}</span></td>
                  <td className="px-6 py-6 font-black uppercase tracking-tight text-text-primary text-sm whitespace-nowrap">{item.action}</td>
                  <td className="px-6 py-6 font-mono text-text-muted/70 max-w-[240px] truncate">{item.path || '—'}</td>
                  <td className="px-6 py-6"><span className={`px-2.5 py-1 rounded-lg text-[10px] font-black font-mono border ${Number(item.statusCode) >= 400 ? 'bg-red-400/10 text-red-400 border-red-400/20' : 'bg-accent/10 text-accent border-accent/20'}`}>{item.statusCode}</span></td>
                  <td className="px-6 py-6 font-mono text-text-secondary/80 whitespace-nowrap">{item.ipAddress || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
