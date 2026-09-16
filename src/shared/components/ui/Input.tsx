import React from 'react';
import { cn } from '@/shared/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  /** String renders an inline error; boolean only marks aria-invalid (use with FormField). */
  error?: string | boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, error, className, ...props }, ref) => (
    <div className="relative w-full">
      {icon && (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        aria-invalid={Boolean(error)}
        className={cn(
          'w-full min-h-[44px] bg-surface border rounded-lg py-2.5 text-body-sm text-text-primary',
          error ? 'border-semantic-danger' : 'border-border-subtle focus:border-accent',
          'placeholder:text-text-tertiary outline-none transition-[border-color,box-shadow]',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          icon ? 'pl-11 pr-4' : 'px-4',
          className,
        )}
        {...props}
      />
      {typeof error === 'string' && (
        <p className="mt-1.5 type-meta text-semantic-danger" role="alert">{error}</p>
      )}
    </div>
  ),
);

Input.displayName = 'Input';

export default Input;