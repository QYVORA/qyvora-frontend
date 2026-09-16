import React from 'react';
import { useTranslation } from 'react-i18next';
import { Minimize2, Maximize2 } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import RelatedContent from '@/shared/components/RelatedContent';
import { LabCelebration } from '@/shared/components/LabCelebration';
import LearningToolbar from '@/shared/components/learning/LearningToolbar';
import LearningWorkspaceShell from '@/shared/components/learning/LearningWorkspaceShell';
import { useRoomSession } from '@/features/student/hooks/useRoomSession';

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
  const { t } = useTranslation();
  const { fullscreen, toggleFullscreen } = useRoomSession();

  return (
    <div className="w-full bg-canvas min-h-dvh">
      <SEO title={`${title} ${accentWord} | QYVORA`} description={description || `${title} ${accentWord} lab`} noindex={noIndex} />

      <LabCelebration
        trigger={celebrationShow}
        title={celebrationTitle}
        rewardCp={celebrationCp}
      />

      {activeScenario && (
        <LearningToolbar
          actions={[
            {
              id: 'fullscreen',
              icon: fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />,
              label: fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen',
              onClick: toggleFullscreen,
            },
          ]}
        />
      )}

      {activeScenario ? (
        walkthroughContent
      ) : (
        <LearningWorkspaceShell
          kicker={eyebrow}
          backTo={backTo}
          backLabel={backLabel ?? t('labs.backToLabs', 'Back to Labs')}
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