import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, CheckCircle2, RefreshCw, Terminal, ArrowRight, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScanForm from '../components/ScanForm';
import ScanStatus from '../components/ScanStatus';
import ScanResults from '../components/ScanResults';
import AnansiFooter from '../components/AnansiFooter';
import scanApi, { type ScanFullResultsResponse } from '../services/scanApi';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import AnansiLogo from '../../../shared/components/brand/AnansiLogo';
import { cn } from '../../../shared/utils/cn';

const SCAN_LIMIT = 5;

const AnansiPage: React.FC = () => {
  const navigate = useNavigate();
  const [target, setTarget] = useState('');
  const [scanId, setScanId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'queued' | 'running' | 'completed' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScanFullResultsResponse['data'] | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [guestScansRemaining, setGuestScansRemaining] = useState<number | null>(null);
  const [showScanModal, setShowScanModal] = useState(false);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isDashboard = window.location.pathname.startsWith('/dashboard');

  const startScan = async (domain: string) => {
    setError(null);
    setIsStarting(true);
    setResults(null);
    setShowResults(false);
    setProgress(0);
    setShowScanModal(true); // Show modal when scan starts

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
        setShowScanModal(false);
      }
    } catch (err: any) {
      if (err.response?.status === 403 && err.response?.data?.code === 'guest_scan_limit_reached') {
        setGuestScansRemaining(0);
        setError(err.response.data.error);
      } else {
        setError(err.response?.data?.error || 'An unexpected error occurred');
      }
      setStatus('idle');
      setShowScanModal(false);
    } finally {
      setIsStarting(false);
    }
  };

  const cancelScan = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    setShowScanModal(false);
    reset();
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
    setShowScanModal(false);
  };

  // Detect screen size for modal behavior
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={cn(
      "min-h-screen flex flex-col selection:bg-accent selection:text-bg",
      isDashboard ? "bg-bg" : "bg-black"
    )}>
      <div className={cn(
        "relative z-10 w-full px-4 pt-8 pb-12 md:px-8 lg:px-12 flex-1",
        isDashboard && "lg:fixed lg:left-0 lg:right-20 lg:bottom-0 lg:top-24 lg:overflow-y-auto lg:overscroll-contain pt-8"
      )}>
        
        {/* Back Button and Simplified Header */}
        <header className={cn("mb-12", isDashboard ? "mb-10" : "")}>
          <ScrollReveal>
            <div className="space-y-8">
              {/* Back Button */}
              <button
                onClick={() => navigate(isDashboard ? '/dashboard' : '/')}
                className={cn(
                  "group flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300",
                  isDashboard 
                    ? "text-accent hover:bg-accent/10" 
                    : "text-cyan-500 hover:bg-cyan-500/10"
                )}
              >
                <ArrowLeft size={20} className="transition-transform duration-300 group-hover:-translate-x-1" />
                <span className="text-sm font-bold uppercase tracking-wider">Back</span>
              </button>

              {/* Logo and Title */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 pb-6 border-b border-white/10">
                <div className="flex items-center gap-6 md:gap-8">
                  <AnansiLogo size={80} className="md:w-24 md:h-24" />
                  <h1 className={cn(
                    "text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-[0.2em]",
                    isDashboard ? "text-accent" : "text-cyan-500"
                  )}>
                    ANANSI
                  </h1>
                </div>

                {status !== 'idle' && (
                  <button 
                    onClick={reset}
                    className={cn(
                      "group relative flex items-center gap-3 px-6 py-3 border rounded-xl transition-all duration-300 bg-bg-elevated",
                      isDashboard ? "border-accent/40 text-accent hover:bg-accent/10" : "border-cyan-500/40 text-cyan-500 hover:bg-cyan-500/10"
                    )}
                  >
                    <RefreshCw size={16} className="transition-transform duration-500 group-hover:rotate-180" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">New Scan</span>
                  </button>
                )}
              </div>
            </div>
          </ScrollReveal>
        </header>

        <main className="grid grid-cols-1 gap-20">
          
          {/* Scan Interface - Full Width on Desktop */}
          {status === 'idle' && (
            <div className="w-full">
              <ScrollReveal direction="up" delay={0.1}>
                <ScanForm 
                  onStartScan={startScan} 
                  isLoading={isStarting} 
                  layout={isDashboard ? 'dashboard' : 'standalone'}
                  guestScansRemaining={guestScansRemaining}
                />
              </ScrollReveal>
            </div>
          )}

          {/* System Feedback */}
          {error && (
            <ScrollReveal>
              <div className="max-w-4xl p-8 bg-red-950/20 border border-red-500/40 rounded-2xl flex items-start gap-6">
                <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                <div className="space-y-2">
                  <span className="block text-red-500 font-black text-sm uppercase tracking-[0.2em]">
                    Error
                  </span>
                  <p className="text-text-primary text-sm font-mono leading-relaxed uppercase tracking-tight">{error}</p>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Scan Status - Modal on Desktop, Card on Mobile */}
          {(status === 'queued' || status === 'running' || (status === 'failed' && !results)) && scanId && (
            <>
              {isDesktop ? (
                // Desktop Modal
                showScanModal && (
                  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="relative max-w-3xl w-full mx-4">
                      <button
                        onClick={cancelScan}
                        className="absolute -top-12 right-0 text-text-muted hover:text-red-500 transition-colors"
                        aria-label="Cancel scan"
                      >
                        <X size={32} />
                      </button>
                      <ScanStatus 
                        scanId={scanId}
                        status={status}
                        progress={progress}
                        target={target}
                        layout={isDashboard ? 'dashboard' : 'standalone'}
                        onCancel={cancelScan}
                      />
                    </div>
                  </div>
                )
              ) : (
                // Mobile Card
                <ScrollReveal direction="up">
                  <div className="max-w-4xl mx-auto w-full">
                    <ScanStatus 
                      scanId={scanId}
                      status={status}
                      progress={progress}
                      target={target}
                      layout={isDashboard ? 'dashboard' : 'standalone'}
                      onCancel={cancelScan}
                    />
                  </div>
                </ScrollReveal>
              )}
            </>
          )}

          {/* Results Reveal UX - Simple Modal Notification */}
          {status === 'completed' && results && !showResults && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className={cn(
                "relative max-w-lg w-full mx-4 border rounded-2xl p-8 space-y-6 bg-bg-elevated/95 backdrop-blur-xl",
                isDashboard ? "border-accent/30" : "border-cyan-500/30"
              )}>
                <div className="flex items-center justify-center">
                  <CheckCircle2 className={cn("w-16 h-16", isDashboard ? "text-accent" : "text-cyan-500")} />
                </div>
                
                <div className="text-center space-y-3">
                  <h2 className={cn(
                    "text-2xl font-black uppercase tracking-[0.3em]",
                    isDashboard ? "text-accent" : "text-cyan-500"
                  )}>
                    Reconnaissance Complete
                  </h2>
                  <p className="text-sm text-text-muted font-mono uppercase tracking-wider">
                    Intelligence payload ready
                  </p>
                </div>

                <button 
                  onClick={() => setShowResults(true)}
                  className={cn(
                    "w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-300",
                    isDashboard 
                      ? "bg-accent text-bg hover:brightness-110" 
                      : "bg-cyan-600 text-bg hover:bg-cyan-500"
                  )}
                >
                  View Results
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Results Output */}
          {status === 'completed' && results && showResults && (
            <div className="space-y-16 animate-in fade-in duration-500">
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
      
      {/* Footer */}
      <AnansiFooter layout={isDashboard ? 'dashboard' : 'standalone'} />
    </div>
  );
};

export default AnansiPage;
