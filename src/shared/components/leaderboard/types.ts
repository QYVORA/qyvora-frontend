import type { ProgressionStats } from '@/shared/types/profile';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  hackerHandle: string;
  organization: string;
  cp: number;
  rankLabel: string;
  progression?: ProgressionStats;
  roomsCompleted: number;
  streakDays: number;
  bootcampStatus?: string;
}

export type Period = 'all' | 'week' | 'month';

export const PERIODS = [
  { key: 'all' as const, label: 'All Time' },
  { key: 'week' as const, label: 'This Week' },
  { key: 'month' as const, label: 'This Month' },
];

export const TOP_THREE_COLORS = [
  'text-accent',
  'text-accent/80',
  'text-accent/50',
];

export const RANK_COLORS: Record<string, string> = {
  // Legacy CP-based ladder (kept for backward compatibility)
  Vanguard: 'text-accent',
  Architect: 'text-warning',
  Specialist: 'text-info',
  Contributor: 'text-info',
  Candidate: 'text-text-muted',
  // Progression ladder (backend-driven)
  'Seeker': 'text-text-muted',
  'Operator': 'text-info',
  'Agent': 'text-warning',
  'Strategist': 'text-accent',
  'Master Operator': 'text-accent',
};
