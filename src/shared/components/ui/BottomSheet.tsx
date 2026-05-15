import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { cn } from '../../utils/cn';

interface BottomSheetContentProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Content> {
  ariaLabel: string;
}

export const BottomSheet: React.FC<React.ComponentPropsWithoutRef<typeof RadixDialog.Root>> = ({
  children,
  ...props
}) => <RadixDialog.Root {...props}>{children}</RadixDialog.Root>;

export const BottomSheetContent = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Content>,
  BottomSheetContentProps
>(({ className, ariaLabel, children, ...props }, ref) => (
  <RadixDialog.Portal>
    <RadixDialog.Overlay
      className={cn(
        'fixed inset-0 z-[120] md:hidden bg-black/70',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      )}
    />
    <RadixDialog.Content
      ref={ref}
      aria-label={ariaLabel}
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[130] md:hidden',
        'terminal-card bg-bg-card border-t border-border rounded-t-2xl max-h-[82svh] overflow-y-auto',
        'outline-none',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        'duration-200',
        className,
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      {...props}
    >
      {children}
    </RadixDialog.Content>
  </RadixDialog.Portal>
));
BottomSheetContent.displayName = 'BottomSheetContent';

export const BottomSheetClose = RadixDialog.Close;
