import { Link } from 'react-router-dom';
import { Binary, Cpu, Palette, ShieldCheck, Users } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
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
    <PublicSnapSection id={`researcher-${researcher.id}`} fitViewport>
      <ScrollReveal amount={0.08} className="h-full w-full min-h-0">
        <article className="relative grid h-full w-full min-h-0 grid-cols-1 grid-rows-[minmax(100px,0.5fr)_minmax(0,1.5fr)] gap-3 sm:grid-rows-[minmax(150px,0.7fr)_minmax(0,1.3fr)] sm:gap-4 lg:grid-cols-2 lg:grid-rows-1 lg:gap-12">
          <div className={`relative min-h-0 overflow-hidden rounded-2xl border border-border/30 bg-bg-card ${layout.imageFirst ? 'lg:order-1' : 'lg:order-2'}`}>
            <img src={researcher.image} alt={researcher.name} width={researcher.width} height={researcher.height} className={`h-full w-full object-cover ${layout.imagePosition} transition-transform duration-700 hover:scale-105`} loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
            <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-border/30 bg-bg/80 text-[9px] font-black tracking-widest text-accent backdrop-blur-sm sm:left-5 sm:top-5 sm:h-11 sm:w-11 sm:text-[10px]">{layout.marker}</div>
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-4 sm:bottom-5 sm:left-5 sm:right-5">
              <div>
                <p className="mb-1 text-[8px] font-black uppercase tracking-widest text-text-muted sm:mb-2 sm:text-[9px]">QuiteRoot researcher</p>
                <p className="text-xs font-black uppercase tracking-tight text-text-primary sm:text-sm">{researcher.name}</p>
              </div>
              <ResearcherIcon className="h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
            </div>
          </div>

          <div className={`flex min-h-0 min-w-0 flex-col justify-center ${layout.imageFirst ? 'lg:order-2' : 'lg:order-1'}`}>
            <span className="mb-2 w-fit px-2.5 py-1 rounded-lg border border-accent/30 bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent sm:mb-3 lg:mb-5">{researcher.role}</span>
            <h2 className="text-2xl md:text-4xl lg:text-6xl font-black uppercase tracking-tight leading-[.95] text-text-primary break-words">{researcher.name}</h2>
            <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-accent sm:mt-3 sm:text-xs">Research node // {researcher.id.toUpperCase()}</p>
            <p className="mt-3 max-w-2xl text-[11px] leading-[1.45] text-text-secondary sm:mt-4 sm:text-sm sm:leading-relaxed lg:mt-6 lg:text-base">{researcher.bio}</p>
            <div className="mt-4 border-t border-border/30 pt-3 sm:mt-5 sm:pt-4 lg:mt-8 lg:pt-5">
              <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Independent research collective</p>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">QuiteRoot brings together builders and security-minded researchers contributing to QYVORA's tools, experiments, and learning ecosystem.</p>
            </div>
          </div>
        </article>
      </ScrollReveal>
    </PublicSnapSection>
  );
};

const QuiteRootPage = () => {
  const { user } = useAuth();

  return (
    <div className="bg-bg min-h-full">
      <SEO title="QuiteRoot - QYVORA" description="QuiteRoot — a network of security researchers pushing the boundaries of offensive security." />
      <PublicSnapLayout>
        <StudentHeroSection
          title="Quite"
          accentWord="Root"
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description="A network of independent security researchers pushing the boundaries of offensive security research and tooling."
          stats={[{ label: 'Researchers', value: researchersData.length }]}
          rightContent={
            <div className="relative md:hidden lg:flex items-center justify-center w-full h-full py-6 lg:py-0">
              <img
                src={quiteRootLogo}
                alt="QuiteRoot"
                width={793}
                height={787}
                className="w-[72%] xl:w-[64%] 2xl:w-[56%] max-h-[68vh] object-contain"
              />
            </div>
          }
        >
          <Link
            to="/register"
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"
          >
            <Users className="w-4 h-4" /> Join the Network <IconArrowRight size={14} />
          </Link>
        </StudentHeroSection>

        {researchersData.map((researcher) => <ResearcherSection key={researcher.id} researcher={researcher} />)}
        <LandingFinalCtaSection user={user} />
        <Footer />
      </PublicSnapLayout>
    </div>
  );
};

export default QuiteRootPage;
