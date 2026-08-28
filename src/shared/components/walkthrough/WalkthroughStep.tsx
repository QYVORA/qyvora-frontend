import { useState } from 'react';
import { Lightbulb, Target, ClipboardList, Search, MessageSquare } from 'lucide-react';
import { IconCheck } from '@/shared/components/icons';
import { cn } from '@/shared/utils/cn';
import InlineQuiz, { QuizQuestion } from '@/shared/components/courses/InlineQuiz';
import { CommandBlock, FlagInput, StepComplete } from './StepParts';
import { StepNumberHeader } from '@/shared/components/learning/StepNumberHeader';
import { EducationalMarkdownRenderer } from '@/shared/components/courses/CodeBlockRenderer';

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
  isLocked: boolean;
  isCompleted: boolean;
  isActive: boolean;
  flagId: string;
  labId: string;
  onFlagSubmit: (stepId: string, flag: string) => Promise<{ correct: boolean }>;
  onComplete: (stepId: string) => void;
  children?: React.ReactNode;
  skipFlag?: boolean;
}

const HINT_LEVEL_LABELS = ['General Guidance', 'Approach', 'Tool Hint', 'Example Command'];

export function WalkthroughStep({
  stepIndex, title, narrative, hint, progressiveHints, commandInstruction,
  mission, objectives, evidence, reflection, quiz,
  isLocked, isCompleted, isActive, flagId, labId,
  onFlagSubmit, onComplete, children, skipFlag,
}: WalkthroughStepProps) {
  const [showHint, setShowHint] = useState(false);
  const [visibleHintLevel, setVisibleHintLevel] = useState(0);
  const [flagSuccess, setFlagSuccess] = useState(false);

  const handleCorrect = () => { setFlagSuccess(true); onComplete(flagId); };

  return (
    <div
      className={cn(
        'w-full border-t border-border/10 first:border-t-0',
      )}
    >
      {/* Step Header */}
      <StepNumberHeader
        stepNumber={stepIndex + 1}
        title={title}
        isActive={isActive}
        isCompleted={isCompleted}
      />

      {/* Step Content — always visible */}
      <div className="space-y-10 md:space-y-14 pb-14 md:pb-20">
        {/* Mission */}
        {mission && (
          <div className="rounded-xl border border-accent/20 bg-accent/5 px-5 py-4 flex items-start gap-3">
            <Target className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-1">Mission</p>
              <p className="text-sm font-mono text-text-secondary leading-[2]">{mission}</p>
            </div>
          </div>
        )}

        {/* Objectives — numbered vertical stepper */}
        {objectives && objectives.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <ClipboardList className="w-4 h-4 text-accent" />
              <p className="text-[9px] font-black uppercase tracking-widest text-accent">Objectives</p>
            </div>
            <ol className="space-y-5">
              {objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="relative flex flex-col items-center self-stretch shrink-0">
                    <span className="relative z-10 w-7 h-7 rounded-lg border border-accent/40 bg-bg flex items-center justify-center font-mono text-[10px] font-black text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {i < objectives.length - 1 && (
                      <span aria-hidden="true" className="absolute top-7 -bottom-5 left-1/2 -translate-x-1/2 w-px bg-border/40" />
                    )}
                  </div>
                  <p className="text-sm md:text-base font-mono text-text-secondary leading-[2] md:leading-[2.2] pt-1 min-w-0">{obj}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Narrative — continuous reading flow */}
        <div className="w-full text-sm md:text-base text-text-secondary font-mono leading-[2] md:leading-[2.2] mb-6 md:mb-8">
          <EducationalMarkdownRenderer text={narrative} />
        </div>

        {/* Evidence — terminal-style log panel */}
        {evidence && evidence.length > 0 && (
          <div className="wc-terminal rounded-xl border border-border/50 bg-bg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/20 bg-bg-elevated">
              <div className="flex items-center gap-2">
                <Search className="w-3 h-3 text-accent" />
                <p className="text-[9px] font-black uppercase tracking-widest text-accent">Evidence</p>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">
                {evidence.length} {evidence.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>
            <ul className="p-4 space-y-1.5">
              {evidence.map((item, i) => (
                <li key={i} className="flex items-start gap-2 font-mono text-xs md:text-sm text-text-secondary leading-relaxed">
                  <span className="text-accent shrink-0 select-none">{'>'}</span>
                  <span className="whitespace-pre-wrap break-words min-w-0">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Command Block */}
        {commandInstruction && (
          <CommandBlock command={commandInstruction} labId={labId} />
        )}

        {/* Progressive Hints */}
        {progressiveHints && progressiveHints.length > 0 && (
          <div className="space-y-2">
            {progressiveHints.slice(0, visibleHintLevel).map((ph) => (
              <div key={ph.level} className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 px-5 py-4 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-yellow-400/60 mb-1">
                    Hint {ph.level}, {HINT_LEVEL_LABELS[ph.level - 1]}
                  </p>
                  <p className="text-sm font-mono text-yellow-300/80 leading-relaxed">{ph.content}</p>
                </div>
              </div>
            ))}
            {visibleHintLevel < progressiveHints.length && (
              <button
                type="button"
                onClick={() => {
                  if (!showHint) setShowHint(true);
                  setVisibleHintLevel(prev => prev + 1);
                }}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-yellow-400 transition-colors"
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
              <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 px-5 py-4 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-sm font-mono text-yellow-300/80 leading-relaxed">{hint}</p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-yellow-400 transition-colors"
              >
                <Lightbulb className="w-3 h-3" />
                Need a hint?
              </button>
            )}
          </div>
        )}

        {children}

        {/* Mini-quiz — reinforce the step's key concepts */}
        {quiz && quiz.length > 0 && (
          <InlineQuiz
            questions={quiz}
            title="Check your understanding"
          />
        )}

        {/* Reflection */}
        {reflection && (
          <div className="rounded-xl border border-border/20 bg-bg-elevated px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-accent" />
              <p className="text-[9px] font-black uppercase tracking-widest text-accent">Reflection</p>
            </div>
            <p className="text-sm font-mono text-text-secondary leading-relaxed whitespace-pre-wrap">{reflection}</p>
          </div>
        )}

        {/* Flag Input — embedded naturally in the reading flow */}
        {!isCompleted && !skipFlag && (
          <FlagInput flagId={flagId} disabled={false} onFlagSubmit={onFlagSubmit} onCorrect={handleCorrect} />
        )}

        {flagSuccess && <StepComplete />}
      </div>
    </div>
  );
}
