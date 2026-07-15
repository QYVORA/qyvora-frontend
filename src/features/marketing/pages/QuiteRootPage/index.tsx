import React from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';
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

const capabilities = [
  { id: 'research', title: 'Offensive Security Research', icon: IconSearch, desc: 'Pioneering research into attack vectors, exploit techniques, and defensive gaps across African digital infrastructure.' },
  { id: 'tool-dev', title: 'Tool Development', icon: Wrench, desc: 'Building production-grade security tools purpose-built for the unique challenges of African cybersecurity operations.' },
  { id: 'threat-intel', title: 'Threat Intelligence', icon: IconShield, desc: 'Collecting, analyzing, and operationalizing threat intelligence to protect African organizations and critical infrastructure.' },
  { id: 'red-team', title: 'Red Team Automation', icon: Brain, desc: 'Automating adversarial simulation workflows to continuously validate security postures at scale.' },
  { id: 'detection', title: 'Detection Engineering', icon: Cctv, desc: 'Crafting detection logic and signatures that identify real threats while minimizing false positives.' },
  { id: 'infra', title: 'Secure Infrastructure', icon: Cloud, desc: 'Designing and deploying hardened infrastructure for offensive operations and secure communications.' },
  { id: 'ai', title: 'AI-assisted Security', icon: Cpu, desc: 'Leveraging machine learning and AI to accelerate vulnerability discovery and security analysis.' },
  { id: 'education', title: 'Cyber Education', icon: BookOpen, desc: 'Developing curriculum, training, and knowledge-sharing initiatives to grow Africa\'s cybersecurity talent pool.' },
];

const timeline = [
  ['Research Idea', 'Frame the operational problem and collect raw signal.'],
  ['Threat Analysis', 'Map adversary behavior, targets, and defensive gaps.'],
  ['Prototype', 'Build narrow tools that prove the technique.'],
  ['Internal Testing', 'Stress the workflow against lab and field conditions.'],
  ['Production', 'Harden modules for repeatable operator use.'],
  ['Released', 'Ship documentation, binaries, and learning paths.'],
];

const principles = [
  ['Research First', 'Every tool begins with understanding the problem.', IconLabs],
  ['Precision Engineering', 'Every feature serves a purpose.', Cpu],
  ['Open Knowledge', 'Learning accelerates innovation.', BookOpen],
  ['Operational Security', 'Security is built into every layer.', LockKeyhole],
  ['African Innovation', 'Designed for African defenders.', Globe2],
  ['Continuous Improvement', 'Never finished.', Rocket],
];

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
  return (
    <PublicHeroSection mask="none" rightContent={
      <div className="relative hidden lg:flex items-center justify-center w-full h-full">
        <div className="relative z-10 w-full max-w-[80%] 2xl:max-w-[75%] flex items-center justify-center">
          <img
            src={quiteRootLogo}
            alt="QuiteRoot"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    }>
      <h1 className="font-black text-bg leading-[1.08] tracking-tight w-full relative">
        <span className="block whitespace-normal lg:whitespace-nowrap text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.5rem] xl:text-[3rem] lg:leading-[1.1] xl:leading-[1.05] uppercase">
          QUITE <span className="text-bg/80">ROOT</span>
        </span>
      </h1>
      <p className="text-bg/70 text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl animate-fade-in font-mono">
        The intelligence behind QYVORA — engineering offensive security tools and production-ready security capabilities.
      </p>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
        <a href="#research" className="btn-primary inline-flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-3 sm:!py-4 whitespace-nowrap">
          Explore Research <IconArrowRight size={16} />
        </a>
      </div>
    </PublicHeroSection>
  );
}

function WhoWeAre() {
  return (
    <div className="py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="mb-12">
        <SectionHeader
          eyebrow="// WHO WE ARE"
          title="Who is"
          accent="QuiteRoot?"
          body="QuiteRoot is the offensive research and engineering collective behind QYVORA. We are the team responsible for building the tools, frameworks, intelligence, and offensive capabilities that power QYVORA."
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
  return (
    <ScrollReveal direction="up">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-bg-card/50 p-8 text-center sm:p-12 lg:p-16">
          <SectionHeader
            align="center"
            eyebrow="// MISSION"
            title="Engineering Africa's Offensive"
            accent="Security Future"
            body="We believe offensive security should be built, not borrowed. QuiteRoot exists to create indigenous cybersecurity capability through original research, open innovation, and enterprise-grade engineering. Instead of relying solely on external tooling, we develop technologies that solve problems unique to African organizations."
          />
        </div>
      </div>
    </ScrollReveal>
  );
}



function Principles() {
  return (
    <ScrollReveal direction="up">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16">
        <SectionHeader align="center" title="How QuiteRoot" accent="Builds" />
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map(([title, body, Icon], index) => (
            <div
              key={title as string}
              className="card-qyvora border border-border bg-bg-card/60 p-6 hover:border-accent/35"
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
