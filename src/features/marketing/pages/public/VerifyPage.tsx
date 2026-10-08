import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Link2, Search, ShieldAlert, ShieldX } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import { Card } from '@/shared/components/ui/Card';
import InlineAlert from '@/shared/components/ui/InlineAlert';
import Skeleton from '@/shared/components/ui/Skeleton';
import CertificateRenderer from '@/shared/components/certificates/CertificateRenderer';
import {
  verifyCredential,
  normalizeCredentialId,
  type VerificationResult,
  type VerifiedCredential,
} from '@/core/services/credentialVerification';

const STEPS = [
  {
    title: 'Paste the credential ID',
    body: 'Every QYVORA certificate prints its credential ID in the footer. Paste it as-is — a full verification link works too.',
  },
  {
    title: 'Registry and chain check',
    body: 'The ID is checked against the issuing registry and compared with its hash anchor on qyvora-chain.',
  },
  {
    title: 'Instant result',
    body: 'You get a clear verdict: valid, revoked, or not found. No account and no approval required.',
  },
];

const formatDate = (value?: string) => {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const fieldRows = (credential: VerifiedCredential) => [
  { label: 'Recipient', value: credential.recipientName },
  { label: 'Programme', value: credential.programName },
  { label: 'Cohort', value: credential.cohortIdentifier || '—' },
  { label: 'Completed', value: formatDate(credential.completionDate) },
  { label: 'Result', value: credential.result },
  { label: 'Issued', value: formatDate(credential.issuedAt) },
];

const VerifyPage: React.FC = () => {
  const { credentialId } = useParams<{ credentialId: string }>();
  const navigate = useNavigate();

  const [input, setInput] = useState(credentialId ?? '');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const runVerify = useCallback(async (id: string) => {
    setChecking(true);
    setResult(null);
    setCopied(false);
    const outcome = await verifyCredential(id);
    setResult(outcome);
    setChecking(false);
  }, []);

  useEffect(() => {
    if (credentialId) {
      setInput(credentialId);
      void runVerify(credentialId);
    } else {
      setResult(null);
      setChecking(false);
    }
  }, [credentialId, runVerify]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = normalizeCredentialId(input);
    if (!normalized) {
      setResult({
        state: 'invalid',
        credentialId: input.trim(),
        message: 'That does not look like a credential ID. Paste the full ID shown on the certificate.',
      });
      return;
    }
    if (normalized !== credentialId) {
      navigate(`/verify/${encodeURIComponent(normalized)}`);
    } else {
      void runVerify(normalized);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const credential = result?.credential;
  const certificateProgram =
    credential && (credential.bootcampId === 'HPB' || /hacker protocol/i.test(credential.programName))
      ? 'HPB'
      : 'QOSE';

  return (
    <div className="w-full bg-canvas">
      <SEO
        title="Verify a Credential | QYVORA"
        description="Verify a QYVORA bootcamp credential by pasting its credential ID. Public, instant, and independent of the certificate file."
        noindex
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker="QYVORA · Credentials"
          title="Verify a Credential"
          description="Paste the credential ID printed on any QYVORA certificate to check it against the issuing registry and its chain anchor."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {/* Lookup form */}
          <Card className="flex h-fit flex-col gap-5 p-5 md:p-6">
            <div className="flex flex-col gap-1">
              <p className="type-label uppercase tracking-[0.12em] text-accent">Lookup</p>
              <h2 className="text-xl font-black uppercase tracking-tight text-text-primary md:text-2xl">
                Check an ID
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-2">
                <label
                  htmlFor="verify-credential-id"
                  className="type-label block uppercase tracking-[0.12em] text-text-tertiary"
                >
                  Credential ID
                </label>
                <Input
                  id="verify-credential-id"
                  name="credentialId"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="550e8400-e29b-41d4-a716-446655440000"
                  icon={<Search className="h-4 w-4" aria-hidden="true" />}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  error={result?.state === 'invalid' ? result.message : undefined}
                  aria-describedby="verify-credential-id-hint"
                />
                <p id="verify-credential-id-hint" className="type-meta text-text-tertiary">
                  Found in the footer of every issued certificate.
                </p>
              </div>

              <Button type="submit" size="lg" loading={checking} className="w-full">
                {checking ? 'Checking…' : 'Verify Credential'}
              </Button>
            </form>
          </Card>

          {/* How it works */}
          <Card className="flex h-fit flex-col gap-5 p-5 md:p-6">
            <div className="flex flex-col gap-1">
              <p className="type-label uppercase tracking-[0.12em] text-accent">Process</p>
              <h2 className="text-xl font-black uppercase tracking-tight text-text-primary md:text-2xl">
                How verification works
              </h2>
            </div>
            <ol className="flex flex-col gap-4">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 font-mono text-sm font-bold text-accent"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-text-primary">{step.title}</p>
                    <p className="mt-0.5 text-sm text-text-secondary">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="type-meta text-text-tertiary">
              Verification is public and requires no account. Only the recipient's name and
              completion details are shown.
            </p>
          </Card>
        </div>

        {/* Result region */}
        <div className="mt-6" role="status" aria-live="polite">
          {checking && (
            <Card className="flex flex-col gap-4 p-5 md:p-6">
              <p className="type-label uppercase tracking-[0.12em] text-accent">
                Checking credential…
              </p>
              <Skeleton variant="text" className="w-1/3" />
              <Skeleton variant="text" className="w-2/3" />
              <Skeleton variant="text" className="w-1/2" />
            </Card>
          )}

          {!checking && result && result.state === 'error' && (
            <InlineAlert variant="danger" title="Verification unavailable">
              {result.message}
            </InlineAlert>
          )}

          {!checking && result && result.state === 'not-found' && (
            <Card className="flex flex-col gap-3 p-5 md:p-6">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-6 w-6 shrink-0 text-semantic-warning" aria-hidden="true" />
                <h2 className="text-lg font-black uppercase tracking-tight text-text-primary md:text-xl">
                  Credential not found
                </h2>
              </div>
              <p className="text-sm text-text-secondary">
                No credential matches <span className="font-mono text-text-primary">{result.credentialId}</span>.
                Check the ID for typos — it is case-insensitive and also accepts the full
                verification link.
              </p>
              {result.message && <p className="type-meta text-text-tertiary">{result.message}</p>}
            </Card>
          )}

          {!checking && result && result.state === 'revoked' && credential && (
            <Card className="flex flex-col gap-4 p-5 md:p-6">
              <div className="flex items-center gap-3">
                <ShieldX className="h-6 w-6 shrink-0 text-semantic-danger" aria-hidden="true" />
                <h2 className="text-lg font-black uppercase tracking-tight text-text-primary md:text-xl">
                  Credential revoked
                </h2>
              </div>
              <p className="text-sm text-text-secondary">
                This credential was issued by QYVORA but has been revoked and no longer proves
                completion of {credential.programName}.
              </p>
              <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {fieldRows(credential).map((row) => (
                  <div key={row.label} className="min-w-0">
                    <dt className="type-label uppercase tracking-widest text-text-muted">
                      {row.label}
                    </dt>
                    <dd className="mt-1 break-words font-mono text-sm text-text-primary">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="type-meta text-text-tertiary">
                Credential ID: <span className="break-all">{result.credentialId}</span>
              </p>
            </Card>
          )}

          {!checking && result && result.state === 'valid' && credential && (
            <div className="flex flex-col gap-4">
              <Card className="flex flex-col gap-5 p-5 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-tight text-text-primary md:text-xl">
                        Credential verified
                      </h2>
                      <p className="type-meta text-text-tertiary">
                        {credential.status === 'ACTIVE' ? 'Status: Active' : `Status: ${credential.status}`}
                        {typeof credential.blockIndex === 'number' ? ` · Block #${credential.blockIndex}` : ''}
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" icon={<Link2 className="h-4 w-4" aria-hidden="true" />} onClick={copyLink}>
                    {copied ? 'Link copied' : 'Copy verification link'}
                  </Button>
                </div>

                <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                  {fieldRows(credential).map((row) => (
                    <div key={row.label} className="min-w-0">
                      <dt className="type-label uppercase tracking-widest text-text-muted">
                        {row.label}
                      </dt>
                      <dd className="mt-1 break-words font-mono text-sm text-text-primary">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                  <div className="min-w-0 sm:col-span-2 lg:col-span-3">
                    <dt className="type-label uppercase tracking-widest text-text-muted">
                      Credential ID
                    </dt>
                    <dd className="mt-1 break-all font-mono text-sm text-text-primary">
                      {result.credentialId}
                    </dd>
                  </div>
                </dl>

                <InlineAlert
                  variant={credential.chainVerified ? 'success' : 'info'}
                  title={credential.chainVerified ? 'Anchored on qyvora-chain' : 'Registry record'}
                >
                  {credential.chainVerified
                    ? 'The credential hash is anchored on qyvora-chain — the record is tamper-evident.'
                    : 'This record is served from the issuing registry while chain anchoring is pending.'}
                  {result.source === 'local' &&
                    ' Served from a local demonstration record — the credential API is not connected yet.'}
                </InlineAlert>
              </Card>

              <div className="flex flex-col gap-3">
                <p className="type-label uppercase tracking-[0.12em] text-accent">
                  Issued certificate · read-only
                </p>
                <CertificateRenderer
                  className="max-w-5xl"
                  data={{
                    recipientName: credential.recipientName,
                    programName: credential.programName,
                    cohortIdentifier: credential.cohortIdentifier,
                    completionDate: credential.completionDate,
                    credentialId: result.credentialId,
                  }}
                  config={{ program: certificateProgram, orientation: 'landscape' }}
                />
              </div>
            </div>
          )}
        </div>
      </PublicContainer>
    </div>
  );
};

export default VerifyPage;
