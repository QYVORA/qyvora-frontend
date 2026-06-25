import React from 'react';
import { CardMedia } from '@/shared/components/ui/Card';
import { CardGrid } from '@/shared/components/card-grid';
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
    <CardGrid
      slides={teamData}
      cols={2}
      renderCard={(m) => (
        <CardMedia
          image={m.image}
          imageAspect="aspect-[4/3]"
          imageBadges={
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10">
              <div className="px-4 py-2 sm:px-5 sm:py-2.5 bg-bg-card/90 backdrop-blur-xl dark:border border-white/10 border-none rounded-xl dark:shadow-2xl shadow-none">
                <span className="text-sm sm:text-base font-black text-accent uppercase tracking-widest whitespace-nowrap">
                  {m.role}
                </span>
              </div>
            </div>
          }
        >
          {m.handle && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] sm:text-[11px] font-bold text-accent uppercase tracking-[0.2em]">
                @{m.handle}
              </span>
            </div>
          )}
          <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-text-primary uppercase tracking-tight leading-tight mb-3">
            {m.name}
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-mono opacity-90 border-l-2 border-accent/40 pl-3 py-1.5 mb-4 italic">
            &ldquo;{m.bio}&rdquo;
          </p>
          <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border/40">
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
        </CardMedia>
      )}
    />
  );
};

export default TeamCarouselSection;
export { TeamCarouselSection };
