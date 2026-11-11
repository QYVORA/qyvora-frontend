import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/core/contexts/AuthContext';
import api from '@/core/services/api';
import { extractCpBalance } from '@/shared/utils/cpBalance';
import {
  getBootcampProgressMap,
  resolveNextRoomPath,
} from '@/features/student/utils/studentExperience';
import { getContentLabProgress } from '@/features/student/utils/savedLabs';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import useEngagement from '@/features/student/hooks/useEngagement';
import { Button, Card, FadeIn } from '@/shared/components/ui';
import PageBody from '@/shared/components/layout/PageBody';
import TwoColumn from '@/shared/components/layout/TwoColumn';
import { DashboardSkeleton } from '@/features/student/components/StudentSkeletons';
import SEO from '@/shared/components/SEO';
import StudentTour from '@/features/student/components/StudentTour';
import StudentOnboardingModal from '@/features/student/components/StudentOnboardingModal';
import {
  CommunityCard,
  DashboardHero,
  MyLearningCard,
  NewLabsCard,
  SessionPlannerCard,
  TopOperatorsCard,
  WeeklyMissionCard,
  YourStatsCard,
} from '@/features/student/components/dashboard';
import type { MyLearningBootcamp } from '@/features/student/components/dashboard/MyLearningCard';
import CertificateClaimBanner from '@/features/student/components/dashboard/CertificateClaimBanner';
import QoseDashboardCard from '@/features/qose/components/QoseDashboardCard';
import WeekActivity from '@/features/student/components/dashboard/WeekActivity';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { UNIFIED_LABS, CONTENT_LABS } from '@/features/student/data/labs';

const BOOTCAMP_FALLBACK_PATH = '/dashboard/bootcamps';

interface BootcampCatalogEntry {
  id?: string | number;
  title?: string;
}

function pickCpBalance(userCp: number | undefined, overview: any): number | undefined {
  const fromOverview = extractCpBalance(overview?.xpSummary) ?? extractCpBalance(overview);
  if (typeof fromOverview === 'number' && Number.isFinite(fromOverview)) return fromOverview;
  if (typeof userCp === 'number' && Number.isFinite(userCp)) return userCp;
  return userCp;
}

/**
 * Student dashboard overview. At wide desktop sizes, learning takes the
 * primary two-thirds and supporting widgets use the remaining third; smaller
 * screens retain a predictable single-column reading order.
 */
