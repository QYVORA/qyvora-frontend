import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import PublicHeroSection from '@/shared/components/PublicHeroSection';
import { IconArrowRight } from '@/shared/components/icons';
import { Carousel } from '@/shared/components/carousel';

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
      <div className="relative w-full h-full flex flex-col gap-6 md:gap-8">
        {/* Header */}
        <div className="space-y-4 md:space-y-5 shrink-0">
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
            className="text-sm md:text-base text-text-muted font-mono leading-relaxed max-w-lg"
          >
            {description}
          </motion.p>
        </div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 min-h-0 flex items-center"
        >
          <Carousel
            slides={items.map((item, idx) => ({ ...item, id: `act-item-${idx}` }))}
            showArrows={false}
            className="w-full max-w-3xl"
            renderCard={(item) => {
              // Special handling for CP icon - no border wrapper
              const isCpIcon = item.label.toLowerCase().includes('cp') || item.label.toLowerCase().includes('cyber');
              
              return (
                <Link
                  to={item.to}
                  className="group relative flex flex-col bg-bg-card p-6 md:p-8 transition-[background-color] duration-[var(--dur-base)] ease-[var(--ease-smooth)] hover:bg-bg-elevated h-[280px] md:h-[320px]"
                >
                  {isCpIcon ? (
                    // CP icon standalone - no border wrapper
                    <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 mb-5 flex items-center justify-center">
                      <item.icon size={64} className="w-full h-full md:w-20 md:h-20" />
                    </div>
                  ) : (
                    // Other icons with border wrapper
                    <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl flex items-center justify-center bg-accent/10 border border-accent/20 group-hover:bg-accent/15 transition-colors mb-5">
                      <item.icon size={24} className="text-accent md:w-7 md:h-7" />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col">
                    <span className="flex items-center gap-2 text-base md:text-lg font-black uppercase tracking-tight text-text-primary group-hover:text-accent transition-colors mb-3">
                      {item.label}
                      <IconArrowRight size={16} className="shrink-0 text-text-muted transition-[color,transform] duration-[var(--dur-base)] ease-[var(--ease-smooth)] group-hover:translate-x-0.5 group-hover:text-accent" />
                    </span>
                    <p className="text-sm md:text-base text-text-muted leading-relaxed flex-1">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            }}
          />
        </motion.div>
      </div>
    </PublicHeroSection>
  );
};

export default React.memo(ActDividerSection);
