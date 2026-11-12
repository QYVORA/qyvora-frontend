import type { QoseInfo, QosePlanId } from '@/features/qose/services/qose.service';
import { formatGhs } from '@/features/qose/services/qose.service';

export interface PublicQosePlanOption {
  id: QosePlanId;
  label: string;
  amount: string;
  description: string;
}

export interface QoseInstalment {
  month: string;
  amount: string;
  amountMinor: number;
  note: string;
}

export interface QosePricing {
  currency: string;
  totalMinor: number;
  totalLabel: string;
  instalments: QoseInstalment[];
  planOptions: PublicQosePlanOption[];
}

const INSTALMENT_COPY: Record<string, { month: string; note: string }> = {
  enrolment: {
    month: 'Month 1',
    note: 'After payment is verified, the team confirms your seat and first month of labs and cohort support.',
  },
  month2: {
    month: 'Month 2',
    note: 'Covers the second month of labs and assessments.',
  },
  month3: {
    month: 'Month 3',
    note: 'Covers the final month, the capstone and your professional report.',
  },
};

export const FALLBACK_QOSE_PRICING: QosePricing = {
  currency: 'GHS',
  totalMinor: 80_000,
  totalLabel: 'GH₵800',
  instalments: [
    { month: 'Month 1', amount: 'GH₵300', amountMinor: 30_000, note: INSTALMENT_COPY.enrolment.note },
    { month: 'Month 2', amount: 'GH₵250', amountMinor: 25_000, note: INSTALMENT_COPY.month2.note },
    { month: 'Month 3', amount: 'GH₵250', amountMinor: 25_000, note: INSTALMENT_COPY.month3.note },
  ],
  planOptions: [
    {
      id: 'full',
      label: 'Pay in full',
      amount: 'GH₵800',
      description: 'One secure payment. Your seat is confirmed after verification.',
    },
    {
      id: 'installment',
      label: 'Three instalments',
      amount: 'GH₵300 now',
      description: 'Then GH₵250 in month 2 and GH₵250 in month 3.',
    },
  ],
};

const amountLabel = (amountMinor: number, currency: string): string =>
  formatGhs(amountMinor, currency);

export const buildQosePricing = (info: QoseInfo | null | undefined): QosePricing => {
  if (!info?.plans?.length) return FALLBACK_QOSE_PRICING;

  const full = info.plans.find((plan) => plan.id === 'full');
  const installment = info.plans.find((plan) => plan.id === 'installment');
  const currency = full?.currency || info.bootcamp.currency || 'GHS';
  const totalMinor = full?.amountMinor ?? info.bootcamp.totalTuitionMinor ?? FALLBACK_QOSE_PRICING.totalMinor;

  const instalments = (installment?.stages || [])
    .map((stage) => {
      const copy = INSTALMENT_COPY[stage.stage];
      if (!copy) return null;
      return {
        month: copy.month,
        amount: amountLabel(stage.amountMinor, currency),
        amountMinor: stage.amountMinor,
        note: copy.note,
      } satisfies QoseInstalment;
    })
    .filter((stage): stage is QoseInstalment => Boolean(stage));

  const planOptions = info.plans.map((plan) => {
    const firstStage = plan.stages[0];
    const amount = plan.id === 'full'
      ? amountLabel(plan.amountMinor, plan.currency || currency)
      : firstStage
        ? `${amountLabel(firstStage.amountMinor, plan.currency || currency)} now`
        : amountLabel(plan.amountMinor, plan.currency || currency);

    return {
      id: plan.id,
      label: plan.label,
      amount,
      description: plan.description,
    } satisfies PublicQosePlanOption;
  });

  return {
    currency,
    totalMinor,
    totalLabel: amountLabel(totalMinor, currency),
    instalments: instalments.length ? instalments : FALLBACK_QOSE_PRICING.instalments,
    planOptions: planOptions.length ? planOptions : FALLBACK_QOSE_PRICING.planOptions,
  };
};
