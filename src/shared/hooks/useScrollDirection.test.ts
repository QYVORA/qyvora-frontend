import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useScrollDirection } from './useScrollDirection';

const scrollTo = (y: number) => {
  Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: y });
  window.dispatchEvent(new Event('scroll'));
};

describe('useScrollDirection', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: 0 });
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return 0;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.style.removeProperty('--app-topbar-offset');
  });

  it('hides on scroll down and reveals on scroll up', () => {
    const { result } = renderHook(() => useScrollDirection());

    expect(result.current).toBe(false);

    act(() => scrollTo(200));
    expect(result.current).toBe(true);
    expect(document.documentElement.style.getPropertyValue('--app-topbar-offset')).toBe('0px');

    act(() => scrollTo(100));
    expect(result.current).toBe(false);
    expect(document.documentElement.style.getPropertyValue('--app-topbar-offset')).toBe(
      'var(--app-topbar-h)',
    );
  });

  it('stays visible inside the top threshold', () => {
    const { result } = renderHook(() => useScrollDirection({ threshold: 80 }));

    act(() => scrollTo(40));

    expect(result.current).toBe(false);
  });

  it('forces visible when disabled or forced', () => {
    const { result, rerender } = renderHook(
      ({ disabled, forceVisible }) => useScrollDirection({ disabled, forceVisible }),
      { initialProps: { disabled: false, forceVisible: false } },
    );

    act(() => scrollTo(200));
    expect(result.current).toBe(true);

    rerender({ disabled: false, forceVisible: true });
    expect(result.current).toBe(false);
  });
});
