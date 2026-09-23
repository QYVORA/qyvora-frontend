import { FileSearch, Hash, FileText, FileCode2, Scroll, Activity, Network, Crosshair, ShieldAlert, type LucideIcon } from 'lucide-react';
import type { ToolSourceExample } from '../components/tools/ToolSourceSection';

export interface KushStage {
  id: string;
  name: string;
  icon: LucideIcon;
  desc: string;
}

export const STAGES: KushStage[] = [
  { id: '01', name: 'INTAKE', icon: FileSearch, desc: 'Sample intake: sample id, format, name and source recorded from the offline document.' },
  { id: '02', name: 'HASH', icon: Hash, desc: 'Sample hashing: md5, sha1 and sha256 fingerprints computed for correlation and reporting.' },
  { id: '03', name: 'METADATA', icon: FileText, desc: 'Metadata extraction: compiler, architecture, target OS, entropy and packer detection.' },
  { id: '04', name: 'STATIC', icon: FileCode2, desc: 'Static analysis: imports, sections, embedded content and suspicious routines; nothing executes.' },
  { id: '05', name: 'STRINGS', icon: Scroll, desc: 'Strings analysis: notable strings, URL/socket literals and encoded command launchers.' },
  { id: '06', name: 'BEHAVIOR', icon: Activity, desc: 'Behavioral surface: reads sandbox observations only; samples are never executed on the developer host.' },
  { id: '07', name: 'NETWORK', icon: Network, desc: 'Network indicators: C2 domains, IPs and other network artifacts extracted from the sample.' },
  { id: '08', name: 'IOC', icon: Crosshair, desc: 'IOC extraction and threat classification from the corroborated indicator set.' },
];

export interface KushRule {
  id: string;
  name: string;
  category: string;
  severity: string;
  checks: string;
}

export const RULES: KushRule[] = [
  { id: 'KSH-001', name: 'Suspicious process-spawning imports', category: 'execution', severity: 'high', checks: 'imports capable of spawning processes' },
  { id: 'KSH-002', name: 'Packed or high-entropy binary', category: 'obfuscation', severity: 'medium', checks: 'packer detected or entropy above threshold' },
  { id: 'KSH-003', name: 'Unsigned binary with no publisher', category: 'authenticode', severity: 'medium', checks: 'no signature or publisher present' },
  { id: 'KSH-004', name: 'Persistent autostart mechanism', category: 'persistence', severity: 'high', checks: 'autostart / run key references sample' },
  { id: 'KSH-005', name: 'Command-and-control indicators', category: 'command-and-control', severity: 'critical', checks: 'C2 domains or IPs found in strings/network surface' },
  { id: 'KSH-006', name: 'Encoded command launcher', category: 'execution', severity: 'high', checks: 'powershell -enc / encodedcommand present' },
  { id: 'KSH-007', name: 'Embedded staged payload', category: 'payload', severity: 'medium', checks: 'embedded payload or shellcode structure' },
  { id: 'KSH-008', name: 'Browser user-agent impersonation', category: 'exfiltration', severity: 'medium', checks: 'UA strings used to blend exfil traffic' },
  { id: 'KSH-009', name: 'Socket imports with process access', category: 'execution', severity: 'medium', checks: 'networking imports combined with process access' },
  { id: 'KSH-010', name: 'Verified high-confidence IOC catalog', category: 'ioc', severity: 'informational', checks: 'IOCs verified against sample surfaces (hash, domain, ip)' },
  { id: 'KSH-011', name: 'Behavioral anomalies from sandbox', category: 'behavior', severity: 'high', checks: 'sandbox observations flag anomalous activity' },
  { id: 'KSH-012', name: 'Dynamic execution on developer host refused', category: 'behavior', severity: 'low', checks: 'sample is never executed locally' },
  { id: 'KSH-013', name: 'Process injection primitives', category: 'execution', severity: 'high', checks: 'memory/allocation + write + execute primitive imports' },
  { id: 'KSH-014', name: 'Writable-and-executable section', category: 'obfuscation', severity: 'medium', checks: 'section with writable and executable flags' },
];

