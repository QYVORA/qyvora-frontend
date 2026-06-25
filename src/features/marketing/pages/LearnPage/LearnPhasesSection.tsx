import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { CardMedia } from '@/shared/components/ui/Card';
import { CardGrid } from '@/shared/components/card-grid';
import { PHASES } from './learnData';

const LearnPhasesSection: React.FC = () => {
  return (
    <CardGrid
      slides={PHASES}
      cols={3}
      containerClassName="w-full px-4 md:px-10 lg:px-12 xl:px-16 py-20 md:py-28 lg:py-36"
      renderCard={(s) => (
        <CardMedia image={s.image} imageAspect="aspect-video">
          <h3 className="text-base sm:text-lg lg:text-xl font-black text-text-primary uppercase tracking-tight leading-tight mb-2">
            {s.name}
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary font-mono leading-relaxed mb-3 line-clamp-3">
            {s.desc}
          </p>
          <div className="flex items-center gap-2 text-accent/60 mt-auto">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
              Practical Laboratory Tasks Included
            </span>
          </div>
        </CardMedia>
      )}
    />
  );
};

export default LearnPhasesSection;
export { LearnPhasesSection };
