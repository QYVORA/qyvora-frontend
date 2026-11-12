import React from 'react';
import { cn } from '@/shared/utils/cn';
import { Card } from './Card';

export interface StatStripCell {
  key?: string;
  value: React.ReactNode;
  label: React.ReactNode;
  icon?: React.ReactNode;
  accent?: boolean;
}

interface StatStripProps {
  cells: StatStripCell[];
  className?: string;
  /** Accessible label for the group. */
  label?: string;
}

/**
 * One card with N equal cells separated by 1px rules. Wraps to 2-up on small
 * screens without breaking the divider logic.
 */
const StatStrip: React.FC<StatStripProps> = ({ cells, className, label }) => (
  <Card className={cn('overflow-hidden', className)}>
    <dl
      className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(0,1fr))]"
      aria-label={label}
    >
      {cells.map((cell, index) => (
        <div
          key={cell.key ?? index}
          className={cn(
            'flex flex-col items-center justify-center gap-1 px-4 py-[var(--app-card-pad,20px)] text-center min-w-0',
            'border-border-subtle',
            index > 0 && 'border-t sm:border-t-0',
            index % 2 === 1 && 'border-l',
            index > 0 && 'sm:border-l',
          )}
        >
          {cell.icon && <span className="text-accent [&_svg]:h-4 [&_svg]:w-4 shrink-0">{cell.icon}</span>}
          <dd
            className={cn(
              'truncate type-h2 tabular-nums leading-none w-full',
              cell.accent ? 'text-accent' : 'text-text-primary',
            )}
          >
            {cell.value}
          </dd>
          <dt className="truncate text-sm text-text-muted">{cell.label}</dt>
        </div>
      ))}
    </dl>
  </Card>
);

export default StatStrip;
