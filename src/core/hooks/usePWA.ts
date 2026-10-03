/**
 * usePWA.ts
 *
 * React bindings for the PWA service (`src/core/services/pwa.ts`).
 *
 * The service keeps module-level state (install prompt, pending worker update,
 * connectivity) because those browser objects survive remounts; these hooks
 * mirror that state into components via `useSyncExternalStore`.
 */

import { useCallback, useSyncExternalStore } from 'react';
import {
  applyUpdate,
  getInstallState,
  getUpdateAvailable,
  isOnline,
  promptInstall,
  subscribeToInstallState,
  subscribeToOnlineState,
  subscribeToUpdateState,
  type InstallOutcome,
  type InstallState,
} from '../services/pwa';

/**
 * Install prompt state for the current page.
 *
 * `canPrompt` is only true when the browser actually offered a prompt, so the
 * UI can stay silent on desktop browsers that never fire the event while still
 * showing manual instructions to iOS Safari users.
 */
export function useInstallPrompt() {
  const state = useSyncExternalStore(subscribeToInstallState, getInstallState, getInstallState);

  const install = useCallback(async (): Promise<InstallOutcome> => {
    return promptInstall();
  }, []);

  return { ...state, install } satisfies InstallState & { install: () => Promise<InstallOutcome> };
}

/** True when a new build is installed and waiting to take over. */
export function useServiceWorkerUpdate() {
  const updateAvailable = useSyncExternalStore(
    subscribeToUpdateState,
    getUpdateAvailable,
    getUpdateAvailable
  );

  const update = useCallback(async () => {
    await applyUpdate();
  }, []);

  return { updateAvailable, update };
}

/** Browser connectivity — drives the offline indicator. */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribeToOnlineState, isOnline, () => true);
}