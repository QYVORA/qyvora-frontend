import { useMemo } from 'react';
import type { BootcampStep } from '../../constants/bootcampConfig';
import { buildStepImagePath } from '../../constants/bootcampConfig';
import StepImage from './StepImage';
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
}

const StepCard: React.FC<Props> = ({ step, stepNum, phaseId, roomId, isActive, isViewed }) => {
  const blocks = useMemo<LearningBlock[]>(() => {
    const deckIdBase = `bootcamp-${phaseId}-${roomId}-${stepNum}`;
    const parts: LearningBlock[] = chunkMarkdown(step.instruction ?? '', deckIdBase, 12);
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
      />

      {step.image ? (
        <StepImage
          src={buildStepImagePath(phaseId, roomId, step.image)}
          alt={`${step.title}: ${step.instruction}`}
          stepNum={stepNum}
        />
      ) : null}
    </StepRenderer>
  );
};

export default StepCard;