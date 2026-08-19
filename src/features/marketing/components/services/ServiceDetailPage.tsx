import React from 'react';
import { Link } from 'react-router-dom';
import { Target, FileText, CheckCircle2 } from 'lucide-react';
import { IconArrowRight, IconArrowLeft } from '@/shared/components/icons';
import { openServiceRequestModal } from '@/features/marketing/components/ServiceRequestModal';
import { DottedMapOverlay } from '@/shared/components/ui';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { REQUEST_ASSESSMENT_LABEL, PENTEST_PHILOSOPHY, type ServiceConfig } from '@/features/marketing/content/servicesConfig';
import { buildService } from '@/shared/seo/schema';
import ScrollReveal from '@/shared/components/ScrollReveal';

const ServiceDetailPage: React.FC<{ svc: ServiceConfig }> = ({ svc }) => {
  const Icon = svc.icon;

  return (
    <>
      <SEO
        title={`${svc.title} - QYVORA`}
        description={svc.overview}
        breadcrumbName={svc.title}
        schemaData={buildService(svc)}
      />

      <PublicSnapLayout>
        {/* ── SECTION 1: Hero ──────────────────────────────────────────── */}
        <section className="relative w-full min-h-dvh lg:h-dvh snap-section bg-bg overflow-hidden">
          <StudentHeroSection
            title={svc.title.split(' ').slice(0, -1).join(' ')}
            accentWord={svc.accentWord}
            titleClassName={PUBLIC_HERO_TITLE_CLASS}
            showGlobe
            description={svc.overview}
          >
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${
              svc.featured ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-bg-elevated border-border/30 text-text-muted'
            }`}>
              <Icon className="w-3 h-3" /> {svc.badge}
            </span>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
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
          </StudentHeroSection>
        </section>

        {/* ── SECTION 2: Scope & What's Included ─────────────────────────
            Desktop: LEFT = header + scope text, RIGHT = included items card
        ──────────────────────────────────────────────────────────────────── */}
        <PublicSnapSection>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Header */}
            <ScrollReveal>
              <div className="space-y-6">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block">
                  Scope of Work
                </span>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
                  What This Engagement <span className="text-accent">Covers</span>
                </h2>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-mono">
                  {svc.scope}
                </p>
                {svc.price && (
                  <div className="pt-2">
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
                      <p className="text-xs text-text-muted leading-relaxed mt-2 font-mono">{svc.priceNote}</p>
                    )}
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Right: Included items */}
            <ScrollReveal delay={0.1}>
              <div className="relative rounded-2xl border border-border/30 bg-bg-card p-6 lg:p-8 overflow-hidden">
                <DottedMapOverlay className="rounded-2xl" />
                <div className="relative">
                  <span className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-4 block">
                    What&apos;s Included
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {svc.included.map((item) => (
                      <li key={item} className="flex items-start gap-3 rounded-xl border border-border/30 bg-bg-elevated/60 px-4 py-3">
                        <span className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                        </span>
                        <span className="text-xs sm:text-sm text-text-secondary leading-relaxed flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                  {svc.highlight && (
                    <div className="mt-6 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
                      <p className="text-xs sm:text-sm text-accent font-mono leading-relaxed">{svc.highlight}</p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </PublicSnapSection>

        {/* ── SECTION 3: Benefits (reversed) ─────────────────────────────
            Desktop: LEFT = benefits cards, RIGHT = header
        ──────────────────────────────────────────────────────────────────── */}
        <PublicSnapSection>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Benefits cards */}
            <ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {svc.benefits.map((benefit, idx) => (
                  <ScrollReveal key={benefit} delay={idx * 0.05}>
                    <div className="relative rounded-2xl border border-border/30 bg-bg-card p-5 overflow-hidden">
                      <DottedMapOverlay className="rounded-2xl" />
                      <div className="relative flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                          <Target className="w-4 h-4 text-accent" />
                        </div>
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-mono flex-1">
                          {benefit}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>

            {/* Right: Header */}
            <ScrollReveal delay={0.1}>
              <div className="space-y-6">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block">
                  Benefits
                </span>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
                  What You <span className="text-accent">Gain</span>
                </h2>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-mono">
                  Every engagement delivers actionable results — not just a report that sits on a shelf.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </PublicSnapSection>

        {/* ── SECTION 4: Deliverables ────────────────────────────────────
            Desktop: LEFT = header, RIGHT = deliverables cards
        ──────────────────────────────────────────────────────────────────── */}
        <PublicSnapSection>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Header */}
            <ScrollReveal>
              <div className="space-y-6">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block">
                  Deliverables
                </span>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
                  The Security <span className="text-accent">Report</span>
                </h2>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-mono">
                  You receive a professional security report that covers everything from executive summaries to detailed remediation steps.
                </p>
              </div>
            </ScrollReveal>

            {/* Right: Deliverables */}
            <ScrollReveal delay={0.1}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {svc.deliverables.map((deliverable, idx) => (
                  <ScrollReveal key={deliverable.label} delay={idx * 0.05}>
                    <div className="relative rounded-2xl border border-border/30 bg-bg-card p-5 overflow-hidden">
                      <DottedMapOverlay className="rounded-2xl" />
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                            <FileText className="w-3.5 h-3.5 text-accent" />
                          </div>
                          <h3 className="text-xs font-black text-text-primary uppercase tracking-widest">
                            {deliverable.label}
                          </h3>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed font-mono">
                          {deliverable.desc}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </PublicSnapSection>

        {/* ── SECTION 5: Philosophy & CTA (reversed) ─────────────────────
            Desktop: LEFT = CTA card, RIGHT = header + philosophy
        ──────────────────────────────────────────────────────────────────── */}
        <PublicSnapSection>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: CTA card */}
            <ScrollReveal>
              <div className="relative rounded-2xl border border-accent/40 bg-accent/5 p-8 overflow-hidden">
                <div className="relative flex flex-col items-start text-left space-y-5">
                  <h3 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
                    Ready to get started?
                  </h3>
                  <p className="text-sm text-text-muted font-mono">
                    Request an assessment or explore the full range of services.
                  </p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                    <button
                      onClick={() => openServiceRequestModal(svc.title)}
                      className="btn-primary inline-flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-3.5 whitespace-nowrap"
                    >
                      {REQUEST_ASSESSMENT_LABEL} <IconArrowRight size={14} />
                    </button>
                    <Link
                      to="/services"
                      className="btn-secondary inline-flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-3.5 whitespace-nowrap"
                    >
                      <IconArrowLeft size={14} /> All Services
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right: Philosophy header */}
            <ScrollReveal delay={0.1}>
              <div className="space-y-6">
                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block">
                  {PENTEST_PHILOSOPHY.heading}
                </span>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
                  Thorough Assessment, <span className="text-accent">Not Checkbox Audits</span>
                </h2>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-mono">
                  {PENTEST_PHILOSOPHY.body}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </PublicSnapSection>

        {/* ── SECTION 6: Footer ────────────────────────────────────────── */}
        <section className="relative w-full min-h-dvh lg:h-dvh snap-section bg-bg overflow-hidden">
          <Footer />
        </section>
      </PublicSnapLayout>
    </>
  );
};

export default ServiceDetailPage;
