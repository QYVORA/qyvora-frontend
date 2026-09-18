import React from 'react';
import SEO from '@/shared/components/SEO';
import RelatedContent from '@/shared/components/RelatedContent';
import { LabCelebration } from '@/shared/components/LabCelebration';
import LearningWorkspaceShell from '@/shared/components/learning/LearningWorkspaceShell';

export interface LabPageProps {
  title: string;
  accentWord: string;
  description?: string;
  eyebrow?: string;
  backTo?: string;
  backLabel?: string;
  villain?: {
    name: string;
    alias: string;
    description: string;
  };

  activeScenario: unknown | null;

  listingContent: React.ReactNode;
  walkthroughContent: React.ReactNode;

  celebrationShow: boolean;
  celebrationTitle?: string;
  celebrationCp?: number;

  relatedContent?: React.ReactNode;
  noIndex?: boolean;
}

const LabPage: React.FC<LabPageProps> = ({
  title,
  accentWord,
  description,
  eyebrow,
  backTo = '/dashboard/labs',
  backLabel = undefined,
  activeScenario,
  listingContent,
  walkthroughContent,
  celebrationShow,
  celebrationTitle = '',
  celebrationCp = 0,
  relatedContent,
  noIndex = true,
}) => {
  return (
    <div className="w-full bg-canvas min-h-dvh">
      <SEO title={`${title} ${accentWord} | QYVORA`} description={description || `${title} ${accentWord} lab`} noindex={noIndex} />

      <LabCelebration
        trigger={celebrationShow}
        title={celebrationTitle}
        rewardCp={celebrationCp}
      />

      {activeScenario ? (
        walkthroughContent
      ) : (
        <LearningWorkspaceShell
          kicker={eyebrow}
          backTo={backTo}
          backLabel={backLabel ?? "Back to Labs"}
          title={`${title} ${accentWord}`}
          description={description || `Master ${title.toLowerCase()} techniques through hands-on challenges`}
        >
          <div className="w-full space-y-10">
            {listingContent}
            {relatedContent && (
              <div>
                {relatedContent}
              </div>
            )}
          </div>
        </LearningWorkspaceShell>
      )}
    </div>
  );
};

export default LabPage;