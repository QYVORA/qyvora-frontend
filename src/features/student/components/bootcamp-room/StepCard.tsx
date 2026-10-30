import { useMemo } from 'react';
import type { BootcampStep } from '../../constants/bootcampConfig';
import StepRenderer from '@/shared/components/learning/StepRenderer';
import { LearningContentRenderer, parseMarkdownToBlocks } from '@/shared/learning';
import type { LearningBlock } from '@/shared/learning';

interface Props {
  step: BootcampStep;
  stepNum: number;
  phaseId: string;
  roomId: string;
  isActive: boolean;
  isViewed: boolean;
}

const StepCard: React.FC<Props> = ({
  step,
  stepNum,
  phaseId,
  roomId,
  isActive,
  isViewed,
}) => {
  const blocks = useMemo<LearningBlock[]>(() => {
    const baseId = `bootcamp-${phaseId}-${roomId}-${stepNum}`;
    const parts = parseMarkdownToBlocks(step.instruction ?? '', baseId, { continuous: true });
    if (step.quiz && step.quiz.length > 0) {
      parts.push({
        type: 'checkpoint',
        id: `${baseId}-quiz`,
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
      statusLabel={isActive ? 'Current Focus' : undefined}
    >
      <LearningContentRenderer
        unit={{
          id: `${phaseId}-${roomId}-step-${stepNum}`,
          number: stepNum,
          title: step.title,
          blocks,
          completionType: 'view',
        }}
        context={{
          surface: 'bootcamp',
          sequenceId: `${phaseId}-${roomId}`,
          unitId: `${phaseId}-${roomId}-step-${stepNum}`,
        }}
      />
    </StepRenderer>
  );
};

export default StepCard;
