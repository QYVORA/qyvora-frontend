import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePopupManager } from '../usePopupManager';

describe('usePopupManager', () => {
  it('activates the first registered popup immediately', () => {
    const first = renderHook(() => usePopupManager('first', 3));
    expect(first.result.current.isVisible).toBe(true);
  });

  it('queues a popup of lower priority while a higher priority one is active', () => {
    const high = renderHook(() => usePopupManager('high', 0));
    const low = renderHook(() => usePopupManager('low', 5));
    expect(high.result.current.isVisible).toBe(true);
    expect(low.result.current.isVisible).toBe(false);
  });

  it('dismissing the active popup activates the next queued popup', () => {
    const high = renderHook(() => usePopupManager('high', 0));
    const low = renderHook(() => usePopupManager('low', 5));
    act(() => high.result.current.onDismiss());
    expect(high.result.current.isVisible).toBe(false);
    expect(low.result.current.isVisible).toBe(true);
  });

  it('activates the next popup by priority, not by registration order', () => {
    const low = renderHook(() => usePopupManager('low', 5));
    const high = renderHook(() => usePopupManager('high', 1));
    act(() => low.result.current.onDismiss());
    expect(high.result.current.isVisible).toBe(true);
  });

  it('unmounting a queued popup does not disturb the active popup', () => {
    const active = renderHook(() => usePopupManager('active', 1));
    const queued = renderHook(() => usePopupManager('queued', 2));
    queued.unmount();
    expect(active.result.current.isVisible).toBe(true);
  });

  it('unmounting the active popup releases the slot to the next queued popup', () => {
    const active = renderHook(() => usePopupManager('active', 1));
    const queued = renderHook(() => usePopupManager('queued', 2));
    active.unmount();
    expect(queued.result.current.isVisible).toBe(true);
  });

  it('re-activates cleanly after an unmount/remount cycle', () => {
    const first = renderHook(() => usePopupManager('popup', 1));
    first.unmount();
    const second = renderHook(() => usePopupManager('popup', 1));
    expect(second.result.current.isVisible).toBe(true);
  });
});