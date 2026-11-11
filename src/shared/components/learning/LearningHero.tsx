import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '@/shared/components/ui/Button';

export interface LearningHeroStat {
  label: React.ReactNode;
  value: React.ReactNode;
  accent?: boolean;
}

interface LearningHeroProps {
  kicker?: React.ReactNode;
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  backTo?: string;
  backLabel?: React.ReactNode;
  onBack?: () => void;
  stats?: LearningHeroStat[];
  actions?: React.ReactNode;
  /** Official badge artwork used as the slanted hero background. */
  heroArtSrc?: string;
}

/**
 * LearningHero — self-contained full-bleed gradient band for Labs, bootcamp
 * rooms and content Labs. The item's own badge is zoomed and slanted behind
 * the content; the crisp badge beside the title is the same artwork.
 */
const LearningHero: React.FC<LearningHeroProps> = ({
  kicker,
  icon,
  title,
  description,
  breadcrumb,
  backTo,
  backLabel,
  onBack,
  stats,
  actions,
  heroArtSrc,
}) => {
  const defaultBreadcrumb =
    backTo && backLabel ? (
      <Link
        to={backTo}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        {backLabel}
      </Link>
    ) : null;

  return (
    <header className="learning-hero-band">
      {heroArtSrc && (
        <img src={heroArtSrc} alt="" aria-hidden="true" className="learning-hero-art" />
      )}
      <div aria-hidden="true" className="learning-hero-shade" />

      <div className="relative z-10 flex min-h-[inherit] w-full flex-col justify-center gap-5 px-[var(--app-gutter,12px)] py-6 md:py-8">
        {(breadcrumb || defaultBreadcrumb || onBack) && (
          <div className="flex flex-wrap items-center gap-3">
            {onBack ? (
              <Button variant="ghost" onClick={onBack} className="-ml-2 w-fit">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {backLabel ?? 'Back'}
              </Button>
            ) : (
              (breadcrumb ?? defaultBreadcrumb)
            )}
          </div>
        )}

        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
          {icon && (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center sm:h-[88px] sm:w-[88px] [&_img]:h-full [&_img]:w-full [&_img]:object-contain [&_svg]:h-full [&_svg]:w-full">
              {icon}
            </span>
          )}
          <div className="min-w-0">
            {kicker && (
              <p className="mb-1.5 text-[12px] font-medium uppercase tracking-[0.12em] text-accent">
                {kicker}
              </p>
            )}
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-text-primary sm:text-[32px]">
              {title}
            </h1>
            {description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
                {description}
              </p>
            )}
          </div>
        </div>

        {stats && stats.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {stats.map((stat) => (
              <span
                key={String(stat.label)}
                className={`type-meta ${stat.accent ? 'text-accent' : 'text-text-tertiary'}`}
              >
                <span className="text-sm font-medium tabular-nums text-text-primary">{stat.value}</span>{' '}
                {stat.label}
              </span>
            ))}
          </div>
        )}

        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
    </header>
  );
};

export default LearningHero;
