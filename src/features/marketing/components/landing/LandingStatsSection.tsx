import React from 'react';
import { motion } from 'motion/react';
import { Users, Trophy, GraduationCap } from 'lucide-react';
import { useLandingData } from '@/features/marketing/hooks/useLandingData';
import StatCounter from '@/shared/components/ui/StatCounter';

interface StatCard {
  icon: React.ElementType;
  label: string;
  description: string;
  value: number;
  suffix: string;
  bgImage: string;
}

const STATS_CONFIG: Omit<StatCard, 'value'>[] = [
  { icon: Users, label: 'Students Trained', description: 'Active learners across Africa', suffix: '+', bgImage: '/assets/sections/stats/students-bg.png' },
  { icon: Trophy, label: 'CP Earned', description: 'On-chain credentials awarded', suffix: '+', bgImage: '/assets/sections/stats/cp-earned-bg.png' },
  { icon: GraduationCap, label: 'Bootcamp Registrants', description: 'Enrolled in structured programs', suffix: '+', bgImage: '/assets/sections/stats/bootcamp-bg.png' },
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

const SkeletonCard: React.FC = () => (
  <div className="relative rounded-2xl md:rounded-3xl border border-border/30 bg-accent-dim overflow-hidden min-h-[200px]">
    <div className="p-6 sm:p-8 space-y-4">
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-border/30 animate-pulse" />
      <div className="h-10 w-32 md:w-36 bg-border/30 rounded-lg animate-pulse" />
      <div className="h-4 w-24 bg-border/30 rounded animate-pulse" />
      <div className="h-3 w-44 bg-border/30 rounded animate-pulse" />
    </div>
  </div>
);

const EmptyStatCard: React.FC<{ card: Omit<StatCard, 'value'> }> = ({ card }) => {
  const Icon = card.icon;
  return (
    <div className="relative rounded-2xl md:rounded-3xl border border-border/30 bg-accent-dim overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center hidden dark:block"
        style={{ backgroundImage: `url(${card.bgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-bg-card via-bg-card to-transparent dark:from-bg-card dark:via-bg-card/60 dark:to-transparent" />
      <div className="relative z-10 p-6 sm:p-8 md:p-6 lg:p-8 flex flex-col items-start text-left">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 md:w-7 md:h-7 text-accent/40" />
        </div>
        <div className="text-5xl md:text-6xl lg:text-7xl font-black text-white font-mono tracking-tighter mb-2 leading-none">
          —
        </div>
        <h3 className="text-sm md:text-base lg:text-lg font-black text-white mb-1 tracking-tight">
          {card.label}
        </h3>
        <p className="text-xs md:text-sm text-white/60">
          {card.description}
        </p>
      </div>
    </div>
  );
};

const SectionHeader: React.FC = () => (
  <motion.div variants={cardVariants} className="text-center md:text-right">
    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-text-primary tracking-tighter leading-none">
      Built for <span className="text-accent">Impact</span>
    </h2>
    <p className="mt-4 text-sm md:text-lg text-text-muted max-w-xl mx-auto md:ml-auto md:mr-0">
      Real metrics from real operators across the continent
    </p>
  </motion.div>
);

const StatCardsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
    {children}
  </div>
);

const SectionShell: React.FC<{ header: React.ReactNode; cards: React.ReactNode }> = ({ header, cards }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-80px' }}
    variants={containerVariants}
    className="w-full h-full px-4 md:px-12 lg:px-16"
  >
    <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-16">
      <div className="md:w-[65%] lg:w-[62%] md:order-1">
        {cards}
      </div>
      <div className="md:w-[35%] lg:w-[38%] text-center md:text-right mb-8 md:mb-0 md:sticky md:top-32 md:order-2">
        {header}
      </div>
    </div>
  </motion.div>
);

const LandingStatsSection: React.FC = () => {
  const { stats, loading } = useLandingData();
  const s = stats?.stats;

  if (!s && loading) {
    return (
      <SectionShell
        header={<SectionHeader />}
        cards={
          <StatCardsWrapper>
            {STATS_CONFIG.map((card) => (
              <SkeletonCard key={card.label} />
            ))}
          </StatCardsWrapper>
        }
      />
    );
  }

  if (!s) {
    return (
      <SectionShell
        header={<SectionHeader />}
        cards={
          <StatCardsWrapper>
            {STATS_CONFIG.map((card) => (
              <EmptyStatCard key={card.label} card={card} />
            ))}
          </StatCardsWrapper>
        }
      />
    );
  }

  const values = [s.learnersTrained, s.cpPoolSize, s.bootcampsCount];
  if (values.some((v) => v == null)) {
    return (
      <SectionShell
        header={<SectionHeader />}
        cards={
          <StatCardsWrapper>
            {STATS_CONFIG.map((card) => (
              <EmptyStatCard key={card.label} card={card} />
            ))}
          </StatCardsWrapper>
        }
      />
    );
  }

  const resolvedStats: StatCard[] = STATS_CONFIG.map((card, idx) => ({
    ...card,
    value: values[idx],
  }));

  return (
    <SectionShell
      header={<SectionHeader />}
      cards={
        <StatCardsWrapper>
          {resolvedStats.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                variants={cardVariants}
                className="group relative rounded-2xl md:rounded-3xl border border-border/30 bg-accent-dim overflow-hidden"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center hidden dark:block"
                  style={{ backgroundImage: `url(${card.bgImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-bg-card via-bg-card to-transparent dark:from-bg-card dark:via-bg-card/60 dark:to-transparent" />
                <div className="relative z-10 p-6 sm:p-8 md:p-6 lg:p-8 flex flex-col items-start text-left h-full">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-accent" />
                  </div>
                  <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-mono tracking-tighter mb-2 leading-none">
                    <StatCounter end={card.value} suffix={card.suffix} className="text-white" />
                  </div>
                  <h3 className="text-sm md:text-base lg:text-lg font-black text-white mb-1 tracking-tight">
                    {card.label}
                  </h3>
                  <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </StatCardsWrapper>
      }
    />
  );
};

export default LandingStatsSection;
