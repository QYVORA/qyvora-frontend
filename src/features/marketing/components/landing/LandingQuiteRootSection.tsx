import { memo } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowRight, IconProfile } from '@/shared/components/icons';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { researchersData } from '@/features/marketing/content/researchersData';
import quiteRootLogo from '@/assets/quiteRoot/ChatGPT Image Jul 3, 2026, 02_45_59 AM.webp';
import { useTranslation } from 'react-i18next';

const LandingQuiteRootSection = () => {
  const { t } = useTranslation();
  return (
    <div className="relative bg-bg min-h-dvh flex flex-col overflow-hidden" >
      <GridBoxedBackground blur={0} mask="right" />
      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 py-12 sm:py-10 md:py-16 lg:py-20 flex flex-col gap-12 lg:grid lg:grid-cols-2 lg:grid-rows-1 lg:gap-12 xl:gap-16 lg:items-center">
        {/* Heading — left column on desktop */}
        <div className="flex flex-col gap-10 lg:gap-14 max-w-xl">
          <div className="flex items-center gap-4">
            <img
              src={quiteRootLogo}
              alt="QuiteRoot Logo"
              width={793}
              height={787}
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-tight">
              {t('landing.quiteroot.title')}<span className="text-accent">{t('landing.quiteroot.titleAccent')}</span>
            </h2>
          </div>
          <p className="text-xs md:text-sm text-text-muted leading-relaxed">
            {t('landing.quiteroot.description')}
          </p>
          <Link
            to="/quiteroot"
            className="btn-secondary inline-flex items-center gap-2.5 w-fit"
          >
            {t('landing.quiteroot.explore')} <IconArrowRight size={14} />
          </Link>
        </div>

        {/* Researcher grid — right column on desktop, 2-col square grid on mobile */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5 min-w-0 w-full lg:h-full lg:grid-rows-2">
          {researchersData.map((researcher, idx) => (
            <ScrollReveal key={researcher.id} direction="up" delay={idx * 0.1} className="min-w-0 min-h-0 lg:h-full">
              <figure className="group relative h-full aspect-square lg:aspect-auto flex flex-col card-accent bg-bg-card overflow-hidden transition-colors duration-300">
                {/* Researcher photo as the card background */}
                <img
                  src={researcher.image}
                  alt=""
                  aria-hidden
                  width={researcher.width}
                  height={researcher.height}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Legibility overlay — theme-neutral dark scrim so it never washes out the photo in light mode */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

                {/* Top header — index + tiny profile icon */}
                <div className="relative z-10 flex items-center justify-between p-3 sm:p-4 pb-0">
                  <span className="font-mono text-[10px] sm:text-xs font-black text-text-primary/60">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-border/50 bg-black/40 backdrop-blur-md text-text-primary">
                    <IconProfile className="w-4 h-4" />
                  </span>
                </div>

                {/* Name + role pinned to the bottom */}
                <figcaption className="relative z-10 mt-auto flex items-center justify-between gap-2 px-3 sm:px-4 pb-3 sm:pb-4 min-w-0">
                  <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-tight text-text-primary truncate">
                    {researcher.name}
                  </h3>
                  <span className="shrink-0 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-accent backdrop-blur-sm">
                    {researcher.role}
                  </span>
                </figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(LandingQuiteRootSection);
