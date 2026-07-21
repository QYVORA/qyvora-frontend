import React, { useEffect, useState } from 'react';

const PageLoader: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setProgress(30), 100);
    const t2 = setTimeout(() => setProgress(60), 400);
    const t3 = setTimeout(() => setProgress(80), 800);
    const t4 = setTimeout(() => setProgress(95), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-bg flex flex-col items-center justify-center overflow-hidden select-none touch-none">
      {/* Top progress bar */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-border/20 overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Centered brand mark */}
      <div className="flex flex-col items-center gap-4">
        {/* Pulsing accent dot */}
        <div className="relative w-3 h-3">
          <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-30" />
          <div className="relative w-3 h-3 rounded-full bg-accent" />
        </div>

        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">
          Loading
        </span>
      </div>
    </div>
  );
};

export default PageLoader;
