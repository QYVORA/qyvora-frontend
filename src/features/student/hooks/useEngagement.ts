import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/core/services/api';
import type { EngagementResponse } from '../data/missions';

let sharedData: EngagementResponse | null = null;
let sharedTimestamp = 0;
let inFlightPromise: Promise<EngagementResponse> | null = null;
const CACHE_TTL_MS = 60_000;

const isCacheValid = () => sharedData !== null && Date.now() - sharedTimestamp < CACHE_TTL_MS;

const loadEngagement = async (): Promise<EngagementResponse> => {
  if (isCacheValid() && sharedData) return sharedData;
  if (inFlightPromise) return inFlightPromise;

  inFlightPromise = api.get<EngagementResponse>('/student/engagement')
    .then((res) => {
      if (!res.data) throw new Error('The engagement response was empty.');
      sharedData = res.data;
      sharedTimestamp = Date.now();
      return sharedData;
    })
    .finally(() => { inFlightPromise = null; });

  return inFlightPromise;
};

export default function useEngagement() {
  const [data, setData] = useState<EngagementResponse | null>(sharedData);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(!isCacheValid());
  const mountedRef = useRef(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loadEngagement();
      if (mountedRef.current) setData(result);
    } catch (reason) {
      if (mountedRef.current) {
        setError(reason instanceof Error ? reason : new Error('Could not load weekly mission data.'));
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => { mountedRef.current = false; };
  }, [load]);

  const refetch = useCallback(() => {
    sharedData = null;
    sharedTimestamp = 0;
    load();
  }, [load]);

  return { data, loading, error, refetch };
}
