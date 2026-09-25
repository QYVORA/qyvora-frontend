/**
 * Shared Card components — three variants used across the whole site.
 *
 * CardBase   — plain surface card (no image). Used for stats, steps, text content.
 * CardMedia  — card with a top cover image. Used for bootcamps, products, services.
 * CardStat   — compact horizontal stat card. Used for metrics, leaderboard rows.
 *
 * All variants share the same border, radius, background, and shimmer token so
 * every card on the site looks like it belongs to the same family.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import hpbCoverImg from '@/assets/bootcamp/hpb-cover.webp';

// ─────────────────────────────────────────────────────────────────────────────
// CARD BASE — no image, just a padded surface
// ─────────────────────────────────────────────────────────────────────────────
interface CardBaseProps {
  children: React.ReactNode;
  className?: string;
  /** If provided the whole card becomes a link */
  href?: string;
  to?: string;
  /** Use for external links */
  external?: boolean;
  onClick?: () => void;
  /** Accessible name for the interactive card (role="button" branch). */
  ariaLabel?: string;
  /** Highlight the border with accent colour */
  active?: boolean;
  /** Dim the card (locked / disabled state) */
  muted?: boolean;
}

export const CardBase: React.FC<CardBaseProps> = ({
  children,
  className = '',
  href,
  to,
  external,
  onClick,
  ariaLabel,
  active,
  muted,
}) => {
  const linkTarget = to || href;
  const base = [
    'terminal-card group relative flex flex-col overflow-hidden rounded-2xl border bg-bg-card transition-[border-color,box-shadow,background-color] duration-[var(--dur-base)] ease-[var(--ease-smooth)]',
    active  ? 'border-accent/60'                         : 'border-accent/50',
    muted   ? 'opacity-60 cursor-default'                : 'hover:border-accent/60',
    className,
  ].join(' ');

  const style = { boxShadow: 'var(--card-shimmer)' };

  if (linkTarget && !external) {
    return <Link to={linkTarget} className={base} style={style}>{children}</Link>;
  }
  if (linkTarget && external) {
    return <a href={linkTarget} target="_blank" rel="noopener noreferrer" className={base} style={style}>{children}</a>;
  }
  if (onClick) {
    return (
      <div role="button" tabIndex={0} onClick={onClick} aria-label={ariaLabel}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onClick())}
        className={base} style={style}
      >
        {children}
      </div>
    );
  }
  return <div className={base} style={style}>{children}</div>;
};

// ─────────────────────────────────────────────────────────────────────────────
// CARD MEDIA — cover image on top, body below
// ─────────────────────────────────────────────────────────────────────────────
interface CardMediaProps {
  /** Image src */
  image: string;
  /** Alt text */
  imageAlt?: string;
  /** Aspect ratio class for the image container, e.g. "aspect-video" or "aspect-square" */
  imageAspect?: string;
  /** Badges rendered inside the image area (absolute positioned) */
  imageBadges?: React.ReactNode;
  /** Thin progress bar at the very bottom edge of the image */
  imageProgress?: number;
  /** Card body content */
  children: React.ReactNode;
  className?: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  active?: boolean;
  muted?: boolean;
  /** Extra classes for the image element */
  imageClassName?: string;
}

