import React from 'react';
import { StepNumberHeader } from '@/shared/components/learning/StepNumberHeader';

export interface StepRendererProps {
  stepNumber: number;
  title: string;
  isActive?: boolean;
  isCompleted?: boolean;
  statusLabel?: string;
  badges?: React.ReactNode;
  backUrl?: string;
  backLabel?: string;
  onBack?: () => void;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  afterContent?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const StepRenderer: React.FC<StepRendererProps> = ({
  stepNumber,
  title,
  isActive = true,
  isCompleted = false,
  statusLabel,
  badges,
  backUrl,
  backLabel,
  onBack,
  children,
  headerAction,
  afterContent,
  footer,
  className = '',
}) => {
  return (
    <section className={`relative w-full py-6 md:py-8 ${className}`}>
      {headerAction}
      <StepNumberHeader
        stepNumber={stepNumber}
        title={title}
        isActive={isActive}
        isCompleted={isCompleted}
        statusLabel={statusLabel}
        badges={badges}
        backUrl={backUrl}
        backLabel={backLabel}
        onBack={onBack}
      />

      {children}

      {afterContent}

      {footer && (
        <div className="mt-8 md:mt-10">
          {footer}
        </div>
      )}
    </section>
  );
};

export default StepRenderer;
