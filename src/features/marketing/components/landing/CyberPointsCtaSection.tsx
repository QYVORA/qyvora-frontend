import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, BookOpen, ShoppingBag, Trophy, Zap } from 'lucide-react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import CpLogo from '../../../../shared/components/CpLogo';

interface CyberPointsCtaSectionProps {
  totalCp: number;
}

const EARN_PATHS = [
  { icon: BookOpen,    label: 'Complete Bootcamp Rooms'   },
  { icon: Zap,         label: 'Finish Module Challenges'  },
  { icon: Trophy,      label: 'Climb the Leaderboard'     },
  { icon: ShoppingBag, label: 'Spend in Zero-Day Market'  },
];

const CyberPointsCtaSection: React.FC<CyberPointsCtaSectionProps> = ({ totalCp }) => {
  // Fix #14: respect prefers-reduced-motion
  const shouldReduceMotion = useReducedMotion();

  return (
    // Fix #23: border-t separates this from the preceding bg-bg EconomySection
    <section className="py-16 md:py-24 bg-bg border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
      <img
        src="/images/cp-images/cp-visual.jpeg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none"
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* Left — CP logo */}
          <ScrollReveal className="flex items-center justify-center order-2 lg:order-1">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-accent/8 blur-3xl pointer-events-none scale-110" />
              {/* Fix #14: no animation when prefers-reduced-motion is set */}
              <motion.img
                src="/images/cp-images/CYBER_POINTS_LOGO.png"
                alt="Cyber Points"
                className="w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 object-contain relative z-10 drop-shadow-[0_0_60px_rgba(183,255,153,0.25)]"
                animate={shouldReduceMotion ? {} : { y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute bottom-4 right-0 lg:right-4 px-3 py-2 bg-bg/80 border border-accent/20 rounded-lg backdrop-blur-sm">
                <div className="text-[9px] uppercase tracking-widest text-text-muted mb-0.5">Community Pool</div>
                <div className="text-lg font-bold text-accent font-mono inline-flex items-center gap-1.5">
                  {totalCp.toLocaleString()} <CpLogo className="w-4 h-4" />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right — text + earn paths + CTA */}
          <div className="order-1 lg:order-2 flex flex-col items-start">
            <ScrollReveal>
              <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// CYBER POINTS</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-text-primary leading-[1.1] mb-4">
                The Currency of<br />Skill &amp; Access
              </h2>
              <p className="text-text-secondary text-sm md:text-base mb-8 max-w-lg leading-relaxed">
                Cyber Points (<CpLogo className="w-4 h-4 mx-0.5" />) is HSOCIETY's proof-of-skill currency.
                Earn it by training, spend it in the Zero-Day Market to unlock tools and operator resources.
              </p>
            </ScrollReveal>

            <ScrollReveal className="w-full mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EARN_PATHS.map(({ icon: Icon, label }, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-bg-card border border-border hover:border-accent/20 transition-colors">
                    <div className="w-8 h-8 rounded bg-accent-dim flex items-center justify-center flex-none">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-sm text-text-primary font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link to="/cyber-points" className="btn-primary text-sm !px-7 inline-flex items-center justify-center gap-2">
                Learn Cyber Points <ArrowRight className="w-4 h-4" />
              </Link>
              {/* Fix #13: public visitors go to /register, not the auth-gated /bootcamps */}
              <Link to="/register" className="btn-secondary text-sm !px-7 inline-flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4" /> Start Earning
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CyberPointsCtaSection;
