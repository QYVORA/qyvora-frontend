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

const ResearcherRow = ({ researcher }: { researcher: Researcher }) => {
  const ResearcherIcon = RESEARCHER_ICONS[researcher.id] ?? ShieldCheck;

  return (
    <li className="flex flex-col gap-3 p-5 md:flex-row md:items-start md:gap-4">
      <img
        src={researcher.image}
        alt={researcher.name}
        width={researcher.width}
        height={researcher.height}
        loading="lazy"
        className="h-16 w-16 shrink-0 rounded-lg border border-border-subtle object-cover object-[center_20%]"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="font-mono text-xs font-black tracking-widest text-accent">
            {RESEARCHER_MARKERS[researcher.id]}
          </span>
          <h3 className="text-sm font-black uppercase tracking-tight leading-tight text-text-primary">
            {researcher.name}
          </h3>
          <span className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-tiny font-black uppercase tracking-widest text-accent">
            {researcher.role}
          </span>
        </div>

        <p className="mt-1.5 text-tiny font-black uppercase tracking-widest text-text-muted">
          Research node // {researcher.id.toUpperCase()}
        </p>

        <p className="mt-2 text-xs font-mono leading-relaxed text-text-secondary">
          {researcher.bio}
        </p>
      </div>

      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-surface-raised text-accent md:mt-1"
      >
        <ResearcherIcon className="h-4 w-4" aria-hidden="true" />
      </span>
    </li>
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

        <div className="overflow-hidden rounded-2xl border border-border bg-bg-card">
          <div className="flex items-center justify-between gap-3 border-b border-border-subtle bg-surface px-5 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
              Research registry
            </p>
            <span className="text-tiny font-mono uppercase tracking-widest text-text-muted">
              nodes // {researchersData.length}
            </span>
          </div>
          <ul className="divide-y divide-border/30">
            {researchersData.map((researcher) => (
              <ResearcherRow key={researcher.id} researcher={researcher} />
            ))}
          </ul>
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