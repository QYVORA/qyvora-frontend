import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { Card } from '@/shared/components/ui';
import Button from '@/shared/components/ui/Button';
import FilterTabs from '@/shared/components/ui/FilterTabs';
import LabBadge from '@/shared/components/LabBadge';
import { DifficultyBadge } from '@/shared/components/learning/LearningCard';
import { LAB_FORMAT_LABELS, type UnifiedLab } from '@/features/student/data/labs';
import {
  RECENT_LABS_EVENT,
  getRecentLabIds,
} from '@/features/student/utils/savedLabs';
import { LearningBookmarkButton } from './MyLearningCard';

interface NewLabsCardProps {
  labs: UnifiedLab[];
  excludeLabIds?: string[];
}

type TabKey = 'recommended' | 'new';

const NewLabsCard = ({ labs, excludeLabIds = [] }: NewLabsCardProps) => {
  const [tab, setTab] = useState<TabKey>('recommended');
  const [recentIds, setRecentIds] = useState<string[]>(() => getRecentLabIds());

  useEffect(() => {
    const syncRecent = () => setRecentIds(getRecentLabIds());
    window.addEventListener(RECENT_LABS_EVENT, syncRecent);
    return () => window.removeEventListener(RECENT_LABS_EVENT, syncRecent);
  }, []);

  const excludedIds = useMemo(
    () => new Set([...excludeLabIds, ...recentIds]),
    [excludeLabIds, recentIds],
  );
  const recommended = useMemo(
    () => labs
      .filter((lab) => lab.format !== 'hands-on' && !excludedIds.has(lab.id))
      .slice(0, 3),
    [labs, excludedIds],
  );
  const hasContentLabs = labs.some((lab) => lab.format !== 'hands-on');
  const fresh = useMemo(
    () => labs.filter((lab) => lab.isNew && !excludedIds.has(lab.id)).slice(0, 3),
    [labs, excludedIds],
  );

  const visible = tab === 'recommended' ? recommended : fresh;

  return (
    <Card as="section" className="flex flex-col p-[var(--app-card-pad)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="type-h2 text-text-primary">Discover Labs</h2>
        <Button to="/dashboard/labs" variant="ghost" size="sm" className="shrink-0">
          All Labs
        </Button>
      </div>

      <FilterTabs
        tabs={[
          { key: 'recommended', label: 'Content Labs', count: recommended.length },
          { key: 'new', label: 'New Labs', count: fresh.length },
        ]}
        activeKey={tab}
        onChange={(key) => setTab(key as TabKey)}
        size="sm"
        className="mb-3"
      />

      {visible.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {visible.map((lab) => (
            <li
              key={lab.id}
              className="group relative rounded-xl transition-colors duration-[var(--dur-fast)] ease-[var(--ease-smooth)] hover:bg-surface-raised/50 focus-within:bg-surface-raised/50"
            >
              <div className="flex min-w-0 items-start gap-2 p-3 sm:gap-3 sm:p-4">
                <Link
                  to={lab.route}
                  className="flex min-w-0 flex-1 items-start gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:gap-4"
                >
                  <LabBadge
                    labId={lab.id}
                    accentColor={lab.accentColor}
                    className="h-16 w-16 shrink-0 sm:h-20 sm:w-20"
                    glow={false}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-text-tertiary">
                        {LAB_FORMAT_LABELS[lab.format]}
                      </span>
                      {lab.isNew && (
                        <span className="rounded-md bg-accent px-1.5 py-0.5 text-[12px] font-medium text-on-accent">
                          New
                        </span>
                      )}
                    </span>
                    <span className="mt-1 flex min-w-0 items-start gap-2">
                      <span className="min-w-0 text-base font-bold leading-snug text-text-primary transition-colors group-hover:text-accent sm:text-lg">
                        {lab.title}
                      </span>
                      <ArrowRight
                        className="mt-1 h-4 w-4 shrink-0 text-text-tertiary transition-colors group-hover:text-accent"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-1.5 line-clamp-2 text-sm leading-6 text-text-secondary">
                      {lab.description}
                    </span>
                    <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      {lab.difficulty && <DifficultyBadge difficulty={lab.difficulty} />}
                      {lab.cpReward && (
                        <span className="text-[12px] font-medium text-text-muted">
                          {lab.cpReward} CP
                        </span>
                      )}
                      {lab.lessonsCount !== undefined && (
                        <span className="text-[12px] text-text-muted">
                          {lab.lessonsCount} lessons
                        </span>
                      )}
                      {lab.estimatedMinutes !== undefined && (
                        <span className="text-[12px] text-text-muted">
                          {lab.estimatedMinutes} min
                        </span>
                      )}
                    </span>
                  </span>
                </Link>
                <LearningBookmarkButton id={lab.id} title={lab.title} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-4 type-body-sm text-text-secondary">
          {tab === 'new'
            ? 'There are no new Labs to show right now.'
            : hasContentLabs
              ? 'You have opened these Content Labs recently. Browse all Labs to find another.'
              : 'No Content Labs are available right now.'}
        </p>
      )}

      <div className="mt-3 flex items-center gap-2 border-t border-border-subtle pt-3 text-sm font-medium text-text-muted">
        <Compass className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
        {tab === 'recommended' ? 'Content Labs' : 'Recently published Labs'}
      </div>
    </Card>
  );
};

export default NewLabsCard;
