import type { BootcampStep } from '../../constants/bootcampConfig';
import { buildStepImagePath } from '../../constants/bootcampConfig';
import { EducationalMarkdownRenderer } from '@/shared/components/courses/CodeBlockRenderer';
import StepImage from './StepImage';
import StepRenderer from '@/shared/components/learning/StepRenderer';

interface Props {
  step: BootcampStep;
  stepNum: number;
  phaseId: string;
  roomId: string;
  isActive: boolean;
  isViewed: boolean;
}

const StepCard: React.FC<Props> = ({ step, stepNum, phaseId, roomId, isActive, isViewed }) => {
  return (
    <StepRenderer
      stepNumber={stepNum}
      title={step.title}
      isActive={isActive}
      isCompleted={isViewed && !isActive}
      statusLabel={isActive ? "Current Focus" : undefined}
      notesStorageKey={`step_notes_${phaseId}_${roomId}_${stepNum}`}
    >
      <div className={`w-full text-sm md:text-base font-mono leading-[2] md:leading-[2.2] overflow-x-auto transition-colors ${isActive ? 'text-text-primary' : 'text-text-secondary'} mb-6 md:mb-8`}>
        <EducationalMarkdownRenderer text={step.instruction} />
      </div>

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