export const CardMedia: React.FC<CardMediaProps> = ({
  image,
  imageAlt = '',
  imageAspect = 'aspect-video',
  imageBadges,
  imageProgress,
  children,
  className = '',
  href,
  external,
  onClick,
  active,
  muted,
  imageClassName = '',
}) => {
  const body = (
    <>
      {/* Image area */}
      <div className={`relative overflow-hidden ${imageAspect}`}>
        <img
          src={image}
          alt={imageAlt}
          width={1200}
          height={675}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
            muted ? 'grayscale brightness-50' : ''
          } ${imageClassName}`}
          onError={(e) => {
            const el = e.currentTarget;
            if (!el.dataset.fallbackApplied) {
              el.dataset.fallbackApplied = '1';
              el.src = hpbCoverImg;
            }
          }}
        />
        {imageBadges}
        {typeof imageProgress === 'number' && imageProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-bg/40">
            <div
              className="h-full bg-accent transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-smooth)]"
              style={{ width: `${imageProgress}%` }}
            />
          </div>
        )}
      </div>
      {/* Body */}
      <div className="flex flex-1 flex-col p-4">{children}</div>
    </>
  );

  return (
    <CardBase
      href={href}
      external={external}
      onClick={onClick}
      active={active}
      muted={muted}
      className={`flex-col ${className}`}
    >
      {body}
    </CardBase>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CARD STAT — compact horizontal layout: icon | value | optional label
// ─────────────────────────────────────────────────────────────────────────────
interface CardStatProps {
  icon?: React.ReactNode;
  value: React.ReactNode;
  label?: React.ReactNode;
  className?: string;
  href?: string;
  accent?: boolean;
}

export const CardStat: React.FC<CardStatProps> = ({
  icon,
  value,
  label,
  className = '',
  href,
  accent,
}) => {
  const inner = (
    <div className={`flex items-center gap-4 p-5 md:p-4 ${className}`}>
      {icon && (
        <div className={`flex h-12 w-12 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl border ${
          accent ? 'border-accent/50 bg-accent-dim text-accent' : 'border-border bg-bg text-text-muted'
        }`}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6 md:w-5 md:h-5' }) : icon}
        </div>
      )}
      <div className="min-w-0">
        <div className={`font-mono text-2xl md:text-xl font-black leading-none ${accent ? 'text-accent' : 'text-text-primary'}`}>
          {value}
        </div>
        {label && (
          <div className="mt-1 text-xs md:text-xs font-bold uppercase tracking-widest text-text-muted truncate">
            {label}
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        to={href}
        className="group block overflow-hidden card-accent bg-bg-card transition-colors hover:shadow-[var(--card-shadow)]"
        style={{ boxShadow: 'var(--card-shimmer)' }}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      className="overflow-hidden card-accent bg-bg-card"
      style={{ boxShadow: 'var(--card-shimmer)' }}
    >
      {inner}
    </div>
  );
};

export { default as LearningCard, DifficultyBadge } from '../learning/LearningCard';
export type { LearningCardProps, LearningCardType } from '../learning/LearningCard';

// ─────────────────────────────────────────────────────────────────────────────
// CALM CARD — composable surface for migrated UI (Product UI Redesign Audit).
// Quiet by default: canvas step (surface), 12px radius, subtle border, no glow,
// no shimmer, no hover-transform. Accent border ONLY signals selection.
// ─────────────────────────────────────────────────────────────────────────────
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section' | 'li';
  /** Accent border — reserved for the single selected/active surface. */
  selected?: boolean;
  /** Link behaviour (router or external). */
  to?: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  /** Accessible name for the interactive card (role="button" branch). */
  ariaLabel?: string;
  /** Dim the card for locked/unavailable states. */
  muted?: boolean;
  /** Visibly indicate the whole card is the interactive target. */
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  as = 'div',
  selected,
  to,
  href,
  external,
  onClick,
  ariaLabel,
  muted,
  interactive,
}) => {
  const Tag = as as React.ElementType;
  const classes = [
    'bg-surface rounded-2xl border border-border-subtle',
    selected ? 'border-accent/60' : '',
    interactive ? 'hover:border-border' : '',
    muted ? 'opacity-55 cursor-default' : '',
    onClick || to || href ? 'transition-colors duration-[var(--dur-fast)] ease-[var(--ease-smooth)]' : '',
    className,
  ].join(' ');

  if (to) {
    return (
      <Link to={to} className={`${classes} block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={`${classes} block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
      >
        {children}
      </a>
    );
  }
  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        aria-label={ariaLabel}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onClick())}
        className={`${classes} cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
      >
        {children}
      </div>
    );
  }
  return <Tag className={classes}>{children}</Tag>;
};

// ─────────────────────────────────────────────────────────────────────────────
// METRIC — compact stat without a mandatory card shell. Composes with dividers
// or a Card when grouping is needed.
// ─────────────────────────────────────────────────────────────────────────────
export interface MetricProps {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  to?: string;
  className?: string;
  /** Green for progress/success semantics only. */
  accent?: boolean;
}

export const Metric: React.FC<MetricProps> = ({
  label,
  value,
  hint,
  icon,
  to,
  className = '',
  accent,
}) => {
  const inner = (
    <div className={`flex items-start gap-3 ${className}`}>
      {icon && (
        <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
          accent ? 'border-accent/40 bg-accent/10 text-accent' : 'border-border-subtle bg-surface-raised text-text-secondary'
        }`}>
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <div className={`font-mono text-lg font-bold leading-tight tabular-nums ${accent ? 'text-accent' : 'text-text-primary'}`}>
          {value}
        </div>
        <div className="mt-0.5 type-label text-text-tertiary leading-tight">{label}</div>
        {hint && <div className="mt-1 type-meta leading-snug">{hint}</div>}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
        {inner}
      </Link>
    );
  }
  return inner;
};

export default {
  Base: CardBase,
  Media: CardMedia,
  Stat: CardStat,
};