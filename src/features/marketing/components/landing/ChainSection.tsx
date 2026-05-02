import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Link2, Hash } from 'lucide-react';
import { motion } from 'motion/react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import ChainLogo from '../../../../shared/components/ChainLogo';
import CpLogo from '../../../../shared/components/CpLogo';

const CHAIN_FACTS = [
  { icon: Link2,   label: 'Immutable blocks',   desc: 'Every CP event is a SHA-256 hashed block, chained to the previous one.' },
  { icon: Shield,  label: 'Proof-of-Authority', desc: 'Single trusted validator — no mining, no gas fees, no public exposure.' },
  { icon: Hash,    label: 'Tamper-proof',        desc: 'Alter any record and the hash chain breaks instantly.' },
];

const ChainSection: React.FC = () => (
  <section className="py-14 md:py-20 bg-bg border-t border-border relative overflow-hidden">
    <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
    {/* Chain visuals background */}
    <img
      src="/assets/branding/chain/hsociety-chain-logo-visuals.png"
      alt=""
      aria-hidden="true"
      className="absolute right-0 top-1/2 -translate-y-1/2 h-full max-h-[600px] w-auto opacity-[0.06] object-contain pointer-events-none"
    />
    <div className="pointer-events-none absolute -left-32 top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />

    <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center">

        {/* Left — text */}
        <div>
          <ScrollReveal>
            <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// HSOCIETY CHAIN</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-text-primary leading-[1.1] mb-4">
              Your CP is<br />
              <span className="text-accent">chain-verified</span>
            </h2>
            <p className="text-text-secondary text-sm md:text-base mb-7 max-w-md leading-relaxed">
              Every time you earn <CpLogo className="w-4 h-4 mx-0.5" />, the HSOCIETY Chain writes an
              immutable block to a private ledger. Your rank, your progress, your history —
              tamper-proof and independently verifiable.
            </p>
          </ScrollReveal>

          <ScrollReveal className="flex flex-col gap-3 mb-7">
            {CHAIN_FACTS.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.3 } }}
                className="flex items-start gap-3 rounded-xl border border-border bg-bg-card p-3.5 hover:border-accent/30 transition-colors"
              >
                <Icon className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-text-primary mb-0.5">{label}</div>
                  <div className="text-[11px] text-text-muted leading-relaxed">{desc}</div>
                </div>
              </motion.div>
            ))}
          </ScrollReveal>

          <ScrollReveal className="flex flex-col sm:flex-row gap-3">
            <Link to="/chain" className="btn-primary text-sm !px-7 inline-flex items-center justify-center gap-2">
              Explore the Chain <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/cyber-points" className="btn-secondary text-sm !px-7 inline-flex items-center justify-center gap-2">
              <CpLogo className="w-4 h-4" /> Learn About CP
            </Link>
          </ScrollReveal>
        </div>

        {/* Right — 3D chain logo + 2 sample blocks */}
        <ScrollReveal className="flex flex-col gap-4">
          {/* 3D logo */}
          <div className="flex items-center gap-4 mb-1">
            <ChainLogo variant="3d" size={110} className="drop-shadow-[0_0_30px_rgba(136,173,124,0.35)]" />
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Proof-of-Authority · SHA-256</span>
              <span className="text-[9px] font-mono text-accent uppercase tracking-widest flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                Operational
              </span>
            </div>
          </div>

          {/* Terminal panel illustration */}
          <div className="relative flex justify-center mb-2">
            <img
              src="/assets/illustrations/hero-terminal-panel.png"
              alt=""
              aria-hidden="true"
              className="w-full max-w-[280px] sm:max-w-[320px] h-auto object-contain opacity-90 drop-shadow-[0_0_32px_var(--color-accent-glow)]"
            />
          </div>

          {/* 2 sample blocks */}
          {[
            { index: 41, type: 'ROOM_COMPLETED',  cp: 250, hash: 'b7ff99a3c2…', prev: '4e1a8f02d9…' },
            { index: 42, type: 'CP_REWARD',        cp: 250, hash: '9c4d2e7b1a…', prev: 'b7ff99a3c2…' },
          ].map((block, i) => (
            <div
              key={block.index}
              className="rounded-2xl border-2 border-border bg-bg-card overflow-hidden"
              style={{ opacity: 1 - i * 0.1 }}
            >
              <div className="flex items-center gap-3 border-b border-border px-4 py-2.5 bg-accent/5">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-accent/30 bg-accent-dim font-mono text-[9px] font-black text-accent">
                  #{block.index}
                </div>
                <span className={`rounded-lg border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                  block.type === 'ROOM_COMPLETED'
                    ? 'border-accent/30 bg-accent/10 text-accent'
                    : 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400'
                }`}>
                  {block.type.replace(/_/g, ' ')}
                </span>
                <span className="ml-auto font-mono text-xs font-black text-accent inline-flex items-center gap-1">
                  +{block.cp} <CpLogo className="w-3 h-3" />
                </span>
              </div>
              <div className="px-4 py-2.5 space-y-1 font-mono text-[10px]">
                <div className="flex gap-2">
                  <span className="text-text-muted w-14 shrink-0">hash</span>
                  <span className="text-accent">{block.hash}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-text-muted w-14 shrink-0">prevHash</span>
                  <span className="text-text-muted">{block.prev}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="text-center text-[10px] font-mono text-text-muted uppercase tracking-widest opacity-60">
            ↑ sample blocks from HSOCIETY CHAIN
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

export default ChainSection;
