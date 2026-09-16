import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import ScrollReveal from '@/shared/components/ScrollReveal';

interface PathDef {
  key: 'learn' | 'practice' | 'work';
  to: string;
}

const PATHS: PathDef[] = [
  { key: 'learn', to: '/learn' },
  { key: 'practice', to: '/labs' },
  { key: 'work', to: '/services' },
];

/**
 * PathBlock — the three ways into the platform. One card each, no filler
 * tiles, whole card is the interactive target.
 */
const PathBlock: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-surface">
      <div className="mx-auto w-full max-w-[1320px] px-3 py-20 md:px-4 md:py-24 lg:px-6">
        <ScrollReveal>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="type-label mb-1.5 uppercase tracking-[0.12em] text-accent">
                {t('landing3.paths.kicker')}
              </p>
              <h2 className="type-h2 text-3xl font-black uppercase tracking-tight text-text-primary md:text-5xl">
                {t('landing3.paths.title')}
              </h2>
              <p className="type-body mt-2 max-w-prose">{t('landing3.paths.description')}</p>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid gap-4 md:grid-cols-3">
          {PATHS.map((path, i) => (
            <ScrollReveal key={path.key} delay={i * 80}>
              <Card to={path.to} interactive className="flex min-h-[220px] flex-col gap-3 p-6">
                <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
                  {t(`landing3.paths.${path.key}.title`)}
                </h3>
                <p className="type-body-sm flex-1">{t(`landing3.paths.${path.key}.desc`)}</p>
                <span className="flex min-h-[48px] items-center gap-2 text-sm font-bold text-accent">
                  {t(`landing3.paths.${path.key}.cta`)}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PathBlock;