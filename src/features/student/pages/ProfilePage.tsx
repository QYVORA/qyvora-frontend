import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, Trophy, Zap, Globe, Mail, Edit3, ChevronRight, Activity, Target, Award, ExternalLink, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { formatNumber } from '../../../shared/utils/formatNumber';
import CpLogo from '../../../shared/components/CpLogo';
import api from '../../../core/services/api';
import EditModal from '../components/profile/EditModal';
import PageLoader from '../../../shared/components/PageLoader';
import OptionalDecorImage from '../../../shared/components/OptionalDecorImage';
import { STUDENT_DECOR } from '../constants/studentDecorPaths';

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
    streakDays: Number(profileApi?.xpSummary?.streakDays || profileApi?.streakDays || 0),
    completedRooms: Array.isArray(profileApi?.learn?.completedRooms) ? profileApi.learn.completedRooms : [],
    unlockedModules: Array.isArray(profileApi?.emblems?.unlockedModules) ? profileApi.emblems.unlockedModules : [],
    avatarUrl: profileApi?.avatarUrl || '',
  }), [isOwnProfile, profileApi, authUser, displayHandle]);

  const profileStats = [
    { label: 'CP Balance', value: formatNumber(profileData.cp), icon: Zap, color: 'text-accent' },
    { label: 'Rooms Done', value: profileData.completedRooms.length, icon: Target, color: 'text-text-primary' },
    { label: 'Day Streak', value: `${profileData.streakDays}d`, icon: Trophy, color: 'text-orange-400' },
  ];

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
        <ScrollReveal className="mb-8 md:mb-10">
           <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-bg-card p-8 md:p-12 shadow-2xl">
            <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            
            <OptionalDecorImage
              src={STUDENT_DECOR.bootcampOperator}
              className="pointer-events-none absolute right-0 bottom-0 h-full w-auto object-contain object-right-bottom opacity-[0.08] select-none"
            />

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* Avatar */}
              <div className="relative flex-none">
                {profileData.avatarUrl ? (
                  <img 
                    src={profileData.avatarUrl} 
                    alt="" 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-2 border-accent/20 object-cover shadow-2xl" 
                  />
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-2 border-accent/20 bg-accent-dim flex items-center justify-center text-accent text-3xl md:text-4xl font-black font-mono">
                    {profileData.username.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 rounded-lg bg-accent text-bg flex items-center justify-center border-4 border-bg-card shadow-lg">
                  <Shield className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>

              {/* Identity */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="text-3xl md:text-5xl font-black text-text-primary tracking-tighter uppercase font-mono truncate">
                    {profileData.username}
                  </h1>
                  <span className="px-3 py-1 bg-accent/10 border border-accent/30 text-accent text-[10px] md:text-xs font-bold rounded uppercase tracking-widest flex-none">
                    {profileData.rank}
                  </span>
                </div>
                {profileData.bio && (
                  <p className="text-text-muted text-base mb-4 italic leading-relaxed max-w-2xl font-medium">"{profileData.bio}"</p>
                )}
                <div className="flex flex-wrap gap-6 text-[11px] font-bold text-text-muted uppercase tracking-widest">
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
                    <Activity className="w-4 h-4 text-accent" /> Active Status
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-none flex-wrap">
                {isOwnProfile ? (
                  <>
                    <Link
                      to={`/@${profileData.username}`}
                      className="flex items-center gap-2 px-5 py-3 bg-bg border border-border hover:border-accent/50 rounded-xl text-xs font-black uppercase tracking-widest text-text-muted transition-all active:scale-95 shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Public View
                    </Link>
                    <button
                      onClick={() => setEditOpen(true)}
                      className="flex items-center gap-2 px-5 py-3 bg-accent text-bg border border-accent rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-accent/20"
                    >
                      <Edit3 className="w-4 h-4" /> Edit Profile
                    </button>
                  </>
                ) : (
                  <Link
                    to={`/@${profileData.username}`}
                    className="flex items-center gap-2 px-5 py-3 bg-accent text-bg border border-accent rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-accent/20"
                  >
                    <ExternalLink className="w-4 h-4" /> View Public Page
                  </Link>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* LEFT — stats */}
          <div className="lg:col-span-2 space-y-6">
            <ScrollReveal delay={0.1}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profileStats.map((s, i) => (
                  <div key={i} className="card-hsociety p-6 flex flex-col gap-3">
                    <s.icon className={`w-5 h-5 ${s.color} shrink-0`} />
                    <div className="text-3xl font-black text-text-primary font-mono tracking-tighter">{s.value}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">{s.label}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {isOwnProfile && (
              <ScrollReveal delay={0.2}>
                <div className="grid grid-cols-1 gap-4">
                  <Link to="/dashboard/wallet" className="p-6 bg-accent-dim border border-accent/20 rounded-2xl hover:bg-accent-dim/50 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <CpLogo className="w-16 h-16" />
                    </div>
                    <h4 className="text-xs font-black text-accent mb-1 uppercase tracking-widest">Operator Wallet</h4>
                    <p className="text-xs text-text-muted mb-4 max-w-[200px]">Manage your CP balance and transaction history.</p>
                    <div className="flex items-center gap-2 text-[10px] font-black text-text-primary uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                      Open Wallet <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                  <Link to="/dashboard" className="p-6 bg-bg border border-border rounded-2xl hover:border-accent/40 transition-all group relative overflow-hidden">
                    <h4 className="text-xs font-black text-text-primary mb-1 uppercase tracking-widest">Mission Control</h4>
                    <p className="text-xs text-text-muted mb-4 max-w-[200px]">Back to your active training and bootcamps.</p>
                    <div className="flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                      Continue <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* RIGHT — activity */}
          <div className="lg:col-span-3 space-y-6">

            {/* Achievements Showcase */}
            <ScrollReveal delay={0.2}>
              <div className="card-hsociety p-8 md:p-10 relative overflow-hidden">
                <div className="absolute inset-0 dot-grid opacity-[0.05] pointer-events-none" />
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <Trophy className="w-5 h-5 text-accent" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-primary">Achievement Showcase</h3>
                </div>

                <div className="relative z-10">
                  {/* Achievement showcase temporarily disabled - component missing */}
                  <p className="text-sm text-text-muted italic">Achievement showcase coming soon...</p>
                </div>
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
