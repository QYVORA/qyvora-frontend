import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Flame, ChevronRight, RefreshCw, BookOpen,
  ShoppingBag, Download, Loader2,
} from 'lucide-react';
import { motion } from 'motion/react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { useAuth } from '../../../core/contexts/AuthContext';
import api from '../../../core/services/api';
import CpLogo from '../../../shared/components/CpLogo';
import { getRankInfo } from '../utils/rankUtils';
import { extractCpBalance } from '../../../shared/utils/cpBalance';
import {
  formatSyncLabel,
  getBootcampProgressMap,
  getLastSync,
  resolveNextRoomPath,
  setLastSyncNow,
} from '../utils/studentExperience';
import { getTokenBalanceForUser } from '../services/tokenBalance.service';
import StudentBootcampCard, { type StudentBootcampCardData } from '../components/StudentBootcampCard';
import { resolveImg } from '../../../shared/utils/resolveImg';
import { useToast } from '../../../core/contexts/ToastContext';
import PageLoader from '../../../shared/components/PageLoader';

// ── Bootcamp assets ───────────────────────────────────────────────────────────
const BOOTCAMP_COVER_IMGS: Record<string, string> = {
  bc_1775270338500: '/assets/bootcamp/hpb-cover.webp',
};
const BOOTCAMP_FALLBACK_IMG = '/assets/bootcamp/hpb-cover.webp';

