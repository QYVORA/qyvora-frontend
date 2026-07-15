import type { Difficulty } from '../../data/simulations/types';

// ── Simulation Registry ─────────────────────────────────────────────────────
export type SimulationType =
  | 'terminal'
  | 'browser'
  | 'http-inspector'
  | 'email-client'
  | 'packet-viewer'
  | 'file-explorer'
  | 'log-viewer'
  | 'sql-console'
  | 'api-explorer'
  | 'password-cracker'
  | 'network-topology'
  | 'osint-dashboard'
  | 'timeline-investigation';

export interface SimulationDefinition {
  type: SimulationType;
  label: string;
  icon: string;
}

export const SIMULATION_REGISTRY: Record<SimulationType, SimulationDefinition> = {
  terminal:                 { type: 'terminal',                 label: 'Terminal',                icon: 'terminal' },
  browser:                  { type: 'browser',                  label: 'Browser',                 icon: 'globe' },
  'http-inspector':         { type: 'http-inspector',           label: 'HTTP Inspector',          icon: 'network' },
  'email-client':           { type: 'email-client',             label: 'Email Client',            icon: 'mail' },
  'packet-viewer':          { type: 'packet-viewer',            label: 'Packet Viewer',           icon: 'radio' },
  'file-explorer':          { type: 'file-explorer',            label: 'File Explorer',           icon: 'folder' },
  'log-viewer':             { type: 'log-viewer',               label: 'Log Viewer',              icon: 'scroll' },
  'sql-console':            { type: 'sql-console',              label: 'SQL Console',             icon: 'database' },
  'api-explorer':           { type: 'api-explorer',             label: 'API Explorer',            icon: 'zap' },
  'password-cracker':       { type: 'password-cracker',         label: 'Password Cracker',        icon: 'lock' },
  'network-topology':       { type: 'network-topology',         label: 'Network Topology',        icon: 'share-2' },
  'osint-dashboard':        { type: 'osint-dashboard',          label: 'OSINT Dashboard',         icon: 'search' },
  'timeline-investigation': { type: 'timeline-investigation',   label: 'Timeline',                icon: 'clock' },
};

// ── Network Profile ─────────────────────────────────────────────────────────
export interface NetworkDeviceProfile {
  ip: string;
  hostname: string;
  os: string;
  vendor: string;
  role: string;
  ports: { port: number; protocol: string; service: string; version: string; state: 'open' | 'filtered' | 'closed' }[];
  discoverable: boolean;
}

export interface NetworkProfile {
  id: string;
  label: string;
  subnet: string;
  gateway: string;
  dns: string[];
  devices: NetworkDeviceProfile[];
}

// ── Browser Simulation ──────────────────────────────────────────────────────
export interface BrowserPage {
  url: string;
  title: string;
  html: string;
  headers: Record<string, string>;
  cookies: { name: string; value: string; path: string; domain: string; httpOnly: boolean; secure: boolean }[];
  hiddenElements?: { type: string; content: string; location?: string }[];
}

export interface BrowserState {
  url: string;
  pages: BrowserPage[];
  history: string[];
  historyIndex: number;
}

// ── HTTP Inspector ──────────────────────────────────────────────────────────
export interface HttpRequest {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers: Record<string, string>;
  body?: string;
  response: HttpResponse;
}

export interface HttpResponse {
  statusCode: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  timing: number;
}

// ── Email Simulation ────────────────────────────────────────────────────────
export interface SimEmail {
  id: string;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  body: string;
  isPhishing: boolean;
  indicators: { type: string; description: string; severity: 'low' | 'medium' | 'high'; location: string }[];
  receivedAt: string;
  headers: { key: string; value: string }[];
  attachments?: { name: string; size: string; mimeType: string }[];
}

// ── Packet Viewer ───────────────────────────────────────────────────────────
export interface SimPacket {
  number: number;
  time: string;
  source: string;
  destination: string;
  protocol: string;
  length: number;
  info: string;
  flags?: string;
  payload?: string;
  layers?: { name: string; fields: Record<string, string> }[];
}

// ── File Explorer ───────────────────────────────────────────────────────────
export interface SimFile {
  name: string;
  type: 'file' | 'dir';
  size: number;
  modified: string;
  permissions: string;
  content?: string;
  mimeType?: string;
  hash?: string;
  children?: SimFile[];
}

// ── Log Viewer ──────────────────────────────────────────────────────────────
export interface SimLogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  source: string;
  message: string;
  fields?: Record<string, string>;
}

export interface SimLogSource {
  id: string;
  label: string;
  entries: SimLogEntry[];
}

// ── SQL Console ─────────────────────────────────────────────────────────────
export interface SqlTable {
  name: string;
  columns: string[];
  rows: Record<string, string>[];
}

export interface SqlQueryResult {
  columns: string[];
  rows: Record<string, string>[];
  affectedRows?: number;
  error?: string;
  timing: number;
}

// ── API Explorer ────────────────────────────────────────────────────────────
export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  headers: Record<string, string>;
  body?: string;
  response: { statusCode: number; headers: Record<string, string>; body: string };
}

// ── Password Cracker ────────────────────────────────────────────────────────
export interface PasswordHash {
  hash: string;
  algorithm: string;
  salt?: string;
  plaintext?: string;
}

export interface CrackAttempt {
  word: string;
  result: 'miss' | 'hit';
  attemptNumber: number;
}

// ── Network Topology ────────────────────────────────────────────────────────
export interface TopologyNode {
  id: string;
  label: string;
  type: 'router' | 'switch' | 'server' | 'firewall' | 'workstation' | 'printer' | 'iot';
  ip?: string;
  x: number;
  y: number;
  discovered: boolean;
}

export interface TopologyLink {
  from: string;
  to: string;
  label?: string;
  discovered: boolean;
}

// ── OSINT Dashboard ─────────────────────────────────────────────────────────
export interface OsintModule {
  id: string;
  type: 'whois' | 'dns' | 'metadata' | 'social' | 'images' | 'search' | 'timeline';
  label: string;
  query?: string;
  result?: string;
}

// ── Timeline Investigation ──────────────────────────────────────────────────
export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: 'network' | 'process' | 'file' | 'auth' | 'dns' | 'email';
  severity: 'low' | 'medium' | 'high' | 'critical';
  relatedEvents?: string[];
}

// ── Progressive Hints ───────────────────────────────────────────────────────
export interface ProgressiveHint {
  level: 1 | 2 | 3 | 4;
  content: string;
}

// ── Story-Driven Step ───────────────────────────────────────────────────────
export interface StoryStep {
  id: string;
  mission: string;
  narrative: string;
  objectives: string[];
  evidence?: string[];
  questions?: { question: string; answer: string }[];
  hints: ProgressiveHint[];
  simulations: SimulationType[];
  reflection?: string;
  completionMessage: string;
}
