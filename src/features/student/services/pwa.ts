import api from '../../../core/services/api';

let deferredPrompt: Event | null = null;

export function initPWA(): void {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.register('/sw.js', { scope: '/dashboard/' })
    .catch(() => {});

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });
}

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
    const { publicKey } = data;

    const registration = await navigator.serviceWorker.ready;
    const existingSub = await registration.pushManager.getSubscription();
    if (existingSub) {
      const json = existingSub.toJSON();
      if (json.endpoint) return;
      await existingSub.unsubscribe();
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    await api.post('/push/subscribe', subscription.toJSON());
  } catch {
    /* silent fail — push is best-effort */
  }
}

export function isInstallable(): boolean {
  return deferredPrompt !== null;
}

export async function showInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) return false;
  const prompt = deferredPrompt as any;
  deferredPrompt = null;
  try {
    prompt.prompt();
    const choice = prompt.response || prompt.userChoice;
    const result = await Promise.race([
      choice,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 30000)),
    ]);
    return result?.outcome === 'accepted';
  } catch {
    return false;
  }
}

export async function subscribeToPush(publicKey: string): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
    return subscription;
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
  const sub = await getPushSubscription();
  if (!sub) return true;
  return sub.unsubscribe();
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
