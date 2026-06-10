import React, { useRef, useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useLandingData } from '../hooks/useLandingData';
import { useLocation, useNavigate } from 'react-router-dom';

import HeroSection from '../components/landing/HeroSection';
import ServicesSection from '../components/landing/ServicesSection';
import FinalCtaSection from '../components/landing/FinalCtaSection';
import Footer from '../components/layout/Footer';
import { useAdaptiveUi } from '../../../core/hooks/useAdaptiveUi';
import HeroBackground from '../../../shared/components/backgrounds/HeroBackground';
import ServiceRequestModal from '../components/ServiceRequestModal';
import PromotionalSystem from '../components/PromotionalSystem';

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
      className={`relative md:snap-start md:snap-always md:min-h-screen w-full flex-shrink-0 box-border bg-transparent ${className}`}
    >
      <div
        className="w-full md:min-h-screen relative z-10 flex flex-col justify-center py-12 md:py-24"
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
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('hero');
  const isScrollingProgrammatically = useRef(false);
  const lastScrollTime = useRef(0);

  const totalCp = stats?.stats?.totalCpEarned ?? 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const scrollToSection = useCallback((index: number) => {
    const container = containerRef.current;
    const el = document.getElementById(SECTIONS[index]?.id ?? '');
    if (container && el) container.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  }, []);

  // Validate section exists
  const isValidSection = useCallback((sectionId: string): boolean => {
    return SECTIONS.some(s => s.id === sectionId);
  }, []);

  // Handle hash-based navigation with validation
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    
    // If there's a hash but it's not a valid section, redirect to 404
    if (hash && !isValidSection(hash)) {
      navigate('/404', { replace: true });
      return;
    }

    if (hash && isValidSection(hash)) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        const element = document.getElementById(hash);
        const container = containerRef.current;
        if (element && container) {
          isScrollingProgrammatically.current = true;
          container.scrollTo({ top: element.offsetTop, behavior: 'smooth' });
          setActiveSection(hash);
          // Reset flag after scroll animation
          setTimeout(() => {
            isScrollingProgrammatically.current = false;
          }, 1000);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.hash, isValidSection, navigate]);

  // Detect which section is currently in view and update URL
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const now = Date.now();
      
      // Skip if we're programmatically scrolling
      if (isScrollingProgrammatically.current) return;
      
      // Throttle to prevent excessive updates
      if (now - lastScrollTime.current < 100) return;
      lastScrollTime.current = now;

      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      
      // Use top third of viewport for better section detection
      const detectionPoint = scrollTop + containerHeight * 0.3;

      // Find which section contains the detection point
      let foundSection = SECTIONS[0].id; // Default to hero
      
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
        // Update URL hash without triggering scroll
        navigate(`#${foundSection}`, { replace: true });
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeSection, navigate]);

  // Click handler for dot navigation
  const handleDotClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    const container = containerRef.current;
    if (element && container) {
      isScrollingProgrammatically.current = true;
      container.scrollTo({ top: element.offsetTop, behavior: 'smooth' });
      setActiveSection(sectionId);
      navigate(`#${sectionId}`, { replace: true });
      // Reset flag after scroll animation
      setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 1200);
    }
  };

  return (
    <div className="relative h-screen w-full bg-bg">
      {/* ── Global Background - Fixed to viewport - Lower z-index to stay behind globe ── */}
      <HeroBackground className="opacity-80 z-0" />

      {/* ── Modals ── */}
      <ServiceRequestModal />
      <PromotionalSystem />

      <div
        ref={containerRef}
        className="landing-snap relative z-10 h-screen w-full overflow-y-scroll bg-transparent md:snap-y md:snap-mandatory"
      >
        {/* ── 1. Hero ── */}
        <section
          id="hero"
          className="md:min-h-screen md:snap-start md:snap-always flex-shrink-0 box-border relative bg-transparent overflow-hidden"
        >
          <HeroSection
            heroRef={heroRef}
            user={user}
            stats={stats}
            totalCp={totalCp}
          />
        </section>

        {/* ── 2. Services ── */}
        <SnapSection id="services">
          <ServicesSection />
        </SnapSection>

        {/* ── 3. Final CTA ── */}
        <SnapSection id="cta">
          <FinalCtaSection user={user} />
        </SnapSection>

        <section
          id="footer"
          className="md:snap-start md:snap-always w-full bg-bg"
        >
          <Footer />
        </section>
      </div>
    </div>
  );
};

export default Landing;