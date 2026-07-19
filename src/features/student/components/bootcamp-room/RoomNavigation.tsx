import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <div className={`flex flex-wrap items-center gap-3 pb-16 ${totalSteps <= 5 ? 'md:justify-end' : ''}`}>
      <button
        onClick={() => setJumpMenuOpen(true)}
        className="btn-secondary inline-flex items-center gap-1.5 !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-3.5 py-2"
      >
        <List className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t('student.bootcampRoom.nav.jump')}</span>
      </button>

      <button
        onClick={toggleFullscreen}
        className="btn-secondary inline-flex items-center gap-1.5 !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-3.5 py-2"
        title={t('student.bootcampRoom.nav.fullscreenTitle')}
      >
        {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        <span className="hidden sm:inline">{fullscreen ? t('student.bootcampRoom.nav.fullscreen.exit') : t('student.bootcampRoom.nav.fullscreen.enter')}</span>
      </button>

      <button
        onClick={() => { if (currentStepIdx > 0) goToStep(currentStepIdx - 1); }}
        disabled={currentStepIdx === 0}
        className="btn-secondary md:hidden inline-flex flex-1 items-center justify-center gap-1.5 !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest disabled:opacity-50 sm:flex-none px-3.5 py-2"
        aria-label={t('student.bootcampRoom.nav.prev')}
      >
        <IconArrowLeft size={14} className="shrink-0" />
        <span>{t('student.bootcampRoom.nav.prev')}</span>
      </button>

      <span className="md:hidden order-3 w-full text-center font-mono text-xs font-semibold text-text-muted sm:order-none sm:w-auto">
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
        className={`btn-primary inline-flex flex-1 md:flex-none items-center justify-center gap-1.5 sm:flex-none !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-5 py-2.5 ${completing ? 'disabled:opacity-50' : ''}`}
      >
        {completing ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>{t('student.bootcampRoom.nav.processing')}</span>
          </>
        ) : isLastStep ? (
          isRoomComplete ? (
            <>
              <span>{nextRoom ? t('student.bootcampRoom.nav.nextRoom') : t('student.bootcampRoom.nav.finish')}</span>
              <IconArrowRight size={14} className="shrink-0" />
            </>
          ) : (
            <>
              <span>{quizPassed ? t('student.bootcampRoom.nav.complete') : quizModuleId ? t('student.bootcampRoom.nav.quizAndComplete') : t('student.bootcampRoom.nav.complete')}</span>
              <IconCheck size={14} className="shrink-0" />
            </>
          )
        ) : (
          <>
            <span className="md:hidden">{t('student.bootcampRoom.nav.next')}</span>
            <span className="hidden md:inline">{t('student.bootcampRoom.nav.nextStep')}</span>
            <IconArrowRight size={14} className="shrink-0" />
          </>
        )}
      </button>
    </div>
  );
};

export default RoomNavigation;
