import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

const PROMPT = 'qyvora@core:~$';
const COMMAND = 'boot qyvora';
const TYPE_MS = 34;

const PageLoader: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [typed, setTyped] = useState(prefersReduced ? COMMAND : '');

  useEffect(() => {
    if (prefersReduced) {
      setTyped(COMMAND);
      return;
    }
    let i = 0;
    setTyped('');
    const timer = setInterval(() => {
      i += 1;
      setTyped(COMMAND.slice(0, i));
      if (i >= COMMAND.length) clearInterval(timer);
    }, TYPE_MS);
    return () => clearInterval(timer);
  }, [prefersReduced]);

  return (
    <div className="fixed inset-0 z-[9999] bg-canvas flex items-center justify-center overflow-hidden select-none touch-none px-6">
      <div role="status" aria-live="polite" className="flex items-center justify-center">
        <span className="sr-only">Loading QYVORA</span>
        <p
          aria-hidden="true"
          className="font-mono text-xl sm:text-2xl md:text-3xl font-bold leading-none whitespace-nowrap"
        >
          <span className="text-accent">{PROMPT}&nbsp;</span>
          <span className="text-text-primary">{typed}</span>
          <span className="page-loader-caret ml-2" />
        </p>
      </div>
      <style>{`
        .page-loader-caret {
          display: inline-block;
          width: 4px;
          height: 1.25em;
          border-radius: 1px;
          transform: translateY(0.26em);
          background: var(--color-accent);
          box-shadow: 0 0 10px var(--color-accent-glow);
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
