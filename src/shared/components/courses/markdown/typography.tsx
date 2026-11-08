import React from 'react';

// ── Typography (centralised QYVORA grammar) ───────────────────────────────────
export const PARA_CLASS = 'mb-5 max-w-none font-mono text-sm leading-7 text-text-secondary sm:text-[15px] sm:leading-8 md:text-base md:leading-8';
export const LIST_CLASS = 'mb-5 max-w-none list-outside space-y-2.5 pl-5 font-mono text-sm leading-7 text-text-secondary sm:text-[15px] sm:leading-8 md:text-base md:leading-8';

export const headingClass = (level: number): string => {
  if (level === 1) {
    return 'mb-5 font-display text-3xl font-bold leading-tight tracking-tight text-text-primary md:mb-6 md:text-4xl';
  }
  if (level === 2) {
    return 'mb-4 mt-7 font-display text-2xl font-bold leading-tight tracking-tight text-text-primary first:mt-0 md:text-3xl';
  }
  if (level === 3) {
    return 'mb-3 mt-6 font-display text-xl font-semibold leading-snug tracking-tight text-accent first:mt-0 md:text-2xl';
  }
  return 'mb-2 mt-5 text-sm font-black uppercase tracking-[0.18em] text-text-muted first:mt-0';
};

export const Heading = ({ level, children }: { level: number; children?: React.ReactNode }) => {
  const Tag = (`h${Math.min(Math.max(1, level), 4)}`) as 'h1' | 'h2' | 'h3' | 'h4';
  return <Tag className={headingClass(level)}>{children}</Tag>;
};