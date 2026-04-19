import { useEffect, useState } from 'react';
import api from '../../../core/services/api';

interface LandingStats {
  studentsCount?: number;
  learnersTrained?: number;
  bootcampsCount?: number;
  zeroDayProductsCount?: number;
  vulnerabilitiesIdentified?: number;
  pentestersActive?: number;
}

export const useLandingData = () => {
  const [stats, setStats] = useState<{ stats?: LandingStats } | null>(null);
  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [marketItems, setMarketItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.get('/public/landing-stats').catch(() => null),
      api.get('/public/bootcamps').catch(() => null),
      api.get('/public/rooms').catch(() => null),
      api.get('/public/leaderboard').catch(() => null),
      api.get('/public/cp-products').catch(() => null),
    ]).then(([statsRes, bootcampsRes, roomsRes, leaderboardRes, marketRes]) => {
      if (!mounted) return;
      if (statsRes?.data) setStats(statsRes.data);
      if (bootcampsRes?.data?.items) setBootcamps(bootcampsRes.data.items);
      if (roomsRes?.data?.items) setRooms(roomsRes.data.items);
      if (leaderboardRes?.data?.leaderboard) setLeaderboard(leaderboardRes.data.leaderboard);
      if (marketRes?.data?.items) setMarketItems(marketRes.data.items);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  return { stats, bootcamps, rooms, leaderboard, marketItems, loading };
};
