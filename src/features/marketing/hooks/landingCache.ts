import type {
  BackendStats,
  Bootcamp,
  LeaderboardEntry,
  MarketplaceItem,
} from '../components/landing/types';
import { resolveImg } from '../components/landing/helpers';

const LANDING_CACHE_KEY = 'hsociety_landing_cache_v2';
const LANDING_IMAGE_CACHE = 'hsociety-landing-images-v1';

export interface LandingSnapshot {
  stats: BackendStats | null;
  bootcamps: Bootcamp[];
  leaderboard: LeaderboardEntry[];
  marketItems: MarketplaceItem[];
}

interface StoredLandingSnapshot extends LandingSnapshot {
  cachedAt: number;
}

const toAbsoluteUrl = (url: string): string => {
  try {
    return new URL(url, window.location.origin).toString();
  } catch {
    return url;
  }
};

const isBlobOrDataUrl = (value: string) => /^(blob:|data:)/i.test(value);

const collectDynamicImageUrls = (snapshot: LandingSnapshot): string[] => {
  const urls = [
    ...snapshot.bootcamps.map((item) => resolveImg(item.image)),
    ...snapshot.marketItems.map((item) => resolveImg(item.coverUrl)),
    ...snapshot.leaderboard.map((item) => resolveImg(item.avatarUrl)),
  ]
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value) => !isBlobOrDataUrl(value));

  return [...new Set(urls)];
};

export const readLandingSnapshot = (): LandingSnapshot | null => {
  try {
    const raw = localStorage.getItem(LANDING_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredLandingSnapshot> | null;
    if (!parsed || typeof parsed !== 'object') return null;

    return {
      stats: (parsed.stats as BackendStats | null) ?? null,
      bootcamps: Array.isArray(parsed.bootcamps) ? (parsed.bootcamps as Bootcamp[]) : [],
      leaderboard: Array.isArray(parsed.leaderboard) ? (parsed.leaderboard as LeaderboardEntry[]) : [],
      marketItems: Array.isArray(parsed.marketItems) ? (parsed.marketItems as MarketplaceItem[]) : [],
    };
  } catch {
    return null;
  }
};

export const writeLandingSnapshot = (snapshot: LandingSnapshot): void => {
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

export const warmLandingImageCache = async (snapshot: LandingSnapshot): Promise<void> => {
  if (typeof window === 'undefined' || !('caches' in window) || !('fetch' in window)) return;

  const imageUrls = collectDynamicImageUrls(snapshot);
  if (imageUrls.length === 0) return;

  try {
    const imageCache = await caches.open(LANDING_IMAGE_CACHE);
    await Promise.allSettled(
      imageUrls.map(async (url) => {
        const absoluteUrl = toAbsoluteUrl(url);
        const existing = await imageCache.match(absoluteUrl);
        if (existing) return;

        const response = await fetch(absoluteUrl, { credentials: 'include' });
        if (response.ok) {
          await imageCache.put(absoluteUrl, response.clone());
        }
      })
    );
  } catch {
    // Ignore browser cache failures.
  }
};

const resolveImageFromCache = async (url?: string): Promise<string | undefined> => {
  const source = String(url || '').trim();
  if (!source || isBlobOrDataUrl(source)) return source || undefined;
  if (typeof window === 'undefined' || !('caches' in window)) return source;

  try {
    const imageCache = await caches.open(LANDING_IMAGE_CACHE);
    const response = await imageCache.match(toAbsoluteUrl(source));
    if (!response) return source;
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch {
    return source;
  }
};

export const hydrateLandingImagesFromCache = async (
  snapshot: LandingSnapshot
): Promise<{ snapshot: LandingSnapshot; objectUrls: string[] }> => {
  const objectUrls: string[] = [];

  const [bootcamps, marketItems, leaderboard] = await Promise.all([
    Promise.all(
      snapshot.bootcamps.map(async (item) => {
        const image = await resolveImageFromCache(resolveImg(item.image));
        if (image?.startsWith('blob:')) objectUrls.push(image);
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
    snapshot: {
      ...snapshot,
      bootcamps,
      marketItems,
      leaderboard,
    },
    objectUrls,
  };
};
