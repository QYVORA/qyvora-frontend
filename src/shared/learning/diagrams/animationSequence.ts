/**
 * DIAGRAM ANIMATION SEQUENCE HELPER
 * =================================
 *
 * Builds a step-through `AnimationConfig` from a simple list of ordered steps.
 * Each step activates one node and resets the previous one, so the diagram
 * reads as a process the learner can play, pause, and step through — with a
 * caption (`description`) for every step.
 */

import type {
  AnimationConfig,
  AnimationStage,
  NodeState,
} from '@/shared/components/diagrams/types';

export interface SequenceStep {
  /** Node to activate at this step. */
  nodeId: string;
  /** Caption shown while this step is active. */
  description: string;
  /** State to apply to the active node. Defaults to `'active'`. */
  state?: NodeState;
}

export function createNodeSequenceAnimation(
  steps: SequenceStep[],
  options?: { stepDuration?: number }
): AnimationConfig {
  const { stepDuration = 1300 } = options ?? {};

  const stages: AnimationStage[] = steps.map((step, index) => {
    const previous = index > 0 ? steps[index - 1].nodeId : null;
    const actions: AnimationStage['actions'] = [];

    if (previous && previous !== step.nodeId) {
      actions.push({ type: 'node-state-change', nodeId: previous, state: 'normal' });
    }
    actions.push({
      type: 'node-state-change',
      nodeId: step.nodeId,
      state: step.state ?? 'active',
    });

    return {
      id: `step-${index}`,
      duration: stepDuration,
      description: step.description,
      actions,
    };
  });

  return {
    type: 'state-transition',
    stages,
    loop: false,
    autoPlay: false,
    speed: 1,
    respectReducedMotion: true,
  };
}
