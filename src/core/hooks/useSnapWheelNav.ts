import { useEffect } from 'react';
import { useReducedMotion } from 'motion/react';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';

export const useSnapWheelNav = (lockMs = 700) => {
  const { isMobile } = useAdaptiveUi();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (isMobile) return;
    const snapContainer = document.querySelector('.snap-container');
    if (!snapContainer) return;

    let lockUntil = 0;

    const positionInContainer = (el: Element) =>
      el.getBoundingClientRect().top -
      snapContainer.getBoundingClientRect().top +
      snapContainer.scrollTop;

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      const { deltaX, deltaY } = event;
      if (Math.abs(deltaY) < Math.abs(deltaX)) return;

      const sections = Array.from(snapContainer.querySelectorAll('.snap-section'));
      if (!sections.length) return;

      const firstTop = positionInContainer(sections[0]);
      const scrollTop = snapContainer.scrollTop;
      const probe = scrollTop - firstTop + snapContainer.clientHeight * 0.3;

      let index = 0;
      sections.forEach((el, i) => {
        if (probe >= positionInContainer(el)) index = i;
      });

      const currentTop = positionInContainer(sections[index]);
      if (Math.abs(scrollTop - firstTop - currentTop) > 24) return;

      const next = index + (deltaY > 0 ? 1 : -1);
      if (next < 0 || next >= sections.length) return;

      const now = performance.now();
      if (now < lockUntil) return;
      lockUntil = now + lockMs;

      event.preventDefault();
      snapContainer.scrollTo({
        top: firstTop + positionInContainer(sections[next]),
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
    };

    snapContainer.addEventListener('wheel', handleWheel, { passive: false });
    return () => snapContainer.removeEventListener('wheel', handleWheel);
  }, [isMobile, shouldReduceMotion, lockMs]);
};

export default useSnapWheelNav;