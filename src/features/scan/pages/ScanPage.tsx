import React, { useState, useEffect, useRef } from 'react';
import ScanForm from '../components/ScanForm';
import ScanStatus from '../components/ScanStatus';
import ScanResults from '../components/ScanResults';
import scanApi, { type ScanResponse, type ScanFullResultsResponse } from '../services/scanApi';
import { Terminal, ShieldAlert, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import HeroBackground from '../../marketing/components/HeroBackground';
import AsciiHeading from '../../../shared/components/ui/AsciiHeading';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import AnansiLogo from '../../../shared/components/brand/AnansiLogo';

const ScanPage: React.FC = () => {
  const [target, setTarget] = useState('');
  const [scanId, setScanId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'queued' | 'running' | 'completed' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScanFullResultsResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startScan = async (domain: string) => {
    setError(null);
    setIsStarting(true);
    setResults(null);
    setProgress(0);
    
    try {
      const response = await scanApi.startScan(domain);
      if (response.success) {
        setScanId(response.data.scanId);
        setTarget(response.data.target);
        setStatus(response.data.status);
      } else {
        setError(response.data.error || 'Failed to start scan');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An unexpected error occurred');
      setStatus('idle');
    } finally {
      setIsStarting(false);
    }
  };

  const fetchResults = async (id: string) => {
    try {
      const response = await scanApi.getScanResults(id);
      if (response.success) {
        setResults(response.data);
      }
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
              if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
              fetchResults(scanId);
            } else if (response.data.status === 'failed') {
              if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
              setError(response.data.error || 'Scan failed during execution');
            }
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 3000);
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [scanId, status]);

  return (
    <div className="relative h-[100svh] w-full bg-bg overflow-hidden">
      {/* ── Global Background matches LandingPage ── */}
      <HeroBackground className="opacity-70" />

      {/* ── Background Cyan Glow - "Anansi Blur Accent" ── */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* ── Main Content Container ── */}
      <div className="landing-snap relative z-10 h-[100svh] w-full overflow-y-auto overflow-x-hidden bg-transparent pt-24 pb-20 scroll-hover">
        <div className="mx-auto max-w-7xl px-4 md:px-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-[0.45fr_1.55fr] gap-12 items-start mb-16">
            
            {/* ── Left Column: Heading & Info ── */}
            <div className="flex flex-col">
              <ScrollReveal>
                <AnansiLogo className="mb-8" size={64} />
                
                {/* Eyebrow */}
                <div className="flex items-center gap-3 mb-4 lg:mb-3">
                  <div className="h-[1px] w-8 bg-accent/40" />
                  <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">
                    Arsenal / Intelligence
                  </span>
                </div>

                <AsciiHeading 
                  text="ANANSI" 
                  font="ANSI Shadow" 
                  align="left" 
                  animated 
                  className="mb-6 lg:mb-8" 
                />

                <p className="text-text-secondary text-sm lg:text-base mb-8 leading-relaxed font-mono opacity-80 max-w-sm">
                  Autonomous asset discovery & vulnerability intelligence engine.
                  Enter a domain to begin deep-surface reconnaissance.
                </p>

                <div className="space-y-6 hidden lg:block">
                  <div className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-bg-card/40 backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-center text-cyan-500 shrink-0">
                      <Terminal size={18} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-text-primary uppercase tracking-tight mb-1">Intelligence Engine</h3>
                      <p className="text-[10px] text-text-muted leading-relaxed uppercase tracking-widest">v1.2.0-beta active</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-bg-card/40 backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-xl bg-accent/5 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                      <Info size={18} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-text-primary uppercase tracking-tight mb-1">Methodology</h3>
                      <p className="text-[10px] text-text-muted leading-relaxed uppercase tracking-widest">Passive & Active discovery</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* ── Right Column: The Tool ── */}
            <div className="space-y-8 relative z-10">
              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-shake-x">
                  <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-red-500 font-bold text-xs uppercase tracking-wider">System Error</span>
                    <p className="text-red-400/80 text-xs">{error}</p>
                  </div>
                </div>
              )}

              {/* Form Section */}
              <ScanForm onStartScan={startScan} isLoading={isStarting || status === 'queued' || status === 'running'} />

              {/* Active Scan Status */}
              {scanId && (status === 'queued' || status === 'running' || status === 'failed') && (
                <ScanStatus 
                  scanId={scanId} 
                  status={status} 
                  progress={progress} 
                  target={target} 
                />
              )}

              {/* Completed Results Mini-View or Indicator */}
              {status === 'completed' && results && (
                <div className="flex items-center justify-center gap-2 py-3 px-6 bg-green-500/10 border border-green-500/20 rounded-full w-fit mx-auto animate-success-pop">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-black text-green-500 uppercase tracking-[0.2em]">Scan Complete — Detailed Results Below</span>
                </div>
              )}
              
              {status === 'completed' && !results && !error && (
                <div className="flex flex-col items-center justify-center p-20 terminal-card border-cyan-500/20 animate-pulse">
                  <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6 text-cyan-500" />
                  </div>
                  <p className="text-cyan-500 font-bold uppercase tracking-widest text-xs">Aggregating final results...</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Results Phase ── */}
          {status === 'completed' && results && (
            <ScrollReveal direction="up">
              <div className="mt-12 pt-12 border-t border-border/50">
                <ScanResults results={results} />
              </div>
            </ScrollReveal>
          )}

        </div>
      </div>
    </div>
  );
};

export default ScanPage;

