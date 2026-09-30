import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
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
import { Button, Card, EmptyState, ErrorState, FadeIn, PageHeader, SectionHeader } from '@/shared/components/ui';
import PageBody from '@/shared/components/layout/PageBody';
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
import ScrollReveal from '@/shared/components/ScrollReveal';
import { ShoppingBag, Download } from 'lucide-react';
import { IconTerminal, IconNetwork } from '@/shared/components/icons';
import LearningCard from '@/shared/components/learning/LearningCard';
import CourseBadge from '@/shared/components/CourseBadge';
import { LABS } from '@/features/student/constants/labs';
import { COURSES } from '@/features/student/data/courses';
import { isInstallable, showInstallPrompt } from '@/features/student/services/pwa';
import type { LabDef } from '@/features/student/constants/labs';

import hpbCoverImg from '@/assets/bootcamp/hpb-cover.webp';

const BOOTCAMP_COVER_IMGS: Record<string, string> = { bc_1775270338500: hpbCoverImg };
const BOOTCAMP_FALLBACK_IMG = hpbCoverImg;

const TOOLS = [
  { id: 'terminal', label: 'Terminal', desc: 'Kali Linux terminal emulator', route: '/dashboard/tools/terminal', icon: IconTerminal },
  { id: 'network-visualizer', label: 'Network Visualizer', desc: 'Build and explore network topologies', route: '/dashboard/tools/network-visualizer', icon: IconNetwork },
];

const GRID = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5';

/**
 * CatalogueGroup — one labelled row of learning items inside the catalogue
 * section. The dashboard repeats this five times (bootcamps, courses, labs,
 * tools, marketplace); the label, the "View all" action and the grid are
 * identical each time, so they live here instead of being copy-pasted.
 */
