import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { IconArrowLeft } from '@/shared/components/icons';
import { User, FlaskConical, GraduationCap, Trophy, Zap, Flame } from 'lucide-react';
import NotFoundPage from '../../../shared/pages/NotFoundPage';
import api from '../../../core/services/api';
import PageLoader from '../../../shared/components/PageLoader';
import SEO from '../../../shared/components/SEO';
import { Navbar } from '../../../shared/components/layout';
import ProfileIdentityBlock from '../../../shared/components/profile/ProfileIdentityBlock';
import ProfileStatCard from '../../../shared/components/profile/ProfileStatCard';
import ProfileSectionNav from '../../../shared/components/profile/ProfileSectionNav';
import AchievementsSection from '../../../shared/components/profile/AchievementsSection';
import ContributionCalendar from '../../../shared/components/profile/ContributionCalendar';
import ActivityTimeline from '../../../shared/components/profile/ActivityTimeline';
import SkillsModule from '../../../shared/components/profile/SkillsModule';
import LabsModule from '../../../shared/components/profile/LabsModule';
import CoursesModule from '../../../shared/components/profile/CoursesModule';
import TrophyCabinet from '../../../shared/components/profile/TrophyCabinet';
import type { ProfileData, ProfileApiResponse, CompletedRoom, ProfileSectionId } from '../../../shared/types/profile';

