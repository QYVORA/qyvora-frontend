import { useState, useEffect, useCallback } from 'react';
import { useLocation, useMatch } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

const SCROLL_THRESHOLD = 150;

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  const isWalkthroughPage = Boolean(
    useMatch('/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId') ||
    useMatch('/dashboard/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId') ||
    useMatch('/dashboard/courses/:courseId') ||
    useMatch('/dashboard/labs/:labType')
  );

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      document.documentElement.scrollTo({ top: 0, behavior: 'auto' });
      document.body.scrollTo({ top: 0, behavior: 'auto' });
      window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  useEffect(() => {
    const check = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!visible || isWalkthroughPage) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-4 left-4 z-[9997] flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-bg-card text-accent transition-all duration-200 hover:border-accent/40 hover:text-text-primary active:scale-90"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
};

export default ScrollToTop;
