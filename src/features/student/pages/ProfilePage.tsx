import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Edit3, User, FlaskConical, GraduationCap, Zap, Flame } from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useProfile } from '../../../shared/hooks/useProfile';
import { useSkillAchievements } from '../../../shared/hooks/useSkillAchievements';
import EditModal from '../components/profile/EditModal';
import FadeIn from '../../../shared/components/ui/FadeIn';
import { ProfileSkeleton } from '../components/StudentSkeletons';
import SEO from '../../../shared/components/SEO';
import ProfileIdentityBlock from '../../../shared/components/profile/ProfileIdentityBlock';
import CpLogo from '../../../shared/components/CpLogo';
import ProfileMetricsStrip from '../../../shared/components/profile/ProfileMetricsStrip';
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
    if (profile.coursesCompleted > 0) sections.push('courses');
    sections.push('trophy');
    return sections;
  }, [profile, activityDates]);

  if (loading || !profile) return <ProfileSkeleton />;

  return (
    <FadeIn>
    <div>
      <SEO
        title={`@${profile.username}'s Profile`}
        description={`View the operator profile, rank, and accomplishments of @${profile.username} on QYVORA. — ${profile.rank} — ${profile.cp.toLocaleString()} CP earned.`}
        image="https://qyvora.netlify.app/og-image.svg"
        noindex
      />

      <div className="bg-bg px-3 md:px-4 lg:px-6 pt-8 pb-10">
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
      </div>

      <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10">
        <section id="profile-section-stats">
          <ProfileMetricsStrip metrics={[
            { icon: <CpLogo className="w-5 h-5" />, value: profile.cp.toLocaleString(), accent: true },
            { icon: <User className="w-5 h-5" />, value: profile.rank },
            { icon: <FlaskConical className="w-5 h-5" />, value: profile.labsCompleted || profile.completedRooms.length },
            { icon: <GraduationCap className="w-5 h-5" />, value: profile.coursesCompleted },
            { icon: <Flame className="w-5 h-5" />, value: profile.xpLevel },
            { icon: <Zap className="w-5 h-5" />, value: `Lv.${profile.xpLevel}` },
          ]} />
        </section>
      </div>

      <div className="bg-bg px-3 md:px-4 lg:px-6 py-10">
        {visibleSections.includes('activity') && (
          <section id="profile-section-activity">
            <div className="flex flex-col gap-6">
              <ActivityTimeline profile={profile} />
              {Object.keys(activityDates).length > 0 && (
                <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
                  <ContributionCalendar activityDates={activityDates} />
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10">
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
      </div>

      <div className="bg-bg px-3 md:px-4 lg:px-6 py-10">
        {visibleSections.includes('labs') && (
          <section id="profile-section-labs">
            <LabsModule
              completedRooms={profile.completedRooms}
              labsCompleted={profile.labsCompleted}
            />
          </section>
        )}
      </div>

      <div className="bg-bg-alt px-3 md:px-4 lg:px-6 py-10">
        {visibleSections.includes('courses') && (
          <section id="profile-section-courses">
            <CoursesModule coursesCompleted={profile.coursesCompleted} />
          </section>
        )}
      </div>

      <div className="bg-bg px-3 md:px-4 lg:px-6 py-10 pb-20 lg:pb-24">
        <section id="profile-section-trophy">
          <TrophyCabinet profile={profile} />
        </section>
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
    </FadeIn>
  );
};

export default Profile;
