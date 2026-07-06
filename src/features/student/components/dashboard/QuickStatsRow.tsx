import { Shield, Flame, Layers, Zap } from 'lucide-react';
import CpLogo from '@/shared/components/CpLogo';
import WeekActivity from './WeekActivity';

interface QuickStatsRowProps {
  cpBalance: number;
  rankName: string;
  nextRankName: string | null;
  rankProgress: number;
  streakDays: number;
  totalRoomsDone: number;
  visitDates?: string[];
  isMaxRank?: boolean;
}

const StatPill = ({ icon, label, value, children }: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  children?: React.ReactNode;
}) => (
  <div className="card-qyvora flex-none md:flex-1 flex items-center gap-3 p-4 rounded-xl border border-border/40 bg-bg-card/60 min-w-[130px]">
    <div className="w-10 h-10 rounded-xl bg-accent-dim border border-accent/20 flex items-center justify-center flex-none">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-[9px] font-black uppercase tracking-widest text-text-muted">{label}</div>
      <div className="font-mono text-lg font-black text-text-primary">{value}</div>
    </div>
    {children}
  </div>
);

const QuickStatsRow = ({
  cpBalance, rankName, nextRankName, rankProgress, streakDays, totalRoomsDone, visitDates, isMaxRank,
}: QuickStatsRowProps) => (
  <div className="flex gap-4 overflow-x-auto pb-2 px-4 md:px-0 md:grid md:grid-cols-5 md:gap-4 mb-8 scroll-hover">
    <StatPill
      icon={<CpLogo className="w-5 h-5" />}
      label="CP Balance"
      value={cpBalance.toLocaleString()}
    />
    <StatPill
      icon={<Shield className="w-5 h-5 text-accent" />}
      label={rankName || 'Candidate'}
      value={
        <div className="flex items-center gap-2 mt-0.5">
          <div className="flex-1 h-1.5 rounded-full bg-accent-dim/20 overflow-hidden">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${rankProgress}%` }} />
          </div>
          <span className="font-mono text-[10px] font-bold text-accent">{isMaxRank ? 'MAX' : nextRankName ? `→ ${nextRankName}` : ''}</span>
        </div>
      }
    />
    <StatPill
      icon={<Flame className="w-5 h-5 text-orange-400" />}
      label="Streak"
      value={`${streakDays} days`}
    />
    <StatPill
      icon={<Layers className="w-5 h-5 text-accent" />}
      label="Rooms Done"
      value={totalRoomsDone}
    />
    <StatPill
      icon={<Zap className="w-5 h-5 text-accent" />}
      label="This Week"
      value={`${visitDates?.length ?? 0} days`}
    >
      <WeekActivity visitDates={visitDates} />
    </StatPill>
  </div>
);

export default QuickStatsRow;
