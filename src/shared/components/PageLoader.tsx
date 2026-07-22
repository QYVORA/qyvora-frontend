import React from 'react';

const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-bg flex items-center justify-center overflow-hidden select-none touch-none">
      <div className="flex items-center gap-2.5">
        <div className="w-3 h-3 bg-accent rounded-sm animate-athena-box-1" />
        <div className="w-3 h-3 bg-accent/60 rounded-sm animate-athena-box-2" />
        <div className="w-3 h-3 bg-accent/30 rounded-sm animate-athena-box-3" />
      </div>
    </div>
  );
};

export default PageLoader;
