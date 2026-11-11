import { useState } from 'react';
import { Lightbulb, Target, ClipboardList, Search, MessageSquare } from 'lucide-react';
import { IconCheck } from '@/shared/components/icons';
import { cn } from '@/shared/utils/cn';
import InlineQuiz, { QuizQuestion } from '@/shared/components/courses/InlineQuiz';
import { CommandBlock, FlagInput, StepComplete } from './StepParts';
import { StepNumberHeader } from '@/shared/components/learning/StepNumberHeader';
import { EducationalMarkdownRenderer } from '@/shared/components/courses/CodeBlockRenderer';
import { LearningContentRenderer } from '@/shared/learning';
import type { LearningBlock } from '@/shared/learning';

export interface ProgressiveHintLevel {
  level: 1 | 2 | 3 | 4;
  content: string;
}

export interface WalkthroughStepProps {
  stepIndex: number;
  title: string;
  narrative: string;
  hint?: string;
  progressiveHints?: ProgressiveHintLevel[];
  commandInstruction?: string;
  mission?: string;
  objectives?: string[];
  evidence?: string[];
  reflection?: string;
  quiz?: QuizQuestion[];
  /** Extra semantic blocks (e.g. diagrams) rendered inline in the reading flow. */
  extraBlocks?: LearningBlock[];
  isLocked: boolean;
  isCompleted: boolean;
  isActive: boolean;
  flagId: string;
  labId: string;
  onFlagSubmit: (stepId: string, flag: string) => Promise<{ correct: boolean }>;
  onComplete: (stepId: string) => void;
  children?: React.ReactNode;
  skipFlag?: boolean;
  /** Hide the inline step heading when the step is rendered inside a task accordion. */
  hideHeader?: boolean;
}

const HINT_LEVEL_LABELS = ['General Guidance', 'Approach', 'Tool Hint', 'Example Command'];

