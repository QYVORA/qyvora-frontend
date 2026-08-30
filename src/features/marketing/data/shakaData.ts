import { Radar, ListChecks, GitBranch, ScanSearch, ShieldCheck, Gauge, FileText, ShieldAlert, type LucideIcon } from 'lucide-react';
import type { ToolSourceExample } from '../components/tools/ToolSourceSection';

export interface ShakaStage {
  id: string;
  name: string;
  icon: LucideIcon;
  desc: string;
}

export const STAGES: ShakaStage[] = [
  { id: '01', name: 'DISCOVER', icon: Radar, desc: 'Discover domains, domain controllers, forest topology, and directory boundaries' },
  { id: '02', name: 'ENUMERATE', icon: ListChecks, desc: 'Enumerate users, groups, computers, organizational units, and trust relationships' },
  { id: '03', name: 'GRAPH', icon: GitBranch, desc: 'Build typed relationship graph modeling principals, group memberships, and delegation paths' },
  { id: '04', name: 'ANALYZE', icon: ScanSearch, desc: 'Evaluate identity posture, Kerberos pre-auth, delegation configurations, and trust surfaces' },
  { id: '05', name: 'FINDINGS', icon: ShieldCheck, desc: 'Execute deterministic rule engine with fingerprint deduplication and evidence-backed severity' },
  { id: '06', name: 'RISK', icon: Gauge, desc: 'Compute risk score (0-100) and risk level across directory findings' },
  { id: '07', name: 'REPORT', icon: FileText, desc: 'Render terminal tables, schema-versioned JSON, Markdown, HTML, YAML, and JSONL event streams' },
];

export interface ShakaRule {
  id: string;
  title: string;
  desc: string;
}

export const RULES: ShakaRule[] = [
  { id: 'ADM-001', title: 'Privileged Group Membership', desc: 'Identifies accounts with adminCount set or direct membership in Domain Admins, Enterprise Admins, and sensitive roles' },
  { id: 'ADM-002', title: 'Password Never Expires', desc: 'Detects privileged accounts configured with non-expiring passwords, violating credential hygiene' },
  { id: 'ADM-003', title: 'Pre-Authentication Disabled', desc: 'Flags accounts with DONT_REQ_PREAUTH set, exposing them to offline AS-REP roasting' },
  { id: 'ADM-004', title: 'Unconstrained Delegation', desc: 'Surfaces computers and service accounts trusted for unconstrained Kerberos delegation' },
  { id: 'ADM-005', title: 'Weak Encryption / DES', desc: 'Detects accounts allowing DES or reversible encryption types' },
  { id: 'ADM-006', title: 'External Trust Discovered', desc: 'Maps cross-forest and external domain trusts with non-transitive or external routing' },
  { id: 'ADM-007', title: 'Trust Relationship Analysis', desc: 'Analyzes trust directionality and transitive authority across forest boundaries' },
];

export const GITHUB_URL = 'https://github.com/QYVORA/qyvora-shaka';

export const BUILD_FROM_SOURCE = {
  requirements: 'Go 1.22+ toolchain. No external runtime dependencies.',
  steps: [
    { cmd: 'git clone https://github.com/QYVORA/qyvora-shaka' },
    { cmd: 'cd qyvora-shaka' },
    { cmd: 'make build', note: 'Produces bin/shaka stamped with build version' },
    { cmd: 'make install-user', note: 'Installs ~/.local/bin/shaka with desktop entry + logo. System-wide: sudo make install' },
  ],
};

export const QUICK_START = [
  'shaka assess --sim',
  'shaka discover --sim',
  'shaka enumerate users --sim',
  'shaka graph --sim',
  'shaka assess --endpoint dc01:389 --user audit --password secret --authorized',
  'shaka assess --sim --output json > report.json',
];

export const AUTHORIZED_WARNING = {
  icon: ShieldAlert,
  title: 'Authorized',
  accent: 'Access Only',
  description:
    'shaka requires explicit authorization (--authorized / -y, config, or QYVORA_AUTHORIZED=true) before probing live Active Directory infrastructure. The built-in simulator (--sim) runs completely offline without touching a live network.',
};

export const SOURCE_EXAMPLES: ToolSourceExample[] = [
  {
    id: 'entry',
    filename: 'cmd/shaka/main.go',
    label: 'CLI entry point',
    description: 'Single static binary delegating to the CLI layer. Execute returns typed exit codes for pipeline automation.',
    code: 'package main\n\nimport (\n\t"os"\n\n\t"github.com/QYVORA/qyvora-shaka/internal/cli"\n)\n\nfunc main() {\n\tos.Exit(cli.Execute())\n}',
  },
  {
    id: 'graph',
    filename: 'internal/graph/graph.go',
    label: 'Relationship graph',
    description: 'Active Directory objects are modeled as nodes and typed edges (member_of, joins, trusts, delegates). Traversal is deterministic and backed by evidence references.',
    code: 'func (g *Graph) AddEdge(e *models.Edge) string {\n\tg.mu.Lock()\n\tdefer g.mu.Unlock()\n\n\tif e.ID == "" {\n\t\te.ID = fmt.Sprintf("e:%s:%s:%s", e.From, e.Type, e.To)\n\t}\n\tg.edges[e.ID] = e\n\tg.adj[e.From] = append(g.adj[e.From], e.To)\n\treturn e.ID\n}',
  },
  {
    id: 'rules',
    filename: 'internal/rules/builtin/builtin.go',
    label: 'Deterministic rules engine',
    description: 'Built-in detection rules evaluate discovered directory principals and relationships. Findings include evidence hashes, remediation steps, and confidence scoring.',
    code: 'func privilegedMembership() *rules.Rule {\n\treturn &rules.Rule{\n\t\tID: "ADM-001", Name: "Privileged Group Membership Discovered",\n\t\tCategory: "privilege", Severity: models.SeverityHigh,\n\t\tConfidence: models.ConfidenceHigh,\n\t\tObjectTypes: []string{"user", "group"},\n\t\tDetect: func(ctx rules.Context) []*models.Finding {\n\t\t\t...\n\t\t},\n\t}\n}',
  },
];
