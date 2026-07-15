import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { IconArrowLeft, IconArrowRight } from '@/shared/components/icons';
import { ChevronDown, Shield, Trophy } from 'lucide-react';
import NotFoundPage from '../../../shared/pages/NotFoundPage';
import ShareProfile from '../../../shared/components/ShareProfile';
import Identicon from '../../../shared/components/Identicon';
import BootcampBadge from '../../../shared/components/BootcampBadge';
import api from '../../../core/services/api';
import PageLoader from '../../../shared/components/PageLoader';
import SEO from '../../../shared/components/SEO';
import { Navbar } from '../../../shared/components/layout';
import { getRoomCoverImage } from '../../../shared/utils/walkthroughImages';
import LearningOverviewCard from '../../student/components/learning/LearningOverviewCard';

const PublicProfile: React.FC = () => {
  const { handle: rawHandle } = useParams<{ handle: string }>();
  const location = useLocation();

  const isValidHandle = rawHandle && rawHandle.startsWith('@');
  const handle = isValidHandle ? rawHandle.slice(1) : '';

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

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

  const badgeCount = bootcampCompleted ? 1 : 0;
  const achievementCount = badgeCount + rooms.length;

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
        {/* Profile Overview Card */}
        <LearningOverviewCard
          icon={<></>}
          title={`@${profile.handle || profile.name}`}
          description={profile.bio || `${profile.rank || 'Operator'} operator`}
          avatar={
            <div className="w-full h-full bg-black flex items-center justify-center">
              <Identicon value={profile.id} size={256} className="w-full h-full" />
            </div>
          }
          stats={[
            { label: 'CP', value: cp.toLocaleString(), accent: true },
            { label: 'Rank', value: profile.rank || 'Operator' },
            { label: 'Rooms', value: rooms.length },
          ]}
          action={{
            label: 'Back to Home',
            to: '/',
            icon: <IconArrowLeft className="w-3.5 h-3.5" />,
          }}
        />

        {/* Meta Row: share */}
        <div className="flex justify-end">
          <ShareProfile handle={handle || ''} />
        </div>

        {/* Achievements Strip */}
        <button
          onClick={() => setShowAchievements(!showAchievements)}
          className="w-full border border-border/30 rounded-xl bg-bg-card px-4 py-3 flex items-center gap-3 hover:bg-accent-dim/5 transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4 text-accent" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-text-primary">Achievements</span>
          <span className="px-1.5 py-0.5 bg-accent/10 text-accent text-[9px] font-black rounded-md">{achievementCount}</span>
          <div className="ml-auto flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-text-muted group-hover:text-accent transition-colors">
            {showAchievements ? 'Collapse' : 'Expand'}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showAchievements ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Achievements Content */}
        <AnimatePresence initial={false}>
          {showAchievements && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-6">
                {/* Badges */}
                <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4">Badges</h3>
                  {bootcampCompleted ? (
                    <div className="flex items-center gap-3">
                      <BootcampBadge completed className="w-20 h-20" />
                      <span className="text-xs font-bold text-text-primary">HPB Graduate</span>
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted">No badges earned yet.</p>
                  )}
                </div>

                {/* Completed Rooms */}
                {rooms.length > 0 && (
                  <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
                    <div className="px-5 py-4 border-b border-border/30">
                      <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">
                        Completed Rooms
                        <span className="ml-2 px-1.5 py-0.5 bg-accent/10 text-accent text-[9px] font-black rounded-md">{rooms.length}</span>
                      </h3>
                    </div>
                    <div className="p-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {rooms.map((room: Record<string, unknown>, idx: number) => {
                        const roomId = Number(room?.roomId) || 0;
                        const title = String(room?.title ?? '');
                        const imgSrc = getRoomImage(roomId);
                        const roomKey = String(idx) + '-' + String(roomId);
                        return (
                          <div
                            key={roomKey}
                            className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border/30 bg-bg-card transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_30px_var(--color-accent-glow)] hover:scale-[1.02]"
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
                              <h3 className="text-sm font-black leading-snug text-text-primary group-hover:text-accent transition-colors line-clamp-2 break-words">{title}</h3>
                              <div className="mt-auto pt-3 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent opacity-0 transition-all duration-300 transform translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0">
                                View room <IconArrowRight className="h-3 w-3" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PublicProfile;
