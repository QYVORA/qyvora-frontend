import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import api from '@/core/services/api';

type VerifyState = 'loading' | 'processing' | 'success' | 'failed' | 'timeout' | 'error';

interface RegistrationState {
  id: string;
  fullName: string;
  plan: 'full' | 'installment';
  stage: string;
  amountMinor: number;
  amountPaidMinor: number;
  remainingMinor: number;
  totalTuitionMinor: number;
  nextStage: string | null;
  nextAmountMinor: number;
  dueAt: string | null;
  currency: string;
  paymentStatus: string;
  reference: string;
  paidAt: string | null;
}

interface VerifyResponse {
  verified: boolean;
  duplicate: boolean;
  status: string;
  registration: RegistrationState | null;
}

const money = (amountMinor: number, currency = 'GHS') => {
  const amount = Number(amountMinor || 0) / 100;
  return currency === 'GHS' ? `GH₵${amount.toFixed(2)}` : `${currency} ${amount.toFixed(2)}`;
};

const STAGE_LABELS: Record<string, string> = {
  enrolment: 'Month 1',
  month2: 'Month 2',
  month3: 'Month 3',
  full: 'Full tuition',
};

const PLAN_LABELS: Record<string, string> = {
  full: 'Full payment',
  installment: 'Three instalments',
};

const POLL_INTERVAL_MS = 3_000;
const POLL_TIMEOUT_MS = 60_000;
const TERMINAL_STATUSES = new Set(['failed', 'abandoned', 'reversed', 'refunded']);

