import React from 'react';
import { QyvoraMark } from '@/shared/components/brand/QyvoraMark';

const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-bg flex items-center justify-center overflow-hidden select-none touch-none">
      <div className="flex flex-col items-center gap-6 md:gap-8">
        <div className="flex items-center gap-3 md:gap-6">
          <div className="w-4 h-4 md:w-10 md:h-10 bg-accent rounded-sm animate-athena-box-1" />
          <div className="w-4 h-4 md:w-10 md:h-10 bg-accent/60 rounded-sm animate-athena-box-2" />
          <div className="w-4 h-4 md:w-10 md:h-10 bg-accent/30 rounded-sm animate-athena-box-3" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <QyvoraMark className="w-10 h-10 md:w-14 md:h-14" />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-text-muted">
            QYVORA
          </span>
          <div className="w-32 md:w-40 h-px bg-border overflow-hidden">
            <div className="h-full w-1/2 bg-accent animate-[pulse_1.2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
