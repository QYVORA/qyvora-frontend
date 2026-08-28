export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  hackerHandle: string;
  organization: string;
  cp: number;
  rankLabel: string;
  roomsCompleted: number;
  streakDays: number;
  bootcampStatus?: string;
}

export type Period = 'all' | 'week' | 'month';

export const PERIODS = [
  { key: 'all' as const, labelKey: 'leaderboardPage.periods.all' },
  { key: 'week' as const, labelKey: 'leaderboardPage.periods.week' },
  { key: 'month' as const, labelKey: 'leaderboardPage.periods.month' },
];

export const TOP_THREE_COLORS = [
  'text-warning',
  'text-gray-300',
  'text-amber-600',
];

export const RANK_COLORS: Record<string, string> = {
  Vanguard: 'text-accent',
  Architect: 'text-warning',
  Specialist: 'text-purple-400',
  Contributor: 'text-info',
  Candidate: 'text-zinc-400',
};
