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
import { extractCpBalance } from '../../../shared/utils/cpBalance';

// ── Section registry for dot-nav ─────────────────────────────────────────────
const SECTIONS = [
  { id: 'hero',        label: 'Home'            },
  { id: 'bootcamps',   label: 'Bootcamps'       },
  { id: 'market',      label: 'Zero-Day Market' },
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
      className={`relative md:snap-start md:snap-always md:h-full md:flex-shrink-0 md:overflow-hidden md:box-border bg-transparent ${className}`}
    >
      <motion.div
        initial={minimizeEffects ? false : { opacity: 0, y: 30, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.1 }}
        transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:h-full relative z-10"
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

  const leaderboardSum = leaderboard.reduce((acc, e) => acc + (extractCpBalance(e) ?? Number(e.totalXp || 0)), 0);
  const totalCp = Math.max(leaderboardSum, stats?.stats?.totalCpEarned ?? 0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const scrollToSection = useCallback((index: number) => {
    const container = containerRef.current;
    const el = document.getElementById(SECTIONS[index]?.id ?? '');
    if (container && el) container.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  }, []);

  return (
    <div className="relative h-[100svh] w-full bg-bg overflow-hidden">
      {/* ── Global Background ── */}
      <HeroBackground className="opacity-70" />

      <div
        ref={containerRef}
        className="landing-snap relative z-10 h-[100svh] w-full overflow-y-scroll overflow-x-hidden bg-transparent no-scrollbar md:mt-[72px] md:h-[calc(100svh-72px)] md:snap-y md:snap-mandatory"
        style={{ scrollSnapType: undefined }}
      >
        {/* ── 1. Hero ── */}
        <section
          id="hero"
          className="md:snap-start md:snap-always md:h-full md:flex-shrink-0 md:box-border relative bg-transparent"
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

        {/* ── 2. Bootcamps ── */}
        <SnapSection id="bootcamps" className="">
          <BootcampsSection bootcamps={bootcamps} loading={loading} />
        </SnapSection>

       {/* ── 3. Zero-Day Market ── */}
       <SnapSection id="market" className="">
         <EconomySection totalCp={totalCp} marketItems={marketItems} loading={loading} />
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
        className="md:snap-start md:snap-always md:h-full md:flex md:flex-shrink-0"
      >
        <Footer />
      </section>
      </div>
    </div>
  );
};

export default Landing;
