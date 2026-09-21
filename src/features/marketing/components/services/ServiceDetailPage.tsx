import React from 'react';
import { Link } from 'react-router-dom';
import { Target, FileText, CheckCircle2 } from 'lucide-react';
import { IconArrowRight, IconArrowLeft } from '@/shared/components/icons';
import { openServiceRequestModal } from '@/features/marketing/components/ServiceRequestModal';
import { DottedMapOverlay, SimpleHeading } from '@/shared/components/ui';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import { REQUEST_ASSESSMENT_LABEL, PENTEST_PHILOSOPHY, SERVICES, type ServiceConfig } from '@/features/marketing/content/servicesConfig';
import { buildService } from '@/shared/seo/schema';
import ScrollReveal from '@/shared/components/ScrollReveal';
import RelatedContentSection, { type RelatedItem } from '@/shared/components/RelatedContentSection';

const ServiceDetailPage: React.FC<{ svc: ServiceConfig }> = ({ svc }) => {
  const Icon = svc.icon;

  // Sibling services for the related-content listing.
  const otherServices: RelatedItem[] = SERVICES.filter((s) => s.id !== svc.id).map((s) => {
    const SvcIcon = s.icon;
    return {
      to: s.path,
      title: s.title,
      subtitle: s.overview,
      badge: s.badge,
      icon: <SvcIcon className="w-16 h-16" strokeWidth={1.25} />,
    };
  });

  return (
    <div className="min-h-dvh w-full bg-canvas">
      <SEO
        title={`${svc.title} - QYVORA`}
        description={svc.overview}
        breadcrumbName={svc.title}
        schemaData={buildService(svc)}
      />

      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker={svc.badge}
          title={svc.title}
          description={svc.overview}
          actions={
            <>
              <button
                onClick={() => openServiceRequestModal(svc.title)}
                className="btn-primary inline-flex items-center justify-center gap-2.5"
              >
                {REQUEST_ASSESSMENT_LABEL} <IconArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/services"
                className="btn-secondary inline-flex items-center justify-center gap-2.5"
              >
                <IconArrowLeft className="h-4 w-4" /> All Services
              </Link>
            </>
          }
        />

        <div className="mt-10 space-y-12 md:mt-14 md:space-y-16">
          {/* ── SECTION 1: What This Engagement Covers ─────────────────────
              Desktop: LEFT = heading + scope + pricing, RIGHT = included card
          ──────────────────────────────────────────────────────────────────── */}
          <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <ScrollReveal>
                <div className="space-y-5">
                  <SimpleHeading
                    compact
                    text="What This Engagement Covers"
                    accentWords={1}
                    accentPlacement="end"
                    kicker="Scope of Work"
                    align="left"
                    description={svc.scope}
                    descriptionWidth="max-w-xl"
                  />
                  {svc.price && (
                    <div className="pt-2">
                      <span className="mb-3 flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-text-muted">
                        <Target className="h-3 w-3" /> Pricing
                      </span>
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <span className={`font-black ${svc.featured ? 'text-accent text-2xl sm:text-3xl' : 'text-text-primary text-xl sm:text-2xl'}`}>
                          {svc.price}
                        </span>
                        <span className="text-sm font-mono text-text-muted sm:text-base">{svc.priceLocal}</span>
                      </div>
                      {svc.priceNote && (
                        <p className="mt-2 font-mono text-sm leading-relaxed text-text-muted">{svc.priceNote}</p>
                      )}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.1}>
              <div className="h-full rounded-2xl border border-border-subtle bg-surface p-6 lg:p-7">
                <span className="mb-4 block text-xs font-black uppercase tracking-widest text-text-muted">
                  What&apos;s Included
                </span>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {svc.included.map((item) => (
                    <li key={item} className="flex items-start gap-3 rounded-xl border border-border-subtle bg-surface-raised px-3 py-2">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                        <CheckCircle2 className="h-4 w-4 text-accent" />
                      </span>
                      <span className="flex-1 text-sm leading-relaxed text-text-secondary sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
                {svc.highlight && (
                  <div className="mt-4 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
                    <p className="font-mono text-sm leading-relaxed text-accent sm:text-base">{svc.highlight}</p>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* ── SECTION 2: Benefits ───────────────────────────────────────
              Centered heading + a two-by-two grid of benefit cards. Breaks
              the alternating split rhythm while staying on the card system.
          ──────────────────────────────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-8">
            <ScrollReveal>
              <SimpleHeading
                compact
                text="What You Gain"
                accentWords={1}
                accentPlacement="end"
                kicker="Benefits"
                align="center"
                description="Every engagement delivers actionable results, not just a report that sits on a shelf."
                descriptionWidth="max-w-xl"
                className="max-w-2xl"
              />
            </ScrollReveal>

            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              {svc.benefits.map((benefit, idx) => (
                <ScrollReveal key={benefit} delay={idx * 0.05} className="h-full">
                  <div className="flex h-full items-start gap-4 rounded-2xl border border-border-subtle bg-surface p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
                      <Target className="h-5 w-5 text-accent" />
                    </div>
                    <p className="flex-1 pt-1 font-mono text-sm leading-relaxed text-text-secondary sm:text-base">
                      {benefit}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* ── SECTION 3: Deliverables ────────────────────────────────────
              Desktop: LEFT = heading, RIGHT = deliverables cards
          ──────────────────────────────────────────────────────────────────── */}
          <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <ScrollReveal>
                <SimpleHeading
                  compact
                  text="The Security Report"
                  accentWords={1}
                  accentPlacement="end"
                  kicker="Deliverables"
                  align="left"
                  description="You receive a professional security report that covers everything from executive summaries to detailed remediation steps."
                  descriptionWidth="max-w-xl"
                />
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.1}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {svc.deliverables.map((deliverable, idx) => (
                  <ScrollReveal key={deliverable.label} delay={idx * 0.05} className="h-full">
                    <div className="h-full rounded-2xl border border-border-subtle bg-surface p-4">
                      <div className="mb-2.5 flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10">
                          <FileText className="h-4 w-4 text-accent" />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">
                          {deliverable.label}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-text-muted">
                        {deliverable.desc}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* ── SECTION 4: CTA + Philosophy ────────────────────────────────
              Desktop: LEFT = CTA card (premium mapped background), RIGHT = heading
          ──────────────────────────────────────────────────────────────────── */}
          <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <ScrollReveal>
              <div className="relative mx-auto h-full w-full max-w-3xl overflow-hidden rounded-2xl border border-accent/40 bg-accent/5 px-6 py-14 md:px-12 md:py-16">
                <DottedMapOverlay className="rounded-2xl" />
                <div className="relative flex flex-col items-start space-y-6 text-left">
                  <h3 className="text-2xl font-black tracking-tight text-text-primary md:text-3xl">
                    Ready to get started?
                  </h3>
                  <p className="font-mono text-base text-text-muted">
                    Request an assessment or explore the full range of services.
                  </p>
                  <div className="flex w-full flex-col items-stretch gap-4 pt-2 sm:flex-row sm:flex-wrap">
                    <button
                      onClick={() => openServiceRequestModal(svc.title)}
                      className="btn-primary inline-flex items-center justify-center gap-2.5"
                    >
                      {REQUEST_ASSESSMENT_LABEL} <IconArrowRight size={14} />
                    </button>
                    <Link
                      to="/services"
                      className="btn-secondary inline-flex items-center justify-center gap-2.5"
                    >
                      <IconArrowLeft size={14} /> All Services
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <div className="flex flex-col justify-center">
              <ScrollReveal delay={0.1}>
                <SimpleHeading
                  compact
                  text="Thorough Assessment,"
                  accentText="Not Checkbox Audits"
                  kicker={PENTEST_PHILOSOPHY.heading}
                  align="left"
                  description={PENTEST_PHILOSOPHY.body}
                  descriptionWidth="max-w-2xl"
                />
              </ScrollReveal>
            </div>
          </div>

          {/* ── Related services ─────────────────────────────────────────── */}
          <RelatedContentSection items={otherServices} />
        </div>
      </PublicContainer>
    </div>
  );
};

export default ServiceDetailPage;