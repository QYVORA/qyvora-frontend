import React from 'react';
import {
  Trophy,
  Shield,
  FlaskConical,
  GraduationCap,
  Target,
  Zap,
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

export const RARITY_STYLES: Record<string, { border: string; bg: string; glow: string }> = {
  common: {
    border: 'border-border/50',
    bg: 'bg-bg-card',
    glow: '',
  },
  uncommon: {
    border: 'border-accent/30',
    bg: 'bg-accent/5',
    glow: '',
  },
  rare: {
    border: 'border-info/30',
    bg: 'bg-info/5',
    glow: 'hover:shadow-[0_0_20px] hover:shadow-info/15',
  },
  epic: {
    border: 'border-purple-400/30',
    bg: 'bg-purple-400/5',
    glow: 'hover:shadow-[0_0_20px] hover:shadow-accent/15',
  },
  legendary: {
    border: 'border-warning/30',
    bg: 'bg-warning/5',
    glow: 'hover:shadow-[0_0_20px] hover:shadow-warning/15',
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
  lab: 'text-danger',
  course: 'text-info',
  bootcamp: 'text-accent',
  rank: 'text-warning',
  streak: 'text-orange-400',
  challenge: 'text-purple-400',
};