const PublicProfile: React.FC = () => {
  const { handle: rawHandle } = useParams<{ handle: string }>();
  const location = useLocation();

  const isValidHandle = rawHandle && rawHandle.startsWith('@');
  const handle = isValidHandle ? rawHandle.slice(1) : '';

  const [profileApi, setProfileApi] = useState<ProfileApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activityDates, setActivityDates] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!handle) { setNotFound(true); setLoading(false); return; }
    let mounted = true;
    api.get(`/public/users/${encodeURIComponent(handle)}`)
      .then((res) => { if (mounted) setProfileApi(res.data || null); })
      .catch(() => { if (mounted) setNotFound(true); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [handle]);

  useEffect(() => {
    if (!handle) return;
    let mounted = true;
    api.get(`/public/users/${encodeURIComponent(handle)}/activity-calendar?days=365`)
      .then((res) => { if (mounted && res.data?.activityDates) setActivityDates(res.data.activityDates); })
      .catch(() => { /* ignore */ });
    return () => { mounted = false; };
  }, [handle]);

  const profile = useMemo<ProfileData | null>(() => {
    if (!profileApi) return null;
    const completedRooms: CompletedRoom[] = Array.isArray(profileApi.learn?.completedRooms)
      ? profileApi.learn!.completedRooms
      : [];
    return {
      id: String(profileApi.id || ''),
      username: String(profileApi.handle || handle),
      displayName: String(profileApi.name || ''),
      rank: String(profileApi.rank || 'Operator'),
      bio: String(profileApi.bio || ''),
      organization: String(profileApi.organization || ''),
      email: String(profileApi.email || ''),
      cp: Number(profileApi.cpPoints || 0),
      labsCompleted: Number(profileApi.labsCompleted || 0),
      coursesCompleted: Number(profileApi.coursesCompleted || 0),
      bootcampCompleted: profileApi.bootcampStatus === 'completed' || profileApi.bootcampCompleted === true,
      completedRooms,
      xpLevel: Number(profileApi.xpSummary?.level || 1),
      xpCurrent: Number(profileApi.xpSummary?.xp || 0),
      xpToNext: Number(profileApi.xpSummary?.xpToNext || 100),
      joinDate: String(profileApi.createdAt || ''),
      country: String(profileApi.country || ''),
      website: String(profileApi.website || ''),
      github: String(profileApi.github || ''),
      linkedin: String(profileApi.linkedin || ''),
      twitter: String(profileApi.twitter || ''),
    };
  }, [profileApi, handle]);

  const bootcampModules = useMemo(() => {
    if (!profileApi) return [];
    return profileApi.bootcampStatus === 'completed'
      ? [{ moduleId: 1, roomsCompleted: 5, roomsTotal: 5 },
         { moduleId: 2, roomsCompleted: 5, roomsTotal: 5 },
         { moduleId: 3, roomsCompleted: 5, roomsTotal: 5 },
         { moduleId: 4, roomsCompleted: 5, roomsTotal: 5 },
         { moduleId: 5, roomsCompleted: 5, roomsTotal: 5 }]
      : [];
  }, [profileApi]);

  const visibleSections: ProfileSectionId[] = useMemo(() => {
    if (!profile) return [];
    const sections: ProfileSectionId[] = ['identity', 'stats', 'achievements'];
    if (Object.keys(activityDates).length > 0 || profile.completedRooms.length > 0) {
      sections.push('activity');
    }
    if (bootcampModules.length > 0) sections.push('skills');
    if (profile.completedRooms.length > 0) sections.push('labs');
    if (profile.coursesCompleted > 0) sections.push('courses');
    if (profile.bootcampCompleted) sections.push('bootcamp');
    sections.push('trophy');
    return sections;
  }, [profile, activityDates, bootcampModules]);

  if (!isValidHandle) return <NotFoundPage />;
  if (loading) return <PageLoader />;
  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 px-4">
        <IconArrowLeft className="w-4 h-4 text-text-muted" />
        <div className="text-center">
          <h1 className="text-3xl font-black text-text-primary uppercase tracking-tighter mb-2">Operator Not Found</h1>
          <p className="text-text-muted text-sm max-w-xs mx-auto">The handle <span className="text-accent font-mono">@{handle}</span> does not exist.</p>
        </div>
        <Link to="/" className="btn-primary">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-bg">
      <Navbar />
      <SEO
        title={`@${handle}'s Profile`}
        description={`View the operator profile, achievements, and ranking of @${handle} on QYVORA.`}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Operators', item: '/' },
          { name: handle ? `@${handle}` : 'Profile', item: location.pathname }
        ]}
      />

      {/* Mobile section nav */}
      <ProfileSectionNav visibleSections={visibleSections} className="lg:hidden" />

      <div className="px-4 md:px-12 lg:px-16 pt-28 md:pt-24 pb-20 lg:pb-24">
        <div className="flex gap-6">
          {/* Desktop section nav */}
          <ProfileSectionNav visibleSections={visibleSections} className="hidden lg:flex w-48 shrink-0" />

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* ── Identity Section ── */}
            <section id="profile-section-identity">
              <ProfileIdentityBlock
                id={profile.id}
                handle={profile.username}
                name={profile.displayName || undefined}
                bio={profile.bio || undefined}
                rank={profile.rank}
                organization={profile.organization || undefined}
                actions={[
                  { label: 'Back to Home', to: '/', icon: <IconArrowLeft className="w-3.5 h-3.5" /> },
                ]}
                showShare
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
                  label="CP"
                  value={profile.cp.toLocaleString()}
                  accent
                />
                <ProfileStatCard
                  icon={<User className="w-5 h-5 text-text-muted" />}
                  label="Rank"
                  value={profile.rank}
                />
                <ProfileStatCard
                  icon={<FlaskConical className="w-5 h-5 text-text-muted" />}
                  label="Labs"
                  value={profile.labsCompleted || profile.completedRooms.length}
                />
                <ProfileStatCard
                  icon={<GraduationCap className="w-5 h-5 text-text-muted" />}
                  label="Courses"
                  value={profile.coursesCompleted}
                />
                <ProfileStatCard
                  icon={<Flame className="w-5 h-5 text-text-muted" />}
                  label="Streak"
                  value={`${profile.xpLevel}`}
                />
                <ProfileStatCard
                  icon={<Zap className="w-5 h-5 text-text-muted" />}
                  label="XP Level"
                  value={`Lv.${profile.xpLevel}`}
                />
              </div>
            </section>

            {/* ── Activity Section ── */}
            {visibleSections.includes('activity') && (
              <section id="profile-section-activity">
                <div className="flex flex-col gap-6">
                  {Object.keys(activityDates).length > 0 && (
                    <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
                      <ContributionCalendar activityDates={activityDates} />
                    </div>
                  )}
                  <ActivityTimeline profile={profile} />
                </div>
              </section>
            )}

            {/* ── Skills Section ── */}
            {visibleSections.includes('skills') && bootcampModules.length > 0 && (
              <section id="profile-section-skills">
                <SkillsModule modules={bootcampModules} />
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

            {/* ── Bootcamp Section ── */}
            {visibleSections.includes('bootcamp') && (
              <section id="profile-section-bootcamp">
                <div className="rounded-2xl border border-border/30 bg-bg-card p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                    <GraduationCap className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-sm font-black text-text-primary mb-1">
                    Hacker Protocol Bootcamp
                  </h3>
                  <p className="text-xs text-text-muted">
                    Successfully graduated from HPB
                  </p>
                </div>
              </section>
            )}

            {/* ── Trophy Cabinet Section ── */}
            <section id="profile-section-trophy">
              <TrophyCabinet profile={profile} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
