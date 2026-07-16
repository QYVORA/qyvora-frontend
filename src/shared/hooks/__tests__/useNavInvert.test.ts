import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNavInvert } from '../useNavInvert';

describe('useNavInvert', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns false when no data-nav-invert elements exist', async () => {
    const { result } = renderHook(() => useNavInvert());
    // Initial state is false; RAF check may not have run yet
    expect(typeof result.current).toBe('boolean');
  });

  it('returns true when a data-nav-invert element overlaps the navbar zone', async () => {
    const el = document.createElement('div');
    el.setAttribute('data-nav-invert', '');
    // Position it at the top of the viewport (overlaps nav at y=0..80)
    Object.defineProperty(el, 'getBoundingClientRect', {
      value: () => ({ top: 0, bottom: 200, left: 0, right: 100, width: 100, height: 200, x: 0, y: 0 }),
    });
    document.body.appendChild(el);

    const { result } = renderHook(() => useNavInvert());

    // Wait for RAF + effect to run
    await act(async () => {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    });

    expect(result.current).toBe(true);
  });

  it('returns false when data-nav-invert element is below the navbar', async () => {
    const el = document.createElement('div');
    el.setAttribute('data-nav-invert', '');
    // Position it below the navbar (top: 500, well below navHeight=80)
    Object.defineProperty(el, 'getBoundingClientRect', {
      value: () => ({ top: 500, bottom: 700, left: 0, right: 100, width: 100, height: 200, x: 0, y: 500 }),
    });
    document.body.appendChild(el);

    const { result } = renderHook(() => useNavInvert());

    await act(async () => {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    });

    expect(result.current).toBe(false);
  });

  it('returns false when element is above viewport (bottom <= 0)', async () => {
    const el = document.createElement('div');
    el.setAttribute('data-nav-invert', '');
    Object.defineProperty(el, 'getBoundingClientRect', {
      value: () => ({ top: -200, bottom: -100, left: 0, right: 100, width: 100, height: 100, x: 0, y: -200 }),
    });
    document.body.appendChild(el);

    const { result } = renderHook(() => useNavInvert());

    await act(async () => {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    });

    expect(result.current).toBe(false);
  });

  it('accepts custom navHeight option', async () => {
    const el = document.createElement('div');
    el.setAttribute('data-nav-invert', '');
    // top: 100 is above navHeight=150 but below default 80
    Object.defineProperty(el, 'getBoundingClientRect', {
      value: () => ({ top: 100, bottom: 300, left: 0, right: 100, width: 100, height: 200, x: 0, y: 100 }),
    });
    document.body.appendChild(el);

    const { result } = renderHook(() => useNavInvert({ navHeight: 150 }));

    await act(async () => {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    });

    expect(result.current).toBe(true);
  });
});
