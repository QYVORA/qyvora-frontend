import { Search, Users, KeyRound, Fingerprint, ShieldCheck, Lock, GitMerge, Gauge, ShieldAlert, type LucideIcon } from 'lucide-react';
import type { ToolSourceExample } from '../components/tools/ToolSourceSection';

export interface SundiataStage {
  id: string;
  name: string;
  icon: LucideIcon;
  desc: string;
}

export const STAGES: SundiataStage[] = [
  { id: '01', name: 'DISCOVER', icon: Search, desc: 'Identity discovery: source, tenant and the identities and groups present in the offline directory snapshot.' },
  { id: '02', name: 'ENUMERATE', icon: Users, desc: 'Account and group enumeration: users, service accounts, apps and their enabled state.' },
  { id: '03', name: 'AUTHENTICATE', icon: KeyRound, desc: 'Authentication and MFA posture: password policies, session lifetime and missing MFA on privileged identities.' },
  { id: '04', name: 'CREDENTIALS', icon: Fingerprint, desc: 'Credential exposure, rotation and reuse — material is redacted before output and never stored.' },
  { id: '05', name: 'PRIVILEGE', icon: ShieldCheck, desc: 'Privilege and relationship mapping: memberships, impersonation and sensitive-group affiliations.' },
  { id: '06', name: 'SECRETS', icon: Lock, desc: 'Secret artifact discovery across identity records, redacted at collection time.' },
  { id: '07', name: 'ATTACK-PATH', icon: GitMerge, desc: 'Identity attack-path analysis: reachable sensitive groups through chained relationships.' },
  { id: '08', name: 'RISK', icon: Gauge, desc: 'Rule analysis (SDT-001+) and transparent risk scoring: severity x confidence x exposure, capped at 100.' },
];

export interface SundiataRule {
  id: string;
  name: string;
  category: string;
  severity: string;
  checks: string;
}

export const RULES: SundiataRule[] = [
  { id: 'SDT-001', name: 'Plaintext credential exposure', category: 'credentials', severity: 'critical', checks: 'credential material stored in plaintext (redacted)' },
  { id: 'SDT-002', name: 'Credential rotation overdue', category: 'credentials', severity: 'medium', checks: 'last rotation older than the allowed window' },
  { id: 'SDT-003', name: 'Privileged identity without MFA', category: 'authentication', severity: 'high', checks: 'privileged account with MFA disabled' },
  { id: 'SDT-004', name: 'Password never expires', category: 'authentication', severity: 'medium', checks: 'expiry flag disabled on the account' },
  { id: 'SDT-005', name: 'Disabled identity retains access', category: 'lifecycle', severity: 'medium', checks: 'disabled account still holds active memberships' },
  { id: 'SDT-006', name: 'Credential reuse across identities', category: 'credentials', severity: 'high', checks: 'same credential material observed on multiple identities' },
  { id: 'SDT-007', name: 'Secret material in files', category: 'secrets', severity: 'high', checks: 'secret material embedded in identity records' },
  { id: 'SDT-008', name: 'Excess privilege membership', category: 'privilege', severity: 'high', checks: 'account member of sensitive groups beyond role need' },
  { id: 'SDT-009', name: 'Identity attack path to sensitive group', category: 'attack-path', severity: 'critical', checks: 'reachable sensitive group through relationship chain' },
  { id: 'SDT-010', name: 'Impersonation relationship', category: 'privilege', severity: 'medium', checks: 'identity can act on behalf of another' },
  { id: 'SDT-011', name: 'Legacy privileged account', category: 'privilege', severity: 'high', checks: 'stale account holding privilege' },
  { id: 'SDT-012', name: 'Excessive session lifetime', category: 'authentication', severity: 'low', checks: 'session lifetime exceeds the defined ceiling' },
  { id: 'SDT-013', name: 'Legacy authentication hash exposure', category: 'credentials', severity: 'high', checks: 'weak legacy hash material present (redacted)' },
];

export const RULE_CATEGORIES: string[] = ['credentials', 'authentication', 'lifecycle', 'secrets', 'privilege', 'attack-path'];

export const CONFIDENCE_STATES: string[] = ['confirmed', 'observed', 'probable', 'possible', 'unknown', 'not_observed'];

export const RISK_THRESHOLDS: { range: string; level: string }[] = [
  { range: '80–100', level: 'critical' },
  { range: '60–79', level: 'high' },
  { range: '35–59', level: 'medium' },
  { range: '1–34', level: 'low' },
  { range: '0', level: 'none' },
];

