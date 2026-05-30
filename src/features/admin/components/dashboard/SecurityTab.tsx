import React from 'react';
import { Ban, Unlock } from 'lucide-react';
import { SecurityEventItem } from '../../types/admin.types';

interface SecurityTabProps {
  securitySummary: any;
  securityEvents: SecurityEventItem[];
}

const StatCard = ({ label, value }: { label: string; value: number | string }) => (
  <div className="rounded-2xl border-2 border-border bg-bg-card p-5 md:p-6">
    <div className="mb-2 text-xs font-bold uppercase tracking-widest text-text-muted">{label}</div>
    <div className="text-3xl font-black tabular-nums text-text-primary md:text-4xl">{value}</div>
  </div>
);

const SecurityTab: React.FC<SecurityTabProps> = ({
  securitySummary,
  securityEvents,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Events 24h" value={Number(securitySummary?.events24h || 0)} />
        <StatCard label="Unique IPs 24h" value={Number(securitySummary?.uniqueIps24h || 0)} />
        <StatCard label="Auth Failures 24h" value={Number(securitySummary?.authFailures24h || 0)} />
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-4">
        {securityEvents.map(item => (
          <div key={item.id} className="bg-bg-card border-2 border-border rounded-2xl p-5 space-y-2 text-xs shadow-lg">
            <div className="flex justify-between items-start">
              <span className="font-black text-accent uppercase tracking-widest text-[10px]">{item.eventType}</span>
              <span className="text-[10px] text-text-muted font-mono">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}</span>
            </div>
            <div className="font-black text-text-primary uppercase tracking-tight text-sm mt-1">{item.action}</div>
            <div className="bg-bg p-3 rounded-xl border border-border font-mono text-[10px] text-text-muted break-all mt-2 overflow-x-auto whitespace-nowrap">
              {item.path || '—'}
            </div>
            <div className="flex justify-between items-center pt-2 text-[10px] font-bold text-text-muted uppercase tracking-widest border-t border-border/50">
              <span>HTTP {item.statusCode}</span>
              <span className="font-mono">{item.ipAddress || '—'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden md:block bg-bg-card border-2 border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[860px]">
            <thead className="border-b-2 border-border bg-bg/50 backdrop-blur-sm">
              <tr>
                {['Time','Type','Action','Path','Code','IP'].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {securityEvents.map(item => (
                <tr key={item.id} className="text-xs hover:bg-accent-dim/10 transition-colors group">
                  <td className="px-6 py-5 text-text-muted font-mono whitespace-nowrap">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}</td>
                  <td className="px-6 py-5">
                    <span className="px-2 py-1 rounded bg-accent-dim/30 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/10 whitespace-nowrap">
                      {item.eventType}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-black uppercase tracking-tight text-text-primary text-sm whitespace-nowrap">{item.action}</td>
                  <td className="px-6 py-5 font-mono text-text-muted max-w-[240px] truncate">{item.path || '—'}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded text-[10px] font-black font-mono border ${Number(item.statusCode) >= 400 ? 'bg-red-400/10 text-red-400 border-red-400/20' : 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'}`}>
                      {item.statusCode}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-mono text-text-secondary whitespace-nowrap">{item.ipAddress || '—'}</td>
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
