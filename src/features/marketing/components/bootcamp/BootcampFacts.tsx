import React from 'react';
import type { Bootcamp, BootcampFact } from '@/features/marketing/content/bootcampData';

/**
 * Documented programme facts (level, duration, delivery, prerequisite …).
 * Values come straight from the programme documentation — nothing here is
 * decorative copy.
 */
const BootcampFacts = ({ facts }: { facts: BootcampFact[] }) => (
  <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border-subtle bg-border-subtle md:grid-cols-3 lg:grid-cols-5">
    {facts.map((fact) => (
      <div key={fact.label} className="flex flex-col gap-2 bg-surface px-4 py-5">
        <dt className="type-label uppercase tracking-[0.12em] text-accent">{fact.label}</dt>
        <dd className="text-sm font-bold leading-snug text-text-primary">{fact.value}</dd>
      </div>
    ))}
  </dl>
);

/**
 * Official programme logo on a transparent surface. The supplied artwork is used
 * unmodified — no recolouring, filters, shadows or gradients.
 *
 * Sizes are deliberately small: the logo is an identity mark inside a
 * composition, never a showcase tile. `sm` is the inline hero lockup, `md` sits
 * in a CTA card and `lg` is the largest standalone placement.
 */
const BootcampLogo = ({
  bootcamp,
  size = 'md',
  accent = false,
  className = '',
}: {
  bootcamp: Pick<Bootcamp, 'logo' | 'logoAlt' | 'logoWidth' | 'logoHeight' | 'acronym'>;
  size?: 'sm' | 'md' | 'lg';
  /** Accent-tinted tile — for lockups that sit next to accent copy. */
  accent?: boolean;
  className?: string;
}) => {
  const frame = {
    sm: 'h-16 w-16 rounded-xl p-2.5',
    md: 'h-20 w-20 rounded-2xl p-3.5',
    lg: 'h-24 w-24 rounded-2xl p-4',
  }[size];

  const tone = accent
    ? 'border-accent/25 bg-accent/10'
    : 'border-border-subtle bg-surface-raised';

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl border ${tone} ${frame} ${className}`}
    >
      <img
        src={bootcamp.logo}
        alt={`${bootcamp.acronym} logo`}
        width={bootcamp.logoWidth}
        height={bootcamp.logoHeight}
        className="h-full w-full object-contain"
      />
    </div>
  );
};

export default BootcampFacts;
export { BootcampLogo };