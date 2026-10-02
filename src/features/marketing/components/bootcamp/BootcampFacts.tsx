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
 * unmodified — no recolouring, filters, shadows or gradients — and scales from
 * the hero down to card size.
 */
const BootcampLogo = ({
  bootcamp,
  size = 'md',
  className = '',
}: {
  bootcamp: Pick<Bootcamp, 'logo' | 'logoAlt' | 'logoWidth' | 'logoHeight' | 'acronym'>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const frame = {
    sm: 'h-16 w-16 p-2 rounded-xl',
    md: 'h-28 w-28 p-3 rounded-2xl',
    lg: 'h-40 w-40 p-4 rounded-2xl md:h-48 md:w-48',
  }[size];

  return (
    <div
      className={`flex shrink-0 items-center justify-center border border-border-subtle bg-surface-raised ${frame} ${className}`}
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