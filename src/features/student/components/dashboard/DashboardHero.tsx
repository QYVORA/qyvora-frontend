import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Flame, Shield, Terminal } from 'lucide-react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import CpLogo from '@/shared/components/CpLogo';
import Identicon from '@/shared/components/Identicon';
import { StreakIcon } from '@/shared/components';
import WeekActivity from './WeekActivity';

interface DashboardHeroProps {
  isEnrolled: boolean;
  allDone: boolean;
  nextMission: { title: string } | null;
  totalRoomsDone: number;
  cpBalance: number;
  streakDays: number | null;
  continuePath: string;
  nextRank: { name: string } | null;
  rankProgress: number;
  currentPhaseTitle?: string;
  rankName: string;
  visitDates?: string[];
  loading?: boolean;
  onOpenTerminal?: () => void;
  uid?: string;
  username?: string;
}

const StatPill = ({ icon, label, value, children }: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  children?: React.ReactNode;
}) => (
  <div className="flex items-center gap-3 p-3 rounded-2xl border border-border/30 bg-accent-dim snap-start shrink-0 min-w-[200px] sm:min-w-0">
    <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center flex-none">
      {icon}
    </div>
    <div className="min-w-0">
      <div className="text-[9px] font-black uppercase tracking-widest text-text-muted">{label}</div>
      <div className="font-mono text-sm font-black text-text-primary">{value}</div>
    </div>
    {children && <div className="flex-none ml-auto">{children}</div>}
  </div>
);

