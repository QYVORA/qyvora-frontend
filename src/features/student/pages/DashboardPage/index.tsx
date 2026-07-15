import { useEffect, useRef, useState } from 'react';
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
import { getPendingEventJoin, clearPendingEventJoin } from '@/shared/utils/eventJoin';
import type { StudentBootcampCardData } from '@/features/student/components/StudentBootcampCard';
import { DashboardHero } from '@/features/student/components/dashboard';
import StudentBootcampCard from '@/features/student/components/StudentBootcampCard';
import LabCard from '@/features/student/pages/labs/LabsPage/LabCard';
import {
  Loader2,
  GraduationCap,
  FlaskConical,
  Briefcase,
  ShoppingBag,
} from 'lucide-react';
import {
  IconRank,
  IconFire,
  IconDashboard,
  IconCode,
  IconMarketplace,
  IconArrowRight,
  IconDownload,
  IconLabs,
  IconWallet,
} from '@/shared/components/icons';

const LABS = [
  { id: 'privesc', title: 'Privilege Escalation', description: 'Escalate permissions and gain root access', difficulty: 'beginner-advanced', cpReward: '50-400', route: '/dashboard/labs/privesc', accentColor: '#FBBF24' },
  { id: 'passwords', title: 'Password Cracking', description: 'Crack password hashes using brute-force', difficulty: 'beginner-advanced', cpReward: '100-300', route: '/dashboard/labs/passwords', accentColor: '#F59E0B' },
  { id: 'webapp', title: 'Web Exploitation', description: 'Exploit web application vulnerabilities', difficulty: 'beginner-advanced', cpReward: '100-400', route: '/dashboard/labs/web-exploitation', accentColor: '#EF4444' },
  { id: 'sqli', title: 'SQL Injection', description: 'Extract data through SQL injection attacks', difficulty: 'beginner-advanced', cpReward: '200-400', route: '/dashboard/labs/sql-injection', accentColor: '#06B66F' },
  { id: 'phishing', title: 'Phishing Analysis', description: 'Identify and analyze phishing campaigns', difficulty: 'beginner-advanced', cpReward: '150-400', route: '/dashboard/labs/phishing', accentColor: '#8B5CF6' },
  { id: 'proxy', title: 'Web Proxy', description: 'Intercept and manipulate HTTP traffic', difficulty: 'beginner-advanced', cpReward: '150-400', route: '/dashboard/labs/proxy', accentColor: '#10B981' },
  { id: 'traffic', title: 'Traffic Analysis', description: 'Analyze network traffic patterns', difficulty: 'beginner-advanced', cpReward: '150-400', route: '/dashboard/labs/traffic', accentColor: '#84CC16' },
  { id: 'osint', title: 'OSINT Recon', description: 'Gather intelligence using open source techniques', difficulty: 'beginner-advanced', cpReward: '150-400', route: '/dashboard/labs/osint', accentColor: '#0EA5E9' },
  { id: 'wireless', title: 'Wireless Security', description: 'Test wireless network security', difficulty: 'beginner-advanced', cpReward: '200-400', route: '/dashboard/labs/wireless', accentColor: '#F59E0B' },
  { id: 'killchain', title: 'Kill Chain', description: 'Execute a full penetration test', difficulty: 'intermediate-advanced', cpReward: '500-600', route: '/dashboard/labs/kill-chain', accentColor: '#DC2626' },
];
import CpLogo from '@/shared/components/CpLogo';
import { Link, useNavigate } from 'react-router-dom';
import { resolveImg } from '@/shared/utils/resolveImg';
import { COURSES, getCategoryById } from '@/features/student/data/courses/courseData';
import type { SkillLevel } from '@/features/student/data/courses/types';
import {
  Zap,
  TrendingUp,
  Sparkles,
  Terminal,
  Globe,
  Wifi,
  Wrench,
  Layers,
  BookOpen,
} from 'lucide-react';
import { isInstallable, showInstallPrompt } from '@/features/student/services/pwa';
import { useGsapReveal, useGsapHover } from '@/shared/hooks/useGsap';
import { gsap } from '@/shared/utils/gsapSetup';

import hpbCoverImg from '@/assets/bootcamp/hpb-cover.webp';
import productFallbackImg from '@/assets/sections/stats/cp-earned-bg.webp';

const BOOTCAMP_COVER_IMGS: Record<string, string> = { bc_1775270338500: hpbCoverImg };
const BOOTCAMP_FALLBACK_IMG = hpbCoverImg;

type SectionKey = 'courses' | 'bootcamps' | 'labs' | 'marketplace';

function pickCpBalance(userCp: number, overview: any, cpBalance: number | null): number {
  if (typeof cpBalance === 'number' && Number.isFinite(cpBalance)) return cpBalance;
  const fromOverview = extractCpBalance(overview?.xpSummary) ?? extractCpBalance(overview);
  if (typeof fromOverview === 'number' && Number.isFinite(fromOverview)) return fromOverview;
  return userCp;
}

