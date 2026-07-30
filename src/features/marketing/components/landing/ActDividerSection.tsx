import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import PublicHeroSection from '@/shared/components/PublicHeroSection';

interface ActDividerSectionProps {
  number: string;
  title: string;
  tagline: string;
  description: string;
}

const ActDividerSection: React.FC<ActDividerSectionProps> = ({ number, title, tagline, description }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <PublicHeroSection showGlobe mask="right">
      {/* Large faint number watermark */}
      <motion.span
        initial={{ opacity: 0, scale: 1.1 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 top-0 leading-none font-black select-none pointer-events-none -translate-y-1/4"
        style={{
          fontSize: 'clamp(8rem, 20vw, 24rem)',
          color: 'rgba(6, 182, 111, 0.04)',
        }}
      >
        {number}
      </motion.span>

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
        className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-text-primary tracking-tight leading-[1.05]"
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
    </PublicHeroSection>
  );
};

export default ActDividerSection;
