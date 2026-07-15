import React from 'react';
import { motion } from 'motion/react';
import { Trophy, GraduationCap } from 'lucide-react';
import { useLandingData } from '@/features/marketing/hooks/useLandingData';
import StatCounter from '@/shared/components/ui/StatCounter';
import { Skeleton } from '@/shared/components/ui';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import { useTranslation } from 'react-i18next';

interface StatCard {
  icon: React.ElementType;
  tKey: string;
  value: number;
  suffix: string;
}

const STATS_CONFIG: Omit<StatCard, 'value'>[] = [
  { icon: Trophy, tKey: 'cpEarned', suffix: '+' },
  { icon: GraduationCap, tKey: 'bootcampRegistrants', suffix: '+' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const SectionHeader: React.FC = () => {
  const { t } = useTranslation();
  return (
    <motion.div variants={cardVariants} className="text-left md:text-right">
      <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-bg tracking-tighter leading-none">
        {t('landing.stats.heading')}
      </h2>
      <p className="mt-4 text-sm md:text-lg text-bg/60 max-w-xl md:ml-auto md:mr-0">
        {t('landing.stats.description')}
      </p>
    </motion.div>
  );
};

const SectionShell: React.FC<{ header: React.ReactNode; cards: React.ReactNode }> = ({ header, cards }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-80px' }}
    variants={containerVariants}
    className="w-full h-full px-4 md:px-12 lg:px-16"
  >
    <div className="w-full lg:max-w-6xl lg:mx-auto flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-16">
      <div className="md:w-[35%] lg:w-[38%] mb-6 md:mb-0 md:sticky md:top-32 md:order-2 md:text-right">
        {header}
      </div>
      <div className="md:w-[65%] lg:w-[62%] md:order-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {cards}
        </div>
      </div>
    </div>
  </motion.div>
);

const LandingStatsSection: React.FC = () => {
  const { t } = useTranslation();
  const { stats, loading } = useLandingData();
  const s = stats?.stats;

  const values = s ? [s.cpPoolSize, s.bootcampsCount] : [];
  const hasValidData = s && values.every((v) => v != null);

  if (loading && !s) {
    return (
      <div className="relative bg-accent overflow-hidden" data-nav-invert>
        <GridBoxedBackground opacity={0.4} blur={0} mask="none" />
        <div className="relative z-10">
        <SectionShell
          header={<SectionHeader />}
          cards={STATS_CONFIG.map((card) => (
            <div key={card.tKey} className="rounded-2xl border border-border/30 bg-accent-dim overflow-hidden">
              <div className="p-4 sm:p-5 space-y-3">
                <Skeleton variant="icon" className="w-10 h-10 bg-border/30" />
                <Skeleton variant="stat-value" className="h-8 w-28 bg-border/30" />
                <Skeleton className="h-3 w-20 bg-border/30" />
                <Skeleton className="h-2.5 w-36 bg-border/30" />
              </div>
            </div>
          ))}
        />
        </div>
      </div>
    );
  }

  if (!s || !hasValidData) {
    return (
      <div className="relative bg-accent overflow-hidden" data-nav-invert>
        <GridBoxedBackground opacity={0.4} blur={0} mask="none" />
        <div className="relative z-10">
        <SectionShell
          header={<SectionHeader />}
          cards={STATS_CONFIG.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.tKey} className="rounded-2xl border border-border/30 bg-accent-dim overflow-hidden">
                <div className="p-4 sm:p-5 flex flex-col items-start text-left">
                  <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-bg/40" />
                  </div>
                  <div className="text-3xl font-black text-text-primary font-mono tracking-tighter mb-1 leading-none">&mdash;</div>
                  <h3 className="text-xs font-black text-text-primary mb-0.5 tracking-tight">{t(`landing.stats.${card.tKey}.label`)}</h3>
                  <p className="text-xs text-bg/60">{t(`landing.stats.${card.tKey}.desc`)}</p>
                </div>
              </div>
            );
          })}
        />
        </div>
      </div>
    );
  }

  const resolvedStats: StatCard[] = STATS_CONFIG.map((card, idx) => ({ ...card, value: values[idx] }));

  return (
    <div className="relative bg-accent overflow-hidden" data-nav-invert>
      <GridBoxedBackground opacity={0.4} blur={0} mask="none" />
      <div className="relative z-10">
      <SectionShell
        header={<SectionHeader />}
        cards={resolvedStats.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.tKey}
              variants={cardVariants}
              className="group rounded-2xl border border-border/30 bg-accent-dim overflow-hidden"
            >
              <div className="p-4 sm:p-5 flex flex-col items-start text-left">
                <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-all duration-300">
                  <Icon className="w-5 h-5 text-bg" />
                </div>
                <div className="text-2xl md:text-3xl font-black text-text-primary font-mono tracking-tighter mb-1 leading-none">
                  <StatCounter end={card.value} suffix={card.suffix} className="text-bg" />
                </div>
                <h3 className="text-xs font-black text-text-primary mb-0.5 tracking-tight">
                  {t(`landing.stats.${card.tKey}.label`)}
                </h3>
                <p className="text-xs text-bg/60 leading-relaxed">
                  {t(`landing.stats.${card.tKey}.desc`)}
                </p>
              </div>
            </motion.div>
          );
        })}
      />
      </div>
    </div>
  );
};

export default LandingStatsSection;
