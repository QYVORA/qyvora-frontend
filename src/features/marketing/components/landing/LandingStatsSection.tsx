import React from 'react';
import { motion } from 'motion/react';
import { Shield, Users, Code2, Target, Zap, Trophy } from 'lucide-react';
import { useLandingData } from '@/features/marketing/hooks/useLandingData';
import StatCounter from '@/shared/components/ui/StatCounter';

interface StatCard {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix: string;
  color: string;
}

const STATS_CONFIG: StatCard[] = [
  { icon: Target, label: 'Vulnerabilities Identified', value: 847, suffix: '+', color: 'from-red-500/20 to-red-600/10' },
  { icon: Trophy, label: 'Total CP Earned', value: 1250000, suffix: '+', color: 'from-amber-500/20 to-amber-600/10' },
  { icon: Users, label: 'Learners Trained', value: 3400, suffix: '+', color: 'from-emerald-500/20 to-emerald-600/10' },
  { icon: Zap, label: 'Active Pentesters', value: 180, suffix: '+', color: 'from-violet-500/20 to-violet-600/10' },
  { icon: Shield, label: 'Companies Secured', value: 52, suffix: '+', color: 'from-cyan-500/20 to-cyan-600/10' },
  { icon: Code2, label: 'Bootcamp Graduates', value: 1200, suffix: '+', color: 'from-rose-500/20 to-rose-600/10' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const LandingStatsSection: React.FC = () => {
  const { stats } = useLandingData();
  const s = stats?.stats || {};

  const resolvedStats: StatCard[] = STATS_CONFIG.map((card, idx) => {
    const apiValues = [
      s.vulnerabilitiesIdentified ?? 847,
      s.totalCpEarned ?? 1250000,
      s.learnersTrained ?? 3400,
      s.pentestersActive ?? 180,
      s.studentsCount ?? 52,
      s.bootcampsCount ?? 1200,
    ];
    return { ...card, value: apiValues[idx] || card.value };
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={containerVariants}
        className="text-center mb-10 md:mb-14"
      >
        <motion.span
          variants={cardVariants}
          className="inline-block text-xs font-black uppercase tracking-[0.35em] text-accent mb-3"
        >
          By The Numbers
        </motion.span>
        <motion.h2
          variants={cardVariants}
          className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter"
        >
          Africa's Offensive Security Platform
        </motion.h2>
        <motion.p
          variants={cardVariants}
          className="mt-3 text-sm md:text-base text-text-muted max-w-2xl mx-auto"
        >
          Real impact across the continent — from classrooms to boardrooms
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={containerVariants}
        className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5"
      >
        {resolvedStats.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              variants={cardVariants}
              className="group relative rounded-2xl border border-border/40 bg-bg-card p-5 md:p-7 overflow-hidden transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary font-mono tracking-tighter mb-1">
                  <StatCounter end={card.value} suffix={card.suffix} />
                </div>
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-text-muted/70">
                  {card.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default LandingStatsSection;
