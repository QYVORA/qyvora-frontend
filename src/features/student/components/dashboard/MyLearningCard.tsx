import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark, BookmarkCheck, BookOpen, GraduationCap, Play, Sparkles } from 'lucide-react';
import { CardBase as Card } from '@/shared/components/ui/Card';
import FilterTabs from '@/shared/components/ui/FilterTabs';
import Button from '@/shared/components/ui/Button';
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
  description: string;
  progress: number;
  to: string;
}

interface MyLearningCardProps {
  bootcamps: MyLearningBootcamp[];
  labs: UnifiedLab[];
  progressById: Record<string, number>;
}

type TabKey = 'current' | 'recent' | 'saved';

const DESCRIPTION_FALLBACK = 'Open this Lab to see its lessons, practical exercises and completion requirements.';

const BookmarkButton = ({ labId, title }: { labId: string; title: string }) => {
  const [saved, setSaved] = useState(() => getSavedLabIds().includes(labId));

  useEffect(() => {
    const sync = () => setSaved(getSavedLabIds().includes(labId));
    window.addEventListener(SAVED_LABS_EVENT, sync);
    return () => window.removeEventListener(SAVED_LABS_EVENT, sync);
  }, [labId]);

  return (
    <button
      type="button"
      onClick={() => setSaved(toggleSavedLab(labId))}
      aria-label={saved ? `Remove ${title} from saved Labs` : `Save ${title}`}
      aria-pressed={saved}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-subtle text-text-muted transition-colors hover:border-accent/40 hover:text-accent"
    >
      {saved ? <BookmarkCheck className="h-4 w-4 text-accent" /> : <Bookmark className="h-4 w-4" />}
    </button>
  );
};

const LearningRow = ({
  lab,
  progress,
  actionLabel,
}: {
  lab: UnifiedLab;
  progress?: number;
  actionLabel: string;
}) => (
  <li className="flex items-start gap-3 border-t border-border-subtle py-3 first:border-t-0 first:pt-0 last:pb-0">
    <Link
      to={lab.route}
      className="group flex min-w-0 flex-1 items-start gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
        <BookOpen className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-black leading-snug text-text-primary transition-colors group-hover:text-accent">
            {lab.title}
          </span>
          <span className="rounded-md border border-border-subtle px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-text-muted">
            {LAB_FORMAT_SHORT_LABELS[lab.format]}
          </span>
          {lab.isNew && (
            <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-on-accent">
              New
            </span>
          )}
        </span>
        <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-text-secondary">
          {lab.description || DESCRIPTION_FALLBACK}
        </span>
        {typeof progress === 'number' && progress > 0 && (
          <span className="mt-2 flex items-center gap-2">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-raised">
              <span
                className="block h-full rounded-full bg-accent"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </span>
            <span className="font-mono text-[10px] font-bold text-accent">{progress}%</span>
          </span>
        )}
        <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-accent">
          {actionLabel} <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </span>
      </span>
    </Link>
    <BookmarkButton labId={lab.id} title={lab.title} />
  </li>
);

/**
 * MyLearningCard — the student's current learning overview.
 *
 * Tabs: Current (active bootcamp + in-progress Labs), Recent (last opened Labs)
 * and Saved (locally bookmarked Labs). Every row links to the Lab's existing
 * learning page; nothing here replaces the walkthrough itself.
 */
