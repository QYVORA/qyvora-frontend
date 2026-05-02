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

// ─────────────────────────────────────────────────────────────────────────────
// CARD BASE — no image, just a padded surface
// ─────────────────────────────────────────────────────────────────────────────
interface CardBaseProps {
  children: React.ReactNode;
  className?: string;
  /** If provided the whole card becomes a link */
  href?: string;
  /** Use for external links */
  external?: boolean;
  onClick?: () => void;
  /** Highlight the border with accent colour */
  active?: boolean;
  /** Dim the card (locked / disabled state) */
  muted?: boolean;
}

export const CardBase: React.FC<CardBaseProps> = ({
  children,
  className = '',
  href,
  external,
  onClick,
  active,
  muted,
}) => {
  const base = [
    'group relative flex flex-col overflow-hidden rounded-2xl border-2 bg-bg-card transition-colors duration-200',
    active  ? 'border-accent/40'                          : 'border-border',
    muted   ? 'opacity-60 cursor-default'                 : 'hover:border-accent/40',
    className,
  ].join(' ');

  const style = { boxShadow: 'var(--card-shimmer)' };

  if (href && !external) {
    return <Link to={href} className={base} style={style}>{children}</Link>;
  }
  if (href && external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={base} style={style}>{children}</a>;
  }
  if (onClick) {
    return (
      <div role="button" tabIndex={0} onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
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
  /** Overlay gradient on the image — defaults to bottom-to-transparent */
  imageGradient?: boolean;
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
  imageGradient = true,
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
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
            muted ? 'grayscale brightness-50' : ''
          } ${imageClassName}`}
          onError={(e) => {
            const el = e.currentTarget;
            if (!el.dataset.fallbackApplied) {
              el.dataset.fallbackApplied = '1';
              el.src = '/assets/bootcamp/hpb-cover.png';
            }
          }}
        />
        {imageGradient && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)' }}
          />
        )}
        {imageBadges}
        {typeof imageProgress === 'number' && imageProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-bg/40">
            <div
              className="h-full bg-accent transition-all duration-700"
              style={{ width: `${imageProgress}%` }}
            />
          </div>
        )}
      </div>
      {/* Body */}
      <div className="flex flex-1 flex-col">{children}</div>
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
    <div className={`flex items-center gap-3 p-4 ${className}`}>
      {icon && (
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
          accent ? 'border-accent/30 bg-accent-dim text-accent' : 'border-border bg-bg text-text-muted'
        }`}>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <div className={`font-mono text-xl font-black leading-none ${accent ? 'text-accent' : 'text-text-primary'}`}>
          {value}
        </div>
        {label && (
          <div className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-text-muted truncate">
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
        className="group block overflow-hidden rounded-xl border border-border bg-bg-card transition-colors hover:border-accent/40"
        style={{ boxShadow: 'var(--card-shimmer)' }}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-xl border border-border bg-bg-card"
      style={{ boxShadow: 'var(--card-shimmer)' }}
    >
      {inner}
    </div>
  );
};
