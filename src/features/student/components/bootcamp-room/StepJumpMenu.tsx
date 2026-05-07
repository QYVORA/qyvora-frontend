import { CheckCircle2, List } from 'lucide-react';
import type { BootcampStep } from '../../constants/bootcampConfig';
import { Dialog, DialogContent } from '../../../../shared/components/ui/Dialog';

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
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent title="Jump to Step" maxWidth="max-w-md">
        <div className="flex items-center gap-2 mb-3">
          <List className="h-4 w-4 text-accent" />
          <p className="text-xs font-black uppercase tracking-widest text-text-primary">Select a step</p>
        </div>
        <div className="max-h-96 overflow-y-auto">
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
      </DialogContent>
    </Dialog>
  );
};

export default StepJumpMenu;
