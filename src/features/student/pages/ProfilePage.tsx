import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { Mail, Edit3, Activity, User } from 'lucide-react';
import ShareProfile from '../../../shared/components/ShareProfile';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import Identicon from '../../../shared/components/Identicon';
import api from '../../../core/services/api';
import EditModal from '../components/profile/EditModal';
import { ProfileSkeleton } from '../components/StudentSkeletons';
import SEO from '../../../shared/components/SEO';
import LearningOverviewCard from '../components/learning/LearningOverviewCard';
import AchievementsSection from '../../../shared/components/profile/AchievementsSection';
import ContributionCalendar from '../../../shared/components/profile/ContributionCalendar';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { username: paramUsername } = useParams<{ username?: string }>();
  const { user: authUser } = useAuth();
  const { addToast } = useToast();
  const [profileApi, setProfileApi] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activityDates, setActivityDates] = useState<Record<string, number>>({});

  const isOwnProfile = !paramUsername || paramUsername === authUser?.username;
  const displayHandle = paramUsername || authUser?.username || 'operator';

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = isOwnProfile
          ? await api.get('/profile')
          : await api.get(`/public/users/${encodeURIComponent(paramUsername || '')}`);
        if (!mounted) return;
        setProfileApi(res.data || null);
      } catch {
        if (!mounted) return;
        addToast(t('toast.profileLoadFailed'), 'error');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [isOwnProfile, paramUsername]);

  // Fetch activity calendar data
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

  const profileData = useMemo(() => ({
    id: profileApi?.id || authUser?.uid || '',
    username: isOwnProfile
      ? (profileApi?.hackerHandle || profileApi?.name || displayHandle)
      : (profileApi?.handle || profileApi?.name || displayHandle),
    rank: String(profileApi?.xpSummary?.rank || profileApi?.rank || authUser?.rank || t('stat.candidate')),
    bio: String(profileApi?.bio || ''),
    organization: String(profileApi?.organization || ''),
    name: String(profileApi?.name || ''),
    cp: Number(profileApi?.cpPoints || authUser?.cp || 0),
    completedRooms: Array.isArray(profileApi?.learn?.completedRooms) ? profileApi.learn.completedRooms : [],
  }), [isOwnProfile, profileApi, authUser, displayHandle]);

  const rooms = useMemo(() => Array.isArray(profileData.completedRooms) ? profileData.completedRooms : [], [profileData.completedRooms]);
  const bootcampCompleted = authUser?.bootcampStatus === 'completed' || profileApi?.bootcampStatus === 'completed';

  const badgeCount = bootcampCompleted ? 1 : 0;
  const achievementCount = badgeCount + rooms.length;

  const editInitial = {
    name: profileData.name,
    hackerHandle: profileData.username,
    bio: profileData.bio,
    organization: profileData.organization,
  };

  if (loading) return <ProfileSkeleton />;

  return (
    <div className="bg-bg">
      <SEO
        title={`@${profileData.username}'s Profile`}
        description={`View the operator profile, rank, and accomplishments of @${profileData.username} on QYVORA. — ${profileData.rank} — ${profileData.cp.toLocaleString()} CP earned.`}
        image="https://qyvora.netlify.app/favicon.png"
        noindex
      />

      <div className="px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-6">
        {/* Profile Overview Card */}
        <LearningOverviewCard
          icon={<User className="w-6 h-6 text-bg" />}
          title={`@${profileData.username}`}
          description={profileData.bio || `${profileData.rank} operator`}
          avatar={
            <div className="w-full h-full bg-black flex items-center justify-center">
              <Identicon value={profileData.id} size={256} className="w-full h-full" />
            </div>
          }
          stats={[
            { label: t('student.profile.stats.cp'), value: profileData.cp.toLocaleString(), accent: true },
            { label: t('student.profile.rank'), value: profileData.rank },
            { label: t('student.profile.stats.rooms'), value: rooms.length },
          ]}
          action={isOwnProfile ? {
            label: t('student.profile.edit'),
            onClick: () => setEditOpen(true),
            icon: <Edit3 className="w-4 h-4" />,
          } : undefined}
        />

        {/* Meta Row: info + actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
            {profileData.organization && (
              <span className="flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-accent" /> {profileData.organization}
              </span>
            )}
            {isOwnProfile && authUser?.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-accent" /> {authUser.email}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/@${profileData.username}`}
              className="btn-secondary !text-xs inline-flex items-center gap-2"
            >
              {t('student.profile.publicView')}
            </Link>
            <ShareProfile handle={profileData.username} />
          </div>
        </div>

        {/* Achievements */}
        <AchievementsSection
          rooms={rooms}
          bootcampCompleted={bootcampCompleted}
          achievementCount={achievementCount}
        />

        {/* Contribution Calendar */}
        {isOwnProfile && Object.keys(activityDates).length > 0 && (
          <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
            <ContributionCalendar activityDates={activityDates} />
          </div>
        )}
      </div>

      {isOwnProfile && (
        <EditModal
          open={editOpen}
          onOpenChange={setEditOpen}
          initial={editInitial}
          onSaved={(data) => setProfileApi(data)}
        />
      )}
    </div>
  );
};

export default Profile;
