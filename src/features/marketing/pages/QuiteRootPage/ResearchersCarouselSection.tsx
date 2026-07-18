import React from 'react';
import { Carousel } from '@/shared/components/carousel';
import { researchersData } from './researchersData';

const ResearchersCarouselSection: React.FC = () => {
  return (
    <div className="w-full px-4 md:px-12 lg:px-16">
      <div className="max-w-[1600px] mx-auto w-full flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-16">
        <div className="md:w-[35%] lg:w-[38%] text-center md:text-left mb-8 md:mb-0 md:sticky md:top-32">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
            Meet the <span className="text-accent">Researchers</span>
          </h2>
          <p className="mt-4 text-sm text-text-secondary max-w-md mx-auto md:mx-0">
            The research and engineering minds powering QuiteRoot's offensive capabilities.
          </p>
        </div>

        <div className="md:w-[65%] lg:w-[62%]">
          <Carousel
            slides={researchersData}
            renderCard={(member) => (
              <div className="relative min-h-[260px] md:min-h-[380px]">
                <div
                  className="absolute inset-0 bg-cover bg-top hidden dark:block"
                  style={{ backgroundImage: `url(${member.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-bg-card via-bg-card to-transparent dark:from-bg-card dark:via-bg-card/60 dark:to-transparent" />
                <div className="relative z-10 p-6 sm:p-8 md:p-6 lg:p-8 flex flex-col items-start text-left h-full min-h-[260px] md:min-h-[380px]">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-border/40 bg-bg-elevated overflow-hidden shrink-0">
                      <img
                        src={member.image}
                        alt={member.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-black text-text-primary tracking-tight leading-tight">
                        {member.name}
                      </h3>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-black rounded-lg uppercase tracking-widest">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-4 mb-4">
                    {member.bio}
                  </p>

                  {/* No socials for researchers per specification */}
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ResearchersCarouselSection;
export { ResearchersCarouselSection };
