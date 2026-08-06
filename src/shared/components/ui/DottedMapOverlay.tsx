import React from 'react';
import { getDottedMapBg } from '@/shared/utils/dottedMap';

interface DottedMapOverlayProps {
  /** Opacity of the dotted map. Default 0.16 — visible on both themes. */
  opacity?: number;
  /** Extra classes (e.g. border-radius). The overlay is inset to its parent. */
  className?: string;
}

/**
 * Subtle accent-colored dotted world-map background, part of the public design
 * language. Reuses the shared `getDottedMapBg` generator so the pattern stays
 * consistent and theme-adaptive (dots inherit `text-accent`).
 *
 * Renders a single full map per card — no repetition — sized and centered
 * dynamically to fill its parent (fluid UI).
 *
 * Reserved for large public-facing content cards — do NOT use on dashboard or
 * authenticated application surfaces.
 */
const DottedMapOverlay: React.FC<DottedMapOverlayProps> = ({ opacity = 0.16, className = '' }) => (
  <div
    aria-hidden
    className={`absolute inset-0 pointer-events-none overflow-hidden text-accent ${className}`}
    style={{
      backgroundImage: getDottedMapBg(),
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      opacity,
    }}
  />
);

export default DottedMapOverlay;
