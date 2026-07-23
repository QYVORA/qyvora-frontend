import React, { useState, useCallback } from 'react';
import { IconTerminal } from '@/shared/components/icons';
import * as RadixDialog from '@radix-ui/react-dialog';
import { TerminalShell } from './TerminalShell';
import type { SimulatedTerminalProps } from './types';

export const SimulatedTerminal: React.FC<SimulatedTerminalProps> = ({
  open,
  onOpenChange,
  context,
  initialCommands,
  mode = 'modal',
  size = 'compact',
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
      <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
        <RadixDialog.Portal>
          <RadixDialog.Overlay className="fixed inset-0 z-[200] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <RadixDialog.Content
            aria-label="Terminal"
            onKeyDown={(e) => {
              if (e.key === 'Tab') e.stopPropagation();
            }}
            className={cn(
              'fixed z-[201] flex flex-col overflow-hidden rounded-2xl',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              'duration-150',
              isFullscreen
                ? 'inset-4 rounded-2xl'
                : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)] max-w-5xl h-[75vh] max-h-[90vh]',
            )}
          >
            <RadixDialog.Title className="sr-only">Terminal</RadixDialog.Title>
            {shell}
          </RadixDialog.Content>
        </RadixDialog.Portal>
      </RadixDialog.Root>
    );
  }

  if (!open) return null;

  if (size === 'normal') {
    return (
      <div className={isFullscreen ? 'fixed inset-0 z-50' : 'relative -mx-[calc(50vw-50%)] w-[100vw]'}>
        <div className={cn(
          'mx-auto',
          isFullscreen ? 'h-screen' : 'w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)] max-w-5xl h-[75vh] max-h-[90vh]',
          !isFullscreen && 'rounded-2xl overflow-hidden',
        )}>
          {shell}
        </div>
      </div>
    );
  }

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-50' : 'w-full'}>
      <div className={cn(
        isFullscreen ? 'h-screen' : 'h-[50vh] min-h-[300px] max-h-[80vh]',
        !isFullscreen && 'rounded-2xl overflow-hidden',
      )}>
        {shell}
      </div>
    </div>
  );
};

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const TerminalButton: React.FC<{
  onClick: () => void;
  label?: string;
}> = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2.5 bg-black/80 border border-white/10 rounded-xl
      hover:border-accent/30 hover:bg-black transition-all duration-200
      text-xs font-mono text-white/70 hover:text-accent uppercase tracking-wider"
  >
    <IconTerminal size={16} />
    {label || '_terminal'}
  </button>
);

export default SimulatedTerminal;
