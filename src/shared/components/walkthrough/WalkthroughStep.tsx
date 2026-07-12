import { useState, useRef, useEffect } from 'react';
import { ChevronRight, Lock, CheckCircle2 } from 'lucide-react';
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
  const [expanded, setExpanded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [flagSuccess, setFlagSuccess] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) setContentHeight(contentRef.current.scrollHeight);
  }, [expanded, showHint, flagSuccess]);

  const toggle = () => { if (!isLocked && !isCompleted) setExpanded((p) => !p); };
  const handleCorrect = () => { setFlagSuccess(true); setExpanded(false); onComplete(flagId); };

  return (
    <div className="w-full">
      <button type="button" onClick={toggle} disabled={isLocked} aria-expanded={expanded}
        className={cn('group flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left font-mono transition-all duration-200',
          isLocked && 'opacity-40 cursor-not-allowed border-border/20 bg-bg-card',
          isCompleted && 'border-accent/20 bg-accent-dim cursor-default',
          isActive && !expanded && 'border-border/30 bg-bg-card hover:border-accent/30',
          isActive && expanded && 'border-accent/30 bg-bg-card')}>
        <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-black',
          isCompleted ? 'bg-accent/20 text-accent' : isLocked ? 'bg-bg-elevated text-text-muted' : 'bg-bg-elevated text-text-secondary')}>
          {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : isLocked ? <Lock className="h-3.5 w-3.5" /> : String(stepIndex + 1).padStart(2, '0')}
        </span>
        <span className={cn('flex-1 truncate text-base font-bold tracking-wide',
          isCompleted ? 'text-accent' : isLocked ? 'text-text-muted' : 'text-text-primary')}>
          {title}
        </span>
        {!isLocked && <ChevronRight className={cn('h-4 w-4 shrink-0 text-text-muted transition-transform duration-200', expanded && 'rotate-90 text-accent')} />}
      </button>

      <div className="overflow-hidden transition-[max-height] duration-300 ease-[var(--ease-smooth)]" style={{ maxHeight: expanded ? contentHeight : 0 }}>
        <div ref={contentRef} className="px-4 pb-4 pt-3">
          <div className="rounded-xl border border-border/20 bg-bg-elevated p-4 space-y-4">
            <p className="text-base leading-relaxed text-text-secondary font-mono whitespace-pre-wrap">{narrative}</p>
            {commandInstruction && <CommandBlock command={commandInstruction} labId={labId} />}
            {hint && (
              showHint
                ? <div className="rounded-lg border border-border/20 bg-bg-card px-3 py-2"><p className="text-xs font-mono text-text-muted">{hint}</p></div>
                : <button type="button" onClick={() => setShowHint(true)} className="text-xs font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors">Show hint</button>
            )}
            {children}
            {!isCompleted && <FlagInput flagId={flagId} disabled={false} onFlagSubmit={onFlagSubmit} onCorrect={handleCorrect} />}
            {flagSuccess && <StepComplete />}
          </div>
        </div>
      </div>
    </div>
  );
}
