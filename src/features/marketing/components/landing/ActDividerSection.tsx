import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import PublicHeroSection from '@/shared/components/PublicHeroSection';
import { IconArrowRight } from '@/shared/components/icons';
import { useTranslation } from 'react-i18next';

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
  /** Render the animated HackerGlobe backdrop. Off for dense sections — the
   * canvas rAF loop degrades snap-scroll smoothness and crowds the cards. */
  showGlobe?: boolean;
}

const ActDividerSection: React.FC<ActDividerSectionProps> = ({ title, accentWord, description, items, showGlobe = false }) => {
  const shouldReduceMotion = useReducedMotion();
  const { t } = useTranslation();
  // 4+ items render as a 2x2 grid — use a tighter vertical rhythm so the
  // whole stack stays inside the section's fixed lg:h-dvh viewport.
  const isCompact = items.length > 3;

  return (
    <PublicHeroSection showGlobe={showGlobe} mask="right">
      <div className={`relative w-full ${isCompact ? 'space-y-4 sm:space-y-5' : 'space-y-5 sm:space-y-6'}`}>
        <motion.h2
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-2xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tighter leading-none"
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
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`grid grid-cols-1 ${isCompact ? 'sm:grid-cols-2 gap-3' : 'sm:grid-cols-3 gap-3 md:gap-4'} pt-2 max-w-2xl`}
        >
          {items.map((item, i) => (
            <Link
              key={item.label}
              to={item.to}
              className={`group relative flex flex-col card-accent bg-bg-card ${isCompact ? 'p-4' : 'p-4 sm:p-5'} transition-all duration-300 hover:shadow-[var(--card-shadow)]`}
            >
              <div className={`flex items-center justify-between ${isCompact ? 'mb-2.5' : 'mb-3 sm:mb-4'}`}>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center bg-accent/10 border border-accent/20 group-hover:bg-accent/15 transition-colors">
                  <item.icon size={20} className="text-accent" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted/70">
                  0{i + 1}
                </span>
              </div>
              <span className="text-sm sm:text-base font-black uppercase tracking-tight text-text-primary group-hover:text-accent transition-colors">
                {item.label}
              </span>
              <p className={`text-[11px] sm:text-xs text-text-muted leading-relaxed flex-1 ${isCompact ? 'line-clamp-2 mt-1.5 mb-3' : 'mt-2 mb-4 sm:mb-5'}`}>
                {item.description}
              </p>
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent">
                {t('button.explore')}
                <IconArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </motion.div>
      </div>
    </PublicHeroSection>
  );
};

export default ActDividerSection;