const Dashboard = () => {
  const { user } = useAuth();
  const {
    data: overview,
    loading: overviewLoading,
    error: overviewError,
    refetch: refetchOverview,
  } = useStudentOverview();
  const {
    data: engagement,
    loading: engagementLoading,
    error: engagementError,
    refetch: refetchEngagement,
  } = useEngagement();

  const [bootcamps, setBootcamps] = useState<BootcampCatalogEntry[]>([]);
  const [bootcampsLoading, setBootcampsLoading] = useState(true);
  const [bootcampsError, setBootcampsError] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const loadBootcamps = useCallback(async () => {
    if (!mountedRef.current) return;
    setBootcampsLoading(true);
    setBootcampsError(false);
    try {
      const bcRes = await api.get<{ items?: BootcampCatalogEntry[] }>('/public/bootcamps');
      if (!mountedRef.current) return;
      setBootcamps(Array.isArray(bcRes.data?.items) ? bcRes.data.items : []);
    } catch (error) {
      console.warn(
        '[Dashboard] bootcamps failed:',
        error instanceof Error ? error.message : 'Unknown error',
      );
      if (!mountedRef.current) return;
      setBootcamps([]);
      setBootcampsError(true);
    } finally {
      if (mountedRef.current) setBootcampsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBootcamps();
  }, [loadBootcamps, user?.uid]);

  const moduleProgressById = getBootcampProgressMap(overview);
  const isBootcampActive = (id: string) => {
    const progress = moduleProgressById.get(id)?.progress;
    return moduleProgressById.has(id) &&
      (typeof progress !== 'number' || !Number.isFinite(progress) || progress < 100);
  };
  const myLearningBootcamps: MyLearningBootcamp[] = bootcamps.flatMap((item) => {
    const id = String(item.id ?? '').trim();
    const title = item.title?.trim();
    if (!id || !title) return [];
    const progress = moduleProgressById.get(id);
    return [{
      id,
      title,
      progress: progress?.progress,
      to: `/dashboard/bootcamps/${id}`,
      isActive: isBootcampActive(id),
    }];
  });

  const activeBootcamp = bootcamps.find(
    (bc) => isBootcampActive(String(bc.id ?? '')),
  );
  const continuePath = activeBootcamp
    ? resolveNextRoomPath(String(activeBootcamp.id ?? '')) || `/dashboard/bootcamps/${activeBootcamp.id}`
    : BOOTCAMP_FALLBACK_PATH;
  const isEnrolled = (overview?.bootcampStatus || 'not_enrolled') !== 'not_enrolled';
  const cpBalance = pickCpBalance(user?.cp, overview);
  const progression = overview?.xpSummary?.progression ?? null;
  const nextMission = (overview?.learningPath || []).find(
    (mission: any) => mission.status === 'in-progress' || mission.status === 'next',
  );

  const overviewModules = Array.isArray(overview?.modules) ? overview.modules : [];
  const totalRoomsDone = overviewModules.reduce(
    (sum: number, module: any) => sum + Number(module.roomsCompleted || 0),
    0,
  );
  const totalRooms = overviewModules.reduce(
    (sum: number, module: any) => sum + Number(module.roomsTotal || 0),
    0,
  );
  const allDone = isEnrolled && !nextMission && totalRooms > 0 && totalRoomsDone >= totalRooms;
  const streakDaysValue = overview?.xpSummary?.streakDays;
  const streakDays = typeof streakDaysValue === 'number' && Number.isFinite(streakDaysValue)
    ? streakDaysValue
    : undefined;
  const visitDates = Array.isArray(overview?.xpSummary?.visitDates) ? overview.xpSummary.visitDates : [];
  const visitDurations = overview?.xpSummary?.visitDurations ?? {};

  const progressById = useMemo(() => {
    const map: Record<string, number | undefined> = {};
    CONTENT_LABS.forEach((lab) => {
      map[lab.id] = getContentLabProgress(lab.id, lab.lessonsCount ?? 0);
    });
    return map;
  }, []);

  const activeContentLabIds = CONTENT_LABS
    .filter((lab) => {
      const progress = progressById[lab.id];
      return progress !== undefined && progress > 0 && progress < 100;
    })
    .map((lab) => lab.id);
  const activeContentLab = CONTENT_LABS.find((lab) => activeContentLabIds.includes(lab.id));

  if (bootcampsLoading || overviewLoading) return <DashboardSkeleton />;

  const hero = overviewError
    ? {
        title: 'Your learning overview is unavailable',
        body: 'Your dashboard data could not be loaded. You can still browse Labs while we retry.',
        ctaLabel: 'Browse Labs',
        continuePath: '/dashboard/labs',
      }
    : activeContentLab && !activeBootcamp
      ? {
          title: activeContentLab.title,
          body: activeContentLab.description,
          ctaLabel: 'Continue learning',
          continuePath: activeContentLab.route,
        }
      : allDone
        ? {
            title: 'Bootcamp programme complete',
            body: 'You have completed the available rooms in your bootcamp programme. Continue with another Lab or review the curriculum.',
            ctaLabel: 'Explore Labs',
            continuePath: '/dashboard/labs',
          }
        : isEnrolled
      ? {
          title: nextMission?.title || overview?.progressMeta?.currentPhase?.title || 'Continue your training',
          body: nextMission?.overview ||
            'Pick up where you left off. Your next objective is waiting in the current programme.',
          ctaLabel: 'Continue',
          continuePath,
        }
      : {
          title: 'Choose your next Lab',
          body: 'Explore a content Lab or hands-on practice to build and apply your skills.',
          ctaLabel: 'Explore Labs',
          continuePath: '/dashboard/labs',
        };

  return (
    <FadeIn>
      <div className="min-h-full bg-canvas">
        <SEO title={'Dashboard'} description={'Operator dashboard | QYVORA'} noindex />
        <StudentOnboardingModal />
        <StudentTour cpBalance={cpBalance} username={user?.username ?? ''} />

        <PageBody spacing="sections">
          {overviewError && (
            <div role="alert">
              <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
                <p className="type-body-sm text-semantic-danger">
                  Your progress and statistics could not be loaded.
                </p>
                <Button type="button" variant="secondary" size="sm" onClick={refetchOverview}>
                  Retry
                </Button>
              </Card>
            </div>
          )}

          <TwoColumn split="dash">
            <div className="flex min-w-0 flex-col gap-6">
              <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                <ScrollReveal>
                  <DashboardHero
                    username={user?.username}
                    title={hero.title}
                    body={hero.body}
                    ctaLabel={hero.ctaLabel}
                    continuePath={hero.continuePath}
                    secondaryLabel={isEnrolled && !overviewError ? 'All Labs' : undefined}
                    secondaryTo={isEnrolled && !overviewError ? '/dashboard/labs' : undefined}
                  />
                </ScrollReveal>

                <ScrollReveal>
                  <CommunityCard />
                </ScrollReveal>
              </div>

              <ScrollReveal>
                <MyLearningCard
                  bootcamps={myLearningBootcamps.map((bootcamp) => (
                    bootcamp.id === String(activeBootcamp?.id ?? '')
                      ? { ...bootcamp, to: continuePath }
                      : bootcamp
                  ))}
                  labs={UNIFIED_LABS}
                  progressById={progressById}
                  bootcampsError={bootcampsError}
                  activeLearningError={Boolean(overviewError)}
                  onRetryBootcamps={() => void loadBootcamps()}
                />
              </ScrollReveal>

              <ScrollReveal>
                <NewLabsCard labs={UNIFIED_LABS} excludeLabIds={activeContentLabIds} />
              </ScrollReveal>

              <ScrollReveal>
                <SessionPlannerCard />
              </ScrollReveal>
            </div>

            <aside className="flex min-w-0 flex-col gap-6">
              <ScrollReveal>
                <WeeklyMissionCard
                  engagement={engagement}
                  loading={engagementLoading}
                  error={engagementError}
                  onRetry={refetchEngagement}
                />
              </ScrollReveal>

              <ScrollReveal>
                <YourStatsCard
                  username={user?.username || ''}
                  rankName={progression?.rank}
                  cp={cpBalance}
                  streakDays={streakDays}
                  roomsCompleted={overview && overviewModules.length > 0 ? totalRoomsDone : undefined}
                  roomsTotal={overview && overviewModules.length > 0 ? totalRooms : undefined}
                  bootcampStatus={overview?.bootcampStatus}
                  progression={progression}
                  overviewError={Boolean(overviewError)}
                />
              </ScrollReveal>

              <QoseDashboardCard />
              <CertificateClaimBanner />

              <ScrollReveal>
                <TopOperatorsCard currentUserId={user?.uid} />
              </ScrollReveal>

              {visitDates.length > 0 && (
                <ScrollReveal>
                  <Card className="flex flex-col p-[var(--app-card-pad)]">
                    <h2 className="type-h2 mb-4 text-text-primary">This Week</h2>
                    <WeekActivity visitDates={visitDates} visitDurations={visitDurations} />
                  </Card>
                </ScrollReveal>
              )}
            </aside>
          </TwoColumn>
        </PageBody>
      </div>
    </FadeIn>
  );
};

export default Dashboard;
