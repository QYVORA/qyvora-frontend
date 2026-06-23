import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Swords, Award, ArrowDown, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    icon: BookOpen,
    title: 'Learn',
    subtitle: 'Master the fundamentals',
    description: 'Start with structured modules covering offensive security foundations — from Linux to web exploitation. Every concept is backed by real-world scenarios.',
    color: 'from-accent/20 to-accent/5',
    accent: 'bg-accent',
    number: '01',
  },
  {
    icon: Swords,
    title: 'Practice',
    subtitle: 'Apply in live environments',
    description: 'Step into simulated attack labs. Execute real exploits, capture flags, and chain vulnerabilities in isolated environments that mirror production systems.',
    color: 'from-accent/15 to-accent/5',
    accent: 'bg-accent',
    number: '02',
  },
  {
    icon: Award,
    title: 'Prove',
    subtitle: 'Earn credentials that matter',
    description: 'Complete rooms to earn CP — the on-chain credential that validates your expertise. Build a verifiable track record of offensive security proficiency.',
    color: 'from-accent/25 to-accent/5',
    accent: 'bg-accent',
    number: '03',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const LandingHowItWorksSection: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={containerVariants}
        className="text-center mb-12 md:mb-16"
      >
        <motion.span
          variants={stepVariants}
          className="inline-block text-xs font-black uppercase tracking-[0.35em] text-accent mb-3"
        >
          Your Path
        </motion.span>
        <motion.h2
          variants={stepVariants}
          className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter"
        >
          Learn. Practice. <span className="text-accent">Prove.</span>
        </motion.h2>
        <motion.p
          variants={stepVariants}
          className="mt-3 text-sm md:text-base text-text-muted max-w-2xl mx-auto"
        >
          A structured journey from novice to offensive security operator
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={containerVariants}
        className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12"
      >
        {/* Desktop connector line */}
        <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent -translate-y-1/2" />

        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              variants={stepVariants}
              className="relative flex flex-col items-center text-center"
            >
              {/* Mobile connector */}
              {idx < STEPS.length - 1 && (
                <div className="md:hidden flex items-center justify-center py-3">
                  <ArrowDown className="w-5 h-5 text-accent/40" />
                </div>
              )}

              {/* Step number badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/20 z-10">
                <span className="text-[11px] font-black text-bg">{step.number}</span>
              </div>

              {/* Card */}
              <div className="relative w-full rounded-2xl border border-border/40 bg-bg-card p-6 md:p-8 pt-10 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 group">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${step.color} opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors group-hover:scale-105 duration-300">
                    <Icon className="w-7 h-7 md:w-8 md:h-8 text-accent" />
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-text-primary mb-1 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-[11px] font-black uppercase tracking-widest text-accent/70 mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Desktop arrow connector between cards */}
              {idx < STEPS.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-5 lg:-right-7 translate-y-[-50%] z-20">
                  <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 text-accent/50" />
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default LandingHowItWorksSection;
