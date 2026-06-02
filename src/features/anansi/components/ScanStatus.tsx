import React, { useState, useEffect } from 'react';
import { Activity, Zap, Cpu, Database, X } from 'lucide-react';
import AnansiLogo from '../../../shared/components/brand/AnansiLogo';
import { cn } from '../../../shared/utils/cn';

interface ScanStatusProps {
  scanId: string;
  status: string;
  progress: number;
  target: string;
  layout?: 'standalone' | 'dashboard';
  onCancel?: () => void;
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

const ScanStatus: React.FC<ScanStatusProps> = ({ scanId, status, progress, target, layout = 'standalone', onCancel }) => {
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
      "border border-white/10 rounded-3xl bg-bg-elevated/40 p-6 md:p-12 lg:p-16 md:min-h-[400px]",
      isDashboard ? "border-accent/20" : "border-white/10"
    )}>
      <div className="space-y-8 md:space-y-10">
        {/* Header Area with Cancel Button */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5 md:gap-6">
            <div className={cn(
              "p-3 md:p-4 rounded-2xl bg-black/40 border border-white/5",
              status === 'running' && "animate-pulse"
            )}>
              <Activity className={cn(
                "w-5 h-5 md:w-6 md:h-6",
                status === 'running' ? isDashboard ? 'text-accent' : 'text-cyan-500' : 'text-text-muted'
              )} />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-black text-text-primary uppercase tracking-[0.2em] mb-1">Scanning</h2>
              <p className="text-xs md:text-sm text-text-muted font-mono uppercase tracking-widest flex items-center gap-2">
                <Database size={10} className="md:w-3 md:h-3" /> {target}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={cn(
              "px-3 py-1 md:px-4 md:py-2 rounded border text-[10px] md:text-xs font-black uppercase tracking-[0.3em]",
              getStatusColor()
            )}>
              {status}
            </div>
            {onCancel && (status === 'running' || status === 'queued') && (
              <button
                onClick={onCancel}
                className="p-2 md:p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors"
                aria-label="Cancel scan"
              >
                <X size={16} className="md:w-5 md:h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Progress System */}
        <div className="space-y-5 md:space-y-6">
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1 md:gap-2">
              <span className="text-[10px] md:text-xs font-black text-text-muted uppercase tracking-[0.3em]">{getPhaseLabel()}</span>
              <span className="text-xs md:text-sm font-mono text-text-primary uppercase tracking-widest">{displayMessage}...</span>
            </div>
            <span className={cn(
              "text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter",
              isDashboard ? "text-accent" : "text-cyan-500"
            )}>{progress}%</span>
          </div>
          
          <div className="h-2 md:h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className={cn(
                "h-full transition-all duration-1000 ease-in-out",
                isDashboard ? "bg-accent" : "bg-cyan-500"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanStatus;
