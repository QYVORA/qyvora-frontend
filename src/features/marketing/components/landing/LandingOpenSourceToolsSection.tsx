import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconArrowRight } from '@/shared/components/icons';
import anansiLogo from '@/assets/anansi/anansi-main-logo.webp';
import toha3eeLogo from '@/assets/toha3ee/toha3ee-main-logo.webp';

interface Tool {
  slug: string;
  path: string;
  logo: string;
  alt: string;
  name: string;
  accent: string;
  desc: string;
  explore: string;
}

const LandingOpenSourceToolsSection: React.FC = () => {
  const { t } = useTranslation();

  const tools: Tool[] = [
    {
      slug: 'anansi',
      path: '/anansi',
      logo: anansiLogo,
      alt: 'Anansi logo',
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
      name: t('landing.toha3ee.title'),
      accent: t('landing.toha3ee.titleAccent'),
      desc: t('landing.toha3ee.description'),
      explore: t('landing.toha3ee.explore'),
    },
  ];

  return (
    <div className="relative bg-bg min-h-dvh lg:h-dvh flex flex-col overflow-hidden" data-nav-invert>
      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-14 h-full">
          {/* Left: header + per-tool CTAs */}
          <div className="flex flex-col gap-8 md:gap-10">
            <div>
              <h2 className="text-lg md:text-xl lg:text-2xl font-black text-text-primary tracking-tight">
                {t('landing.tools.title')} <span className="text-accent">{t('landing.tools.titleAccent')}</span>
              </h2>
              <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl mt-2 font-mono">
                {t('landing.tools.description')}
              </p>
            </div>

            <div className="flex flex-col divide-y divide-border/20">
              {tools.map((tool) => (
                <Link
                  key={tool.slug}
                  to={tool.path}
                  className="group flex items-center justify-between gap-4 py-5 md:py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <div className="min-w-0">
                    <h3 className="text-xl md:text-2xl font-black text-text-primary tracking-tight group-hover:text-accent transition-colors">
                      {tool.name} <span className="text-accent">{tool.accent}</span>
                    </h3>
                    <p className="text-xs md:text-sm text-text-muted leading-relaxed font-mono mt-1">{tool.desc}</p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent">
                    {tool.explore}
                    <IconArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>

            {/* Icons on mobile */}
            <div className="flex lg:hidden items-center justify-center gap-6 pt-2">
              {tools.map((tool) => (
                <img
                  key={tool.slug}
                  src={tool.logo}
                  alt={tool.alt}
                  className="w-24 md:w-28 h-auto object-contain"
                />
              ))}
            </div>
          </div>

          {/* Right: floating tool icons */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="flex items-center justify-center gap-10">
              {tools.map((tool) => (
                <img
                  key={tool.slug}
                  src={tool.logo}
                  alt={tool.alt}
                  className="w-48 xl:w-56 2xl:w-64 h-auto object-contain drop-shadow-[0_0_40px_rgba(6,182,111,0.15)]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingOpenSourceToolsSection;
