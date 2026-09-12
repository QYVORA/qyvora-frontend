import { useState, useEffect } from 'react';

/**
 * useDocScrollSpy — tracks which section (by id) is currently above an
 * offset from the viewport top. Used by the tool-docs topbar pills and the
 * "On this page" sidebar TOC so both highlight the active section together.
 */
export function useDocScrollSpy(ids: string[], offset = 130): string {
  const [activeId, setActiveId] = useState(ids[0] ?? '');
  const idsKey = ids.join('|');

  useEffect(() => {
    const sectionIds = idsKey.split('|').filter(Boolean);
    if (sectionIds.length === 0) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const offsets = sectionIds.map((id) => {
          const el = document.getElementById(id);
          return { id, top: el ? el.getBoundingClientRect().top : Infinity };
        });

        const current = offsets.reduce(
          (closest, s) => {
            if (s.top <= offset && s.top > closest.top) return s;
            return closest;
          },
          { id: sectionIds[0], top: -Infinity }
        );

        if (current.id) setActiveId(current.id);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [idsKey, offset]);

  return activeId;
}