import React from 'react';
import { Achievement, AchievementCard } from './AchievementCard';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AchievementShowcaseProps {
  achievements: Achievement[];
  title?: string;
  limit?: number;
  viewAllHref?: string;
}

export const AchievementShowcase: React.FC<AchievementShowcaseProps> = ({
  achievements,
  title = "Recent Achievements",
  limit = 4,
  viewAllHref = "/student/achievements"
}) => {
  const displayAchievements = achievements.slice(0, limit);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary">
          {title}
        </h3>
        {viewAllHref && (
          <Link 
            to={viewAllHref}
            className="text-[10px] font-bold uppercase tracking-widest text-accent hover:opacity-80 transition-opacity flex items-center gap-1"
          >
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {displayAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AchievementCard achievement={achievement} />
          </motion.div>
        ))}
        
        {displayAchievements.length < limit && Array.from({ length: limit - displayAchievements.length }).map((_, i) => (
          <div 
            key={`placeholder-${i}`}
            className="aspect-square rounded-xl border border-dashed border-white/5 bg-white/[0.02] flex items-center justify-center"
          >
            <span className="text-[10px] uppercase tracking-widest text-white/10 font-bold">Empty Slot</span>
          </div>
        ))}
      </div>
    </div>
  );
};
