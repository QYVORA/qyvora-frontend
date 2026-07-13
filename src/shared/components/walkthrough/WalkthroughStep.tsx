import { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { IconLock, IconCheck } from '@/shared/components/icons';
import { cn } from '@/shared/utils/cn';
import { CommandBlock, FlagInput, StepComplete } from './StepParts';

export interface WalkthroughStepProps {
  stepIndex: number;
  title: string;
  narrative: string;
  hint?: string;
  commandInstruction?: string;
  isLocked: boolean;
  isCompleted: boolean;
  isActive: boolean;
  flagId: string;
  labId: string;
  onFlagSubmit: (stepId: string, flag: string) => Promise<{ correct: boolean }>;
  onComplete: (stepId: string) => void;
  children?: React.ReactNode;
}

export function WalkthroughStep({
  stepIndex, title, narrative, hint, commandInstruction,
  isLocked, isCompleted, isActive, flagId, labId,
  onFlagSubmit, onComplete, children,
}: WalkthroughStepProps) {
  const [showHint, setShowHint] = useState(false);
  const [flagSuccess, setFlagSuccess] = useState(false);

  const handleCorrect = () => { setFlagSuccess(true); onComplete(flagId); };

  return (
    <div
      className={cn(
        'w-full rounded-2xl border transition-all duration-200',
        isLocked && 'opacity-40 border-border/20 bg-bg-card',
        isCompleted && 'border-accent/30 bg-accent/5',
        isActive && !isCompleted && 'border-accent/30 bg-bg-card',
        !isActive && !isCompleted && !isLocked && 'border-border/20 bg-bg-card',
      )}
    >
      {/* Step Header */}
      <div className="flex items-center gap-3 px-6 py-5">
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-black',
            isCompleted
              ? 'bg-accent/20 text-accent'
              : isLocked
                ? 'bg-bg-elevated text-text-muted'
                : isActive
                  ? 'bg-accent text-bg'
                  : 'bg-bg-elevated text-text-secondary',
          )}
        >
          {isCompleted ? (
            <IconCheck size={16} />
          ) : isLocked ? (
            <IconLock size={14} />
          ) : (
            String(stepIndex + 1).padStart(2, '0')
          )}
        </span>
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              'text-base font-black tracking-wide',
              isCompleted ? 'text-accent' : isLocked ? 'text-text-muted' : 'text-text-primary',
            )}
          >
            {title}
          </h3>
        </div>
        {isCompleted && (
          <span className="text-[9px] font-black uppercase tracking-widest text-accent">
            Done
          </span>
        )}
      </div>

      {/* Step Content — visible when active, hidden when locked */}
      {!isLocked && (
        <div className="px-6 pb-8 space-y-5">
          {/* Narrative */}
          <div className="rounded-xl border border-border/20 bg-bg-elevated p-6">
            <div className="text-base leading-[2] text-text-secondary font-mono whitespace-pre-wrap">
              {narrative}
            </div>
          </div>

          {/* Command Block */}
          {commandInstruction && (
            <CommandBlock command={commandInstruction} labId={labId} />
          )}

          {/* Hint */}
          {hint && (
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

          {/* Flag Input */}
          {!isCompleted && (
            <FlagInput flagId={flagId} disabled={false} onFlagSubmit={onFlagSubmit} onCorrect={handleCorrect} />
          )}

          {flagSuccess && <StepComplete />}
        </div>
      )}

      {/* Locked overlay */}
      {isLocked && (
        <div className="px-6 pb-5">
          <p className="text-sm font-mono text-text-muted/50">
            Complete the previous step to unlock this one.
          </p>
        </div>
      )}
    </div>
  );
}
