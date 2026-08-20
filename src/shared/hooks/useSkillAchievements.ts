import { useState, useEffect, useCallback } from 'react';
import api from '@/core/services/api';

interface SkillAchievement {
  skill: string;
  label: string;
  color: string;
  scenariosCompleted: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

interface UseSkillAchievementsResult {
  achievements: SkillAchievement[];
  loading: boolean;
  error: string;
  refetch: () => void;
}

export function useSkillAchievements(): UseSkillAchievementsResult {
  const [achievements, setAchievements] = useState<SkillAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAchievements = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/student/skill-achievements');
      if (res.data?.success) {
        setAchievements(res.data.achievements || []);
      } else {
        setError('Failed to load skill achievements.');
      }
    } catch {
      setError('Failed to load skill achievements.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  return { achievements, loading, error, refetch: fetchAchievements };
}
