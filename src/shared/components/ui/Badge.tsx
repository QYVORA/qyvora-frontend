import React from 'react';
import { cn } from '@/shared/utils/cn';

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Pill radius for status labels (tags keep the 6px radius). */
  pill?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-bg-elevated text-text-muted border border-border/40',
  accent: 'bg-accent/10 text-accent border border-accent/20',
  success: 'bg-success/10 text-success border border-success/20',
  warning: 'bg-warning/10 text-warning border border-warning/20',
  danger: 'bg-danger/10 text-danger border border-danger/20',
  info: 'bg-info/10 text-info border border-info/20',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-[13px]',
};

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  pill = false,
  className,
  children,
  ...props
}) => (
  <span
    className={cn(
      'inline-flex items-center font-medium leading-5',
      pill ? 'rounded-full' : 'rounded-md',
      variantClasses[variant],
      sizeClasses[size],
      className,
    )}
    {...props}
  >
    {children}
  </span>
);

Badge.displayName = 'Badge';

export default Badge;
