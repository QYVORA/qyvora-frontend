import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLandingData } from '@/features/marketing/hooks/useLandingData';

import HeroBlock from '@/features/marketing/components/landing/blocks/HeroBlock';
import PathBlock from '@/features/marketing/components/landing/blocks/PathBlock';
import FeaturedLearningBlock from '@/features/marketing/components/landing/blocks/FeaturedLearningBlock';
import ProofBlock from '@/features/marketing/components/landing/blocks/ProofBlock';
import ToolsResearchBlock from '@/features/marketing/components/landing/blocks/ToolsResearchBlock';
import FinalCtaBlock from '@/features/marketing/components/landing/blocks/FinalCtaBlock';

import SEO from '@/shared/components/SEO';
import { buildOrganization } from '@/shared/seo/schema';

/**
 * Landing — the calm six-block landing: hero, choose-your-path, featured
 * learning, product proof, tools/research strip, and one final CTA. The
 * public shell owns navigation and footer; this page owns the message.
 */
const Landing: React.FC = () => {
  const { t } = useTranslation();
  const { stats } = useLandingData();

  return (
    <div className="relative w-full bg-canvas">
      <SEO
        title={t('landing2.seo.title')}
        description={t('landing2.seo.description')}
        schemaData={buildOrganization()}
      />

      <HeroBlock stats={stats} />
      <PathBlock />
      <FeaturedLearningBlock />
      <ProofBlock stats={stats} />
      <ToolsResearchBlock />
      <FinalCtaBlock />
    </div>
  );
};

export default Landing;