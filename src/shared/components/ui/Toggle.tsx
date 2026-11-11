import React from 'react';
import { cn } from '@/shared/utils/cn';

interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: React.ReactNode;
}

/**
 * Labelled switch row: label + description on the left, bare Switch on the
 * right. Keeps the `onCheckedChange` API.
 */
const Toggle: React.FC<ToggleProps> = ({
  checked,
  onCheckedChange,
  label,
  description,
  className,
  disabled,
}) => (
  <div className={cn('flex min-h-[44px] items-center gap-4 py-2', className)}>
    <span className="flex-1 min-w-0">
      <span className="block text-base font-medium text-text-primary">{label}</span>
      {description && (
        <span className="mt-0.5 block text-sm text-text-muted">{description}</span>
      )}
    </span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative inline-flex h-[22px] w-10 shrink-0 items-center rounded-full transition-colors',
        checked ? 'bg-accent' : 'bg-surface-raised border border-border-subtle',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:opacity-45 disabled:cursor-not-allowed',
      )}
    >
      <span
        className={cn(
          'absolute h-4 w-4 rounded-full bg-text-primary transition-all',
          checked ? 'left-[21px]' : 'left-[3px]',
        )}
        aria-hidden="true"
      />
    </button>
  </div>
);

export default Toggle;
