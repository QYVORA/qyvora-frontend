import React from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import anansiLogo from '@/assets/anansi/anansi-main-logo.webp';
import toha3eeLogo from '@/assets/toha3ee/toha3ee-main-logo.webp';
import jabariLogo from '@/assets/jabari/jabari-main-logo.webp';

interface Tool {
  slug: string;
  path: string;
  logo: string;
  alt: string;
}

const REPEATS = 4;

const LandingOpenSourceToolsSection: React.FC = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const tools: Tool[] = [
    { slug: 'anansi', path: '/anansi', logo: anansiLogo, alt: t('landing.anansi.title') },
    { slug: 'toha3ee', path: '/toha3ee', logo: toha3eeLogo, alt: t('landing.toha3ee.title') },
    { slug: 'jabari', path: '/jabari', logo: jabariLogo, alt: t('landing.jabari.title') },
  ];

  const logoClass =
    'w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-52 lg:h-52 object-contain transition-transform duration-500 group-hover:scale-110';

  return (
    <div className="relative bg-bg min-h-dvh lg:h-dvh flex flex-col overflow-x-clip overflow-hidden" data-nav-invert>
      {/* Header — title + one-line description at the top */}
      <div className="relative z-10 w-full px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-10 lg:pb-12 flex flex-col gap-3">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tighter leading-none">
          {t('landing.tools.title')} <span className="text-accent">{t('landing.tools.titleAccent')}</span>
        </h2>
        <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl font-mono">
          {t('landing.tools.description')}
        </p>
      </div>

      {/* Full-bleed logo marquee — logos drift from the far right of the viewport to the left */}
      {shouldReduceMotion ? (
        <div className="relative z-10 flex-1 flex items-center justify-center flex-wrap gap-8 md:gap-12 px-3 md:px-4 lg:px-6 pb-8">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              to={tool.path}
              aria-label={tool.alt}
              className="group shrink-0 flex items-center justify-center"
            >
              <img src={tool.logo} alt={tool.alt} className={logoClass} loading="lazy" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="relative z-10 flex-1 min-h-0 min-w-0 overflow-x-clip overflow-y-visible flex items-center py-3">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div key={copy} aria-hidden={copy === 1} className="h-full flex items-center shrink-0">
                {Array.from({ length: REPEATS }).flatMap((_, rep) =>
                  tools.map((tool) => (
                    <Link
                      key={`${copy}-${rep}-${tool.slug}`}
                      to={tool.path}
                      aria-label={tool.alt}
                      className="group shrink-0 flex items-center justify-center px-5 md:px-8"
                    >
                      <img src={tool.logo} alt={tool.alt} className={logoClass} loading="lazy" />
                    </Link>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingOpenSourceToolsSection;
