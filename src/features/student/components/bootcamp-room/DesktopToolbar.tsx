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
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-card border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
      >
        <List className="h-4 w-4" />
      </button>

      <button
        onClick={toggleFullscreen}
        title={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-card border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
      >
        {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </button>

      <div className="h-px w-5 bg-border/20 my-1" />

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
        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
          isLastStep
            ? 'bg-accent border-accent text-bg hover:brightness-110'
            : 'bg-bg-card border-border text-text-muted hover:text-accent hover:border-accent/30'
        } ${completing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {completing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isLastStep ? (
          isRoomComplete ? (
            <ArrowRight className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </button>
    </aside>
  );
};

export default DesktopToolbar;
