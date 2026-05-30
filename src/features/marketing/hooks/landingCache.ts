/**
 * landingCache.ts
 * Location: src/features/marketing/hooks/landingCache.ts
 *
 * Handles all caching concerns for the public landing page data.
 *
 * Two separate caching layers are managed here:
 *
 *   1. Data cache (localStorage)
 *      Stores the last known API response snapshot (stats, bootcamps,
 *      leaderboard, marketplace items) as JSON. This allows the landing page
 *      to render immediately on repeat visits before the fresh API response
 *      arrives, eliminating a blank loading state for returning visitors.
 *
 *   2. Image cache (Cache Storage API / Service Worker cache)
 *      Pre-fetches and stores the binary image files associated with the
 *      snapshot data. On subsequent visits, images are served from this
 *      local cache as object URLs instead of being re-downloaded, which
 *      eliminates image flicker and reduces bandwidth usage.
 *
 * This file is consumed exclusively by useLandingData.ts — no component
 * should import from here directly.
 */

import type {
  BackendStats,
  Bootcamp,
  LeaderboardEntry,
  MarketplaceItem,
} from '../components/landing/types';
import { resolveImg } from '../components/landing/helpers';

// ─── Storage keys ─────────────────────────────────────────────────────────────

/**
 * localStorage key for the JSON data snapshot.
 * The version suffix (_v2) allows a future schema change to start fresh
 * without needing to manually clear old cache entries — simply increment it.
 */
const LANDING_CACHE_KEY = 'hsociety_landing_cache_v2';

/**
 * Cache Storage bucket name for pre-fetched landing page images.
 * The version suffix (-v1) serves the same purpose as above — bump it to
 * invalidate all cached images when the image URL scheme changes.
 */
const LANDING_IMAGE_CACHE = 'hsociety-landing-images-v1';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * The shape of data the landing page needs from the backend.
 * This is the public contract — what useLandingData reads and writes.
 */
export interface LandingSnapshot {
  stats: BackendStats | null;
  bootcamps: Bootcamp[];
  leaderboard: LeaderboardEntry[];
  marketItems: MarketplaceItem[];
}

/**
 * The shape actually written to localStorage — extends LandingSnapshot with
 * a timestamp so callers can implement TTL-based cache invalidation in future
 * without a schema change. `cachedAt` is not currently used to expire the
 * cache but is recorded for observability and future use.
 */
interface StoredLandingSnapshot extends LandingSnapshot {
  cachedAt: number; // Unix timestamp (ms) of when this snapshot was written
}

// ─── URL utilities ────────────────────────────────────────────────────────────

/**
 * Converts a potentially relative image URL into an absolute URL using the
 * current page's origin as the base.
 *
 * This is necessary because the Cache Storage API requires absolute URLs —
 * passing a relative path like "/assets/bootcamp.webp" to caches.match()
 * would fail to find the cached entry.

 *
 * Falls back to the original string if URL construction throws (e.g. the
 * input is already absolute or is an empty string).
 */
const toAbsoluteUrl = (url: string): string => {
  try {
    return new URL(url, window.location.origin).toString();
  } catch {
    return url;
  }
};

/**
 * Returns true if the URL is a blob: or data: URL.
 *
 * Blob and data URLs are ephemeral — blob URLs are tied to the current
 * browser session and become invalid after the page is closed. Data URLs
 * can be very large. Neither should be stored in the Cache Storage API.
 */
const isBlobOrDataUrl = (value: string) => /^(blob:|data:)/i.test(value);

/**
 * Collects all cacheable external image URLs from a snapshot.
 *
 * Images are gathered from three sources:
 *   - Bootcamp cover images
 *   - Marketplace item cover images
 *   - Leaderboard avatar images
 *
 * resolveImg() normalises each raw image field into a usable URL string.
 * Blank, duplicate, and blob/data URLs are filtered out — only unique,
 * fetchable HTTP(S) URLs are returned.
 */
