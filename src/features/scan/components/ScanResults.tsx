import React from 'react';
import { Server, AlertTriangle, CheckCircle, Target, FileText } from 'lucide-react';
import AnansiLogo from '../../../shared/components/brand/AnansiLogo';
import type { ScanFullResultsResponse } from '../services/scanApi';
import { cn } from '../../../shared/utils/cn';
const ScanResults: React.FC<ScanResultsProps> = ({ results }) => {
  const getSeverityStyle = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-purple-500 border-purple-500/30 bg-purple-500/5';
      case 'high': return 'text-red-500 border-red-500/30 bg-red-500/5';
      case 'medium': return 'text-orange-500 border-orange-500/30 bg-orange-500/5';
      case 'low': return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/5';
      default: return 'text-cyan-500 border-cyan-500/30 bg-cyan-500/5';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-500';
    if (score >= 50) return 'text-orange-500';
    if (score >= 20) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-12 pb-24">
      {/* ── Risk Score & Intelligence Summary ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
        <div className="terminal-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-6">Threat Risk Index</span>
            <div className={cn("text-7xl font-black tracking-tighter transition-all duration-700", getRiskColor(results.riskScore))}>
              {results.riskScore}
            </div>
            <div className="mt-8 w-40 h-1.5 bg-border/40 rounded-full overflow-hidden p-[1px]">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-1000 ease-out",
                  results.riskScore >= 50 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                )}
                style={{ width: `${results.riskScore}%` }}
              />
            </div>
            <p className="mt-4 text-[9px] font-mono text-text-muted uppercase tracking-widest opacity-60">
              {results.riskScore >= 70 ? 'High probability of breach' : results.riskScore >= 30 ? 'Surface vulnerabilities detected' : 'Minimal external exposure'}
            </p>
          </div>
        </div>

        <div className="terminal-card p-8 lg:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
            <AnansiLogo size={160} minimal />
          </div>

          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.25em] mb-10 flex items-center gap-3">
              <Target className="w-4 h-4 text-cyan-500" />
              Intelligence Summary
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-10 gap-x-6 mt-auto">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Total Assets</span>
                <span className="text-3xl font-black text-text-primary tracking-tight font-mono">{results.summary.totalAssets}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Live Nodes</span>
                <span className="text-3xl font-black text-green-500 tracking-tight font-mono">{results.summary.liveAssets}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Findings</span>
                <span className="text-3xl font-black text-red-500 tracking-tight font-mono">{results.summary.totalVulnerabilities}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Analyzed</span>
                <span className="text-xs font-black text-cyan-500 uppercase tracking-widest mt-2">
                  {new Date(results.completedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Security Vulnerabilities ── */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-[1px] w-12 bg-red-500/40" />
          <h2 className="text-sm font-black text-text-primary uppercase tracking-[0.3em] flex items-center gap-3">
            Critical Findings
          </h2>
        </div>
        
        {results.vulnerabilities.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {results.vulnerabilities.map((v, i) => (
              <div key={i} className="terminal-card group hover:border-red-500/30 transition-all duration-300 overflow-hidden">
                <div className="relative z-10">
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 bg-bg/20">
                    <div className="flex flex-col gap-1.5">
                      <h4 className="text-base font-black text-text-primary uppercase tracking-tight group-hover:text-red-500 transition-colors leading-none">{v.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Affected:</span>
                        <span className="text-[10px] font-mono text-cyan-500/80 tracking-tight">{v.affectedAsset}</span>
                      </div>
                    </div>
                    <span className={cn(
                      "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.25em] border self-start sm:self-center transition-all group-hover:scale-105",
                      getSeverityStyle(v.severity)
                    )}>
                      {v.severity}
                    </span>
                  </div>
                  <div className="p-6 bg-bg/10">
                    <div className="flex gap-4 mb-8">
                      <div className="w-1 bg-red-500/20 rounded-full shrink-0" />
                      <p className="text-sm text-text-secondary leading-relaxed font-mono opacity-90">{v.description}</p>
                    </div>

                    {v.remediation && (
                      <div className="p-5 bg-green-500/5 border border-green-500/10 rounded-2xl flex gap-4 items-start group/rem">
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-green-500 uppercase tracking-widest block mb-2 opacity-80">Countermeasure / Remediation</span>
                          <p className="text-xs text-green-500/70 font-mono leading-relaxed">{v.remediation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 terminal-card border-dashed flex flex-col items-center justify-center opacity-40 bg-bg/5">
            <CheckCircle className="w-12 h-12 text-green-500/20 mb-4" />
            <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.3em]">No security flaws identified</p>
          </div>
        )}
      </section>

      {/* ── Attack Surface Assets ── */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-[1px] w-12 bg-cyan-500/40" />
          <h2 className="text-sm font-black text-text-primary uppercase tracking-[0.3em] flex items-center gap-3">
            Discovery Manifest
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.assets.map((asset, i) => (
            <div key={i} className="terminal-card p-5 hover:border-cyan-500/40 transition-all duration-300 group bg-bg/20">
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[8px] px-1.5 py-0.5 rounded border border-border/50 text-text-muted uppercase font-mono tracking-widest">{asset.type}</span>
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      asset.isAlive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-border'
                    )} />
                  </div>
                  <span className="text-xs font-bold text-text-primary truncate group-hover:text-cyan-500 transition-colors font-mono tracking-tight">{asset.value}</span>
                  {asset.resolvedIp && (
                    <div className="flex items-center gap-1.5 mt-2 opacity-60">
                      <Server size={10} className="text-text-muted" />
                      <span className="text-[10px] font-mono text-cyan-500/80">{asset.resolvedIp}</span>
                    </div>
                  )}
                </div>
                <div className="w-8 h-8 rounded-lg bg-border/5 flex items-center justify-center group-hover:bg-cyan-500/5 transition-colors">
                  <FileText size={14} className="text-text-muted group-hover:text-cyan-500/60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ScanResults;

