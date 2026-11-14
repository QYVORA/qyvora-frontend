import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Clock,
  FlaskConical,
  GraduationCap,
  Play,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/shared/components/ui';
import FilterTabs from '@/shared/components/ui/FilterTabs';
import Button from '@/shared/components/ui/Button';
import CourseBadge from '@/shared/components/CourseBadge';
import HpbAvatar from '@/shared/components/HpbAvatar';
import LabBadge from '@/shared/components/LabBadge';
import type { UnifiedLab } from '@/features/student/data/labs';
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
  description?: string;
  progress?: number;
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

const KIND_META: Record<LearningKind, { label: string; Icon: typeof BookOpen }> = {
  course: { label: 'Course', Icon: BookOpen },
  lab: { label: 'Lab', Icon: FlaskConical },
  bootcamp: { label: 'Bootcamp', Icon: GraduationCap },
};

const toLearningItem = (
  lab: UnifiedLab,
  progress?: number,
): LearningItem => ({
  id: lab.id,
  title: lab.title,
  to: lab.route,
  kind: lab.source === 'content' ? 'course' : 'lab',
  description: lab.description,
  progress: progressValue(progress),
});

const toBootcampItem = (bootcamp: MyLearningBootcamp): LearningItem => ({
  id: `bootcamp:${bootcamp.id}`,
  title: bootcamp.title,
  to: bootcamp.to,
  kind: 'bootcamp',
  description: 'Continue your bootcamp training',
  progress: progressValue(bootcamp.progress),
});

const LearningIdentity = ({ item }: { item: LearningItem }) => (
  <span
    className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-subtle bg-surface-raised p-2"
    aria-hidden="true"
  >
    {item.kind === 'course' ? (
      <CourseBadge courseId={item.id} className="h-full w-full object-contain" glow={false} />
    ) : item.kind === 'lab' ? (
      <LabBadge labId={item.id} className="h-full w-full object-contain" glow={false} />
    ) : (
      <HpbAvatar variant="phase1" size={64} className="h-full w-full object-contain" />
    )}
  </span>
);

const rowLinkClasses =
  'group flex min-w-0 items-center gap-4 rounded-md p-3 transition-colors duration-[var(--dur-fast)] ease-[var(--ease-smooth)] hover:bg-surface-raised/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:gap-5 sm:p-4';

const KindBadge = ({ kind }: { kind: LearningKind }) => {
  const { label, Icon } = KIND_META[kind];
  return (
    <span
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-surface-raised text-text-secondary"
      title={label}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
};

const ProgressInline = ({ value, label }: { value?: number; label: string }) => {
  if (value === undefined) return null;
  return (
    <span className="flex shrink-0 items-center gap-2">
      <span
        className="h-1.5 w-20 overflow-hidden rounded-full bg-surface-raised"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <span
          className="block h-full rounded-full bg-accent transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-smooth)] motion-reduce:transition-none"
          style={{ width: `${value}%` }}
        />
      </span>
      <span className="font-mono text-xs font-bold tabular-nums text-accent">{value}%</span>
    </span>
  );
};

const RowBody = ({ item, progress = false }: { item: LearningItem; progress?: boolean }) => (
  <span className="min-w-0 flex-1">
    <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
      <span className="min-w-0 truncate text-base font-bold leading-snug text-text-primary transition-colors group-hover:text-accent sm:text-lg">
        {item.title}
      </span>
      <KindBadge kind={item.kind} />
      {progress && (
        <ProgressInline value={item.progress} label={`${item.title} completion`} />
      )}
    </span>
    {item.description && (
      <span className="mt-1 block line-clamp-2 text-sm leading-relaxed text-text-secondary">
        {item.description}
      </span>
    )}
  </span>
);

const LearningRow = ({ item }: { item: LearningItem }) => (
  <li className="min-w-0">
    <Link to={item.to} className={rowLinkClasses}>
      <LearningIdentity item={item} />
      <RowBody item={item} />
    </Link>
  </li>
);

const BootcampHeading = ({ item }: { item: LearningItem }) => (
  <li className="min-w-0">
    <Link to={item.to} className={rowLinkClasses}>
      <LearningIdentity item={item} />
      <RowBody item={item} progress />
    </Link>
  </li>
);

const GroupHeading = ({
  id,
  title,
  progress,
}: {
  id: string;
  title: string;
  progress?: number;
}) => (
  <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1 px-3 sm:px-4">
    <h3 id={id} className="text-base font-bold text-text-primary sm:text-lg">
      {title}
    </h3>
    <ProgressInline value={progress} label={`${title} completion`} />
  </div>
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
    { key: 'current', label: 'Current', count: currentItems.length, icon: <Play className="h-4 w-4" aria-hidden="true" /> },
    { key: 'recent', label: 'Recent', count: recentItems.length, icon: <Clock className="h-4 w-4" aria-hidden="true" /> },
    { key: 'saved', label: 'Saved', count: savedItems.length, icon: <Bookmark className="h-4 w-4" aria-hidden="true" /> },
  ];

  const bootcampItems = currentItems.filter((item) => item.kind === 'bootcamp');
  const labItems = currentItems.filter((item) => item.kind !== 'bootcamp');
  const labProgressValues = labItems
    .map((item) => item.progress)
    .filter((value): value is number => value !== undefined);
  const labProgress = labProgressValues.length > 0
    ? Math.round(labProgressValues.reduce((sum, value) => sum + value, 0) / labProgressValues.length)
    : undefined;
  const activeCount = tab === 'current'
    ? currentItems.length
    : tab === 'recent'
      ? recentItems.length
      : savedItems.length;

  return (
    <Card as="section" className="p-[var(--app-card-pad)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <h2 className="type-h2 text-text-primary">My Learning</h2>
        <FilterTabs
          variant="underline"
          tabs={tabs}
          activeKey={tab}
          onChange={(key) => setTab(key as TabKey)}
          idPrefix="my-learning"
          ariaLabel="My learning views"
        />
      </div>

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
              <div className="space-y-5">
                {bootcampItems.length > 0 && (
                  <ul className="flex flex-col gap-1">
                    {bootcampItems.map((item) => (
                      <BootcampHeading key={item.id} item={item} />
                    ))}
                  </ul>
                )}
                {labItems.length > 0 && (
                  <section aria-labelledby="my-learning-labs-heading">
                    <GroupHeading
                      id="my-learning-labs-heading"
                      title="Labs & courses"
                      progress={labProgress}
                    />
                    <ul className="flex flex-col gap-1">
                      {labItems.map((item) => (
                        <LearningRow key={item.id} item={item} />
                      ))}
                    </ul>
                  </section>
                )}
              </div>
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
            <ul className="flex flex-col gap-1">
              {recentItems.map((item) => (
                <LearningRow key={item.id} item={item} />
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
            <ul className="flex flex-col gap-1">
              {savedItems.map((item) => (
                <LearningRow key={item.id} item={item} />
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

      {activeCount > 0 && (
        <div className="mt-4 flex justify-end border-t border-border-subtle pt-3">
          <Button to="/dashboard/labs" variant="ghost" size="sm">
            View all
          </Button>
        </div>
      )}
    </Card>
  );
};

export default MyLearningCard;
