import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, Trophy, Zap, Globe, Mail, Edit3, ChevronRight, Activity, Target, Award, ExternalLink } from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import CpLogo from '../../../shared/components/CpLogo';
import api from '../../../core/services/api';
import EditModal from '../components/profile/EditModal';
import { AchievementShowcase } from '../components/achievements/AchievementShowcase';
import { Achievement } from '../components/achievements/AchievementCard';
import PageLoader from '../../../shared/components/PageLoader';

const numericStatValue = (value: string | number) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : Number.NEGATIVE_INFINITY;
  const parsed = Number(String(value).replace(/[^0-9.-]+/g, ''));
  return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY;
};

/* ── main page ── */
const Profile: React.FC = () => {
  const { username: paramUsername } = useParams<{ username?: string }>();
  const { user: authUser } = useAuth();
  const [profileApi, setProfileApi] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
    username: isOwnProfile
      ? (profileApi?.hackerHandle || profileApi?.name || displayHandle)
      : (profileApi?.handle || profileApi?.name || displayHandle),
    rank: String(profileApi?.xpSummary?.rank || profileApi?.rank || authUser?.rank || 'Candidate'),
    bio: String(profileApi?.bio || ''),
    organization: String(profileApi?.organization || ''),
    name: String(profileApi?.name || ''),
    cp: Number(profileApi?.cpPoints || authUser?.cp || 0),
    streakDays: Number(profileApi?.xpSummary?.streakDays || 0),
    completedRooms: Array.isArray(profileApi?.learn?.completedRooms) ? profileApi.learn.completedRooms : [],
    unlockedModules: Array.isArray(profileApi?.emblems?.unlockedModules) ? profileApi.emblems.unlockedModules : [],
  }), [isOwnProfile, profileApi, authUser, displayHandle]);
  const profileStats = [
    { label: 'Balance', value: profileData.cp.toLocaleString(), icon: Zap },
    { label: 'Modules Done', value: profileData.unlockedModules.length, icon: Award },
    { label: 'Streak', value: `${profileData.streakDays}d`, icon: Trophy },
  ]
    .map((stat, index) => ({ ...stat, index, sortValue: numericStatValue(stat.value) }))
    .sort((a, b) => (b.sortValue - a.sortValue) || (a.index - b.index));

  const editInitial = {
    name: profileData.name,
    hackerHandle: profileData.username,
    bio: profileData.bio,
    organization: profileData.organization,
  };

  if (loading) return <PageLoader />;

  return (
    <div className="bg-bg">
      <div
        className="lg:fixed lg:left-0 lg:right-20 lg:bottom-0 lg:top-24 lg:overflow-y-auto lg:overscroll-contain scroll-hover"
        style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)', maskImage: 'linear-gradient(to bottom, transparent 0px, black 24px)' }}
      >
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-16 md:px-8">

        {/* HEADER */}
