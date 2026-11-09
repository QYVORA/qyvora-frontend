import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '@/core/services/api';
import {
  clearCheckoutReferenceFromUrl,
  formatGhs,
  getCheckoutReferenceFromUrl,
  getQoseInfo,
  getQoseRegistration,
  initializeQosePayment,
  selectQosePlan,
  verifyQosePayment,
} from './qose.service';

vi.mock('@/core/services/api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

const getMock = vi.mocked(api.get);
const postMock = vi.mocked(api.post);

describe('qose.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState({}, '', '/dashboard/qose');
  });

  it('loads QOSE info and registration from the authenticated endpoints', async () => {
    getMock.mockResolvedValueOnce({ data: { bootcamp: { id: 'bc_qose' } } } as any);
    getMock.mockResolvedValueOnce({ data: { registered: false, bootcampId: 'bc_qose' } } as any);

    await expect(getQoseInfo()).resolves.toEqual({ bootcamp: { id: 'bc_qose' } });
    await expect(getQoseRegistration()).resolves.toEqual({ registered: false, bootcampId: 'bc_qose' });

    expect(getMock).toHaveBeenNthCalledWith(1, '/qose/info');
    expect(getMock).toHaveBeenNthCalledWith(2, '/qose/registration');
  });

  it('sends only the selected plan when locking a registration', async () => {
    postMock.mockResolvedValueOnce({ data: { registered: true, paymentPlan: 'installment' } } as any);

    await expect(selectQosePlan('installment')).resolves.toMatchObject({ paymentPlan: 'installment' });
    expect(postMock).toHaveBeenCalledWith('/qose/registration', { plan: 'installment' });
  });

  it('never sends an amount when initializing checkout', async () => {
    postMock.mockResolvedValueOnce({ data: { reference: 'ref_1' } } as any);

    await expect(initializeQosePayment('month2')).resolves.toMatchObject({ reference: 'ref_1' });
    expect(postMock).toHaveBeenCalledWith('/qose/payments/initialize', { stage: 'month2' });

    postMock.mockResolvedValueOnce({ data: { reference: 'ref_2' } } as any);
    await initializeQosePayment();
    expect(postMock).toHaveBeenLastCalledWith('/qose/payments/initialize', {});
  });

  it('verifies checkout using the Paystack reference', async () => {
    postMock.mockResolvedValueOnce({ data: { verified: true } } as any);

    await expect(verifyQosePayment('ref_123')).resolves.toMatchObject({ verified: true });
    expect(postMock).toHaveBeenCalledWith('/qose/payments/verify', { reference: 'ref_123' });
  });

  it('formats tuition amounts in GHS without unnecessary decimals', () => {
    expect(formatGhs(80000)).toMatch(/800/);
    expect(formatGhs(80000)).not.toContain('.00');
    expect(formatGhs(25050)).toMatch(/250\.50/);
    expect(formatGhs(0)).toMatch(/0/);
  });

  it('reads reference or trxref from the checkout return URL', () => {
    window.history.replaceState({}, '', '/dashboard/qose?reference=ref_abc&foo=bar');
    expect(getCheckoutReferenceFromUrl()).toBe('ref_abc');

    window.history.replaceState({}, '', '/dashboard/qose?trxref=ref_xyz');
    expect(getCheckoutReferenceFromUrl()).toBe('ref_xyz');

    window.history.replaceState({}, '', '/dashboard/qose');
    expect(getCheckoutReferenceFromUrl()).toBe('');
  });

  it('clears only checkout reference params after verification', () => {
    window.history.replaceState({}, '', '/dashboard/qose?reference=ref_abc&trxref=ref_abc&tab=payments#ledger');

    clearCheckoutReferenceFromUrl();

    expect(window.location.search).toBe('?tab=payments');
    expect(window.location.hash).toBe('#ledger');
  });
});
