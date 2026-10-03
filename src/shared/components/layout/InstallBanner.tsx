import React, { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { IconDownload, IconShare, IconX } from '@/shared/components/icons';
import { useInstallPrompt } from '@/core/hooks/usePWA';
import { usePopupManager } from '@/core/hooks/usePopupManager';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import Button from '@/shared/components/ui/Button';

const DISMISS_KEY = 'qyvora_install_dismissed';

/**
 * InstallBanner — offers the PWA install prompt.
 *
 * Three states, driven entirely by what the browser actually supports:
 *  - Chromium/Edge/Android: `canPrompt` is true → a real Install button.
 *  - iOS Safari: never fires `beforeinstallprompt` → share-sheet instructions.
 *  - Already installed / no prompt available: renders nothing.
 *
 * Queued through `usePopupManager('install', 5)` so it never competes with the
 * consent banner or the onboarding tour.
 */
const InstallBanner: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const { canPrompt, isStandalone, isIos, install } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [installing, setInstalling] = useState(false);

  // iOS users are told how to install; everyone else needs the browser prompt.
  const eligible = !isStandalone && !dismissed && (canPrompt || isIos);
  const { isVisible: managerVisible, onDismiss: managerDismiss } = usePopupManager(
    'install',
    5,
    eligible
  );

  const handleDismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* storage unavailable */
    }
    setDismissed(true);
    managerDismiss();
  }, [managerDismiss]);

  const handleInstall = useCallback(async () => {
    if (installing) return;
    setInstalling(true);
    const outcome = await install();
    setInstalling(false);
    if (outcome === 'accepted') handleDismiss();
  }, [handleDismiss, install, installing]);

  return (
    <AnimatePresence>
      {eligible && managerVisible && (
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 30 }}
          transition={prefersReduced ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          aria-live="polite"
          className="pointer-events-auto"
        >
          <div className="bg-bg-card border border-border rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <IconDownload size={20} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-primary">{"Install QYVORA"}</p>
                <p className="text-xs text-text-muted mt-0.5">
                  {canPrompt
                    ? "Run the labs offline, straight from your home screen."
                    : "Tap share, then add QYVORA to your home screen."}
                </p>
                {isIos && !canPrompt && (
                  <p className="text-xs text-text-muted mt-2 inline-flex items-center gap-1.5">
                    <IconShare size={14} className="text-accent shrink-0" />
                    {"Share"}
                    <span aria-hidden="true">{"→"}</span>
                    {"Add to Home Screen"}
                  </p>
                )}
              </div>
              <button
                onClick={handleDismiss}
                className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-[background-color,color] duration-[var(--dur-fast)] ease-[var(--ease-smooth)] min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={"Dismiss install prompt"}
              >
                <IconX size={16} />
              </button>
            </div>
            {canPrompt && (
              <div className="mt-3 flex justify-end">
                <Button size="sm" onClick={handleInstall} loading={installing} icon={<IconDownload size={16} />}>
                  {"Install"}
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

InstallBanner.displayName = 'InstallBanner';

export default InstallBanner;