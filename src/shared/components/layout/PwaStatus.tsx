import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { IconRefresh, IconWifiOff } from '@/shared/components/icons';
import Button from '@/shared/components/ui/Button';
import InstallBanner from './InstallBanner';
import { useOnlineStatus, useServiceWorkerUpdate } from '@/core/hooks/usePWA';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

/**
 * UpdateCard — a new build finished downloading and is waiting.
 *
 * The worker never calls `skipWaiting()` on its own, so the new version only
 * takes over when the student accepts it here.
 */
const UpdateCard: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const { update } = useServiceWorkerUpdate();
  const [reloading, setReloading] = useState(false);

  const handleUpdate = async () => {
    if (reloading) return;
    setReloading(true);
    await update();
  };

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
      transition={prefersReduced ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      role="status"
      aria-live="polite"
      className="pointer-events-auto bg-bg-card border border-accent/40 rounded-2xl p-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
          <IconRefresh size={20} className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-text-primary">{"Update ready"}</p>
          <p className="text-xs text-text-muted mt-0.5">
            {"A new build of QYVORA is installed. Reload to switch to it."}
          </p>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Button size="sm" onClick={handleUpdate} loading={reloading} icon={<IconRefresh size={16} />}>
          {"Reload"}
        </Button>
      </div>
    </motion.div>
  );
};

UpdateCard.displayName = 'PwaUpdateCard';

/** OfflineCard — connectivity strip; hidden entirely while online. */
const OfflineCard: React.FC = () => {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
      transition={prefersReduced ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      role="status"
      aria-live="polite"
      className="pointer-events-auto flex items-center gap-2.5 bg-bg-card border border-border rounded-2xl px-4 py-3"
    >
      <IconWifiOff size={16} className="text-warning shrink-0" />
      <p className="text-xs text-text-secondary">
        <span className="font-black uppercase tracking-widest text-warning mr-2">{"// OFFLINE"}</span>
        {"Cached rooms keep working — progress syncs when you reconnect."}
      </p>
    </motion.div>
  );
};

OfflineCard.displayName = 'PwaOfflineCard';

/**
 * PwaStatus — the single host for every passive PWA notice (update, offline,
 * install), mounted once per shell.
 *
 * Cards share one fixed column so they can never overlap each other. The column
 * is `pointer-events-none` and collapses to zero height when it has no cards,
 * so it never intercepts clicks on the page underneath.
 */
const PwaStatus: React.FC = () => {
  const { updateAvailable } = useServiceWorkerUpdate();
  const online = useOnlineStatus();

  return (
    <div className="pointer-events-none fixed bottom-20 md:bottom-6 inset-x-4 md:inset-x-auto md:right-6 z-[140] flex flex-col items-stretch gap-3 md:w-[22rem] pb-[env(safe-area-inset-bottom,0px)]">
      <AnimatePresence>
        {updateAvailable && <UpdateCard key="update" />}
        {!online && <OfflineCard key="offline" />}
      </AnimatePresence>
      <InstallBanner />
    </div>
  );
};

PwaStatus.displayName = 'PwaStatus';

export default PwaStatus;