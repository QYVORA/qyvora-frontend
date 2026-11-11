import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { IconArrowLeft } from '@/shared/components/icons';
import { User, TrendingUp, Calendar } from 'lucide-react';
import NotFoundPage from '@/shared/pages/NotFoundPage';
import api from '@/core/services/api';
import PageLoader from '@/shared/components/PageLoader';
import SEO from '@/shared/components/SEO';
import { buildPersonProfile, toAbsoluteUrl } from '@/shared/seo/schema';
import ProfileIdentityBlock from '@/shared/components/profile/ProfileIdentityBlock';
import ProfileLayout from '@/shared/components/profile/ProfileLayout';
import RankLevelCard from '@/shared/components/profile/RankLevelCard';
import CpLogo from '@/shared/components/CpLogo';
import { QyvoraMark } from '@/shared/components/brand';
import ProfileMetricsStrip from '@/shared/components/profile/ProfileMetricsStrip';
import AchievementsSection from '@/shared/components/profile/AchievementsSection';
import ContributionCalendar from '@/shared/components/profile/ContributionCalendar';
import ActivityTimeline from '@/shared/components/profile/ActivityTimeline';
import CoursesModule from '@/shared/components/profile/CoursesModule';
import TrophyCabinet from '@/shared/components/profile/TrophyCabinet';
import SectionCard from '@/shared/components/ui/SectionCard';
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
      completedLabIds: Array.isArray(profileApi.completedLabIds) ? profileApi.completedLabIds : [],
      completedRooms,
      xpLevel: Number(profileApi.xpSummary?.level || 1),
      xpCurrent: Number(profileApi.xpSummary?.xp || 0),
      xpToNext: Number(profileApi.xpSummary?.xpToNext || 100),
      joinDate: String(profileApi.createdAt || ''),
      country: String(profileApi.country || ''),
      website: String(profileApi.website || ''),
      github: String(profileApi.github || profileApi.githubProfileUrl || ''),
      linkedin: String(profileApi.linkedin || ''),
      twitter: String(profileApi.twitter || ''),
      githubConnected: profileApi.githubConnected === true,
      githubUsername: String(profileApi.githubUsername || ''),
      githubProfileUrl: String(profileApi.githubProfileUrl || ''),
      githubPublic: profileApi.githubPublic === true,
      passwordSet: profileApi.passwordSet !== false,
    };
  }, [profileApi, handle]);

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
          <h1 className="mb-2 text-3xl font-medium text-text-primary md:text-5xl">Operator Not Found</h1>
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

      <ProfileLayout handle={profile.username} clearTopbar>
        <aside className="w-full min-w-0">
          <div className="w-full space-y-6 lg:sticky lg:top-[calc(var(--app-topbar-offset,var(--app-topbar-h,80px))+24px)]">
            <section id="profile-section-identity">
              <ProfileIdentityBlock
                id={profile.id}
                handle={profile.username}
                name={profile.displayName || undefined}
                bio={profile.bio || undefined}
                organization={profile.organization || undefined}
                actions={[
                  { label: 'Back to home', to: '/', icon: <IconArrowLeft className="h-4 w-4" /> },
                ]}
                showShare
                joinDate={profile.joinDate || undefined}
                country={profile.country || undefined}
                website={profile.website || undefined}
                github={profile.github || undefined}
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
              { icon: <QyvoraMark className="h-4 w-4" />, value: profile.labsCompleted, label: 'Labs' },
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
                showAllHref="/learn?tab=labs"
              />
            </section>
          )}
        </main>
      </ProfileLayout>
    </div>
  );
};

export default PublicProfile;