const MyLearningCard = ({ bootcamps, labs, progressById }: MyLearningCardProps) => {
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

  const labById = useMemo(() => new Map(labs.map((lab) => [lab.id, lab])), [labs]);

  const currentLabs = useMemo(
    () => labs.filter((lab) => {
      const pct = progressById[lab.id] ?? 0;
      return pct > 0 && pct < 100;
    }),
    [labs, progressById],
  );

  const recommended = useMemo(
    () => labs.filter((lab) => lab.format !== 'hands-on').slice(0, 3),
    [labs],
  );

  const recentLabs = useMemo(() => {
    const ordered = recentIds.map((id) => labById.get(id)).filter((lab): lab is UnifiedLab => Boolean(lab));
    return ordered.length > 0 ? ordered.slice(0, 4) : recommended;
  }, [recentIds, labById, recommended]);

  const savedLabs = useMemo(
    () => savedIds.map((id) => labById.get(id)).filter((lab): lab is UnifiedLab => Boolean(lab)),
    [savedIds, labById],
  );

  const tabs = [
    { key: 'current', label: 'Current', count: currentLabs.length + bootcamps.length },
    { key: 'recent', label: 'Recent', count: recentLabs.length },
    { key: 'saved', label: 'Saved', count: savedLabs.length },
  ];

  return (
    <Card className="flex flex-col p-5 md:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="type-h2 text-text-primary">My Learning</h2>
          <p className="mt-1 type-body-sm text-text-secondary">
            Pick up where you left off or start a new Lab.
          </p>
        </div>
        <Button to="/dashboard/labs" variant="ghost" size="sm" className="shrink-0">
          View all
        </Button>
      </div>

      <FilterTabs
        tabs={tabs}
        activeKey={tab}
        onChange={(key) => setTab(key as TabKey)}
        size="sm"
        className="mb-4"
      />

      {tab === 'current' && (
        <div>
          {bootcamps.length > 0 && (
            <ul className="mb-2 space-y-3">
              {bootcamps.map((bootcamp) => (
                <li key={bootcamp.id} className="rounded-xl border border-border-subtle bg-surface-raised/40 p-3">
                  <Link to={bootcamp.to} className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                        <GraduationCap className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-black text-text-primary transition-colors group-hover:text-accent">
                            {bootcamp.title}
                          </span>
                          <span className="rounded-md border border-border-subtle px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-text-muted">
                            Programme
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-secondary">
                          {bootcamp.description}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-raised">
                            <span className="block h-full rounded-full bg-accent" style={{ width: `${Math.min(100, bootcamp.progress)}%` }} />
                          </span>
                          <span className="font-mono text-[10px] font-bold text-accent">{Math.round(bootcamp.progress)}%</span>
                        </div>
                        <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-accent">
                          Continue <ArrowRight className="h-3 w-3" aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {currentLabs.length > 0 ? (
            <ul className="mt-1">
              {currentLabs.slice(0, 3).map((lab) => (
                <LearningRow key={lab.id} lab={lab} progress={progressById[lab.id]} actionLabel="Continue" />
              ))}
            </ul>
          ) : bootcamps.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border-subtle p-4">
              <p className="text-sm font-bold text-text-primary">No active Lab yet</p>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                Start with a content Lab to build the fundamentals, then move into a hands-on Lab.
              </p>
              <ul className="mt-3">
                {recommended.slice(0, 2).map((lab) => (
                  <LearningRow key={lab.id} lab={lab} actionLabel="Start" />
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      {tab === 'recent' && (
        <ul>
          {recentLabs.map((lab) => (
            <LearningRow key={lab.id} lab={lab} progress={progressById[lab.id]} actionLabel="Revisit" />
          ))}
        </ul>
      )}

      {tab === 'saved' && (
        savedLabs.length > 0 ? (
          <ul>
            {savedLabs.map((lab) => (
              <LearningRow key={lab.id} lab={lab} progress={progressById[lab.id]} actionLabel="Open" />
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-border-subtle p-4 text-center">
            <Sparkles className="mx-auto mb-2 h-5 w-5 text-text-muted" aria-hidden="true" />
            <p className="text-sm font-bold text-text-primary">No saved Labs yet</p>
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">
              Use the bookmark button on any Lab to keep it here for later.
            </p>
            <Button to="/dashboard/labs" variant="secondary" size="sm" className="mt-3">
              Browse Labs
            </Button>
          </div>
        )
      )}

      {tab === 'recent' && recentIds.length > 0 && (
        <div className="mt-3 flex items-center gap-2 border-t border-border-subtle pt-3 text-[11px] font-black uppercase tracking-widest text-text-muted">
          <Play className="h-3 w-3 text-accent" aria-hidden="true" /> Recently opened Labs
        </div>
      )}
    </Card>
  );
};

export default MyLearningCard;
