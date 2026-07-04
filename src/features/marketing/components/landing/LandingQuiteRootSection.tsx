import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FlaskConical, Shield, Terminal } from 'lucide-react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import quiteRootLogo from '@/assets/quiteRoot/ChatGPT Image Jul 3, 2026, 02_45_59 AM.png';

const LandingQuiteRootSection: React.FC = () => {
  return (
    <div className="w-full px-4 md:px-12 lg:px-16">
      <div className="w-full lg:max-w-6xl lg:mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
              Quite<span className="text-accent">Root</span>
            </h2>
            <p className="mt-3 text-sm md:text-base text-text-muted max-w-lg">
              The research and engineering collective behind QYVORA's offensive tooling, intelligence, and operator-focused security experiments.
            </p>
          </div>
          <Link
            to="/quiteroot"
            className="hidden md:inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
          >
            Explore QuiteRoot <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <ScrollReveal direction="up" amount={0.1}>
          <>
            <div className="md:hidden flex flex-col gap-4 rounded-2xl border border-border/30 bg-bg-card p-3">
              <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-xl border border-border/20 bg-gradient-to-br from-accent/10 via-bg-card to-bg-elevated/70 p-4 sm:p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(102,184,112,0.12),transparent_70%)]" />
                <img
                  src={quiteRootLogo}
                  alt="QuiteRoot official logo"
                  className="relative z-10 h-full w-full max-h-[260px] object-contain"
                />
              </div>
              <div className="flex flex-col gap-3 px-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/20 rounded text-[9px] font-black uppercase tracking-widest text-accent border border-accent/30">
                    <Terminal className="h-2.5 w-2.5" /> Lab
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-bg-elevated rounded text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/30">
                    <FlaskConical className="h-2.5 w-2.5" /> Research
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-bg-elevated rounded text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/30">
                    <Shield className="h-2.5 w-2.5" /> Offensive Security
                  </span>
                </div>
                <h3 className="text-xl font-black text-text-primary tracking-tight leading-tight">
                  The Intelligence Behind QYVORA
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  QuiteRoot builds the research, frameworks, and applied capability that power QYVORA's security ecosystem, with Anansi CLI as its flagship public project.
                </p>
                <Link
                  to="/quiteroot"
                  className="self-start inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98]"
                >
                  Explore QuiteRoot <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="hidden md:block relative overflow-hidden rounded-3xl border border-border/20 bg-gradient-to-br from-accent/10 via-bg-card to-bg-elevated/80 p-8 lg:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(102,184,112,0.14),transparent_72%)]" />
              <div className="relative flex min-h-[420px] items-center justify-center">
                <img
                  src={quiteRootLogo}
                  alt="QuiteRoot official logo"
                  className="h-full max-h-[360px] w-full max-w-[360px] object-contain"
                />
              </div>
            </div>
          </>
        </ScrollReveal>

        <div className="mt-6 text-center md:hidden">
          <Link
            to="/quiteroot"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
          >
            Explore QuiteRoot <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingQuiteRootSection;
