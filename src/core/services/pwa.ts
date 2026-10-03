/**
 * pwa.ts
 *
 * Owns every browser-level PWA concern: service worker registration and the
 * update lifecycle, the install prompt, online/offline status and Web Push.
 *
 * This is a framework-free singleton on purpose. The browser APIs it drives are
 * global and outlive React's mount/unmount cycle, so registration happens once
 * per page (from the app entry) while the UI layer subscribes through the hooks
 * in `src/core/hooks/usePWA.ts`.
 *
 * See `docs/PWA.md` for the caching model and `public/sw.js` for the worker.
 */

import api from './api';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Minimal shape of the non-standard `BeforeInstallPromptEvent`. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export type InstallOutcome = 'accepted' | 'dismissed' | 'unavailable';

export interface InstallState {
  /** The browser offered an install prompt and it has not been used yet. */
  canPrompt: boolean;
  /** Running from the home screen / installed window. */
  isStandalone: boolean;
  /** iOS Safari never fires `beforeinstallprompt` — instructions are needed. */
  isIos: boolean;
}

type Listener<T> = (value: T) => void;

// ─── Install state ────────────────────────────────────────────────────────────

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installState: InstallState = { canPrompt: false, isStandalone: false, isIos: false };
const installListeners = new Set<Listener<InstallState>>();

let updateAvailable = false;
const updateListeners = new Set<Listener<boolean>>();

let initialized = false;
let registrationPromise: Promise<ServiceWorkerRegistration | null> | null = null;
let reloading = false;
let lastUpdateCheck = 0;

/** Re-check the worker at most this often when a tab regains focus. */
const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;

/**
 * Registration is skipped in dev by default: a worker caching Vite's dev module
 * graph breaks HMR. Set `VITE_ENABLE_SW_IN_DEV=true` to exercise the install
 * and offline flows locally.
 */
const SW_ENABLED =
  import.meta.env.PROD || String(import.meta.env.VITE_ENABLE_SW_IN_DEV) === 'true';

// ─── Lifecycle ────────────────────────────────────────────────────────────────

/**
 * Registers the service worker and wires the install/update listeners.
 *
 * Safe to call from more than one place (app entry and a shell): the browser
 * registration is memoised and the listeners attach exactly once.
 */
export function initPWA(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  if (initialized) return;
  initialized = true;

  installState = { ...installState, isStandalone: isStandalone(), isIos: isIosSafari() };

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    setInstallState({ ...installState, canPrompt: true });
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    setInstallState({ ...installState, canPrompt: false, isStandalone: true });
  });

  // A worker can take control without a reload (first install claims clients).
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) {
      reloading = false;
      window.location.reload();
      return;
    }
    setInstallState({ ...installState });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    if (Date.now() - lastUpdateCheck < UPDATE_CHECK_INTERVAL_MS) return;
    lastUpdateCheck = Date.now();
    void getRegistration()?.then((registration) => registration?.update());
  });

  registrationPromise = registerWorker();
}

async function registerWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!SW_ENABLED) return null;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

    // A worker already finished installing while we were busy (e.g. a second tab
    // triggered the update) — announce it immediately.
    if (registration.waiting && navigator.serviceWorker.controller) {
      setUpdateAvailable(true);
    }

    registration.addEventListener('updatefound', () => {
      const installing = registration.installing;
      if (!installing) return;
      installing.addEventListener('statechange', () => {
        // `controller` is truthy only when this is an *update*, not the first install.
        if (installing.state === 'installed' && navigator.serviceWorker.controller) {
          setUpdateAvailable(true);
        }
      });
    });

    return registration;
  } catch {
    // Registration can fail in private windows or when the script is blocked.
    // The app must keep working without a worker.
    return null;
  }
}

/** Memoised worker registration (resolves to `null` when unsupported). */
export function getRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!registrationPromise) initPWA();
  return registrationPromise ?? Promise.resolve(null);
}

// ─── Install ──────────────────────────────────────────────────────────────────

/** True when the app runs in an installed window (standalone display mode). */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches === true ||
    window.matchMedia?.('(display-mode: window-controls-overlay)').matches === true ||
    iosStandalone === true
  );
}

