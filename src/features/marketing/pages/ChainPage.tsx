import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Trophy, Zap, Shield, Database, Eye, GitBranch } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { CardBase } from '../../../shared/components/ui/Card';
import ChainLogo from '../../../shared/components/ChainLogo';
import CpLogo from '../../../shared/components/CpLogo';

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
              <motion.div animate={shouldReduceMotion ? {} : { y: [0, -18, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                <ChainLogo variant="3d" size={220} className="relative z-10 drop-shadow-[0_0_60px_rgba(136,173,124,0.45)]" />
              </motion.div>
            </motion.div>
          </div>

          {/* Desktop 3D logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex relative h-[560px] xl:h-[620px] w-full items-center justify-center"
          >
            <div className="absolute inset-0 rounded-full bg-accent/8 blur-3xl pointer-events-none" />
            <motion.div animate={shouldReduceMotion ? {} : { y: [0, -24, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }} className="relative z-10">
              <ChainLogo variant="3d" size={580} className="drop-shadow-[0_0_120px_rgba(136,173,124,0.4)]" />
            </motion.div>
            <div className="absolute top-8 right-6 px-2.5 py-1.5 bg-bg/80 border border-accent/20 rounded-lg text-[8px] font-mono text-accent uppercase tracking-widest backdrop-blur-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Operational
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Cards ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <ScrollReveal>
            <CardBase className="p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center">
                <GitBranch className="w-4 h-4 text-accent" />
              </div>
              <p className="text-sm font-black text-text-primary">Skill Event Triggered</p>
              <p className="text-xs text-text-muted leading-relaxed">Complete a room, module, or earn CP — a new block is created.</p>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <CardBase className="p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center">
                <Database className="w-4 h-4 text-accent" />
              </div>
              <p className="text-sm font-black text-text-primary">Block Created</p>
              <p className="text-xs text-text-muted leading-relaxed">Hashed and linked to the previous block — immutable by design.</p>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <CardBase className="p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center">
                <Eye className="w-4 h-4 text-accent" />
              </div>
              <p className="text-sm font-black text-text-primary">Record Verifiable</p>
              <p className="text-xs text-text-muted leading-relaxed">Anyone can verify your history is real — cryptographic proof, not a dashboard score.</p>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <CardBase className="p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center">
                <span className="text-[10px] font-black text-accent font-mono">RC</span>
              </div>
              <p className="text-sm font-black text-text-primary">Room Completed</p>
              <p className="text-xs text-text-muted leading-relaxed">Every room you finish is recorded as a permanent on-chain event.</p>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <CardBase className="p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center">
                <CpLogo className="w-4 h-4" />
              </div>
              <p className="text-sm font-black text-text-primary">CP Reward</p>
              <p className="text-xs text-text-muted leading-relaxed">Every Cyber Points earn and spend event is a block on the chain.</p>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <CardBase className="p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-dim flex items-center justify-center">
                <Shield className="w-4 h-4 text-accent" />
              </div>
              <p className="text-sm font-black text-text-primary">Shareable History</p>
              <p className="text-xs text-text-muted leading-relaxed">Show employers your chain record to prove your skills are real.</p>
            </CardBase>
          </ScrollReveal>

        </div>

        {/* CTA row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <ScrollReveal>
            <CardBase className="p-6 flex flex-col sm:flex-row items-center gap-4">
              <CpLogo className="w-8 h-8 shrink-0" />
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <p className="text-sm font-black text-text-primary mb-0.5">Cyber Points on the Chain</p>
                <p className="text-xs text-text-muted">Every CP event is a block. Learn how CP works.</p>
              </div>
              <Link to="/cyber-points" className="btn-secondary text-xs !px-5 !py-2.5 shrink-0 inline-flex items-center gap-1.5">
                Learn CP <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardBase>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <CardBase className="p-6 flex flex-col sm:flex-row items-center gap-4">
              <Trophy className="w-8 h-8 text-accent shrink-0" />
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <p className="text-sm font-black text-text-primary mb-0.5">Start Building Your Record</p>
                <p className="text-xs text-text-muted">Every skill you prove gets permanently recorded.</p>
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

export default ChainPage;
