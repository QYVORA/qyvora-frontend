import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight, BookOpen, Trophy, ShoppingBag,
  Zap, Lock, Shield, CheckCircle2, Link2,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import ChainLogo from '../../../shared/components/ChainLogo';
import CpLogo from '../../../shared/components/CpLogo';

const ChainPage: React.FC = () => (
  <div className="min-h-screen bg-bg">

    {/* ── Hero ── */}
    <section className="relative min-h-[85svh] md:min-h-[80vh] w-full overflow-hidden scanlines">
      <div className="absolute inset-0 bg-bg z-0" />
      {/* CP visual as subtle background — same as CyberPointsPage */}
      <img
        src="/images/cp-images/cp-visual.jpeg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.10] z-0 pointer-events-none"
      />
      <div className="absolute inset-0 dot-grid hero-dot-grid opacity-20 z-0" />
      <div className="absolute inset-0 bg-radial-vignette opacity-70 z-10" />

      <div className="relative z-20 min-h-[85svh] md:min-h-[80vh] max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-24 pb-10 md:pt-28 md:pb-16">

        {/* Left */}
        <div className="flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="mb-5 px-3 py-1 border border-border bg-accent-dim rounded-sm"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">// CYBER POINTS · HSOCIETY CHAIN</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary leading-[1.1] mb-5"
          >
            Earn <CpLogo className="w-10 h-10 md:w-12 md:h-12 inline-block align-middle mx-1" /><br />
            <span className="text-accent">Verified on-chain</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }}
            className="text-text-secondary text-sm md:text-base lg:text-lg max-w-lg mb-6"
          >
            Cyber Points is HSOCIETY's skill-backed internal currency. Earn&nbsp;
            <CpLogo className="w-4 h-4 mx-0.5" /> by completing bootcamp rooms and challenges,
            spend it in the Zero-Day Market — and every transaction is recorded on the
            <span className="text-accent font-bold"> HSOCIETY Chain</span>, a private
            tamper-proof ledger that makes your history verifiable.
          </motion.p>

          {/* Chain badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }}
            className="flex items-center gap-2 mb-7 px-3 py-2 rounded-xl border border-accent/20 bg-accent/5"
          >
            <ChainLogo size={20} />
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Every CP event recorded on HSOCIETY Chain</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}
            className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-7"
          >
            <Link to="/register" className="btn-primary text-sm !px-6 text-center inline-flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Start Earning <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/zero-day-market" className="btn-secondary text-sm !px-6 text-center inline-flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Open Market
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.75 }}
            className="font-mono text-[9px] md:text-[10px] text-accent tracking-tighter"
          >
            $ hsociety --cp chain-verified --status active<span className="animate-blink italic">_</span>
          </motion.div>
        </div>

        {/* Right: floating CP logo + chain badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}
          className="hidden lg:flex relative h-[460px] xl:h-[500px] w-full items-center justify-center"
        >
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-accent/8 blur-3xl pointer-events-none" />

          {/* Chain logo — main visual */}
          <ChainLogo size={220} className="relative z-10 drop-shadow-[0_0_60px_rgba(136,173,124,0.35)]" />

          {/* CP coin badge — floating bottom-right */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-16 right-8 z-20 flex items-center gap-2 rounded-2xl border border-accent/30 bg-bg-card/90 backdrop-blur-sm px-4 py-3 shadow-xl"
          >
            <img
              src="/images/cp-images/CYBER_POINTS_LOGO.png"
              alt="CP"
              className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(183,255,153,0.4)]"
            />
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-text-muted">Cyber Points</div>
              <div className="text-xs font-black text-accent font-mono">Chain-verified</div>
            </div>
          </motion.div>

          {/* Status badge — top right */}
          <div className="absolute top-10 right-6 px-2.5 py-1.5 bg-bg/80 border border-accent/20 rounded-lg text-[8px] font-mono text-accent uppercase tracking-widest backdrop-blur-sm">
            ● Operational
          </div>
        </motion.div>
      </div>
    </section>

    {/* ── Body ── */}
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-8">

      {/* What CP is */}
      <ScrollReveal>
        <div className="rounded-3xl border-2 border-accent/20 bg-accent/5 p-6 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 min-w-0">
              <div className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-accent">// What is CP?</div>
              <h2 className="text-2xl md:text-3xl font-black text-text-primary mb-4">
                Skill-backed. Chain-verified. Not crypto.
              </h2>
              <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-4">
                Cyber Points is HSOCIETY's internal skill currency — not a cryptocurrency.
                It has no market price and can't be traded. You earn it by demonstrating real
                offensive security skills, and every CP event is permanently recorded on the
                HSOCIETY Chain so your history can't be faked.
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                The HSOCIETY Chain is a private <strong className="text-text-primary">Proof-of-Authority ledger</strong>.
                Its job is to make your learning history tamper-proof — not to create a token.
                Share your record with anyone to prove you earned your rank legitimately.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-none w-full md:w-56">
              {[
                { icon: CheckCircle2, label: 'Earned by skill',       sub: 'Not bought or traded' },
                { icon: Link2,        label: 'Chain-verified',         sub: 'Every event is a block' },
                { icon: Shield,       label: 'Tamper-proof',           sub: 'Private PoA ledger' },
                { icon: Lock,         label: 'Not a cryptocurrency',   sub: 'No wallet, no market price' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-border bg-bg-card px-4 py-3">
                  <Icon className="h-4 w-4 text-accent shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-text-primary">{label}</div>
                    <div className="text-[10px] text-text-muted">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

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
                { icon: BookOpen, title: 'Complete Bootcamp Rooms',    desc: 'Finish room tasks to earn CP — each completion is chain-recorded.' },
                { icon: Shield,   title: 'Finish Module Challenges',   desc: 'Complete module objectives and CTF milestones for higher rewards.' },
                { icon: Trophy,   title: 'Climb the Leaderboard',      desc: 'Consistent activity grows your CP rank — backed by your chain history.' },
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
                { icon: Zap,    title: 'Proof-of-Skill',    text: 'A currency backed by real demonstrated ability, verified on-chain.' },
                { icon: Lock,   title: 'Gated Resources',   text: 'Unlocks premium zero-day tools and operator assets in the market.' },
                { icon: Trophy, title: 'Rank & Visibility', text: 'Your leaderboard rank is computed from chain-verified CP.' },
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

      {/* What gets recorded on the chain */}
      <ScrollReveal>
        <div className="relative overflow-hidden rounded-3xl border-2 border-accent/25 bg-bg-card p-6 md:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/8 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-none">
              <ChainLogo size={60} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-accent">// HSOCIETY CHAIN</div>
              <h3 className="text-xl md:text-2xl font-black text-text-primary mb-3">
                Every CP event, permanently recorded
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-5">
                When you earn CP, the HSOCIETY Chain writes an immutable record — linked to every
                previous record in a tamper-proof chain. If anyone alters a record, the chain
                detects it instantly. Your history is yours, and it can't be taken away or inflated.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Room Completed',    color: 'text-accent border-accent/30 bg-accent/10' },
                  { label: 'Module Completed',  color: 'text-blue-400 border-blue-400/30 bg-blue-400/10' },
                  { label: 'CP Reward',         color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' },
                  { label: 'Certification',     color: 'text-purple-400 border-purple-400/30 bg-purple-400/10' },
                ].map(({ label, color }) => (
                  <div key={label} className={`rounded-xl border px-3 py-2 text-center text-[10px] font-black uppercase tracking-widest ${color}`}>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* How to use CP */}
      <ScrollReveal>
        <div className="relative card-hsociety p-6 md:p-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 overflow-hidden">
          <img
            src="/images/cp-images/cp-visual.jpeg"
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
              Spend earned <CpLogo className="w-4 h-4 mx-0.5" /> in the Zero-Day Market to unlock
              tools, resources, and operator assets. Every skill you prove translates directly
              into purchasing power — and your wallet history is backed by chain records.
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
            and start building your chain-verified operator profile.
          </p>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-accent/20 bg-accent/5">
            <ChainLogo size={18} />
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Every CP event recorded on HSOCIETY Chain</span>
          </div>
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

export default ChainPage;
