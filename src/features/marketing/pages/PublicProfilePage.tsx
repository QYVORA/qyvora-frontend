import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { IconArrowLeft } from '@/shared/components/icons';
import { User, TrendingUp, Calendar } from 'lucide-react';
import NotFoundPage from '@/shared/pages/NotFoundPage';
import api from '@/core/services/api';
import PageLoader from '@/shared/components/PageLoader';
import SEO from '@/shared/components/SEO';
import { buildPersonProfile, toAbsoluteUrl } from '@/shared/seo/schema';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import ProfileIdentityBlock from '@/shared/components/profile/ProfileIdentityBlock';
import CpLogo from '@/shared/components/CpLogo';
import { QyvoraMark } from '@/shared/components/brand';
import ProfileMetricsStrip from '@/shared/components/profile/ProfileMetricsStrip';
import AchievementsSection from '@/shared/components/profile/AchievementsSection';
import ContributionCalendar from '@/shared/components/profile/ContributionCalendar';
import ActivityTimeline from '@/shared/components/profile/ActivityTimeline';
import LabsModule from '@/shared/components/profile/LabsModule';
import CoursesModule from '@/shared/components/profile/CoursesModule';
import TrophyCabinet from '@/shared/components/profile/TrophyCabinet';
import type { ProfileData, ProfileApiResponse, CompletedRoom, ProfileSectionId } from '@/shared/types/profile';

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
      rank: String(
        profileApi.xpSummary?.progression?.rank ||
        profileApi.progression?.rank ||
        profileApi.rank ||
        'Operator'
      ),
      progression: profileApi.xpSummary?.progression || profileApi.progression || undefined,
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
    if (profile.coursesCompleted > 0 || profile.completedCourseIds.length > 0) sections.push('courses');
    sections.push('trophy');
    return sections;
  }, [profile, activityDates]);

  if (!isValidHandle) return <NotFoundPage />;
  if (loading) return <PageLoader />;
  if (notFound || !profile) {
    return (
      <div className="min-h-dvh bg-canvas flex flex-col items-center justify-center gap-6 px-4">
        <SEO
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
    <div className="min-h-dvh w-full bg-canvas">
      <SEO
        title={`@${handle} — Operator Profile | QYVORA`}
        description={profile.bio ? profile.bio : `Operator @${handle} on QYVORA — achievements, rank, and activity.`}
        breadcrumbName={`@${handle}`}
        schemaData={buildPersonProfile({
          handle: profile.username,
          name: profile.displayName,
          bio: profile.bio,
          url: `/${handle ? `@${handle}` : ''}`,
          sameAs: [
            profile.github,
            profile.linkedin,
            profile.twitter,
          ].filter((url) => url && url.startsWith('http')) as string[],
        })}
      />

      <PublicContainer className="pt-24 md:pt-28 lg:pt-32 pb-20 lg:pb-24">
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
      </PublicContainer>
    </div>
  );
};

export default PublicProfile;