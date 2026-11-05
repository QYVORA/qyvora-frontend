import { ArrowRight, CalendarDays, CheckCircle2, Wallet } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { Card } from '@/shared/components/ui/Card';
import { LearningCard } from '@/shared/components/learning/LearningCard';
import ScrollReveal from '@/shared/components/ScrollReveal';
import BootcampFacts, { BootcampLogo } from '@/features/marketing/components/bootcamp/BootcampFacts';
import ProgrammeHeroCard from '@/features/marketing/components/programmes/ProgrammeHeroCard';
import ProgrammeCtaCard from '@/features/marketing/components/programmes/ProgrammeCtaCard';
import QoseRegistrationForm from '@/features/marketing/components/bootcamp/QoseRegistrationForm';
import { BOOTCAMPS } from '@/features/marketing/content/bootcampData';
import qoseHeaderBg from '@/assets/backgrounds/qose-header.webp';

const QOSE = BOOTCAMPS.qose;

const QOSE_INSTALMENTS = [
  {
    month: 'Month 1',
    amount: 'GH₵300',
    note: 'Confirms your seat and covers the first month of coursework, labs and cohort support.',
  },
  {
    month: 'Month 2',
    amount: 'GH₵250',
    note: 'Covers the second month of coursework, labs and assessments.',
  },
  {
    month: 'Month 3',
    amount: 'GH₵250',
    note: 'Covers the final month, the capstone and your professional report.',
  },
];

const QOSE_COHORT_DETAILS = [
  'Registration opens November 2026',
  'Cohort starts 1 December 2026',
  'Three months, delivered online',
  'Kali Linux, VMs and containerized labs',
  'Prerequisite: Hacker Protocol Bootcamp',
];

/**
 * QOSE — QYVORA Offensive Security Engineer Bootcamp.
 *
 * Programme facts, phases and audience come from the QOSE programme
 * documentation. Registration is open for the 1 December 2026 cohort: the page
 * states the dates and instalments plainly, and the registration form records
 * a seat request without taking payment.
 *
 * Structure mirrors `/hpb` exactly: the same `ProgrammeHeroCard` over its own
 * mapped scene, the same facts strip, the same card primitives and the same
 * mapped CTA card.
 */
