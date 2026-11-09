import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { CardBase as Card } from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import FilterTabs from '@/shared/components/ui/FilterTabs';
import LabBadge from '@/shared/components/LabBadge';
import { DifficultyBadge } from '@/shared/components/learning/LearningCard';
import type { UnifiedLab } from '@/features/student/data/labs';
import { markLabRecent } from '@/features/student/utils/savedLabs';

interface NewLabsCardProps {
  labs: UnifiedLab[];
}

type TabKey = 'recommended' | 'new';

/**
 * NewLabsCard — one organized Lab discovery container.
 *
 * "Recommended" surfaces foundational content/hybrid Labs; "New" surfaces the
 * recently published practical Labs from the QOSE lab matrix. Selecting a Lab
 * navigates to its existing learning route and records it as recently opened.
 */
const NewLabsCard = ({ labs }: NewLabsCardProps) => {
  const [tab, setTab] = useState<TabKey>('recommended');

  const recommended = useMemo(
    () => labs.filter((lab) => lab.format !== 'hands-on').slice(0, 3),
    [labs],
  );
  const fresh = useMemo(
    () => {
      const newLabs = labs.filter((lab) => lab.isNew);
      return (newLabs.length > 0 ? newLabs : labs.filter((lab) => lab.format === 'hands-on')).slice(0, 3);
    },
    [labs],
  );

  const visible = tab === 'recommended' ? recommended : fresh;

  return (
    <Card className="flex flex-col p-5 md:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="type-h2 text-text-primary">Discover Labs</h2>
          <p className="mt-1 type-body-sm text-text-secondary">
            Find a Lab, open it, learn, practise and complete.
          </p>
        </div>
        <Button to="/dashboard/labs" variant="ghost" size="sm" className="shrink-0">
          All Labs
        </Button>
      </div>

      <FilterTabs
        tabs={[
          { key: 'recommended', label: 'Recommended', count: recommended.length },
          { key: 'new', label: 'New Labs', count: fresh.length },
        ]}
        activeKey={tab}
        onChange={(key) => setTab(key as TabKey)}
        size="sm"
        className="mb-4"
      />

      <ul className="space-y-2.5">
        {visible.map((lab) => (
          <li key={lab.id}>
            <Link
              to={lab.route}
              onClick={() => markLabRecent(lab.id)}
              className="group flex items-start gap-3 rounded-xl border border-border-subtle bg-surface-raised/40 p-3 transition-colors hover:border-accent/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <LabBadge labId={lab.id} accentColor={lab.accentColor} className="h-11 w-11 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-sm font-black leading-snug text-text-primary transition-colors group-hover:text-accent">
                    {lab.title}
                  </span>
                  {lab.isNew && (
                    <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-on-accent">
                      New
                    </span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-secondary">
                  {lab.description}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <DifficultyBadge difficulty={lab.difficulty} />
                  {lab.cpReward && (
                    <span className="font-mono text-[10px] font-black uppercase tracking-widest text-accent">
                      {lab.cpReward} CP
                    </span>
                  )}
                  {lab.lessonsCount !== undefined && (
                    <span className="font-mono text-[10px] text-text-muted">
                      {lab.lessonsCount} lessons
                    </span>
                  )}
                </div>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-text-muted transition-colors group-hover:text-accent" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-2 border-t border-border-subtle pt-3 text-[11px] font-black uppercase tracking-widest text-text-muted">
        <Compass className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
        {tab === 'recommended' ? 'Recommended for your path' : 'Recently published Labs'}
      </div>
    </Card>
  );
};

export default NewLabsCard;
