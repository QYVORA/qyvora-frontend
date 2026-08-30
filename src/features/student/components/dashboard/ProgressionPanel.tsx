import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Award } from 'lucide-react';
import type { ProgressionStats } from '@/shared/types/profile';
import { IconRank } from '@/shared/components/icons';

/**
 * ProgressionPanel — shows the backend-driven rank + progression bar and, on
 * interaction (hover on desktop / tap on mobile), reveals a tier breakdown.
 * All rank names/thresholds come from the backend, never hardcoded here.
 */
interface ProgressionPanelProps {
  progression?: ProgressionStats | null;
  fallbackLabel?: string;
}

export const ProgressionPanel = ({ progression, fallbackLabel }: ProgressionPanelProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const hasData = Boolean(progression);
  const currentLabel = progression?.rank || fallbackLabel || '';
  const progress = progression ? Math.max(0, Math.min(100, progression.progress || 0)) : 0;
  const points = progression?.points ?? 0;
  const nextName = progression?.next?.name ?? null;
  const pointsToNext = progression?.pointsToNext ?? null;
  const capped = Boolean(progression?.capped);

  return (
    <div className="rounded-2xl border border-accent/20 bg-bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="w-full p-6 md:p-8 lg:p-10 text-left"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted">
            <Award size={16} className="text-accent" />
            {capped
              ? t('student.dashboard.rank')
              : t('heading.target')}
            {nextName && !capped && (
              <span className="text-accent">{nextName}</span>
            )}
          </span>
          <span className="flex items-center gap-2">
            <span className="font-mono text-sm font-black text-accent">
              {points > 0 ? points.toLocaleString() : progress}%
            </span>
            <span className="text-text-muted">
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </span>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-lg md:text-xl font-black uppercase tracking-tight text-text-primary">
            {currentLabel}
          </span>
          {!capped && progression?.next && (
            <span className="text-[10px] font-mono text-text-muted/70">
              {points.toLocaleString()}/{progression.next.points.toLocaleString()}
            </span>
          )}
        </div>

        <div className="h-3 rounded-full bg-accent-dim/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-700"
            style={{ width: `${progress}%`, transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-text-muted/60">
          <span className="flex items-center gap-2">
            <IconRank size={12} className="text-accent" />
            {currentLabel}
          </span>
          {nextName && !capped && (
            <span>{pointsToNext?.toLocaleString()} {t('student.progression.pointsToNext', 'pts to next')}</span>
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-6 md:px-8 lg:px-10 border-t border-border/40 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-bg-elevated p-4">
              <span className="block text-[10px] font-black uppercase tracking-widest text-text-muted">
                {t('student.progression.points', 'Progression Points')}
              </span>
              <span className="mt-1 block font-mono text-xl font-black text-accent">
                {points.toLocaleString()}
              </span>
            </div>
            <div className="rounded-xl bg-bg-elevated p-4">
              <span className="block text-[10px] font-black uppercase tracking-widest text-text-muted">
                {t('student.progression.currentRank', 'Current Rank')}
              </span>
              <span className="mt-1 block font-mono text-xl font-black text-text-primary">
                {currentLabel || '—'}
              </span>
            </div>
            <div className="rounded-xl bg-bg-elevated p-4">
              <span className="block text-[10px] font-black uppercase tracking-widest text-text-muted">
                {capped
                  ? t('student.progression.capped', 'Max Rank')
                  : t('student.progression.nextRank', 'Next Rank')}
              </span>
              <span className="mt-1 block font-mono text-xl font-black text-text-primary">
                {capped ? '—' : (nextName ?? '—')}
              </span>
              {!capped && pointsToNext !== null && (
                <span className="mt-1 block text-[10px] font-mono text-text-muted/70">
                  {pointsToNext.toLocaleString()} {t('student.progression.remaining', 'remaining')}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressionPanel;
