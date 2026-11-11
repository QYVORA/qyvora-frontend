import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  error?: boolean;
  /** Optional leading glyph (flag / icon) inside the control. */
  leading?: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, error, leading, className, children, ...props }, ref) => (
    <div className="relative w-full">
      {leading && (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
          {leading}
        </span>
      )}
      <select
        ref={ref}
        className={cn(
          'qy-input w-full appearance-none bg-surface border rounded-lg py-2.5 pr-10 text-body-sm text-text-primary',
          'min-h-[44px] cursor-pointer',
          leading ? 'pl-11' : 'pl-4',
          error ? 'border-semantic-danger' : 'border-border-subtle focus:border-accent',
          'outline-none transition-[border-color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          'disabled:bg-surface-raised disabled:text-text-muted disabled:cursor-not-allowed',
          className,
        )}
        {...props}
      >
        {children}
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
        aria-hidden="true"
      />
    </div>
  ),
);

Select.displayName = 'Select';

export default Select;
