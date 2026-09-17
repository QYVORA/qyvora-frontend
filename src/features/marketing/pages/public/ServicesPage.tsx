import React from 'react';
import { motion } from 'motion/react';
import { Target, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { IconCheck } from '@/shared/components/icons';
import { openServiceRequestModal } from '@/features/marketing/components/ServiceRequestModal';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { SimpleHeading } from '@/shared/components/ui';
import { SERVICES, REQUEST_ASSESSMENT_LABEL, LEARN_MORE_LABEL, type ServiceConfig } from '@/features/marketing/content/servicesConfig';

const ServiceSection: React.FC<{ svc: ServiceConfig; index: number }> = ({ svc, index }) => {
  const Icon = svc.icon;

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
      {/* Left column — identity, outcome, price, actions */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex min-w-0 flex-col"
      >
        <span
          className={`mb-3 flex w-fit items-center gap-2 rounded-lg border px-3 py-1 text-xs font-black uppercase tracking-widest ${
            svc.featured
              ? 'border-accent/30 bg-accent/10 text-accent'
              : 'border-border-subtle bg-surface text-text-secondary'
          }`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {svc.badge}
        </span>

        <SimpleHeading
          compact
          text={svc.title}
          accentWords={1}
          accentPlacement="end"
          align="left"
          description={svc.overview}
          descriptionWidth="max-w-xl"
          className="mb-6"
        />

        <div className="mb-6">
          <span className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-text-tertiary">
            <Target className="h-3.5 w-3.5" aria-hidden="true" /> Pricing
          </span>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className={`font-black ${svc.featured ? 'text-xl text-accent sm:text-2xl' : 'text-lg text-text-primary sm:text-xl'}`}>
              {svc.price}
            </span>
            <span className="text-sm text-text-muted">{svc.priceLocal}</span>
          </div>
          {svc.priceNote && (
            <p className="mt-2 max-w-md text-sm leading-relaxed text-text-muted">{svc.priceNote}</p>
          )}
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Button
            size="lg"
            onClick={() => openServiceRequestModal(svc.title)}
            trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
          >
            {REQUEST_ASSESSMENT_LABEL}
          </Button>
          <Button to={svc.path} variant="secondary" size="lg">
            {LEARN_MORE_LABEL}
          </Button>
        </div>
      </motion.div>

      {/* Right column — scope + deliverables in one quiet surface */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="min-w-0"
      >
        <Card className="flex h-full flex-col gap-6 p-6 md:p-8">
          <div>
            <span className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-text-tertiary">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Scope
            </span>
            <p className="text-sm leading-relaxed text-text-primary md:text-base">{svc.scope}</p>
          </div>

          <div>
            <span className="mb-3 block text-xs font-black uppercase tracking-widest text-text-tertiary">
              What&apos;s included
            </span>
            <ul className="grid gap-2 sm:grid-cols-2">
              {svc.included.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-accent/10">
                    <IconCheck size={13} className="text-accent" />
                  </span>
                  <span className="text-sm leading-snug text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {svc.highlight && (
            <div className="mt-auto rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
              <p className="text-sm leading-relaxed text-accent">{svc.highlight}</p>
            </div>
          )}
        </Card>
      </motion.div>
    </section>
  );
};

const ServicesPage = () => {
  return (
    <div className="min-h-dvh w-full bg-canvas">
      <SEO title="Services - QYVORA" description="Enterprise-grade penetration testing, security assessments, and offensive security training." />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
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

        <div className="mt-12 space-y-14 md:mt-16 md:space-y-20">
          {SERVICES.map((svc, idx) => (
            <ServiceSection key={svc.id} svc={svc} index={idx} />
          ))}
        </div>
      </PublicContainer>
    </div>
  );
};

export default ServicesPage;
