import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';

vi.mock('@/core/services/api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

import api from '@/core/services/api';
import { useLeaderboard } from '../useLeaderboard';
import type { LeaderboardEntry } from '../types';

const apiGet = vi.mocked(api.get);

const makeEntries = (startRank: number, count: number): LeaderboardEntry[] =>
  Array.from({ length: count }, (_, i) => ({
    rank: startRank + i,
    userId: `user-${startRank + i}`,
    name: `Operator ${startRank + i}`,
    hackerHandle: `op${startRank + i}`,
    organization: '',
    cp: 1000 - (startRank + i),
    rankLabel: 'Operator',
    roomsCompleted: 1,
    streakDays: 0,
  }));

const respond = (entries: LeaderboardEntry[], total: number) =>
  ({ data: { success: true, entries, total } });

beforeEach(() => {
  apiGet.mockReset();
});

describe('useLeaderboard pagination', () => {
  it('fetches the first page with offset 0 and reports hasMore from total', async () => {
    apiGet.mockResolvedValueOnce(respond(makeEntries(1, 50), 120));

    const { result } = renderHook(() => useLeaderboard({ limit: 50 }));

    await act(async () => {
      await result.current.fetchLeaderboard('all', 'reset');
    });

    expect(apiGet).toHaveBeenCalledWith('/public/leaderboard?period=all&limit=50&offset=0');
    expect(result.current.entries).toHaveLength(50);
    expect(result.current.total).toBe(120);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.loading).toBe(false);
  });

  it('appends the next page at offset = limit and grows the list', async () => {
    apiGet
      .mockResolvedValueOnce(respond(makeEntries(1, 50), 120))
      .mockResolvedValueOnce(respond(makeEntries(51, 50), 120));

    const { result } = renderHook(() => useLeaderboard({ limit: 50 }));

    await act(async () => {
      await result.current.fetchLeaderboard('all', 'reset');
    });
    await act(async () => {
      await result.current.loadMore('all');
    });

    expect(apiGet).toHaveBeenLastCalledWith('/public/leaderboard?period=all&limit=50&offset=50');
    expect(result.current.entries).toHaveLength(100);
    expect(result.current.entries[50].rank).toBe(51);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.loadingMore).toBe(false);
  });

  it('stops hasMore at the end of the list when a short page is returned', async () => {
    apiGet
      .mockResolvedValueOnce(respond(makeEntries(1, 50), 70))
      .mockResolvedValueOnce(respond(makeEntries(51, 20), 70));

    const { result } = renderHook(() => useLeaderboard({ limit: 50 }));

    await act(async () => {
      await result.current.fetchLeaderboard('all', 'reset');
    });
    await act(async () => {
      await result.current.loadMore('all');
    });

    expect(result.current.entries).toHaveLength(70);
    expect(result.current.hasMore).toBe(false);
  });

  it('resets to offset 0 and replaces entries when the filter is re-applied', async () => {
    apiGet
      .mockResolvedValueOnce(respond(makeEntries(1, 50), 120))
      .mockResolvedValueOnce(respond(makeEntries(51, 50), 120))
      .mockResolvedValueOnce(respond(makeEntries(1, 10), 10));

    const { result } = renderHook(() => useLeaderboard({ limit: 50 }));

    await act(async () => {
      await result.current.fetchLeaderboard('all', 'reset');
    });
    await act(async () => {
      await result.current.loadMore('all');
    });
    await act(async () => {
      await result.current.fetchLeaderboard('week', 'reset', null);
    });

    expect(apiGet).toHaveBeenLastCalledWith('/public/leaderboard?period=week&limit=50&offset=0');
    expect(result.current.entries).toHaveLength(10);
    expect(result.current.entries[0].rank).toBe(1);
    expect(result.current.hasMore).toBe(false);
  });

  it('forwards the cohort filter and retains it across load more', async () => {
    apiGet
      .mockResolvedValueOnce(respond(makeEntries(1, 50), 120))
      .mockResolvedValueOnce(respond(makeEntries(51, 50), 120));

    const { result } = renderHook(() => useLeaderboard({ limit: 50 }));

    await act(async () => {
      await result.current.fetchLeaderboard('all', 'reset', 'cohort-7');
    });
    await act(async () => {
      await result.current.loadMore('all');
    });

    expect(apiGet).toHaveBeenLastCalledWith(
      '/public/leaderboard?period=all&limit=50&offset=50&cohortId=cohort-7',
    );
  });

  it('reports an error state when the request fails', async () => {
    apiGet.mockRejectedValueOnce(new Error('boom'));

    const { result } = renderHook(() =>
      useLeaderboard({ limit: 50, errorMessages: { networkFailed: 'Network failed' } }),
    );

    await act(async () => {
      await result.current.fetchLeaderboard('all', 'reset');
    });

    await waitFor(() => expect(result.current.error).toBe('Network failed'));
    expect(result.current.loading).toBe(false);
    expect(result.current.entries).toHaveLength(0);
  });
});
