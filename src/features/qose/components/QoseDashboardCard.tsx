import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import qoseLogo from '@/assets/bootcamp/QOSE-Logo.webp';
import { Button, Card } from '@/shared/components/ui';
import {
  formatGhs,
  getQoseRegistration,
  type QoseRegistrationState,
} from '../services/qose.service';

/**
 * Isolated dashboard promo/status card for QOSE.
 *
 * It owns its own request and silently disappears if the endpoint is
 * unavailable, so it can never break the dashboard. It intentionally contains
 * no payment mutation logic — all checkout happens on `/dashboard/qose`.
 */
const QoseDashboardCard = () => {
  const [state, setState] = useState<QoseRegistrationState | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let active = true;
    getQoseRegistration()
      .then((next) => {
        if (!active) return;
        setState(next);
        setVisible(true);
      })
      .catch(() => {
        if (active) setVisible(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!visible || !state) return null;

  const registered = state.registered;
  const fullyPaid = registered && state.remainingMinor <= 0;
  const partial = registered && state.amountPaidMinor > 0 && state.remainingMinor > 0;
  const failed = registered && state.paymentStatus === 'failed';
  const locked = registered && state.stages.some((stage) => stage.status === 'locked');
  const overdue = registered && !locked && state.stages.some((stage) => stage.status === 'overdue');
  const dueStage = registered
    ? state.stages.find((stage) => stage.status === 'due' || stage.status === 'overdue')
    : undefined;
  const dueDate = dueStage?.dueDate
    ? new Date(dueStage.dueDate).toLocaleDateString('en-GH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  const title = !registered
    ? 'QOSE Cohort 1 is open'
    : fullyPaid
      ? 'QOSE seat secured'
      : locked
        ? 'QOSE access locked'
        : overdue
          ? 'QOSE payment overdue'
          : failed
            ? 'QOSE payment needs attention'
            : partial
              ? 'Next QOSE instalment due'
              : 'Finish your QOSE registration';

  const body = !registered
    ? 'The 12-week Offensive Security Engineer bootcamp follows HPB. Register and start with GH₵300.'
    : fullyPaid
      ? 'Tuition fully paid. Open your QOSE labs and continue.'
      : locked
        ? 'An instalment is overdue past the grace period. Pay the outstanding amount to restore programme access.'
        : overdue && state.inGrace && state.graceUntil
          ? `${formatGhs(state.remainingMinor)} overdue. Access stays open until ${new Date(state.graceUntil).toLocaleDateString('en-GH')}.`
          : failed
            ? 'Your last checkout did not complete. Open QOSE to try again or contact the team.'
            : `${formatGhs(state.remainingMinor)} remaining on your ${state.paymentPlan === 'full' ? 'full payment' : 'instalment'} plan${dueDate ? ` · next due ${dueDate}` : ''}.`;

  return (
    <Card tone="feature" className="flex flex-col gap-5 p-[var(--app-card-pad)] md:flex-row md:items-center md:justify-between md:gap-6">
      <div className="flex min-w-0 items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border-subtle bg-surface-raised p-1.5">
          <img
            src={qoseLogo}
            alt=""
            width={48}
            height={48}
            className="h-full w-full object-contain"
          />
        </span>
        <div className="min-w-0">
          <p className="type-kicker uppercase tracking-[0.12em] text-accent">
            {'QOSE · Cohort 1'}
          </p>
          <h2 className="mt-1 text-lg font-black uppercase tracking-tight text-text-primary md:text-xl">
            {title}
          </h2>
          <p className="type-body-sm mt-1 text-text-secondary">{body}</p>
        </div>
      </div>
      <Button
        to={fullyPaid ? '/dashboard/labs' : '/dashboard/qose'}
        variant={fullyPaid ? 'secondary' : 'primary'}
        trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
        className="shrink-0"
      >
        {fullyPaid ? 'Open QOSE labs' : registered ? 'Continue payment' : 'View QOSE'}
      </Button>
    </Card>
  );
};

export default QoseDashboardCard;
