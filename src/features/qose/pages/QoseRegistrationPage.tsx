import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PageBody from '@/shared/components/layout/PageBody';
import {
  Badge,
  Button,
  Card,
  ErrorState,
  InlineAlert,
  PageHeader,
  Progress,
  SectionHeader,
  Skeleton,
} from '@/shared/components/ui';
import { useToast } from '@/core/contexts/ToastContext';
import useQoseRegistration from '../hooks/useQoseRegistration';
import {
  clearCheckoutReferenceFromUrl,
  formatGhs,
  getCheckoutReferenceFromUrl,
  initializeQosePayment,
  selectQosePlan,
  verifyQosePayment,
  type QosePlan,
  type QosePlanId,
  type QoseRegistrationState,
  type QoseStageId,
} from '../services/qose.service';

const VERIFY_POLL_INTERVAL_MS = 3_000;
const VERIFY_POLL_TIMEOUT_MS = 60_000;
const TERMINAL_CHECKOUT_STATUSES = new Set(['failed', 'abandoned', 'reversed', 'refunded']);

const STAGE_LABELS: Record<string, string> = {
  enrolment: 'Enrolment · Month 1',
  month2: 'Month 2',
  month3: 'Month 3',
  full: 'Full tuition',
};

const PAYMENT_STATUS_BADGE: Record<
  string,
  { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'default' }
> = {
  paid: { label: 'Fully paid', variant: 'success' },
  partial: { label: 'Part paid', variant: 'warning' },
  pending: { label: 'Checkout pending', variant: 'info' },
  failed: { label: 'Payment failed', variant: 'danger' },
  unpaid: { label: 'Unpaid', variant: 'default' },
};

const formatDate = (value: string | null | undefined): string => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatDateTime = (value: string | null | undefined): string => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  });
};

const planAmountLabel = (plan: QosePlan): string => {
  if (plan.id === 'full') return formatGhs(plan.amountMinor, plan.currency);
  const first = plan.stages[0]?.amountMinor ?? 0;
  return `${formatGhs(first, plan.currency)} now`;
};

const PlanCard = ({
  plan,
  onChoose,
  loading,
  disabled,
}: {
  plan: QosePlan;
  onChoose: (plan: QosePlanId) => void;
  loading: boolean;
  disabled: boolean;
}) => (
  <Card className="flex h-full flex-col gap-4 p-5 md:p-6">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="type-kicker uppercase tracking-[0.12em] text-accent">{plan.label}</p>
        <p className="mt-2 text-3xl font-black tracking-tight text-text-primary">
          {planAmountLabel(plan)}
        </p>
      </div>
      <Wallet className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
    </div>
    <p className="type-body-sm text-text-secondary">{plan.description}</p>
    <ul className="flex flex-col gap-2 border-t border-border-subtle pt-4">
      {plan.stages.map((stage) => (
        <li key={stage.stage} className="flex items-center justify-between gap-3">
          <span className="type-body-sm text-text-secondary">{stage.label}</span>
          <span className="font-mono text-sm font-bold text-text-primary">
            {formatGhs(stage.amountMinor, plan.currency)}
          </span>
        </li>
      ))}
    </ul>
    <Button
      onClick={() => onChoose(plan.id)}
      loading={loading}
      disabled={disabled}
      className="mt-auto w-full"
      trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
    >
      {plan.id === 'full' ? 'Choose full payment' : 'Choose instalments'}
    </Button>
  </Card>
);

