import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

const PROMPT = 'qyvora@core:~$ ';
const COMMAND = 'boot';
const FULL_LINE = PROMPT + COMMAND;
const TYPE_MS = 55;

const PageLoader: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [count, setCount] = useState(prefersReduced ? FULL_LINE.length : 0);

  useEffect(() => {
    if (prefersReduced) {
      setCount(FULL_LINE.length);
      return;
    }
    setCount(0);
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= FULL_LINE.length) clearInterval(timer);
    }, TYPE_MS);
    return () => clearInterval(timer);
  }, [prefersReduced]);

  const typed = FULL_LINE.slice(0, count);

  return (
    <div className="fixed inset-0 z-[9999] bg-canvas flex items-center justify-center overflow-hidden select-none touch-none px-6">
      <div role="status" aria-live="polite" className="flex items-center justify-center">
        <span className="sr-only">Loading QYVORA</span>
        <p
          aria-hidden="true"
          className="font-mono text-sm sm:text-base md:text-lg font-medium leading-none whitespace-nowrap text-text-primary"
        >
          <span className="text-accent">{typed.slice(0, PROMPT.length)}</span>
          <span>{typed.slice(PROMPT.length)}</span>
          <span className="page-loader-caret" />
        </p>
      </div>
      <style>{`
        .page-loader-caret {
          display: inline-block;
          width: 0.11em;
          height: 0.95em;
          margin-left: 0.22em;
          border-radius: 1px;
          transform: translateY(0.14em);
          background: var(--color-accent);
          box-shadow: 0 0 6px var(--color-accent-glow);
          animation: page-loader-blink 1.05s steps(1, end) infinite;
        }
        @keyframes page-loader-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .page-loader-caret { animation: none; opacity: 1; }
        }
      `}</style>
    </div>
  );
};

/**
 * Suspense fallback that stays invisible for fast/cached chunk loads and only
 * shows the full-screen loader once loading exceeds `delay` ms.
 */
export const DelayedPageLoader: React.FC<{ delay?: number }> = ({ delay = 120 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;
  return <PageLoader />;
};

export default PageLoader;
