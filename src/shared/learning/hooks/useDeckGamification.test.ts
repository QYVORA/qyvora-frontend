import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDeckGamification } from './useDeckGamification';

const DECK = 'course-x';
const TOTAL = 3;

function setup(overrides: Partial<{ enabled: boolean; deckId: string }> = {}) {
  return renderHook(() =>
    useDeckGamification({
      deckId: overrides.deckId ?? DECK,
      totalCards: TOTAL,
      enabled: overrides.enabled ?? true,
    }),
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('useDeckGamification', () => {
  it('completes a card and awards XP without double-awarding', () => {
    const { result } = setup();
    act(() => result.current.completeCard('a', 10, {}));
    expect(result.current.doneCardIds.has('a')).toBe(true);
    expect(result.current.deckXp).toBe(10);
    expect(result.current.deckProgress).toBe(33);

    act(() => result.current.completeCard('a', 10, {}));
    expect(result.current.deckXp).toBe(10); // no double award
  });

  it('resolves an interactive solve into bonus XP and bumps combo', () => {
    const { result } = setup();
    act(() => result.current.resolveCard('q', 10, true));
    expect(result.current.deckXp).toBe(10 + 10); // base + bonus (multiplier 1)
    expect(result.current.combo).toBe(1);

    act(() => result.current.resolveCard('r', 10, true));
    expect(result.current.combo).toBe(2);
    expect(result.current.maxCombo).toBe(2);
  });

  it('resets the combo on a mistake', () => {
    const { result } = setup();
    act(() => result.current.resolveCard('q', 10, true));
    act(() => result.current.resolveCard('r', 10, true));
    expect(result.current.combo).toBe(2);
    act(() => result.current.recordMistake());
    expect(result.current.combo).toBe(0);
  });

  it('persists deck state and restores it on remount', () => {
    const first = setup();
    act(() => first.result.current.completeCard('a', 10, {}));
    act(() => first.result.current.completeCard('b', 25, { interactive: true, solved: true }));

    const second = setup();
    expect(second.result.current.doneCardIds.has('a')).toBe(true);
    expect(second.result.current.doneCardIds.has('b')).toBe(true);
    expect(second.result.current.deckXp).toBe(first.result.current.deckXp);
    expect(second.result.current.lifetimeXp).toBeGreaterThanOrEqual(10);
  });

  it('racks lifetime XP that survives across decks', () => {
    const first = setup({ deckId: 'deck-a' });
    act(() => first.result.current.completeCard('a', 10, {}));
    const second = setup({ deckId: 'deck-b' });
    expect(second.result.current.lifetimeXp).toBe(10);
  });

  it('awards nothing and records nothing when disabled', () => {
    const { result } = setup({ enabled: false });
    act(() => result.current.completeCard('a', 10, {}));
    expect(result.current.deckXp).toBe(0);
    expect(result.current.lifetimeXp).toBe(0);
    expect(result.current.doneCardIds.size).toBe(0);
    expect(window.localStorage.getItem(`qv.deck.${DECK}`)).toBeNull();
  });

  it('reports a rank-up signal when lifetime XP crosses a boundary', () => {
    const { result } = setup();
    act(() => result.current.completeCard('a', 25, {}));
    act(() => result.current.completeCard('b', 25, {}));
    act(() => result.current.completeCard('c', 25, {}));
    act(() => result.current.completeCard('d', 25, {})); // 100 XP -> Novice
    expect(result.current.lifetimeXp).toBe(100);
    expect(result.current.rank.rank).toBe('Novice');
    expect(result.current.rankUp).toBe(true);
  });
});