const StageLedger = ({ state }: { state: QoseRegistrationState }) => {
  const overdue = state.stages.some((stage) => stage.status === 'overdue');
  const locked = state.stages.some((stage) => stage.status === 'locked');

  return (
    <Card className="p-5 md:p-6">
      <SectionHeader title="Payment schedule" />
      {locked && (
        <div className="mt-4">
          <InlineAlert variant="danger" title="Programme access locked">
            An instalment is overdue past the grace period. Pay the outstanding amount to restore
            access.
          </InlineAlert>
        </div>
      )}
      {!locked && overdue && state.inGrace && state.graceUntil && (
        <div className="mt-4">
          <InlineAlert variant="warning" title="Grace period active">
            Your payment is overdue. Access stays open until {formatDate(state.graceUntil)}.
          </InlineAlert>
        </div>
      )}
      <ol className="mt-4 flex flex-col gap-2">
        {state.stages.map((stage, index) => {
          const paid = stage.status === 'paid';
          const due = stage.status === 'due';
          const isOverdue = stage.status === 'overdue';
          const isLocked = stage.status === 'locked';
          const dueLabel = stage.dueDate ? formatDate(stage.dueDate) : '';
          return (
            <li
              key={stage.stage}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                isLocked
                  ? 'border-semantic-danger/30 bg-semantic-danger/5'
                  : isOverdue
                    ? 'border-semantic-warning/40 bg-semantic-warning/5'
                    : due
                      ? 'border-accent/30 bg-accent/5'
                      : paid
                        ? 'border-border-subtle bg-surface-raised'
                        : 'border-border-subtle bg-surface opacity-70'
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                  paid
                    ? 'bg-accent text-on-accent'
                    : isLocked
                      ? 'border border-semantic-danger/40 text-semantic-danger'
                      : isOverdue
                        ? 'border border-semantic-warning/50 text-semantic-warning'
                        : due
                          ? 'border border-accent/40 text-accent'
                          : 'border border-border text-text-muted'
                }`}
              >
                {paid ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : String(index + 1).padStart(2, '0')}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-text-primary">
                  {STAGE_LABELS[stage.stage] || stage.label}
                </p>
                <p className="type-meta">
                  {paid
                    ? `Paid ${formatDate(stage.paidAt)}`
                    : isLocked
                      ? `Locked · overdue since ${dueLabel || 'the due date'}`
                      : isOverdue
                        ? `Overdue since ${dueLabel || 'the due date'}`
                        : due
                          ? `Next payment${dueLabel ? ` · due ${dueLabel}` : ' due'}`
                          : `Upcoming${dueLabel ? ` · due ${dueLabel}` : ''}`}
                </p>
              </div>
              <span className="shrink-0 font-mono text-sm font-bold text-text-primary">
                {formatGhs(stage.amountMinor, stage.currency)}
              </span>
            </li>
          );
        })}
      </ol>
    </Card>
  );
};

const PaymentHistory = ({ state }: { state: QoseRegistrationState }) => {
  if (state.payments.length === 0) return null;

  return (
    <Card className="p-5 md:p-6">
      <SectionHeader title="Payment history" />
      <ul className="mt-4 flex flex-col gap-2">
        {state.payments.map((payment) => (
          <li
            key={payment.id || payment.reference}
            className="flex flex-col gap-2 rounded-xl border border-border-subtle bg-surface-raised px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="text-sm font-bold text-text-primary">
                {STAGE_LABELS[payment.stage] || payment.stage}
              </p>
              <p className="type-meta break-all">
                {payment.reference}
                {payment.failureReason ? ` · ${payment.failureReason}` : ''}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="font-mono text-sm font-bold text-text-primary">
                {formatGhs(payment.amountMinor, payment.currency)}
              </span>
              <Badge variant={payment.status === 'recorded' ? 'success' : payment.status === 'failed' ? 'danger' : 'default'}>
                {payment.status}
              </Badge>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

/**
 * Authenticated QOSE registration + Paystack checkout.
 *
 * Flow: choose a plan (server stores it) → "Pay next amount" (server derives the
 * stage and amount) → redirect to Paystack → return with `?reference=` →
 * server-side verification records the payment exactly once. The webhook is the
 * reliable path; this page's verification is the immediate feedback path.
 */
const QoseRegistrationPage = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { info, state, loading, error, reload, setState } = useQoseRegistration();
  const [choosingPlan, setChoosingPlan] = useState<QosePlanId | null>(null);
  const [startingPayment, setStartingPayment] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [actionError, setActionError] = useState('');
  const verificationStarted = useRef(false);

  useEffect(() => {
    // Wait for the initial load so the verification result cannot be overwritten
    // by a registration read that started before the payment was recorded.
    if (loading || verificationStarted.current) return;
    const reference = getCheckoutReferenceFromUrl();
    if (!reference) return;
    verificationStarted.current = true;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const startedAt = Date.now();

    const verify = async () => {
      if (cancelled) return;
      try {
        const result = await verifyQosePayment(reference);
        if (cancelled) return;
        setState(result.state);

        if (result.verified || result.duplicate) {
          clearCheckoutReferenceFromUrl();
          addToast('Payment confirmed. Your QOSE balance has been updated.', 'success');
          return;
        }

        const status = String(result.status || result.state?.paymentStatus || '').toLowerCase();
        if (TERMINAL_CHECKOUT_STATUSES.has(status)) {
          clearCheckoutReferenceFromUrl();
          addToast('That checkout was not completed. Start a new payment when you are ready.', 'error');
          return;
        }

        if (Date.now() - startedAt >= VERIFY_POLL_TIMEOUT_MS) {
          addToast('Paystack is still confirming this payment. Use Refresh status in a moment.', 'info');
          return;
        }

        timer = setTimeout(() => void verify(), VERIFY_POLL_INTERVAL_MS);
      } catch (err: any) {
        if (cancelled) return;
        const response = err?.response;
        const retryable = !response || response.status === 429 || Number(response.status || 0) >= 500;
        if (retryable && Date.now() - startedAt < VERIFY_POLL_TIMEOUT_MS) {
          timer = setTimeout(() => void verify(), VERIFY_POLL_INTERVAL_MS);
          return;
        }
        addToast(
          err?.response?.data?.error ||
            'Could not verify the payment. Contact the QYVORA team if you were charged.',
          'error'
        );
      }
    };

    void verify();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [loading, addToast, setState]);

  const handleChoosePlan = async (plan: QosePlanId) => {
    setActionError('');
    setChoosingPlan(plan);
    try {
      const next = await selectQosePlan(plan);
      setState(next);
      addToast(plan === 'full' ? 'Full payment plan selected.' : 'Instalment plan selected.', 'success');
    } catch (err: any) {
      setActionError(err?.response?.data?.error || 'Could not save your plan.');
    } finally {
      setChoosingPlan(null);
    }
  };

  const handlePay = async () => {
    if (!state?.nextStage) return;
    setActionError('');
    setStartingPayment(true);
    try {
      const checkout = await initializeQosePayment(state.nextStage);
      const authorizationUrl = String(checkout.authorizationUrl || '');
      if (!/^https:\/\//i.test(authorizationUrl)) {
        throw new Error('The payment provider did not return a valid checkout URL.');
      }
      window.location.assign(authorizationUrl);
    } catch (err: any) {
      setActionError(
        err?.response?.data?.error ||
          err?.message ||
          'Could not start the Paystack checkout.'
      );
      setStartingPayment(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await reload({ silent: true });
      addToast('Registration status refreshed.', 'success');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-canvas">
        <PageBody spacing="sections">
          <div className="space-y-5" role="status" aria-label="Loading QOSE registration">
            <Skeleton variant="title" />
            <Skeleton variant="text" className="w-2/3" />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton variant="card" />
              <Skeleton variant="card" />
            </div>
          </div>
        </PageBody>
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="min-h-full bg-canvas">
        <PageBody spacing="sections">
          <ErrorState title="QOSE registration unavailable" message={error || 'Could not load QOSE.'} />
          <div className="mt-4">
            <Button variant="secondary" onClick={() => void reload()} icon={<RefreshCw className="h-4 w-4" />}>
              Try again
            </Button>
          </div>
        </PageBody>
      </div>
    );
  }

  const registration = state;
  const registered = Boolean(registration?.registered);
  const fullyPaid = registered && Number(registration?.remainingMinor || 0) <= 0;
  const windowOpen = info.registrationWindow.isOpen;
  const statusBadge = registration?.paymentStatus ? PAYMENT_STATUS_BADGE[registration.paymentStatus] : null;
  const planLabel = registration?.paymentPlan === 'full' ? 'Full payment' : 'Three instalments';
  const currency = registration?.currency || info.bootcamp.currency;

  return (
    <div className="min-h-full bg-canvas">
      <SEO
        title="QOSE Registration & Payment | QYVORA"
        description="Register for the QYVORA Offensive Security Engineer bootcamp and pay securely with Paystack."
        noindex
      />
      <PageBody spacing="sections">
        <PageHeader
          kicker="QYVORA · QOSE"
          title={fullyPaid ? 'Seat confirmed' : 'QOSE registration'}
          description="A 12-week offensive security programme. Choose the full payment or the three-instalment plan, then pay securely with Paystack."
          actions={
            <Button
              variant="secondary"
              onClick={() => void handleRefresh()}
              loading={refreshing}
              icon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
            >
              Refresh status
            </Button>
          }
          metadata={
            <>
              <span className="type-meta">
                Registration closes {formatDateTime(info.registrationWindow.closesAt)}
              </span>
              <span className="type-meta">
                Classes begin {formatDate(info.registrationWindow.classesBeginAt)}
              </span>
              <span className="type-meta">{info.bootcamp.duration}</span>
            </>
          }
        />

        {actionError && (
          <InlineAlert variant="danger" title="Action failed">
            {actionError}
          </InlineAlert>
        )}

        {!registered ? (
          <>
            {!windowOpen && (
              <InlineAlert variant="warning" title="Registration window closed">
                Registration for Cohort 1 is closed. Contact the QYVORA team about the next cohort.
              </InlineAlert>
            )}
            <section aria-label="Choose a QOSE payment plan">
              <SectionHeader
                title="Choose how to pay"
                description={`The total tuition is ${formatGhs(info.bootcamp.totalTuitionMinor, info.bootcamp.currency)} either way. Your plan is locked once a payment is recorded.`}
              />
              <div className="mt-4 grid gap-4 md:grid-cols-2 md:gap-5">
                {info.plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onChoose={(id) => void handleChoosePlan(id)}
                    loading={choosingPlan === plan.id}
                    disabled={!windowOpen || choosingPlan !== null}
                  />
                ))}
              </div>
            </section>
            <Card className="flex flex-col gap-3 p-5 md:flex-row md:items-start md:gap-4 md:p-6">
              <CreditCard className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <p className="type-body-sm text-text-secondary">
                Payments are processed by Paystack. QYVORA never sees or stores your card or
                mobile-money details. Your seat is confirmed after the first payment is verified,
                and the team unlocks your QOSE coursework.
              </p>
            </Card>
          </>
        ) : (
          <>
            <Card className="flex flex-col gap-5 p-5 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="type-kicker uppercase tracking-[0.12em] text-accent">
                      {info.bootcamp.title}
                    </p>
                    {statusBadge && <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>}
                  </div>
                  <p className="mt-2 text-2xl font-black uppercase tracking-tight text-text-primary">
                    {planLabel}
                  </p>
                  <p className="type-body-sm mt-1 text-text-secondary">
                    {fullyPaid
                      ? 'Tuition fully paid. Your seat is confirmed.'
                      : `Next payment: ${registration?.nextStage ? STAGE_LABELS[registration.nextStage] : 'none'} · ${formatGhs(registration?.nextAmountMinor || 0, currency)}`}
                  </p>
                </div>
                {fullyPaid ? (
                  <Button
                    to="/dashboard/labs"
                    trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                  >
                    Open QOSE labs
                  </Button>
                ) : (
                  <Button
                    onClick={() => void handlePay()}
                    loading={startingPayment}
                    disabled={!registration?.nextStage}
                    icon={<CreditCard className="h-4 w-4" aria-hidden="true" />}
                  >
                    {registration?.nextStage
                      ? `Pay ${formatGhs(registration.nextAmountMinor, currency)}`
                      : 'No payment due'}
                  </Button>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border-subtle bg-surface-raised p-4">
                  <p className="type-meta">Total tuition</p>
                  <p className="mt-1 font-mono text-lg font-black text-text-primary">
                    {formatGhs(registration?.totalTuitionMinor || info.bootcamp.totalTuitionMinor, currency)}
                  </p>
                </div>
                <div className="rounded-xl border border-border-subtle bg-surface-raised p-4">
                  <p className="type-meta">Paid</p>
                  <p className="mt-1 font-mono text-lg font-black text-accent">
                    {formatGhs(registration?.amountPaidMinor || 0, currency)}
                  </p>
                </div>
                <div className="rounded-xl border border-border-subtle bg-surface-raised p-4">
                  <p className="type-meta">Remaining</p>
                  <p className="mt-1 font-mono text-lg font-black text-text-primary">
                    {formatGhs(registration?.remainingMinor || 0, currency)}
                  </p>
                </div>
              </div>

              <Progress
                value={registration?.amountPaidMinor || 0}
                max={registration?.totalTuitionMinor || info.bootcamp.totalTuitionMinor}
                label="Tuition paid"
                showValue
              />

              {registration?.paymentStatus === 'pending' && (
                <InlineAlert variant="info" title="Checkout pending">
                  If you closed the Paystack window, start a new payment. Older checkout links are
                  cancelled automatically.
                </InlineAlert>
              )}
              {registration?.paymentStatus === 'failed' && (
                <InlineAlert variant="danger" title="Last payment failed">
                  No money was recorded. You can retry the payment, or contact the QYVORA team if
                  your bank shows a charge.
                </InlineAlert>
              )}
              {!fullyPaid && Number(registration?.amountPaidMinor || 0) > 0 && (
                <p className="type-meta flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  Your payment plan is locked. Later instalments remain payable in the same plan.
                </p>
              )}
            </Card>

            <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
              {registration && <StageLedger state={registration} />}
              {registration && <PaymentHistory state={registration} />}
            </div>

            <Card className="flex flex-col gap-3 p-5 md:flex-row md:items-start md:gap-4 md:p-6">
              <ShieldCheck className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-text-primary">Payments are verified server-side</p>
                <p className="type-body-sm mt-1 text-text-secondary">
                  QYVORA confirms every Paystack transaction before recording it. If your bank has
                  charged you but this page still shows a balance, wait a few seconds and use
                  Refresh status.
                </p>
              </div>
            </Card>

            <div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/qose')}>
                View programme details
              </Button>
            </div>
          </>
        )}
      </PageBody>
    </div>
  );
};

export default QoseRegistrationPage;
