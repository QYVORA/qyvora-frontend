import { useEffect, useState } from 'react';
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
  ShoppingBag,
  Flame,
  Crown,
  Download,
} from 'lucide-react';
import { IconCode, IconTerminal, IconNetwork } from '@/shared/components/icons';
import LearningCard from '@/shared/components/learning/LearningCard';
import CourseBadge from '@/shared/components/CourseBadge';
import { LABS } from '@/features/student/constants/labs';
import CpLogo from '@/shared/components/CpLogo';
import { COURSES } from '@/features/student/data/courses';
import { isInstallable, showInstallPrompt } from '@/features/student/services/pwa';
import type { LabDef } from '@/features/student/constants/labs';

import hpbCoverImg from '@/assets/bootcamp/hpb-cover.webp';

const BOOTCAMP_COVER_IMGS: Record<string, string> = { bc_1775270338500: hpbCoverImg };
const BOOTCAMP_FALLBACK_IMG = hpbCoverImg;

const TOOLS = [
  { id: 'ide', label: 'IDE', desc: 'Write and run Python/Bash for course exercises', route: '/dashboard/tools/ide', icon: IconCode },
  { id: 'terminal', label: 'Terminal', desc: 'Kali Linux terminal emulator', route: '/dashboard/tools/terminal', icon: IconTerminal },
  { id: 'network-visualizer', label: 'Network Visualizer', desc: 'Build and explore network topologies', route: '/dashboard/tools/network-visualizer', icon: IconNetwork },
];

function pickCpBalance(userCp: number, overview: any, cpBalance: number | null): number {
  const fromOverview = extractCpBalance(overview?.xpSummary) ?? extractCpBalance(overview);
  if (typeof fromOverview === 'number' && Number.isFinite(fromOverview)) return fromOverview;
  if (typeof cpBalance === 'number' && Number.isFinite(cpBalance) && cpBalance > 0) return cpBalance;
  return userCp;
}

const Dashboard = () => {
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
        setSyncError("Could not sync. Showing cached data.");
        addToast("Failed to load dashboard data", 'error');
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
      title: item.title || "Bootcamp",
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
  const effectiveRankName = progression?.rank || "Candidate";
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
      <SEO title={"Dashboard"} description={"Operator dashboard | QYVORA"} noindex />
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
            {"Today"}
          </p>
          <h2 className="type-h2 font-black uppercase tracking-tight text-text-primary">
            {"What's on for today."}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          {engagement && (
            <WeeklyOperationCard engagement={engagement} loading={engagementLoading} />
          )}
          {visitDates.length > 0 && (
            <Card className="flex flex-col p-5 md:p-6">
              <div className="mb-2">
                <p className="type-label mb-1.5 uppercase tracking-[0.12em] text-accent">
                  {"Weekly track"}
                </p>
                <h3 className="type-h2 font-black uppercase tracking-tight text-text-primary">
                  {"Week at a Glance"}
                </h3>
              </div>
              <WeekActivity visitDates={visitDates} visitDurations={visitDurations} />
            </Card>
          )}
        </div>
        <Card className="mt-5 p-4 md:p-5">
          <CpEarnHint engagement={engagement} loading={engagementLoading} />
        </Card>
      </div>

      {/* 3. Three metrics — CP / rank / streak */}
      <div className="bg-canvas px-3 pb-6 md:px-4 lg:px-6">
        <div className="grid grid-cols-1 gap-4 md:gap-5 sm:grid-cols-3">
          <Card className="p-6 md:p-7">
            <Metric
              icon={<CpLogo className="h-5 w-5" />}
              label={"CP"}
              value={cpBalance.toLocaleString()}
              accent
            />
          </Card>
          <Card className="p-6 md:p-7">
            <Metric
              icon={<Crown className="h-5 w-5" aria-hidden="true" />}
              label={"Rank"}
              value={rankName}
            />
          </Card>
          <Card className="p-6 md:p-7">
            <Metric
              icon={<Flame className="h-5 w-5" aria-hidden="true" />}
              label={"Streak"}
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
                <p className="text-sm font-bold text-text-primary">{"Install QYVORA"}</p>
                <p className="type-meta">{"Get the full experience with our desktop app."}</p>
              </div>
            </div>
            <Button onClick={handleInstall} disabled={installing} loading={installing} className="sm:ml-auto">
              {"Install"}
            </Button>
          </Card>
        </div>
      )}

      {/* 4. Recent learning — permanent library, no toggles */}
      <div className="bg-canvas px-3 pb-10 md:px-4 lg:px-6">
        <ScrollReveal>
          <div className="mb-6">
            <p className="type-label mb-1.5 uppercase tracking-[0.12em] text-accent">
              {"Recent learning"}
            </p>
            <h2 className="type-h2 font-black uppercase tracking-tight text-text-primary">
              {"Your catalog"}
            </h2>
            <p className="type-body mt-2 max-w-prose">{"Pick up any of your recent work, or start something new."}</p>
          </div>
        </ScrollReveal>

        {/* Bootcamps */}
        {enrolledBootcamps.length > 0 && (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="type-label uppercase tracking-[0.12em] text-text-tertiary">{"Bootcamp"}</h3>
              <Button to="/dashboard/bootcamps" variant="ghost" size="sm">
                {"View All"}
              </Button>
            </div>
            <ActiveDeployments bootcamps={enrolledBootcamps} />
          </div>
        )}

        {/* Courses */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="type-label uppercase tracking-[0.12em] text-text-tertiary">{"Courses"}</h3>
            <Button to="/dashboard/courses" variant="ghost" size="sm">
              {"View All"}
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
                badge={<CourseBadge courseId={course.id} className="h-11 w-11 shrink-0" />}
                difficulty={course.skillLevel}
                lessonsCount={course.lessons.length}
                cpReward={course.cpCost}
                actionLabel={"View"}
              />
            ))}
          </div>
        </div>

        {/* Labs */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="type-label uppercase tracking-[0.12em] text-text-tertiary">{"Labs"}</h3>
            <Button to="/dashboard/labs" variant="ghost" size="sm">
              {"View All"}
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LABS.slice(0, 3).map((lab: LabDef) => (
              <LearningCard
                key={lab.id}
                id={lab.id}
                type="lab"
                to={lab.route}
                title={lab.title}
                description={lab.desc}
                difficulty={lab.difficulty}
                cpReward={lab.cpReward}
                actionLabel={"View"}
              />
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="type-label uppercase tracking-[0.12em] text-text-tertiary">{"Tools"}</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => {
              const ToolIcon = tool.icon;
              return (
                <LearningCard
                  key={tool.id}
                  type="resource"
                  to={tool.route}
                  title={tool.label}
                  description={tool.desc}
                  icon={<ToolIcon className="h-4 w-4" aria-hidden="true" />}
                  actionLabel={"View"}
                />
              );
            })}
          </div>
        </div>

        {/* Marketplace */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="type-label uppercase tracking-[0.12em] text-text-tertiary">{"Marketplace"}</h3>
            <Button to="/dashboard/marketplace" variant="ghost" size="sm">
              {"View All"}
            </Button>
          </div>
          {products.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 3).map((product: any) => {
                const id = String(product?.id || '');
                const title = String(product?.title || "Intelligence Asset");
                const description = String(product?.description || "Secure intelligence report for offensive security operatives.");
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
                    actionLabel={"View"}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={<ShoppingBag className="h-5 w-5" aria-hidden="true" />}
              title={"No intelligence assets yet."}
              description={"Browse the marketplace to spend your CP."}
              action={<Button to="/dashboard/marketplace" variant="secondary" size="sm">{"View All"}</Button>}
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