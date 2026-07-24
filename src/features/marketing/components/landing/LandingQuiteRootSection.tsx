import { Link } from 'react-router-dom';
import { BookOpen, Cpu, Globe2, LockKeyhole, Rocket, Wrench, Brain, Cctv, Cloud } from 'lucide-react';
import { IconArrowRight, IconSearch, IconShield } from '@/shared/components/icons';
import { Carousel } from '@/shared/components/carousel';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { researchersData } from '@/features/marketing/content/researchersData';
import quiteRootLogo from '@/assets/quiteRoot/ChatGPT Image Jul 3, 2026, 02_45_59 AM.webp';

const capabilities = [
  { id: 'research', title: 'Vulnerability Research', icon: IconSearch, desc: 'Discovering and analyzing security vulnerabilities in software, hardware, and protocols.' },
  { id: 'tool-dev', title: 'Tool Development', icon: Wrench, desc: 'Building offensive security tools, frameworks, and automation for penetration testing.' },
  { id: 'threat-intel', title: 'Threat Intelligence', icon: IconShield, desc: 'Collecting and analyzing threat actor TTPs, indicators of compromise, and attack patterns.' },
  { id: 'red-team', title: 'Red Team Operations', icon: Brain, desc: 'Advanced adversary simulation and red team engagements for enterprise clients.' },
  { id: 'detection', title: 'Detection Engineering', icon: Cctv, desc: 'Building detection rules, SIEM pipelines, and automated response systems.' },
  { id: 'infra', title: 'Infrastructure Security', icon: Cloud, desc: 'Securing cloud environments, networks, and critical infrastructure.' },
  { id: 'ai', title: 'AI Security', icon: Cpu, desc: 'Researching AI/ML vulnerabilities, adversarial attacks, and model security.' },
  { id: 'education', title: 'Security Education', icon: BookOpen, desc: 'Training the next generation of offensive security professionals in Africa.' },
];

const LandingQuiteRootSection = () => {
  return (
    <div className="relative bg-bg min-h-dvh md:h-dvh flex flex-col overflow-hidden" data-nav-invert>
      <GridBoxedBackground opacity={0.4} blur={0} mask="right" />
      <div className="relative z-10 w-full h-full px-5 sm:px-6 md:px-16 lg:px-24 py-12 sm:py-10 md:py-16 lg:py-20 flex flex-col lg:flex-row gap-10 sm:gap-10 lg:gap-16 lg:items-stretch">
        {/* Header column */}
        <div className="shrink-0 lg:w-[420px] xl:w-[480px] flex flex-col lg:justify-center">
          <img
            src={quiteRootLogo}
            alt="QuiteRoot Logo"
            className="w-16 h-16 md:w-20 md:h-20 object-contain mb-4"
          />
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tighter leading-none mb-2">
            Quite<span className="text-text-secondary">Root</span>
          </h2>
          <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl mb-4">
            The offensive security research and engineering collective behind QYVORA. Building tools, intelligence, and production-ready security capabilities.
          </p>
          <Link
            to="/quiteroot"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl border border-border/30 bg-bg-elevated text-text-primary text-[10px] font-black uppercase tracking-widest hover:bg-bg-card transition-colors"
          >
            Explore QuiteRoot <IconArrowRight size={14} />
          </Link>
        </div>

        {/* Content column */}
        <div className="relative flex-1 min-h-0 min-w-0 overflow-hidden flex flex-col gap-6 lg:justify-center">
          {/* Capabilities carousel */}
          <ScrollReveal direction="up">
            <Carousel
              slides={capabilities}
              renderCard={(item) => (
                <div className="relative min-h-[200px] md:min-h-[260px] overflow-hidden p-6 sm:p-8 bg-bg rounded-2xl border border-border/30">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border/30 bg-accent/10">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mb-2 text-lg md:text-xl font-black uppercase tracking-tight text-text-primary">
                    {item.title}
                  </h3>
                  <p className="max-w-xl text-xs md:text-sm text-text-muted leading-relaxed break-words">
                    {item.desc}
                  </p>
                </div>
              )}
            />
          </ScrollReveal>

          {/* Researchers grid */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {researchersData.map((researcher) => (
                <div
                  key={researcher.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/20 bg-bg-elevated"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-border/20 shrink-0">
                    <img
                      src={researcher.image}
                      alt={researcher.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-primary truncate">
                      {researcher.name}
                    </p>
                    <p className="text-[9px] text-text-muted truncate">
                      {researcher.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default LandingQuiteRootSection;
