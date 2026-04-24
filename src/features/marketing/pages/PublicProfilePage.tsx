import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Trophy, Zap, Globe, ArrowLeft, ExternalLink } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import CpLogo from '../../../shared/components/CpLogo';
import api from '../../../core/services/api';

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
          className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full"
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
        <Link to="/leaderboard" className="btn-secondary text-sm mt-2">View Leaderboard</Link>
      </div>
    );
  }

  const cp = Number(profile.cpPoints || 0);
  const progress = rankProgress(cp);
  const next = nextRank(cp);
  const initials = (profile.handle || profile.name || 'OP').substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-bg pb-16 scanlines">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10">

        {/* Back */}
        <Link
          to="/leaderboard"
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent text-xs font-bold uppercase tracking-widest mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Leaderboard
        </Link>

        {/* Profile card */}
        <ScrollReveal>
          <div className="relative bg-bg-card border border-border rounded-2xl overflow-hidden mb-6">
            {/* Accent glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute inset-0 dot-grid opacity-[0.06] pointer-events-none" />

            <div className="relative z-10 p-6 md:p-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              {/* Avatar */}
              <div className="relative flex-none">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-accent/30 bg-accent-dim flex items-center justify-center text-accent text-2xl md:text-3xl font-black font-mono">
                  {initials}
                </div>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-accent text-bg flex items-center justify-center border-4 border-bg-card">
                  <Shield className="w-3 h-3" />
                </div>
              </div>

              {/* Identity */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-black text-text-primary tracking-tighter uppercase font-mono">
                    {profile.handle || profile.name || 'Operator'}
                  </h1>
                  <span className="px-2 py-0.5 bg-accent/10 border border-accent/30 text-accent text-[10px] font-bold rounded uppercase tracking-widest flex-none">
                    {profile.rank || 'Candidate'}
                  </span>
                </div>

                {profile.bio && (
                  <p className="text-text-muted text-sm mb-3 italic">{profile.bio}</p>
                )}

                <div className="flex flex-wrap gap-4 text-xs font-bold text-text-muted uppercase tracking-widest">
                  {profile.organization && (
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-accent" /> {profile.organization}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-accent" /> {profile.streakDays || 0}-day streak
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats row */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-5 bg-bg-card border border-border rounded-xl">
              <Zap className="w-4 h-4 text-accent mb-2" />
              <div className="text-2xl font-black text-accent font-mono inline-flex items-center gap-1.5">
                {cp.toLocaleString()} <CpLogo className="w-5 h-5" />
              </div>
              <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-1">Cyber Points</div>
            </div>
            <div className="p-5 bg-bg-card border border-border rounded-xl">
              <Shield className="w-4 h-4 text-accent mb-2" />
              <div className="text-xl font-black text-text-primary font-mono">{profile.rank || 'Candidate'}</div>
              <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-1">Current Rank</div>
            </div>
            <div className="p-5 bg-bg-card border border-border rounded-xl col-span-2 sm:col-span-1">
              <Trophy className="w-4 h-4 text-accent mb-2" />
              <div className="text-xl font-black text-text-primary font-mono">{profile.streakDays || 0}d</div>
              <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-1">Active Streak</div>
            </div>
          </div>
        </ScrollReveal>

        {/* Rank progress */}
        {next && (
          <ScrollReveal delay={0.15}>
            <div className="p-5 bg-bg-card border border-border rounded-xl mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Rank Progress</span>
                <span className="text-xs font-mono text-accent">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-accent-dim rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-accent rounded-full"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold text-text-muted uppercase">
                <span>{profile.rank}</span>
                <span className="text-accent">→ {next.label}</span>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* CTA */}
        <ScrollReveal delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/leaderboard" className="btn-secondary text-sm flex items-center justify-center gap-2 flex-1">
              <Trophy className="w-4 h-4" /> Full Leaderboard
            </Link>
            <Link to="/register" className="btn-primary text-sm flex items-center justify-center gap-2 flex-1">
              Join HSOCIETY <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default PublicProfile;
