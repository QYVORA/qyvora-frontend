import React from 'react';
import { Github, Linkedin, Youtube, Twitter } from 'lucide-react';
import { Carousel } from '@/shared/components/carousel';
import { teamData } from '@/features/marketing/pages/TeamPage/teamData';

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  youtube: Youtube,
  twitter: Twitter,
};

const LandingTeamSection: React.FC = () => {
  return (
    <div className="w-full px-4 md:px-12 lg:px-16">
      <div className="w-full lg:max-w-6xl lg:mx-auto flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-16">
        <div className="md:w-[35%] lg:w-[38%] mb-6 md:mb-0 md:sticky md:top-32">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
            Built by <span className="text-accent">Hackers</span>
          </h2>
          <p className="mt-6 text-sm md:text-base text-text-muted leading-relaxed">
            Two operators, one mission — building Africa&apos;s offensive security platform
          </p>
        </div>

        <div className="md:w-[65%] lg:w-[62%]">
          <Carousel
            slides={teamData}
            renderCard={(member) => (
              <div className="relative min-h-[260px] md:min-h-[380px]">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${member.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-bg-card via-bg-card to-transparent dark:from-bg-card dark:via-bg-card/60 dark:to-transparent" />
                <div className="relative z-10 p-6 sm:p-8 md:p-6 lg:p-8 flex flex-col items-start text-left h-full min-h-[260px] md:min-h-[380px]">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-border/40 bg-bg-elevated overflow-hidden shrink-0">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-black text-text-primary tracking-tight leading-tight">
                        {member.name}
                      </h3>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-black rounded-md uppercase tracking-widest">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-4 mb-4">
                    {member.bio}
                  </p>

                  <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border/30 w-full">
                    {Object.entries(member.socials || {}).map(([platform, url]) => {
                      const Icon = SOCIAL_ICONS[platform];
                      if (!Icon) return null;
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-bg-elevated border border-border/20 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all duration-200"
                        >
                          <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingTeamSection;
