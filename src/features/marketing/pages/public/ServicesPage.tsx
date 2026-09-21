import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { openServiceRequestModal } from '@/features/marketing/components/ServiceRequestModal';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { DottedMapOverlay, SimpleHeading } from '@/shared/components/ui';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { SERVICES, REQUEST_ASSESSMENT_LABEL, LEARN_MORE_LABEL, PENTEST_PHILOSOPHY, type ServiceConfig } from '@/features/marketing/content/servicesConfig';

const ServicesPage = () => {
  return (
    <div className="min-h-dvh w-full bg-canvas">
      <SEO title="Services - QYVORA" description="Enterprise-grade penetration testing, security assessments, and offensive security training." />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker="QYVORA · Services"
          title="Security Services"
          description="Enterprise penetration testing, vulnerability assessments, and custom security training for your organization."
          actions={
            <Button onClick={() => openServiceRequestModal('Security Services')} size="lg">
              {REQUEST_ASSESSMENT_LABEL}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
          metadata={
            <span className="type-meta inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              <span className="font-bold text-text-primary">{SERVICES.length}</span>
              Services
            </span>
          }
        />

        {/* Philosophy — the "why" framing every service hangs off */}
        <ScrollReveal>
          <div className="mt-12 md:mt-16">
            <SimpleHeading
              compact
              text={PENTEST_PHILOSOPHY.heading}
              accentWords={2}
              accentPlacement="end"
              align="left"
              description={PENTEST_PHILOSOPHY.body}
              descriptionWidth="max-w-2xl"
              className="max-w-2xl"
            />
          </div>
        </ScrollReveal>

        {/* Services — one landing-style card per engagement */}
        <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3">
          {SERVICES.map((svc, i) => (
            <ServiceCard key={svc.id} svc={svc} index={i} />
          ))}
        </div>

        {/* Final CTA — the conversion surface */}
        <ScrollReveal>
          <div className="relative mt-14 overflow-hidden rounded-2xl border border-accent/40 bg-accent/5 px-6 py-14 md:mt-20 md:px-12 md:py-16">
            <DottedMapOverlay className="rounded-2xl" />
            <div className="relative flex flex-col items-start gap-6 md:items-center md:text-center">
              <p className="type-label uppercase tracking-[0.12em] text-accent">
                {"Get a real assessment"}
              </p>
              <h2 className="max-w-2xl text-3xl font-black uppercase tracking-tight text-text-primary md:text-5xl">
                {"Ready to secure your stack?"}
              </h2>
              <p className="max-w-xl text-base text-text-secondary md:text-lg">
                {"Start with the service that fits your application, or talk to the QYVORA team about a scoped engagement."}
              </p>
              <Button onClick={() => openServiceRequestModal('Security Services')} size="lg">
                {REQUEST_ASSESSMENT_LABEL}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </PublicContainer>
    </div>
  );
};

const ServiceCard: React.FC<{ svc: ServiceConfig; index: number }> = ({ svc, index }) => {
  const Icon = svc.icon;

  return (
    <ScrollReveal delay={index * 0.08} className="h-full">
      <Card
        to={svc.path}
        interactive
        className="flex min-h-[340px] flex-col gap-4 p-6"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-surface-raised text-accent">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
            svc.featured
              ? 'border-accent/30 bg-accent/10 text-accent'
              : 'border-border-subtle bg-surface text-text-secondary'
          }`}>
            {svc.badge}
          </span>
        </div>

        <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
          {svc.title}
        </h3>
        <p className="type-body-sm flex-1">{svc.overview}</p>

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className={`font-black ${svc.featured ? 'text-xl text-accent' : 'text-lg text-text-primary'}`}>
            {svc.price}
          </span>
          <span className="text-xs text-text-muted">{svc.priceLocal}</span>
        </div>
        {svc.highlight && (
          <p className="text-xs leading-relaxed text-accent/90">{svc.highlight}</p>
        )}

        <span className="flex min-h-[44px] items-center gap-2 text-sm font-bold text-accent">
          {LEARN_MORE_LABEL}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </Card>
    </ScrollReveal>
  );
};

export default ServicesPage;