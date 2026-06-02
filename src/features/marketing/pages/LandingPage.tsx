import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useScroll, useTransform, motion, useReducedMotion } from 'motion/react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useLandingData } from '../hooks/useLandingData';
import { useLocation, useNavigate } from 'react-router-dom';

import HeroSection from '../components/landing/HeroSection';
import BootcampsSection from '../components/landing/BootcampsSection';
import EconomySection from '../components/landing/EconomySection';
import LeaderboardSection from '../components/landing/LeaderboardSection';
import ServicesSection from '../components/landing/ServicesSection';
import AnansiSection from '../components/landing/AnansiSection';
import FinalCtaSection from '../components/landing/FinalCtaSection';
import ProcessSection  from '../components/landing/ProcessSection';  //Add process section
import PartnersSection from '../components/landing/PartnersSection'; 
import Footer from '../components/layout/Footer';
import { useAdaptiveUi } from '../../../core/hooks/useAdaptiveUi';
import HeroBackground from '../components/HeroBackground';
import ServiceRequestModal from '../components/ServiceRequestModal';
import PromotionalSystem from '../components/PromotionalSystem';
import { extractCpBalance } from '../../../shared/utils/cpBalance';

// ── Section registry for dot-nav ─────────────────────────────────────────────
const SECTIONS = [
  { id: 'hero',        label: 'Home'            },
  { id: 'process',     label: 'Process'         },  // Add Proccess section to landing page
  { id: 'bootcamps',   label: 'Bootcamps'       },
  { id: 'services',    label: 'Services'        },
  { id: 'anansi',      label: 'ANANSI'          },
  { id: 'market',      label: 'Zero-Day Market' },
  { id: 'leaderboard', label: 'Leaderboard'     },
  { id: 'partners',    label: 'Partners'        }, 
  { id: 'cta',         label: 'Get Started'     },
  { id: 'footer',      label: 'Footer'          },
];

// ── Snap section ──────────────────────────────────────────────────────────────
const SnapSection: React.FC<{
  id: string;
  children: React.ReactNode;
  className?: string;
}> = ({ id, children, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();
  const { constrainedDevice, isMobile } = useAdaptiveUi();
  const disableAnimations = shouldReduceMotion || constrainedDevice || isMobile;
  return (
    <section
      id={id}
      className={`relative md:snap-start md:snap-always min-h-[100svh] w-full flex-shrink-0 box-border bg-transparent ${className}`}
    >
      <motion.div
        initial={disableAnimations ? false : { opacity: 0, y: 50, scale: 0.95, filter: 'blur(10px)', rotateX: 5 }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', rotateX: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={disableAnimations ? { duration: 0.001 } : { 
          type: 'spring',
          damping: 30,
          stiffness: 80,
          mass: 1,
          duration: 1,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="w-full min-h-full relative z-10 flex items-center py-20 md:py-0"
        style={{ perspective: '1200px' }}
        data-snap-child=""
      >
        {children}
      </motion.div>
    </section>
  );
};

const Landing: React.FC = () => {
  const { user } = useAuth();
  const { stats, bootcamps, leaderboard, marketItems, loading } = useLandingData();
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, 60]);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('hero');
  const isScrollingProgrammatically = useRef(false);
  const lastScrollTime = useRef(0);

  const leaderboardSum = leaderboard.reduce((acc, e) => acc + (extractCpBalance(e) ?? Number(e.totalXp || 0)), 0);
  const totalCp = Math.max(leaderboardSum, stats?.stats?.totalCpEarned ?? 0);

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
    <div className="relative h-[100svh] w-full bg-bg overflow-hidden">
      {/* ── Global Background ── */}
      <HeroBackground className="opacity-70" />

      {/* ── Modals ── */}
      <ServiceRequestModal />
      <PromotionalSystem />

      <div
        ref={containerRef}
        className="landing-snap relative z-10 h-[100svh] w-full overflow-y-scroll overflow-x-hidden bg-transparent md:snap-y md:snap-mandatory"
        style={{ scrollSnapType: undefined }}
      >
        {/* ── 1. Hero ── */}
        <section
          id="hero"
          className="min-h-[100svh] md:snap-start md:snap-always flex-shrink-0 box-border relative bg-transparent"
        >
          <HeroSection
            heroRef={heroRef}
            heroY={heroY}
            heroOpacity={heroOpacity}
            user={user}
            stats={stats}
            totalCp={totalCp}
          />
        </section>

        {/* 1 * Process Section */}
        <SnapSection id="process">
          <ProcessSection />
        </SnapSection>

        {/* ── 2. Partners ── NEW */}
        <SnapSection id="partners">
          <PartnersSection />
        </SnapSection>

        {/* ── 3. Bootcamps ── */}
        <SnapSection id="bootcamps">
          <BootcampsSection bootcamps={bootcamps} loading={loading} />
        </SnapSection>

        {/* ── 4. Services ── */}
        <SnapSection id="services">
          <ServicesSection />
        </SnapSection>

        {/* ── 5. ANANSI Intelligence ── */}
        <SnapSection id="anansi">
          <AnansiSection />
        </SnapSection>

        {/* ── 6. Zero-Day Market ── */}
        <SnapSection id="market">
          <EconomySection totalCp={totalCp} marketItems={marketItems} loading={loading} />
        </SnapSection>

        {/* ── 7. Leaderboard ── */}
        <SnapSection id="leaderboard">
          <LeaderboardSection leaderboard={leaderboard} totalCp={totalCp} loading={loading} />
        </SnapSection>        

        {/* ── 8. Final CTA ── */}
        <SnapSection id="cta">
          <FinalCtaSection user={user} />
        </SnapSection>

        <section
          id="footer"
          className="md:snap-start md:snap-always min-h-[100svh] flex flex-shrink-0"
        >
          <Footer />
        </section>
      </div>
    </div>
  );
};

export default Landing;