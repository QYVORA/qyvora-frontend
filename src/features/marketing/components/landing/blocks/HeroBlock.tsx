import React from 'react';
import Button from '@/shared/components/ui/Button';
import TypewriterText from '@/shared/components/TypewriterText';
import type { BackendStats } from '@/features/marketing/components/landing/types';
import heroDesktopBg from '@/assets/backgrounds/hero-desktop.webp';
import heroMobileBg from '@/assets/backgrounds/hero-mobile.webp';

interface HeroBlockProps {
  stats: BackendStats | null;
}

/** Phrases typed after "Train like a hacker," — the tagline rotates, the proof stays. */
const ROTATING_WORDS = [
  'become a hacker.',
  'prove it on-chain.',
  'earn the badge.',
  'defend what matters.',
];

/** Longest rotating phrase — rendered invisibly to reserve stable line height. */
const LONGEST_WORD = ROTATING_WORDS.reduce((longest, word) =>
  word.length > longest.length ? word : longest,
);

/**
 * HeroBlock — retargeted around the QYVORA tagline ("Train like a hacker,
 * become a hacker") with a typewriter rotation, plus the mission and the
 * 100,000-professionals goal. One statement, one real proof point, one
 * primary CTA and one secondary link.
 */
const HeroBlock: React.FC<HeroBlockProps> = ({ stats }) => {
  const trained = stats?.stats?.learnersTrained ?? 0;

  return (
    <section
      className="relative flex min-h-dvh w-full overflow-hidden bg-canvas"
      data-theme-persist="dark"
    >
      <img
        src={heroDesktopBg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden h-full w-full select-none object-cover lg:block"
      />
      <img
        src={heroMobileBg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 block h-full w-full select-none object-cover object-bottom lg:hidden"
      />
      <div className="relative mx-auto flex w-full max-w-[1320px] flex-col justify-center px-3 py-24 pt-32 md:px-4 md:py-28 lg:px-6">
        <div className="flex max-w-2xl flex-col items-start gap-6 md:gap-8">
          <p className="type-label uppercase tracking-[0.12em] text-accent">{"Africa's Offensive Security Platform"}</p>

          <h1 className="type-display text-4xl font-black uppercase tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            <span className="block">{"Train like a hacker,"}</span>
            <span className="relative block text-accent">
              <span aria-hidden="true" className="invisible block select-none pr-1.5">
                {LONGEST_WORD}
              </span>
              <span aria-hidden="false" className="absolute inset-0">
                <TypewriterText words={ROTATING_WORDS} />
              </span>
            </span>
          </h1>

          <p className="max-w-xl text-base text-text-secondary md:text-lg">
            {"Hands-on courses, attack labs, and the Hacker Protocol Bootcamp, proving every skill you earn in CyberPoints on the chain. QYVORA is building Africa's strongest cybersecurity ecosystem, with a goal of training 100,000 professionals across the continent."}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button to="/register" size="lg">
              {"Become a Hacker"}
            </Button>
            <Button to="/learn" variant="ghost" size="lg">
              {"Explore learning"}
            </Button>
          </div>

          {trained > 0 && (
            <p className="mt-2 type-label uppercase tracking-[0.12em] text-text-muted" role="text">
              <span className="font-black text-text-primary">{`${trained.toLocaleString()}`}</span>
              {' '}{"professionals trained"}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBlock;