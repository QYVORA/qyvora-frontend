import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoader: React.FC = () => (
  <div className="fixed inset-0 z-[9999] bg-bg flex flex-col items-center justify-center overflow-hidden select-none touch-none">
    <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-accent" />
  </div>
);

export default PageLoader;
