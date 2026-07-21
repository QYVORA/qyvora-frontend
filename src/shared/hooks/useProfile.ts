import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../core/services/api';
import type { ProfileApiResponse, ProfileData, CompletedRoom } from '../types/profile';

interface UseProfileOptions {
  /** Username from URL params. If undefined, fetches own profile. */
  paramUsername?: string;
  /** Auth user from AuthContext. */
  authUser: {
    uid: string;
    username: string;
    email: string;
    rank: string;
    cp: number;
    bootcampStatus: string;
  } | null;
}

interface UseProfileResult {
  profile: ProfileData | null;
  rawProfile: ProfileApiResponse | null;
  loading: boolean;
  activityDates: Record<string, number>;
  isOwnProfile: boolean;
  setRawProfile: (data: ProfileApiResponse | null) => void;
}

export function useProfile({ paramUsername, authUser }: UseProfileOptions): UseProfileResult {
  const { t } = useTranslation();
  const [rawProfile, setRawProfile] = useState<ProfileApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activityDates, setActivityDates] = useState<Record<string, number>>({});

  const isOwnProfile = !paramUsername || paramUsername === authUser?.username;
  const displayHandle = paramUsername || authUser?.username || 'operator';

  // Fetch profile data
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = isOwnProfile
          ? await api.get('/profile')
          : await api.get(`/public/users/${encodeURIComponent(paramUsername || '')}`);
        if (!mounted) return;
        setRawProfile(res.data || null);
      } catch {
        // silently fail — parent handles error state
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [isOwnProfile, paramUsername]);

  // Fetch activity calendar (own profile only)
  useEffect(() => {
    if (!isOwnProfile) return;
    let mounted = true;
    (async () => {
      try {
        const res = await api.get('/profile/activity-calendar?days=365');
        if (!mounted) return;
        if (res.data?.activityDates) {
          setActivityDates(res.data.activityDates);
        }
      } catch { /* ignore */ }
    })();
    return () => { mounted = false; };
  }, [isOwnProfile]);

  const profile = useMemo<ProfileData | null>(() => {
    if (!rawProfile && !authUser) return null;

    const api = rawProfile || {};
    const completedRooms: CompletedRoom[] = Array.isArray(api.learn?.completedRooms)
      ? api.learn!.completedRooms
      : [];

    return {
      id: (api.id || authUser?.uid || '') as string,
      username: isOwnProfile
        ? (api.hackerHandle || api.name || displayHandle)
        : (api.handle || api.name || displayHandle),
      displayName: String(api.name || ''),
      rank: String(api.xpSummary?.rank || api.rank || authUser?.rank || t('stat.candidate')),
      bio: String(api.bio || ''),
      organization: String(api.organization || ''),
      email: String(api.email || ''),
      cp: Number(api.cpPoints || authUser?.cp || 0),
      labsCompleted: Number(api.labsCompleted || 0),
      coursesCompleted: Number(api.coursesCompleted || 0),
      bootcampCompleted:
        authUser?.bootcampStatus === 'completed' ||
        api.bootcampStatus === 'completed' ||
        api.bootcampCompleted === true,
      completedRooms,
      xpLevel: Number(api.xpSummary?.level || 1),
      xpCurrent: Number(api.xpSummary?.xp || 0),
      xpToNext: Number(api.xpSummary?.xpToNext || 100),
      joinDate: String(api.createdAt || ''),
      country: String(api.country || ''),
      website: String(api.website || ''),
      github: String(api.github || ''),
      linkedin: String(api.linkedin || ''),
      twitter: String(api.twitter || ''),
    };
  }, [rawProfile, authUser, isOwnProfile, displayHandle, t]);

  const setProfileFromSave = useCallback((data: ProfileApiResponse) => {
    setRawProfile(data);
  }, []);

  return {
    profile,
    rawProfile,
    loading,
    activityDates,
    isOwnProfile,
    setRawProfile: setProfileFromSave,
  };
}
