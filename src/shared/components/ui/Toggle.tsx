import React from 'react';
import { cn } from '@/shared/utils/cn';

interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: React.ReactNode;
}

/**
 * Accessible switch. Rendered from a <button role="switch"> so it carries
 * native Enter/Space activation and a real aria-checked state.
 */
const Toggle: React.FC<ToggleProps> = ({
  checked,
  onCheckedChange,
  label,
  description,
  className,
  disabled,
  ...props
}) => {
  const control = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative h-[26px] w-[46px] shrink-0 rounded-full transition-colors',
        checked ? 'bg-accent' : 'bg-surface-raised border border-border-subtle',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:opacity-45 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-all',
          checked ? 'left-[25px]' : 'left-[3px]',
        )}
      />
    </button>
  );

  return (
    <label className="flex min-h-[44px] cursor-pointer items-center gap-4 rounded-lg p-1">
      <span className="flex-1">
        <span className="block text-body-sm text-text-primary">{label}</span>
        {description && <span className="mt-0.5 block type-meta">{description}</span>}
      </span>
      {control}
    </label>
  );
};

export default Toggle;