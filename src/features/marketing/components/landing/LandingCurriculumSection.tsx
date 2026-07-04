import React from 'react';
import { Layers, Clock } from 'lucide-react';
import { Carousel } from '@/shared/components/carousel';
import { PHASES } from '@/features/marketing/pages/LearnPage/learnData';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';

const LandingCurriculumSection: React.FC = () => {
  const phasesWithRoomCount = PHASES.map((phase, idx) => {
    const config = BOOTCAMP_CONFIG.phases[idx];
    const roomCount = config?.rooms?.length || 0;
    const totalSteps = config?.rooms?.reduce((acc, r) => acc + (r.steps?.length || 0), 0) || 0;
    return { ...phase, roomCount, totalSteps };
  });

  return (
    <div className="w-full px-4 md:px-12 lg:px-16">
      <div className="w-full lg:max-w-6xl lg:mx-auto flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-16">
        <div className="md:w-[35%] lg:w-[38%] mb-6 md:mb-0 md:sticky md:top-32 md:order-2 md:text-right md:self-start">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none mb-4">
            What You'll <span className="text-accent">Learn</span>
          </h2>
          <p className="text-sm md:text-base text-text-muted leading-relaxed max-w-sm md:ml-auto md:mr-0">
            Five phases of structured offensive-security training, from foundations to advanced exploitation.
          </p>
        </div>
        <div className="md:w-[65%] lg:w-[62%] md:order-1">
          <Carousel
            slides={phasesWithRoomCount}
            renderCard={(phase) => {
              const Icon = phase.icon;
              return (
                <div className="relative min-h-[260px] md:min-h-[360px]">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${phase.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-bg-card via-bg-card to-transparent dark:from-bg-card dark:via-bg-card/60 dark:to-transparent" />
                  <div className="relative z-10 p-6 sm:p-8 md:p-6 lg:p-8 flex flex-col items-start text-left h-full min-h-[260px] md:min-h-[360px]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
                        <span className="text-xs font-black text-bg">{phase.id}</span>
                      </div>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-text-primary mb-2 tracking-tight">
                      {phase.name}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 mb-4">
                      {phase.desc}
                    </p>
                    <div className="flex items-center gap-2 mt-auto">
                      <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-accent/5 border border-accent/10">
                        <Layers className="w-3.5 h-3.5 text-accent" />
                        <span className="text-[11px] font-bold text-text-primary">{phase.roomCount} rooms</span>
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-accent/5 border border-accent/10">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        <span className="text-[11px] font-bold text-text-primary">{phase.totalSteps} steps</span>
                      </div>
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

export default LandingCurriculumSection;
