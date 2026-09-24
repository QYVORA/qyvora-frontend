/**
 * Profile Types
 * ==============
 * Shared types for the profile page evolution.
 * Used by both ProfilePage (authenticated) and PublicProfilePage (unauthenticated).
 */

// ── Raw API response shapes ────────────────────────────────────────────────────

export interface CompletedRoom {
  roomId: number;
  title: string;
}

export interface XpSummary {
  rank?: string;
  level?: number;
  xp?: number;
  xpToNext?: number;
  progression?: ProgressionStats;
}

// ── Progression (backend-driven rank) ──────────────────────────────────────────
// All values are served by the backend (single source of truth). The frontend
// MUST NOT hardcode rank names or thresholds.

export interface ProgressionTier {
  id: string;
  name: string;
  minPoints: number;
  description: string;
  iconKey: string;
}

export interface ProgressionNextTier {
  id: string;
  name: string;
  points: number;
}

export interface ProgressionStats {
  points: number;
  tierId: string;
  rank: string;
  next: ProgressionNextTier | null;
  prev: ProgressionNextTier | null;
  pointsToNext: number;
  progress: number;
  capped: boolean;
}

export interface ProfileApiResponse {
  id?: string;
  name?: string;
  handle?: string;
  hackerHandle?: string;
  bio?: string;
  organization?: string;
  email?: string;
  cpPoints?: number;
  rank?: string;
  progression?: ProgressionStats;
  xpSummary?: XpSummary;
  bootcampStatus?: string;
  bootcampCompleted?: boolean;
  labsCompleted?: number;
  coursesCompleted?: number;
  completedPhaseIds?: string[];
  completedCourseIds?: string[];
  learn?: {
    completedRooms?: CompletedRoom[];
  };
  createdAt?: string;
  country?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

// ── Derived profile data (used by components) ──────────────────────────────────

export interface ProfileData {
  id: string;
  username: string;
  displayName: string;
  rank: string;
  progression?: ProgressionStats;
  bio: string;
  organization: string;
  email: string;
  cp: number;
  labsCompleted: number;
  coursesCompleted: number;
  bootcampCompleted: boolean;
  completedPhaseIds: string[];
  completedCourseIds: string[];
  completedRooms: CompletedRoom[];
  xpLevel: number;
  xpCurrent: number;
  xpToNext: number;
  joinDate: string;
  country: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
}

// ── Profile sections ───────────────────────────────────────────────────────────

export type ProfileSectionId =
  | 'identity'
  | 'stats'
  | 'activity'
  | 'achievements'
  | 'labs'
  | 'courses'
  | 'trophy';

export interface ProfileSection {
  id: ProfileSectionId;
  label: string;
}

export const PROFILE_SECTIONS: ProfileSection[] = [
  { id: 'identity', label: 'Identity' },
  { id: 'stats',        label: 'Statistics' },
  { id: 'activity', label: 'Activity' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'labs',         label: 'Labs' },
  { id: 'courses',      label: 'Courses' },
  { id: 'trophy',       label: 'Trophy Cabinet' },
];

// ── Activity timeline ──────────────────────────────────────────────────────────

export type ActivityType =
  | 'lab_completed'
  | 'course_completed'
  | 'bootcamp_completed'
  | 'achievement_earned'
  | 'rank_up'
  | 'login'
  | 'profile_updated';

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: string;
  icon?: string;
  color?: string;
}

// ── Skill display ──────────────────────────────────────────────────────────────

export interface SkillDisplay {
  key: string;
  label: string;
  shortLabel: string;
  color: string;
  completed: number;
  total: number;
  percentage: number;
}

// ── Trophy ─────────────────────────────────────────────────────────────────────

export type TrophyTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface Trophy {
  id: string;
  title: string;
  description: string;
  tier: TrophyTier;
  icon?: string;
  earnedAt?: string;
}

export const TIER_STYLES: Record<TrophyTier, { border: string; bg: string; glow: string; text: string }> = {
  bronze:   { border: 'border-border-subtle', bg: 'bg-surface-raised',     glow: '', text: 'text-text-muted' },
  silver:   { border: 'border-border-subtle', bg: 'bg-surface-raised',     glow: '', text: 'text-text-secondary' },
  gold:     { border: 'border-accent/30',     bg: 'bg-accent/5',          glow: '', text: 'text-accent' },
  platinum: { border: 'border-accent/40',     bg: 'bg-accent/10',         glow: '', text: 'text-accent' },
  diamond:  { border: 'border-accent/50',     bg: 'bg-accent/15',         glow: '', text: 'text-accent' },
};
