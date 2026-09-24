import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Edit3, User, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useProfile } from '../../../shared/hooks/useProfile';
import { useSkillAchievements } from '../../../shared/hooks/useSkillAchievements';
import EditModal from '../components/profile/EditModal';
import { ProfileSkeleton } from '../components/StudentSkeletons';
import SEO from '../../../shared/components/SEO';
import ProfileIdentityBlock from '../../../shared/components/profile/ProfileIdentityBlock';
import CpLogo from '../../../shared/components/CpLogo';
import { QyvoraMark } from '../../../shared/components/brand';
import ProfileMetricsStrip from '../../../shared/components/profile/ProfileMetricsStrip';
import AchievementsSection from '../../../shared/components/profile/AchievementsSection';
import ContributionCalendar from '../../../shared/components/profile/ContributionCalendar';
import ActivityTimeline from '../../../shared/components/profile/ActivityTimeline';
import LabsModule from '../../../shared/components/profile/LabsModule';
import CoursesModule from '../../../shared/components/profile/CoursesModule';
import TrophyCabinet from '../../../shared/components/profile/TrophyCabinet';
import type { ProfileSectionId } from '../../../shared/types/profile';

const Profile: React.FC = () => {
  const { username: paramUsername } = useParams<{ username?: string }>();
  const { user: authUser } = useAuth();
  const [editOpen, setEditOpen] = useState(false);

  const {
    profile,
    rawProfile,
    loading,
    activityDates,
    isOwnProfile,
    setRawProfile,
  } = useProfile({ paramUsername, authUser });

  const { achievements: skillAchievements } = useSkillAchievements();

  const editInitial = profile ? {
    name: profile.displayName,
    hackerHandle: profile.username,
    bio: profile.bio,
    organization: profile.organization,
  } : { name: '', hackerHandle: '', bio: '', organization: '' };

  const visibleSections: ProfileSectionId[] = useMemo(() => {
    if (!profile) return [];
    const sections: ProfileSectionId[] = ['identity', 'stats', 'achievements'];
    if (Object.keys(activityDates).length > 0 || profile.completedRooms.length > 0) {
      sections.push('activity');
    }
    if (profile.completedRooms.length > 0) sections.push('labs');
    if (profile.coursesCompleted > 0 || profile.completedCourseIds.length > 0) sections.push('courses');
    sections.push('trophy');
    return sections;
  }, [profile, activityDates]);

  if (loading || !profile) return <ProfileSkeleton />;

  return (
    <div className="min-h-full bg-canvas">
      <SEO
        title={`@${profile.username}'s Profile`}
        description={`View the operator profile, rank, and accomplishments of @${profile.username} on QYVORA. - ${profile.rank} | ${profile.cp.toLocaleString()} CP earned.`}
        image="https://qyvora.netlify.app/og-image.svg"
        noindex
      />

      <div className="w-full px-3 pb-16 pt-6 md:px-4 md:pb-20 md:pt-8 lg:px-6 lg:pb-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-24">
              <section id="profile-section-identity">
                <ProfileIdentityBlock
                  id={profile.id}
                  handle={profile.username}
                  name={profile.displayName || undefined}
                  bio={profile.bio || undefined}
                  rank={profile.rank}
                  organization={profile.organization || undefined}
                  email={isOwnProfile ? profile.email : undefined}
                  actions={isOwnProfile ? [
                    { label: "Edit Profile", onClick: () => setEditOpen(true), icon: <Edit3 className="w-3.5 h-3.5" /> },
                  ] : []}
                  showShare
                  showPublicView={isOwnProfile}
                  publicViewPath={`/@${profile.username}`}
                  xpLevel={profile.xpLevel}
                  xpCurrent={profile.xpCurrent}
                  xpToNext={profile.xpToNext}
                  joinDate={profile.joinDate || undefined}
                  country={profile.country || undefined}
                  website={profile.website || undefined}
                  github={profile.github || undefined}
                  linkedin={profile.linkedin || undefined}
                  twitter={profile.twitter || undefined}
                />
              </section>
            </div>
          </aside>

          <main className="lg:col-span-8 space-y-6">
            <section id="profile-section-stats">
              <ProfileMetricsStrip metrics={[
                { icon: <CpLogo className="w-5 h-5" />, value: profile.cp.toLocaleString(), accent: true, label: 'CP' },
                { icon: <User className="w-5 h-5" />, value: profile.rank, label: 'Rank' },
                { icon: <QyvoraMark className="w-4 h-4" />, value: profile.labsCompleted || profile.completedRooms.length, label: 'Labs' },
                { icon: <QyvoraMark className="w-4 h-4" />, value: profile.coursesCompleted, label: 'Courses' },
                { icon: <TrendingUp className="w-5 h-5" />, value: profile.xpLevel, label: 'Level' },
                { icon: <Calendar className="w-5 h-5" />, value: profile.joinDate ? new Date(profile.joinDate).getFullYear() : '—', label: 'Since' },
              ]} />
            </section>

            <section id="profile-section-achievements">
              <AchievementsSection
                rooms={profile.completedRooms}
                bootcampCompleted={profile.bootcampCompleted}
                labsCompleted={profile.labsCompleted}
                coursesCompleted={profile.coursesCompleted}
                completedPhaseIds={profile.completedPhaseIds}
                completedCourseIds={profile.completedCourseIds}
                skillAchievements={skillAchievements}
              />
            </section>

            {visibleSections.includes('activity') && (
              <section id="profile-section-activity">
                <div className="space-y-6">
                  <ActivityTimeline profile={profile} />
                  {Object.keys(activityDates).length > 0 && (
                    <div className="rounded-2xl border border-border-subtle bg-surface p-5 md:p-6">
                      <ContributionCalendar activityDates={activityDates} />
                    </div>
                  )}
                </div>
              </section>
            )}

            {visibleSections.includes('courses') && (
              <section id="profile-section-courses">
                <CoursesModule
                  coursesCompleted={profile.coursesCompleted}
                  courseIds={profile.completedCourseIds}
                />
              </section>
            )}

            {visibleSections.includes('labs') && (
              <section id="profile-section-labs">
                <LabsModule
                  completedRooms={profile.completedRooms}
                  labsCompleted={profile.labsCompleted}
                />
              </section>
            )}

            <section id="profile-section-trophy">
              <TrophyCabinet profile={profile} />
            </section>
          </main>
        </div>
      </div>

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