import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { IconArrowLeft } from '@/shared/components/icons';
import { User, FlaskConical, GraduationCap, Zap, Flame } from 'lucide-react';
import NotFoundPage from '../../../shared/pages/NotFoundPage';
import api from '../../../core/services/api';
import PageLoader from '../../../shared/components/PageLoader';
import SEO from '../../../shared/components/SEO';
import { Navbar } from '../../../shared/components/layout';
import { Footer } from '../../../shared/components/layout';
import ProfileIdentityBlock from '../../../shared/components/profile/ProfileIdentityBlock';
import CpLogo from '../../../shared/components/CpLogo';
import ProfileMetricsStrip from '../../../shared/components/profile/ProfileMetricsStrip';
import AchievementsSection from '../../../shared/components/profile/AchievementsSection';
import ContributionCalendar from '../../../shared/components/profile/ContributionCalendar';
import ActivityTimeline from '../../../shared/components/profile/ActivityTimeline';
import LabsModule from '../../../shared/components/profile/LabsModule';
import CoursesModule from '../../../shared/components/profile/CoursesModule';
import TrophyCabinet from '../../../shared/components/profile/TrophyCabinet';
import type { ProfileData, ProfileApiResponse, CompletedRoom, ProfileSectionId } from '../../../shared/types/profile';

const PublicProfile: React.FC = () => {
  const { handle: rawHandle } = useParams<{ handle: string }>();

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
      completedPhaseIds: Array.isArray(profileApi.completedPhaseIds) ? profileApi.completedPhaseIds : [],
      completedCourseIds: Array.isArray(profileApi.completedCourseIds) ? profileApi.completedCourseIds : [],
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

  if (!isValidHandle) return <NotFoundPage />;
  if (loading) return <PageLoader />;
  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 px-4">
        <SEO
          noindex
          title="Operator Not Found"
          description={`The QYVORA operator profile @${handle} could not be found.`}
        />
        <IconArrowLeft className="w-4 h-4 text-text-muted" />
        <div className="flex flex-col items-start text-left">
          <h1 className="text-4xl md:text-6xl font-black text-text-primary uppercase tracking-tighter mb-2">Operator Not Found</h1>
          <p className="text-text-muted text-sm max-w-xs">The handle <span className="text-accent font-mono">@{handle}</span> does not exist.</p>
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
        breadcrumbName={handle ? `@${handle}` : 'Profile'}
      />

      <div className="w-full px-3 md:px-4 lg:px-6 pt-28 md:pt-24 pb-20 lg:pb-24">
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

            {/* ── Metrics Strip ── */}
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

            {/* ── Activity Section ── */}
            {visibleSections.includes('activity') && (
              <section id="profile-section-activity">
                <div className="flex flex-col gap-6">
                  <ActivityTimeline profile={profile} />
                  {Object.keys(activityDates).length > 0 && (
                    <div className="rounded-2xl border border-border/50 bg-bg-card p-5">
                      <ContributionCalendar activityDates={activityDates} />
                    </div>
                  )}
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
                completedPhaseIds={profile.completedPhaseIds}
                completedCourseIds={profile.completedCourseIds}
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

      {/* ══ FOOTER ══ */}
      <section className="bg-transparent overflow-hidden">
        <Footer />
      </section>
    </div>
  );
};

export default PublicProfile;
