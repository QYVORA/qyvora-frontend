import React from 'react';
import { IconCheck } from '@/shared/components/icons';
import { Carousel } from '@/shared/components/carousel';
import StickySidebarLayout from '@/shared/components/layout/StickySidebarLayout';
import { PHASES } from './learnData';

const LearnPhasesSection: React.FC = () => {
  return (
    <div className="w-full px-4 md:px-10 lg:px-12 xl:px-16 py-20 md:py-28 lg:py-36">
      <div className="max-w-[1600px] mx-auto">
        <StickySidebarLayout
          heading={
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
              Bootcamp <span className="text-accent">Phases</span>
            </h2>
          }
        >
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
                      <IconCheck size={16} />
                      <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                        Practical Laboratory Tasks Included
                      </span>
                    </div>
                  </div>
                </div>
              );
            }}
          />
        </StickySidebarLayout>
      </div>
    </div>
  );
};

export default LearnPhasesSection;
export { LearnPhasesSection };
