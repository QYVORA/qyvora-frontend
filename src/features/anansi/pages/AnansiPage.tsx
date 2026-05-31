import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, CheckCircle2, RefreshCw, Terminal, ArrowRight } from 'lucide-react';
import ScanForm from '../components/ScanForm';
import ScanStatus from '../components/ScanStatus';
import ScanResults from '../components/ScanResults';
import scanApi, { type ScanFullResultsResponse } from '../services/scanApi';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import AnansiLogo from '../../../shared/components/brand/AnansiLogo';
import { cn } from '../../../shared/utils/cn';

const SCAN_LIMIT = 5;

const AnansiPage: React.FC = () => {
  const [target, setTarget] = useState('');
  const [scanId, setScanId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'queued' | 'running' | 'completed' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScanFullResultsResponse['data'] | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [guestScansRemaining, setGuestScansRemaining] = useState<number | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isDashboard = window.location.pathname.startsWith('/dashboard');

  const startScan = async (domain: string) => {
    setError(null);
    setIsStarting(true);
    setResults(null);
    setShowResults(false);
    setProgress(0);

    try {
      const response = await scanApi.startScan(domain);
      if (response.success) {
        setScanId(response.data.scanId);
        setTarget(response.data.target);
        setStatus(response.data.status);
        if (response.data.guestScansRemaining !== undefined) {
          setGuestScansRemaining(response.data.guestScansRemaining);
        }
      } else {
        if (response.data?.scanId) {
          setScanId(response.data.scanId);
          setTarget(response.data.target);
          setStatus(response.data.status);
          return;
        }
        setError(response.data?.error || response.error || 'Failed to start scan');
      }
    } catch (err: any) {
      if (err.response?.status === 403 && err.response?.data?.code === 'guest_scan_limit_reached') {
        setGuestScansRemaining(0);
        setError(err.response.data.error);
      } else {
        setError(err.response?.data?.error || 'An unexpected error occurred');
      }
      setStatus('idle');
    } finally {
      setIsStarting(false);
    }
  };

  const fetchResults = async (id: string) => {
    try {
      const response = await scanApi.getScanResults(id);
      if (response.success) setResults(response.data);
    } catch (err: any) {
      console.error('Failed to fetch results:', err);
      setError('Scan completed but failed to retrieve detailed results.');
    }
  };

  useEffect(() => {
    if (scanId && (status === 'queued' || status === 'running')) {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const response = await scanApi.getScanStatus(scanId);
          if (response.success) {
            setStatus(response.data.status);
            setProgress(response.data.progress);
            if (response.data.status === 'completed') {
              clearInterval(pollIntervalRef.current!);
              fetchResults(scanId);
            } else if (response.data.status === 'failed') {
              clearInterval(pollIntervalRef.current!);
              setError(response.data.error || 'Scan failed during execution');
            }
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 3000);
    }
    return () => { if (pollIntervalRef.current) clearInterval(pollIntervalRef.current); };
  }, [scanId, status]);

  const reset = () => {
    setScanId(null);
    setStatus('idle');
    setResults(null);
    setShowResults(false);
    setError(null);
    setProgress(0);
  };

  return (
    <div className={cn(
      "min-h-screen selection:bg-accent selection:text-bg",
      isDashboard ? "bg-bg" : "bg-black"
    )}>
      <div className={cn(
        "relative z-10 mx-auto max-w-7xl px-4 pt-12 pb-40 md:px-10 lg:px-16",
        isDashboard && "lg:fixed lg:left-0 lg:right-20 lg:bottom-0 lg:top-24 lg:overflow-y-auto lg:overscroll-contain pt-8"
      )}>
        
        {/* Header Section — Structure & High Contrast */}
        <header className={cn("mb-20", isDashboard ? "mb-12" : "")}>
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/10 pb-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={cn("h-px w-12", isDashboard ? "bg-accent" : "bg-cyan-500")} />
                  <span className={cn(
                    "text-[12px] font-black uppercase tracking-[0.4em]",
                    isDashboard ? "text-accent" : "text-cyan-500"
                  )}>
                    ANANSI Intelligence
                  </span>
                </div>
                <div className="flex items-center gap-8">
                  <AnansiLogo size={64} showLabel />
                </div>
                <p className="text-sm text-text-secondary font-mono max-w-2xl leading-relaxed uppercase tracking-[0.1em]">
                  High-fidelity attack surface mapping and distributed infrastructure reconnaissance.
                </p>
              </div>

              {status !== 'idle' && (
                <button 
                  onClick={reset}
                  className={cn(
                    "group relative flex items-center gap-4 px-8 py-4 border rounded-xl transition-all duration-300 bg-bg-elevated",
                    isDashboard ? "border-accent/40 text-accent hover:bg-accent/10" : "border-cyan-500/40 text-cyan-500 hover:bg-cyan-500/10"
                  )}
                >
                  <RefreshCw size={16} className="transition-transform duration-500 group-hover:rotate-180" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">New Operation</span>
                </button>
              )}
            </div>
          </ScrollReveal>
        </header>

        <main className="grid grid-cols-1 gap-20">
          
          {/* Scan Interface */}
          {status === 'idle' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
              <div className="lg:col-span-3">
                <ScrollReveal direction="up" delay={0.1}>
                  <ScanForm 
                    onStartScan={startScan} 
                    isLoading={isStarting} 
                    layout={isDashboard ? 'dashboard' : 'standalone'} 
                  />
                </ScrollReveal>
              </div>

              <aside className="lg:col-span-2 space-y-12">
                <ScrollReveal direction="up" delay={0.2}>
                  {/* simplified engine constraints */}
                  <div className="p-10 border border-white/10 rounded-2xl bg-bg-elevated/40">
                    <h3 className={cn(
                      "text-xs font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-4",
                      isDashboard ? "text-accent" : "text-cyan-500"
                    )}>
                      Operational Status
                    </h3>
                    <div className="space-y-8">
                      <div className="flex justify-between items-end border-b border-white/5 pb-4">
                        <span className="text-[11px] text-text-muted uppercase font-mono tracking-widest">Engine Load</span>
                        <span className="text-sm font-black text-text-primary font-mono uppercase">Optimal</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-white/5 pb-4">
                        <span className="text-[11px] text-text-muted uppercase font-mono tracking-widest">Priority</span>
                        <span className="text-[11px] font-black text-green-500 uppercase tracking-[0.2em] font-mono">Tier 01</span>
                      </div>
                      {guestScansRemaining !== null && (
                        <div className="flex justify-between items-end border-b border-white/5 pb-4">
                          <span className="text-[11px] text-text-muted uppercase font-mono tracking-widest">Available Cycles</span>
                          <span className={cn("text-2xl font-black font-mono", isDashboard ? "text-accent" : "text-cyan-500")}>{guestScansRemaining}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-12 p-6 rounded-xl border border-white/5 bg-black/20 font-mono text-[10px] text-text-muted leading-relaxed uppercase tracking-wider">
                      [INFO] Distributed node allocation initialized. All traffic is routed through encrypted proxy layers.
                    </div>
                  </div>
                </ScrollReveal>
              </aside>
            </div>
          )}

          {/* System Feedback */}
          {error && (
            <ScrollReveal>
              <div className="max-w-4xl p-10 bg-red-950/20 border border-red-500/40 rounded-2xl flex items-start gap-8 animate-shake-x">
                <ShieldAlert className="w-8 h-8 text-red-500 shrink-0 mt-1" />
                <div className="space-y-2">
                  <span className="block text-red-500 font-black text-sm uppercase tracking-[0.2em]">
                    Kernel Error
                  </span>
                  <p className="text-text-primary text-base font-mono leading-relaxed uppercase tracking-tight">{error}</p>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Active Status */}
          {(status === 'queued' || status === 'running' || (status === 'failed' && !results)) && scanId && (
            <ScrollReveal direction="up">
              <div className="max-w-4xl mx-auto w-full">
                <ScanStatus 
                  scanId={scanId}
                  status={status}
                  progress={progress}
                  target={target}
                  layout={isDashboard ? 'dashboard' : 'standalone'}
                />
              </div>
            </ScrollReveal>
          )}

          {/* Results Reveal UX */}
          {status === 'completed' && results && !showResults && (
            <ScrollReveal direction="up">
              <div className="flex flex-col items-center justify-center py-32 space-y-16">
                <AnansiLogo size={160} />
                
                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-black text-text-primary uppercase tracking-[0.4em] leading-none">Reconnaissance Complete</h2>
                  <p className="text-base text-text-muted font-mono uppercase tracking-[0.2em] max-w-2xl mx-auto">The intelligence payload is ready for decryption.</p>
                </div>

                <button 
                  onClick={() => setShowResults(true)}
                  className={cn(
                    "group relative flex items-center gap-8 px-16 py-8 rounded-full font-black uppercase tracking-[0.4em] text-sm transition-all duration-500 border-2",
                    isDashboard 
                      ? "bg-accent text-bg border-accent hover:brightness-110" 
                      : "bg-cyan-600 text-bg border-cyan-600 hover:bg-cyan-500"
                  )}
                >
                  <AnansiLogo size={24} />
                  Decrypt Intelligence Payload
                  <ArrowRight size={24} className="transition-transform duration-500 group-hover:translate-x-3" />
                </button>
              </div>
            </ScrollReveal>
          )}

          {/* Results Output */}
          {status === 'completed' && results && showResults && (
            <ScrollReveal direction="up">
              <div className="space-y-16">
                <div className="flex flex-col items-center gap-8 py-12 border-y border-white/5">
                  <div className="flex items-center gap-8">
                    <CheckCircle2 className={isDashboard ? "text-accent" : "text-cyan-500"} size={32} />
                    <span className={cn(
                      "text-xl font-black uppercase tracking-[0.4em]",
                      isDashboard ? "text-accent" : "text-cyan-500"
                    )}>Secure Stream Established</span>
                  </div>
                </div>
                <ScanResults 
                  results={results} 
                  layout={isDashboard ? 'dashboard' : 'standalone'} 
                  onReset={reset}
                />
              </div>
            </ScrollReveal>
          )}

          {/* Loading Transition */}
          {status === 'completed' && !results && !error && (
            <div className="flex flex-col items-center justify-center gap-12 py-64 border border-white/5 rounded-3xl bg-bg-elevated/20 animate-pulse">
              <AnansiLogo size={80} className="animate-spin-slow" />
              <p className={cn(
                "font-black uppercase tracking-[0.4em] text-base",
                isDashboard ? "text-accent" : "text-cyan-500"
              )}>
                Compiling Report...
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AnansiPage;
