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
      <span className="text-sm font-medium">{backLabel}</span>
    </Link>
  ) : onBack ? (
    <button
      type="button"
      onClick={onBack}
      className="group mb-6 flex items-center gap-2 text-text-muted transition-colors hover:text-text-primary min-h-[44px] min-w-[44px]"
    >
      <IconArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
      <span className="text-sm font-medium">{backLabel}</span>
    </button>
  ) : null;

  return (
    <>
      {showBack && backElement}
      <div className="mb-6 md:mb-8">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span
            className={cn(
              'text-sm font-medium tabular-nums',
              isActive || isCompleted ? 'text-accent' : 'text-text-muted'
            )}
          >
            {stepNumber}.
          </span>
          <h2
            className={cn(
              'min-w-0 flex-1 font-medium leading-tight tracking-tight',
              'text-xl sm:text-2xl md:text-3xl',
              isActive || isCompleted ? 'text-text-primary' : 'text-text-muted'
            )}
          >
            {title}
          </h2>
          {badges}
          {statusLabel && (
            <span className="shrink-0 text-[12px] font-medium text-accent">
              {statusLabel}
            </span>
          )}
          {isCompleted && !statusLabel && (
            <span className="text-[12px] font-medium text-accent">
              {"Done"}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default StepNumberHeader;
