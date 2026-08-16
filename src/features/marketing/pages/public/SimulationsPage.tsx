import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { IconArrowRight, IconTerminal, IconCode, IconNetwork } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';

type SimKey = 'terminal' | 'ide' | 'network';

const SIMULATIONS: { id: SimKey; slug: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'terminal', slug: '/simulations/terminal', icon: IconTerminal },
  { id: 'ide', slug: '/simulations/ide', icon: IconCode },
  { id: 'network', slug: '/simulations/network-visualizer', icon: IconNetwork },
];

/* ── Shared feature card — identical across all simulation sections ─────── */
const FeatureCard: React.FC<{ feature: string }> = ({ feature }) => (
  <div className="rounded-2xl border border-border/20 bg-bg-card px-4 py-3.5 flex items-center gap-3">
    <span className="w-5 h-5 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
      <Zap className="w-2.5 h-2.5 text-accent" />
    </span>
    <span className="text-[10px] md:text-[11px] font-mono text-text-secondary leading-snug">{feature}</span>
  </div>
);

/* ── Static visual mocks (texture, not interactive) ─────────────────────── */
const TerminalMock: React.FC = () => (
  <div className="relative flex h-full min-h-[280px] lg:min-h-[360px] flex-col rounded-2xl border border-border/30 bg-[#0c0c0c] overflow-hidden">
    <div className="flex items-center gap-2 px-4 py-2.5 shrink-0">
      <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
      <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
      <span className="ml-2 text-[9px] font-mono text-text-muted">operator@qyvora — ~</span>
    </div>
    <div className="flex-1 min-h-0 p-4 font-mono text-[11px] leading-relaxed space-y-1 overflow-hidden">
      <p>
        <span className="text-accent">operator@qyvora</span>
        <span className="text-text-muted">:~$</span> ls -la /home/operator
      </p>
      <p className="text-text-muted">drwxr-xr-x operator operator 4096 Aug 14 09:21 .</p>
      <p className="text-text-muted">-rw-r--r-- operator operator  187 Aug 14 09:20 notes.txt</p>
      <p className="text-text-muted">-rwxr-xr-x operator operator 2048 Aug 14 09:19 scan.sh</p>
      <p>
        <span className="text-accent">operator@qyvora</span>
        <span className="text-text-muted">:~$</span> cat notes.txt
      </p>
      <p className="text-text-muted">recon the target · enumerate services · escalate.</p>
      <p className="text-text-muted">target 10.10.14.7 — keep low noise.</p>
      <p>
        <span className="text-accent">operator@qyvora</span>
        <span className="text-text-muted">:~$</span> whoami
      </p>
      <p className="text-text-muted">operator</p>
      <p>
        <span className="text-accent">operator@qyvora</span>
        <span className="text-text-muted">:~$</span> <span className="inline-block h-3 w-2 bg-accent/70 align-middle animate-pulse" />
      </p>
    </div>
  </div>
);

const IdeMock: React.FC = () => (
  <div className="relative flex h-full min-h-[280px] lg:min-h-[360px] flex-col rounded-2xl border border-border/30 bg-[#1e1e1e] overflow-hidden">
    <div className="flex items-end gap-1.5 px-4 pt-2.5 shrink-0">
      <span className="text-[9px] font-mono px-3 py-1.5 rounded-t-lg bg-[#0c0c0c] text-accent border border-b-0 border-border/30">
        main.py
      </span>
    </div>
    <div className="flex-1 min-h-0 bg-[#0c0c0c] p-4 font-mono text-[11px] leading-[1.8] overflow-hidden">
      <p><span className="text-[#c678dd]">def</span> <span className="text-accent">greet</span>(<span className="text-[#e5c07b]">name</span>):</p>
      <p className="pl-4 text-text-muted">"""Return a greeting string."""</p>
      <p className="pl-4 text-text-muted">return f"Hello,</p>
      <p className="pl-8 text-text-muted">{`{name}`}!"</p>
      <p><span className="text-[#c678dd]">print</span>(<span className="text-accent">greet</span>(<span className="text-[#e5c07b]">"Hacker"</span>))</p>
      <p className="text-text-muted">&nbsp;</p>
      <p className="text-text-muted">&gt; Hello, Hacker!</p>
      <p className="text-text-muted">&nbsp;</p>
      <p className="text-[#c678dd]">def</p> <span className="text-accent">fib</span>(<span className="text-[#e5c07b]">n</span>): ...
    </div>
  </div>
);

