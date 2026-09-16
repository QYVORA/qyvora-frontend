import React from 'react';
import SEO from '@/shared/components/SEO';
import { TermsContentSection } from './TermsContentSection';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-dvh w-full bg-canvas">
      <SEO
        title="Terms of Service"
        description="Read the terms and conditions for using QYVORA's offensive security platform and services."
      />

      <div className="w-full pt-24 md:pt-28 lg:pt-32">
        <TermsContentSection />
      </div>
    </div>
  );
};

export default TermsPage;