const collectDynamicImageUrls = (snapshot: LandingSnapshot): string[] => {
  const urls = [
    ...snapshot.bootcamps.map((item) => resolveImg(item.image)),
    ...snapshot.marketItems.map((item) => resolveImg(item.coverUrl)),
    ...snapshot.leaderboard.map((item) => resolveImg(item.avatarUrl)),
  ]
    .map((value) => value.trim())
    .filter(Boolean)                          // Remove empty strings
    .filter((value) => !isBlobOrDataUrl(value)); // Remove ephemeral URLs

  // Deduplicate — the same image URL may appear across multiple items
  return [...new Set(urls)];
};

// ─── Data cache (localStorage) ────────────────────────────────────────────────

/**
 * Reads the last stored landing snapshot from localStorage.
 *
 * Returns null if:
 *   - Nothing has been cached yet (first visit)
 *   - The stored value is not valid JSON
 *   - The stored value is not an object (corrupted / tampered entry)
 *
 * Array fields are validated with Array.isArray() before use — this guards
 * against a stored value that was valid JSON but had an unexpected shape,
 * which would cause downstream .map() calls to crash.
 *
 * All errors are caught silently — a cache read failure should never prevent
 * the landing page from rendering. The API fetch will populate the data anyway.
 */
export const readLandingSnapshot = (): LandingSnapshot | null => {
  try {
    const raw = localStorage.getItem(LANDING_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredLandingSnapshot> | null;
    if (!parsed || typeof parsed !== 'object') return null;

    return {
      stats: (parsed.stats as BackendStats | null) ?? null,
      bootcamps:    Array.isArray(parsed.bootcamps)    ? (parsed.bootcamps    as Bootcamp[])         : [],
      leaderboard:  Array.isArray(parsed.leaderboard)  ? (parsed.leaderboard  as LeaderboardEntry[]) : [],
      marketItems:  Array.isArray(parsed.marketItems)  ? (parsed.marketItems  as MarketplaceItem[])  : [],
    };
  } catch {
    // Catches JSON.parse failures and any unexpected runtime errors.
    // A corrupted cache entry is treated the same as an absent one.
    return null;
  }
};

import { isCategoryAllowed } from '../../../shared/utils/storageConsent';

/**
 * Writes a fresh landing snapshot to localStorage.
 *
 * `cachedAt` records the write time for observability. Storage quota errors
 * (common on iOS Safari in private browsing) and serialisation errors are
 * caught silently — a failed cache write should never break the page.
 */
export const writeLandingSnapshot = (snapshot: LandingSnapshot): void => {
  if (!isCategoryAllowed('analytics')) return;
  try {
    const payload: StoredLandingSnapshot = {
      ...snapshot,
      cachedAt: Date.now(),
    };
    localStorage.setItem(LANDING_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota and serialization failures.
  }
};

// ─── Image cache (Cache Storage API) ─────────────────────────────────────────

/**
 * Pre-fetches all images from the snapshot into the browser's Cache Storage.
 * Called after a fresh API response is written so the next page load can
 * serve images instantly without any network requests.
 *
 * Guards:
 *   - SSR / non-browser environments where `window` is undefined are skipped.
 *   - Browsers that don't support the Cache Storage API or fetch are skipped.
 *
 * Already-cached images are skipped (imageCache.match check) so this function
 * is safe to call repeatedly without re-downloading unchanged images.
 *
 * Promise.allSettled() is used instead of Promise.all() so a single failed
 * image fetch (e.g. a broken URL) does not cancel caching of the other images.
 *
 * credentials: 'include' is passed to fetch so authenticated image URLs
 * (behind cookie-based access) are fetched with the user's session cookies.
 *
 * response.clone() is required because a Response body can only be consumed
 * once — we clone it before calling cache.put() so the original is still
 * available if needed.
 *
 * All errors are caught silently — image pre-caching is a progressive
 * enhancement. The page works correctly without it.
 */
export const warmLandingImageCache = async (snapshot: LandingSnapshot): Promise<void> => {
  if (typeof window === 'undefined' || !('caches' in window) || !('fetch' in window)) return;

  const imageUrls = collectDynamicImageUrls(snapshot);
  if (imageUrls.length === 0) return;

  try {
    const imageCache = await caches.open(LANDING_IMAGE_CACHE);
    await Promise.allSettled(
      imageUrls.map(async (url) => {
        const absoluteUrl = toAbsoluteUrl(url);

        // Skip if this image is already in the cache
        const existing = await imageCache.match(absoluteUrl);
        if (existing) return;

        const response = await fetch(absoluteUrl, { credentials: 'include' });
        if (response.ok) {
          // Store a clone — the original response body can only be read once
          await imageCache.put(absoluteUrl, response.clone());
        }
      })
    );
  } catch {
    // Ignore browser cache failures.
  }
};

/**
 * Attempts to serve a single image URL from the Cache Storage.
 * If found, converts the cached Response into a blob: URL that can be used
 * directly in an <img> src attribute without any network request.
 *
 * Returns the original URL string as a fallback if:
 *   - The URL is empty, a blob:, or a data: URL (nothing to look up)
 *   - The Cache Storage API is unavailable
 *   - The image is not in the cache yet
 *   - Any error occurs during the cache lookup
 *
 * IMPORTANT: Callers are responsible for revoking the returned blob: URLs
 * with URL.revokeObjectURL() when the component unmounts to prevent memory
 * leaks. useLandingData.ts handles this via objectUrlsRef.
 */
const resolveImageFromCache = async (url?: string): Promise<string | undefined> => {
  const source = String(url || '').trim();
  if (!source || isBlobOrDataUrl(source)) return source || undefined;
  if (typeof window === 'undefined' || !('caches' in window)) return source;

  try {
    const imageCache = await caches.open(LANDING_IMAGE_CACHE);
    const response = await imageCache.match(toAbsoluteUrl(source));
    if (!response) return source; // Not cached — fall back to original URL

    const blob = await response.blob();
    return URL.createObjectURL(blob); // Creates an in-memory object URL
  } catch {
    return source; // Any failure → fall back to original URL
  }
};

/**
 * Takes a snapshot and replaces each image URL with a blob: URL resolved
 * from the Cache Storage, producing a fully hydrated snapshot that can be
 * rendered without any network activity.
 *
 * All three image collections (bootcamps, marketItems, leaderboard) are
 * processed in parallel via Promise.all() for performance.
 *
 * Returns:
 *   snapshot    — a new LandingSnapshot with image fields replaced by blob: URLs
 *                 where available (original URLs where not cached).
 *   objectUrls  — all blob: URLs that were created, so the caller can revoke
 *                 them on unmount to free memory. This is critical — failing
 *                 to revoke blob URLs leaks memory for the lifetime of the tab.
 */
export const hydrateLandingImagesFromCache = async (
  snapshot: LandingSnapshot
): Promise<{ snapshot: LandingSnapshot; objectUrls: string[] }> => {
  const objectUrls: string[] = [];

  // Process all three image collections concurrently
  const [bootcamps, marketItems, leaderboard] = await Promise.all([
    Promise.all(
      snapshot.bootcamps.map(async (item) => {
        const image = await resolveImageFromCache(resolveImg(item.image));
        if (image?.startsWith('blob:')) objectUrls.push(image); // Track for cleanup
        return { ...item, image };
      })
    ),
    Promise.all(
      snapshot.marketItems.map(async (item) => {
        const coverUrl = await resolveImageFromCache(resolveImg(item.coverUrl));
        if (coverUrl?.startsWith('blob:')) objectUrls.push(coverUrl);
        return { ...item, coverUrl };
      })
    ),
    Promise.all(
      snapshot.leaderboard.map(async (item) => {
        const avatarUrl = await resolveImageFromCache(resolveImg(item.avatarUrl));
        if (avatarUrl?.startsWith('blob:')) objectUrls.push(avatarUrl);
        return { ...item, avatarUrl };
      })
    ),
  ]);

  return {
    snapshot: { ...snapshot, bootcamps, marketItems, leaderboard },
    objectUrls,
  };
};