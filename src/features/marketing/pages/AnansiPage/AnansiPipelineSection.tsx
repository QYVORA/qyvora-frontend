import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SharedCarousel } from '@/shared/components/carousel';
import { PHASES } from './anansiData';

const AnansiPipelineSection: React.FC = () => {
  return (
    <SharedCarousel
      slides={PHASES}
      getImage={(s) => s.image}
      getImageAlt={(s) => s.name}
      renderImageOverlay={(s) => (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 via-bg-card/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-bg-card/20 hidden dark:block" />
          <div className="absolute top-5 left-5 sm:top-6 sm:left-6 lg:top-10 lg:left-10 z-10">
            <div className="px-6 py-3 bg-bg-card/90 backdrop-blur-xl dark:border border-white/10 border-none rounded-2xl dark:shadow-2xl shadow-none">
              <span className="text-base sm:text-lg font-black text-accent uppercase tracking-widest whitespace-nowrap">
                PHASE {s.id}
              </span>
            </div>
          </div>
        </>
      )}
      renderContent={(s) => (
        <>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-bold text-accent uppercase tracking-[0.2em]">
              // PIPELINE LIFECYCLE
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
              Autonomous Execution
            </span>
          </div>
        </>
      )}
      showMobileNav={false}
      enableBlur
    />
  );
};

export default AnansiPipelineSection;
export { AnansiPipelineSection };
