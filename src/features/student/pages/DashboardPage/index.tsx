import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import api from '@/core/services/api';
import { extractCpBalance } from '@/shared/utils/cpBalance';
import {
  getBootcampProgressMap,
  resolveNextRoomPath,
} from '@/features/student/utils/studentExperience';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import useEngagement from '@/features/student/hooks/useEngagement';
import { ErrorState, FadeIn, EmptyState } from '@/shared/components/ui';
import { DashboardSkeleton } from '@/features/student/components/StudentSkeletons';
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
import SkillMatrix from '@/features/student/components/dashboard/SkillMatrix';
import ProgressionPanel from '@/features/student/components/dashboard/ProgressionPanel';
import { Card, Metric } from '@/shared/components/ui/Card';
import ScrollReveal from '@/shared/components/ScrollReveal';
import Button from '@/shared/components/ui/Button';
import {
  BookOpen,
  FlaskConical,
  ShoppingBag,
  Flame,
  Crown,
  Download,
} from 'lucide-react';
import { IconCode, IconTerminal, IconNetwork } from '@/shared/components/icons';
import LearningCard from '@/shared/components/learning/LearningCard';
import { LABS } from '@/features/student/constants/labs';
import CpLogo from '@/shared/components/CpLogo';
import { COURSES } from '@/features/student/data/courses';
import { isInstallable, showInstallPrompt } from '@/features/student/services/pwa';
import type { LabDef } from '@/features/student/constants/labs';

import hpbCoverImg from '@/assets/bootcamp/hpb-cover.webp';

const BOOTCAMP_COVER_IMGS: Record<string, string> = { bc_1775270338500: hpbCoverImg };
const BOOTCAMP_FALLBACK_IMG = hpbCoverImg;

const TOOLS = [
  { id: 'ide', labelKey: 'student.tools.ide', descKey: 'student.tools.ideDesc', route: '/dashboard/tools/ide', icon: IconCode },
  { id: 'terminal', labelKey: 'student.tools.terminal', descKey: 'student.tools.terminalDesc', route: '/dashboard/tools/terminal', icon: IconTerminal },
  { id: 'network-visualizer', labelKey: 'student.tools.networkVisualizer', descKey: 'student.tools.networkVisualizerDesc', route: '/dashboard/tools/network-visualizer', icon: IconNetwork },
];

