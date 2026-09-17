import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

const PROMPT = 'qyvora@core:~$';
const LINE = 'boot qyvora terminal';

const PageLoader: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [typed, setTyped] = useState(prefersReduced ? LINE : '');

  useEffect(() => {
    if (prefersReduced) {
      setTyped(LINE);
      return;
    }
    let i = 0;
    setTyped('');
    const timer = setInterval(() => {
      i += 1;
      setTyped(LINE.slice(0, i));
      if (i >= LINE.length) clearInterval(timer);
    }, 48);
    return () => clearInterval(timer);
  }, [prefersReduced]);

  return (
    <div className="fixed inset-0 z-[9999] bg-canvas flex items-center justify-center overflow-hidden select-none touch-none px-4">
      <p className="font-mono text-sm md:text-base whitespace-nowrap" role="status" aria-live="polite">
        <span className="text-text-tertiary">{PROMPT}&nbsp;</span>
        <span className="text-text-primary">{typed}</span>
        <span
          className="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-accent"
          style={prefersReduced ? undefined : { animation: 'caret-blink 1s step-end infinite' }}
        />
      </p>
      <style>{`
        @keyframes caret-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

/**
 * Suspense fallback that stays invisible for fast/cached chunk loads and only
 * shows the full-screen loader once loading exceeds `delay` ms.
 */
export const DelayedPageLoader: React.FC<{ delay?: number }> = ({ delay = 180 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;
  return <PageLoader />;
};

export default PageLoader;