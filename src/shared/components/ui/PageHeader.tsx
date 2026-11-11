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
  /** `id` for the `h1` so an ancestor section can reference it via `aria-labelledby`. */
  titleId?: string;
  className?: string;
  /**
   * Student surfaces use the topbar as the visual section marker. Hiding the
   * textual heading keeps the page title for assistive technology while leaving
   * only the factual metadata and actions visible.
   */
  hideText?: boolean;
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
  titleId,
  className,
  hideText = false,
}) => {
  if (hideText) {
    return (
      <div className={cn('flex flex-wrap items-center justify-between gap-3', className)}>
        <h1 id={titleId} className="sr-only">
          {title}
        </h1>
        {metadata && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">{metadata}</div>
        )}
        {actions && (
          <div className="ml-auto flex flex-wrap items-center gap-3">{actions}</div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {kicker && (
            <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.12em] text-accent">{kicker}</p>
          )}
          <h1
            id={titleId}
            className="text-3xl font-bold text-text-primary md:text-4xl lg:text-5xl"
          >
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-2xl text-base text-text-secondary md:text-lg">{description}</p>
          )}
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
};

export default PageHeader;