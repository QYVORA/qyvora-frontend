import React from 'react';
import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  mode?: 'full' | 'relative';
}

const PageLoader: React.FC<PageLoaderProps> = ({ mode = 'full' }) => {
  const containerClasses = mode === 'full' 
    ? "fixed inset-0 z-[9999] bg-bg w-screen h-screen flex flex-col items-center justify-center overflow-hidden select-none touch-none"
    : "relative w-full flex-1 flex flex-col items-center justify-center min-h-[300px] bg-transparent overflow-hidden select-none";

  return (
    <div className={containerClasses}>
      <div className="relative flex items-center justify-center animate-in fade-in duration-500 scale-[2]">
        <Loader2 className="w-20 h-20 animate-spin text-accent" />
      </div>
    </div>
  );
};

export default PageLoader;
