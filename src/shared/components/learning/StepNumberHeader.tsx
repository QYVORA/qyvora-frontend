import { Link } from 'react-router-dom';
import { IconArrowLeft, IconCheck } from '@/shared/components/icons';
import { cn } from '@/shared/utils/cn';

export interface StepNumberHeaderProps {
  stepNumber: number;
  title: string;
  isActive?: boolean;
  isCompleted?: boolean;
  statusLabel?: string;
  badges?: React.ReactNode;
  backUrl?: string;
  backLabel?: string;
  onBack?: () => void;
}

export function StepNumberHeader({
  stepNumber,
  title,
  isActive = false,
  isCompleted = false,
  statusLabel,
  badges,
  backUrl,
  backLabel = 'Back',
  onBack,
}: StepNumberHeaderProps) {
  const showBack = !!(backUrl || onBack);

  const backElement = backUrl ? (
    <Link
      to={backUrl}
      className="group mb-6 flex items-center gap-2 text-text-muted transition-colors hover:text-text-primary min-h-[44px] min-w-[44px]"
    >
      <IconArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
      <span className="text-xs font-black uppercase tracking-widest">{backLabel}</span>
    </Link>
  ) : onBack ? (
    <button
      type="button"
      onClick={onBack}
      className="group mb-6 flex items-center gap-2 text-text-muted transition-colors hover:text-text-primary min-h-[44px] min-w-[44px]"
    >
      <IconArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
      <span className="text-xs font-black uppercase tracking-widest">{backLabel}</span>
    </button>
  ) : null;

  return (
    <>
      {showBack && backElement}
      <div className="mb-8 md:mb-12 flex items-center gap-4">
        <div
          className={cn(
            'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border font-mono text-xl font-black md:h-16 md:w-16 md:text-2xl',
            isActive
              ? 'bg-accent border-accent text-on-accent'
              : isCompleted
              ? 'bg-accent-dim border-accent/20 text-accent'
              : 'bg-bg-elevated border-border text-text-muted',
          )}
        >
          {isCompleted ? (
            <IconCheck size={24} />
          ) : (
            String(stepNumber).padStart(2, '0')
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          <span
            className={cn(
              'block font-black uppercase tracking-tight transition-colors duration-300',
              isActive ? 'text-accent text-2xl md:text-3xl' : isCompleted ? 'text-accent text-2xl md:text-3xl' : 'text-text-muted text-2xl md:text-3xl',
            )}
          >
            {title}
          </span>
          {badges}
        </div>
        {statusLabel && (
          <span className="shrink-0 text-accent text-xs font-black uppercase tracking-widest px-2 py-1">
            {statusLabel}
          </span>
        )}
        {isCompleted && !statusLabel && (
          <span className="text-xs font-black uppercase tracking-widest text-accent">
            {"Done"}
          </span>
        )}
      </div>
    </>
  );
}

export default StepNumberHeader;
