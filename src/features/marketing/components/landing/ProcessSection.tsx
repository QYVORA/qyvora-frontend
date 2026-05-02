import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import { CardBase } from '../../../../shared/components/ui/Card';

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
      <img
        src="/assets/sections/backgrounds/corporate-security-bg.png"
        alt=""
        aria-hidden="true"
        className="section-bg-img absolute inset-0 w-full h-full object-cover opacity-[0.08] md:opacity-[0.1] pointer-events-none"
      />
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <ScrollReveal className="text-center mb-12 md:mb-20">
          <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// THE PROCESS</span>
          <h2 className="text-3xl md:text-4xl text-text-primary font-bold mb-3">How The Loop Works</h2>
          <p className="text-text-muted text-sm md:text-base max-w-xl mx-auto">
            Five steps from zero to operator. Each one builds on the last.
          </p>
        </ScrollReveal>

        {/* Steps */}
        <div className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto overflow-y-hidden touch-pan-x no-scrollbar">
          <div className="flex md:grid md:grid-cols-5 gap-4 md:gap-0 min-w-max md:min-w-0">
            {STEPS.map((step, idx) => (
              <ScrollReveal
                key={idx}
                delay={shouldReduceMotion ? 0 : idx * 0.09}
                className="relative shrink-0 w-[78vw] sm:w-[55vw] md:w-auto"
              >
                {/* Connector line between steps — desktop only */}
                {idx < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-14 right-0 h-px bg-border z-0" />
                )}

                <div className="relative z-10 md:pr-6 group">
                  <CardBase className="p-5 mb-0 cursor-default hover:border-accent/40">
                    <div className="font-mono text-2xl font-black text-accent/50 group-hover:text-accent transition-colors duration-300 mb-3">
                      {step.num}
                    </div>
                    <h3 className="text-sm font-black text-text-primary mb-2 uppercase tracking-tight group-hover:text-accent transition-colors duration-200">
                      {step.title}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed">{step.desc}</p>
                  </CardBase>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Mobile scroll hint */}
        <div className="flex md:hidden items-center justify-center gap-2 mt-5">
          {STEPS.map((_, i) => (
            <div key={i} className="h-1 rounded-full bg-border" style={{ width: i === 0 ? 20 : 8 }} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
