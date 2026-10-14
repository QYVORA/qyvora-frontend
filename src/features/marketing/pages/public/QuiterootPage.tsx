import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Boxes, Code2, Layers, ShieldCheck } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import QuiterootTeamSection from '@/features/marketing/components/quiteroot/QuiterootTeamSection';
import {
  QUITEROOT_OPEN_ROLES,
  QUITEROOT_ROLE_COUNT,
  QUITEROOT_TEAM_COUNT,
  QUITEROOT_TEAMS,
} from '@/features/marketing/content/quiterootData';

type BranchId = (typeof QUITEROOT_TEAMS)[number]['id'];

const BRANCH_ICONS: Record<BranchId, React.ElementType> = {
  tech: Code2,
  security: ShieldCheck,
};

const BRANCH_IDS = QUITEROOT_TEAMS.map((team) => team.id);

/**
 * Quiteroot — QYVORA's technical team.
 *
 * One tab per documented branch, mirroring the /learn discovery pattern: pick a
 * branch, then read that branch's header card and every role it holds — filled
 * seats naming their holder, vacant seats published as open with the capability
 * evidence that qualifies and a route to apply.
 *
 * Roles, capability bars, holder names and branch names come from the Quiteroot
 * documentation in knowledge/qyvora-docs/03-people/quiteroot/.
 */
const QuiterootPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialBranch = searchParams.get('team');
  const [active, setActive] = React.useState<BranchId>(() =>
    BRANCH_IDS.includes(initialBranch as BranchId) ? (initialBranch as BranchId) : BRANCH_IDS[0],
  );

  const openRoleCount = QUITEROOT_OPEN_ROLES.length;
  const filledRoleCount = QUITEROOT_ROLE_COUNT - openRoleCount;
  const activeTeam = QUITEROOT_TEAMS.find((team) => team.id === active) ?? QUITEROOT_TEAMS[0];

  return (
    <div className="min-h-dvh bg-canvas">
      <SEO
        title="Quiteroot - QYVORA"
        description="Quiteroot is QYVORA's technical team: a Tech Team and a Security Team. Every role is published, filled or open, and open roles are advertised on the Contact page."
        breadcrumbName="Quiteroot"
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker="QYVORA · Technical Team"
          title="Quiteroot"
          description="QYVORA's technical team, split into two branches: the Tech Team that builds QYVORA's products and interfaces, and the Security Team that runs its offensive-security tooling, research and authorized security work."
          metadata={
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="type-meta inline-flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                <span className="font-bold text-text-primary">{QUITEROOT_TEAM_COUNT}</span>
                Teams
              </span>
              <span className="type-meta inline-flex items-center gap-2">
                <Boxes className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                <span className="font-bold text-text-primary">{QUITEROOT_ROLE_COUNT}</span>
                Roles
              </span>
              <span className="type-meta inline-flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                <span className="font-bold text-text-primary">{filledRoleCount}</span>
                In place
                <span className="text-text-muted">·</span>
                <span className="font-bold text-accent">{openRoleCount}</span>
                Open
              </span>
            </div>
          }
          actions={
            <Button to="/contact">
              Apply to Quiteroot <IconArrowRight size={14} />
            </Button>
          }
        />

        <div
          role="tablist"
          aria-label="Quiteroot branches"
          className="mb-8 mt-10 flex flex-wrap gap-2 border-b border-border-subtle pb-4"
        >
          {QUITEROOT_TEAMS.map((team) => {
            const selected = active === team.id;
            const Icon = BRANCH_ICONS[team.id];
            return (
              <button
                key={team.id}
                type="button"
                role="tab"
                id={`quiteroot-tab-${team.id}`}
                aria-selected={selected}
                aria-controls={`quiteroot-panel-${team.id}`}
                onClick={() => setActive(team.id)}
                className={[
                  'flex min-h-[44px] items-center gap-2 rounded-lg px-4 text-sm font-bold transition-colors',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                  selected
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-tertiary hover:bg-surface-raised hover:text-text-primary',
                ].join(' ')}
              >
                {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                {team.name.replace('Quiteroot ', '')}
              </button>
            );
          })}
        </div>

        <div
          key={active}
          role="tabpanel"
          id={`quiteroot-panel-${active}`}
          aria-labelledby={`quiteroot-tab-${active}`}
        >
          <QuiterootTeamSection team={activeTeam} />
        </div>
      </PublicContainer>
    </div>
  );
};

export default QuiterootPage;