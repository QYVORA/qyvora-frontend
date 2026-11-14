import { useEffect, useMemo, useState } from 'react';
import HpbAvatar, { type HpbVariant } from '@/shared/components/HpbAvatar';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PageBody from '@/shared/components/layout/PageBody';
import Button from '@/shared/components/ui/Button';
import { LearningCatalogue } from '@/shared/components/learning';
import LearningCard from '@/shared/components/learning/LearningCard';
import type { LearningCatalogueItem } from '@/shared/components/learning';
import api from '@/core/services/api';
import { useToast } from '@/core/contexts/ToastContext';
import {
  buildBootcampRoomLabs,
  HACKER_PROTOCOL_BOOTCAMP_ID,
  PRACTICAL_LABS,
  UNIFIED_LABS,
} from '@/features/student/data/labs';
import type { BootcampCatalogueCourse, UnifiedLab } from '@/features/student/data/labs';
import { getContentLabProgress } from '@/features/student/utils/savedLabs';
import { shortDescription } from '@/shared/learning/utils/shortDescription';
import LabCard from './LabCard';

const PRACTICAL_LAB_IDS = new Set(PRACTICAL_LABS.map((lab) => lab.id));

const getPhaseVariant = (phaseId?: string): HpbVariant | undefined => {
  switch (phaseId) {
    case 'phase1':
    case 'phase2':
    case 'phase3':
    case 'phase4':
    case 'phase5':
      return phaseId;
    default:
      return undefined;
  }
};

const getRoomProgress = (lab: UnifiedLab): number => {
  if (!lab.phaseId || !lab.id.startsWith('hpb:')) return 0;
  const roomId = lab.id.split(':')[2];
  const totalSteps = lab.lessonsCount;
  if (!roomId || !totalSteps) return 0;

  try {
    const raw = localStorage.getItem(`hpb_viewedSteps_${lab.phaseId}_${roomId}`);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return 0;
    const viewed = new Set(
      parsed.filter(
        (step): step is number =>
          Number.isInteger(step) && step >= 0 && step < totalSteps,
      ),
    );
    return Math.round((viewed.size / totalSteps) * 100);
  } catch {
    return 0;
  }
};

const LabsPage = () => {
  const { addToast } = useToast();
  const [bootcampLabs, setBootcampLabs] = useState<UnifiedLab[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadBootcampRooms = async () => {
      try {
        const { BOOTCAMP_CONFIG } = await import('@/features/student/constants/bootcampConfig');
        let course: BootcampCatalogueCourse | undefined;

        try {
          const response = await api.get(
            `/student/course?bootcampId=${encodeURIComponent(HACKER_PROTOCOL_BOOTCAMP_ID)}`,
          );
          course = response.data as BootcampCatalogueCourse;
        } catch {
          if (!cancelled) {
            addToast('Could not confirm bootcamp access. Rooms remain protected until access is available.', 'error');
          }
        }

        if (!cancelled) {
          setBootcampLabs(
            buildBootcampRoomLabs(BOOTCAMP_CONFIG, HACKER_PROTOCOL_BOOTCAMP_ID, course),
          );
        }
      } catch {
        if (!cancelled) addToast('Could not load bootcamp learning experiences.', 'error');
      }
    };

    void loadBootcampRooms();
    return () => {
      cancelled = true;
    };
  }, [addToast]);

  const labs = useMemo(() => [...UNIFIED_LABS, ...bootcampLabs], [bootcampLabs]);

  const items: LearningCatalogueItem[] = useMemo(
    () =>
      labs.map((lab: UnifiedLab) => {
        const progress =
          lab.source === 'content'
            ? getContentLabProgress(lab.id, lab.lessonsCount ?? 0)
            : lab.source === 'bootcamp'
              ? getRoomProgress(lab)
              : undefined;
        const isCompleted =
          lab.source === 'bootcamp' ? Boolean(lab.isCompleted) : progress === 100;
        const progressValue =
          lab.source === 'bootcamp' && !isCompleted
            ? Math.min(progress ?? 0, 99)
            : progress;
        const phaseVariant = getPhaseVariant(lab.phaseId);

        return {
          key: lab.id,
          id: lab.id,
          type: 'lab',
          to: lab.route,
          accentColor: lab.accentColor,
          difficulty: lab.difficulty,
          cpReward: lab.cpReward,
          title: lab.title,
          description: shortDescription(lab.description),
          duration: lab.estimatedMinutes ? `${lab.estimatedMinutes} min` : undefined,
          lessonsCount: lab.lessonsCount,
          tags:
            lab.source === 'bootcamp'
              ? lab.tags
              : lab.isNew
                ? ['New']
                : undefined,
          badge: phaseVariant ? (
            <HpbAvatar variant={phaseVariant} className="h-14 w-14 shrink-0" />
          ) : undefined,
          actionLabel: lab.isLocked
            ? 'Locked'
            : isCompleted
              ? 'Review'
              : progressValue && progressValue > 0
                ? 'Continue'
                : 'Start',
          progress:
            isCompleted ? 100 : progressValue && progressValue > 0 ? progressValue : undefined,
          muted: lab.isLocked,
        } satisfies LearningCatalogueItem;
      }),
    [labs],
  );

  const totalCpMin = labs.reduce(
    (sum, lab) => sum + (Number.parseInt(String(lab.cpReward ?? '').split('-')[0], 10) || 0),
    0,
  );
  const totalCpMax = labs.reduce(
    (sum, lab) =>
      sum + (Number.parseInt(String(lab.cpReward ?? '').split('-').pop() ?? '0', 10) || 0),
    0,
  );
  const firstAvailable = items.find((item) => !item.muted) ?? items[0];

  return (
    <div className="min-h-full bg-canvas">
      <SEO
        title="Labs"
        description="Find every QYVORA learning experience in one catalogue and open it directly."
        noindex
      />
      <PageBody spacing="sections">
        <PageHeader
          hideText
          kicker="QYVORA · Learning"
          title="Labs"
          description="Choose any learning experience and jump straight into it. Your progress stays available when you return."
          metadata={
            <span className="type-meta inline-flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-bold text-accent">{labs.length}</span> learning experiences ·{' '}
              <span className="font-bold text-text-primary">{totalCpMin}-{totalCpMax}</span> CP available
            </span>
          }
          actions={
            firstAvailable?.to ? (
              <Button to={firstAvailable.to}>Start First Lab</Button>
            ) : undefined
          }
        />

        <LearningCatalogue
          items={items}
          gridClassName="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
          showSearch
          searchPlaceholder="Search Labs…"
          filterLabel={(id) => (id === 'all' ? 'All levels' : id.charAt(0).toUpperCase() + id.slice(1))}
          renderItem={(item) => {
            if (item.id && PRACTICAL_LAB_IDS.has(item.id)) {
              return (
                <LabCard
                  id={item.id}
                  title={item.title}
                  description={item.description ?? ''}
                  difficulty={item.difficulty ?? 'beginner'}
                  cpReward={String(item.cpReward ?? '')}
                  route={item.to ?? ''}
                  accentColor={item.accentColor ?? ''}
                  tags={item.tags}
                />
              );
            }

            const { key, ...cardProps } = item;
            return <LearningCard key={key} {...cardProps} />;
          }}
          emptyTitle="No Labs found"
          emptyDescription="Try adjusting your search or filter criteria."
        />
      </PageBody>
    </div>
  );
};

export default LabsPage;
