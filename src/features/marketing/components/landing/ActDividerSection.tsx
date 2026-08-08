import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import PublicHeroSection from '@/shared/components/PublicHeroSection';
import { IconArrowRight } from '@/shared/components/icons';

interface ActDividerItem {
  icon: React.ElementType;
  label: string;
  description: string;
  to: string;
}

interface ActDividerSectionProps {
  title: string;
  accentWord?: string;
  description: string;
  items: ActDividerItem[];
}

const ActDividerSection: React.FC<ActDividerSectionProps> = ({ title, accentWord, description, items }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <PublicHeroSection showGlobe mask="right">
      <div className="relative w-full space-y-5 sm:space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-text-primary tracking-tight leading-[1.05]"
        >
          {title}{' '}
          {accentWord && <span className="text-accent">{accentWord}</span>}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-12 h-0.5 bg-accent/50 origin-left"
        />

        <motion.p
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm md:text-base text-text-muted font-mono leading-relaxed max-w-md"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3 pt-2 sm:pt-4 max-w-xl"
        >
          {items.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="group relative flex items-start gap-3 rounded-2xl border border-border/30 bg-bg-card p-3 md:p-4 transition-all duration-300 hover:border-accent/30"
            >
              <div className="w-8 h-8 shrink-0 rounded-xl flex items-center justify-center bg-accent/10 border border-accent/20">
                <item.icon size={16} className="text-accent" />
              </div>
              <div className="min-w-0">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-primary group-hover:text-accent transition-colors">
                  {item.label}
                  <IconArrowRight size={12} className="text-text-muted group-hover:text-accent transition-colors shrink-0" />
                </span>
                <p className="text-[10px] text-text-muted leading-relaxed mt-1 line-clamp-2">{item.description}</p>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </PublicHeroSection>
  );
};

export default ActDividerSection;
