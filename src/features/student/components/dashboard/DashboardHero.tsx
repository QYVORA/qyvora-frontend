import { ArrowRight } from 'lucide-react';
import Button from '@/shared/components/ui/Button';

/**
 * DashboardHero — the Continue banner: one current objective, one action.
 * This is the only visually dominant card on the dashboard, so it carries the
 * page's single primary call to action. No grid backdrop, no mascot, no
 * decorative layers — a calm surface with a real border.
 */
const DashboardHero = ({
  title, body, ctaLabel, continuePath, username,
}: {
  title: string;
  body: string;
  ctaLabel: string;
  continuePath: string;
  username?: string;
}) => (
  <section className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-border-subtle bg-surface p-6 sm:p-8">
    <div className="min-w-0">
      <p className="type-label mb-2 uppercase tracking-[0.12em] text-accent">
        {username ? `Welcome back, @${username}` : 'Welcome back'}
      </p>
      <h2 className="type-h2 font-black uppercase tracking-tight text-text-primary">{title}</h2>
      <p className="mt-2 type-body-sm max-w-prose">{body}</p>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <Button to={continuePath} trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
        {ctaLabel}
      </Button>
    </div>
  </section>
);

export default DashboardHero;
