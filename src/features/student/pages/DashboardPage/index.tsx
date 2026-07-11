import { useEffect, useState } from 'react';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import api from '@/core/services/api';
import { getRankInfo } from '@/features/student/utils/rankUtils';
import { extractCpBalance } from '@/shared/utils/cpBalance';
import {
  getBootcampProgressMap,
  resolveNextRoomPath,
} from '@/features/student/utils/studentExperience';
import { Skeleton } from '@/shared/components/ui';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';
import SEO from '@/shared/components/SEO';
import EventReviewModal from '@/features/student/components/EventReviewModal';
import OnboardingWizard from '@/features/student/components/OnboardingWizard';
import LearningPathMap from '@/features/student/components/LearningPathMap';
import { getPendingEventJoin, clearPendingEventJoin } from '@/shared/utils/eventJoin';
import type { StudentBootcampCardData } from '@/features/student/components/StudentBootcampCard';
import { DashboardHero } from '@/features/student/components/dashboard';
import StudentBootcampCard from '@/features/student/components/StudentBootcampCard';
import { SimulatedTerminal } from '@/features/student/components/SimulatedTerminal';
import {
  Layers, Flame, Trophy, BookOpen, ShoppingBag, ArrowRight,
  Download, Loader2,
} from 'lucide-react';
import CpLogo from '@/shared/components/CpLogo';
import { Link, useNavigate } from 'react-router-dom';
import { resolveImg } from '@/shared/utils/resolveImg';
import { isInstallable, showInstallPrompt } from '@/features/student/services/pwa';

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

const DashboardSkeleton = () => (
  <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-10 pt-8 pb-20 lg:pb-24 space-y-6">
    <Skeleton className="h-24 w-full bg-border/30 rounded-2xl" />
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 bg-border/30 rounded-xl" />)}
    </div>
    <Skeleton className="h-48 w-full bg-border/30 rounded-2xl" />
  </div>
);

const StatCard = ({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) => (
  <div className="flex items-center gap-3 p-4 rounded-xl border border-border/30 bg-bg-card">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent ? 'bg-accent/10' : 'bg-bg-elevated'}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <div className="font-mono text-lg font-black text-text-primary leading-none break-words">{value}</div>
      <div className="text-[9px] font-black uppercase tracking-widest text-text-muted mt-0.5">{label}</div>
    </div>
  </div>
);

