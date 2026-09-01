import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import SpotlightTour from '../SpotlightTour';

const originalMatchMedia = window.matchMedia;
const originalRAF = window.requestAnimationFrame;
const originalCAF = window.cancelAnimationFrame;
const originalScrollIntoView = Element.prototype.scrollIntoView;
const originalGetClientRects = Element.prototype.getClientRects;
const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

beforeAll(() => {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
  window.requestAnimationFrame = (cb: FrameRequestCallback) =>
    window.setTimeout(() => cb(performance.now()), 16);
  window.cancelAnimationFrame = (handle: number) => window.clearTimeout(handle);
  Element.prototype.scrollIntoView = () => {};
  // jsdom has no layout engine: element rect APIs return empty/zero values.
  // Stub them so SpotlightTour's residency checks behave like a real browser.
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

const labels = { skip: 'Skip', back: 'Back', next: 'Next', finish: 'Finish' };

const findHighlight = () => document.querySelector('div.border-2.border-accent');

describe('SpotlightTour', () => {
  it('does not paint a dead-black overlay when a target step cannot resolve', async () => {
    const { unmount } = render(
      <SpotlightTour
        open
        labels={labels}
        steps={[{ targetId: 'missing-target', title: 'No element', body: 'should stay visible' }]}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText('No element')).toBeInTheDocument();
    // Give the retry loop a chance to run; it must never find the target.
    await new Promise((r) => setTimeout(r, 300));
    // A light veil keeps the app visible behind the card...
    expect(document.querySelector('div.bg-black\\/30')).not.toBeNull();
    // ...and the full black overlay only belongs to target-less steps.
    expect(document.querySelector('div.bg-black\\/70')).toBeNull();
    unmount();
  });

  it('keeps the strong dim for the target-less closing step', () => {
    const { unmount } = render(
      <SpotlightTour
        open
        labels={labels}
        steps={[{ title: 'You are all set', body: 'done' }]}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText('You are all set')).toBeInTheDocument();
    expect(document.querySelector('div.bg-black\\/70')).not.toBeNull();
    unmount();
  });

  it('renders a highlight once a resolvable target is present', async () => {
    const { unmount } = render(
      <SpotlightTour
        open
        labels={labels}
        getTarget={() => {
          const el = document.createElement('div');
          document.body.appendChild(el);
          return el;
        }}
        steps={[{ targetId: 'anything', title: 'Has target', body: 'highlight shows' }]}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText('Has target')).toBeInTheDocument();
    await waitFor(() => expect(findHighlight()).not.toBeNull(), { timeout: 2000 });
    unmount();
  });
});