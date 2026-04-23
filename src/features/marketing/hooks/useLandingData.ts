import { useEffect, useRef, useState } from 'react';
import api from '../../../core/services/api';
import type {
  BackendStats,
  Bootcamp,
  LeaderboardEntry,
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
  const [stats, setStats] = useState<BackendStats | null>(null);
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [marketItems, setMarketItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    let mounted = true;
    const revokeObjectUrls = () => {
      objectUrlsRef.current.forEach((value) => URL.revokeObjectURL(value));
      objectUrlsRef.current = [];
    };

    const applySnapshot = (snapshot: LandingSnapshot) => {
      if (!mounted) return;
      setStats(snapshot.stats);
      setBootcamps(snapshot.bootcamps);
      setLeaderboard(snapshot.leaderboard);
      setMarketItems(snapshot.marketItems);
    };

    const cached = readLandingSnapshot();
    if (cached) {
      applySnapshot(cached);
      hydrateLandingImagesFromCache(cached).then(({ snapshot, objectUrls }) => {
        if (!mounted) {
          objectUrls.forEach((value) => URL.revokeObjectURL(value));
          return;
        }
        revokeObjectUrls();
        objectUrlsRef.current = objectUrls;
        applySnapshot(snapshot);
      });
    }

    Promise.all([
      api.get('/public/landing-stats').catch(() => null),
      api.get('/public/bootcamps').catch(() => null),
      api.get('/public/leaderboard').catch(() => null),
      api.get('/public/cp-products').catch(() => null),
    ]).then(([statsRes, bootcampsRes, leaderboardRes, marketRes]) => {
      if (!mounted) return;
      const nextSnapshot: LandingSnapshot = {
        stats: statsRes?.data ?? cached?.stats ?? null,
        bootcamps: bootcampsRes?.data?.items ?? cached?.bootcamps ?? [],
        leaderboard: leaderboardRes?.data?.leaderboard ?? cached?.leaderboard ?? [],
        marketItems: marketRes?.data?.items ?? cached?.marketItems ?? [],
      };

      applySnapshot(nextSnapshot);
      writeLandingSnapshot(nextSnapshot);
      warmLandingImageCache(nextSnapshot);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => {
      mounted = false;
      revokeObjectUrls();
    };
  }, []);

  return { stats, bootcamps, leaderboard, marketItems, loading };
};
