/**
 * LEARNING BLOCKS — BARREL EXPORT & REGISTRATION
 * ===============================================
 * Central export point for all learning block components.
 * Components are automatically registered in the blockRegistry on import.
 */

import { blockRegistry } from '../utils/blockRegistry';

// Import all block components
import TextBlockComponent from './TextBlock';
import MissionBlockComponent from './MissionBlock';
import ObjectiveBlockComponent from './ObjectiveBlock';
import ConceptBlockComponent from './ConceptBlock';
import DebriefBlockComponent from './DebriefBlock';
import RecallBlockComponent from './RecallBlock';
import ObserveBlockComponent from './ObserveBlock';
import EvidenceBlockComponent from './EvidenceBlock';
import CommandBlockComponent from './CommandBlock';
import DoBlockComponent from './DoBlock';
import ThinkBlockComponent from './ThinkBlock';
import CheckpointBlockComponent from './CheckpointBlock';

// Register all implemented blocks
blockRegistry.register({
  type: 'text',
  component: TextBlockComponent,
  description: 'Plain explanatory text',
});

blockRegistry.register({
  type: 'mission',
  component: MissionBlockComponent,
  description: "Student's goal/task",
});

blockRegistry.register({
  type: 'objective',
  component: ObjectiveBlockComponent,
  description: 'Learning outcomes',
});

blockRegistry.register({
  type: 'concept',
  component: ConceptBlockComponent,
  description: 'Key idea highlight',
});

blockRegistry.register({
  type: 'debrief',
  component: DebriefBlockComponent,
  description: 'Post-activity explanation',
});

blockRegistry.register({
  type: 'recall',
  component: RecallBlockComponent,
  description: 'Summary for retention',
});

blockRegistry.register({
  type: 'observe',
  component: ObserveBlockComponent,
  description: 'Direct observation',
});

blockRegistry.register({
  type: 'evidence',
  component: EvidenceBlockComponent,
  description: 'Terminal/log output',
});

blockRegistry.register({
  type: 'command',
  component: CommandBlockComponent,
  description: 'Terminal command',
});

blockRegistry.register({
  type: 'do',
  component: DoBlockComponent,
  description: 'Action instructions',
});

blockRegistry.register({
  type: 'think',
  component: ThinkBlockComponent,
  description: 'Reasoning question',
});

blockRegistry.register({
  type: 'checkpoint',
  component: CheckpointBlockComponent,
  description: 'Quiz/flag/validation gate',
});

// Export all components
export {
  TextBlockComponent,
  MissionBlockComponent,
  ObjectiveBlockComponent,
  ConceptBlockComponent,
  DebriefBlockComponent,
  RecallBlockComponent,
  ObserveBlockComponent,
  EvidenceBlockComponent,
  CommandBlockComponent,
  DoBlockComponent,
  ThinkBlockComponent,
  CheckpointBlockComponent,
};

// Note: Additional block types (mental-model, diagram, http, code, comparison,
// hint, challenge, lab) will be implemented in Phase 5 as needed.
