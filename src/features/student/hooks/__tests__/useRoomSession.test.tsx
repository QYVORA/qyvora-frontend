import { describe, it, expect } from 'vitest';
import { useEffect } from 'react';
import { renderHook, render, act } from '@testing-library/react';
import { useRoomSession } from '../useRoomSession';

/**
 * Regression guard: resetSession/toggleFullscreen are consumed inside effect
 * dependency lists. When they were plain arrow functions they took a new identity
 * on every render, so any effect depending on them re-ran on every render,
 * re-rendered, and looped — which froze the bootcamp room page and made the step
 * navigation look dead.
 */
describe('useRoomSession', () => {
  it('keeps resetSession identity stable across renders', () => {
    const { result, rerender } = renderHook(() => useRoomSession());
    const first = result.current.resetSession;
    rerender();
    rerender();
    expect(result.current.resetSession).toBe(first);
  });

  it('keeps toggleFullscreen identity stable across renders', () => {
    const { result, rerender } = renderHook(() => useRoomSession());
    const first = result.current.toggleFullscreen;
    rerender();
    expect(result.current.toggleFullscreen).toBe(first);
  });

  it('settles instead of looping when used as an effect dependency', () => {
    let renders = 0;

    const Consumer = () => {
      renders += 1;
      const { resetSession } = useRoomSession();
      // Same dependency shape as BootcampRoomPage.
      useEffect(() => { resetSession(); }, [resetSession]);
      return <div>{renders}</div>;
    };

    render(<Consumer />);
    // With unstable callbacks this never settles and the count explodes.
    expect(renders).toBeLessThan(10);
  });

  it('resets the session timer on demand', () => {
    const { result } = renderHook(() => useRoomSession());
    act(() => { result.current.resetSession(); });
    expect(result.current.timeSpent).toBe(0);
  });
});