/**
 * WALKTHROUGH DECK STEP
 * =====================
 * Deck-flavoured replacement for `WalkthroughStep` — drop-in swap for lab
 * pages that preserves the outer step framing (step number, flow diagram
 * children, flag submission) while rendering the step's content as a
 * gamified card deck instead of one long scroll.
 *
 * Everything the legacy component knew how to render is translated into
 * semantic blocks (mission, objectives, narrative chunked into multiple
 * cards, evidence, commands, hints, quiz, reflection, flag checkpoint).
 */

import { useMemo } from 'react';
import type { LearningBlock } from '@/shared/learning';
import { chunkMarkdown } from '@/shared/learning';
import { CardDeckSurface } from '@/shared/learning';
import { StepNumberHeader } from '@/shared/components/learning/StepNumberHeader';
import type { WalkthroughStepProps, ProgressiveHintLevel } from './WalkthroughStep';

export interface WalkthroughDeckStepProps extends WalkthroughStepProps {
  /** Disable XP/persist for locked steps (defaults to `!isLocked`). */
  deckEnabled?: boolean;
}

const HINT_LEVEL_LABELS = ['General Guidance', 'Approach', 'Tool Hint', 'Example Command'];

export function WalkthroughDeckStep({
  stepIndex,
  title,
  narrative,
  hint,
  progressiveHints,
  commandInstruction,
  mission,
  objectives,
  evidence,
  reflection,
  quiz,
  isLocked,
  isCompleted,
  isActive,
  flagId,
  labId,
  onFlagSubmit,
  onComplete,
  children,
  skipFlag,
  deckEnabled,
}: WalkthroughDeckStepProps) {
  const blocks = useMemo<LearningBlock[]>(() => {
    const out: LearningBlock[] = [];
    const base = `lab-${labId}-${flagId}`;

    if (mission) {
      out.push({ type: 'mission', id: `${base}-mission`, mission });
    }

    if (objectives && objectives.length > 0) {
      out.push({ type: 'objective', id: `${base}-objectives`, objectives });
    }

    out.push(...chunkMarkdown(narrative || '', `${base}-narrative`, 8));

    if (evidence && evidence.length > 0) {
      out.push({ type: 'evidence', id: `${base}-evidence`, entries: evidence, format: 'terminal' });
    }

    if (commandInstruction) {
      out.push({ type: 'command', id: `${base}-command`, command: commandInstruction });
    }

    if (progressiveHints && progressiveHints.length > 0) {
      out.push({
        type: 'hint',
        id: `${base}-hints`,
        hints: progressiveHints.map((h: ProgressiveHintLevel) => ({
          level: h.level,
          label: HINT_LEVEL_LABELS[Math.min(h.level, HINT_LEVEL_LABELS.length) - 1] ?? `Hint ${h.level}`,
          content: h.content,
        })),
      });
    } else if (hint) {
      out.push({
        type: 'hint',
        id: `${base}-hint`,
        hints: [{ level: 1, label: 'General Guidance', content: hint }],
      });
    }

    if (reflection) {
      out.push({ type: 'debrief', id: `${base}-debrief`, title: 'Reflection', content: reflection });
    }

    if (quiz && quiz.length > 0) {
      out.push({
        type: 'checkpoint',
        id: `${base}-quiz`,
        checkpointType: 'quiz',
        title: 'Check your understanding',
        quiz: { questions: quiz as any },
      });
    }

    if (flagId && !skipFlag && !isCompleted) {
      out.push({
        type: 'checkpoint',
        id: flagId,
        checkpointType: 'flag',
        flag: {
          flagId,
          hint,
          progressiveHints: progressiveHints?.map((h) => ({ level: h.level, content: h.content })),
        },
      });
    }

    return out;
  }, [
    stepIndex,
    title,
    narrative,
    hint,
    progressiveHints,
    commandInstruction,
    mission,
    objectives,
    evidence,
    reflection,
    quiz,
    isCompleted,
    flagId,
    labId,
    skipFlag,
  ]);

  return (
    <div className="w-full border-t border-border/10 first:border-t-0">
      <StepNumberHeader
        stepNumber={stepIndex + 1}
        title={title}
        isActive={isActive}
        isCompleted={isCompleted}
      />

      <div className="space-y-10 md:space-y-14 pb-14 md:pb-20">
        <CardDeckSurface
          deckId={`lab-${labId}-${flagId}`}
          surface="lab"
          sequenceId={labId}
          unitId={flagId}
          blocks={blocks}
          onCheckpointSubmit={async (blockId, answer) => onFlagSubmit(blockId, answer)}
          onComplete={(id) => onComplete(id)}
          enabled={deckEnabled ?? !isLocked}
        />
        {children}
      </div>
    </div>
  );
}

export default WalkthroughDeckStep;