const NetworkMock: React.FC = () => (
  <div className="relative flex h-full min-h-[220px] lg:min-h-[280px] flex-col rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
    <div className="flex items-center justify-between px-4 py-2.5 shrink-0">
      <span className="text-[9px] font-mono text-text-muted">topology — recon</span>
      <span className="flex items-center gap-1.5 text-[9px] font-mono text-text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" /> live
      </span>
    </div>
    <div className="flex-1 min-h-0 flex items-center justify-center gap-2 sm:gap-4 px-4 py-6 overflow-hidden">
      <span className="rounded-xl border border-border/30 bg-bg px-3 py-2 text-[9px] font-mono text-text-muted whitespace-nowrap">edge 10.0.0.1</span>
      <span className="rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 text-[9px] font-mono text-accent whitespace-nowrap">10.10.14.0/24</span>
      <span className="rounded-xl border border-border/30 bg-bg px-3 py-2 text-[9px] font-mono text-text-muted whitespace-nowrap">10.10.14.7</span>
      <span className="rounded-xl border border-border/30 bg-bg px-3 py-2 text-[9px] font-mono text-text-muted whitespace-nowrap">:80 :443</span>
    </div>
  </div>
);

const SimulationsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const renderSection = (sim: (typeof SIMULATIONS)[number]) => {
    const features = (t(`simulations.${sim.id}.features`, { returnObjects: true }) as unknown as string[]) ?? [];

    const badge = (
      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">
        {t(`simulations.${sim.id}.tag`)}
      </span>
    );

    const heading = (
      <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-text-primary tracking-tighter leading-tight mt-2">
        {t(`simulations.${sim.id}.title`)}{' '}
        <span className="text-accent">{t(`simulations.${sim.id}.titleAccent`)}</span>
      </h2>
    );

    const description = (
      <p className="text-xs md:text-sm text-text-secondary leading-relaxed mt-3 font-mono max-w-xl">
        {t(`simulations.${sim.id}.description`)}
      </p>
    );

    const cta = (
      <Link
        to={sim.slug}
        className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-2.5 w-fit shrink-0 mt-6"
      >
        {t('simulations.runDemo')} <IconArrowRight size={14} />
      </Link>
    );

    if (sim.id === 'terminal') {
      /* Split layout — text left, live shell visual right */
      return (
        <PublicSnapSection key={sim.id}>
          <div className="flex flex-col gap-8 lg:gap-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">
              <div className="flex flex-col justify-center">
                {badge}
                {heading}
                {description}
                {cta}
              </div>
              <TerminalMock />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
              {features.map((feature, i) => (
                <FeatureCard key={i} feature={feature} />
              ))}
            </div>
          </div>
        </PublicSnapSection>
      );
    }

    if (sim.id === 'ide') {
      /* Split layout — header left, code editor visual right */
      return (
        <PublicSnapSection key={sim.id}>
          <div className="flex flex-col gap-8 lg:gap-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">
              <div className="flex flex-col justify-center">
                {badge}
                {heading}
                {description}
                {cta}
              </div>
              <IdeMock />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
              {features.map((feature, i) => (
                <FeatureCard key={i} feature={feature} />
              ))}
            </div>
          </div>
        </PublicSnapSection>
      );
    }

    /* Network — text and feature chips on one row, wide topology strip below */
    return (
      <PublicSnapSection key={sim.id}>
        <div className="flex flex-col gap-8 lg:gap-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-10">
            <div className="flex-1 max-w-xl">
              {badge}
              {heading}
              {description}
              {cta}
            </div>
            <div className="lg:w-[42%] grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
              {features.map((feature, i) => (
                <FeatureCard key={i} feature={feature} />
              ))}
            </div>
          </div>
          <NetworkMock />
        </div>
      </PublicSnapSection>
    );
  };

  return (
    <div className="bg-bg min-h-full">
      <SEO title={t('simulations.metaTitle')} description={t('simulations.metaDescription')} />
      <PublicSnapLayout>
        <section className="relative w-full min-h-dvh lg:h-dvh snap-section bg-bg">
        <StudentHeroSection
          title={t('simulations.heroTitle')}
          accentWord={t('simulations.heroAccent')}
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description={t('simulations.heroDescription')}
          stats={[
            { label: t('simulations.statsTools'), value: SIMULATIONS.length },
            { label: t('simulations.statsNoAccount'), value: '0' },
          ]}
        >
          <Link
            to="/register"
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"
          >
            <Zap className="w-4 h-4" /> {t('simulations.startTraining')} <IconArrowRight size={14} />
          </Link>
        </StudentHeroSection>
        </section>

        {SIMULATIONS.map((sim) => renderSection(sim))}

        <section className="relative w-full min-h-dvh lg:h-dvh snap-section bg-bg-alt">
          <LandingFinalCtaSection user={user} />
        </section>

        <section className="w-full bg-bg pt-10 md:pt-0 snap-section">
          <Footer />
        </section>
      </PublicSnapLayout>
    </div>
  );
};

export default SimulationsPage;
