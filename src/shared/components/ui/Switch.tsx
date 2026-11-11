import React from 'react';
import { cn } from '@/shared/utils/cn';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Accessible name. */
  label: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Bare app switch: 40×22 track, 16px thumb. Pair with a visible label via
 * `Toggle`. Rendered as a <button role="switch"> for native activation.
 */
const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  label,
  disabled,
  className,
}) => (
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
      className,
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
);

export default Switch;
