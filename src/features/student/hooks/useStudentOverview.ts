import { useEffect, useState, useRef, useCallback } from 'react';
import api from '@/core/services/api';

const CACHE_TTL_MS = 20_000;

let sharedData: any = null;
let sharedTimestamp = 0;
let inFlightPromise: Promise<any> | null = null;

function isCacheValid(): boolean {
  return sharedData !== null && Date.now() - sharedTimestamp < CACHE_TTL_MS;
}

function fetchOverview(): Promise<any> {
  if (isCacheValid()) return Promise.resolve(sharedData);
  if (inFlightPromise) return inFlightPromise;

  inFlightPromise = api
    .get('/student/overview')
    .then((res) => {
      sharedData = res.data || null;
      sharedTimestamp = Date.now();
      return sharedData;
    })
    .catch((err) => {
      console.warn('[useStudentOverview] overview failed:', err?.response?.status || err?.message);
      throw err;
    })
    .finally(() => {
      inFlightPromise = null;
    });

  return inFlightPromise;
}

export default function useStudentOverview() {
  const [data, setData] = useState<any>(sharedData);
  const [loading, setLoading] = useState(!isCacheValid());
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchOverview()
      .then((d) => { if (mountedRef.current) setData(d); })
      .catch((err) => { if (mountedRef.current) setError(err); })
      .finally(() => { if (mountedRef.current) setLoading(false); });
  }, []);

  useEffect(() => { load(); }, [load]);

  const refetch = useCallback(() => {
    sharedData = null;
    sharedTimestamp = 0;
    load();
  }, [load]);

  return { data, loading, error, refetch };
}
