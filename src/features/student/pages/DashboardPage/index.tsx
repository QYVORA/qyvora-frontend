import { useEffect, useMemo, useState } from 'react';
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
import {
  DashboardHero, ActiveDeployments,
} from '@/features/student/components/dashboard';

import hpbCoverImg from '@/assets/bootcamp/hpb-cover.webp';

const BOOTCAMP_COVER_IMGS: Record<string, string> = { bc_1775270338500: hpbCoverImg };
const BOOTCAMP_FALLBACK_IMG = hpbCoverImg;

function pickCpBalance(userCp: number, overview: any, cpBalance: number | null): number {
  if (typeof cpBalance === 'number' && Number.isFinite(cpBalance)) return cpBalance;
  const fromOverview = extractCpBalance(overview?.xpSummary) ?? extractCpBalance(overview);
  if (typeof fromOverview === 'number' && Number.isFinite(fromOverview)) return fromOverview;
  return userCp;
}

const DashboardSkeleton = () => (
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

const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const pending = getPendingEventJoin();
  const [showReviewModal, setShowReviewModal] = useState(!!pending);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const [overview, setOverview] = useState<any>(null);
  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [cpBalanceState, setCpBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [ovRes, bcRes] = await Promise.all([
          api.get('/student/overview').catch(() => null),
          api.get('/public/bootcamps').catch(() => null),
        ]);
        if (!mounted) return;
        setOverview(ovRes?.data || null);
        setBootcamps(Array.isArray(bcRes?.data?.items) ? bcRes.data.items : []);
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

  const visitDates: string[] = Array.isArray(overview?.visitDates) ? overview.visitDates : [];

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="bg-bg">
      <SEO title="Dashboard" description="Your training overview and active deployments on QYVORA." />
      <OnboardingWizard />
      <div className="mx-auto max-w-[1600px] px-0 pt-6 pb-16 md:px-6 lg:px-10">
        {/* Hero — primary mission status with quick stats integrated */}
        <div className="grid grid-cols-1 gap-6 lg:gap-8 mb-10 items-stretch">
          <DashboardHero
            isEnrolled={isEnrolled}
            allDone={allDone}
            nextMission={nextMission}
            totalRoomsDone={totalRoomsDone}
            cpBalance={cpBalance}
            streakDays={overview?.xpSummary?.streakDays ?? null}
            continuePath={continuePath}
            nextRank={nextRank}
            rankProgress={rankProgress}
            currentPhaseTitle={overview?.progressMeta?.currentPhase?.title}
            rankName={_r?.name || 'Candidate'}
            visitDates={visitDates}
            loading={loading}
          />
        </div>

        {/* Learning path — core curriculum */}
        <div className="mb-10">
          <LearningPathMap
            overview={overview}
            bootcampId={activeBootcamp ? String(activeBootcamp.id) : BOOTCAMP_CONFIG.id}
            isEnrolled={isEnrolled}
          />
        </div>

        {/* Active deployments */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12 items-start">
          <ActiveDeployments bootcamps={enrolledBootcamps} loading={loading} />
        </div>
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
