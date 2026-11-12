import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import QoseDashboardCard from './QoseDashboardCard';
import { getQoseRegistration } from '../services/qose.service';
import type { QoseRegistrationState } from '../services/qose.service';

vi.mock('../services/qose.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../services/qose.service')>();
  return { ...actual, getQoseRegistration: vi.fn() };
});

const getRegistrationMock = vi.mocked(getQoseRegistration);

const baseState: QoseRegistrationState = {
  registered: true,
  registrationId: 'reg_1',
  bootcampId: 'bc_qose',
  totalTuitionMinor: 80000,
  amountPaidMinor: 30000,
  remainingMinor: 50000,
  currency: 'GHS',
  paymentPlan: 'installment',
  status: 'active',
  paymentStatus: 'partial',
  currentStage: 'enrolment',
  nextStage: 'month2',
  nextAmountMinor: 25000,
  progressPercent: 37,
  payments: [],
  stages: [],
};

const renderCard = () =>
  render(
    <MemoryRouter>
      <QoseDashboardCard />
    </MemoryRouter>,
  );

describe('QoseDashboardCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('promotes registration when the student has not registered', async () => {
    getRegistrationMock.mockResolvedValueOnce({
      ...baseState,
      registered: false,
      amountPaidMinor: 0,
      remainingMinor: 80000,
      paymentPlan: null,
      paymentStatus: null,
      currentStage: null,
      nextStage: 'enrolment',
      nextAmountMinor: 30000,
      progressPercent: 0,
    });

    renderCard();

    expect(await screen.findByText('QOSE Cohort 1 is open')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View QOSE/i })).toHaveAttribute('href', '/dashboard/qose');
  });

  it('shows the next instalment and links back to the registration page', async () => {
    getRegistrationMock.mockResolvedValueOnce(baseState);

    renderCard();

    expect(await screen.findByText('Next QOSE instalment due')).toBeInTheDocument();
    expect(screen.getByText(/GH₵500 remaining/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Continue payment/i })).toHaveAttribute('href', '/dashboard/qose');
  });

  it('opens the QOSE programme once tuition is fully paid', async () => {
    getRegistrationMock.mockResolvedValueOnce({
      ...baseState,
      amountPaidMinor: 80000,
      remainingMinor: 0,
      paymentStatus: 'paid',
      nextStage: null,
      nextAmountMinor: 0,
      progressPercent: 100,
    });

    renderCard();

    expect(await screen.findByText('QOSE seat secured')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open QOSE programme/i })).toHaveAttribute(
      'href',
      '/dashboard/bootcamps/qose',
    );
  });

  it('shows the grace deadline when an instalment is overdue', async () => {
    getRegistrationMock.mockResolvedValueOnce({
      ...baseState,
      inGrace: true,
      graceUntil: '2026-12-20T00:00:00.000Z',
      stages: [
        {
          stage: 'month2',
          label: 'Month 2',
          amountMinor: 25000,
          currency: 'GHS',
          status: 'overdue',
          dueDate: '2026-12-15T00:00:00.000Z',
          paidAt: null,
          reference: '',
        },
      ],
    });

    renderCard();

    expect(await screen.findByText('QOSE payment overdue')).toBeInTheDocument();
    expect(screen.getByText(/Access stays open until/i)).toBeInTheDocument();
  });

  it('shows locked access after the grace period', async () => {
    getRegistrationMock.mockResolvedValueOnce({
      ...baseState,
      stages: [
        {
          stage: 'month2',
          label: 'Month 2',
          amountMinor: 25000,
          currency: 'GHS',
          status: 'locked',
          dueDate: '2026-12-15T00:00:00.000Z',
          paidAt: null,
          reference: '',
        },
      ],
    });

    renderCard();

    expect(await screen.findByText('QOSE access locked')).toBeInTheDocument();
    expect(screen.getByText(/past the grace period/i)).toBeInTheDocument();
  });

  it('stays hidden when the registration endpoint fails', async () => {
    getRegistrationMock.mockRejectedValueOnce(new Error('network'));

    const { container } = renderCard();

    await vi.waitFor(() => expect(container).toBeEmptyDOMElement());
  });
});
