import { Cloud, KeyRound, Database, Network, Cpu, Lock, Fence, Gauge, ShieldAlert, type LucideIcon } from 'lucide-react';
import type { ToolSourceExample } from '../components/tools/ToolSourceSection';

export interface ImhotepStage {
  id: string;
  name: string;
  icon: LucideIcon;
  desc: string;
}

export const STAGES: ImhotepStage[] = [
  { id: '01', name: 'SNAPSHOT', icon: Cloud, desc: 'Offline cloud snapshot analysis: provider, region and scope recorded from the snapshot file.' },
  { id: '02', name: 'IAM', icon: KeyRound, desc: 'Identity and access policy analysis: wildcard actions, wildcard resources and privilege grants.' },
  { id: '03', name: 'STORAGE', icon: Database, desc: 'Storage exposure analysis: publicly readable or writable buckets and unencrypted stores.' },
  { id: '04', name: 'NETWORK', icon: Network, desc: 'Network configuration analysis: exposed admin ports, publicly accessible databases and workloads.' },
  { id: '05', name: 'CONTAINERS', icon: Cpu, desc: 'Container and Kubernetes analysis: capabilities, network namespace and image tag behavior.' },
  { id: '06', name: 'SECRETS', icon: Lock, desc: 'Secret exposure detection across config and manifests; values redacted at collection time.' },
  { id: '07', name: 'MISCONFIG', icon: Fence, desc: 'Misconfiguration detection across the snapshot surface.' },
  { id: '08', name: 'RISK', icon: Gauge, desc: 'Rule analysis (IAM/STG/NET/CNT/SEC+) and transparent risk scoring, capped at 100.' },
];

export interface ImhotepRule {
  id: string;
  name: string;
  category: string;
  severity: string;
  checks: string;
}

export const RULES: ImhotepRule[] = [
  { id: 'IAM-001', name: 'Wildcard action granted', category: 'iam', severity: 'high', checks: 'policy action == "*"' },
  { id: 'IAM-002', name: 'Wildcard resource scope', category: 'iam', severity: 'high', checks: 'policy resource == "*"' },
  { id: 'STG-001', name: 'Publicly readable storage', category: 'storage', severity: 'high', checks: 'bucket ACL allows public reads' },
  { id: 'STG-002', name: 'Publicly writable storage', category: 'storage', severity: 'critical', checks: 'bucket ACL allows public writes' },
  { id: 'STG-003', name: 'Unencrypted storage at rest', category: 'storage', severity: 'medium', checks: 'storage without encryption at rest' },
  { id: 'NET-001', name: 'Administrative port exposed to the internet', category: 'network', severity: 'high', checks: 'SSH/RDP/admin port open to 0.0.0.0/0' },
  { id: 'NET-002', name: 'Publicly accessible database', category: 'network', severity: 'critical', checks: 'database port open to the internet' },
  { id: 'NET-003', name: 'Publicly exposed compute workload', category: 'network', severity: 'high', checks: 'compute workload with a public IP' },
  { id: 'DBE-001', name: 'Unencrypted database at rest', category: 'data', severity: 'medium', checks: 'database without encryption at rest' },
  { id: 'CNT-001', name: 'Privileged container capability', category: 'containers', severity: 'high', checks: 'container requests privileged capability' },
  { id: 'CNT-002', name: 'Host network namespace', category: 'containers', severity: 'medium', checks: 'container shares the host network namespace' },
  { id: 'CNT-003', name: 'Immutability-breaking image tag', category: 'containers', severity: 'low', checks: 'mutable tag used for a deployment' },
  { id: 'CNT-004', name: 'Container runs as root', category: 'containers', severity: 'medium', checks: 'container without a non-root user' },
  { id: 'SEC-001', name: 'Hardcoded secret material', category: 'secrets', severity: 'critical', checks: 'secret material in config/manifest (redacted)' },
];

export const RULE_CATEGORIES: string[] = ['iam', 'storage', 'network', 'data', 'containers', 'secrets'];

export const CONFIDENCE_STATES: string[] = ['confirmed', 'observed', 'probable', 'possible', 'unknown', 'not_observed'];

export const RISK_THRESHOLDS: { range: string; level: string }[] = [
  { range: '80–100', level: 'critical' },
  { range: '60–79', level: 'high' },
  { range: '35–59', level: 'medium' },
  { range: '1–34', level: 'low' },
  { range: '0', level: 'none' },
];

export const GITHUB_URL = 'https://github.com/QYVORA/qyvora-imhotep';

export const BUILD_FROM_SOURCE = {
  requirements: 'Go 1.26+ toolchain. No external runtime dependencies.',
  steps: [
    { cmd: 'git clone --depth 1 https://github.com/QYVORA/qyvora-imhotep' },
    { cmd: 'cd qyvora-imhotep' },
    { cmd: 'go build ./cmd/imhotep', note: 'Produces a single static binary named imhotep' },
    { cmd: 'sudo install -m 0755 imhotep /usr/local/bin/imhotep', note: 'Adds imhotep to your PATH without a package manager' },
  ],
};

export const QUICK_START = [
  'imhotep assess --sim',
  'imhotep snapshot --out snapshot.json',
  'imhotep assess --snapshot snapshot.json',
  'imhotep providers',
  'imhotep findings',
  'imhotep report -o json',
];

export const AUTHORIZED_WARNING = {
  icon: ShieldAlert,
  title: 'Offline',
  accent: 'Cloud Snapshots',
  description:
    'IMHOTEP analyzes only the cloud snapshots it is explicitly pointed at. Live provider collection is not implemented and is refused honestly; it reads recorded snapshots, never live provider APIs.',
};

export const SOURCE_EXAMPLES: ToolSourceExample[] = [
  {
    id: 'entry',
    filename: 'main.go',
    label: 'CLI entry point',
    description: 'The binary hands control to the CLI layer; Execute returns an exit code so callers own process termination.',
    code: 'package main\n\nimport (\n\t"os"\n\n\t"github.com/QYVORA/qyvora-imhotep/internal/cli"\n)\n\nfunc main() {\n\tos.Exit(cli.Execute())\n}',
  },
  {
    id: 'pipeline',
    filename: 'internal/analysis/analyst.go',
    label: 'Sequential assessment stages',
    description: 'The offline pipeline runs in a fixed order: provider detection → asset discovery → configuration inventory → rule analysis → risk.',
    code: 'func Stages(reg *rules.Registry, cfg map[string]any, maxEntries int) []pipeline.Stage {\n\treturn []pipeline.Stage{\n\t\t{ID: "provider", Name: "Provider detection", ...},\n\t\t{ID: "discovery", Name: "Asset discovery", ...},\n\t\t// inventory, analysis, risk\n\t}\n}',
  },
  {
    id: 'rules',
    filename: 'internal/rules/builtin/builtin.go',
    label: 'Pure-function rules',
    description: 'Every rule is a pure function over the read-only assessment environment, so identical input always yields identical findings.',
    code: 'func wildcardActionRule() *rules.Rule {\n\treturn &rules.Rule{\n\t\tID:       "IAM-001",\n\t\tName:     "Wildcard action granted",\n\t\tCategory: "iam",\n\t\tSeverity: models.SeverityHigh,\n\t\tDetect: func(ctx *rules.Context) []models.Finding {\n\t\t\t// ... pure function over parsed policies\n\t\t},\n\t}\n}',
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