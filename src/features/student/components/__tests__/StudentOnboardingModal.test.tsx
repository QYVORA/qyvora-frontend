import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

/** Mimics a lower-priority popup (e.g. the consent banner) that claims the
 * top slot first and only releases it after the tour has mounted. */
function DelayedBlocker() {
  const { onDismiss } = usePopupManager('delayed-blocker', 1);
  useEffect(() => {
    const h = window.setTimeout(() => onDismiss(), 0);
    return () => window.clearTimeout(h);
  }, [onDismiss]);
  return <div data-testid="delayed-blocker" />;
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

  it('releases the priority-0 slot when activated LATE while onboarding is not needed', async () => {
    // Regression: if another popup (consent banner) held the slot at mount, the
    // onboarding modal's one-shot release effect already ran. When the banner is
    // later dismissed, the dormant onboarding popup gets activated and blocks
    // the guided tour (priority 2) forever. It must release on activation.
    auth.user = { onboardingCompletedAt: '2026-01-01T00:00:00Z', onboardingSkippedAt: null };
    render(
      <MemoryRouter>
        <DelayedBlocker />
        <StudentOnboardingModal />
        <TourProbe />
      </MemoryRouter>,
    );
    expect(
      screen.queryByRole('heading', { name: 'student.onboardingModal.step0.title' }),
    ).not.toBeInTheDocument();
    await waitFor(
      () => expect(screen.getByTestId('tour-probe')).toHaveAttribute('data-visible', 'true'),
      { timeout: 2000 },
    );
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