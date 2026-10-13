import { useMemo } from 'react';
import type { BootcampStep } from '../../constants/bootcampConfig';
import StepRenderer from '@/shared/components/learning/StepRenderer';
import { CardDeckSurface, chunkMarkdown } from '@/shared/learning';
import type { LearningBlock } from '@/shared/learning';

interface Props {
  step: BootcampStep;
  stepNum: number;
  phaseId: string;
  roomId: string;
  isActive: boolean;
  isViewed: boolean;
  onDeckComplete?: () => void;
  continueLabel?: string;
}

const StepCard: React.FC<Props> = ({
  step,
  stepNum,
  phaseId,
  roomId,
  isActive,
  isViewed,
  onDeckComplete,
  continueLabel,
}) => {
  const blocks = useMemo<LearningBlock[]>(() => {
    const deckIdBase = `bootcamp-${phaseId}-${roomId}-${stepNum}`;
    const parts: LearningBlock[] = chunkMarkdown(step.instruction ?? '', deckIdBase);
    if (step.quiz && step.quiz.length > 0) {
      parts.push({
        type: 'checkpoint',
        id: `${deckIdBase}-quiz`,
        checkpointType: 'quiz',
        title: 'Check your understanding',
        quiz: { questions: step.quiz },
      });
    }
    return parts;
  }, [step, phaseId, roomId, stepNum]);

  return (
    <StepRenderer
      stepNumber={stepNum}
      title={step.title}
      isActive={isActive}
      isCompleted={isViewed && !isActive}
      statusLabel={isActive ? "Current Focus" : undefined}
    >
      <CardDeckSurface
        deckId={`bootcamp-${phaseId}-${roomId}-${stepNum}`}
        surface="bootcamp"
        sequenceId={`${phaseId}-${roomId}`}
        unitId={step.title}
        blocks={blocks}
        enabled={isActive}
        onDeckComplete={onDeckComplete}
        continueLabel={continueLabel}
      />
    </StepRenderer>
  );
};

export default StepCard;