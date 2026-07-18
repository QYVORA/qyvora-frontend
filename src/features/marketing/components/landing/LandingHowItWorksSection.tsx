import React from 'react';
import { BookOpen, Swords, Award } from 'lucide-react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import learnBg from '@/assets/sections/how-it-works/learn-bg.webp';
import practiceBg from '@/assets/sections/how-it-works/practice-bg.webp';
import proveBg from '@/assets/sections/how-it-works/prove-bg.webp';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import { useTranslation } from 'react-i18next';

const STEPS = [
  {
    icon: BookOpen,
    tKey: 'learn',
    bgImage: learnBg,
  },
  {
    icon: Swords,
    tKey: 'practice',
    bgImage: practiceBg,
  },
  {
    icon: Award,
    tKey: 'prove',
    bgImage: proveBg,
  },
];

const LandingHowItWorksSection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="relative w-full px-4 md:px-12 lg:px-16 bg-accent overflow-hidden" data-nav-invert>
      <GridBoxedBackground opacity={0.4} blur={0} mask="none" />
      <div className="relative z-10 w-full lg:max-w-6xl lg:mx-auto flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-16">
        <div className="md:w-[35%] lg:w-[38%] mb-6 md:mb-0 md:sticky md:top-32">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-bg tracking-tighter leading-none">
            {t('landing2.howItWorks.heading')}
          </h2>
        </div>

        <div className="md:w-[65%] lg:w-[62%]">
          <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <ScrollReveal key={step.tKey} direction="up" amount={0.1} delay={i * 0.1}>
                  <div className="relative rounded-2xl md:rounded-3xl border border-border/30 bg-accent-dim overflow-hidden group h-full snap-start shrink-0 w-[80vw] md:w-auto">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${step.bgImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-bg-card via-bg-card to-transparent dark:from-bg-card dark:via-bg-card/60 dark:to-transparent" />
                    <div className="relative z-10 p-6 sm:p-8 md:p-6 lg:p-8 flex flex-col items-start text-left h-full">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 md:w-7 md:h-7 text-accent" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-text-primary mb-2 tracking-tight">
                        {t(`landing2.howItWorks.steps.${step.tKey}.title`)}
                      </h3>
                      <p className="text-sm md:text-sm text-text-secondary leading-relaxed">
                        {t(`landing2.howItWorks.steps.${step.tKey}.desc`)}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHowItWorksSection;
