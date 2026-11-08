/**
 * CHECKPOINT BLOCK
 * ================
 * Learning checkpoint — quiz, flag, or task validation.
 * This is the primary completion gate for learning units.
 */

import React, { useState } from 'react';
import { Flag, CheckCircle2 } from 'lucide-react';
import type { CheckpointBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';
import InlineQuiz from '@/shared/components/courses/InlineQuiz';
import { GameProse } from './GameProse';

export const CheckpointBlockComponent: React.FC<BlockRendererProps<CheckpointBlock>> = ({
  block,
  context,
}) => {
  const [flagValue, setFlagValue] = useState('');
  const [flagSubmitting, setFlagSubmitting] = useState(false);
  const [flagSuccess, setFlagSuccess] = useState(false);
  const [flagError, setFlagError] = useState('');
  const [visibleHintLevel, setVisibleHintLevel] = useState(0);

  const title = block.title ?? 'Checkpoint';

  // Quiz checkpoint
  if (block.checkpointType === 'quiz' && block.quiz) {
    return (
      <div className="wc-interactive">
        <InlineQuiz
          questions={block.quiz.questions}
          title={title}
          onComplete={(passed) => {
            context?.onReward?.(block.id, { solved: passed });
            if (passed && context?.onComplete && context.unitId) {
              context.onComplete(context.unitId);
            }
          }}
        />
      </div>
    );
  }

  // Flag checkpoint
  if (block.checkpointType === 'flag' && block.flag) {
    const handleFlagSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!flagValue.trim() || !context?.onCheckpointSubmit) return;

      setFlagSubmitting(true);
      setFlagError('');

      try {
        const result = await context.onCheckpointSubmit(block.id, flagValue);

        if (result.correct) {
          setFlagSuccess(true);
          setFlagError('');
          context?.onReward?.(block.id, { solved: true });
          // Call completion callback if provided
          if (context.onComplete && context.unitId) {
            context.onComplete(context.unitId);
          }
        } else {
          setFlagError('Incorrect flag. Try again.');
          context?.onReward?.(block.id, { solved: false });
        }
      } catch (error) {
        setFlagError('Failed to submit flag. Please try again.');
        console.error('Flag submission error:', error);
      } finally {
        setFlagSubmitting(false);
      }
    };

    const showNextHint = () => {
      if (block.flag?.progressiveHints && visibleHintLevel < block.flag.progressiveHints.length) {
        setVisibleHintLevel(visibleHintLevel + 1);
      }
    };

    return (
      <div className="space-y-4">
        {/* Progressive hints */}
        {block.flag.progressiveHints && visibleHintLevel > 0 && (
          <div className="space-y-2">
            {block.flag.progressiveHints.slice(0, visibleHintLevel).map((hint) => (
              <div
                key={hint.level}
                className="rounded-xl border border-warning/20 bg-warning/5 px-4 py-3"
              >
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-warning/70">
                  Hint {hint.level}
                </p>
                <p className="text-sm leading-6 text-warning/90 sm:text-[15px]">
                  {hint.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Hint button */}
        {block.flag.progressiveHints && visibleHintLevel < block.flag.progressiveHints.length && !flagSuccess && (
          <button
            type="button"
            onClick={showNextHint}
            className="text-xs font-black uppercase tracking-widest text-text-muted hover:text-warning transition-colors"
          >
            {visibleHintLevel === 0 ? 'Need a hint?' : 'Need another hint?'}
          </button>
        )}

        {/* Single hint (legacy) */}
        {block.flag.hint && !block.flag.progressiveHints && !flagSuccess && (
          <div className="rounded-xl border border-warning/20 bg-warning/5 px-4 py-3">
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-warning/70">
              Hint
            </p>
            <p className="text-sm leading-6 text-warning/90 sm:text-[15px]">
              {block.flag.hint}
            </p>
          </div>
        )}

        {/* Flag input */}
        {!flagSuccess ? (
          <form
            onSubmit={handleFlagSubmit}
            className="wc-interactive overflow-hidden rounded-2xl border-2 border-accent/25 bg-gradient-to-br from-bg-card via-bg-card to-accent/5"
          >
            <div className="border-b border-accent/15 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
                  <Flag className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-accent">Checkpoint</p>
                  <p className="font-display text-base font-bold leading-snug text-text-primary">{title}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 px-4 py-4 sm:px-5">
              <label htmlFor="checkpoint-flag" className="text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">
                Submit flag
              </label>
              <input
                id="checkpoint-flag"
                type="text"
                value={flagValue}
                onChange={(e) => setFlagValue(e.target.value)}
                placeholder="QYVORA{...}"
                disabled={flagSubmitting}
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 font-mono text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent"
                aria-label="Flag input"
              />

              {flagError && (
                <p className="text-sm leading-6 text-danger" role="alert">
                  {flagError}
                </p>
              )}

              <button
                type="submit"
                disabled={!flagValue.trim() || flagSubmitting}
                className="btn-primary px-5 py-2.5 text-xs disabled:opacity-50"
              >
                {flagSubmitting ? 'Submitting...' : 'Submit flag'}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border-2 border-accent/40 bg-accent/5 px-5 py-4">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">Correct!</p>
              <p className="text-sm leading-6 text-text-secondary sm:text-[15px]">Flag accepted. Well done!</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Task checkpoint (manual verification)
  if (block.checkpointType === 'task' && block.task) {
    return (
      <div className="wc-interactive rounded-2xl border-2 border-accent/25 bg-accent/5 px-5 py-5">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-accent">Checkpoint</p>
            <h3 className="font-display text-base font-bold leading-snug text-text-primary sm:text-lg">{title}</h3>
          </div>
        </div>

        <GameProse text={block.task.description} className="mb-4" />

        <div className="border-t border-accent/20 pt-3">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-accent/70">
            Verification steps
          </p>
          <ol className="space-y-2" role="list">
            {block.task.verificationSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="shrink-0 pt-0.5 font-mono text-xs font-black text-accent">
                  {index + 1}.
                </span>
                <GameProse text={step} className="min-w-0 flex-1" />
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  // Fallback for unknown checkpoint type
  return null;
};

export default CheckpointBlockComponent;
