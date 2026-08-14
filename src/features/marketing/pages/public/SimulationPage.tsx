import { Navigate, Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, ArrowLeft } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
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

const DemoChrome: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-2xl border border-border/30 overflow-hidden h-[65vh] md:h-[70vh] flex flex-col">
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/20 bg-bg shrink-0">
      <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
      <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
      <span className="ml-2 text-[9px] font-mono text-text-muted">{title}</span>
    </div>
    <div className="flex-1 min-h-0 bg-[#0c0c0c]">{children}</div>
  </div>
);

const SimulationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();

  const key = SLUG_KEYS[slug ?? ''];
  if (!key) return <Navigate to="/simulations" replace />;

  const demo =
    key === 'terminal' ? (
      <TerminalWrapper open onOpenChange={() => {}} context={{ type: 'dashboard' }} mode="raw" />
    ) : key === 'ide' ? (
      <Ide
        open={true}
        onOpenChange={() => {}}
        title="Code Playground"
        standalone
        terminalContext={{ type: 'dashboard' }}
        files={DEMO_FILES}
      />
    ) : (
      <NetworkBuilder open={true} onOpenChange={() => {}} standalone />
    );

  return (
    <div className="bg-bg min-h-full">
      <SEO
        title={`${t(`simulations.${key}.title`)} — ${t('simulations.metaTitle')}`}
        description={t(`simulations.${key}.description`)}
      />
      <SimulationProvider>
        <PublicSnapLayout>
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

          <PublicSnapSection>
            <div className="flex flex-col gap-6 lg:gap-8">
              <div>
                <h2 className="text-lg md:text-2xl lg:text-3xl font-black text-text-primary tracking-tighter leading-tight">
                  {t(`simulations.${key}.demoTitle`)}
                </h2>
                <p className="text-xs md:text-sm text-text-muted leading-relaxed mt-2 font-mono max-w-xl">
                  {t(`simulations.${key}.demoDescription`)}
                </p>
              </div>

              <DemoChrome title={t(`simulations.${key}.demoTitle`)}>{demo}</DemoChrome>
            </div>
          </PublicSnapSection>

          <PublicSnapSection>
            <div className="flex flex-col gap-6 lg:gap-8">
              <h2 className="text-lg md:text-2xl lg:text-3xl font-black text-text-primary tracking-tighter leading-tight">
                {t(`simulations.${key}.demoTitle`)}{' '}
                <span className="text-accent">{t('simulations.heroAccent')}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                {(t(`simulations.${key}.features`, { returnObjects: true }) as unknown as string[]).map((feature, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-border/20 bg-bg-card px-4 py-4 flex items-center gap-3"
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

          <LandingFinalCtaSection user={user} />
          <Footer />
        </PublicSnapLayout>
      </SimulationProvider>
    </div>
  );
};

export default SimulationPage;
