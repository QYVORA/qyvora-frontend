import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Mail, Edit3, Activity, ArrowRight, ChevronDown, Shield, User, Trophy } from 'lucide-react';
import ShareProfile from '../../../shared/components/ShareProfile';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import Identicon from '../../../shared/components/Identicon';
import BootcampBadge from '../../../shared/components/BootcampBadge';
import api from '../../../core/services/api';
import EditModal from '../components/profile/EditModal';
import { ProfileSkeleton } from '../components/StudentSkeletons';
import SEO from '../../../shared/components/SEO';
import { getRoomCoverImage } from '../utils/walkthroughImages';
import LearningOverviewCard from '../components/learning/LearningOverviewCard';

const Profile: React.FC = () => {
  const { username: paramUsername } = useParams<{ username?: string }>();
  const { user: authUser } = useAuth();
  const { addToast } = useToast();
  const [profileApi, setProfileApi] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAchievements, setShowAchievements] = useState(false);

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
  const getRoomImage = (roomId: number) => String(getRoomCoverImage(roomId));

  const badgeCount = bootcampCompleted ? 1 : 0;
  const achievementCount = badgeCount + rooms.length;

  const editInitial = {
    name: profileData.name,
    hackerHandle: profileData.username,
    bio: profileData.bio,
    organization: profileData.organization,
  };

  if (loading) return <ProfileSkeleton />;

  return (
    <div className="bg-bg">
      <SEO
        title={`@${profileData.username}'s Profile`}
        description={`View the operator profile, rank, and accomplishments of @${profileData.username} on QYVORA. — ${profileData.rank} — ${profileData.cp.toLocaleString()} CP earned.`}
        image="https://qyvora.netlify.app/favicon.png"
      />

      <div className="px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24 space-y-6">
        {/* Profile Overview Card */}
        <LearningOverviewCard
          icon={<User className="w-6 h-6 text-bg" />}
          title={`@${profileData.username}`}
          description={profileData.bio || `${profileData.rank} operator`}
          avatar={
            <div className="w-full h-full bg-black flex items-center justify-center">
              <Identicon value={profileData.id} size={256} className="w-full h-full" />
            </div>
          }
          stats={[
            { label: 'CP', value: profileData.cp.toLocaleString(), accent: true },
            { label: 'Rank', value: profileData.rank },
            { label: 'Rooms', value: rooms.length },
          ]}
          action={isOwnProfile ? {
            label: 'Edit Profile',
            onClick: () => setEditOpen(true),
            icon: <Edit3 className="w-4 h-4" />,
          } : undefined}
        />

        {/* Meta Row: info + actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
            {profileData.organization && (
              <span className="flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-accent" /> {profileData.organization}
              </span>
            )}
            {isOwnProfile && authUser?.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-accent" /> {authUser.email}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/@${profileData.username}`}
              className="btn-secondary !text-xs inline-flex items-center gap-2"
            >
              Public View
            </Link>
            <ShareProfile handle={profileData.username} />
          </div>
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
          <span className="px-1.5 py-0.5 bg-accent/10 text-accent text-[9px] font-black rounded-lg">{achievementCount}</span>
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
                        <span className="ml-2 px-1.5 py-0.5 bg-accent/10 text-accent text-[9px] font-black rounded-lg">{rooms.length}</span>
                      </h3>
                    </div>
                    <div className="p-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {rooms.map((room: { roomId: number; title: string }, idx: number) => (
                        <div
                          key={String(room.roomId) + '-' + String(idx)}
                          className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border/30 bg-bg-card transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_30px_var(--color-accent-glow)] hover:scale-[1.02]"
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
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
