import { useEffect, useMemo, useState } from 'react';
import { CreditCard, RefreshCw, Users, Wallet } from 'lucide-react';
import { Badge, Button, Card, ErrorState, Select } from '@/shared/components/ui';
import { StatCard } from '@/shared/components/dashboard';
import api from '@/core/services/api';
import type { QoseAdminRegistration } from '../../../types/admin.types';

const formatGhs = (amountMinor: number): string =>
  new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: Number(amountMinor || 0) % 100 === 0 ? 0 : 2,
  }).format(Number(amountMinor || 0) / 100);

const STATUS_OPTIONS = [
  { value: '', label: 'All payment states' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'pending', label: 'Checkout pending' },
  { value: 'partial', label: 'Part paid' },
  { value: 'paid', label: 'Fully paid' },
  { value: 'failed', label: 'Failed' },
];

type StatusVariant = 'default' | 'accent' | 'warning' | 'danger' | 'info';

const statusVariant = (status: string): StatusVariant => {
  switch (status) {
    case 'paid':
      return 'accent';
    case 'partial':
      return 'warning';
    case 'failed':
      return 'danger';
    case 'pending':
      return 'info';
    default:
      return 'default';
  }
};

const paymentBadgeStatus = (status: string): string => {
  switch (status) {
    case 'recorded':
      return 'paid';
    case 'abandoned':
      return 'pending';
    case 'refunded':
    case 'reversed':
      return 'failed';
    default:
      return status;
  }
};

const STAGE_LABELS: Record<string, string> = {
  enrolment: 'Enrolment · Month 1',
  month2: 'Month 2',
  month3: 'Month 3',
  full: 'Full tuition',
};

const formatDate = (value: string | null): string => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const QoseTab = () => {
  const [items, setItems] = useState<QoseAdminRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async (nextStatus = status) => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({ page: '1', limit: '100' });
      if (nextStatus) query.set('paymentStatus', nextStatus);
      const res = await api.get(`/admin/qose/registrations?${query.toString()}`);
      setItems(Array.isArray(res.data?.items) ? res.data.items : []);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Could not load QOSE registrations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load('');
  }, []);

  const summary = useMemo(() => {
    const paid = items.filter((item) => item.paymentStatus === 'paid');
    const collected = items.reduce((sum, item) => sum + Number(item.amountPaidMinor || 0), 0);
    const outstanding = items.reduce((sum, item) => sum + Number(item.remainingMinor || 0), 0);
    return {
      total: items.length,
      paid: paid.length,
      collected,
      outstanding,
    };
  }, [items]);

  const onFilter = (value: string) => {
    setStatus(value);
    void load(value);
  };

  if (loading) {
    return (
      <div className="space-y-4" role="status" aria-label="Loading QOSE registrations">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border border-border-subtle bg-surface" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl border border-border-subtle bg-surface" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorState title="QOSE registrations unavailable" message={error} />
        <Button variant="secondary" onClick={() => void load()} icon={<RefreshCw className="h-4 w-4" />}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Users className="h-5 w-5 text-text-muted" />} label="Registrations" value={summary.total} />
        <StatCard icon={<CreditCard className="h-5 w-5 text-accent" />} label="Fully paid" value={summary.paid} accent />
        <StatCard icon={<Wallet className="h-5 w-5 text-text-muted" />} label="Collected" value={formatGhs(summary.collected)} />
        <StatCard icon={<Wallet className="h-5 w-5 text-semantic-warning" />} label="Outstanding" value={formatGhs(summary.outstanding)} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <Select
            aria-label="Filter by payment status"
            options={STATUS_OPTIONS}
            value={status}
            onChange={(event) => onFilter(event.target.value)}
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => void load()}
          icon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
        >
          Refresh
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-sm font-bold text-text-primary">No QOSE registrations yet</p>
          <p className="type-body-sm mt-1 text-text-secondary">
            Registrations appear here once a student selects a payment plan.
          </p>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface">
          <div className="hidden grid-cols-[minmax(0,2.2fr)_1fr_1fr_1fr_auto] gap-4 border-b border-border-subtle px-5 py-3 text-xs font-black uppercase tracking-widest text-text-tertiary lg:grid">
            <span>Student</span>
            <span>Plan</span>
            <span>Paid</span>
            <span>Remaining</span>
            <span className="text-right">Status</span>
          </div>
          <ul className="divide-y divide-border-subtle">
            {items.map((item) => {
              const open = expanded === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setExpanded(open ? null : item.id)}
                    aria-expanded={open}
                    className="grid w-full grid-cols-1 gap-3 px-5 py-4 text-left transition-colors hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent lg:grid-cols-[minmax(0,2.2fr)_1fr_1fr_1fr_auto] lg:items-center lg:gap-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-text-primary">
                        {item.user.name || item.user.email || 'Unknown student'}
                      </p>
                      <p className="truncate text-xs text-text-muted">{item.user.email}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wide text-text-secondary">
                        {item.paymentPlan === 'full' ? 'Full' : 'Instalments'}
                      </span>
                      <span className="text-xs text-text-muted">{item.currentStage ? STAGE_LABELS[item.currentStage] || item.currentStage : 'No payment'}</span>
                    </div>
                    <div className="font-mono text-sm font-bold text-text-primary">{formatGhs(item.amountPaidMinor)}</div>
                    <div className="font-mono text-sm font-bold text-text-primary">{formatGhs(item.remainingMinor)}</div>
                    <div className="flex items-center justify-between gap-3 lg:justify-end">
                      <Badge variant={statusVariant(item.paymentStatus)} size="sm">
                        {item.paymentStatus}
                      </Badge>
                      <span className="text-xs text-text-muted lg:hidden">{open ? 'Hide' : 'Details'}</span>
                    </div>
                  </button>

                  {open && (
                    <div className="space-y-3 border-t border-border-subtle bg-surface-raised/40 px-5 py-4">
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-text-muted">
                        <span>Registered {formatDate(item.createdAt)}</span>
                        <span>Last payment {formatDate(item.lastPaymentAt)}</span>
                        <span>Bootcamp status {item.user.bootcampStatus || 'not_enrolled'}</span>
                      </div>
                      {item.payments.length === 0 ? (
                        <p className="text-sm text-text-muted">No payment attempts yet.</p>
                      ) : (
                        <ul className="space-y-2">
                          {item.payments.map((payment) => (
                            <li
                              key={payment.id || payment.reference}
                              className="flex flex-col gap-2 rounded-xl border border-border-subtle bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-text-primary">
                                  {STAGE_LABELS[payment.stage] || payment.stage}
                                </p>
                                <p className="break-all text-xs text-text-muted">
                                  {payment.reference}
                                  {payment.failureReason ? ` · ${payment.failureReason}` : ''}
                                </p>
                              </div>
                              <div className="flex shrink-0 items-center gap-3">
                                <span className="font-mono text-sm font-bold text-text-primary">{formatGhs(payment.amountMinor)}</span>
                                <Badge variant={statusVariant(paymentBadgeStatus(payment.status))} size="sm">
                                  {payment.status}
                                </Badge>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QoseTab;
