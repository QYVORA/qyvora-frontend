import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, RefreshCw, BookOpen,
  ShoppingBag, Download, Loader2,
  Zap, Shield, Layers, Flame,
} from 'lucide-react';
import { motion } from 'motion/react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { useAuth } from '@/core/contexts/AuthContext';
import api from '@/core/services/api';
import EventReviewModal from '@/features/student/components/EventReviewModal';
import { getPendingEventJoin, clearPendingEventJoin } from '@/shared/utils/eventJoin';
import CpLogo from '@/shared/components/CpLogo';
import { getRankInfo } from '@/features/student/utils/rankUtils';
import { extractCpBalance } from '@/shared/utils/cpBalance';
import {
  formatSyncLabel,
  getBootcampProgressMap,
  getLastSync,
  resolveNextRoomPath,
  setLastSyncNow,
} from '@/features/student/utils/studentExperience';
import StudentBootcampCard, { type StudentBootcampCardData } from '@/features/student/components/StudentBootcampCard';
import { resolveImg } from '@/shared/utils/resolveImg';
import { useToast } from '@/core/contexts/ToastContext';
import SEO from '@/shared/components/SEO';
import { Skeleton } from '@/shared/components/ui';
import { StreakIcon } from '@/shared/components';
import OnboardingWizard from '@/features/student/components/OnboardingWizard';
import LearningPathMap from '@/features/student/components/LearningPathMap';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';
import hpbCoverImg from '@/assets/bootcamp/hpb-cover.webp';
import productFallbackImg from '@/assets/sections/stats/cp-earned-bg.webp';

const BOOTCAMP_COVER_IMGS: Record<string, string> = { bc_1775270338500: hpbCoverImg };
const BOOTCAMP_FALLBACK_IMG = hpbCoverImg;

function pickCpBalance(userCp: number, overview: any, cpBalance: number | null): number {
  if (typeof cpBalance === 'number' && Number.isFinite(cpBalance)) return cpBalance;
  const fromOverview = extractCpBalance(overview?.xpSummary) ?? extractCpBalance(overview);
  if (typeof fromOverview === 'number' && Number.isFinite(fromOverview)) return fromOverview;
  return userCp;
}

