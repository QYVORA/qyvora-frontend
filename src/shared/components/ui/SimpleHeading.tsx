/**
 * SimpleHeading.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Canonical dynamic section heading. Encodes the "fluid, fill-the-section"
 * heading used across public + landing split-screen sections: a huge
 * `font-black` title with an accent-word split, never a small static strip.
 * Optionally renders a kicker (eyebrow) above and a description below, so it
 * can be used as a complete split-screen section header block.
 *
 * Matches hero text design with accent/near-black split on accent surfaces
 * (on-accent) in both dark and light themes.
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
  /** Explicit accent string rendered verbatim after `text` (overrides accentWords/accentPlacement). */
  accentText?: string;
  /** Whether to highlight words from the 'start' or 'end' of the text. Default: 'start' */
  accentPlacement?: 'start' | 'end';
  /** Color variant: 'default' = white+accent on dark bg, 'inverted' = black on accent bg */
  variant?: 'default' | 'inverted';
  /** Optional eyebrow/kicker rendered above the title. */
  kicker?: string;
  /** Optional short description rendered below the title. */
  description?: React.ReactNode;
  /** Max width constraint for the description text. */
  descriptionWidth?: string;
}

const SimpleHeading: React.FC<SimpleHeadingProps> = ({
  text,
  className = '',
  align = 'center',
  compact = false,
  accentWords = 0,
  accentText,
  accentPlacement = 'start',
  variant = 'default',
  kicker,
  description,
  descriptionWidth = 'max-w-xl',
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

  const primaryClass = variant === 'inverted' ? 'text-on-accent' : 'text-text-primary';
  const accentClass = variant === 'inverted' ? 'text-on-accent/80' : 'text-accent';

  const title = (
    <h2
      className={cn(
        'font-black tracking-tight leading-[1.06]',
        sizeClass,
        alignClass,
        className
      )}
    >
      {accentText ? (
        <>
          <span className={primaryClass}>{text}</span>{' '}
          <span className={accentClass}>{accentText}</span>
        </>
      ) : accentWords > 0 ? (
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

  if (!kicker && !description) {
    return title;
  }

  const descriptionClass =
    align === 'center'
      ? 'mx-auto'
      : align === 'right'
        ? 'ml-auto'
        : '';

  return (
    <div className="space-y-4">
      {kicker && (
        <span className="block text-kicker font-black uppercase tracking-[0.3em] text-accent">
          {kicker}
        </span>
      )}
      {title}
      {description && (
        <p
          className={cn(
            'text-base sm:text-lg text-text-muted leading-relaxed font-mono',
            descriptionWidth,
            descriptionClass
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default SimpleHeading;
