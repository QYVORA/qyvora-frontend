import React from 'react';
import finalCtaDobia from '@/assets/backgrounds/final-cta-dobia.webp';
import { cn } from '@/shared/utils/cn';

/**
 * ProgrammeCtaCard — the conversion card that closes a programme page.
 *
 * One treatment for every CTA card in the marketing surface: the landing
 * `FinalCtaBlock` and this card share the same mapped scene, the same
 * `border-accent/40` frame and the same centred composition, so a CTA card no
 * longer reads as a flat `bg-surface` box next to a mapped one.
 *
 * Follows the mapped-art pattern in `docs/BACKGROUNDS.md`: `data-theme-persist`
 * on the root, decorative image first, copy in a `relative` sibling, no scrim.
 */
export interface ProgrammeCtaCardProps {
  /** Tiny uppercase eyebrow, e.g. `Next level`. */
  kicker: string;
  title: string;
  description: React.ReactNode;
  /** Buttons / links. */
  children?: React.ReactNode;
  /** Override the mapped CTA scene (defaults to the shared CTA art). */
  background?: string;
  className?: string;
}

const ProgrammeCtaCard: React.FC<ProgrammeCtaCardProps> = ({
  kicker,
  title,
  description,
  children,
  background = finalCtaDobia,
  className,
}) => (
  <div
    data-theme-persist="dark"
    className={cn(
      'relative overflow-hidden rounded-2xl border border-accent/40',
      className,
    )}
  >
    <img
      src={background}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
    />
    <div className="relative flex min-h-[320px] flex-col items-start justify-center gap-5 px-6 py-12 md:items-center md:px-10 md:py-14 md:text-center">
      <p className="block text-kicker font-black uppercase tracking-[0.3em] text-accent">
        {kicker}
      </p>
      <h2 className="type-h2 max-w-2xl text-2xl font-black uppercase tracking-tight text-text-primary md:text-3xl">
        {title}
      </h2>
      <p className="type-body max-w-xl">{description}</p>
      {children && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          {children}
        </div>
      )}
    </div>
  </div>
);

export default ProgrammeCtaCard;