import { useState, useEffect, useCallback } from 'react';
import api from '@/core/services/api';
import { isAdvancedLab, getLabCpCost } from '@/features/student/data/simulations/labAccess';

interface LabAccessState {
  purchased: Set<string>;
  loading: boolean;
}

const useLabAccess = () => {
  const [state, setState] = useState<LabAccessState>({ purchased: new Set(), loading: true });

  const fetchPurchases = useCallback(async () => {
    try {
      const res = await api.get('/cp/transactions?limit=200');
      const items = res.data?.items || [];
      const purchased = new Set<string>();
      for (const item of items) {
        if (item.type === 'purchase' && item.metadata?.slug) {
          purchased.add(item.metadata.slug);
        }
      }
      setState({ purchased, loading: false });
    } catch {
      setState({ purchased: new Set(), loading: false });
    }
  }, []);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const isLocked = useCallback((scenarioId: string): boolean => {
    if (!isAdvancedLab(scenarioId)) return false;
    return !state.purchased.has(scenarioId);
  }, [state.purchased]);

  const purchaseLab = useCallback(async (scenarioId: string, labId: string): Promise<boolean> => {
    const cpCost = getLabCpCost(scenarioId);
    if (!cpCost) return false;

    try {
      const res = await api.post('/cp/purchase-lab', { scenarioId, labId, cpCost });
      if (res.data?.success) {
        setState(prev => ({
          ...prev,
          purchased: new Set([...prev.purchased, scenarioId]),
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  return { ...state, isLocked, purchaseLab, refetch: fetchPurchases };
};

export default useLabAccess;
