/**
 * useDeckGamification — HOOK
 * ===========================
 * Local-first gamification state for a single card deck (one lesson/step).
 *
 * Persisted keys:
 *   qv.deck.<deckId>          done cards + deck XP + combo
 *   qv.xp.lifetime            lifetime training XP (drives rank)
 *   qv.streak                 streak + last active day + daily XP map
 *
 * The server owns authoritative progression ranks; this layer is a training
 * overlay that makes each deck rewarding without round-tripping every tap.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  rankFor,
  resolveAward,
  registerDailyXp,
  readStorage,
  writeStorage,
  dayKey,
  DAILY_TARGET,
} from '../gamification/deckGamification';
import type { RankInfo, AwardResult, StreakState } from '../gamification/deckGamification';

// ── Storage shapes ───────────────────────────────────────────────────────────

interface DeckPersist {
  done: string[];
  xp: number;
  combo: number;
  maxCombo: number;
}

interface LifetimePersist {
  xp: number;
}

const deckKey = (deckId: string) => `qv.deck.${deckId}`;
const LIFETIME_KEY = 'qv.xp.lifetime';
const STREAK_KEY = 'qv.streak';

const emptyDeck = (): DeckPersist => ({ done: [], xp: 0, combo: 0, maxCombo: 0 });
const emptyStreak = (): StreakState => ({ streak: 0, lastDay: null, daily: {} });

export interface UseDeckGamificationOptions {
  deckId: string;
  totalCards: number;
  /** Disable persistence/XP (e.g. locked steps where nothing counts). */
  enabled?: boolean;
}

export interface UseDeckGamificationResult {
  doneCardIds: ReadonlySet<string>;
  deckXp: number;
  combo: number;
  maxCombo: number;
  deckProgress: number;
  deckComplete: boolean;
  streak: number;
  dailyXp: number;
  dailyTarget: number;
  lifetimeXp: number;
  rank: RankInfo;
  /** true momentarily when a rank boundary is crossed */
  rankUp: boolean;
  streakExtended: boolean;
  streakExtendedAt: string | null;
  lastAward: AwardResult | null;
  lastAwardCardId: string | null;
  isDone: (cardId: string) => boolean;
  /** Mark a card complete (reading cards). Awards base XP + combo bonus. */
  completeCard: (cardId: string, baseXp: number, opts?: { interactive?: boolean; solved?: boolean }) => void;
  /** Interactive resolution — award the solved bonus on top of an earlier view. */
  resolveCard: (cardId: string, baseXp: number, solved: boolean) => void;
  recordMistake: () => void;
  resetDeck: () => void;
}

