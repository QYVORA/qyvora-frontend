import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const CONTAINER_SEL = '.landing-snap, [class*="md:snap-mandatory"]';
const SCROLL_THRESHOLD = 150;

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      let maxScroll = scrollY;
      document.querySelectorAll<HTMLElement>(CONTAINER_SEL).forEach(c => {
        if (c.scrollTop > maxScroll) maxScroll = c.scrollTop;
      });
      setVisible(maxScroll > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', check, { passive: true });
    document.addEventListener('touchmove', check, { passive: true });
    const poll = setInterval(check, 200);

    return () => {
      window.removeEventListener('scroll', check);
      document.removeEventListener('touchmove', check);
      clearInterval(poll);
    };
  }, []);

  const scrollToTop = () => {
    const container = document.querySelector<HTMLElement>(CONTAINER_SEL);
    if (container && container.scrollTop > SCROLL_THRESHOLD) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-20 right-4 z-[9999] w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-accent text-bg shadow-lg hover:brightness-110 transition-all active:scale-90 hover:scale-105 sm:bottom-8 sm:right-8"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

export default ScrollToTop;
