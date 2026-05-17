import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Trophy, Zap, Globe, ArrowLeft, ExternalLink } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { CardBase } from '../../../shared/components/ui/Card';
import CpLogo from '../../../shared/components/CpLogo';
import api from '../../../core/services/api';
import HeroBackground from '../components/HeroBackground';
import AsciiHeading from '../../../shared/components/ui/AsciiHeading';

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
    api.get(`/public/users/${encodeURIComponent(handle)}`)
      .then((res) => { if (mounted) setProfile(res.data || null); })
      .catch(() => { if (mounted) setNotFound(true); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-14 h-14 border-[5px] border-border border-t-accent rounded-full"
        />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-4 px-4">
        <Shield className="w-12 h-12 text-text-muted opacity-30" />
        <h1 className="text-2xl font-black text-text-primary uppercase">Operator Not Found</h1>
        <p className="text-text-muted text-sm">No operator with that handle exists.</p>
        <Link
          to="/"
          className="btn-secondary text-sm mt-2">Go Home</Link>
      </div>
    );
  }

  const cp = Number(profile.cpPoints || 0);
  const progress = rankProgress(cp);
  const next = nextRank(cp);
  const initials = (profile.handle || profile.name || 'OP').substring(0, 2).toUpperCase();

  return (
    <div className="ascii-section min-h-screen bg-bg pb-16 scanlines relative">
      <HeroBackground className="opacity-40" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 py-10">

         <ScrollReveal className="mb-10">
           <AsciiHeading
             text={profile.handle || profile.name || 'Operator'}
             font="Cybermedium"
             animated
             glow="intense"
             className="mb-4"
           />
         </ScrollReveal>

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent text-xs font-bold uppercase tracking-widest mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardBase className="md:col-span-1 p-8 md:p-6 flex flex-col items-center text-center gap-5 glass-effect">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="w-32 h-32 md:w-24 md:h-24 rounded-full border-2 border-border-strong object-cover" />
            ) : (
              <div className="w-32 h-32 md:w-24 md:h-24 rounded-full border-2 border-border-strong bg-accent-dim flex items-center justify-center text-4xl md:text-3xl font-black text-accent">
                {initials}
              </div>
            )}
            <div>
              <h2 className="text-xl md:text-lg font-black text-text-primary uppercase tracking-tight">{profile.handle || profile.name}</h2>
              <p className="text-[11px] md:text-[10px] font-mono text-accent uppercase tracking-widest mt-1.5 md:mt-1">{profile.rank || 'Operator'}</p>
            </div>
            {profile.bio && <p className="text-sm md:text-xs text-text-muted leading-relaxed italic">"{profile.bio}"</p>}
            <div className="w-full pt-5 border-t border-border flex justify-center gap-6 md:gap-4">
              {profile.website && <a href={profile.website} target="_blank" rel="noreferrer" className="text-text-muted hover:text-accent"><Globe className="w-5 h-5 md:w-4 md:h-4" /></a>}
              {profile.twitter && <a href={`https://x.com/${profile.twitter.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-text-muted hover:text-accent"><ExternalLink className="w-5 h-5 md:w-4 md:h-4" /></a>}
            </div>
          </CardBase>

          <div className="md:col-span-2 space-y-6">
            <CardBase className="p-8 md:p-6 glass-effect">
              <div className="flex items-center justify-between mb-8 md:mb-6">
                <div className="flex items-center gap-3 text-accent">
                  <CpLogo className="w-6 h-6 md:w-5 md:h-5" />
                  <span className="font-mono font-black text-3xl md:text-2xl">{cp.toLocaleString()}</span>
                </div>
                <div className="text-[11px] md:text-[10px] font-black uppercase tracking-widest text-text-muted">CP Balance</div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] md:text-[10px] font-black uppercase tracking-widest text-text-muted">
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
                {next && <p className="text-[10px] md:text-[9px] text-text-muted text-right">Next rank: <span className="text-accent">{next.label}</span> at {next.min} CP</p>}
              </div>
            </CardBase>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <CardBase className="p-6 md:p-5 flex flex-col gap-3 glass-effect">
                <Trophy className="w-5 h-5 md:w-4 md:h-4 text-accent" />
                <span className="text-2xl md:text-xl font-black text-text-primary">{profile.completedRoomsCount || 0}</span>
                <span className="text-[10px] md:text-[9px] font-black uppercase tracking-widest text-text-muted">Rooms Cleared</span>
              </CardBase>
              <CardBase className="p-6 md:p-5 flex flex-col gap-3 glass-effect">
                <Zap className="w-5 h-5 md:w-4 md:h-4 text-accent" />
                <span className="text-2xl md:text-xl font-black text-text-primary">{profile.activeStreak || 0}</span>
                <span className="text-[10px] md:text-[9px] font-black uppercase tracking-widest text-text-muted">Day Streak</span>
              </CardBase>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
