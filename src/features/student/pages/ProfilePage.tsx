import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Edit3, User, FlaskConical, GraduationCap, Trophy, Zap, Flame } from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useProfile } from '../../../shared/hooks/useProfile';
import EditModal from '../components/profile/EditModal';
import { ProfileSkeleton } from '../components/StudentSkeletons';
import SEO from '../../../shared/components/SEO';
import ProfileIdentityBlock from '../../../shared/components/profile/ProfileIdentityBlock';
import ProfileStatCard from '../../../shared/components/ui/CardStat';
import ProfileSectionNav from '../../../shared/components/profile/ProfileSectionNav';
import AchievementsSection from '../../../shared/components/profile/AchievementsSection';
import ContributionCalendar from '../../../shared/components/profile/ContributionCalendar';
import ActivityTimeline from '../../../shared/components/profile/ActivityTimeline';
import LabsModule from '../../../shared/components/profile/LabsModule';
import CoursesModule from '../../../shared/components/profile/CoursesModule';
import TrophyCabinet from '../../../shared/components/profile/TrophyCabinet';
import type { ProfileSectionId } from '../../../shared/types/profile';

const Profile: React.FC = () => {
  const { t } = useTranslation();
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
    if (profile.coursesCompleted > 0) sections.push('courses');
    sections.push('trophy');
    return sections;
  }, [profile, activityDates]);

  if (loading || !profile) return <ProfileSkeleton />;

  return (
    <div className="bg-bg">
      <SEO
        title={`@${profile.username}'s Profile`}
        description={`View the operator profile, rank, and accomplishments of @${profile.username} on QYVORA. — ${profile.rank} — ${profile.cp.toLocaleString()} CP earned.`}
        image="https://qyvora.netlify.app/favicon.png"
        noindex
      />

      {/* Mobile section nav (sticky horizontal tabs) */}
      <ProfileSectionNav visibleSections={visibleSections} />

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24">
          {/* Main content */}
          <div className="space-y-6">
            {/* ── Identity Section ── */}
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
                  { label: t('student.profile.edit'), onClick: () => setEditOpen(true), icon: <Edit3 className="w-3.5 h-3.5" /> },
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

            {/* ── Stats Section ── */}
            <section id="profile-section-stats">
              <div className="grid grid-cols-2 gap-4">
                <ProfileStatCard
                  icon={<Trophy className="w-5 h-5 text-accent" />}
                  label={t('student.profile.stats.cp')}
                  value={profile.cp.toLocaleString()}
                  accent
                />
                <ProfileStatCard
                  icon={<User className="w-5 h-5 text-text-muted" />}
                  label={t('student.profile.rank')}
                  value={profile.rank}
                />
                <ProfileStatCard
                  icon={<FlaskConical className="w-5 h-5 text-text-muted" />}
                  label={t('student.profile.stats.labs')}
                  value={profile.labsCompleted || profile.completedRooms.length}
                />
                <ProfileStatCard
                  icon={<GraduationCap className="w-5 h-5 text-text-muted" />}
                  label={t('student.profile.stats.courses')}
                  value={profile.coursesCompleted}
                />
                <ProfileStatCard
                  icon={<Flame className="w-5 h-5 text-text-muted" />}
                  label={t('student.profile.stats.streak', 'Streak')}
                  value={`${profile.xpLevel}`}
                />
                <ProfileStatCard
                  icon={<Zap className="w-5 h-5 text-text-muted" />}
                  label={t('student.profile.stats.xp', 'XP Level')}
                  value={`Lv.${profile.xpLevel}`}
                />
              </div>
            </section>

            {/* ── Activity Section ── */}
            {visibleSections.includes('activity') && (
              <section id="profile-section-activity">
                <div className="flex flex-col gap-6">
                  {/* Contribution Calendar */}
                  {Object.keys(activityDates).length > 0 && (
                    <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
                      <ContributionCalendar activityDates={activityDates} />
                    </div>
                  )}

                  {/* Activity Timeline */}
                  <ActivityTimeline profile={profile} />
                </div>
              </section>
            )}

            {/* ── Achievements Section ── */}
            <section id="profile-section-achievements">
              <AchievementsSection
                rooms={profile.completedRooms}
                bootcampCompleted={profile.bootcampCompleted}
                labsCompleted={profile.labsCompleted}
                coursesCompleted={profile.coursesCompleted}
              />
            </section>

            {/* ── Labs Section ── */}
            {visibleSections.includes('labs') && (
              <section id="profile-section-labs">
                <LabsModule
                  completedRooms={profile.completedRooms}
                  labsCompleted={profile.labsCompleted}
                />
              </section>
            )}

            {/* ── Courses Section ── */}
            {visibleSections.includes('courses') && (
              <section id="profile-section-courses">
                <CoursesModule coursesCompleted={profile.coursesCompleted} />
              </section>
            )}

            {/* ── Trophy Cabinet Section ── */}
            <section id="profile-section-trophy">
              <TrophyCabinet profile={profile} />
            </section>
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
