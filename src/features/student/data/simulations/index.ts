export type {
  Difficulty,
  LabCategory,
  LabScenario,
  LabStep,
  LabProgress,
  SqlInjectionTarget,
  SqlTable,
  PrivescScenario,
  LabStory,
  LabChapter,
  ChapterTrigger,
  LabConnectionState,
} from './types';

export { PRIVESC_SCENARIOS } from './privesc-scenarios';

export {
  SQL_INJECTION_TARGETS,
  type SqlInjectionStep,
} from './sql-injection-data';

export { KILL_CHAIN_SCENARIOS } from './kill-chain-data';
export type { KillChainScenario, KillChainPhase, KillChainCommand } from './kill-chain-data';

export { PASSWORD_EXERCISES, getShadowFileContent } from './password-exercises';
export type { PasswordExercise } from './password-exercises';

export { OSINT_CHALLENGES } from './osint-data';
export type { OsintChallenge, OsintStep } from './osint-data';
