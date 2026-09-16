import { useState, useEffect, useCallback, useRef } from 'react';

const SHOW_EVENT = 'qyvora:popup-show';
const DISMISS_EVENT = 'qyvora:popup-dismiss';

interface PopupEntry {
  id: string;
  priority: number;
}

let activePopupId: string | null = null;
let activePriority = Infinity;
const pendingPopups: PopupEntry[] = [];

let lastFocusedElement: HTMLElement | null = null;

function restoreFocus() {
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function' && lastFocusedElement.isConnected) {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
}

function notifyShow() {
  window.dispatchEvent(new CustomEvent(SHOW_EVENT));
}

function notifyDismiss() {
  window.dispatchEvent(new CustomEvent(DISMISS_EVENT));
}

function tryActivateNext() {
  if (activePopupId || pendingPopups.length === 0) return;
  pendingPopups.sort((a, b) => a.priority - b.priority);
  const next = pendingPopups.shift()!;
  activePopupId = next.id;
  activePriority = next.priority;
  if (document.activeElement instanceof HTMLElement) {
    lastFocusedElement = document.activeElement;
  }
  notifyShow();
}

function dismissCurrentPopup() {
  activePopupId = null;
  activePriority = Infinity;
  notifyDismiss();
  restoreFocus();
  tryActivateNext();
}

/**
 * Hook that coordinates auto-triggered floating panels so only one is visible
 * at a time. Panels are shown in priority order (lower number = higher priority).
 *
 * Usage:
 *   const { isVisible, onDismiss } = usePopupManager('consent-banner', 1);
 *
 * The optional third argument disables auto-triggering entirely (e.g. for
 * panels that should only appear on first visit — pass the persisted "already
 * seen" flag here). Disabled popups never register with the shared queue and
 * are never activated; a previously-activated popup releases its slot when
 * `enabled` flips to false.
 *
 * Call `onDismiss()` when the user dismisses the panel. The next queued panel
 * will automatically appear.
 *
 * Hardening behaviour:
 * - Only one popup is ever active at a time (priorities; lower = higher).
 * - When a popup activates, the previously focused element is remembered and
 *   restored when the popup dismisses (keyboard place).
 * - While a popup is active, pressing Escape dismisses it (the same single
 *   active slot guard means at most one popup reacts to a keypress).
 */
export function usePopupManager(id: string, priority: number, enabled = true) {
  const [isVisible, setIsVisible] = useState(false);
  const priorityRef = useRef(priority);
  priorityRef.current = priority;
  const onDismissRef = useRef<() => void>(() => {});
  onDismissRef.current = () => {
    if (activePopupId === id) {
      setIsVisible(false);
      dismissCurrentPopup();
    }
  };

  useEffect(() => {
    // A disabled popup must not claim a slot in the shared queue and must not
    // activate. Bypassing registration entirely keeps the queue clean for the
    // popups that are actually eligible to show.
    if (!enabled) return;

    const handleShow = () => {
      if (activePopupId === id) setIsVisible(true);
    };
    const handleDismiss = () => {
      if (activePopupId !== id) setIsVisible(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePopupId === id) {
        e.preventDefault();
        onDismissRef.current();
      }
    };

    window.addEventListener(SHOW_EVENT, handleShow);
    window.addEventListener(DISMISS_EVENT, handleDismiss);
    document.addEventListener('keydown', handleKeyDown);

    pendingPopups.push({ id, priority: priorityRef.current });

    // A newly registered popup with a strictly higher priority must preempt
    // the popup currently holding the slot. Without this, whichever popup
    // happens to register FIRST keeps the slot and low-priority globals (e.g.
    // the community popup mounted at the router level) starve the guided tour
    // even though the tour declares a lower (higher-priority) number.
    if (activePopupId && priorityRef.current < activePriority) {
      dismissCurrentPopup();
    } else {
      tryActivateNext();
    }

    return () => {
      // Release the slot BEFORE detaching the event listeners so the
      // notifyDismiss/notifyShow events reach the still-attached handlers —
      // the disabled popup hides itself and the next queued popup appears.
      // Removing listeners first would leave the disabled popup stuck visible.
      const idx = pendingPopups.findIndex((p) => p.id === id);
      if (idx !== -1) pendingPopups.splice(idx, 1);
      if (activePopupId === id) dismissCurrentPopup();

      window.removeEventListener(SHOW_EVENT, handleShow);
      window.removeEventListener(DISMISS_EVENT, handleDismiss);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [id, enabled]);

  const onDismiss = useCallback(() => {
    if (activePopupId === id) {
      setIsVisible(false);
      dismissCurrentPopup();
    }
  }, [id]);

  return { isVisible, onDismiss };
}
