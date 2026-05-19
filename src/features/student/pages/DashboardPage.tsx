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
import MiniLeaderboard from '../components/MiniLeaderboard';
import { getRankInfo } from '../utils/rankUtils';
import OptionalDecorImage from '../../../shared/components/OptionalDecorImage';
import { STUDENT_DECOR } from '../constants/studentDecorPaths';
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
        const cp =
          (typeof tokenBalance === 'number' && tokenBalance > 0)
            ? tokenBalance
            : extractCpBalance(balanceRes?.data);
        if (cp !== null) setCpBalance(cp);
        setProducts(Array.isArray(prodRes?.data?.items) ? prodRes.data.items.slice(0, 1) : []);
        const txItems = Array.isArray(txRes?.data?.items) ? txRes.data.items : [];
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
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)',
          maskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)',
        }}
      >
        <div className="mx-auto max-w-7xl px-2 pt-6 pb-16 md:px-8">

          {/* ── HEADER ───────────────────────────────────────────────────── */}
<ScrollReveal className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
             <div>
              {/**==========================
               * Removed  headr tags not neccesaryu on page
               * =============================
               */}
               <h1 className="text-4xl font-black text-text-primary md:text-6xl">
                 {loading
                   ? <span className="inline-block h-12 w-48 rounded bg-accent-dim/20 animate-pulse align-middle" />
                   : handle}
               </h1>
              {!loading && (
                <div className="mt-2 mb-1 inline-flex items-center gap-2">
                  <span className={`font-mono text-sm font-black ${rankInfo.color}`}>{rankInfo.name}</span>
                </div>
              )}
              <p className="mt-1 max-w-lg text-base text-text-muted">
                {loading
                  ? 'Loading your status…'
                  : isEnrolled
                  ? 'Pick up where you left off.'
                  : 'Choose a bootcamp and start training.'}
              </p>
            </div>

            {/* Stats pills */}
            {!loading && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="rounded-2xl border-2 border-accent/25 bg-accent-dim px-3 sm:px-4 py-2 sm:py-2.5 inline-flex items-center gap-2 max-w-full">
                  <CpLogo className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                  <span className="font-mono text-lg sm:text-xl font-black text-accent truncate">{cpBalance.toLocaleString()}</span>
                </div>
                {streakDays > 0 && (
                  <div className="rounded-2xl border-2 border-orange-400/25 bg-orange-400/10 px-3 sm:px-4 py-2 sm:py-2.5 inline-flex items-center gap-2 max-w-full">
                    <Flame className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-orange-400" />
                    <span className="font-mono text-lg sm:text-xl font-black text-orange-400 truncate">{streakDays}d</span>
                  </div>
                )}
              </div>
            )}
          </ScrollReveal>

          {/* ── MAIN GRID ────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8 lg:items-start">

            {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
            <div className="space-y-6 lg:col-span-2">

              {/* PRIMARY ACTION CARD */}
              <ScrollReveal>
                {loading ? (
                  <div className="card-hsociety p-6 animate-pulse space-y-3">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-2 w-full rounded-full" />
                    <Skeleton className="h-11 w-full rounded-md" />
                  </div>
                ) : (
                  <div className="card-hsociety p-6 relative overflow-hidden">
                    <OptionalDecorImage
                      src={STUDENT_DECOR.bootcampOperator}
                      className="pointer-events-none absolute -right-4 -top-4 h-28 w-auto object-contain opacity-[0.12] select-none"
                    />
                    <p className="mb-1 text-xs font-black uppercase tracking-[0.3em] text-accent relative z-10">
                      {isEnrolled
                        ? (overview?.progressMeta?.currentPhase?.title || 'Active bootcamp')
                        : 'Get started'}
                    </p>
                    <p className="mb-5 text-xl font-black leading-snug text-text-primary relative z-10">
                      {nextMission
                        ? nextMission.title
                        : isEnrolled
                        ? 'Pick up where you left off'
                        : 'Choose a bootcamp to begin'}
                    </p>
                    {nextRank && (
                      <div className="mb-5 relative z-10">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                            {nextRank.min - cpBalance} CP → {nextRank.name}
                          </span>
                          <span className="font-mono text-xs font-black text-text-muted">{rankProgress}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-accent-dim">
                          <div
                            className="h-full rounded-full bg-accent/50 transition-all duration-700"
                            style={{ width: `${rankProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <Link
                      to={continuePath}
                      className="btn-primary flex w-full items-center justify-center gap-2 py-3 text-sm relative z-10"
                    >
                      {isEnrolled ? 'Continue mission' : 'Browse bootcamps'}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </ScrollReveal>

              {/* MINI LEADERBOARD */}
              <MiniLeaderboard currentHandle={handle} />

              {/* SYNC STATUS */}
              <div className="flex items-center justify-between gap-3 px-1">
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

            {/* ── RIGHT COLUMN — Programs + Market ────────────────────────── */}
            <div className="lg:col-span-3 space-y-8">

              {/* Section header row */}
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-text-primary">
                  <BookOpen className="h-4 w-4 text-accent" />
                  {multipleEnrolled ? 'Your programs' : 'Your program'}
                </h2>
                <div className="flex items-center gap-4">
                  {enrolledBootcamps.length > 1 && (
                    <Link
                      to="/dashboard/bootcamps"
                      className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-accent hover:underline"
                    >
                      All bootcamps <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  {products.length > 0 && (
                    <Link
                      to="/dashboard/marketplace"
                      className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-text-muted hover:text-accent hover:underline"
                    >
                      <ShoppingBag className="h-3 w-3" /> Market <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Loading skeletons */}
              {loading && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">
                  {[0, 1].map((i) => (
                    <div key={i} className="card-hsociety overflow-hidden animate-pulse">
                      <div className="aspect-video bg-accent-dim/30" />
                      <div className="space-y-3 p-5">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="mt-3 h-2 w-full rounded-full" />
                        <Skeleton className="h-9 w-full rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Content grid — bootcamp(s) + 1 product side by side */}
              {!loading && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">

                  {/* Bootcamp cards — or empty state */}
                  {enrolledBootcamps.length === 0 ? (
                    <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border py-16 text-center">
                      <OptionalDecorImage
                        src={STUDENT_DECOR.bootcampOperator}
                        className="pointer-events-none absolute right-0 bottom-0 h-full w-auto object-contain object-right-bottom opacity-[0.08] select-none"
                      />
                      <BookOpen className="mx-auto mb-4 h-10 w-10 text-text-muted opacity-40" />
                      <p className="mb-5 text-base text-text-muted">No bootcamps enrolled yet.</p>
                      <Link
                        to="/dashboard/bootcamps"
                        className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm"
                      >
                        Browse bootcamps <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ) : (
                    enrolledBootcamps.map((item, idx) => (
                      <StudentBootcampCard key={item.id} data={item} index={idx} />
                    ))
                  )}

                  {/* Single featured product — sits right next to the bootcamp card */}
                  {products.length > 0 && (() => {
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
                        className="flex flex-col"
                      >
                        <div className="card-hsociety flex flex-col h-full overflow-hidden">
                          {/* Cover — same aspect-video as bootcamp card */}
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src={resolveImg(prod.coverUrl, '/assets/sections/backgrounds/cyber-points-visual.webp')}
                              alt={prod.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                            {/* Gradient overlay */}
                            <div
                              aria-hidden
                              className="pointer-events-none absolute inset-0"
                              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }}
                            />
                            {/* Badges */}
                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                              {hasPurchased && (
                                <span className="px-2 py-0.5 bg-accent text-bg rounded text-[9px] font-black uppercase tracking-widest">
                                  Owned
                                </span>
                              )}
                              {prod.isFree && !hasPurchased && (
                                <span className="px-2 py-0.5 bg-emerald-500/80 text-white rounded text-[9px] font-black uppercase tracking-widest">
                                  FREE
                                </span>
                              )}
                            </div>
                            {prod.type && (
                              <div className="absolute top-2.5 right-2.5">
                                <span className="bg-bg/80 backdrop-blur-md border border-border rounded px-2 py-0.5 text-[9px] font-black uppercase text-accent tracking-widest">
                                  {prod.type}
                                </span>
                              </div>
                            )}
                            {/* Market label bottom-left */}
                            <div className="absolute bottom-2.5 left-2.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-bg/80 backdrop-blur-sm border border-border/60 rounded text-[9px] font-black uppercase text-text-muted tracking-widest">
                                <ShoppingBag className="h-2.5 w-2.5" /> Zero-day vault
                              </span>
                            </div>
                          </div>

                          {/* Body */}
                          <div className="flex flex-1 flex-col p-5">
                            <h3 className="mb-1.5 text-base font-black leading-snug text-text-primary md:text-lg line-clamp-2">
                              {prod.title}
                            </h3>
                            {prod.description && (
                              <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-text-muted">{prod.description}</p>
                            )}
                            <div className="mb-4 text-[11px] font-bold uppercase text-text-muted">
                              {prod.isFree ? (
                                <span className="text-emerald-400">Free</span>
                              ) : (
                                <span className="text-accent inline-flex items-center gap-1">
                                  {Number(prod.cpPrice || 0).toLocaleString()} <CpLogo className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                            <div className="mt-auto">
                              {(hasPurchased || prod.isFree) ? (
                                <button
                                  onClick={() => handleDownload(prod)}
                                  disabled={isDownloading}
                                  className="btn-primary flex w-full items-center justify-center gap-2 py-2.5 text-sm font-black uppercase disabled:opacity-60"
                                >
                                  {isDownloading
                                    ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Downloading...</>
                                    : <><Download className="h-3.5 w-3.5" /> Download</>}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handlePurchase(prod)}
                                  disabled={isBuying}
                                  className="btn-primary flex w-full items-center justify-center gap-2 py-2.5 text-sm font-black uppercase disabled:opacity-60"
                                >
                                  {isBuying
                                    ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing...</>
                                    : 'Purchase Access'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}

                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
