import React from 'react';
import { useReducedMotion } from 'motion/react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';

interface ProcessSectionProps {
  stats: any;
  totalCp: number;
}

const STEPS = [
  { num: '01', title: 'JOIN',     desc: 'Create your operator account and pick a bootcamp track.' },
  { num: '02', title: 'TRAIN',    desc: 'Complete phased bootcamp modules at your own pace.'       },
  { num: '03', title: 'VALIDATE', desc: 'Prove your skills in live challenges and CTFs.'           },
  { num: '04', title: 'EARN',     desc: 'Collect Cyber Points for every milestone you hit.'        },
  { num: '05', title: 'UNLOCK',   desc: 'Spend your points in the Zero-Day Market.'                },
];

const ProcessSection: React.FC<ProcessSectionProps> = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 md:py-32 bg-bg relative overflow-hidden has-bg-image">
      {/* Background */}
      <img
        src="/assets/sections/backgrounds/corporate-security-bg.png"
        alt=""
        aria-hidden="true"
        className="section-bg-img absolute inset-0 w-full h-full object-cover opacity-[0.08] md:opacity-[0.1] pointer-events-none select-none"
      />
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">

        {/* Heading */}
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">
            // THE PROCESS
          </span>
          <h2 className="text-3xl md:text-4xl text-text-primary font-bold mb-3">
            How The Loop Works
          </h2>
          <p className="text-text-muted text-sm md:text-base max-w-xl mx-auto">
            Five steps from zero to operator. Each one builds on the last.
          </p>
        </ScrollReveal>

        {/* ── Desktop: 5-column grid ── */}
        <div className="hidden md:grid md:grid-cols-5 gap-6">
          {STEPS.map((step, idx) => (
            <ScrollReveal
              key={idx}
              delay={shouldReduceMotion ? 0 : idx * 0.09}
              className="relative"
            >
              {/* Connector line — sits between the number badge and the next card */}
              {idx < STEPS.length - 1 && (
                <div
                  aria-hidden
                  className="absolute top-[22px] left-[calc(50%+20px)] right-0 h-px bg-border z-0"
                />
              )}

              <div className="relative z-10 flex flex-col h-full rounded-xl border border-border bg-bg-card p-5 group hover:border-accent/40 transition-colors duration-200"
                style={{ boxShadow: 'var(--card-shimmer)' }}
              >
                {/* Step number */}
                <div className="font-mono text-2xl font-black text-accent/40 group-hover:text-accent transition-colors duration-300 mb-4 leading-none">
                  {step.num}
                </div>
                <h3 className="text-sm font-black text-text-primary mb-2 uppercase tracking-wide group-hover:text-accent transition-colors duration-200">
                  {step.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* ── Mobile: horizontal scroll ── */}
        <div className="md:hidden overflow-x-auto no-scrollbar -mx-4 px-4">
          <div className="flex gap-4 w-max pb-2">
            {STEPS.map((step, idx) => (
              <div
                key={idx}
                className="w-[72vw] max-w-[280px] shrink-0 rounded-xl border border-border bg-bg-card p-5"
                style={{ boxShadow: 'var(--card-shimmer)' }}
              >
                <div className="font-mono text-2xl font-black text-accent/40 mb-4 leading-none">
                  {step.num}
                </div>
                <h3 className="text-sm font-black text-text-primary mb-2 uppercase tracking-wide">
                  {step.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile scroll dots */}
        <div className="flex md:hidden items-center justify-center gap-1.5 mt-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full bg-border"
              style={{ width: i === 0 ? 20 : 8 }}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProcessSection;
