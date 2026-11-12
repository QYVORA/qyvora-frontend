import React from 'react';
import {
  BadgeCheck,
  Fingerprint,
  Link2,
  Lock,
  ScrollText,
  Search,
  ShieldCheck,
} from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';

const RECORD_FIELDS = [
  { label: 'Recipient', value: 'The name printed on the certificate.' },
  { label: 'Programme', value: 'QOSE, HPB, or another QYVORA bootcamp.' },
  { label: 'Cohort', value: 'The cohort identifier the credential was issued for.' },
  { label: 'Completion date', value: 'When the programme requirements were met.' },
  { label: 'Result', value: 'Pass or fail, recorded at issuance.' },
  { label: 'Credential ID', value: 'The unique ID used for public verification.' },
];

const VERIFICATION_STEPS = [
  {
    icon: Search,
    title: 'Paste the credential ID',
    body: 'Every certificate prints its ID in the footer. Anyone can paste it at /verify — no account or approval is required.',
  },
  {
    icon: Link2,
    title: 'Registry and chain check',
    body: 'The ID is checked against the issuing registry, then compared with its hash anchor on QYVORA Chain.',
  },
  {
    icon: ShieldCheck,
    title: 'A clear verdict',
    body: 'The result is valid, revoked, suspended, or not found. There is no ambiguous in-between state.',
  },
];

const STATUSES = [
  {
    icon: BadgeCheck,
    title: 'Valid',
    body: 'The credential exists, matches its registry entry, and is currently active.',
    tone: 'text-semantic-success',
  },
  {
    icon: ShieldCheck,
    title: 'Revoked or suspended',
    body: 'The credential exists but is no longer valid. The reason is not exposed publicly.',
    tone: 'text-semantic-warning',
  },
  {
    icon: Fingerprint,
    title: 'Not found',
    body: 'No record matches the ID. That can mean a typo, or a credential that was never issued.',
    tone: 'text-text-muted',
  },
];

const CredentialsPage: React.FC = () => {
  return (
    <div className="w-full bg-canvas">
      <SEO
        title="Credentials | QYVORA"
        description="How QYVORA bootcamp credentials work: what they record, how public verification checks the registry and chain, and how revocation is handled."
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker="QYVORA · Credentials"
          title="Credentials that can be checked"
          description="A QYVORA credential is more than a PDF. Each one has a public ID, a registry record, and a chain anchor that anyone can verify."
          actions={
            <Button to="/verify" size="lg">
              <Search className="h-4 w-4" aria-hidden="true" />
              Verify a credential
            </Button>
          }
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="flex flex-col gap-5 p-6 md:p-8">
            <div>
              <p className="type-label uppercase tracking-[0.12em] text-accent">
                What is recorded
              </p>
              <h2 className="mt-1 text-xl font-black uppercase tracking-tight text-text-primary md:text-2xl">
                The public record
              </h2>
              <p className="type-body-sm mt-2 text-text-secondary">
                Every issued credential carries the same core fields. Verification only returns what
                is needed to confirm the achievement.
              </p>
            </div>
            <dl className="grid gap-3 sm:grid-cols-2">
              {RECORD_FIELDS.map((field) => (
                <div key={field.label} className="rounded-xl border border-border-subtle bg-bg p-4">
                  <dt className="type-label uppercase tracking-[0.12em] text-text-tertiary">
                    {field.label}
                  </dt>
                  <dd className="type-body-sm mt-1 text-text-secondary">{field.value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="flex flex-col gap-4 p-6 md:p-8">
            <div>
              <p className="type-label uppercase tracking-[0.12em] text-accent">
                Why it matters
              </p>
              <h2 className="mt-1 text-xl font-black uppercase tracking-tight text-text-primary md:text-2xl">
                The file is not the proof
              </h2>
            </div>
            <p className="type-body-sm text-text-secondary">
              A certificate image can be copied or edited. The registry record cannot. QYVORA stores
              the authoritative credential server-side and anchors a hash on QYVORA Chain, so a
              verifier does not have to trust the document itself.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { icon: Link2, text: 'Registry record is the source of truth.' },
                { icon: Fingerprint, text: 'Chain anchor detects tampering or substitution.' },
                { icon: Lock, text: 'Revocation takes effect immediately, without reissuing the file.' },
                { icon: ScrollText, text: 'The certificate remains a human-readable keepsake.' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center">
                    <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                  </span>
                  <span className="type-body-sm text-text-secondary">{text}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <section aria-labelledby="verification-title" className="mt-12">
          <div className="mb-4">
            <h2
              id="verification-title"
              className="type-h3 font-black uppercase tracking-tight text-text-primary"
            >
              How verification works
            </h2>
            <p className="type-body-sm mt-1 max-w-2xl text-text-muted">
              Public, instant, and independent of the certificate file. The same check is available
              to employers, schools, and anyone else who needs it.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {VERIFICATION_STEPS.map((step, index) => (
              <Card key={step.title} className="flex flex-col gap-3 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center">
                    <step.icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  </span>
                  <span className="type-meta font-mono text-text-muted">{`0${index + 1}`}</span>
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-text-primary">
                  {step.title}
                </h3>
                <p className="type-body-sm text-text-secondary">{step.body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="statuses-title" className="mt-12">
          <div className="mb-4">
            <h2
              id="statuses-title"
              className="type-h3 font-black uppercase tracking-tight text-text-primary"
            >
              What a result means
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {STATUSES.map(({ icon: Icon, title, body, tone }) => (
              <Card key={title} className="flex flex-col gap-3 p-5">
                <Icon className={`h-5 w-5 ${tone}`} aria-hidden="true" />
                <h3 className="text-sm font-black uppercase tracking-tight text-text-primary">
                  {title}
                </h3>
                <p className="type-body-sm text-text-secondary">{body}</p>
              </Card>
            ))}
          </div>
        </section>

        <Card className="mt-12 flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="type-label uppercase tracking-[0.12em] text-accent">
              Ready to check one?
            </p>
            <p className="type-body-sm mt-1 max-w-xl text-text-secondary">
              Paste the credential ID from the certificate footer. Verification is public and
              requires no account.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to="/verify" size="lg">
              Verify a credential
            </Button>
            <Button to="/contact" variant="secondary" size="lg">
              Ask about a credential
            </Button>
          </div>
        </Card>
      </PublicContainer>
    </div>
  );
};

export default CredentialsPage;
