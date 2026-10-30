/**
 * CARD DECK SURFACE
 * =================
 * Gamified card-deck presentation for a single learning unit (one course
 * lesson, one bootcamp step, one lab step). Renders the unit's semantic
 * blocks one card at a time with:
 *
 *   - One active card expanded, done cards collapsed above, upcoming below
 *   - Keyboard navigation (ArrowLeft / ArrowRight) within the deck
 *   - XP / rank / combo / streak strip wired to the local gamification layer
 *   - Bonus XP + combo on correct validation (quiz / flag / think choices)
 *   - Level-up flash + XP toasts
 *
 * The outer step framing (step card, navigation, scrolling) is owned by the
 * caller — this surface only manages the inner cards.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Flame,
  Trophy,
  Zap,
  X,
} from 'lucide-react';
import type { LearningBlock } from '../types/blocks';
import type { BlockRenderContext } from '../utils/blockRegistry';
// Side-effect: registers every block renderer with the registry.
import '../blocks';
import { LearningBlockRenderer } from '../renderer';
import { useDeckGamification } from '../hooks/useDeckGamification';
import { comboMultiplier } from '../gamification/deckGamification';
import { blockLabel, blockTitle, blockXp, hasValidation, truncate } from '../utils/blockMeta';
import { interleavePractice } from '../utils/interleavePractice';
import Button from '@/shared/components/ui/Button';

export interface CardDeckSurfaceProps {
  deckId: string;
  surface: 'bootcamp' | 'course' | 'lab';
  sequenceId: string;
  unitId: string;
  blocks: LearningBlock[];
  /** Flag-checkpoint validation handler (labs). */
  onCheckpointSubmit?: (blockId: string, answer: any) => Promise<{ correct: boolean }>;
  /** Called when the unit's completion gate fires (e.g. flag accepted). */
  onComplete?: (unitId: string) => void;
  /** Called when the learner taps Continue after clearing the whole deck. */
  onDeckComplete?: () => void;
  /** Label for the end-of-deck Continue button. */
  continueLabel?: string;
  /** Locked units award no XP and persist nothing. */
  enabled?: boolean;
  className?: string;
}

