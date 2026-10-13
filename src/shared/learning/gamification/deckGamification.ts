/**
 * DECK GAMIFICATION — CORE
 * =========================
 * Pure, dependency-free maths for the learning deck economy:
 *   - Ranks from lifetime training XP
 *   - Combo multiplier tiers
 *   - Daily streak + daily XP target
 *
 * All functions are deterministic so they can be unit-tested without a DOM.
 */

// ── Ranks ────────────────────────────────────────────────────────────────────

export interface RankTier {
  name: string;
  xp: number;
}

export const RANKS: RankTier[] = [
  { name: 'Candidate', xp: 0 },
  { name: 'Novice', xp: 100 },
  { name: 'Operative', xp: 250 },
  { name: 'Hacker', xp: 500 },
  { name: 'Specialist', xp: 900 },
  { name: 'Pro', xp: 1500 },
  { name: 'Elite', xp: 2400 },
  { name: 'Elite+', xp: 3600 },
];

export interface RankInfo {
  rank: string;
  index: number;
  nextName: string | null;
  xpToNext: number | null;
  progressPct: number;
}

export function rankFor(xp: number): RankInfo {
  let index = 0;
  for (let i = RANKS.length - 1; i >= 0; i -= 1) {
    if (xp >= RANKS[i].xp) {
      index = i;
      break;
    }
  }
  const next = index < RANKS.length - 1 ? RANKS[index + 1] : null;
  const xpToNext = next ? Math.max(1, next.xp - xp) : null;
  const span = next ? next.xp - RANKS[index].xp : 1;
  const progressPct = next ? Math.round(((xp - RANKS[index].xp) / span) * 100) : 100;
  return {
    rank: RANKS[index].name,
    index,
    nextName: next ? next.name : null,
    xpToNext,
    progressPct: Math.max(0, Math.min(100, progressPct)),
  };
}

// ── Combo ────────────────────────────────────────────────────────────────────

/**
 * Multiplier tiers based on consecutive correctly-solved interactive cards.
 *   0-1 correct in a row  → 1.0x
 *   2-3 correct in a row  → 1.5x
 *   4+  correct in a row  → 2.0x
 */
export function comboMultiplier(combo: number): number {
  if (combo >= 4) return 2;
  if (combo >= 2) return 1.5;
  return 1;
}

export interface AwardInput {
  base: number;
  /** true for interactive cards (think/checkpoint/playground/command…) */
  interactive?: boolean;
  /** true when this interactive card was solved correctly */
  solved?: boolean;
  /** current combo against which the multiplier applies */
  combo: number;
}

export interface AwardResult {
  xp: number;
  base: number;
  bonus: number;
  multiplier: number;
  nextCombo: number;
}

/**
 * Award resolution:
 *   - Reading cards: flat base XP (view completes the card).
 *   - Interactive cards: base XP for viewing plus a bonus of `base × multiplier`
 *     when solved correctly. Combo increments only on solved interactives.
 */
export function resolveAward(input: AwardInput): AwardResult {
  const isInteractive = input.interactive === true;
  const solved = isInteractive && input.solved === true;
  const multiplier = solved ? comboMultiplier(input.combo) : 1;
  const bonus = solved ? Math.round(input.base * multiplier) : 0;
  const nextCombo = solved ? input.combo + 1 : isInteractive && !solved ? 0 : input.combo;
  return {
    xp: input.base + bonus,
    base: input.base,
    bonus,
    multiplier,
    nextCombo,
  };
}

// ── Streak / daily ───────────────────────────────────────────────────────────

export const DAILY_TARGET = 200;

export function dayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function yesterdayKey(from: Date = new Date()): string {
  const prev = new Date(from);
  prev.setDate(prev.getDate() - 1);
  return dayKey(prev);
}

export interface StreakState {
  streak: number;
  lastDay: string | null;
  daily: Record<string, number>;
}

/**
 * Register XP earned today. Extends the streak only on the day's first activity.
 */
export function registerDailyXp(
  state: StreakState,
  xp: number,
  today: string = dayKey(),
): StreakState {
  const priorTodayXp = state.daily[today] ?? 0;
  const firstActivityToday = priorTodayXp === 0;

  let streak = state.streak;
  if (firstActivityToday) {
    if (state.lastDay === today) {
      streak = Math.max(1, state.streak);
    } else if (state.lastDay === yesterdayKey(new Date(`${today}T12:00:00`))) {
      streak = state.streak + 1;
    } else {
      streak = 1;
    }
  }

  return {
    streak,
    lastDay: today,
    daily: { ...state.daily, [today]: priorTodayXp + xp },
  };
}

// ── Storage (safe wrappers — no throw in non-DOM environments) ───────────────

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota / privacy errors — gamification is best-effort, never blocking.
  }
}