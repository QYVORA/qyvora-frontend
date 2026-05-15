import React, { useRef, useCallback } from 'react';
import { useScroll, useTransform, motion, useReducedMotion } from 'motion/react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useLandingData } from '../hooks/useLandingData';
import HeroSection from '../components/landing/HeroSection';
import BootcampsSection from '../components/landing/BootcampsSection';
import EconomySection from '../components/landing/EconomySection';
import LeaderboardSection from '../components/landing/LeaderboardSection';
import FinalCtaSection from '../components/landing/FinalCtaSection';
import Footer from '../components/layout/Footer';
import { useAdaptiveUi } from '../../../core/hooks/useAdaptiveUi';
import HeroBackground from '../components/HeroBackground';

// ── Section registry for dot-nav ─────────────────────────────────────────────
const SECTIONS = [
  { id: 'hero',        label: 'Home'            },
  { id: 'market',      label: 'Zero-Day Market' },
  { id: 'bootcamps',   label: 'Bootcamps'       },
  { id: 'leaderboard', label: 'Leaderboard'     },
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
  const { constrainedDevice } = useAdaptiveUi();
  const minimizeEffects = shouldReduceMotion || constrainedDevice;
  return (
    <section
      id={id}
      className={`ascii-section md:snap-start md:h-full md:flex-shrink-0 md:overflow-hidden ${className}`}
    >
      <HeroBackground className="opacity-40" />
      <motion.div
        initial={minimizeEffects ? false : { opacity: 0, y: 40, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.15 }}
        transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.7, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.45 } }}
        className="w-full md:h-full"
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

  const totalCp = leaderboard.reduce((acc, e) => acc + Number(e.totalXp || 0), 0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const scrollToSection = useCallback((index: number) => {
    const container = containerRef.current;
    const el = document.getElementById(SECTIONS[index]?.id ?? '');
    if (container && el) container.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  }, []);

  return (
    <div
      ref={containerRef}
      className="landing-snap h-screen w-full overflow-y-scroll overflow-x-hidden md:snap-y md:snap-mandatory"
      style={{ scrollSnapType: undefined }}
    >
      {/* ── 1. Hero ── */}
      <section
        id="hero"
        className="md:snap-start md:h-full md:flex-shrink-0 relative"
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

       {/* ── 2. Zero-Day Market ── */}
       <SnapSection id="market" className="">
         <EconomySection totalCp={totalCp} marketItems={marketItems} loading={loading} />
       </SnapSection>

       {/* ── 3. Bootcamps ── */}
        <SnapSection id="bootcamps" className="">
          <BootcampsSection bootcamps={bootcamps} loading={loading} />
        </SnapSection>

         {/* ── 4. Leaderboard ── */}
         <SnapSection id="leaderboard" className="">
           <LeaderboardSection leaderboard={leaderboard} totalCp={totalCp} loading={loading} />
         </SnapSection>

         {/* ── 5. Final CTA ── */}
         <SnapSection id="cta" className="">
           <FinalCtaSection user={user} />
         </SnapSection>
      {/* ── 9. Footer ── */}
      <section
        id="footer"
        className="md:snap-start md:h-full md:flex-shrink-0"
      >
        <Footer />
      </section>
    </div>
  );
};

export default Landing;
