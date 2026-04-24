import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Trophy, ShoppingBag, Shield, Zap, Lock } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import CpLogo from '../../../shared/components/CpLogo';

const CyberPointsPage: React.FC = () => (
  <div className="min-h-screen bg-bg">

    {/* ── Hero ── */}
    <section className="relative min-h-[80svh] md:min-h-[75vh] w-full overflow-hidden scanlines">
      <div className="absolute inset-0 bg-bg z-0" />
      <div className="absolute inset-0 dot-grid hero-dot-grid opacity-30 z-0" />
      <div className="absolute inset-0 bg-radial-vignette opacity-60 z-10" />

      {/* Two-column grid — matches HeroSection pattern */}
      <div className="relative z-20 min-h-[80svh] md:min-h-[75vh] max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center pt-24 pb-10 md:pt-28 md:pb-16">

        {/* Left: text */}
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
            Cyber Points is the operational value system inside HSOCIETY. Earn&nbsp;
            <CpLogo className="w-4 h-4 mx-0.5" /> by learning and proving skills, then spend&nbsp;
            <CpLogo className="w-4 h-4 mx-0.5" /> in the Zero-Day Market to unlock resources.
          </motion.p>

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
            className="font-mono text-[9px] md:text-[10px] text-accent tracking-tighter w-full max-w-lg overflow-hidden whitespace-normal break-words md:whitespace-nowrap"
          >
            $ hsociety --module cyber_points --status active<span className="animate-blink italic">_</span>
          </motion.div>
        </div>

        {/* Right: big CP logo — hidden on mobile, shown on desktop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}
          className="hidden lg:flex relative h-[420px] xl:h-[480px] w-full items-center justify-center justify-self-center"
        >
          <div className="absolute inset-0 rounded-full bg-accent/8 blur-3xl pointer-events-none" />
          <img
            src="/images/cp-images/CYBER_POINTS_LOGO.png"
            alt="Cyber Points"
            className="w-[340px] xl:w-[400px] h-auto object-contain relative z-10 drop-shadow-[0_0_60px_rgba(183,255,153,0.3)]"
          />
          <div className="absolute top-8 right-6 px-2 py-1 bg-bg/70 border border-accent/20 rounded text-[8px] font-mono text-accent uppercase tracking-widest">
            CP // ACTIVE
          </div>
        </motion.div>
      </div>
    </section>

    {/* ── Body ── */}
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-8">

      {/* Earn + Use — 3-col on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* How to earn — takes 2 cols */}
        <ScrollReveal className="lg:col-span-2">
          <div className="card-hsociety p-6 md:p-8 h-full">
            <h2 className="text-2xl font-black text-text-primary mb-1 inline-flex items-center gap-2">
              How To Earn <CpLogo className="w-6 h-6" />
            </h2>
            <p className="text-xs text-text-muted mb-5 uppercase tracking-widest">// three core paths</p>
            <div className="space-y-3">
              {[
                {
                  icon: BookOpen,
                  title: 'Complete Bootcamp Rooms',
                  desc: 'Progress through modules and finish room tasks to earn',
                  showLogo: true,
                  tail: '.',
                },
                {
                  icon: Shield,
                  title: 'Finish Module Challenges',
                  desc: 'Complete module objectives and CTF milestones for higher rewards.',
                  showLogo: false,
                  tail: '',
                },
                {
                  icon: Trophy,
                  title: 'Climb the Leaderboard',
                  desc: 'Consistent activity and completions grow your',
                  showLogo: true,
                  tail: ' rank visibility.',
                },
              ].map(({ icon: Icon, title, desc, showLogo, tail }, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-bg border border-border hover:border-accent/20 transition-colors">
                  <div className="w-8 h-8 rounded bg-accent-dim flex items-center justify-center flex-none mt-0.5">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{title}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {desc} {showLogo && <CpLogo className="w-3.5 h-3.5 mx-0.5" />}{tail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Why it matters — 1 col */}
        <ScrollReveal>
          <div className="card-hsociety p-6 md:p-8 h-full">
            <h3 className="text-xl font-black text-text-primary mb-1">Why It Matters</h3>
            <p className="text-xs text-text-muted mb-5 uppercase tracking-widest">// operator economy</p>
            <div className="space-y-4">
              {[
                { icon: Zap, title: 'Proof-of-Skill', text: 'Not just XP — a currency backed by real demonstrated ability.' },
                { icon: Lock, title: 'Gated Resources', text: 'Unlocks premium zero-day tools and operator assets.' },
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

      {/* How to use — full width banner */}
      <ScrollReveal>
        <div className="card-hsociety p-6 md:p-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-black text-text-primary mb-1 inline-flex items-center gap-2">
              How To Use <CpLogo className="w-5 h-5 md:w-6 md:h-6" />
            </h3>
            <p className="text-xs text-text-muted mb-3 uppercase tracking-widest">// zero-day market</p>
            <p className="text-sm text-text-secondary max-w-xl">
              Use earned <CpLogo className="w-4 h-4 mx-0.5" /> in the Zero-Day Market to purchase access to tools,
              resources, and operator assets. Every skill you prove translates directly into purchasing power.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col xl:flex-row gap-3 flex-none">
            <Link to="/bootcamps" className="btn-secondary !py-3 text-sm inline-flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" /> Start Training
            </Link>
            <Link to="/zero-day-market" className="btn-primary !py-3 text-sm inline-flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Open Market <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </div>
);

export default CyberPointsPage;
