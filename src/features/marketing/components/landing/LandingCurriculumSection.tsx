import React from 'react';
import { Layers, Clock } from 'lucide-react';
import ScrollReveal from '@/shared/components/ScrollReveal';
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
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-16">
        <div className="md:w-[35%] lg:w-[38%] text-center md:text-right mb-8 md:mb-0 md:sticky md:top-32 md:order-2">
          <span className="text-xs md:text-sm font-black uppercase tracking-widest text-accent mb-4 block">
            Curriculum
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none mb-4">
            What You'll <span className="text-white">Learn</span>
          </h2>
          <p className="text-sm md:text-base text-white/60 leading-relaxed max-w-sm mx-auto md:ml-auto md:mr-0">
            Five phases of structured offensive-security training, from foundations to advanced exploitation.
          </p>
        </div>

        <div className="md:w-[65%] lg:w-[62%] md:order-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {phasesWithRoomCount.map((phase, i) => {
              const Icon = phase.icon;
              return (
                <ScrollReveal key={phase.id} direction="up" amount={0.1} delay={i * 0.05}>
                  <div className="rounded-2xl md:rounded-3xl border border-white/10 bg-bg-card overflow-hidden group h-full flex flex-col">
                    <div className="relative h-36 sm:h-40 md:h-36 lg:h-40 bg-bg-elevated overflow-hidden">
                      <img
                        src={phase.image}
                        alt={phase.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="w-5 h-5 rounded-md bg-accent flex items-center justify-center">
                          <span className="text-[9px] font-black text-bg">{phase.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-4 sm:p-5 flex flex-col">
                      <h3 className="text-base sm:text-lg font-black text-white mb-1.5 tracking-tight">
                        {phase.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/60 leading-relaxed line-clamp-3 mb-3">
                        {phase.desc}
                      </p>
                      <div className="flex items-center gap-2 mt-auto">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10">
                          <Layers className="w-3 h-3 text-white" />
                          <span className="text-[10px] font-bold text-white">{phase.roomCount} rooms</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10">
                          <Clock className="w-3 h-3 text-white" />
                          <span className="text-[10px] font-bold text-white">{phase.totalSteps} steps</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingCurriculumSection;