export function WalkthroughStep({
  stepIndex, title,   narrative, hint, progressiveHints, commandInstruction,
  mission, objectives, evidence, reflection, quiz, extraBlocks,
  isLocked, isCompleted, isActive, flagId, labId,
  onFlagSubmit, onComplete, children, skipFlag, hideHeader = false,
}: WalkthroughStepProps) {
  const [showHint, setShowHint] = useState(false);
  const [visibleHintLevel, setVisibleHintLevel] = useState(0);
  const [flagSuccess, setFlagSuccess] = useState(false);

  const handleCorrect = () => { setFlagSuccess(true); onComplete(flagId); };

  return (
    <div
      className={cn(
        'w-full',
      )}
    >
      {/* Step Header */}
      {!hideHeader && (
        <StepNumberHeader
          stepNumber={stepIndex + 1}
          title={title}
          isActive={isActive}
          isCompleted={isCompleted}
        />
      )}

      {/* Step Content — flat reading flow; the task accordion owns the only card. */}
      <div className="space-y-6 pb-6 md:space-y-8 md:pb-10">
        {/* Mission — flat callout; no nested card inside the task accordion. */}
        {mission && (
          <section aria-label="Mission" className="border-l-2 border-accent/40 pl-4">
            <div className="mb-1.5 flex items-center gap-2">
              <Target className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-accent">Mission</p>
            </div>
            <p className="text-sm leading-6 text-text-secondary sm:text-[15px] sm:leading-7">{mission}</p>
          </section>
        )}

        {/* Objectives — numbered vertical stepper */}
        {objectives && objectives.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <ClipboardList className="w-4 h-4 text-accent" />
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-accent">Objectives</p>
            </div>
            <ol className="space-y-5">
              {objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="relative flex flex-col items-center self-stretch shrink-0">
                    <span className="relative z-10 w-7 h-7 rounded-lg border border-accent/40 bg-canvas flex items-center justify-center text-xs font-medium tabular-nums text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {i < objectives.length - 1 && (
                      <span aria-hidden="true" className="absolute top-7 -bottom-5 left-1/2 -translate-x-1/2 w-px bg-border/40" />
                    )}
                  </div>
                  <p className="min-w-0 pt-0.5 text-sm leading-6 text-text-secondary sm:text-[15px] sm:leading-7">{obj}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Narrative — continuous reading flow */}
        <div className="w-full">
          <EducationalMarkdownRenderer text={narrative} />
        </div>

        {/* Evidence — flat terminal-style log; no nested panel surface. */}
        {evidence && evidence.length > 0 && (
          <section aria-label="Evidence" className="border-l-2 border-border/50 pl-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Search className="h-3 w-3 text-accent" aria-hidden="true" />
                <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-accent">Evidence</p>
              </div>
              <span className="text-[12px] text-text-muted">
                {evidence.length} {evidence.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>
            <ul className="space-y-1.5">
              {evidence.map((item, i) => (
                <li key={i} className="flex items-start gap-2 font-mono text-sm leading-[1.9] text-text-secondary md:text-base md:leading-[2]">
                  <span className="shrink-0 select-none text-accent">{'>'}</span>
                  <span className="min-w-0 whitespace-pre-wrap break-words">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Command Block */}
        {commandInstruction && (
          <CommandBlock command={commandInstruction} labId={labId} />
        )}

        {/* Progressive Hints */}
        {progressiveHints && progressiveHints.length > 0 && (
          <div className="space-y-2">
            {progressiveHints.slice(0, visibleHintLevel).map((ph) => (
              <section key={ph.level} className="border-l-2 border-warning/40 pl-4">
                <div className="mb-1 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
                  <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-warning/70">
                    Hint {ph.level}, {HINT_LEVEL_LABELS[ph.level - 1]}
                  </p>
                </div>
                <p className="text-sm leading-6 text-warning/90 sm:text-[15px] sm:leading-7">{ph.content}</p>
              </section>
            ))}
            {visibleHintLevel < progressiveHints.length && (
              <button
                type="button"
                onClick={() => {
                  if (!showHint) setShowHint(true);
                  setVisibleHintLevel(prev => prev + 1);
                }}
                className="flex items-center gap-1.5 text-[13px] font-medium text-text-muted transition-colors hover:text-warning"
              >
                <Lightbulb className="w-3 h-3" />
                {visibleHintLevel === 0 ? 'Need a hint?' : 'Need another hint?'}
              </button>
            )}
          </div>
        )}

        {/* Legacy single hint (fallback) */}
        {!progressiveHints && hint && (
          <div>
            {showHint ? (
              <section className="border-l-2 border-warning/40 pl-4">
                <div className="mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
                  <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-warning/70">Hint</p>
                </div>
                <p className="text-sm leading-6 text-warning/90 sm:text-[15px] sm:leading-7">{hint}</p>
              </section>
            ) : (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="flex items-center gap-1.5 text-[13px] font-medium text-text-muted transition-colors hover:text-warning"
              >
                <Lightbulb className="w-3 h-3" />
                Need a hint?
              </button>
            )}
          </div>
        )}

        {extraBlocks && extraBlocks.length > 0 && (
          <LearningContentRenderer
            unit={{
              id: `${labId}-${flagId}-extras`,
              number: stepIndex + 1,
              title,
              blocks: extraBlocks,
            }}
            context={{ surface: 'lab', sequenceId: labId, unitId: flagId }}
          />
        )}

        {children}

        {/* Mini-quiz — reinforce the step's key concepts */}
        {quiz && quiz.length > 0 && (
          <InlineQuiz
            questions={quiz}
            title="Check your understanding"
          />
        )}

        {/* Reflection — flat reading section. */}
        {reflection && (
          <section aria-label="Reflection" className="border-l-2 border-border/50 pl-4">
            <div className="mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-accent" aria-hidden="true" />
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-accent">Reflection</p>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-6 text-text-secondary sm:text-[15px] sm:leading-7">{reflection}</p>
          </section>
        )}

        {/* Flag Input — embedded naturally in the reading flow */}
        {!isCompleted && !skipFlag && (
          <FlagInput flagId={flagId} disabled={isLocked} onFlagSubmit={onFlagSubmit} onCorrect={handleCorrect} />
        )}

        {flagSuccess && <StepComplete />}
      </div>
    </div>
  );
}
