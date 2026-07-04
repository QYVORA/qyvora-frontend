import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Carousel } from '@/shared/components/carousel';
import { PHASES } from './anansiData';

const AnansiPipelineSection: React.FC = () => {
  return (
    <div className="w-full px-4 md:px-10 lg:px-12 xl:px-16">
      <div className="max-w-[1600px] mx-auto w-full flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-16">
        <div className="md:w-[35%] lg:w-[38%] text-center md:text-left mb-8 md:mb-0 md:sticky md:top-32">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
            Attack Surface <span className="text-accent">Intelligence</span>
          </h2>
        </div>
        <div className="md:w-[65%] lg:w-[62%]">
          <Carousel
            slides={PHASES}
            renderCard={(s) => {
              const Icon = s.icon;
              return (
                <div className="relative min-h-[260px] md:min-h-[360px]">
                  <div
                    className="absolute inset-0 bg-cover bg-center hidden dark:block"
                    style={{ backgroundImage: `url(${s.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-bg-card via-bg-card to-transparent dark:from-bg-card dark:via-bg-card/60 dark:to-transparent" />
                  <div className="relative z-10 p-6 sm:p-8 md:p-6 lg:p-8 flex flex-col items-start text-left h-full min-h-[260px] md:min-h-[360px]">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tight leading-tight mb-2">
                      {s.name}
                    </h3>
                    <p className="text-sm text-text-secondary font-mono leading-relaxed mb-4 line-clamp-3">
                      {s.desc}
                    </p>
                    <div className="flex items-center gap-2 text-accent/60 mt-auto">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                        Autonomous Execution
                      </span>
                    </div>
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnansiPipelineSection;
export { AnansiPipelineSection };
