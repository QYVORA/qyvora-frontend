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
  notifyShow();
}

function dismissCurrentPopup() {
  activePopupId = null;
  activePriority = Infinity;
  notifyDismiss();
  tryActivateNext();
}

/**
 * Hook that coordinates auto-triggered floating panels so only one is visible
 * at a time. Panels are shown in priority order (lower number = higher priority).
 *
 * Usage:
 *   const { isVisible, onDismiss } = usePopupManager('consent-banner', 1);
 *
 * Call `onDismiss()` when the user dismisses the panel. The next queued panel
 * will automatically appear.
 */
export function usePopupManager(id: string, priority: number) {
  const [isVisible, setIsVisible] = useState(false);
  const priorityRef = useRef(priority);
  priorityRef.current = priority;

  useEffect(() => {
    const handleShow = () => {
      if (activePopupId === id) setIsVisible(true);
    };
    const handleDismiss = () => {
      if (activePopupId !== id) setIsVisible(false);
    };

    window.addEventListener(SHOW_EVENT, handleShow);
    window.addEventListener(DISMISS_EVENT, handleDismiss);

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
      window.removeEventListener(SHOW_EVENT, handleShow);
      window.removeEventListener(DISMISS_EVENT, handleDismiss);

      const idx = pendingPopups.findIndex((p) => p.id === id);
      if (idx !== -1) pendingPopups.splice(idx, 1);
      if (activePopupId === id) dismissCurrentPopup();
    };
  }, [id]);

  const onDismiss = useCallback(() => {
    setIsVisible(false);
    if (activePopupId === id) dismissCurrentPopup();
  }, [id]);

  return { isVisible, onDismiss };
}
