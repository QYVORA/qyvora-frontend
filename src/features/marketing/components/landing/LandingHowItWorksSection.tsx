import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Swords, Award, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    icon: BookOpen,
    title: 'Learn',
    subtitle: 'Master the fundamentals',
    description: 'Start with structured modules covering offensive security foundations — from Linux to web exploitation. Every concept is backed by real-world scenarios.',
    detail: 'Self-paced modules · Interactive labs · Expert mentorship',
  },
  {
    icon: Swords,
    title: 'Practice',
    subtitle: 'Apply in live environments',
    description: 'Step into simulated attack labs. Execute real exploits, capture flags, and chain vulnerabilities in isolated environments that mirror production systems.',
    detail: 'Capture The Flag · Red vs Blue · Real-time feedback',
  },
  {
    icon: Award,
    title: 'Prove',
    subtitle: 'Earn credentials that matter',
    description: 'Complete rooms to earn CP — the on-chain credential that validates your expertise. Build a verifiable track record of offensive security proficiency.',
    detail: 'On-chain credentials · Verifiable skills · Career pathway',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const LandingHowItWorksSection: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center px-4 md:px-12 lg:px-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="max-w-7xl mx-auto w-full"
      >
        <motion.div variants={stepVariants} className="text-center mb-12 md:mb-16">
          <span className="inline-block text-xs md:text-sm font-black uppercase tracking-[0.35em] text-accent mb-4">
            Your Path
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-text-primary tracking-tighter leading-none">
            Learn. <span className="text-accent">Practice.</span> Prove.
          </h2>
          <p className="mt-4 text-sm md:text-lg text-text-muted max-w-xl mx-auto">
            A structured journey from novice to offensive security operator
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                variants={stepVariants}
                className="group relative"
              >
                {idx < STEPS.length - 1 && (
                  <div className="hidden md:flex absolute top-1/3 -right-5 lg:-right-6 z-20">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-accent" />
                    </div>
                  </div>
                )}

                <div className="relative h-full rounded-2xl md:rounded-3xl border border-border/30 bg-bg-card transition-all duration-300 hover:border-accent/25 hover:shadow-xl hover:shadow-accent/5">

                  <div className="absolute -top-4 -right-4 text-[120px] md:text-[160px] font-black text-accent/[0.04] select-none leading-none pointer-events-none">
                    {String(idx + 1).padStart(2, '0')}
                  </div>

                  <div className="relative z-10 p-7 md:p-8 lg:p-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-black text-bg">{String(idx + 1).padStart(2, '0')}</span>
                      </div>
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 group-hover:scale-105 transition-all duration-300">
                        <Icon className="w-7 h-7 md:w-8 md:h-8 text-accent" />
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-text-primary mb-2 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-accent/70 mb-3">
                      {step.subtitle}
                    </p>
                    <p className="text-sm md:text-base text-text-muted leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <div className="pt-4 border-t border-border/20">
                      <p className="text-[11px] md:text-xs text-text-muted/50 font-bold uppercase tracking-widest">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default LandingHowItWorksSection;
