import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import AnansiLogo from '../../../shared/components/brand/AnansiLogo';
import { cn } from '../../../shared/utils/cn';

interface ScanFormProps {
  onStartScan: (target: string) => void;
  isLoading: boolean;
  layout?: 'standalone' | 'dashboard';
  guestScansRemaining?: number | null;
}

const ScanForm: React.FC<ScanFormProps> = ({ onStartScan, isLoading, layout = 'standalone', guestScansRemaining }) => {
  const [target, setTarget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (target.trim() && !isLoading) {
      onStartScan(target.trim());
    }
  };

  const isDashboard = layout === 'dashboard';

  return (
    <div className={cn(
      "relative border border-white/10 rounded-3xl bg-bg-elevated/40 p-6 md:p-12 lg:p-16 md:min-h-[400px]",
      isDashboard ? "border-accent/20" : "border-white/10"
    )}>
      <form onSubmit={handleSubmit} className="relative z-10 flex flex-col lg:flex-row items-end gap-6 lg:gap-8">
        {/* Target Input - Takes most space */}
        <div className="flex-1 w-full space-y-4">
          <label htmlFor="target" className={cn(
            "block text-[10px] md:text-xs font-black uppercase tracking-[0.3em]",
            isDashboard ? "text-accent" : "text-cyan-500"
          )}>
            Target Identification
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className={cn(
                "w-5 h-5 md:w-6 md:h-6 text-text-muted",
                isDashboard ? "group-focus-within:text-accent" : "group-focus-within:text-cyan-500"
              )} />
            </div>
            <input
              id="target"
              type="text"
              placeholder="Enter domain or IP (e.g. hsociety.io)"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className={cn(
                "w-full pl-14 md:pl-16 pr-6 py-4 md:py-5 lg:py-6 bg-black/40 border rounded-2xl text-text-primary placeholder:text-text-muted/40 focus:outline-none transition-all font-mono text-base md:text-lg",
                isDashboard 
                  ? "border-accent/10 focus:border-accent/40" 
                  : "border-white/10 focus:border-cyan-500/40"
              )}
              disabled={isLoading}
            />
          </div>
        </div>
        
        {/* Scan Button - Compact Size */}
        <button
          type="submit"
          disabled={!target.trim() || isLoading}
          className={cn(
            "group relative flex items-center justify-center gap-3 py-4 md:py-5 lg:py-6 px-8 md:px-10 lg:px-12 rounded-2xl font-black uppercase tracking-[0.2em] text-xs md:text-sm transition-all duration-300 whitespace-nowrap",
            !target.trim() || isLoading 
              ? 'bg-white/5 text-text-muted cursor-not-allowed opacity-50' 
              : isDashboard
                ? 'bg-accent text-bg hover:brightness-110 active:scale-95'
                : 'bg-cyan-600 text-bg hover:bg-cyan-500 active:scale-95'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
              <span>Scanning...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5 md:w-6 md:h-6" />
              <span>Start Scan</span>
            </>
          )}
        </button>
      </form>
      
      {/* Scans Remaining Info */}
      {guestScansRemaining !== null && (
        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono">Scans Remaining</span>
          <span className={cn(
            "text-lg font-black font-mono",
            isDashboard ? "text-accent" : "text-cyan-500"
          )}>
            {guestScansRemaining}
          </span>
        </div>
      )}
      
      <div className="absolute bottom-3 right-6 text-[8px] font-mono text-text-muted/20 uppercase tracking-[0.4em] pointer-events-none select-none">
        ANANSI_CORE_v1.2.0
      </div>
    </div>
  );
};

export default ScanForm;
