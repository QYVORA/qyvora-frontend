import { Binary, Cpu, Palette, ShieldCheck, Users } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import { researchersData, type Researcher } from '@/features/marketing/content/researchersData';

const RESEARCHER_ICONS: Record<string, React.ElementType> = {
  r1: Palette,
  r2: Cpu,
  r3: Binary,
  r4: ShieldCheck,
};

const RESEARCHER_MARKERS: Record<string, string> = {
  r1: '01',
  r2: '02',
  r3: '03',
  r4: '04',
};

const ResearcherCard = ({ researcher }: { researcher: Researcher }) => {
  const ResearcherIcon = RESEARCHER_ICONS[researcher.id] ?? ShieldCheck;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg-card">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        <img
          src={researcher.image}
          alt={researcher.name}
          width={researcher.width}
          height={researcher.height}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-border-subtle bg-bg-card/90 font-mono text-xs font-black tracking-widest text-accent">
          {RESEARCHER_MARKERS[researcher.id]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-lg border border-accent/30 bg-accent/10 px-2 py-0.5 text-tiny font-black uppercase tracking-widest text-accent">
            {researcher.role}
          </span>
          <ResearcherIcon className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        </div>

        <h3 className="mt-3 text-lg font-black uppercase tracking-tight leading-tight text-text-primary break-words">
          {researcher.name}
        </h3>

        <p className="mt-1.5 text-tiny font-black uppercase tracking-widest text-accent">
          Research node // {researcher.id.toUpperCase()}
        </p>

        <p className="mt-3 text-xs font-mono leading-relaxed text-text-secondary line-clamp-3">
          {researcher.bio}
        </p>
      </div>
    </article>
  );
};

const QuiteRootPage = () => {
  return (
    <div className="min-h-dvh bg-canvas">
      <SEO title="QuiteRoot - QYVORA" description="QuiteRoot, a network of security researchers pushing the boundaries of offensive security." />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker="QYVORA · Network"
          title="Quite Root"
          description="A network of independent security researchers pushing the boundaries of offensive security research and tooling."
          metadata={
            <span className="type-meta inline-flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              <span className="font-bold text-text-primary">{researchersData.length}</span>{' '}
              Researchers
            </span>
          }
          actions={
            <Button to="/register">
              Join the Network <IconArrowRight size={14} />
            </Button>
          }
        />

        <div className="mt-10 grid grid-cols-1 gap-4 md:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {researchersData.map((researcher) => (
            <ResearcherCard key={researcher.id} researcher={researcher} />
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-border/50 bg-bg-card p-5 md:mt-14 md:p-6">
          <p className="text-kicker font-black uppercase tracking-[0.3em] text-accent">
            Independent research collective
          </p>
          <p className="max-w-2xl text-sm font-mono leading-[2] text-text-secondary md:text-base">
            QuiteRoot brings together builders and security-minded researchers contributing to
            QYVORA's tools, experiments, and learning ecosystem.
          </p>
        </div>
      </PublicContainer>
    </div>
  );
};

export default QuiteRootPage;