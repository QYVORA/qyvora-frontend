import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Link2, Hash } from 'lucide-react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import ChainLogo from '../../../../shared/components/ChainLogo';
import CpLogo from '../../../../shared/components/CpLogo';
import HeroBackground from '../HeroBackground';
import AsciiHeading from '../../../../shared/components/ui/AsciiHeading';

const CHAIN_FACTS = [
  { icon: Link2,   label: 'Immutable blocks',   desc: 'Every CP event is a SHA-256 hashed block, chained to the previous one.' },
  { icon: Shield,  label: 'Proof-of-Authority', desc: 'Single trusted validator — no mining, no gas fees, no public exposure.' },
  { icon: Hash,    label: 'Tamper-proof',        desc: 'Alter any record and the hash chain breaks instantly.' },
];

const ChainSection: React.FC = () => (
  <section className="ascii-section py-14 md:py-20 bg-bg border-t border-border relative overflow-hidden">
    <HeroBackground className="opacity-40" />
    <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
    <img
      src="/assets/branding/chain/hsociety-chain-logo-visuals.webp"
      alt=""
      aria-hidden="true"
      className="absolute right-0 top-1/2 -translate-y-1/2 h-full max-h-[600px] w-auto opacity-[0.06] object-contain pointer-events-none"
    />
    <div className="pointer-events-none absolute -left-32 top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />

    <div className="max-w-7xl mx-auto px-2 md:px-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center px-2 md:px-0">
        <div>
          <AsciiHeading text="HSOCIETY Chain" font="Larry 3D" align="left" animated className="mb-8" />
          <ScrollReveal>
            <p className="text-text-secondary text-base md:text-lg mb-8 leading-relaxed max-w-lg">
              Every room completion and <CpLogo className="w-4 h-4 mx-0.5 inline-block align-middle" /> reward is 
              permanently etched into our private PoA blockchain. Your skills are verifiable, 
              immutable, and cryptographically proven.
            </p>

            <div className="space-y-6 mb-8 max-w-lg">
              {CHAIN_FACTS.map((f, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-accent/5 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                    <f.icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight mb-1">{f.label}</h3>
                    <p className="text-xs text-text-muted leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/cyber-points"
              className="btn-secondary text-xs inline-flex items-center gap-2"
            >
              Explore the Chain <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>

        <ScrollReveal className="relative hidden lg:block" direction="right">
          <div className="absolute inset-0 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-4">
            {[
              { id: '0x8f2..', type: 'ROOM_COMPLETED', op: 'Ghost_01', hash: '4a92b..', prev: '9c2f1..' },
              { id: '0x3a1..', type: 'CP_REWARD', op: 'Shadow_Op', hash: 'd1e8c..', prev: '4a92b..' },
            ].map((block, i) => (
              <div key={i} className="terminal-card p-5 rounded-2xl border border-border bg-bg-card/80 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <ChainLogo size={16} />
                    <span className="font-mono text-[10px] font-bold text-accent uppercase tracking-widest">Block {block.id}</span>
                  </div>
                  <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">{block.type}</span>
                </div>
                <div className="space-y-3 font-mono text-[9px] uppercase tracking-[0.15em]">
                  <div className="flex justify-between gap-4">
                    <span className="text-text-muted">Operator:</span>
                    <span className="text-text-primary">{block.op}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-text-muted">Hash:</span>
                    <span className="text-accent">{block.hash}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-text-muted">Prev_Hash:</span>
                    <span className="text-text-muted">{block.prev}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-center text-[10px] font-mono text-text-muted uppercase tracking-widest opacity-60">
              ↑ sample blocks from HSOCIETY CHAIN
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

export default ChainSection;
