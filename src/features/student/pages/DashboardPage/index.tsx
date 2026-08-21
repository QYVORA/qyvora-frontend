import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import api from '@/core/services/api';
import { getRankInfo } from '@/features/student/utils/rankUtils';
import { extractCpBalance } from '@/shared/utils/cpBalance';
import {
  getBootcampProgressMap,
  resolveNextRoomPath,
} from '@/features/student/utils/studentExperience';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import useEngagement from '@/features/student/hooks/useEngagement';
import { Skeleton, ErrorState, FadeIn } from '@/shared/components/ui';
import SEO from '@/shared/components/SEO';
import StudentTour from '@/features/student/components/StudentTour';
import StudentOnboardingModal from '@/features/student/components/StudentOnboardingModal';
import type { StudentBootcampCardData } from '@/features/student/components/StudentBootcampCard';
import { DashboardHero } from '@/features/student/components/dashboard';
import DailyMissionCard from '@/features/student/components/dashboard/DailyMissionCard';
import WeeklyOperationCard from '@/features/student/components/dashboard/WeeklyOperationCard';
import CpEarnHint from '@/features/student/components/dashboard/CpEarnHint';
import WeekActivity from '@/features/student/components/dashboard/WeekActivity';
import ActiveDeployments from '@/features/student/components/dashboard/ActiveDeployments';
import { StatCard } from '@/shared/components/dashboard';
import StudentBootcampCard from '@/features/student/components/StudentBootcampCard';
import LabCard from '@/features/student/pages/labs/LabsPage/LabCard';
import SkillMatrix from '@/features/student/components/dashboard/SkillMatrix';
import {
  Loader2,
  GraduationCap,
  FlaskConical,
  Briefcase,
  ShoppingBag,
  Globe,
  Wifi,
  Wrench,
} from 'lucide-react';
import {
  IconTerminal, IconNetwork, IconCode, IconRank, IconFire, IconDashboard,
  IconMarketplace, IconArrowRight, IconDownload,
} from '@/shared/components/icons';

