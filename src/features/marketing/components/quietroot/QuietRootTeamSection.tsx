import React from 'react';
import { ShieldCheck } from 'lucide-react';
import QuietRootRoleCard from '@/features/marketing/components/quietroot/QuietRootRoleCard';
import type { QuietRootTeam } from '@/features/marketing/content/quietRootData';

/**
 * One QuietRoot branch: official team logo, documented focus, every documented
 * role, and the documented boundary note where the team has one.
 *
 * The logo is the supplied brand asset, rendered unmodified on a transparent
 * background — no filters, no shadows, no gradients, no recolouring.
 */
const QuietRootTeamSection = ({ team }: { team: QuietRootTeam }) => {
  const openCount = team.roles.filter((role) => role.holder === null).length;
  const headingId = `quietroot-team-${team.id}`;

  return (
    <section aria-labelledby={headingId} className="mt-14 md:mt-20">
      <div className="flex flex-col gap-6 rounded-2xl border border-border-subtle bg-surface p-5 md:p-8 lg:flex-row lg:items-start lg:gap-10">
        <div className="flex shrink-0 flex-col items-center gap-4 lg:w-64">
          <div className="flex h-40 w-40 items-center justify-center rounded-2xl border border-border-subtle bg-surface-raised p-4 md:h-48 md:w-48">
            <img
              src={team.logo}
              alt={`${team.name} logo`}
              width={team.logoWidth}
              height={team.logoHeight}
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </div>
          <p className="type-label uppercase tracking-[0.12em] text-accent">Official team logo</p>
        </div>

        <div className="min-w-0 flex-1">
          <span className="type-kicker block text-accent">QuietRoot branch</span>
          <h2
            id={headingId}
            className="type-h2 mt-2 font-black uppercase tracking-tight text-text-primary"
          >
            {team.name}
          </h2>
          <p className="type-body mt-3 text-text-secondary">{team.focus}</p>
          <p className="type-meta mt-3 inline-flex items-center gap-2 text-text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            {`${team.roles.length} roles · ${openCount} open`}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {team.roles.map((role) => (
          <QuietRootRoleCard key={role.id} role={role} applyLabel={`Apply — ${role.title}`} />
        ))}
      </div>

      {team.note && (
        <p className="mt-4 rounded-2xl border border-border-subtle bg-surface px-5 py-4 text-xs font-mono leading-relaxed text-text-muted">
          {team.note}
        </p>
      )}
    </section>
  );
};

export default QuietRootTeamSection;