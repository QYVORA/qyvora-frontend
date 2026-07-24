import { Link } from 'react-router-dom';
import { IconArrowRight } from '@/shared/components/icons';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import ScrollReveal from '@/shared/components/ScrollReveal';
import { PHASES } from '@/features/marketing/data/anansiData';
import { Carousel } from '@/shared/components/carousel';
import anansiLogo from '@/assets/anansi/anansi-main-logo.webp';

const LandingAnansiSection = () => {
  return (
    <div className="relative bg-bg min-h-dvh md:h-dvh flex flex-col overflow-hidden" data-nav-invert>
      <GridBoxedBackground opacity={0.4} blur={0} mask="right" />
      <div className="relative z-10 w-full h-full px-5 sm:px-6 md:px-16 lg:px-24 py-12 sm:py-10 md:py-16 lg:py-20 flex flex-col lg:flex-row gap-10 sm:gap-10 lg:gap-16 lg:items-stretch">
        {/* Header column */}
        <div className="shrink-0 lg:w-[420px] xl:w-[480px] flex flex-col lg:justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 overflow-hidden">
            <img src={anansiLogo} alt="Anansi logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tighter leading-none mb-2">
            Anansi <span className="text-accent">CLI</span>
          </h2>
          <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl mb-4">
            Terminal-first attack surface intelligence engine. Automate discovery, probing, and takeover detection.
          </p>
          <Link
            to="/anansi"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl border border-border/30 bg-bg-elevated text-text-primary text-[10px] font-black uppercase tracking-widest hover:bg-bg-card transition-colors w-fit"
          >
            Explore Anansi <IconArrowRight size={14} />
          </Link>
        </div>

        {/* Content column */}
        <div className="relative flex-1 min-h-0 min-w-0 overflow-hidden flex flex-col gap-6 lg:justify-center">
          {/* Pipeline carousel */}
          <ScrollReveal direction="up">
            <Carousel
              slides={PHASES}
              renderCard={(item) => (
                <div className="relative min-h-[160px] md:min-h-[200px] overflow-hidden p-5 sm:p-6 bg-bg rounded-2xl border border-border/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-accent">
                      Phase {item.id}
                    </span>
                  </div>
                  <h3 className="mb-2 text-sm md:text-base font-black uppercase tracking-tight text-text-primary">
                    {item.name}
                  </h3>
                  <p className="max-w-xl text-[10px] md:text-xs text-text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              )}
            />
          </ScrollReveal>

          {/* Quick install */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="rounded-2xl border border-border/20 bg-bg-elevated p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-accent">Quick Install</span>
              </div>
              <code className="block text-xs md:text-sm font-mono text-text-secondary">
                curl -L https://github.com/QYVORA/qyvora-anansi-cli/releases/latest/download/anansi-linux-amd64 -o anansi
              </code>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default LandingAnansiSection;