function pickCpBalance(userCp: number, overview: any, cpBalance: number | null): number {
  if (typeof cpBalance === 'number' && Number.isFinite(cpBalance)) return cpBalance;
  const fromOverview = extractCpBalance(overview?.xpSummary) ?? extractCpBalance(overview);
  if (typeof fromOverview === 'number' && Number.isFinite(fromOverview)) return fromOverview;
  return userCp;
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-accent-dim/20 ${className ?? ''}`} />;
}

// ─────────────────────────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [overview, setOverview]        = useState<any>(null);
  const [bootcamps, setBootcamps]      = useState<any[]>([]);
  const [cpBalanceState, setCpBalance] = useState<number | null>(null);
  const [products, setProducts]        = useState<any[]>([]);
  const [purchasing, setPurchasing]    = useState<string | null>(null);
  const [downloading, setDownloading]  = useState<string | null>(null);
  const [purchased, setPurchased]      = useState<Set<string>>(new Set());
  const [loading, setLoading]          = useState(true);
  const [syncError, setSyncError]      = useState('');
  const [lastSync, setLastSync]        = useState<string | null>(getLastSync('dashboard'));

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [ovRes, bcRes, balanceRes, tokenBalance, prodRes, txRes] = await Promise.all([
          api.get('/student/overview').catch(() => null),
          api.get('/public/bootcamps').catch(() => null),
          api.get('/cp/balance').catch(() => null),
          getTokenBalanceForUser(user?.uid || ''),
          api.get('/public/cp-products').catch(() => null),
          api.get('/cp/transactions?limit=100').catch(() => null),
        ]);
        if (!mounted) return;
        setOverview(ovRes?.data || null);
        setBootcamps(Array.isArray(bcRes?.data?.items) ? bcRes.data.items : []);
        
        const txItems = Array.isArray(txRes?.data?.items) ? txRes.data.items : [];
        
        // Trust the user object's CP balance, which is now resolved on the backend
        const cp = user?.cp ?? 0;
        
        setCpBalance(cp);
        setProducts(Array.isArray(prodRes?.data?.items) ? prodRes.data.items.slice(0, 1) : []);
        setPurchased(new Set<string>(
          txItems
            .filter((tx: any) => tx.type === 'purchase' && tx.productId)
            .map((tx: any) => String(tx.productId))
        ));
        setSyncError('');
        setLastSync(setLastSyncNow('dashboard'));
      } catch {
        setSyncError('Could not sync. Showing cached data.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user?.uid]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const moduleProgressById = getBootcampProgressMap(overview);

  const enrolledBootcamps: StudentBootcampCardData[] = bootcamps
    .map((item: any) => ({ item, prog: moduleProgressById.get(String(item.id || '')) }))
    .filter(({ prog }) => prog !== undefined)
    .slice(0, 4)
    .map(({ item, prog }) => ({
      id:          String(item.id || ''),
      title:       item.title || 'Bootcamp',
      description: String(item.description || '').trim(),
      level:       String(item.level || '').trim(),
      duration:    String(item.duration || '').trim(),
      priceLabel:  String(item.priceLabel || '').trim(),
      progress:    Number(prog?.progress || 0),
      img:         BOOTCAMP_COVER_IMGS[String(item.id || '')] ?? BOOTCAMP_FALLBACK_IMG,
      isEnrolled:  true,
      isLocked:    false,
    }));

  const activeBootcamp   = bootcamps.find((bc: any) => moduleProgressById.get(String(bc.id || '')) !== undefined);
  const nextRoomPath     = activeBootcamp ? resolveNextRoomPath(String(activeBootcamp.id || '')) : null;
  const continuePath     = nextRoomPath || (activeBootcamp ? `/dashboard/bootcamps/${activeBootcamp.id}` : '/dashboard/bootcamps');
  const isEnrolled       = (overview?.bootcampStatus || 'not_enrolled') !== 'not_enrolled';
  const streakDays       = Number(overview?.xpSummary?.streakDays || 0);
  const cpBalance        = pickCpBalance(user?.cp ?? 0, overview, cpBalanceState);
  // Use the real username — empty string is fine, the UI handles it gracefully
  const handle           = user?.username || '';
  const { rank: rankInfo, next: nextRank, progress: rankProgress } = getRankInfo(cpBalance);
  const nextMission      = (overview?.learningPath || []).find(
    (m: any) => m.status === 'in-progress' || m.status === 'next'
  );
  const multipleEnrolled = enrolledBootcamps.length > 1;

  // ── Marketplace helpers ───────────────────────────────────────────────────
  const handlePurchase = async (product: any) => {
    const id = String(product.id || '');
    setPurchasing(id);
    try {
      await api.post('/cp/purchase', { productId: id });
      addToast(`${product.title} purchased.`, 'success');
      setPurchased((prev) => new Set([...prev, id]));
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Purchase failed.', 'error');
    } finally {
      setPurchasing(null);
    }
  };

  const handleDownload = async (product: any) => {
    const id = String(product.id || '');
    setDownloading(id);
    try {
      const base = String(import.meta.env.VITE_API_BASE_URL || '/api');
      const res = await fetch(`${base}/cp/products/${id}/download`, { credentials: 'include' });
      if (!res.ok) { addToast('Download failed.', 'error'); return; }
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = product.fileName || `${product.title || 'product'}.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      addToast('Download failed.', 'error');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="bg-bg">
      {/*
        scroll-hover  → hides scrollbar at rest, shows a slim one on hover
        scroll-smooth → smooth momentum scrolling
      */}
      <div
        className="scroll-hover lg:fixed lg:left-0 lg:right-20 lg:bottom-0 lg:top-24 lg:overflow-y-auto lg:overscroll-contain"
        style={{
          scrollBehavior: 'smooth',
        }}
      >
        <div className="mx-auto max-w-7xl px-2 pt-6 pb-16 md:px-8">

          {/* ── TOP SECTION: MISSION CARD & STATS CARD ─────────────────────── */}
          <div className="grid grid-cols-1 gap-6 lg:gap-8 mb-10 items-stretch">
            <div className="w-full">
              <ScrollReveal className="h-full">
                {loading ? (
                  <div className="card-hsociety p-8 animate-pulse space-y-4 h-full">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-3 w-full rounded-full" />
                    <Skeleton className="h-12 w-48 rounded-xl" />
                  </div>
                ) : (
                  <div className="card-hsociety p-8 relative overflow-hidden h-full flex flex-col justify-center border-accent/30 shadow-[0_0_40px_rgba(var(--color-accent-rgb),0.15)]">
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-[1px] w-8 bg-accent/40" />
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-accent">
                          {isEnrolled
                            ? (overview?.progressMeta?.currentPhase?.title || 'Active Deployment')
                            : 'New Mission'}
                        </span>
                      </div>
                      
                      <h2 className="mb-6 text-3xl md:text-5xl font-black leading-tight text-text-primary max-w-2xl">
                        {nextMission
                          ? nextMission.title
                          : isEnrolled
                          ? 'Pick up where you left off'
                          : 'Begin your journey into the offensive underground'}
                      </h2>

                      {nextRank && (
                        <div className="mb-8 max-w-md">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                              Target Rank: <span className="text-accent">{nextRank.name}</span> ({nextRank.min - cpBalance} CP Remaining)
                            </span>
                            <span className="font-mono text-xs font-black text-accent">{rankProgress}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-accent-dim/30 border border-accent/10">
                            <div
                              className="h-full rounded-full bg-accent shadow-[0_0_10px_rgba(var(--color-accent-rgb),0.5)] transition-all duration-1000"
                              style={{ width: `${rankProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4">
                        <Link
                          to={continuePath}
                          className="btn-primary flex items-center justify-center gap-3 px-8 py-4 text-sm font-black uppercase tracking-widest shadow-lg shadow-accent/20"
                        >
                          {isEnrolled ? 'Continue Mission' : 'Browse Operations'}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        
                        {!loading && (
                          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-bg/40 border border-border/50 backdrop-blur-sm">
                            <CpLogo className="h-6 w-6" />
                            <span className="font-mono text-2xl font-black text-text-primary tracking-tight">
                              {cpBalance.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </ScrollReveal>
            </div>
          </div>

          {/* ── MAIN CONTENT: BOOTCAMPS + MARKET ─────────────────── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 items-start">
            
            {/* 1. BOOTCAMP CARD(S) */}
            <div className="flex flex-col gap-6 h-full">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Active Deployments</h3>
                <Link to="/dashboard/bootcamps" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">View All</Link>
              </div>
              {loading ? (
                <div className="card-hsociety overflow-hidden animate-pulse">
                  <div className="aspect-video bg-accent-dim/30" />
                  <div className="space-y-3 p-5">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="mt-3 h-2 w-full rounded-full" />
                    <Skeleton className="h-9 w-full rounded-md" />
                  </div>
                </div>
              ) : enrolledBootcamps.length === 0 ? (
                <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border py-16 text-center h-full min-h-[300px] flex flex-col items-center justify-center bg-bg-card/20">
                  <BookOpen className="mx-auto mb-4 h-10 w-10 text-text-muted opacity-40" />
                  <p className="mb-5 text-base text-text-muted">No active bootcamps.</p>
                  <Link
                    to="/dashboard/bootcamps"
                    className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm"
                  >
                    Start Training <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                enrolledBootcamps.slice(0, 1).map((item, idx) => (
                  <div key={item.id} className="h-full">
                    <StudentBootcampCard data={item} index={idx} />
                  </div>
                ))
              )}
            </div>

            {/* 2. ZERO-DAY MARKET CARD */}
            <div className="flex flex-col gap-6 h-full">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Intelligence Vault</h3>
                <Link to="/dashboard/marketplace" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">Marketplace</Link>
              </div>
              {!loading && products.length > 0 && (() => {
                const prod = products[0];
                const id = String(prod.id || '');
                const isBuying = purchasing === id;
                const isDownloading = downloading === id;
                const hasPurchased = purchased.has(id);
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col h-full"
                  >
                    <div className="card-hsociety flex flex-col h-full overflow-hidden border-border/60 hover:border-accent/30 transition-all duration-300">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={resolveImg(prod.coverUrl, '/assets/sections/backgrounds/process-earn.webp')}
                          alt={prod.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          {hasPurchased && <span className="px-2 py-1 bg-accent text-bg rounded text-[10px] font-black uppercase tracking-widest">Owned</span>}
                        </div>
                        <div className="absolute bottom-2.5 left-2.5">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-bg/90 backdrop-blur-md border border-border/60 rounded-lg text-[10px] font-black uppercase text-text-primary tracking-widest">
                            <ShoppingBag className="h-3 w-3 text-accent" /> Premium Asset
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="mb-3 text-lg font-black leading-snug text-text-primary line-clamp-2">{prod.title}</h3>
                        <p className="text-xs text-text-muted mb-6 line-clamp-2 leading-relaxed">{prod.description || 'Access high-value intelligence reports and research papers.'}</p>
                        <div className="mt-auto">
                          {(hasPurchased || prod.isFree) ? (
                            <button
                              onClick={() => handleDownload(prod)}
                              disabled={isDownloading}
                              className="btn-primary flex w-full items-center justify-center gap-3 py-3.5 text-xs font-black uppercase tracking-widest disabled:opacity-60"
                            >
                              {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download Intelligence
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePurchase(prod)}
                              disabled={isBuying}
                              className="btn-primary flex w-full items-center justify-center gap-3 py-3.5 text-xs font-black uppercase tracking-widest disabled:opacity-60"
                            >
                              {isBuying ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CpLogo className="h-4 w-4" /> Unlock Access</>}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
              {loading && (
                <div className="card-hsociety overflow-hidden animate-pulse">
                  <div className="aspect-video bg-accent-dim/30" />
                  <div className="space-y-3 p-5">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-9 w-full rounded-md" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SYNC STATUS */}
          <div className="mt-8 flex items-center justify-between gap-3 px-1">
            <p className={`flex items-center gap-1.5 text-[11px] ${syncError ? 'text-red-400' : 'text-text-muted'}`}>
              <RefreshCw className="h-3 w-3 shrink-0" />
              {syncError || formatSyncLabel(lastSync)}
            </p>
            {syncError && (
              <button
                onClick={() => window.location.reload()}
                className="text-[11px] font-bold text-accent hover:underline"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