/** iOS Safari exposes no install prompt — the UI has to instruct the user. */
export function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua);
  // iPadOS 13+ reports as Mac; touch points give it away.
  const iPadOS = /Macintosh/.test(ua) && (navigator.maxTouchPoints ?? 0) > 1;
  return (iOS || iPadOS) && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

export function getInstallState(): InstallState {
  if (!initialized) initPWA();
  return installState;
}

export function subscribeToInstallState(listener: Listener<InstallState>): () => void {
  installListeners.add(listener);
  return () => installListeners.delete(listener);
}

function setInstallState(next: InstallState) {
  installState = next;
  installListeners.forEach((listener) => listener(next));
}

/**
 * Shows the browser install prompt.
 *
 * Returns `'unavailable'` when the browser has no prompt to offer (already
 * installed, iOS, or the prompt was consumed) so callers can fall back to
 * instructions instead of failing silently.
 */
export async function promptInstall(): Promise<InstallOutcome> {
  if (!deferredPrompt) return 'unavailable';

  const prompt = deferredPrompt;
  deferredPrompt = null;

  try {
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    setInstallState({ ...installState, canPrompt: false });
    if (outcome === 'accepted') {
      // Keep the offline shell alive across evictions where the browser allows it.
      const persist = navigator.storage?.persist?.();
      if (persist) void persist.catch(() => false);
      setInstallState({ ...installState, isStandalone: true });
    }
    return outcome;
  } catch {
    setInstallState({ ...installState, canPrompt: false });
    return 'dismissed';
  }
}

// ─── Updates ──────────────────────────────────────────────────────────────────

export function getUpdateAvailable(): boolean {
  return updateAvailable;
}

export function subscribeToUpdateState(listener: Listener<boolean>): () => void {
  updateListeners.add(listener);
  return () => updateListeners.delete(listener);
}

function setUpdateAvailable(next: boolean) {
  updateAvailable = next;
  updateListeners.forEach((listener) => listener(next));
}

/**
 * Activates the waiting worker and reloads once it has taken control.
 *
 * The worker never calls `skipWaiting()` on its own, so a new build only lands
 * when the user accepts the update.
 */
export async function applyUpdate(): Promise<void> {
  const registration = await getRegistration();
  const waiting = registration?.waiting;
  if (!waiting) {
    window.location.reload();
    return;
  }

  reloading = true;
  waiting.postMessage({ type: 'SKIP_WAITING' });

  // Belt and braces: if `controllerchange` never fires, reload anyway.
  window.setTimeout(() => {
    if (reloading) {
      reloading = false;
      window.location.reload();
    }
  }, 1000);
}

// ─── Connectivity ─────────────────────────────────────────────────────────────

export function isOnline(): boolean {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine !== false;
}

/** Subscribes to connectivity changes; returns an unsubscribe function. */
export function subscribeToOnlineState(listener: Listener<boolean>): () => void {
  const online = () => listener(true);
  const offline = () => listener(false);
  window.addEventListener('online', online);
  window.addEventListener('offline', offline);
  return () => {
    window.removeEventListener('online', online);
    window.removeEventListener('offline', offline);
  };
}

// ─── Web Push ─────────────────────────────────────────────────────────────────

/**
 * Subscribes to push using the backend VAPID key.
 *
 * Best-effort: every failure is swallowed so notifications never break the page.
 */
export async function tryAutoSubscribePush(): Promise<void> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
  if (!('Notification' in window)) return;
  if (Notification.permission === 'denied') return;

  let permission: NotificationPermission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }
  if (permission !== 'granted') return;

  try {
    const { data } = await api.get<{ publicKey: string }>('/push/vapid-public-key');
    if (!data?.publicKey) return;

    const registration = await navigator.serviceWorker.ready;
    const existingSub = await registration.pushManager.getSubscription();
    if (existingSub) {
      if (existingSub.toJSON().endpoint) return;
      await existingSub.unsubscribe();
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(data.publicKey),
    });

    await api.post('/push/subscribe', subscription.toJSON());
  } catch {
    /* silent fail — push is best-effort */
  }
}

export async function subscribeToPush(publicKey: string): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  } catch {
    return null;
  }
}

export async function getPushSubscription(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator)) return null;
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}

export async function unsubscribeFromPush(): Promise<boolean> {
  const subscription = await getPushSubscription();
  if (!subscription) return true;
  return subscription.unsubscribe();
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}