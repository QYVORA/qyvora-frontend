import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import AnansiLogo from '../../../shared/components/brand/AnansiLogo';
import { cn } from '../../../shared/utils/cn';

interface ScanFormProps {
  onStartScan: (target: string) => void;
  isLoading: boolean;
  layout?: 'standalone' | 'dashboard';
}

const ScanForm: React.FC<ScanFormProps> = ({ onStartScan, isLoading, layout = 'standalone' }) => {
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
      "relative border border-white/10 rounded-3xl bg-bg-elevated/40 p-8 md:p-12",
      isDashboard ? "border-accent/20" : "border-white/10"
    )}>
      <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-10">
        <div className="space-y-6">
          <label htmlFor="target" className={cn(
            "block text-[11px] font-black uppercase tracking-[0.4em]",
            isDashboard ? "text-accent" : "text-cyan-500"
          )}>
            Target Identification
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className={cn(
                "w-5 h-5 text-text-muted",
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
                "w-full pl-14 pr-6 py-5 bg-black/40 border rounded-2xl text-text-primary placeholder:text-text-muted/40 focus:outline-none transition-all font-mono text-base",
                isDashboard 
                  ? "border-accent/10 focus:border-accent/40" 
                  : "border-white/10 focus:border-cyan-500/40"
              )}
              disabled={isLoading}
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!target.trim() || isLoading}
          className={cn(
            "group relative flex flex-col items-center justify-center gap-4 py-10 px-10 rounded-3xl font-black uppercase tracking-[0.3em] text-sm transition-all duration-300",
            !target.trim() || isLoading 
              ? 'bg-white/5 text-text-muted cursor-not-allowed opacity-50' 
              : isDashboard
                ? 'bg-accent text-bg hover:brightness-110 active:scale-95'
                : 'bg-cyan-600 text-bg hover:bg-cyan-500 active:scale-95'
          )}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin" />
              <span className="text-xs">Engaging Engine</span>
            </div>
          ) : (
            <>
              <AnansiLogo size={64} className="mb-2" />
              <span className="text-xs">Initialize Reconnaissance</span>
            </>
          )}
        </button>
      </form>
      
      <div className="absolute bottom-4 right-8 text-[8px] font-mono text-text-muted/20 uppercase tracking-[0.4em] pointer-events-none select-none">
        ANANSI_CORE_v1.2.0
      </div>
    </div>
  );
};

export default ScanForm;