const DashboardSkeleton = () => (
  <div className=" px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24 space-y-8">
    {/* 1. Hero Banner */}
    <div className="rounded-2xl border border-border/30 bg-bg-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
      <div className="space-y-2 w-full sm:w-auto">
        <Skeleton className="h-3 w-40 bg-border/30 rounded" />
        <Skeleton className="h-6 w-56 bg-border/30 rounded-lg" />
        <Skeleton className="h-3 w-36 bg-border/30 rounded" />
      </div>
      <Skeleton className="h-10 w-full sm:w-32 bg-border/30 rounded-xl" />
    </div>

    {/* 2. Stats Strip */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-3 p-5 md:p-6 rounded-2xl border border-border/30 bg-bg-card">
          <Skeleton className="w-16 h-16 bg-border/30 rounded-2xl shrink-0" />
          <div className="space-y-1.5 flex-1 text-center">
            <Skeleton className="h-5 w-20 bg-border/30 rounded mx-auto" />
            <Skeleton className="h-3 w-14 bg-border/30 rounded mx-auto" />
          </div>
        </div>
      ))}
    </div>

    {/* 3. Attack Labs Progress */}
    <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-14 h-14 bg-border/30 rounded-2xl shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-24 bg-border/30 rounded" />
          <Skeleton className="h-2.5 w-40 bg-border/30 rounded" />
        </div>
        <Skeleton className="w-4 h-4 bg-border/30 rounded ml-auto shrink-0" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-elevated/50 border border-border/20">
            <Skeleton className="w-3.5 h-3.5 bg-border/30 rounded shrink-0" />
            <Skeleton className="h-2.5 w-16 bg-border/30 rounded" />
          </div>
        ))}
      </div>
    </div>

    {/* 4. In-Progress Bootcamps + Featured Product */}
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="shrink-0 w-[300px] sm:w-[340px] rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
              <Skeleton className="aspect-video w-full bg-border/30" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4 bg-border/30 rounded" />
                <Skeleton className="h-3 w-full bg-border/30 rounded" />
                <Skeleton className="h-3 w-1/2 bg-border/30 rounded" />
                <div className="flex items-center gap-4 pt-2">
                  <Skeleton className="h-2.5 w-16 bg-border/30 rounded" />
                  <Skeleton className="h-2.5 w-20 bg-border/30 rounded" />
                </div>
                <Skeleton className="h-10 w-full bg-border/30 rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full md:w-[340px] shrink-0">
        <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
          <Skeleton className="aspect-video w-full bg-border/30" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-4 w-3/4 bg-border/30 rounded" />
            <Skeleton className="h-3 w-full bg-border/30 rounded" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-3 w-16 bg-border/30 rounded" />
              <Skeleton className="h-8 w-20 bg-border/30 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* 5. Learning Path */}
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4 md:px-0">
        <Skeleton className="h-3 w-24 bg-border/30 rounded" />
        <Skeleton className="h-2.5 w-14 bg-border/30 rounded" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 px-4 md:px-0">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col p-4 rounded-xl border border-border/20 bg-bg-card/30 min-h-[160px]">
            <div className="flex items-center gap-2.5 mb-1.5">
              <Skeleton className="w-8 h-8 bg-border/30 rounded-lg shrink-0" />
              <Skeleton className="h-2.5 w-14 bg-border/30 rounded" />
            </div>
            <Skeleton className="h-3 w-full bg-border/30 rounded mb-1.5" />
            <Skeleton className="h-2.5 w-3/4 bg-border/30 rounded" />
            <div className="mt-auto pt-1.5 space-y-1.5">
              <Skeleton className="h-2.5 w-20 bg-border/30 rounded" />
              <Skeleton className="h-1.5 w-full bg-border/30 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 6. Room Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-xl border border-border/30 bg-bg-card p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 bg-border/30 rounded shrink-0" />
            <Skeleton className="h-2.5 w-10 bg-border/30 rounded" />
          </div>
          <Skeleton className="h-3.5 w-3/4 bg-border/30 rounded" />
        </div>
      ))}
    </div>

    {/* 7. Rank Progress */}
    <div className="rounded-xl border border-border/30 bg-bg-card p-5">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-3 w-32 bg-border/30 rounded" />
        <Skeleton className="h-3.5 w-10 bg-border/30 rounded" />
      </div>
      <Skeleton className="h-2.5 w-full bg-border/30 rounded-full" />
    </div>
  </div>
);

