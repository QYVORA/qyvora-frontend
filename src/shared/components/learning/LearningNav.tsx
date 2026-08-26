import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export interface LearningNavProps {
  currentStep: number;
  totalSteps: number;
  isLastStep: boolean;
  isComplete?: boolean;
  completing?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  onComplete?: () => void;
  nextLabel?: string;
  nextLabelMobile?: string;
  completeLabel?: string;
  finishContent?: React.ReactNode;
  className?: string;
  leading?: React.ReactNode;
}

const LearningNav: React.FC<LearningNavProps> = ({
  currentStep,
  totalSteps,
  isLastStep,
  isComplete = false,
  completing = false,
  onPrev,
  onNext,
  onComplete,
  nextLabel,
  nextLabelMobile,
  completeLabel,
  finishContent,
  className = '',
  leading,
}) => {
  const { t } = useTranslation();
  const lblNext = nextLabel || t('learning.nav.nextStep');
  const lblNextMobile = nextLabelMobile || t('learning.nav.next');
  const lblComplete = completeLabel || t('learning.nav.complete');

  return (
    <div
      className={`flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pb-16 mt-10 md:mt-14 border-t border-border/5 pt-6 ${className}`}
    >
      {leading}

      {currentStep > 0 && onPrev && (
        <button
          onClick={onPrev}
          className="btn-secondary inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 disabled:opacity-50 sm:flex-none px-3.5 py-2"
          aria-label={t('learning.nav.prev')}
        >
          <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
          <span>{t('learning.nav.prev')}</span>
        </button>
      )}

      <span className="md:hidden order-3 w-full text-center font-mono text-xs font-semibold text-text-muted sm:order-none sm:w-auto">
        {currentStep + 1} / {totalSteps}
      </span>

      {!isLastStep && onNext && (
        <>
          {onComplete && (
            <button
              onClick={onComplete}
              className="btn-secondary inline-flex min-h-[44px] items-center gap-1.5 px-3.5 py-2 w-full sm:w-auto"
            >
              {lblComplete}
            </button>
          )}
          <button
            onClick={onNext}
            className="btn-primary inline-flex min-h-[44px] flex-1 md:flex-none items-center justify-center gap-1.5 sm:flex-none px-5 py-2.5 disabled:opacity-50"
            disabled={completing}
          >
            {completing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>{t('learning.nav.processing')}</span>
              </>
            ) : (
              <>
                <span className="md:hidden">{lblNextMobile}</span>
                <span className="hidden md:inline">{lblNext}</span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              </>
            )}
          </button>
        </>
      )}

      {isLastStep && !isComplete && onComplete && (
        <button
          onClick={onComplete}
          disabled={completing}
          className="btn-primary inline-flex min-h-[44px] flex-1 md:flex-none items-center justify-center gap-1.5 sm:flex-none px-5 py-2.5 disabled:opacity-50"
        >
          {completing ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>{t('learning.nav.processing')}</span>
            </>
          ) : (
            <span>{lblComplete}</span>
          )}
        </button>
      )}

      {isLastStep && isComplete && finishContent}
    </div>
  );
};

export default LearningNav;
