import { ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '@/shared/components/ui/Button';

interface DashboardHeroProps {
  title: string;
  body: string;
  ctaLabel: string;
  continuePath: string;
  username?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}

/**
 * DashboardHero — the left-column promotional banner.
 *
 * One current objective, one primary action. The banner is the only visually
 * dominant surface on the overview, so it carries a restrained accent wash and
 * a single original QYVORA glyph — no mascot, no stock artwork, no gradients.
 */
const DashboardHero = ({
  title,
  body,
  ctaLabel,
  continuePath,
  username,
  secondaryLabel,
  secondaryTo,
}: DashboardHeroProps) => (
  <section className="relative overflow-hidden rounded-2xl border border-accent/25 bg-accent/[0.06] p-6 sm:p-7">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border border-accent/15"
    />
    <div className="relative flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="type-label mb-2 uppercase tracking-[0.16em] text-accent">
          {username ? `Welcome back, @${username}` : 'QYVORA · Continue'}
        </p>
        <h2 className="type-h2 font-black uppercase tracking-tight text-text-primary">{title}</h2>
        <p className="mt-2 type-body-sm text-text-secondary">{body}</p>
      </div>
      <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent/25 bg-accent/10 text-accent sm:flex">
        <ShieldCheck className="h-7 w-7" aria-hidden="true" />
      </span>
    </div>

    <div className="relative mt-5 flex flex-wrap items-center gap-3">
      <Button to={continuePath} trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
        {ctaLabel}
      </Button>
      {secondaryLabel && secondaryTo && (
        <Button to={secondaryTo} variant="ghost" size="sm">
          {secondaryLabel}
        </Button>
      )}
    </div>
  </section>
);

export default DashboardHero;
