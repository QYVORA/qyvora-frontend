import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import anansiLogo from '@/assets/anansi/anansi-main-logo.webp';
import toha3eeLogo from '@/assets/toha3ee/toha3ee-main-logo.webp';

interface Tool {
  slug: string;
  path: string;
  logo: string;
  alt: string;
}

const LandingOpenSourceToolsSection: React.FC = () => {
  const { t } = useTranslation();

  const tools: Tool[] = [
    { slug: 'anansi', path: '/anansi', logo: anansiLogo, alt: t('landing.anansi.title') },
    { slug: 'toha3ee', path: '/toha3ee', logo: toha3eeLogo, alt: t('landing.toha3ee.title') },
  ];

  return (
    <div className="relative bg-bg min-h-dvh lg:h-dvh flex flex-col overflow-hidden" data-nav-invert>
      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10 flex flex-col gap-8 md:gap-10 lg:gap-14">
        {/* Header — compact title + one-line description, no CTA */}
        <div className="flex flex-col items-start gap-3">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tighter leading-none">
            {t('landing.tools.title')} <span className="text-accent">{t('landing.tools.titleAccent')}</span>
          </h2>
          <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl font-mono">
            {t('landing.tools.description')}
          </p>
        </div>

        {/* Icon-only horizontal carousel — every icon is a button to the tool's page */}
        <div className="relative flex-1 min-h-0 min-w-0 overflow-hidden flex items-center">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div key={copy} aria-hidden={copy === 1} className="h-full flex items-center shrink-0">
                {tools.map((tool) => (
                  <Link
                    key={`${copy}-${tool.slug}`}
                    to={tool.path}
                    aria-label={tool.alt}
                    className="group mx-2 md:mx-3 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 shrink-0 flex items-center justify-center rounded-2xl border border-border/30 bg-bg-card transition-all duration-300 hover:border-accent/40 hover:shadow-[var(--card-shadow)]"
                  >
                    <img
                      src={tool.logo}
                      alt={tool.alt}
                      className="w-[55%] h-[55%] object-contain transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingOpenSourceToolsSection;
