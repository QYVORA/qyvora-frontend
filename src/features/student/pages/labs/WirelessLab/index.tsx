import { useState, useCallback, useMemo } from 'react';
import {
  Wifi, Terminal, ArrowLeft, CheckCircle,
  Signal, Radio, Lock, Shield, Play,
} from 'lucide-react';
import { WIRELESS_CHALLENGES } from '@/features/student/data/simulations/wireless-data';
import SEO from '@/shared/components/SEO';
import { verifyLabFlag } from '../../../services/lab.service';

interface WirelessChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  accessPoints: WirelessAccessPoint[];
  targetBssid: string;
  steps: WirelessStep[];
  cpReward: number;
}

interface WirelessAccessPoint {
  bssid: string;
  ssid: string;
  channel: number;
  signal: number;
  encryption: string;
  cipher: string;
  authentication: string;
  clients?: WirelessClient[];
}

interface WirelessClient {
  mac: string;
  probes: string[];
  connectedTo: string;
}

interface WirelessStep {
  command: string;
  output: string;
  explanation: string;
}

const DIFFICULTY_STYLES: Record<string, { bg: string; text: string }> = {
  beginner: { bg: 'bg-accent/10', text: 'text-accent' },
  intermediate: { bg: 'bg-yellow-400/10', text: 'text-yellow-400' },
  advanced: { bg: 'bg-red-400/10', text: 'text-red-400' },
};

const ENCRYPTION_COLORS: Record<string, string> = {
  WPA2: 'text-accent',
  WPA3: 'text-green-400',
  WEP: 'text-red-400',
  Open: 'text-yellow-400',
};

function getSignalStrengthPercent(signal: number): number {
  if (signal >= -30) return 100;
  if (signal <= -90) return 0;
  return Math.round(2 * (signal + 90));
}

function getSignalBarColor(signal: number): string {
  if (signal >= -40) return 'bg-accent';
  if (signal >= -60) return 'bg-yellow-400';
  if (signal >= -70) return 'bg-orange-400';
  return 'bg-red-400';
}

