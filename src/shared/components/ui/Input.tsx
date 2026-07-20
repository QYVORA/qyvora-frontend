import React from 'react';
import { cn } from '@/shared/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, className, ...props }, ref) => (
    <div className="relative w-full">
      {icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full bg-bg-card border border-border rounded-xl py-3 text-text-primary',
          'placeholder:text-text-muted focus:border-accent outline-none transition-all',
          'font-mono text-sm',
          icon ? 'pl-12 pr-4' : 'px-4',
          className,
        )}
        {...props}
      />
    </div>
  ),
);

Input.displayName = 'Input';

export default Input;
