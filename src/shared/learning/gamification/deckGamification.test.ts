import { describe, it, expect } from 'vitest';
import {
  rankFor,
  comboMultiplier,
  resolveAward,
  registerDailyXp,
  dayKey,
  yesterdayKey,
  DAILY_TARGET,
} from './deckGamification';

describe('rankFor', () => {
  it('maps XP to the correct rank tier', () => {
    expect(rankFor(0).rank).toBe('Candidate');
    expect(rankFor(99).rank).toBe('Candidate');
    expect(rankFor(100).rank).toBe('Novice');
    expect(rankFor(250).rank).toBe('Operative');
    expect(rankFor(500).rank).toBe('Hacker');
    expect(rankFor(900).rank).toBe('Specialist');
    expect(rankFor(1500).rank).toBe('Pro');
    expect(rankFor(2400).rank).toBe('Elite');
  });

  it('reports progress to the next rank', () => {
    const info = rankFor(250);
    expect(info.nextName).toBe('Hacker');
    expect(info.xpToNext).toBe(250); // 500 - 250
    expect(info.progressPct).toBe(0);
  });

  it('flatlines at the top rank', () => {
    const info = rankFor(10_000);
    expect(info.nextName).toBeNull();
    expect(info.xpToNext).toBeNull();
    expect(info.progressPct).toBe(100);
  });
});

describe('comboMultiplier', () => {
  it('tiers by consecutive correct answers', () => {
    expect(comboMultiplier(0)).toBe(1);
    expect(comboMultiplier(1)).toBe(1);
    expect(comboMultiplier(2)).toBe(1.5);
    expect(comboMultiplier(3)).toBe(1.5);
    expect(comboMultiplier(4)).toBe(2);
    expect(comboMultiplier(9)).toBe(2);
  });
});

describe('resolveAward', () => {
  it('awards flat XP for reading cards without touching combo', () => {
    const award = resolveAward({ base: 10, combo: 0 });
    expect(award.xp).toBe(10);
    expect(award.bonus).toBe(0);
    expect(award.multiplier).toBe(1);
    expect(award.nextCombo).toBe(0);
  });

  it('awards bonus XP on solved interactive cards and extends combo', () => {
    const award = resolveAward({ base: 10, interactive: true, solved: true, combo: 2 });
    expect(award.base).toBe(10);
    expect(award.bonus).toBe(15); // 10 x 1.5
    expect(award.xp).toBe(25);
    expect(award.nextCombo).toBe(3);
  });

  it('rewards higher combo tiers on longer streaks', () => {
    const award = resolveAward({ base: 10, interactive: true, solved: true, combo: 4 });
    expect(award.bonus).toBe(20); // 10 x 2
    expect(award.xp).toBe(30);
  });

  it('resets the combo when an interactive card is missed', () => {
    const award = resolveAward({ base: 10, interactive: true, solved: false, combo: 3 });
    expect(award.bonus).toBe(0);
    expect(award.nextCombo).toBe(0);
  });

  it('leaves combo intact for plain views even on validatable cards', () => {
    const award = resolveAward({ base: 10, interactive: false, solved: false, combo: 3 });
    expect(award.nextCombo).toBe(3);
  });
});

describe('registerDailyXp', () => {
  const today = '2026-10-13';

  it('starts a streak on first activity today', () => {
    const next = registerDailyXp({ streak: 0, lastDay: null, daily: {} }, 20, today);
    expect(next.streak).toBe(1);
    expect(next.daily[today]).toBe(20);
  });

  it('extends the streak the following day', () => {
    const yesterday = yesterdayKey(new Date(`${today}T12:00:00`));
    const next = registerDailyXp(
      { streak: 3, lastDay: yesterday, daily: { [yesterday]: 50 } },
      20,
      today,
    );
    expect(next.streak).toBe(4);
  });

  it('does not double-count the streak for extra XP the same day', () => {
    const yest = yesterdayKey(new Date(`${today}T12:00:00`));
    const first = registerDailyXp(
      { streak: 2, lastDay: yest, daily: {} },
      20,
      today,
    );
    expect(first.streak).toBe(3);
    const second = registerDailyXp(first, 30, today);
    expect(second.streak).toBe(3);
    expect(second.daily[today]).toBe(50);
  });

  it('resets to 1 after a gap of more than one day', () => {
    const next = registerDailyXp({ streak: 7, lastDay: '2026-10-01', daily: {} }, 20, today);
    expect(next.streak).toBe(1);
  });

  it('exposes the daily target constant', () => {
    expect(DAILY_TARGET).toBe(200);
    expect(dayKey(new Date(2026, 9, 13))).toBe('2026-10-13');
  });
});