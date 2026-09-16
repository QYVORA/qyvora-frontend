import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const trained = stats?.stats?.learnersTrained ?? 0;

  return (
    <section className="relative flex min-h-dvh w-full bg-canvas">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col justify-center px-3 py-24 pt-32 md:px-4 md:py-28 lg:px-6">
        <div className="flex flex-col items-start gap-6 md:gap-8">
          <p className="type-label uppercase tracking-[0.12em] text-accent">{t('landing3.hero.kicker')}</p>

          <h1 className="type-display text-4xl font-black uppercase tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            {t('landing3.hero.title')}
            <span className="block text-accent">{t('landing3.hero.titleAccent')}</span>
          </h1>

          <p className="max-w-2xl text-base text-text-secondary md:text-lg">
            {t('landing3.hero.description')}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button to="/register" size="lg">
              {t('landing3.hero.primaryCta')}
            </Button>
            <Button to="/learn" variant="ghost" size="lg">
              {t('landing3.hero.secondaryCta')}
            </Button>
          </div>

          {trained > 0 && (
<p className="mt-2 type-label uppercase tracking-[0.12em] text-text-tertiary" role="text">
  <span className="font-black text-text-primary">{t('landing3.hero.proofCount', { count: trained })}</span>
  {' '}{t('landing3.hero.proofLabel')}
</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBlock;