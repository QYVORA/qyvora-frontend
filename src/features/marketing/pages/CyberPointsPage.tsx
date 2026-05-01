import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Trophy, ShoppingBag, Shield, Zap, Lock } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import CpLogo from '../../../shared/components/CpLogo';
import ChainLogo from '../../../shared/components/ChainLogo';

const CyberPointsPage: React.FC = () => (
  <div className="min-h-screen bg-bg">

    {/* ── Hero ── */}
    <section className="relative min-h-[80svh] md:min-h-[75vh] w-full overflow-hidden scanlines">
      <div className="absolute inset-0 bg-bg z-0" />
      <img
        src="/assets/sections/backgrounds/cyber-points-visual.jpeg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.12] z-0 pointer-events-none"
      />
      <div className="absolute inset-0 dot-grid hero-dot-grid opacity-20 z-0" />
      <div className="absolute inset-0 bg-radial-vignette opacity-70 z-10" />

      <div className="relative z-20 min-h-[80svh] md:min-h-[75vh] max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center pt-24 pb-10 md:pt-28 md:pb-16">

        {/* Left */}
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
            className="text-text-secondary text-sm md:text-base lg:text-lg max-w-lg mb-6"
          >
            Cyber Points is HSOCIETY's skill-backed internal currency. Earn&nbsp;
            <CpLogo className="w-4 h-4 mx-0.5" /> by completing bootcamp rooms and challenges,
            then spend it in the Zero-Day Market to unlock tools and operator resources.
          </motion.p>

          {/* Chain badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }}
            className="flex items-center gap-2 mb-6 px-3 py-2 rounded-xl border border-accent/20 bg-accent/5"
          >
            <ChainLogo size={20} />
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Every CP event verified by HSOCIETY Chain</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
            className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-7"
          >
            <Link to="/bootcamps" className="btn-secondary text-sm !px-6 text-center inline-flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" /> Start Training
            </Link>
            <Link to="/zero-day-market" className="btn-primary text-sm !px-6 text-center inline-flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Open Market <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.75 }}
            className="font-mono text-[9px] md:text-[10px] text-accent tracking-tighter"
          >
            $ hsociety --module cyber_points --status active<span className="animate-blink italic">_</span>
          </motion.div>
        </div>

        {/* Right: big CP logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}
          className="hidden lg:flex relative h-[420px] xl:h-[480px] w-full items-center justify-center justify-self-center"
        >
          <div className="absolute inset-0 rounded-full bg-accent/8 blur-3xl pointer-events-none" />
          <img
            src="/assets/branding/logos/cyber-points-logo.png"
            alt="Cyber Points"
            className="w-[340px] xl:w-[400px] h-auto object-contain relative z-10 drop-shadow-[0_0_60px_var(--color-accent-glow)]"
          />
          <div className="absolute top-8 right-6 px-2 py-1 bg-bg/70 border border-accent/20 rounded text-[8px] font-mono text-accent uppercase tracking-widest">
            CP // ACTIVE
          </div>
        </motion.div>
      </div>
    </section>

    {/* ── Body ── */}
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-8">

      {/* Earn + Use — 3-col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* How to earn */}
        <ScrollReveal className="lg:col-span-2">
          <div className="card-hsociety p-6 md:p-8 h-full">
            <h2 className="text-2xl font-black text-text-primary mb-1 inline-flex items-center gap-2">
              How To Earn <CpLogo className="w-6 h-6" />
            </h2>
            <p className="text-xs text-text-muted mb-5 uppercase tracking-widest">// three core paths</p>
            <div className="space-y-3">
              {[
                { icon: BookOpen, title: 'Complete Bootcamp Rooms',   desc: 'Progress through modules and finish room tasks to earn CP.' },
                { icon: Shield,   title: 'Finish Module Challenges',  desc: 'Complete module objectives and CTF milestones for higher rewards.' },
                { icon: Trophy,   title: 'Climb the Leaderboard',     desc: 'Consistent activity and completions grow your CP rank.' },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-bg border border-border hover:border-accent/20 transition-colors">
                  <div className="w-8 h-8 rounded bg-accent-dim flex items-center justify-center flex-none mt-0.5">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{title}</p>
                    <p className="text-xs text-text-muted mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Why it matters */}
        <ScrollReveal>
          <div className="card-hsociety p-6 md:p-8 h-full">
            <h3 className="text-xl font-black text-text-primary mb-1">Why It Matters</h3>
            <p className="text-xs text-text-muted mb-5 uppercase tracking-widest">// operator economy</p>
            <div className="space-y-4">
              {[
                { icon: Zap,    title: 'Proof-of-Skill',    text: 'Not just XP — a currency backed by real demonstrated ability.' },
                { icon: Lock,   title: 'Gated Resources',   text: 'Unlocks premium zero-day tools and operator assets.' },
                { icon: Trophy, title: 'Rank & Visibility', text: 'Drives leaderboard standing and community recognition.' },
              ].map(({ icon: Icon, title, text }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-accent-dim flex items-center justify-center flex-none mt-0.5">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{title}</p>
                    <p className="text-xs text-text-muted mt-0.5">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* How to use */}
      <ScrollReveal>
        <div className="relative card-hsociety p-6 md:p-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 overflow-hidden">
          <img
            src="/assets/sections/backgrounds/cyber-points-visual.jpeg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-card via-bg-card/80 to-transparent pointer-events-none" />
          <div className="flex-1 relative z-10">
            <h3 className="text-xl md:text-2xl font-black text-text-primary mb-1 inline-flex items-center gap-2">
              How To Use <CpLogo className="w-5 h-5 md:w-6 md:h-6" />
            </h3>
            <p className="text-xs text-text-muted mb-3 uppercase tracking-widest">// zero-day market</p>
            <p className="text-sm text-text-secondary max-w-xl">
              Use earned <CpLogo className="w-4 h-4 mx-0.5" /> in the Zero-Day Market to purchase
              access to tools, resources, and operator assets. Every skill you prove translates
              directly into purchasing power.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col xl:flex-row gap-3 flex-none relative z-10">
            <Link to="/bootcamps" className="btn-secondary !py-3 text-sm inline-flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" /> Start Training
            </Link>
            <Link to="/zero-day-market" className="btn-primary !py-3 text-sm inline-flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Open Market <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Chain callout */}
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-accent/20 bg-accent/5 px-6 py-5">
          <ChainLogo size={40} />
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <p className="text-sm font-black text-text-primary">Every CP event is recorded on the HSOCIETY Chain</p>
            <p className="text-xs text-text-muted mt-0.5">A private tamper-proof ledger that makes your history verifiable.</p>
          </div>
          <Link to="/chain" className="btn-secondary text-xs !px-5 !py-2.5 shrink-0 inline-flex items-center gap-2">
            Learn about the Chain <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal>
        <div className="card-hsociety p-8 md:p-12 text-center flex flex-col items-center gap-5">
          <div className="px-3 py-1 border border-border bg-accent-dim rounded-sm mb-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">// GET STARTED</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-text-primary">
            Start Earning <CpLogo className="w-7 h-7 mx-1" /> Today
          </h3>
          <p className="text-sm text-text-secondary max-w-md">
            Create a free account, get 2,000 <CpLogo className="w-4 h-4 mx-0.5" /> on signup,
            and start building your operator profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link to="/register" className="btn-primary !px-8 !py-3 text-sm inline-flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Create Account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/leaderboard" className="btn-secondary !px-8 !py-3 text-sm inline-flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4" /> View Leaderboard
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </div>
);

export default CyberPointsPage;