const LABS = [
  { id: 'privesc', titleKey: 'student.labs.list.privesc.title', route: '/dashboard/labs/privesc', accentColor: '#FBBF24', difficulty: 'beginner-advanced', cpReward: '50-400' },
  { id: 'passwords', titleKey: 'student.labs.list.passwords.title', route: '/dashboard/labs/passwords', accentColor: '#F59E0B', difficulty: 'beginner-advanced', cpReward: '100-300' },
  { id: 'sqli', titleKey: 'student.labs.list.sqli.title', route: '/dashboard/labs/sql-injection', accentColor: '#06B66F', difficulty: 'beginner-advanced', cpReward: '200-400' },
  { id: 'osint', titleKey: 'student.labs.list.osint.title', route: '/dashboard/labs/osint', accentColor: '#0EA5E9', difficulty: 'beginner-advanced', cpReward: '150-400' },
  { id: 'killchain', titleKey: 'student.labs.list.killchain.title', route: '/dashboard/labs/kill-chain', accentColor: '#DC2626', difficulty: 'intermediate-advanced', cpReward: '500-600' },
];
import CpLogo from '@/shared/components/CpLogo';
import { Link, useNavigate } from 'react-router-dom';
import { AuthImage } from '@/shared/components/ui';
import { COURSES, getCategoryById } from '@/features/student/data/courses';
import type { SkillLevel } from '@/features/student/data/courses';
import {
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { isInstallable, showInstallPrompt } from '@/features/student/services/pwa';
import { useGsapReveal, useGsapHover } from '@/shared/hooks/useGsap';


import hpbCoverImg from '@/assets/bootcamp/hpb-cover.webp';

const BOOTCAMP_COVER_IMGS: Record<string, string> = { bc_1775270338500: hpbCoverImg };
const BOOTCAMP_FALLBACK_IMG = hpbCoverImg;

type SectionKey = 'courses' | 'bootcamps' | 'labs' | 'marketplace' | 'tools';

const TOOLS = [
  { id: 'ide', labelKey: 'student.tools.ide', descKey: 'student.tools.ideDesc', route: '/dashboard/tools/ide', icon: IconCode },
  { id: 'terminal', labelKey: 'student.tools.terminal', descKey: 'student.tools.terminalDesc', route: '/dashboard/tools/terminal', icon: IconTerminal },
  { id: 'network-visualizer', labelKey: 'student.tools.networkVisualizer', descKey: 'student.tools.networkVisualizerDesc', route: '/dashboard/tools/network-visualizer', icon: IconNetwork },
];

function pickCpBalance(userCp: number, overview: any, cpBalance: number | null): number {
  if (typeof cpBalance === 'number' && Number.isFinite(cpBalance)) return cpBalance;
  const fromOverview = extractCpBalance(overview?.xpSummary) ?? extractCpBalance(overview);
  if (typeof fromOverview === 'number' && Number.isFinite(fromOverview)) return fromOverview;
  return userCp;
}

const DashboardSkeleton = () => (
  <div>
    {/* 1. Hero Banner — matches DashboardHero card layout */}
    <div className="bg-bg px-3 md:px-4 lg:px-6 pt-8 pb-10">
      <div className="relative card-accent bg-bg-card p-6 sm:p-10 lg:p-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_39px,rgba(255,255,255,0.05)_39px,rgba(255,255,255,0.05)_40px)] bg-[length:40px_40px]" />
        </div>
        <div className="relative z-10 w-full sm:w-auto space-y-2">
          <Skeleton className="h-3 w-40 bg-border/30 rounded" />
          <Skeleton className="h-8 lg:h-10 w-56 bg-border/30 rounded-lg" />
          <Skeleton className="h-3 w-36 bg-border/20 rounded" />
        </div>
        <Skeleton className="relative z-10 h-10 w-full sm:w-32 bg-border/30 rounded-xl shrink-0" />
      </div>
    </div>

    {/* 2. Section Navigation Buttons — 5-column grid of SectionButtons */}
    <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-3 p-3 md:p-5 lg:p-6 min-h-[100px] md:min-h-[120px] card-accent bg-bg-card">
            <Skeleton className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl md:rounded-2xl bg-border/30 shrink-0" />
            <Skeleton className="h-2.5 w-16 bg-border/30 rounded" />
          </div>
        ))}
      </div>
    </div>

    {/* 3. Achievement Stats — left overview + 2x2 stat cards */}
    <div className="bg-bg px-3 md:px-4 lg:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        <div className="flex flex-col justify-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-40 bg-border/30 rounded" />
            <Skeleton className="h-4 w-64 bg-border/20 rounded" />
          </div>
          <Skeleton className="h-10 w-44 bg-border/30 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3 p-4 md:p-5 lg:p-6 card-accent bg-bg-card">
              <Skeleton className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl md:rounded-2xl bg-bg-elevated shrink-0" />
              <Skeleton className="h-2.5 w-14 bg-border/30 rounded" />
              <Skeleton className="h-4 w-12 bg-border/30 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* 4. Skill Matrix — 2-column grid (radar chart + skill stats) */}
    <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:h-[460px]">
        <div className="card-accent bg-bg-card p-4 md:p-6 flex flex-col items-center justify-center min-h-[360px] lg:min-h-0">
          <Skeleton className="w-64 h-64 md:w-72 md:h-72 bg-border/20 rounded-full" />
        </div>
        <div className="card-accent bg-bg-card p-4 md:p-6 flex flex-col justify-between gap-2.5 min-h-[360px] lg:min-h-0">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-2.5 w-20 bg-border/30 rounded" />
              <Skeleton className="h-1.5 flex-1 bg-border/20 rounded-full" />
              <Skeleton className="h-2.5 w-10 bg-border/30 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* 5. Section Content — section header + course card grid */}
    <div className="bg-bg px-3 md:px-4 lg:px-6 py-10">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-32 bg-border/30 rounded" />
          <Skeleton className="h-3 w-16 bg-border/30 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="aspect-square card-accent bg-bg-card flex flex-col p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <Skeleton className="w-8 h-8 rounded-xl bg-border/30 shrink-0" />
                <Skeleton className="h-5 w-16 bg-border/30 rounded-lg" />
              </div>
              <Skeleton className="h-5 w-3/4 bg-border/30 rounded" />
              <Skeleton className="h-3 w-full bg-border/20 rounded mt-2" />
              <Skeleton className="h-8 w-20 bg-border/30 rounded-lg mt-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* 6. Rank Progress */}
    <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10 pb-20 lg:pb-24">
      <div className="rounded-2xl border border-accent/20 bg-bg-card p-6 md:p-8 lg:p-10 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-32 bg-border/30 rounded" />
          <Skeleton className="h-4 w-10 bg-border/30 rounded" />
        </div>
        <Skeleton className="h-3 w-full bg-border/30 rounded-full" />
      </div>
    </div>
  </div>
);

