import React from 'react';
import { List, Minimize2, Maximize2, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

interface DesktopToolbarProps {
  setJumpMenuOpen: (open: boolean) => void;
  toggleFullscreen: () => void;
  fullscreen: boolean;
  isLastStep: boolean;
  isRoomComplete: boolean;
  nextRoom: any;
  quizModuleId: string;
  completing: boolean;
  currentStepIdx: number;
  goToStep: (idx: number) => void;
  handleComplete: () => Promise<void>;
}

const DesktopToolbar: React.FC<DesktopToolbarProps> = ({
  setJumpMenuOpen,
  toggleFullscreen,
  fullscreen,
  isLastStep,
  isRoomComplete,
  nextRoom,
  quizModuleId,
  completing,
  currentStepIdx,
  goToStep,
  handleComplete,
}) => {
  return (
    <aside
      className="hidden lg:flex fixed right-6 z-30 flex-col items-center gap-3"
      style={{
        top: '6rem',
        bottom: '1.5rem',
        justifyContent: 'center',
      }}
      aria-label="Room actions"
    >
      <button
        onClick={() => setJumpMenuOpen(true)}
        title="Jump to step"
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-bg-card text-text-muted hover:bg-accent-dim hover:text-accent transition-colors shadow-sm"
      >
        <List className="h-5 w-5" />
      </button>

      <button
        onClick={toggleFullscreen}
        title={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-bg-card text-text-muted hover:bg-accent-dim hover:text-accent transition-colors shadow-sm"
      >
        {fullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
      </button>

      <div className="h-px w-6 bg-border/30 my-1" />

      <button
        onClick={async () => {
          if (!isLastStep) {
            goToStep(currentStepIdx + 1);
          } else {
            await handleComplete();
          }
        }}
        disabled={completing}
        title={
          isLastStep
            ? isRoomComplete
              ? nextRoom
                ? 'Continue to Next Room'
                : 'Finish Module'
              : quizModuleId
              ? 'Take Quiz & Complete'
              : 'Complete Room'
            : 'Next Step'
        }
        className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all shadow-sm ${
          isLastStep
            ? 'bg-accent text-bg hover:brightness-110'
            : 'bg-bg-card text-text-muted hover:bg-accent-dim hover:text-accent'
        } ${completing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {completing ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isLastStep ? (
          isRoomComplete ? (
            <ArrowRight className="h-5 w-5" />
          ) : (
            <CheckCircle2 className="h-5 w-5" />
          )
        ) : (
          <ArrowRight className="h-5 w-5" />
        )}
      </button>
    </aside>
  );
};

export default DesktopToolbar;
