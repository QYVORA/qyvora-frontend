import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Edit3, User, TrendingUp, Calendar, Bug } from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import { useProfile } from '../../../shared/hooks/useProfile';
import { useSkillAchievements } from '../../../shared/hooks/useSkillAchievements';
import EditModal from '../components/profile/EditModal';
import { ProfileSkeleton } from '../components/StudentSkeletons';
import SEO from '../../../shared/components/SEO';
import ProfileIdentityBlock from '../../../shared/components/profile/ProfileIdentityBlock';
import ProfileLayout from '../../../shared/components/profile/ProfileLayout';
import RankLevelCard from '../../../shared/components/profile/RankLevelCard';
import SocialAccountConnection from '../../../shared/components/profile/SocialAccountConnection';
import CpLogo from '../../../shared/components/CpLogo';
import ProfileMetricsStrip from '../../../shared/components/profile/ProfileMetricsStrip';
import AchievementsSection from '../../../shared/components/profile/AchievementsSection';
import ContributionCalendar from '../../../shared/components/profile/ContributionCalendar';
import ActivityTimeline from '../../../shared/components/profile/ActivityTimeline';
import CoursesModule from '../../../shared/components/profile/CoursesModule';
import CertificatesModule from '../../../shared/components/profile/CertificatesModule';
import SectionCard from '@/shared/components/ui/SectionCard';
import { useUserCredentials } from '../../../shared/hooks/useUserCredentials';
import TrophyCabinet from '../../../shared/components/profile/TrophyCabinet';
import type { ProfileSectionId } from '../../../shared/types/profile';

