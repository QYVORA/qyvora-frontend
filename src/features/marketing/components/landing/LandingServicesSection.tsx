import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { IconShield, IconCheck, IconArrowRight } from '@/shared/components/icons';
import { openServiceRequestModal } from '../ServiceRequestModal';
import { useTranslation } from 'react-i18next';

const SERVICES = [
  {
    id: 'basic',
    tKey: 'basic',
    featured: false,
    featureKeys: ['webAppAssessment', 'scanning', 'owasp', 'report'],
  },
  {
    id: 'standard',
    tKey: 'standard',
    featured: true,
    featureKeys: ['webMobile', 'authTesting', 'businessLogic', 'report'],
  },
  {
    id: 'bootcamp',
    tKey: 'bootcamp',
    featured: false,
    featureKeys: ['curriculum', 'exercises', 'phishing', 'progress'],
  },
];

const LandingServicesSection: React.FC = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const featuredMeta = SERVICES.find((s) => s.featured)!;
  const supportingMeta = SERVICES.filter((s) => !s.featured);
  const featured = {
    ...featuredMeta,
    tier: t(`landing.services.${featuredMeta.tKey}.tier`),
    price: t(`landing.services.${featuredMeta.tKey}.price`),
    subtitle: t(`landing.services.${featuredMeta.tKey}.subtitle`),
    features: featuredMeta.featureKeys.map((fk) => t(`landing.services.${featuredMeta.tKey}.features.${fk}`)),
  };
  const supporting = supportingMeta.map((meta) => ({
    ...meta,
    tier: t(`landing.services.${meta.tKey}.tier`),
    price: t(`landing.services.${meta.tKey}.price`),
    subtitle: t(`landing.services.${meta.tKey}.subtitle`),
    features: meta.featureKeys.map((fk) => t(`landing.services.${meta.tKey}.features.${fk}`)),
  }));

  return (
    <div className="relative overflow-hidden h-full flex flex-col">
      <div className="relative w-full h-full px-6 md:px-16 lg:px-24 py-6 md:py-8 lg:py-10 flex flex-col">
        <div className="w-full lg:max-w-6xl lg:mx-auto flex-1 flex flex-col min-h-0">
          {/* Heading — left aligned */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 md:mb-5 shrink-0"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/30 bg-bg-elevated text-[10px] font-black uppercase tracking-[0.25em] text-text-primary">
               <IconShield size={12} /> {t('landing.services.badge')}
            </span>
          </motion.div>

          {/* Bento grid: 4 columns on desktop — same structure as pillars */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 md:gap-4 flex-1 auto-rows-fr">
            {/* Featured card — Standard tier, 2 cols, 2 rows */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-2 lg:row-span-2"
            >
              <div className="group relative h-full rounded-2xl border border-border/30 bg-bg-card p-4 sm:p-8 transition-all duration-300 hover:border-accent/30 flex flex-col">
                <div className="absolute inset-0 opacity-[0.03] rounded-2xl overflow-hidden pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                <div className="flex items-center gap-2 mb-3 sm:mb-6">
                  <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">{featured.subtitle}</span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-[8px] font-black uppercase tracking-widest text-accent">
                     <Sparkles className="w-2.5 h-2.5" /> {t('landing.services.mostPopular')}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-text-primary tracking-tighter leading-none mb-3">
                  {featured.tier}
                </h3>
                <span className="text-base lg:text-lg font-black text-accent mb-3 sm:mb-6">
                  {featured.price}
                </span>

                <ul className="space-y-2.5 mb-3 sm:mb-6 flex-1">
                  {featured.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <IconCheck size={18} className="text-accent mt-0.5 shrink-0" />
                      <span className="text-xs sm:text-sm text-text-secondary leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-center gap-3">
                  <button
                    onClick={() => openServiceRequestModal(featured.tier)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-[10px] font-black uppercase tracking-widest text-bg transition-all active:scale-[0.98]"
                  >
                    <IconShield size={14} />
                     {t('landing.services.requestAssessment')}
                    <IconArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Basic — top right, 2 cols */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-2"
            >
              <div className="group relative h-full rounded-2xl border border-border/30 bg-bg-card p-3 sm:p-5 transition-all duration-300 hover:border-accent/30 flex flex-col">
                <div className="absolute inset-0 opacity-[0.03] rounded-2xl overflow-hidden pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">{supporting[0].subtitle}</span>
                <div className="flex items-end justify-between mb-2 sm:mb-3">
                  <h3 className="text-sm sm:text-base font-black text-text-primary tracking-tight">{supporting[0].tier}</h3>
                  <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-accent/20 bg-accent/10 text-accent">
                    {supporting[0].price}
                  </span>
                </div>

                <ul className="space-y-2 flex-1">
                  {supporting[0].features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <IconCheck size={16} className="text-accent mt-0.5 shrink-0" />
                      <span className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-2 sm:pt-3">
                  <button
                    onClick={() => openServiceRequestModal(supporting[0].tier)}
                    className="w-full py-2.5 sm:py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-[0.98] flex items-center justify-center gap-2 btn-primary !border-accent/30"
                  >
                     {t('landing.services.requestAssessment')}
                    <IconArrowRight size={12} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Employee Bootcamp — bottom right, 2 cols */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-2"
            >
              <div className="group relative h-full rounded-2xl border border-border/30 bg-bg-card p-3 sm:p-5 transition-all duration-300 hover:border-accent/30 flex flex-col">
                <div className="absolute inset-0 opacity-[0.03] rounded-2xl overflow-hidden pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1">{supporting[1].subtitle}</span>
                <div className="flex items-end justify-between mb-2 sm:mb-3">
                  <h3 className="text-sm sm:text-base font-black text-text-primary tracking-tight">{supporting[1].tier}</h3>
                  <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-accent/20 bg-accent/10 text-accent">
                    {supporting[1].price}
                  </span>
                </div>

                <ul className="space-y-2 flex-1">
                  {supporting[1].features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <IconCheck size={16} className="text-accent mt-0.5 shrink-0" />
                      <span className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-2 sm:pt-3">
                  <button
                    onClick={() => openServiceRequestModal(supporting[1].tier)}
                    className="w-full py-2.5 sm:py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-[0.98] flex items-center justify-center gap-2 btn-primary !border-accent/30"
                  >
                     {t('landing.services.requestAssessment')}
                    <IconArrowRight size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 shrink-0"
          >
            <a
              href="/services"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
            >
               {t('landing.services.viewAll')} <IconArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingServicesSection;
