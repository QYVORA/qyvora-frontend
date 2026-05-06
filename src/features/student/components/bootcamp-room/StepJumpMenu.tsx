import { motion } from 'motion/react';
import { CheckCircle2, List, X } from 'lucide-react';
import type { BootcampStep } from '../../constants/bootcampConfig';

interface Props {
  steps: BootcampStep[];
  currentStepIdx: number;
  viewedSteps: Set<number>;
  onJump: (idx: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

const StepJumpMenu: React.FC<Props> = ({ steps, currentStepIdx, viewedSteps, onJump, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: -10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-bg-card shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-bg-card">
          <div className="flex items-center gap-2">
            <List className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Jump to Step</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-3 max-h-96 overflow-y-auto">
          <div className="space-y-1">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => { onJump(idx); onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
                  idx === currentStepIdx
                    ? 'bg-accent-dim text-accent font-bold border border-accent/30'
                    : 'hover:bg-accent-dim/30 text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className={`font-mono text-xs shrink-0 ${idx === currentStepIdx ? 'opacity-100' : 'opacity-50'}`}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="truncate flex-1">{step.title}</span>
                {viewedSteps.has(idx) && <CheckCircle2 className="h-3.5 w-3.5 ml-auto text-accent shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StepJumpMenu;
