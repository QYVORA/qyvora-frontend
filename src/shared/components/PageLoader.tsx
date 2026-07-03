import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-bg flex flex-col items-center justify-center overflow-hidden select-none touch-none">
      <Loader2 className="w-10 h-10 text-accent animate-spin" />
      <p className="mt-8 text-[10px] font-mono text-text-muted uppercase tracking-[0.3em] animate-pulse">
        Loading
      </p>
    </div>
  );
};

export default PageLoader;
