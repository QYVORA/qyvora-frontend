import React from 'react';
import HeroGridAnimation from '@/features/marketing/components/landing/HeroGridAnimation';

interface GridBoxedBackgroundProps {
  className?: string;
  opacity?: number;
  blur?: number;
  reduced?: boolean;
  mask?: 'right' | 'left' | 'center' | 'none';
}

const MASKS: Record<string, string> = {
  right: 'linear-gradient(to right, transparent 0%, color-mix(in srgb, var(--color-bg) 3%, transparent) 20%, color-mix(in srgb, var(--color-bg) 12%, transparent) 35%, color-mix(in srgb, var(--color-bg) 30%, transparent) 50%, color-mix(in srgb, var(--color-bg) 55%, transparent) 65%, color-mix(in srgb, var(--color-bg) 80%, transparent) 80%, var(--color-bg) 100%)',
  left: 'linear-gradient(to left, transparent 0%, color-mix(in srgb, var(--color-bg) 3%, transparent) 20%, color-mix(in srgb, var(--color-bg) 12%, transparent) 35%, color-mix(in srgb, var(--color-bg) 30%, transparent) 50%, color-mix(in srgb, var(--color-bg) 55%, transparent) 65%, color-mix(in srgb, var(--color-bg) 80%, transparent) 80%, var(--color-bg) 100%)',
  center: 'radial-gradient(ellipse at center, var(--color-bg) 0%, color-mix(in srgb, var(--color-bg) 60%, transparent) 50%, transparent 100%)',
  none: 'none',
};

const GridBoxedBackground: React.FC<GridBoxedBackgroundProps> = ({
  className = '',
  opacity = 0.6,
  blur = 2,
  reduced = false,
  mask = 'right',
}) => {
  const maskImage = MASKS[mask] || MASKS.right;

  return (
    <div
      className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${className}`}
      style={{
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        maskImage,
        WebkitMaskImage: maskImage,
      }}
    >
      <HeroGridAnimation reduced={reduced} />
    </div>
  );
};

export default React.memo(GridBoxedBackground);
