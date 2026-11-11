import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { Card } from '@/shared/components/ui';
import Button from '@/shared/components/ui/Button';
import FilterTabs from '@/shared/components/ui/FilterTabs';
import LabBadge from '@/shared/components/LabBadge';
import { DifficultyBadge } from '@/shared/components/learning/LearningCard';
import type { UnifiedLab } from '@/features/student/data/labs';
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
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((lab) => (
            <li key={lab.id} className="min-w-0 rounded-md border border-border-subtle bg-surface-raised/40 p-3">
              <div className="flex min-w-0 items-center gap-2">
                <Link
                  to={lab.route}
                  className="group flex min-w-0 flex-1 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <LabBadge
                    labId={lab.id}
                    accentColor={lab.accentColor}
                    className="h-14 w-14 shrink-0 sm:h-16 sm:w-16"
                    glow={false}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="truncate text-sm font-bold leading-snug text-text-primary transition-colors group-hover:text-accent">
                        {lab.title}
                      </span>
                      {lab.isNew && (
                        <span className="rounded-md bg-accent px-1.5 py-0.5 text-[12px] font-medium text-on-accent">
                          New
                        </span>
                      )}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <DifficultyBadge difficulty={lab.difficulty} />
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
                      <span className="inline-flex items-center gap-1 text-[12px] font-medium text-accent">
                        Open <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </span>
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
