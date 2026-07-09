import React from 'react';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';

interface TerminalHeaderProps {
  title: string;
  onClose?: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  title,
  onClose,
  onToggleFullscreen,
  isFullscreen,
}) => (
  <div className="flex items-center justify-between border-b border-white/10 bg-black/60 px-4 py-2.5 select-none shrink-0">
    <div className="flex items-center gap-2">
      <button
        onClick={onClose}
        className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors focus:outline-none"
        aria-label="Close terminal"
      />
      <button
        onClick={onToggleFullscreen}
        className="h-3 w-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors focus:outline-none"
        aria-label={isFullscreen ? 'Minimize terminal' : 'Maximize terminal'}
      />
      <span className="h-3 w-3 rounded-full bg-green-500 opacity-50" />
    </div>
    <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em]">
      {title}
    </span>
    {onClose && (
      <button
        onClick={onClose}
        className="text-white/30 hover:text-white/70 transition-colors"
        aria-label="Close"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);
