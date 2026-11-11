import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark, BookmarkCheck, Sparkles } from 'lucide-react';
import { Card } from '@/shared/components/ui';
import FilterTabs from '@/shared/components/ui/FilterTabs';
import Button from '@/shared/components/ui/Button';
import CourseBadge from '@/shared/components/CourseBadge';
import HpbAvatar from '@/shared/components/HpbAvatar';
import LabBadge from '@/shared/components/LabBadge';
import type { UnifiedLab } from '@/features/student/data/labs';
import { LAB_FORMAT_SHORT_LABELS } from '@/features/student/data/labs';
import {
  RECENT_LABS_EVENT,
  SAVED_LABS_EVENT,
  getRecentLabIds,
  getSavedLabIds,
  toggleSavedLab,
} from '@/features/student/utils/savedLabs';

export interface MyLearningBootcamp {
  id: string;
  title: string;
  progress?: number;
  to: string;
  isActive: boolean;
}

interface MyLearningCardProps {
  bootcamps: MyLearningBootcamp[];
  labs: UnifiedLab[];
  progressById: Record<string, number | undefined>;
  bootcampsError?: boolean;
  activeLearningError?: boolean;
  onRetryBootcamps?: () => void;
}

type TabKey = 'current' | 'recent' | 'saved';
type LearningKind = 'course' | 'lab' | 'bootcamp';

interface LearningItem {
  id: string;
  title: string;
  to: string;
  kind: LearningKind;
  typeLabel: string;
  progress?: number;
  isNew?: boolean;
}

