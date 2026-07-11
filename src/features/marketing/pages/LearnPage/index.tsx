import React from 'react';
import { useAuth } from '@/core/contexts/AuthContext';
import SEO from '@/shared/components/SEO';
import { Footer } from '@/shared/components/layout';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { LearnHeroSection } from './LearnHeroSection';
import { LearnPhasesSection } from './LearnPhasesSection';

const LearnPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="bg-bg">
      <SEO
        title="Learn | Hacker Protocol Bootcamp"
        description="Master the 5 core phases of offensive security in the HPB Bootcamp. Train in mindset, Linux, networking, web systems, and social engineering."
      />

      <section id="hero" className="relative w-full overflow-hidden">
        <LearnHeroSection />
      </section>

      <section id="phases" className="relative w-full">
        <LearnPhasesSection />
      </section>

      <section id="cta" className="relative w-full">
        <LandingFinalCtaSection user={user} />
      </section>

      <section id="footer" className="w-full bg-bg">
        <Footer />
      </section>
    </div>
  );
};

export default LearnPage;
