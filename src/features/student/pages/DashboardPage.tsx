import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Flame, ChevronRight, RefreshCw, BookOpen,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { useAuth } from '../../../core/contexts/AuthContext';
import api from '../../../core/services/api';
import CpLogo from '../../../shared/components/CpLogo';
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

// ── Rank config ───────────────────────────────────────────────────────────────
const RANKS = [
  { name: 'Candidate',   min: 0,    max: 149,      color: 'text-zinc-400'   },
  { name: 'Contributor', min: 150,  max: 449,      color: 'text-blue-400'   },
  { name: 'Specialist',  min: 450,  max: 899,      color: 'text-purple-400' },
  { name: 'Architect',   min: 900,  max: 1499,     color: 'text-amber-400'  },
  { name: 'Vanguard',    min: 1500, max: Infinity, color: 'text-accent'     },
];

function getRankInfo(cp: number) {
  const rank = RANKS.find(r => cp >= r.min && cp <= r.max) ?? RANKS[0];
  const next = RANKS[RANKS.indexOf(rank) + 1] ?? null;
  const progress = next ? Math.round(((cp - rank.min) / (next.min - rank.min)) * 100) : 100;
  return { rank, next, progress };
}

// ── Bootcamp assets ───────────────────────────────────────────────────────────
const BOOTCAMP_COVER_IMGS: Record<string, string> = {
  bc_1775270338500: '/assets/bootcamp/hpb-cover.png',
};
const BOOTCAMP_FALLBACK_IMG = '/assets/bootcamp/hpb-cover.png';

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
  const [overview, setOverview]        = useState<any>(null);
  const [bootcamps, setBootcamps]      = useState<any[]>([]);
  const [cpBalanceState, setCpBalance] = useState<number | null>(null);
  const [loading, setLoading]          = useState(true);
  const [syncError, setSyncError]      = useState('');
  const [lastSync, setLastSync]        = useState<string | null>(getLastSync('dashboard'));

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [ovRes, bcRes, balanceRes, tokenBalance] = await Promise.all([
          api.get('/student/overview').catch(() => null),
          api.get('/public/bootcamps').catch(() => null),
          api.get('/cp/balance').catch(() => null),
          getTokenBalanceForUser(user?.uid || ''),
        ]);
        if (!mounted) return;
        setOverview(ovRes?.data || null);
        setBootcamps(Array.isArray(bcRes?.data?.items) ? bcRes.data.items : []);
        const cp =
          (typeof tokenBalance === 'number' && tokenBalance > 0)
            ? tokenBalance
            : extractCpBalance(balanceRes?.data);
        if (cp !== null) setCpBalance(cp);
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

  const activeBootcamp  = bootcamps.find((bc: any) => moduleProgressById.get(String(bc.id || '')) !== undefined);
  const nextRoomPath    = activeBootcamp ? resolveNextRoomPath(String(activeBootcamp.id || '')) : null;
  const continuePath    = nextRoomPath || (activeBootcamp ? `/bootcamps/${activeBootcamp.id}` : '/bootcamps');
  const isEnrolled      = (overview?.bootcampStatus || 'not_enrolled') !== 'not_enrolled';
  const progressValue   = overview?.snapshot?.find((s: any) => s?.id === 'progress')?.value || '0%';
  const progressNum     = parseInt(progressValue, 10) || 0;
  const streakDays      = Number(overview?.xpSummary?.streakDays || 0);
  const cpBalance       = pickCpBalance(user?.cp ?? 0, overview, cpBalanceState);
  const handle          = user?.username || 'OPERATOR';
  const { rank: rankInfo, next: nextRank, progress: rankProgress } = getRankInfo(cpBalance);
  const nextMission     = (overview?.learningPath || []).find(
    (m: any) => m.status === 'in-progress' || m.status === 'next'
  );
  const multipleEnrolled = enrolledBootcamps.length > 1;

  return (
    <div className="min-h-screen bg-bg pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8 md:pt-10">

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <ScrollReveal className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="mb-3 block text-xs font-black uppercase tracking-[0.35em] text-accent md:text-sm">
              Mission control
            </span>
            <h1 className="text-4xl font-black text-text-primary md:text-6xl">{handle}</h1>
            <p className="mt-2 max-w-lg text-base text-text-muted">
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
              <div className="rounded-2xl border-2 border-accent/25 bg-accent-dim px-3 sm:px-4 py-2 sm:py-2.5 inline-flex items-center gap-2">
                <CpLogo className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <span className="font-mono text-lg sm:text-xl font-black text-accent">{cpBalance.toLocaleString()}</span>
              </div>
              {streakDays > 0 && (
                <div className="rounded-2xl border-2 border-orange-400/25 bg-orange-400/10 px-3 sm:px-4 py-2 sm:py-2.5 inline-flex items-center gap-2">
                  <Flame className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-orange-400" />
                  <span className="font-mono text-lg sm:text-xl font-black text-orange-400">{streakDays}d</span>
                </div>
              )}
              <div className="rounded-2xl border-2 border-border bg-bg-card px-3 sm:px-4 py-2 sm:py-2.5">
                <span className={`font-mono text-lg sm:text-xl font-black ${rankInfo.color}`}>{rankInfo.name}</span>
              </div>
            </div>
          )}
        </ScrollReveal>

        {/* ── MAIN GRID ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8 lg:items-start">

          {/* LEFT COLUMN — primary action + sync */}
          <div className="space-y-6 lg:col-span-2">

            {/* PRIMARY ACTION */}
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
                  {/* Subtle operator illustration — sits in the top-right corner, clipped by overflow-hidden */}
                  <img
                    src="/assets/illustrations/bootcamp-operator.png"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-4 -top-4 h-28 w-auto object-contain opacity-[0.07] select-none"
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
                  {isEnrolled && (
                    <div className="mb-5 relative z-10">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-mono text-sm font-black text-accent">{progressValue}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-accent-dim">
                        <div
                          className="h-full rounded-full bg-accent transition-all duration-700"
                          style={{ width: `${progressNum}%` }}
                        />
                      </div>
                    </div>
                  )}
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

          {/* RIGHT COLUMN — Programs */}
          <div className="lg:col-span-3">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-text-primary">
                <BookOpen className="h-4 w-4 text-accent" />
                {multipleEnrolled ? 'Your programs' : 'Your program'}
              </h2>
              {enrolledBootcamps.length > 1 && (
                <Link
                  to="/bootcamps"
                  className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-accent hover:underline"
                >
                  View all <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              )}
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

            {/* Empty state */}
            {!loading && enrolledBootcamps.length === 0 && (
              <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border py-16 text-center">
                <img
                  src="/assets/illustrations/cta-operator.png"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 bottom-0 h-full w-auto object-contain object-right-bottom opacity-[0.06] select-none"
                />
                <BookOpen className="mx-auto mb-4 h-10 w-10 text-text-muted opacity-40" />
                <p className="mb-5 text-base text-text-muted">No bootcamps enrolled yet.</p>
                <Link
                  to="/bootcamps"
                  className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm"
                >
                  Browse bootcamps <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            {/* Bootcamp cards */}
            {!loading && enrolledBootcamps.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">
                {enrolledBootcamps.map((item, idx) => (
                  <StudentBootcampCard key={item.id} data={item} index={idx} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
