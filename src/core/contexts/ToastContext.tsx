/**
 * ToastContext.tsx
 *
 * Provides an application-wide notification ("toast") system via React Context.
 * Any component can call `addToast()` to push a temporary message into the UI
 * without needing to manage its own state or pass props down the tree.
 *
 * Toasts auto-dismiss after 5 seconds and can also be manually closed.
 * Animations are handled by Framer Motion's AnimatePresence.
 *
 * Usage: wrap the app root with <ToastProvider> and call addToast() from
 * any descendant via the `useToast()` hook.
 */

import React, { createContext, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ShieldAlert, CheckCircle, Info, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * A single notification entry.
 * `id` is generated internally and is not exposed to callers — they only
 * provide `message` and `type`.
 */
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

/** Public API exposed to consumers via useToast(). */
interface ToastContextType {
  /**
   * Push a new notification into the toast stack.
   * @param message - Human-readable message to display.
   * @param type    - Visual severity: 'success' | 'error' | 'info'
   */
  addToast: (message: string, type: Toast['type']) => void;
}

// ─── Context creation ─────────────────────────────────────────────────────────

/**
 * Raw React context. Components should not consume this directly —
 * use the `useToast()` hook below.
 */
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * ToastProvider — owns the list of active toasts and renders them as an
 * absolutely-positioned overlay stack. Place this near the root of the app
 * so the toast container sits above all other content in the z-index stack.
 *
 * The toast container is rendered inside the provider itself (not via a portal)
 * which keeps the implementation simple. The z-[100] class ensures toasts
 * appear above modals and drawers.
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // `toasts` holds all currently visible notifications.
  // Each entry is removed either after 5 s or when the user clicks X.
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Adds a new toast to the stack and schedules its automatic removal.
   *
   * ID generation uses Math.random() base-36 sliced to 9 characters.
   * This is sufficient for a short-lived UI list — cryptographic uniqueness
   * is not required here since IDs are never persisted or used for security.
   *
   * The timeout captures the `id` constant so it removes only its own toast,
   * even if other toasts have been added or removed in the meantime.
   */
  const addToast = (message: string, type: Toast['type']) => {
    const id = Math.random().toString(36).substr(2, 9);

    // Append the new toast to the end of the list (newest at the bottom).
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 5 seconds. The functional form of setToasts ensures
    // we filter against the current list, not a stale snapshot.
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/*
        ── Toast container ────────────────────────────────────────────────────
        Positioned fixed so it is always visible regardless of scroll position.

        Layout:
        • Mobile: sits above the bottom navigation bar (bottom-[88px]),
          spans full width with horizontal padding.
        • Desktop (md+): anchored to the bottom-right corner, fixed width.

        aria-live="polite" tells screen readers to announce new toasts after
        the current speech finishes — appropriate for non-critical notifications.
        aria-atomic="true" means the whole region is re-read as a unit when
        updated, preventing partial announcements.

        pointer-events-none on the wrapper prevents the invisible container
        from blocking clicks on content beneath it; pointer-events-auto is
        restored on each individual toast so they remain interactive.
      */}
      <div
        className="fixed top-20 right-4 md:top-24 md:right-8 z-[500] flex flex-col gap-3 pointer-events-none w-[calc(100vw-2rem)] sm:max-w-md md:w-[27rem]"
        aria-live="polite"
        aria-atomic="true"
      >
        {/*
          AnimatePresence tracks toast mount/unmount and runs the exit animation
          before actually removing the element from the DOM. Without it, React
          would remove the element instantly and no exit animation would play.
        */}
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              // Enter: fade in, slide up slightly, scale from 95% to 100%
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              // Exit: fade out, slide down slightly, scale back to 95%
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto px-5 py-4 rounded-2xl bg-bg-card border shadow-2xl flex items-start gap-3.5 w-full ${
                // Border colour changes to reflect severity at a glance
                toast.type === 'success'
                  ? 'border-accent/40'
                  : toast.type === 'error'
                  ? 'border-red-500/40'
                  : 'border-blue-500/40'
              }`}
              // role="status" makes the element a live region for AT,
              // complementing the parent's aria-live="polite".
              role="status"
            >
              {/*
                ── Severity icon ─────────────────────────────────────────────
                Icon colour mirrors the border colour for visual consistency.
                flex-none prevents the icon from shrinking on long messages.
              */}
              <div
                className={`flex-none mt-0.5 ${
                  toast.type === 'success'
                    ? 'text-accent'
                    : toast.type === 'error'
                    ? 'text-red-400'
                    : 'text-blue-400'
                }`}
              >
                {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                {toast.type === 'error' && <ShieldAlert className="w-5 h-5" />}
                {toast.type === 'info' && <Info className="w-5 h-5" />}
              </div>

              {/*
                ── Message text ───────────────────────────────────────────────
                flex-1 allows the text to fill the remaining space between the
                icon and the dismiss button. leading-snug tightens multi-line
                messages without making single-line ones feel cramped.
              */}
              <p className="text-base text-text-primary flex-1 leading-snug">
                {toast.message}
              </p>

              {/*
                ── Dismiss button ─────────────────────────────────────────────
                Manually removes this specific toast by filtering it out of state.
                aria-label="Dismiss" gives screen-reader users a meaningful label
                since the button contains only an icon.
              */}
              <button
                onClick={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
                className="flex-none text-text-muted hover:text-text-primary transition-colors mt-0.5"
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useToast — access the addToast action from any component inside ToastProvider.
 *
 * Throws a descriptive error if called outside the provider tree so
 * misconfigured component trees fail loudly during development.
 *
 * @example
 *   const { addToast } = useToast();
 *   addToast('Saved successfully', 'success');
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};