const DashboardProductCard = ({ product }: { product: any }) => {
  const id = String(product?.id || '');
  const title = String(product?.title || 'Intelligence Asset');
  const description = String(product?.description || 'Secure intelligence report for offensive security operatives.');
  const coverUrl = resolveImg(product?.coverUrl, productFallbackImg);

  return (
    <div className="group flex flex-col h-full overflow-hidden rounded-2xl border border-border/30 bg-bg-card transition-all duration-300 hover:border-accent/30">
      <div className="relative aspect-video overflow-hidden rounded-t-2xl shadow-sm">
        <img
          src={coverUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={(e) => { e.currentTarget.src = productFallbackImg; }}
        />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="px-2 py-0.5 bg-bg/85 backdrop-blur-sm rounded text-[9px] font-black uppercase text-accent tracking-widest shadow-sm flex items-center gap-1">
            <ShoppingBag className="w-2.5 h-2.5" /> Intelligence Asset
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-1.5 text-base font-black leading-snug text-text-primary group-hover:text-accent transition-colors line-clamp-1">
          {title}
        </h3>
        <p className="mb-4 text-xs leading-relaxed text-text-muted/70 font-mono line-clamp-2">
          {description}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product?.isFree ? (
              <span className="text-xs font-black text-accent uppercase tracking-widest">Free</span>
            ) : (
              <>
                <CpLogo className="w-4 h-4" />
                <span className="font-mono text-sm font-black text-text-primary">
                  {Number(product?.cpPrice || 0).toLocaleString()}
                </span>
              </>
            )}
          </div>
          <Link
            to="/dashboard/marketplace"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest hover:bg-accent/20 transition-colors"
          >
            View <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const pending = getPendingEventJoin();
  const [showReviewModal, setShowReviewModal] = useState(!!pending);
  const [, setReviewSubmitted] = useState(false);

  const [overview, setOverview] = useState<any>(null);
  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [cpBalanceState, setCpBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState('');
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [activeProductIdx, setActiveProductIdx] = useState(0);
  const [installing, setInstalling] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    setCanInstall(isInstallable());
    const interval = setInterval(() => setCanInstall(isInstallable()), 2000);
    return () => clearInterval(interval);
  }, []);

  const handleInstall = async () => {
    setInstalling(true);
    try {
      await showInstallPrompt();
      setCanInstall(isInstallable());
    } finally {
      setInstalling(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [ovRes, bcRes, prodRes] = await Promise.all([
          api.get('/student/overview').catch(() => null),
          api.get('/public/bootcamps').catch(() => null),
          api.get('/public/cp-products').catch(() => null),
        ]);
        if (!mounted) return;
        setOverview(ovRes?.data || null);
        setBootcamps(Array.isArray(bcRes?.data?.items) ? bcRes.data.items : []);
        setProducts(Array.isArray(prodRes?.data?.items) ? prodRes.data.items : []);
        setCpBalance(user?.cp ?? 0);
        setSyncError('');
      } catch {
        setSyncError('Could not sync. Showing cached data.');
        addToast('Failed to load dashboard data', 'error');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [user?.uid, user?.cp]);

  const moduleProgressById = getBootcampProgressMap(overview);
  const enrolledBootcamps: StudentBootcampCardData[] = bootcamps
    .map((item: any) => ({ item, prog: moduleProgressById.get(String(item.id || '')) }))
    .filter(({ prog }) => prog !== undefined)
    .slice(0, 4)
    .map(({ item, prog }) => ({
      id: String(item.id || ''),
      title: item.title || 'Bootcamp',
      description: String(item.description || '').trim(),
      level: String(item.level || '').trim(),
      duration: String(item.duration || '').trim(),
      priceLabel: String(item.priceLabel || '').trim(),
      progress: Number(prog?.progress || 0),
      img: BOOTCAMP_COVER_IMGS[String(item.id || '')] ?? BOOTCAMP_FALLBACK_IMG,
      isEnrolled: true,
      isLocked: false,
    }));

  const activeBootcamp = bootcamps.find((bc: any) => moduleProgressById.get(String(bc.id || '')) !== undefined);
  const continuePath = activeBootcamp ? resolveNextRoomPath(String(activeBootcamp.id || '')) || `/dashboard/bootcamps/${activeBootcamp.id}` : '/dashboard/bootcamps';
  const isEnrolled = (overview?.bootcampStatus || 'not_enrolled') !== 'not_enrolled';
  const cpBalance = pickCpBalance(user?.cp ?? 0, overview, cpBalanceState);
  const { rank: _r, next: nextRank, progress: rankProgress } = getRankInfo(cpBalance);
  const nextMission = (overview?.learningPath || []).find((m: any) => m.status === 'in-progress' || m.status === 'next');

  const overviewModules = Array.isArray(overview?.modules) ? overview.modules : [];
  const totalRoomsDone = overviewModules.reduce((sum: number, m: any) => sum + Number(m.roomsCompleted || 0), 0);
  const allDone = isEnrolled && !nextMission && totalRoomsDone > 0;
  const streakDays = overview?.xpSummary?.streakDays ?? null;
  const rankName = _r?.name || 'Candidate';

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="bg-bg">
      <SEO title="Dashboard" description="Your training overview and active deployments on QYVORA." />
      <OnboardingWizard />
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-10 pt-8 pb-20 lg:pb-24 space-y-8">

        {/* 1. Welcome Banner */}
        <DashboardHero
          isEnrolled={isEnrolled}
          allDone={allDone}
          nextMission={nextMission}
          continuePath={continuePath}
          currentPhaseTitle={overview?.progressMeta?.currentPhase?.title}
          username={user?.username}
        />

        {/* 2. Stats Strip */}
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard icon={<Trophy className="w-5 h-5 text-accent" />} label="Rank" value={rankName} accent />
            <StatCard icon={<Layers className="w-5 h-5 text-text-primary" />} label="Rooms Done" value={String(totalRoomsDone)} />
            <StatCard icon={<CpLogo className="w-5 h-5" />} label="CP Earned" value={cpBalance.toLocaleString()} accent />
            <StatCard icon={<Flame className="w-5 h-5 text-orange-400" />} label="Day Streak" value={`${streakDays ?? 0}d`} />
          </div>
        </div>

        {/* 2.5 PWA Install */}
        {canInstall && (
          <div className="flex items-center gap-4 p-4 rounded-xl border border-accent/20 bg-accent/5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-accent/10">
              <Download className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-text-primary">Install QYVORA</p>
              <p className="text-[10px] font-mono text-text-muted">Add to home screen for faster access and offline support.</p>
            </div>
            <button
              onClick={handleInstall}
              disabled={installing}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-bg text-[10px] font-black uppercase tracking-widest hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {installing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              {installing ? 'Installing…' : 'Install'}
            </button>
          </div>
        )}

        {/* 3. In-Progress Bootcamps + Featured Product */}
        {(enrolledBootcamps.length > 0 || products.length > 0) && (
          <div className="flex flex-col md:flex-row gap-4">
            {enrolledBootcamps.length > 0 && (
              <div className="flex-1 min-w-0">
                <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scroll-hover">
                  {enrolledBootcamps.map((bc, idx) => (
                    <div key={bc.id} className="snap-start shrink-0 w-[300px] sm:w-[340px]">
                      <StudentBootcampCard data={bc} index={idx} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {products.length > 0 && (
              <div className="w-full md:w-[340px] shrink-0">
                <DashboardProductCard product={products[activeProductIdx]} />
                {products.length > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    {products.map((_: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => setActiveProductIdx(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === activeProductIdx
                            ? 'bg-accent w-5'
                            : 'bg-border/50 w-1.5 hover:bg-accent/40'
                        }`}
                        aria-label={`Show product ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 4. Learning Paths */}
        <div>
          <LearningPathMap
            overview={overview}
            bootcampId={activeBootcamp ? String(activeBootcamp.id) : BOOTCAMP_CONFIG.id}
            isEnrolled={isEnrolled}
          />
        </div>

        {/* 5. Room Grid / Browse All */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BOOTCAMP_CONFIG.phases.flatMap(p => p.rooms.map(r => ({ ...r, _phaseId: p.id }))).slice(0, 6).map((room) => (
              <Link
                key={`${room._phaseId}-${room.id}`}
                to={`/dashboard/bootcamps/bc_1775270338500/phases/${room.id.split('-')[0]}/rooms/${room.id}`}
                className="group rounded-xl border border-border/30 bg-bg-card p-4 hover:border-accent/30 transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-accent/60" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Room</span>
                </div>
                <h3 className="text-sm font-black text-text-primary group-hover:text-accent transition-colors leading-snug break-words">{room.title}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* 6. Next Rank Progress */}
        {nextRank && (
          <div>
            <div className="rounded-xl border border-border/30 bg-bg-card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-text-muted">Target: <span className="text-accent">{nextRank.name}</span></span>
                <span className="font-mono text-sm font-black text-accent">{rankProgress}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-accent-dim/20 overflow-hidden">
                <div className="h-full rounded-full bg-accent transition-all duration-1000 shadow-[0_0_8px_var(--color-accent)]" style={{ width: `${rankProgress}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {pending && showReviewModal && (
        <EventReviewModal
          open={showReviewModal}
          onOpenChange={(open) => {
            setShowReviewModal(open);
            if (!open) clearPendingEventJoin();
          }}
          eventId={pending.eventId}
          onReviewSubmitted={() => {
            setReviewSubmitted(true);
            clearPendingEventJoin();
          }}
        />
      )}

      <SimulatedTerminal
        open={terminalOpen}
        onOpenChange={setTerminalOpen}
        context={{ type: 'dashboard' }}
        mode="modal"
      />
    </div>
  );
};

export default Dashboard;
