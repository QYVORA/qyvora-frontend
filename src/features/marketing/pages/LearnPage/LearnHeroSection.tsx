import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { HeroBackground } from '@/shared/components/backgrounds';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';

const LearnHeroSection: React.FC = () => {
  const { isMobile } = useAdaptiveUi();

  return (
    <>
      <HeroBackground />
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12 xl:px-16 w-full h-full flex items-center pt-20 md:pt-20 lg:pt-20">
        <div className="max-w-4xl space-y-8 text-left w-full">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9]">
              Hacker Protocol <br />
              <span className="text-accent">Bootcamp</span>
            </h1>
          </div>

          <p className="text-lg md:text-xl lg:text-2xl text-text-secondary font-mono leading-relaxed max-w-2xl">
            Offensive security requires understanding systems from first principles.
            The HPB curriculum transforms you from a tool runner to a specialized security operator.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Link
              to="/register"
              className="btn-primary px-8 py-4 font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3"
            >
              <Play className="w-4 h-4 fill-current" /> Start Training
            </Link>
            <a
              href="#phases"
              className="px-8 py-4 border border-border bg-bg-card/30 hover:border-accent/40 rounded-xl text-xs font-black uppercase tracking-[0.15em] hover:text-accent transition-all text-center"
              onClick={(e) => {
                if (!isMobile) {
                  e.preventDefault();
                  const el = document.getElementById('phases');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            >
              Explore Phases
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default LearnHeroSection;
export { LearnHeroSection };
