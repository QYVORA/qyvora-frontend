import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface DashboardHeroProps {
  isEnrolled: boolean;
  allDone: boolean;
  nextMission: { title: string } | null;
  continuePath: string;
  currentPhaseTitle?: string;
  username?: string;
}

const DashboardHero = ({
  isEnrolled, allDone, nextMission, continuePath, currentPhaseTitle, username,
}: DashboardHeroProps) => {
  const displayName = username ? `@${username}` : 'Operator';

  const cardClass = "rounded-2xl border border-border/30 bg-bg-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6";

  if (allDone) {
    return (
      <div className={cardClass}>
        <div className="w-full sm:w-auto">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-text-muted mb-1">Welcome back, <span className="text-accent">{displayName}</span></div>
          <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">All missions complete</h2>
          <p className="text-sm text-text-muted mt-1">You have completed every available room.</p>
        </div>
        <Link to={continuePath} className="btn-primary shrink-0 !text-xs w-full sm:w-auto text-center" aria-label="Review completed curriculum">
          Review Curriculum <ArrowRight className="inline h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  if (isEnrolled) {
    return (
      <div className={cardClass}>
        <div className="w-full sm:w-auto">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-text-muted mb-1">Welcome back, <span className="text-accent">{displayName}</span></div>
          <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight break-words">{nextMission?.title || currentPhaseTitle || 'Continue your training'}</h2>
          <p className="text-sm text-text-muted mt-1">Pick up where you left off.</p>
        </div>
        <Link to={continuePath} className="btn-primary shrink-0 !text-xs w-full sm:w-auto text-center" aria-label="Continue training">
          Continue <ArrowRight className="inline h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <div className="w-full sm:w-auto">
        <div className="text-xs font-black uppercase tracking-[0.3em] text-text-muted mb-1">Welcome, <span className="text-accent">{displayName}</span></div>
        <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">Begin your journey</h2>
        <p className="text-sm text-text-muted mt-1">Start the Hacker Protocol Bootcamp and earn your first CP.</p>
      </div>
      <Link to={continuePath} className="btn-primary shrink-0 !text-xs w-full sm:w-auto text-center" aria-label="Start Hacker Protocol Bootcamp training">
        Start Training <ArrowRight className="inline h-3.5 w-3.5" />
      </Link>
    </div>
  );
};

export default DashboardHero;
