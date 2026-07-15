import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Edit3, Activity, ArrowRight, ChevronRight, Shield, User } from 'lucide-react';
import ShareProfile from '../../../shared/components/ShareProfile';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import Identicon from '../../../shared/components/Identicon';
import CpLogo from '../../../shared/components/CpLogo';
import BootcampBadge from '../../../shared/components/BootcampBadge';
import api from '../../../core/services/api';
import EditModal from '../components/profile/EditModal';
import { ProfileSkeleton } from '../components/StudentSkeletons';
import { StreakIcon } from '../../../shared/components';
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
  const [showRooms, setShowRooms] = useState(false);
  const [showBadges, setShowBadges] = useState(false);

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

      <div className=" px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24 space-y-6">
        {/* Header */}
        <LearningOverviewCard
          icon={<User className="w-6 h-6 text-bg" />}
          title={`@${profileData.username}`}
          description={profileData.bio || `${profileData.rank} operator`}
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

        {/* Avatar + Info Row */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16">
          {/* Left sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="md:w-[280px] lg:w-[300px] shrink-0 space-y-6 md:sticky md:top-[72px] md:self-start md:pb-16"
          >
            <div className="w-24 h-24 md:w-40 md:h-40 lg:w-48 lg:h-48">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-accent/20 shadow-[0_0_30px_var(--color-accent-glow)]">
                <Identicon value={profileData.id} size={256} className="w-full h-full" />
              </div>
            </div>

            {profileApi?.xpSummary?.streakDays != null && profileApi.xpSummary.streakDays > 0 && (
              <div className="flex items-center gap-3">
                <StreakIcon days={profileApi.xpSummary.streakDays} className="scale-[1.8] origin-left" />
              </div>
            )}

            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-lg border border-accent/20">
              {profileData.rank}
            </span>

            {/* Badges */}
            <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
              <button
                onClick={() => setShowBadges(!showBadges)}
                className="flex items-center gap-2 w-full text-left group px-4 py-3 hover:bg-accent-dim/5 transition-all"
              >
                <ChevronRight className={`w-4 h-4 text-accent transition-transform duration-300 ${showBadges ? 'rotate-90' : ''}`} />
                <span className="text-xs font-black uppercase tracking-widest text-text-primary">Badges</span>
                <span className="px-1.5 py-0.5 bg-accent/10 text-accent text-[9px] font-black rounded-md">{bootcampCompleted ? '1' : '0'}</span>
              </button>
              {showBadges && (
                <div className="px-4 pb-4 pt-1 space-y-3 border-t border-border/30">
                  {bootcampCompleted ? (
                    <div className="flex items-center gap-3 pt-3">
                      <BootcampBadge completed className="w-20 h-20" />
                      <span className="text-xs font-bold text-text-primary">HPB Graduate</span>
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted pt-3">No badges earned yet.</p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {isOwnProfile ? (
                <>
                  <Link
                    to={`/@${profileData.username}`}
                    className="btn-secondary !text-xs inline-flex items-center gap-2"
                  >
                    Public View
                  </Link>
                  <ShareProfile handle={profileData.username} />
                  <button
                    onClick={() => setEditOpen(true)}
                    className="btn-primary !text-xs inline-flex items-center gap-2"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                </>
              ) : (
                <Link
                  to={`/@${profileData.username}`}
                  className="btn-primary !text-xs inline-flex items-center gap-2"
                >
                  View Public Page
                </Link>
              )}
            </div>
          </motion.div>

          {/* Right content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 min-w-0 space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-[0.9] break-words">
                {profileData.username}
              </h1>

              {profileData.bio && (
                <p className="text-base md:text-lg text-text-secondary font-mono leading-relaxed max-w-2xl">
                  {profileData.bio}
                </p>
              )}

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
                {rooms.length > 0 && (
                  <span className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-accent" /> {rooms.length} rooms completed
                  </span>
                )}
              </div>
            </div>

            {/* Completed Rooms */}
            {rooms.length > 0 && (
              <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
                <button
                  onClick={() => setShowRooms(!showRooms)}
                  className="flex items-center gap-2 w-full text-left group px-6 py-4 hover:bg-accent-dim/5 transition-all border-b border-border/30"
                >
                  <ChevronRight className={`w-4 h-4 text-accent transition-transform duration-300 ${showRooms ? 'rotate-90' : ''}`} />
                  <span className="text-base font-black text-text-primary tracking-tight">
                    Completed Rooms
                  </span>
                  <span className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-black rounded-md">
                    {rooms.length}
                  </span>
                </button>

                {showRooms && (
                  <div className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                )}
              </div>
            )}
          </motion.div>
        </div>
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
