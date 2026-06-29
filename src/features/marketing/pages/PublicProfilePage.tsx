import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Activity, ArrowRight, Shield } from 'lucide-react';
import ShareProfile from '../../../shared/components/ShareProfile';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import Identicon from '../../../shared/components/Identicon';
import CpLogo from '../../../shared/components/CpLogo';
import BootcampBadge from '../../../shared/components/BootcampBadge';
import api from '../../../core/services/api';
import PageLoader from '../../../shared/components/PageLoader';
import SEO from '../../../shared/components/SEO';
import StreakCard from '../../student/components/dashboard/StreakCard/StreakCard';
import HeroBackground from '../../../shared/components/backgrounds/HeroBackground';

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
  const bootcampCompleted = profile?.bootcampStatus === 'completed' || profile?.bootcampCompleted === true;
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

  return (
    <div className="w-full bg-bg">
      <SEO
        title={`${handle}'s Profile`}
        description={`View the operator profile, achievements, and ranking of ${handle} on QYVORA.`}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Operators', item: '/' },
          { name: handle || 'Profile', item: location.pathname }
        ]}
      />

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
                    <Identicon value={profile.id} size={256} className="w-full h-full" />
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.9] flex items-center gap-3">
                      {profile.handle || profile.name}
                      <BootcampBadge completed={bootcampCompleted} className="w-7 h-7 md:w-9 md:h-9" />
                    </h1>
                    <span className="px-4 py-1.5 bg-accent/10 text-accent text-xs font-black uppercase tracking-widest rounded-lg border border-accent/20 flex-none">
                      {profile.rank || 'Operator'}
                    </span>
                  </div>

                  {profile.bio && (
                    <p className="text-base md:text-lg text-text-secondary font-mono leading-relaxed max-w-2xl">
                      {profile.bio}
                    </p>
                  )}

                  <div className="flex items-center gap-3">
                    <CpLogo className="w-7 h-7 md:w-8 md:h-8 text-accent" />
                    <span className="text-2xl md:text-3xl font-black text-text-primary font-mono tracking-tighter">
                      {cp.toLocaleString()} <span className="text-text-muted font-medium">CP</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4"
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-bg-card/30 hover:border-accent/40 text-xs font-black uppercase tracking-[0.15em] text-text-muted hover:text-accent transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </Link>
              <ShareProfile handle={handle || ''} />
              {profile?.streakDays != null && (
                <div className="max-w-xs">
                  <StreakCard streakDays={profile.streakDays} />
                </div>
              )}
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
                  Walkthrough rooms this operator has successfully completed.
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

    </div>
  );
};

export default PublicProfile;
