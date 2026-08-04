import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Target, Lock, PackageCheck, FileText, CheckCircle2 } from 'lucide-react';
import { IconArrowRight, IconArrowLeft } from '@/shared/components/icons';
import { openServiceRequestModal } from '@/features/marketing/components/ServiceRequestModal';
import { getDottedMapBg } from '@/shared/utils/dottedMap';
import SEO from '@/shared/components/SEO';
import PublicHeroSection from '@/shared/components/PublicHeroSection';
import { Footer } from '@/shared/components/layout';
import { REQUEST_ASSESSMENT_LABEL, PENTEST_PHILOSOPHY, type ServiceConfig } from '@/features/marketing/content/servicesConfig';

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' as const },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

const SectionCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  title: string;
  children: React.ReactNode;
}> = ({ icon, label, title, children }) => (
  <motion.div
    {...reveal}
    className="relative overflow-hidden rounded-2xl border border-border/30 bg-bg-card p-6 sm:p-10"
  >
    <div className="absolute inset-0 opacity-[0.04] text-accent rounded-2xl overflow-hidden pointer-events-none" style={{ backgroundImage: getDottedMapBg(), backgroundSize: '360px 180px', backgroundRepeat: 'repeat' }} />
    <div className="relative">
      <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-text-muted mb-3">
        {icon} {label}
      </span>
      <h2 className="text-xl md:text-2xl font-black text-text-primary tracking-tight mb-5">{title}</h2>
      {children}
    </div>
  </motion.div>
);

const ServiceDetailPage: React.FC<{ svc: ServiceConfig }> = ({ svc }) => {
  const Icon = svc.icon;

  return (
    <div className="bg-bg min-h-full" data-nav-invert>
      <SEO title={`${svc.title} - QYVORA`} description={svc.overview} />

      <PublicHeroSection mask="none">
        <span className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${
          svc.featured ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-bg-elevated border-border/30 text-text-muted'
        }`}>
          <Icon className="w-3 h-3" /> {svc.badge}
        </span>

        <h1 className="font-black text-text-primary leading-[1.08] tracking-tight w-full relative">
          <span className="block text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05]">
            {svc.title}{' '}
            {svc.accentWord && <span className="text-accent">{svc.accentWord}</span>}
          </span>
        </h1>

        <p className="text-text-secondary text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl animate-fade-in font-mono">
          {svc.overview}
        </p>

        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className={`font-black ${svc.featured ? 'text-accent text-xl sm:text-2xl' : 'text-text-primary text-lg sm:text-xl'}`}>
            {svc.price}
          </span>
          <span className="text-xs sm:text-sm text-text-muted font-mono">{svc.priceLocal}</span>
        </div>
        {svc.priceNote && (
          <p className="text-xs text-text-muted leading-relaxed font-mono max-w-xl">{svc.priceNote}</p>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
          <button
            onClick={() => openServiceRequestModal(svc.title)}
            className="btn-primary inline-flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-3.5 whitespace-nowrap"
          >
            {REQUEST_ASSESSMENT_LABEL} <IconArrowRight className="h-4 w-4" />
          </button>
          <Link
            to="/services"
            className="btn-secondary inline-flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-3.5 whitespace-nowrap"
          >
            <IconArrowLeft className="h-4 w-4" /> All Services
          </Link>
        </div>
      </PublicHeroSection>

      <div className="px-3 md:px-4 lg:px-6 space-y-6 md:space-y-8 pb-16 md:pb-24">

        {svc.highlight && (
          <motion.div
            {...reveal}
            className="rounded-2xl border border-accent/40 bg-accent/5 p-6 sm:p-8"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
                <CheckCircle2 className="h-6 w-6 text-accent" />
              </span>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-accent mb-2 block">Key Benefit</span>
                <p className="text-sm sm:text-base text-text-primary font-mono leading-relaxed">{svc.highlight}</p>
              </div>
            </div>
          </motion.div>
        )}

        <SectionCard icon={<Lock className="w-3 h-3" />} label="Scope of Work" title="What the engagement covers">
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-mono">
            {svc.scope}
          </p>
        </SectionCard>

        <SectionCard icon={<PackageCheck className="w-3 h-3" />} label="What's Included" title="Included in this engagement">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {svc.included.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <span className="text-xs sm:text-sm text-text-secondary leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard icon={<Target className="w-3 h-3" />} label="Benefits" title="What you get">
          <ul className="space-y-3">
            {svc.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span className="text-sm sm:text-base text-text-secondary leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard icon={<FileText className="w-3 h-3" />} label="Deliverables" title="The security report">
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-6 font-mono">
            You receive a professional security report that includes:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {svc.deliverables.map((d) => (
              <li key={d.label} className="rounded-xl border border-border/30 bg-bg-elevated/60 px-4 py-3">
                <span className="block text-xs sm:text-sm font-black text-text-primary uppercase tracking-widest mb-1">{d.label}</span>
                <span className="block text-xs text-text-muted leading-relaxed">{d.desc}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <motion.div
          {...reveal}
          className="relative overflow-hidden rounded-2xl border border-border/30 bg-bg-card p-6 sm:p-10"
        >
          <div className="absolute inset-0 opacity-[0.04] text-accent rounded-2xl overflow-hidden pointer-events-none" style={{ backgroundImage: getDottedMapBg(), backgroundSize: '360px 180px', backgroundRepeat: 'repeat' }} />
          <div className="relative flex flex-col lg:flex-row items-start gap-6 lg:gap-12">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-[9px] font-black uppercase tracking-widest text-accent shrink-0">
              <Target className="w-3 h-3" /> {PENTEST_PHILOSOPHY.heading}
            </span>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-mono max-w-3xl">
              {PENTEST_PHILOSOPHY.body}
            </p>
          </div>
        </motion.div>

        <motion.div
          {...reveal}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl border border-accent/40 bg-accent/5 p-6 sm:p-10"
        >
          <div>
            <h2 className="text-lg sm:text-xl font-black text-text-primary tracking-tight mb-1">Ready to get started?</h2>
            <p className="text-xs sm:text-sm text-text-muted font-mono">
              Request an assessment or explore the full range of services.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => openServiceRequestModal(svc.title)}
              className="btn-primary inline-flex items-center justify-center gap-2 !px-7 !py-3.5 whitespace-nowrap"
            >
              {REQUEST_ASSESSMENT_LABEL} <IconArrowRight size={13} />
            </button>
            <Link
              to="/services"
              className="btn-secondary inline-flex items-center justify-center gap-2 !px-7 !py-3.5 whitespace-nowrap"
            >
              <IconArrowLeft size={13} /> All Services
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Footer ── */}
      <section className="relative w-full bg-bg">
        <Footer />
      </section>
    </div>
  );
};

export default ServiceDetailPage;
