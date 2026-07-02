import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ChevronRight, Shield } from 'lucide-react';
import NotFoundPage from '../../../shared/pages/NotFoundPage';
import ShareProfile from '../../../shared/components/ShareProfile';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import Identicon from '../../../shared/components/Identicon';
import CpLogo from '../../../shared/components/CpLogo';
import BootcampBadge from '../../../shared/components/BootcampBadge';
import api from '../../../core/services/api';
import PageLoader from '../../../shared/components/PageLoader';
import SEO from '../../../shared/components/SEO';
import { Navbar } from '../../../shared/components/layout';
import { StreakIcon } from '../../../shared/components';
import HeroBackground from '../../../shared/components/backgrounds/HeroBackground';
import { getRoomCoverImage } from '../../../features/student/utils/walkthroughImages';

const PublicProfile: React.FC = () => {
  const { handle: rawHandle } = useParams<{ handle: string }>();
  const location = useLocation();

  const isValidHandle = rawHandle && rawHandle.startsWith('@');
  const handle = isValidHandle ? rawHandle.slice(1) : '';

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    if (!handle) { setNotFound(true); setLoading(false); return; }

    let mounted = true;

    api.get(`/public/users/${encodeURIComponent(handle)}`)
      .then((res) => { if (mounted) setProfile(res.data || null); })
      .catch(() => { if (mounted) setNotFound(true); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [handle]);

  const cp = Number(profile?.cpPoints || 0);
  const rooms = useMemo(() => Array.isArray(profile?.completedRooms) ? profile.completedRooms : [], [profile?.completedRooms]);
  const bootcampCompleted = profile?.bootcampStatus === 'completed' || profile?.bootcampCompleted === true;
  const getRoomImage = (roomId: number) => String(getRoomCoverImage(roomId));

  const [showRooms, setShowRooms] = useState(false);
  const [showBadges, setShowBadges] = useState(false);

  if (!isValidHandle) return <NotFoundPage />;

  if (loading) return <PageLoader />;

  if (notFound || !profile) {
    const displayHandle = `@${handle}`;

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

      <HeroBackground className="z-0 opacity-40" />

      {/* ══ HERO SECTION ══ */}
      <section className="relative w-full">
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-10 lg:px-12 xl:px-16 pt-28 md:pt-24 lg:pt-28 pb-16">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16">
            {/* ── Left sidebar: avatar, stats, badges, actions (sticky on desktop) ── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="md:w-[260px] lg:w-[280px] shrink-0 space-y-6 md:sticky md:top-[72px] md:self-start md:pb-16"
            >
              <div className="w-24 h-24 md:w-36 md:h-36 lg:w-44 lg:h-44">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-accent/20 shadow-[0_0_30px_var(--color-accent-glow)]">
                  <Identicon value={profile.id} size={256} className="w-full h-full" />
                </div>
              </div>

              {profile?.streakDays != null && profile.streakDays > 0 && (
                <div className="flex items-center gap-3">
                  <StreakIcon days={profile.streakDays} className="scale-[1.8] origin-left" />
                </div>
              )}

              <div className="flex items-center gap-3">
                <CpLogo className="w-6 h-6 md:w-7 md:h-7 text-accent" />
                <span className="text-xl md:text-2xl font-black text-text-primary font-mono tracking-tighter">
                  {cp.toLocaleString()} <span className="text-text-muted font-medium text-sm">CP</span>
                </span>
              </div>

              <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-[11px] font-black uppercase tracking-widest rounded-lg border border-accent/20">
                {profile.rank || 'Operator'}
              </span>

              <div>
                <button
                  onClick={() => setShowBadges(!showBadges)}
                  className="flex items-center gap-2 w-full text-left group rounded-xl border border-accent/20 bg-accent-dim/40 hover:bg-accent-dim/70 hover:border-accent/40 transition-all px-4 py-3"
                >
                  <ChevronRight className="w-4 h-4 text-accent transition-transform duration-300 group-hover:translate-x-0.5" />
                  <span className="text-xs font-black uppercase tracking-widest text-accent">Badges</span>
                  <span className="px-1.5 py-0.5 bg-accent/10 text-accent text-[9px] font-black rounded-md">{bootcampCompleted ? '1' : '0'}</span>
                </button>
                {showBadges && (
                  <div className="mt-3 pl-7 space-y-3">
                    {bootcampCompleted ? (
                      <div className="flex items-center gap-3">
                        <BootcampBadge completed className="w-8 h-8" />
                        <span className="text-xs font-bold text-text-primary">HPB Graduate</span>
                      </div>
                    ) : (
                      <p className="text-xs text-text-muted">No badges earned yet.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-bg-card/30 hover:border-accent/40 text-xs font-black uppercase tracking-[0.15em] text-text-muted hover:text-accent transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </Link>
                <ShareProfile handle={handle || ''} />
              </div>
            </motion.div>

            {/* ── Right content: name, bio, rooms ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 min-w-0 space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.9]">
                  @{profile.handle || profile.name}
                </h1>

                {profile.bio && (
                  <p className="text-base md:text-lg text-text-secondary font-mono leading-relaxed max-w-2xl">
                    {profile.bio}
                  </p>
                )}
              </div>

              {/* ── Completed Rooms (collapsible) ── */}
              {rooms.length > 0 && (
                <div className="border-t border-border/30 pt-6">
                  <button
                    onClick={() => setShowRooms(!showRooms)}
                    className="flex items-center gap-2 w-full text-left group rounded-xl border border-border/30 bg-bg-card/50 hover:bg-bg-card hover:border-accent/30 transition-all px-4 py-3"
                  >
                    <ChevronRight className="w-4 h-4 text-accent transition-transform duration-300 group-hover:translate-x-0.5" />
                    <span className="text-base md:text-lg font-black text-text-primary tracking-tight">
                      Completed Rooms
                    </span>
                    <span className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-black rounded-md">
                      {rooms.length}
                    </span>
                  </button>

                  {showRooms && (
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {rooms.map((room: Record<string, unknown>, idx: number) => {
                        const roomId = Number(room?.roomId) || 0;
                        const title = String(room?.title ?? '');
                        const imgSrc = getRoomImage(roomId);
                        const roomKey = String(idx) + '-' + String(roomId);
                        return (
                          <div
                            key={roomKey}
                            className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-bg-card transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_30px_var(--color-accent-glow)] hover:scale-[1.02]"
                          >
                            <div className="relative aspect-[4/3] overflow-hidden">
                              <img
                                src={imgSrc}
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
                              <h3 className="text-sm font-black leading-snug text-text-primary group-hover:text-accent transition-colors line-clamp-2">{title}</h3>
                              <div className="mt-auto pt-3 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent opacity-0 transition-all duration-300 transform translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0">
                                View room <ArrowRight className="h-3 w-3" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PublicProfile;
