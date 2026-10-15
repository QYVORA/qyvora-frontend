import { useCallback, useEffect, useMemo, useState } from 'react';
import { Award, Download, ExternalLink, Eye } from 'lucide-react';
import { useAuth } from '@/core/contexts/AuthContext';
import { useToast } from '@/core/contexts/ToastContext';
import { useProfile } from '@/shared/hooks/useProfile';
import {
  claimCredentials,
  credentialProgram,
  getUserCredentials,
  verifyPath,
  type LearnerCredential,
} from '@/core/services/credentials';
import CertificateFrame, {
  CERTIFICATE_PRINT_EVENT,
} from '@/shared/components/certificates/CertificateFrame';
import CertificateClaimCard from '@/shared/components/certificates/CertificateClaimCard';
import {
  Button,
  Card,
  Dialog,
  DialogContent,
  EmptyState,
  ErrorState,
  FadeIn,
  PageHeader,
  SectionHeader,
  Skeleton,
} from '@/shared/components/ui';
import PageBody from '@/shared/components/layout/PageBody';
import SEO from '@/shared/components/SEO';
import hpbLogo from '@/assets/bootcamp/HPB-logo.webp';
import qoseLogo from '@/assets/bootcamp/QOSE-Logo.webp';

const PROGRAMME_LOGO = { HPB: hpbLogo, QOSE: qoseLogo } as const;
const PROGRAMME_ALT = {
  HPB: 'Hacker Protocol Bootcamp',
  QOSE: 'QYVORA Offensive Security Engineer Bootcamp',
} as const;

const formatDate = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

/**
 * CertificatesPage — the learner's earned, verifiable credentials.
 *
 * Lists every credential issued to the signed-in learner and lets them open the
 * full certificate and export it as a PDF (browser print → Save as PDF, the same
 * pipeline the admin certificate templates use).
 *
 * Legacy completers — learners who finished the Hacker Protocol Bootcamp before
 * the credential service issued certificates — see a claim action. Claiming
 * calls the idempotent `POST /credentials/claim` backfill; the backend remains
 * the sole issuer, so this page never fabricates a certificate.
 */
const CertificatesPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { profile } = useProfile({ authUser: user });

  const [credentials, setCredentials] = useState<LearnerCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<LearnerCredential | null>(null);

  // Size the printed page to US Letter landscape so "Download PDF" (browser
  // print dialog → Save as PDF) produces an exact-trim certificate — the same
  // contract the admin certificate templates rely on.
  useEffect(() => {
    const styleId = 'cert-print-page-style';
    let el = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement('style');
      el.id = styleId;
      document.head.appendChild(el);
    }
    el.textContent = '@page { size: 11in 8.5in; margin: 0; }';
    return () => {
      el?.remove();
    };
  }, []);

  const load = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const list = await getUserCredentials(user.uid);
      setCredentials(list);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    load();
  }, [load]);

  const recipientName = profile?.displayName || user?.username || 'Operator';

  const hasHpb = useMemo(
    () => credentials.some((c) => credentialProgram(c.programName) === 'HPB'),
    [credentials],
  );
  const canClaimHpb = user?.bootcampStatus === 'completed' && !hasHpb;

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const claimed = await claimCredentials('HPB');
      addToast(
        claimed.length > 0 ? 'Certificate issued to your account.' : 'No certificate is available to claim yet.',
        claimed.length > 0 ? 'success' : 'info',
      );
      await load();
      if (claimed.length > 0) {
        setSelected(claimed[0]);
        setDialogOpen(true);
      }
    } catch {
      addToast('Could not claim your certificate. Please try again.', 'error');
    } finally {
      setClaiming(false);
    }
  };

  const openCertificate = (credential: LearnerCredential) => {
    setSelected(credential);
    setDialogOpen(true);
  };

  const handleDownload = () => {
    window.dispatchEvent(new Event(CERTIFICATE_PRINT_EVENT));
  };

  return (
    <FadeIn>
      <div className="min-h-full bg-canvas">
        <SEO
          title="Certificates"
          description="Your verifiable QYVORA credentials | QYVORA"
          noindex
        />

        <PageBody spacing="sections">
          <PageHeader
            kicker="Achievements"
            title="Certificates"
            description="Your verifiable credentials — view, verify and download each certificate of completion."
          />

          {error ? (
            <ErrorState
              title="Could not load certificates"
              message="We couldn't reach the credential service. Please try again later."
              severity="error"
            />
          ) : loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-live="polite">
              <span className="sr-only">Loading certificates…</span>
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} variant="card" className="h-56" />
              ))}
            </div>
          ) : (
            <>
              {canClaimHpb && (
                <CertificateClaimCard onClaim={handleClaim} loading={claiming} />
              )}

              {credentials.length > 0 ? (
                <div className="space-y-4">
                  <SectionHeader
                    title="Your credentials"
                    description="Each credential carries a public verification link."
                  />
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {credentials.map((credential) => {
                      const program = credentialProgram(credential.programName);
                      const revoked = credential.status !== 'ACTIVE';
                      return (
                        <Card key={credential.credentialId} className="flex flex-col gap-4 p-5">
                          <div className="flex items-start justify-between gap-3">
                            <img
                              src={PROGRAMME_LOGO[program]}
                              alt={PROGRAMME_ALT[program]}
                              className="h-14 w-14 shrink-0 object-contain"
                            />
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                                revoked
                                  ? 'bg-danger/10 text-danger'
                                  : 'bg-accent/10 text-accent'
                              }`}
                            >
                              {revoked ? credential.status : 'Issued'}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-black uppercase tracking-tight text-text-primary">
                              {credential.programName || 'QYVORA program'}
                            </p>
                            <p className="mt-1 text-xs text-text-muted">
                              {formatDate(credential.completionDate)} ·{' '}
                              {credential.result === 'PASS' ? 'Completed' : 'Not passed'}
                            </p>
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">
                              Credential ID
                            </p>
                            <p className="truncate font-mono text-xs text-text-secondary">
                              {credential.credentialId}
                            </p>
                          </div>

                          <div className="mt-auto flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              icon={<Eye className="h-3.5 w-3.5" aria-hidden="true" />}
                              onClick={() => openCertificate(credential)}
                            >
                              View
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              to={verifyPath(credential.credentialId)}
                              trailingIcon={<ExternalLink className="h-3.5 w-3.5" />}
                            >
                              Verify
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ) : (
                !canClaimHpb && (
                  <EmptyState
                    icon={<Award className="h-5 w-5" aria-hidden="true" />}
                    title="No certificates yet"
                    description="Complete a bootcamp to earn a verifiable certificate of completion."
                    action={
                      <Button to="/dashboard/bootcamps" variant="secondary" size="sm">
                        View bootcamps
                      </Button>
                    }
                  />
                )
              )}
            </>
          )}
        </PageBody>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent
            title="Certificate"
            description="Download a PDF copy or open the public verification page."
            maxWidth="max-w-4xl"
          >
            {selected && (
              <div className="space-y-5">
                <CertificateFrame
                  printable
                  data={{
                    recipientName: selected.recipientName || recipientName,
                    programName: selected.programName,
                    cohortIdentifier: selected.cohortIdentifier || '',
                    completionDate: selected.completionDate,
                    credentialId: selected.credentialId,
                    verificationUrl: selected.verifyUrl || verifyPath(selected.credentialId),
                  }}
                  config={{
                    program: credentialProgram(selected.programName),
                    orientation: 'landscape',
                  }}
                />
                <div className="flex flex-wrap gap-3">
                  <Button
                    icon={<Download className="h-4 w-4" aria-hidden="true" />}
                    onClick={handleDownload}
                  >
                    Download PDF
                  </Button>
                  <Button
                    variant="secondary"
                    to={verifyPath(selected.credentialId)}
                    trailingIcon={<ExternalLink className="h-4 w-4" />}
                  >
                    Verify credential
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </FadeIn>
  );
};

export default CertificatesPage;
