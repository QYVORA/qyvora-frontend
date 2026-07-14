import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowRight } from '@/shared/components/icons';
import { gsap } from '@/shared/utils/gsapSetup';

interface LearningOverviewStat {
  label: string;
  value: string | number;
  accent?: boolean;
}

interface LearningOverviewCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  stats?: LearningOverviewStat[];
  action?: {
    label: string;
    to?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
  };
  progress?: number;
  breadcrumbs?: Array<{ label: string; to?: string }>;
}

const LearningOverviewCard: React.FC<LearningOverviewCardProps> = ({
  icon,
  title,
  description,
  stats,
  action,
  progress,
  breadcrumbs,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const textEl = card.querySelector('.ov-text');
    const titleEl = card.querySelector('.ov-title');
    const descEl = card.querySelector('.ov-desc');
    const statsEl = card.querySelector('.ov-stats');
    const ctaEl = card.querySelector('.ov-cta');

    const tl = gsap.timeline({ delay: 0.15 });
    if (textEl) tl.fromTo(textEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    if (titleEl) tl.fromTo(titleEl, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2');
    if (descEl) tl.fromTo(descEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.25');
    if (statsEl) tl.fromTo(statsEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.2');
    if (ctaEl) tl.fromTo(ctaEl, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.3)' }, '-=0.15');

    return () => { tl.kill(); };
  }, []);

  return (
    <div data-nav-invert>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-bg/50">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="opacity-40">/</span>}
              {crumb.to ? (
                <Link to={crumb.to} className="font-black uppercase tracking-widest transition-colors hover:text-bg/80">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-black uppercase tracking-wide text-bg/80">{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
      )}

      <div
        ref={cardRef}
        className="rounded-2xl border border-bg/20 bg-accent p-8 sm:p-10 lg:p-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="w-full sm:w-auto min-w-0">
          <div className="ov-text flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-bg/15 flex items-center justify-center shrink-0">
              {icon}
            </div>
          </div>
          <h2 className="ov-title text-xl sm:text-2xl lg:text-3xl font-black text-bg tracking-tight break-words">
            {title}
          </h2>
          <p className="ov-desc text-sm text-bg/70 mt-1.5 max-w-xl">
            {description}
          </p>

          {stats && stats.length > 0 && (
            <div className="ov-stats flex flex-wrap items-center gap-4 mt-5">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={`font-mono text-lg sm:text-xl font-black ${stat.accent ? 'text-bg' : 'text-bg/90'}`}>
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-bg/50">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {action && (
          <div className="ov-cta shrink-0 w-full sm:w-auto">
            {action.to ? (
              <Link
                to={action.to}
                className="btn-primary !bg-bg !text-accent inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs w-full sm:w-auto text-center"
              >
                {action.icon}
                {action.label}
                <IconArrowRight size={14} className="inline" />
              </Link>
            ) : (
              <button
                onClick={action.onClick}
                className="btn-primary !bg-bg !text-accent inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs w-full sm:w-auto"
              >
                {action.icon}
                {action.label}
                <IconArrowRight size={14} className="inline" />
              </button>
            )}
          </div>
        )}
      </div>

      {typeof progress === 'number' && (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-accent-dim">
          <div
            className="h-full rounded-full bg-accent transition-all duration-700"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default LearningOverviewCard;
