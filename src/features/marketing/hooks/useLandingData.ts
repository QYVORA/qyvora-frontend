import { useEffect, useState } from 'react';
import api from '../../../core/services/api';
import type {
  BackendStats,
  Bootcamp,
  LeaderboardEntry,
  MarketplaceItem,
} from '../components/landing/types';

export const useLandingData = () => {
  const [stats, setStats] = useState<BackendStats | null>(null);
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [marketItems, setMarketItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.get('/public/landing-stats').catch(() => null),
      api.get('/public/bootcamps').catch(() => null),
      api.get('/public/leaderboard').catch(() => null),
      api.get('/public/cp-products').catch(() => null),
    ]).then(([statsRes, bootcampsRes, leaderboardRes, marketRes]) => {
      if (!mounted) return;
      if (statsRes?.data) setStats(statsRes.data);
      if (bootcampsRes?.data?.items) setBootcamps(bootcampsRes.data.items);
      if (leaderboardRes?.data?.leaderboard) setLeaderboard(leaderboardRes.data.leaderboard);
      if (marketRes?.data?.items) setMarketItems(marketRes.data.items);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  return { stats, bootcamps, leaderboard, marketItems, loading };
};
