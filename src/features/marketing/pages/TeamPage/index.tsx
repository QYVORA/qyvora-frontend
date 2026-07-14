import React from 'react';
import { useReducedMotion } from 'motion/react';
import { Footer } from '@/shared/components/layout';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';
import { useAuth } from '@/core/contexts/AuthContext';
import SEO from '@/shared/components/SEO';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { TeamHeroSection } from './TeamHeroSection';
import { TeamCarouselSection } from './TeamCarouselSection';

const TeamPage: React.FC = () => {
  const { constrainedDevice } = useAdaptiveUi();
  const { user } = useAuth();
  const shouldReduceMotion = useReducedMotion();
  const minimizeEffects = shouldReduceMotion || constrainedDevice;

  return (
    <div className="relative min-h-screen w-full bg-bg">
      <SEO
        title="Team - Meet the Operators"
        description="Learn more about the core operators and engineers building QYVORA's offensive security platform and ecosystem in Africa."
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Team', item: '/team' }
        ]}
      />

      <section className="relative bg-transparent overflow-hidden">
        <TeamHeroSection />
      </section>

      <section id="operators-directory" className="relative w-full py-20 md:py-28 lg:py-32">
        <TeamCarouselSection />
      </section>

      <section id="cta" className="relative w-full min-h-dvh md:h-dvh md:overflow-hidden">
        <LandingFinalCtaSection user={user} />
      </section>

      <section id="footer" className="bg-transparent overflow-hidden">
        <Footer />
      </section>
    </div>
  );
};

export default TeamPage;
