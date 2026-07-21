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
  xpSummary?: XpSummary;
  bootcampStatus?: string;
  bootcampCompleted?: boolean;
  labsCompleted?: number;
  coursesCompleted?: number;
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
  bio: string;
  organization: string;
  email: string;
  cp: number;
  labsCompleted: number;
  coursesCompleted: number;
  bootcampCompleted: boolean;
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
  | 'skills'
  | 'achievements'
  | 'labs'
  | 'courses'
  | 'bootcamp'
  | 'trophy';

export interface ProfileSection {
  id: ProfileSectionId;
  label: string;
  labelKey: string;
}

export const PROFILE_SECTIONS: ProfileSection[] = [
  { id: 'identity',     label: 'Identity',     labelKey: 'profile.nav.identity' },
  { id: 'stats',        label: 'Statistics',    labelKey: 'profile.nav.stats' },
  { id: 'activity',     label: 'Activity',      labelKey: 'profile.nav.activity' },
  { id: 'skills',       label: 'Skills',        labelKey: 'profile.nav.skills' },
  { id: 'achievements', label: 'Achievements',  labelKey: 'profile.nav.achievements' },
  { id: 'labs',         label: 'Labs',          labelKey: 'profile.nav.labs' },
  { id: 'courses',      label: 'Courses',       labelKey: 'profile.nav.courses' },
  { id: 'bootcamp',     label: 'Bootcamp',      labelKey: 'profile.nav.bootcamp' },
  { id: 'trophy',       label: 'Trophy Cabinet', labelKey: 'profile.nav.trophy' },
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
  bronze:   { border: 'border-amber-600/30',   bg: 'bg-amber-600/5',   glow: '',                              text: 'text-amber-600' },
  silver:   { border: 'border-gray-300/30',     bg: 'bg-gray-300/5',    glow: '',                              text: 'text-gray-300' },
  gold:     { border: 'border-yellow-400/30',   bg: 'bg-yellow-400/5',  glow: 'hover:shadow-[0_0_20px_rgba(250,204,21,0.15)]', text: 'text-yellow-400' },
  platinum: { border: 'border-accent/30',       bg: 'bg-accent/5',      glow: 'hover:shadow-[0_0_20px_rgba(6,182,111,0.15)]',  text: 'text-accent' },
  diamond:  { border: 'border-purple-400/30',   bg: 'bg-purple-400/5',  glow: 'hover:shadow-[0_0_20px_rgba(192,132,252,0.15)]', text: 'text-purple-400' },
};
