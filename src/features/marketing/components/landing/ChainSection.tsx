import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Hash, Shield, Link2 } from 'lucide-react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import ChainLogo from '../../../../shared/components/ChainLogo';
import CpLogo from '../../../../shared/components/CpLogo';

const CHAIN_FACTS = [
  { icon: Link2,         label: 'Immutable blocks',    desc: 'Every CP event is a SHA-256 hashed block, chained to the previous one.' },
  { icon: Shield,        label: 'Proof-of-Authority',  desc: 'Single trusted validator — no mining, no gas fees, no public exposure.' },
  { icon: Hash,          label: 'Tamper-proof',        desc: 'If any record is altered, the hash chain breaks and the check catches it.' },
  { icon: CheckCircle2,  label: 'Verifiable history',  desc: 'Share a block hash to prove your rank and CP were earned legitimately.' },
];

const ChainSection: React.FC = () => (
  <section className="py-16 md:py-24 bg-bg border-t border-border relative overflow-hidden">
    {/* Background texture */}
    <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
    <div className="pointer-events-none absolute -left-32 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />

    <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">

        {/* Left — text */}
        <div>
          <ScrollReveal>
            <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// HSOCIETY CHAIN</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-text-primary leading-[1.1] mb-5">
              Your CP is<br />
              <span className="text-accent">chain-verified</span>
            </h2>
            <p className="text-text-secondary text-sm md:text-base mb-8 max-w-lg leading-relaxed">
              Every time you earn <CpLogo className="w-4 h-4 mx-0.5" />, the HSOCIETY Chain writes an
              immutable block to a private Proof-of-Authority ledger. Your rank, your progress,
              your history — tamper-proof and independently verifiable.
            </p>
          </ScrollReveal>

          <ScrollReveal className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {CHAIN_FACTS.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 rounded-xl border border-border bg-bg-card p-4 hover:border-accent/30 transition-colors">
                <Icon className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-text-primary mb-0.5">{label}</div>
                  <div className="text-[11px] text-text-muted leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </ScrollReveal>

          <ScrollReveal className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/chain"
              className="btn-primary text-sm !px-7 inline-flex items-center justify-center gap-2"
            >
              Explore the Chain <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/cyber-points"
              className="btn-secondary text-sm !px-7 inline-flex items-center justify-center gap-2"
            >
              <CpLogo className="w-4 h-4" /> Learn About CP
            </Link>
          </ScrollReveal>
        </div>

        {/* Right — chain logo + block visualisation */}
        <ScrollReveal className="flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-2">
            <ChainLogo size={52} showLabel labelClassName="text-sm" />
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Proof-of-Authority · SHA-256</span>
              <span className="text-[9px] font-mono text-accent uppercase tracking-widest flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                Operational
              </span>
            </div>
          </div>

          {/* Visual chain blocks */}
          {[
            { index: 41, type: 'ROOM_COMPLETED',   cp: 250,  hash: 'b7ff99a3c2…', prev: '4e1a8f02d9…' },
            { index: 42, type: 'CP_REWARD',         cp: 250,  hash: '9c4d2e7b1a…', prev: 'b7ff99a3c2…' },
            { index: 43, type: 'MODULE_COMPLETED',  cp: 750,  hash: '1f8a3c9e4d…', prev: '9c4d2e7b1a…' },
          ].map((block, i) => (
            <div
              key={block.index}
              className="rounded-2xl border-2 border-border bg-bg-card overflow-hidden"
              style={{ opacity: 1 - i * 0.08 }}
            >
              <div className="flex items-center gap-3 border-b border-border px-4 py-2.5 bg-accent/5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-accent/30 bg-accent-dim font-mono text-[10px] font-black text-accent">
                  #{block.index}
                </div>
                <span className={`rounded-lg border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                  block.type === 'ROOM_COMPLETED'   ? 'border-accent/30 bg-accent/10 text-accent' :
                  block.type === 'CP_REWARD'        ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400' :
                                                      'border-blue-400/30 bg-blue-400/10 text-blue-400'
                }`}>
                  {block.type.replace(/_/g, ' ')}
                </span>
                <span className="ml-auto font-mono text-xs font-black text-accent inline-flex items-center gap-1">
                  +{block.cp} <CpLogo className="w-3 h-3" />
                </span>
              </div>
              <div className="px-4 py-2.5 space-y-1 font-mono text-[10px]">
                <div className="flex gap-2">
                  <span className="text-text-muted w-16 shrink-0">hash</span>
                  <span className="text-accent">{block.hash}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-text-muted w-16 shrink-0">prevHash</span>
                  <span className="text-text-muted">{block.prev}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="text-center text-[10px] font-mono text-text-muted uppercase tracking-widest">
            ↑ live blocks from HSOCIETY CHAIN
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

export default ChainSection;
