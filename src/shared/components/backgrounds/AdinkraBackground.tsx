import React from 'react';
import { useTheme } from '../../../core/contexts/ThemeContext';

interface AdinkraBackgroundProps {
  /**
   * Overall opacity of the Adinkra symbols layer (0-1)
   * @default 0.18
   */
  opacity?: number;

  /**
   * Whether to include the ambient gradient blobs
   * @default true
   */
  includeGradients?: boolean;

  /**
   * Whether to include the dot grid pattern
   * @default true
   */
  includeDotGrid?: boolean;

  /**
   * Additional CSS classes for the container
   */
  className?: string;
}

/**
 * AdinkraBackground Component
 */

/* ─────────────────────────────────────────────
   SYMBOL COMPONENTS (100×100 viewBox each)
───────────────────────────────────────────── */

const GyeNyame: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10 C50 10 28 14 18 30 C10 42 12 54 22 60 C28 63 36 62 42 58 C46 55 48 50 50 46 C52 50 54 55 58 58 C64 62 72 63 78 60 C88 54 90 42 82 30 C72 14 50 10 50 10 Z" fill="currentColor" />
    <path d="M50 46 C44 40 20 40 14 52 C10 62 16 72 28 74 C38 75 46 70 50 64 C54 70 62 75 72 74 C84 72 90 62 86 52 C80 40 56 40 50 46 Z" fill="currentColor" />
  </svg>
);

const Sankofa: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M54 90 C42 88 34 80 32 70 C28 58 36 44 48 38 L48 30 C48 24 44 18 38 16 C34 15 30 18 30 22 C30 26 34 28 36 26" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <circle cx="36" cy="18" r="5" fill="currentColor" />
    <path d="M48 30 C56 26 64 28 68 34 C74 42 72 52 64 60" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M60 64 C72 64 84 58 86 46 C86 38 80 34 74 36" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <ellipse cx="50" cy="68" rx="28" ry="14" fill="currentColor" />
    <path d="M50 54 L50 82" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
    <path d="M38 76 L32 90" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M62 76 L68 90" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const Adinkrahene: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" />
    <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" strokeWidth="6" />
    <circle cx="50" cy="50" r="12" fill="currentColor" />
  </svg>
);

const Dwennimmen: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M50 50 C50 38 44 18 30 14 C16 10 8 22 14 34 C20 44 32 46 40 42 C44 40 48 36 50 32" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    <path d="M50 50 C50 38 56 18 70 14 C84 10 92 22 86 34 C80 44 68 46 60 42 C56 40 52 36 50 32" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    <path d="M50 50 C50 62 44 82 30 86 C16 90 8 78 14 66 C20 56 32 54 40 58 C44 60 48 64 50 68" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    <path d="M50 50 C50 62 56 82 70 86 C84 90 92 78 86 66 C80 56 68 54 60 58 C56 60 52 64 50 68" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    <circle cx="50" cy="50" r="6" fill="currentColor" />
  </svg>
);

const Nkyinkyim: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M50 50 C50 36 44 20 30 14 C22 10 24 18 30 22 C36 26 40 34 40 40" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    <path d="M50 50 C64 50 80 44 86 30 C90 22 82 24 78 30 C74 36 66 40 60 40" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    <path d="M50 50 C50 64 56 80 70 86 C78 90 76 82 70 78 C64 74 60 66 60 60" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    <path d="M50 50 C36 50 20 56 14 70 C10 78 18 76 22 70 C26 64 34 60 40 60" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    <circle cx="50" cy="50" r="7" fill="currentColor" />
  </svg>
);

const Nsoromma: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M50 6 L56 42 L94 50 L56 58 L50 94 L44 58 L6 50 L44 42 Z" fill="currentColor" />
    <circle cx="50" cy="50" r="10" fill="var(--color-bg, #000)" />
  </svg>
);

const Aya: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <line x1="50" y1="90" x2="50" y2="10" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    <path d="M50 78 C42 70 22 68 18 58 C14 48 30 42 50 54" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M50 78 C58 70 78 68 82 58 C86 48 70 42 50 54" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M50 56 C42 48 24 46 20 36 C16 26 32 22 50 34" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M50 56 C58 48 76 46 80 36 C84 26 68 22 50 34" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M50 36 C44 30 30 28 28 20 C26 14 38 12 50 20" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    <path d="M50 36 C56 30 70 28 72 20 C74 14 62 12 50 20" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

