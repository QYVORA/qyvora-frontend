import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import api from '@/core/services/api';
import { extractCpBalance } from '@/shared/utils/cpBalance';
import {
  getBootcampProgressMap,
  resolveNextRoomPath,
} from '@/features/student/utils/studentExperience';
import { getContentLabProgress } from '@/features/student/utils/savedLabs';
import useStudentOverview from '@/features/student/hooks/useStudentOverview';
import useEngagement from '@/features/student/hooks/useEngagement';
import { Card, ErrorState, FadeIn } from '@/shared/components/ui';
import PageBody from '@/shared/components/layout/PageBody';
import { DashboardSkeleton } from '@/features/student/components/StudentSkeletons';
import SEO from '@/shared/components/SEO';
import StudentTour from '@/features/student/components/StudentTour';
import StudentOnboardingModal from '@/features/student/components/StudentOnboardingModal';
import {
  CommunityCard,
  DashboardHero,
  LeagueCard,
  MyLearningCard,
  NewLabsCard,
  SessionPlannerCard,
  TopOperatorsCard,
  WeeklyMissionCard,
  YourStatsCard,
} from '@/features/student/components/dashboard';
import type { MyLearningBootcamp } from '@/features/student/components/dashboard/MyLearningCard';
import CpEarnHint from '@/features/student/components/dashboard/CpEarnHint';
import CertificateClaimBanner from '@/features/student/components/dashboard/CertificateClaimBanner';
import QoseDashboardCard from '@/features/qose/components/QoseDashboardCard';
import WeekActivity from '@/features/student/components/dashboard/WeekActivity';
import SkillMatrix from '@/features/student/components/dashboard/SkillMatrix';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { UNIFIED_LABS, CONTENT_LABS } from '@/features/student/data/labs';

const BOOTCAMP_FALLBACK_PATH = '/dashboard/bootcamps';

function pickCpBalance(userCp: number, overview: any, cpBalance: number | null): number {
  const fromOverview = extractCpBalance(overview?.xpSummary) ?? extractCpBalance(overview);
  if (typeof fromOverview === 'number' && Number.isFinite(fromOverview)) return fromOverview;
  if (typeof cpBalance === 'number' && Number.isFinite(cpBalance) && cpBalance > 0) return cpBalance;
  return userCp;
}

/**
 * Student dashboard overview.
 *
 * A desktop-first, two-column masonry composition: the left column carries the
 * learner's path (continue banner, community, my learning, competitive, new
 * Labs, this week) and the right column carries engagement and social proof
 * (weekly mission, stats, community leaders). Columns flow independently so
 * cards keep their natural height. Data comes from `/student/overview`,
 * `/student/engagement`, `/student/community`, `/student/session-plans`,
 * `/public/bootcamps` and `/public/leaderboard`.
 */
