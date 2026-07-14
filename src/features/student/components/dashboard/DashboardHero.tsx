import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowRight } from '@/shared/components/icons';
import { gsap } from '@/shared/utils/gsapSetup';

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
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const textEl = card.querySelector('.hero-text');
    const titleEl = card.querySelector('.hero-title');
    const subEl = card.querySelector('.hero-sub');
    const ctaEl = card.querySelector('.hero-cta');
    if (!textEl || !titleEl || !subEl || !ctaEl) return;

    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(textEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
      .fromTo(titleEl, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
      .fromTo(subEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.3')
      .fromTo(ctaEl, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.4)' }, '-=0.2');

    return () => { tl.kill(); };
  }, []);

  const cardClass = "rounded-2xl border border-bg/20 bg-accent p-8 sm:p-10 lg:p-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6";

  if (allDone) {
    return (
      <div data-nav-invert>
        <div ref={cardRef} className={cardClass}>
          <div className="w-full sm:w-auto">
            <div className="hero-text text-xs font-black uppercase tracking-[0.3em] text-bg/60 mb-2">Welcome back, <span className="text-bg font-black">{displayName}</span></div>
            <h2 className="hero-title text-xl sm:text-2xl lg:text-3xl font-black text-bg tracking-tight">All missions complete</h2>
            <p className="hero-sub text-sm text-bg/70 mt-1.5">You have completed every available room.</p>
          </div>
          <Link to={continuePath} className="hero-cta btn-primary shrink-0 !text-xs w-full sm:w-auto text-center" aria-label="Review completed curriculum">
            Review Curriculum <IconArrowRight size={14} className="inline" />
          </Link>
        </div>
      </div>
    );
  }

  if (isEnrolled) {
    return (
      <div data-nav-invert>
        <div ref={cardRef} className={cardClass}>
          <div className="w-full sm:w-auto">
            <div className="hero-text text-xs font-black uppercase tracking-[0.3em] text-bg/60 mb-2">Welcome back, <span className="text-bg font-black">{displayName}</span></div>
            <h2 className="hero-title text-xl sm:text-2xl lg:text-3xl font-black text-bg tracking-tight break-words">{nextMission?.title || currentPhaseTitle || 'Continue your training'}</h2>
            <p className="hero-sub text-sm text-bg/70 mt-1.5">Pick up where you left off.</p>
          </div>
          <Link to={continuePath} className="hero-cta btn-primary shrink-0 !text-xs w-full sm:w-auto text-center" aria-label="Continue training">
            Continue <IconArrowRight size={14} className="inline" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div data-nav-invert>
      <div ref={cardRef} className={cardClass}>
        <div className="w-full sm:w-auto">
          <div className="hero-text text-xs font-black uppercase tracking-[0.3em] text-bg/60 mb-2">Welcome, <span className="text-bg font-black">{displayName}</span></div>
            <h2 className="hero-title text-xl sm:text-2xl lg:text-3xl font-black text-bg tracking-tight">Begin your journey</h2>
            <p className="hero-sub text-sm text-bg/70 mt-1.5">Start the Hacker Protocol Bootcamp and earn your first CP.</p>
        </div>
        <Link to={continuePath} className="hero-cta btn-primary shrink-0 !text-xs w-full sm:w-auto text-center" aria-label="Start Hacker Protocol Bootcamp training">
          Start Training <IconArrowRight size={14} className="inline" />
        </Link>
      </div>
    </div>
  );
};

export default DashboardHero;
