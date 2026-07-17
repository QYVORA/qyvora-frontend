import { useState, useCallback, useMemo } from 'react';
import { Wifi, ArrowLeft, CheckCircle, AlertTriangle, Terminal } from 'lucide-react';
import { WalkthroughLayout, WalkthroughStep } from '@/shared/components/walkthrough/';
import { LabConnectButton } from '@/features/student/components/lab/LabConnectButton';
import { WIRELESS_CHALLENGES } from '@/features/student/data/simulations/wireless-data';
import { createWirelessSimulations } from '@/features/student/components/simulations/labSimulationContent';
import SEO from '@/shared/components/SEO';
import ScenarioCard from '@/shared/components/ScenarioCard';
import { verifyLabFlag } from '../../../services/lab.service';
import { getRelatedContentForLab } from '@/shared/constants/topicMap';
import RelatedContent from '@/shared/components/RelatedContent';


const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-400/10 text-green-400 border-green-400/20',
  intermediate: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  advanced: 'bg-red-400/10 text-red-400 border-red-400/20',
};

const WirelessLab = () => {
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [flagInput, setFlagInput] = useState('');
  const [flagStatus, setFlagStatus] = useState('idle');
  const [flagLoading, setFlagLoading] = useState(false);

  const startChallenge = useCallback((challenge) => {
    setActiveChallenge(challenge);
    setCompletedSteps(new Set());
    setFlagInput('');
    setFlagStatus('idle');
    setFlagLoading(false);
  }, []);

  const exitChallenge = useCallback(() => {
    setActiveChallenge(null);
    setCompletedSteps(new Set());
    setFlagInput('');
    setFlagStatus('idle');
    setFlagLoading(false);
  }, []);

  const handleStepComplete = useCallback((index) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  const handleSubmitFlag = useCallback(async () => {
    if (!activeChallenge || !flagInput.trim() || flagLoading) return;
    setFlagLoading(true);
    try {
      const result = await verifyLabFlag('wireless', activeChallenge.id, flagInput.trim());
      setFlagStatus(result.correct ? 'correct' : 'incorrect');
    } catch {
      setFlagStatus('incorrect');
    } finally {
      setFlagLoading(false);
    }
  }, [activeChallenge, flagInput, flagLoading]);

  const handleFlagSubmit = useCallback(async (_stepId: string, flag: string) => {
    if (!activeChallenge) return { correct: false };
    try {
      return await verifyLabFlag('wireless', activeChallenge.id, flag);
    } catch {
      return { correct: false };
    }
  }, [activeChallenge]);

  const allStepsCompleted = activeChallenge && completedSteps.size >= activeChallenge.steps.length;

  const simulations = useMemo(
    () => activeChallenge ? createWirelessSimulations(activeChallenge.accessPoints) : [],
    [activeChallenge],
  );

  if (!activeChallenge) {
    return (
      <div className="bg-bg min-h-full">
        <SEO title="Wireless Security Lab" description="Practice WiFi scanning and wireless security." />
        <div className=" px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <Wifi className="w-7 h-7 text-accent" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tight">
                Wireless <span className="text-accent">Security</span>
              </h1>
            </div>
            <p className="text-base text-text-muted font-mono max-w-2xl">
              Scan, analyze, and secure wireless networks in simulated environments.
            </p>
          </div>
          <div className="border-t border-border/30 mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {WIRELESS_CHALLENGES.map((challenge, index) => (
              <ScenarioCard
                key={challenge.id}
                title={challenge.title}
                difficulty={challenge.difficulty}
                description={challenge.description}
                cpReward={challenge.cpReward}
                onStart={() => startChallenge(challenge)}
              />
            ))}
          </div>

          <div className="mt-10"><RelatedContent {...getRelatedContentForLab('wireless')} title="Continue This Topic" /></div>
        </div>
      </div>
    );
  }

  const apSummary = activeChallenge.accessPoints.map(ap => {
    const isTarget = ap.bssid === activeChallenge.targetBssid;
    return `${isTarget ? '> ' : '  '}${ap.ssid.padEnd(20)} ${ap.bssid}  CH ${ap.channel}  ${ap.signal} dBm  ${ap.encryption}`;
  }).join('\n');

  return (
    <div className="bg-bg min-h-full">
      <SEO title={`${activeChallenge.title} — Wireless Lab`} description={activeChallenge.description} />
      <WalkthroughLayout
        title={activeChallenge.title}
        subtitle={activeChallenge.description}
        icon={<Wifi className="w-6 h-6" />}
        difficulty={activeChallenge.difficulty}
        labId="wireless"
        scenarioId={activeChallenge.id}
        onBack={exitChallenge}
        completedCount={completedSteps.size}
        totalSteps={activeChallenge.steps.length}
        simulations={simulations}
      >
        <div className="rounded-2xl border border-border/30 bg-bg-card p-4 mb-2">
          <p className="text-xs font-black uppercase tracking-widest text-accent mb-2">Access Points ({activeChallenge.accessPoints.length} found)</p>
          <pre className="text-sm font-mono text-text-muted whitespace-pre-wrap">{apSummary}</pre>
          <p className="text-sm text-text-muted font-mono mt-2">Use: <code className="px-1 py-0.5 bg-white/5 rounded text-accent">sudo airodump-ng wlan0</code> to scan for APs.</p>
        </div>

        {activeChallenge.steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const isNextStep = index === 0 ? !completedSteps.has(0) : completedSteps.has(index - 1);
          const isLocked = false;
          const isActive = isNextStep && !isCompleted;

          const emojis = ['📶', '🔍', '📡', '🔓', '💀', '🏆'];
          const emoji = emojis[index % emojis.length];

          const narrative = `${emoji} Wireless Attack — Step ${index + 1}\n\n${step.explanation}\n\nAttack Chain:\n  ┌──────────┐     ┌──────────┐     ┌──────────┐\n  │  Scan    │────▶│  Target  │────▶│  Crack   │\n  │  Networks│     │  AP      │     │  Handshake│\n  └──────────┘     └──────────┘     └──────────┘\n       │                │                │\n       └── Monitor ─────┘                │\n              │                          │\n              └──── Capture ◀────────────┘\n\nExecute the command below to proceed.`;

          return (
            <WalkthroughStep
              key={index}
              stepIndex={index}
              title={`Step ${index + 1}`}
              narrative={narrative}
              commandInstruction={step.command}
              isLocked={isLocked}
              isCompleted={isCompleted}
              isActive={isActive}
              flagId={`${activeChallenge.id}-step-${index}`}
              labId="wireless"
              onFlagSubmit={handleFlagSubmit}
              onComplete={() => handleStepComplete(index)}
            />
          );
        })}

        {flagStatus === 'correct' && (
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-lg font-black text-accent">Wireless Attack Complete!</p>
              <p className="text-sm font-mono text-text-muted mt-1">+{activeChallenge.cpReward} CP earned.</p>
              <button onClick={exitChallenge} className="btn-secondary !rounded-xl !text-[10px] mt-3 px-5 py-2">Back to Challenges</button>
            </div>
          </div>
        )}
      </WalkthroughLayout>
    </div>
  );
};

export default WirelessLab;
