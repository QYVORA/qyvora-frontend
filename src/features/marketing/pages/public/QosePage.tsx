import { ArrowRight } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import ScrollReveal from '@/shared/components/ScrollReveal';
import BootcampFacts, { BootcampLogo } from '@/features/marketing/components/bootcamp/BootcampFacts';
import { openBootcampAccessModal } from '@/features/marketing/components/bootcamp/BootcampAccessModal';
import { BOOTCAMPS } from '@/features/marketing/content/bootcampData';

const QOSE = BOOTCAMPS.qose;

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li className="flex gap-3">
    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
    <span className="type-body-sm text-text-secondary">{children}</span>
  </li>
);

/**
 * QOSE — QYVORA Offensive Security Engineer Bootcamp.
 *
 * Programme facts, phases and audience come from the QOSE programme
 * documentation. The programme is in pre-registration, so the page states that
 * plainly and every join route opens the access dialog rather than a
 * registration form.
 */
const QosePage = () => {
  return (
    <div className="w-full bg-canvas">
      <SEO
        title="Offensive Security Engineer Bootcamp (QOSE) | QYVORA"
        description="QOSE is a 12-week, practical-first online bootcamp that turns Hacker Protocol Bootcamp graduates into entry-level offensive-security practitioners."
        breadcrumbName="QOSE"
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <section
          aria-labelledby="qose-hero-title"
          className="rounded-2xl border border-border-subtle bg-surface"
        >
          <div className="flex flex-col items-center gap-8 p-5 md:p-10 lg:flex-row lg:items-center lg:gap-12">
            <BootcampLogo bootcamp={QOSE} size="lg" />

            <div className="min-w-0 flex-1 text-center lg:text-left">
              <span className="type-label uppercase tracking-[0.12em] text-accent">
                {"QYVORA · Bootcamp"}
              </span>
              <h1
                id="qose-hero-title"
                className="mt-2 text-3xl font-black uppercase tracking-tight text-text-primary md:text-4xl lg:text-5xl"
              >
                {QOSE.name}
              </h1>
              <p className="mt-3 text-base text-text-secondary md:text-lg">{QOSE.tagline}</p>
              <p className="type-body-sm mt-3 text-text-muted">
                {`Also known as ${QOSE.acronym}.`}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 border-t border-border-subtle px-5 py-6 text-center md:px-10 md:py-8 lg:flex-row lg:items-center lg:justify-between lg:text-left">
            <div className="flex flex-col items-center gap-3 lg:items-start">
              <Badge variant="warning" size="md">
                {QOSE.statusLabel}
              </Badge>
              <p className="type-body-sm max-w-xl text-text-secondary">{QOSE.statusNote}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" onClick={() => openBootcampAccessModal('qose')}>
                {QOSE.ctaLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button to="/hpb" variant="secondary" size="md">
                {"Prerequisite: HPB"}
              </Button>
            </div>
          </div>
        </section>

        <div className="mt-4 md:mt-5">
          <BootcampFacts facts={QOSE.facts} />
        </div>

        <ScrollReveal>
          <section aria-labelledby="qose-overview-title" className="mt-14 md:mt-20">
            <div className="mb-6 md:mb-8">
              <span className="type-kicker block text-accent">{"What it is"}</span>
              <h2
                id="qose-overview-title"
                className="type-h2 mt-2 font-black uppercase tracking-tight text-text-primary"
              >
                {"From foundation to structured assessment work"}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
              <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface p-5 md:p-8">
                <p className="type-label uppercase tracking-[0.12em] text-accent">{"Overview"}</p>
                <p className="type-body text-text-secondary">{QOSE.overview}</p>
              </div>
              <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface p-5 md:p-8">
                <p className="type-label uppercase tracking-[0.12em] text-accent">{"Who it is for"}</p>
                <p className="type-body text-text-secondary">{QOSE.audience}</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-border-subtle bg-surface p-5 md:p-8">
              <p className="type-label uppercase tracking-[0.12em] text-accent">{"What it covers"}</p>
              <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                {QOSE.covers.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-xl border border-border-subtle bg-surface-raised px-4 py-3"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                    <span className="type-body-sm text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section aria-labelledby="qose-phases-title" className="mt-14 md:mt-20">
            <div className="mb-6 md:mb-8">
              <span className="type-kicker block text-accent">{"The curriculum"}</span>
              <h2
                id="qose-phases-title"
                className="type-h2 mt-2 font-black uppercase tracking-tight text-text-primary"
              >
                {"Six phases, twelve weeks, one engagement cycle"}
              </h2>
              <p className="type-body mt-3 text-text-secondary">
                Students move through the same engagement cycle again and again at increasing
                depth — reconnaissance, enumeration, attack surface, validation, exploitation,
                privilege escalation, lateral movement, evidence and report.
              </p>
            </div>

            <ol className="flex flex-col gap-3">
              {QOSE.phases.map((phase, index) => (
                <li
                  key={phase.title}
                  className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-surface p-5 md:flex-row md:items-baseline md:gap-6 md:p-6"
                >
                  <span className="type-label shrink-0 uppercase tracking-[0.12em] text-accent md:w-56">
                    {`Phase ${index + 1} — ${phase.title}`}
                  </span>
                  <span className="type-body-sm min-w-0 flex-1 text-text-secondary">
                    {phase.summary}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section aria-labelledby="qose-ethics-title" className="mt-14 md:mt-20">
            <h2 id="qose-ethics-title" className="sr-only">
              {"Ethics, responsibility and how to join"}
            </h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
              <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface p-5 md:p-8">
                <p className="type-label uppercase tracking-[0.12em] text-accent">
                  {"Ethics & responsibility"}
                </p>
                <ul className="flex flex-col gap-3">
                  {QOSE.ethics.map((item) => (
                    <Bullet key={item}>{item}</Bullet>
                  ))}
                </ul>
                <p className="type-body-sm border-t border-border-subtle pt-4 text-text-muted">
                  All assessment work is carried out inside written authorization and agreed
                  rules of engagement. No testing without written authorization.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-border-subtle bg-surface p-5 text-center md:p-8">
                <BootcampLogo bootcamp={QOSE} size="md" />
                <p className="type-h3 font-black uppercase tracking-tight text-text-primary">
                  {"Pre-registration is open"}
                </p>
                <p className="type-body-sm max-w-md text-text-secondary">{QOSE.statusNote}</p>
                <Button
                  size="lg"
                  onClick={() => openBootcampAccessModal('qose')}
                  className="w-full sm:w-auto"
                >
                  {QOSE.ctaLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </PublicContainer>
    </div>
  );
};

export default QosePage;