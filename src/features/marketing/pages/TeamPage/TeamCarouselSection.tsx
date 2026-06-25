import React from 'react';
import { SharedCarousel } from '@/shared/components/carousel';
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
    <SharedCarousel
      slides={teamData}
      getImage={(m) => m.image}
      getImageAlt={(m) => m.name}
      renderImageOverlay={(m) => (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 via-bg-card/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-bg-card/20 hidden dark:block" />
          <div className="absolute top-5 left-5 sm:top-6 sm:left-6 lg:top-10 lg:left-10 z-10">
            <div className="px-6 py-3 sm:px-7 sm:py-3.5 lg:px-8 lg:py-4 bg-bg-card/90 backdrop-blur-xl dark:border border-white/10 border-none rounded-2xl dark:shadow-2xl shadow-none">
              <span className="text-lg sm:text-xl lg:text-2xl font-black text-accent uppercase tracking-widest whitespace-nowrap">
                {m.role}
              </span>
            </div>
          </div>
        </>
      )}
      renderContent={(m) => (
        <>
          {m.handle && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs sm:text-[11px] font-bold text-accent uppercase tracking-[0.2em]">
                @{m.handle}
              </span>
            </div>
          )}
          <h2 className="text-3xl sm:text-3xl lg:text-3xl xl:text-4xl font-black text-text-primary uppercase tracking-tight leading-tight mb-8">
            {m.name}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed font-mono opacity-90 border-l-2 border-accent/40 pl-5 py-2 mb-10 italic">
            &ldquo;{m.bio}&rdquo;
          </p>
          <div className="flex items-center gap-4 pt-6">
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
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-bg/40 text-text-secondary transition-all duration-300 hover:border-accent/50 hover:text-accent hover:-translate-y-0.5 hover:shadow-[0_6px_18px_var(--color-accent-glow)]"
                >
                  <IconComponent className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </>
      )}
    />
  );
};

export default TeamCarouselSection;
export { TeamCarouselSection };
