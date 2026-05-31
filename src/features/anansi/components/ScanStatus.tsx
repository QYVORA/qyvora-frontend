import React, { useState, useEffect } from 'react';
import { Activity, Zap, Cpu, Database } from 'lucide-react';
import AnansiLogo from '../../../shared/components/brand/AnansiLogo';
import { cn } from '../../../shared/utils/cn';

interface ScanStatusProps {
  scanId: string;
  status: string;
  progress: number;
  target: string;
  layout?: 'standalone' | 'dashboard';
}

const MESSAGES = {
  discovery: [
    "enumerating subdomains",
    "querying transparency logs",
    "resolving dns records",
    "mapping ip space"
  ],
  probing: [
    "probing live hosts",
    "fingerprinting services",
    "capturing headers",
    "detecting waf"
  ],
  analysis: [
    "checking security headers",
    "testing cors policy",
    "scanning exposed paths",
    "checking tls"
  ],
  persisting: [
    "normalizing findings",
    "computing risk score",
    "writing to database"
  ]
};

const ScanStatus: React.FC<ScanStatusProps> = ({ scanId, status, progress, target, layout = 'standalone' }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  const getPhaseLabel = () => {
    if (progress >= 100) return "COMPLETE";
    if (progress >= 76) return "PHASE 04 — PERSISTING";
    if (progress >= 51) return "PHASE 03 — ANALYSIS";
    if (progress >= 26) return "PHASE 02 — PROBING";
    return "PHASE 01 — DISCOVERY";
  };

  const getCurrentMessages = () => {
    if (progress >= 76) return MESSAGES.persisting;
    if (progress >= 51) return MESSAGES.analysis;
    if (progress >= 26) return MESSAGES.probing;
    return MESSAGES.discovery;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % getCurrentMessages().length);
    }, 2000);
    return () => clearInterval(interval);
  }, [progress]);

  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'text-green-500 border-green-500/20';
      case 'failed': return 'text-red-500 border-red-500/20';
      case 'running': return isDashboard ? 'text-accent border-accent/20' : 'text-cyan-500 border-cyan-500/20';
      default: return 'text-yellow-500 border-yellow-500/20';
    }
  };

  const currentMessages = getCurrentMessages();
  const displayMessage = currentMessages[messageIndex % currentMessages.length];
  const isDashboard = layout === 'dashboard';

  return (
    <div className={cn(
      "border border-white/10 rounded-3xl bg-bg-elevated/40 p-8 md:p-12",
      isDashboard ? "border-accent/20" : "border-white/10"
    )}>
      <div className="space-y-12">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className={cn(
              "p-4 rounded-2xl bg-black/40 border border-white/5",
              status === 'running' && "animate-pulse"
            )}>
              <Activity className={cn(
                "w-6 h-6",
                status === 'running' ? isDashboard ? 'text-accent' : 'text-cyan-500' : 'text-text-muted'
              )} />
            </div>
            <div>
              <h2 className="text-base font-black text-text-primary uppercase tracking-[0.2em] mb-1">Engine Operational</h2>
              <p className="text-xs text-text-muted font-mono uppercase tracking-widest flex items-center gap-2">
                <Database size={12} /> {target}
              </p>
            </div>
          </div>
          <div className={cn(
            "px-4 py-1 rounded border text-[10px] font-black uppercase tracking-[0.3em]",
            getStatusColor()
          )}>
            {status}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-2">
            <span className="text-[9px] text-text-muted uppercase tracking-widest block font-black">Operation ID</span>
            <span className="text-[10px] font-mono text-text-primary truncate block">{scanId}</span>
          </div>
          <div className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-2">
            <span className="text-[9px] text-text-muted uppercase tracking-widest block font-black">Nodes</span>
            <div className="flex items-center gap-2 text-text-primary font-mono text-[10px] uppercase">
              <Zap size={10} className="text-yellow-500" /> Distributed
            </div>
          </div>
          <div className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-2">
            <span className="text-[9px] text-text-muted uppercase tracking-widest block font-black">Priority</span>
            <div className="flex items-center gap-2 text-text-primary font-mono text-[10px] uppercase">
              <Cpu size={10} className="text-green-500" /> Tier 01
            </div>
          </div>
        </div>

        {/* Progress System */}
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">{getPhaseLabel()}</span>
              <span className="text-xs font-mono text-text-primary uppercase tracking-widest">{displayMessage}...</span>
            </div>
            <span className={cn(
              "text-3xl font-black tracking-tighter",
              isDashboard ? "text-accent" : "text-cyan-500"
            )}>{progress}%</span>
          </div>
          
          <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className={cn(
                "h-full transition-all duration-1000 ease-in-out",
                isDashboard ? "bg-accent" : "bg-cyan-500"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Brand Context */}
        <div className="flex items-start gap-6 p-6 border border-white/5 rounded-2xl bg-black/20">
          <AnansiLogo size={40} />
          <div className="space-y-2">
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest block",
              isDashboard ? "text-accent" : "text-cyan-500"
            )}>Intelligence Briefing</span>
            <p className="text-[11px] text-text-secondary leading-relaxed font-mono uppercase tracking-tight italic opacity-70">
              The engine is executing a deep-layer reconnaissance sequence. results are being verified and cryptographically signed before display.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanStatus;
