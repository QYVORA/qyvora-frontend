import React, { useState } from 'react';
import { Search, Loader2, Terminal } from 'lucide-react';
import AnansiLogo from '../../../shared/components/brand/AnansiLogo';

interface ScanFormProps {
  onStartScan: (target: string) => void;
  isLoading: boolean;
}

const ScanForm: React.FC<ScanFormProps> = ({ onStartScan, isLoading }) => {
  const [target, setTarget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (target.trim() && !isLoading) {
      onStartScan(target.trim());
    }
  };

  return (
    <div className="terminal-card p-6 md:p-8 lg:p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
        <AnansiLogo size={160} minimal />
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-8">
        <div>
          <label htmlFor="target" className="block text-[10px] font-black text-cyan-500 uppercase tracking-[0.25em] mb-4">
            Target Identification
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-text-muted group-focus-within:text-cyan-500 transition-colors" />
            </div>
            <input
              id="target"
              type="text"
              placeholder="Enter domain (e.g. example.com)"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-bg/50 border border-border rounded-xl text-text-primary placeholder:text-text-muted/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono text-sm"
              disabled={isLoading}
            />
          </div>
          <p className="mt-3 text-[9px] text-text-muted uppercase tracking-[0.15em] leading-relaxed">
            [!] Supports apex domains and subdomains. Protocol (http/https) is handled automatically by the engine.
          </p>
        </div>
        
        <button
          type="submit"
          disabled={!target.trim() || isLoading}
          className={`relative flex items-center justify-center gap-3 py-4 px-8 rounded-xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-300
            ${!target.trim() || isLoading 
              ? 'bg-border/50 text-text-muted cursor-not-allowed' 
              : 'bg-cyan-600 hover:bg-cyan-500 text-bg shadow-[0_0_24px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] active:scale-95'}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Engaging Intelligence Engine...
            </>
          ) : (
            <>
              <Terminal className="w-4 h-4" />
              Initialize Reconnaissance
            </>
          )}
        </button>
      </form>
      
      {/* Decorative terminal bits */}
      <div className="absolute bottom-2 right-4 text-[8px] font-mono text-text-muted/20 uppercase tracking-[0.3em] pointer-events-none select-none">
        Anansi_v1.2.0_Scan_Module
      </div>
    </div>
  );
};

export default ScanForm;

