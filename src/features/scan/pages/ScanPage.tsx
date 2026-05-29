import React, { useState, useEffect, useRef } from 'react';
import ScanForm from '../components/ScanForm';
import ScanStatus from '../components/ScanStatus';
import ScanResults from '../components/ScanResults';
import scanApi, { type ScanFullResultsResponse } from '../services/scanApi';
import { Terminal, ShieldAlert, CheckCircle2, AlertCircle, Lock, UserPlus, LogIn, X } from 'lucide-react';
import HeroBackground from '../../marketing/components/HeroBackground';
import AnansiHero from '../components/AnansiHero';
import { useAuth } from '../../../core/contexts/AuthContext';
import { Link } from 'react-router-dom';
import ScrollReveal from '../../../shared/components/ScrollReveal';

const SCAN_LIMIT = 2;

interface ScanPageProps {
  dashboardMode?: boolean;
}

const ScanPage: React.FC<ScanPageProps> = ({ dashboardMode = false }) => {
  const { user } = useAuth();
  const [target, setTarget] = useState('');
  const [scanId, setScanId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'queued' | 'running' | 'completed' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScanFullResultsResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [guestScanCount, setGuestScanCount] = useState(() =>
    parseInt(localStorage.getItem('anansi_guest_scans') || '0')
  );
  const [accountPromptOpen, setAccountPromptOpen] = useState(false);
  const [accountPromptReason, setAccountPromptReason] = useState<'completed' | 'limit'>('limit');

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const openAccountPrompt = (reason: 'completed' | 'limit') => {
    setAccountPromptReason(reason);
    setAccountPromptOpen(true);
  };

  const startScan = async (domain: string) => {
    if (!user && guestScanCount >= SCAN_LIMIT) {
      setError('Guest limit reached. Create an account or log in to continue scanning.');
      openAccountPrompt('limit');
      return;
    }
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
        if (!user) {
          const nextCount = guestScanCount + 1;
          setGuestScanCount(nextCount);
          localStorage.setItem('anansi_guest_scans', nextCount.toString());
        }
      } else {
        setError(response.data?.error || response.error || 'Failed to start scan');
      }
    } catch (err: any) {
      const apiError = err.response?.data;
      if (apiError?.code === 'guest_scan_limit_reached') {
        setGuestScanCount(SCAN_LIMIT);
        localStorage.setItem('anansi_guest_scans', SCAN_LIMIT.toString());
        openAccountPrompt('limit');
      }
      setError(apiError?.error || 'An unexpected error occurred');
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

  useEffect(() => {
    if (!user && status === 'completed' && results && guestScanCount >= SCAN_LIMIT) {
      openAccountPrompt('completed');
    }
  }, [user, status, results, guestScanCount]);

  const showLimitOverlay = !user && guestScanCount >= SCAN_LIMIT && (status === 'idle' || status === 'failed');

  return (
    /*
     * Root wrapper:
     *   - min-h-screen so it always fills the viewport
     *   - NOT overflow-hidden — allows natural scroll if content grows
     *   - bg-bg for base color; HeroBackground is position:fixed behind everything
     */
    <div className={`relative w-full bg-bg ${dashboardMode ? 'min-h-[calc(100vh-6rem)]' : 'min-h-screen'}`}>

      {/* Fixed background — never scrolls, stays behind everything */}
      <HeroBackground className="opacity-70 fixed inset-0 pointer-events-none z-0" />

      <div className={`relative z-10 flex items-center pb-32 md:pb-16 ${dashboardMode ? 'min-h-[calc(100vh-6rem)] pt-8' : 'min-h-screen pt-24'}`}>
        <div className="w-full max-w-7xl mx-auto px-4 md:px-10">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-start">

            <div className="flex flex-col items-start justify-center lg:pt-4">
              <ScrollReveal direction="left">
                <div className="flex items-center gap-5 mb-4 lg:mb-2">
                  <AnansiHero className="w-16 h-16 lg:hidden" />
                  <h1 className="text-5xl md:text-7xl font-black text-text-primary tracking-tight leading-none text-left">
                    ANANSI<span className="text-cyan-500">.</span>
                  </h1>
                </div>

                <p className="text-text-secondary text-[10px] font-mono opacity-60 mb-8 leading-relaxed text-left w-full uppercase tracking-widest">
                  Autonomous asset discovery & intelligence.
                </p>

                <div className="hidden lg:flex mb-12 w-full justify-start">
                  <AnansiHero className="lg:w-96 lg:h-96 xl:w-[450px] xl:h-[450px]" />
                </div>

                <div className="flex items-center gap-3 mb-8 px-4 py-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 w-fit">
                  <Terminal size={14} className="text-cyan-500 shrink-0" />
                  <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest font-black">
                    Engine v1.2.0-beta active
                  </span>
                </div>
              </ScrollReveal>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-0 w-full lg:pt-4">
              <ScrollReveal direction="right" delay={0.1} className="w-full">
                <div className="w-full lg:min-w-[440px]">
                  {showLimitOverlay ? (
                    <div className="terminal-card p-10 flex flex-col items-center text-center gap-6 border-accent/40 shadow-[0_0_50px_rgba(var(--color-accent-rgb),0.1)]">
                      <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                        <Lock size={28} />
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-text-primary uppercase tracking-widest mb-2">
                          Limit Reached
                        </h2>
                        <p className="text-xs text-text-secondary font-mono leading-relaxed">
                          Guest scanning is limited to {SCAN_LIMIT} operations.<br/>
                          Create an account or log in to continue scanning.
                        </p>
                      </div>
                      <div className="flex flex-col w-full gap-3">
                        <Link to="/register" className="btn-primary py-4 text-xs font-black uppercase tracking-widest">
                          Create Account
                        </Link>
                        <Link to="/login" className="btn-secondary py-4 text-xs font-black uppercase tracking-widest">
                          Operator Login
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">

                      {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 animate-shake-x">
                          <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="block text-red-500 font-bold text-xs uppercase tracking-wider mb-1">
                              System Error
                            </span>
                            <p className="text-red-400/80 text-xs font-mono">{error}</p>
                          </div>
                        </div>
                      )}

                      <div className="relative">
                        <ScanForm
                          onStartScan={startScan}
                          isLoading={isStarting || status === 'queued' || status === 'running'}
                        />
                        {!user && (
                          <div className="absolute -top-3 -right-3 px-3 py-1 bg-cyan-600 rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-cyan-400/30 shadow-lg">
                            {guestScanCount}/{SCAN_LIMIT} scans
                          </div>
                        )}
                      </div>

                      {scanId && (status === 'queued' || status === 'running' || status === 'failed') && (
                        <ScanStatus
                          scanId={scanId}
                          status={status}
                          progress={progress}
                          target={target}
                        />
                      )}

                      {status === 'completed' && results && (
                        <div className="flex items-center justify-center gap-3 py-4 px-6 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                          <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                          <span className="text-xs font-black text-cyan-500 uppercase tracking-[0.3em]">
                            Scan Complete — Data Resolved
                          </span>
                        </div>
                      )}

                      {status === 'completed' && !results && !error && (
                        <div className="flex flex-col items-center justify-center gap-2 py-8 px-6 terminal-card border-cyan-500/30 animate-pulse">
                          <AlertCircle className="w-6 h-6 text-cyan-500 mb-2" />
                          <p className="text-cyan-500 font-black uppercase tracking-[0.25em] text-[10px]">
                            Aggregating final results...
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          RESULTS OVERLAY
          Full-screen fixed layer, scrollable independently.
          Only mounts when scan is complete and results are ready.
          ═══════════════════════════════════════════════════════════════════ */}
      {status === 'completed' && results && (
        <div className="fixed inset-0 z-[100] bg-bg/96 backdrop-blur-xl overflow-y-auto p-4 md:p-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8 border-b border-cyan-500/20 pb-6">
              <div className="flex items-center gap-4">
                <AnansiHero className="w-10 h-10" />
                <div>
                  <h2 className="text-base font-black text-text-primary tracking-widest">
                    SCAN_RESULTS
                  </h2>
                  <p className="text-[10px] text-cyan-500 font-mono uppercase tracking-widest">
                    {target}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setStatus('idle'); setScanId(null); setResults(null); }}
                className="btn-secondary px-5 py-2 text-[10px] font-black uppercase tracking-widest"
              >
                Close Results
              </button>
            </div>
            <ScanResults results={results} />
          </div>
        </div>
      )}

      {accountPromptOpen && !user && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="w-full max-w-md terminal-card border border-cyan-500/30 bg-bg-card shadow-[0_0_60px_rgba(6,182,212,0.18)] overflow-hidden">
            <div className="flex items-center justify-between border-b border-cyan-500/20 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-text-primary">
                    Account Required
                  </h2>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                    Guest scans {Math.min(guestScanCount, SCAN_LIMIT)}/{SCAN_LIMIT}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAccountPromptOpen(false)}
                className="rounded-lg p-2 text-text-muted hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
                aria-label="Close account prompt"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm leading-relaxed text-text-secondary">
                {accountPromptReason === 'completed'
                  ? 'Your second public scan is complete. To keep scanning and save future reconnaissance, create an account or log in.'
                  : 'Public scanning is limited to two scans per guest. Create an account or log in to continue with authenticated scans.'}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  to="/register"
                  className="btn-primary flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest"
                >
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </Link>
                <Link
                  to="/login"
                  className="btn-secondary flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest"
                >
                  <LogIn className="h-4 w-4" />
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanPage;
