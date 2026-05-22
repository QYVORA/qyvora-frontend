import React from 'react';
import { BadgeImage } from './BadgeImage';
import { RarityFrame, Rarity } from './RarityFrame';
import { motion } from 'motion/react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  image: string;
  rarity: Rarity;
  isLocked: boolean;
  earnedAt?: string;
  progress?: number;
  total?: number;
}

interface AchievementCardProps {
  achievement: Achievement;
  onClick?: (achievement: Achievement) => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  onClick,
}) => {
  const { title, description, image, rarity, isLocked, progress, total } = achievement;
  const showProgress = !isLocked && progress !== undefined && total !== undefined && progress < total;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={() => onClick?.(achievement)}
    >
      <RarityFrame rarity={rarity} isLocked={isLocked}>
        <div className="flex flex-col items-center text-center space-y-3">
          <BadgeImage
            src={image}
            alt={title}
            rarity={rarity}
            isLocked={isLocked}
            className="w-24 h-24"
          />
          
          <div className="space-y-1">
            <h4 className={`text-sm font-bold uppercase tracking-wider ${isLocked ? 'text-text-secondary' : 'text-text-primary'}`}>
              {title}
            </h4>
            <p className="text-[10px] text-text-secondary line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>

          {showProgress && (
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-1000" 
                style={{ width: `${(progress / total) * 100}%` }}
              />
            </div>
          )}
          
          {isLocked && !showProgress && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/20 bg-white/5 px-2 py-0.5 rounded-sm">
              Locked
            </span>
          )}
        </div>
      </RarityFrame>
    </motion.div>
  );
};
