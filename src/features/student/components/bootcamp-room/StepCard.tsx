import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bookmark, Flag } from 'lucide-react';
import { IconCheck } from '@/shared/components/icons';
import type { BootcampStep } from '../../constants/bootcampConfig';
import { buildStepImagePath } from '../../constants/bootcampConfig';
import CodeBlockRenderer from './CodeBlockRenderer';
import StepImage from './StepImage';
import StepNotes from '@/shared/components/courses/StepNotes';

interface Props {
  step: BootcampStep;
  stepNum: number;
  phaseId: string;
  roomId: string;
  isActive: boolean;
  isViewed: boolean;
  isBookmarked: boolean;
  phaseColor?: string;
  footer?: React.ReactNode;
  onToggleBookmark: () => void;
  onReportIssue: () => void;
  onClick: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onGotIt?: (stepNum: number, val: boolean) => void;
  gotIt?: boolean;
}

const StepCard: React.FC<Props> = ({
  step, stepNum, phaseId, roomId,
  isActive, isViewed, isBookmarked,
  phaseColor,
  footer,
  onToggleBookmark, onReportIssue, onClick,
  onNext, onPrev,
  onGotIt, gotIt = false,
}) => {
  const { t } = useTranslation();
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isActive) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      onNext?.();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onPrev?.();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
  <div
    onClick={onClick}
    onKeyDown={handleKeyDown}
    tabIndex={isActive ? 0 : -1}
    role="button"
    className={`relative cursor-pointer py-12 md:py-16 overflow-hidden group w-full border-t border-border/10 first:border-t-0`}
  >
    <button
      onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
      className={`absolute top-12 md:top-16 right-0 p-2 rounded-lg border transition-all z-10 ${
        isBookmarked
          ? 'border-accent/30 text-yellow-500'
          : 'bg-transparent border-border text-text-muted hover:text-accent opacity-100 lg:opacity-0 lg:group-hover:opacity-100'
      }`}
      title={isBookmarked ? t('student.bootcampRoom.stepCard.removeBookmark') : t('student.bootcampRoom.stepCard.addBookmark')}
    >
      <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
    </button>

    <div className="mb-8 md:mb-12 flex items-center gap-4">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border font-mono text-lg font-black ${
          isActive
            ? 'bg-accent border-accent text-bg'
            : isViewed
            ? 'bg-accent-dim border-accent/20 text-accent/60'
            : 'bg-bg-elevated border-border text-text-muted'
        }`}
      >
        {isViewed && !isActive ? (
          <IconCheck size={24} />
        ) : (
          String(stepNum).padStart(2, '0')
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`block font-black uppercase tracking-[0.25em] transition-colors duration-300 ${
          isActive ? 'text-accent text-xs' : 'text-text-muted text-[10px]'
        }`}>
          {step.title}
        </span>
      </div>
      {isActive && (
        <span className="shrink-0 text-accent text-[9px] font-black uppercase tracking-widest px-2 py-1">
          {t('student.bootcampRoom.stepCard.currentFocus')}
        </span>
      )}
    </div>

    <div className={`text-sm sm:text-base leading-relaxed whitespace-pre-wrap overflow-x-auto transition-colors ${isActive ? 'text-text-primary' : 'text-text-secondary'} w-full mb-10 md:mb-14`}>
      <CodeBlockRenderer text={step.instruction} />
    </div>

    {step.image ? (
      <StepImage
        src={buildStepImagePath(phaseId, roomId, step.image)}
        alt={`${step.title}: ${step.instruction}`}
        stepNum={stepNum}
      />
    ) : null}

    {/* Got It & Notes area */}
    <div className="mt-8 flex flex-wrap items-start gap-4">
      <button
        onClick={(e) => { e.stopPropagation(); onGotIt?.(stepNum, !gotIt); }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
          gotIt
            ? 'bg-accent text-bg border-accent'
            : 'border-border text-text-muted hover:border-accent/30 hover:text-accent'
        }`}
      >
        <IconCheck size={12} className={gotIt ? '' : 'opacity-50'} />
        {gotIt ? t('student.bootcampRoom.stepCard.gotIt') : t('student.bootcampRoom.stepCard.markGotIt')}
      </button>
    </div>

    <div className="mt-6" onClick={(e) => e.stopPropagation()}>
      <StepNotes
        storageKey={`step_notes_${phaseId}_${roomId}_${stepNum}`}
      />
    </div>

    {footer && (
      <div className="mt-10 md:mt-14" onClick={(e) => e.stopPropagation()}>
        {footer}
      </div>
    )}

    <div className="mt-10 md:mt-14 flex items-center justify-between border-t border-border/5 pt-6">
      <button
        onClick={(e) => { e.stopPropagation(); onReportIssue(); }}
        className="text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-accent transition-colors flex items-center gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
      >
        <Flag className="h-3 w-3" />
        {t('student.bootcampRoom.stepCard.reportIssue')}
      </button>

      {isActive && !isViewed && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-accent/40">
          {t('student.bootcampRoom.stepCard.unread')}
        </span>
      )}
    </div>
  </div>
  );
};

export default StepCard;
