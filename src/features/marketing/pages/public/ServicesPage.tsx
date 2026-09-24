import React from 'react';
import { ArrowRight, ShieldCheck, Target } from 'lucide-react';
import { IconCheck } from '@/shared/components/icons';
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
            <ServiceCard key={svc.id} svc={svc} index={i + 1} />
          ))}
        </div>

        {/* Final CTA — the conversion surface */}
        <ScrollReveal>
          <div className="relative mx-auto mt-14 w-full max-w-3xl overflow-hidden rounded-2xl border border-accent/40 bg-accent/5 px-6 py-14 md:mt-20 md:px-12 md:py-16">
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
    <Card
      to={svc.path}
      interactive={!svc.featured}
      className={`group relative flex h-full min-h-[440px] flex-col overflow-hidden rounded-2xl p-6 ${
        svc.featured
          ? 'border-accent/40 bg-gradient-to-br from-accent/15 via-accent/[0.04] to-transparent'
          : ''
      }`}
    >
      {/* Header — index + service icon tile */}
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent transition-colors duration-[var(--dur-base)] ease-[var(--ease-smooth)] group-hover:border-accent/40">
          <Icon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div className="flex flex-col items-end gap-1.5">
          <span className="type-label uppercase tracking-[0.12em] text-text-tertiary">
            {"Service"}
          </span>
          <span className="type-meta font-mono text-text-tertiary">{`0${index}`}</span>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
          svc.featured
            ? 'border-accent/40 bg-accent/15 text-accent'
            : 'border-border-subtle bg-surface-raised text-text-secondary'
        }`}>
          {svc.badge}
        </span>
        {svc.featured && (
          <span className="rounded-lg border border-accent/40 bg-accent px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-on-accent">
            {"Most Popular"}
          </span>
        )}
      </div>

      <h3 className="mt-3 type-h3 font-black uppercase tracking-tight text-text-primary">
        {svc.title}
      </h3>
      <p className="mt-2 type-body-sm text-text-secondary">{svc.overview}</p>

      {/* Scope */}
      <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-text-muted">
        <Target className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        {svc.scope}
      </p>

      {/* Included preview */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {svc.included.slice(0, 3).map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-raised px-2 py-1 text-xs text-text-secondary"
          >
            <IconCheck className="h-3 w-3 shrink-0 text-accent" aria-hidden="true" />
            {item}
          </span>
        ))}
        {svc.included.length > 3 && (
          <span className="inline-flex items-center px-2 py-1 text-xs text-text-muted">
            {`+${svc.included.length - 3} more`}
          </span>
        )}
      </div>

      {/* Footer — pricing + CTA */}
      <div className="mt-auto flex flex-col gap-3 pt-5">
        <div className="flex flex-col gap-3 border-t border-border-subtle pt-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <span className={`font-black ${svc.featured ? 'text-xl text-accent' : 'text-lg text-text-primary'}`}>
              {svc.price}
            </span>
            <span className="text-xs text-text-muted">{svc.priceLocal}</span>
          </div>
          {svc.highlight && (
            <p className="flex items-start gap-2 rounded-lg border border-accent/20 bg-accent/5 px-3 py-2 text-xs leading-relaxed text-accent/90">
              <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {svc.highlight}
            </p>
          )}
        </div>
        <span className="flex min-h-[44px] items-center gap-2 text-sm font-bold text-accent">
          {LEARN_MORE_LABEL}
          <ArrowRight className="h-4 w-4 transition-transform duration-[var(--dur-fast)] ease-[var(--ease-smooth)] group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Card>
  );
};

export default ServicesPage;