const Profile: React.FC = () => {
  const { username: paramUsername } = useParams<{ username?: string }>();
  const { user: authUser } = useAuth();
  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editOpen, setEditOpen] = useState(false);

  const {
    profile,
    rawProfile,
    loading,
    activityDates,
    isOwnProfile,
    setRawProfile,
    refetch,
  } = useProfile({ paramUsername, authUser });

  const { achievements: skillAchievements } = useSkillAchievements();

  const {
    credentials,
    loading: credentialsLoading,
    error: credentialsError,
  } = useUserCredentials(isOwnProfile ? profile?.id : undefined);

  // Notify the outcome of the GitHub linking flow (backend redirects back here).
  const githubResult = searchParams.get('github');
  const githubError = searchParams.get('github_error');
  useEffect(() => {
    if (!isOwnProfile || (!githubResult && !githubError)) return;
    if (githubResult === 'connected') {
      addToast('GitHub connected.', 'success');
      refetch();
    } else if (githubError) {
      const messages: Record<string, string> = {
        no_alternative_login: 'Set a password before disconnecting GitHub.',
        github_already_linked: 'That GitHub account is already linked to another QYVORA account.',
        github_already_connected: 'This account already has a different GitHub account connected.',
        provider_not_configured: 'GitHub is not available right now.',
      };
      addToast(messages[githubError] || 'Could not connect GitHub.', 'error');
    }
    // Strip the result params so a refresh does not replay the toast.
    const next = new URLSearchParams(searchParams);
    next.delete('github');
    next.delete('github_error');
    setSearchParams(next, { replace: true });
  }, [isOwnProfile, githubResult, githubError]);

  const editInitial = profile ? {
    name: profile.displayName,
    hackerHandle: profile.username,
    bio: profile.bio,
    organization: profile.organization,
    website: profile.website,
    github: profile.github,
    linkedin: profile.linkedin,
    twitter: profile.twitter,
    country: profile.country,
  } : {
    name: '',
    hackerHandle: '',
    bio: '',
    organization: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
    country: '',
  };

  const visibleSections: ProfileSectionId[] = useMemo(() => {
    if (!profile) return [];
    const sections: ProfileSectionId[] = ['identity', 'stats', 'achievements'];
    if (Object.keys(activityDates).length > 0 || profile.completedRooms.length > 0) {
      sections.push('activity');
    }
    if (profile.completedRooms.length > 0) sections.push('labs');
    if (profile.labsCompleted > 0 || profile.completedCourseIds.length > 0 || profile.completedLabIds.length > 0) {
      sections.push('courses');
    }
    if (isOwnProfile) sections.push('credentials');
    sections.push('trophy');
    return sections;
  }, [profile, activityDates, isOwnProfile]);

  if (loading || !profile) return <ProfileSkeleton />;

  return (
    <div className="min-h-full bg-canvas">
      <SEO
        title={`@${profile.username}'s Profile`}
        description={`View the operator profile, rank, and accomplishments of @${profile.username} on QYVORA. - ${profile.rank} | ${profile.cp.toLocaleString()} CP earned.`}
        noindex
      />

      <ProfileLayout handle={profile.username} showCredentials={isOwnProfile}>
        <aside className="w-full min-w-0">
          <div className="w-full space-y-6 lg:sticky lg:top-[calc(var(--app-topbar-offset,var(--app-topbar-h,80px))+24px)]">
            <section id="profile-section-identity">
              <ProfileIdentityBlock
                id={profile.id}
                handle={profile.username}
                name={profile.displayName || undefined}
                bio={profile.bio || undefined}
                organization={profile.organization || undefined}
                email={isOwnProfile ? profile.email : undefined}
                actions={isOwnProfile ? [
                  { label: 'Edit profile', onClick: () => setEditOpen(true), icon: <Edit3 className="h-4 w-4" /> },
                ] : []}
                showShare
                showPublicView={isOwnProfile}
                publicViewPath={`/@${profile.username}`}
                joinDate={profile.joinDate || undefined}
                country={profile.country || undefined}
                website={profile.website || undefined}
                github={profile.github || (profile.githubConnected ? profile.githubProfileUrl : '') || undefined}
                githubConnected={profile.githubConnected}
                githubPublic={profile.githubPublic}
                githubProfileUrl={profile.githubProfileUrl}
                githubUsername={profile.githubUsername}
                linkedin={profile.linkedin || undefined}
                twitter={profile.twitter || undefined}
              />
            </section>

            <RankLevelCard
              rank={profile.rank}
              xpLevel={profile.xpLevel}
              xpCurrent={profile.xpCurrent}
              xpToNext={profile.xpToNext}
              cp={profile.cp}
            />

            {isOwnProfile && (
              <SocialAccountConnection
                githubConnected={profile.githubConnected}
                githubUsername={profile.githubUsername}
                githubProfileUrl={profile.githubProfileUrl}
                githubPublic={profile.githubPublic}
                passwordSet={profile.passwordSet}
                twitter={profile.twitter}
                linkedin={profile.linkedin}
                website={profile.website}
                onChanged={refetch}
              />
            )}

            <section id="profile-section-trophy">
              <TrophyCabinet profile={profile} />
            </section>
          </div>
        </aside>

        <main className="w-full min-w-0 space-y-6">
          <section id="profile-section-stats">
            <ProfileMetricsStrip metrics={[
              { icon: <CpLogo className="h-4 w-4" />, value: profile.cp.toLocaleString(), accent: true, label: 'CP' },
              { icon: <User className="h-4 w-4" />, value: profile.rank, label: 'Rank' },
              { icon: <Bug className="h-4 w-4" />, value: profile.labsCompleted, label: 'Labs' },
              { icon: <TrendingUp className="h-4 w-4" />, value: profile.xpLevel, label: 'Level' },
              { icon: <Calendar className="h-4 w-4" />, value: profile.joinDate ? new Date(profile.joinDate).getFullYear() : '—', label: 'Since' },
            ]} />
          </section>

          <section id="profile-section-yearly">
            <SectionCard title="Yearly activity">
              <ContributionCalendar activityDates={activityDates} />
            </SectionCard>
          </section>

          <section id="profile-section-achievements">
            <AchievementsSection
              bootcampCompleted={profile.bootcampCompleted}
              completedPhaseIds={profile.completedPhaseIds}
              completedCourseIds={profile.completedCourseIds}
              skillAchievements={skillAchievements}
            />
          </section>

          {visibleSections.includes('activity') && (
            <section id="profile-section-activity">
              <ActivityTimeline profile={profile} />
            </section>
          )}

          {visibleSections.includes('courses') && (
            <section id="profile-section-courses">
              <CoursesModule
                labsCompleted={profile.labsCompleted}
                labIds={[...profile.completedCourseIds, ...profile.completedLabIds]}
                showAllHref="/dashboard/labs"
              />
            </section>
          )}

          {visibleSections.includes('credentials') && (
            <section id="profile-section-credentials">
              <CertificatesModule
                credentials={credentials}
                loading={credentialsLoading}
                error={credentialsError}
              />
            </section>
          )}
        </main>
      </ProfileLayout>

      {isOwnProfile && (
        <EditModal
          open={editOpen}
          onOpenChange={setEditOpen}
          initial={editInitial}
          onSaved={(data) => setRawProfile(data)}
        />
      )}
    </div>
  );
};

export default Profile;
