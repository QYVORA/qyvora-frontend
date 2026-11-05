import React from 'react';
import streakIconImg from '@/assets/icons/streak-icon.png';

interface StreakIconProps {
  className?: string;
  size?: number;
}

/**
 * StreakIcon - Custom geometric flame icon for streak display
 * Uses the neon green geometric flame logo asset
 */
export const StreakIcon: React.FC<StreakIconProps> = ({ 
  className = '', 
  size = 20 
}) => {
  return (
    <img
      src={streakIconImg}
      alt="Streak"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
};

export default StreakIcon;
