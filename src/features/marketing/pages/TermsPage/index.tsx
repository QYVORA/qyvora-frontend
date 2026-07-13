import React from 'react';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import SEO from '@/shared/components/SEO';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { TermsHeroSection } from './TermsHeroSection';
import { TermsContentSection } from './TermsContentSection';

const TermsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen w-full bg-bg">
      <SEO
        title="Terms of Service"
        description="Read the terms and conditions for using QYVORA's offensive security platform and services."
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Terms of Service', item: '/terms' }
        ]}
      />

      <section className="relative bg-transparent overflow-hidden">
        <TermsHeroSection />
      </section>

      <section id="terms-content" className="relative w-full">
        <TermsContentSection />
      </section>

      <section id="terms-cta" className="relative w-full">
        <LandingFinalCtaSection user={user} />
      </section>

      <section id="footer" className="bg-transparent overflow-hidden">
        <Footer />
      </section>
    </div>
  );
};

export default TermsPage;
