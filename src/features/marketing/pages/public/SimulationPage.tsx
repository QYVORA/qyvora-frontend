import { useState } from 'react';
import { Navigate, Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, ArrowLeft, Play } from 'lucide-react';
import { IconArrowRight, IconTerminal, IconCode, IconNetwork } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import CodeBlock from '@/shared/components/CodeBlock';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { SimulationProvider } from '@/features/student/components/simulations';
import { TerminalWrapper } from '@/shared/components/learning/TerminalWrapper';
import Ide from '@/features/student/components/tools/Ide';
import NetworkBuilder from '@/features/student/components/tools/NetworkBuilder';

const SLUG_KEYS: Record<string, 'terminal' | 'ide' | 'network'> = {
  terminal: 'terminal',
  ide: 'ide',
  'network-visualizer': 'network',
};

const SIM_ICONS: Record<'terminal' | 'ide' | 'network', React.ComponentType<{ className?: string }>> = {
  terminal: IconTerminal,
  ide: IconCode,
  network: IconNetwork,
};

const DEMO_FILES = [
  {
    id: 'main',
    name: 'main.py',
    language: 'python' as const,
    content: `# QYVORA — Python Exercise
# Complete the function below and run the code.

def greet(name):
    """Return a greeting string."""
    return f"Hello, {name}! Welcome to QYVORA."

# Test your function
message = greet("Hacker")
print(message)

# TODO: Try modifying the function to uppercase the name
`,
  },
  {
    id: 'app',
    name: 'app.js',
    language: 'javascript' as const,
    content: `// QYVORA — JavaScript Exercise
// Complete the function below and run the code.

function fibonacci(n) {
  // Return the first n numbers of the Fibonacci sequence
  const result = [];
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) {
    result.push(a);
    [a, b] = [b, a + b];
  }
  return result;
}

console.log(fibonacci(10));
`,
  },
  {
    id: 'script',
    name: 'script.sh',
    language: 'bash' as const,
    content: `#!/bin/bash
# QYVORA — Bash Exercise
# Complete the script below and run the code.

echo "=== System Info ==="
echo "User: $(whoami)"
echo "Date: $(date)"
echo "Current dir: $(pwd)"

# TODO: List files in the current directory
# TODO: Save the system info to a file
`,
  },
];

const SimulationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [demoOpen, setDemoOpen] = useState(false);

  const key = SLUG_KEYS[slug ?? ''];
  if (!key) return <Navigate to="/simulations" replace />;

  const DemoIcon = SIM_ICONS[key];

  const features = (t(`simulations.${key}.features`, { returnObjects: true }) as unknown as string[]) ?? [];

  return (
    <div className="bg-bg min-h-full">
      <SEO
        title={`${t(`simulations.${key}.title`)} — ${t('simulations.metaTitle')}`}
        description={t(`simulations.${key}.description`)}
      />
      <SimulationProvider>
        <PublicSnapLayout>
          <section className="relative w-full min-h-dvh snap-section bg-bg">
          <StudentHeroSection
            title={t(`simulations.${key}.title`)}
            accentWord={t(`simulations.${key}.titleAccent`)}
            titleClassName={PUBLIC_HERO_TITLE_CLASS}
            showGlobe
            typewrite
            description={t(`simulations.${key}.description`)}
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/register"
                className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-2.5"
              >
                <Zap className="w-4 h-4" /> {t('simulations.startTraining')} <IconArrowRight size={14} />
              </Link>
              <Link
                to="/simulations"
                className="btn-secondary inline-flex items-center justify-center gap-2 px-6 py-2.5"
              >
                <ArrowLeft className="w-4 h-4" /> {t('simulations.backToAll')}
              </Link>
            </div>
          </StudentHeroSection>
          </section>

          {/* Demo launcher — the live tool opens in a modal */}
          <PublicSnapSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-center">
              {/* Left — launcher copy + CTA */}
              <div className="flex flex-col gap-5">
                <span className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <DemoIcon className="w-6 h-6 md:w-7 md:h-7 text-accent" />
                </span>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">
                    {t(`simulations.${key}.tag`)}
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-text-primary tracking-tighter leading-tight mt-2">
                    {t(`simulations.${key}.demoTitle`)}
                  </h2>
                </div>
                <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-mono max-w-xl">
                  {t(`simulations.${key}.demoDescription`)}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
                  <button
                    onClick={() => setDemoOpen(true)}
                    className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-3"
                  >
                    <Play className="w-4 h-4" /> {t('simulations.runDemo')} <IconArrowRight size={14} />
                  </button>
                  <span className="text-[10px] font-mono text-text-muted leading-snug max-w-[220px]">
                    {t('simulations.statsNoAccount')} · live in your browser
                  </span>
                </div>
              </div>

              {/* Right — live preview of the exercise you will run */}
              <CodeBlock
                code={DEMO_FILES[0].content}
                lang="text"
                filename={DEMO_FILES[0].name}
                maxHeight="max-h-[50vh]"
              />
            </div>
          </PublicSnapSection>

          <PublicSnapSection>
            <div className="flex flex-col gap-6 lg:gap-8">
              <h2 className="text-lg md:text-2xl lg:text-3xl font-black text-text-primary tracking-tighter leading-tight">
                {t(`simulations.${key}.demoTitle`)}{' '}
                <span className="text-accent">{t('simulations.heroAccent')}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="card-accent bg-bg-card px-4 py-4 flex items-center gap-3"
                  >
                    <span className="w-6 h-6 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                      <Zap className="w-3 h-3 text-accent" />
                    </span>
                    <span className="text-[11px] md:text-xs font-mono text-text-secondary leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
              >
                {t('simulations.startTraining')} <IconArrowRight size={14} />
              </Link>
            </div>
          </PublicSnapSection>

          <section className="relative w-full min-h-dvh snap-section bg-bg-alt">
            <LandingFinalCtaSection user={user} />
          </section>

          <section className="w-full bg-bg pt-10 md:pt-0 snap-section">
            <Footer />
          </section>
        </PublicSnapLayout>

        {/* Live tool modals */}
        {key === 'terminal' && (
          <TerminalWrapper open={demoOpen} onOpenChange={setDemoOpen} context={{ type: 'dashboard' }} mode="modal" />
        )}
        {key === 'ide' && (
          <Ide
            open={demoOpen}
            onOpenChange={setDemoOpen}
            title="Code Playground"
            terminalContext={{ type: 'dashboard' }}
            files={DEMO_FILES}
          />
        )}
        {key === 'network' && <NetworkBuilder open={demoOpen} onOpenChange={setDemoOpen} />}
      </SimulationProvider>
    </div>
  );
};

export default SimulationPage;
