import React from 'react';
import { cn } from '@/shared/utils/cn';
import { Card } from './Card';

interface SectionCardProps {
  title: React.ReactNode;
  /** Leading icon, rendered accent at 20px. */
  icon?: React.ReactNode;
  /** Right-aligned action slot. */
  actions?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  id?: string;
  as?: 'section' | 'div' | 'article';
}

/**
 * Canonical app section card: title row (icon + h2 + actions) then body.
 * Replaces ad-hoc module-header blocks.
 */
const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon,
  actions,
  description,
  children,
  className,
  bodyClassName,
  id,
  as = 'section',
}) => (
  <Card as={as} id={id} className={cn('p-[var(--app-card-pad)]', className)}>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        {icon && <span className="shrink-0 text-accent [&_svg]:h-5 [&_svg]:w-5">{icon}</span>}
        <div className="min-w-0">
          <h2 className="type-h2 text-text-primary">{title}</h2>
          {description && <p className="mt-1 text-sm text-text-muted">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
    <div className={cn('min-w-0', bodyClassName)}>{children}</div>
  </Card>
);

export default SectionCard;
