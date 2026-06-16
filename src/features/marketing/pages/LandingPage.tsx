import React, { useRef, useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useLandingData } from '../hooks/useLandingData';
import { useLocation, useNavigate } from 'react-router-dom';
import { useScrollLock } from '../../../core/hooks/useScrollLock';

import HeroSection from '../components/landing/HeroSection';
import ServicesSection from '../components/landing/ServicesSection';
import FinalCtaSection from '../components/landing/FinalCtaSection';
import Footer from '../components/layout/Footer';
import { useAdaptiveUi } from '../../../core/hooks/useAdaptiveUi';
import HeroBackground from '../../../shared/components/backgrounds/HeroBackground.tsx';
import ServiceRequestModal from '../components/ServiceRequestModal';
import PromotionalSystem from '../components/PromotionalSystem';
import SEO from '../../../shared/components/SEO';
import { SITE_CONFIG } from '../content/siteConfig';

// ── Section registry for dot-nav ─────────────────────────────────────────────
const SECTIONS = [
  { id: 'hero',        label: 'Home'            },
  { id: 'services',    label: 'Services'        },
  { id: 'cta',         label: 'Get Started'     },
  { id: 'footer',      label: 'Footer'          },
];

// ── Snap section ──────────────────────────────────────────────────────────────
const SnapSection: React.FC<{
  id: string;
  children: React.ReactNode;
  className?: string;
}> = ({ id, children, className = '' }) => {
  return (
    <section
      id={id}
      className={`relative md:snap-start md:snap-always md:h-screen w-full flex-shrink-0 box-border bg-transparent ${className}`}
    >
      <div
        className="w-full h-full relative z-10 flex flex-col justify-center py-12 md:py-0"
        data-snap-child=""
      >
        {children}
      </div>
    </section>
  );
};

const Landing: React.FC = () => {
  const { user } = useAuth();
  const { stats } = useLandingData();
  const { isMobile } = useAdaptiveUi();
  
  // Use a stable reference for scroll lock to prevent re-renders
  useScrollLock(!isMobile);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('hero');
  const isScrollingProgrammatically = useRef(false);
  const lastScrollTime = useRef(0);

  const totalCp = stats?.stats?.totalCpEarned ?? 0;

  // Validate section exists
  const isValidSection = useCallback((sectionId: string): boolean => {
    return SECTIONS.some(s => s.id === sectionId);
  }, []);

  // Handle hash-based navigation with validation
  useEffect(() => {
    // Only snaps on desktop
    if (isMobile) return;

    const hash = location.hash.replace('#', '');
    if (hash && isValidSection(hash)) {
      const timer = setTimeout(() => {
        const element = document.getElementById(hash);
        const container = containerRef.current;
        if (element && container) {
          isScrollingProgrammatically.current = true;
          container.scrollTo({ top: element.offsetTop, behavior: 'smooth' });
          setActiveSection(hash);
          setTimeout(() => {
            isScrollingProgrammatically.current = false;
          }, 1000);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
    
    if (hash && !isValidSection(hash)) {
      navigate('/404', { replace: true });
    }
  }, [location.hash, isValidSection, navigate, isMobile]);

  // Detect which section is currently in view and update URL
  useEffect(() => {
    const container = containerRef.current;
    // Disable tracking logic entirely on mobile
    if (!container || isMobile) return;

    const handleScroll = () => {
      const now = Date.now();
      if (isScrollingProgrammatically.current || now - lastScrollTime.current < 100) return;
      lastScrollTime.current = now;

      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const detectionPoint = scrollTop + containerHeight * 0.3;

      let foundSection = SECTIONS[0].id;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const section = SECTIONS[i];
        const element = document.getElementById(section.id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const elementTop = scrollTop + rect.top;

        if (detectionPoint >= elementTop) {
          foundSection = section.id;
          break;
        }
      }

      if (activeSection !== foundSection) {
        setActiveSection(foundSection);
        navigate(`#${foundSection}`, { replace: true });
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeSection, navigate, isMobile]);

  // Logic to hide background only on Hero section
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
            }
          }
        }}
      />
      
      <HeroBackground 
        className={`z-0 transition-opacity duration-700 ${showBackground ? 'opacity-90' : 'opacity-0'}`} 
      />

      <ServiceRequestModal />
      <PromotionalSystem />

      <div
        ref={containerRef}
        className="landing-snap relative z-10 h-auto md:h-screen w-full overflow-y-visible md:overflow-y-auto overflow-x-hidden bg-transparent md:snap-y md:snap-mandatory"
      >
        <section id="hero" className="md:h-screen md:snap-start md:snap-always flex-shrink-0 relative bg-transparent">
          <HeroSection heroRef={heroRef} user={user} stats={stats} totalCp={totalCp} />
        </section>

        <SnapSection id="services">
          <ServicesSection />
        </SnapSection>

        <SnapSection id="cta">
          <FinalCtaSection user={user} />
        </SnapSection>

        <section id="footer" className="md:snap-start md:snap-always w-full bg-bg">
          <Footer />
        </section>
      </div>
    </div>
  );
};

export default Landing;
