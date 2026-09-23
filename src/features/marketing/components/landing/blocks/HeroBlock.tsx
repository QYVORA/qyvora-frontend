import React from 'react';
import Button from '@/shared/components/ui/Button';
import TypewriterText from '@/shared/components/TypewriterText';
import Dobia from '@/shared/components/Dobia';
import type { BackendStats } from '@/features/marketing/components/landing/types';

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

/**
 * HeroBlock — retargeted around the QYVORA tagline ("Train like a hacker,
 * become a hacker") with a typewriter rotation, plus the mission and the
 * 100,000-professionals goal. One statement, one real proof point, one
 * primary CTA and one secondary link.
 *
 * The mascot avatar is the hero's background composition on desktop — it
 * reads as a supported visual, not chrome squeezed into a corner. On mobile
 * it drops behind the reading column with a soft fade so the headline stays
 * primary.
 */
const HeroBlock: React.FC<HeroBlockProps> = ({ stats }) => {
  const trained = stats?.stats?.learnersTrained ?? 0;

  return (
    <section className="relative flex min-h-dvh w-full overflow-hidden bg-canvas">
      {/* Avatar background composition — desktop reads it as the hero's visual, mobile it sinks behind the copy */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute right-[-6%] top-1/2 -translate-y-1/2 hidden opacity-80 lg:block">
          <Dobia expression="success" size="hero" />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex justify-center opacity-25 lg:hidden">
          <Dobia expression="idle" size="xl" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/85 to-transparent" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1320px] flex-col justify-center px-3 py-24 pt-32 md:px-4 md:py-28 lg:px-6">
        <div className="flex max-w-2xl flex-col items-start gap-6 md:gap-8">
          <p className="type-label uppercase tracking-[0.12em] text-accent">{"Africa's Offensive Security Platform"}</p>

          <h1 className="type-display text-4xl font-black uppercase tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            <span className="block">{"Train like a hacker,"}</span>
            <span className="block min-h-[1.06em] text-accent">
              <TypewriterText words={ROTATING_WORDS} />
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