import React from 'react';
import { clsx } from 'clsx';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

interface RarityFrameProps {
  rarity: Rarity;
  isLocked?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const RarityFrame: React.FC<RarityFrameProps> = ({
  rarity,
  isLocked = false,
  children,
  className,
}) => {
  const getRarityStyles = () => {
    if (isLocked) return 'border-white/10 grayscale';
    
    switch (rarity) {
      case 'common': return 'border-slate-400/30 text-slate-400';
      case 'uncommon': return 'border-emerald-400/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
      case 'rare': return 'border-blue-400/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
      case 'epic': return 'border-purple-400/30 text-purple-400 shadow-[0_0_20px_rgba(139,92,246,0.15)]';
      case 'legendary': return 'border-amber-400/30 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.2)]';
      case 'mythic': return 'border-red-400/30 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.25)]';
      default: return 'border-white/20';
    }
  };

  return (
    <div className={clsx(
      'relative p-1 rounded-xl border transition-all duration-500 overflow-hidden group',
      getRarityStyles(),
      className
    )}>
      {/* Decorative corners for that "tactical" look */}
      {!isLocked && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-inherit" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-inherit" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-inherit" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-inherit" />
        </>
      )}

      {/* Actual Frame Image Overlay (Placeholder for future assets) */}
      {!isLocked && (
        <img 
          src={`/assets/achievements/frames/${rarity}-frame.png`} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      )}

      <div className="relative bg-bg-secondary/40 rounded-lg p-3 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
};