const DashboardHero = ({
  isEnrolled, allDone, nextMission, totalRoomsDone, cpBalance,
  streakDays, continuePath, nextRank, rankProgress, currentPhaseTitle,
  rankName, visitDates, loading, onOpenTerminal, uid, username,
}: DashboardHeroProps) => {
  const renderHeroContent = () => {
    if (allDone) {
      return (
        <>
          <div className="text-xs font-black uppercase tracking-[0.3em] text-text-muted mb-2">Welcome back, <span className="text-accent">@{username || 'Operator'}</span></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1.5px] w-8 bg-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-accent">Mission Complete</span>
          </div>
          <h2 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] text-text-primary max-w-3xl tracking-tight">Congratulations, Operator</h2>
          <p className="text-sm text-text-muted mb-6 max-w-lg">You have completed all available missions. Your training is paying off.</p>
          <div className="flex flex-wrap gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              <span className="font-mono text-sm font-bold text-text-primary">{totalRoomsDone} rooms completed</span>
            </div>
            <div className="flex items-center gap-2">
              <CpLogo className="w-4 h-4" />
              <span className="font-mono text-sm font-bold text-text-primary">{cpBalance.toLocaleString()} total CP</span>
            </div>
            {streakDays != null && streakDays > 0 && (
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="font-mono text-sm font-bold text-text-primary">{streakDays}-day streak</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link to={continuePath} className="btn-primary flex items-center gap-2 !text-xs !px-7 !py-3">
              Review Curriculum<ArrowRight className="h-4 w-4" />
            </Link>
            {onOpenTerminal && (
              <button
                onClick={onOpenTerminal}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-black/40
                  hover:border-green-500/30 hover:bg-black/60 transition-all duration-200
                  text-[10px] font-mono text-white/50 hover:text-green-400 uppercase tracking-wider"
              >
                <Terminal className="w-4 h-4" />
                _terminal
              </button>
            )}
          </div>
        </>
      );
    }

    if (isEnrolled) {
      return (
        <>
          <div className="text-xs font-black uppercase tracking-[0.3em] text-text-muted mb-2">Welcome back, <span className="text-accent">@{username || 'Operator'}</span></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1.5px] w-8 bg-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-accent">{currentPhaseTitle || 'Active Deployment'}</span>
          </div>
          <h2 className="mb-6 text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] text-text-primary max-w-3xl tracking-tight">
            {nextMission ? nextMission.title : 'Pick up where you left off'}
          </h2>
          {nextRank && (
            <div className="mb-6 max-w-md">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted">Target Rank: <span className="text-accent">{nextRank.name}</span></span>
                <span className="font-mono text-xs font-black text-accent">{rankProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-accent-dim/20 shadow-inner">
                <div className="h-full rounded-full bg-accent transition-all duration-1000 shadow-[0_0_10px_var(--color-accent)]" style={{ width: `${rankProgress}%` }} />
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Link to={continuePath} className="btn-primary flex items-center gap-2 !text-sm !px-8 !py-4">
              {nextMission ? 'Continue Mission' : 'Review Curriculum'}<ArrowRight className="h-5 w-5" />
            </Link>
            {onOpenTerminal && (
              <button
                onClick={onOpenTerminal}
                className="flex items-center gap-2 px-5 py-4 rounded-xl border border-white/10 bg-black/40
                  hover:border-green-500/30 hover:bg-black/60 transition-all duration-200
                  text-[10px] font-mono text-white/50 hover:text-green-400 uppercase tracking-wider"
              >
                <Terminal className="w-4 h-4" />
                _terminal
              </button>
            )}
            {!loading && (
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-bg-elevated/40 backdrop-blur-md shadow-sm">
                <CpLogo className="h-5 w-5" />
                <span className="font-mono text-xl font-black text-text-primary tracking-tighter">{cpBalance.toLocaleString()}</span>
                {streakDays != null && streakDays > 0 && (
                  <span className="w-px h-5 bg-border/40 mx-1" />
                )}
                {streakDays != null && streakDays > 0 && <StreakIcon days={streakDays} />}
              </div>
            )}
          </div>
        </>
      );
    }

    return (
      <>
        <div className="text-xs font-black uppercase tracking-[0.3em] text-text-muted mb-2">Welcome, <span className="text-accent">@{username || 'Operator'}</span></div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-[1.5px] w-8 bg-accent" />
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-accent">New Mission</span>
        </div>
        <h2 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] text-text-primary max-w-3xl tracking-tight">Begin your journey into the offensive underground</h2>
        <p className="text-sm text-text-muted mb-6 max-w-lg">Join 250+ operators already training on QYVORA. Master offensive security through hands-on bootcamp rooms, earn CP, and climb the ranks.</p>
        {nextRank && (
          <div className="mb-6 max-w-md">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted">Rank Preview: <span className="text-accent">{nextRank.name}</span></span>
              <span className="font-mono text-xs font-black text-accent">{rankProgress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-accent-dim/20 shadow-inner">
              <div className="h-full rounded-full bg-accent transition-all duration-1000 shadow-[0_0_10px_var(--color-accent)]" style={{ width: `${rankProgress}%` }} />
            </div>
          </div>
        )}
          <div className="flex flex-wrap items-center gap-4 mb-6">
          <Link to={continuePath} className="btn-primary flex items-center gap-2 !text-sm !px-8 !py-4">
            START THE BOOTCAMP<ArrowRight className="h-5 w-5" />
          </Link>
          {onOpenTerminal && (
            <button
              onClick={onOpenTerminal}
              className="flex items-center gap-2 px-5 py-4 rounded-xl border border-white/10 bg-black/40
                hover:border-green-500/30 hover:bg-black/60 transition-all duration-200
                text-[10px] font-mono text-white/50 hover:text-green-400 uppercase tracking-wider"
            >
              <Terminal className="w-4 h-4" />
              _terminal
            </button>
          )}
          {!loading && (
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-bg-elevated/40 backdrop-blur-md shadow-sm">
              <CpLogo className="h-5 w-5" />
              <span className="font-mono text-xl font-black text-text-primary tracking-tighter">{cpBalance.toLocaleString()}</span>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="w-full px-4 md:px-0">
      <ScrollReveal className="h-full">
        <div className="p-6 sm:p-8 md:p-10 lg:p-12 relative overflow-hidden border border-border/30 bg-bg-card rounded-2xl shadow-none">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-12">
            {/* Profile — left column */}
            <div className="flex lg:flex-col items-center lg:items-center gap-6 shrink-0 lg:justify-center">
              <div className="w-28 h-28 lg:w-48 lg:h-48 rounded-3xl border-2 border-border/15 overflow-hidden flex-none">
                <Identicon value={uid || username || '?'} size={192} className="w-full h-full" />
              </div>
              <div className="text-center space-y-1">
                <div className="font-black text-xl lg:text-4xl text-text-primary leading-tight">{username ? `@${username}` : 'Operator'}</div>
                <div className="text-xs font-black uppercase tracking-widest text-text-muted">{rankName}</div>
                <div className="flex items-center justify-center gap-5 pt-2">
                  <div className="text-center">
                    <div className="font-mono text-sm font-black text-accent">{cpBalance.toLocaleString()}</div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-text-muted">CP</div>
                  </div>
                  {streakDays != null && (
                    <div className="text-center">
                      <div className="font-mono text-sm font-black text-orange-400">{streakDays}d</div>
                      <div className="text-[8px] font-black uppercase tracking-widest text-text-muted">Streak</div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="font-mono text-sm font-black text-text-primary">{totalRoomsDone}</div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-text-muted">Rooms</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content — right column */}
            <div className="flex-1 min-w-0">
              {renderHeroContent()}

              {/* Quick stat pills — always visible */}
              <div className="mt-6 sm:mt-8 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 sm:grid sm:grid-cols-3 md:grid-cols-5 sm:gap-3 sm:overflow-visible sm:snap-none sm:pb-0 sm:-mx-0 sm:px-0">
              <StatPill
                icon={<CpLogo className="w-4 h-4" />}
                label="CP"
                value={cpBalance.toLocaleString()}
              />
              <StatPill
                icon={<Shield className="w-4 h-4 text-accent" />}
                label={rankName || 'Candidate'}
                value={
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 rounded-full bg-accent-dim/20 overflow-hidden">
                      <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${rankProgress}%` }} />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-accent">{nextRank ? `→${nextRank.name}` : 'MAX'}</span>
                  </div>
                }
              />
              <StatPill
                icon={<Flame className="w-4 h-4 text-orange-400" />}
                label="Streak"
                value={`${streakDays ?? 0}d`}
              />
              <StatPill
                icon={<Layers className="w-4 h-4 text-accent" />}
                label="Rooms"
                value={totalRoomsDone}
              />
              <StatPill
                icon={<div className="w-4 h-4" />}
                label="Week"
                value={`${visitDates?.length ?? 0}d`}
              >
                <WeekActivity visitDates={visitDates} />
              </StatPill>
            </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default DashboardHero;