interface Placement {
  Symbol: React.FC<{ className?: string }>;
  style: React.CSSProperties;
  symOpacity: number;
  label: string;
}

const PLACEMENTS: Placement[] = [
  { Symbol: GyeNyame, style: { top: '6%', left: '5%', width: 140, height: 140, transform: 'rotate(-6deg)' }, symOpacity: 0.70, label: 'gye-nyame-tl' },
  { Symbol: Adinkrahene, style: { bottom: '7%', right: '5%', width: 150, height: 150 }, symOpacity: 0.60, label: 'adinkrahene-br' },
  { Symbol: Dwennimmen, style: { top: '10%', right: '7%', width: 130, height: 130, transform: 'rotate(10deg)' }, symOpacity: 0.65, label: 'dwennimmen-tr' },
  { Symbol: Aya, style: { bottom: '6%', left: '8%', width: 120, height: 120, transform: 'rotate(5deg)' }, symOpacity: 0.60, label: 'aya-bl' },
  { Symbol: Sankofa, style: { top: '40%', left: '2%', width: 100, height: 100, transform: 'rotate(8deg)' }, symOpacity: 0.60, label: 'sankofa-ml' },
  { Symbol: Nkyinkyim, style: { top: '22%', right: '20%', width: 96, height: 96, transform: 'rotate(-12deg)' }, symOpacity: 0.55, label: 'nkyinkyim-tm' },
  { Symbol: Nsoromma, style: { bottom: '30%', left: '26%', width: 90, height: 90, transform: 'rotate(15deg)' }, symOpacity: 0.55, label: 'nsoromma-bml' },
  { Symbol: GyeNyame, style: { top: '58%', right: '14%', width: 80, height: 80, transform: 'rotate(18deg)' }, symOpacity: 0.45, label: 'gye-nyame-sm1' },
  { Symbol: Adinkrahene, style: { top: '16%', left: '38%', width: 72, height: 72 }, symOpacity: 0.42, label: 'adinkrahene-sm' },
  { Symbol: Nsoromma, style: { top: '7%', right: '30%', width: 68, height: 68, transform: 'rotate(22deg)' }, symOpacity: 0.42, label: 'nsoromma-sm' },
  { Symbol: Aya, style: { top: '74%', right: '28%', width: 72, height: 72, transform: 'rotate(-8deg)' }, symOpacity: 0.42, label: 'aya-sm' },
  { Symbol: Dwennimmen, style: { bottom: '18%', left: '46%', width: 76, height: 76, transform: 'rotate(-15deg)' }, symOpacity: 0.42, label: 'dwennimmen-sm' },
  { Symbol: Sankofa, style: { top: '84%', left: '56%', width: 68, height: 68, transform: 'rotate(12deg)' }, symOpacity: 0.40, label: 'sankofa-sm' },
];

const AdinkraBackground: React.FC<AdinkraBackgroundProps> = ({
  opacity = 0.18,
  includeGradients = true,
  includeDotGrid = true,
  className = '',
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Significantly boost opacity in light theme to make symbols "painted" and visible
  const effectiveOpacity = isLight ? 0.45 : opacity * (includeGradients ? 1.5 : 1);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {includeDotGrid && <div className="absolute inset-0 dot-grid opacity-[0.04]" />}
      {includeGradients && (
        <>
          <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-[120px]" />
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-accent/[0.04] rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/[0.02] rounded-full blur-[80px]" />
        </>
      )}

      {/* Adinkra symbols layer - Force text-accent to match light theme green */}
      <div 
        className="absolute inset-0 text-accent transition-opacity duration-300" 
        style={{ opacity: effectiveOpacity }}
      >
        {PLACEMENTS.map(({ Symbol, style, symOpacity, label }) => (
          <div
            key={label}
            className="absolute"
            style={{ ...style, opacity: isLight ? Math.min(symOpacity * 1.5, 1) : symOpacity }}
          >
            <Symbol className="w-full h-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdinkraBackground;
