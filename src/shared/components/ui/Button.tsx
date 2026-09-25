import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  /** Icon rendered after the label (e.g. arrow-forward). */
  trailingIcon?: React.ReactNode;
  /** Shows a spinner and disables the button while true. */
  loading?: boolean;
  /** Renders the button as a router <Link>. */
  to?: string;
  /** Renders the button as an anchor. */
  href?: string;
  /** Open href in a new tab. */
  external?: boolean;
  /** Accessible label for icon-only usage */
  ariaLabel?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-on-accent font-bold border-2 border-on-accent hover:brightness-110 ' +
    'shadow-[0_3px_0_var(--color-on-accent)] active:translate-y-[2px] active:shadow-[0_1px_0_var(--color-on-accent)]',
  secondary:
    'bg-bg-elevated text-accent font-bold border border-border hover:bg-bg-card ' +
    'shadow-[0_3px_0_var(--color-border-strong)] active:translate-y-[2px] active:shadow-[0_1px_0_var(--color-border-strong)]',
  danger:
    'bg-danger/10 text-danger font-bold border border-danger/40 hover:bg-danger/20 ' +
    'shadow-[0_3px_0_color-mix(in_srgb,var(--color-danger)_55%,transparent)] active:translate-y-[2px] active:shadow-[0_1px_0_color-mix(in_srgb,var(--color-danger)_55%,transparent)]',
  ghost:
    'bg-transparent text-text-secondary font-bold border border-transparent hover:bg-bg-elevated hover:text-text-primary active:translate-y-[2px]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm',
};

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-xl cursor-pointer select-none whitespace-nowrap ' +
  'min-h-[44px] ' +
  'transition-[filter,transform,background-color,color,border-color] duration-[var(--dur-base)] ease-[var(--ease-smooth)] ' +
  'active:scale-[0.97] ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
  'disabled:opacity-45 disabled:pointer-events-none';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', icon, trailingIcon, className, children, disabled, loading = false, to, href, external, ariaLabel, ...props },
    ref,
  ) => {
    const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
    const content = (
      <>
        {loading && <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />}
        {!loading && icon}
        <span className="min-w-0 whitespace-normal text-balance">{children}</span>
        {!loading && trailingIcon}
      </>
    );
    if (to) {
      return (
        <Link to={to} className={classes} aria-label={ariaLabel} {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {content}
        </Link>
      );
    }
    if (href) {
      return (
        <a
          href={href}
          className={classes}
          aria-label={ariaLabel}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        aria-label={ariaLabel}
        className={classes}
        {...props}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;