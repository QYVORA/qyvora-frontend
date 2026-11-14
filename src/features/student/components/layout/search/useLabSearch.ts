import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import {
  buildBootcampRoomLabs,
  HACKER_PROTOCOL_BOOTCAMP_ID,
  UNIFIED_LABS,
  type UnifiedLab,
} from '@/features/student/data/labs';
import { searchLabs } from './labSearch';

/**
 * Lab search index for the topbar.
 *
 * The curated catalogue is available immediately. Bootcamp rooms are large, so
 * their config is only imported the first time search is opened. Results stay
 * derived from real `UnifiedLab` records — no hardcoded search fixtures.
 */
export function useLabSearch(query: string, active: boolean, limit = 8) {
  const [rooms, setRooms] = useState<UnifiedLab[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const requestedRef = useRef(false);
  const requestIdRef = useRef(0);

  const load = useCallback(() => {
    requestedRef.current = true;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsLoading(true);
    setError(false);

    void import('@/features/student/constants/bootcampConfig')
      .then(({ BOOTCAMP_CONFIG }) => {
        if (requestId !== requestIdRef.current) return;
        setRooms(buildBootcampRoomLabs(BOOTCAMP_CONFIG, HACKER_PROTOCOL_BOOTCAMP_ID));
      })
      .catch(() => {
        if (requestId === requestIdRef.current) setError(true);
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (active && !requestedRef.current) load();
  }, [active, load]);

  const retry = useCallback(() => {
    requestedRef.current = false;
    load();
  }, [load]);

  const entries = useMemo(() => [...UNIFIED_LABS, ...rooms], [rooms]);
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(
    () => searchLabs(entries, deferredQuery, limit),
    [deferredQuery, entries, limit],
  );

  return {
    results,
    isLoading,
    error,
    retry,
    isStale: query !== deferredQuery,
  };
}
