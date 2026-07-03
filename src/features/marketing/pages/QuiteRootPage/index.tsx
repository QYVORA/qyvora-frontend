import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Binary,
  BookOpen,
  Boxes,
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
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';
import SEO from '@/shared/components/SEO';
import { Footer } from '@/shared/components/layout';
import { Carousel } from '@/shared/components/carousel';
import { ContactTrigger } from '@/features/marketing/components/ContactModal';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import anansiImage from '@/assets/blog/anansi-cli.webp';
import researchImage from '@/assets/blog/mapping-attack-surfaces.webp';
import workspaceImage from '@/assets/team/sopt4.webp';
import toolingImage from '@/assets/anansi/discovery.webp';
import intelImage from '@/assets/anansi/tls.webp';
import labImage from '@/assets/illustrations/hero-terminal-panel.webp';
import engineeringImage from '@/assets/sections/how-it-works/practice-bg.webp';

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

type ProjectCard = {
  id: string;
  name: string;
  status?: string;
  description?: string;
  active?: boolean;
};

type GallerySlide = {
  id: string;
  title: string;
  label: string;
  image: string;
  video?: string;
};

const projects: ProjectCard[] = [
  {
    id: 'anansi-cli',
    name: 'Anansi CLI',
    status: 'ACTIVE',
    description:
      'A modular offensive security framework built to streamline reconnaissance, automation, and penetration testing workflows.',
    active: true,
  },
  { id: 'qr-recon', name: 'QR Recon' },
  { id: 'malware-sandbox', name: 'Malware Sandbox' },
  { id: 'packetscope', name: 'PacketScope' },
  { id: 'qdns', name: 'QDNS' },
  { id: 'rootos', name: 'RootOS' },
  { id: 'threat-atlas', name: 'Threat Atlas' },
  { id: 'zerotrace', name: 'ZeroTrace' },
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

const gallerySlides: GallerySlide[] = [
  { id: 'anansi', title: 'Anansi CLI', label: 'Flagship framework', image: anansiImage },
  { id: 'research', title: 'Research', label: 'Original cyber intelligence', image: researchImage },
  { id: 'workspace', title: 'Team Workspace', label: 'Builders behind QYVORA', image: workspaceImage },
  { id: 'tooling', title: 'Tooling', label: 'Automation for operators', image: toolingImage },
  { id: 'intel', title: 'Threat Intelligence', label: 'Signal-rich analysis', image: intelImage },
  { id: 'engineering', title: 'Engineering', label: 'Production-ready capability', image: engineeringImage },
  { id: 'lab', title: 'Cyber Lab', label: 'Experiment, test, release', image: labImage },
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
      className="relative mx-auto mb-8 flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44"
      aria-label="QuiteRoot geometric mark"
    >
      <div className="absolute inset-0 rounded-[2rem] border border-accent/25 bg-accent/5 shadow-[0_0_80px_var(--color-accent-glow)] rotate-45" />
      <div className="absolute inset-5 rounded-2xl border border-white/10 bg-bg-card/70 backdrop-blur-sm" />
      <div className="relative z-10 grid h-24 w-24 grid-cols-2 gap-2">
        <span className="rounded-tl-2xl border border-accent/40 bg-accent/20" />
        <span className="rounded-tr-md border border-white/10 bg-white/5" />
        <span className="rounded-bl-md border border-white/10 bg-white/5" />
        <span className="rounded-br-2xl border border-accent/40 bg-accent/20" />
      </div>
      <motion.span
        className="absolute h-2 w-2 rounded-full bg-accent"
        animate={{ y: [-48, 48, -48], opacity: [0.2, 1, 0.2] }}
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

function GalleryMedia({ slide }: { slide: GallerySlide }) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  React.useEffect(() => {
    if (!slide.video || !videoRef.current) return;

    const video = videoRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [slide.video]);

  if (!slide.video) {
    return (
      <img
        src={slide.image}
        alt={slide.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 hidden h-full w-full object-cover opacity-55 md:block"
        src={slide.video}
        poster={slide.image}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
      />
      <img
        src={slide.image}
        alt={slide.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-55 md:hidden"
      />
    </>
  );
}

function Hero() {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-bg pt-24">
      <AnimatedField />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] max-w-[1600px] flex-col items-center justify-center px-4 py-16 text-center sm:px-8 lg:px-12 xl:px-16">
        <QuiteRootMark />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <h1 className="text-5xl font-black uppercase leading-[0.85] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
            QUITE <span className="text-accent">ROOT</span>
          </h1>
          <p className="mt-6 text-lg font-black uppercase tracking-[0.22em] text-text-primary md:text-2xl">
            The Intelligence Behind QYVORA
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-base text-text-secondary md:text-xl">
            Research. Build. Exploit. Defend.
          </p>
          <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-text-secondary md:text-base lg:text-lg">
            We engineer offensive security tools, conduct cyber intelligence research, and transform ideas into
            production-ready security capabilities.
          </p>
          <div className="mt-9 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <a href="#research" className="btn-primary inline-flex items-center justify-center gap-3 !px-8 !py-4 text-xs">
              Explore Research <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 w-full max-w-2xl"
        >
          <TerminalPanel compact />
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

function ResearchProjects() {
  return (
    <section id="research" className="relative py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader eyebrow="// LAB INDEX" title="Research Discoveries" accent="Projects" />
          <p className="max-w-xl text-sm leading-relaxed text-text-muted">
            Release-grade experiments, internal frameworks, and future capability tracks from the QuiteRoot lab.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...sectionTransition, delay: index * 0.04 }}
              className={`card-qyvora border p-5 ${
                project.active
                  ? 'md:col-span-2 border-accent/30 bg-accent-dim'
                  : 'border-border bg-bg-card/60 opacity-80'
              }`}
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                  {project.active ? <Terminal className="h-5 w-5" /> : <Boxes className="h-5 w-5" />}
                </div>
                <span className="rounded-lg border border-accent/20 bg-bg/60 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                  {project.active ? project.status : 'Coming Soon'}
                </span>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-text-primary">{project.name}</h3>
              <p className="mt-3 min-h-20 text-sm leading-relaxed text-text-secondary">
                {project.description ?? 'Research track under active lab development. Public notes and tooling will ship when operationally ready.'}
              </p>
              {project.active && (
                <Link to="/anansi" className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-accent">
                  Explore <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </motion.div>
          ))}
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
    <section className="relative overflow-hidden py-20 md:py-28 lg:py-32">
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

function Gallery() {
  return (
    <section className="relative py-20 md:py-28 lg:py-32">
      <div className="w-full px-4 md:px-10 lg:px-12 xl:px-16">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col md:flex-row md:items-start md:gap-12 lg:gap-16">
          <div className="mb-8 text-center md:sticky md:top-32 md:mb-0 md:w-[35%] md:text-left lg:w-[38%]">
            <SectionHeader eyebrow="// GALLERY" title="Inside The" accent="Lab" />
          </div>
          <div className="md:w-[65%] lg:w-[62%]">
            <Carousel
              slides={gallerySlides}
              autoPlayInterval={5200}
              renderCard={(slide) => (
                <div className="relative min-h-[320px] overflow-hidden md:min-h-[420px]">
                  <GalleryMedia slide={slide} />
                  <div className="absolute inset-0 bg-gradient-to-r from-bg-card via-bg-card/80 to-transparent" />
                  <div className="relative z-10 flex min-h-[320px] flex-col items-start justify-end p-6 text-left md:min-h-[420px] md:p-8">
                    <span className="mb-3 rounded-lg border border-accent/20 bg-accent/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-accent">
                      {slide.label}
                    </span>
                    <h3 className="text-3xl font-black uppercase tracking-tight text-text-primary md:text-5xl">
                      {slide.title}
                    </h3>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function JoinMission() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 lg:py-32">
      <AnimatedField />
      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-8 lg:px-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={sectionTransition}
          className="glass-effect rounded-3xl p-8 text-center shadow-[0_0_80px_rgba(0,0,0,0.35)] sm:p-12 lg:p-16"
        >
          <Sparkles className="mx-auto mb-6 h-9 w-9 text-accent" />
          <h2 className="text-4xl font-black uppercase tracking-tight text-text-primary md:text-6xl">
            Want to build with <span className="text-accent">QuiteRoot?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-text-secondary md:text-base">
            We are always experimenting with new ideas and looking for contributors passionate about offensive
            security, tooling, and research.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <ContactTrigger className="btn-primary inline-flex items-center justify-center gap-3 !px-8 !py-4 text-xs">
              Contact Us <ArrowRight className="h-4 w-4" />
            </ContactTrigger>
            <Link to="/" className="btn-secondary inline-flex items-center justify-center gap-3 !px-8 !py-4 text-xs">
              Explore QYVORA <Zap className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const QuiteRootPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

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
        <ResearchProjects />
        <FeaturedProject />
        <BuildTimeline />
        <Principles />
        <Gallery />
        <JoinMission />
      </div>
      <section id="footer" className="w-full bg-bg">
        <Footer />
      </section>
    </div>
  );
};

export default QuiteRootPage;
