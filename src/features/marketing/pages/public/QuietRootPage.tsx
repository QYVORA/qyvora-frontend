import { Boxes, Layers, ShieldCheck } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import QuietRootTeamSection from '@/features/marketing/components/quietroot/QuietRootTeamSection';
import {
  QUIETROOT_OPEN_ROLES,
  QUIETROOT_ROLE_COUNT,
  QUIETROOT_TEAM_COUNT,
  QUIETROOT_TEAMS,
} from '@/features/marketing/content/quietRootData';

/**
 * QuietRoot — QYVORA's technical team.
 *
 * Roles, capability bars, holder names and branch names come from the QuietRoot
 * documentation in knowledge/qyvora-docs/03-people/quiteroot/. Vacant roles are
 * rendered as OPEN with a silhouette placeholder and an application CTA — never
 * as a stand-in person.
 */
const QuietRootPage = () => {
  const openRoleCount = QUIETROOT_OPEN_ROLES.length;
  const filledRoleCount = QUIETROOT_ROLE_COUNT - openRoleCount;

  return (
    <div className="min-h-dvh bg-canvas">
      <SEO
        title="QuietRoot - QYVORA"
        description="QuietRoot is QYVORA's technical team: a Tech Team and a Security Team. Every role is published, filled or open, and open roles are advertised on the Contact page."
        breadcrumbName="QuietRoot"
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker="QYVORA · Technical Team"
          title="QuietRoot"
          description="QYVORA's technical team, split into two branches: the Tech Team that builds QYVORA's products and interfaces, and the Security Team that runs its offensive-security tooling, research and authorized security work."
          metadata={
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="type-meta inline-flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                <span className="font-bold text-text-primary">{QUIETROOT_TEAM_COUNT}</span>
                Teams
              </span>
              <span className="type-meta inline-flex items-center gap-2">
                <Boxes className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                <span className="font-bold text-text-primary">{QUIETROOT_ROLE_COUNT}</span>
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
              Apply to QuietRoot <IconArrowRight size={14} />
            </Button>
          }
        />

        <section aria-labelledby="quietroot-structure-title" className="mt-10 md:mt-14">
          <div className="rounded-2xl border border-border-subtle bg-surface px-5 py-10 md:px-10 md:py-14">
            <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 text-center">
              <p className="type-kicker uppercase tracking-[0.3em] text-accent">
                How QuietRoot works
              </p>
              <h2
                id="quietroot-structure-title"
                className="type-h2 font-black uppercase tracking-tight text-text-primary md:text-3xl"
              >
                Every role is published.
              </h2>
              <p className="max-w-xl text-sm font-mono leading-[2] text-text-secondary md:text-base">
                A person is placed in a QuietRoot role because QYVORA has demonstrated what
                they can do — never because the seat needs filling. Roles with no appointed
                team member yet are published as open, with the evidence that qualifies, so
                you can see exactly what is being looked for before you apply.
              </p>
              <div className="h-px w-full bg-border-subtle" aria-hidden="true" />
              <div className="flex flex-col items-center gap-3">
                <Button to="/contact">
                  Apply to QuietRoot <IconArrowRight size={14} />
                </Button>
                <p className="max-w-xl text-xs font-mono leading-relaxed text-text-muted">
                  Applications are reviewed before anyone joins. When you contact us, include
                  evidence of your work: GitHub, portfolio, projects, security research, tools
                  you've built, designs, or relevant experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {QUIETROOT_TEAMS.map((team) => (
          <QuietRootTeamSection key={team.id} team={team} />
        ))}
      </PublicContainer>
    </div>
  );
};

export default QuietRootPage;