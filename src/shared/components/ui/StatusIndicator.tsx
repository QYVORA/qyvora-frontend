import React from 'react';
import { cn } from '@/shared/utils/cn';

export type StatusTone =
  | 'idle'
  | 'running'
  | 'success'
  | 'warning'
  | 'error'
  | 'locked';

interface StatusIndicatorProps {
  status: StatusTone;
  /** Optional factual label; always pair with the dot. */
  label?: React.ReactNode;
  /** Pulses while a background state is active (running/connecting). */
  pulse?: boolean;
  className?: string;
}

const DOT_STYLES: Record<StatusTone, string> = {
  idle: 'bg-text-tertiary',
  running: 'bg-semantic-info',
  success: 'bg-accent',
  warning: 'bg-semantic-warning',
  error: 'bg-semantic-danger',
  locked: 'bg-text-tertiary',
};

const LABEL_STYLES: Record<StatusTone, string> = {
  idle: 'text-text-tertiary',
  running: 'text-semantic-info',
  success: 'text-accent',
  warning: 'text-semantic-warning',
  error: 'text-semantic-danger',
  locked: 'text-text-tertiary',
};

/**
 * Compact connection/state indicator. Dot + label; colour is paired with text.
 * Announce state changes via the wrapping live region when label changes.
 */
const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label, pulse, className }) => (
  <span
    className={cn('inline-flex items-center gap-2', className)}
    aria-label={typeof label === 'string' ? label : undefined}
  >
    <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
      {pulse && status === 'running' && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-semantic-info opacity-60" />
      )}
      <span className={cn('relative inline-flex h-2.5 w-2.5 rounded-full', DOT_STYLES[status])} />
    </span>
    {label && <span className={cn('type-label', LABEL_STYLES[status])}>{label}</span>}
  </span>
);

export default StatusIndicator;