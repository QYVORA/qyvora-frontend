import { useState } from 'react';
import { Lightbulb, Target, ClipboardList, Search, MessageSquare } from 'lucide-react';
import { IconCheck } from '@/shared/components/icons';
import { cn } from '@/shared/utils/cn';
import { CommandBlock, FlagInput, StepComplete } from './StepParts';

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
  isLocked: boolean;
  isCompleted: boolean;
  isActive: boolean;
  flagId: string;
  labId: string;
  onFlagSubmit: (stepId: string, flag: string) => Promise<{ correct: boolean }>;
  onComplete: (stepId: string) => void;
  children?: React.ReactNode;
}

const HINT_LEVEL_LABELS = ['General Guidance', 'Approach', 'Tool Hint', 'Example Command'];

export function WalkthroughStep({
  stepIndex, title, narrative, hint, progressiveHints, commandInstruction,
  mission, objectives, evidence, reflection,
  isLocked, isCompleted, isActive, flagId, labId,
  onFlagSubmit, onComplete, children,
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
      <div className="flex items-center gap-3 py-8 md:py-12">
        <span
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border font-mono text-lg font-black',
            isCompleted
              ? 'bg-accent-dim border-accent/20 text-accent'
              : isActive
                ? 'bg-accent border-accent text-bg'
                : 'bg-bg-elevated border-border text-text-muted',
          )}
        >
          {isCompleted ? (
            <IconCheck size={24} />
          ) : (
            String(stepIndex + 1).padStart(2, '0')
          )}
        </span>
        <div className="flex-1 min-w-0">
          <span
            className={cn(
              'block font-black uppercase tracking-[0.25em] transition-colors duration-300',
              isCompleted ? 'text-accent text-xs' : isActive ? 'text-accent text-xs' : 'text-text-muted text-[10px]',
            )}
          >
            {title}
          </span>
        </div>
        {isCompleted && (
          <span className="text-[9px] font-black uppercase tracking-widest text-accent">
            Done
          </span>
        )}
      </div>

      {/* Step Content — always visible */}
      <div className="space-y-6 pb-12 md:pb-16">
        {/* Mission */}
        {mission && (
          <div className="rounded-xl border border-accent/20 bg-accent/5 px-5 py-4 flex items-start gap-3">
            <Target className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-1">Mission</p>
              <p className="text-sm font-mono text-text-secondary leading-relaxed">{mission}</p>
            </div>
          </div>
        )}

        {/* Objectives */}
        {objectives && objectives.length > 0 && (
          <div className="rounded-xl border border-border/20 bg-bg-elevated px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList className="w-4 h-4 text-accent" />
              <p className="text-[9px] font-black uppercase tracking-widest text-accent">Objectives</p>
            </div>
            <ul className="space-y-2">
              {objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-mono text-text-secondary">
                  <span className="text-accent mt-0.5">{i + 1}.</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Narrative — continuous reading flow */}
        <div className="text-sm sm:text-base leading-[2] text-text-secondary font-mono whitespace-pre-wrap overflow-x-auto">
          {narrative}
        </div>

        {/* Evidence */}
        {evidence && evidence.length > 0 && (
          <div className="rounded-xl border border-border/20 bg-bg-elevated px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-accent" />
              <p className="text-[9px] font-black uppercase tracking-widest text-accent">Evidence</p>
            </div>
            <ul className="space-y-2">
              {evidence.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-mono text-text-secondary">
                  <span className="text-accent mt-0.5">{'>'}</span>
                  <span className="whitespace-pre-wrap">{item}</span>
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
                    Hint {ph.level} — {HINT_LEVEL_LABELS[ph.level - 1]}
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
        {!isCompleted && (
          <FlagInput flagId={flagId} disabled={false} onFlagSubmit={onFlagSubmit} onCorrect={handleCorrect} />
        )}

        {flagSuccess && <StepComplete />}
      </div>
    </div>
  );
}
