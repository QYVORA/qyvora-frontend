import React, { useEffect, useState } from 'react';

const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-bg flex items-center justify-center overflow-hidden select-none touch-none">
      <div className="flex items-center gap-3 md:gap-6">
        <div className="w-4 h-4 md:w-10 md:h-10 bg-accent rounded-sm animate-athena-box-1" />
        <div className="w-4 h-4 md:w-10 md:h-10 bg-accent/60 rounded-sm animate-athena-box-2" />
        <div className="w-4 h-4 md:w-10 md:h-10 bg-accent/30 rounded-sm animate-athena-box-3" />
      </div>
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
