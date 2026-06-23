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
}

const STATS_CONFIG: StatCard[] = [
  { icon: Users, label: 'Students Trained', description: 'Active learners across Africa', value: 3400, suffix: '+' },
  { icon: Trophy, label: 'CP Earned', description: 'On-chain credentials awarded', value: 1250000, suffix: '+' },
  { icon: GraduationCap, label: 'Bootcamp Registrants', description: 'Enrolled in structured programs', value: 1200, suffix: '+' },
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

const LandingStatsSection: React.FC = () => {
  const { stats } = useLandingData();
  const s = stats?.stats || {};

  const resolvedStats: StatCard[] = STATS_CONFIG.map((card, idx) => {
    const apiValues = [
      s.learnersTrained ?? 3400,
      s.totalCpEarned ?? 1250000,
      s.bootcampsCount ?? 1200,
    ];
    return { ...card, value: apiValues[idx] || card.value };
  });

  return (
    <div className="w-full h-full flex flex-col justify-center px-4 md:px-12 lg:px-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={containerVariants}
      >
        <motion.div variants={cardVariants} className="text-center mb-10 md:mb-16">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-text-primary tracking-tighter leading-none">
            Built for <span className="text-accent">Impact</span>
          </h2>
          <p className="mt-4 text-sm md:text-lg text-text-muted max-w-xl mx-auto">
            Real metrics from real operators across the continent
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 lg:gap-12 max-w-6xl mx-auto">
          {resolvedStats.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                variants={cardVariants}
                className="group relative rounded-2xl md:rounded-3xl border border-border/30 bg-bg-card"
              >
                <div className="p-6 md:p-8 lg:p-10 text-center md:text-left">
                  <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 md:mb-6 mx-auto md:mx-0 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-accent" />
                  </div>
                  <div className="text-5xl md:text-6xl lg:text-7xl font-black text-text-primary font-mono tracking-tighter mb-2 leading-none">
                    <StatCounter end={card.value} suffix={card.suffix} />
                  </div>
                  <h3 className="text-sm md:text-base lg:text-lg font-black text-text-primary mb-1 tracking-tight">
                    {card.label}
                  </h3>
                  <p className="text-xs md:text-sm text-text-muted/60">
                    {card.description}
                  </p>
                </div>
                <div className="mx-6 md:mx-8 lg:mx-10 h-px bg-border/50" />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default LandingStatsSection;
