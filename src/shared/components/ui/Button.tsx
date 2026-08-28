import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  /** Shows a spinner and disables the button while true. */
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-on-accent font-black border-2 border-on-accent hover:brightness-110 active:scale-95',
  secondary:
    'bg-bg-elevated text-accent font-black border border-border hover:bg-bg-card active:scale-95',
  danger:
    'bg-danger/10 text-danger font-black border border-danger/40 hover:bg-danger/20 active:scale-95',
  ghost:
    'bg-transparent text-text-secondary font-black border border-transparent hover:bg-bg-elevated hover:text-text-primary active:scale-95',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2.5 text-xs',
  md: 'px-7 py-3 text-sm',
  lg: 'px-8 py-3.5 text-sm',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, className, children, disabled, loading = false, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl uppercase tracking-[0.08em] cursor-pointer',
        'transition-[filter,transform,background-color,color,border-color,box-shadow]',
        'duration-[var(--dur-base)] ease-[var(--ease-smooth)]',
        'disabled:opacity-50 disabled:pointer-events-none',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />}
      {!loading && icon}
      {children}
    </button>
  ),
);

Button.displayName = 'Button';

export default Button;
