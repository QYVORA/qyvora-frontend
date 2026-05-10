import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useScroll, useTransform, motion, useReducedMotion } from 'motion/react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useLandingData } from '../hooks/useLandingData';
import HeroSection from '../components/landing/HeroSection';
import BootcampsSection from '../components/landing/BootcampsSection';
import EconomySection from '../components/landing/EconomySection';
import LeaderboardSection from '../components/landing/LeaderboardSection';
import SocialSection from '../components/landing/SocialSection';
import FinalCtaSection from '../components/landing/FinalCtaSection';
import Footer from '../components/layout/Footer';
import { useAdaptiveUi } from '../../../core/hooks/useAdaptiveUi';

// ── Section registry for dot-nav ─────────────────────────────────────────────
const SECTIONS = [
  { id: 'hero',        label: 'Home'            },
  { id: 'market',      label: 'Zero-Day Market' },
  { id: 'bootcamps',   label: 'Bootcamps'       },
  { id: 'leaderboard', label: 'Leaderboard'     },
  { id: 'social',      label: 'Community'       },
  { id: 'cta',         label: 'Get Started'     },
  { id: 'footer',      label: 'Footer'          },
];

// ── Dot nav — removed ────────────────────────────────────────────────────────
// (previously a fixed right-side dot indicator; removed per design update)

// ── Snap section ──────────────────────────────────────────────────────────────
// Each section fills the full container height (h-full) and clips its content.
// Content animates in when the section snaps into view.
// The inner scale wrapper reduces vertical padding so content fits the viewport.
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
      // Mobile: normal block, no snap, no fixed height
      // md+: snap-start, h-full of the snap container (h-screen),
      //      pt-[72px] from CSS clears the fixed navbar,
      //      overflow-hidden clips anything that escapes
      className={`md:snap-start md:h-full md:flex-shrink-0 md:overflow-hidden ${className}`}
    >
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

// ─────────────────────────────────────────────────────────────────────────────
const Landing: React.FC = () => {
  const { user } = useAuth();
  const { stats, bootcamps, leaderboard, marketItems, loading } = useLandingData();
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, 60]);
  const [terminalText, setTerminalText] = useState('');
  const fullText = '[ SYSTEM ONLINE ] // OFFENSIVE SECURITY | AFRICA // BOOTCAMPS + SERVICES + COMMUNITY';

  useEffect(() => {
    let i = 0;
    let resetting = false;
    const iv = setInterval(() => {
      if (resetting) return;
      i++;
      setTerminalText(fullText.substring(0, i));
      if (i >= fullText.length) {
        resetting = true;
        setTimeout(() => { i = 0; resetting = false; }, 2000);
      }
    }, 50);
    return () => clearInterval(iv);
  }, []);

  const totalCp = leaderboard.reduce((acc, e) => acc + Number(e.totalXp || 0), 0);

  const scrollToSection = useCallback((index: number) => {
    const container = containerRef.current;
    const el = document.getElementById(SECTIONS[index]?.id ?? '');
    if (container && el) container.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  }, []);

  return (
    // The snap container:
    // - Mobile (< md): normal scroll, no snap — content stacks naturally
    // - Tablet/Desktop (md+): viewport-locked snap scroll
    <div
      ref={containerRef}
      className="landing-snap h-screen w-full overflow-y-scroll overflow-x-hidden md:snap-y md:snap-mandatory"
      style={{ scrollSnapType: undefined }}
    >
      {/* ── 1. Hero — full viewport, no wrapper needed ── */}
      <section
        id="hero"
        className="md:snap-start md:h-full md:flex-shrink-0 relative"
      >
        <HeroSection
          heroRef={heroRef}
          heroY={heroY}
          heroOpacity={heroOpacity}
          terminalText={terminalText}
          user={user}
          stats={stats}
          totalCp={totalCp}
        />
      </section>

      {/* ── 2. Zero-Day Market ── */}
      <SnapSection id="market" className="bg-bg">
        <EconomySection totalCp={totalCp} marketItems={marketItems} loading={loading} />
      </SnapSection>

{/* ── 3. Bootcamps ── */}
       <SnapSection id="bootcamps" className="bg-bg-card">
         <BootcampsSection bootcamps={bootcamps} loading={loading} />
       </SnapSection>

       {/* ── 4. Leaderboard ── */}
        <SnapSection id="leaderboard" className="bg-bg-card">
          <LeaderboardSection leaderboard={leaderboard} totalCp={totalCp} loading={loading} />
        </SnapSection>

        {/* ── 5. Social ── */}
      <SnapSection id="social" className="bg-bg">
        <SocialSection />
      </SnapSection>

      {/* ── 8. Final CTA ── */}
      <SnapSection id="cta" className="bg-bg">
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
