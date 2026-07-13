import React, { useState, useEffect } from 'react';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import SEO from '@/shared/components/SEO';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { AnansiHeroSection } from './AnansiHeroSection';
import { AnansiInstallSection } from './AnansiInstallSection';
import { AnansiPipelineSection } from './AnansiPipelineSection';

const AnansiPage: React.FC = () => {
  const { isMobile } = useAdaptiveUi();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const detectionPoint = scrollY + viewportHeight * 0.3;

      const sections = ['hero', 'install', 'pipeline', 'cta', 'footer'];
      let foundSection = sections[0];

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (!element) continue;
        if (detectionPoint >= element.offsetTop) {
          foundSection = sections[i];
          break;
        }
      }

      if (activeSection !== foundSection) {
        setActiveSection(foundSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

      <section id="hero" className="relative w-full">
        <AnansiHeroSection />
      </section>

      <section id="install" className="relative w-full py-20 md:py-28 lg:py-32">
        <AnansiInstallSection />
      </section>

      <section id="pipeline" className="relative w-full py-20 md:py-28 lg:py-32">
        <AnansiPipelineSection />
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

export default AnansiPage;
