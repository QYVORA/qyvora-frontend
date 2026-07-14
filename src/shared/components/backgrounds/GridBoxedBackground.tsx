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
  right: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.03) 20%, rgba(0,0,0,0.12) 35%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.8) 80%, black 100%)',
  left: 'linear-gradient(to left, transparent 0%, rgba(0,0,0,0.03) 20%, rgba(0,0,0,0.12) 35%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.8) 80%, black 100%)',
  center: 'radial-gradient(ellipse at center, black 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
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
