import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { BookOpen, Zap } from 'lucide-react';
import { IconLabs, IconShield, IconLock, IconArrowRight } from '@/shared/components/icons';
import { useTranslation } from 'react-i18next';
import { getDottedMapBg } from '@/shared/utils/dottedMap';

const PILLARS_META = [
  { id: 'labs', icon: IconLabs, link: '/dashboard/labs', featured: false },
  { id: 'courses', icon: BookOpen, link: '/courses', featured: false },
  { id: 'bootcamp', icon: IconShield, link: '/hpb', featured: true },
  { id: 'services', icon: IconLock, link: '/services', featured: false },
];

const LandingPillarsSection: React.FC = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const featuredMeta = PILLARS_META.find((p) => p.featured)!;
  const supportingMeta = PILLARS_META.filter((p) => !p.featured);
  const featured = {
    ...featuredMeta,
    title: t('landing.pillars.bootcamp.title'),
    desc: t('landing.pillars.bootcamp.desc'),
    stat: t('landing.pillars.bootcamp.stat'),
  };
  const supporting = supportingMeta.map((meta) => {
    const key = meta.id === 'labs' ? 'labs' : meta.id === 'courses' ? 'courses' : 'services';
    return {
      ...meta,
      title: t(`landing.pillars.${key}.title`),
      desc: t(`landing.pillars.${key}.desc`),
      stat: t(`landing.pillars.${key}.stat`),
    };
  });

  return (
    <div className="relative overflow-hidden min-h-dvh md:h-dvh flex flex-col">
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

          </motion.div>

          {/* Bento grid: 4 columns on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 md:gap-4 flex-1 auto-rows-fr">
            {/* Featured card — 2 cols, 2 rows */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-2 lg:row-span-2"
            >
              <Link
                to={featured.link}
                className="group relative block h-full rounded-2xl border border-border/30 bg-bg-card p-4 sm:p-8 transition-all duration-300 hover:border-accent/30"
              >
                <div className="absolute inset-0 opacity-[0.04] text-accent" style={{ backgroundImage: getDottedMapBg(), backgroundSize: '360px 180px', backgroundRepeat: 'repeat' }} />

                <div className="relative h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3 sm:mb-6">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20">
                      <featured.icon size={22} className="text-accent sm:w-7 sm:h-7" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent">
                      {featured.stat}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-text-primary tracking-tighter leading-none mb-3">
                    {featured.title}
                  </h3>
                  <p className="text-xs md:text-sm text-text-secondary leading-relaxed max-w-lg mb-3 sm:mb-6 line-clamp-3">
                    {featured.desc}
                  </p>

                  <div className="mt-auto flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-[10px] font-black uppercase tracking-widest text-bg transition-all group-hover:gap-3">
                      <Zap className="w-3.5 h-3.5" />
                      {t('landing.pillars.startBootcamp')}
                      <IconArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Labs — top right, 2 cols */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-2"
            >
              <Link
                to={supporting[0].link}
                className="group relative block h-full rounded-2xl border border-border/30 bg-bg-card p-3 sm:p-5 transition-all duration-300 hover:border-accent/30"
              >
                <div className="absolute inset-0 opacity-[0.04] text-accent" style={{ backgroundImage: getDottedMapBg(), backgroundSize: '360px 180px', backgroundRepeat: 'repeat' }} />

                <div className="relative h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20">
                      {React.createElement(supporting[0].icon, { size: 18, className: 'text-accent' })}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-accent/20 bg-accent/10 text-accent">
                      {supporting[0].stat}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-text-primary tracking-tight mb-1 sm:mb-1.5">
                    {supporting[0].title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed mb-2 sm:mb-3 line-clamp-2">
                    {supporting[0].desc}
                  </p>

                  <div className="mt-auto flex items-center gap-2 text-text-muted group-hover:text-accent transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-widest">{t('landing.pillars.explore')}</span>
                    <IconArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Courses — bottom right, 1 col */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={supporting[1].link}
                className="group relative block h-full rounded-2xl border border-border/30 bg-bg-card p-3 sm:p-5 transition-all duration-300 hover:border-accent/30"
              >
                <div className="absolute inset-0 opacity-[0.04] text-accent" style={{ backgroundImage: getDottedMapBg(), backgroundSize: '360px 180px', backgroundRepeat: 'repeat' }} />

                <div className="relative h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20">
                      {React.createElement(supporting[1].icon, { size: 18, className: 'text-accent' })}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-accent/20 bg-accent/10 text-accent">
                      {supporting[1].stat}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-text-primary tracking-tight mb-1 sm:mb-1.5">
                    {supporting[1].title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed mb-2 sm:mb-3 line-clamp-2">
                    {supporting[1].desc}
                  </p>

                  <div className="mt-auto flex items-center gap-2 text-text-muted group-hover:text-accent transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-widest">{t('landing.pillars.explore')}</span>
                    <IconArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Penetration Testing — bottom right, 1 col */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={supporting[2].link}
                className="group relative block h-full rounded-2xl border border-border/30 bg-bg-card p-3 sm:p-5 transition-all duration-300 hover:border-accent/30"
              >
                <div className="absolute inset-0 opacity-[0.04] text-accent" style={{ backgroundImage: getDottedMapBg(), backgroundSize: '360px 180px', backgroundRepeat: 'repeat' }} />

                <div className="relative h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 bg-accent/10 border border-accent/20">
                      {React.createElement(supporting[2].icon, { size: 18, className: 'text-accent' })}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-accent/20 bg-accent/10 text-accent">
                      {supporting[2].stat}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-text-primary tracking-tight mb-1 sm:mb-1.5">
                    {supporting[2].title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed mb-2 sm:mb-3 line-clamp-2">
                    {supporting[2].desc}
                  </p>

                  <div className="mt-auto flex items-center gap-2 text-text-muted group-hover:text-accent transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-widest">{t('landing.pillars.explore')}</span>
                    <IconArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPillarsSection;