const CatalogueGroup = ({
  label, viewAllTo, children,
}: { label: string; viewAllTo?: string; children: ReactNode }) => (
  <div>
    <div className="mb-4 flex items-center justify-between gap-4">
      <h3 className="type-label uppercase tracking-[0.12em] text-text-tertiary">{label}</h3>
      {viewAllTo && (
        <Button to={viewAllTo} variant="ghost" size="sm">
          {"View All"}
        </Button>
      )}
    </div>
    {children}
  </div>
);

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
  const streakDays = overview?.xpSummary?.streakDays ?? 0;
  const visitDates = overview?.xpSummary?.visitDates ?? [];
  const visitDurations = overview?.xpSummary?.visitDurations ?? {};
  const rankName = effectiveRankName;

  if (loading || overviewLoading) return <DashboardSkeleton />;

  // One objective, one CTA — the hero owns the page's only primary action.
  const hero = allDone
    ? {
        title: 'All missions complete',
        body: 'You have completed every available room. Review the curriculum or pick up a lab.',
        ctaLabel: 'Review Curriculum',
      }
    : isEnrolled
      ? {
          title: nextMission?.title || overview?.progressMeta?.currentPhase?.title || 'Continue your training',
          body: 'Pick up where you left off.',
          ctaLabel: 'Continue',
        }
      : {
          title: 'Begin your journey',
          body: 'Start the Hacker Protocol Bootcamp and earn your first CP.',
          ctaLabel: 'Start Training',
        };

  return (
    <FadeIn>
      <div className="min-h-full bg-canvas">
        <SEO title={"Dashboard"} description={"Operator dashboard | QYVORA"} noindex />
        <StudentOnboardingModal />
        <StudentTour cpBalance={cpBalance} username={user?.username ?? ''} />

        <PageBody spacing="sections">
          <PageHeader
            kicker={"QYVORA · Dashboard"}
            title={"Dashboard"}
            description={"Resume your training, track progress, and pick up something new."}
            metadata={
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <span className="type-meta">
                  <span className="font-mono text-sm font-black text-accent">{cpBalance.toLocaleString()}</span> CP
                </span>
                <span className="type-meta">
                  <span className="font-mono text-sm font-black text-text-primary">{rankName}</span> Rank
                </span>
                <span className="type-meta">
                  <span className="font-mono text-sm font-black text-text-primary">{streakDays}d</span> Streak
                </span>
              </div>
            }
          />

          {syncError && (
            <ErrorState message={syncError} title="Sync Failed" />
          )}

          {/* 1. Primary — the single most important thing on the page */}
          <ScrollReveal>
            <SectionHeader title={"Continue"} />
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6">
              <DashboardHero
                username={user?.username}
                title={hero.title}
                body={hero.body}
                ctaLabel={hero.ctaLabel}
                continuePath={continuePath}
              />
              {engagement && <DailyMissionCard engagement={engagement} loading={engagementLoading} />}
            </div>
          </ScrollReveal>

          {/* 2. Secondary — today's engagement */}
          <ScrollReveal>
            <SectionHeader title={"Today"} />
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
              {engagement ? (
                <WeeklyOperationCard engagement={engagement} loading={engagementLoading} />
              ) : (
                <Card className="flex flex-col justify-center p-5 md:p-6">
                  <p className="type-label uppercase tracking-[0.12em] text-text-tertiary">
                    {"Weekly Operation"}
                  </p>
                  <p className="type-body-sm mt-2">{"No weekly operation is active right now."}</p>
                </Card>
              )}
              {visitDates.length > 0 && (
                <Card className="flex flex-col p-5 md:p-6">
                  <h3 className="type-h3 mb-4 text-text-primary">{"Week at a Glance"}</h3>
                  <WeekActivity visitDates={visitDates} visitDurations={visitDurations} />
                </Card>
              )}
            </div>
            <div className="mt-4">
              <CpEarnHint engagement={engagement} loading={engagementLoading} />
            </div>
          </ScrollReveal>

          {/* 3. Tertiary — the permanent catalogue */}
          <ScrollReveal>
            <SectionHeader
              title={"Your Learning"}
              description={"Everything you are enrolled in, plus the tools you work with."}
            />
            <div className="mt-6 space-y-8">
              <CatalogueGroup label={"Bootcamp"} viewAllTo="/dashboard/bootcamps">
                <ActiveDeployments bootcamps={enrolledBootcamps} />
              </CatalogueGroup>

              <CatalogueGroup label={"Courses"} viewAllTo="/dashboard/courses">
                <div className={GRID}>
                  {COURSES.slice(0, 3).map((course) => (
                    <LearningCard
                      key={course.id}
                      type="course"
                      to={`/dashboard/courses/${course.id}`}
                      title={course.title}
                      description={course.description}
                      badge={<CourseBadge courseId={course.id} className="w-14 h-14 shrink-0" />}
                      difficulty={course.skillLevel}
                      lessonsCount={course.lessons.length}
                      cpReward={course.cpCost}
                      actionLabel={"View"}
                    />
                  ))}
                </div>
              </CatalogueGroup>

              <CatalogueGroup label={"Labs"} viewAllTo="/dashboard/labs">
                <div className={GRID}>
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
              </CatalogueGroup>

              <CatalogueGroup label={"Tools"}>
                <div className={GRID}>
                  {TOOLS.map((tool) => {
                    const ToolIcon = tool.icon;
                    return (
                      <LearningCard
                        key={tool.id}
                        type="resource"
                        to={tool.route}
                        title={tool.label}
                        description={tool.desc}
                        icon={<ToolIcon className="h-7 w-7" aria-hidden="true" />}
                        actionLabel={"View"}
                      />
                    );
                  })}
                </div>
              </CatalogueGroup>

              <CatalogueGroup label={"Marketplace"} viewAllTo="/dashboard/marketplace">
                {products.length > 0 ? (
                  <div className={GRID}>
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
                          icon={<ShoppingBag className="h-7 w-7" aria-hidden="true" />}
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
              </CatalogueGroup>
            </div>
          </ScrollReveal>

          {/* 4. Skill coverage */}
          <SkillMatrix modules={overviewModules} />

          {/* 5. Rank progression */}
          {progression && <ProgressionPanel progression={progression} fallbackLabel={rankName} />}

          {/* 6. Tertiary — platform prompt */}
          {canInstall && (
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
          )}
        </PageBody>
      </div>
    </FadeIn>
  );
};

export default Dashboard;
