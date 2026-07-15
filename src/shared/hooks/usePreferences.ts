import { useState, useEffect, useCallback } from 'react';
import api from '../../core/services/api';

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    newBlogs: boolean;
    newNews: boolean;
    courseUpdates: boolean;
    marketplaceAlerts: boolean;
    competitiveEvents: boolean;
    systemUpdates: boolean;
    soundEnabled: boolean;
    desktopNotifications: boolean;
  };
  learning: {
    preferredDifficulty: 'beginner' | 'intermediate' | 'advanced';
    studyReminderTime: string | null;
    weeklyGoalHours: number;
    showHints: boolean;
    autoPlayVideos: boolean;
    showCodeExamples: boolean;
  };
  display: {
    theme: 'dark' | 'light';
    language: string;
    compactMode: boolean;
    showAnimations: boolean;
    fontSize: 'small' | 'medium' | 'large';
    codeFontSize: number;
    codeFontFamily: string;
    codeLineNumbers: boolean;
    codeMinimap: boolean;
  };
}

const DEFAULT_PREFS: UserPreferences = {
  notifications: { email: true, push: true, sms: false, newBlogs: true, newNews: true, courseUpdates: true, marketplaceAlerts: true, competitiveEvents: true, systemUpdates: true, soundEnabled: true, desktopNotifications: true },
  learning: { preferredDifficulty: 'intermediate', studyReminderTime: null, weeklyGoalHours: 10, showHints: true, autoPlayVideos: true, showCodeExamples: true },
  display: { theme: 'dark', language: 'en', compactMode: false, showAnimations: true, fontSize: 'medium', codeFontSize: 14, codeFontFamily: 'Fira Code', codeLineNumbers: true, codeMinimap: false },
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    api.get('/profile/preferences')
      .then((res) => {
        if (mounted && res.data?.preferences) {
          setPreferences(res.data.preferences);
        }
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    setSaving(true);
    try {
      const res = await api.put('/profile/preferences', updates);
      if (res.data?.preferences) {
        setPreferences(res.data.preferences);
      }
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateNotification = useCallback(async (key: keyof UserPreferences['notifications'], value: boolean) => {
    return updatePreferences({ notifications: { ...preferences.notifications, [key]: value } });
  }, [preferences.notifications, updatePreferences]);

  const updateLearning = useCallback(async (key: keyof UserPreferences['learning'], value: any) => {
    return updatePreferences({ learning: { ...preferences.learning, [key]: value } });
  }, [preferences.learning, updatePreferences]);

  const updateDisplay = useCallback(async (key: keyof UserPreferences['display'], value: any) => {
    return updatePreferences({ display: { ...preferences.display, [key]: value } });
  }, [preferences.display, updatePreferences]);

  return {
    preferences,
    loading,
    saving,
    updatePreferences,
    updateNotification,
    updateLearning,
    updateDisplay,
  };
}