const QosePage = () => {
  return (
    <div className="w-full bg-canvas">
      <SEO
        title="Offensive Security Engineer Bootcamp (QOSE) | QYVORA"
        description="QOSE is a 3-month, practical-first online bootcamp that turns Hacker Protocol Bootcamp graduates into entry-level offensive-security practitioners."
        breadcrumbName="QOSE"
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <ProgrammeHeroCard
          headingId="qose-hero-title"
          background={qoseHeaderBg}
          mark={<BootcampLogo bootcamp={QOSE} size="sm" accent />}
          kicker={"QYVORA · Bootcamp"}
          status={
            <>
              <Badge variant="success" size="md">
                <CheckCircle2 className="mr-1.5 h-3 w-3" aria-hidden="true" />
                {QOSE.statusLabel}
              </Badge>
              <span className="type-meta text-text-muted">{`${QOSE.acronym} · ${QOSE.name}`}</span>
            </>
          }
          title={QOSE.name}
          description={QOSE.tagline}
          meta={
            <p className="type-body-sm max-w-2xl text-text-secondary">{QOSE.statusNote}</p>
          }
          actions={
            <>
              <Button href="#qose-enrol" size="lg">
                {QOSE.ctaLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button to="/hpb" variant="secondary" size="lg">
                {"Prerequisite: HPB"}
              </Button>
            </>
          }
        />

        <div className="mt-4 md:mt-5">
          <BootcampFacts facts={QOSE.facts} />
        </div>

        <ScrollReveal>
          <section aria-labelledby="qose-tuition-title" className="mt-14 md:mt-20">
            <div className="mb-6 md:mb-8">
              <span className="block text-kicker font-black uppercase tracking-[0.3em] text-accent">
                {"Tuition & dates"}
              </span>
              <h2
                id="qose-tuition-title"
                className="type-h2 mt-2 font-black uppercase tracking-tight text-text-primary"
              >
                {"One programme. Three instalments."}
              </h2>
              <p className="type-body mt-3 max-w-2xl text-text-secondary">
                {"Registration opens in November 2026 for the cohort starting 1 December 2026. The first instalment confirms your seat; the remaining two instalments cover months two and three."}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {QOSE_INSTALMENTS.map((instalment) => (
                <Card key={instalment.month} className="flex flex-col gap-3 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="type-label uppercase tracking-[0.12em] text-text-tertiary">
                      {instalment.month}
                    </span>
                    <Wallet className="h-5 w-5 text-accent" aria-hidden="true" />
                  </div>
                  <p className="text-3xl font-black tracking-tight text-text-primary">
                    {instalment.amount}
                  </p>
                  <p className="type-body-sm text-text-secondary">{instalment.note}</p>
                </Card>
              ))}
            </div>

            <Card className="mt-4 flex flex-col gap-5 p-6 md:flex-row md:items-start md:justify-between md:p-8">
              <div className="max-w-xl">
                <span className="block text-kicker font-black uppercase tracking-[0.3em] text-accent">
                  {"Total tuition"}
                </span>
                <p className="mt-2 text-3xl font-black tracking-tight text-text-primary">
                  {'GH₵800'}
                </p>
                <p className="type-body-sm mt-2 text-text-secondary">
                  {"Payable as GH₵300 in month one, then GH₵250 in months two and three. Submitting the registration form does not take payment — we send payment instructions and confirm your seat once the first instalment is received."}
                </p>
              </div>
              <div className="w-full max-w-md rounded-xl border border-border-subtle bg-surface-raised p-4">
                <div className="mb-3 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-accent" aria-hidden="true" />
                  <span className="type-label uppercase tracking-[0.12em] text-text-tertiary">
                    {"Cohort details"}
                  </span>
                </div>
                <ul className="flex flex-col gap-2">
                  {QOSE_COHORT_DETAILS.map((detail) => (
                    <li key={detail} className="flex gap-2">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                        aria-hidden="true"
                      />
                      <span className="type-body-sm text-text-secondary">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section aria-labelledby="qose-overview-title" className="mt-14 md:mt-20">
            <div className="mb-6 md:mb-8">
              <span className="block text-kicker font-black uppercase tracking-[0.3em] text-accent">
                {"What it is"}
              </span>
              <h2
                id="qose-overview-title"
                className="type-h2 mt-2 font-black uppercase tracking-tight text-text-primary"
              >
                {"From foundation to structured assessment work"}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
              <Card className="flex flex-col gap-3 p-6 md:p-8">
                <span className="block text-kicker font-black uppercase tracking-[0.3em] text-accent">
                  {"Overview"}
                </span>
                <p className="type-body text-text-secondary">{QOSE.overview}</p>
              </Card>
              <Card className="flex flex-col gap-3 p-6 md:p-8">
                <span className="block text-kicker font-black uppercase tracking-[0.3em] text-accent">
                  {"Who it is for"}
                </span>
                <p className="type-body text-text-secondary">{QOSE.audience}</p>
              </Card>
            </div>

            <Card className="mt-4 flex flex-col gap-4 p-6 md:p-8">
              <span className="block text-kicker font-black uppercase tracking-[0.3em] text-accent">
                {"What it covers"}
              </span>
              <ul className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
                {QOSE.covers.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                    <span className="type-body-sm text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section aria-labelledby="qose-phases-title" className="mt-14 md:mt-20">
            <div className="mb-6 md:mb-8">
              <span className="block text-kicker font-black uppercase tracking-[0.3em] text-accent">
                {"The curriculum"}
              </span>
              <h2
                id="qose-phases-title"
                className="type-h2 mt-2 font-black uppercase tracking-tight text-text-primary"
              >
                {"Six phases, twelve weeks, one engagement cycle"}
              </h2>
              <p className="type-body mt-3 max-w-2xl text-text-secondary">
                {"Students move through the same engagement cycle again and again at increasing depth — reconnaissance, enumeration, attack surface, validation, exploitation, privilege escalation, lateral movement, evidence and report."}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {QOSE.phases.map((phase, index) => (
                <LearningCard
                  key={phase.title}
                  type="bootcamp"
                  showAction={false}
                  badge={
                    <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 font-mono text-lg font-black text-accent">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  }
                  title={phase.title}
                  description={phase.summary}
                  className="min-h-[240px]"
                />
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section aria-labelledby="qose-ethics-title" className="mt-14 md:mt-20">
            <div className="mb-6 md:mb-8">
              <span className="block text-kicker font-black uppercase tracking-[0.3em] text-accent">
                {"Ground rules"}
              </span>
              <h2
                id="qose-ethics-title"
                className="type-h2 font-black uppercase tracking-tight text-text-primary"
              >
                {"Authorized work only"}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
              <Card className="flex flex-col gap-4 p-6 md:p-8">
                <span className="block text-kicker font-black uppercase tracking-[0.3em] text-accent">
                  {"Ethics & responsibility"}
                </span>
                <ul className="flex flex-col gap-3">
                  {QOSE.ethics.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        aria-hidden="true"
                      />
                      <span className="type-body-sm text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="type-body-sm border-t border-border-subtle pt-4 text-text-muted">
                  All assessment work is carried out inside written authorization and agreed
                  rules of engagement. No testing without written authorization.
                </p>
              </Card>

              <div id="qose-enrol" className="scroll-mt-24">
                <ProgrammeCtaCard
                  kicker={"Enrolment"}
                  title={"Reserve your seat for 1 December 2026"}
                  description={"Registration is open. Submit your details and we will send payment instructions for the GH₵300 first instalment. Your seat is confirmed once that payment is received."}
                >
                  <QoseRegistrationForm
                    bootcampId="qose"
                    source="qose_page"
                    submitLabel="Reserve my seat"
                  />
                  <Button
                    href={QOSE.whatsappUrl}
                    external
                    variant="secondary"
                    className="mt-3 text-sm"
                  >
                    {"Join the QOSE WhatsApp group"}
                  </Button>
                </ProgrammeCtaCard>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </PublicContainer>
    </div>
  );
};

export default QosePage;