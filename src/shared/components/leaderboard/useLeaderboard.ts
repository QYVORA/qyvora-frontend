import { useState, useCallback } from 'react';
import api from '@/core/services/api';
import type { LeaderboardEntry, Period } from './types';

interface UseLeaderboardOptions {
  limit?: number;
  offset?: number;
  errorMessages?: {
    loadFailed?: string;
    networkFailed?: string;
  };
}

export function useLeaderboard(options: UseLeaderboardOptions = {}) {
  const { limit = 50, offset = 0, errorMessages } = options;
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  const fetchLeaderboard = useCallback(async (period: Period) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/public/leaderboard?period=${period}&limit=${limit}&offset=${offset}`);
      const data = res.data;
      if (data.success) {
        setEntries(data.entries || []);
        setTotal(data.total || 0);
      } else {
        setError(errorMessages?.loadFailed || 'Failed to load leaderboard.');
      }
    } catch {
      setError(errorMessages?.networkFailed || 'Failed to load leaderboard. Check connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [limit, offset, errorMessages?.loadFailed, errorMessages?.networkFailed]);

  return { entries, loading, error, total, fetchLeaderboard, setEntries, setTotal, setError, setLoading };
}
