import React from 'react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import StickySidebarLayout from '@/shared/components/layout/StickySidebarLayout';
import { researchersData } from './researchersData';

const ResearchersCarouselSection: React.FC = () => {
  return (
    <div className="w-full px-4 md:px-10 lg:px-12 xl:px-16">
      <div className="max-w-[1600px] mx-auto">
        <StickySidebarLayout
          heading={
            <>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
                Meet the <span className="text-accent">Researchers</span>
              </h2>
              <p className="mt-4 text-xs md:text-sm text-text-secondary max-w-md mx-auto md:mx-0">
                The research and engineering minds powering QuiteRoot's offensive capabilities.
              </p>
            </>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {researchersData.map((member, idx) => (
              <ScrollReveal key={member.id} delay={idx * 0.1} amount={0.05}>
                <div className="rounded-2xl border border-border/30 bg-bg-card p-5 transition-all duration-300 hover:border-accent/30 flex flex-col h-full">
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
                      <h3 className="text-sm font-black text-text-primary tracking-tight leading-tight uppercase">
                        {member.name}
                      </h3>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-black rounded-lg uppercase tracking-widest">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-text-muted leading-relaxed line-clamp-3 flex-1">
                    {member.bio}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </StickySidebarLayout>
      </div>
    </div>
  );
};

export default ResearchersCarouselSection;
export { ResearchersCarouselSection };
