/**
 * useLandingData.ts
 * Location: src/features/marketing/hooks/useLandingData.ts
 *
 * Custom hook that manages all data fetching for the public landing page.
 *
 * Loading strategy — stale-while-revalidate:
 *   1. On mount, the last cached snapshot is read from localStorage and
 *      applied immediately. The page renders with real content within
 *      milliseconds, even before the network responds.
 *   2. Cached images are hydrated from Cache Storage in parallel, replacing
 *      network URLs with local blob: URLs to eliminate image flicker.
 *   3. Fresh data is fetched from four public API endpoints concurrently.
 *   4. When the fresh data arrives, it replaces the cached data in state,
 *      is written back to the cache for future visits, and triggers a new
 *      image pre-cache warm-up.
 *
 * This hook manages its own cleanup carefully to avoid:
 *   - Setting state on an unmounted component (guarded by `mounted` flag)
 *   - Memory leaks from unreleased blob: URLs (cleaned up in `revokeObjectUrls`)
 */

import { useEffect, useRef, useState } from 'react';
import api from '../../../core/services/api';
import type {
  BackendStats,
  Bootcamp,
  MarketplaceItem,
} from '../components/landing/types';
import {
  hydrateLandingImagesFromCache,
  readLandingSnapshot,
  warmLandingImageCache,
  writeLandingSnapshot,
  type LandingSnapshot,
} from './landingCache';

export const useLandingData = () => {
  // ── State ────────────────────────────────────────────────────────────────

  // Each data category is stored separately so a partial cache hit (e.g. only
  // stats are cached) can still populate part of the UI immediately.
  const [stats, setStats]             = useState<BackendStats | null>(null);
  const [bootcamps, setBootcamps]     = useState<Bootcamp[]>([]);
  const [marketItems, setMarketItems] = useState<MarketplaceItem[]>([]);

  // `loading` starts true and is set to false only after the fresh API
  // response resolves (or fails). Cached data is shown during this window.
  const [loading, setLoading]         = useState(true);

  // Tracks the blob: URLs created by hydrateLandingImagesFromCache so they
  // can be revoked on unmount or before a new hydration pass overwrites them.
  // A ref is used instead of state because changing this list should never
  // trigger a re-render.
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    // `mounted` guards all async callbacks against calling setState after the
    // component has unmounted (e.g. the user navigated away before the fetch
    // completed). Without this guard React would log a warning and potentially
    // update stale state.
    let mounted = true;

    /**
     * Revokes all blob: URLs currently tracked in objectUrlsRef and clears
     * the list. Must be called before storing a new set of blob: URLs to
     * prevent memory accumulation, and on unmount to release all memory.
     */
    const revokeObjectUrls = () => {
      objectUrlsRef.current.forEach((value) => URL.revokeObjectURL(value));
      objectUrlsRef.current = [];
    };

    /**
     * Applies a complete snapshot to all four state slices in one pass.
     * The `mounted` guard prevents state updates after unmount.
     */
    const applySnapshot = (snapshot: LandingSnapshot) => {
      if (!mounted) return;
      setStats(snapshot.stats);
      setBootcamps(snapshot.bootcamps);
      setMarketItems(snapshot.marketItems);
    };

    // ── Phase 1: Serve from cache immediately ───────────────────────────────
    const cached = readLandingSnapshot();
    if (cached) {
      // Apply the raw cached snapshot first so the page renders instantly
      applySnapshot(cached);

      // Then hydrate images from Cache Storage asynchronously. This runs
      // concurrently with the API fetch below — whichever provides richer
      // image data "wins" last (the API response will overwrite this anyway).
      hydrateLandingImagesFromCache(cached).then(({ snapshot, objectUrls }) => {
        if (!mounted) {
          // Component unmounted while we were hydrating — revoke the blob URLs
          // we just created since nothing will ever display or clean them up.
          objectUrls.forEach((value) => URL.revokeObjectURL(value));
          return;
        }
        // Revoke the previous set of blob URLs before replacing them
        revokeObjectUrls();
        objectUrlsRef.current = objectUrls;
        applySnapshot(snapshot);
      });
    }

    // ── Phase 2: Fetch fresh data from all four public endpoints ────────────
    // All four requests are fired concurrently. Each one catches its own
    // error and returns null so a single failing endpoint does not prevent
    // the others from populating the UI.
    Promise.all([
      api.get('/public/landing-stats').catch(() => null),
      api.get('/public/bootcamps').catch(() => null),
      api.get('/public/cp-products').catch(() => null),
    ]).then(([statsRes, bootcampsRes, marketRes]) => {
      if (!mounted) return;

      // Build the authoritative snapshot. For each field, the fresh API
      // response is preferred; the cached value is the fallback; empty/null
      // is the last resort. This ensures a partial API failure degrades
      // gracefully using whatever cached data is available.
      const nextSnapshot: LandingSnapshot = {
        stats:       statsRes?.data                          ?? cached?.stats        ?? null,
        bootcamps:   bootcampsRes?.data?.items               ?? cached?.bootcamps    ?? [],
        marketItems: marketRes?.data?.items                  ?? cached?.marketItems  ?? [],
      };

      // Update the UI with fresh data
      applySnapshot(nextSnapshot);

      // Persist the fresh snapshot so the next page load has it instantly
      writeLandingSnapshot(nextSnapshot);

      // Pre-fetch images from the fresh snapshot into Cache Storage so
      // the next visit can serve them as blob: URLs without network requests.
      // This runs in the background — we do not await it.
      warmLandingImageCache(nextSnapshot);
    }).finally(() => {
      // Regardless of whether the fetch succeeded or failed, clear the
      // loading flag so the page stops showing any loading indicators.
      if (mounted) setLoading(false);
    });

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      mounted = false;      // Prevents all subsequent async setState calls
      revokeObjectUrls();   // Frees all blob: URL memory on unmount
    };
  }, []); // Empty dependency array — run once on mount only.

  return { stats, bootcamps, marketItems, loading };
};