<ScrollReveal className="mb-10 md:mb-12">
         
           <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-bg-card p-8 md:p-10">
            <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            {/* Terminal panel illustration — fades into the right edge */}
            <img
              src="/assets/illustrations/hero-terminal-panel.webp"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute right-0 bottom-0 h-full w-auto object-contain object-right-bottom opacity-[0.10] select-none"
            />

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* Avatar */}
              <div className="relative flex-none">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl border-2 border-accent/20 bg-accent-dim flex items-center justify-center text-accent text-2xl md:text-3xl font-black font-mono">
                  {profileData.username.substring(0, 2).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 md:w-8 md:h-8 rounded-lg bg-accent text-bg flex items-center justify-center border-4 border-bg-card">
                  <Shield className="w-3 h-3 md:w-4 md:h-4" />
                </div>
              </div>

              {/* Identity */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-black text-text-primary tracking-tighter uppercase font-mono truncate">
                    {profileData.username}
                  </h1>
                  <span className="px-2 py-0.5 bg-accent/10 border border-accent/30 text-accent text-[10px] font-bold rounded uppercase tracking-widest flex-none">
                    {profileData.rank}
                  </span>
                </div>
                {profileData.bio && (
                  <p className="text-text-muted text-sm mb-3 italic">{profileData.bio}</p>
                )}
                <div className="flex flex-wrap gap-5 text-xs font-bold text-text-muted uppercase tracking-widest">
                  {profileData.organization && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-accent" /> {profileData.organization}
                    </div>
                  )}
                  {isOwnProfile && authUser?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-accent" /> {authUser.email}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-accent" /> {profileData.streakDays}-day streak
                  </div>
                </div>
              </div>

              {/* Actions */}
              {isOwnProfile && (
                <div className="flex items-center gap-2 flex-none flex-wrap">
                  <a
                    href={`/u/${profileData.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-bg border border-border hover:border-accent/50 rounded-lg text-xs font-bold text-text-muted transition-all active:scale-95"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Public Profile
                  </a>
                  <button
                    onClick={() => setEditOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-bg border border-border hover:border-accent/50 rounded-lg text-xs font-bold text-text-primary transition-all active:scale-95"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT — stats */}
          <div className="space-y-6">
            <ScrollReveal delay={0.1}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profileStats.map((s, i) => (
                  <div key={i} className="p-4 bg-bg border border-border rounded-xl flex items-center gap-3 min-w-0">
                    <s.icon className="w-4 h-4 text-accent shrink-0" />
                    <div className="text-xl font-black text-text-primary font-mono truncate">{s.value}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {isOwnProfile && (
              <ScrollReveal delay={0.2}>
                <div className="grid grid-cols-1 gap-3">
                  <Link to="/dashboard/wallet" className="p-5 bg-accent-dim border border-accent/20 rounded-xl hover:bg-accent-dim/50 transition-all group">
                    <h4 className="text-xs font-bold text-accent mb-1 uppercase">Operator Wallet</h4>
                    <p className="text-[11px] text-text-muted mb-3">Manage <CpLogo className="w-3.5 h-3.5 mx-1" /> and transaction history.</p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-text-primary uppercase group-hover:translate-x-1 transition-transform">
                      Open <ChevronRight className="w-3 h-3" />
                    </div>
                  </Link>
                  <Link to="/dashboard" className="p-5 bg-bg border border-border rounded-xl hover:border-accent/40 transition-all group">
                    <h4 className="text-xs font-bold text-text-primary mb-1 uppercase">Mission Control</h4>
                    <p className="text-[11px] text-text-muted mb-3">Back to active training.</p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-accent uppercase group-hover:translate-x-1 transition-transform">
                      Open <ChevronRight className="w-3 h-3" />
                    </div>
                  </Link>
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* RIGHT — activity */}
          <div className="lg:col-span-2 space-y-6">

            {/* Achievements Showcase */}
            <ScrollReveal delay={0.2}>
              <div className="card-hsociety p-8">
                <AchievementShowcase 
                  achievements={[
                    { 
                      id: 'cp_2000', 
                      title: 'Seed Fund', 
                      description: 'Begin your journey with 2000 Community Points.', 
                      image: '/assets/achievements/badges/common/cp_2000.png', 
                      rarity: 'common', 
                      isLocked: profileData.cp < 2000 
                    },
                    { 
                      id: 'first_room', 
                      title: 'First Step', 
                      description: 'Complete your first bootcamp room.', 
                      image: '/assets/achievements/badges/common/first_room.png', 
                      rarity: 'common', 
                      isLocked: profileData.completedRooms.length === 0 
                    },
                    { 
                      id: 'linux_specialist', 
                      title: 'Linux Specialist', 
                      description: 'Complete all rooms in the Linux Foundations module.', 
                      image: '/assets/achievements/badges/uncommon/linux_specialist.png', 
                      rarity: 'uncommon', 
                      isLocked: !profileData.unlockedModules.includes('2') 
                    },
                    { 
                      id: 'protocol_ascendant', 
                      title: 'Protocol Ascendant', 
                      description: 'Reach the highest rank in the Hacker Protocol bootcamp.', 
                      image: '/assets/achievements/badges/legendary/protocol_ascendant.png', 
                      rarity: 'legendary', 
                      isLocked: profileData.rank !== 'Elite' 
                    },
                  ]} 
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
      </div>

      {/* Edit modal — outside the scrollable div */}
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
