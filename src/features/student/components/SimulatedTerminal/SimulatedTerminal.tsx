import React, { useState, useCallback, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { Dialog, DialogContent } from '@/shared/components/ui/Dialog';
import { TerminalShell } from './TerminalShell';
import type { SimulatedTerminalProps } from './types';

export const SimulatedTerminal: React.FC<SimulatedTerminalProps> = ({
  open,
  onOpenChange,
  context,
  initialCommands,
  mode = 'modal',
  title,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const shell = (
    <TerminalShell
      context={context}
      initialCommands={initialCommands}
      onClose={handleClose}
      onToggleFullscreen={handleToggleFullscreen}
      isFullscreen={isFullscreen}
    />
  );

  if (mode === 'modal') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          title="Simulated Terminal"
          maxWidth={isFullscreen ? 'max-w-[98vw]' : 'max-w-4xl'}
          className={isFullscreen ? 'h-[95vh]' : 'h-[75vh]'}
          hideClose
        >
          <div className="h-full -m-6">
            {shell}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!open) return null;

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-50 p-0' : 'w-full'}>
      <div className={isFullscreen ? 'h-screen' : 'h-[60vh] min-h-[400px]'}>
        {shell}
      </div>
    </div>
  );
};

export const TerminalButton: React.FC<{
  onClick: () => void;
  label?: string;
}> = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2.5 bg-black/80 border border-white/10 rounded-xl
      hover:border-green-500/30 hover:bg-black transition-all duration-200
      text-xs font-mono text-white/70 hover:text-green-400 uppercase tracking-wider"
  >
    <Terminal className="w-4 h-4" />
    {label || '_terminal'}
  </button>
);

export default SimulatedTerminal;
