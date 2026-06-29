import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Edit3, Activity, ArrowRight, Shield } from 'lucide-react';
import ShareProfile from '../../../shared/components/ShareProfile';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import Identicon from '../../../shared/components/Identicon';
import CpLogo from '../../../shared/components/CpLogo';
import BootcampBadge from '../../../shared/components/BootcampBadge';
import api from '../../../core/services/api';
import EditModal from '../components/profile/EditModal';
import PageLoader from '../../../shared/components/PageLoader';
import StreakCard from '../components/dashboard/StreakCard/StreakCard';
import HeroBackground from '../../../shared/components/backgrounds/HeroBackground';

const Profile: React.FC = () => {
  const { username: paramUsername } = useParams<{ username?: string }>();
  const { user: authUser } = useAuth();
  const { addToast } = useToast();
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
        addToast('Failed to load profile', 'error');
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
    <div className="w-full bg-bg">
      <HeroBackground className="z-0 opacity-40" />

      {/* ══ HERO SECTION ══ */}
      <section className="relative min-h-[85svh] md:min-h-screen w-full flex items-center overflow-hidden">
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12 xl:px-16 pt-28 md:pt-24 lg:pt-28">
          <div className="max-w-4xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >

              <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 flex-shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-accent/20 shadow-[0_0_30px_var(--color-accent-glow)]">
                    <Identicon value={profileData.id} size={256} className="w-full h-full" />
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.9] flex items-center gap-3">
                      {profileData.username}
                      <BootcampBadge completed={bootcampCompleted} className="w-7 h-7 md:w-9 md:h-9" />
                    </h1>
                    <span className="px-4 py-1.5 bg-accent/10 text-accent text-xs font-black uppercase tracking-widest rounded-lg border border-accent/20 flex-none">
                      {profileData.rank}
                    </span>
                  </div>

                  {profileData.bio && (
                    <p className="text-base md:text-lg text-text-secondary font-mono leading-relaxed max-w-2xl">
                      {profileData.bio}
                    </p>
                  )}

                  <div className="flex items-center gap-3">
                    <CpLogo className="w-7 h-7 md:w-8 md:h-8 text-accent" />
                    <span className="text-2xl md:text-3xl font-black text-text-primary font-mono tracking-tighter">
                      {profileData.cp.toLocaleString()} <span className="text-text-muted font-medium">CP</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row sm:items-center gap-4"
            >
              {profileApi?.xpSummary?.streakDays != null && (
                <div className="max-w-xs">
                  <StreakCard
                    streakDays={profileApi.xpSummary.streakDays}
                    lastVisitDate={profileApi?.xpSummary?.lastVisitDate || undefined}
                  />
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
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
                      className="px-5 py-2.5 rounded-xl border border-border bg-bg-card/30 hover:border-accent/40 text-xs font-black uppercase tracking-[0.15em] text-text-muted hover:text-accent transition-all"
                    >
                      Public View
                    </Link>
                    <ShareProfile handle={profileData.username} />
                    <button
                      onClick={() => setEditOpen(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-bg text-xs font-black uppercase tracking-[0.15em] hover:brightness-110 transition-all active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </>
                ) : (
                  <Link
                    to={`/${profileData.username}`}
                    className="px-5 py-2.5 rounded-xl bg-accent text-bg text-xs font-black uppercase tracking-[0.15em] hover:brightness-110 transition-all active:scale-95"
                  >
                    View Public Page
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ ROOMS SECTION ══ */}
      {rooms.length > 0 && (
        <section className="relative w-full bg-bg py-20 md:py-28">
          <div className="max-w-[1600px] mx-auto w-full px-4 md:px-10 lg:px-12 xl:px-16">
            <ScrollReveal>
              <div className="max-w-4xl mb-12">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
                  Completed <span className="text-accent">Rooms</span>
                </h2>
                <p className="mt-4 text-text-secondary font-mono text-sm md:text-base leading-relaxed max-w-2xl">
                  Walkthrough rooms you have successfully completed.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {displayedRooms.map((room: { roomId: number; title: string }, idx: number) => (
                  <motion.div
                    key={room.roomId}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-bg-card transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_30px_var(--color-accent-glow)] hover:scale-[1.02]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={getRoomImage(room.roomId)}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg-card to-transparent pointer-events-none" />
                      <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg border border-accent/25 bg-bg/80 backdrop-blur-sm font-mono text-[9px] font-black text-accent uppercase tracking-wider">
                        <Shield className="w-2.5 h-2.5" /> HPB
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="text-sm font-black leading-snug text-text-primary group-hover:text-accent transition-colors line-clamp-2">{room.title}</h3>
                      <div className="mt-auto pt-3 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent opacity-0 transition-all duration-300 transform translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0">
                        View room <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {rooms.length > ROOMS_INITIAL && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="mt-8 text-center"
                >
                  <button
                    onClick={() => setShowAllRooms(!showAllRooms)}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-accent/30 bg-accent-dim text-accent text-xs font-black uppercase tracking-wider hover:bg-accent-dim/70 transition-colors"
                  >
                    {showAllRooms ? 'Show Less' : `Show All (${rooms.length})`}
                  </button>
                </motion.div>
              )}
            </ScrollReveal>
          </div>
        </section>
      )}

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
