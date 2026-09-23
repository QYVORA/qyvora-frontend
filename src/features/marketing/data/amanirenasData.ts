import { Smartphone, PackageOpen, FileSearch, FileCode2, Settings, Plug, FileCheck, Gauge, ShieldAlert, type LucideIcon } from 'lucide-react';
import type { ToolSourceExample } from '../components/tools/ToolSourceSection';

export interface AmanirenasStage {
  id: string;
  name: string;
  icon: LucideIcon;
  desc: string;
}

export const STAGES: AmanirenasStage[] = [
  { id: '01', name: 'IDENTIFY', icon: Smartphone, desc: 'Application identification: app id, bundle id, build, source and version of the app profile being assessed.' },
  { id: '02', name: 'INTAKE', icon: PackageOpen, desc: 'IPA intake: architecture, bundle entries and signature details recorded from the offline snapshot.' },
  { id: '03', name: 'METADATA', icon: FileSearch, desc: 'Bundle metadata extraction: minimum OS version, team id and asset counts from the profile.' },
  { id: '04', name: 'STATIC', icon: FileCode2, desc: 'Static binary analysis: hardcoded secrets, weak cryptography and WebView usage without executing anything.' },
  { id: '05', name: 'CONFIG', icon: Settings, desc: 'Configuration analysis: backup exposure, debug flags, arbitrary loads and cleartext HTTP loads.' },
  { id: '06', name: 'API', icon: Plug, desc: 'API surface analysis: endpoint discovery, insecure transport and missing certificate pinning.' },
  { id: '07', name: 'EVIDENCE', icon: FileCheck, desc: 'Evidence collection: artifacts, frameworks and permissions captured for every triggering observation.' },
  { id: '08', name: 'RISK', icon: Gauge, desc: 'Rule analysis (AMN-001+) and transparent risk scoring: severity x confidence x exposure, capped at 100.' },
];

export interface AmanirenasRule {
  id: string;
  name: string;
  category: string;
  severity: string;
  checks: string;
}

export const RULES: AmanirenasRule[] = [
  { id: 'AMN-001', name: 'Hardcoded secret in app', category: 'secrets', severity: 'critical', checks: 'artifact kind == hardcoded_secret (value redacted)' },
  { id: 'AMN-002', name: 'Insecure transport', category: 'transport', severity: 'critical', checks: 'endpoint scheme == http' },
  { id: 'AMN-003', name: 'Missing certificate pinning', category: 'transport', severity: 'medium', checks: 'endpoint without a pinned certificate' },
  { id: 'AMN-004', name: 'Legacy WebView usage', category: 'static', severity: 'medium', checks: 'UIWebView / legacy WebView artifact' },
  { id: 'AMN-005', name: 'Weak cryptography', category: 'crypto', severity: 'medium', checks: 'deprecated cipher or hashing primitive' },
  { id: 'AMN-006', name: 'Insecure local data storage', category: 'storage', severity: 'high', checks: 'sensitive data persisted outside protected storage' },
  { id: 'AMN-007', name: 'Sensitive data copied to clipboard', category: 'data', severity: 'medium', checks: 'clipboard copy of sensitive fields' },
  { id: 'AMN-008', name: 'Sensitive data in logs', category: 'data', severity: 'low', checks: 'sensitive material written to app logs' },
  { id: 'AMN-009', name: 'Excessive permissions', category: 'permissions', severity: 'medium', checks: 'permission declared beyond app functionality' },
  { id: 'AMN-010', name: 'Outdated minimum OS version', category: 'platform', severity: 'low', checks: 'min_os lower than the current floor' },
  { id: 'AMN-011', name: 'Ad-hoc signing without verified distribution', category: 'signing', severity: 'medium', checks: 'signature == ad-hoc' },
  { id: 'AMN-012', name: 'No jailbreak or tamper detection', category: 'armoring', severity: 'medium', checks: 'no armoring/integrity controls present' },
];

