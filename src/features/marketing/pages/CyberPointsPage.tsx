import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, BookOpen, Trophy, ShoppingBag, Shield, Zap, Lock } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { CardBase } from '../../../shared/components/ui/Card';
import CpLogo from '../../../shared/components/CpLogo';
import ChainLogo from '../../../shared/components/ChainLogo';

const CyberPointsPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-bg">

      {/* ── Hero ── */}
      <section className="relative min-h-[80svh] md:min-h-[75vh] w-full overflow-hidden scanlines has-bg-image">
        <div className="absolute inset-0 bg-bg z-0 light-theme-hide-bg-base" />
        <img
          src="/assets/sections/backgrounds/cyber-points-visual.jpeg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.18] z-0 pointer-events-none"
        />
        <div className="absolute inset-0 dot-grid hero-dot-grid opacity-20 z-0" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70 z-10" />

        <div className="relative z-20 min-h-[80svh] md:min-h-[75vh] max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center pt-24 pb-10 md:pt-28 md:pb-16">
          <div className="flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="mb-5 px-3 py-1 border border-border bg-accent-dim rounded-sm"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">// CYBER POINTS</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary leading-[1.1] mb-5 flex flex-wrap items-center gap-3"
            >
              What Is <CpLogo className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16" /> ?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }}
              className="text-text-secondary text-sm md:text-base lg:text-lg max-w-lg mb-8"
            >
              Cyber Points is HSOCIETY's skill-backed internal currency. Earn <CpLogo className="w-4 h-4 mx-0.5" /> by
              completing bootcamp rooms and CTF challenges, then spend it in the Zero-Day Market.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
              className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <Link to="/bootcamps" className="btn-secondary text-sm !px-6 text-center inline-flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4" /> Start Training
              </Link>
              <Link to="/zero-day-market" className="btn-primary text-sm !px-6 text-center inline-flex items-center justify-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Open Market <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex relative h-[420px] xl:h-[480px] w-full items-center justify-center"
          >
            <div className="absolute inset-0 rounded-full bg-accent/8 blur-3xl pointer-events-none" />
            <motion.img
              src="/assets/branding/logos/cyber-points-logo.png"
              alt="Cyber Points"
              className="w-[340px] xl:w-[400px] h-auto object-contain relative z-10 drop-shadow-[0_0_80px_var(--color-accent-glow)]"
              animate={shouldReduceMotion ? {} : { y: [0, -22, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </section>

      {/* ── Cards ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <ScrollReveal>
            <CardBase className="p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-accent" />
              </div>
              <p className="text-sm font-black text-text-primary">Complete Bootcamp Rooms</p>
              <p className="text-xs text-text-muted leading-relaxed">Finish room tasks in any module to earn CP instantly.</p>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <CardBase className="p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center">
                <Shield className="w-4 h-4 text-accent" />
              </div>
              <p className="text-sm font-black text-text-primary">Capture CTF Flags</p>
              <p className="text-xs text-text-muted leading-relaxed">Submit correct flags for immediate CP rewards.</p>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <CardBase className="p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center">
                <Trophy className="w-4 h-4 text-accent" />
              </div>
              <p className="text-sm font-black text-text-primary">Climb the Leaderboard</p>
              <p className="text-xs text-text-muted leading-relaxed">Consistent activity and completions grow your rank.</p>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <CardBase className="p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center">
                <Zap className="w-4 h-4 text-accent" />
              </div>
              <p className="text-sm font-black text-text-primary">Proof-of-Skill</p>
              <p className="text-xs text-text-muted leading-relaxed">A currency backed by real demonstrated ability, not just time spent.</p>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <CardBase className="p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center">
                <Lock className="w-4 h-4 text-accent" />
              </div>
              <p className="text-sm font-black text-text-primary">Gated Resources</p>
              <p className="text-xs text-text-muted leading-relaxed">Unlocks premium zero-day tools and operator assets in the market.</p>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <CardBase className="p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center">
                <ChainLogo size={18} />
              </div>
              <p className="text-sm font-black text-text-primary">Chain-Verified</p>
              <p className="text-xs text-text-muted leading-relaxed">Every CP event is recorded on the HSOCIETY Chain — tamper-proof.</p>
            </CardBase>
          </ScrollReveal>

        </div>

        {/* CTA row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <ScrollReveal>
            <CardBase className="p-6 flex flex-col sm:flex-row items-center gap-4">
              <ShoppingBag className="w-8 h-8 text-accent shrink-0" />
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <p className="text-sm font-black text-text-primary mb-0.5">Zero-Day Market</p>
                <p className="text-xs text-text-muted">Spend your CP on tools and operator assets.</p>
              </div>
              <Link to="/zero-day-market" className="btn-primary text-xs !px-5 !py-2.5 shrink-0 inline-flex items-center gap-1.5">
                Open Market <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <CardBase className="p-6 flex flex-col sm:flex-row items-center gap-4">
              <Trophy className="w-8 h-8 text-accent shrink-0" />
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <p className="text-sm font-black text-text-primary mb-0.5">Start Earning Today</p>
                <p className="text-xs text-text-muted">Create a free account and begin training.</p>
              </div>
              <Link to="/register" className="btn-primary text-xs !px-5 !py-2.5 shrink-0 inline-flex items-center gap-1.5">
                Sign Up <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardBase>
          </ScrollReveal>
        </div>
      </div>

    </div>
  );
};

export default CyberPointsPage;