export function useDeckGamification({
  deckId,
  totalCards,
  enabled = true,
}: UseDeckGamificationOptions): UseDeckGamificationResult {
  const [deck, setDeck] = useState<DeckPersist>(() => {
    if (!enabled) return emptyDeck();
    return readStorage<DeckPersist>(deckKey(deckId), emptyDeck());
  });
  const [lifetime, setLifetime] = useState<LifetimePersist>(() =>
    enabled ? readStorage<LifetimePersist>(LIFETIME_KEY, { xp: 0 }) : { xp: 0 },
  );
  const [streakState, setStreakState] = useState<StreakState>(() => {
    if (!enabled) return emptyStreak();
    const s = readStorage<StreakState>(STREAK_KEY, emptyStreak());
    return { ...s, daily: s.daily ?? {} };
  });
  const [lastAward, setLastAward] = useState<AwardResult | null>(null);
  const [lastAwardCardId, setLastAwardCardId] = useState<string | null>(null);
  const [rankUp, setRankUp] = useState(false);
  const [streakExtendedAt, setStreakExtendedAt] = useState<string | null>(null);
  const prevSeenRankRef = useRef<number | null>(null);

  // Persist on change.
  useEffect(() => {
    if (!enabled) return;
    writeStorage(deckKey(deckId), deck);
  }, [deck, deckId, enabled]);

  useEffect(() => {
    if (!enabled) return;
    writeStorage(LIFETIME_KEY, lifetime);
  }, [lifetime, enabled]);

  useEffect(() => {
    if (!enabled) return;
    writeStorage(STREAK_KEY, streakState);
  }, [streakState, enabled]);

  // Static rank baseline — used to detect a rank-up on the very first award too.
  const initialRankIndex = useRef(rankFor(lifetime.xp).index);

  const today = dayKey();
  const dailyXp = streakState.daily[today] ?? 0;
  const streakExtended = streakState.lastDay === today;

  const doneCardIds = useMemo(() => new Set(deck.done), [deck.done]);
  const deckComplete = totalCards > 0 && deck.done.length >= totalCards;

  const applyAward = useCallback(
    (cardId: string, baseXp: number, opts?: { interactive?: boolean; solved?: boolean }) => {
      if (!enabled) return;
      setDeck((prev) => {
        if (prev.done.includes(cardId)) return prev; // never double-award a card
        const award = resolveAward({
          base: baseXp,
          interactive: opts?.interactive,
          solved: opts?.solved,
          combo: prev.combo,
        });

        const nextDeck: DeckPersist = {
          done: [...prev.done, cardId],
          xp: prev.xp + award.xp,
          combo: award.nextCombo,
          maxCombo: Math.max(prev.maxCombo, award.nextCombo),
        };

        setLifetime((lx) => ({ xp: lx.xp + award.xp }));
        setStreakState((s) => registerDailyXp(s, award.xp, today));
        setLastAward(award);
        setLastAwardCardId(cardId);
        return nextDeck;
      });
    },
    [enabled, today],
  );

  const completeCard = useCallback(
    (cardId: string, baseXp: number, opts?: { interactive?: boolean; solved?: boolean }) => {
      applyAward(cardId, baseXp, opts);
    },
    [applyAward],
  );

  const resolveCard = useCallback(
    (cardId: string, baseXp: number, solved: boolean) => {
      if (!enabled) return;
      setDeck((prev) => {
        if (!prev.done.includes(cardId)) {
          // Card hasn't been viewed yet — treat the solve as completing it.
          const award = resolveAward({ base: baseXp, interactive: true, solved, combo: prev.combo });
          const nextDeck: DeckPersist = {
            done: [...prev.done, cardId],
            xp: prev.xp + award.xp,
            combo: award.nextCombo,
            maxCombo: Math.max(prev.maxCombo, award.nextCombo),
          };
          setLifetime((lx) => ({ xp: lx.xp + award.xp }));
          setStreakState((s) => registerDailyXp(s, award.xp, today));
          setLastAward(award);
          setLastAwardCardId(cardId);
          return nextDeck;
        }
        return prev;
      });
    },
    [enabled, today],
  );

  const recordMistake = useCallback(() => {
    if (!enabled) return;
    setDeck((prev) => (prev.combo > 0 ? { ...prev, combo: 0 } : prev));
  }, [enabled]);

  const resetDeck = useCallback(() => {
    setDeck(emptyDeck());
    if (!enabled) return;
    writeStorage(deckKey(deckId), emptyDeck());
  }, [deckId, enabled]);

  // Rank-up detection after each lifetime change.
  useEffect(() => {
    const current = rankFor(lifetime.xp);
    if (prevSeenRankRef.current === null) {
      prevSeenRankRef.current = current.index;
      setRankUp(current.index > initialRankIndex.current);
      return;
    }
    if (current.index > prevSeenRankRef.current) {
      setRankUp(true);
      prevSeenRankRef.current = current.index;
    }
  }, [lifetime.xp]);

  return {
    doneCardIds,
    deckXp: deck.xp,
    combo: deck.combo,
    maxCombo: deck.maxCombo,
    deckProgress: totalCards > 0 ? Math.round((deck.done.length / totalCards) * 100) : 0,
    deckComplete,
    streak: streakState.streak,
    dailyXp,
    dailyTarget: DAILY_TARGET,
    lifetimeXp: lifetime.xp,
    rank: rankFor(lifetime.xp),
    rankUp,
    streakExtended,
    streakExtendedAt,
    lastAward,
    lastAwardCardId,
    isDone: useCallback((cardId: string) => doneCardIds.has(cardId), [doneCardIds]),
    completeCard,
    resolveCard,
    recordMistake,
    resetDeck,
  };
}