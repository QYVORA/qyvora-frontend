import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { Tooltip } from './Tooltip';

type IconButtonVariant = 'default' | 'accent' | 'raised';

interface IconButtonProps {
  /** Short, human-readable label. Always required — surfaced as aria-label + tooltip. */
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  to?: string;
  href?: string;
  external?: boolean;
  variant?: IconButtonVariant;
  active?: boolean;
  disabled?: boolean;
  loading?: boolean;
  /** Hide labels in tooltips (pure icon affordance). */
  tooltip?: boolean;
  className?: string;
}

const variantClasses: Record<IconButtonVariant, string> = {
  default:
    'border-border/60 bg-transparent text-text-secondary hover:border-accent/50 hover:text-accent hover:bg-accent-dim/10',
  accent: 'border-accent bg-accent text-on-accent hover:brightness-110',
  raised: 'border-border-subtle bg-surface-raised text-text-primary hover:border-accent/50 hover:text-accent',
};

const IconButton: React.FC<IconButtonProps> = ({
  label,
  icon,
  onClick,
  to,
  href,
  external,
  variant = 'default',
  active,
  disabled,
  loading,
  tooltip = true,
  className,
}) => {
  const classes = cn(
    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors active:scale-[0.97]',
    'min-h-[44px] min-w-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    active ? 'border-accent bg-accent-dim text-accent' : variantClasses[variant],
    disabled && 'opacity-45 pointer-events-none',
    className,
  );

  const content = loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : icon;

  const render = () => {
    if (to) {
      return (
        <Link to={to} className={classes} aria-label={label} aria-busy={loading || undefined}>
          {content}
        </Link>
      );
    }
    if (href) {
      return (
        <a
          href={href}
          className={classes}
          aria-label={label}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          {content}
        </a>
      );
    }
    return (
      <button type="button" className={classes} aria-label={label} aria-pressed={active} onClick={onClick} disabled={disabled || loading}>
        {content}
      </button>
    );
  };

  if (!tooltip) return <>{render()}</>;

  return <Tooltip content={label}>{render()}</Tooltip>;
};

export default IconButton;