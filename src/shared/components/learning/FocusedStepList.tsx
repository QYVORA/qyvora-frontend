import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Lock, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

/**
 * FocusedStepList — a "focused step" learning presentation.
 *
 * Only the active item is fully expanded and visually dominant. Completed items
 * collapse to compact "done" rows and upcoming items to compact "next" rows, so
 * the learner always knows where they are, what is done, and what comes next,
 * without a long vertical document.
 *
 * All items are still rendered on the SAME page/route (the active index simply
 * changes which one is expanded), preserving deep links, query params and the
 * "one page walkthrough" invariant. The active item receives a scroll target id
 * of `${idPrefix}-${number}` so navigation can scrollIntoView to it.
 */

export interface FocusedStepListItem {
  index: number;
  number: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  isLocked?: boolean;
  /** arbitrary meta rendered in the collapsed row (e.g. bookmark / quiz badges) */
  meta?: React.ReactNode;
}

export interface FocusedStepListProps {
  items: FocusedStepListItem[];
  /** renders the fully expanded content for the active item */
  renderActive: (index: number) => React.ReactNode;
  onSelect: (index: number) => void;
  /** scroll-target prefix -> active container gets id `${idPrefix}-${number}` */
  idPrefix?: string;
  className?: string;
  expandedClassName?: string;
}

interface FocusedStepRowProps {
  item: FocusedStepListItem;
  onSelect: (index: number) => void;
}

function FocusedStepRow({ item, onSelect }: FocusedStepRowProps) {
  const { t } = useTranslation();
  const locked = !!item.isLocked;
  const statusText = locked
    ? t('learning.focused.locked', 'Locked')
    : item.isCompleted
    ? t('learning.focused.done', 'Done')
    : t('learning.focused.upcoming', 'Next');

  return (
    <button
      type="button"
      onClick={() => onSelect(item.index)}
      disabled={locked}
      aria-label={`${String(item.number).padStart(2, '0')} ${item.title}${locked ? ` — ${statusText}` : ''}`}
      className={cn(
        'group w-full flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors min-h-[48px]',
        locked
          ? 'border-border/30 bg-bg-card/40 cursor-not-allowed'
          : 'border-border/50 bg-bg-card hover:border-accent/40 hover:bg-accent-dim/5 cursor-pointer',
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border font-mono text-sm font-black transition-colors',
          item.isCompleted
            ? 'border-accent/40 bg-accent-dim/20 text-accent'
            : 'border-border bg-bg-elevated text-text-muted',
        )}
        aria-hidden="true"
      >
        {item.isCompleted ? <Check className="h-4 w-4" /> : String(item.number).padStart(2, '0')}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'block truncate text-sm font-bold transition-colors',
            locked ? 'text-text-muted' : 'text-text-primary',
          )}
        >
          {item.title}
        </span>
        <span className="block text-[9px] font-black uppercase tracking-widest text-accent">
          {statusText}
        </span>
      </span>

      {item.meta}

      {!locked && (
        <ChevronRight
          className="h-4 w-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
          aria-hidden="true"
        />
      )}
      {locked && <Lock className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />}
    </button>
  );
}

const FocusedStepList: React.FC<FocusedStepListProps> = ({
  items,
  renderActive,
  onSelect,
  idPrefix = 'step',
  className,
  expandedClassName,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item) => {
        if (item.isActive) {
          return (
            <section
              key={item.index}
              id={`${idPrefix}-${item.number}`}
              className={cn('scroll-mt-20 md:scroll-mt-24', expandedClassName)}
            >
              {renderActive(item.index)}
            </section>
          );
        }
        return <FocusedStepRow key={item.index} item={item} onSelect={onSelect} />;
      })}
    </div>
  );
};

export default FocusedStepList;
