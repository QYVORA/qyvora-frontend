/**
 * Dialog — accessible modal built on Radix UI Dialog primitive.
 *
 * Handles focus trapping, Escape key, scroll lock, and ARIA automatically.
 * Styled to match the hsociety design system (bg-bg-card, border-border, accent).
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
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
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
>(({ className, title, description, hideClose, maxWidth = 'max-w-md', children, ...props }, ref) => (
  <RadixDialog.Portal>
    <DialogOverlay />
    <RadixDialog.Content
      ref={ref}
      aria-describedby={description ? 'dialog-description' : undefined}
      className={cn(
        // Position
        'fixed left-1/2 top-1/2 z-[201] -translate-x-1/2 -translate-y-1/2',
        // Size
        'w-[calc(100vw-2rem)] sm:w-full',
        maxWidth,
        // Surface — matches card-hsociety
        'bg-bg-card border border-border rounded-xl shadow-2xl overflow-hidden',
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
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <RadixDialog.Title className="text-sm font-black text-text-primary uppercase tracking-widest">
          {title}
        </RadixDialog.Title>
        {!hideClose && (
          <RadixDialog.Close
            className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent-dim/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </RadixDialog.Close>
        )}
      </div>

      {/* Optional description */}
      {description && (
        <p id="dialog-description" className="px-6 pt-4 text-sm text-text-muted">
          {description}
        </p>
      )}

      {/* Body */}
      <div className="p-6">{children}</div>
    </RadixDialog.Content>
  </RadixDialog.Portal>
));
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

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent title={title} maxWidth="max-w-sm">
      <p className="text-sm text-text-secondary mb-6 -mt-1">{description}</p>
      <div className="flex gap-3">
        <DialogClose asChild>
          <button className="flex-1 btn-secondary !py-2.5 text-xs">
            {cancelLabel}
          </button>
        </DialogClose>
        <button
          onClick={() => { onConfirm(); onOpenChange(false); }}
          className={cn(
            'flex-1 !py-2.5 text-xs font-bold uppercase tracking-wide rounded-md transition-all',
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
