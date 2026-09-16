import React from 'react';
import { cn } from '@/shared/utils/cn';

interface ProgressProps {
  value: number;
  max?: number;
  /** Accessible label for the progress bar. */
  label: string;
  showValue?: boolean;
  /** Compact sizing for dense rows. */
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Progress bar. Native semantics via role="progressbar"; green is reserved for
 * progress/success states. Value text is always available (not colour-only).
 */
const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showValue,
  size = 'md',
  className,
}) => {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  const complete = pct >= 100;
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="type-label text-text-secondary">{label}</span>
        {showValue && (
          <span className="type-meta tabular-nums">{Math.round(pct)}%</span>
        )}
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={showValue ? `${Math.round(pct)}%` : undefined}
        aria-label={label}
        className={cn(
          'mt-1.5 w-full overflow-hidden rounded-full bg-surface-raised border border-border-subtle',
          size === 'sm' ? 'h-1.5' : 'h-2.5',
        )}
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-[var(--dur-base)] ease-[var(--ease-smooth)]', complete ? 'bg-accent' : 'bg-accent/80')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default Progress;