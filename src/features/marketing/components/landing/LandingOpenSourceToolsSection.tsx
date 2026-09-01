import React from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import anansiLogo from '@/assets/anansi/anansi-main-logo.webp';
import toha3eeLogo from '@/assets/toha3ee/toha3ee-main-logo.webp';
import jabariLogo from '@/assets/jabari/jabari-main-logo.webp';
import aksumLogo from '@/assets/aksum/aksum-main-logo.webp';
import shakaLogo from '@/assets/shaka/shaka-main-logo.webp';
import nzingaLogo from '@/assets/nzinga/nzinga-main-logo.webp';
import DragMarquee from '@/shared/components/carousel/DragMarquee';
import { SimpleHeading } from '@/shared/components/ui';

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
    { slug: 'shaka', path: '/shaka', logo: shakaLogo, alt: t('landing.shaka.title') },
    { slug: 'nzinga', path: '/nzinga', logo: nzingaLogo, alt: t('landing.nzinga.title') },
    { slug: 'jabari', path: '/jabari', logo: jabariLogo, alt: t('landing.jabari.title') },
    { slug: 'aksum', path: '/aksum', logo: aksumLogo, alt: t('landing.aksum.title') },
  ];

  const logoClass =
    'w-44 h-44 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-60 lg:h-60 object-contain transition-transform duration-500 group-hover:scale-110';

  return (
    <div className="relative bg-bg min-h-dvh flex flex-col overflow-x-clip overflow-hidden" >
      {/* Header — title + one-line description at the top */}
      <div className="relative z-10 w-full px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-10 lg:pb-12 flex flex-col gap-3">
        <SimpleHeading
          text={t('landing.tools.title')}
          accentText={t('landing.tools.titleAccent')}
          align="left"
          description={t('landing.tools.description')}
        />
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
          <DragMarquee speed={30} trackClassName="h-full items-center" className="w-full">
            {Array.from({ length: REPEATS }).flatMap((_, rep) =>
              tools.map((tool) => (
                <Link
                  key={`${rep}-${tool.slug}`}
                  to={tool.path}
                  aria-label={tool.alt}
                  className="group shrink-0 flex items-center justify-center px-5 md:px-8"
                >
                  <img src={tool.logo} alt={tool.alt} className={logoClass} loading="lazy" />
                </Link>
              ))
            )}
          </DragMarquee>
        </div>
      )}
    </div>
  );
};

export default React.memo(LandingOpenSourceToolsSection);
