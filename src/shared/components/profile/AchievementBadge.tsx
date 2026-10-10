import React, { useState, useRef, useEffect } from 'react';
import type { Achievement } from '@/shared/constants/achievements';
import AchievementDetails from './AchievementDetails';

interface AchievementBadgeProps {
  achievement: Achievement;
  completionDate?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: 'w-12 h-12 p-1.5',
  md: 'w-16 h-16 p-2',
  lg: 'w-20 h-20 p-2.5',
};

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  completionDate,
  size = 'md',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const Icon = achievement.IconComponent;

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [open]);

  // Close on Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      e.stopPropagation();
      setOpen(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* 
        Direct transparent insignia presentation:
        Displayed directly on the page without wrapping in a card, tile, colored background,
        decorative frame, or unnecessary border.
      */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-label={`${achievement.title} (${achievement.category}) — View details`}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`group relative flex items-center justify-center transition-transform duration-150 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${SIZES[size]} ${className}`}
      >
        <div className="relative flex h-full w-full items-center justify-center">
          <Icon className="h-full w-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] transition-opacity duration-150 group-hover:opacity-100" />
        </div>
      </button>

      {/* Accessible popover details on tap / activation */}
      {open && (
        <div className="absolute left-1/2 top-full z-40 mt-2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-72 sm:w-80">
          <AchievementDetails
            achievement={achievement}
            completionDate={completionDate}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default AchievementBadge;
