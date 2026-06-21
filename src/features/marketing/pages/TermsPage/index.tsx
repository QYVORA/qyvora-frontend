import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import HeroBackground from '@/shared/components/backgrounds/HeroBackground';
import { Footer } from '@/shared/components/layout';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';
import SEO from '@/shared/components/SEO';
import SnapSection from '@/shared/components/SnapSection';
import { TermsHeroSection } from './TermsHeroSection';
import { TermsContentSection } from './TermsContentSection';
import { TermsCtaSection } from './TermsCtaSection';

const TermsPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, 60]);
  const { constrainedDevice } = useAdaptiveUi();
  const shouldReduceMotion = useReducedMotion();
  const minimizeEffects = shouldReduceMotion || constrainedDevice;

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
      <HeroBackground className="opacity-70" />

      <div
        ref={containerRef}
        className="landing-snap relative z-10 h-auto md:h-[100svh] w-full overflow-y-visible md:overflow-y-scroll overflow-x-hidden bg-transparent md:snap-y md:snap-mandatory"
      >
        <section className="md:snap-start md:snap-always md:h-full md:flex-shrink-0 md:box-border relative bg-transparent overflow-hidden">
          <motion.div
            style={{ y: minimizeEffects ? 0 : heroY, opacity: heroOpacity }}
          >
            <TermsHeroSection />
          </motion.div>
        </section>

        <SnapSection id="terms-content">
          <TermsContentSection />
        </SnapSection>

        <SnapSection id="terms-cta">
          <TermsCtaSection />
        </SnapSection>

        <section id="footer" className="md:snap-start md:snap-always md:min-h-full md:flex md:flex-shrink-0 bg-transparent overflow-hidden">
          <Footer />
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
