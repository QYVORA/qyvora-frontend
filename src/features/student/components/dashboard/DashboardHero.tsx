import { Link } from 'react-router-dom';
import { IconArrowRight } from '@/shared/components/icons';

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

  const cardClass = "rounded-2xl border border-bg/20 bg-accent p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6";

  if (allDone) {
    return (
      <div data-nav-invert>
        <div className={cardClass}>
          <div className="w-full sm:w-auto">
            <div className="text-xs font-black uppercase tracking-[0.3em] text-bg/60 mb-1">Welcome back, <span className="text-bg font-black">{displayName}</span></div>
            <h2 className="text-xl sm:text-2xl font-black text-bg tracking-tight">All missions complete</h2>
            <p className="text-sm text-bg/70 mt-1">You have completed every available room.</p>
          </div>
          <Link to={continuePath} className="btn-primary shrink-0 !text-xs w-full sm:w-auto text-center" aria-label="Review completed curriculum">
            Review Curriculum <IconArrowRight size={14} className="inline" />
          </Link>
        </div>
      </div>
    );
  }

  if (isEnrolled) {
    return (
      <div data-nav-invert>
        <div className={cardClass}>
          <div className="w-full sm:w-auto">
            <div className="text-xs font-black uppercase tracking-[0.3em] text-bg/60 mb-1">Welcome back, <span className="text-bg font-black">{displayName}</span></div>
            <h2 className="text-xl sm:text-2xl font-black text-bg tracking-tight break-words">{nextMission?.title || currentPhaseTitle || 'Continue your training'}</h2>
            <p className="text-sm text-bg/70 mt-1">Pick up where you left off.</p>
          </div>
          <Link to={continuePath} className="btn-primary shrink-0 !text-xs w-full sm:w-auto text-center" aria-label="Continue training">
            Continue <IconArrowRight size={14} className="inline" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div data-nav-invert>
      <div className={cardClass}>
        <div className="w-full sm:w-auto">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-bg/60 mb-1">Welcome, <span className="text-bg font-black">{displayName}</span></div>
          <h2 className="text-xl sm:text-2xl font-black text-bg tracking-tight">Begin your journey</h2>
          <p className="text-sm text-bg/70 mt-1">Start the Hacker Protocol Bootcamp and earn your first CP.</p>
        </div>
        <Link to={continuePath} className="btn-primary shrink-0 !text-xs w-full sm:w-auto text-center" aria-label="Start Hacker Protocol Bootcamp training">
          Start Training <IconArrowRight size={14} className="inline" />
        </Link>
      </div>
    </div>
  );
};

export default DashboardHero;
