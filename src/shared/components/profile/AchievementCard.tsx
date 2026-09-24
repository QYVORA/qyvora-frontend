import type { ReactNode } from 'react';

export interface Achievement {
  id: string;
  type: 'lab' | 'course' | 'bootcamp' | 'rank' | 'streak' | 'challenge';
  title: string;
  description?: string;
  icon?: ReactNode;
  color?: string;
  earnedAt?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export const RARITY_STYLES: Record<string, { border: string; bg: string; glow: string }> = {
  common: {
    border: 'border-border-subtle',
    bg: 'bg-surface-raised',
    glow: '',
  },
  uncommon: {
    border: 'border-accent/25',
    bg: 'bg-accent/[0.04]',
    glow: '',
  },
  rare: {
    border: 'border-accent/30',
    bg: 'bg-accent/5',
    glow: '',
  },
  epic: {
    border: 'border-accent/40',
    bg: 'bg-accent/10',
    glow: '',
  },
  legendary: {
    border: 'border-accent/50',
    bg: 'bg-accent/15',
    glow: '',
  },
};