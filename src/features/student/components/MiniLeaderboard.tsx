import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Trophy, ChevronRight, ChevronUp } from 'lucide-react';
import { motion } from 'motion/react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';
import { extractCpBalance } from '../../../shared/utils/cpBalance';

const PODIUM_STYLES = [
  { border: 'border-accent/60',    bg: 'bg-accent-dim',   text: 'text-accent',    label: 'text-accent'    },
  { border: 'border-zinc-400/40',  bg: 'bg-zinc-400/10',  text: 'text-zinc-300',  label: 'text-zinc-400'  },
  { border: 'border-amber-600/40', bg: 'bg-amber-600/10', text: 'text-amber-500', label: 'text-amber-600' },
];

interface LeaderEntry { handle: string; name: string; rank: string; totalXp: number; }

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-accent-dim/20 ${className ?? ''}`} />;
}

const MiniLeaderboard: React.FC<{ currentHandle: string }> = ({ currentHandle }) => {
  const [top3, setTop3]       = useState<LeaderEntry[]>([]);
  const [myPos, setMyPos]     = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.get('/public/leaderboard?limit=50')
      .then((res) => {
        if (!mounted) return;
        const data: LeaderEntry[] = Array.isArray(res.data?.leaderboard) ? res.data.leaderboard : [];
        setTop3(data.slice(0, 3));
        const idx = data.findIndex(
          (op) => (op.handle || op.name || '').toLowerCase() === currentHandle.toLowerCase()
        );
        setMyPos(idx >= 0 ? idx + 1 : null);
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [currentHandle]);

  return (
    <ScrollReveal delay={0.1}>
      <div className="card-hsociety p-5 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-[1px] bg-accent/30 pointer-events-none"
        />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-primary">Hall of Shadows</span>
          </div>
          <Link
            to="/dashboard/leaderboard"
            className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
          >
            Full board <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <Skeleton className="h-8 w-8 rounded-lg flex-none" />
                <Skeleton className="h-3 flex-1" />
                <Skeleton className="h-3 w-14" />
              </div>
            ))}
          </div>
        ) : top3.length === 0 ? (
          <p className="text-xs text-text-muted text-center py-4">No operators ranked yet.</p>
        ) : (
          <div className="space-y-2">
            {top3.map((op, i) => {
              const style  = PODIUM_STYLES[i];
              const handle = op.handle || op.name || 'Anonymous';
              const isMe   = handle.toLowerCase() === currentHandle.toLowerCase();
              return (
                <motion.div
                  key={handle}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={`/u/${handle}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl border transition-all hover:brightness-110 ${style.border} ${style.bg} ${isMe ? 'ring-1 ring-accent/40' : ''}`}
                  >
                    <div className={`w-6 flex-none flex items-center justify-center font-mono font-black text-xs ${style.label}`}>
                      {i === 0 ? <Crown className="h-3.5 w-3.5" /> : `#${i + 1}`}
                    </div>
                    <div className={`h-7 w-7 rounded-md flex-none flex items-center justify-center text-[10px] font-black border ${style.border} ${style.bg} ${style.text}`}>
                      {handle[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`font-mono text-xs font-bold truncate ${isMe ? 'text-accent' : 'text-text-primary'}`}>
                        {handle}{isMe && <span className="ml-1 text-[9px] text-accent/70">(you)</span>}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-text-muted truncate">
                        {op.rank || 'Operator'}
                      </div>
                    </div>
                    <div className={`font-mono text-xs font-black flex-none truncate max-w-[80px] text-right ${style.text}`}>
                      {(extractCpBalance(op) ?? Number(op.totalXp || 0)).toLocaleString()}
                      <span className="text-[8px] ml-0.5 opacity-60">CP</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && myPos !== null && myPos > 3 && (
          <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
            <span className="text-[10px] text-text-muted uppercase tracking-widest">Your position</span>
            <div className="flex items-center gap-1.5">
              <ChevronUp className="h-3 w-3 text-accent" />
              <span className="font-mono text-xs font-black text-accent">#{myPos}</span>
            </div>
          </div>
        )}

        {!loading && myPos === null && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-[10px] text-text-muted text-center">Earn CP to appear on the board.</p>
          </div>
        )}
      </div>
    </ScrollReveal>
  );
};

export default MiniLeaderboard;
