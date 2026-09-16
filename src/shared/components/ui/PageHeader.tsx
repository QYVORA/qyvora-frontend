import React from 'react';
import { cn } from '@/shared/utils/cn';

interface PageHeaderProps {
  /** Optional tiny uppercase eyebrow. */
  kicker?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Secondary actions rendered right-aligned on desktop, below on mobile. */
  actions?: React.ReactNode;
  /** Factual metadata row (e.g. updated date, scope). */
  metadata?: React.ReactNode;
  className?: string;
}

/**
 * Compact content-height page header. One title, one primary action intent;
 * description stays subordinate. Used by migrated app/public/doc pages.
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  kicker,
  title,
  description,
  actions,
  metadata,
  className,
}) => (
  <div className={cn('flex flex-col gap-6', className)}>
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        {kicker && (
          <p className="mb-2 type-label text-accent uppercase tracking-[0.12em]">{kicker}</p>
        )}
        <h1 className="type-h1 text-text-primary">{title}</h1>
        {description && <p className="mt-3 type-body max-w-prose">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
    {metadata && (
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border-subtle pt-4">
        {metadata}
      </div>
    )}
  </div>
);

export default PageHeader;