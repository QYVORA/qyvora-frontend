import { ArrowRight } from 'lucide-react';
import Button from '@/shared/components/ui/Button';

interface DashboardHeroProps {
  isEnrolled: boolean;
  allDone: boolean;
  nextMission: { title: string } | null;
  continuePath: string;
  currentPhaseTitle?: string;
  username?: string;
}

/**
 * DashboardHero — the Continue banner: one current objective, one action.
 * No grid backdrop, no mascot, no decorative layers — a calm surface.
 */
const DashboardHero = ({
  isEnrolled, allDone, nextMission, continuePath, currentPhaseTitle, username,
}: DashboardHeroProps) => {
  const displayName = username ? `@${username}` : "Operator";

  let kicker = "Welcome," + ' ' + displayName;
  let title = "Begin your journey";
  let body = "Start the Hacker Protocol Bootcamp and earn your first CP.";
  let ctaLabel = "Start Training";

  if (isEnrolled) {
    kicker = `${"Welcome back,"} ${displayName}`;
    title = nextMission?.title || currentPhaseTitle || "Continue your training";
    body = "Pick up where you left off.";
    ctaLabel = "Continue";
  }

  if (allDone) {
    kicker = `${"Welcome back,"} ${displayName}`;
    title = "All missions complete";
    body = "You have completed every available room.";
    ctaLabel = "Review Curriculum";
  }

  return (
    <section className="flex min-h-[220px] flex-col justify-between gap-6 rounded-xl border border-border-subtle bg-surface p-6 sm:p-8">
      <div>
        <p className="type-label mb-2 uppercase tracking-[0.12em] text-accent">{kicker}</p>
        <h2 className="type-h2 font-black uppercase tracking-tight text-text-primary">{title}</h2>
        <p className="type-body-sm mt-2">{body}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button to={continuePath} trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
          {ctaLabel}
        </Button>
      </div>
    </section>
  );
};

export default DashboardHero;