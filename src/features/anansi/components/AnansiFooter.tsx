import React from 'react';
import { cn } from '../../../shared/utils/cn';

interface AnansiFooterProps {
  layout?: 'standalone' | 'dashboard';
}

const AnansiFooter: React.FC<AnansiFooterProps> = ({ layout = 'standalone' }) => {
  const isDashboard = layout === 'dashboard';
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn(
      "mt-auto py-8 border-t",
      isDashboard ? "border-accent/10" : "border-white/10"
    )}>
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-text-muted">
          <div className="flex items-center gap-2 text-xs md:text-sm font-mono uppercase tracking-widest">
            <span className={cn(
              "font-black",
              isDashboard ? "text-accent" : "text-cyan-500"
            )}>
              ANANSI
            </span>
            <span>Intelligence Platform</span>
          </div>
          
          <div className="text-xs font-mono">
            © {currentYear} H SOCIETY. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AnansiFooter;
