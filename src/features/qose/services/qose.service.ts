import api from '@/core/services/api';

/**
 * Client for the authenticated QOSE registration + Paystack endpoints.
 *
 * The browser never sends an amount. Plan selection and the "next amount due"
 * are derived server-side; this module only carries the plan id, a stage hint
 * for error messages, and a Paystack reference for verification.
 */

export type QosePlanId = 'full' | 'installment';
export type QosePaymentStatus = 'unpaid' | 'pending' | 'partial' | 'paid' | 'failed' | string;
export type QoseStageId = 'enrolment' | 'month2' | 'month3' | 'full';

export interface QosePlanStage {
  stage: QoseStageId;
  label: string;
  amountMinor: number;
}

export interface QosePlan {
  id: QosePlanId;
  label: string;
  amountMinor: number;
  currency: string;
  description: string;
  stages: QosePlanStage[];
}

export interface QoseRegistrationWindow {
  opensAt: string;
  closesAt: string;
  classesBeginAt: string;
  isOpen: boolean;
  enforced: boolean;
}

export interface QoseInfo {
  bootcamp: {
    id: string;
    title: string;
    description: string;
    level: string;
    duration: string;
    image: string;
    priceLabel: string;
    totalTuitionMinor: number;
    currency: string;
  };
  registrationWindow: QoseRegistrationWindow;
  plans: QosePlan[];
}

export interface QosePayment {
  id: string;
  stage: QoseStageId | string;
  plan: QosePlanId | null;
  amountMinor: number;
  currency: string;
  status: string;
  provider: string;
  method: string;
  channel: string;
  reference: string;
  failureReason: string;
  createdAt: string | null;
  recordedAt: string | null;
  verifiedAt: string | null;
}

export interface QoseStageLedgerEntry {
  stage: QoseStageId;
  label: string;
  amountMinor: number;
  currency: string;
  status: 'paid' | 'due' | 'upcoming' | 'overdue' | 'locked';
  dueDate: string | null;
  paidAt: string | null;
  reference: string;
}

export interface QoseRegistrationState {
  registered: boolean;
  registrationId?: string;
  bootcampId: string;
  totalTuitionMinor: number;
  amountPaidMinor: number;
  remainingMinor: number;
  currency: string;
  paymentPlan: QosePlanId | null;
  status: string;
  paymentStatus: QosePaymentStatus | null;
  currentStage: string | null;
  nextStage: QoseStageId | null;
  nextAmountMinor: number;
  progressPercent: number;
  payments: QosePayment[];
  stages: QoseStageLedgerEntry[];
  dueDates?: Partial<Record<QoseStageId, string | null>>;
  graceUntil?: string | null;
  inGrace?: boolean;
  gracePeriodDays?: number;
  lastPaymentAt?: string | null;
}

export interface QoseCheckout {
  success: boolean;
  reference: string;
  authorizationUrl: string;
  accessCode: string;
  amountMinor: number;
  currency: string;
  stage: QoseStageId;
  plan: QosePlanId;
}

export interface QoseVerificationResult {
  verified: boolean;
  duplicate?: boolean;
  status?: string;
  state: QoseRegistrationState;
}

const data = <T>(response: { data: T }): T => response.data;

export const getQoseInfo = async (): Promise<QoseInfo> =>
  data(await api.get<QoseInfo>('/qose/info'));

export const getQoseRegistration = async (): Promise<QoseRegistrationState> =>
  data(await api.get<QoseRegistrationState>('/qose/registration'));

export const selectQosePlan = async (plan: QosePlanId): Promise<QoseRegistrationState> =>
  data(await api.post<QoseRegistrationState>('/qose/registration', { plan }));

export const initializeQosePayment = async (stage?: QoseStageId): Promise<QoseCheckout> =>
  data(await api.post<QoseCheckout>('/qose/payments/initialize', stage ? { stage } : {}));

export const verifyQosePayment = async (reference: string): Promise<QoseVerificationResult> =>
  data(await api.post<QoseVerificationResult>('/qose/payments/verify', { reference }));

export const formatGhs = (amountMinor: number): string => {
  const amount = Number(amountMinor || 0) / 100;
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
};

export const getCheckoutReferenceFromUrl = (): string => {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  return String(params.get('reference') || params.get('trxref') || '').trim();
};

export const clearCheckoutReferenceFromUrl = (): void => {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has('reference') && !url.searchParams.has('trxref')) return;
  url.searchParams.delete('reference');
  url.searchParams.delete('trxref');
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
};
