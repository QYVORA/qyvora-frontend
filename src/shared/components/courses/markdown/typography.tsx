import React from 'react';

// ── Typography (centralised QYVORA grammar) ───────────────────────────────────
export const PARA_CLASS = 'text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2] mb-6 md:mb-8 max-w-none';
export const LIST_CLASS = 'list-outside pl-5 space-y-3 md:space-y-4 text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2] mb-6 md:mb-8 max-w-none';

export const headingClass = (level: number): string => {
  const size =
    level === 1 ? 'text-2xl md:text-4xl mb-6 md:mb-8' :
    level === 2 ? 'text-2xl md:text-4xl mb-6 md:mb-8' :
    level === 3 ? 'text-xl md:text-2xl text-accent mb-5 md:mb-6' :
                  'text-base md:text-lg mb-4 mt-4';
  const color = level === 3 ? 'text-accent' : 'text-text-primary';
  return `font-black uppercase tracking-tight ${size} ${color}`;
};

export const Heading = ({ level, children }: { level: number; children?: React.ReactNode }) => {
  const Tag = (`h${Math.min(Math.max(1, level), 4)}`) as 'h1' | 'h2' | 'h3' | 'h4';
  return <Tag className={headingClass(level)}>{children}</Tag>;
};