import { Database, FileCheck, FileSearch, FolderSearch, Cpu, ScrollText, ClipboardList, Radar, ShieldAlert, type LucideIcon } from 'lucide-react';
import type { ToolSourceExample } from '../components/tools/ToolSourceSection';

export interface TimbuktuStage {
  id: string;
  name: string;
  icon: LucideIcon;
  desc: string;
}

export const STAGES: TimbuktuStage[] = [
  { id: '01', name: 'ACQUIRE', icon: Database, desc: 'Evidence acquisition: evidence items registered from the offline case file and their source.' },
  { id: '02', name: 'INTEGRITY', icon: FileCheck, desc: 'Evidence integrity verification: continuity and hash checks over every captured item.' },
  { id: '03', name: 'ARTIFACTS', icon: FileSearch, desc: 'Artifact identification: artifacts recovered from the case and flagged for review.' },
  { id: '04', name: 'FILESYSTEM', icon: FolderSearch, desc: 'Filesystem analysis: volumes, directories and files with suspicious placement or names.' },
  { id: '05', name: 'MEMORY', icon: Cpu, desc: 'Memory-image analysis: processes, loaded modules and injected or masquerading behavior.' },
  { id: '06', name: 'LOGS', icon: ScrollText, desc: 'Log analysis: logon anomalies and audit log entries correlated with artifacts.' },
  { id: '07', name: 'TIMELINE', icon: ClipboardList, desc: 'Timeline reconstruction: a deterministic event timeline across every evidence source.' },
  { id: '08', name: 'INDICATORS', icon: Radar, desc: 'Indicator extraction: network and host indicators from the reconstructed case.' },
];

export interface TimbuktuRule {
  id: string;
  name: string;
  category: string;
  severity: string;
  checks: string;
}

export const RULES: TimbuktuRule[] = [
  { id: 'DFI-001', name: 'Evidence integrity failure', category: 'integrity', severity: 'critical', checks: 'evidence item failed integrity verification' },
  { id: 'DFI-002', name: 'Autorun persistence', category: 'persistence', severity: 'high', checks: 'autorun entry referencing a discovered artifact' },
  { id: 'DFI-003', name: 'Suspicious scheduled task', category: 'persistence', severity: 'high', checks: 'scheduled task executing from artifact path' },
  { id: 'DFI-004', name: 'Service with temp image path', category: 'persistence', severity: 'high', checks: 'service image path under a temp directory' },
  { id: 'DFI-005', name: 'Web shell deployed', category: 'intrusion', severity: 'critical', checks: 'script artifact under a web directory' },
  { id: 'DFI-006', name: 'Suspicious files in unusual locations', category: 'filesystem', severity: 'high', checks: 'file placed outside its normal directory' },
  { id: 'DFI-007', name: 'Suspicious process activity', category: 'memory', severity: 'critical', checks: 'process with injection or parent-child anomaly' },
  { id: 'DFI-008', name: 'Credential material on disk', category: 'credentials', severity: 'high', checks: 'credential-bearing artifacts found (redacted)' },
  { id: 'DFI-009', name: 'Logon anomalies detected', category: 'logs', severity: 'medium', checks: 'logon events outside normal patterns' },
  { id: 'DFI-010', name: 'Network indicators present', category: 'indicators', severity: 'medium', checks: 'network indicators extracted from case' },
  { id: 'DFI-011', name: 'HOSTS file modification', category: 'intrusion', severity: 'medium', checks: 'HOSTS entries redirecting traffic' },
  { id: 'DFI-012', name: 'Timeline coverage gap', category: 'timeline', severity: 'low', checks: 'gap in reconstructed timeline' },
  { id: 'DFI-013', name: 'Masquerading system binary', category: 'memory', severity: 'high', checks: 'binary impersonating a system image path' },
];

export const RULE_CATEGORIES: string[] = ['integrity', 'persistence', 'intrusion', 'filesystem', 'memory', 'credentials', 'logs', 'indicators', 'timeline'];

export const CONFIDENCE_STATES: string[] = ['confirmed', 'observed', 'probable', 'possible', 'unknown', 'not_observed'];

export const RISK_THRESHOLDS: { range: string; level: string }[] = [
  { range: '80–100', level: 'critical' },
  { range: '60–79', level: 'high' },
  { range: '35–59', level: 'medium' },
  { range: '1–34', level: 'low' },
  { range: '0', level: 'none' },
];

export const GITHUB_URL = 'https://github.com/QYVORA/qyvora-timbuktu';

export const BUILD_FROM_SOURCE = {
  requirements: 'Go 1.26+ toolchain. No external runtime dependencies.',
  steps: [
    { cmd: 'git clone --depth 1 https://github.com/QYVORA/qyvora-timbuktu' },
    { cmd: 'cd qyvora-timbuktu' },
    { cmd: 'go build ./cmd/timbuktu', note: 'Produces a single static binary named timbuktu' },
    { cmd: 'sudo install -m 0755 timbuktu /usr/local/bin/timbuktu', note: 'Adds timbuktu to your PATH without a package manager' },
  ],
};

export const QUICK_START = [
  'timbuktu assess --sim',
  'timbuktu case --out case.json',
  'timbuktu assess --case case.json',
  'timbuktu findings',
  'timbuktu evidence',
  'timbuktu report -o json',
];

export const AUTHORIZED_WARNING = {
  icon: ShieldAlert,
  title: 'Offline',
  accent: 'Forensic Investigations',
  description:
    'TIMBUKTU analyzes only the forensic case files it is explicitly pointed at. Live host acquisition is not implemented and is refused honestly; every session stays deterministic against a fixed evidence set.',
};

export const SOURCE_EXAMPLES: ToolSourceExample[] = [
  {
    id: 'entry',
    filename: 'main.go',
    label: 'CLI entry point',
    description: 'The binary hands control to the CLI layer; Execute returns an exit code so callers own process termination.',
    code: 'package main\n\nimport (\n\t"os"\n\n\t"github.com/QYVORA/qyvora-timbuktu/internal/cli"\n)\n\nfunc main() {\n\tos.Exit(cli.Execute())\n}',
  },
  {
    id: 'pipeline',
    filename: 'internal/analysis/analyst.go',
    label: 'Sequential assessment stages',
    description: 'The offline pipeline runs in a fixed order — acquisition → integrity → artifacts → filesystem → memory → logs → timeline → indicators → rule analysis → risk.',
    code: 'func Stages(reg *rules.Registry, cfg map[string]any, maxEntries int) []pipeline.Stage {\n\treturn []pipeline.Stage{\n\t\t{ID: "acquisition", Name: "Evidence acquisition", ...},\n\t\t{ID: "integrity", Name: "Evidence integrity", ...},\n\t\t// artifacts, filesystem, memory, logs, timeline, indicators, risk\n\t}\n}',
  },
  {
    id: 'rules',
    filename: 'internal/rules/builtin/builtin.go',
    label: 'Pure-function rules',
    description: 'Every rule is a pure function over the read-only assessment environment, so identical input always yields identical findings.',
    code: 'func evidenceIntegrityRule() *rules.Rule {\n\treturn &rules.Rule{\n\t\tID:       "DFI-001",\n\t\tName:     "Evidence integrity failure",\n\t\tCategory: "integrity",\n\t\tSeverity: models.SeverityCritical,\n\t\tDetect: func(ctx *rules.Context) []models.Finding {\n\t\t\t// ... pure function over verified evidence items\n\t\t},\n\t}\n}',
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