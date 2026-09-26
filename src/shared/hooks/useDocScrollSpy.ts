import { useEffect, useState } from 'react';

/**
 * useDocScrollSpy — reports which section anchor is currently in view.
 *
 * Takes a comma-joined id list so the effect depends on a stable string rather
 * than on a fresh array identity on every render. A section becomes active once
 * its top edge passes `offset`; before the first section does, the first id is
 * reported so the sidebar always has a selection.
 */
export const useDocScrollSpy = (idsKey: string, offset = 96): string => {
  const ids = idsKey.split(',').filter(Boolean);
  const [activeId, setActiveId] = useState(ids[0] ?? '');

  useEffect(() => {
    if (!ids.length) {
      setActiveId('');
      return;
    }

    let raf = 0;

    const update = () => {
      let current = ids[0];
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= offset) {
          current = id;
        }
      }
      setActiveId(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [idsKey, offset]);

  return activeId;
};
