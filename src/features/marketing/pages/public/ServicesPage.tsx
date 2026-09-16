import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Target, Lock, ShieldCheck } from 'lucide-react';
import { IconCheck, IconArrowRight } from '@/shared/components/icons';
import { openServiceRequestModal } from '@/features/marketing/components/ServiceRequestModal';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import { SimpleHeading } from '@/shared/components/ui';
import { SERVICES, REQUEST_ASSESSMENT_LABEL, LEARN_MORE_LABEL, type ServiceConfig } from '@/features/marketing/content/servicesConfig';

const ServiceSection: React.FC<{ svc: ServiceConfig; index: number }> = ({ svc, index }) => {
  const Icon = svc.icon;

  return (
    <div className="flex flex-col gap-10 sm:gap-10 lg:flex-row lg:items-stretch lg:justify-center lg:gap-16">
      {/* Header column — title, overview, pricing, CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex min-w-0 shrink-0 flex-col lg:w-[420px] lg:justify-center xl:w-[480px]"
      >
        <span className={`mb-2 flex w-fit items-center gap-2 rounded-lg border px-3 py-1 text-xs font-black uppercase tracking-widest ${
          svc.featured ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-bg-elevated border-border/50 text-text-muted'
        }`}>
          <Icon className="h-3 w-3" /> {svc.badge}
        </span>

        <SimpleHeading
          compact
          text={svc.title}
          {...(svc.accentWord ? { accentText: svc.accentWord } : {})}
          align="left"
          description={svc.overview}
          className="mb-4"
        />

        <div className="mb-4">
          <span className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-text-muted">
            <Target className="h-3 w-3" /> Pricing
          </span>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className={`font-black ${svc.featured ? 'text-accent text-xl sm:text-2xl' : 'text-text-primary text-lg sm:text-xl'}`}>
              {svc.price}
            </span>
            <span className="text-xs font-mono text-text-muted sm:text-sm">{svc.priceLocal}</span>
          </div>
          {svc.priceNote && (
            <p className="mt-2 line-clamp-3 max-w-md text-xs font-mono leading-relaxed text-text-muted">{svc.priceNote}</p>
          )}
        </div>

        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <button
            onClick={() => openServiceRequestModal(svc.title)}
            className="btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap !px-6 !py-3"
          >
            {REQUEST_ASSESSMENT_LABEL}
            <IconArrowRight size={13} />
          </button>
          <Link
            to={svc.path}
            className="btn-secondary inline-flex items-center justify-center gap-2 whitespace-nowrap !px-6 !py-3"
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
        className="flex min-h-0 min-w-0 flex-1 flex-col lg:justify-center"
      >
        <div className="mb-3">
          <span className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-text-muted">
            <Lock className="h-3 w-3" /> Scope
          </span>
          <p className="font-mono text-sm leading-relaxed text-text-primary sm:text-base">{svc.scope}</p>
        </div>

        <span className="mb-2 text-xs font-black uppercase tracking-widest text-text-muted">
          What's Included
        </span>
        <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-2.5 lg:grid-cols-4">
          {svc.included.map((item) => (
            <li
              key={item}
              className="relative flex items-center gap-2 rounded-xl border border-border/50 bg-bg-card px-3 py-1.5"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <IconCheck size={14} className="text-accent" />
              </span>
              <span className="font-mono text-xs leading-snug text-text-secondary">{item}</span>
            </li>
          ))}
        </ul>

        {svc.highlight && (
          <div className="mt-3 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
            <p className="font-mono text-xs leading-relaxed text-accent sm:text-sm">{svc.highlight}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const ServicesPage = () => {
  return (
    <div className="min-h-dvh bg-canvas">
      <SEO title="Services - QYVORA" description="Enterprise-grade penetration testing, security assessments, and offensive security training." />
      <div className="w-full px-3 pb-20 pt-24 md:px-4 md:pb-24 md:pt-28 lg:px-6 lg:pt-32">
        <PageHeader
          kicker="QYVORA · Services"
          title="Security Services"
          description="Enterprise penetration testing, vulnerability assessments, and custom security training for your organization."
          metadata={
            <span className="type-meta inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              <span className="font-bold text-text-primary">{SERVICES.length}</span>
              Services
            </span>
          }
        />

        <div className="mt-10 space-y-12 md:mt-14 md:space-y-20">
          {SERVICES.map((svc, idx) => (
            <ServiceSection key={svc.id} svc={svc} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;