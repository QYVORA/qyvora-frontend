import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface EmptyStateProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Shared empty state. Dashed quiet surface, text instead of decoration, and an
 * optional single action. Not a mystery — the title says what is missing.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon,
  className,
}) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border-subtle bg-surface/50 px-6 py-12 text-center',
      className,
    )}
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border-subtle bg-surface-raised text-text-tertiary">
      {icon ?? <Inbox className="h-5 w-5" aria-hidden="true" />}
    </div>
    <div className="space-y-1">
      <p className="text-base font-medium text-text-primary">{title}</p>
      {description && <p className="type-body-sm max-w-sm">{description}</p>}
    </div>
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default EmptyState;