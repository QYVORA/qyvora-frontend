import React from 'react';
import { Lock } from 'lucide-react';
import { Dialog, DialogContent } from '../../../shared/components/ui/Dialog';

interface QuizGateModalProps {
  onClose: () => void;
  onTakeQuiz: () => void;
}

const QuizGateModal: React.FC<QuizGateModalProps> = ({ onClose, onTakeQuiz }) => (
  <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent title="Quiz Required" maxWidth="max-w-sm">
      <div className="text-center py-2">
      <div className="mb-4 flex justify-center">
        <Lock className="h-10 w-10 text-accent" />
      </div>
      <h2 className="mb-2 text-lg font-black text-text-primary">Not so fast, operator.</h2>
      <p className="mb-6 text-sm text-text-muted leading-relaxed">
        You need to complete this room's quiz before moving on. No skipping — the mission requires it.
      </p>
      <div className="flex flex-col gap-3">
        <button onClick={onTakeQuiz} className="btn-primary text-sm py-3">
          Take the Quiz
        </button>
        <button onClick={onClose} className="btn-secondary text-sm py-3">
          Stay Here
        </button>
      </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default QuizGateModal;
