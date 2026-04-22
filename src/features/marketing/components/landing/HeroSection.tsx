import React from 'react';
import { motion, type MotionValue } from 'motion/react';
import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import HeroCanvas from '../HeroCanvas';
import HackerGlobe from '../HackerGlobe';
import StatCounter from '../../../../shared/components/ui/StatCounter';
import { SITE_CONFIG } from '../../content/siteConfig';
import type { BackendStats } from './types';

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLDivElement | null>;
  heroY: MotionValue<number>;
  heroOpacity: MotionValue<number>;
  terminalText: string;
  user: { isAdmin?: boolean } | null;
  stats: BackendStats | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  heroRef,
  heroY,
  heroOpacity,
  terminalText,
  user,
  stats,
}) => {
  const heroStats = [
    { label: 'Trained Operators', value: stats?.stats?.studentsCount ?? stats?.stats?.learnersTrained ?? 0, suffix: '+' },
    { label: 'Bootcamps Live', value: stats?.stats?.bootcampsCount ?? 0, suffix: '' },
    { label: 'Zero-Day Products', value: stats?.stats?.zeroDayProductsCount ?? 0, suffix: '+' },
    { label: 'Validated Findings', value: stats?.stats?.vulnerabilitiesIdentified ?? 0, suffix: '' },
  ];

  return (
    <section ref={heroRef} className="relative min-h-[92svh] md:min-h-screen w-full overflow-hidden scanlines">
      <div className="absolute inset-0 bg-bg z-0" />
      <div className="absolute inset-0 dot-grid hero-dot-grid opacity-30 z-0" />
      <HeroCanvas />
      <div className="absolute inset-0 bg-radial-vignette opacity-60 z-10" />
      <motion.div style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-30 min-h-[92svh] md:min-h-screen max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center pt-24 md:pt-24 pb-10 md:pb-36">
        <div className="flex flex-col items-start">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="mb-5 px-3 py-1 border border-border bg-accent-dim rounded-sm">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">AFRICA'S OFFENSIVE SECURITY PLATFORM</span>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary leading-[1.1] mb-5">
            <motion.span className="inline-block">
              {'Train Like a Hacker.'.split(' ').map((w, i) => (
                <motion.span key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }} className="inline-block mr-2 md:mr-3">{w}</motion.span>
              ))}
            </motion.span>
            <br />
            <motion.span className="inline-block">
              {'Become a Hacker.'.split(' ').map((w, i) => (
                <motion.span key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }} className="inline-block mr-2 md:mr-3">{w}</motion.span>
              ))}
            </motion.span>
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.2 }}
            className="text-text-secondary text-sm md:text-base lg:text-lg max-w-lg mb-7">
            {SITE_CONFIG.brand.description}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.5 }}
            className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-7 md:mb-8">
            {user ? (
              <Link to="/dashboard" className="btn-primary flex items-center justify-center gap-2 !px-6 text-sm"><LayoutDashboard className="w-4 h-4" /> Dashboard</Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-sm !px-6 text-center">Start Training</Link>
                <Link to="/login" className="btn-secondary text-sm !px-6 text-center">Log In</Link>
              </>
            )}
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.8 }}
            className="font-mono text-[9px] md:text-[10px] text-accent tracking-tighter w-full max-w-lg overflow-hidden whitespace-nowrap md:whitespace-nowrap">
            {terminalText}<span className="animate-blink italic">_</span>
          </motion.div>

          {/* Mobile stats */}
          <div className="grid grid-cols-2 gap-3 mt-6 md:hidden w-full">
            {heroStats.map((s, i) => (
              <div key={i} className="rounded-lg border border-border bg-bg/70 backdrop-blur-sm px-3 py-3">
                <div className="text-xl font-bold text-accent font-mono leading-none">
                  <StatCounter end={s.value} suffix={s.suffix} />
                </div>
                <div className="text-[9px] uppercase tracking-widest text-text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.4 }}
          className="hidden lg:flex relative h-[430px] xl:h-[480px] max-w-[520px] w-full items-center justify-center justify-self-center">
          <div className="absolute inset-0 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
          <div className="w-full h-full"><HackerGlobe scale={0.95} /></div>
          <div className="absolute top-8 right-6 px-2 py-1 bg-bg/70 border border-accent/20 rounded text-[8px] font-mono text-accent uppercase tracking-widest">SAT-02 // ORBIT</div>
        </motion.div>
      </motion.div>
      <div className="absolute bottom-0 left-0 w-full border-t border-border bg-bg/60 backdrop-blur-sm z-30 py-4 md:py-5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {heroStats.map((s, i) => (
            <div key={i} className="flex flex-col">
              <div className="text-xl md:text-2xl lg:text-3xl font-bold text-accent font-mono"><StatCounter end={s.value} suffix={s.suffix} /></div>
              <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
