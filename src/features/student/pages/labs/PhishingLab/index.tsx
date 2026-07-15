import { useState, useCallback, useMemo } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertTriangle, Terminal, Shield } from 'lucide-react';
import { WalkthroughLayout, WalkthroughStep } from '@/shared/components/walkthrough/';
import { LabConnectButton } from '@/features/student/components/lab/LabConnectButton';
import { PHISHING_CHALLENGES } from '@/features/student/data/simulations/phishing-data';
import { createPhishingSimulations } from '@/features/student/components/simulations/labSimulationContent';
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

const PhishingLab = () => {
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
      const result = await verifyLabFlag('phishing', activeChallenge.id, flagInput.trim());
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
      return await verifyLabFlag('phishing', activeChallenge.id, flag);
    } catch {
      return { correct: false };
    }
  }, [activeChallenge]);

  const allStepsCompleted = activeChallenge && completedSteps.size >= 3;

  if (!activeChallenge) {
    return (
      <div className="bg-bg min-h-full">
        <SEO title="Phishing Analysis Lab" description="Analyze simulated phishing emails for signs of deception." />
        <div className=" px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <Shield className="w-7 h-7 text-accent" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tight">
                Phishing &amp; Social <span className="text-accent">Engineering</span>
              </h1>
            </div>
            <p className="text-base text-text-muted font-mono max-w-2xl">
              Analyze simulated phishing emails for signs of deception and social engineering.
            </p>
          </div>
          <div className="border-t border-border/30 mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {PHISHING_CHALLENGES.map((challenge, index) => (
              <ScenarioCard
                key={challenge.id}
                index={index}
                title={challenge.title}
                difficulty={challenge.difficulty}
                description={challenge.description}
                cpReward={challenge.cpReward}
                accentColor="#8B5CF6"
                onStart={() => startChallenge(challenge)}
              />
            ))}
          </div>

          <div className="mt-10"><RelatedContent {...getRelatedContentForLab('phishing')} title="Continue This Topic" /></div>
        </div>
      </div>
    );
  }

  const steps = [
    {
      title: 'Review Email Details',
      narrative: `📧 Analyze the email envelope.\n\nExamine the sender address, subject line, and email body for red flags. Phishing emails often impersonate trusted brands.\n\n  ┌──────────┐     ┌──────────┐     ┌──────────┐\n  │  Sender  │────▶│  Header  │────▶│  Body    │\n  │  Address │     │  Analysis│     │  Content │\n  └──────────┘     └──────────┘     └──────────┘\n       │                │                │\n       └── Spoofed? ───┘                │\n              │                          │\n              └──── Red Flags ◀──────────┘\n\nFrom: ${activeChallenge.emails[0]?.fromName} <${activeChallenge.emails[0]?.from}>\nSubject: ${activeChallenge.emails[0]?.subject}`,
      commandInstruction: undefined,
    },
    {
      title: 'Inspect Email Headers',
      narrative: `🔍 Deep-dive into email headers.\n\nCheck the Received paths, SPF/DKIM/DMARC authentication results, and Reply-To header to identify spoofing attempts. Headers reveal the true origin of the email.\n\n  Received: from spoofed-server.com\n    by legitimate-server.com\n    SPF: FAIL  DKIM: none  DMARC: FAIL\n\nA failed SPF/DKIM is a strong indicator of spoofing.`,
      commandInstruction: `curl -I <smtp-server>`,
    },
    {
      title: 'Analyze Links & Attachments',
      narrative: `🎣 Verify all URLs and attachments.\n\nThe email has ${activeChallenge.emails[0]?.links?.length || 0} links. Verify actual vs display URLs. Look for mismatched domains, typosquatting, and malicious attachments.\n\n  Display URL:  https://legitimate-site.com/login\n  Actual URL:   https://legitimate-s1te.com/phish\n                         ^^^^^\n                    Typosquatting detected!\n\nAlways hover over links before clicking.`,
      commandInstruction: undefined,
    },
  ];

  const simulations = useMemo(
    () => activeChallenge ? createPhishingSimulations(activeChallenge.emails) : [],
    [activeChallenge],
  );

  return (
    <div className="bg-bg min-h-full">
      <SEO title={`${activeChallenge.title} — Phishing Lab`} description={activeChallenge.description} />
      <WalkthroughLayout
        title={activeChallenge.title}
        subtitle={activeChallenge.description}
        icon={<Shield className="w-6 h-6" />}
        difficulty={activeChallenge.difficulty}
        labId="phishing"
        scenarioId={activeChallenge.id}
        onBack={exitChallenge}
        completedCount={completedSteps.size}
        totalSteps={3}
        simulations={simulations}
      >
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const isNextStep = index === 0 ? !completedSteps.has(0) : completedSteps.has(index - 1);
          const isLocked = !isNextStep && !isCompleted;
          const isActive = isNextStep && !isCompleted;

          return (
            <WalkthroughStep
              key={index}
              stepIndex={index}
              title={step.title}
              narrative={step.narrative}
              commandInstruction={step.commandInstruction}
              isLocked={isLocked}
              isCompleted={isCompleted}
              isActive={isActive}
              flagId={`${activeChallenge.id}-step-${index}`}
              labId="phishing"
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
              <p className="text-lg font-black text-accent">Flag Captured!</p>
              <p className="text-sm font-mono text-text-muted mt-1">+{activeChallenge.cpReward} CP earned.</p>
              <button onClick={exitChallenge} className="btn-secondary !rounded-xl !text-[10px] mt-3 px-5 py-2">Back to Challenges</button>
            </div>
          </div>
        )}
      </WalkthroughLayout>
    </div>
  );
};

export default PhishingLab;
