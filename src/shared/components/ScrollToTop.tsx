import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const CONTAINER_SEL = '.landing-snap, [class*="md:snap-mandatory"]';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      let containerScroll = 0;
      document.querySelectorAll<HTMLElement>(CONTAINER_SEL).forEach(c => {
        if (c.scrollTop > containerScroll) containerScroll = c.scrollTop;
      });
      setVisible(scrollY > 300 || containerScroll > 300);
    };

    window.addEventListener('scroll', check, { passive: true });

    let containers: NodeListOf<HTMLElement>;
    const attachContainers = () => {
      containers?.forEach(c => c.removeEventListener('scroll', check));
      containers = document.querySelectorAll<HTMLElement>(CONTAINER_SEL);
      containers.forEach(c => c.addEventListener('scroll', check, { passive: true }));
    };
    attachContainers();

    const poll = setInterval(attachContainers, 1000);

    return () => {
      window.removeEventListener('scroll', check);
      containers?.forEach(c => c.removeEventListener('scroll', check));
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
