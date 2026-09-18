import React, { useEffect, useState } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { TerminalShell } from '@/features/student/components/SimulatedTerminal/TerminalShell';
import type { TerminalContext } from '@/features/student/components/SimulatedTerminal/types';

export interface InternalTerminalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: TerminalContext;
}

/**
 * Tracks the lg breakpoint so exactly one presentation of the internal
 * terminal exists at a time — a right-hand dock on desktop, a bottom
 * sheet on smaller screens.
 */
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isDesktop;
};

/**
 * Compact terminal for walkthrough pages.
 *
 * Desktop (lg+): docked panel pinned to the right edge, below the topbar —
 * smaller than the centered modal terminal. Non-modal, so the walkthrough
 * stays readable while commands run; clicking outside or pressing Escape
 * dismisses it.
 *
 * Mobile (<lg): bottom sheet that slides up over a dimmed overlay; tapping
 * the overlay closes it.
 */
export const InternalTerminal: React.FC<InternalTerminalProps> = ({ open, onOpenChange, context }) => {
  const isDesktop = useIsDesktop();

  const handleClose = () => onOpenChange(false);

  const shell = (
    <TerminalShell
      context={context}
      onClose={handleClose}
      showChrome
      noWrap
    />
  );

  return (
    <>{isDesktop ? (
        <RadixDialog.Root open={open} onOpenChange={onOpenChange} modal={false}>
          <RadixDialog.Portal>
            <RadixDialog.Content
              aria-label={"Internal terminal"}
              onKeyDown={(e) => {
                if (e.key === 'Tab') e.stopPropagation();
              }}
              onInteractOutside={(e) => {
                e.preventDefault();
                handleClose();
              }}
              className="fixed z-[150] top-24 md:top-28 bottom-6 right-4 xl:right-6 w-[400px] max-w-[calc(100vw-2rem)] flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-bg-card outline-none
                data-[state=open]:animate-in data-[state=closed]:animate-out
                data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right
                duration-200"
            >
              <RadixDialog.Title className="sr-only">{"Internal terminal"}</RadixDialog.Title>
              <div className="flex-1 min-h-0">{shell}</div>
            </RadixDialog.Content>
          </RadixDialog.Portal>
        </RadixDialog.Root>
      ) : (
        <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
          <RadixDialog.Portal>
            <RadixDialog.Overlay
              className="fixed inset-0 z-[120] lg:hidden bg-black/70
                data-[state=open]:animate-in data-[state=closed]:animate-out
                data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200"
            />
            <RadixDialog.Content
              aria-label={"Internal terminal"}
              onKeyDown={(e) => {
                if (e.key === 'Tab') e.stopPropagation();
              }}
              className="fixed bottom-0 left-0 right-0 z-[130] lg:hidden h-[72svh] max-h-[85svh] flex flex-col overflow-hidden rounded-t-2xl border-t border-border/50 bg-bg-card outline-none
                data-[state=open]:animate-in data-[state=closed]:animate-out
                data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom
                duration-200"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <RadixDialog.Title className="sr-only">{"Internal terminal"}</RadixDialog.Title>
              <div aria-hidden="true" className="flex justify-center pt-2 pb-1 shrink-0">
                <span className="w-10 h-1 rounded-full bg-border" />
              </div>
              <div className="flex-1 min-h-0 overflow-hidden pl-[max(1rem,env(safe-area-inset-left))]">{shell}</div>
            </RadixDialog.Content>
          </RadixDialog.Portal>
        </RadixDialog.Root>
      )}
    </>
  );
};

export default InternalTerminal;
