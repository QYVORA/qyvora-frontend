import { useState, useCallback } from 'react';
import { Wifi, ArrowLeft, CheckCircle, AlertTriangle, Terminal } from 'lucide-react';
import { LabConnectButton } from '@/features/student/components/lab/LabConnectButton';
import { WIRELESS_CHALLENGES } from '@/features/student/data/simulations/wireless-data';
import SEO from '@/shared/components/SEO';
import ScenarioCard from '@/shared/components/ScenarioCard';
import { SCENARIO_DIAGRAMS } from '@/shared/components/ScenarioDiagrams';
import { verifyLabFlag } from '../../../services/lab.service';

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

  const allStepsCompleted = activeChallenge && completedSteps.size >= activeChallenge.steps.length;

  if (!activeChallenge) {
    return (
      <div className="bg-bg min-h-full">
        <SEO title="Wireless Security Lab" description="Practice WiFi scanning and wireless security." />
        <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24">
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
                index={index}
                title={challenge.title}
                difficulty={challenge.difficulty}
                description={challenge.description}
                cpReward={challenge.cpReward}
                accentColor="#F59E0B"
                diagramSvg={SCENARIO_DIAGRAMS[challenge.id]}
                onStart={() => startChallenge(challenge)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Build AP summary
  const apSummary = activeChallenge.accessPoints.map(ap => {
    const isTarget = ap.bssid === activeChallenge.targetBssid;
    return `${isTarget ? '> ' : '  '}${ap.ssid.padEnd(20)} ${ap.bssid}  CH ${ap.channel}  ${ap.signal} dBm  ${ap.encryption}`;
  }).join('\n');

  return (
    <div className="bg-bg min-h-full">
      <SEO title={`${activeChallenge.title} — Wireless Lab`} description={activeChallenge.description} />
      <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24">
        <div className="mb-8">
          <button onClick={exitChallenge} className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">All Challenges</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <Wifi className="w-7 h-7 text-accent" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight">{activeChallenge.title}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${DIFFICULTY_STYLES[activeChallenge.difficulty]}`}>{activeChallenge.difficulty}</span>
                <LabConnectButton labId="wireless" scenarioId={activeChallenge.id} />
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-text-muted font-mono leading-relaxed mb-4">{activeChallenge.description}</p>

        <div className="rounded-2xl border border-border/30 bg-bg-card p-4 mb-8">
          <p className="text-xs font-black uppercase tracking-widest text-accent mb-2">Access Points ({activeChallenge.accessPoints.length} found)</p>
          <pre className="text-sm font-mono text-text-muted whitespace-pre-wrap">{apSummary}</pre>
          <p className="text-sm text-text-muted font-mono mt-2">Use: <code className="px-1 py-0.5 bg-white/5 rounded text-accent">sudo airodump-ng wlan0</code> to scan for APs.</p>
        </div>

        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-black text-text-primary uppercase tracking-wider">Walkthrough</h2>
          </div>
          {activeChallenge.steps.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            const isNextStep = index === 0 ? !completedSteps.has(0) : completedSteps.has(index - 1);
            return (
              <div key={index} className={`rounded-2xl border p-6 transition-all ${
                isCompleted ? 'border-accent/30 bg-accent/5' : isNextStep ? 'border-accent/30 bg-bg-card' : 'border-border/20 bg-bg-card opacity-50'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${
                    isCompleted ? 'bg-accent text-white' : isNextStep ? 'bg-accent/20 text-accent' : 'bg-white/5 text-text-muted/30'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-accent">Step {index + 1}</span>
                </div>
                <p className="text-base text-text-secondary font-mono leading-relaxed mb-2">
                  Run: <code className="px-2 py-0.5 bg-white/5 rounded text-accent">{step.command}</code>
                </p>
                {isCompleted && (
                  <>
                    <div className="rounded-xl bg-white/5 p-3 mb-2">
                      <pre className="text-sm font-mono text-text-muted/70 whitespace-pre-wrap">{step.output}</pre>
                    </div>
                    <p className="text-sm text-text-muted font-mono">{step.explanation}</p>
                  </>
                )}
                {isNextStep && !isCompleted && (
                  <button onClick={() => handleStepComplete(index)} className="btn-primary !rounded-xl !text-[10px] px-5 py-2.5 mt-3">
                    Execute Step
                  </button>
                )}
                {isCompleted && <div className="flex items-center gap-1.5 mt-3 text-accent"><CheckCircle className="w-3.5 h-3.5" /><span className="text-[9px] font-black uppercase tracking-widest">Completed</span></div>}
              </div>
            );
          })}
        </div>

        {allStepsCompleted && (
          <>
            <div className="border-t border-border/30 mb-8" />
            <div className="mb-8">
              <h2 className="text-lg font-black text-text-primary uppercase tracking-wider mb-4">Capture the Flag</h2>
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
                <p className="text-sm font-black text-accent mb-2">All steps completed!</p>
                <p className="text-sm text-text-muted font-mono mb-4">Submit the flag to claim your {activeChallenge.cpReward} CP reward.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input type="text" value={flagInput} onChange={(e) => { setFlagInput(e.target.value); setFlagStatus('idle'); }} onKeyDown={(e) => { if (e.key === 'Enter') handleSubmitFlag(); }} placeholder="FLAG{...}" className="flex-1 bg-bg border border-border rounded-xl py-3 px-4 text-text-primary font-mono text-sm focus:border-accent outline-none" />
                  <button onClick={handleSubmitFlag} disabled={!flagInput.trim() || flagLoading} className="btn-primary !rounded-xl !text-[11px] px-8 disabled:opacity-50">
                    {flagLoading ? 'Verifying...' : 'Submit Flag'}
                  </button>
                </div>
                {flagStatus === 'incorrect' && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-red-400 font-mono"><AlertTriangle className="w-4 h-4" />Incorrect flag. Keep investigating.</div>
                )}
              </div>
            </div>
          </>
        )}

        {!allStepsCompleted && (
          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-4 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-sm font-mono text-text-muted">Complete all steps to unlock flag submission.</p>
          </div>
        )}

        {flagStatus === 'correct' && (
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0"><CheckCircle className="w-6 h-6 text-accent" /></div>
            <div>
              <p className="text-lg font-black text-accent">Wireless Attack Complete!</p>
              <p className="text-sm font-mono text-text-muted mt-1">+{activeChallenge.cpReward} CP earned.</p>
              <button onClick={exitChallenge} className="btn-secondary !rounded-xl !text-[10px] mt-3 px-5 py-2">Back to Challenges</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WirelessLab;
