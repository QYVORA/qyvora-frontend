import { useState, useEffect } from 'react';

export const useScrollY = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement | Document;
      
      // If it's a document (window scroll), use window.scrollY
      if (target instanceof Document) {
        setScrollY(window.scrollY);
      } 
      // If it's an element (internal scroll), use its scrollTop
      else if (target instanceof HTMLElement) {
        setScrollY(target.scrollTop);
      }
    };

    // Use capture: true to catch scroll events from ANY element in the tree
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    return () => window.removeEventListener('scroll', handleScroll, { capture: true });
  }, []);

  return scrollY;
};