function pickCpBalance(userCp: number, overview: any, cpBalance: number | null): number {
  const fromOverview = extractCpBalance(overview?.xpSummary) ?? extractCpBalance(overview);
  if (typeof fromOverview === 'number' && Number.isFinite(fromOverview)) return fromOverview;
  if (typeof cpBalance === 'number' && Number.isFinite(cpBalance) && cpBalance > 0) return cpBalance;
  return userCp;
}

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { data: overview, loading: overviewLoading } = useStudentOverview();
  const { data: engagement, loading: engagementLoading } = useEngagement();

  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [cpBalanceState, setCpBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState('');
  const [products, setProducts] = useState<any[]>([]);
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
  const progression = overview?.xpSummary?.progression ?? null;
  const effectiveRankName = progression?.rank || t('stat.candidate');
  const nextMission = (overview?.learningPath || []).find((m: any) => m.status === 'in-progress' || m.status === 'next');

  const overviewModules = Array.isArray(overview?.modules) ? overview.modules : [];
  const totalRoomsDone = overviewModules.reduce((sum: number, m: any) => sum + Number(m.roomsCompleted || 0), 0);
  const allDone = isEnrolled && !nextMission && totalRoomsDone > 0;
  const streakDays = overview?.xpSummary?.streakDays ?? null;
  const visitDates = overview?.xpSummary?.visitDates ?? [];
  const visitDurations = overview?.xpSummary?.visitDurations ?? {};
  const rankName = effectiveRankName;

  if (loading) return <DashboardSkeleton />;

  return (
    <FadeIn>
    <div>
      <SEO title={t('student.dashboard.seoTitle')} description={t('student.dashboard.seoDesc')} noindex />
      <StudentOnboardingModal />
      <StudentTour cpBalance={cpBalance} username={user?.username ?? ''} />

      {syncError && (
        <div className="bg-canvas px-3 pt-8 md:px-4 lg:px-6">
          <ErrorState message={syncError} title="Sync Failed" />
        </div>
      )}

      {/* 1. Continue — current objective + daily mission */}
      <div className="bg-canvas px-3 pb-6 pt-8 md:px-4 lg:px-6">
        <ScrollReveal>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px] lg:gap-6">
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
        </ScrollReveal>
      </div>

      {/* 2. Today — weekly operation + streak */}
      <div className="bg-canvas px-3 pb-6 md:px-4 lg:px-6">
        <div className="mb-4">
          <p className="type-label mb-1.5 uppercase tracking-[0.12em] text-accent">
            {t('student.dashboard.sections.today')}
          </p>
          <h2 className="type-h2 font-black uppercase tracking-tight text-text-primary">
            {t('student.dashboard.sections.todayDesc')}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          {engagement && (
            <WeeklyOperationCard engagement={engagement} loading={engagementLoading} />
          )}
          {visitDates.length > 0 && (
            <Card className="flex flex-col p-5 md:p-6">
              <p className="type-label mb-3 uppercase tracking-[0.12em] text-text-tertiary">
                {t('student.dashboard.weekActivity.title')}
              </p>
              <WeekActivity visitDates={visitDates} visitDurations={visitDurations} />
            </Card>
          )}
        </div>
        <Card className="mt-4 p-4">
          <CpEarnHint engagement={engagement} loading={engagementLoading} />
        </Card>
      </div>

      {/* 3. Three metrics — CP / rank / streak */}
      <div className="bg-canvas px-3 pb-6 md:px-4 lg:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-6">
            <Metric
              icon={<CpLogo className="h-5 w-5" />}
              label={t('student.dashboard.cp')}
              value={cpBalance.toLocaleString()}
              accent
            />
          </Card>
          <Card className="p-6">
            <Metric
              icon={<Crown className="h-5 w-5" aria-hidden="true" />}
              label={t('student.dashboard.rank')}
              value={rankName}
            />
          </Card>
          <Card className="p-6">
            <Metric
              icon={<Flame className="h-5 w-5" aria-hidden="true" />}
              label={t('student.dashboard.streak.title')}
              value={`${streakDays ?? 0}d`}
            />
          </Card>
        </div>
      </div>

      {/* PWA install */}
      {canInstall && (
        <div className="bg-canvas px-3 pb-6 md:px-4 lg:px-6">
          <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center md:p-6">
            <div className="flex flex-1 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-surface-raised text-accent">
                <Download className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-text-primary">{t('student.installBanner.title')}</p>
                <p className="type-meta">{t('student.installBanner.description')}</p>
              </div>
            </div>
            <Button onClick={handleInstall} disabled={installing} loading={installing} className="sm:ml-auto">
              {t('button.install')}
            </Button>
          </Card>
        </div>
      )}

      {/* 4. Recent learning — permanent library, no toggles */}
      <div className="bg-canvas px-3 pb-10 md:px-4 lg:px-6">
        <ScrollReveal>
          <div className="mb-6">
            <p className="type-label mb-1.5 uppercase tracking-[0.12em] text-accent">
              {t('student.dashboard.sections.recent')}
            </p>
            <h2 className="type-h2 font-black uppercase tracking-tight text-text-primary">
              {t('student.dashboard.sections.recent')}
            </h2>
            <p className="type-body mt-2 max-w-prose">{t('student.dashboard.sections.recentDesc')}</p>
          </div>
        </ScrollReveal>

        {/* Bootcamps */}
        {enrolledBootcamps.length > 0 && (
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="type-label uppercase tracking-[0.12em] text-text-tertiary">{t('nav.bootcamp')}</h3>
              <Button to="/dashboard/bootcamps" variant="ghost" size="sm">
                {t('student.dashboard.viewAll')}
              </Button>
            </div>
            <ActiveDeployments bootcamps={enrolledBootcamps} />
          </div>
        )}

        {/* Courses */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="type-label uppercase tracking-[0.12em] text-text-tertiary">{t('student.dashboard.courses')}</h3>
            <Button to="/dashboard/courses" variant="ghost" size="sm">
              {t('student.dashboard.viewAll')}
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COURSES.slice(0, 3).map((course) => (
              <LearningCard
                key={course.id}
                type="course"
                to={`/dashboard/courses/${course.id}`}
                title={course.title}
                description={course.description}
                icon={<BookOpen className="h-4 w-4" aria-hidden="true" />}
                difficulty={course.skillLevel}
                lessonsCount={course.lessons.length}
                cpReward={course.cpCost}
                actionLabel={t('student.dashboard.view')}
              />
            ))}
          </div>
        </div>

        {/* Labs */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="type-label uppercase tracking-[0.12em] text-text-tertiary">{t('nav.labs')}</h3>
            <Button to="/dashboard/labs" variant="ghost" size="sm">
              {t('student.dashboard.viewAll')}
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LABS.slice(0, 3).map((lab: LabDef) => (
              <LearningCard
                key={lab.id}
                type="lab"
                to={lab.route}
                title={t(lab.titleKey ?? '', lab.id)}
                description={t(lab.descKey ?? '', '')}
                icon={<FlaskConical className="h-4 w-4" aria-hidden="true" />}
                difficulty={lab.difficulty}
                cpReward={lab.cpReward}
                actionLabel={t('student.dashboard.view')}
              />
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="type-label uppercase tracking-[0.12em] text-text-tertiary">{t('student.tools.title')}</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => {
              const ToolIcon = tool.icon;
              return (
                <LearningCard
                  key={tool.id}
                  type="resource"
                  to={tool.route}
                  title={t(tool.labelKey)}
                  description={t(tool.descKey)}
                  icon={<ToolIcon className="h-4 w-4" aria-hidden="true" />}
                  actionLabel={t('student.dashboard.view')}
                />
              );
            })}
          </div>
        </div>

        {/* Marketplace */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="type-label uppercase tracking-[0.12em] text-text-tertiary">{t('nav.marketplace')}</h3>
            <Button to="/dashboard/marketplace" variant="ghost" size="sm">
              {t('student.dashboard.viewAll')}
            </Button>
          </div>
          {products.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 3).map((product: any) => {
                const id = String(product?.id || '');
                const title = String(product?.title || t('student.dashboard.intelligenceAsset'));
                const description = String(product?.description || t('student.dashboard.intelligenceDesc'));
                return (
                  <LearningCard
                    key={id || title}
                    type="product"
                    to="/dashboard/marketplace"
                    title={title}
                    description={description}
                    icon={<ShoppingBag className="h-4 w-4" aria-hidden="true" />}
                    isFree={product?.isFree}
                    price={product?.isFree ? undefined : `${Number(product?.cpPrice || 0).toLocaleString()} CP`}
                    actionLabel={t('student.dashboard.view')}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={<ShoppingBag className="h-5 w-5" aria-hidden="true" />}
              title={t('student.dashboard.sections.emptyMarket')}
              description={t('student.dashboard.sections.emptyMarketDesc')}
              action={<Button to="/dashboard/marketplace" variant="secondary" size="sm">{t('student.dashboard.viewAll')}</Button>}
            />
          )}
        </div>
      </div>

      {/* 5. Skill matrix */}
      <div className="bg-canvas px-3 py-10 md:px-4 lg:px-6">
        <SkillMatrix modules={overviewModules} />
      </div>

      {/* 6. Progression */}
      {progression && (
        <div className="bg-canvas px-3 pb-20 pt-10 lg:px-6 lg:pb-24">
          <ProgressionPanel progression={progression} fallbackLabel={rankName} />
        </div>
      )}
    </div>
    </FadeIn>
  );
};

export default Dashboard;