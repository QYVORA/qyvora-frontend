import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2, Send, Target, Lock } from 'lucide-react';
import { IconCheck, IconArrowRight } from '@/shared/components/icons';
import { openServiceRequestModal } from '@/features/marketing/components/ServiceRequestModal';
import { getDottedMapBg } from '@/shared/utils/dottedMap';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { SERVICES, PENTEST_PHILOSOPHY, REQUEST_ASSESSMENT_LABEL, LEARN_MORE_LABEL, type ServiceConfig } from '@/features/marketing/content/servicesConfig';

const ServiceSection: React.FC<{ svc: ServiceConfig; index: number }> = ({ svc, index }) => {
  const Icon = svc.icon;

  return (
    <div className="min-h-dvh flex flex-col lg:flex-row gap-10 sm:gap-10 lg:gap-16 lg:items-stretch justify-center py-16 md:py-20 px-3 md:px-4 lg:px-6">
      {/* Header column — title, overview, pricing, CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="shrink-0 lg:w-[420px] xl:w-[480px] flex flex-col lg:justify-center"
      >
        <span className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest mb-6 ${
          svc.featured ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-bg-elevated border-border/30 text-text-muted'
        }`}>
          <Icon className="w-3 h-3" /> {svc.badge}
        </span>

        <h2 className="text-3xl md:text-5xl lg:text-5xl font-black text-text-primary tracking-tighter leading-[1.05] mb-6">
          {svc.title}{' '}
          {svc.accentWord && <span className="text-accent">{svc.accentWord}</span>}
        </h2>

        <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl mb-8 font-mono">
          {svc.overview}
        </p>

        <div className="mb-8">
          <span className="text-[9px] font-black uppercase tracking-widest text-text-muted flex items-center gap-1.5 mb-2">
            <Target className="w-3 h-3" /> Pricing
          </span>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className={`font-black ${svc.featured ? 'text-accent text-xl sm:text-2xl' : 'text-text-primary text-lg sm:text-xl'}`}>
              {svc.price}
            </span>
            <span className="text-xs sm:text-sm text-text-muted font-mono">{svc.priceLocal}</span>
          </div>
          {svc.priceNote && (
            <p className="text-xs text-text-muted leading-relaxed mt-2 font-mono max-w-md">{svc.priceNote}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => openServiceRequestModal(svc.title)}
            className="btn-primary inline-flex items-center justify-center gap-2 !px-8 !py-3.5 whitespace-nowrap"
          >
            {REQUEST_ASSESSMENT_LABEL}
            <IconArrowRight size={13} />
          </button>
          <Link
            to={svc.path}
            className="btn-secondary inline-flex items-center justify-center gap-2 !px-8 !py-3.5 whitespace-nowrap"
          >
            {LEARN_MORE_LABEL}
            <IconArrowRight size={13} />
          </Link>
        </div>
      </motion.div>

      {/* Content column — scope + what's included */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 min-h-0 flex flex-col lg:justify-center"
      >
        <div className="mb-8">
          <span className="text-[9px] font-black uppercase tracking-widest text-text-muted flex items-center gap-1.5 mb-3">
            <Lock className="w-3 h-3" /> Scope
          </span>
          <p className="text-sm sm:text-base text-text-primary font-mono leading-relaxed">{svc.scope}</p>
        </div>

        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-3">
          What's Included
        </span>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {svc.included.map((item) => (
            <li key={item} className="flex items-start gap-2.5 rounded-xl border border-border/30 bg-bg-card px-4 py-3">
              <IconCheck size={15} className="text-accent mt-0.5 shrink-0" />
              <span className="text-xs sm:text-sm text-text-secondary leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>

        {svc.highlight && (
          <div className="mt-8 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
            <p className="text-xs sm:text-sm text-accent font-mono leading-relaxed">{svc.highlight}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const ServicesPage = () => {
  return (
    <div className="bg-bg min-h-full">
      <SEO title="Services - QYVORA" description="Enterprise-grade penetration testing, security assessments, and offensive security training." />
      <PublicSnapLayout>
        <StudentHeroSection
          icon={<Building2 className="w-8 h-8 text-accent" />}
          title="Security"
          accentWord="Services"
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          description="Enterprise penetration testing, vulnerability assessments, and custom security training for your organization."
        />

        {SERVICES.map((svc, idx) => (
          <ServiceSection key={svc.id} svc={svc} index={idx} />
        ))}

        {/* Philosophy */}
        <div className="min-h-dvh md:h-dvh md:overflow-y-auto px-3 md:px-4 lg:px-6">
          <div className="min-h-full flex flex-col justify-center py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-2xl border border-border/30 bg-bg-card p-6 sm:p-10 lg:p-14"
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
          </div>
        </div>

        {/* Custom inquiries */}
        <div className="min-h-dvh md:h-dvh md:overflow-y-auto px-3 md:px-4 lg:px-6">
          <div className="min-h-full flex flex-col justify-center py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => openServiceRequestModal('Custom Inquiry')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openServiceRequestModal('Custom Inquiry'); } }}
              className="group relative flex flex-col sm:flex-row items-start gap-4 p-5 sm:p-7 rounded-2xl border border-border/30 bg-bg-card cursor-pointer hover:border-accent/30 transition-all"
            >
              <div className="absolute inset-0 opacity-[0.04] text-accent rounded-2xl overflow-hidden pointer-events-none" style={{ backgroundImage: getDottedMapBg(), backgroundSize: '360px 180px', backgroundRepeat: 'repeat' }} />
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
                <Building2 className="h-6 w-6 text-accent group-hover:text-accent/80 transition-colors" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Custom Inquiry</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-text-primary tracking-tight mb-1">
                  Red Team, Compliance, or Custom Engagement
                </h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  Bespoke security assessments tailored to your infrastructure, compliance requirements, and threat model.
                </p>
              </div>
              <div className="flex items-center gap-2 text-accent/60 shrink-0 self-end sm:self-center mt-2 sm:mt-0">
                <Send className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Send Inquiry</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
            </motion.div>
          </div>
        </div>
      </PublicSnapLayout>
    </div>
  );
};

export default ServicesPage;
