import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAutoPlayOptions {
  onNext: () => void;
  duration: number;
  disabled?: boolean;
}

interface UseAutoPlayReturn {
  isPaused: boolean;
  containerProps: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
}

export function useAutoPlay({ onNext, duration, disabled }: UseAutoPlayOptions): UseAutoPlayReturn {
  const [isPaused, setIsPaused] = useState(false);
  const savedCallback = useRef(onNext);

  useEffect(() => {
    savedCallback.current = onNext;
  }, [onNext]);

  useEffect(() => {
    if (disabled || isPaused) return;
    const id = setInterval(() => savedCallback.current(), duration);
    return () => clearInterval(id);
  }, [duration, disabled, isPaused]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  return {
    isPaused,
    containerProps: {
      onMouseEnter: pause,
      onMouseLeave: resume,
    },
  };
}
