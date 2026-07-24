import React from 'react';
import { useTranslation } from 'react-i18next';
import { List, Minimize2, Maximize2, Loader2 } from 'lucide-react';
import { IconArrowRight, IconCheck } from '@/shared/components/icons';

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
  const { t } = useTranslation();
  return (
    <aside
      className="hidden lg:flex fixed right-6 z-[100] flex-col items-center gap-3"
      style={{
        top: '5rem',
        bottom: '1.5rem',
        justifyContent: 'center',
      }}
      aria-label="Room actions"
    >
      <button
        onClick={() => setJumpMenuOpen(true)}
        title={t('student.bootcampRoom.desktopToolbar.jump')}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-card border border-border text-text-muted hover:text-accent hover:border-accent/30 active:scale-95 transition-colors"
      >
        <List className="h-4 w-4" />
      </button>

      <button
        onClick={toggleFullscreen}
        title={fullscreen ? t('student.bootcampRoom.desktopToolbar.exitFullscreen') : t('student.bootcampRoom.desktopToolbar.enterFullscreen')}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-card border border-border text-text-muted hover:text-accent hover:border-accent/30 active:scale-95 transition-colors"
      >
        {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </button>

      <div className="h-px w-5 bg-border/20 my-1" />

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
                ? t('student.bootcampRoom.desktopToolbar.continueToNext')
                : t('student.bootcampRoom.desktopToolbar.finishModule')
              : quizModuleId
              ? t('student.bootcampRoom.desktopToolbar.quizAndComplete')
              : t('student.bootcampRoom.desktopToolbar.completeRoom')
            : t('student.bootcampRoom.desktopToolbar.nextStep')
        }
        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
          isLastStep
            ? 'bg-accent border-accent text-bg hover:brightness-110 active:scale-95'
            : 'bg-bg-card border-border text-text-muted hover:text-accent hover:border-accent/30 active:scale-95'
        } ${completing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {completing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isLastStep ? (
          isRoomComplete ? (
            <IconArrowRight size={16} />
          ) : (
            <IconCheck size={16} />
          )
        ) : (
          <IconArrowRight size={16} />
        )}
      </button>
    </aside>
  );
};

export default DesktopToolbar;
