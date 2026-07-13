import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Wifi } from 'lucide-react';
import { IconTerminal, IconClock, IconShield, IconX } from '@/shared/components/icons';

interface LabConnectionGuideProps {
  labId: string;
}

const GUIDE_STEPS = [
  {
    icon: IconTerminal,
    title: 'Open the Terminal',
    description: 'Click the "Connect" button in the walkthrough header. This spins up a fresh lab machine and gives you a terminal connected to it.',
  },
  {
    icon: Wifi,
    title: 'Wait for Connection',
    description: 'The first connection takes 5-15 seconds. You\'ll see a green "Connected" badge with the target IP address when it\'s ready.',
  },
  {
    icon: IconTerminal,
    title: 'Run Commands',
    description: 'Use the terminal below to run commands on the target machine. Type commands and press Enter just like a real terminal.',
  },
  {
    icon: IconClock,
    title: 'Session Timeout',
    description: 'Lab machines auto-expire after a set time. If you see "Disconnected", just reconnect — your progress is saved.',
  },
  {
    icon: IconShield,
    title: 'Hints & Flags',
    description: 'Each step has a "Show Hint" button if you get stuck. Complete all steps and submit the flag to earn CP.',
  },
];

export function LabConnectionGuide({ labId }: LabConnectionGuideProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-accent transition-colors"
      >
        <HelpCircle className="w-3.5 h-3.5" />
        How to Connect & Use This Lab
        {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {isOpen && (
        <div className="mt-3 rounded-2xl border border-border/30 bg-bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-text-primary">Lab Connection Guide</h3>
            <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-text-primary">
              <IconX size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {GUIDE_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-text-primary mb-0.5">{step.title}</p>
                    <p className="text-xs text-text-muted font-mono leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-accent/5 border border-accent/20">
            <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">Tip</p>
            <p className="text-xs text-text-muted font-mono">
              Start with the easier scenarios (beginner) and work your way up. Each scenario builds on skills from the previous one.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LabConnectionGuide;