export const CardDeckSurface: React.FC<CardDeckSurfaceProps> = ({
  deckId,
  surface,
  sequenceId,
  unitId,
  blocks,
  onCheckpointSubmit,
  onComplete,
  onDeckComplete,
  continueLabel,
  enabled = true,
  className,
}) => {
  const deck = useDeckGamification({ deckId, totalCards: blocks.length, enabled });
  // Duolingo pacing: pull quiz checkpoints forward so reading never runs long.
  const cards = useMemo(() => interleavePractice(blocks), [blocks]);
  const [activeIdx, setActiveIdx] = useState(() => {
    const firstNotDone = cards.findIndex((b) => !deck.doneCardIds.has(b.id));
    return firstNotDone >= 0 ? firstNotDone : 0;
  });
  const [justSolvedId, setJustSolvedId] = useState<string | null>(null);
  const [solvedIds, setSolvedIds] = useState<ReadonlySet<string>>(new Set());
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpRank, setLevelUpRank] = useState<string | null>(null);
  const [awardFlash, setAwardFlash] = useState<string | null>(null);
  const [prevSeenRank, setPrevSeenRank] = useState(deck.rank.index);

  const totalCards = cards.length;
  const current = cards[Math.min(activeIdx, Math.max(totalCards - 1, 0))] ?? null;
  const currentDone = current ? deck.isDone(current.id) : false;
  const currentSolved = current ? solvedIds.has(current.id) : false;

  const findFirstNotDone = useCallback(
    (from: number): number => {
      for (let i = Math.max(0, from); i < totalCards; i += 1) {
        if (!deck.isDone(cards[i].id)) return i;
      }
      return -1;
    },
    [cards, deck, totalCards],
  );

  // Level-up flash when the lifetime rank crosses a boundary.
  useEffect(() => {
    if (deck.rank.index > prevSeenRank) {
      setLevelUpRank(deck.rank.rank);
      setShowLevelUp(true);
      const t = window.setTimeout(() => setShowLevelUp(false), 4000);
      return () => window.clearTimeout(t);
    }
    setPrevSeenRank(deck.rank.index);
  }, [deck.rank.index]);

  // XP toast for the most recent award.
  useEffect(() => {
    if (!deck.lastAward) return;
    const parts: string[] = [`+${deck.lastAward.xp} XP`];
    if (deck.lastAward.multiplier > 1) parts.push(`x${deck.lastAward.multiplier}`);
    setAwardFlash(parts.join(' '));
    const t = window.setTimeout(() => setAwardFlash(null), 2600);
    return () => window.clearTimeout(t);
  }, [deck.lastAward]);

  const advanceAfter = useCallback(
    (fromIndex: number) => {
      const next = findFirstNotDone(fromIndex);
      if (next >= 0) setActiveIdx(next);
    },
    [findFirstNotDone],
  );

  const handleNext = useCallback(() => {
    if (!current) return;
    const cur = cards[activeIdx];
    if (!cur) return;
    deck.completeCard(cur.id, blockXp(cur), {
      interactive: hasValidation(cur),
      solved: false,
    });
    advanceAfter(activeIdx + 1);
  }, [cards, activeIdx, current, deck, advanceAfter]);

  const handlePrev = useCallback(() => {
    if (activeIdx > 0) setActiveIdx(activeIdx - 1);
  }, [activeIdx]);

  const handleReward = useCallback(
    (blockId: string, result: { solved: boolean }) => {
      if (result.solved) {
        const b = cards.find((blk) => blk.id === blockId);
        if (!b) return;
        deck.resolveCard(blockId, blockXp(b), true);
        setSolvedIds((prev) => {
          const next = new Set(prev);
          next.add(blockId);
          return next;
        });
        setJustSolvedId(blockId);
      } else {
        deck.recordMistake();
      }
    },
    [cards, deck],
  );

  // Auto-advance right after a solved interactive card (it's now done).
  useEffect(() => {
    if (!justSolvedId) return;
    const idx = cards.findIndex((b) => b.id === justSolvedId);
    if (idx >= 0 && idx === activeIdx && idx < totalCards - 1) {
      advanceAfter(idx + 1);
    }
    setJustSolvedId(null);
  }, [justSolvedId, cards, activeIdx, totalCards, advanceAfter]);

  const deckContext: BlockRenderContext = useMemo(
    () => ({
      surface,
      sequenceId,
      unitId,
      onCheckpointSubmit,
      onComplete,
      onReward: handleReward,
    }),
    [surface, sequenceId, unitId, onCheckpointSubmit, onComplete, handleReward],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        e.stopPropagation();
        handlePrev();
      }
    },
    [handleNext, handlePrev],
  );

  if (totalCards === 0) return null;

  const multiplier = comboMultiplier(deck.combo);
  const showingComplete = deck.deckComplete;

  const doneCards = cards.filter((b) => deck.isDone(b.id));

  return (
    <div className={className}>
      <div
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="relative outline-none"
      >
        {/* Deck status strip */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-border/40 bg-bg-card px-4 py-3 mb-6">
          <div className="flex items-center gap-1.5" title={deck.rank.nextName ? `${deck.rank.xpToNext} XP to ${deck.rank.nextName}` : 'Top rank'}>
            <Trophy className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
            <span className="text-xs font-black uppercase tracking-widest text-text-primary">{deck.rank.rank}</span>
            {deck.rank.nextName && (
              <span className="hidden sm:inline-block h-1 w-16 rounded-full bg-bg-elevated overflow-hidden border border-border/30">
                <span className="block h-full bg-accent" style={{ width: `${deck.rank.progressPct}%` }} />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Zap className={`w-3.5 h-3.5 ${multiplier > 1 ? 'text-accent' : 'text-text-muted'}`} aria-hidden="true" />
            <span className="text-xs font-mono text-text-secondary">x{multiplier}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Flame className={`w-3.5 h-3.5 ${deck.streak > 0 ? 'text-accent' : 'text-text-muted'}`} aria-hidden="true" />
            <span className="text-xs font-mono text-text-secondary">
              {deck.streak} <span className="text-text-muted">streak</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Daily</span>
            <span className="text-xs font-mono text-accent">{deck.dailyXp}</span>
            <span className="text-xs font-mono text-text-muted">/{deck.dailyTarget} XP</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {showingComplete ? (
              <span className="flex items-center gap-1.5 rounded-lg bg-accent/10 border border-accent/30 px-2 py-1 text-xs font-black uppercase tracking-widest text-accent">
                <Check className="w-3 h-3" aria-hidden="true" />
                Deck Clear
              </span>
            ) : (
              <span className="text-xs font-mono text-text-secondary">
                {doneCards.length}/{totalCards}·{deck.deckProgress}%
              </span>
            )}
            <span className="hidden sm:inline text-xs font-mono text-text-muted" aria-live="polite">
              {awardFlash}
            </span>
          </div>
        </div>

        {/* Active card */}
        {current && (
          <article className={`rounded-2xl border bg-bg-card overflow-hidden ${currentDone ? 'border-border/40' : 'border-accent/30'}`}>
            {/* Card header */}
            <header className="border-b border-border/20 bg-bg-elevated/60 px-3 md:px-4 py-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-mono text-xs font-black text-text-muted">{String(activeIdx + 1).padStart(2, '0')}/{String(totalCards).padStart(2, '0')}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-accent">{blockLabel(current.type)}</span>
                <span className="truncate text-base font-mono text-text-primary min-w-0">{truncate(blockTitle(current))}</span>
                {currentSolved && (
                  <span className="flex items-center gap-1 rounded-lg bg-accent/10 border border-accent/30 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-accent">
                    <Check className="w-3 h-3" aria-hidden="true" />
                    Solved
                  </span>
                )}
                <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-text-muted shrink-0">+{blockXp(current)} XP</span>
              </div>
            </header>

            {/* Card body */}
            <div className="px-4 md:px-6 py-6 md:py-8 min-h-[200px] md:min-h-[240px]">
              <LearningBlockRenderer block={current} context={deckContext} />
            </div>

            {/* Card footer — nav actions */}
            <footer className="flex items-center gap-2 border-t border-border/20 bg-bg-elevated/40 px-3 md:px-4 py-3">
              <Button variant="ghost" size="sm" icon={<ChevronLeft className="h-4 w-4" aria-hidden="true" />} onClick={handlePrev} disabled={activeIdx === 0} ariaLabel="Previous card">
                <span className="hidden sm:inline">Prev</span>
              </Button>
              <span className="mx-auto text-[10px] font-black uppercase tracking-widest text-text-muted" aria-hidden="true">
                {showingComplete
                  ? onDeckComplete
                    ? 'Unit complete'
                    : 'All cards cleared'
                  : currentDone
                    ? 'Card complete — review or continue'
                    : 'View card to earn XP'}
                {!showingComplete && hasValidation(current) && !currentDone ? ' · solve for bonus XP' : ''}
              </span>
              {showingComplete ? (
                onDeckComplete ? (
                  <Button
                    variant="primary"
                    size="sm"
                    trailingIcon={<ChevronRight className="h-4 w-4" aria-hidden="true" />}
                    onClick={onDeckComplete}
                    ariaLabel={continueLabel ?? 'Continue'}
                  >
                    {continueLabel ?? 'Continue'}
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" disabled ariaLabel="Deck complete">
                    Done
                  </Button>
                )
              ) : (
                <Button
                  variant={currentDone ? 'secondary' : 'primary'}
                  size="sm"
                  trailingIcon={<ChevronRight className="h-4 w-4" aria-hidden="true" />}
                  onClick={handleNext}
                  ariaLabel={currentDone ? 'Next card' : 'Complete card and continue'}
                >
                  Next
                </Button>
              )}
            </footer>
          </article>
        )}

        {/* XP toast */}
        {awardFlash && !showLevelUp && (
          <div className="absolute right-2 top-16 rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 font-mono text-xs font-black tracking-widest text-accent" role="status" aria-label="XP awarded" aria-live="polite">
            {awardFlash}
          </div>
        )}

        {/* Level-up flash */}
        {showLevelUp && levelUpRank && (
          <div className="absolute inset-x-0 top-24 z-10 flex justify-center pointer-events-none">
            <div className="rounded-2xl border-2 border-accent/50 bg-bg-card px-6 py-4 text-center" role="status" aria-live="polite">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy className="w-5 h-5 text-accent" aria-hidden="true" />
                <p className="text-sm font-black uppercase tracking-widest text-accent">Rank up</p>
                <X className="w-4 h-4 text-text-muted" aria-hidden="true" />
              </div>
              <p className="text-2xl font-black text-text-primary">{levelUpRank}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDeckSurface;