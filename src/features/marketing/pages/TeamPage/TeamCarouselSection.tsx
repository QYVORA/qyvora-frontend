import React from 'react';
import { Carousel } from '@/shared/components/carousel';
import { teamData } from './teamData';
import BrandGithubIcon from '@/shared/components/icons/BrandGithubIcon';
import BrandLinkedinIcon from '@/shared/components/icons/BrandLinkedinIcon';
import BrandYoutubeIcon from '@/shared/components/icons/BrandYoutubeIcon';
import BrandXIcon from '@/shared/components/icons/BrandXIcon';
import BrandTiktokIcon from '@/shared/components/icons/BrandTiktokIcon';
import BrandInstagramIcon from '@/shared/components/icons/BrandInstagramIcon';

const socialIcons: Record<string, React.FC<{ className?: string }>> = {
  github: BrandGithubIcon,
  linkedin: BrandLinkedinIcon,
  youtube: BrandYoutubeIcon,
  twitter: BrandXIcon,
  tiktok: BrandTiktokIcon,
  instagram: BrandInstagramIcon,
};

const TeamCarouselSection: React.FC = () => {
  return (
    <div className="w-full px-4 md:px-10 lg:px-12 xl:px-16">
      <div className="max-w-[1600px] mx-auto w-full flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-16">
        <div className="md:w-[35%] lg:w-[38%] text-center md:text-left mb-8 md:mb-0 md:sticky md:top-32">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
            Meet the <span className="text-accent">Team</span>
          </h2>
        </div>
        <div className="md:w-[65%] lg:w-[62%]">
          <Carousel
            slides={teamData}
            renderCard={(m) => (
              <div className="relative min-h-[320px] md:min-h-[400px]">
                <div
                  className="absolute inset-0 bg-cover bg-center hidden dark:block"
                  style={{ backgroundImage: `url(${m.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-bg-card via-bg-card to-transparent dark:from-bg-card dark:via-bg-card/60 dark:to-transparent" />
                <div className="relative z-10 p-6 sm:p-8 md:p-6 lg:p-8 flex flex-col items-start text-left h-full min-h-[320px] md:min-h-[400px]">
                  <div className="px-4 py-2 bg-bg-card/90 backdrop-blur-xl dark:border border-white/10 rounded-xl mb-3">
                    <span className="text-sm font-black text-accent uppercase tracking-widest whitespace-nowrap">
                      {m.role}
                    </span>
                  </div>
                  {m.handle && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] sm:text-[11px] font-bold text-accent uppercase tracking-[0.2em]">
                        @{m.handle}
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tight leading-tight mb-3">
                    {m.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-mono opacity-90 border-l-2 border-accent/40 pl-3 py-1.5 mb-4 italic line-clamp-3">
                    &ldquo;{m.bio}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border/40 w-full">
                    {Object.entries(m.socials).map(([key, href]) => {
                      if (!href) return null;
                      const IconComponent = socialIcons[key];
                      if (!IconComponent) return null;
                      return (
                        <a
                          key={key}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${m.name} on ${key}`}
                          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-border bg-bg/40 text-text-secondary transition-all duration-300 hover:border-accent/50 hover:text-accent hover:-translate-y-0.5 hover:shadow-[0_4px_12px_var(--color-accent-glow)]"
                        >
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
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

export default TeamCarouselSection;
export { TeamCarouselSection };
