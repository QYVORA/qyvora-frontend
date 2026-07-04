import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Binary,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Cpu,
  FlaskConical,
  Github,
  GitPullRequest,
  Globe2,
  LockKeyhole,
  Network,
  Rocket,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/core/contexts/AuthContext';
import SEO from '@/shared/components/SEO';
import { Footer } from '@/shared/components/layout';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import quiteRootLogo from '@/assets/quiteRoot/ChatGPT Image Jul 3, 2026, 02_45_59 AM.png';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const sectionTransition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const };

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

const terminalLines = [
  'root@quiteroot:~$',
  'loading research...',
  'building offensive capability...',
  'initializing intelligence...',
  'done.',
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
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={sectionTransition}
      className={align === 'center' ? 'mx-auto max-w-4xl text-center' : 'max-w-3xl'}
    >
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
    </motion.div>
  );
}

function AnimatedField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 dot-grid opacity-40" />
      <motion.div
        className="absolute left-[-10%] top-24 h-px w-[120%] bg-gradient-to-r from-transparent via-accent/60 to-transparent"
        animate={{ x: ['-18%', '18%'], opacity: [0.1, 0.55, 0.1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute right-[-10%] bottom-36 h-px w-[90%] bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        animate={{ x: ['12%', '-16%'], opacity: [0.08, 0.45, 0.08] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-45" role="presentation">
        <defs>
          <linearGradient id="qr-line" x1="0" x2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgba(102,184,112,0.8)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {[
          ['8%', '26%', '32%', '40%'],
          ['28%', '18%', '58%', '31%'],
          ['58%', '31%', '84%', '20%'],
          ['18%', '72%', '44%', '54%'],
          ['44%', '54%', '75%', '70%'],
        ].map(([x1, y1, x2, y2], index) => (
          <motion.line
            key={`${x1}-${y1}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#qr-line)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1], opacity: [0, 0.7, 0.2] }}
            transition={{ duration: 4.5, delay: index * 0.35, repeat: Infinity, repeatDelay: 2 }}
          />
        ))}
        {[
          ['8%', '26%'],
          ['32%', '40%'],
          ['58%', '31%'],
          ['84%', '20%'],
          ['18%', '72%'],
          ['44%', '54%'],
          ['75%', '70%'],
        ].map(([cx, cy], index) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="3"
            fill="#66B870"
            animate={{ opacity: [0.25, 0.9, 0.25], scale: [1, 1.45, 1] }}
            transition={{ duration: 3, delay: index * 0.2, repeat: Infinity }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 scanlines" />
      <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
    </div>
  );
}

function QuiteRootMark() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex h-20 w-20 shrink-0 items-center justify-center sm:h-28 sm:w-28 md:h-36 md:w-36 lg:h-44 lg:w-44"
      aria-label="QuiteRoot geometric mark"
    >
      <div className="absolute inset-0 rounded-[1.35rem] border border-accent/25 bg-accent/5 shadow-[0_0_80px_var(--color-accent-glow)] rotate-45 sm:rounded-[1.75rem] md:rounded-[2rem]" />
      <div className="absolute inset-3 rounded-xl border border-white/10 bg-bg-card/70 backdrop-blur-sm sm:inset-4 sm:rounded-2xl md:inset-5" />
      <div className="relative z-10 grid h-12 w-12 grid-cols-2 gap-1.5 sm:h-16 sm:w-16 sm:gap-2 md:h-24 md:w-24">
        <span className="rounded-tl-2xl border border-accent/40 bg-accent/20" />
        <span className="rounded-tr-md border border-white/10 bg-white/5" />
        <span className="rounded-bl-md border border-white/10 bg-white/5" />
        <span className="rounded-br-2xl border border-accent/40 bg-accent/20" />
      </div>
      <motion.span
        className="absolute h-2 w-2 rounded-full bg-accent"
        animate={{ y: [-36, 36, -36], opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}

function TerminalPanel({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`terminal-card border border-white/10 bg-bg-card/70 ${compact ? 'rounded-2xl' : 'rounded-3xl'} overflow-hidden`}>
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-text-muted">QuiteRoot Shell</span>
      </div>
      <div className="space-y-3 p-5 sm:p-7">
        {terminalLines.map((line, index) => (
          <motion.div
            key={line}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.22 }}
            className="flex items-center gap-3 font-mono text-xs sm:text-sm text-text-secondary"
          >
            <span className={index === 0 || index === terminalLines.length - 1 ? 'text-accent' : 'text-text-muted'}>
              {index === 0 ? '$' : '>'}
            </span>
            <code>{line}</code>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-bg pt-24">
      <AnimatedField />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-[1600px] items-center gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full max-w-3xl flex-col items-start"
        >
          <div className="flex w-full items-start justify-start">
            <h1 className="-ml-1 text-left text-4xl font-black uppercase leading-[0.82] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.5rem]">
              QUITE <span className="text-accent">ROOT</span>
            </h1>
          </div>

          <div className="mt-8 max-w-2xl text-left">
            <p className="text-lg font-black uppercase tracking-[0.22em] text-text-primary md:text-2xl">
              The Intelligence Behind QYVORA
            </p>
            <p className="mt-4 text-base text-text-secondary md:text-xl">
              Research. Build. Exploit. Defend.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-text-secondary md:text-base lg:text-lg">
              We engineer offensive security tools, conduct cyber intelligence research, and transform ideas into
              production-ready security capabilities.
            </p>
          </div>

          <div className="mt-9 flex flex-col items-stretch justify-start gap-4 sm:flex-row sm:items-center">
            <a href="#research" className="btn-primary inline-flex items-center justify-center gap-3 !px-8 !py-4 text-xs">
              Explore Research <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 w-full max-w-2xl"
          >
            <TerminalPanel compact />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex w-full items-center justify-center"
        >
          <div className="relative w-full max-w-[560px] overflow-hidden rounded-[2rem] border border-white/10 bg-bg-card/70 p-4 shadow-[0_0_80px_var(--color-accent-glow)] backdrop-blur-sm sm:p-6">
            <div className="absolute inset-0 dot-grid opacity-25" aria-hidden />
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-bg-card via-bg to-bg/90 p-8 sm:p-10 lg:p-12">
              <div className="absolute inset-0 rounded-[1.5rem] border border-accent/10" />
              <div className="absolute inset-x-10 inset-y-10 rounded-full bg-[radial-gradient(circle,rgba(102,184,112,0.16),transparent_70%)] blur-3xl" />
              <motion.div
                className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute left-1/2 top-1/2 h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
                animate={{ rotate: -360 }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute left-[18%] top-[24%] h-24 w-24 rounded-full border border-accent/20 bg-accent/10 blur-[2px]" />
              <div className="absolute right-[16%] top-[22%] h-20 w-20 rounded-full border border-white/10 bg-white/5" />
              <div className="absolute bottom-[18%] left-[22%] h-20 w-20 rounded-full border border-accent/20 bg-accent/10" />
              <div className="absolute bottom-[16%] right-[20%] h-24 w-24 rounded-full border border-white/10 bg-white/5" />
              {["18%", "32%", "58%", "72%"].map((pos, index) => (
                <motion.div
                  key={pos}
                  className="absolute h-2.5 w-2.5 rounded-full bg-accent"
                  style={{ left: pos, top: index % 2 === 0 ? '28%' : '70%' }}
                  animate={{ opacity: [0.15, 0.95, 0.15], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 3.2 + index * 0.35, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}
              <div className="absolute left-1/2 top-1/2 flex h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[1.2rem] border border-accent/20 bg-bg-card/50 p-4 shadow-[0_0_40px_var(--color-accent-glow)] backdrop-blur-sm">
                <img
                  src={quiteRootLogo}
                  alt="QuiteRoot official logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function WhoWeAre() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 lg:py-32">
      <div className="absolute inset-0 dot-grid opacity-20" aria-hidden />
      <div className="relative z-10 mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-10 px-4 sm:px-8 md:px-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 xl:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={sectionTransition}
          className="border-beam terminal-card rounded-3xl border border-white/10 bg-bg-card/60 p-6 sm:p-8"
        >
          <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-white/10 bg-bg">
            <div className="absolute inset-0 dot-grid opacity-45" />
            <div className="absolute inset-x-8 top-12 h-px bg-accent/50" />
            <div className="absolute inset-y-10 left-16 w-px bg-accent/35" />
            <div className="absolute bottom-16 left-10 right-12 h-px bg-accent/30" />
            <div className="absolute right-16 top-16 bottom-10 w-px bg-accent/25" />
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/25 bg-accent/5" />
            {[Network, BrainCircuit, Shield, Binary].map((Icon, index) => (
              <motion.div
                key={index}
                className="absolute flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/25 bg-bg-card/90 text-accent shadow-[0_0_36px_var(--color-accent-glow)]"
                style={{
                  left: `${18 + (index % 2) * 56}%`,
                  top: `${18 + Math.floor(index / 2) * 54}%`,
                }}
                animate={{ y: [0, -8, 0], opacity: [0.75, 1, 0.75] }}
                transition={{ duration: 4 + index, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Icon className="h-7 w-7" />
              </motion.div>
            ))}
          </div>
        </motion.div>
        <div>
          <SectionHeader
            eyebrow="// WHO WE ARE"
            title="Who is"
            accent="QuiteRoot?"
            body="QuiteRoot is the offensive research and engineering collective behind QYVORA. We are the team responsible for building the tools, frameworks, intelligence, and offensive capabilities that power QYVORA."
          />
          <motion.div
            className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {capabilities.map((item) => (
              <motion.div
                key={item}
                variants={fadeUp}
                className="flex items-center gap-3 rounded-2xl border border-border bg-bg-card/70 px-4 py-3 text-sm text-text-secondary transition-all hover:border-accent/35 hover:text-text-primary"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                {item}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Mission() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 lg:py-32">
      <AnimatedField />
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-bg-card/50 p-8 text-center backdrop-blur-sm sm:p-12 lg:p-16">
          <SectionHeader
            align="center"
            eyebrow="// MISSION"
            title="Engineering Africa's Offensive"
            accent="Security Future"
            body="We believe offensive security should be built, not borrowed. QuiteRoot exists to create indigenous cybersecurity capability through original research, open innovation, and enterprise-grade engineering. Instead of relying solely on external tooling, we develop technologies that solve problems unique to African organizations."
          />
        </div>
      </div>
    </section>
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
    <section id="research" className="relative overflow-hidden py-20 md:py-28 lg:py-32">
      <div className="absolute inset-0 dot-grid opacity-20" aria-hidden />
      <div className="relative z-10 mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-10 px-4 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12 xl:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={sectionTransition}
          className="border-beam rounded-3xl border border-white/10 bg-bg-card/70 p-2"
        >
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
        </motion.div>
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
    </section>
  );
}

function BuildTimeline() {
  return (
    <section className="relative py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-8 lg:px-12">
        <SectionHeader align="center" eyebrow="// BEHIND THE BUILD" title="From Signal" accent="To Release" />
        <div className="relative mt-14">
          <div className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-accent/0 via-accent/50 to-accent/0 md:block" />
          <div className="space-y-5">
            {timeline.map(([title, body], index) => (
              <motion.div
                key={title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                transition={{ ...sectionTransition, delay: index * 0.05 }}
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Principles() {
  return (
    <section className="relative py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16">
        <SectionHeader align="center" eyebrow="// CORE PRINCIPLES" title="How QuiteRoot" accent="Builds" />
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map(([title, body, Icon], index) => (
            <motion.div
              key={title as string}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-70px' }}
              transition={{ ...sectionTransition, delay: index * 0.04 }}
              className="card-qyvora border border-border bg-bg-card/60 p-6 hover:border-accent/35"
            >
              {React.createElement(Icon as React.ElementType, { className: 'mb-7 h-8 w-8 text-accent' })}
              <h3 className="text-xl font-black uppercase tracking-tight text-text-primary">{title as string}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{body as string}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
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
        <Hero />
        <WhoWeAre />
        <Mission />
        <FeaturedProject />
        <BuildTimeline />
        <Principles />
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
