import React from 'react';
import { Shield, Monitor, Users, ShoppingBag, Zap } from 'lucide-react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import StatCounter from '../../../../shared/components/ui/StatCounter';
import type { BackendStats } from './types';

interface ProcessSectionProps {
  stats: BackendStats | null;
  totalCp: number;
}

// Fixed order — no dynamic sort that causes layout jumps on data load (#5)
const STAT_KEYS = ['Trained Operators', 'Active Operators', 'Validated Findings', 'Bootcamps Live', 'Points Distributed'];

const STEPS = [
  { title: 'JOIN',     desc: 'Create your operator account.'        },
  { title: 'TRAIN',    desc: 'Complete phased bootcamp modules.'     },
  { title: 'VALIDATE', desc: 'Prove skills in live challenges.'      },
  { title: 'EARN',     desc: 'Collect points for your progress.'     },
  { title: 'UNLOCK',   desc: 'Access the Zero-Day Market.'           },
];

const ProcessSection: React.FC<ProcessSectionProps> = ({ stats, totalCp }) => {
  const statCards = [
    { label: 'Trained Operators',  value: stats?.stats?.studentsCount ?? stats?.stats?.learnersTrained ?? 0, icon: Zap,       img: '/images/how-it-works-section/Findings-Identified.webp',    suffix: '+' },
    { label: 'Active Operators',   value: stats?.stats?.pentestersActive ?? 0,                               icon: Users,     img: '/images/how-it-works-section/Pentesters-Active.webp',       suffix: '+' },
    { label: 'Validated Findings', value: stats?.stats?.vulnerabilitiesIdentified ?? 0,                      icon: Shield,    img: '/images/how-it-works-section/Engagements-4Completed.webp',  suffix: ''  },
    { label: 'Bootcamps Live',     value: stats?.stats?.bootcampsCount ?? 0,                                 icon: Monitor,   img: '/images/how-it-works-section/Learners-Trained.webp',        suffix: ''  },
    { label: 'Points Distributed', value: Math.round(totalCp / 1000),                                        icon: ShoppingBag, img: '/images/zeroday-maket-images/zero-day-market-background.webp', suffix: 'K+' },
  ].sort((a, b) => STAT_KEYS.indexOf(a.label) - STAT_KEYS.indexOf(b.label));

  return (
    <section className="py-16 md:py-24 bg-bg relative overflow-hidden">
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
        <div className="mb-10 md:mb-20 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto overflow-y-hidden touch-pan-x no-scrollbar">
          <div className="flex md:grid md:grid-cols-5 gap-4 md:gap-6 min-w-max md:min-w-0 snap-x snap-mandatory scroll-smooth">
            {STEPS.map((step, idx) => (
              <ScrollReveal
                key={idx}
                delay={idx * 0.1}
                className="relative shrink-0 group text-left snap-start w-[76vw] sm:w-[54vw] md:w-auto rounded-xl border border-border bg-bg-card/65 md:bg-transparent md:border-none p-4 md:p-0"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {statCards.map((card, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.05} className="relative h-36 sm:h-40 md:h-48 rounded-lg overflow-hidden group border border-border">
              <img src={card.img} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
              {/* L4: theme-aware overlay — dark in dark mode, lighter in light mode */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
              <div className="absolute bottom-3 left-3 right-3">
                {/* L4: use text-accent instead of hardcoded lime so it adapts to theme */}
                <div className="text-xl md:text-2xl font-bold text-accent font-mono">
                  <StatCounter end={card.value} suffix={card.suffix} />
                </div>
                <div className="flex items-center gap-1 text-[9px] font-bold text-white/80 uppercase tracking-widest mt-0.5">
                  <card.icon className="w-3 h-3 flex-none" />
                  <span className="truncate">{card.label}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
