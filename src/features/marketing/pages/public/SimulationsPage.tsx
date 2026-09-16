import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import Button from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { IconTerminal, IconCode, IconNetwork } from '@/shared/components/icons';

type SimKey = 'terminal' | 'ide' | 'network';

const SIMULATIONS: {
  id: SimKey;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'terminal', slug: '/simulations/terminal', icon: IconTerminal },
  { id: 'ide', slug: '/simulations/ide', icon: IconCode },
  { id: 'network', slug: '/simulations/network-visualizer', icon: IconNetwork },
];

const SimulationsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-canvas">
      <SEO title={t('simulations.metaTitle')} description={t('simulations.metaDescription')} />
      <div className="w-full px-3 pb-20 pt-24 md:px-4 md:pb-24 md:pt-28 lg:px-6 lg:pt-32">
        <PageHeader
          kicker={t('simulations.kicker', 'QYVORA · Tools')}
          title={t('simulations.heroTitle')}
          description={t('simulations.heroDescription')}
          actions={
            <Button to="/register">
              {t('simulations.startTraining')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SIMULATIONS.map((sim) => {
            const Icon = sim.icon;
            const features = (t(`simulations.${sim.id}.features`, {
              returnObjects: true,
            }) as unknown as string[]) ?? [];
            return (
              <ScrollReveal key={sim.id}>
                <Card interactive className="flex h-full min-h-[240px] flex-col gap-3 p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle bg-surface-raised text-accent">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
                    {t(`simulations.${sim.id}.title`)}
                  </h3>
                  <p className="type-body-sm flex-1">{t(`simulations.${sim.id}.description`)}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {features.slice(0, 3).map((feature, i) => (
                      <span key={i} className="type-meta rounded-md border border-border-subtle bg-surface-raised px-2 py-1">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Button to={sim.slug} variant="secondary" size="sm">
                    {t('simulations.runDemo')}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SimulationsPage;