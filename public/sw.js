const NAV_CACHE = 'qyvora-nav-v2';
const ASSET_CACHE = 'qyvora-assets-v2';

const ASSET_EXT = /\.(js|css|png|jpg|jpeg|gif|svg|webp|avif|ico|woff2?)$/;
const DASHBOARD_PREFIX = '/dashboard/';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== NAV_CACHE && k !== ASSET_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  const path = url.pathname;

  if (path.startsWith('/api/')) return;

  if (path.startsWith('/assets/') && ASSET_EXT.test(path)) {
    event.respondWith(assetFirst(request));
    return;
  }

  if (path === '/index.html' || path.startsWith(DASHBOARD_PREFIX)) {
    event.respondWith(networkFirst(request));
    return;
  }
});

async function assetFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const clone = response.clone();
      caches.open(ASSET_CACHE).then((cache) => cache.put(request, clone));
    }
    return response;
  } catch {
    return caches.match(request);
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const clone = response.clone();
      caches.open(NAV_CACHE).then((cache) => cache.put(request, clone));
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: 'QYVORA', body: event.data.text() };
  }

  const options = {
    body: data.body || '',
    icon: '/favicon.png',
    badge: '/favicon.png',
    tag: data.tag || 'qyvora-default',
    data: { url: data.url || '/dashboard/' },
    vibrate: [200, 100, 200],
    requireInteraction: true,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'QYVORA', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/dashboard/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        const clientUrl = new URL(client.url);
        if (clientUrl.origin === self.location.origin && clientUrl.pathname.startsWith('/dashboard/')) {
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});
