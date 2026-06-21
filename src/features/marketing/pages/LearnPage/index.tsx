import React, { useRef, useState, useEffect } from 'react';
import { useScrollLock } from '@/core/hooks/useScrollLock';
import SEO from '@/shared/components/SEO';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';
import SnapSection from '@/shared/components/SnapSection';
import { Footer } from '@/shared/components/layout';
import { LearnHeroSection } from './LearnHeroSection';
import { LearnPhasesSection } from './LearnPhasesSection';
import { LearnCtaSection } from './LearnCtaSection';

const LearnPage: React.FC = () => {
  const { isMobile } = useAdaptiveUi();
  useScrollLock(!isMobile);

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-bg select-none">
      <SEO
        title="Learn | Hacker Protocol Bootcamp"
        description="Master the 5 core phases of offensive security in the HPB Bootcamp. Train in mindset, Linux, networking, web systems, and social engineering."
      />

      <div
        ref={containerRef}
        className="
          w-full h-full
          md:h-screen md:overflow-y-auto
          md:snap-y md:snap-mandatory
          relative z-10 scroll-smooth
        "
        style={{ scrollbarWidth: 'none' }}
      >
        <SnapSection id="hero" className="overflow-hidden">
          <LearnHeroSection />
        </SnapSection>

        <SnapSection id="phases" innerClassName="lg:pt-28 lg:pb-12">
          <LearnPhasesSection />
        </SnapSection>

        <SnapSection id="cta">
          <LearnCtaSection />
        </SnapSection>

        <section id="footer" className="md:snap-start md:snap-always w-full bg-bg">
          <Footer />
        </section>
      </div>
    </div>
  );
};

export default LearnPage;
