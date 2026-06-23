import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Edit3, Activity, ArrowRight } from 'lucide-react';
import ShareProfile from '../../../shared/components/ShareProfile';
import { useAuth } from '../../../core/contexts/AuthContext';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import Identicon from '../../../shared/components/Identicon';
import CpLogo from '../../../shared/components/CpLogo';
import BootcampBadge from '../../../shared/components/BootcampBadge';
import api from '../../../core/services/api';
import EditModal from '../components/profile/EditModal';
import PageLoader from '../../../shared/components/PageLoader';

const Profile: React.FC = () => {
  const { username: paramUsername } = useParams<{ username?: string }>();
  const { user: authUser } = useAuth();
  const [profileApi, setProfileApi] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAllRooms, setShowAllRooms] = useState(false);

  const isOwnProfile = !paramUsername || paramUsername === authUser?.username;
  const displayHandle = paramUsername || authUser?.username || 'operator';

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = isOwnProfile
          ? await api.get('/profile')
          : await api.get(`/public/users/${encodeURIComponent(paramUsername || '')}`);
        if (!mounted) return;
        setProfileApi(res.data || null);
      } catch {
        if (!mounted) return;
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [isOwnProfile, paramUsername]);

  const profileData = useMemo(() => ({
    id: profileApi?.id || authUser?.uid || '',
    username: isOwnProfile
      ? (profileApi?.hackerHandle || profileApi?.name || displayHandle)
      : (profileApi?.handle || profileApi?.name || displayHandle),
    rank: String(profileApi?.xpSummary?.rank || profileApi?.rank || authUser?.rank || 'Candidate'),
    bio: String(profileApi?.bio || ''),
    organization: String(profileApi?.organization || ''),
    name: String(profileApi?.name || ''),
    cp: Number(profileApi?.cpPoints || authUser?.cp || 0),
    completedRooms: Array.isArray(profileApi?.learn?.completedRooms) ? profileApi.learn.completedRooms : [],
  }), [isOwnProfile, profileApi, authUser, displayHandle]);

  const rooms = useMemo(() => Array.isArray(profileData.completedRooms) ? profileData.completedRooms : [], [profileData.completedRooms]);
  const bootcampCompleted = authUser?.bootcampStatus === 'completed' || profileApi?.bootcampStatus === 'completed';
  const getRoomImage = (roomId: number) => {
    const phase = String(Math.floor(roomId / 100)).padStart(2, '0');
    const room = String(roomId % 100).padStart(2, '0');
    return `/assets/walkthrough/hpb/phase-${phase}/room-${room}/step-01.webp`;
  };

  const ROOMS_INITIAL = 6;
  const displayedRooms = showAllRooms ? rooms : rooms.slice(0, ROOMS_INITIAL);

  const editInitial = {
    name: profileData.name,
    hackerHandle: profileData.username,
    bio: profileData.bio,
    organization: profileData.organization,
  };

  if (loading) return <PageLoader />;

  return (
    <div className="bg-bg min-h-full">
      <div className="mx-auto max-w-[1440px] px-4 pt-6 pb-16 md:px-8">

        {/* Profile Header */}
        <ScrollReveal className="mb-10">
          <div className="rounded-3xl bg-bg-card p-6 md:p-10">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-stretch">

              {/* Avatar — Identicon based on userId */}
              <div className="w-32 md:w-48 lg:w-56 flex-shrink-0">
                <div className="w-32 h-32 md:w-full md:aspect-auto md:h-full rounded-full overflow-hidden border border-accent/20">
                  <Identicon value={profileData.id} size={256} className="w-full h-full" />
                </div>
              </div>

              {/* Identity + CP + Actions */}
              <div className="flex-1 flex flex-col justify-between min-w-0 gap-y-7">

                {/* Top: Name + Rank + Bio */}
                <div>
                  <div className="flex flex-wrap items-center gap-4 mb-2">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter uppercase font-mono leading-none flex items-center gap-3">
                      {profileData.username}
                      <BootcampBadge completed={bootcampCompleted} className="w-7 h-7 md:w-9 md:h-9" />
                    </h1>
                    <span className="px-4 py-1.5 bg-accent/10 text-accent text-xs font-bold rounded uppercase tracking-widest flex-none">
                      {profileData.rank}
                    </span>
                  </div>
                  {profileData.bio && (
                    <p className="text-text-muted text-sm md:text-base leading-relaxed max-w-2xl">
                      {profileData.bio}
                    </p>
                  )}
                </div>

                {/* Middle: CP with logo */}
                <div className="flex items-center gap-3">
                  <CpLogo className="w-7 h-7 md:w-8 md:h-8 text-accent" />
                  <span className="text-2xl md:text-3xl font-black text-text-primary font-mono tracking-tighter">
                    {profileData.cp.toLocaleString()} <span className="text-text-muted font-medium">CP</span>
                  </span>
                </div>

                {/* Bottom: Metadata + Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-text-muted">
                    {profileData.organization && (
                      <span className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-accent" /> {profileData.organization}
                      </span>
                    )}
                    {isOwnProfile && authUser?.email && (
                      <span className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-accent" /> {authUser.email}
                      </span>
                    )}
                    {profileData.completedRooms.length > 0 && (
                      <span className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-accent" /> {profileData.completedRooms.length} rooms
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isOwnProfile ? (
                      <>
                        <Link
                          to={`/${profileData.username}`}
                          className="px-4 py-2 bg-bg border border-border hover:border-accent/50 rounded-xl text-xs font-black uppercase tracking-widest text-text-muted transition-all active:scale-95"
                        >
                          Public View
                        </Link>
                        <ShareProfile handle={profileData.username} />
                        <button
                          onClick={() => setEditOpen(true)}
                          className="px-4 py-2 bg-accent text-bg border border-accent rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                      </>
                    ) : (
                      <Link
                        to={`/${profileData.username}`}
                        className="px-4 py-2 bg-accent text-bg border border-accent rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95"
                      >
                        View Public Page
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Completed rooms — below the header card */}
        {rooms.length > 0 && (
          <ScrollReveal>
            <div>
              <span className="mb-4 block text-xs font-black uppercase tracking-[0.35em] text-accent">Completed Rooms</span>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {displayedRooms.map((room: { roomId: number; title: string }) => (
                  <div
                    key={room.roomId}
                    className="group relative flex w-full flex-col overflow-hidden rounded-lg border border-border/40 bg-bg-card transition-all duration-300 hover:border-accent/30 hover:scale-[1.02]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                      <img
                        src={getRoomImage(room.roomId)}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                      <span className="absolute top-1.5 left-1.5 flex h-4 w-4 items-center justify-center rounded-lg border border-accent/25 bg-bg/80 backdrop-blur-sm font-mono text-[8px] font-black text-accent">HPB</span>
                    </div>
                    <div className="flex flex-1 flex-col pt-2 px-3 pb-3">
                      <h3 className="text-xs font-black leading-snug text-text-primary group-hover:text-accent transition-colors line-clamp-2">{room.title}</h3>
                      <div className="mt-auto pt-1.5 flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-accent opacity-0 transition-all duration-300 transform translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0">
                        View room <ArrowRight className="h-2 w-2" />
                      </div>
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

      {isOwnProfile && (
        <EditModal
          open={editOpen}
          onOpenChange={setEditOpen}
          initial={editInitial}
          onSaved={(data) => setProfileApi(data)}
        />
      )}
    </div>
  );
};

export default Profile;
