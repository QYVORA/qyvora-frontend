import React from 'react';
import SEO from '@/shared/components/SEO';
import StudentHeroSection from '@/shared/components/StudentHeroSection';
import RelatedContent from '@/shared/components/RelatedContent';
import { LabCelebration } from '@/shared/components/LabCelebration';

export interface LabPageProps {
  title: string;
  accentWord: string;
  description?: string;
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
  villain,
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
    <div className="bg-bg min-h-full">
      <SEO title={`${title} ${accentWord} | QYVORA`} description={description || `${title} ${accentWord} lab`} noindex={noIndex} />

      <LabCelebration
        trigger={celebrationShow}
        title={celebrationTitle}
        rewardCp={celebrationCp}
      />

      {activeScenario ? (
        walkthroughContent
      ) : (
        <>
          <div className="bg-bg px-3 md:px-4 lg:px-6 pt-8 pb-10">
            <StudentHeroSection
              fullHeight={false}
              title={title}
              accentWord={accentWord}
              description={description || `Master ${title.toLowerCase()} techniques through hands-on challenges`}
              villain={villain}
            />
          </div>
          <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10 pb-20 lg:pb-24 space-y-8">
            {listingContent}
            {relatedContent && (
              <div className="mt-8">
                {relatedContent}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LabPage;
