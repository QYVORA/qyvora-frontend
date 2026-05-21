import React from 'react';

/**
 * PageLoader — Full-screen loading state for the application.
 * Used as a Suspense fallback and for initial authentication loading.
 * Minimal round page loader with no text, images, dots, or background glows.
 */
const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg overflow-hidden select-none touch-none">
      <div className="relative flex items-center justify-center animate-in fade-in duration-500">
        {/* Main spinning loader arc */}
        <svg 
          className="w-16 h-16 animate-spin text-accent" 
          viewBox="0 0 50 50"
        >
          {/* Subtle track */}
          <circle
            cx="25"
            cy="25"
            r="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            className="opacity-10"
          />
          {/* Spinning arc */}
          <circle
            cx="25"
            cy="25"
            r="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeDasharray="45 150"
            strokeLinecap="round"
            className="opacity-90"
          />
        </svg>
      </div>
    </div>
  );
};

export default PageLoader;
