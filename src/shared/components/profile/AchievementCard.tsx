import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
  Trophy,
  Shield,
  FlaskConical,
  GraduationCap,
  Target,
  Zap,
  Award,
  Flame,
} from 'lucide-react';

export interface Achievement {
  id: string;
  type: 'lab' | 'course' | 'bootcamp' | 'rank' | 'streak' | 'challenge';
  title: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  earnedAt?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

interface AchievementCardProps {
  achievements: Achievement[];
  className?: string;
}

export const RARITY_STYLES: Record<string, { border: string; bg: string; glow: string }> = {
  common: {
    border: 'border-border/30',
    bg: 'bg-bg-card',
    glow: '',
  },
  uncommon: {
    border: 'border-accent/30',
    bg: 'bg-accent/5',
    glow: '',
  },
  rare: {
    border: 'border-blue-400/30',
    bg: 'bg-blue-400/5',
    glow: 'hover:shadow-[0_0_20px_rgba(96,165,250,0.15)]',
  },
  epic: {
    border: 'border-purple-400/30',
    bg: 'bg-purple-400/5',
    glow: 'hover:shadow-[0_0_20px_rgba(192,132,252,0.15)]',
  },
  legendary: {
    border: 'border-amber-400/30',
    bg: 'bg-amber-400/5',
    glow: 'hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]',
  },
};

export const TYPE_ICONS: Record<string, React.ReactNode> = {
  lab: <FlaskConical className="w-4 h-4" />,
  course: <GraduationCap className="w-4 h-4" />,
  bootcamp: <Shield className="w-4 h-4" />,
  rank: <Trophy className="w-4 h-4" />,
  streak: <Flame className="w-4 h-4" />,
  challenge: <Target className="w-4 h-4" />,
};

export const TYPE_COLORS: Record<string, string> = {
  lab: 'text-red-400',
  course: 'text-blue-400',
  bootcamp: 'text-accent',
  rank: 'text-amber-400',
  streak: 'text-orange-400',
  challenge: 'text-purple-400',
};

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievements,
  className = '',
}) => {
  const { t } = useTranslation();

  if (achievements.length === 0) {
    return (
      <div className={`rounded-2xl border border-border/30 bg-bg-card p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Award className="w-4 h-4 text-accent" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">
            {t('profile.achievements.title', 'Achievements')}
          </h3>
        </div>
        <p className="text-xs text-text-muted text-center py-4">
          {t('profile.achievements.empty', 'No achievements yet. Start learning to earn your first!')}
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-border/30 bg-bg-card overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Award className="w-4 h-4 text-accent" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">
              {t('profile.achievements.title', 'Achievements')}
            </h3>
          </div>
          <span className="px-2 py-1 bg-accent/10 text-accent text-[9px] font-black rounded-lg">
            {achievements.length}
          </span>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {achievements.map((achievement, idx) => {
          const rarity = achievement.rarity || 'common';
          const styles = RARITY_STYLES[rarity];
          const typeIcon = achievement.icon || TYPE_ICONS[achievement.type];
          const typeColor = achievement.color || TYPE_COLORS[achievement.type];

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`
                relative group flex flex-col items-center text-center p-4 rounded-xl border
                transition-all duration-300 hover:scale-[1.02] cursor-default
                ${styles.border} ${styles.bg} ${styles.glow}
              `}
            >
              {/* Icon */}
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center mb-3
                ${rarity === 'legendary' ? 'bg-amber-400/10' : 
                  rarity === 'epic' ? 'bg-purple-400/10' :
                  rarity === 'rare' ? 'bg-blue-400/10' :
                  'bg-accent/10'}
              `}>
                <span className={typeColor}>{typeIcon}</span>
              </div>

              {/* Title */}
              <h4 className="text-[10px] font-black uppercase tracking-widest text-text-primary leading-tight mb-1">
                {achievement.title}
              </h4>

              {/* Description */}
              {achievement.description && (
                <p className="text-[9px] text-text-muted leading-snug line-clamp-2">
                  {achievement.description}
                </p>
              )}

              {/* Rarity Badge */}
              {rarity !== 'common' && (
                <span className={`
                  mt-2 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider
                  ${rarity === 'legendary' ? 'bg-amber-400/20 text-amber-400' :
                    rarity === 'epic' ? 'bg-purple-400/20 text-purple-400' :
                    rarity === 'rare' ? 'bg-blue-400/20 text-blue-400' :
                    'bg-accent/20 text-accent'}
                `}>
                  {rarity}
                </span>
              )}

              {/* Earned Date */}
              {achievement.earnedAt && (
                <span className="mt-2 text-[8px] text-text-muted/50 font-mono">
                  {new Date(achievement.earnedAt).toLocaleDateString()}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementCard;
