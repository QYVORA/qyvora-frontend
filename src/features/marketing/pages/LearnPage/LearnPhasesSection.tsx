import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SharedCarousel } from '@/shared/components/carousel';
import { PHASES } from './learnData';

const LearnPhasesSection: React.FC = () => {
  return (
    <SharedCarousel
      slides={PHASES}
      getImage={(s) => s.image}
      getImageAlt={(s) => s.name}
      renderImageOverlay={(s) => (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 via-bg-card/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-bg-card/20 hidden dark:block" />
        </>
      )}
      renderContent={(s) => (
        <>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-bold text-accent uppercase tracking-[0.2em]">
              // BOOTCAMP CURRICULUM
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-3xl xl:text-4xl font-black text-text-primary uppercase tracking-tight leading-tight mb-6 lg:mb-8">
            {s.name}
          </h2>
          <p className="text-base sm:text-lg lg:text-base xl:text-lg text-text-secondary font-mono leading-relaxed mb-8 lg:mb-10">
            {s.desc}
          </p>
          <div className="flex items-center gap-3 text-accent/60">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-mono text-[11px] uppercase tracking-widest font-bold">
              Practical Laboratory Tasks Included
            </span>
          </div>
        </>
      )}
      showMobileNav={false}
      containerClassName="w-full px-4 md:px-10 lg:px-12 xl:px-16 py-20 md:py-0"
      enableBlur
    />
  );
};

export default LearnPhasesSection;
export { LearnPhasesSection };
