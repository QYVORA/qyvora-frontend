import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { IconArrowRight, IconTerminal, IconCode, IconNetwork } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';

const SIMULATIONS = [
  { id: 'terminal', slug: '/simulations/terminal', icon: IconTerminal },
  { id: 'ide', slug: '/simulations/ide', icon: IconCode },
  { id: 'network', slug: '/simulations/network-visualizer', icon: IconNetwork },
];

const SimulationsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="bg-bg min-h-full">
      <SEO title={t('simulations.metaTitle')} description={t('simulations.metaDescription')} />
      <PublicSnapLayout>
        <StudentHeroSection
          title={t('simulations.heroTitle')}
          accentWord={t('simulations.heroAccent')}
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description={t('simulations.heroDescription')}
          stats={[
            { label: t('simulations.statsTools'), value: SIMULATIONS.length },
            { label: t('simulations.statsNoAccount'), value: '0' },
          ]}
        >
          <Link
            to="/register"
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"
          >
            <Zap className="w-4 h-4" /> {t('simulations.startTraining')} <IconArrowRight size={14} />
          </Link>
        </StudentHeroSection>

        {SIMULATIONS.map((sim, idx) => (
          <PublicSnapSection key={sim.id}>
            <div className="flex flex-col gap-6 lg:gap-8">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <sim.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1 max-w-2xl">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">
                    {t(`simulations.${sim.id}.tag`)}
                  </span>
                  <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-text-primary tracking-tighter leading-tight mt-2">
                    {t(`simulations.${sim.id}.title`)}{' '}
                    <span className="text-accent">{t(`simulations.${sim.id}.titleAccent`)}</span>
                  </h2>
                  <p className="text-xs md:text-sm text-text-secondary leading-relaxed mt-3 font-mono max-w-xl">
                    {t(`simulations.${sim.id}.description`)}
                  </p>
                </div>
                <Link
                  to={sim.slug}
                  className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-2.5 shrink-0"
                >
                  {t('simulations.runDemo')} <IconArrowRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
                {(t(`simulations.${sim.id}.features`, { returnObjects: true }) as unknown as string[]).map((feature, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-border/20 bg-bg-card px-4 py-3.5 flex items-center gap-3"
                  >
                    <span className="w-5 h-5 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                      <Zap className="w-2.5 h-2.5 text-accent" />
                    </span>
                    <span className="text-[10px] md:text-[11px] font-mono text-text-secondary leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </PublicSnapSection>
        ))}

        <LandingFinalCtaSection user={user} />
        <Footer />
      </PublicSnapLayout>
    </div>
  );
};

export default SimulationsPage;
