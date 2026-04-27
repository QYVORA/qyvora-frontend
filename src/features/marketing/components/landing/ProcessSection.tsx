import React from 'react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';

interface ProcessSectionProps {
  stats: BackendStats | null;
  totalCp: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type BackendStats = any;

const STEPS = [
  { title: 'JOIN',     desc: 'Create your operator account.'        },
  { title: 'TRAIN',    desc: 'Complete phased bootcamp modules.'     },
  { title: 'VALIDATE', desc: 'Prove skills in live challenges.'      },
  { title: 'EARN',     desc: 'Collect points for your progress.'     },
  { title: 'UNLOCK',   desc: 'Access the Zero-Day Market.'           },
];

const ProcessSection: React.FC<ProcessSectionProps> = () => {

  return (
    <section className="py-20 md:py-32 bg-bg relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <ScrollReveal className="text-center mb-10 md:mb-20">
          <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// THE PROCESS</span>
          <h2 className="text-3xl md:text-4xl text-text-primary font-bold mb-3">How The Loop Works</h2>
          <p className="text-text-muted text-sm md:text-base max-w-xl mx-auto">
            Create your operator account, complete phased bootcamp modules, validate skills in challenges, earn points, and unlock the Zero-Day Market.
          </p>
        </ScrollReveal>

        {/* Steps — fix #6: added scroll-snap-type on container, fix #7: arrows only on xl+ to avoid overlap */}
        <div className="mb-0 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto overflow-y-hidden touch-pan-x no-scrollbar">
          <div className="flex md:grid md:grid-cols-5 gap-4 md:gap-6 min-w-max md:min-w-0 snap-x snap-mandatory scroll-smooth">
            {STEPS.map((step, idx) => (
              <ScrollReveal
                key={idx}
                delay={idx * 0.1}
                className="relative shrink-0 group text-left snap-start w-[85vw] sm:w-[60vw] md:w-auto rounded-xl border border-border bg-bg-card/65 md:bg-transparent md:border-none p-4 md:p-0"
              >
                {/* L5: text-accent/40 — visible in both themes (was /20 which vanishes in light) */}
                <div className="text-4xl md:text-5xl font-extrabold text-accent/40 font-mono mb-3 group-hover:text-accent/70 transition-colors">
                  0{idx + 1}
                </div>
                <h3 className="text-base md:text-xl font-bold text-text-primary mb-2 uppercase tracking-tighter">{step.title}</h3>
                <p className="text-xs md:text-sm text-text-muted leading-relaxed">{step.desc}</p>
                {/* Fix #7: arrows only on xl screens where there's enough room */}
                {idx < 4 && (
                  <div className="hidden xl:block absolute top-10 -right-5 text-accent/30 text-xl font-bold select-none">→</div>
                )}
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
