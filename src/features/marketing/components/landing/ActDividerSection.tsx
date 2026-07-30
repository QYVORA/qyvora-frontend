import React from 'react';
import { motion } from 'motion/react';

interface ActDividerSectionProps {
  number: string;
  title: string;
}

const ActDividerSection: React.FC<ActDividerSectionProps> = ({ number, title }) => (
  <div className="relative w-full h-full min-h-dvh md:h-dvh flex items-center justify-center px-3 md:px-4 lg:px-6">
    <div className="flex flex-col items-center gap-6 md:gap-8">
      <motion.span
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-[8rem] md:text-[12rem] lg:text-[16rem] font-black leading-none text-accent/8 select-none"
        style={{ color: 'rgba(6, 182, 111, 0.08)' }}
      >
        {number}
      </motion.span>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-3"
      >
        <div className="w-12 h-px bg-accent/30" />
        <h2 className="font-display text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-text-muted">
          {title}
        </h2>
      </motion.div>
    </div>
  </div>
);

export default ActDividerSection;
