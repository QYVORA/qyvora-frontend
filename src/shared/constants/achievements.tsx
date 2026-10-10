import React from 'react';
import { COURSES } from '@/features/student/data/courses/courseData';
import { COURSE_ICON_MAP } from '@/features/student/data/courses/courseIcons';
import { LABS } from '@/features/student/constants/labs';
import { LAB_ICON_MAP } from '@/shared/components/icons/lab-icons';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampStructure';
import HpbAvatar from '@/shared/components/HpbAvatar';
import BootcampBadge from '@/shared/components/BootcampBadge';

export type AchievementType = 'course' | 'lab' | 'bootcamp';

export interface Achievement {
  id: string;
  type: AchievementType;
  title: string;
  category: string;
  description: string;
  IconComponent: React.ComponentType<{ className?: string }>;
  accentColor: string;
  cpReward?: string | number;
}

/**
 * 12 Canonical Course Achievements
 * Primary artwork: dedicated transparent vector logo insignia.
 */
export const COURSE_ACHIEVEMENTS: Achievement[] = COURSES.map((course) => {
  const iconCfg = COURSE_ICON_MAP[course.id];
  return {
    id: course.id,
    type: 'course' as const,
    title: course.title,
    category: course.categoryId,
    description: course.description,
    IconComponent: iconCfg?.icon || (() => null),
    accentColor: '#06B66F',
    cpReward: '100',
  };
});

/**
 * 5 Canonical Lab Achievements
 * Primary artwork: transparent lab illustration insignia without outer card framing.
 */
export const LAB_ACHIEVEMENTS: Achievement[] = LABS.map((lab) => {
  const Icon = LAB_ICON_MAP[lab.id] || (() => null);
  return {
    id: lab.id,
    type: 'lab' as const,
    title: lab.title,
    category: 'Attack Lab',
    description: lab.desc,
    IconComponent: Icon,
    accentColor: lab.accentColor || '#06B66F',
    cpReward: lab.cpReward,
  };
});

/**
 * Bootcamp Achievements (Preserved compatibility)
 */
export const BOOTCAMP_PHASE_ACHIEVEMENTS: Achievement[] = BOOTCAMP_CONFIG.phases.map((phase) => ({
  id: `phase-${phase.id}`,
  type: 'bootcamp' as const,
  title: phase.title,
  category: 'Bootcamp Phase',
  description: phase.codename,
  IconComponent: ({ className }: { className?: string }) => (
    <div className={`flex items-center justify-center ${className}`}>
      <HpbAvatar variant={phase.id as 'phase1'} size="md" />
    </div>
  ),
  accentColor: '#06B66F',
  cpReward: '250',
}));

export const BOOTCAMP_GRADUATE_ACHIEVEMENT: Achievement = {
  id: 'hpb-graduate',
  type: 'bootcamp',
  title: 'HPB Graduate',
  category: 'Bootcamp Certification',
  description: 'Completed the complete Hacker Protocol Bootcamp track.',
  IconComponent: ({ className }: { className?: string }) => (
    <div className={`flex items-center justify-center ${className}`}>
      <BootcampBadge completed className="w-full h-full" />
    </div>
  ),
  accentColor: '#06B66F',
};

const ALL_ACHIEVEMENTS_MAP = new Map<string, Achievement>();

[
  ...COURSE_ACHIEVEMENTS,
  ...LAB_ACHIEVEMENTS,
  ...BOOTCAMP_PHASE_ACHIEVEMENTS,
  BOOTCAMP_GRADUATE_ACHIEVEMENT,
].forEach((ach) => {
  ALL_ACHIEVEMENTS_MAP.set(ach.id, ach);
  // Also register shorthand aliases for labs e.g. 'kill-chain' -> 'killchain'
  if (ach.id === 'killchain') ALL_ACHIEVEMENTS_MAP.set('kill-chain', ach);
  if (ach.id === 'sqli') ALL_ACHIEVEMENTS_MAP.set('sql-injection', ach);
});

export function getAchievementById(id: string): Achievement | undefined {
  return ALL_ACHIEVEMENTS_MAP.get(id);
}

export function getAllAchievements(): Achievement[] {
  return Array.from(ALL_ACHIEVEMENTS_MAP.values());
}
