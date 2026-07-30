import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { GridBoxedBackground } from '@/shared/components/backgrounds';

interface ActDividerSectionProps {
  number: string;
  title: string;
  tagline: string;
  description: string;
}

const ActDividerSection: React.FC<ActDividerSectionProps> = ({ number, title, tagline, description }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative w-full h-full min-h-dvh md:h-dvh flex items-center justify-center overflow-hidden bg-bg" data-nav-invert>
      <GridBoxedBackground opacity={0.3} blur={0} mask="none" />

      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-6 md:gap-8"
        >
          <span
            className="font-black leading-none text-accent select-none text-[8rem] md:text-[12rem] lg:text-[16rem]"
            style={{ color: 'rgba(6, 182, 111, 0.06)' }}
          >
            {number}
          </span>

          <div className="flex flex-col items-center gap-3 -mt-4 md:-mt-6">
            <motion.span
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.35em] text-accent"
            >
              {tagline}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tight text-center"
            >
              {title}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-16 h-px bg-accent/40 mt-1"
            />

            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm md:text-base text-text-muted font-mono leading-relaxed max-w-lg text-center"
            >
              {description}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ActDividerSection;
