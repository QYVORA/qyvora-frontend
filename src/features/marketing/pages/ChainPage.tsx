import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Trophy, Zap, Shield, Database, Eye, GitBranch } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { CardBase } from '../../../shared/components/ui/Card';
import ChainLogo from '../../../shared/components/ChainLogo';
import CpLogo from '../../../shared/components/CpLogo';

const HOW_STEPS = [
  { icon: GitBranch, title: 'Skill event triggered', desc: 'Complete a room, module, or earn CP.' },
  { icon: Database,  title: 'Block created',         desc: 'Hashed and linked to the previous block.' },
  { icon: Eye,       title: 'Record verifiable',     desc: 'Anyone can verify your history is real.' },
];

const ON_CHAIN = [
  { label: 'Room Completed',   color: 'text-accent border-accent/30 bg-accent/10' },
  { label: 'Module Completed', color: 'text-blue-400 border-blue-400/30 bg-blue-400/10' },
  { label: 'CP Reward',        color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' },
  { label: 'Activity Log',     color: 'text-text-muted border-border bg-bg' },
];

const WHY_ITEMS = [
  { icon: Shield,  title: 'Proof-of-Skill',    text: 'Cryptographic proof, not just a dashboard score.' },
  { icon: Eye,     title: 'Shareable history', text: 'Show employers your chain record to prove your work.' },
  { icon: Trophy,  title: 'Rank integrity',    text: 'Leaderboard positions computed from chain-verified CP.' },
];

const ChainPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-bg">

      {/* ── Hero ── */}
      <section className="relative min-h-[85svh] md:min-h-[80vh] w-full overflow-hidden scanlines has-bg-image">
        <div className="absolute inset-0 bg-bg z-0 light-theme-hide-bg-base" />
        <img
          src="/assets/branding/chain/hsociety-chain-logo-visuals.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.12] z-0 pointer-events-none"
        />
        <div className="absolute inset-0 dot-grid hero-dot-grid opacity-15 z-0" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/6 blur-[120px] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-radial-vignette opacity-75 z-10" />

        <div className="relative z-20 min-h-[85svh] md:min-h-[80vh] max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-24 pb-10 md:pt-28 md:pb-16">
          <div className="flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5 px-3 py-1 border border-border bg-accent-dim rounded-sm"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">// HSOCIETY CHAIN</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary leading-[1.1] mb-5"
            >
              The <span className="text-accent">HSOCIETY</span><br />Chain
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="text-text-secondary text-sm md:text-base lg:text-lg max-w-lg mb-8"
            >
              A private Proof-of-Authority ledger that permanently records every skill event —
              room completions, module finishes, and <CpLogo className="w-4 h-4 mx-0.5" /> rewards.
              Your operator history, tamper-proof and verifiable.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <Link to="/register" className="btn-primary text-sm !px-6 text-center inline-flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" /> Build Your Record <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/cyber-points" className="btn-secondary text-sm !px-6 text-center inline-flex items-center justify-center gap-2">
                <CpLogo className="w-4 h-4" /> What Are Cyber Points?
              </Link>
            </motion.div>

            {/* Mobile chain logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="lg:hidden mt-10 flex justify-center w-full"
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
                <motion.div
                  animate={shouldReduceMotion ? {} : { y: [0, -18, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ChainLogo variant="3d" size={220} className="relative z-10 drop-shadow-[0_0_60px_rgba(136,173,124,0.45)]" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Right: 3D chain logo — desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex relative h-[560px] xl:h-[620px] w-full items-center justify-center"
          >
            <div className="absolute inset-0 rounded-full bg-accent/8 blur-3xl pointer-events-none" />
            <motion.div
              animate={shouldReduceMotion ? {} : { scale: [1, 1.06, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-[580px] h-[580px] rounded-full border border-accent/20 pointer-events-none"
            />
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, -24, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10"
            >
              <ChainLogo variant="3d" size={580} className="drop-shadow-[0_0_120px_rgba(136,173,124,0.4)]" />
            </motion.div>
            <div className="absolute top-8 right-6 px-2.5 py-1.5 bg-bg/80 border border-accent/20 rounded-lg text-[8px] font-mono text-accent uppercase tracking-widest backdrop-blur-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Operational
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 space-y-5">

        {/* How it works */}
        <ScrollReveal>
          <CardBase className="p-6 md:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-1">// How It Works</p>
            <h2 className="text-xl font-black text-text-primary mb-6">Three steps, permanent record</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {HOW_STEPS.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <CardBase className="flex items-start gap-3 p-4 h-full">
                    <div className="w-8 h-8 rounded bg-accent-dim flex items-center justify-center flex-none mt-0.5">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">{title}</p>
                      <p className="text-xs text-text-muted mt-0.5">{desc}</p>
                    </div>
                  </CardBase>
                </motion.div>
              ))}
            </div>
          </CardBase>
        </ScrollReveal>

        {/* What gets recorded + Why it matters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ScrollReveal>
            <CardBase className="p-6 h-full">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-1">// On-chain events</p>
              <h3 className="text-lg font-black text-text-primary mb-4">What gets recorded</h3>
              <div className="grid grid-cols-2 gap-2">
                {ON_CHAIN.map(({ label, color }) => (
                  <div key={label} className={`rounded-lg border px-3 py-3 text-center text-[10px] font-black uppercase tracking-widest ${color}`}>
                    {label}
                  </div>
                ))}
              </div>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal>
            <CardBase className="p-6 h-full">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-1">// Why it matters</p>
              <h3 className="text-lg font-black text-text-primary mb-4">Verifiable skill</h3>
              <div className="space-y-3">
                {WHY_ITEMS.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded bg-accent-dim flex items-center justify-center flex-none mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">{title}</p>
                      <p className="text-xs text-text-muted mt-0.5">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBase>
          </ScrollReveal>
        </div>

        {/* CP callout */}
        <ScrollReveal>
          <CardBase className="flex flex-col sm:flex-row items-center gap-4 px-6 py-5">
            <CpLogo className="w-9 h-9 shrink-0" />
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <p className="text-sm font-black text-text-primary">Cyber Points are the currency recorded on the chain</p>
              <p className="text-xs text-text-muted mt-0.5">Every CP earn and spend event is a block.</p>
            </div>
            <Link to="/cyber-points" className="btn-secondary text-xs !px-5 !py-2.5 shrink-0 inline-flex items-center gap-2">
              Learn about CP <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardBase>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal>
          <CardBase className="p-7 md:p-10 text-center flex flex-col items-center gap-4">
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, -12, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChainLogo variant="3d" size={120} className="drop-shadow-[0_0_50px_rgba(136,173,124,0.4)]" />
            </motion.div>
            <h3 className="text-xl md:text-2xl font-black text-text-primary">
              Start Building Your Chain Record
            </h3>
            <p className="text-sm text-text-secondary max-w-sm">
              Every skill you prove gets permanently recorded — a verifiable history that belongs to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/register" className="btn-primary !px-7 !py-3 text-sm inline-flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" /> Create Account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/leaderboard" className="btn-secondary !px-7 !py-3 text-sm inline-flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4" /> View Leaderboard
              </Link>
            </div>
          </CardBase>
        </ScrollReveal>

      </div>
    </div>
  );
};

export default ChainPage;
