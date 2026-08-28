import React from 'react';
import { cn } from '@/shared/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string | boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, error, className, ...props }, ref) => (
    <div className="relative w-full">
      {icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        aria-invalid={Boolean(error)}
        className={cn(
          'w-full bg-bg-card border rounded-xl py-3 text-text-primary',
          error ? 'border-red-500/60 focus:border-red-400' : 'border-border focus:border-accent',
          'placeholder:text-text-muted outline-none transition-all',
          'font-mono text-sm',
          icon ? 'pl-12 pr-4' : 'px-4',
          className,
        )}
        {...props}
      />
      {typeof error === 'string' && (
        <p className="mt-1 text-xs text-red-400 font-mono" role="alert">{error}</p>
      )}
    </div>
  ),
);

Input.displayName = 'Input';

export default Input;
