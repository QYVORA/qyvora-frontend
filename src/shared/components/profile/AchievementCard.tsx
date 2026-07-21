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
