import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getQoseInfo,
  getQoseRegistration,
  type QoseInfo,
  type QoseRegistrationState,
} from '../services/qose.service';

/**
 * Loads the QOSE catalogue copy and the signed-in user's registration in one
 * pass. The catalogue is public-to-auth users and cached for the page lifetime;
 * the registration is refreshed after any checkout/verification mutation.
 */
const useQoseRegistration = () => {
  const [info, setInfo] = useState<QoseInfo | null>(null);
  const [state, setState] = useState<QoseRegistrationState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async (options: { silent?: boolean } = {}) => {
    if (!options.silent) setLoading(true);
    setError('');
    try {
      const [nextInfo, nextState] = await Promise.all([getQoseInfo(), getQoseRegistration()]);
      if (!mounted.current) return;
      setInfo(nextInfo);
      setState(nextState);
    } catch (err: any) {
      if (!mounted.current) return;
      setError(err?.response?.data?.error || 'Could not load your QOSE registration.');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { info, state, loading, error, reload: load, setState };
};

export default useQoseRegistration;
