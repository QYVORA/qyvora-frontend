import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cpu,
  FlaskConical,
  Github,
  GitPullRequest,
  Globe2,
  LockKeyhole,
  Rocket,
} from 'lucide-react';
import { useAuth } from '@/core/contexts/AuthContext';
import SEO from '@/shared/components/SEO';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { Footer } from '@/shared/components/layout';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import quiteRootLogo from '@/assets/quiteRoot/ChatGPT Image Jul 3, 2026, 02_45_59 AM.webp';

const capabilities = [
  'Offensive Security Research',
  'Tool Development',
  'Threat Intelligence',
  'Red Team Automation',
  'Detection Engineering',
  'Secure Infrastructure',
  'AI-assisted Security',
  'Cyber Education',
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
  ['Research First', 'Every tool begins with understanding the problem.', FlaskConical],
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
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  body?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-4xl text-center' : 'max-w-3xl'}>
      {eyebrow && (
        <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.35em] text-accent">
          {eyebrow}
        </span>
      )}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none text-text-primary">
        {title} {accent && <span className="text-accent">{accent}</span>}
      </h2>
      {body && (
        <p className="mt-5 text-sm md:text-base lg:text-lg text-text-secondary leading-relaxed">
          {body}
        </p>
      )}
    </div>
  );
}

function Hero() {
  return (
    <div className="relative w-full min-h-[85svh] md:min-h-screen flex flex-col">
      <div className="relative z-30 w-full flex-1 mx-auto grid grid-cols-1 lg:grid-cols-2 text-left items-center md:h-full">
        <div className="flex flex-col items-start justify-center px-6 sm:px-10 md:px-12 lg:pl-16 xl:pl-20 lg:pr-8 xl:pr-12 pt-20 sm:pt-28 lg:pt-32 pb-32 sm:pb-40 lg:pb-48 w-full h-full">
          <div className="flex flex-col items-start w-full space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9]">
              QUITE <span className="text-accent">ROOT</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-text-secondary font-mono leading-relaxed max-w-xl">
              The Intelligence Behind QYVORA
            </p>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-2xl">
              We engineer offensive security tools, conduct cyber intelligence research, and transform ideas into
              production-ready security capabilities.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <a href="#research" className="btn-primary px-8 py-4 font-black uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3">
                Explore Research <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="relative hidden lg:flex items-center justify-center w-full h-full pt-20 xl:pt-24 pb-32 lg:pb-48">
          <div className="relative z-10 w-full h-full max-w-[80%] 2xl:max-w-[75%] flex items-center justify-center">
            <img
              src={quiteRootLogo}
              alt="QuiteRoot"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function WhoWeAre() {
  return (
    <ScrollReveal direction="up">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-start gap-10 px-4 sm:px-8 md:px-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 xl:px-16">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {capabilities.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-border bg-bg-card/70 px-4 py-3 text-sm text-text-secondary transition-all hover:border-accent/35 hover:text-text-primary"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
              {item}
            </div>
          ))}
        </div>
        <div>
          <SectionHeader
            eyebrow="// WHO WE ARE"
            title="Who is"
            accent="QuiteRoot?"
            body="QuiteRoot is the offensive research and engineering collective behind QYVORA. We are the team responsible for building the tools, frameworks, intelligence, and offensive capabilities that power QYVORA."
          />
        </div>
      </div>
    </ScrollReveal>
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

function FeaturedProject() {
  const output = [
    'anansi recon --scope qyvora.netlify.app',
    '[discovery] 42 endpoints identified',
    '[probe] live services mapped',
    '[headers] controls reviewed',
    '[report] operator brief exported',
  ];

  return (
    <ScrollReveal direction="up">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-start gap-10 px-4 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12 xl:px-16">
        <div className="rounded-3xl border border-white/10 bg-bg-card/70 p-2">
          <div className="terminal-card overflow-hidden rounded-[1.35rem] bg-bg">
            <div className="border-b border-white/10 px-5 py-4 text-[10px] font-black uppercase tracking-[0.28em] text-text-muted">
              anansi-session.log
            </div>
            <div className="space-y-4 p-5 sm:p-8">
              {output.map((line, index) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.16 }}
                  className="flex min-w-0 items-center gap-3 font-mono text-xs text-text-secondary sm:text-sm"
                >
                  <span className="text-accent">{index === 0 ? '$' : '>'}</span>
                  <code className="truncate">{line}</code>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <SectionHeader
            eyebrow="// FEATURED PROJECT"
            title="ANANSI"
            accent="CLI"
            body="Built for offensive operators. Anansi CLI is QuiteRoot's flagship command-line framework designed to simplify offensive security operations through modular automation, intelligent workflows, and extensible tooling."
          />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {['Reconnaissance', 'Enumeration', 'Web Testing', 'Automation', 'AI Assistance', 'Reporting'].map((item) => (
              <div key={item} className="rounded-xl border border-border bg-bg-card/70 px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-text-secondary">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to="/blogs/anansi-cli" className="btn-primary inline-flex items-center justify-center gap-3 !px-8 !py-4 text-xs">
              Documentation <BookOpen className="h-4 w-4" />
            </Link>
            <a
              href="https://github.com/QYVORA/qyvora-anansi-cli"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary inline-flex items-center justify-center gap-3 !px-8 !py-4 text-xs"
            >
              GitHub <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

function BuildTimeline() {
  return (
    <ScrollReveal direction="up">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-8 lg:px-12">
        <SectionHeader align="center" eyebrow="// BEHIND THE BUILD" title="From Signal" accent="To Release" />
        <div className="relative mt-14">
          <div className="absolute left-5 top-0 hidden h-full w-px bg-accent/30 md:block" />
          <div className="space-y-5">
            {timeline.map(([title, body], index) => (
              <div
                key={title}
                className="group relative rounded-2xl border border-border bg-bg-card/70 p-5 transition-all hover:border-accent/35 md:ml-14"
              >
                <div className="absolute -left-[4.35rem] top-5 hidden h-10 w-10 items-center justify-center rounded-xl border border-accent/25 bg-bg text-accent md:flex">
                  <GitPullRequest className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-xl font-black uppercase tracking-tight text-text-primary">{title}</h3>
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-accent">
                    Phase {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

function Principles() {
  return (
    <ScrollReveal direction="up">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16">
        <SectionHeader align="center" eyebrow="// CORE PRINCIPLES" title="How QuiteRoot" accent="Builds" />
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map(([title, body, Icon], index) => (
            <div
              key={title as string}
              className="card-qyvora border border-border bg-bg-card/60 p-6 hover:border-accent/35"
            >
              {React.createElement(Icon as React.ElementType, { className: 'mb-7 h-8 w-8 text-accent' })}
              <h3 className="text-xl font-black uppercase tracking-tight text-text-primary">{title as string}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{body as string}</p>
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
        <section id="hero" className="relative w-full">
          <Hero />
        </section>

        <section id="about" className="relative w-full py-20 md:py-28 lg:py-32">
          <WhoWeAre />
        </section>

        <section id="mission" className="relative w-full py-20 md:py-28 lg:py-32">
          <Mission />
        </section>

        <section id="research" className="relative w-full py-20 md:py-28 lg:py-32">
          <FeaturedProject />
        </section>

        <section id="process" className="relative w-full py-20 md:py-28 lg:py-32">
          <BuildTimeline />
        </section>

        <section id="principles" className="relative w-full py-20 md:py-28 lg:py-32">
          <Principles />
        </section>

        <section id="cta" className="relative w-full">
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
