import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { BookOpen, Zap } from 'lucide-react';
import { IconLabs, IconShield, IconLock, IconArrowRight } from '@/shared/components/icons';
import DotMapBackground from '@/shared/components/DotMapBackground';

const PILLARS = [
  {
    id: 'labs',
    title: 'Attack Labs',
    desc: '10 live labs — crack passwords, inject SQL, escalate privileges, and phish real targets in sandboxed environments.',
    icon: IconLabs,
    stat: '10 Labs',
    link: '/dashboard/labs',
    featured: false,
  },
  {
    id: 'courses',
    title: 'Self-Paced Courses',
    desc: '12 structured courses across terminal, networking, web security, programming, and tools — earn CP as you learn.',
    icon: BookOpen,
    stat: '12 Courses',
    link: '/courses',
    featured: false,
  },
  {
    id: 'bootcamp',
    title: 'Hacker Protocol Bootcamp',
    desc: '5-phase guided bootcamp from mindset to exploitation. 19 rooms, 100+ walkthrough steps, CP on completion.',
    icon: IconShield,
    stat: '5 Phases',
    link: '/hpb',
    featured: true,
  },
  {
    id: 'services',
    title: 'Penetration Testing',
    desc: 'Enterprise-grade security assessments. OWASP Top 10, business logic analysis, and remediation retesting.',
    icon: IconLock,
    stat: 'From GH₵ 4,000',
    link: '/services',
    featured: false,
  },
];

const LandingPillarsSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const featured = PILLARS.find((p) => p.featured)!;
  const supporting = PILLARS.filter((p) => !p.featured);

  return (
    <div className="relative overflow-hidden h-full flex flex-col">
      <DotMapBackground />
      <div className="relative w-full h-full px-6 md:px-16 lg:px-24 py-8 md:py-16 lg:py-20 flex flex-col">
        <div className="w-full lg:max-w-6xl lg:mx-auto flex-1 flex flex-col min-h-0">
          {/* Heading — left aligned */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 md:mb-5 shrink-0"
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-border/30 bg-bg-elevated text-[10px] font-black uppercase tracking-[0.3em] text-text-primary">
              What We Build
            </span>
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
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }} />

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
                      Start Bootcamp
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
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }} />

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
                    <span className="text-[10px] font-black uppercase tracking-widest">Explore</span>
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
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }} />

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
                    <span className="text-[10px] font-black uppercase tracking-widest">Explore</span>
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
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }} />

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
                    <span className="text-[10px] font-black uppercase tracking-widest">Explore</span>
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
