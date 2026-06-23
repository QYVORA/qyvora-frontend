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
      <Loader2 className="w-12 h-12 animate-spin text-accent" />
    </div>
  );
};

export default PageLoader;