const DashboardSkeleton: React.FC = () => (
  <div className="bg-bg">
    <div className="mx-auto max-w-[1600px] px-0 pt-6 pb-16 md:px-6 lg:px-10">
      <div className="grid grid-cols-1 gap-6 lg:gap-8 mb-10 items-stretch">
        <div className="w-full px-4 md:px-0">
          <div className="p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl border border-border/40 bg-bg-card">
            <div className="space-y-5">
              <Skeleton className="h-4 w-24 bg-border/30" />
              <Skeleton className="h-10 w-3/4 bg-border/30" />
              <Skeleton className="h-2 w-full max-w-md bg-border/30 rounded-full" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-40 bg-border/30 rounded-xl" />
                <Skeleton className="h-12 w-48 bg-border/30 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12 items-start px-4 md:px-0">
        <div className="space-y-4">
          <Skeleton className="h-4 w-44 bg-border/30" />
          <Skeleton className="h-64 w-full bg-border/30 rounded-2xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-32 bg-border/30" />
          <Skeleton className="h-80 w-full bg-border/30 rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const pending = getPendingEventJoin();
  const [showReviewModal, setShowReviewModal] = useState(!!pending);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

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
        const [ovRes, bcRes, prodRes, txRes] = await Promise.all([
          api.get('/student/overview').catch(() => null),
          api.get('/public/bootcamps').catch(() => null),
          api.get('/public/cp-products').catch(() => null),
          api.get('/cp/transactions?limit=100').catch(() => null),
        ]);
        if (!mounted) return;
        setOverview(ovRes?.data || null);
        setBootcamps(Array.isArray(bcRes?.data?.items) ? bcRes.data.items : []);
        const txItems = Array.isArray(txRes?.data?.items) ? txRes.data.items : [];
        setCpBalance(user?.cp ?? 0);
        setProducts(Array.isArray(prodRes?.data?.items) ? prodRes.data.items.slice(0, 3) : []);
        setPurchased(new Set<string>(txItems.filter((tx: any) => tx.type === 'purchase' && tx.productId).map((tx: any) => String(tx.productId))));
        setSyncError('');
        setLastSync(setLastSyncNow('dashboard'));
      } catch { setSyncError('Could not sync. Showing cached data.'); addToast('Failed to load dashboard data', 'error'); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [user?.uid, user?.cp]);

  const moduleProgressById = getBootcampProgressMap(overview);
  const enrolledBootcamps: StudentBootcampCardData[] = bootcamps
    .map((item: any) => ({ item, prog: moduleProgressById.get(String(item.id || '')) }))
    .filter(({ prog }) => prog !== undefined)
    .slice(0, 4)
    .map(({ item, prog }) => ({
      id: String(item.id || ''), title: item.title || 'Bootcamp', description: String(item.description || '').trim(),
      level: String(item.level || '').trim(), duration: String(item.duration || '').trim(), priceLabel: String(item.priceLabel || '').trim(),
      progress: Number(prog?.progress || 0), img: BOOTCAMP_COVER_IMGS[String(item.id || '')] ?? BOOTCAMP_FALLBACK_IMG,
      isEnrolled: true, isLocked: false,
    }));

  const activeBootcamp = bootcamps.find((bc: any) => moduleProgressById.get(String(bc.id || '')) !== undefined);
  const continuePath   = activeBootcamp ? resolveNextRoomPath(String(activeBootcamp.id || '')) || `/dashboard/bootcamps/${activeBootcamp.id}` : '/dashboard/bootcamps';
  const isEnrolled     = (overview?.bootcampStatus || 'not_enrolled') !== 'not_enrolled';
  const cpBalance      = pickCpBalance(user?.cp ?? 0, overview, cpBalanceState);
  const { rank: _r, next: nextRank, progress: rankProgress } = getRankInfo(cpBalance);
  const nextMission    = (overview?.learningPath || []).find((m: any) => m.status === 'in-progress' || m.status === 'next');

  const overviewModules = Array.isArray(overview?.modules) ? overview.modules : [];
  const totalRoomsDone = overviewModules.reduce((sum: number, m: any) => sum + Number(m.roomsCompleted || 0), 0);
  const allDone = isEnrolled && !nextMission && totalRoomsDone > 0;

  const weekActivity = useMemo(() => {
    const visitDates: string[] = Array.isArray(overview?.visitDates) ? overview.visitDates : [];
    if (visitDates.length === 0) return null;
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return labels.map((label, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      return { label, active: visitDates.includes(dateStr) };
    });
  }, [overview?.visitDates]);

  const handlePurchase = async (product: any) => {
    const id = String(product.id || ''); setPurchasing(id);
    try { await api.post('/cp/purchase', { productId: id }); addToast(`${product.title} purchased.`, 'success'); setPurchased((prev) => new Set([...prev, id])); }
    catch (err: any) { addToast(err?.response?.data?.error || 'Purchase failed.', 'error'); }
    finally { setPurchasing(null); }
  };

  const handleDownload = async (product: any) => {
    const id = String(product.id || ''); setDownloading(id);
    try {
      const base = String(import.meta.env.VITE_API_BASE_URL || '/api');
      const res = await fetch(`${base}/cp/products/${id}/download`, { credentials: 'include' });
      if (!res.ok) { addToast('Download failed.', 'error'); return; }
      const blob = await res.blob();
      const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
      link.download = product.fileName || `${product.title || 'product'}.pdf`; link.click(); URL.revokeObjectURL(link.href);
    } catch { addToast('Download failed.', 'error'); }
    finally { setDownloading(null); }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="bg-bg">
      <SEO title="Dashboard" description="Your training overview, active deployments, and intelligence vault on QYVORA." />
      <OnboardingWizard />
      <div className="scroll-hover md:fixed md:left-0 md:right-20 md:bottom-0 md:top-24 md:overflow-y-auto md:overscroll-contain" style={{ scrollBehavior: 'smooth' }}>
        <div className="mx-auto max-w-[1600px] px-0 pt-6 pb-16 md:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-6 lg:gap-8 mb-10 items-stretch">
            <div className="w-full px-4 md:px-0">
              <ScrollReveal className="h-full">
                <div className="p-6 sm:p-8 md:p-10 lg:p-12 relative overflow-hidden h-full flex flex-col justify-center border border-border/40 bg-bg-card rounded-2xl shadow-none">
                  <div className="relative z-10">
                    {allDone ? (
                      <>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-[1.5px] w-8 bg-accent" />
                          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-accent">Mission Complete</span>
                        </div>
                        <h2 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] text-text-primary max-w-3xl tracking-tight">Congratulations, Operator</h2>
                        <p className="text-sm text-text-muted mb-6 max-w-lg">You have completed all available missions. Your training is paying off.</p>
                        <div className="flex flex-wrap gap-6 mb-6">
                          <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-accent" />
                            <span className="font-mono text-sm font-bold text-text-primary">{totalRoomsDone} rooms completed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CpLogo className="w-4 h-4" />
                            <span className="font-mono text-sm font-bold text-text-primary">{cpBalance.toLocaleString()} total CP</span>
                          </div>
                          {overview?.xpSummary?.streakDays != null && overview.xpSummary.streakDays > 0 && (
                            <div className="flex items-center gap-2">
                              <Flame className="w-4 h-4 text-orange-400" />
                              <span className="font-mono text-sm font-bold text-text-primary">{overview.xpSummary.streakDays}-day streak</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          <Link to={continuePath} className="bg-accent text-bg px-7 py-3 rounded-xl text-xs font-black uppercase tracking-[0.15em] shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98]">Review Curriculum<ArrowRight className="inline-block ml-2 h-4 w-4" /></Link>
                        </div>
                      </>
                    ) : isEnrolled ? (
                      <>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-[1.5px] w-8 bg-accent" />
                          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-accent">{overview?.progressMeta?.currentPhase?.title || 'Active Deployment'}</span>
                        </div>
                        <h2 className="mb-6 text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] text-text-primary max-w-3xl tracking-tight">{nextMission ? nextMission.title : 'Pick up where you left off'}</h2>
                        {nextRank && (
                          <div className="mb-6 max-w-md">
                            <div className="mb-2.5 flex items-center justify-between"><span className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted">Target Rank: <span className="text-accent">{nextRank.name}</span></span><span className="font-mono text-xs font-black text-accent">{rankProgress}%</span></div>
                            <div className="h-2 overflow-hidden rounded-full bg-accent-dim/20 shadow-inner"><div className="h-full rounded-full bg-accent transition-all duration-1000 shadow-[0_0_10px_var(--color-accent)]" style={{ width: `${rankProgress}%` }} /></div>
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-4">
                          <Link to={continuePath} className="bg-accent text-bg px-8 py-4 rounded-xl text-sm font-black uppercase tracking-[0.15em] shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98]">{nextMission ? 'Continue Mission' : 'Review Curriculum'}<ArrowRight className="inline-block ml-2 h-5 w-5" /></Link>
                          {!loading && (
                            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-bg-elevated/40 backdrop-blur-md shadow-sm">
                              <CpLogo className="h-5 w-5" />
                              <span className="font-mono text-xl font-black text-text-primary tracking-tighter">{cpBalance.toLocaleString()}</span>
                              {overview?.xpSummary?.streakDays != null && overview.xpSummary.streakDays > 0 && (
                                <span className="w-px h-5 bg-border/40 mx-1" />
                              )}
                              {overview?.xpSummary?.streakDays != null && overview.xpSummary.streakDays > 0 && (
                                <StreakIcon days={overview.xpSummary.streakDays} />
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-[1.5px] w-8 bg-accent" />
                          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-accent">New Mission</span>
                        </div>
                        <h2 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] text-text-primary max-w-3xl tracking-tight">Begin your journey into the offensive underground</h2>
                        <p className="text-sm text-text-muted mb-6 max-w-lg">Join 250+ operators already training on QYVORA. Master offensive security through hands-on bootcamp rooms, earn CP, and climb the ranks.</p>
                        {nextRank && (
                          <div className="mb-6 max-w-md">
                            <div className="mb-2.5 flex items-center justify-between"><span className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted">Rank Preview: <span className="text-accent">{nextRank.name}</span></span><span className="font-mono text-xs font-black text-accent">{rankProgress}%</span></div>
                            <div className="h-2 overflow-hidden rounded-full bg-accent-dim/20 shadow-inner"><div className="h-full rounded-full bg-accent transition-all duration-1000 shadow-[0_0_10px_var(--color-accent)]" style={{ width: `${rankProgress}%` }} /></div>
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-4">
                          <Link to={continuePath} className="bg-accent text-bg px-8 py-4 rounded-xl text-sm font-black uppercase tracking-[0.15em] shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98]">START THE BOOTCAMP<ArrowRight className="inline-block ml-2 h-5 w-5" /></Link>
                          {!loading && (
                            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-bg-elevated/40 backdrop-blur-md shadow-sm">
                              <CpLogo className="h-5 w-5" />
                              <span className="font-mono text-xl font-black text-text-primary tracking-tighter">{cpBalance.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Quick-stats row */}
          <div className="flex gap-4 overflow-x-auto pb-2 px-4 md:px-0 md:grid md:grid-cols-5 md:gap-4 mb-8 scroll-hover">
            <div className="card-qyvora flex-none md:flex-1 flex items-center gap-3 p-4 rounded-xl border border-border/40 bg-bg-card/60 min-w-[130px]">
              <div className="w-10 h-10 rounded-xl bg-accent-dim border border-accent/20 flex items-center justify-center flex-none">
                <CpLogo className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] font-black uppercase tracking-widest text-text-muted">CP Balance</div>
                <div className="font-mono text-lg font-black text-text-primary">{cpBalance.toLocaleString()}</div>
              </div>
            </div>
            <div className="card-qyvora flex-none md:flex-1 flex items-center gap-3 p-4 rounded-xl border border-border/40 bg-bg-card/60 min-w-[130px]">
              <div className="w-10 h-10 rounded-xl bg-accent-dim border border-accent/20 flex items-center justify-center flex-none">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[9px] font-black uppercase tracking-widest text-text-muted">{_r?.name || 'Candidate'}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex-1 h-1.5 rounded-full bg-accent-dim/20 overflow-hidden">
                    <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${rankProgress}%` }} />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-accent">{nextRank ? `→ ${nextRank.name}` : 'MAX'}</span>
                </div>
              </div>
            </div>
            <div className="card-qyvora flex-none md:flex-1 flex items-center gap-3 p-4 rounded-xl border border-border/40 bg-bg-card/60 min-w-[130px]">
              <div className="w-10 h-10 rounded-xl bg-accent-dim border border-accent/20 flex items-center justify-center flex-none">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] font-black uppercase tracking-widest text-text-muted">Streak</div>
                <div className="font-mono text-lg font-black text-text-primary">{overview?.xpSummary?.streakDays ?? 0} days</div>
              </div>
            </div>
            <div className="card-qyvora flex-none md:flex-1 flex items-center gap-3 p-4 rounded-xl border border-border/40 bg-bg-card/60 min-w-[130px]">
              <div className="w-10 h-10 rounded-xl bg-accent-dim border border-accent/20 flex items-center justify-center flex-none">
                <Layers className="w-5 h-5 text-accent" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] font-black uppercase tracking-widest text-text-muted">Rooms Done</div>
                <div className="font-mono text-lg font-black text-text-primary">{totalRoomsDone}</div>
              </div>
            </div>
            <div className="card-qyvora flex-none md:flex-1 flex items-center gap-3 p-4 rounded-xl border border-border/40 bg-bg-card/60 min-w-[130px]">
              <div className="w-10 h-10 rounded-xl bg-accent-dim border border-accent/20 flex items-center justify-center flex-none">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] font-black uppercase tracking-widest text-text-muted">This Week</div>
                <div className="font-mono text-lg font-black text-text-primary">{weekActivity?.filter(d => d.active).length ?? 0} days</div>
              </div>
              {weekActivity && (
                <div className="flex items-end gap-[3px] h-full pt-1" title="Mon-Sun activity">
                  {weekActivity.map((d) => (
                    <div key={d.label} className="flex flex-col items-center gap-[2px]">
                      <div className={`w-2 h-2 rounded-full ${d.active ? 'bg-accent shadow-[0_0_4px_rgba(102,184,112,0.6)]' : 'bg-border/30'}`} />
                      <span className="text-[7px] font-bold text-text-muted/40 uppercase">{d.label[0]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12 items-start">
            <div className="flex flex-col gap-6 h-full">
              <div className="flex items-center justify-between px-5"><h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Active Deployments</h3><Link to="/dashboard/bootcamps" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">View All</Link></div>
              {enrolledBootcamps.length === 0 ? (
                <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border/20 py-12 text-center h-full min-h-[220px] flex flex-col items-center justify-center bg-transparent mx-1">
                  <BookOpen className="mx-auto mb-3 h-8 w-8 text-text-muted opacity-40" /><p className="mb-4 text-sm text-text-muted">No active bootcamps.</p>
                  <Link to="/dashboard/bootcamps" className="bg-accent text-bg px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110">Start Training <ArrowRight className="inline-block ml-1.5 h-3.5 w-3.5" /></Link>
                </div>
              ) : enrolledBootcamps.slice(0, 1).map((item, idx) => <div key={item.id} className="h-full px-5 md:px-0"><StudentBootcampCard data={item} index={idx} /></div>)}
            </div>

            <div className="flex flex-col gap-6 h-full">
              <div className="flex items-center justify-between px-5"><h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Intelligence Vault</h3><Link to="/dashboard/marketplace" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">Marketplace</Link></div>
              {products.length === 0 ? (
                <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border/20 py-12 text-center h-full min-h-[220px] flex flex-col items-center justify-center bg-transparent mx-1">
                  <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-text-muted opacity-40" /><p className="mb-4 text-sm text-text-muted">No products available.</p>
                  <Link to="/dashboard/marketplace" className="bg-accent text-bg px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:brightness-110">Browse Marketplace <ArrowRight className="inline-block ml-1.5 h-3.5 w-3.5" /></Link>
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-2 px-5 md:px-0 md:grid md:grid-cols-3 md:gap-4 scroll-hover">
                  {products.map((prod, idx) => {
                    const id = String(prod.id || ''); const hasPurchased = purchased.has(id);
                    return (
                      <motion.div key={id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 + idx * 0.05, ease: [0.16, 1, 0.3, 1] }} className="flex-none w-[240px] md:w-auto md:flex-1">
                        <div className="flex flex-col h-full overflow-hidden border border-border/40 bg-bg-card rounded-2xl transition-all duration-300 group hover:border-accent/30 hover:scale-[1.01]">
                          <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                            <img src={resolveImg(prod.coverUrl, productFallbackImg)} alt={prod.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                            <div className="absolute top-2 left-2 flex items-center gap-1.5">{hasPurchased && <span className="px-2 py-0.5 bg-accent text-bg rounded text-[8px] font-black uppercase tracking-widest shadow-md">Owned</span>}</div>
                            <div className="absolute bottom-2 left-2"><span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-bg/85 backdrop-blur-md rounded-lg text-[8px] font-black uppercase text-text-primary tracking-widest"><ShoppingBag className="h-2.5 w-2.5 text-accent" /> Premium Asset</span></div>
                          </div>
                          <div className="flex flex-1 flex-col p-5 sm:p-6">
                            <h3 className="mb-1.5 text-sm font-black leading-snug text-text-primary line-clamp-2 transition-colors group-hover:text-accent">{prod.title}</h3>
                            <p className="text-[11px] text-text-muted/70 mb-4 line-clamp-2 leading-relaxed font-mono">{prod.description || 'Access high-value intelligence reports and research papers.'}</p>
                            <div className="mt-auto">
                              {(hasPurchased || prod.isFree) ? (
                                <button onClick={() => handleDownload(prod)} disabled={downloading === id} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent text-bg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60">{downloading === id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} Download</button>
                              ) : (
                                <button onClick={() => handlePurchase(prod)} disabled={purchasing === id} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent text-bg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60">{purchasing === id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><CpLogo className="h-3.5 w-3.5" /> Unlock</>}</button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-10">
            <LearningPathMap
              overview={overview}
              bootcampId={activeBootcamp ? String(activeBootcamp.id) : BOOTCAMP_CONFIG.id}
              isEnrolled={isEnrolled}
            />
          </div>

          <div className="mt-8 flex items-center justify-between gap-3 px-5">
            <p className={`flex items-center gap-1.5 text-[11px] ${syncError ? 'text-red-400' : 'text-text-muted'}`}><RefreshCw className="h-3 w-3 shrink-0" />{syncError || formatSyncLabel(lastSync)}</p>
            {syncError && <button onClick={() => window.location.reload()} className="text-[11px] font-bold text-accent hover:underline">Retry</button>}
          </div>
        </div>
      </div>

      {pending && showReviewModal && (
        <EventReviewModal
          open={showReviewModal}
          onOpenChange={(open) => {
            setShowReviewModal(open);
            if (!open) {
              clearPendingEventJoin();
            }
          }}
          eventId={pending.eventId}
          onReviewSubmitted={() => {
            setReviewSubmitted(true);
            clearPendingEventJoin();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