const DashboardRoomCard = ({ room }: { room: any }) => {
  const { t } = useTranslation();
  const hoverRef = useGsapHover<HTMLAnchorElement>({ scale: 1.02, y: -4 });
  return (
    <Link
      ref={hoverRef}
      to={`/dashboard/bootcamps/bc_1775270338500/phases/${room.id.split('-')[0]}/rooms/${room.id}`}
      className="group/card relative aspect-square card-accent bg-bg-card p-3 md:p-5 transition-all duration-300 flex flex-col text-left"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20">
          <IconCode size={16} className="text-accent" />
        </div>
        <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent border border-accent/20">
          {t('stat.room')}
        </span>
      </div>

      <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-text-primary group-hover/card:text-accent transition-colors leading-snug break-words mb-1">{room.title}</h3>

      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text-muted">
          Active
        </span>
        <span className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-accent text-on-accent transition-all duration-200 group-hover/card:brightness-110 group-active:scale-95">
          <IconArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
};

const SectionButton = ({ icon, label, active, onClick, ...rest }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    onClick={onClick}
    {...rest}
    className={`flex flex-col items-center gap-2 p-3 md:p-5 lg:p-6 min-h-[100px] md:min-h-[120px] rounded-2xl border text-center transition-all duration-300 ${
      active
        ? 'border-accent bg-accent/10 shadow-lg shadow-accent/10'
        : 'border-border/30 bg-bg-card hover:bg-bg-card/80'
    }`}
  >
    <div className={`w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${
      active ? 'bg-accent text-on-accent' : 'bg-bg-elevated text-text-primary'
    }`}>
      {icon}
    </div>
    <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${
      active ? 'text-accent' : 'text-text-muted'
    }`}>{label}</span>
  </button>
);

const DashboardProductCard = ({ product }: { product: any }) => {
  const { t } = useTranslation();
  const id = String(product?.id || '');
  const title = String(product?.title || t('student.dashboard.intelligenceAsset'));
  const description = String(product?.description || t('student.dashboard.intelligenceDesc'));
  return (
    <div className="group flex flex-col overflow-hidden card-accent bg-bg-card transition-all duration-300">
      <div className="relative aspect-[16/9] overflow-hidden bg-accent/5">
        <AuthImage
          src={product?.coverUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-lg bg-accent/10 text-[9px] font-black uppercase text-accent tracking-widest border border-accent/20 flex items-center gap-1">
            <IconMarketplace size={9} /> {t('student.dashboard.intelligenceAsset')}
          </span>
        </div>
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-text-primary group-hover:text-accent transition-colors leading-snug break-words line-clamp-2">
          {title}
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-text-muted leading-relaxed line-clamp-3 flex-1">
          {description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-1.5">
            {product?.isFree ? (
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-accent">Free</span>
            ) : (
              <>
                <CpLogo className="w-3.5 h-3.5" />
                <span className="font-mono text-xs font-black text-text-primary">
                  {Number(product?.cpPrice || 0).toLocaleString()}
                </span>
              </>
            )}
          </div>
          <Link
            to="/dashboard/marketplace"
            className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest bg-accent text-on-accent transition-all duration-200 group-hover:brightness-110 group-active:scale-95"
          >
            {t('student.dashboard.view')}
          </Link>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { data: overview, loading: overviewLoading } = useStudentOverview();
  const { data: engagement, loading: engagementLoading } = useEngagement();

  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [cpBalanceState, setCpBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [activeProductIdx, setActiveProductIdx] = useState(0);
  const [installing, setInstalling] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);
  const sectionContentRef = useRef<HTMLDivElement>(null);

  const handleSectionToggle = (section: SectionKey) => {
    const next = activeSection === section ? null : section;
    setActiveSection(next);
    if (next) {
      requestAnimationFrame(() => {
        sectionContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

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
        const [bcRes, prodRes] = await Promise.all([
          api.get('/public/bootcamps').catch((err) => { console.warn('[Dashboard] bootcamps failed:', err?.response?.status || err?.message); return null; }),
          api.get('/public/cp-products').catch((err) => { console.warn('[Dashboard] products failed:', err?.response?.status || err?.message); return null; }),
        ]);
        if (!mounted) return;
        setBootcamps(Array.isArray(bcRes?.data?.items) ? bcRes.data.items : []);
        setProducts(Array.isArray(prodRes?.data?.items) ? prodRes.data.items : []);
        setCpBalance(user?.cp ?? 0);
        setSyncError('');
      } catch {
        setSyncError(t('empty.syncError'));
        addToast(t('toast.loadFailed'), 'error');
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
      title: item.title || t('student.courses.bootcamp'),
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
  const visitDates = overview?.xpSummary?.visitDates ?? [];
  const visitDurations = overview?.xpSummary?.visitDurations ?? {};
  const rankName = _r?.name || t('stat.candidate');

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
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        fill.style.width = `${rankProgress}%`;
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(bar);
    return () => observer.disconnect();
  }, [rankProgress]);

  if (loading) return <DashboardSkeleton />;

  return (
    <FadeIn>
    <div>
      <SEO title={t('student.dashboard.seoTitle')} description={t('student.dashboard.seoDesc')} noindex />
      <StudentOnboardingModal />
      <StudentTour cpBalance={cpBalance} username={user?.username ?? ''} />

      {syncError && (
        <div className="bg-bg px-3 md:px-4 lg:px-6 pt-8">
          <ErrorState message={syncError} title="Sync Failed" />
        </div>
      )}

      {/* 1. Welcome Banner + Daily Mission */}
      <div className="bg-bg px-3 md:px-4 lg:px-6 pt-8 pb-10">
        <div ref={heroRef} data-tour-id="tour-hero">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 lg:gap-6 items-stretch">
            <DashboardHero
              isEnrolled={isEnrolled}
              allDone={allDone}
              nextMission={nextMission}
              continuePath={continuePath}
              currentPhaseTitle={overview?.progressMeta?.currentPhase?.title}
              username={user?.username}
            />
            {engagement && (
              <DailyMissionCard engagement={engagement} loading={engagementLoading} />
            )}
          </div>
        </div>
      </div>

      {/* 2. Navigation Buttons */}
      <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10">
        <div ref={statsRef}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
            <SectionButton
              icon={<GraduationCap className={`w-5 h-5 md:w-7 md:h-7 ${activeSection === 'courses' ? 'text-on-accent' : 'text-text-primary'}`} />}
              label={t('nav.courses')}
              active={activeSection === 'courses'}
              onClick={() => handleSectionToggle('courses')}
            />
            <SectionButton
              icon={<Briefcase className={`w-5 h-5 md:w-7 md:h-7 ${activeSection === 'bootcamps' ? 'text-on-accent' : 'text-text-primary'}`} />}
              label={t('nav.bootcamps')}
              active={activeSection === 'bootcamps'}
              onClick={() => handleSectionToggle('bootcamps')}
              data-tour-id="tour-learning"
            />
            <SectionButton
              icon={<FlaskConical className={`w-5 h-5 md:w-7 md:h-7 ${activeSection === 'labs' ? 'text-on-accent' : 'text-text-primary'}`} />}
              label={t('nav.labs')}
              active={activeSection === 'labs'}
              onClick={() => handleSectionToggle('labs')}
            />
            <SectionButton
              icon={<ShoppingBag className={`w-5 h-5 md:w-7 md:h-7 ${activeSection === 'marketplace' ? 'text-on-accent' : 'text-text-primary'}`} />}
              label={t('nav.marketplace')}
              active={activeSection === 'marketplace'}
              onClick={() => handleSectionToggle('marketplace')}
            />
            <SectionButton
              icon={<Wrench className={`w-5 h-5 md:w-7 md:h-7 ${activeSection === 'tools' ? 'text-on-accent' : 'text-text-primary'}`} />}
              label={t('student.tools.title')}
              active={activeSection === 'tools'}
              onClick={() => handleSectionToggle('tools')}
            />
          </div>
        </div>

        {/* 2.5 PWA Install */}
        {canInstall && (
          <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 p-5 md:p-6 rounded-2xl border border-accent/20 bg-accent/5">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-accent/10">
                <IconDownload size={28} className="text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-sm md:text-base font-black text-text-primary">{t('student.installBanner.title')}</p>
                <p className="text-[10px] md:text-xs font-mono text-text-muted">{t('student.installBanner.description')}</p>
              </div>
            </div>
            <button
              onClick={handleInstall}
              disabled={installing}
              className="sm:ml-auto flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-accent text-on-accent text-[10px] font-black uppercase tracking-widest hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {installing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <IconDownload size={14} />}
              {installing ? t('button.installing') : t('button.install')}
            </button>
          </div>
        )}
      </div>

      {/* 3. Stats + Activity */}
      <div className="bg-bg px-3 md:px-4 lg:px-6 py-10">
        <div ref={roomsRef}>
          {/* Stats Row — 4 equal columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            <StatCard
              icon={<IconRank size={20} className="text-accent" />}
              label={t('student.dashboard.rank')}
              value={rankName}
            />
            <StatCard
              icon={<CpLogo className="w-5 h-5" />}
              label={t('student.dashboard.cp')}
              value={cpBalance.toLocaleString()}
              data-tour-id="tour-cp-dashboard"
            />
            <StatCard
              icon={<IconFire size={20} className="text-orange-400" />}
              label={t('student.dashboard.streak.title')}
              value={`${streakDays ?? 0}d`}
            />
            <StatCard
              icon={<IconCode size={20} className="text-accent" />}
              label={t('student.dashboard.roomsDone')}
              value={totalRoomsDone}
            />
          </div>

          {/* CP Earn Hint — contextual suggestion near CP stats */}
          <div className="mb-6">
            <CpEarnHint engagement={engagement} loading={engagementLoading} />
          </div>

          {/* Activity Row — Week Activity + Active Deployments as 2-col grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-stretch">
            {visitDates.length > 0 && (
              <div className="card-accent bg-bg-card p-6 md:p-8 flex flex-col h-full">
                <div className="text-xs font-black uppercase tracking-widest text-text-muted mb-4">
                  {t('student.dashboard.streak.title')}
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  <WeekActivity visitDates={visitDates} visitDurations={visitDurations} />
                </div>
              </div>
            )}
            <ActiveDeployments bootcamps={enrolledBootcamps} />
          </div>
        </div>
      </div>

      {/* 3b. Weekly Operation — full width */}
      {engagement && (
      <div className="bg-bg px-3 md:px-4 lg:px-6 pb-10">
        <WeeklyOperationCard engagement={engagement} loading={engagementLoading} />
      </div>
      )}

      {/* 3c. Skill Matrix — always visible */}
      <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10">
        <SkillMatrix
          modules={overviewModules}
        />
      </div>

      {/* 4. Section Content — appears below stats when a button is toggled */}
      {activeSection !== null && (
      <div className="bg-bg px-3 md:px-4 lg:px-6 py-10">
        <div ref={sectionContentRef}>
        {activeSection === 'courses' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">{t('student.dashboard.courses')}</h3>
              <Link to="/dashboard/courses" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">
                {t('student.dashboard.viewAll')} <IconArrowRight size={12} className="inline-block ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {COURSES.slice(0, 6).map((course) => {
                const DASH_CATEGORY_ICONS: Record<string, React.ElementType> = {
                  terminal: IconTerminal,
                  networking: IconNetwork,
                  programming: IconCode,
                  'web-security': Globe,
                  wireless: Wifi,
                  tools: Wrench,
                };
                const CatIc = DASH_CATEGORY_ICONS[course.categoryId];
                const category = getCategoryById(course.categoryId);
                const SKILL_CONFIG: Record<SkillLevel, { label: string; color: string; icon: React.ElementType }> = {
                  beginner: { label: t('student.courses.levels.beginner'), color: 'text-accent border-accent/30 bg-accent/10', icon: Sparkles },
                  intermediate: { label: t('student.courses.levels.intermediate'), color: 'text-blue-400 border-blue-400/30 bg-blue-400/10', icon: TrendingUp },
                  advanced: { label: t('student.courses.levels.advanced'), color: 'text-red-400 border-red-400/30 bg-red-400/10', icon: GraduationCap },
                };
                const skillCfg = SKILL_CONFIG[course.skillLevel];
                const SkillIcon = skillCfg.icon;
                return (
                  <Link
                    key={course.id}
                    to={`/dashboard/courses/${course.id}`}
                    className="group/card relative aspect-square card-accent bg-bg-card p-3 md:p-5 transition-all duration-300 flex flex-col text-left"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20">
                        {CatIc && <CatIc className="w-4 h-4 text-accent" />}
                      </div>
                      <span className="px-2 py-0.5 rounded-lg bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/20">
                        {category?.name}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-text-primary group-hover/card:text-accent transition-colors leading-snug break-words mb-1">
                      {course.title}
                    </h3>

                    <p className="text-xs sm:text-sm md:text-base text-text-muted leading-relaxed line-clamp-3 break-words flex-1 mb-2">
                      {course.description}
                    </p>

      <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${skillCfg.color}`}>
                          <SkillIcon className="h-2.5 w-2.5" /> {skillCfg.label}
                        </span>
                      </div>
                      <span className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest bg-accent text-on-accent transition-all duration-200 group-hover/card:brightness-110 group-active:scale-95">
                        {t('student.dashboard.view')}
                      </span>
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
              <ActiveDeployments bootcamps={enrolledBootcamps} />
            ) : (
              <div className="text-center py-12 card-accent bg-bg-card">
                <Briefcase className="w-12 h-12 text-text-muted/20 mx-auto mb-3" />
                <p className="text-sm text-text-muted">{t('student.myCourses.empty.enrolled')}</p>
                <Link to="/dashboard/bootcamps" className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-black uppercase tracking-widest text-accent hover:underline">
                  {t('button.browseBootcamps')} <IconArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>
        )}

        {activeSection === 'labs' && (
          <div ref={labsRef}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {LABS.map((lab) => (
                <div key={lab.id} className="aspect-square">
                  <LabCard id={lab.id} title={t(lab.titleKey)} description={t(lab.titleKey)} difficulty={lab.difficulty} cpReward={lab.cpReward} route={lab.route} accentColor={lab.accentColor} />
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
              <div className="text-center py-12 card-accent bg-bg-card">
                <ShoppingBag className="w-12 h-12 text-text-muted/20 mx-auto mb-3" />
                <p className="text-sm text-text-muted">{t('student.marketplace.empty')}</p>
                <Link to="/dashboard/marketplace" className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-black uppercase tracking-widest text-accent hover:underline">
                  {t('student.marketplace.title')} <IconArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>
        )}

        {activeSection === 'tools' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">{t('student.tools.title')}</h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-accent">{t('student.tools.title')}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {TOOLS.map((tool) => {
                const ToolIcon = tool.icon;
                return (
                  <Link
                    key={tool.id}
                    to={tool.route}
                    className="group/card relative aspect-square card-accent bg-bg-card p-3 md:p-5 transition-all duration-300 flex flex-col text-left"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20">
                        <ToolIcon className="w-4 h-4 text-accent" />
                      </div>
                      <span className="px-2 py-0.5 rounded-lg bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/20">
                        {t('student.tools.title')}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-text-primary group-hover/card:text-accent transition-colors leading-snug break-words mb-1">
                      {t(tool.labelKey)}
                    </h3>

                    <p className="text-xs sm:text-sm md:text-base text-text-muted leading-relaxed line-clamp-3 break-words flex-1 mb-2">
                      {t(tool.descKey)}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest bg-accent text-on-accent transition-all duration-200 group-hover/card:brightness-110 group-active:scale-95">
                        {t('student.dashboard.view')}
                      </span>
                      <IconArrowRight size={12} className="text-text-muted" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
        </div>
      </div>
      )}

      {/* 5. Next Rank Progress */}
      {nextRank && (
      <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10 pb-20 lg:pb-24">
          <div ref={rankRef}>
            <div ref={progressRef} className="rounded-2xl border border-accent/20 bg-bg-card p-6 md:p-8 lg:p-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-widest text-text-muted">{t('heading.target')}: <span className="text-accent">{nextRank.name}</span></span>
                <span className="font-mono text-sm font-black text-accent">{rankProgress}%</span>
              </div>
              <div className="h-3 rounded-full bg-accent-dim/20 overflow-hidden">
                <div className="progress-fill h-full rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" style={{ width: '0%', transition: 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)' }} />
              </div>
            </div>
          </div>
      </div>
      )}
    </div>
    </FadeIn>
  );
};

export default Dashboard;
