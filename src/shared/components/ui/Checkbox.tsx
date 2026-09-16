import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}

/**
 * Accessible checkbox. Minimal 44px hit area with a clean visual box;
 * label and optional description sit beside it.
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, ...props }, ref) => {
    const input = (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          'peer appearance-none h-[22px] w-[22px] shrink-0 cursor-pointer rounded-[6px] border',
          'border-border-subtle bg-surface transition-colors',
          'checked:border-accent checked:bg-accent',
          'indeterminate:border-accent indeterminate:bg-accent',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          'disabled:opacity-45 disabled:cursor-not-allowed',
          className,
        )}
        {...props}
      />
    );

    if (!label && !description) return input;

    return (
      <label className="group flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg p-1">
        <span className="relative mt-[10px]">
          {input}
          <Check
            className="pointer-events-none absolute left-[3px] top-[3px] h-4 w-4 text-on-accent opacity-0 transition-opacity peer-checked:opacity-100"
            aria-hidden="true"
          />
        </span>
        <span className="flex-1">
          {label && (
            <span className="block text-body-sm text-text-primary group-hover:text-accent transition-colors">
              {label}
            </span>
          )}
          {description && <span className="mt-0.5 block type-meta">{description}</span>}
        </span>
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;