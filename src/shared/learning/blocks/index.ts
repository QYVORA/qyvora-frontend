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
import MentalModelBlockComponent from './MentalModelBlock';
import DiagramBlockComponent from './DiagramBlock';
import HttpBlockComponent from './HttpBlock';
import CodeSnippetBlockComponent from './CodeSnippetBlock';
import ComparisonBlockComponent from './ComparisonBlock';
import HintBlockComponent from './HintBlock';
import ChallengeBlockComponent from './ChallengeBlock';
import LabBlockComponent from './LabBlock';
import PlaygroundBlockComponent from './PlaygroundBlock';

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

blockRegistry.register({
  type: 'mental-model',
  component: MentalModelBlockComponent,
  description: 'Node/link mental model map',
});

blockRegistry.register({
  type: 'diagram',
  component: DiagramBlockComponent,
  description: 'Generic diagram (flow/sequence/network)',
});

blockRegistry.register({
  type: 'http',
  component: HttpBlockComponent,
  description: 'HTTP request/response pair',
});

blockRegistry.register({
  type: 'code',
  component: CodeSnippetBlockComponent,
  description: 'Syntax-highlighted code snippet',
});

blockRegistry.register({
  type: 'comparison',
  component: ComparisonBlockComponent,
  description: 'Before/after side-by-side',
});

blockRegistry.register({
  type: 'hint',
  component: HintBlockComponent,
  description: 'Progressive hints',
});

blockRegistry.register({
  type: 'challenge',
  component: ChallengeBlockComponent,
  description: 'Reduced-scaffolding challenge',
});

blockRegistry.register({
  type: 'lab',
  component: LabBlockComponent,
  description: 'Lab handoff card',
});

blockRegistry.register({
  type: 'playground',
  component: PlaygroundBlockComponent,
  description: 'Inline code playground',
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
  MentalModelBlockComponent,
  DiagramBlockComponent,
  HttpBlockComponent,
  CodeSnippetBlockComponent,
  ComparisonBlockComponent,
  HintBlockComponent,
  ChallengeBlockComponent,
  LabBlockComponent,
  PlaygroundBlockComponent,
};

// Note: all 21 block types are now registered — the semantic learning
// vocabulary is complete across Narrative, Visual, Evidence, Interactive
// and Practice categories.
