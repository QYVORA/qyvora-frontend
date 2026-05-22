import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeImageProps {
  src: string;
  alt: string;
  isLocked?: boolean;
  className?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
}

const LOCKED_BADGE_PATH = '/assets/achievements/locked/locked-badge.png';
const PLACEHOLDER_PATH = '/assets/achievements/locked/placeholder.png';

export const BadgeImage: React.FC<BadgeImageProps> = ({
  src,
  alt,
  isLocked = false,
  className,
  rarity = 'common',
}) => {
  const [error, setError] = useState(false);

  const finalSrc = isLocked ? (error ? LOCKED_BADGE_PATH : src) : (error ? PLACEHOLDER_PATH : src);

  return (
    <div className={twMerge('relative aspect-square overflow-hidden flex items-center justify-center', className)}>
      <img
        src={finalSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setError(true)}
        className={clsx(
          'w-full h-full object-contain transition-all duration-500',
          isLocked && 'grayscale opacity-40 brightness-50',
          !isLocked && 'group-hover:scale-110'
        )}
      />
      
      {/* Rarity Glow Effect */}
      {!isLocked && (
        <div className={clsx(
          'absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur-xl',
          rarity === 'common' && 'bg-slate-400',
          rarity === 'uncommon' && 'bg-emerald-400',
          rarity === 'rare' && 'bg-blue-400',
          rarity === 'epic' && 'bg-purple-400',
          rarity === 'legendary' && 'bg-amber-400',
          rarity === 'mythic' && 'bg-red-400'
        )} />
      )}
    </div>
  );
};