const DashboardRoomCard = ({ room }: { room: any }) => {
  const hoverRef = useGsapHover<HTMLAnchorElement>({ scale: 1.02, y: -4 });
  return (
    <Link
      ref={hoverRef}
      to={`/dashboard/bootcamps/bc_1775270338500/phases/${room.id.split('-')[0]}/rooms/${room.id}`}
      className="group rounded-2xl border border-border/30 bg-bg-card p-6 md:p-8 min-h-[120px] hover:border-accent/30 transition-colors flex flex-col h-full"
    >
      <div className="flex items-center gap-2 mb-3">
        <IconCode size={22} className="text-accent/60" />
        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Room</span>
      </div>
      <h3 className="text-sm md:text-base font-black text-text-primary group-hover:text-accent transition-colors leading-snug break-words">{room.title}</h3>
    </Link>
  );
};

const SectionButton = ({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-3 p-6 md:p-7 lg:p-8 min-h-[140px] rounded-2xl border text-center transition-all duration-300 ${
      active
        ? 'border-accent bg-accent/10 shadow-lg shadow-accent/10'
        : 'border-border/30 bg-bg-card hover:border-accent/30 hover:bg-bg-card/80'
    }`}
  >
    <div className={`w-16 h-16 md:w-18 md:h-18 rounded-2xl flex items-center justify-center shrink-0 ${
      active ? 'bg-accent text-bg' : 'bg-bg-elevated text-text-primary'
    }`}>
      {icon}
    </div>
    <span className={`text-[10px] font-black uppercase tracking-widest mt-1.5 ${
      active ? 'text-accent' : 'text-text-muted'
    }`}>{label}</span>
  </button>
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
                        <span className="px-2 py-0.5 bg-bg/85 backdrop-blur-sm rounded-lg text-[10px] font-black uppercase text-accent tracking-widest shadow-sm flex items-center gap-1">
            <IconMarketplace size={10} /> Intelligence Asset
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
            View <IconArrowRight size={12} />
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
  const [products, setProducts] = useState<any[]>([]);
  const [activeProductIdx, setActiveProductIdx] = useState(0);
  const [installing, setInstalling] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);

  useEffect(() => {
    setCanInstall(isInstallable());
    const interval = setInterval(() => setCanInstall(isInstallable()), 2000);
    return () => clearInterval(interval);
  }, []);

  const handleInstall = async () => {
    setInstalling(true);
    try {
      await showInstallPrompt();
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

  const heroRef = useGsapReveal<HTMLDivElement>({ y: 40, duration: 0.8 });
  const statsRef = useGsapReveal<HTMLDivElement>({ y: 30, stagger: 0.1 });
  const labsRef = useGsapReveal<HTMLDivElement>({ y: 30 });
  const roomsRef = useGsapReveal<HTMLDivElement>({ y: 30, stagger: 0.08 });
  const rankRef = useGsapReveal<HTMLDivElement>({ y: 30 });
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;
    const fill = bar.querySelector<HTMLElement>('.progress-fill');
    if (!fill) return;
    const tween = gsap.fromTo(fill, { width: '0%' }, {
      width: `${rankProgress}%`,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: { trigger: bar, start: 'top 85%', once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [rankProgress]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="bg-bg">
      <SEO title="Dashboard" description="Your training overview and active deployments on QYVORA." />
      <OnboardingWizard />
      <div className=" px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24 space-y-10">

        {/* 1. Welcome Banner */}
        <div ref={heroRef}>
          <DashboardHero
            isEnrolled={isEnrolled}
            allDone={allDone}
            nextMission={nextMission}
            continuePath={continuePath}
            currentPhaseTitle={overview?.progressMeta?.currentPhase?.title}
            username={user?.username}
          />
        </div>

        {/* 2. Navigation Buttons */}
        <div ref={statsRef}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
            <SectionButton
              icon={<GraduationCap size={32} className={activeSection === 'courses' ? 'text-bg' : 'text-text-primary'} />}
              label="Courses"
              active={activeSection === 'courses'}
              onClick={() => setActiveSection(activeSection === 'courses' ? null : 'courses')}
            />
            <SectionButton
              icon={<Briefcase size={32} className={activeSection === 'bootcamps' ? 'text-bg' : 'text-text-primary'} />}
              label="Bootcamps"
              active={activeSection === 'bootcamps'}
              onClick={() => setActiveSection(activeSection === 'bootcamps' ? null : 'bootcamps')}
            />
            <SectionButton
              icon={<FlaskConical size={32} className={activeSection === 'labs' ? 'text-bg' : 'text-text-primary'} />}
              label="Labs"
              active={activeSection === 'labs'}
              onClick={() => setActiveSection(activeSection === 'labs' ? null : 'labs')}
            />
            <SectionButton
              icon={<ShoppingBag size={32} className={activeSection === 'marketplace' ? 'text-bg' : 'text-text-primary'} />}
              label="Marketplace"
              active={activeSection === 'marketplace'}
              onClick={() => setActiveSection(activeSection === 'marketplace' ? null : 'marketplace')}
            />
          </div>
        </div>

        {/* 2.5 PWA Install */}
        {canInstall && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 md:p-6 rounded-2xl border border-accent/20 bg-accent/5">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-accent/10">
                <IconDownload size={28} className="text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-sm md:text-base font-black text-text-primary">Install QYVORA</p>
                <p className="text-[10px] md:text-xs font-mono text-text-muted">Add to home screen for faster access and offline support.</p>
              </div>
            </div>
            <button
              onClick={handleInstall}
              disabled={installing}
              className="sm:ml-auto flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-accent text-bg text-[10px] font-black uppercase tracking-widest hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {installing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <IconDownload size={14} />}
              {installing ? 'Installing…' : 'Install'}
            </button>
          </div>
        )}

        {/* 3. Section Content */}
        {activeSection === 'courses' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Courses</h3>
              <Link to="/courses" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">
                View All <IconArrowRight size={12} className="inline-block ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {COURSES.slice(0, 6).map((course) => {
                const category = getCategoryById(course.categoryId);
                const SKILL_CONFIG: Record<SkillLevel, { label: string; color: string; icon: React.ElementType }> = {
                  beginner: { label: 'Beginner', color: 'text-accent border-accent/30 bg-accent/10', icon: Sparkles },
                  intermediate: { label: 'Intermediate', color: 'text-blue-400 border-blue-400/30 bg-blue-400/10', icon: TrendingUp },
                  advanced: { label: 'Advanced', color: 'text-red-400 border-red-400/30 bg-red-400/10', icon: GraduationCap },
                };
                const skillCfg = SKILL_CONFIG[course.skillLevel];
                const SkillIcon = skillCfg.icon;
                return (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="group block overflow-hidden rounded-2xl border border-border/30 bg-bg-card transition-all hover:border-accent/30"
                  >
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/20">
                          {category?.name}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-text-muted font-mono">
                          {course.estimatedMinutes}min
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-text-primary group-hover:text-accent transition-colors leading-tight break-words">
                        {course.title}
                      </h3>
                      <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2 break-words">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${skillCfg.color}`}>
                            <SkillIcon className="h-2.5 w-2.5" /> {skillCfg.label}
                          </span>
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/10 text-[10px] font-black text-accent">
                            <Zap className="h-3 w-3" /> {course.cpCost} CP
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                          View <IconArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {activeSection === 'bootcamps' && (
          <div>
            {enrolledBootcamps.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scroll-hover">
                {enrolledBootcamps.map((bc, idx) => (
                  <div key={bc.id} className="snap-start shrink-0 w-[300px] sm:w-[340px]">
                    <StudentBootcampCard data={bc} index={idx} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-2xl border border-border/30 bg-bg-card">
                <Briefcase className="w-12 h-12 text-text-muted/20 mx-auto mb-3" />
                <p className="text-sm text-text-muted">No bootcamps enrolled yet.</p>
                <Link to="/dashboard/bootcamps" className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-black uppercase tracking-widest text-accent hover:underline">
                  Browse Bootcamps <IconArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>
        )}

        {activeSection === 'labs' && (
          <div ref={labsRef}>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 -mx-1 px-1">
              {LABS.map((lab) => (
                <div key={lab.id} className="min-w-[calc((100%-32px)/3)] snap-start flex-shrink-0">
                  <LabCard {...lab} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'marketplace' && (
          <div>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product, idx) => (
                  <DashboardProductCard key={product?.id || idx} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-2xl border border-border/30 bg-bg-card">
                <ShoppingBag className="w-12 h-12 text-text-muted/20 mx-auto mb-3" />
                <p className="text-sm text-text-muted">No marketplace items available.</p>
                <Link to="/dashboard/marketplace" className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-black uppercase tracking-widest text-accent hover:underline">
                  Browse Marketplace <IconArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 4. Room Grid */}
        <div ref={roomsRef}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {BOOTCAMP_CONFIG.phases.flatMap(p => p.rooms.map(r => ({ ...r, _phaseId: p.id }))).slice(0, 6).map((room) => (
              <DashboardRoomCard key={`${room._phaseId}-${room.id}`} room={room} />
            ))}
          </div>
        </div>

        {/* 5. Next Rank Progress */}
        {nextRank && (
          <div ref={rankRef}>
            <div ref={progressRef} className="rounded-2xl border border-accent/20 bg-bg-card p-6 md:p-8 lg:p-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-widest text-text-muted">Target: <span className="text-accent">{nextRank.name}</span></span>
                <span className="font-mono text-sm font-black text-accent">{rankProgress}%</span>
              </div>
              <div className="h-3 rounded-full bg-accent-dim/20 overflow-hidden">
                <div className="progress-fill h-full rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" style={{ width: 0 }} />
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

    </div>
  );
};

export default Dashboard;
