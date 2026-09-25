import { Users } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';

const OPEN_ROLES: string[] = [
  'Frontend Development',
  'Backend Development',
  'Full-Stack Development',
  'Junior Penetration Testing',
  'Security Research',
  'Offensive Security & Tool Development',
  'UI/UX Design',
  'Graphic & Brand Design',
];

const QuiteRootPage = () => {
  return (
    <div className="min-h-dvh bg-canvas">
      <SEO
        title="QuiteRoot - QYVORA"
        description="QuiteRoot is QYVORA's technical team. Currently no active members — open to applications through the Contact page."
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker="QYVORA · Technical Team"
          title="Quite Root"
          description="QYVORA's technical team. The team is currently being rebuilt — a clean slate for people who bring demonstrated skill."
          metadata={
            <span className="type-meta inline-flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              <span className="font-bold text-text-primary">0</span>
              Active Members
            </span>
          }
          actions={
            <Button to="/contact">
              Apply to QuiteRoot <IconArrowRight size={14} />
            </Button>
          }
        />

        <section aria-labelledby="quiet-roots-empty-title" className="mt-10 md:mt-14">
          <div className="rounded-2xl border border-border-subtle bg-surface px-5 py-10 md:px-10 md:py-14">
            <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 text-center">
              <p className="text-kicker font-black uppercase tracking-[0.3em] text-accent">
                QYVORA Technical Team
              </p>
              <h2
                id="quiet-roots-empty-title"
                className="type-h2 font-black uppercase tracking-tight text-text-primary md:text-3xl"
              >
                No active members yet.
              </h2>
              <p className="max-w-xl text-sm font-mono leading-[2] text-text-secondary md:text-base">
                QuiteRoot is QYVORA's technical team. We are currently rebuilding it and are open to
                people with demonstrated skills in the areas below.
              </p>
              <ul className="flex flex-wrap items-center justify-center gap-2">
                {OPEN_ROLES.map((role) => (
                  <li
                    key={role}
                    className="rounded-lg border border-border-subtle bg-surface-raised px-3 py-1.5 text-xs font-black uppercase tracking-widest text-text-muted"
                  >
                    {role}
                  </li>
                ))}
              </ul>
              <div className="h-px w-full bg-border-subtle" aria-hidden="true" />
              <div className="flex flex-col items-center gap-3">
                <Button to="/contact">
                  Apply to QuiteRoot <IconArrowRight size={14} />
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
      </PublicContainer>
    </div>
  );
};

export default QuiteRootPage;