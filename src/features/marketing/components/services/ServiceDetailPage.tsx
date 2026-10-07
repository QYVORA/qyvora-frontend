import React from 'react';
import { Link } from 'react-router-dom';
import { Target, FileText, CheckCircle2, Shield } from 'lucide-react';
import { IconArrowRight, IconArrowLeft, IconCheck } from '@/shared/components/icons';
import { openServiceRequestModal } from '@/features/marketing/components/ServiceRequestModal';
import { DottedMapOverlay, SimpleHeading } from '@/shared/components/ui';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
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
      icon: <SvcIcon className="h-16 w-16" strokeWidth={1.25} />,
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
              <Button onClick={() => openServiceRequestModal(svc.title)} size="lg">
                {REQUEST_ASSESSMENT_LABEL} <IconArrowRight className="h-4 w-4" />
              </Button>
              <Link to="/services" className="btn-secondary inline-flex items-center justify-center gap-2.5">
                <IconArrowLeft className="h-4 w-4" /> All Services
              </Link>
            </>
          }
        />

        <div className="mt-12 space-y-16 md:mt-16 md:space-y-20">
          {/* ── SECTION 1: Scope + Pricing ──────────────────────────────
              Clean split-screen: heading left, content right
          ──────────────────────────────────────────────────────────────── */}
          <ScrollReveal>
            <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <SimpleHeading
                  compact
                  text="What This Engagement Covers"
                  accentWords={1}
                  accentPlacement="end"
                  kicker="Scope"
                  align="left"
                  className="max-w-none"
                />
              </div>

              <div className="lg:col-span-7">
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
                      <Target className="h-5 w-5 text-accent" />
                    </div>
                    <p className="flex-1 text-base leading-relaxed text-text-secondary md:text-lg">
                      {svc.scope}
                    </p>
                  </div>

                  {svc.price && (
                    <div className="border-t border-border-subtle pt-6">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                          Pricing
                        </span>
                      </div>
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                        <span className={`font-black leading-none ${
                          svc.featured ? 'text-3xl text-accent md:text-4xl' : 'text-2xl text-text-primary md:text-3xl'
                        }`}>
                          {svc.price}
                        </span>
                        <span className="font-mono text-sm text-text-muted md:text-base">
                          {svc.priceLocal}
                        </span>
                      </div>
                      {svc.priceNote && (
                        <p className="mt-3 font-mono text-sm leading-relaxed text-text-secondary">
                          {svc.priceNote}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ── SECTION 2: What's Included ──────────────────────────────
              Two-column grid on desktop, single column on mobile
          ──────────────────────────────────────────────────────────────── */}
          <ScrollReveal>
            <div className="space-y-6">
              <SimpleHeading
                compact
                text="What's Included"
                accentWords={1}
                accentPlacement="end"
                align="left"
                className="max-w-2xl"
              />

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {svc.included.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-border-subtle bg-surface px-4 py-3"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                      <IconCheck className="h-4 w-4 text-accent" />
                    </div>
                    <span className="flex-1 text-sm leading-relaxed text-text-secondary">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {svc.highlight && (
                <div className="rounded-xl border border-accent/30 bg-accent/5 px-5 py-4">
                  <div className="flex items-start gap-3">
                    <Shield className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <p className="flex-1 font-mono text-sm leading-relaxed text-accent md:text-base">
                      {svc.highlight}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* ── SECTION 3: Methodology ──────────────────────────────────
              Heading + grid of methodology steps (no card wrapper)
          ──────────────────────────────────────────────────────────────── */}
          {svc.methodology && (
            <ScrollReveal>
              <div className="space-y-6">
                <SimpleHeading
                  compact
                  text={svc.methodology.title || 'How We Do It'}
                  accentWords={1}
                  accentPlacement="end"
                  kicker="Methodology"
                  align="left"
                  description={svc.methodology.description || 'Practical, manual-first approach focused on real impact.'}
                  className="max-w-2xl"
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {svc.methodology.steps?.map((step, idx) => (
                    <div
                      key={step.title}
                      className="flex gap-4 rounded-xl border border-border-subtle bg-surface p-5"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 font-mono text-sm font-bold text-accent">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 text-sm font-black uppercase tracking-tight text-text-primary">
                          {step.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-text-secondary">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* ── SECTION 4: Benefits ─────────────────────────────────────
              Heading + simple list (no card wrapper)
          ──────────────────────────────────────────────────────────────── */}
          <ScrollReveal>
            <div className="space-y-6">
              <SimpleHeading
                compact
                text="What You Gain"
                accentWords={1}
                accentPlacement="end"
                kicker="Benefits"
                align="left"
                description="Every engagement delivers actionable results, not just a report that sits on a shelf."
                className="max-w-2xl"
              />

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {svc.benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3 rounded-xl border border-border-subtle bg-surface px-4 py-3"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                      <Target className="h-4 w-4 text-accent" />
                    </div>
                    <p className="flex-1 font-mono text-sm leading-relaxed text-text-secondary">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* ── SECTION 5: Deliverables ─────────────────────────────────
              Split-screen: heading left, deliverables right
          ──────────────────────────────────────────────────────────────── */}
          <ScrollReveal>
            <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <SimpleHeading
                  compact
                  text="The Security Report"
                  accentWords={1}
                  accentPlacement="end"
                  kicker="Deliverables"
                  align="left"
                  description="You receive a professional security report that covers everything from executive summaries to detailed remediation steps."
                  className="max-w-none"
                />
              </div>

              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {svc.deliverables.map((deliverable) => (
                    <div
                      key={deliverable.label}
                      className="flex gap-3 rounded-xl border border-border-subtle bg-surface p-4"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10">
                        <FileText className="h-4 w-4 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1.5 text-xs font-black uppercase tracking-widest text-text-primary">
                          {deliverable.label}
                        </h3>
                        <p className="text-sm leading-relaxed text-text-secondary">
                          {deliverable.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ── SECTION 6: CTA ──────────────────────────────────────────
              Premium CTA block with dotted map background
          ──────────────────────────────────────────────────────────────── */}
          <ScrollReveal>
            <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-accent/40 bg-accent/5 px-6 py-14 md:px-12 md:py-16">
              <DottedMapOverlay className="rounded-2xl" />
              <div className="relative flex flex-col items-start gap-6 text-left md:items-center md:text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
                  {PENTEST_PHILOSOPHY.heading}
                </span>
                <h3 className="text-3xl font-black uppercase tracking-tight text-text-primary md:text-4xl">
                  Ready to get started?
                </h3>
                <p className="max-w-xl font-mono text-base leading-relaxed text-text-secondary">
                  Request an assessment or explore the full range of services.
                </p>
                <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row">
                  <Button onClick={() => openServiceRequestModal(svc.title)} size="lg">
                    {REQUEST_ASSESSMENT_LABEL} <IconArrowRight className="h-4 w-4" />
                  </Button>
                  <Link to="/services" className="btn-secondary inline-flex items-center justify-center gap-2.5">
                    <IconArrowLeft className="h-4 w-4" /> All Services
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Related services ─────────────────────────────────────────── */}
          <RelatedContentSection items={otherServices} />
        </div>
      </PublicContainer>
    </div>
  );
};

export default ServiceDetailPage;