const ChallengeCard = ({ challenge, onClick }: { challenge: WirelessChallenge; onClick: () => void }) => {
  const difficulty = DIFFICULTY_STYLES[challenge.difficulty];

  return (
    <button
      onClick={onClick}
      className="group flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card p-5 hover:border-accent/30 transition-all duration-300 text-left w-full"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
          <Wifi className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-sm font-black text-text-primary group-hover:text-accent transition-colors leading-snug">
          {challenge.title}
        </h3>
      </div>

      <p className="text-xs text-text-muted/70 font-mono leading-relaxed mb-4 flex-1 line-clamp-2">
        {challenge.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${difficulty.bg} ${difficulty.text}`}>
          {challenge.difficulty}
        </span>
        <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-blue-400/10 text-blue-400">
          {challenge.accessPoints.length} APs
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/20">
        <span className="text-[10px] font-black uppercase tracking-widest text-accent">
          {challenge.cpReward} CP
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-accent transition-colors">
          Start Lab
        </span>
      </div>
    </button>
  );
};

const AccessPointTable = ({
  accessPoints,
  targetBssid,
}: {
  accessPoints: WirelessAccessPoint[];
  targetBssid: string;
}) => (
  <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
    <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20">
      <Radio className="w-4 h-4 text-accent" />
      <span className="text-[9px] font-black uppercase tracking-widest text-accent">
        Access Points
      </span>
      <span className="text-[9px] font-mono text-text-muted/50 ml-auto">
        {accessPoints.length} found
      </span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border/20 bg-bg-elevated/50">
            {['SSID', 'BSSID', 'CH', 'Signal', 'Enc', 'Cipher', 'Auth'].map((col) => (
              <th key={col} className="px-3 py-2 text-[8px] font-black uppercase tracking-widest text-text-muted whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {accessPoints.map((ap) => {
            const isTarget = ap.bssid === targetBssid;
            const signalPct = getSignalStrengthPercent(ap.signal);
            const barColor = getSignalBarColor(ap.signal);

            return (
              <tr
                key={ap.bssid}
                className={`border-b border-border/10 transition-colors ${
                  isTarget
                    ? 'bg-accent/5 hover:bg-accent/10'
                    : 'hover:bg-white/5'
                }`}
              >
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
                    {isTarget && <TargetIcon />}
                    <span className={`text-[10px] font-mono font-bold whitespace-nowrap ${isTarget ? 'text-accent' : 'text-text-primary'}`}>
                      {ap.ssid}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-[10px] font-mono text-text-muted/70 whitespace-nowrap">
                  {ap.bssid}
                </td>
                <td className="px-3 py-2.5 text-[10px] font-mono text-text-muted/60 text-center">
                  {ap.channel}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-text-muted/60 whitespace-nowrap">
                      {ap.signal} dBm
                    </span>
                    <div className="w-16 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${barColor}`}
                        style={{ width: `${signalPct}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className={`px-3 py-2.5 text-[10px] font-mono font-bold whitespace-nowrap ${ENCRYPTION_COLORS[ap.encryption] || 'text-text-muted'}`}>
                  {ap.encryption}
                </td>
                <td className="px-3 py-2.5 text-[10px] font-mono text-text-muted/60 whitespace-nowrap">
                  {ap.cipher}
                </td>
                <td className="px-3 py-2.5 text-[10px] font-mono text-text-muted/60 whitespace-nowrap">
                  {ap.authentication}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {accessPoints.some((ap) => ap.clients && ap.clients.length > 0) && (
      <div className="px-4 py-3 border-t border-border/20 space-y-3">
        <div className="flex items-center gap-2">
          <Signal className="w-3.5 h-3.5 text-accent/70" />
          <span className="text-[8px] font-black uppercase tracking-widest text-text-muted/50">
            Connected Clients
          </span>
        </div>
        {accessPoints
          .filter((ap) => ap.clients && ap.clients.length > 0)
          .map((ap) =>
            ap.clients!.map((client) => (
              <div
                key={client.mac}
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-bg-elevated/30 border border-border/10"
              >
                <span className="text-[10px] font-mono text-text-primary">{client.mac}</span>
                <span className="text-[9px] font-mono text-text-muted/50">
                  {'\u2192'} {ap.ssid}
                </span>
                {client.probes.length > 0 && (
                  <span className="text-[9px] font-mono text-text-muted/40 ml-auto">
                    probes: {client.probes.join(', ')}
                  </span>
                )}
              </div>
            ))
          )}
      </div>
    )}
  </div>
);

function TargetIcon() {
  return (
    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
  );
}

const StepTerminal = ({
  steps,
  completedSteps,
  currentStep,
  onExecute,
}: {
  steps: WirelessStep[];
  completedSteps: Set<number>;
  currentStep: number;
  onExecute: (index: number) => void;
}) => (
  <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
    <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20">
      <Terminal className="w-4 h-4 text-accent" />
      <span className="text-[9px] font-black uppercase tracking-widest text-accent">
        Terminal Walkthrough
      </span>
      <span className="text-[9px] font-mono text-text-muted/50 ml-auto">
        {completedSteps.size} / {steps.length}
      </span>
    </div>

    <div className="space-y-0">
      {steps.map((step, i) => {
        const isCompleted = completedSteps.has(i);
        const isCurrent = i === currentStep;
        const isLocked = i > currentStep;

        return (
          <div
            key={i}
            className={`border-b border-border/10 last:border-b-0 ${
              isCurrent ? 'bg-accent/5' : ''
            }`}
          >
            <div className="px-4 py-3">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-black ${
                    isCompleted
                      ? 'bg-accent/20 text-accent'
                      : isCurrent
                      ? 'bg-yellow-400/20 text-yellow-400'
                      : 'bg-bg-elevated text-text-muted/30'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-3 h-3" /> : i + 1}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-text-muted/50">
                    Step {i + 1}
                  </span>
                </div>
                {!isCompleted && isCurrent && (
                  <button
                    onClick={() => onExecute(i)}
                    className="btn-primary flex items-center gap-1.5 px-3 py-1.5 !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest transition-colors"
                  >
                    <Play className="w-3 h-3 text-accent" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-accent">
                      Execute
                    </span>
                  </button>
                )}
              </div>

              <div className="bg-[#050706] rounded-xl p-3 mb-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-mono text-accent/50">$</span>
                  <code className="text-[11px] font-mono text-accent leading-relaxed break-all">
                    {step.command}
                  </code>
                </div>
                {isCompleted && (
                  <pre className="text-[10px] font-mono text-text-muted/60 whitespace-pre-wrap leading-relaxed border-t border-border/10 pt-1.5 mt-1.5">
                    {step.output}
                  </pre>
                )}
              </div>

              {isCompleted && (
                <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-bg-elevated/30 border border-border/10">
                  <Shield className="w-3 h-3 text-accent/70 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-mono text-text-muted/70 leading-relaxed">
                    {step.explanation}
                  </p>
                </div>
              )}

              {isLocked && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-elevated/20">
                  <Lock className="w-3 h-3 text-text-muted/30" />
                  <p className="text-[10px] font-mono text-text-muted/30">
                    Complete previous steps to unlock
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const WirelessLab = () => {
  const [activeChallenge, setActiveChallenge] = useState<WirelessChallenge | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [flagInput, setFlagInput] = useState('');
  const [flagStatus, setFlagStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [flagLoading, setFlagLoading] = useState(false);

  const currentStep = useMemo(() => {
    if (!activeChallenge) return 0;
    for (let i = 0; i < activeChallenge.steps.length; i++) {
      if (!completedSteps.has(i)) return i;
    }
    return activeChallenge.steps.length;
  }, [activeChallenge, completedSteps]);

  const allStepsCompleted = activeChallenge && currentStep === activeChallenge.steps.length;

  const handleBack = useCallback(() => {
    setActiveChallenge(null);
    setCompletedSteps(new Set());
    setFlagInput('');
    setFlagStatus('idle');
    setFlagLoading(false);
  }, []);

  const handleStartChallenge = useCallback((challenge: WirelessChallenge) => {
    setActiveChallenge(challenge);
    setCompletedSteps(new Set());
    setFlagInput('');
    setFlagStatus('idle');
    setFlagLoading(false);
  }, []);

  const handleExecuteStep = useCallback((index: number) => {
    setCompletedSteps((prev) => {
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
      if (result.correct) {
        setFlagStatus('correct');
      } else {
        setFlagStatus('incorrect');
      }
    } catch {
      setFlagStatus('incorrect');
    } finally {
      setFlagLoading(false);
    }
  }, [activeChallenge, flagInput, flagLoading]);

  if (!activeChallenge) {
    return (
      <div className="bg-bg min-h-full">
        <SEO title="Wireless Security Lab" description="Practice WiFi scanning and wireless network security exercises." />

        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                <Wifi className="w-6 h-6 text-accent" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight">
                Wireless <span className="text-accent">Security</span>
              </h1>
            </div>
            <p className="text-sm text-text-muted font-mono">
              Scan, analyze, and secure wireless networks in simulated environments
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WIRELESS_CHALLENGES.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onClick={() => handleStartChallenge(challenge)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const difficulty = DIFFICULTY_STYLES[activeChallenge.difficulty];

  return (
    <div className="bg-bg min-h-full">
      <SEO title={`${activeChallenge.title} — Wireless Lab`} description={activeChallenge.description} />

      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-6">
        {/* Back + Header */}
        <div>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors text-sm font-mono mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Challenges</span>
          </button>

          <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Wifi className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-lg font-black text-text-primary">{activeChallenge.title}</h2>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${difficulty.bg} ${difficulty.text}`}>
                  {activeChallenge.difficulty}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-blue-400/10 text-blue-400">
                  {activeChallenge.accessPoints.length} APs
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent">
                  {activeChallenge.cpReward} CP
                </span>
              </div>
            </div>
            <p className="text-xs text-text-muted/70 font-mono leading-relaxed">
              {activeChallenge.description}
            </p>
          </div>
        </div>

        {/* Access Points */}
        <AccessPointTable
          accessPoints={activeChallenge.accessPoints}
          targetBssid={activeChallenge.targetBssid}
        />

        {/* Terminal Walkthrough */}
        <StepTerminal
          steps={activeChallenge.steps}
          completedSteps={completedSteps}
          currentStep={currentStep}
          onExecute={handleExecuteStep}
        />

        {/* Flag Submission */}
        <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-[9px] font-black uppercase tracking-widest text-accent">
              Submit Flag
            </span>
            {!allStepsCompleted && (
              <span className="text-[9px] font-mono text-text-muted/40 ml-2">
                Complete all steps first
              </span>
            )}
          </div>

          {flagStatus === 'correct' ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-400/10 border border-green-400/20">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              <div>
                <p className="text-sm font-black text-green-400">Challenge Complete!</p>
                <p className="text-xs font-mono text-text-muted mt-1">
                  You earned <span className="text-accent font-black">{activeChallenge.cpReward} CP</span> for completing this challenge.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={flagInput}
                  onChange={(e) => { setFlagInput(e.target.value); setFlagStatus('idle'); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSubmitFlag(); }}
                  placeholder="FLAG{...}"
                  disabled={!allStepsCompleted}
                  className={`flex-1 bg-bg border rounded-xl py-3 px-4 text-text-primary focus:outline-none font-mono text-sm disabled:opacity-50 ${
                    flagStatus === 'incorrect'
                      ? 'border-red-400/50'
                      : 'border-border/30 focus:border-accent'
                  }`}
                />
                <button
                  onClick={handleSubmitFlag}
                  disabled={!flagInput.trim() || !allStepsCompleted || flagLoading}
                  className="btn-primary !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest px-6 py-3 disabled:opacity-50"
                >
                  {flagLoading ? 'Verifying...' : 'Submit'}
                </button>
              </div>
              {flagStatus === 'incorrect' && (
                <p className="text-xs text-red-400 mt-2 font-mono">Incorrect flag. Keep investigating.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WirelessLab;
