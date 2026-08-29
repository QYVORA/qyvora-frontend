import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import StudentOnboardingModal from '../StudentOnboardingModal';
import { usePopupManager } from '@/core/hooks/usePopupManager';

const auth = vi.hoisted(() => ({
  user: null as Record<string, unknown> | null,
  refreshMe: vi.fn(),
}));

vi.mock('@/core/contexts/AuthContext', () => ({
  useAuth: () => ({ user: auth.user, refreshMe: auth.refreshMe }),
}));

const api = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock('@/core/services/api', () => ({ default: api }));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

function TourProbe() {
  const { isVisible } = usePopupManager('onboarding-tour', 2);
  return <div data-testid="tour-probe" data-visible={String(isVisible)} />;
}

const renderModal = (extra?: React.ReactNode) =>
  render(
    <MemoryRouter>
      <StudentOnboardingModal />
      {extra}
    </MemoryRouter>,
  );

beforeEach(() => {
  auth.user = null;
  api.post.mockReset();
});

describe('StudentOnboardingModal', () => {
  it('shows the welcome step for a brand-new user', () => {
    auth.user = { onboardingCompletedAt: null, onboardingSkippedAt: null, bootcampStatus: 'not_enrolled' };
    renderModal();
    expect(
      screen.getByRole('heading', { name: 'student.onboardingModal.step0.title' }),
    ).toBeInTheDocument();
    expect(screen.getByText('student.onboardingModal.next')).toBeInTheDocument();
  });

  it('hides and releases the priority-0 slot for an already-onboarded user', () => {
    auth.user = { onboardingCompletedAt: '2026-01-01T00:00:00Z', onboardingSkippedAt: null };
    renderModal(<TourProbe />);
    expect(
      screen.queryByRole('heading', { name: 'student.onboardingModal.step0.title' }),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('tour-probe')).toHaveAttribute('data-visible', 'true');
  });

  it('hides and releases the priority-0 slot for a skipped user', () => {
    auth.user = { onboardingCompletedAt: null, onboardingSkippedAt: '2026-01-01T00:00:00Z' };
    renderModal(<TourProbe />);
    expect(screen.getByTestId('tour-probe')).toHaveAttribute('data-visible', 'true');
  });

  it('posts skip and dismisses when Skip is clicked', async () => {
    const user = userEvent.setup();
    auth.user = { onboardingCompletedAt: null, onboardingSkippedAt: null, bootcampStatus: 'not_enrolled' };
    renderModal();
    await user.click(screen.getByText('student.onboardingModal.skip'));
    expect(api.post).toHaveBeenCalledWith('/profile/onboarding/skip');
    expect(screen.queryByText('student.onboardingModal.step0.title')).not.toBeInTheDocument();
  });
});