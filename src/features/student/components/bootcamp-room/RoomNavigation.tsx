import React from 'react';
import { List, Minimize2, Maximize2, ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

interface RoomNavigationProps {
  currentStepIdx: number;
  totalSteps: number;
  isLastStep: boolean;
  isRoomComplete: boolean;
  nextRoom: any;
  quizPassed: boolean;
  quizModuleId: string;
  completing: boolean;
  fullscreen: boolean;
  goToStep: (idx: number) => void;
  handleComplete: () => Promise<void>;
  toggleFullscreen: () => void;
  setJumpMenuOpen: (open: boolean) => void;
}

const RoomNavigation: React.FC<RoomNavigationProps> = ({
  currentStepIdx,
  totalSteps,
  isLastStep,
  isRoomComplete,
  nextRoom,
  quizPassed,
  quizModuleId,
  completing,
  fullscreen,
  goToStep,
  handleComplete,
  toggleFullscreen,
  setJumpMenuOpen,
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-3 pb-16 ${totalSteps <= 5 ? 'md:justify-end' : ''}`}>
      <button
        onClick={() => setJumpMenuOpen(true)}
        className="inline-flex items-center gap-1.5 bg-bg-card border border-border text-text-muted hover:text-accent hover:border-accent/30 font-semibold uppercase tracking-[0.08em] rounded-lg px-3.5 py-2 transition-colors text-xs"
      >
        <List className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Jump</span>
      </button>

      <button
        onClick={toggleFullscreen}
        className="inline-flex items-center gap-1.5 bg-bg-card border border-border text-text-muted hover:text-accent hover:border-accent/30 font-semibold uppercase tracking-[0.08em] rounded-lg px-3.5 py-2 transition-colors text-xs"
        title="Toggle fullscreen (F)"
      >
        {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        <span className="hidden sm:inline">{fullscreen ? 'Exit' : 'Full'}</span>
      </button>

      <button
        onClick={() => { if (currentStepIdx > 0) goToStep(currentStepIdx - 1); }}
        disabled={currentStepIdx === 0}
        className="md:hidden bg-bg-card border border-border text-text-muted hover:text-accent hover:border-accent/30 font-semibold uppercase tracking-[0.08em] rounded-lg px-3.5 py-2 transition-colors inline-flex flex-1 items-center justify-center gap-1.5 disabled:opacity-50 sm:flex-none text-xs"
      >
        <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
        <span>Prev</span>
      </button>

      <span className="md:hidden order-3 w-full text-center font-mono text-xs font-semibold text-text-muted sm:order-none sm:w-auto">
        {currentStepIdx + 1} / {totalSteps}
      </span>

      <button
        onClick={async () => {
          if (!isLastStep) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            goToStep(currentStepIdx + 1);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            await handleComplete();
          }
        }}
        disabled={completing}
        className={`inline-flex flex-1 md:flex-none items-center justify-center gap-1.5 sm:flex-none font-semibold uppercase tracking-[0.08em] rounded-lg border border-accent/20 px-5 py-2.5 transition-colors text-xs ${
          isLastStep
            ? 'bg-accent text-bg hover:brightness-110'
            : 'bg-accent text-bg hover:brightness-110'
        } ${completing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {completing ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : isLastStep ? (
          isRoomComplete ? (
            <>
              <span>{nextRoom ? 'Next Room' : 'Finish'}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </>
          ) : (
            <>
              <span>{quizPassed ? 'Complete' : quizModuleId ? 'Quiz & Complete' : 'Complete'}</span>
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            </>
          )
        ) : (
          <>
            <span className="md:hidden">Next</span>
            <span className="hidden md:inline">Next Step</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
          </>
        )}
      </button>
    </div>
  );
};

export default RoomNavigation;
