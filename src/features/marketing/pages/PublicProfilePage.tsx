import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { IconArrowLeft } from '@/shared/components/icons';
import NotFoundPage from '../../../shared/pages/NotFoundPage';
import api from '../../../core/services/api';
import PageLoader from '../../../shared/components/PageLoader';
import SEO from '../../../shared/components/SEO';
import { Navbar } from '../../../shared/components/layout';
import ProfileIdentityBlock from '../../../shared/components/profile/ProfileIdentityBlock';
import ProfileStatCard from '../../../shared/components/profile/ProfileStatCard';
import AchievementsSection from '../../../shared/components/profile/AchievementsSection';
import ContributionCalendar from '../../../shared/components/profile/ContributionCalendar';
import { FlaskConical, GraduationCap, Trophy, User } from 'lucide-react';

const PublicProfile: React.FC = () => {
  const { handle: rawHandle } = useParams<{ handle: string }>();
  const location = useLocation();

  const isValidHandle = rawHandle && rawHandle.startsWith('@');
  const handle = isValidHandle ? rawHandle.slice(1) : '';

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activityDates, setActivityDates] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!handle) { setNotFound(true); setLoading(false); return; }

    let mounted = true;

    api.get(`/public/users/${encodeURIComponent(handle)}`)
      .then((res) => { if (mounted) setProfile(res.data || null); })
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

  const cp = Number(profile?.cpPoints || 0);
  const rooms = useMemo(() => Array.isArray(profile?.completedRooms) ? profile.completedRooms : [], [profile?.completedRooms]);
  const bootcampCompleted = profile?.bootcampStatus === 'completed' || profile?.bootcampCompleted === true;
  const labsCompleted = Number(profile?.labsCompleted || 0);
  const coursesCompleted = Number(profile?.coursesCompleted || 0);

  if (!isValidHandle) return <NotFoundPage />;

  if (loading) return <PageLoader />;

  if (notFound || !profile) {
    const displayHandle = `@${handle}`;

    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 px-4">
        <IconArrowLeft className="w-4 h-4 text-text-muted" />
        <div className="text-center">
          <h1 className="text-3xl font-black text-text-primary uppercase tracking-tighter mb-2">Operator Not Found</h1>
          <p className="text-text-muted text-sm max-w-xs mx-auto">The handle <span className="text-accent font-mono">{displayHandle}</span> does not exist.</p>
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

      <div className="px-4 md:px-12 lg:px-16 pt-28 md:pt-24 pb-20 lg:pb-24 space-y-6">
        {/* Identity Block — full width */}
        <ProfileIdentityBlock
          id={profile.id}
          handle={profile.handle || handle}
          name={profile.name || undefined}
          bio={profile.bio || undefined}
          rank={profile.rank || 'Operator'}
          organization={profile.organization || undefined}
          actions={[
            { label: 'Back to Home', to: '/', icon: <IconArrowLeft className="w-3.5 h-3.5" /> },
          ]}
          showShare
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

            {/* Achievements */}
            <AchievementsSection
              rooms={rooms}
              bootcampCompleted={bootcampCompleted}
              labsCompleted={labsCompleted}
              coursesCompleted={coursesCompleted}
            />
          </div>

          {/* Right column — stat cards */}
          <div className="w-full lg:w-[340px] shrink-0 grid grid-cols-2 lg:grid-cols-1 gap-4">
            <ProfileStatCard
              icon={<Trophy className="w-5 h-5 text-accent" />}
              label="CP"
              value={cp.toLocaleString()}
              accent
            />
            <ProfileStatCard
              icon={<User className="w-5 h-5 text-text-muted" />}
              label="Rank"
              value={profile.rank || 'Operator'}
            />
            <ProfileStatCard
              icon={<FlaskConical className="w-5 h-5 text-text-muted" />}
              label="Labs"
              value={labsCompleted || rooms.length}
            />
            <ProfileStatCard
              icon={<GraduationCap className="w-5 h-5 text-text-muted" />}
              label="Courses"
              value={coursesCompleted}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
