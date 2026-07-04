import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import quiteRootLogo from '@/assets/quiteRoot/ChatGPT Image Jul 3, 2026, 02_45_59 AM.png';

const LandingQuiteRootSection: React.FC = () => {
  return (
    <div className="w-full px-4 md:px-12 lg:px-16">
      <div className="w-full lg:max-w-6xl lg:mx-auto">
        <ScrollReveal direction="up" amount={0.1}>
          <div className="flex flex-col md:flex-row md:items-center md:gap-12 lg:gap-16">
            <div className="md:w-[55%] lg:w-[58%] flex flex-col items-start gap-4 mb-6 md:mb-0">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
                Quite<span className="text-accent">Root</span>
              </h2>
              <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-lg">
                The research and engineering collective behind QYVORA&apos;s offensive tooling, intelligence, and operator-focused security experiments.
              </p>
              <Link
                to="/quiteroot"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98]"
              >
                Explore QuiteRoot <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="md:w-[45%] lg:w-[42%] flex items-center justify-center md:justify-end">
              <img
                src={quiteRootLogo}
                alt="QuiteRoot"
                className="w-full max-w-[280px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[500px] h-auto object-contain"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default LandingQuiteRootSection;
