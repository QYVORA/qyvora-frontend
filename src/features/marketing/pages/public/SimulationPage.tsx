import React, { useState } from 'react';
import { Navigate, Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, ArrowLeft, Play } from 'lucide-react';
import { IconArrowRight, IconTerminal, IconCode, IconNetwork } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import CodeBlock from '@/shared/components/CodeBlock';
import PageHeader from '@/shared/components/ui/PageHeader';
import Button from '@/shared/components/ui/Button';
import { SimpleHeading } from '@/shared/components/ui';
import { useAuth } from '@/core/contexts/AuthContext';
import { SimulationProvider } from '@/features/student/components/simulations';
import RelatedContentSection from '@/shared/components/RelatedContentSection';
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
    content: `# QYVORA - Python Exercise
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
    content: `// QYVORA - JavaScript Exercise
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
# QYVORA - Bash Exercise
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

const SIM_META: Record<'terminal' | 'ide' | 'network', { slug: string; icon: React.ComponentType<{ className?: string }> }> = {
  terminal: { slug: '/simulations/terminal', icon: IconTerminal },
  ide: { slug: '/simulations/ide', icon: IconCode },
  network: { slug: '/simulations/network-visualizer', icon: IconNetwork },
};

const SimulationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [demoOpen, setDemoOpen] = useState(false);

  const key = SLUG_KEYS[slug ?? ''];
  if (!key) return <Navigate to="/simulations" replace />;

  const DemoIcon = SIM_ICONS[key];

  // Sibling simulations for the related-content listing at the page bottom.
  const otherSimulations = (Object.keys(SIM_META) as (keyof typeof SIM_META)[])
    .filter((k) => k !== key)
    .map((k) => ({
      to: SIM_META[k].slug,
      title: t(`simulations.${k}.title`),
      subtitle: t(`simulations.${k}.description`),
      badge: t(`simulations.${k}.tag`),
      icon: React.createElement(SIM_META[k].icon, { className: 'w-16 h-16' }),
    }));

  const features = (t(`simulations.${key}.features`, { returnObjects: true }) as unknown as string[]) ?? [];

  return (
    <div className="min-h-full w-full bg-canvas">
      <SEO
        title={`${t(`simulations.${key}.title`)} | ${t('simulations.metaTitle')}`}
        description={t(`simulations.${key}.description`)}
      />
      <SimulationProvider>
        <div className="w-full px-3 pb-20 pt-24 md:px-4 md:pb-24 md:pt-28 lg:px-6 lg:pt-32">
          <PageHeader
            kicker={t('simulations.eyebrow', 'QYVORA · Simulations')}
            title={`${t(`simulations.${key}.title`)} ${t(`simulations.${key}.titleAccent`)}`}
            description={t(`simulations.${key}.description`)}
            metadata={
              <span className="type-meta inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                {t(`simulations.${key}.tag`)}
              </span>
            }
            actions={
              <>
                <Button to="/register">
                  <Zap className="h-4 w-4" /> {t('simulations.startTraining')} <IconArrowRight size={14} />
                </Button>
                <Button to="/simulations" variant="secondary">
                  <ArrowLeft className="h-4 w-4" /> {t('simulations.backToAll')}
                </Button>
              </>
            }
          />

          {/* Demo launcher — the live tool opens in a modal */}
          <section className="w-full py-10 md:py-14">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col gap-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 md:h-14 md:w-14">
                  <DemoIcon className="h-6 w-6 text-accent md:h-7 md:w-7" />
                </span>
                <div>
                  <span className="type-meta mb-2 block font-black uppercase tracking-[0.3em] text-accent">
                    {t(`simulations.${key}.tag`)}
                  </span>
                  <SimpleHeading
                    text={t(`simulations.${key}.demoTitle`)}
                    align="left"
                  />
                </div>
                <p className="max-w-xl font-mono text-base leading-relaxed text-text-secondary sm:text-lg">
                  {t(`simulations.${key}.demoDescription`)}
                </p>
                <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Button onClick={() => setDemoOpen(true)}>
                    <Play className="h-4 w-4" /> {t('simulations.runDemo')} <IconArrowRight size={14} />
                  </Button>
                  <span className="max-w-[220px] font-mono text-xs leading-snug text-text-muted">
                    {t('simulations.statsNoAccount')} · live in your browser
                  </span>
                </div>
              </div>

              <CodeBlock
                code={DEMO_FILES[0].content}
                lang="text"
                filename={DEMO_FILES[0].name}
                maxHeight="max-h-[50vh]"
              />
            </div>
          </section>

          <section className="w-full py-10 md:py-14">
            <div className="flex flex-col gap-6 lg:gap-8">
              <SimpleHeading
                text={t(`simulations.${key}.demoTitle`)}
                accentText={t('simulations.heroAccent')}
                align="left"
              />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-3">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="card-accent flex items-center gap-3 bg-bg-card px-4 py-4"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/10">
                      <Zap className="h-3 w-3 text-accent" />
                    </span>
                    <span className="font-mono text-xs leading-snug text-text-secondary md:text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                to="/register"
                className="inline-flex w-fit items-center gap-2 text-xs font-black uppercase tracking-widest text-accent hover:underline"
              >
                {t('simulations.startTraining')} <IconArrowRight size={14} />
              </Link>
            </div>
          </section>

          <RelatedContentSection items={otherSimulations} />
        </div>

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