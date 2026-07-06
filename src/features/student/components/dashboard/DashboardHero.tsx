import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Flame } from 'lucide-react';
import ScrollReveal from '@/shared/components/ScrollReveal';
import CpLogo from '@/shared/components/CpLogo';
import { StreakIcon } from '@/shared/components';

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
  loading?: boolean;
}

const DashboardHero = ({
  isEnrolled, allDone, nextMission, totalRoomsDone, cpBalance,
  streakDays, continuePath, nextRank, rankProgress, currentPhaseTitle,
  loading,
}: DashboardHeroProps) => {
  const renderHeroContent = () => {
    if (allDone) {
      return (
        <>
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
            <Link to={continuePath} className="bg-accent text-bg px-7 py-3 rounded-xl text-xs font-black uppercase tracking-[0.15em] shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98]">
              Review Curriculum<ArrowRight className="inline-block ml-2 h-4 w-4" />
            </Link>
          </div>
        </>
      );
    }

    if (isEnrolled) {
      return (
        <>
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
          <div className="flex flex-wrap items-center gap-4">
            <Link to={continuePath} className="bg-accent text-bg px-8 py-4 rounded-xl text-sm font-black uppercase tracking-[0.15em] shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98]">
              {nextMission ? 'Continue Mission' : 'Review Curriculum'}<ArrowRight className="inline-block ml-2 h-5 w-5" />
            </Link>
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
        <div className="flex flex-wrap items-center gap-4">
          <Link to={continuePath} className="bg-accent text-bg px-8 py-4 rounded-xl text-sm font-black uppercase tracking-[0.15em] shadow-lg shadow-accent/20 transition-all hover:brightness-110 active:scale-[0.98]">
            START THE BOOTCAMP<ArrowRight className="inline-block ml-2 h-5 w-5" />
          </Link>
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
        <div className="p-6 sm:p-8 md:p-10 lg:p-12 relative overflow-hidden h-full flex flex-col justify-center border border-border/40 bg-bg-card rounded-2xl shadow-none">
          <div className="relative z-10">
            {renderHeroContent()}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default DashboardHero;
