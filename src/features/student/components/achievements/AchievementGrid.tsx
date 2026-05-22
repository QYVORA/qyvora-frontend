import React from 'react';
import { Achievement, AchievementCard } from './AchievementCard';

interface AchievementGridProps {
  achievements: Achievement[];
  onAchievementClick?: (achievement: Achievement) => void;
}

export const AchievementGrid: React.FC<AchievementGridProps> = ({
  achievements,
  onAchievementClick,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {achievements.map((achievement) => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          onClick={onAchievementClick}
        />
      ))}
    </div>
  );
};