export const RULE_CATEGORIES: string[] = ['secrets', 'transport', 'static', 'crypto', 'storage', 'data', 'permissions', 'platform', 'signing', 'armoring'];

export const CONFIDENCE_STATES: string[] = ['confirmed', 'observed', 'probable', 'possible', 'unknown', 'not_observed'];

export const RISK_THRESHOLDS: { range: string; level: string }[] = [
  { range: '80–100', level: 'critical' },
  { range: '60–79', level: 'high' },
  { range: '35–59', level: 'medium' },
  { range: '1–34', level: 'low' },
  { range: '0', level: 'none' },
];

export const GITHUB_URL = 'https://github.com/QYVORA/qyvora-amanirenas';

export const BUILD_FROM_SOURCE = {
  requirements: 'Go 1.26+ toolchain. No external runtime dependencies.',
  steps: [
    { cmd: 'git clone --depth 1 https://github.com/QYVORA/qyvora-amanirenas' },
    { cmd: 'cd qyvora-amanirenas' },
    { cmd: 'go build ./cmd/amanirenas', note: 'Produces a single static binary named amanirenas' },
    { cmd: 'sudo install -m 0755 amanirenas /usr/local/bin/amanirenas', note: 'Adds amanirenas to your PATH without a package manager' },
  ],
};

export const QUICK_START = [
  'amanirenas assess --sim',
  'amanirenas profile --out app-profile.json',
  'amanirenas assess --app app-profile.json',
  'amanirenas findings',
  'amanirenas evidence',
  'amanirenas report -o json',
];

export const AUTHORIZED_WARNING = {
  icon: ShieldAlert,
  title: 'Offline',
  accent: 'App Assessment',
  description:
    'AMANIRENAS analyzes only the app profiles and IPA snapshots you explicitly point it at. Runtime assessment and live device acquisition are not implemented and are refused honestly; nothing here executes app code or touches a device.',
};

export const SOURCE_EXAMPLES: ToolSourceExample[] = [
  {
    id: 'entry',
    filename: 'main.go',
    label: 'CLI entry point',
    description: 'The binary hands control to the CLI layer; Execute returns an exit code so callers own process termination.',
    code: 'package main\n\nimport (\n\t"os"\n\n\t"github.com/QYVORA/qyvora-amanirenas/internal/cli"\n)\n\nfunc main() {\n\tos.Exit(cli.Execute())\n}',
  },
  {
    id: 'pipeline',
    filename: 'internal/analysis/analyst.go',
    label: 'Sequential assessment stages',
    description: 'The offline pipeline runs in a fixed order: identification → intake → metadata → static → config → api → evidence → rule analysis → risk. A per-run cache on the step lets stages and rules share derived values.',
    code: 'func Stages(reg *rules.Registry, cfg map[string]any, maxEntries int) []pipeline.Stage {\n\treturn []pipeline.Stage{\n\t\t{ID: "identification", Name: "Application identification", ...},\n\t\t{ID: "ipa", Name: "IPA intake", ...},\n\t\t{ID: "metadata", Name: "Metadata extraction", ...},\n\t\t// static, config, api, evidence, analysis, risk\n\t}\n}',
  },
  {
    id: 'rules',
    filename: 'internal/rules/builtin/builtin.go',
    label: 'Pure-function rules',
    description: 'Every rule is a pure function over the read-only assessment environment, so identical input always yields identical findings.',
    code: 'func hardcodedSecretRule() *rules.Rule {\n\treturn &rules.Rule{\n\t\tID:       "AMN-001",\n\t\tName:     "Hardcoded secret in app",\n\t\tCategory: "secrets",\n\t\tSeverity: models.SeverityCritical,\n\t\tDetect: func(ctx *rules.Context) []models.Finding {\n\t\t\t// ... pure function over hardcoded secret artifacts\n\t\t},\n\t}\n}',
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