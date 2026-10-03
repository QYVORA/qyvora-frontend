/**
 * sw.js — QYVORA service worker
 *
 * Caching model (see docs/PWA.md):
 *   - App shell precached on install so a cold offline start can boot the SPA.
 *   - Navigations: network-first with a timeout, falling back to the cached
 *     shell (the client router then renders the requested route) and finally to
 *     /offline.html when even the shell is missing.
 *   - Static assets (hashed /assets/*, fonts, images): stale-while-revalidate.
 *   - Everything else same-origin: stale-while-revalidate into a runtime cache.
 *   - /api, /uploads, the worker script and the manifest always hit the network.
 *
 * Activation is never automatic: the worker waits until the page posts
 * SKIP_WAITING, so an update can be announced to the user first (see
 * `applyUpdate` in src/core/services/pwa.ts).
 *
 * CACHE_VERSION and BUILD_ASSETS are injected at build time (see
 * vite-plugin-sw-precache.ts) so every deploy gets a fresh shell and prunes the
 * caches of the previous build. Bump the version by hand only when the caching
 * *behaviour* changes without a rebuild.
 */

// Both values below are rewritten at build time by vite-plugin-sw-precache.ts —
// the dev defaults keep this file valid JavaScript when served unprocessed.
const CACHE_VERSION = 'dev';
const BUILD_ASSETS = [];
const SHELL_CACHE = `qyvora-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `qyvora-runtime-${CACHE_VERSION}`;
const CURRENT_CACHES = [SHELL_CACHE, RUNTIME_CACHE];

const OFFLINE_URL = '/offline.html';
const SHELL_URL = '/index.html';

/** Network-only prefixes: dynamic, authenticated, or revalidation-sensitive. */
const NETWORK_ONLY_PREFIXES = ['/api/', '/uploads/'];

/** Never cached — the worker script and manifest must always be revalidated. */
const NETWORK_ONLY_PATHS = new Set(['/sw.js', '/manifest.webmanifest', OFFLINE_URL]);

/** App shell: everything needed to boot the SPA while offline. */
const PRECACHE_URLS = [
  '/',
  SHELL_URL,
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/favicon.webp',
  '/fonts/jetbrains-latin.woff2',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-192.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
  // Hashed entry graph (entry + vendor + CSS), injected at build time.
  ...BUILD_ASSETS,
];

/** Navigation network timeout — fall back to cache rather than hang. */
const NAV_TIMEOUT_MS = 4000;

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // Individually, so one unavailable asset cannot fail the whole install.
      await Promise.all(
        PRECACHE_URLS.map(async (url) => {
          try {
            await cache.put(url, await fetch(url, { cache: 'reload' }));
          } catch {
            /* asset unavailable at install time — runtime caching will pick it up */
          }
        })
      );
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => !CURRENT_CACHES.includes(key)).map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Cross-origin (Google Fonts, etc.) — leave it to the network and the HTTP cache.
  if (url.origin !== self.location.origin) return;

  const { pathname } = url;

  if (NETWORK_ONLY_PATHS.has(pathname)) return;
  if (NETWORK_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

/**
 * Navigation: network-first with a timeout, then the cached app shell, then the
 * offline page. Serving the shell (rather than the last HTML document) keeps the
 * SPA alive offline — the client router owns the route.
 */
async function handleNavigation(request) {
  try {
    return await networkWithTimeout(request, NAV_TIMEOUT_MS);
  } catch {
    const shell =
      (await caches.match(SHELL_URL, { cacheName: SHELL_CACHE })) ||
      (await caches.match('/'));
    if (shell) return shell;
    const offline = await caches.match(OFFLINE_URL, { cacheName: SHELL_CACHE });
    return (
      offline ||
      new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } })
    );
  }
}

/** Fetch with a hard timeout so a dead network cannot stall a navigation. */
function networkWithTimeout(request, timeout) {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    fetch(request, { signal: controller.signal })
      .then((response) => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

/** Cache-first with a quiet background refresh. */
async function staleWhileRevalidate(request) {
  const cached =
    (await caches.match(request, { cacheName: SHELL_CACHE })) ||
    (await caches.match(request, { cacheName: RUNTIME_CACHE }));

  // `.catch` here is what keeps a failed refresh from surfacing as an
  // unhandled rejection — the cached response is already on its way to the page.
  const refresh = fetch(request)
    .then(async (response) => {
      if (response && response.ok && response.type === 'basic') {
        const cache = await caches.open(RUNTIME_CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  if (cached) return cached;

  const response = await refresh;
  if (response) return response;
  return (
    (await caches.match(request)) ||
    new Response('', { status: 504, headers: { 'Content-Type': 'text/plain' } })
  );
}

// ─── Web Push ─────────────────────────────────────────────────────────────────

const NOTIFICATION_ICON = '/icons/icon-192.png';

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
    icon: NOTIFICATION_ICON,
    badge: NOTIFICATION_ICON,
    tag: data.tag || 'qyvora-default',
    data: { url: data.url || '/dashboard' },
    vibrate: [200, 100, 200],
    requireInteraction: true,
  };

  event.waitUntil(self.registration.showNotification(data.title || 'QYVORA', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || '/dashboard', self.location.origin);

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Focus an already-open tab on the same path instead of duplicating it.
      for (const client of windowClients) {
        if (new URL(client.url).pathname === targetUrl.pathname) {
          return client.focus();
        }
      }
      // Otherwise reuse any open tab of this origin and let the router navigate.
      if (windowClients.length > 0) {
        const [client] = windowClients;
        if (client.navigate) {
          return client
            .navigate(targetUrl.href)
            .then((navigated) => (navigated ? navigated.focus() : undefined))
            .catch(() => undefined);
        }
        return client.focus();
      }
      return self.clients.openWindow(targetUrl.href);
    })
  );
});