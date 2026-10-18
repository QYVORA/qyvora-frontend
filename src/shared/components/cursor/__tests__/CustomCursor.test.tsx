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

function dispatchPointer(el: Element | Document | Window, type: string, init: { clientX?: number; clientY?: number; relatedTarget?: Element | null } = {}) {
  const ev = new Event(type, { bubbles: true, cancelable: true });
  if (init.clientX !== undefined) Object.defineProperty(ev, 'clientX', { value: init.clientX });
  if (init.clientY !== undefined) Object.defineProperty(ev, 'clientY', { value: init.clientY });
  if (init.relatedTarget !== undefined) Object.defineProperty(ev, 'relatedTarget', { value: init.relatedTarget });
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

  it('activates on fine-pointer devices and hides the native cursor', () => {
    stubMatchMedia({ fine: true });
    const { container } = render(<CustomCursor />);
    expect(container.querySelector('.qyvora-cursor-root')).not.toBeNull();
    expect(document.documentElement.classList.contains('qyvora-cursor')).toBe(true);
  });

  it('removes the root class and overlay on unmount', () => {
    stubMatchMedia({ fine: true });
    const { unmount } = render(<CustomCursor />);
    unmount();
    expect(document.documentElement.classList.contains('qyvora-cursor')).toBe(false);
    expect(document.querySelector('.qyvora-cursor-root')).toBeNull();
  });

  it('starts hidden and reveals on first pointer move', () => {
    stubMatchMedia({ fine: true });
    const { container } = render(<CustomCursor />);
    const root = container.querySelector('.qyvora-cursor-root') as HTMLElement;
    expect(root.dataset.hidden).toBe('true');

    const surface = document.createElement('div');
    document.body.appendChild(surface);
    dispatchPointer(surface, 'pointermove', { clientX: 40, clientY: 60 });

    expect(root.dataset.hidden).toBe('false');
    surface.remove();
  });

  it('locks on over interactive elements and releases over plain surfaces', () => {
    stubMatchMedia({ fine: true });
    const { container } = render(<CustomCursor />);
    const root = container.querySelector('.qyvora-cursor-root') as HTMLElement;

    const button = document.createElement('button');
    document.body.appendChild(button);
    dispatchPointer(button, 'pointermove', { clientX: 10, clientY: 20 });
    expect(root.dataset.state).toBe('hover');

    const plain = document.createElement('div');
    document.body.appendChild(plain);
    dispatchPointer(plain, 'pointermove', { clientX: 30, clientY: 40 });
    expect(root.dataset.state).toBe('default');

    button.remove();
    plain.remove();
  });

  it('does not lock on disabled controls', () => {
    stubMatchMedia({ fine: true });
    const { container } = render(<CustomCursor />);
    const root = container.querySelector('.qyvora-cursor-root') as HTMLElement;

    const disabled = document.createElement('button');
    disabled.disabled = true;
    document.body.appendChild(disabled);
    dispatchPointer(disabled, 'pointermove', { clientX: 10, clientY: 20 });
    expect(root.dataset.state).toBe('default');
    disabled.remove();
  });

  it('hides the reticle over text-entry surfaces so the native I-beam shows', () => {
    stubMatchMedia({ fine: true });
    const { container } = render(<CustomCursor />);
    const root = container.querySelector('.qyvora-cursor-root') as HTMLElement;

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    dispatchPointer(textarea, 'pointermove', { clientX: 15, clientY: 25 });
    expect(root.dataset.hidden).toBe('true');
    textarea.remove();
  });

  it('enters press state and spawns the click burst on interactive press', () => {
    stubMatchMedia({ fine: true });
    const { container } = render(<CustomCursor />);
    const root = container.querySelector('.qyvora-cursor-root') as HTMLElement;
    const burst = root.querySelector('.cc-burst-layer') as HTMLElement;

    const button = document.createElement('button');
    document.body.appendChild(button);
    dispatchPointer(button, 'pointermove', { clientX: 12, clientY: 24 });
    dispatchPointer(button, 'pointerdown', { clientX: 12, clientY: 24 });

    expect(root.dataset.state).toBe('press');
    // 1 ripple + 8 sparks on an interactive target
    expect(burst.querySelectorAll('.cc-burst-wrap').length).toBe(9);
    expect(burst.querySelectorAll('.cc-ripple').length).toBe(1);
    expect(burst.querySelectorAll('.cc-spark').length).toBe(8);

    dispatchPointer(button, 'pointerup', { clientX: 12, clientY: 24 });
    expect(root.dataset.state).toBe('hover');
    button.remove();
  });

  it('spawns a lighter burst on non-interactive surfaces', () => {
    stubMatchMedia({ fine: true });
    const { container } = render(<CustomCursor />);
    const root = container.querySelector('.qyvora-cursor-root') as HTMLElement;
    const burst = root.querySelector('.cc-burst-layer') as HTMLElement;

    const plain = document.createElement('div');
    document.body.appendChild(plain);
    dispatchPointer(plain, 'pointermove', { clientX: 5, clientY: 5 });
    dispatchPointer(plain, 'pointerdown', { clientX: 5, clientY: 5 });

    expect(burst.querySelectorAll('.cc-ripple').length).toBe(1);
    expect(burst.querySelectorAll('.cc-spark').length).toBe(4);
    plain.remove();
  });

  it('hides the reticle when the pointer leaves the window', () => {
    stubMatchMedia({ fine: true });
    const { container } = render(<CustomCursor />);
    const root = container.querySelector('.qyvora-cursor-root') as HTMLElement;

    const surface = document.createElement('div');
    document.body.appendChild(surface);
    dispatchPointer(surface, 'pointermove', { clientX: 8, clientY: 8 });
    expect(root.dataset.hidden).toBe('false');

    dispatchPointer(window, 'pointerout', { relatedTarget: null });
    expect(root.dataset.hidden).toBe('true');
    surface.remove();
  });

  it('skips the click burst for reduced-motion users', () => {
    stubMatchMedia({ fine: true, reduce: true });
    const { container } = render(<CustomCursor />);
    const root = container.querySelector('.qyvora-cursor-root') as HTMLElement;
    const burst = root.querySelector('.cc-burst-layer') as HTMLElement;

    const plain = document.createElement('div');
    document.body.appendChild(plain);
    dispatchPointer(plain, 'pointermove', { clientX: 5, clientY: 5 });
    dispatchPointer(plain, 'pointerdown', { clientX: 5, clientY: 5 });

    expect(burst.childElementCount).toBe(0);
    plain.remove();
  });

  it('renders an arrow-shaped glyph and tracks the pointer 1:1 (no lag)', () => {
    stubMatchMedia({ fine: true });
    const { container } = render(<CustomCursor />);
    const glyph = container.querySelector('.cc-pointer') as SVGElement;
    expect(glyph).not.toBeNull();
    expect(glyph.tagName.toLowerCase()).toBe('svg');
    expect(glyph.getAttribute('fill')).toBe('var(--color-accent)');
    expect(glyph.getAttribute('stroke')).toBe('var(--color-on-accent)');

    const wrap = container.querySelector('.cc-pointer-wrap') as HTMLElement;
    const surface = document.createElement('div');
    document.body.appendChild(surface);
    dispatchPointer(surface, 'pointermove', { clientX: 123, clientY: 45 });
    expect(wrap.style.transform).toBe('translate3d(123px, 45px, 0)');
    surface.remove();
  });

  it('morphs into a pointing finger with a HUD lock frame over pointable targets', () => {
    stubMatchMedia({ fine: true });
    const { container } = render(<CustomCursor />);
    const root = container.querySelector('.qyvora-cursor-root') as HTMLElement;
    expect(container.querySelector('.cc-finger')).not.toBeNull();
    expect(container.querySelector('.cc-lock')).not.toBeNull();
    expect(root.dataset.hover).toBe('false');

    const button = document.createElement('button');
    document.body.appendChild(button);
    dispatchPointer(button, 'pointermove', { clientX: 10, clientY: 10 });
    expect(root.dataset.hover).toBe('true');
    expect(root.dataset.state).toBe('hover');

    // Leaving for plain content reverts to the arrow.
    const plain = document.createElement('div');
    document.body.appendChild(plain);
    dispatchPointer(plain, 'pointermove', { clientX: 60, clientY: 60 });
    expect(root.dataset.hover).toBe('false');
    expect(root.dataset.state).toBe('default');
    button.remove();
    plain.remove();
  });

  it('falls back to mouse events on browsers without PointerEvent', () => {
    stubMatchMedia({ fine: true });
    delete (window as { PointerEvent?: unknown }).PointerEvent;
    const { container } = render(<CustomCursor />);
    const root = container.querySelector('.qyvora-cursor-root') as HTMLElement;
    const wrap = container.querySelector('.cc-pointer-wrap') as HTMLElement;

    const surface = document.createElement('div');
    document.body.appendChild(surface);
    dispatchPointer(surface, 'mousemove', { clientX: 33, clientY: 77 });
    expect(root.dataset.hidden).toBe('false');
    expect(wrap.style.transform).toBe('translate3d(33px, 77px, 0)');

    dispatchPointer(surface, 'mousedown', { clientX: 33, clientY: 77 });
    expect(root.dataset.state).toBe('press');
    surface.remove();
  });
});
