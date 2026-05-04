import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useScroll, useTransform, motion, useReducedMotion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useLandingData } from '../hooks/useLandingData';
import HeroSection from '../components/landing/HeroSection';
import BootcampsSection from '../components/landing/BootcampsSection';
import EconomySection from '../components/landing/EconomySection';
import CyberPointsCtaSection from '../components/landing/CyberPointsCtaSection';
import LeaderboardSection from '../components/landing/LeaderboardSection';
import ServicesSection from '../components/landing/ServicesSection';
import SocialSection from '../components/landing/SocialSection';
import FinalCtaSection from '../components/landing/FinalCtaSection';
import Footer from '../components/layout/Footer';

// ── Section registry for dot-nav ─────────────────────────────────────────────
const SECTIONS = [
  { id: 'hero',        label: 'Home'            },
  { id: 'market',      label: 'Zero-Day Market' },
  { id: 'bootcamps',   label: 'Bootcamps'       },
  { id: 'cp',          label: 'Cyber Points'    },
  { id: 'leaderboard', label: 'Leaderboard'     },
  { id: 'services',    label: 'Services'        },
  { id: 'social',      label: 'Community'       },
  { id: 'cta',         label: 'Get Started'     },
  { id: 'footer',      label: 'Footer'          },
];

// ── Dot nav ───────────────────────────────────────────────────────────────────
const DotNav: React.FC<{ active: number; total: number; onDotClick: (i: number) => void }> = ({
  active, total, onDotClick,
}) => (
  <nav
    aria-label="Page sections"
    className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3"
  >
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        onClick={() => onDotClick(i)}
        aria-label={SECTIONS[i]?.label ?? `Section ${i + 1}`}
        title={SECTIONS[i]?.label ?? `Section ${i + 1}`}
        className={`w-2 h-2 rounded-full border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          i === active
            ? 'bg-accent border-accent scale-125'
            : 'bg-transparent border-border hover:border-accent/60'
        }`}
      />
    ))}
  </nav>
);

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
  return (
    <section
      id={id}
      // Mobile: normal block, no snap, no fixed height, no overflow clipping
      // md+: snap-start, h-full fills the snap container, overflow-hidden clips
      className={`md:snap-start md:h-full md:flex-shrink-0 md:overflow-hidden flex flex-col justify-center ${className}`}
    >
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 40, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.45 } }}
        className="w-full"
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
  const [activeSection, setActiveSection] = useState(0);
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

  // Track active section via IntersectionObserver on the snap container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const sectionEls = SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!sectionEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionEls.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActiveSection(idx);
          }
        });
      },
      { root: container, threshold: 0.5 },
    );
    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
      <DotNav active={activeSection} total={SECTIONS.length} onDotClick={scrollToSection} />

      {/* ── 1. Hero — full viewport, no wrapper needed ── */}
      <section
        id="hero"
        className="md:snap-start md:h-full md:flex-shrink-0 md:overflow-hidden relative"
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
        {/* Scroll hint */}
        <motion.button
          onClick={() => scrollToSection(1)}
          aria-label="Scroll to next section"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1 text-text-muted hover:text-accent transition-colors"
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.25em]">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </section>

      {/* ── 2. Zero-Day Market ── */}
      <SnapSection id="market" className="bg-bg">
        <EconomySection totalCp={totalCp} marketItems={marketItems} loading={loading} />
      </SnapSection>

      {/* ── 3. Bootcamps ── */}
      <SnapSection id="bootcamps" className="bg-bg-card">
        <BootcampsSection bootcamps={bootcamps} loading={loading} />
      </SnapSection>

      {/* ── 4. Cyber Points ── */}
      <SnapSection id="cp" className="bg-bg">
        <CyberPointsCtaSection totalCp={totalCp} />
      </SnapSection>

      {/* ── 5. Leaderboard ── */}
      <SnapSection id="leaderboard" className="bg-bg-card">
        <LeaderboardSection leaderboard={leaderboard} totalCp={totalCp} loading={loading} />
      </SnapSection>

      {/* ── 6. Services ── */}
      <SnapSection id="services" className="bg-bg">
        <ServicesSection />
      </SnapSection>

      {/* ── 7. Social ── */}
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
        className="md:snap-start md:h-full md:flex-shrink-0 overflow-hidden flex flex-col justify-end"
      >
        <Footer />
      </section>
    </div>
  );
};

export default Landing;
