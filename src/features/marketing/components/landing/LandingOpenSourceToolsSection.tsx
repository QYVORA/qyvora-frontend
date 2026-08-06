import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconArrowRight } from '@/shared/components/icons';
import anansiLogo from '@/assets/anansi/anansi-main-logo.webp';
import toha3eeLogo from '@/assets/toha3ee/toha3ee-main-logo.webp';

interface ToolCard {
  slug: string;
  path: string;
  logo: string;
  alt: string;
  width: number;
  height: number;
  name: string;
  accent: string;
  desc: string;
  explore: string;
}

const LandingOpenSourceToolsSection: React.FC = () => {
  const { t } = useTranslation();

  const tools: ToolCard[] = [
    {
      slug: 'anansi',
      path: '/anansi',
      logo: anansiLogo,
      alt: 'Anansi logo',
      width: 623,
      height: 576,
      name: t('landing.anansi.title'),
      accent: t('landing.anansi.titleAccent'),
      desc: t('landing.anansi.description'),
      explore: t('landing.anansi.explore'),
    },
    {
      slug: 'toha3ee',
      path: '/toha3ee',
      logo: toha3eeLogo,
      alt: 'Toha3ee logo',
      width: 1024,
      height: 1024,
      name: t('landing.toha3ee.title'),
      accent: t('landing.toha3ee.titleAccent'),
      desc: t('landing.toha3ee.description'),
      explore: t('landing.toha3ee.explore'),
    },
  ];

  return (
    <div className="relative bg-bg min-h-dvh lg:h-dvh flex flex-col overflow-hidden" data-nav-invert>
      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10 flex flex-col gap-6 md:gap-8 lg:gap-10">
        {/* Section header */}
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-black text-text-primary tracking-tight">
            {t('landing.tools.title')} <span className="text-accent">{t('landing.tools.titleAccent')}</span>
          </h2>
          <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl mt-2 font-mono">
            {t('landing.tools.description')}
          </p>
        </div>

        {/* Tool cards */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              to={tool.path}
              className="group relative rounded-2xl border border-border/30 bg-bg-card overflow-hidden flex flex-col hover:border-accent/30 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {/* Logo area */}
              <div className="relative h-52 md:h-64 lg:h-auto lg:flex-1 min-h-0 overflow-hidden border-b border-border/20">
                <img
                  src={tool.logo}
                  alt={tool.alt}
                  width={tool.width}
                  height={tool.height}
                  className="absolute inset-0 w-full h-full object-contain p-6 md:p-8 lg:p-10 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
              </div>

              {/* Content area */}
              <div className="p-4 md:p-6 flex flex-col gap-3">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-text-primary tracking-tight">
                  {tool.name} <span className="text-accent">{tool.accent}</span>
                </h3>
                <p className="text-xs md:text-sm text-text-muted leading-relaxed font-mono">{tool.desc}</p>
                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent pt-1">
                  {tool.explore}
                  <IconArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingOpenSourceToolsSection;
