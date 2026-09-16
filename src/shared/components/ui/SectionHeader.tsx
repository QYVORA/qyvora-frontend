import React from 'react';
import { cn } from '@/shared/utils/cn';

interface SectionHeaderProps {
  kicker?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** One action group (primary first). */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Section title. Prefer composition/typography over a card around content.
 * Keep one primary action per section.
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  kicker,
  title,
  description,
  actions,
  className,
}) => (
  <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
    <div className="min-w-0">
      {kicker && (
        <p className="mb-1.5 type-label text-accent uppercase tracking-[0.12em]">{kicker}</p>
      )}
      <h2 className="type-h2 text-text-primary">{title}</h2>
      {description && <p className="mt-2 type-body-sm max-w-prose">{description}</p>}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
  </div>
);

export default SectionHeader;