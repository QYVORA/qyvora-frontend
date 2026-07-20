import React from 'react';
import { cn } from '@/shared/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-bg font-black border-2 border-bg hover:brightness-110 active:scale-95',
  secondary:
    'bg-bg-elevated text-accent font-black border border-white/5 hover:bg-bg-card active:scale-95',
  danger:
    'bg-red-500/10 text-red-400 font-black border border-red-500/40 hover:bg-red-500/20 active:scale-95',
  ghost:
    'bg-transparent text-text-secondary font-black border border-transparent hover:bg-bg-elevated hover:text-text-primary active:scale-95',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[10px]',
  md: 'px-7 py-3 text-[10px]',
  lg: 'px-8 py-3.5 text-xs',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
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
      {icon}
      {children}
    </button>
  ),
);

Button.displayName = 'Button';

export default Button;
