import React from 'react';
import Button from '@/shared/components/ui/Button';
import type { BackendStats } from '@/features/marketing/components/landing/types';

interface HeroBlockProps {
  stats: BackendStats | null;
}

/**
 * HeroBlock — one audience statement, one real proof point, one primary CTA
 * and one secondary link. Clean typography; no canvas, no globe, no marquee.
 */
const HeroBlock: React.FC<HeroBlockProps> = ({ stats }) => {
  const trained = stats?.stats?.learnersTrained ?? 0;

  return (
    <section className="relative flex min-h-dvh w-full bg-canvas">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col justify-center px-3 py-24 pt-32 md:px-4 md:py-28 lg:px-6">
        <div className="flex flex-col items-start gap-6 md:gap-8">
          <p className="type-label uppercase tracking-[0.12em] text-accent">{"Africa's Offensive Security Platform"}</p>

          <h1 className="type-display text-4xl font-black uppercase tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            {"Train like an operator."}
            <span className="block text-accent">{"Prove it on-chain."}</span>
          </h1>

          <p className="max-w-2xl text-base text-text-secondary md:text-lg">
            {"Learn offensive security through structured courses, hands-on attack labs, and the Hacker Protocol Bootcamp. Earn CyberPoints that verify your skill — no experience required."}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button to="/register" size="lg">
              {"Start learning"}
            </Button>
            <Button to="/learn" variant="ghost" size="lg">
              {"Explore learning"}
            </Button>
          </div>

          {trained > 0 && (
<p className="mt-2 type-label uppercase tracking-[0.12em] text-text-tertiary" role="text">
  <span className="font-black text-text-primary">{`${trained}`}</span>
  {' '}{"operators trained"}
</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBlock;