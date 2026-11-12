import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import QosePaymentResultPage from '../QosePaymentResultPage';
import api from '@/core/services/api';

vi.mock('@/core/services/api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

let authUser: { id: string; isAdmin: boolean } | null = null;

vi.mock('@/core/contexts/AuthContext', () => ({
  useAuth: () => ({ user: authUser, loading: false }),
}));

vi.mock('@/core/contexts/ToastContext', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}));

const getMock = vi.mocked(api.get);
const postMock = vi.mocked(api.post);

const verifiedResponse = {
  verified: true,
  duplicate: false,
  status: 'success',
  registration: {
    id: 'reg_1',
    fullName: 'Ama Mensah',
    plan: 'installment',
    stage: 'enrolment',
    amountMinor: 30000,
    amountPaidMinor: 30000,
    remainingMinor: 50000,
    totalTuitionMinor: 80000,
    nextStage: 'month2',
    nextAmountMinor: 25000,
    dueAt: '2026-12-15T00:00:00.000Z',
    currency: 'GHS',
    paymentStatus: 'partial',
    reference: 'QOSE-TEST-1',
    paidAt: '2026-11-10T10:00:00.000Z',
  },
};

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/qose/payment/callback?reference=QOSE-TEST-1']}>
      <Routes>
        <Route path="/qose/payment/callback" element={<QosePaymentResultPage />} />
      </Routes>
    </MemoryRouter>
  );

const flush = async () => {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
};

describe('QosePaymentResultPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authUser = null;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('polls while Paystack is processing and shows success when confirmed', async () => {
    getMock
      .mockResolvedValueOnce({ data: { verified: false, status: 'pending', registration: null } })
      .mockResolvedValueOnce({ data: verifiedResponse });

    renderPage();
    await flush();

    expect(screen.getByText('Payment is processing')).toBeInTheDocument();
    expect(getMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });
    await flush();

    expect(getMock).toHaveBeenCalledTimes(2);
    expect(screen.getByText('Instalment received')).toBeInTheDocument();
    expect(screen.getByText('QOSE-TEST-1')).toBeInTheDocument();
  });

  it('stops polling and shows a timeout with the reference after 60 seconds', async () => {
    getMock.mockResolvedValue({ data: { verified: false, status: 'pending', registration: null } });

    renderPage();
    await flush();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000);
    });
    await flush();

    expect(screen.getByText('Still waiting for confirmation')).toBeInTheDocument();
    expect(screen.getByText(/rather than paying again/i)).toBeInTheDocument();
    expect(screen.getByText('QOSE-TEST-1')).toBeInTheDocument();
  });

  it('shows a terminal failure without polling', async () => {
    getMock.mockResolvedValueOnce({ data: { verified: false, status: 'failed', registration: null } });

    renderPage();
    await flush();

    expect(screen.getByText('Payment not completed')).toBeInTheDocument();
    expect(getMock).toHaveBeenCalledTimes(1);
  });

  it('recovers a receipt from a pasted reference when none is in the URL', async () => {
    getMock.mockResolvedValueOnce({ data: verifiedResponse });

    render(
      <MemoryRouter initialEntries={['/qose/payment/callback']}>
        <Routes>
          <Route path="/qose/payment/callback" element={<QosePaymentResultPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Recover a payment receipt')).toBeInTheDocument();
    await act(async () => {
      const input = screen.getByLabelText('Payment reference');
      fireEvent.change(input, { target: { value: 'QOSE-RECOVER-1' } });
      fireEvent.submit(input.closest('form')!);
    });
    await flush();

    expect(getMock).toHaveBeenCalledWith('/qose/verify/QOSE-RECOVER-1');
  });

  it('links a verified public payment to the signed-in account', async () => {
    authUser = { id: 'user-1', isAdmin: false };
    getMock.mockResolvedValueOnce({ data: verifiedResponse });
    postMock.mockResolvedValueOnce({ data: { ok: true } });

    renderPage();
    await flush();

    fireEvent.click(screen.getByRole('button', { name: /link to my account/i }));
    await flush();

    expect(postMock).toHaveBeenCalledWith('/qose/claim', { reference: 'QOSE-TEST-1' });
  });
});
