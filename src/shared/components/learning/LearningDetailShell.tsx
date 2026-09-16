import React from 'react';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '@/shared/components/ui/PageHeader';
import Button from '@/shared/components/ui/Button';

export interface LearningDetailShellProps {
  backTo: string;
  backLabel: string;
  kicker: string;
  title: string;
  description?: string;
  metadata?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  relatedTitle?: string;
  related?: React.ReactNode;
  className?: string;
}

const LearningDetailShell: React.FC<LearningDetailShellProps> = ({
  backTo,
  backLabel,
  kicker,
  title,
  description,
  metadata,
  actions,
  children,
  relatedTitle,
  related,
  className = '',
}) => {
  return (
    <div className={className}>
      <Button to={backTo} variant="ghost" className="mb-6 -ml-2">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {backLabel}
      </Button>

      <PageHeader
        kicker={kicker}
        title={title}
        description={description}
        metadata={metadata}
        actions={actions}
      />

      {children}

      {related && (
        <div className="mt-12">
          {relatedTitle && (
            <h2 className="type-h2 font-black uppercase tracking-tight text-text-primary">
              {relatedTitle}
            </h2>
          )}
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{related}</div>
        </div>
      )}
    </div>
  );
};

export default LearningDetailShell;