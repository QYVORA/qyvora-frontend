import React from 'react';

interface AdinkraCardBgProps {
  opacity?: number;
  className?: string;
  symbols?: number[];
}

const SYMBOLS: React.FC<{ className?: string }>[] = [
  ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M50 10 C50 10 28 14 18 30 C10 42 12 54 22 60 C28 63 36 62 42 58 C46 55 48 50 50 46 C52 50 54 55 58 58 C64 62 72 63 78 60 C88 54 90 42 82 30 C72 14 50 10 50 10 Z" fill="currentColor" />
      <path d="M50 46 C44 40 20 40 14 52 C10 62 16 72 28 74 C38 75 46 70 50 64 C54 70 62 75 72 74 C84 72 90 62 86 52 C80 40 56 40 50 46 Z" fill="currentColor" />
    </svg>
  ),
  ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" />
      <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" strokeWidth="6" />
      <circle cx="50" cy="50" r="12" fill="currentColor" />
    </svg>
  ),
  ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M50 50 C50 38 44 18 30 14 C16 10 8 22 14 34 C20 44 32 46 40 42 C44 40 48 36 50 32" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <path d="M50 50 C50 38 56 18 70 14 C84 10 92 22 86 34 C80 44 68 46 60 42 C56 40 52 36 50 32" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <path d="M50 50 C50 62 44 82 30 86 C16 90 8 78 14 66 C20 56 32 54 40 58 C44 60 48 64 50 68" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <path d="M50 50 C50 62 56 82 70 86 C84 90 92 78 86 66 C80 56 68 54 60 58 C56 60 52 64 50 68" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <circle cx="50" cy="50" r="6" fill="currentColor" />
    </svg>
  ),
  ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M50 50 C50 36 44 20 30 14 C22 10 24 18 30 22 C36 26 40 34 40 40" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <path d="M50 50 C64 50 80 44 86 30 C90 22 82 24 78 30 C74 36 66 40 60 40" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <path d="M50 50 C50 64 56 80 70 86 C78 90 76 82 70 78 C64 74 60 66 60 60" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <path d="M50 50 C36 50 20 56 14 70 C10 78 18 76 22 70 C26 64 34 60 40 60" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <circle cx="50" cy="50" r="7" fill="currentColor" />
    </svg>
  ),
  ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M50 6 L56 42 L94 50 L56 58 L50 94 L44 58 L6 50 L44 42 Z" fill="currentColor" />
      <circle cx="50" cy="50" r="10" fill="var(--color-bg, #000)" />
    </svg>
  ),
  ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <line x1="50" y1="90" x2="50" y2="10" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <path d="M50 78 C42 70 22 68 18 58 C14 48 30 42 50 54" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M50 78 C58 70 78 68 82 58 C86 48 70 42 50 54" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M50 56 C42 48 24 46 20 36 C16 26 32 22 50 34" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M50 56 C58 48 76 46 80 36 C84 26 68 22 50 34" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M50 36 C44 30 30 28 28 20 C26 14 38 12 50 20" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M50 36 C56 30 70 28 72 20 C74 14 62 12 50 20" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  ),
];

const PLACEMENTS = [
  { top: '8%', right: '6%', size: 64, rotate: -8, opacity: 0.5 },
  { bottom: '10%', left: '5%', size: 52, rotate: 12, opacity: 0.4 },
  { top: '50%', left: '60%', size: 40, rotate: -15, opacity: 0.3 },
];

const AdinkraCardBg: React.FC<AdinkraCardBgProps> = ({
  opacity = 0.06,
  className = '',
  symbols,
}) => {
  const picks = symbols ?? [0, 2, 4];

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none text-accent ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      {PLACEMENTS.map((placement, i) => {
        const Symbol = SYMBOLS[picks[i % picks.length]];
        return (
          <div
            key={i}
            className="absolute"
            style={{
              top: placement.top,
              right: placement.right,
              bottom: placement.bottom,
              left: placement.left,
              width: placement.size,
              height: placement.size,
              transform: `rotate(${placement.rotate}deg)`,
              opacity: placement.opacity,
            }}
          >
            <Symbol className="w-full h-full" />
          </div>
        );
      })}
    </div>
  );
};

export default AdinkraCardBg;
