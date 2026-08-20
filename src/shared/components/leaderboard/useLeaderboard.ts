import { useState, useCallback, useRef } from 'react';
import api from '@/core/services/api';
import type { LeaderboardEntry, Period } from './types';

interface UseLeaderboardOptions {
  limit?: number;
  offset?: number;
  cohortId?: string | null;
  errorMessages?: {
    loadFailed?: string;
    networkFailed?: string;
  };
}

export function useLeaderboard(options: UseLeaderboardOptions = {}) {
  const { limit = 50, offset: initialOffset = 0, cohortId: initialCohortId, errorMessages } = options;
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const offsetRef = useRef(initialOffset);
  const cohortIdRef = useRef(initialCohortId);

  const fetchLeaderboard = useCallback(async (period: Period, mode: 'reset' | 'append' = 'reset', cohortId?: string | null) => {
    if (mode === 'reset') {
      offsetRef.current = initialOffset;
      setLoading(true);
      setEntries([]);
    } else {
      setLoadingMore(true);
    }
    if (cohortId !== undefined) {
      cohortIdRef.current = cohortId;
    }
    setError('');
    try {
      let url = `/public/leaderboard?period=${period}&limit=${limit}&offset=${offsetRef.current}`;
      if (cohortIdRef.current) {
        url += `&cohortId=${cohortIdRef.current}`;
      }
      const res = await api.get(url);
      const data = res.data;
      if (data.success) {
        const batch = data.entries || [];
        setEntries((prev) => (mode === 'reset' ? batch : [...prev, ...batch]));
        setTotal(data.total || 0);
        const nextOffset = offsetRef.current + batch.length;
        offsetRef.current = nextOffset;
        setHasMore(batch.length >= limit && nextOffset < (data.total || 0));
      } else {
        setError(errorMessages?.loadFailed || 'Failed to load leaderboard.');
      }
    } catch {
      setError(errorMessages?.networkFailed || 'Failed to load leaderboard. Check connection and try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [limit, initialOffset, errorMessages?.loadFailed, errorMessages?.networkFailed]);

  const loadMore = useCallback((period: Period) => fetchLeaderboard(period, 'append'), [fetchLeaderboard]);

  return { entries, loading, loadingMore, error, total, hasMore, fetchLeaderboard, loadMore, setEntries, setTotal, setError, setLoading };
}
