import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
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
const originalGetClientRects = Element.prototype.getClientRects;
const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

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
  // jsdom has no layout engine: stub rect APIs so SpotlightTour's residency
  // checks resolve targets the way a real browser would.
  Element.prototype.getClientRects = function getClientRects() {
    return { length: 1, 0: { left: 0, top: 0, width: 10, height: 10 } } as unknown as DOMRectList;
  };
  Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
    return {
      left: 0,
      top: 0,
      right: 10,
      bottom: 10,
      width: 10,
      height: 10,
      x: 0,
      y: 0,
      toJSON() {},
    } as DOMRect;
  };
});

afterAll(() => {
  window.matchMedia = originalMatchMedia;
  window.requestAnimationFrame = originalRAF;
  window.cancelAnimationFrame = originalCAF;
  Element.prototype.scrollIntoView = originalScrollIntoView;
  Element.prototype.getClientRects = originalGetClientRects;
  Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
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

  it('highlights the md-only brand anchor for the nav step at tablet widths (768-1023px)', async () => {
    const user = userEvent.setup();
    // Simulate a tablet: lg (1024px+) off, md (768px+) on. Both the desktop nav
    // (lg+) and the mobile menu trigger (md-) are hidden — only tour-nav-md is
    // visible, so the nav step must highlight it instead of a dead black overlay.
    const baseMatchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query === '(min-width: 768px)',
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;
    try {
      auth.user = { onboardingCompletedAt: null, onboardingSkippedAt: null };
      render(
        <div>
          <div data-tour-id="tour-nav-md">logo slot</div>
          <StudentTour cpBalance={1500} username="tester" />
        </div>,
      );
      await user.click(screen.getByText('student.tour.controls.next'));
      expect(screen.getByText('student.tour.nav.title')).toBeInTheDocument();
      await waitFor(
        () => expect(document.querySelector('div.border-2.border-accent')).not.toBeNull(),
        { timeout: 2000 },
      );
      expect(document.querySelector('div.bg-black\\/70')).toBeNull();
    } finally {
      window.matchMedia = baseMatchMedia;
    }
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