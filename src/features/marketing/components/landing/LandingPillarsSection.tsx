import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { FlaskConical, BookOpen, Shield, Lock, ArrowRight, Zap } from 'lucide-react';
import DotMapBackground from '@/shared/components/DotMapBackground';

const PILLARS = [
  {
    id: 'labs',
    title: 'Attack Labs',
    desc: '10 live labs — crack passwords, inject SQL, escalate privileges, and phish real targets in sandboxed environments.',
    icon: FlaskConical,
    stat: '10 Labs',
    link: '/dashboard/labs',
    color: '#EF4444',
    featured: false,
  },
  {
    id: 'courses',
    title: 'Self-Paced Courses',
    desc: '12 structured courses across terminal, networking, web security, programming, and tools — earn CP as you learn.',
    icon: BookOpen,
    stat: '12 Courses',
    link: '/courses',
    color: '#60A5FA',
    featured: false,
  },
  {
    id: 'bootcamp',
    title: 'Hacker Protocol Bootcamp',
    desc: '5-phase guided bootcamp from mindset to exploitation. 19 rooms, 100+ walkthrough steps, CP on completion.',
    icon: Shield,
    stat: '5 Phases',
    link: '/hpb',
    color: '#06B66F',
    featured: true,
  },
  {
    id: 'services',
    title: 'Penetration Testing',
    desc: 'Enterprise-grade security assessments. OWASP Top 10, business logic analysis, and remediation retesting.',
    icon: Lock,
    stat: 'From GH₵ 4,000',
    link: '/services',
    color: '#A78BFA',
    featured: false,
  },
];

const LandingPillarsSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const featured = PILLARS.find((p) => p.featured)!;
  const supporting = PILLARS.filter((p) => !p.featured);

  return (
    <div className="relative overflow-hidden">
      <DotMapBackground />
      <div className="relative w-full px-4 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
        <div className="w-full lg:max-w-6xl lg:mx-auto">
          {/* Heading — left aligned */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 md:mb-8"
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-border/30 bg-bg-elevated text-[10px] font-black uppercase tracking-[0.3em] text-text-primary mb-4">
              What We Build
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-text-primary tracking-tighter leading-none">
              The Platform
            </h2>
            <p className="mt-4 text-sm md:text-base text-text-secondary max-w-xl">
              Everything you need to become an offensive security operator — from zero knowledge to production-ready.
            </p>
          </motion.div>

          {/* Asymmetric grid: Featured card + supporting cards */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
            {/* Featured card — takes 3 columns on large screens */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-3"
            >
              <Link
                to={featured.link}
                className="group relative block rounded-2xl border border-border/30 bg-bg-card p-8 sm:p-10 transition-all duration-300 hover:border-accent/30 overflow-hidden h-full flex flex-col"
              >
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 -translate-y-1/3 translate-x-1/3" style={{ background: featured.color }} />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-5 translate-y-1/3 -translate-x-1/3" style={{ background: featured.color }} />

                <div className="relative flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: `${featured.color}25` }}
                    >
                      <featured.icon className="w-8 h-8" style={{ color: featured.color }} />
                    </div>
                    <span
                      className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border"
                      style={{ color: featured.color, borderColor: `${featured.color}40`, background: `${featured.color}15` }}
                    >
                      {featured.stat}
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tighter leading-none mb-4">
                    {featured.title}
                  </h3>
                  <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-lg mb-8">
                    {featured.desc}
                  </p>

                  <div className="mt-auto flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-[10px] font-black uppercase tracking-widest text-bg transition-all group-hover:gap-3">
                      <Zap className="w-3.5 h-3.5" />
                      Start Bootcamp
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Supporting cards — stacked vertically, takes 2 columns */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
              {supporting.map((pillar, idx) => (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: (idx + 1) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={pillar.link}
                    className="group relative block rounded-2xl border border-border/30 bg-bg-card p-6 transition-all duration-300 hover:border-accent/30 overflow-hidden h-full"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2" style={{ background: pillar.color }} />

                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: `${pillar.color}20` }}
                        >
                          <pillar.icon className="w-5 h-5" style={{ color: pillar.color }} />
                        </div>
                        <span
                          className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border"
                          style={{ color: pillar.color, borderColor: `${pillar.color}40`, background: `${pillar.color}10` }}
                        >
                          {pillar.stat}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-text-primary tracking-tight mb-1.5">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-text-muted leading-relaxed mb-4 line-clamp-2">
                        {pillar.desc}
                      </p>

                      <div className="flex items-center gap-2 text-text-muted group-hover:text-accent transition-colors">
                        <span className="text-[10px] font-black uppercase tracking-widest">Explore</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPillarsSection;
