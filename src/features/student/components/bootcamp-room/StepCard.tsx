import { Bookmark, CheckCircle2, Flag } from 'lucide-react';
import type { BootcampStep } from '../../constants/bootcampConfig';
import { buildStepImagePath } from '../../constants/bootcampConfig';
import CodeBlockRenderer from './CodeBlockRenderer';
import StepImage from './StepImage';
import StepPlaceholder from './StepPlaceholder';

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
}

const StepCard: React.FC<Props> = ({
  step, stepNum, phaseId, roomId,
  isActive, isViewed, isBookmarked,
  phaseColor,
  footer,
  onToggleBookmark, onReportIssue, onClick,
}) => (
  <div
    onClick={onClick}
    className={`relative cursor-pointer rounded-2xl p-5 sm:p-6 md:p-8 transition-all duration-300 overflow-hidden group w-full bg-transparent ${
      isActive
        ? 'shadow-2xl shadow-accent/5 scale-[1.015] z-10'
        : 'opacity-40 hover:opacity-100'
    }`}
  >
    <button
      onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
      className={`absolute top-6 right-6 p-2 rounded-lg transition-all z-10 ${
        isBookmarked
          ? 'bg-transparent text-yellow-500'
          : 'bg-transparent text-text-muted hover:text-accent opacity-0 group-hover:opacity-100'
      }`}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark this step'}
    >
      <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
    </button>

    <div className="mb-5 flex items-center gap-3">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-mono text-lg font-black transition-all duration-300 ${
          isActive
            ? 'text-accent scale-110'
            : isViewed
            ? 'text-accent/60'
            : 'text-text-muted'
        }`}
      >
        {isViewed && !isActive ? (
          <CheckCircle2 className="h-6 w-6" />
        ) : (
          String(stepNum).padStart(2, '0')
        )}
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <span className={`block truncate font-black uppercase tracking-[0.25em] transition-colors duration-300 ${
          isActive ? 'text-accent text-xs' : 'text-text-muted text-[10px]'
        }`}>
          {step.title}
        </span>
      </div>
      {isActive && (
        <span className="shrink-0 text-accent text-[9px] font-black uppercase tracking-widest animate-pulse">
          Current Focus
        </span>
      )}
    </div>

    <div className={`text-sm sm:text-base leading-[1.8] sm:leading-[1.85] transition-colors ${isActive ? 'text-text-primary' : 'text-text-secondary'} w-full`}>
      <CodeBlockRenderer text={step.instruction} />
    </div>

    {step.image ? (
      <StepImage
        src={buildStepImagePath(phaseId, roomId, step.image)}
        alt={`${step.title}: ${step.instruction}`}
        stepNum={stepNum}
      />
    ) : (
      <StepPlaceholder stepNum={stepNum} />
    )}

    {footer && (
      <div className="mt-6" onClick={(e) => e.stopPropagation()}>
        {footer}
      </div>
    )}

    <button
      onClick={(e) => { e.stopPropagation(); onReportIssue(); }}
      className="mt-4 text-xs text-text-muted hover:text-accent transition-colors flex items-center gap-1.5 opacity-0 group-hover:opacity-100"
    >
      <Flag className="h-3 w-3" />
      Report issue with this step
    </button>
  </div>
);

export default StepCard;
