import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import CustomCursor from '../CustomCursor';

const originalMatchMedia = window.matchMedia;
const originalPointerEvent = window.PointerEvent;
let shimmedPointerEvent = false;

function stubMatchMedia({ fine = false, reduce = false } = {}) {
  window.matchMedia = vi.fn().mockImplementation(
    (query: string) =>
      ({
        matches: query.includes('pointer: fine') ? fine : query.includes('prefers-reduced-motion') ? reduce : false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList,
  ) as unknown as typeof window.matchMedia;
}

function dispatchPress(
  el: Element | Document | Window,
  type: string,
  init: { clientX?: number; clientY?: number; button?: number } = {},
) {
  const ev = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: init.clientX ?? 0,
    clientY: init.clientY ?? 0,
    button: init.button ?? 0,
  });
  act(() => {
    el.dispatchEvent(ev);
  });
}

describe('CustomCursor', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('qyvora-cursor');
    // jsdom may lack PointerEvent — the component feature-detects it to pick
    // pointer vs mouse listeners, so make detection deterministic per test.
    if (typeof window.PointerEvent !== 'function') {
      window.PointerEvent = window.MouseEvent as unknown as typeof PointerEvent;
      shimmedPointerEvent = true;
    }
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    document.documentElement.classList.remove('qyvora-cursor');
    if (shimmedPointerEvent) {
      delete (window as { PointerEvent?: unknown }).PointerEvent;
      shimmedPointerEvent = false;
    } else {
      window.PointerEvent = originalPointerEvent;
    }
  });

  it('stays inactive on coarse-pointer (touch) devices', () => {
    stubMatchMedia({ fine: false });
    const { container } = render(<CustomCursor />);
    expect(container.querySelector('.qyvora-cursor-root')).toBeNull();
    expect(document.documentElement.classList.contains('qyvora-cursor')).toBe(false);
  });

  it('activates on fine-pointer devices and enables the native CSS cursor', () => {
    stubMatchMedia({ fine: true });
    const { container } = render(<CustomCursor />);
    expect(container.querySelector('.qyvora-cursor-root')).not.toBeNull();
    expect(document.documentElement.classList.contains('qyvora-cursor')).toBe(true);
  });

  it('does not render a JS-tracked pointer glyph', () => {
    stubMatchMedia({ fine: true });
    const { container } = render(<CustomCursor />);
    expect(container.querySelector('.cc-pointer')).toBeNull();
    expect(container.querySelector('.cc-arrow')).toBeNull();
  });

  it('removes the root class and overlay on unmount', () => {
    stubMatchMedia({ fine: true });
    const { unmount } = render(<CustomCursor />);
    unmount();
    expect(document.documentElement.classList.contains('qyvora-cursor')).toBe(false);
    expect(document.querySelector('.qyvora-cursor-root')).toBeNull();
  });

  it('spawns the press burst only after an enabled button is pressed', () => {
    stubMatchMedia({ fine: true });
    const { container } = render(<CustomCursor />);
    const burst = container.querySelector('.cc-burst-layer') as HTMLElement;

    const button = document.createElement('button');
    document.body.appendChild(button);
    dispatchPress(button, 'pointerdown', { clientX: 12, clientY: 24 });

    // 1 ripple + 8 sparks on an interactive target
    expect(burst.querySelectorAll('.cc-burst-wrap').length).toBe(9);
    expect(burst.querySelectorAll('.cc-ripple').length).toBe(1);
    expect(burst.querySelectorAll('.cc-spark').length).toBe(8);
    const first = burst.querySelector('.cc-burst-wrap') as HTMLElement;
    expect(first.style.transform).toBe('translate3d(12px, 24px, 0)');

    button.remove();
  });

  it('does not spawn a burst on non-button surfaces', () => {
    stubMatchMedia({ fine: true });
    const { container } = render(<CustomCursor />);
    const burst = container.querySelector('.cc-burst-layer') as HTMLElement;

    const plain = document.createElement('div');
    document.body.appendChild(plain);
    dispatchPress(plain, 'pointerdown', { clientX: 5, clientY: 5 });

    expect(burst.childElementCount).toBe(0);
    plain.remove();
  });

  it('does not animate disabled controls', () => {
    stubMatchMedia({ fine: true });
    const { container } = render(<CustomCursor />);
    const burst = container.querySelector('.cc-burst-layer') as HTMLElement;

    const disabled = document.createElement('button');
    disabled.disabled = true;
    document.body.appendChild(disabled);
    dispatchPress(disabled, 'pointerdown', { clientX: 10, clientY: 20 });

    expect(burst.childElementCount).toBe(0);
    disabled.remove();
  });

  it('ignores non-primary and synthetic/keyboard clicks', () => {
    stubMatchMedia({ fine: true });
    const { container } = render(<CustomCursor />);
    const burst = container.querySelector('.cc-burst-layer') as HTMLElement;

    const button = document.createElement('button');
    document.body.appendChild(button);

    dispatchPress(button, 'pointerdown', { clientX: 10, clientY: 20, button: 2 });
    expect(burst.childElementCount).toBe(0);

    act(() => {
      button.click();
    });
    expect(burst.childElementCount).toBe(0);

    button.remove();
  });

  it('skips the press burst for reduced-motion users', () => {
    stubMatchMedia({ fine: true, reduce: true });
    const { container } = render(<CustomCursor />);
    const burst = container.querySelector('.cc-burst-layer') as HTMLElement;

    const button = document.createElement('button');
    document.body.appendChild(button);
    dispatchPress(button, 'pointerdown', { clientX: 5, clientY: 5 });

    expect(burst.childElementCount).toBe(0);
    button.remove();
  });

  it('falls back to mouse events on browsers without PointerEvent', () => {
    stubMatchMedia({ fine: true });
    delete (window as { PointerEvent?: unknown }).PointerEvent;
    const { container } = render(<CustomCursor />);
    const burst = container.querySelector('.cc-burst-layer') as HTMLElement;

    const button = document.createElement('button');
    document.body.appendChild(button);
    dispatchPress(button, 'mousedown', { clientX: 33, clientY: 77 });

    expect(burst.querySelectorAll('.cc-burst-wrap').length).toBe(9);
    button.remove();
  });
});
