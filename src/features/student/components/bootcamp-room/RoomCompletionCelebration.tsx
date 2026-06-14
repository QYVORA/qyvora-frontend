import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Zap } from 'lucide-react';
import CpLogo from '../../../../shared/components/CpLogo';
import { useScrollLock } from '../../../../core/hooks/useScrollLock';

interface Props {
  show: boolean;
  roomTitle: string;
  cpEarned: number;
  onClose: () => void;
}

const RoomCompletionCelebration: React.FC<Props> = ({ show, roomTitle, cpEarned, onClose }) => {
  useScrollLock(show);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Main celebration card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-10 w-full max-w-md mx-4"
          >
            <div className="relative overflow-hidden rounded-3xl border-2 border-accent bg-bg-card p-8 text-center">
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
                  <CheckCircle2 className="h-8 w-8 text-bg" />
                </div>

                {/* Title */}
                <h2 className="mb-2 text-2xl font-black text-accent uppercase tracking-wide">
                  Room Cleared!
                </h2>

                {/* Room title */}
                <p className="mb-6 text-lg font-bold text-text-primary">
                  {roomTitle}
                </p>

                {/* CP Reward */}
                <div className="mb-8 inline-flex items-center gap-3 rounded-2xl border-2 border-accent/30 bg-accent-dim px-6 py-4">
                  <Zap className="h-6 w-6 text-accent" />
                  <span className="font-mono text-2xl font-black text-accent">+{cpEarned}</span>
                  <CpLogo className="h-6 w-6" />
                </div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="w-full btn-primary py-3 text-sm font-black uppercase"
                >
                  Continue
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoomCompletionCelebration;
