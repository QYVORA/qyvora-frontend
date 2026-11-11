import React from 'react';
import { cn } from '@/shared/utils/cn';

interface RuleHeadingProps {
  children: React.ReactNode;
  /** Optional right-aligned action (e.g. "View all"). */
  action?: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * Subsection heading with a trailing hairline rule — replaces uppercase
 * overline blocks inside dashboard cards.
 */
const RuleHeading: React.FC<RuleHeadingProps> = ({ children, action, className, id }) => (
  <div className={cn('flex items-center gap-3', className)}>
    <h3 id={id} className="shrink-0 text-lg font-medium text-accent">
      {children}
    </h3>
    <span className="h-px flex-1 bg-border-subtle" aria-hidden="true" />
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export default RuleHeading;
