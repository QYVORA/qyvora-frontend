import { useState, useCallback, useMemo } from 'react';
import { verifyLabFlag } from '@/features/student/services/lab.service';

interface UseLabScenarioOptions<T> {
  labId: string;
  getScenarioId: (scenario: T) => string;
  getStepIds: (scenario: T) => string[];
}

interface UseLabScenarioReturn<T> {
  activeScenario: T | null;
  completedSteps: Set<string>;
  handleComplete: (stepId: string) => void;
  handleFlagSubmit: (stepId: string, flag: string) => Promise<{ correct: boolean }>;
  getStepState: (index: number) => { isLocked: boolean; isCompleted: boolean; isActive: boolean };
  allDone: boolean;
  startScenario: (scenario: T) => void;
  exitScenario: () => void;
}

function useLabScenario<T>({
  labId,
  getScenarioId,
  getStepIds,
}: UseLabScenarioOptions<T>): UseLabScenarioReturn<T> {
  const [activeScenario, setActiveScenario] = useState<T | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const handleComplete = useCallback((stepId: string) => {
    setCompletedSteps((prev) => new Set(prev).add(stepId));
  }, []);

  const handleFlagSubmit = useCallback(
    async (stepId: string, flag: string) => {
      if (!activeScenario) return { correct: false };
      const result = await verifyLabFlag(
        labId,
        getScenarioId(activeScenario),
        flag
      );
      if (result.correct) handleComplete(stepId);
      return { correct: result.correct };
    },
    [activeScenario, labId, getScenarioId, handleComplete]
  );

  const stepIds = useMemo(
    () => activeScenario ? getStepIds(activeScenario) : [],
    [activeScenario, getStepIds]
  );

  const getStepState = useCallback(
    (index: number) => {
      const stepId = stepIds[index];
      if (!stepId) return { isLocked: true, isCompleted: false, isActive: false };
      const isCompleted = completedSteps.has(stepId);
      const firstIncomplete = stepIds.findIndex((id) => !completedSteps.has(id));
      const isActive = index === firstIncomplete;
      const isLocked = !isCompleted && index > firstIncomplete;
      return { isLocked, isCompleted, isActive };
    },
    [stepIds, completedSteps]
  );

  const allDone = useMemo(
    () => stepIds.length > 0 && stepIds.every((id) => completedSteps.has(id)),
    [stepIds, completedSteps]
  );

  const startScenario = useCallback((scenario: T) => {
    setActiveScenario(scenario);
    setCompletedSteps(new Set());
  }, []);

  const exitScenario = useCallback(() => {
    setActiveScenario(null);
    setCompletedSteps(new Set());
  }, []);

  return {
    activeScenario,
    completedSteps,
    handleComplete,
    handleFlagSubmit,
    getStepState,
    allDone,
    startScenario,
    exitScenario,
  };
}

export default useLabScenario;
