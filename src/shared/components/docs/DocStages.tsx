import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface DocStage {
  name: string;
  detail: string;
  /** Machine-readable event the stage emits, when it emits one. */
  emits?: string;
}

interface DocStagesProps {
  items: DocStage[];
  className?: string;
}

/**
 * DocStages — the pipeline, rendered as a numbered sequence.
 *
 * Deliberately a list, not a card grid: an ordered pipeline reads top to
 * bottom, and a row of tiles would break the order at small viewports while
 * forcing the reader to scan a strip of boxes.
 */
const DocStages: React.FC<DocStagesProps> = ({ items, className }) => {
  if (!items.length) return null;

  return (
    <ol className={cn('min-w-0 border-t border-border-subtle', className)}>
      {items.map((stage, index) => (
        <li
          key={stage.name}
          className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 border-b border-border-subtle py-3.5"
        >
          <span className="font-mono text-xs font-black tabular-nums text-accent" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-black uppercase tracking-wide text-text-primary">
              {stage.name}
            </p>
            <p className="mt-1 text-sm leading-[1.9] text-text-secondary">{stage.detail}</p>
            {stage.emits && (
              <p className="mt-1.5 font-mono text-xs text-text-muted">
                emits{' '}
                <span className="text-accent/80">{stage.emits}</span>
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
};

export default DocStages;
