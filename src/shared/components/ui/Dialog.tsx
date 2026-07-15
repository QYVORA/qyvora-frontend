/**
 * Dialog — accessible modal built on Radix UI Dialog primitive.
 *
 * Handles focus trapping, Escape key, scroll lock, and ARIA automatically.
 * Styled to match the qyvora design system (bg-bg-card, border-border, accent).
 *
 * Usage:
 *   <Dialog open={open} onOpenChange={setOpen}>
 *     <DialogContent title="Edit Profile">
 *       ...your form...
 *     </DialogContent>
 *   </Dialog>
 *
 * Or with a trigger:
 *   <Dialog>
 *     <DialogTrigger asChild>
 *       <button className="btn-primary">Open</button>
 *     </DialogTrigger>
 *     <DialogContent title="Confirm">...</DialogContent>
 *   </Dialog>
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import * as RadixDialog from '@radix-ui/react-dialog';
import { IconX } from '../icons';
import { cn } from '../../utils/cn';

// ── Re-export primitives you might need directly ─────────────────────────────
export const Dialog        = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose   = RadixDialog.Close;

// ── Overlay ───────────────────────────────────────────────────────────────────
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Overlay>
>(({ className, ...props }, ref) => (
  <RadixDialog.Overlay
    ref={ref}
    className={cn(
      // Base
      'fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm',
      // Radix data-state animations
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = 'DialogOverlay';

// ── Content ───────────────────────────────────────────────────────────────────
interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixDialog.Content> {
  /** Rendered as the visible heading and the accessible aria-label */
  title: string;
  /** Optional description shown below the title */
  description?: string;
  /** Hide the default close button */
  hideClose?: boolean;
  /** Max width class — defaults to max-w-md */
  maxWidth?: string;
}

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Content>,
  DialogContentProps
>(({ className, title, description, hideClose, maxWidth = 'max-w-xl', children, ...props }, ref) => {
  const { t } = useTranslation();
  return (
  <RadixDialog.Portal>
    <DialogOverlay />
    <RadixDialog.Content
      ref={ref}
      aria-describedby="dialog-description"
      className={cn(
        // Position
        'fixed left-1/2 top-1/2 z-[201] -translate-x-1/2 -translate-y-1/2',
        // Size
        'w-[calc(100vw-1rem)] sm:w-full',
        'max-h-[calc(100svh-2rem)] flex flex-col',
        
        // Dynamic Max Widths
        maxWidth === 'max-w-sm' && 'max-w-sm',
        maxWidth === 'max-w-md' && 'max-w-md',
        maxWidth === 'max-w-lg' && 'max-w-lg',
        maxWidth === 'max-w-xl' && 'max-w-xl',
        maxWidth === 'max-w-2xl' && 'max-w-2xl',
        maxWidth === 'max-w-3xl' && 'max-w-3xl',
        maxWidth === 'max-w-4xl' && 'max-w-4xl',
        maxWidth === 'max-w-5xl' && 'max-w-5xl',
        maxWidth === 'max-w-6xl' && 'max-w-6xl',
        maxWidth === 'max-w-7xl' && 'max-w-7xl',
        !maxWidth.startsWith('max-w-') && maxWidth,

        // Surface — matches card-qyvora
        'terminal-card bg-bg-card border border-border rounded-2xl overflow-hidden',
        // Radix data-state animations
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
        'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
        'duration-200',
        className,
      )}
      {...props}
    >
      {/* Header — Fixed at top */}
      <div className="flex-none flex items-center justify-between px-5 py-4 border-b border-border bg-bg-card/50 backdrop-blur-md z-10">
        <RadixDialog.Title className="text-xs sm:text-sm font-black text-text-primary uppercase tracking-widest">
          {title}
        </RadixDialog.Title>
        {!hideClose && (
          <RadixDialog.Close
            className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent-dim/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            aria-label={t('components.dialog.close')}
          >
            <IconX size={16} />
          </RadixDialog.Close>
        )}
      </div>

      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain scroll-hover">
        {/* Description — always render for aria-describedby; visually hidden when empty */}
        <p id="dialog-description" className={cn(
          'px-5 sm:px-8 pt-5 text-sm text-text-muted',
          !description && 'sr-only'
        )}>
          {description || title}
        </p>

        {/* Body */}
        <div className="p-5 sm:p-8">{children}</div>
      </div>
    </RadixDialog.Content>
  </RadixDialog.Portal>
  );
});
DialogContent.displayName = 'DialogContent';

// ── Confirm dialog — convenience wrapper for destructive confirmations ────────
interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {
  const { t } = useTranslation();
  const {
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = t('components.dialog.confirm'),
    cancelLabel = t('components.dialog.cancel'),
    destructive = false,
    onConfirm,
  } = props;
  return (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent title={title} maxWidth="max-w-lg">
      <p className="text-sm text-text-secondary mb-6 -mt-1">{description}</p>
      <div className="flex gap-3">
        <DialogClose asChild>
          <button className="flex-1 btn-secondary !py-2.5 !rounded-2xl text-xs">
            {cancelLabel}
          </button>
        </DialogClose>
        <button
          onClick={() => { onConfirm(); onOpenChange(false); }}
          className={cn(
            'flex-1 !py-2.5 !rounded-2xl text-xs font-bold uppercase tracking-wide transition-all',
            destructive
              ? 'bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500/20'
              : 'btn-primary',
          )}
        >
          {confirmLabel}
        </button>
      </div>
    </DialogContent>
  </Dialog>
  );
};
