import React, { useState } from 'react';
import { 
  Server, Lock, Activity, ShieldCheck, Download, Share2, 
  ChevronDown, Globe, Terminal, ExternalLink
} from 'lucide-react';
import type { ScanFullResultsResponse } from '../services/scanApi';
import { cn } from '../../../shared/utils/cn';
import AnansiLogo from '../../../shared/components/brand/AnansiLogo';

interface ScanResultsProps {
  results: ScanFullResultsResponse['data'];
  layout?: 'standalone' | 'dashboard';
  onReset?: () => void;
}

const ScanResults: React.FC<ScanResultsProps> = ({ results, layout = 'standalone', onReset }) => {
  const [expandedFindings, setExpandedFindings] = useState<number[]>([]);

  const toggleFinding = (index: number) => {
    setExpandedFindings(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const isDashboard = layout === 'dashboard';

  const getRiskColor = (score: number) => {
    if (score >= 67) return 'text-red-500';
    if (score >= 34) return isDashboard ? 'text-accent' : 'text-orange-500';
    return isDashboard ? 'text-accent' : 'text-cyan-500';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-purple-500 border-purple-500/20';
      case 'high': return 'text-red-500 border-red-500/20';
      case 'medium': return isDashboard ? 'text-accent border-accent/20' : 'text-orange-500 border-orange-500/20';
      case 'low': return 'text-yellow-500 border-yellow-500/20';
      default: return 'text-text-muted border-white/10';
    }
  };

  const duration = Math.round((new Date(results.completedAt).getTime() - new Date(results.createdAt).getTime()) / 1000);

  const severityOrder = ['critical', 'high', 'medium', 'low', 'info'];
  const sortedFindings = [...results.vulnerabilities].sort((a, b) => 
    severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
  );

  const standardHeaders = [
    'strict-transport-security',
    'content-security-policy',
    'x-frame-options',
    'x-content-type-options',
    'referrer-policy',
    'permissions-policy'
  ];

  return (
    <div className={cn("space-y-24 pb-32 font-mono text-text-primary", isDashboard ? "" : "")}>
      {/* ── SUMMARY BAR (FIXED) ── */}
      <div className={cn(
        "sticky top-0 z-[110] backdrop-blur-xl border-b py-6 transition-all duration-300",
        isDashboard 
          ? "bg-bg-card/95 border-accent/20" 
          : "bg-black/90 border-white/10 shadow-[0_1px_20px_rgba(0,0,0,0.4)]"
      )}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-6">
            <AnansiLogo size={40} />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.4em] mb-0.5">Target Identifier</span>
              <span className="text-sm font-black tracking-widest truncate max-w-[200px] md:max-w-md uppercase">
                {results.target}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
            <div className="flex flex-col items-center">
              <span className={cn("text-3xl font-black tracking-tighter", getRiskColor(results.riskScore))}>
                {results.riskScore}
              </span>
              <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Risk Index</span>
            </div>

            <div className="h-10 w-px bg-white/10 hidden sm:block" />

            <div className="grid grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <span className="text-sm font-black">{duration}s</span>
                <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">Time</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm font-black">{results.summary.totalAssets}</span>
                <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">Nodes</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm font-black text-green-500">{results.summary.liveAssets}</span>
                <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">Live</span>
              </div>
            </div>

            <div className="h-10 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              {severityOrder.map(sev => (
                <div key={sev} title={`${sev} severity`} className={cn(
                  "px-2.5 py-1 rounded border text-[10px] font-black uppercase tracking-widest bg-black/20",
                  getSeverityColor(sev)
                )}>
                  {results.summary.severityCounts[sev] || 0}
                </div>
              ))}
            </div>

            {onReset && (
              <button 
                onClick={onReset}
                className={cn(
                  "ml-4 px-6 py-2.5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all border",
                  isDashboard 
                    ? "bg-accent/10 border-accent/20 text-accent hover:bg-accent/20" 
                    : "bg-cyan-600/10 border-cyan-500/20 text-cyan-500 hover:bg-cyan-500/20"
                )}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── PHASE 01 — NETWORK MAPPING ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-0 space-y-10">
        <div className="flex items-center gap-6">
          <div className={cn("px-4 py-1.5 text-bg text-[11px] font-black uppercase tracking-[0.3em] rounded-sm", isDashboard ? "bg-accent" : "bg-cyan-500")}>Phase 01</div>
          <h2 className="text-base font-black uppercase tracking-[0.4em]">Exposed Network Map</h2>
        </div>

        <div className="border border-white/5 rounded-3xl bg-bg-elevated/20 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.03]">
                  <th className="p-6 text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">Host Address</th>
                  <th className="p-6 text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">Classification</th>
                  <th className="p-6 text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">IP Routing</th>
                  <th className="p-6 text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">Transport</th>
                  <th className="p-6 text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">Integrity</th>
                </tr>
              </thead>
              <tbody>
                {results.assets.map((asset, i) => (
                  <tr key={i} className={cn(
                    "border-b border-white/[0.04] transition-colors",
                    asset.isAlive ? "opacity-100" : "opacity-30"
                  )}>
                    <td className="p-6 text-sm font-bold flex items-center gap-4">
                      {asset.isAlive ? <Activity size={12} className={isDashboard ? 'text-accent' : 'text-cyan-500'} /> : <div className="w-3 h-3" />}
                      {asset.value}
                    </td>
                    <td className="p-6">
                      <span className="text-[9px] px-2 py-1 rounded border border-white/10 text-text-muted uppercase tracking-widest font-black">{asset.type}</span>
                    </td>
                    <td className="p-6 text-xs text-text-secondary font-mono tracking-widest">{asset.resolvedIp || '—'}</td>
                    <td className="p-6">
                      {asset.tlsData ? (
                        <div className="flex items-center gap-3">
                          <Lock size={12} className={isDashboard ? 'text-accent' : 'text-cyan-500'} />
                          <span className={cn("text-[11px] font-black uppercase tracking-widest", isDashboard ? "text-accent" : "text-cyan-500")}>{asset.tlsData.protocol}</span>
                        </div>
                      ) : <span className="text-[10px] text-text-muted/20 uppercase tracking-widest font-black">Insecure</span>}
                    </td>
                    <td className="p-6">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em]",
                        asset.isAlive ? "text-green-500" : "text-text-muted"
                      )}>
                        {asset.isAlive ? 'Verified' : 'Null'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── PHASE 02 — SURFACE ANALYSIS ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-0 space-y-12">
        <div className="flex items-center gap-6">
          <div className={cn("px-4 py-1.5 text-bg text-[11px] font-black uppercase tracking-[0.3em] rounded-sm", isDashboard ? "bg-accent" : "bg-cyan-500")}>Phase 02</div>
          <h2 className="text-base font-black uppercase tracking-[0.4em]">Surface Intelligence</h2>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {results.assets.filter(a => a.type === 'url' && a.isAlive).map((asset, i) => {
            const meta = asset.metadata || {};
            const tls = asset.tlsData;
            return (
              <div key={i} className="border border-white/10 rounded-3xl bg-bg-elevated/20 overflow-hidden flex flex-col group transition-all duration-500 hover:border-white/20">
                <div className="p-6 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-5 truncate pr-8">
                    <Globe size={20} className={isDashboard ? "text-accent" : "text-cyan-500"} />
                    <span className={cn("text-base font-black truncate tracking-widest uppercase", isDashboard ? "text-accent" : "text-cyan-500")}>{asset.value}</span>
                  </div>
                  <div className="px-4 py-1.5 rounded-lg border border-white/10 bg-black/40 text-sm font-black font-mono">
                    HTTP {meta.statusCode || '??'}
                  </div>
                </div>
                
                <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                  {/* Infrastructure */}
                  <div className="space-y-6">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Infrastructure</span>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-text-muted uppercase tracking-widest">Server</span>
                        <span className="text-xs font-bold uppercase tracking-tight">{meta.server || 'Unknown'}</span>
                      </div>
                      {meta.techHeaders && Object.entries(meta.techHeaders).map(([k, v]) => (
                        <div key={k} className="flex flex-col gap-1">
                          <span className="text-[9px] text-text-muted uppercase tracking-widest">{k.replace('x-', '')}</span>
                          <span className="text-xs font-bold truncate uppercase tracking-tight">{(v as string)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cryptography */}
                  <div className="space-y-6 border-x border-white/[0.06] px-10 -mx-10 md:px-12 md:-mx-0">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Cryptography</span>
                    {tls ? (
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] text-text-muted uppercase tracking-widest">Issuer</span>
                          <span className="text-xs font-bold truncate uppercase tracking-tight">{tls.issuerOrg}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] text-text-muted uppercase tracking-widest">Protocol</span>
                          <span className={cn("text-xs font-bold uppercase tracking-tight", isDashboard ? "text-accent" : "text-cyan-500")}>{tls.protocol}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-24 border border-dashed border-white/5 rounded-2xl">
                        <span className="text-[9px] text-text-muted uppercase tracking-widest font-black opacity-30">No Data</span>
                      </div>
                    )}
                  </div>

                  {/* Security Policy */}
                  <div className="space-y-6">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Security Policy</span>
                    <div className="grid grid-cols-1 gap-2">
                      {standardHeaders.map(h => {
                        const present = meta.securityHeadersPresent?.includes(h);
                        return (
                          <div key={h} className="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-black/40 border border-white/[0.03]">
                            <span className={cn(
                              "text-[8px] uppercase tracking-widest font-black truncate",
                              present ? "text-text-primary" : "text-text-muted opacity-20"
                            )}>{h.replace('x-', '').replace('content-security-policy', 'csp').replace('strict-transport-security', 'hsts')}</span>
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full shrink-0",
                              present ? "bg-green-500" : "bg-red-500/20"
                            )} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Interaction Footer */}
                <div className="p-4 bg-black/60 border-t border-white/5 flex items-center justify-center gap-10">
                   <button className="flex items-center gap-2 text-[9px] font-black text-text-muted uppercase tracking-[0.4em] hover:text-text-primary transition-colors">
                     <ExternalLink size={12} /> Visit
                   </button>
                   <button className="flex items-center gap-2 text-[9px] font-black text-text-muted uppercase tracking-[0.4em] hover:text-text-primary transition-colors">
                     <Share2 size={12} /> Export
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── PHASE 03 — VULNERABILITY AUDIT ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-0 space-y-12">
        <div className="flex items-center gap-6">
          <div className={cn("px-4 py-1.5 text-bg text-[11px] font-black uppercase tracking-[0.3em] rounded-sm", isDashboard ? "bg-accent" : "bg-cyan-500")}>Phase 03</div>
          <h2 className="text-base font-black uppercase tracking-[0.4em]">Intelligence Audit</h2>
        </div>

        <div className="space-y-16">
          {severityOrder.map(sev => {
            const group = sortedFindings.filter(f => f.severity === sev);
            if (group.length === 0) return null;

            return (
              <div key={sev} className="space-y-8">
                <div className="flex items-center gap-6 px-8 py-4 bg-white/[0.02] border-l-4 border-white/10 rounded-r-3xl">
                  <span className={cn("text-sm font-black uppercase tracking-[0.5em]", getRiskColor(sev === 'critical' || sev === 'high' ? 100 : 50))}>
                    {sev} Exposure Found
                  </span>
                  <div className="h-4 w-px bg-white/10" />
                  <span className="text-[10px] font-black text-text-muted tracking-widest uppercase">{group.length} Hits</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {group.map((finding, i) => {
                    const findIdx = results.vulnerabilities.indexOf(finding);
                    const isExpanded = expandedFindings.includes(findIdx);
                    return (
                      <div key={findIdx} className={cn(
                        "border border-white/5 rounded-3xl bg-bg-elevated/20 overflow-hidden transition-all duration-500",
                        isExpanded && (isDashboard ? "border-accent/40" : "border-cyan-500/40")
                      )}>
                        <button 
                          onClick={() => toggleFinding(findIdx)}
                          className="w-full flex items-center justify-between p-8 text-left focus:outline-none"
                        >
                          <div className="flex items-center gap-8 min-w-0">
                            <span className={cn(
                              "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shrink-0 border",
                              getSeverityColor(sev)
                            )}>{sev}</span>
                            <span className="text-base font-black uppercase tracking-widest truncate">{finding.title}</span>
                          </div>
                          <div className={cn(
                            "p-2 rounded-full bg-white/5 transition-transform duration-500",
                            isExpanded ? "rotate-180" : ""
                          )}>
                            <ChevronDown size={20} className="text-text-muted" />
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="px-10 pb-12 pt-6 border-t border-white/10 space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                               <div className="lg:col-span-1 space-y-3">
                                  <span className="text-[10px] text-text-muted font-black uppercase tracking-[0.4em]">Asset</span>
                                  <div className={cn("p-4 rounded-2xl bg-black/60 border font-mono text-xs font-bold break-all", isDashboard ? "border-accent/20 text-accent" : "border-cyan-500/20 text-cyan-500")}>
                                    {finding.affectedAsset}
                                  </div>
                               </div>
                               <div className="lg:col-span-3 space-y-3">
                                  <span className="text-[10px] text-text-muted font-black uppercase tracking-[0.4em]">Intelligence Briefing</span>
                                  <p className="text-sm text-text-secondary leading-relaxed font-mono uppercase tracking-widest">{finding.description}</p>
                               </div>
                            </div>

                            {finding.evidence && (
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                   <Terminal size={14} className="text-text-muted" />
                                   <span className="text-[10px] text-text-muted font-black uppercase tracking-[0.4em]">Technical Stream</span>
                                </div>
                                <pre className={cn(
                                  "p-8 bg-black/90 border-l-4 text-[11px] font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner",
                                  isDashboard ? "border-accent/40 text-accent/80" : "border-cyan-500/40 text-cyan-500/80"
                                )}>
                                  {finding.evidence}
                                </pre>
                              </div>
                            )}

                            {finding.remediation && (
                              <div className="p-8 bg-green-500/[0.04] border border-green-500/10 rounded-3xl flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                  <ShieldCheck size={20} className="text-green-500" />
                                  <span className="text-[11px] text-green-500 font-black uppercase tracking-[0.5em]">Strategy</span>
                                </div>
                                <p className="text-sm text-green-500/70 italic leading-relaxed pl-10 border-l-2 border-green-500/20 font-mono tracking-widest uppercase">{finding.remediation}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Export / Finalize */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 pt-20">
           <button className={cn(
             "flex items-center gap-6 px-14 py-6 rounded-3xl font-black uppercase tracking-[0.5em] text-xs transition-all duration-300",
             isDashboard ? "bg-accent text-bg hover:brightness-110" : "bg-cyan-600 text-bg hover:bg-cyan-500"
           )}>
             <Download size={20} /> Compile Intelligence Dossier
           </button>
           <button className="flex items-center gap-6 px-14 py-6 rounded-3xl border border-white/10 font-black uppercase tracking-[0.5em] text-xs text-text-primary hover:bg-white/5 transition-all">
             <Share2 size={20} /> Encrypted Link
           </button>
        </div>
      </section>
    </div>
  );
};

export default ScanResults;
