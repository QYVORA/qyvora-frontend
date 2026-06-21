import React, { useRef, useState, useEffect } from 'react';
import HeroBackground from '@/shared/components/backgrounds/HeroBackground';
import { Footer } from '@/shared/components/layout';
import { useScrollLock } from '@/core/hooks/useScrollLock';
import SEO from '@/shared/components/SEO';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';
import SnapSection from '@/shared/components/SnapSection';
import { AnansiHeroSection } from './AnansiHeroSection';
import { AnansiInstallSection } from './AnansiInstallSection';
import { AnansiPipelineSection } from './AnansiPipelineSection';
import { AnansiCtaSection } from './AnansiCtaSection';

const AnansiPage: React.FC = () => {
  const { isMobile } = useAdaptiveUi();
  useScrollLock(!isMobile);

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const container = containerRef.current;
    if (!container || isMobile) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const detectionPoint = scrollTop + containerHeight * 0.3;

      const sections = ['hero', 'install', 'pipeline', 'cta', 'footer'];
      let foundSection = sections[0];

      for (let i = sections.length - 1; i >= 0; i--) {
        const id = sections[i];
        const element = document.getElementById(id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const elementTop = scrollTop + rect.top;

        if (detectionPoint >= elementTop) {
          foundSection = id;
          break;
        }
      }

      if (activeSection !== foundSection) {
        setActiveSection(foundSection);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeSection, isMobile]);

  return (
    <div className="relative min-h-screen w-full bg-bg">
      <SEO
        title="Anansi CLI - Attack Surface Intelligence"
        description="Anansi CLI is a terminal-first attack surface intelligence engine built for speed, portability, and raw technical signal. Automate discovery, probing, and takeover detection."
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Anansi CLI', item: '/anansi' }
        ]}
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          'name': 'Anansi CLI',
          'operatingSystem': 'Linux, macOS, Windows',
          'applicationCategory': 'SecurityApplication',
          'description': 'Terminal-first attack surface intelligence engine built for speed, portability, and raw technical signal.',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
          }
        }}
      />
      <HeroBackground
        className={`
          z-0 transition-opacity duration-700
          ${activeSection === 'hero' ? 'opacity-65' : 'opacity-90'}
        `}
      />

      <div
        ref={containerRef}
        className="landing-snap relative z-10 h-auto md:h-[100svh] w-full overflow-y-visible md:overflow-y-scroll overflow-x-hidden bg-transparent md:snap-y md:snap-mandatory"
      >
        <SnapSection id="hero">
          <AnansiHeroSection />
        </SnapSection>

        <SnapSection id="install">
          <AnansiInstallSection />
        </SnapSection>

        <SnapSection id="pipeline" innerClassName="lg:pt-28 lg:pb-12">
          <AnansiPipelineSection />
        </SnapSection>

        <SnapSection id="cta">
          <AnansiCtaSection />
        </SnapSection>

        <section id="footer" className="md:snap-start md:snap-always w-full bg-bg">
          <Footer />
        </section>
      </div>
    </div>
  );
};

export default AnansiPage;
