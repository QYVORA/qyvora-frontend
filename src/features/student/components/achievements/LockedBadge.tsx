import React from 'react';
import { BadgeImage } from './BadgeImage';
import { Lock } from 'lucide-react';

interface LockedBadgeProps {
  image: string;
  title: string;
  className?: string;
  showLockIcon?: boolean;
}

export const LockedBadge: React.FC<LockedBadgeProps> = ({
  image,
  title,
  className = "w-24 h-24",
  showLockIcon = true,
}) => {
  return (
    <div className="relative group">
      <BadgeImage
        src={image}
        alt={title}
        isLocked={true}
        className={className}
      />
      
      {showLockIcon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-bg/60 backdrop-blur-sm p-2 rounded-full border border-white/10 opacity-60 group-hover:opacity-100 transition-opacity">
            <Lock className="w-4 h-4 text-text-secondary" />
          </div>
        </div>
      )}
    </div>
  );
};
