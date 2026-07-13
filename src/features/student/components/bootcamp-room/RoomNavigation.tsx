import React from 'react';
import { List, Minimize2, Maximize2, Loader2 } from 'lucide-react';
import { IconArrowLeft, IconArrowRight, IconCheck } from '@/shared/components/icons';

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
        className="btn-secondary inline-flex items-center gap-1.5 !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-3.5 py-2"
      >
        <List className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Jump</span>
      </button>

      <button
        onClick={toggleFullscreen}
        className="btn-secondary inline-flex items-center gap-1.5 !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-3.5 py-2"
        title="Toggle fullscreen (F)"
      >
        {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        <span className="hidden sm:inline">{fullscreen ? 'Exit' : 'Full'}</span>
      </button>

      <button
        onClick={() => { if (currentStepIdx > 0) goToStep(currentStepIdx - 1); }}
        disabled={currentStepIdx === 0}
        className="btn-secondary md:hidden inline-flex flex-1 items-center justify-center gap-1.5 !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest disabled:opacity-50 sm:flex-none px-3.5 py-2"
        aria-label="Previous step"
      >
        <IconArrowLeft size={14} className="shrink-0" />
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
        className={`btn-primary inline-flex flex-1 md:flex-none items-center justify-center gap-1.5 sm:flex-none !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-5 py-2.5 ${completing ? 'disabled:opacity-50' : ''}`}
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
              <IconArrowRight size={14} className="shrink-0" />
            </>
          ) : (
            <>
              <span>{quizPassed ? 'Complete' : quizModuleId ? 'Quiz & Complete' : 'Complete'}</span>
              <IconCheck size={14} className="shrink-0" />
            </>
          )
        ) : (
          <>
            <span className="md:hidden">Next</span>
            <span className="hidden md:inline">Next Step</span>
            <IconArrowRight size={14} className="shrink-0" />
          </>
        )}
      </button>
    </div>
  );
};

export default RoomNavigation;
