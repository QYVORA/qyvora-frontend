import React from 'react';
import { cn } from '@/shared/utils/cn';

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-bg-elevated text-text-muted border border-border/40',
  accent: 'bg-accent/10 text-accent border border-accent/20',
  success: 'bg-green-400/10 text-green-400 border border-green-400/20',
  warning: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20',
  danger: 'bg-red-400/10 text-red-400 border border-red-400/20',
  info: 'bg-blue-400/10 text-blue-400 border border-blue-400/20',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[9px]',
  md: 'px-2.5 py-1 text-[10px]',
};

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}) => (
  <span
    className={cn(
      'inline-flex items-center rounded-lg font-black uppercase tracking-widest',
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
