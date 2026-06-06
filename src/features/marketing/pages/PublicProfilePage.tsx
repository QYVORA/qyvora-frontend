import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Trophy, Zap, Globe, ArrowLeft, ExternalLink, ChevronRight } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { CardBase } from '../../../shared/components/ui/Card';
import CpLogo from '../../../shared/components/CpLogo';
import api from '../../../core/services/api';
import HeroBackground from '../components/HeroBackground';
import SimpleHeading from '../../../shared/components/ui/SimpleHeading';
import PageLoader from '../../../shared/components/PageLoader';
import { formatNumber } from '../../../shared/utils/formatNumber';

const RANK_THRESHOLDS = [
  { label: 'Vanguard',    min: 1500 },
  { label: 'Architect',   min: 900  },
  { label: 'Specialist',  min: 450  },
  { label: 'Contributor', min: 150  },
  { label: 'Candidate',   min: 0    },
];

const nextRank = (cp: number) => {
  const idx = RANK_THRESHOLDS.findIndex((r) => cp >= r.min);
  return idx > 0 ? RANK_THRESHOLDS[idx - 1] : null;
};

const rankProgress = (cp: number) => {
  const idx = RANK_THRESHOLDS.findIndex((r) => cp >= r.min);
  if (idx <= 0) return 100;
  const current = RANK_THRESHOLDS[idx];
  const next = RANK_THRESHOLDS[idx - 1];
  return Math.round(((cp - current.min) / (next.min - current.min)) * 100);
};

const PublicProfile: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!handle) { setNotFound(true); setLoading(false); return; }
    
    let mounted = true;
    
    // Remove @ prefix if present in the URL parameter
    const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;
    
    api.get(`/public/users/${encodeURIComponent(cleanHandle)}`)
      .then((res) => { if (mounted) setProfile(res.data || null); })
      .catch(() => { if (mounted) setNotFound(true); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [handle]);

  if (loading) return <PageLoader />;

  if (notFound || !profile) {
    // Clean handle for display (remove @ if present)
    const displayHandle = handle?.startsWith('@') ? handle : `@${handle}`;
    
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 px-4">
        <Shield className="w-16 h-16 text-accent opacity-20" />
        <div className="text-center">
          <h1 className="text-3xl font-black text-text-primary uppercase tracking-tighter mb-2">Operator Not Found</h1>
          <p className="text-text-muted text-sm max-w-xs mx-auto">The handle <span className="text-accent font-mono">{displayHandle}</span> does not exist in the Hall of Shadows.</p>
        </div>
        <Link to="/" className="btn-primary px-8 py-3 text-sm">Return Home</Link>
      </div>
    );
  }

  const cp = Number(profile.cpPoints || 0);
  const progress = rankProgress(cp);
  const next = nextRank(cp);
  const initials = (profile.handle || profile.name || 'OP').substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-bg pb-20 relative overflow-hidden">
      <HeroBackground className="opacity-30" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pt-12 md:pt-20">
        
        {/* Navigation */}
        <div className="mb-10 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-text-muted hover:text-accent text-xs font-bold uppercase tracking-widest transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Base
          </Link>
          <div className="h-[1px] flex-1 mx-6 bg-border/40 hidden md:block" />
          <span className="text-[10px] font-black text-accent uppercase tracking-[0.4em] hidden md:block">
            Public Protocol Profile
          </span>
        </div>

        {/* PROFILE HEADER */}
        <ScrollReveal className="mb-8">
          <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-bg-card p-8 md:p-10">
            <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* Avatar */}
              <div className="relative flex-none">
                {profile.avatarUrl ? (
                  <img 
                    src={profile.avatarUrl} 
                    alt="" 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-2 border-accent/20 object-cover shadow-2xl" 
                  />
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-2 border-accent/20 bg-accent-dim flex items-center justify-center text-accent text-3xl md:text-4xl font-black font-mono">
                    {initials}
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
                    {profile.handle || profile.name}
                  </h1>
                  <span className="px-3 py-1 bg-accent/10 border border-accent/30 text-accent text-[10px] md:text-xs font-bold rounded uppercase tracking-widest flex-none">
                    {profile.rank || 'Operator'}
                  </span>
                </div>
                {profile.bio && (
                  <p className="text-text-muted text-base mb-4 italic leading-relaxed max-w-2xl font-medium">"{profile.bio}"</p>
                )}
                <div className="flex flex-wrap gap-6 text-[11px] font-bold text-text-muted uppercase tracking-widest">
                  {profile.organization && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-accent" /> {profile.organization}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-accent">
                    <Zap className="w-4 h-4" /> {profile.streakDays || 0}-day streak
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* STATS COLUMN */}
          <div className="lg:col-span-1 space-y-6">
            <ScrollReveal delay={0.1}>
              <div className="card-hsociety p-8 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">Protocol Balance</div>
                  <CpLogo className="w-6 h-6 text-accent" />
                </div>
                <div className="text-5xl font-black text-text-primary font-mono tracking-tighter">
                  {formatNumber(cp)}
                </div>
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-muted">
                    <span>Rank Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-accent shadow-[0_0_12px_var(--color-accent-glow)]"
                    />
                  </div>
                  {next && (
                    <p className="text-[10px] text-text-muted font-bold text-right uppercase tracking-wider">
                      Next: <span className="text-accent">{next.label}</span> at {next.min} CP
                    </p>
                  )}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2} className="grid grid-cols-2 gap-4">
              <div className="card-hsociety p-6 flex flex-col gap-3">
                <Trophy className="w-5 h-5 text-accent" />
                <span className="text-2xl font-black text-text-primary font-mono">{profile.completedRoomsCount || 0}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Rooms Cleared</span>
              </div>
              <div className="card-hsociety p-6 flex flex-col gap-3">
                <Zap className="w-5 h-5 text-accent" />
                <span className="text-2xl font-black text-text-primary font-mono">{profile.streakDays || 0}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Current Streak</span>
              </div>
            </ScrollReveal>
          </div>

          {/* ACTIVITY COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            <ScrollReveal delay={0.3}>
              <div className="card-hsociety p-8 min-h-[400px]">
                <div className="flex items-center gap-3 mb-8">
                  <Trophy className="w-5 h-5 text-accent" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-primary">Achievement Showcase</h3>
                </div>
                
                {/* Placeholder for achievements — matching the dashboard's Showcase if we had the data */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-bg flex items-center gap-4 opacity-40 grayscale">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-accent/40" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-text-primary truncate uppercase tracking-wider">Locked Status</div>
                      <div className="text-[10px] text-text-muted">Continue training...</div>
                    </div>
                  </div>
                  {/* ... more placeholders ... */}
                  <div className="p-4 rounded-xl border border-border bg-bg flex items-center gap-4 opacity-40 grayscale">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-accent/40" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-text-primary truncate uppercase tracking-wider">Shadow Protocol</div>
                      <div className="text-[10px] text-text-muted">Undisclosed...</div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-8 border-2 border-dashed border-border rounded-2xl text-center">
                  <p className="text-sm text-text-muted font-medium">This operator's activity is cryptographically verified on the HSOCIETY Chain.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
