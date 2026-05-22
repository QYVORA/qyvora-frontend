import React from 'react';
import { Achievement } from './AchievementCard';
import { AchievementGrid } from './AchievementGrid';
import { LucideIcon } from 'lucide-react';

interface AchievementCategoryProps {
  title: string;
  icon: LucideIcon;
  achievements: Achievement[];
  onAchievementClick?: (achievement: Achievement) => void;
}

export const AchievementCategory: React.FC<AchievementCategoryProps> = ({
  title,
  icon: Icon,
  achievements,
  onAchievementClick,
}) => {
  const earnedCount = achievements.filter(a => !a.isLocked).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Icon className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary uppercase tracking-wider">{title}</h3>
            <p className="text-xs text-text-secondary">
              {earnedCount} of {totalCount} discovered
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden hidden sm:block">
            <div 
              className="h-full bg-accent transition-all duration-1000" 
              style={{ width: `${(earnedCount / totalCount) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono text-accent">
            {Math.round((earnedCount / totalCount) * 100)}%
          </span>
        </div>
      </div>

      <AchievementGrid 
        achievements={achievements} 
        onAchievementClick={onAchievementClick}
      />
    </div>
  );
};