export const GITHUB_URL = 'https://github.com/QYVORA/qyvora-sundiata';

export const BUILD_FROM_SOURCE = {
  requirements: 'Go 1.26+ toolchain. No external runtime dependencies.',
  steps: [
    { cmd: 'git clone --depth 1 https://github.com/QYVORA/qyvora-sundiata' },
    { cmd: 'cd qyvora-sundiata' },
    { cmd: 'go build ./cmd/sundiata', note: 'Produces a single static binary named sundiata' },
    { cmd: 'sudo install -m 0755 sundiata /usr/local/bin/sundiata', note: 'Adds sundiata to your PATH without a package manager' },
  ],
};

export const QUICK_START = [
  'sundiata assess --sim',
  'sundiata directory --out directory.json',
  'sundiata assess --directory directory.json',
  'sundiata findings',
  'sundiata evidence',
  'sundiata report -o json',
];

export const AUTHORIZED_WARNING = {
  icon: ShieldAlert,
  title: 'Redacted',
  accent: 'Identity Assessments',
  description:
    'SUNDIATA analyzes only the identity directory snapshots it is explicitly pointed at, and only those you are authorized to review. Credential material is redacted before output and never stored. Live identity source collection is not implemented and is refused honestly.',
};

export const SOURCE_EXAMPLES: ToolSourceExample[] = [
  {
    id: 'entry',
    filename: 'main.go',
    label: 'CLI entry point',
    description: 'The binary hands control to the CLI layer; Execute returns an exit code so callers own process termination.',
    code: 'package main\n\nimport (\n\t"os"\n\n\t"github.com/QYVORA/qyvora-sundiata/internal/cli"\n)\n\nfunc main() {\n\tos.Exit(cli.Execute())\n}',
  },
  {
    id: 'pipeline',
    filename: 'internal/analysis/analyst.go',
    label: 'Sequential assessment stages',
    description: 'The offline pipeline runs in a fixed order — discovery → enumeration → authentication → credentials → privilege → secrets → attack-path → rule analysis → risk.',
    code: 'func Stages(reg *rules.Registry, cfg map[string]any, maxEntries int) []pipeline.Stage {\n\treturn []pipeline.Stage{\n\t\t{ID: "discovery", Name: "Identity discovery", ...},\n\t\t{ID: "enumeration", Name: "Account and group enumeration", ...},\n\t\t// authentication, credentials, privilege, secrets, attack-path, risk\n\t}\n}',
  },
  {
    id: 'rules',
    filename: 'internal/rules/builtin/builtin.go',
    label: 'Pure-function rules',
    description: 'Every rule is a pure function over the read-only assessment environment, so identical input always yields identical findings.',
    code: 'func plaintextCredentialRule() *rules.Rule {\n\treturn &rules.Rule{\n\t\tID:       "SDT-001",\n\t\tName:     "Plaintext credential exposure",\n\t\tCategory: "credentials",\n\t\tSeverity: models.SeverityCritical,\n\t\tDetect: func(ctx *rules.Context) []models.Finding {\n\t\t\t// ... pure function over redacted credential material\n\t\t},\n\t}\n}',
  },
  {
    id: 'risk',
    filename: 'internal/risk/risk.go',
    label: 'Transparent risk scoring',
    description: 'Per-finding score is severity_weight × confidence × (exposure ÷ 5) × 40 capped at 100, then mapped to a level. Target risk is the mean per-finding score.',
    code: 'score := int(float64(sev) * conf * (float64(exposure) / 5.0) * 40)\nif score > MaxScore {\n\tscore = MaxScore\n}\nreturn Risk{Score: score, Level: Level(score)}',
  },
  {
    id: 'evidence',
    filename: 'internal/evidence/evidence.go',
    label: 'Evidence collection',
    description: 'Every finding carries at least one Evidence record. Each record captures the exact observation that triggered the rule, hashed so it can be independently verified across sessions.',
    code: 'func Collect(sess *models.Session, kind models.EvidenceKind, source, target, detail string) {\n\te := models.Evidence{\n\t\tID: models.NewID("ev"), Kind: kind,\n\t\tSource: source, Target: target, Detail: detail,\n\t}\n\tif e.Hash == "" {\n\t\th := sha256.Sum256([]byte(source + "\\x00" + target + "\\x00" + detail))\n\t\te.Hash = fmt.Sprintf("%x", h)\n\t}\n\tsess.AddEvidence(e)\n}',
  },
];