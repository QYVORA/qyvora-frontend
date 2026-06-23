import { useEffect } from 'react';

export function useScrollLock(lock: boolean = true) {
  useEffect(() => {
    if (!lock) return;

    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    const preventTouch = (e: TouchEvent) => e.preventDefault();
    document.body.addEventListener('touchmove', preventTouch, { passive: false });

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      window.scrollTo(0, scrollY);
      document.body.removeEventListener('touchmove', preventTouch);
    };
  }, [lock]);
}
