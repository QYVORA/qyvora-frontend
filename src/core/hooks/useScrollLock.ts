import { useEffect } from 'react';

let lockCount = 0;
let originalStyles: Record<string, string> = {};
let scrollY = 0;

function lock() {
  if (lockCount === 0) {
    originalStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
  }
  lockCount++;
}

function unlock() {
  lockCount--;
  if (lockCount <= 0) {
    lockCount = 0;
    document.body.style.overflow = originalStyles.overflow || '';
    document.body.style.position = originalStyles.position || '';
    document.body.style.top = originalStyles.top || '';
    document.body.style.width = originalStyles.width || '';
    window.scrollTo(0, scrollY);
    originalStyles = {};
  }
}

export function useScrollLock(shouldLock: boolean = true) {
  useEffect(() => {
    if (!shouldLock) return;
    lock();
    return () => unlock();
  }, [shouldLock]);
}
