import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconLock } from '@/shared/components/icons';
import { Dialog, DialogContent } from '../../../../shared/components/ui/Dialog';

interface QuizGateModalProps {
  onClose: () => void;
  onTakeQuiz: () => void;
}

const QuizGateModal: React.FC<QuizGateModalProps> = ({ onClose, onTakeQuiz }) => {
  const { t } = useTranslation();
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent title={t('student.bootcampRoom.quizGate.title')} maxWidth="max-w-lg" className="shadow-none">
        <div className="text-center py-2">
        <div className="mb-4 flex justify-center">
          <IconLock size={40} className="text-accent" />
        </div>
        <h2 className="mb-2 text-lg font-black text-text-primary">{t('student.bootcampRoom.quizGate.heading')}</h2>
        <p className="mb-6 text-sm text-text-muted leading-relaxed">
          {t('student.bootcampRoom.quizGate.description')}
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={onTakeQuiz} className="btn-primary text-sm py-3">
            {t('student.bootcampRoom.quizGate.takeQuiz')}
          </button>
          <button onClick={onClose} className="btn-secondary text-sm py-3">
            {t('student.bootcampRoom.quizGate.stayHere')}
          </button>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizGateModal;
