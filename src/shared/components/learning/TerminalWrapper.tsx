import React, { useState, useCallback, useEffect } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { TerminalShell } from '@/features/student/components/SimulatedTerminal/TerminalShell';
import type { TerminalContext } from '@/features/student/components/SimulatedTerminal/types';

export interface TerminalWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: TerminalContext;
  initialCommands?: string[];
  mode?: 'modal' | 'inline' | 'raw';
  title?: string;
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const TerminalWrapper: React.FC<TerminalWrapperProps> = ({
  open,
  onOpenChange,
  context,
  initialCommands,
  mode = 'modal',
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
      showChrome={mode !== 'raw'}
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
                : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)] max-w-5xl h-[60vh] md:h-[75vh] max-h-[90vh]',
            )}
          >
            <RadixDialog.Title className="sr-only">Terminal</RadixDialog.Title>
            {shell}
          </RadixDialog.Content>
        </RadixDialog.Portal>
      </RadixDialog.Root>
    );
  }

  if (mode === 'raw') {
    if (!open) return null;
    return shell;
  }

  // mode === 'inline'
  if (!open) return null;

  return (
    <div className="w-full h-full">
      <div
        className={cn(
          'w-full h-full',
          !isFullscreen && 'rounded-2xl overflow-hidden',
        )}
      >
        {shell}
      </div>
    </div>
  );
};

export default TerminalWrapper;