const QosePaymentResultPage = () => {
  const [params] = useSearchParams();
  const reference = params.get('reference') || params.get('trxref') || '';
  const [state, setState] = useState<VerifyState>('loading');
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [message, setMessage] = useState('');
  const [continuing, setContinuing] = useState(false);
  const [continueError, setContinueError] = useState('');

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const startedAt = Date.now();

    const scheduleNext = () => {
      if (cancelled) return;
      if (Date.now() - startedAt >= POLL_TIMEOUT_MS) {
        setState('timeout');
        setMessage(
          'Paystack has not confirmed this payment yet. If you were charged, keep this reference and contact the QYVORA team rather than paying again.'
        );
        return;
      }
      timer = setTimeout(() => void verify(), POLL_INTERVAL_MS);
    };

    const verify = async () => {
      if (cancelled) return;

      if (!reference) {
        setState('error');
        setMessage('No payment reference was supplied. Return to the QOSE page to start checkout.');
        return;
      }

      try {
        const { data } = await api.get<VerifyResponse>(
          `/qose/verify/${encodeURIComponent(reference)}`
        );
        if (cancelled) return;
        setResult(data);

        if (data.verified) {
          setState('success');
          return;
        }

        const status = String(data.status || '').toLowerCase();
        if (TERMINAL_STATUSES.has(status)) {
          setState('failed');
          return;
        }

        setState('processing');
        scheduleNext();
      } catch (err) {
        if (cancelled) return;
        const response = (err as {
          response?: { status?: number; data?: { error?: string } };
        })?.response;
        const retryable =
          !response || response.status === 429 || Number(response.status || 0) >= 500;

        if (retryable) {
          setState('processing');
          scheduleNext();
          return;
        }

        setState('error');
        setMessage(
          response?.data?.error ||
            'We could not verify this payment. If you were charged, contact the QYVORA team with your reference.'
        );
      }
    };

    void verify();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [reference]);

  const registration = result?.registration;
  const isPartial = state === 'success' && registration?.paymentStatus === 'partial';
  const hasNextInstalment = Boolean(isPartial && registration?.nextStage && registration.nextAmountMinor > 0);

  const payNextInstalment = async () => {
    if (!registration?.id) return;
    setContinuing(true);
    setContinueError('');
    try {
      const { data } = await api.post('/qose/continue', { registrationId: registration.id });
      const authorizationUrl = String(data?.authorizationUrl || '');
      if (!/^https:\/\//i.test(authorizationUrl)) {
        throw new Error('The payment provider did not return a valid checkout URL.');
      }
      window.location.assign(authorizationUrl);
    } catch (err) {
      setContinuing(false);
      setContinueError(
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
          'Could not start the next instalment checkout. Please try again.'
      );
    }
  };

  return (
    <div className="w-full bg-canvas">
      <SEO title="QOSE payment result | QYVORA" description="QOSE payment verification." noindex />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <div className="mx-auto max-w-2xl">
          <Card className="flex flex-col items-start gap-5 p-6 md:p-8">
            {state === 'loading' && (
              <>
                <Clock3 className="h-8 w-8 text-accent" aria-hidden="true" />
                <div>
                  <h1 className="type-h2 text-text-primary">Verifying your payment</h1>
                  <p className="type-body-sm mt-2 text-text-secondary">
                    Please wait while we confirm the transaction with Paystack.
                  </p>
                </div>
              </>
            )}

            {state === 'processing' && (
              <>
                <Clock3 className="h-8 w-8 text-accent" aria-hidden="true" />
                <div>
                  <h1 className="type-h2 text-text-primary">Payment is processing</h1>
                  <p className="type-body mt-2 text-text-secondary">
                    Paystack has not confirmed the transaction yet. Keep this page open — we check
                    again every few seconds for up to a minute.
                  </p>
                </div>
              </>
            )}

            {state === 'success' && (
              <>
                <CheckCircle2 className="h-9 w-9 text-accent" aria-hidden="true" />
                <div>
                  <h1 className="type-h2 text-text-primary">
                    {isPartial ? 'Instalment received' : 'Payment verified'}
                  </h1>
                  <p className="type-body mt-2 text-text-secondary">
                    {isPartial && registration
                      ? `We received ${money(registration.amountMinor, registration.currency)}. ${
                          hasNextInstalment
                            ? `Your next payment is ${money(registration.nextAmountMinor, registration.currency)} for ${STAGE_LABELS[registration.nextStage || ''] || registration.nextStage}.`
                            : ''
                        }`
                      : 'Your QOSE registration is confirmed. Keep the reference below — the team will send onboarding details to your email.'}
                  </p>
                </div>

                {hasNextInstalment && registration && (
                  <div className="w-full rounded-xl border border-accent/30 bg-accent/5 p-4">
                    <p className="type-label uppercase tracking-[0.12em] text-text-tertiary">
                      Next instalment
                    </p>
                    <p className="mt-1 text-2xl font-black tracking-tight text-text-primary">
                      {money(registration.nextAmountMinor, registration.currency)}
                    </p>
                    <p className="mt-1 type-body-sm text-text-secondary">
                      {STAGE_LABELS[registration.nextStage || ''] || registration.nextStage}
                      {registration.dueAt
                        ? ` · due ${new Date(registration.dueAt).toLocaleDateString()}`
                        : ''}
                    </p>
                    <Button
                      type="button"
                      className="mt-4 w-full sm:w-auto"
                      loading={continuing}
                      onClick={payNextInstalment}
                    >
                      Pay next instalment
                    </Button>
                    {continueError && (
                      <p className="mt-3 flex items-start gap-2 type-body-sm text-semantic-danger" role="alert">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{continueError}</span>
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {state === 'failed' && (
              <>
                <XCircle className="h-9 w-9 text-semantic-danger" aria-hidden="true" />
                <div>
                  <h1 className="type-h2 text-text-primary">Payment not completed</h1>
                  <p className="type-body mt-2 text-text-secondary">
                    Paystack has not confirmed a successful payment for this reference.
                    You can return to the QOSE page and try again.
                  </p>
                </div>
              </>
            )}

            {state === 'timeout' && (
              <>
                <AlertCircle className="h-9 w-9 text-semantic-warning" aria-hidden="true" />
                <div>
                  <h1 className="type-h2 text-text-primary">Still waiting for confirmation</h1>
                  <p className="type-body mt-2 text-text-secondary">{message}</p>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-4"
                    onClick={() => window.location.reload()}
                  >
                    Check again
                  </Button>
                </div>
              </>
            )}

            {state === 'error' && (
              <>
                <AlertCircle className="h-9 w-9 text-semantic-danger" aria-hidden="true" />
                <div>
                  <h1 className="type-h2 text-text-primary">We could not verify this payment</h1>
                  <p className="type-body mt-2 text-text-secondary">{message}</p>
                </div>
              </>
            )}

            {reference && (
              <dl className="grid w-full gap-3 rounded-xl border border-border-subtle bg-surface-raised p-4 type-body-sm sm:grid-cols-2">
                <div>
                  <dt className="type-label uppercase tracking-[0.12em] text-text-tertiary">Reference</dt>
                  <dd className="mt-1 break-all font-mono text-text-primary">{reference}</dd>
                </div>
                <div>
                  <dt className="type-label uppercase tracking-[0.12em] text-text-tertiary">Status</dt>
                  <dd className="mt-1 text-text-primary">
                    {registration?.paymentStatus || result?.status || 'pending'}
                  </dd>
                </div>
                {registration && (
                  <>
                    <div>
                      <dt className="type-label uppercase tracking-[0.12em] text-text-tertiary">Applicant</dt>
                      <dd className="mt-1 text-text-primary">{registration.fullName}</dd>
                    </div>
                    <div>
                      <dt className="type-label uppercase tracking-[0.12em] text-text-tertiary">This payment</dt>
                      <dd className="mt-1 text-text-primary">
                        {money(registration.amountMinor, registration.currency)}
                      </dd>
                    </div>
                    <div>
                      <dt className="type-label uppercase tracking-[0.12em] text-text-tertiary">Plan</dt>
                      <dd className="mt-1 text-text-primary">
                        {PLAN_LABELS[registration.plan] || registration.plan}
                      </dd>
                    </div>
                    <div>
                      <dt className="type-label uppercase tracking-[0.12em] text-text-tertiary">Total paid</dt>
                      <dd className="mt-1 text-text-primary">
                        {money(registration.amountPaidMinor, registration.currency)}
                        {' of '}
                        {money(registration.totalTuitionMinor, registration.currency)}
                      </dd>
                    </div>
                    {registration.remainingMinor > 0 && (
                      <div>
                        <dt className="type-label uppercase tracking-[0.12em] text-text-tertiary">Remaining</dt>
                        <dd className="mt-1 text-text-primary">
                          {money(registration.remainingMinor, registration.currency)}
                        </dd>
                      </div>
                    )}
                  </>
                )}
              </dl>
            )}

            <div className="flex flex-wrap gap-3">
              <Button to="/qose" variant="secondary">Back to QOSE</Button>
              <Button to="/">Go to homepage</Button>
            </div>
          </Card>
        </div>
      </PublicContainer>
    </div>
  );
};

export default QosePaymentResultPage;
