import React from 'react';
import ChainLogo from './ChainLogo';

/**
 * PageLoader — Full-screen loading state for the application.
 * Used as a Suspense fallback and for initial authentication loading.
 */
const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg overflow-hidden select-none touch-none">
      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
        <div className="relative flex items-center justify-center">
          {/* Circular spinner ring */}
          <svg 
            className="absolute w-56 h-56 animate-[spin_4s_linear_infinite]" 
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-accent/10"
            />
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="60 240"
              strokeLinecap="round"
              className="text-accent drop-shadow-[0_0_8px_var(--color-accent)]"
            />
          </svg>

          {/* Inner decorative circle */}
          <div className="absolute w-44 h-44 border border-accent/5 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
          <div className="absolute w-[184px] h-[184px] border-t border-accent/20 rounded-full animate-[spin_6s_linear_infinite]" />
          
          <div className="relative">
            {/* Ambient glow behind the logo */}
            <div className="absolute inset-0 animate-pulse rounded-full bg-accent/15 blur-3xl scale-150" />
            
            <ChainLogo 
              variant="3d" 
              size={120} 
              className="relative z-10 drop-shadow-[0_0_20px_rgba(136,173,124,0.3)]" 
            />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-3">
          <div className="text-accent font-mono text-[11px] font-black uppercase tracking-[0.6em] animate-pulse text-center">
            Establishing Secure Link
          </div>
          
          <div className="text-text-muted font-mono text-[9px] uppercase tracking-widest opacity-60">
            HSOCIETY CORE v4.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
