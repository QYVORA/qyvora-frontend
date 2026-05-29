import React from 'react';
import { Activity, Terminal, Zap } from 'lucide-react';
import AnansiLogo from '../../../shared/components/brand/AnansiLogo';

interface ScanStatusProps {
  scanId: string;
  status: string;
  progress: number;
  target: string;
}

const ScanStatus: React.FC<ScanStatusProps> = ({ scanId, status, progress, target }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'text-green-500 border-green-500/20 bg-green-500/5';
      case 'failed': return 'text-red-500 border-red-500/20 bg-red-500/5';
      case 'running': return 'text-cyan-500 border-cyan-500/20 bg-cyan-500/5';
      default: return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5';
    }
  };

  return (
    <div className="terminal-card p-6 md:p-8 lg:p-10 relative overflow-hidden border-cyan-500/20">
      {/* Decorative pulse glow */}
      {status === 'running' && (
        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/30 animate-pulse" />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${status === 'running' ? 'bg-cyan-500/10 animate-pulse' : 'bg-bg-elevated'}`}>
              <Activity className={`w-4 h-4 ${status === 'running' ? 'text-cyan-500' : 'text-text-muted'}`} />
            </div>
            <div>
              <h2 className="text-sm font-black text-text-primary uppercase tracking-tight">Deployment Status</h2>
              <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">{target}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-sm border text-[9px] font-black uppercase tracking-[0.2em] ${getStatusColor()}`}>
            {status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-bg/40 rounded-xl border border-border">
            <span className="text-[9px] text-text-muted uppercase tracking-widest block mb-1">Session ID</span>
            <span className="text-[10px] font-mono text-cyan-500/80 truncate block">{scanId}</span>
          </div>
          <div className="p-4 bg-bg/40 rounded-xl border border-border">
            <span className="text-[9px] text-text-muted uppercase tracking-widest block mb-1">Engine Load</span>
            <div className="flex items-center gap-2">
              <Zap size={10} className="text-yellow-500" />
              <span className="text-[10px] font-mono text-text-secondary uppercase">Optimal / Scaled</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Reconnaissance Progress</span>
            <span className="text-sm font-black text-cyan-500 tracking-tighter">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-border/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {status === 'running' && (
          <div className="mt-8 flex items-start gap-4 p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl">
            <AnansiLogo size={20} minimal className="mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest block mb-1">Active Intelligence Gathering</span>
              <p className="text-[11px] text-cyan-500/70 leading-relaxed font-mono italic">
                Scanning for assets, subdomains, and vulnerabilities... Results will be aggregated and verified by Anansi.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanStatus;

