import { useCallback, useEffect, useState } from 'react';
import { getUserCredentials } from '@/core/services/credentials';
import type { LearnerCredential } from '@/core/services/credentials';

interface UseUserCredentialsResult {
  credentials: LearnerCredential[];
  loading: boolean;
  /** True when the request failed (as opposed to "no credentials"). */
  error: boolean;
  refetch: () => void;
}

/**
 * Loads a learner's own credentials for their profile.
 *
 * Fetching is skipped entirely when `userId` is empty (e.g. a public profile
 * visitor), so the component never issues a request the API would reject.
 */
export function useUserCredentials(userId: string | undefined): UseUserCredentialsResult {
  const [credentials, setCredentials] = useState<LearnerCredential[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!userId) {
      setCredentials([]);
      setError(false);
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    setError(false);
    (async () => {
      try {
        const result = await getUserCredentials(userId);
        if (!mounted) return;
        setCredentials(result);
      } catch {
        if (!mounted) return;
        setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [userId, reloadKey]);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  return { credentials, loading, error, refetch };
}
