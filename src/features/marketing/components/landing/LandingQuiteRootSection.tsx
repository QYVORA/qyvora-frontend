import { Link } from 'react-router-dom';
import { BookOpen, Cpu, Globe2, LockKeyhole, Rocket, Wrench, Brain, Cctv, Cloud } from 'lucide-react';
import { IconArrowRight, IconSearch, IconShield } from '@/shared/components/icons';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { researchersData } from '@/features/marketing/content/researchersData';
import quiteRootLogo from '@/assets/quiteRoot/ChatGPT Image Jul 3, 2026, 02_45_59 AM.webp';
import { useTranslation } from 'react-i18next';

const CAPABILITY_KEYS = ['research', 'toolDev', 'threatIntel', 'redTeam', 'detection', 'infra', 'ai', 'education'] as const;
const CAPABILITY_ICONS: Record<string, React.ElementType> = {
  research: IconSearch,
  toolDev: Wrench,
  threatIntel: IconShield,
  redTeam: Brain,
  detection: Cctv,
  infra: Cloud,
  ai: Cpu,
  education: BookOpen,
};

const LandingQuiteRootSection = () => {
  const { t } = useTranslation();
  return (
    <div className="relative bg-bg min-h-dvh md:h-dvh flex flex-col overflow-hidden" data-nav-invert>
      <GridBoxedBackground opacity={0.4} blur={0} mask="right" />
      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 py-12 sm:py-10 md:py-16 lg:py-20 flex flex-col gap-8 sm:gap-10 lg:gap-12">
        {/* Header */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={quiteRootLogo}
              alt="QuiteRoot Logo"
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
            <div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tighter leading-none mb-2">
                {t('landing.quiteroot.title')}<span className="text-accent">{t('landing.quiteroot.titleAccent')}</span>
              </h2>
              <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl">
                {t('landing.quiteroot.description')}
              </p>
            </div>
          </div>
          <Link
            to="/quiteroot"
            className="btn-secondary inline-flex items-center gap-2.5 w-fit"
          >
            {t('landing.quiteroot.explore')} <IconArrowRight size={14} />
          </Link>
        </div>

        {/* Capability cards — 2 col grid like team section */}
        <div className="relative flex-1 min-h-0 min-w-0 overflow-hidden flex items-start lg:justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {CAPABILITY_KEYS.map((key, idx) => {
              const Icon = CAPABILITY_ICONS[key];
              return (
                <ScrollReveal key={key} direction="up" delay={idx * 0.1}>
                  <div className="group relative flex flex-col rounded-2xl border border-border/30 bg-bg-card p-5 transition-all duration-300 hover:border-accent/30 h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-tight text-text-primary group-hover:text-accent transition-colors">
                        {t(`landing.quiteroot.capabilities.${key}`)}
                      </h3>
                    </div>
                    <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">
                      {t(`landing.quiteroot.capabilities.${key}Desc`)}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* Researchers grid — styled like team member cards */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {researchersData.map((researcher) => (
              <div
                key={researcher.id}
                className="group relative flex flex-col rounded-2xl border border-border/30 bg-bg-card p-5 transition-all duration-300 hover:border-accent/30"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border/30 shrink-0">
                    <img
                      src={researcher.image}
                      alt={researcher.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black uppercase tracking-tight text-text-primary group-hover:text-accent transition-colors truncate">
                      {researcher.name}
                    </h3>
                    <span className="inline-block px-2 py-0.5 rounded-lg bg-accent/10 text-[10px] font-black uppercase tracking-widest text-accent mt-1">
                      {researcher.role}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">
                  {researcher.bio}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default LandingQuiteRootSection;
