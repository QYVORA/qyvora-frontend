import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import QoseCoursePage from '../index';
import api from '@/core/services/api';

vi.mock('@/core/services/api', () => ({
  default: { get: vi.fn() },
}));

let overview: Record<string, unknown> = {
  bootcampStatus: 'enrolled',
  bootcampId: 'qose',
};

vi.mock('@/features/student/hooks/useStudentOverview', () => ({
  default: () => ({ data: overview, loading: false }),
}));

const getMock = vi.mocked(api.get);

const renderPage = () =>
  render(
    <MemoryRouter>
      <QoseCoursePage />
    </MemoryRouter>
  );

describe('QoseCoursePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    overview = { bootcampStatus: 'enrolled', bootcampId: 'qose' };
    getMock.mockResolvedValue({
      data: {
        id: 'qose',
        title: 'Offensive Security Engineer Bootcamp',
        modules: [
          {
            moduleId: 1,
            title: 'Offensive Security Methodology',
            description: 'Plan an engagement and map the attack surface.',
            codename: 'QOSE-M01',
            roleTitle: 'Operator',
            badge: '',
            locked: false,
            rooms: [{ roomId: 1, title: 'Rules of Engagement', overview: '', locked: false, completed: false }],
          },
        ],
      },
    });
  });

  it('maps each QOSE week to its protected labs', async () => {
    renderPage();

    expect(await screen.findByText('Offensive Security Methodology')).toBeInTheDocument();
    expect(screen.getByText('Plan an engagement and map the attack surface.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Engagement Methodology' })).toHaveAttribute(
      'href',
      '/dashboard/labs/methodology',
    );
  });

  it('gates the programme when the account is not enrolled in QOSE', async () => {
    overview = { bootcampStatus: 'enrolled', bootcampId: 'hpb' };

    renderPage();

    expect(await screen.findByText('QOSE access required')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view qose registration/i })).toHaveAttribute(
      'href',
      '/dashboard/qose',
    );
  });
});
