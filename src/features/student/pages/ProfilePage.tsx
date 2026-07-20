import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Edit3, User, FlaskConical, GraduationCap, Trophy } from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import api from '../../../core/services/api';
import EditModal from '../components/profile/EditModal';
import { ProfileSkeleton } from '../components/StudentSkeletons';
import SEO from '../../../shared/components/SEO';
import ProfileIdentityBlock from '../../../shared/components/profile/ProfileIdentityBlock';
import ProfileStatCard from '../../../shared/components/profile/ProfileStatCard';
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
    labsCompleted: Number(profileApi?.labsCompleted || 0),
    coursesCompleted: Number(profileApi?.coursesCompleted || 0),
  }), [isOwnProfile, profileApi, authUser, displayHandle, t]);

  const rooms = useMemo(() => Array.isArray(profileData.completedRooms) ? profileData.completedRooms : [], [profileData.completedRooms]);
  const bootcampCompleted = authUser?.bootcampStatus === 'completed' || profileApi?.bootcampStatus === 'completed';

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
        {/* Identity Block — full width */}
        <ProfileIdentityBlock
          id={profileData.id}
          handle={profileData.username}
          name={profileData.name || undefined}
          bio={profileData.bio || undefined}
          rank={profileData.rank}
          organization={profileData.organization || undefined}
          email={isOwnProfile ? authUser?.email : undefined}
          actions={isOwnProfile ? [
            { label: t('student.profile.edit'), onClick: () => setEditOpen(true), icon: <Edit3 className="w-3.5 h-3.5" /> },
          ] : []}
          showShare
          showPublicView={isOwnProfile}
          publicViewPath={`/@${profileData.username}`}
        />

        {/* Two-column layout on desktop: main content left, stats right */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column — calendar + achievements */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Contribution Calendar */}
            {Object.keys(activityDates).length > 0 && (
              <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
                <ContributionCalendar activityDates={activityDates} />
              </div>
            )}

            {/* Achievements — pinned + full grid */}
            <AchievementsSection
              rooms={rooms}
              bootcampCompleted={bootcampCompleted}
              labsCompleted={profileData.labsCompleted}
              coursesCompleted={profileData.coursesCompleted}
            />
          </div>

          {/* Right column — stat cards */}
          <div className="w-full lg:w-[340px] shrink-0 grid grid-cols-2 lg:grid-cols-1 gap-4">
            <ProfileStatCard
              icon={<Trophy className="w-5 h-5 text-accent" />}
              label={t('student.profile.stats.cp')}
              value={profileData.cp.toLocaleString()}
              accent
            />
            <ProfileStatCard
              icon={<User className="w-5 h-5 text-text-muted" />}
              label={t('student.profile.rank')}
              value={profileData.rank}
            />
            <ProfileStatCard
              icon={<FlaskConical className="w-5 h-5 text-text-muted" />}
              label={t('student.profile.stats.labs')}
              value={profileData.labsCompleted || rooms.length}
            />
            <ProfileStatCard
              icon={<GraduationCap className="w-5 h-5 text-text-muted" />}
              label={t('student.profile.stats.courses')}
              value={profileData.coursesCompleted}
            />
          </div>
        </div>
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
