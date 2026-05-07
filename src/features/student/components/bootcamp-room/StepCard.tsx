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
  onToggleBookmark: () => void;
  onReportIssue: () => void;
  onClick: () => void;
}

const StepCard: React.FC<Props> = ({
  step, stepNum, phaseId, roomId,
  isActive, isViewed, isBookmarked,
  onToggleBookmark, onReportIssue, onClick,
}) => (
  <div
    onClick={onClick}
    className={`relative cursor-pointer rounded-xl border p-5 sm:p-6 md:p-8 transition-colors duration-150 overflow-hidden group w-full ${
      isActive
        ? 'border-accent/40 bg-bg-card'
        : isViewed
        ? 'border-accent/20 bg-bg-card hover:border-accent/30'
        : 'border-border bg-bg-card hover:border-border/70'
    }`}
  >
    {isActive && (
      <div className="absolute left-0 top-6 bottom-6 w-1 rounded-full bg-accent" />
    )}

    <button
      onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
      className={`absolute top-6 right-6 p-2 rounded-lg border transition-colors z-10 ${
        isBookmarked
          ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500'
          : 'border-border bg-bg text-text-muted hover:text-accent hover:border-accent/30 opacity-0 group-hover:opacity-100'
      }`}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark this step'}
    >
      <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
    </button>

    <div className="mb-3 flex items-center gap-2.5">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 font-mono text-base font-black transition-colors ${
          isViewed && !isActive
            ? 'border-accent/40 bg-accent text-bg'
            : isActive
            ? 'border-accent bg-accent-dim text-accent'
            : 'border-border bg-bg text-text-muted'
        }`}
      >
        {isViewed && !isActive ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          String(stepNum).padStart(2, '0')
        )}
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <span className="block truncate text-xs font-black uppercase tracking-[0.2em] text-text-muted">
          {step.title}
        </span>
      </div>
      {isActive && (
        <span className="shrink-0 rounded-full border border-accent/30 bg-accent-dim px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-accent">
          Active
        </span>
      )}
      {isViewed && !isActive && (
        <span className="shrink-0 text-[8px] font-black uppercase tracking-widest text-accent/60">
          Viewed
        </span>
      )}
    </div>

    <p className={`text-sm sm:text-base leading-relaxed sm:leading-relaxed transition-colors ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
      <CodeBlockRenderer text={step.instruction} />
    </p>

    {step.image ? (
      <StepImage
        src={buildStepImagePath(phaseId, roomId, step.image)}
        alt={`${step.title}: ${step.instruction}`}
        stepNum={stepNum}
      />
    ) : (
      <StepPlaceholder stepNum={stepNum} />
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
