import { useState, useEffect, useCallback, useRef } from 'react';

const SHOW_EVENT = 'qyvora:popup-show';
const DISMISS_EVENT = 'qyvora:popup-dismiss';

interface PopupEntry {
  id: string;
  priority: number;
}

let activePopupId: string | null = null;
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
  notifyShow();
}

function dismissCurrentPopup() {
  activePopupId = null;
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
  const registered = useRef(false);
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

    if (!registered.current) {
      registered.current = true;
      pendingPopups.push({ id, priority: priorityRef.current });
      tryActivateNext();
    }

    return () => {
      window.removeEventListener(SHOW_EVENT, handleShow);
      window.removeEventListener(DISMISS_EVENT, handleDismiss);
    };
  }, [id]);

  const onDismiss = useCallback(() => {
    setIsVisible(false);
    if (activePopupId === id) dismissCurrentPopup();
  }, [id]);

  return { isVisible, onDismiss };
}
