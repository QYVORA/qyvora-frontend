import { describe, expect, it } from 'vitest';
import type { QoseInfo } from '@/features/qose/services/qose.service';
import {
  FALLBACK_QOSE_PRICING,
  buildQosePricing,
} from './qosePricing';

const info: QoseInfo = {
  bootcamp: {
    id: 'qose',
    title: 'QOSE',
    description: '',
    level: 'Intermediate',
    duration: '12 weeks',
    image: '',
    priceLabel: 'GH₵850',
    totalTuitionMinor: 85_000,
    currency: 'GHS',
  },
  registrationWindow: {
    opensAt: '2026-11-10T00:00:00.000Z',
    closesAt: '2026-11-15T00:00:00.000Z',
    classesBeginAt: '2026-11-15T00:00:00.000Z',
    isOpen: true,
    enforced: true,
  },
  plans: [
    {
      id: 'full',
      label: 'Full payment',
      amountMinor: 85_000,
      currency: 'GHS',
      description: 'Pay the full GH₵850 tuition in one Paystack transaction.',
      stages: [{ stage: 'full', label: 'Full tuition', amountMinor: 85_000 }],
    },
    {
      id: 'installment',
      label: 'Three instalments',
      amountMinor: 80_000,
      currency: 'GHS',
      description: 'Start with GH₵300, then GH₵250 in month 2 and GH₵250 in month 3.',
      stages: [
        { stage: 'enrolment', label: 'Enrolment · Month 1', amountMinor: 30_000 },
        { stage: 'month2', label: 'Month 2', amountMinor: 25_000 },
        { stage: 'month3', label: 'Month 3', amountMinor: 25_000 },
      ],
    },
  ],
};

describe('buildQosePricing', () => {
  it('uses server amounts and formats them for the public page', () => {
    const pricing = buildQosePricing(info);

    expect(pricing.totalMinor).toBe(85_000);
    expect(pricing.totalLabel).toMatch(/850/);
    expect(pricing.instalments.map((stage) => stage.amountMinor)).toEqual([30_000, 25_000, 25_000]);
    expect(pricing.planOptions[0]).toMatchObject({ id: 'full', amount: expect.stringMatching(/850/) });
    expect(pricing.planOptions[1]).toMatchObject({ id: 'installment', amount: expect.stringMatching(/300/) });
  });

  it('keeps the canonical fallback when the catalogue is unavailable', () => {
    expect(buildQosePricing(null)).toBe(FALLBACK_QOSE_PRICING);
  });
});
