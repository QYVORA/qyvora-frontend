import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-bg flex items-center justify-center overflow-hidden select-none touch-none">
      <Loader2 className="w-10 h-10 text-accent animate-spin" />
    </div>
  );
};

export default PageLoader;
