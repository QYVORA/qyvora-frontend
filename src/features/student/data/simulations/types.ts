export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type LabCategory =
  | 'web-exploitation'
  | 'privilege-escalation'
  | 'password-cracking'
  | 'social-engineering'
  | 'network-analysis'
  | 'osint'
  | 'proxy-traffic'
  | 'wireless'
  | 'sql-injection'
  | 'kill-chain';

export interface LabScenario {
  id: string;
  title: string;
  description: string;
  category: LabCategory;
  difficulty: Difficulty;
  cpReward: number;
  estimatedMinutes: number;
  skills: string[];
  hints: string[];
  steps: LabStep[];
}

export interface LabStep {
  id: string;
  instruction: string;
  expectedAction?: string;
  hint?: string;
  completed: boolean;
}

export interface LabProgress {
  scenarioId: string;
  completed: boolean;
  startedAt?: number;
  completedAt?: number;
  hintsUsed: number;
  stepsCompleted: number;
  totalSteps: number;
}

export interface WebAppPage {
  id: string;
  title: string;
  url: string;
  html: string;
  headers: Record<string, string>;
  cookies: WebCookie[];
  hiddenElements?: HiddenElement[];
}

export interface WebCookie {
  name: string;
  value: string;
  path: string;
  domain: string;
  httpOnly: boolean;
  secure: boolean;
}

export interface HiddenElement {
  type: 'comment' | 'hidden-input' | 'meta' | 'script-var' | 'base64';
  content: string;
  flag: string;
}

export interface PhishingEmail {
  id: string;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  body: string;
  isPhishing: boolean;
  indicators: PhishingIndicator[];
  receivedAt: string;
  headers: EmailHeader[];
}

export interface PhishingIndicator {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  location: string;
}

export interface EmailHeader {
  key: string;
  value: string;
}

export interface ProxyRequest {
  id: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
  response: ProxyResponse;
  intercepted: boolean;
  modified: boolean;
}

export interface ProxyResponse {
  statusCode: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
}

export interface PcapPacket {
  number: number;
  time: string;
  source: string;
  destination: string;
  protocol: string;
  length: number;
  info: string;
  flags?: string;
  payload?: string;
}

export interface KillChainPhase {
  id: string;
  name: string;
  description: string;
  commands: KillChainCommand[];
  completed: boolean;
}

export interface KillChainCommand {
  command: string;
  output: string;
  explanation: string;
  isRequired: boolean;
}

export interface WirelessAP {
  bssid: string;
  ssid: string;
  channel: number;
  signal: number;
  encryption: string;
  clientMac?: string;
}

export interface SqlInjectionTarget {
  id: string;
  name: string;
  url: string;
  parameter: string;
  injectable: boolean;
  database: string;
  tables: SqlTable[];
  difficulty: Difficulty;
}

export interface SqlTable {
  name: string;
  columns: string[];
  rows: Record<string, string>[];
}

export interface PrivescScenario {
  id: string;
  title: string;
  description: string;
  technique: string;
  difficulty: Difficulty;
  hints: string[];
  filesystem: Record<string, string>;
  solutionCommands: string[];
  flag: string;
}
