import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const CONTAINER_SEL = '.landing-snap, [class*="md:snap-mandatory"]';
const SCROLL_THRESHOLD = 200;

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
    const poll = setInterval(check, 200);

    return () => {
      window.removeEventListener('scroll', check);
      clearInterval(poll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document
      .querySelector<HTMLElement>(CONTAINER_SEL)
      ?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-[9999] w-12 h-12 flex items-center justify-center rounded-full bg-accent text-bg shadow-lg hover:brightness-110 transition-all active:scale-90 hover:scale-105"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

export default ScrollToTop;
