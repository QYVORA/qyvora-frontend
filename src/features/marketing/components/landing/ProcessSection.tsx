import React from 'react';
import { Shield, Monitor, Users, ShoppingBag, Zap } from 'lucide-react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import StatCounter from '../../../../shared/components/ui/StatCounter';
import type { BackendStats } from './types';

interface ProcessSectionProps {
  stats: BackendStats | null;
  totalCp: number;
}

const ProcessSection: React.FC<ProcessSectionProps> = ({ stats, totalCp }) => (
  <section className="py-16 md:py-24 bg-bg relative overflow-hidden">
    <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <ScrollReveal className="text-center mb-10 md:mb-20">
        <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// THE PROCESS</span>
        <h2 className="text-3xl md:text-4xl text-text-primary font-bold mb-3">How The Loop Works</h2>
        <p className="text-text-muted text-sm md:text-base max-w-xl mx-auto">Create your operator account, complete phased bootcamp modules, validate skills in challenges, earn CP, and unlock the Zero-Day Market.</p>
      </ScrollReveal>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-10 md:mb-20">
        {[{ title: 'JOIN', desc: 'Create your operator account.' }, { title: 'TRAIN', desc: 'Complete phased bootcamp modules.' }, { title: 'VALIDATE', desc: 'Prove skills in live challenges.' }, { title: 'EARN', desc: 'Collect CP for your progress.' }, { title: 'UNLOCK', desc: 'Access the Zero-Day Market.' }].map((step, idx) => (
          <ScrollReveal key={idx} delay={idx * 0.1} className="relative group text-left">
            <div className="text-4xl md:text-5xl font-extrabold text-accent/20 font-mono mb-3 group-hover:text-accent transition-colors">0{idx + 1}</div>
            <h3 className="text-base md:text-xl font-bold text-text-primary mb-2 uppercase tracking-tighter">{step.title}</h3>
            <p className="text-xs md:text-sm text-text-muted leading-relaxed">{step.desc}</p>
            {idx < 4 && <div className="hidden md:block absolute top-10 -right-4 text-accent/30 text-xl font-bold">{'→'}</div>}
          </ScrollReveal>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {[
          { label: 'Active Operators', value: stats?.stats?.pentestersActive ?? 0, icon: Users, img: '/images/how-it-works-section/Pentesters-Active.webp', suffix: '+' },
          { label: 'Bootcamps Live', value: stats?.stats?.bootcampsCount ?? 0, icon: Monitor, img: '/images/how-it-works-section/Learners-Trained.webp', suffix: '' },
          { label: 'Validated Findings', value: stats?.stats?.vulnerabilitiesIdentified ?? 0, icon: Shield, img: '/images/how-it-works-section/Engagements-4Completed.webp', suffix: '' },
          { label: 'Trained Operators', value: stats?.stats?.studentsCount ?? stats?.stats?.learnersTrained ?? 0, icon: Zap, img: '/images/how-it-works-section/Findings-Identified.webp', suffix: '+' },
          { label: 'CP Distributed', value: Math.round(totalCp / 1000), icon: ShoppingBag, img: '/images/cp-card-background/zero-day-market-background.webp', suffix: 'K+' },
        ].map((card, idx) => (
          <ScrollReveal key={idx} delay={idx * 0.05} className="relative h-40 md:h-48 rounded-lg overflow-hidden group border border-border">
            <img src={card.img} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050706]/90 via-[#050706]/40 to-[#050706]/10" />
            <div className="absolute bottom-3 left-3">
              <div className="text-xl md:text-2xl font-bold text-[#B7FF99] font-mono"><StatCounter end={card.value} suffix={card.suffix} /></div>
              <div className="flex items-center gap-1 text-[9px] font-bold text-white/60 uppercase tracking-widest mt-0.5"><card.icon className="w-3 h-3" /> {card.label}</div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default ProcessSection;

