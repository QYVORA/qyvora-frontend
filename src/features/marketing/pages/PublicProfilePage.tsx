import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Activity } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import CpLogo from '../../../shared/components/CpLogo';
import api from '../../../core/services/api';
import PageLoader from '../../../shared/components/PageLoader';
import SEO from '../../../shared/components/SEO';

const PublicProfile: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const location = useLocation();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showAllRooms, setShowAllRooms] = useState(false);

  useEffect(() => {
    if (!handle) { setNotFound(true); setLoading(false); return; }

    let mounted = true;

    const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;

    api.get(`/public/users/${encodeURIComponent(cleanHandle)}`)
      .then((res) => { if (mounted) setProfile(res.data || null); })
      .catch(() => { if (mounted) setNotFound(true); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [handle]);

  const cp = Number(profile?.cpPoints || 0);
  const rooms = useMemo(() => Array.isArray(profile?.completedRooms) ? profile.completedRooms : [], [profile?.completedRooms]);
  const getRoomImage = (roomId: number) => {
    const phase = String(Math.floor(roomId / 100)).padStart(2, '0');
    const room = String(roomId % 100).padStart(2, '0');
    return `/assets/walkthrough/hpb/phase-${phase}/room-${room}/step-01.webp`;
  };

  const ROOMS_INITIAL = 6;
  const displayedRooms = showAllRooms ? rooms : rooms.slice(0, ROOMS_INITIAL);

  if (loading) return <PageLoader />;

  if (notFound || !profile) {
    const displayHandle = handle?.startsWith('@') ? handle : `@${handle}`;

    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 px-4">
        <ArrowLeft className="w-4 h-4 text-text-muted" />
        <div className="text-center">
          <h1 className="text-3xl font-black text-text-primary uppercase tracking-tighter mb-2">Operator Not Found</h1>
          <p className="text-text-muted text-sm max-w-xs mx-auto">The handle <span className="text-accent font-mono">{displayHandle}</span> does not exist.</p>
        </div>
        <Link to="/" className="px-4 py-2 bg-accent text-bg border border-accent rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95">Return Home</Link>
      </div>
    );
  }

  const initials = (profile.handle || profile.name || 'OP').substring(0, 2).toUpperCase();

  return (
    <div className="bg-bg min-h-full">
      <SEO
        title={`${handle}'s Profile`}
        description={`View the operator profile, achievements, and ranking of ${handle} on QYVORA.`}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Operators', item: '/' },
          { name: handle || 'Profile', item: location.pathname }
        ]}
      />

      <div className="mx-auto max-w-[1440px] px-4 pt-6 pb-16 md:px-8">

        {/* Back link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-text-muted hover:text-accent text-xs font-bold uppercase tracking-widest transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back
          </Link>
        </div>

        {/* Profile Header */}
        <ScrollReveal className="mb-10">
          <div className="rounded-3xl p-6 md:p-10">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-stretch">

              {/* Avatar — smaller on mobile, full height on desktop */}
              <div className="w-32 md:w-48 lg:w-56 flex-shrink-0">
                {profile.avatarUrl ? (
                  <div className="w-32 h-32 md:w-full md:aspect-auto md:h-full rounded-2xl md:rounded-3xl overflow-hidden border border-accent/20">
                    <img
                      src={profile.avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 md:w-full md:aspect-auto md:h-full rounded-2xl md:rounded-3xl border border-accent/20 bg-accent-dim flex items-center justify-center text-accent text-4xl md:text-6xl lg:text-7xl font-black font-mono">
                    {initials}
                  </div>
                )}
              </div>

              {/* Identity + CP + Actions */}
              <div className="flex-1 flex flex-col justify-between min-w-0 gap-y-7">

                {/* Top: Name + Rank + Bio */}
                <div>
                  <div className="flex flex-wrap items-center gap-4 mb-2">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter uppercase font-mono leading-none">
                      {profile.handle || profile.name}
                    </h1>
                    <span className="px-4 py-1.5 bg-accent/10 text-accent text-xs font-bold rounded uppercase tracking-widest flex-none">
                      {profile.rank || 'Operator'}
                    </span>
                  </div>
                  {profile.bio && (
                    <p className="text-text-muted text-sm md:text-base leading-relaxed max-w-2xl">
                      {profile.bio}
                    </p>
                  )}
                </div>

                {/* Middle: CP with logo */}
                <div className="flex items-center gap-3">
                  <CpLogo className="w-7 h-7 md:w-8 md:h-8 text-accent" />
                  <span className="text-2xl md:text-3xl font-black text-text-primary font-mono tracking-tighter">
                    {cp.toLocaleString()} <span className="text-text-muted font-medium">CP</span>
                  </span>
                </div>

              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Completed rooms — below the header card */}
        {rooms.length > 0 && (
          <ScrollReveal>
            <div>
              <h2 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-4">Completed Rooms</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {displayedRooms.map((room: { roomId: number; title: string }) => (
                  <div
                    key={room.roomId}
                    className="rounded-xl bg-bg-card border border-border overflow-hidden"
                  >
                    <div className="aspect-[16/10] bg-accent-dim overflow-hidden relative">
                      <img
                        src={getRoomImage(room.roomId)}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-accent/80 text-bg text-[10px] font-black uppercase tracking-wider rounded">HPB</span>
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-bold text-text-primary leading-tight line-clamp-2">{room.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              {rooms.length > ROOMS_INITIAL && (
                <button
                  onClick={() => setShowAllRooms(!showAllRooms)}
                  className="mt-4 text-xs font-bold text-accent uppercase tracking-widest hover:text-accent/80 transition-colors"
                >
                  {showAllRooms ? 'Show Less' : `Show All (${rooms.length})`}
                </button>
              )}
            </div>
          </ScrollReveal>
        )}

      </div>
    </div>
  );
};

export default PublicProfile;