const LearningBookmarkButton = ({ id, title }: { id: string; title: string }) => {
  const [saved, setSaved] = useState(() => getSavedLabIds().includes(id));

  useEffect(() => {
    const sync = () => setSaved(getSavedLabIds().includes(id));
    window.addEventListener(SAVED_LABS_EVENT, sync);
    return () => window.removeEventListener(SAVED_LABS_EVENT, sync);
  }, [id]);

  return (
    <button
      type="button"
      onClick={() => setSaved(toggleSavedLab(id))}
      aria-label={saved ? `Remove ${title} from saved learning` : `Save ${title}`}
      aria-pressed={saved}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-text-muted transition-colors duration-[var(--dur-fast)] ease-[var(--ease-smooth)] hover:bg-surface-raised hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {saved ? <BookmarkCheck className="h-4 w-4 text-accent" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
};

export { LearningBookmarkButton };

const progressValue = (value?: number): number | undefined => (
  typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100
    ? Math.round(value)
    : undefined
);

const toLearningItem = (
  lab: UnifiedLab,
  progress?: number,
): LearningItem => ({
  id: lab.id,
  title: lab.title,
  to: lab.route,
  kind: lab.source === 'content' ? 'course' : 'lab',
  typeLabel: LAB_FORMAT_SHORT_LABELS[lab.format],
  progress: progressValue(progress),
  isNew: lab.isNew,
});

const toBootcampItem = (bootcamp: MyLearningBootcamp): LearningItem => ({
  id: `bootcamp:${bootcamp.id}`,
  title: bootcamp.title,
  to: bootcamp.to,
  kind: 'bootcamp',
  typeLabel: 'Bootcamp',
  progress: progressValue(bootcamp.progress),
});

const LearningIdentity = ({ item }: { item: LearningItem }) => {
  if (item.kind === 'course') {
    return <CourseBadge courseId={item.id} className="h-12 w-12 shrink-0 sm:h-[60px] sm:w-[60px]" glow={false} />;
  }
  if (item.kind === 'lab') {
    return <LabBadge labId={item.id} className="h-12 w-12 shrink-0 sm:h-[60px] sm:w-[60px]" glow={false} />;
  }
  return <HpbAvatar variant="phase1" size={60} className="h-12 w-12 shrink-0 sm:h-[60px] sm:w-[60px]" />;
};

const LearningRow = ({
  item,
  actionLabel,
}: {
  item: LearningItem;
  actionLabel: string;
}) => (
  <li className="group relative overflow-hidden rounded-xl border border-border-subtle bg-surface-raised/45 transition-[background-color,border-color,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-smooth)] hover:border-accent/30 hover:bg-accent/[0.055] focus-within:border-accent/40">
    <div className="flex min-w-0 items-center gap-1.5 p-3 sm:gap-2 sm:p-4">
      <Link
        to={item.to}
        className="group/link flex min-w-0 flex-1 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <LearningIdentity item={item} />
        <span className="min-w-0 flex-1">
          <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate text-sm font-bold leading-snug text-text-primary transition-colors group-hover/link:text-accent sm:text-base">
              {item.title}
            </span>
            <span className="shrink-0 text-[12px] font-medium text-text-muted">
              {item.typeLabel}
            </span>
            {item.isNew && (
              <span className="rounded-md bg-accent px-1.5 py-0.5 text-[12px] font-medium text-on-accent">
                New
              </span>
            )}
          </span>
          <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {item.progress !== undefined && (
              <>
                <span
                  className="h-1.5 w-20 overflow-hidden rounded-full bg-surface-raised"
                  role="progressbar"
                  aria-label={`${item.title} completion`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={item.progress}
                >
                  <span
                    className="block h-full rounded-full bg-accent transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-smooth)] motion-reduce:transition-none"
                    style={{ width: `${item.progress}%` }}
                  />
                </span>
                <span className="text-[12px] font-medium text-text-secondary">
                  {item.progress}% complete
                </span>
              </>
            )}
            <span className="inline-flex items-center gap-1 text-[12px] font-medium text-accent">
              {actionLabel} <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </span>
          </span>
        </span>
      </Link>
      <LearningBookmarkButton id={item.id} title={item.title} />
    </div>
  </li>
);

const EmptyState = ({
  title,
  description,
  action = 'Browse learning',
}: {
  title: string;
  description: string;
  action?: string;
}) => (
  <div className="py-4">
    <div className="flex items-start gap-3">
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
      <div>
        <p className="text-sm font-bold text-text-primary">{title}</p>
        <p className="mt-1 type-body-sm text-text-secondary">{description}</p>
        <Button to="/dashboard/labs" variant="secondary" size="sm" className="mt-3">
          {action}
        </Button>
      </div>
    </div>
  </div>
);

const MyLearningCard = ({
  bootcamps,
  labs,
  progressById,
  bootcampsError = false,
  activeLearningError = false,
  onRetryBootcamps,
}: MyLearningCardProps) => {
  const [tab, setTab] = useState<TabKey>('current');
  const [savedIds, setSavedIds] = useState<string[]>(() => getSavedLabIds());
  const [recentIds, setRecentIds] = useState<string[]>(() => getRecentLabIds());

  const sync = useCallback(() => {
    setSavedIds(getSavedLabIds());
    setRecentIds(getRecentLabIds());
  }, []);

  useEffect(() => {
    window.addEventListener(SAVED_LABS_EVENT, sync);
    window.addEventListener(RECENT_LABS_EVENT, sync);
    return () => {
      window.removeEventListener(SAVED_LABS_EVENT, sync);
      window.removeEventListener(RECENT_LABS_EVENT, sync);
    };
  }, [sync]);

  const currentItems = useMemo(() => [
    ...bootcamps.filter((bootcamp) => bootcamp.isActive).map(toBootcampItem),
    ...labs
      .filter((lab) => lab.source === 'content')
      .filter((lab) => {
        const progress = progressValue(progressById[lab.id]);
        return progress !== undefined && progress > 0 && progress < 100;
      })
      .map((lab) => toLearningItem(lab, progressById[lab.id])),
  ], [bootcamps, labs, progressById]);

  const itemsById = useMemo(() => {
    const map = new Map<string, LearningItem>();
    labs.forEach((lab) => map.set(lab.id, toLearningItem(lab, progressById[lab.id])));
    bootcamps.forEach((bootcamp) => map.set(`bootcamp:${bootcamp.id}`, toBootcampItem(bootcamp)));
    return map;
  }, [bootcamps, labs, progressById]);

  const recentItems = useMemo(
    () => recentIds.map((id) => itemsById.get(id)).filter((item): item is LearningItem => Boolean(item)),
    [recentIds, itemsById],
  );
  const savedItems = useMemo(
    () => savedIds.map((id) => itemsById.get(id)).filter((item): item is LearningItem => Boolean(item)),
    [savedIds, itemsById],
  );

  const tabs = [
    { key: 'current', label: 'Current', count: currentItems.length },
    { key: 'recent', label: 'Recent', count: recentItems.length },
    { key: 'saved', label: 'Saved', count: savedItems.length },
  ];

  return (
    <Card as="section" className="p-[var(--app-card-pad)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="type-h2 text-text-primary">My Learning</h2>
        <Button to="/dashboard/labs" variant="ghost" size="sm" className="shrink-0">
          View all
        </Button>
      </div>

      <FilterTabs
        tabs={tabs}
        activeKey={tab}
        onChange={(key) => setTab(key as TabKey)}
        size="sm"
        className="mb-3"
        idPrefix="my-learning"
        ariaLabel="My learning views"
      />

      <div
        id="my-learning-panel"
        role="tabpanel"
        aria-labelledby={`my-learning-tab-${tab}`}
        tabIndex={0}
        className="min-w-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {tab === 'current' && (
          <>
            {currentItems.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {currentItems.map((item) => (
                  <LearningRow key={item.id} item={item} actionLabel="Continue" />
                ))}
              </ul>
            ) : bootcampsError || activeLearningError ? (
              <div role="alert" className="py-4">
                <p className="text-sm font-bold text-text-primary">Current learning could not be confirmed</p>
                <p className="mt-1 type-body-sm text-text-secondary">
                  {bootcampsError && activeLearningError
                    ? 'Your progress and bootcamp catalogue could not be loaded.'
                    : bootcampsError
                      ? 'We could not load your bootcamp catalogue, so active bootcamp items cannot be confirmed.'
                      : 'Your progress data could not be loaded, so active bootcamp items cannot be confirmed.'}
                </p>
                {bootcampsError && onRetryBootcamps && (
                  <Button type="button" variant="secondary" size="sm" className="mt-3" onClick={onRetryBootcamps}>
                    Retry bootcamp data
                  </Button>
                )}
                <Button to="/dashboard/labs" variant="secondary" size="sm" className="mt-3">
                  Browse Labs
                </Button>
              </div>
            ) : (
              <EmptyState
                title="No active learning yet"
                description="Choose a Lab to get started. It will appear here once progress is recorded."
              />
            )}
            {currentItems.length > 0 && (bootcampsError || activeLearningError) && (
              <div role="status" className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border-subtle pt-3">
                <p className="type-meta">Some active learning could not be confirmed.</p>
                {bootcampsError && onRetryBootcamps && (
                  <Button type="button" variant="ghost" size="sm" onClick={onRetryBootcamps}>
                    Retry bootcamp data
                  </Button>
                )}
              </div>
            )}
          </>
        )}

        {tab === 'recent' && (
          recentItems.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {recentItems.map((item) => (
                <LearningRow key={item.id} item={item} actionLabel="Revisit" />
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No recent learning yet"
              description="Items you open will appear here, with the most recently visited first."
            />
          )
        )}

        {tab === 'saved' && (
          savedItems.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {savedItems.map((item) => (
                <LearningRow key={item.id} item={item} actionLabel="Open" />
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No saved learning yet"
              description="Bookmark any Lab or bootcamp to keep it here for later."
            />
          )
        )}
      </div>
    </Card>
  );
};

export default MyLearningCard;
