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

export type {
  WebLabScenario,
  WebLabStep,
  WebLabCategory,
} from './web-lab-types';

export { WEB_ACCESS_CONTROL_SCENARIOS } from './web-access-control-data';
export { API_SECURITY_SCENARIOS } from './api-security-data';
export { AUTOMATION_SCENARIOS } from './automation-data';
export { METHODOLOGY_SCENARIOS } from './methodology-data';
export { NETWORK_SECURITY_SCENARIOS } from './network-security-data';
export { WIRELESS_SCENARIOS } from './wireless-data';
export { AD_ENUM_SCENARIOS } from './ad-enum-data';
export { ATTACK_PATHS_SCENARIOS } from './attack-paths-data';
