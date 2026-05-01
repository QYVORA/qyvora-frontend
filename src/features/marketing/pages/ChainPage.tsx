import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Trophy, Zap, Shield, Database, Eye, GitBranch } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import ChainLogo from '../../../shared/components/ChainLogo';
import CpLogo from '../../../shared/components/CpLogo';

const ChainPage: React.FC = () => (
  <div className="min-h-screen bg-bg">

    {/* ── Hero ── */}
    <section className="relative min-h-[80svh] md:min-h-[75vh] w-full overflow-hidden scanlines">
      <div className="absolute inset-0 bg-bg z-0" />
      {/* Chain visuals background */}
      <img
        src="/assets/branding/chain/hsociety-chain-logo-visuals.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.07] z-0 pointer-events-none"
      />
      <div className="absolute inset-0 dot-grid hero-dot-grid opacity-15 z-0" />
      <div className="absolute inset-0 bg-radial-vignette opacity-75 z-10" />

      <div className="relative z-20 min-h-[80svh] md:min-h-[75vh] max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-24 pb-10 md:pt-28 md:pb-16">

        {/* Left */}
        <div className="flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="mb-5 px-3 py-1 border border-border bg-accent-dim rounded-sm"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">// HSOCIETY CHAIN</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary leading-[1.1] mb-5"
          >
            The <span className="text-accent">HSOCIETY</span><br />Chain
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="text-text-secondary text-sm md:text-base lg:text-lg max-w-lg mb-7"
          >
            A private Proof-of-Authority ledger that permanently records every skill event —
            room completions, module finishes, and <CpLogo className="w-4 h-4 mx-0.5" /> rewards.
            Your operator history, tamper-proof and verifiable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }}
            className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-7"
          >
            <Link to="/register" className="btn-primary text-sm !px-6 text-center inline-flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Build Your Record <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/cyber-points" className="btn-secondary text-sm !px-6 text-center inline-flex items-center justify-center gap-2">
              <CpLogo className="w-4 h-4" /> What Are Cyber Points?
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.65 }}
            className="font-mono text-[9px] md:text-[10px] text-accent tracking-tighter"
          >
            $ hsociety-chain --status operational --consensus proof-of-authority<span className="animate-blink italic">_</span>
          </motion.div>
        </div>

        {/* Right: 3D chain logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}
          className="hidden lg:flex relative h-[520px] xl:h-[560px] w-full items-center justify-center"
        >
          <div className="absolute inset-0 rounded-full bg-accent/8 blur-3xl pointer-events-none" />
          <ChainLogo
            variant="3d"
            size={510}
            className="relative z-10 drop-shadow-[0_0_100px_rgba(136,173,124,0.35)]"
          />
          <div className="absolute top-8 right-6 px-2.5 py-1.5 bg-bg/80 border border-accent/20 rounded-lg text-[8px] font-mono text-accent uppercase tracking-widest backdrop-blur-sm">
            ● Operational
          </div>
        </motion.div>
      </div>
    </section>

    {/* ── Body ── */}
    <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-14 space-y-6">
      {/* Subtle visuals watermark behind body content */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <img
          src="/assets/branding/chain/hsociety-chain-logo-visuals.png"
          alt=""
          aria-hidden="true"
          className="absolute top-0 right-0 w-[600px] max-w-[60vw] opacity-[0.04] object-contain"
        />
      </div>

      {/* How it works — 3 steps */}
      <ScrollReveal>
        <div className="card-hsociety p-6 md:p-8">
          <div className="mb-1 text-[10px] font-black uppercase tracking-[0.3em] text-accent">// How It Works</div>
          <h2 className="text-xl md:text-2xl font-black text-text-primary mb-6">Three steps, permanent record</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: GitBranch, title: 'Skill event triggered', desc: 'Complete a room, module, or earn CP.' },
              { icon: Database,  title: 'Block created',         desc: 'Hashed and linked to the previous block.' },
              { icon: Eye,       title: 'Record verifiable',     desc: 'Anyone can verify your history is real.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-bg border border-border">
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

      {/* What gets recorded + Why it matters — 2-col */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* What gets recorded */}
        <ScrollReveal>
          <div className="card-hsociety p-6 h-full">
            <div className="mb-1 text-[10px] font-black uppercase tracking-[0.3em] text-accent">// On-chain events</div>
            <h3 className="text-lg font-black text-text-primary mb-4">What gets recorded</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Room Completed',   color: 'text-accent border-accent/30 bg-accent/10' },
                { label: 'Module Completed', color: 'text-blue-400 border-blue-400/30 bg-blue-400/10' },
                { label: 'CP Reward',        color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' },
                { label: 'Activity Log',     color: 'text-text-muted border-border bg-bg' },
              ].map(({ label, color }) => (
                <div key={label} className={`rounded-xl border px-3 py-3 text-center text-[10px] font-black uppercase tracking-widest ${color}`}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Why it matters */}
        <ScrollReveal>
          <div className="card-hsociety p-6 h-full">
            <div className="mb-1 text-[10px] font-black uppercase tracking-[0.3em] text-accent">// Why it matters</div>
            <h3 className="text-lg font-black text-text-primary mb-4">Verifiable skill</h3>
            <div className="space-y-3">
              {[
                { icon: Shield,  title: 'Proof-of-Skill',     text: 'Cryptographic proof, not just a dashboard score.' },
                { icon: Eye,     title: 'Shareable history',  text: 'Show employers your chain record to prove your work.' },
                { icon: Trophy,  title: 'Rank integrity',     text: 'Leaderboard positions computed from chain-verified CP.' },
              ].map(({ icon: Icon, title, text }, i) => (
                <div key={i} className="flex items-start gap-3">
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
          </div>
        </ScrollReveal>
      </div>

      {/* CP callout */}
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-accent/20 bg-accent/5 px-5 py-4">
          <CpLogo className="w-9 h-9 shrink-0" />
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <p className="text-sm font-black text-text-primary">Cyber Points are the currency recorded on the chain</p>
            <p className="text-xs text-text-muted mt-0.5">Every CP earn and spend event is a block.</p>
          </div>
          <Link to="/cyber-points" className="btn-secondary text-xs !px-5 !py-2.5 shrink-0 inline-flex items-center gap-2">
            Learn about CP <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal>
        <div className="card-hsociety p-7 md:p-10 text-center flex flex-col items-center gap-4">
          <ChainLogo variant="3d" size={122} className="drop-shadow-[0_0_40px_rgba(136,173,124,0.35)]" />
          <h3 className="text-xl md:text-2xl font-black text-text-primary">
            Start Building Your Chain Record
          </h3>
          <p className="text-sm text-text-secondary max-w-sm">
            Every skill you prove gets permanently recorded — a verifiable history that belongs to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-1">
            <Link to="/register" className="btn-primary !px-7 !py-3 text-sm inline-flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Create Account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/leaderboard" className="btn-secondary !px-7 !py-3 text-sm inline-flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4" /> View Leaderboard
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </div>
);

export default ChainPage;
