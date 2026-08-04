import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Target, Lock } from 'lucide-react';
import { IconCheck, IconArrowRight } from '@/shared/components/icons';
import { openServiceRequestModal } from '@/features/marketing/components/ServiceRequestModal';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { SERVICES, REQUEST_ASSESSMENT_LABEL, LEARN_MORE_LABEL, type ServiceConfig } from '@/features/marketing/content/servicesConfig';

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
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {svc.included.map((item) => (
            <li
              key={item}
              className="relative flex flex-col items-start justify-between gap-2 aspect-square rounded-xl border border-border/30 bg-bg-card p-3 md:p-3.5"
            >
              <span className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <IconCheck size={15} className="text-accent" />
              </span>
              <span className="text-[11px] md:text-xs text-text-secondary leading-snug font-mono">{item}</span>
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
  const { user } = useAuth();
  return (
    <div className="bg-bg min-h-full">
      <SEO title="Services - QYVORA" description="Enterprise-grade penetration testing, security assessments, and offensive security training." />
      <PublicSnapLayout>
        <StudentHeroSection
          title="Security"
          accentWord="Services"
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description="Enterprise penetration testing, vulnerability assessments, and custom security training for your organization."
        />

        {SERVICES.map((svc, idx) => (
          <ServiceSection key={svc.id} svc={svc} index={idx} />
        ))}
        <LandingFinalCtaSection user={user} />
        <Footer />
      </PublicSnapLayout>
    </div>
  );
};

export default ServicesPage;
