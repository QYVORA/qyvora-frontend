import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/core/contexts/AuthContext';
import { useLandingData } from '@/features/marketing/hooks/useLandingData';
import { useLocation, useNavigate } from 'react-router-dom';

import LandingHeroSection from '@/features/marketing/components/landing/LandingHeroSection';
import LandingStatsSection from '@/features/marketing/components/landing/LandingStatsSection';
import LandingHowItWorksSection from '@/features/marketing/components/landing/LandingHowItWorksSection';
import LandingCurriculumSection from '@/features/marketing/components/landing/LandingCurriculumSection';

import LandingLeaderboardSection from '@/features/marketing/components/landing/LandingLeaderboardSection';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { Footer } from '@/shared/components/layout';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';
import { HeroBackground } from '@/shared/components/backgrounds';
import PromotionalSystem from '@/features/marketing/components/PromotionalSystem';
import SEO from '@/shared/components/SEO';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';

const SECTIONS = [
  { id: 'hero',        label: 'Home'            },
  { id: 'stats',       label: 'Stats'           },
  { id: 'how-it-works',label: 'How It Works'    },
  { id: 'curriculum',  label: 'Curriculum'      },
  { id: 'leaderboard', label: 'Leaderboard'     },
  { id: 'cta',         label: 'Get Started'     },
  { id: 'footer',      label: 'Footer'          },
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

  const showBackground = activeSection !== 'hero';

  return (
    <div className="relative min-h-screen w-full bg-bg overflow-x-hidden">
      <SEO 
        title="Africa's Offensive Security Platform"
        description="QYVORA is an offensive security company building a strong cybersecurity ecosystem in Africa through professional training, penetration testing, and advanced intelligence tools."
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': 'QYVORA',
          'url': SITE_CONFIG.brand.siteUrl,
          'potentialAction': {
            '@type': 'SearchAction',
            'target': `${SITE_CONFIG.brand.siteUrl}/dashboard/marketplace?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'QYVORA',
            'logo': {
              '@type': 'ImageObject',
              'url': `${SITE_CONFIG.brand.siteUrl}/favicon.png`
              // favicon.png kept in public/ for stable OG URL
            }
          }
        }}
      />
      
      <HeroBackground 
        className={`z-0 transition-opacity duration-700 ${showBackground ? 'opacity-90' : 'opacity-0'}`} 
      />

      <PromotionalSystem />

      <section id="hero" className="relative bg-transparent">
        <LandingHeroSection heroRef={heroRef} user={user} stats={stats} totalCp={totalCp} />
      </section>

      <section id="stats" className="relative w-full py-20 md:py-28 lg:py-32">
        <LandingStatsSection />
      </section>

      <section id="how-it-works" className="relative w-full py-20 md:py-28 lg:py-32">
        <LandingHowItWorksSection />
      </section>

      <section id="curriculum" className="relative w-full py-20 md:py-28 lg:py-32">
        <LandingCurriculumSection />
      </section>

      <section id="leaderboard" className="relative w-full py-20 md:py-28 lg:py-32">
        <LandingLeaderboardSection />
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

export default Landing;
