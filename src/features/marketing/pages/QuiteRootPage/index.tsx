import React from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Cpu,
  Globe2,
  LockKeyhole,
  Rocket,
  Wrench,
  Brain,
  Cctv,
  Cloud,
} from 'lucide-react';
import { IconArrowRight, IconLabs, IconSearch, IconShield } from '@/shared/components/icons';
import { Carousel } from '@/shared/components/carousel';
import { useAuth } from '@/core/contexts/AuthContext';
import SEO from '@/shared/components/SEO';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { Footer } from '@/shared/components/layout';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import quiteRootLogo from '@/assets/quiteRoot/ChatGPT Image Jul 3, 2026, 02_45_59 AM.webp';
import { ResearchersCarouselSection } from './ResearchersCarouselSection';
import PublicHeroSection from '@/shared/components/PublicHeroSection';

function SectionHeader({
  eyebrow,
  title,
  accent,
  body,
  align = 'left',
  light = false,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  body?: string;
  align?: 'left' | 'center';
  light?: boolean;
}) {
  const eybrowCls = light ? 'text-bg' : 'text-accent';
  const titleCls = light ? 'text-bg' : 'text-text-primary';
  const accentCls = light ? 'text-bg/70' : 'text-accent';
  const bodyCls = light ? 'text-bg/60' : 'text-text-secondary';

  return (
    <div className={align === 'center' ? 'mx-auto max-w-4xl text-center' : 'max-w-3xl'}>
      {eyebrow && (
        <span className={`mb-4 block text-[10px] font-black uppercase tracking-[0.35em] ${eybrowCls}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none ${titleCls}`}>
        {title} {accent && <span className={accentCls}>{accent}</span>}
      </h2>
      {body && (
        <p className={`mt-5 text-sm md:text-base lg:text-lg leading-relaxed ${bodyCls}`}>
          {body}
        </p>
      )}
    </div>
  );
}

function Hero() {
  const { t } = useTranslation();
  return (
    <PublicHeroSection mask="none" rightContent={
      <div className="relative hidden lg:flex items-center justify-center w-full h-full">
        <div className="relative z-10 w-full max-w-[80%] 2xl:max-w-[75%] flex items-center justify-center">
          <img
            src={quiteRootLogo}
            alt="QuiteRoot"
            width={800}
            height={800}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    }>
      <h1 className="font-black text-bg leading-[1.08] tracking-tight w-full relative">
        <span className="block whitespace-normal lg:whitespace-nowrap text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05] uppercase">
          {t('quiterootPage.hero.title')}
        </span>
      </h1>
      <p className="text-bg/70 text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl animate-fade-in font-mono">
        {t('quiterootPage.hero.description')}
      </p>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
        <a href="#research" className="btn-primary inline-flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-3 sm:!py-4 whitespace-nowrap">
          {t('quiterootPage.hero.cta')} <IconArrowRight size={16} />
        </a>
      </div>
    </PublicHeroSection>
  );
}

function WhoWeAre() {
  const { t } = useTranslation();
  const capabilities = [
    { id: 'research', title: t('quiterootPage.capabilities.research.title'), icon: IconSearch, desc: t('quiterootPage.capabilities.research.desc') },
    { id: 'tool-dev', title: t('quiterootPage.capabilities.toolDev.title'), icon: Wrench, desc: t('quiterootPage.capabilities.toolDev.desc') },
    { id: 'threat-intel', title: t('quiterootPage.capabilities.threatIntel.title'), icon: IconShield, desc: t('quiterootPage.capabilities.threatIntel.desc') },
    { id: 'red-team', title: t('quiterootPage.capabilities.redTeam.title'), icon: Brain, desc: t('quiterootPage.capabilities.redTeam.desc') },
    { id: 'detection', title: t('quiterootPage.capabilities.detection.title'), icon: Cctv, desc: t('quiterootPage.capabilities.detection.desc') },
    { id: 'infra', title: t('quiterootPage.capabilities.infra.title'), icon: Cloud, desc: t('quiterootPage.capabilities.infra.desc') },
    { id: 'ai', title: t('quiterootPage.capabilities.ai.title'), icon: Cpu, desc: t('quiterootPage.capabilities.ai.desc') },
    { id: 'education', title: t('quiterootPage.capabilities.education.title'), icon: BookOpen, desc: t('quiterootPage.capabilities.education.desc') },
  ];
  return (
    <div className="py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="mb-12">
        <SectionHeader
          eyebrow={t('quiterootPage.about.eyebrow')}
          title={t('quiterootPage.about.title')}
          accent={t('quiterootPage.about.accent')}
          body={t('quiterootPage.about.body')}
        />
        </div>
        <ScrollReveal direction="up" amount={0.1}>
          <Carousel
            slides={capabilities}
            renderCard={(item) => (
              <div className="relative min-h-[300px] md:min-h-[420px] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{ backgroundImage: `url(${quiteRootLogo})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-bg-card via-bg-card/80 to-bg-card/90" />
                <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent" />
                <div className="relative z-10 p-8 sm:p-10 md:p-12 flex flex-col items-start justify-end h-full min-h-[300px] md:min-h-[420px]">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/25 bg-accent/10">
                    <item.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="mb-3 text-2xl md:text-3xl font-black uppercase tracking-tight text-text-primary">
                    {item.title}
                  </h3>
                  <p className="max-w-xl text-sm md:text-base text-text-secondary leading-relaxed break-words">
                    {item.desc}
                  </p>
                </div>
              </div>
            )}
            autoPlayInterval={6000}
          />
        </ScrollReveal>
      </div>
    </div>
  );
}

function Mission() {
  const { t } = useTranslation();
  return (
    <ScrollReveal direction="up">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-bg-card/50 p-8 text-center sm:p-12 lg:p-16">
          <SectionHeader
            align="center"
            eyebrow={t('quiterootPage.mission.eyebrow')}
            title={t('quiterootPage.mission.title')}
            accent={t('quiterootPage.mission.accent')}
            body={t('quiterootPage.mission.body')}
          />
        </div>
      </div>
    </ScrollReveal>
  );
}



function Principles() {
  const { t } = useTranslation();
  const principles = [
    [t('quiterootPage.principles.researchFirst'), t('quiterootPage.principles.researchFirstDesc'), IconLabs],
    [t('quiterootPage.principles.precision'), t('quiterootPage.principles.precisionDesc'), Cpu],
    [t('quiterootPage.principles.openKnowledge'), t('quiterootPage.principles.openKnowledgeDesc'), BookOpen],
    [t('quiterootPage.principles.opSec'), t('quiterootPage.principles.opSecDesc'), LockKeyhole],
    [t('quiterootPage.principles.africanInnovation'), t('quiterootPage.principles.africanInnovationDesc'), Globe2],
    [t('quiterootPage.principles.continuousImprovement'), t('quiterootPage.principles.continuousImprovementDesc'), Rocket],
  ];
  return (
    <ScrollReveal direction="up">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16">
        <SectionHeader align="center" title={t('quiterootPage.principles.title')} accent={t('quiterootPage.principles.accent')} />
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map(([title, body, Icon], index) => (
            <div
              key={title as string}
              className="card-qyvora border border-border/30 bg-bg-card/60 p-6 hover:border-accent/35"
            >
              {React.createElement(Icon as React.ElementType, { className: 'mb-7 h-8 w-8 text-accent' })}
              <h3 className="text-xl font-black uppercase tracking-tight text-text-primary">{title as string}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary break-words">{body as string}</p>
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

const QuiteRootPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { user } = useAuth();
  const { t } = useTranslation();

  const timeline = [
    [t('quiterootPage.timeline.researchIdea'), t('quiterootPage.timeline.researchIdeaDesc')],
    [t('quiterootPage.timeline.threatAnalysis'), t('quiterootPage.timeline.threatAnalysisDesc')],
    [t('quiterootPage.timeline.prototype'), t('quiterootPage.timeline.prototypeDesc')],
    [t('quiterootPage.timeline.internalTesting'), t('quiterootPage.timeline.internalTestingDesc')],
    [t('quiterootPage.timeline.production'), t('quiterootPage.timeline.productionDesc')],
    [t('quiterootPage.timeline.released'), t('quiterootPage.timeline.releasedDesc')],
  ];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-bg">
      <SEO
        title="QuiteRoot - The Intelligence Behind QYVORA"
        description="QuiteRoot is the offensive security research and engineering collective behind QYVORA, building tools, intelligence, and production-ready security capabilities."
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'QuiteRoot', item: '/quiteroot' },
        ]}
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'QuiteRoot',
          url: `${SITE_CONFIG.brand.siteUrl}/quiteroot`,
          parentOrganization: {
            '@type': 'Organization',
            name: 'QYVORA',
            url: SITE_CONFIG.brand.siteUrl,
          },
          description:
            'Offensive security research and engineering collective behind QYVORA.',
        }}
      />
      <div data-saver={shouldReduceMotion ? 'true' : undefined}>
        <section id="hero" className="relative w-full min-h-dvh md:h-dvh md:overflow-hidden">
          <Hero />
        </section>

        <section id="about" className="relative w-full">
          <WhoWeAre />
        </section>

        <section id="researchers" className="relative w-full py-20 md:py-28 lg:py-32">
          <ResearchersCarouselSection />
        </section>

        <section id="mission" className="relative w-full py-20 md:py-28 lg:py-32">
          <Mission />
        </section>

        <section id="principles" className="relative w-full py-20 md:py-28 lg:py-32">
          <Principles />
        </section>

        <section id="cta" className="relative w-full min-h-dvh md:h-dvh md:overflow-hidden">
          <LandingFinalCtaSection user={user} />
        </section>
      </div>
      <section id="footer" className="w-full bg-bg">
        <Footer />
      </section>
    </div>
  );
};

export default QuiteRootPage;
