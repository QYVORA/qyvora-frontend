import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight, BookOpen, Trophy, ShoppingBag, Shield,
  Zap, Lock, Hash, CheckCircle2, Link2,
} from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import CpLogo from '../../../shared/components/CpLogo';
import ChainLogo from '../../../shared/components/ChainLogo';

// ── What CP is NOT (honest positioning) ──────────────────────────────────────
// CP is not a cryptocurrency. It has no market value, no wallet address,
// no token standard. It is a skill-backed internal currency verified by
// the HSOCIETY Chain — a private Proof-of-Authority ledger.

const CyberPointsPage: React.FC = () => (
  <div className="min-h-screen bg-bg">

    {/* ── Hero ── */}
    <section className="relative min-h-[80svh] md:min-h-[75vh] w-full overflow-hidden scanlines">
      <div className="absolute inset-0 bg-bg z-0" />
      <img
        src="/images/cp-images/cp-visual.jpeg"
        alt=""
        aria-hidden="true"
        className="section-bg-img absolute inset-0 w-full h-full object-cover opacity-[0.12] z-0 pointer-events-none"
      />
      <div className="absolute inset-0 dot-grid hero-dot-grid opacity-20 z-0" />
      <div className="absolute inset-0 bg-radial-vignette opacity-70 z-10" />

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
            className="text-text-secondary text-sm md:text-base lg:text-lg max-w-lg mb-6"
          >
            Cyber Points is the skill-backed internal currency of HSOCIETY. Earn&nbsp;
            <CpLogo className="w-4 h-4 mx-0.5" /> by proving real skills, spend&nbsp;
            <CpLogo className="w-4 h-4 mx-0.5" /> in the Zero-Day Market — and every transaction
            is recorded on the <span className="text-accent font-bold">HSOCIETY Chain</span>, a private
            Proof-of-Authority ledger that makes your history tamper-proof.
          </motion.p>

          {/* Chain badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }}
            className="flex items-center gap-2 mb-6 px-3 py-2 rounded-xl border border-accent/20 bg-accent/5"
          >
            <ChainLogo size={22} />
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Verified by HSOCIETY Chain</span>
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
            className="font-mono text-[9px] md:text-[10px] text-accent tracking-tighter w-full max-w-lg overflow-hidden whitespace-normal break-words md:whitespace-nowrap"
          >
            $ hsociety --module cyber_points --chain verified --status active<span className="animate-blink italic">_</span>
          </motion.div>
        </div>

        {/* Right: CP logo + chain badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}
          className="hidden lg:flex relative h-[420px] xl:h-[480px] w-full items-center justify-center justify-self-center"
        >
          <div className="absolute inset-0 rounded-full bg-accent/8 blur-3xl pointer-events-none" />
          <img
            src="/images/cp-images/CYBER_POINTS_LOGO.png"
            alt="Cyber Points"
            className="w-[300px] xl:w-[340px] h-auto object-contain relative z-10 drop-shadow-[0_0_60px_rgba(183,255,153,0.3)]"
          />
          {/* Chain logo overlay */}
          <div className="absolute bottom-12 right-8 flex flex-col items-end gap-2 z-20">
            <ChainLogo size={48} showLabel labelClassName="text-[10px]" />
            <div className="text-[9px] font-mono text-text-muted uppercase tracking-widest">PoA Ledger · Tamper-Proof</div>
          </div>
          <div className="absolute top-8 right-6 px-2 py-1 bg-bg/70 border border-accent/20 rounded text-[8px] font-mono text-accent uppercase tracking-widest">
            CP // CHAIN VERIFIED
          </div>
        </motion.div>
      </div>
    </section>

    {/* ── Body ── */}
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-8">

      {/* What CP actually is — honest explainer */}
      <ScrollReveal>
        <div className="rounded-3xl border-2 border-accent/20 bg-accent/5 p-6 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 min-w-0">
              <div className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-accent">// What CP actually is</div>
              <h2 className="text-2xl md:text-3xl font-black text-text-primary mb-4">
                Skill-backed. Chain-verified. Not crypto.
              </h2>
              <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-4">
                CP is not a cryptocurrency. It has no market price, no wallet address, and no token standard.
                It's a <strong className="text-text-primary">platform-internal skill currency</strong> — you earn it
                by demonstrating real offensive security skills, and every CP event is recorded as an immutable
                block on the HSOCIETY Chain.
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                The chain is a private <strong className="text-text-primary">Proof-of-Authority ledger</strong> — not
                a public blockchain. Its job is to make your learning history tamper-proof and independently
                verifiable. Share a block hash with anyone to prove you earned your rank legitimately.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-none w-full md:w-64">
              {[
                { icon: CheckCircle2, label: 'Earned by skill', sub: 'Not bought or traded' },
                { icon: Link2,        label: 'Chain-verified',  sub: 'Every event is a block' },
                { icon: Hash,         label: 'Tamper-proof',    sub: 'SHA-256 hash chain' },
                { icon: Shield,       label: 'Private PoA',     sub: 'Not a public blockchain' },
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
                  tail: '. Each completion writes a verified block to the chain.',
                },
                {
                  icon: Shield,
                  title: 'Finish Module Challenges',
                  desc: 'Complete module objectives and CTF milestones for higher rewards. Module completions are chain-recorded.',
                  showLogo: false,
                  tail: '',
                },
                {
                  icon: Trophy,
                  title: 'Climb the Leaderboard',
                  desc: 'Consistent activity and completions grow your',
                  showLogo: true,
                  tail: ' rank — backed by your verifiable chain history.',
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
                { icon: Zap,    title: 'Proof-of-Skill',   text: 'Not just XP — a currency backed by real demonstrated ability, verified on-chain.' },
                { icon: Lock,   title: 'Gated Resources',  text: 'Unlocks premium zero-day tools and operator assets in the market.' },
                { icon: Trophy, title: 'Rank & Visibility', text: 'Drives leaderboard standing. Your rank is computed from chain-verified CP.' },
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

      {/* HSOCIETY Chain explainer banner */}
      <ScrollReveal>
        <div className="relative overflow-hidden rounded-3xl border-2 border-accent/25 bg-bg-card p-6 md:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/8 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 left-0 h-40 w-40 rounded-full bg-accent/5 blur-2xl" />

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-none">
              <ChainLogo size={64} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-accent">// HSOCIETY CHAIN</div>
              <h3 className="text-xl md:text-2xl font-black text-text-primary mb-3">
                The ledger behind every CP event
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                Every time you earn CP — completing a room, passing a quiz, finishing a module — the backend
                writes an immutable block to the HSOCIETY Chain. Each block contains a SHA-256 hash linked
                to the previous block. If anyone tampers with a record, the hash chain breaks and the
                integrity check catches it instantly.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Block type', value: 'ROOM_COMPLETED' },
                  { label: 'Consensus',  value: 'Proof-of-Authority' },
                  { label: 'Hash algo',  value: 'SHA-256' },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl border border-border bg-bg px-4 py-3">
                    <div className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-0.5">{label}</div>
                    <div className="font-mono text-xs font-bold text-accent">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* How to use — full width banner */}
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
              Use earned <CpLogo className="w-4 h-4 mx-0.5" /> in the Zero-Day Market to purchase access to tools,
              resources, and operator assets. Every skill you prove translates directly into purchasing power —
              and your wallet history is backed by chain records you can verify.
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
            Create a free account, get 2,000 <CpLogo className="w-4 h-4 mx-0.5" /> on signup, and start building
            your chain-verified operator profile.
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

export default CyberPointsPage;
