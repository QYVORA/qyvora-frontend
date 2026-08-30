import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StudentTour from '../StudentTour';

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

const originalMatchMedia = window.matchMedia;
const originalRAF = window.requestAnimationFrame;
const originalCAF = window.cancelAnimationFrame;
const originalScrollIntoView = Element.prototype.scrollIntoView;

beforeAll(() => {
  window.matchMedia =
    window.matchMedia ||
    ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }));
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (cb: FrameRequestCallback) =>
      window.setTimeout(() => cb(performance.now()), 16);
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (handle: number) => window.clearTimeout(handle);
  }
  Element.prototype.scrollIntoView = () => {};
});

afterAll(() => {
  window.matchMedia = originalMatchMedia;
  window.requestAnimationFrame = originalRAF;
  window.cancelAnimationFrame = originalCAF;
  Element.prototype.scrollIntoView = originalScrollIntoView;
});

beforeEach(() => {
  auth.user = null;
  api.post.mockReset();
});

const WELCOME = 'student.tour.welcome.title';
const SKIP = 'student.tour.controls.skip';

const renderTour = () =>
  render(<StudentTour cpBalance={1500} username="tester" />);

describe('StudentTour', () => {
  it('auto-opens when its popup slot activates', () => {
    renderTour();
    expect(screen.getByText(WELCOME)).toBeInTheDocument();
  });

  it('reopens via the qyvora:start-tutorial replay event after dismissal', async () => {
    const user = userEvent.setup();
    renderTour();
    await user.click(screen.getByText(SKIP));
    expect(screen.queryByText(WELCOME)).not.toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new CustomEvent('qyvora:start-tutorial'));
    });
    expect(screen.getByText(WELCOME)).toBeInTheDocument();
  });

  it('closes a replay-opened tour on skip (replay state is reset on close)', async () => {
    const user = userEvent.setup();
    renderTour();
    // Dismiss the initial popup-driven tour, then re-open via the replay event.
    await user.click(screen.getByText(SKIP));
    act(() => {
      window.dispatchEvent(new CustomEvent('qyvora:start-tutorial'));
    });
    expect(screen.getByText(WELCOME)).toBeInTheDocument();

    // Dismiss the replay-driven tour — it must actually close (Finish/Skip bug).
    await user.click(screen.getByText(SKIP));
    expect(screen.queryByText(WELCOME)).not.toBeInTheDocument();
  });

  it('does not POST onboarding/complete for an already-completed user', async () => {
    const user = userEvent.setup();
    auth.user = { onboardingCompletedAt: '2026-01-01T00:00:00Z', onboardingSkippedAt: null };
    renderTour();
    await user.click(screen.getByText(SKIP));
    expect(api.post).not.toHaveBeenCalledWith('/profile/onboarding/complete');
  });

  it('does not POST onboarding/complete for a skipped user', async () => {
    const user = userEvent.setup();
    auth.user = { onboardingCompletedAt: null, onboardingSkippedAt: '2026-01-01T00:00:00Z' };
    renderTour();
    await user.click(screen.getByText(SKIP));
    expect(api.post).not.toHaveBeenCalledWith('/profile/onboarding/complete');
  });

  it('completes onboarding on close only for a fresh user', async () => {
    const user = userEvent.setup();
    auth.user = { onboardingCompletedAt: null, onboardingSkippedAt: null };
    renderTour();
    await user.click(screen.getByText(SKIP));
    expect(api.post).toHaveBeenCalledWith('/profile/onboarding/complete');
  });
});