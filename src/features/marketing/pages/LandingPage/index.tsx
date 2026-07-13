import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/core/contexts/AuthContext';
import { useLandingData } from '@/features/marketing/hooks/useLandingData';
import { useLocation, useNavigate } from 'react-router-dom';

import LandingHeroSection from '@/features/marketing/components/landing/LandingHeroSection';
import LandingPillarsSection from '@/features/marketing/components/landing/LandingPillarsSection';
import LandingLabsSection from '@/features/marketing/components/landing/LandingLabsSection';
import LandingCoursesSection from '@/features/marketing/components/landing/LandingCoursesSection';
import LandingBootcampSection from '@/features/marketing/components/landing/LandingBootcampSection';
import LandingServicesSection from '@/features/marketing/components/landing/LandingServicesSection';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';

import { Footer } from '@/shared/components/layout';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';
import PromotionalSystem from '@/features/marketing/components/PromotionalSystem';
import SEO from '@/shared/components/SEO';

const SECTIONS = [
  { id: 'hero',       label: 'Home'         },
  { id: 'pillars',    label: 'Platform'     },
  { id: 'labs',       label: 'Labs'         },
  { id: 'courses',    label: 'Courses'      },
  { id: 'bootcamp',   label: 'Bootcamp'     },
  { id: 'services',   label: 'Services'     },
  { id: 'cta',        label: 'Get Started'  },
  { id: 'footer',     label: 'Footer'       },
];

const Landing: React.FC = () => {
  const { user } = useAuth();
  const { stats } = useLandingData();
  const { isMobile } = useAdaptiveUi();

  const heroRef = React.useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('hero');
  const isScrollingProgrammatically = React.useRef(false);
  const lastScrollTime = React.useRef(0);

  const totalCp = stats?.stats?.cpPoolSize ?? 0;

  const isValidSection = useCallback((sectionId: string): boolean => {
    return SECTIONS.some(s => s.id === sectionId);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const hash = location.hash.replace('#', '');
    if (hash && isValidSection(hash)) {
      const timer = setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          isScrollingProgrammatically.current = true;
          element.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(hash);
          setTimeout(() => {
            isScrollingProgrammatically.current = false;
          }, 1000);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.hash, isValidSection, navigate, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const handleScroll = () => {
      const now = Date.now();
      if (isScrollingProgrammatically.current || now - lastScrollTime.current < 100) return;
      lastScrollTime.current = now;
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const detectionPoint = scrollY + viewportHeight * 0.3;
      let foundSection = SECTIONS[0].id;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const section = SECTIONS[i];
        const element = document.getElementById(section.id);
        if (!element) continue;
        if (detectionPoint >= element.offsetTop) {
          foundSection = section.id;
          break;
        }
      }
      if (activeSection !== foundSection) {
        setActiveSection(foundSection);
        navigate(`#${foundSection}`, { replace: true });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, navigate, isMobile]);

  return (
    <div className="relative min-h-screen w-full bg-bg overflow-x-hidden">
      <SEO
        title="Africa's Offensive Security Platform"
        description="QYVORA is an offensive security company building Africa's cybersecurity ecosystem through structured training, live labs, and enterprise-grade penetration testing services."
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'QYVORA',
          url: 'https://qyvora.netlify.app',
          description: 'Africa\'s offensive security platform — training, labs, and enterprise penetration testing.',
          sameAs: [
            'https://twitter.com/qyvora',
            'https://linkedin.com/company/qyvora',
            'https://github.com/qyvora',
          ],
        }}
      />
      <PromotionalSystem />

      {/* 1. Hero — dark (no accent bg) */}
      <section id="hero" className="relative bg-transparent">
        <LandingHeroSection heroRef={heroRef} user={user} stats={stats} totalCp={totalCp} />
      </section>

      {/* 2. What We Build — accent */}
      <section id="pillars" className="relative w-full">
        <LandingPillarsSection />
      </section>

      {/* 3. Labs — dark */}
      <section id="labs" className="relative w-full">
        <LandingLabsSection />
      </section>

      {/* 4. Courses — accent */}
      <section id="courses" className="relative w-full">
        <LandingCoursesSection />
      </section>

      {/* 5. Bootcamp — dark */}
      <section id="bootcamp" className="relative w-full">
        <LandingBootcampSection />
      </section>

      {/* 6. Services — accent */}
      <section id="services" className="relative w-full">
        <LandingServicesSection />
      </section>

      {/* 7. CTA — dark */}
      <section id="cta" className="relative w-full">
        <LandingFinalCtaSection user={user} />
      </section>

      {/* 8. Footer */}
      <section id="footer" className="w-full bg-bg">
        <Footer />
      </section>
    </div>
  );
};

export default Landing;
