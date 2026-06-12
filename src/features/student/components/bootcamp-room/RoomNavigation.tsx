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
        className="inline-flex items-center gap-2 bg-bg-card text-text-muted hover:bg-accent-dim hover:text-accent font-bold uppercase tracking-[0.08em] rounded-xl px-5 py-2.5 transition-all shadow-sm"
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline">Jump</span>
      </button>

      <button
        onClick={toggleFullscreen}
        className="inline-flex items-center gap-2 bg-bg-card text-text-muted hover:bg-accent-dim hover:text-accent font-bold uppercase tracking-[0.08em] rounded-xl px-5 py-2.5 transition-all shadow-sm"
        title="Toggle fullscreen (F)"
      >
        {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        <span className="hidden sm:inline">{fullscreen ? 'Exit' : 'Full'}</span>
      </button>

      <button
        onClick={() => { if (currentStepIdx > 0) goToStep(currentStepIdx - 1); }}
        disabled={currentStepIdx === 0}
        className="md:hidden bg-bg-card text-text-muted hover:bg-accent-dim hover:text-accent font-bold uppercase tracking-[0.08em] rounded-xl px-5 py-2.5 transition-all shadow-sm inline-flex flex-1 items-center justify-center gap-2 disabled:opacity-30 sm:flex-none"
      >
        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
        <span>Prev</span>
      </button>

      <span className="md:hidden order-3 w-full text-center font-mono text-sm font-bold text-text-muted sm:order-none sm:w-auto">
        {currentStepIdx + 1} / {totalSteps}
      </span>

      <button
        onClick={async () => {
          if (!isLastStep) {
            goToStep(currentStepIdx + 1);
          } else {
            await handleComplete();
          }
        }}
        disabled={completing}
        className={`inline-flex flex-1 md:flex-none items-center justify-center gap-2 sm:flex-none font-bold uppercase tracking-[0.08em] rounded-xl px-7 py-3 transition-all shadow-lg ${
          isLastStep
            ? 'bg-accent text-bg hover:brightness-110 shadow-accent/20'
            : 'bg-accent text-bg hover:brightness-110 shadow-accent/20'
        } ${completing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {completing ? (
          <>
            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : isLastStep ? (
          isRoomComplete ? (
            <>
              <span>{nextRoom ? 'Continue to Next Room' : 'Finish Module'}</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            </>
          ) : (
            <>
              <span>{quizPassed ? 'Complete Room' : quizModuleId ? 'Take Quiz & Complete' : 'Complete Room'}</span>
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            </>
          )
        ) : (
          <>
            <span className="md:hidden">Next</span>
            <span className="hidden md:inline">Next Step</span>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
          </>
        )}
      </button>
    </div>
  );
};

export default RoomNavigation;
