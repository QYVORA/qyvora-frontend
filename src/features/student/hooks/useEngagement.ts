import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/core/services/api';
import type { EngagementResponse } from '../data/missions';

let sharedData: EngagementResponse | null = null;
let sharedTimestamp = 0;
let inFlightPromise: Promise<EngagementResponse | null> | null = null;
const CACHE_TTL_MS = 60_000;

const isCacheValid = () => sharedData !== null && Date.now() - sharedTimestamp < CACHE_TTL_MS;

const loadEngagement = async (): Promise<EngagementResponse | null> => {
  if (isCacheValid()) return sharedData;
  if (inFlightPromise) return inFlightPromise;

  inFlightPromise = api.get('/student/engagement')
    .then((res) => {
      sharedData = res.data;
      sharedTimestamp = Date.now();
      return sharedData;
    })
    .catch(() => null)
    .finally(() => { inFlightPromise = null; });

  return inFlightPromise;
};

export default function useEngagement() {
  const [data, setData] = useState<EngagementResponse | null>(sharedData);
  const [loading, setLoading] = useState(!isCacheValid());
  const mountedRef = useRef(true);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await loadEngagement();
    if (mountedRef.current) {
      setData(result);
      setLoading(false);
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

  return { data, loading, refetch };
}