export const RULE_CATEGORIES: string[] = ['execution', 'obfuscation', 'authenticode', 'persistence', 'command-and-control', 'payload', 'exfiltration', 'ioc', 'behavior'];

export const CONFIDENCE_STATES: string[] = ['confirmed', 'observed', 'probable', 'possible', 'unknown', 'not_observed'];

export const RISK_THRESHOLDS: { range: string; level: string }[] = [
  { range: '80–100', level: 'critical' },
  { range: '60–79', level: 'high' },
  { range: '35–59', level: 'medium' },
  { range: '1–34', level: 'low' },
  { range: '0', level: 'none' },
];

export const GITHUB_URL = 'https://github.com/QYVORA/qyvora-kush';

export const BUILD_FROM_SOURCE = {
  requirements: 'Go 1.26+ toolchain. No external runtime dependencies.',
  steps: [
    { cmd: 'git clone --depth 1 https://github.com/QYVORA/qyvora-kush' },
    { cmd: 'cd qyvora-kush' },
    { cmd: 'go build ./cmd/kush', note: 'Produces a single static binary named kush' },
    { cmd: 'sudo install -m 0755 kush /usr/local/bin/kush', note: 'Adds kush to your PATH without a package manager' },
  ],
};

export const QUICK_START = [
  'kush assess --sim',
  'kush sample --out sample.json',
  'kush assess --sample sample.json',
  'kush findings',
  'kush evidence',
  'kush report -o json',
];

export const AUTHORIZED_WARNING = {
  icon: ShieldAlert,
  title: 'Static',
  accent: 'Malware Analysis',
  description:
    'KUSH analyzes only the sample documents it is explicitly pointed at. Samples are never executed on the developer host: dynamic execution is not implemented and is refused honestly, so behavioral data can only come from a strongly isolated sandbox you attach explicitly.',
};

export const SOURCE_EXAMPLES: ToolSourceExample[] = [
  {
    id: 'entry',
    filename: 'main.go',
    label: 'CLI entry point',
    description: 'The binary hands control to the CLI layer; Execute returns an exit code so callers own process termination.',
    code: 'package main\n\nimport (\n\t"os"\n\n\t"github.com/QYVORA/qyvora-kush/internal/cli"\n)\n\nfunc main() {\n\tos.Exit(cli.Execute())\n}',
  },
  {
    id: 'pipeline',
    filename: 'internal/analysis/analyst.go',
    label: 'Sequential assessment stages',
    description: 'The offline pipeline runs in a fixed order: intake → hashing → metadata → static → strings → behavior → network → IOC → rule analysis → risk.',
    code: 'func Stages(reg *rules.Registry, cfg map[string]any, maxEntries int) []pipeline.Stage {\n\treturn []pipeline.Stage{\n\t\t{ID: "intake", Name: "Sample intake", ...},\n\t\t{ID: "hashing", Name: "Hashing", ...},\n\t\t// metadata, static, strings, behavior, network, ioc, risk\n\t}\n}',
  },
  {
    id: 'rules',
    filename: 'internal/rules/builtin/builtin.go',
    label: 'Pure-function rules',
    description: 'Every rule is a pure function over the read-only assessment environment, so identical input always yields identical findings.',
    code: 'func c2IndicatorsRule() *rules.Rule {\n\treturn &rules.Rule{\n\t\tID:       "KSH-005",\n\t\tName:     "Command-and-control indicators",\n\t\tCategory: "command-and-control",\n\t\tSeverity: models.SeverityCritical,\n\t\tDetect: func(ctx *rules.Context) []models.Finding {\n\t\t\t// ... pure function over the C2 indicator set\n\t\t},\n\t}\n}',
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