import React, { useState, useEffect, useRef } from 'react';
import ScanForm from '../components/ScanForm';
import ScanStatus from '../components/ScanStatus';
import ScanResults from '../components/ScanResults';
import scanApi, { type ScanFullResultsResponse } from '../services/scanApi';
import { Terminal, ShieldAlert, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import HeroBackground from '../../marketing/components/HeroBackground';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import AnansiHero from '../components/AnansiHero';
import { useAuth } from '../../../core/contexts/AuthContext';
import { Link } from 'react-router-dom';

const SCAN_LIMIT = 2;

const ScanPage: React.FC = () => {
  const { user } = useAuth();
  const [target, setTarget] = useState('');
  const [scanId, setScanId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'queued' | 'running' | 'completed' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScanFullResultsResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [guestScanCount, setGuestScanCount] = useState(() => {
    return parseInt(localStorage.getItem('anansi_guest_scans') || '0');
  });

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startScan = async (domain: string) => {
    if (!user && guestScanCount >= SCAN_LIMIT) {
      setError('Guest limit reached. Please login to continue scanning.');
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

  const showLimitOverlay = !user && guestScanCount >= SCAN_LIMIT;

  return (
    // Root: full viewport height, scrollable — NOT overflow-hidden globally.
    // The page header sits above this in the app shell and is NOT inside this component.
    <div className="relative min-h-screen w-full bg-bg">

      {/* ── Persistent background — fixed so it doesn't scroll away ── */}
      <HeroBackground className="opacity-70 fixed inset-0 pointer-events-none" />

      {/* ── Cyan glow accent — fixed ── */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/*
        ── Hero viewport section ──────────────────────────────────────────────
        min-h-screen ensures the two-column layout fills the screen on first load.
        pt-[var(--header-height)] (or pt-20) offsets the fixed site header so
        the content is never hidden under it.
        The section is NOT overflow-hidden so extra status cards can push height.
      */}
      <section className="relative z-10 min-h-screen flex items-center pt-20 pb-12">
        <div className="mx-auto max-w-7xl px-4 md:px-10 w-full">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* ── Left column: logo + copy ── */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <ScrollReveal>
                {/* Logo — smaller on mobile so it doesn't eat vertical space */}
                <div className="mb-4 lg:mb-6">
                  <AnansiHero className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80" />
                </div>

                {/* Eyebrow */}
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                  <div className="h-[1px] w-8 bg-cyan-500/40" />
                  <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.35em]">
                    Arsenal / Intelligence
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary mb-4 tracking-tight">
                  ANANSI<span className="text-cyan-500">.</span>
                </h1>

                <p className="text-text-secondary text-sm lg:text-base mb-6 leading-relaxed font-mono opacity-80 max-w-sm mx-auto lg:mx-0">
                  Autonomous asset discovery &amp; vulnerability intelligence engine.
                  Enter a domain to begin deep-surface reconnaissance.
                </p>

                {/* Engine badge — desktop only */}
                <div className="hidden lg:flex flex-col gap-4">
                  <div className="flex items-start gap-4 p-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 shrink-0">
                      <Terminal size={18} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-tight mb-1">
                        Intelligence Engine
                      </h3>
                      <p className="text-[10px] text-text-muted leading-relaxed uppercase tracking-widest">
                        v1.2.0-beta active
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* ── Right column: scan tool ── */}
            <div className="relative z-10">
              {showLimitOverlay ? (
                <div className="terminal-card p-10 flex flex-col items-center text-center gap-6 border-accent/50 animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                    <Lock size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-text-primary uppercase tracking-widest mb-2">
                      Limit Reached
                    </h2>
                    <p className="text-sm text-text-secondary font-mono">
                      Guest scanning is limited to {SCAN_LIMIT} operations.
                      Create an account to unlock unlimited reconnaissance.
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
                <div className="space-y-6">
                  {/* Error */}
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-shake-x">
                      <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-red-500 font-bold text-xs uppercase tracking-wider">System Error</span>
                        <p className="text-red-400/80 text-xs">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Form + guest badge */}
                  <div className="relative">
                    <ScanForm
                      onStartScan={startScan}
                      isLoading={isStarting || status === 'queued' || status === 'running'}
                    />
                    {!user && (
                      <div className="absolute -top-3 -right-3 px-3 py-1 bg-cyan-600 rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-cyan-400/30 shadow-lg">
                        {guestScanCount}/{SCAN_LIMIT} Guest Scans
                      </div>
                    )}
                  </div>

                  {/* Active scan status */}
                  {scanId && (status === 'queued' || status === 'running' || status === 'failed') && (
                    <ScanStatus
                      scanId={scanId}
                      status={status}
                      progress={progress}
                      target={target}
                    />
                  )}

                  {/* Completion pill */}
                  {status === 'completed' && results && (
                    <div className="flex items-center justify-center gap-3 py-4 px-6 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl animate-success-pop">
                      <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                      <span className="text-xs font-black text-cyan-500 uppercase tracking-[0.2em]">
                        Scan Complete — Data Resolved
                      </span>
                    </div>
                  )}

                  {status === 'completed' && !results && !error && (
                    <div className="flex flex-col items-center justify-center p-12 terminal-card border-cyan-500/20 animate-pulse">
                      <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-5 h-5 text-cyan-500" />
                      </div>
                      <p className="text-cyan-500 font-bold uppercase tracking-widest text-[10px]">
                        Aggregating final results...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/*
        ── Results overlay ────────────────────────────────────────────────────
        Fixed fullscreen overlay that appears over the page when scan completes.
        Scrollable independently via overflow-y-auto.
      */}
      {status === 'completed' && results && (
        <div className="fixed inset-0 z-[100] bg-bg/95 backdrop-blur-xl overflow-y-auto p-4 md:p-10 scroll-hover">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8 border-b border-cyan-500/20 pb-6">
              <div className="flex items-center gap-4">
                <AnansiHero className="w-12 h-12" />
                <div>
                  <h2 className="text-xl font-black text-text-primary tracking-widest">SCAN_RESULTS</h2>
                  <p className="text-[10px] text-cyan-500 font-mono uppercase tracking-widest">{target}</p>
                </div>
              </div>
              <button
                onClick={() => { setStatus('idle'); setScanId(null); setResults(null); }}
                className="btn-secondary px-6 py-2 text-[10px] font-black uppercase tracking-widest"
              >
                Close Results
              </button>
            </div>
            <ScanResults results={results} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanPage;