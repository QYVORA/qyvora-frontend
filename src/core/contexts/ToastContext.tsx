/**
 * ToastContext.tsx
 *
 * Provides an application-wide notification ("toast") system via React Context.
 * Any component can call `addToast()` to push a temporary message into the UI
 * without needing to manage its own state or pass props down the tree.
 *
 * Toasts auto-dismiss after a consistent 5 seconds and can also be manually
 * closed. Animations are handled by Framer Motion's AnimatePresence.
 *
 * Usage: wrap the app root with <ToastProvider> and call addToast() from
 * any descendant via the `useToast()` hook.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Info, TriangleAlert } from 'lucide-react';
import { IconShield, IconCheck, IconX } from '@/shared/components/icons';

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info' | 'warning';

const TOAST_DURATION_MS = 5000;

/**
 * A single notification entry.
 * `id` is generated internally and is not exposed to callers — they only
 * provide `message` and `type`.
 */
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

/** Public API exposed to consumers via useToast(). */
interface ToastContextType {
  /**
   * Push a new notification into the toast stack.
   * @param message - Human-readable message to display.
   * @param type    - Visual severity: 'success' | 'error' | 'info' | 'warning'
   */
  addToast: (message: string, type: ToastType) => void;
  /** Remove every visible toast immediately. Useful across auth transitions. */
  clearToasts: () => void;
}

const TOAST_META: Record<
  ToastType,
  { icon: React.ReactNode; iconClassName: string; barClassName: string }
> = {
  success: {
    icon: <IconCheck size={18} aria-hidden="true" />,
    iconClassName: 'border-semantic-success/25 bg-semantic-success/10 text-semantic-success',
    barClassName: 'bg-semantic-success',
  },
  error: {
    icon: <IconShield size={18} aria-hidden="true" />,
    iconClassName: 'border-semantic-danger/25 bg-semantic-danger/10 text-semantic-danger',
    barClassName: 'bg-semantic-danger',
  },
  warning: {
    icon: <TriangleAlert size={18} aria-hidden="true" />,
    iconClassName: 'border-semantic-warning/25 bg-semantic-warning/10 text-semantic-warning',
    barClassName: 'bg-semantic-warning',
  },
  info: {
    icon: <Info size={18} aria-hidden="true" />,
    iconClassName: 'border-semantic-info/25 bg-semantic-info/10 text-semantic-info',
    barClassName: 'bg-semantic-info',
  },
};

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
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const prefersReducedMotion = useReducedMotion();

  const clearTimer = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const removeToast = useCallback(
    (id: string) => {
      clearTimer(id);
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    },
    [clearTimer],
  );

  const clearToasts = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    setToasts([]);
  }, []);

  /**
   * Adds a new toast to the stack and schedules its automatic removal.
   *
   * ID generation uses Math.random() base-36 sliced to 9 characters.
   * This is sufficient for a short-lived UI list — cryptographic uniqueness
   * is not required here since IDs are never persisted or used for security.
   *
   * All toast types use the same duration so auth and product feedback behave
   * predictably. Timers are tracked and cleared on manual dismiss/unmount so a
   * stale logout notice cannot outlive its route or fire on a later screen.
   */
  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).slice(2, 11);
    setToasts((prev) => [...prev, { id, message, type }]);

    const timer = setTimeout(() => {
      timersRef.current.delete(id);
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, TOAST_DURATION_MS);

    timersRef.current.set(id, timer);
  }, []);

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    },
    [],
  );

  const contextValue = useMemo(
    () => ({ addToast, clearToasts }),
    [addToast, clearToasts],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/*
        ── Toast container ────────────────────────────────────────────────────
        Fixed top-right so notifications stay clear of the mobile bottom nav and
        never shift page layout. Width is capped on desktop and edge-safe on
        mobile. aria-live="polite" queues announcements after current speech;
        aria-atomic="true" re-reads the region as a unit.

        pointer-events-none on the wrapper prevents the container from blocking
        content beneath it; pointer-events-auto is restored per toast.
      */}
      <div
        className="pointer-events-none fixed top-20 right-4 z-[500] flex w-[calc(100vw-2rem)] max-w-md flex-col gap-2.5 md:top-24 md:right-6"
        aria-live="polite"
        aria-atomic="true"
      >
        {/*
          AnimatePresence tracks toast mount/unmount and runs the exit animation
          before removing the element from the DOM.
        */}
        <AnimatePresence>
          {toasts.map((toast) => {
            const meta = TOAST_META[toast.type];

            return (
              <motion.div
                key={toast.id}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -8, scale: 0.98 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -6, scale: 0.98 }
                }
                transition={{
                  duration: prefersReducedMotion ? 0.12 : 0.22,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border border-border-subtle bg-surface-raised p-4 shadow-[var(--elevation-raised)]"
                role={toast.type === 'error' ? 'alert' : 'status'}
              >
                <span
                  className={`absolute inset-y-0 left-0 w-1 ${meta.barClassName}`}
                  aria-hidden="true"
                />

                <div
                  className={`mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg border ${meta.iconClassName}`}
                >
                  {meta.icon}
                </div>

                <p className="min-w-0 flex-1 pt-0.5 font-sans text-sm font-medium leading-snug text-text-primary">
                  {toast.message}
                </p>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="-m-1 flex h-8 w-8 flex-none items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-surface hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label="Dismiss notification"
                >
                  <IconX size={16} aria-hidden="true" />
                </button>
              </motion.div>
            );
          })}
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