import React from 'react';
import { StepNumberHeader } from '@/shared/components/learning/StepNumberHeader';
import StepNotes from '@/shared/components/courses/StepNotes';

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
  notesStorageKey?: string;
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
  notesStorageKey,
  className = '',
}) => {
  return (
    <section className={`relative w-full border-t border-border/10 first:border-t-0 py-12 md:py-16 ${className}`}>
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

      {notesStorageKey && (
        <div className="mt-6">
          <StepNotes storageKey={notesStorageKey} />
        </div>
      )}

      {footer && (
        <div className="mt-10 md:mt-14">
          {footer}
        </div>
      )}
    </section>
  );
};

export default StepRenderer;