const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { data: overview, loading: overviewLoading } = useStudentOverview();
  const { data: engagement, loading: engagementLoading } = useEngagement();

  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [cpBalanceState, setCpBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const bcRes = await api
          .get('/public/bootcamps')
          .catch((err) => {
            console.warn('[Dashboard] bootcamps failed:', err?.response?.status || err?.message);
            return null;
          });
        if (!mounted) return;
        setBootcamps(Array.isArray(bcRes?.data?.items) ? bcRes.data.items : []);
        setCpBalance(user?.cp ?? 0);
        setSyncError('');
      } catch {
        if (!mounted) return;
        setSyncError('Could not sync. Showing cached data.');
        addToast('Failed to load dashboard data', 'error');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [user?.uid, user?.cp, addToast]);

  const moduleProgressById = getBootcampProgressMap(overview);
  const enrolledBootcamps = bootcamps
    .map((item: any) => ({ item, prog: moduleProgressById.get(String(item.id || '')) }))
    .filter(({ prog }) => prog !== undefined)
    .slice(0, 4);

  const activeBootcamp = bootcamps.find(
    (bc: any) => moduleProgressById.get(String(bc.id || '')) !== undefined,
  );
  const continuePath = activeBootcamp
    ? resolveNextRoomPath(String(activeBootcamp.id || '')) || `/dashboard/bootcamps/${activeBootcamp.id}`
    : BOOTCAMP_FALLBACK_PATH;
  const isEnrolled = (overview?.bootcampStatus || 'not_enrolled') !== 'not_enrolled';
  const cpBalance = pickCpBalance(user?.cp ?? 0, overview, cpBalanceState);
  const progression = overview?.xpSummary?.progression ?? null;
  const effectiveRankName = progression?.rank || 'Candidate';
  const nextMission = (overview?.learningPath || []).find(
    (m: any) => m.status === 'in-progress' || m.status === 'next',
  );

  const overviewModules = Array.isArray(overview?.modules) ? overview.modules : [];
  const totalRoomsDone = overviewModules.reduce(
    (sum: number, m: any) => sum + Number(m.roomsCompleted || 0),
    0,
  );
  const totalRooms = overviewModules.reduce(
    (sum: number, m: any) => sum + Number(m.roomsTotal || 0),
    0,
  );
  const allDone = isEnrolled && !nextMission && totalRoomsDone > 0;
  const streakDays = overview?.xpSummary?.streakDays ?? 0;
  const visitDates = overview?.xpSummary?.visitDates ?? [];
  const visitDurations = overview?.xpSummary?.visitDurations ?? {};
  const rankName = effectiveRankName;

  const progressById = useMemo(() => {
    const map: Record<string, number> = {};
    CONTENT_LABS.forEach((lab) => {
      map[lab.id] = getContentLabProgress(lab.id, lab.lessonsCount ?? 0);
    });
    return map;
  }, []);

  const myLearningBootcamps: MyLearningBootcamp[] = enrolledBootcamps.map(({ item, prog }) => {
    const id = String(item.id || '');
    return {
      id,
      title: item.title || 'Bootcamp',
      description: String(item.description || '').trim() ||
        'A structured programme of guided Labs, live sessions and assessments.',
      progress: Number(prog?.progress || 0),
      to: id === String(activeBootcamp?.id || '') ? continuePath : `/dashboard/bootcamps/${id}`,
    };
  });

  if (loading || overviewLoading) return <DashboardSkeleton />;

  const hero = allDone
    ? {
        title: 'Every Lab complete',
        body: 'You have completed every available room. Review the curriculum or pick up a new Lab to keep sharp.',
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
          title: 'Begin your first Lab',
          body: 'Start with a foundational content Lab to build the fundamentals, then move into hands-on practice.',
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
          {syncError && <ErrorState message={syncError} title="Sync Failed" />}

          <CertificateClaimBanner />

          <div className="mx-auto w-full max-w-[1120px]">
            <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-6 xl:gap-7">
              {/* ── LEFT COLUMN — the learner's path ─────────────────────── */}
              <div className="flex min-w-0 flex-col gap-5">
                <ScrollReveal>
                  <DashboardHero
                    username={user?.username}
                    title={hero.title}
                    body={hero.body}
                    ctaLabel={hero.ctaLabel}
                    continuePath={hero.continuePath}
                    secondaryLabel={isEnrolled ? 'All Labs' : undefined}
                    secondaryTo={isEnrolled ? '/dashboard/labs' : undefined}
                  />
                </ScrollReveal>

                <QoseDashboardCard />

                <ScrollReveal>
                  <CommunityCard />
                </ScrollReveal>

                <ScrollReveal>
                  <MyLearningCard
                    bootcamps={myLearningBootcamps}
                    labs={CONTENT_LABS}
                    progressById={progressById}
                  />
                </ScrollReveal>

                <ScrollReveal>
                  <LeagueCard
                    rankName={rankName}
                    cp={cpBalance}
                    streakDays={streakDays}
                    progression={progression}
                  />
                </ScrollReveal>

                <ScrollReveal>
                  <NewLabsCard labs={UNIFIED_LABS} />
                </ScrollReveal>

                {visitDates.length > 0 && (
                  <ScrollReveal>
                    <Card className="flex flex-col p-5 md:p-6">
                      <h2 className="type-h2 mb-4 text-text-primary">This Week</h2>
                      <WeekActivity visitDates={visitDates} visitDurations={visitDurations} />
                    </Card>
                  </ScrollReveal>
                )}

                <ScrollReveal>
                  <CpEarnHint engagement={engagement} loading={engagementLoading} />
                </ScrollReveal>
              </div>

              {/* ── RIGHT COLUMN — engagement, stats and community ───────── */}
              <div className="flex min-w-0 flex-col gap-5">
                <ScrollReveal>
                  {engagement ? (
                    <WeeklyMissionCard engagement={engagement} loading={engagementLoading} />
                  ) : (
                    <Card className="flex flex-col justify-center p-5 md:p-6">
                      <h2 className="type-h2 text-text-primary">Weekly Mission</h2>
                      <p className="mt-2 type-body-sm text-text-secondary">
                        No weekly mission is active right now. Complete a Lab to start earning CP.
                      </p>
                    </Card>
                  )}
                </ScrollReveal>

                <ScrollReveal>
                  <YourStatsCard
                    username={user?.username || ''}
                    rankName={rankName}
                    cp={cpBalance}
                    streakDays={streakDays}
                    roomsCompleted={totalRoomsDone}
                    roomsTotal={totalRooms}
                    bootcampStatus={overview?.bootcampStatus || 'not_enrolled'}
                    progression={progression}
                  />
                </ScrollReveal>

                <ScrollReveal>
                  <SessionPlannerCard />
                </ScrollReveal>

                <ScrollReveal>
                  <TopOperatorsCard currentUserId={user?.uid} />
                </ScrollReveal>
              </div>
            </div>
          </div>

          {/* Skill coverage needs the full content width for the radar chart. */}
          <ScrollReveal>
            <SkillMatrix modules={overviewModules} />
          </ScrollReveal>
        </PageBody>
      </div>
    </FadeIn>
  );
};

export default Dashboard;
