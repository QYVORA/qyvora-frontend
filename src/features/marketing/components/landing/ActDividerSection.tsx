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
    <div className="relative w-full h-full min-h-dvh md:h-dvh flex items-center overflow-hidden bg-bg" data-nav-invert>
      <GridBoxedBackground opacity={0.4} blur={0} mask="none" />

      {/* Large faint number watermark */}
      <motion.span
        initial={{ opacity: 0, scale: 1.1 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-0 bottom-0 leading-none font-black select-none pointer-events-none"
        style={{
          fontSize: 'clamp(20rem, 50vw, 60rem)',
          color: 'rgba(6, 182, 111, 0.035)',
          lineHeight: '0.7',
        }}
      >
        {number}
      </motion.span>

      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-2 items-center">
        {/* Left content — text */}
        <motion.div
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start gap-4 md:gap-5 pt-20 md:pt-24 lg:pt-0"
        >
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.35em] text-accent"
          >
            {tagline}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-7xl font-black text-text-primary tracking-tight leading-[1.05]"
          >
            {title}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-12 h-0.5 bg-accent/50 origin-left"
          />

          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm md:text-base text-text-muted font-mono leading-relaxed max-w-md"
          >
            {description}
          </motion.p>
        </motion.div>

        {/* Right side — decorative */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex items-center justify-center h-full relative"
        >
          <div className="relative w-64 h-64 xl:w-80 xl:h-80">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border border-accent/10" />
            {/* Middle ring */}
            <div className="absolute inset-4 rounded-full border border-accent/15" />
            {/* Inner ring */}
            <div className="absolute inset-10 rounded-full border border-accent/20" />
            {/* Center dot */}
            <div className="absolute inset-[40%] rounded-full bg-accent/10" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ActDividerSection;
