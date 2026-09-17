import { Link } from 'react-router-dom';
import { Binary, Cpu, Palette, ShieldCheck, Users } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import { researchersData, type Researcher } from '@/features/marketing/content/researchersData';
import quiteRootLogo from '@/assets/quiteRoot/ChatGPT Image Jul 3, 2026, 02_45_59 AM.webp';

const RESEARCHER_ICONS: Record<string, React.ElementType> = {
  r1: Palette,
  r2: Cpu,
  r3: Binary,
  r4: ShieldCheck,
};

const RESEARCHER_LAYOUTS: Record<string, { imageFirst: boolean; imagePosition: string; marker: string }> = {
  r1: { imageFirst: true, imagePosition: 'object-center', marker: '01' },
  r2: { imageFirst: false, imagePosition: 'object-[center_20%]', marker: '02' },
  r3: { imageFirst: true, imagePosition: 'object-center', marker: '03' },
  r4: { imageFirst: false, imagePosition: 'object-[center_20%]', marker: '04' },
};

const ResearcherSection = ({ researcher }: { researcher: Researcher }) => {
  const layout = RESEARCHER_LAYOUTS[researcher.id];
  const ResearcherIcon = RESEARCHER_ICONS[researcher.id] ?? ShieldCheck;

  return (
    <ScrollReveal amount={0.08} className="h-full w-full">
      <article className="relative grid w-full grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 lg:gap-12">
        <div className={`relative h-64 max-h-[70vh] overflow-hidden rounded-2xl border border-border/50 bg-bg-card sm:h-80 lg:h-full ${layout.imageFirst ? 'lg:order-1' : 'lg:order-2'}`}>
          <img src={researcher.image} alt={researcher.name} width={researcher.width} height={researcher.height} className={`h-full w-full object-cover ${layout.imagePosition} transition-transform duration-700 hover:scale-105`} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-bg/80 text-xs font-black tracking-widest text-accent backdrop-blur-sm sm:left-5 sm:top-5 sm:h-11 sm:w-11">{layout.marker}</div>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-4 sm:bottom-5 sm:left-5 sm:right-5">
            <div>
              <p className="mb-1 text-xs font-black uppercase tracking-widest text-text-muted sm:mb-2">QuiteRoot researcher</p>
              <p className="text-xs font-black uppercase tracking-tight text-text-primary sm:text-sm">{researcher.name}</p>
            </div>
            <ResearcherIcon className="h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
          </div>
        </div>

        <div className={`flex min-h-0 min-w-0 flex-col justify-center ${layout.imageFirst ? 'lg:order-2' : 'lg:order-1'}`}>
          <span className="mb-2 w-fit rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-black uppercase tracking-widest text-accent sm:mb-3 lg:mb-5">{researcher.role}</span>
          <h2 className="text-2xl font-black uppercase tracking-tight leading-[.95] text-text-primary break-words md:text-4xl lg:text-6xl">{researcher.name}</h2>
          <p className="mt-2 text-xs font-black uppercase tracking-widest text-accent sm:mt-3">Research node // {researcher.id.toUpperCase()}</p>
          <p className="mt-3 max-w-2xl text-xs leading-[1.45] text-text-secondary sm:mt-4 sm:text-sm sm:leading-relaxed lg:mt-6 lg:text-base">{researcher.bio}</p>
          <div className="mt-4 pt-3 sm:mt-5 sm:pt-4 lg:mt-8 lg:pt-5">
            <p className="text-xs font-black uppercase tracking-widest text-text-muted">Independent research collective</p>
            <p className="mt-2 text-xs leading-relaxed text-text-secondary">QuiteRoot brings together builders and security-minded researchers contributing to QYVORA's tools, experiments, and learning ecosystem.</p>
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
};

const QuiteRootPage = () => {
  return (
    <div className="min-h-dvh bg-canvas">
      <SEO title="QuiteRoot - QYVORA" description="QuiteRoot, a network of security researchers pushing the boundaries of offensive security." />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex min-w-0 flex-col justify-center">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-accent">
              QYVORA · Network
            </span>
            <h1 className="mt-3 text-3xl font-black uppercase tracking-tight text-text-primary md:text-5xl lg:text-7xl">
              Quite Root
            </h1>
            <p className="mt-4 max-w-2xl font-mono text-sm leading-[1.8] text-text-secondary sm:text-base">
              A network of independent security researchers pushing the boundaries of offensive security research and tooling.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-6 text-xs font-mono uppercase tracking-widest text-text-muted sm:mt-5">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" aria-hidden="true" />
                <span className="font-bold text-text-primary">{researchersData.length}</span> Researchers
              </span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button to="/register">
                Join the Network <IconArrowRight size={14} />
              </Button>
            </div>
          </div>

          <div className="hidden items-center justify-center lg:flex">
            <img
              src={quiteRootLogo}
              alt="QuiteRoot"
              width={793}
              height={787}
              className="max-h-[56vh] w-[440px] object-contain"
            />
          </div>
        </div>

        <div className="mt-10 space-y-12 md:mt-14 md:space-y-16">
          {researchersData.map((researcher) => <ResearcherSection key={researcher.id} researcher={researcher} />)}
        </div>
      </PublicContainer>
    </div>
  );
};

export default QuiteRootPage;