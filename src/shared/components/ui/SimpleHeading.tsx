/**
 * SimpleHeading.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Simple, clean heading component that replaces ASCII art headings.
 * Matches hero text design with accent/white color split in dark theme,
 * and accent/black split in light theme.
 */

import React from 'react';
import { cn } from '../../../shared/utils/cn';

interface SimpleHeadingProps {
  text: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
  compact?: boolean;
  /** Number of words to highlight with the accent color */
  accentWords?: number;
  /** Whether to highlight words from the 'start' or 'end' of the text. Default: 'start' */
  accentPlacement?: 'start' | 'end';
  /** Color variant: 'default' = white+accent on dark bg, 'inverted' = black on accent bg */
  variant?: 'default' | 'inverted';
}

const SimpleHeading: React.FC<SimpleHeadingProps> = ({
  text,
  className = '',
  align = 'center',
  compact = false,
  accentWords = 0,
  accentPlacement = 'start',
  variant = 'default',
}) => {
  const words = text.split(' ');
  
  let accentPart = '';
  let primaryPart = '';

  if (accentWords > 0) {
    if (accentPlacement === 'start') {
      accentPart = words.slice(0, accentWords).join(' ');
      primaryPart = words.slice(accentWords).join(' ');
    } else {
      accentPart = words.slice(words.length - accentWords).join(' ');
      primaryPart = words.slice(0, words.length - accentWords).join(' ');
    }
  } else {
    primaryPart = text;
  }

  const alignClass = 
    align === 'center' ? 'text-center' : 
    align === 'right' ? 'text-right' : 
    'text-left';

  const sizeClass = compact 
    ? 'text-3xl md:text-4xl lg:text-5xl' 
    : 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl';

  const primaryClass = variant === 'inverted' ? 'text-bg' : 'text-text-primary';
  const accentClass = variant === 'inverted' ? 'text-bg/80' : 'text-accent';

  return (
    <h2
      className={cn(
        'font-black tracking-tight leading-[1.06]',
        sizeClass,
        alignClass,
        className
      )}
    >
      {accentWords > 0 ? (
        accentPlacement === 'start' ? (
          <>
            <span className={accentClass}>{accentPart}</span>
            {primaryPart && <span className={primaryClass}> {primaryPart}</span>}
          </>
        ) : (
          <>
            <span className={primaryClass}>{primaryPart}</span>
            {accentPart && <span className={accentClass}> {accentPart}</span>}
          </>
        )
      ) : (
        <span className={primaryClass}>{text}</span>
      )}
    </h2>
  );
};

export default SimpleHeading;
