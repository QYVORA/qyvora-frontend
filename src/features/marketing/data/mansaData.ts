import { Antenna, ScanSearch, Activity, BrainCircuit, ShieldCheck, ListChecks, Gauge, FileText, ShieldAlert, type LucideIcon } from 'lucide-react';
import type { ToolSourceExample } from '../components/tools/ToolSourceSection';

export interface MansaStage {
  id: string;
  name: string;
  icon: LucideIcon;
  desc: string;
}

export const STAGES: MansaStage[] = [
  { id: '01', name: 'DISCOVER', icon: Antenna, desc: 'List wireless interfaces and their capabilities (bands, modes, power). Live drivers via iw/devicelist, or the deterministic simulated dataset in --sim.' },
  { id: '02', name: 'ENUMERATE', icon: ScanSearch, desc: 'Scan for access points and record the radio-level profile: BSSID, SSID, channel, band, RSSI, supported protocols and cipher suites.' },
  { id: '03', name: 'OBSERVE', icon: Activity, desc: 'Watch stations and traffic on the observed networks — client behavior, association patterns, signal anomalies, and cleartext/legacy-cipher exposure.' },
  { id: '04', name: 'ANALYZE', icon: BrainCircuit, desc: 'Run the deterministic rule engine (WLAN-001+) over the session: every rule is a pure function that returns identical findings for identical input.' },
  { id: '05', name: 'VALIDATE', icon: ShieldCheck, desc: 'Cross-check each finding against raw evidence; confidence is upgraded or held until the observation is confirmed on the recorded data.' },
  { id: '06', name: 'FINDINGS', icon: ListChecks, desc: 'Deterministic finding IDs derived from the rule (WLAN-<category>-<hash>), each carrying the triggering evidence record for independent verification.' },
  { id: '07', name: 'RISK', icon: Gauge, desc: 'Transparent scoring: severity_weight × confidence × exposure_factor × 35, capped at 100, mapped to critical / high / medium / low / none.' },
  { id: '08', name: 'REPORT', icon: FileText, desc: 'Terminal, markdown or JSON reports plus a machine-readable JSONL event stream (schema_version, execution_id, framework) for agents and CI.' },
];

export interface MansaRule {
  id: string;
  name: string;
  category: string;
  severity: string;
  checks: string;
}

export const RULES: MansaRule[] = [
  { id: 'WLAN-001', name: 'Open Wireless Network', category: 'open-network', severity: 'high', checks: 'security.enabled == false' },
  { id: 'WLAN-002', name: 'WEP Encryption Detected', category: 'weak-crypto', severity: 'critical', checks: 'protocol list contains WEP' },
  { id: 'WLAN-003', name: 'WPA1 with TKIP Cipher', category: 'weak-crypto', severity: 'high', checks: 'exact protocol WPA / WPA1 + cipher TKIP' },
  { id: 'WLAN-004', name: 'WPA2 with TKIP Cipher', category: 'weak-crypto', severity: 'medium', checks: 'exact protocol WPA2 + cipher TKIP' },
  { id: 'WLAN-005', name: 'WPS Enabled', category: 'config-weakness', severity: 'medium', checks: 'security.wps == true' },
  { id: 'WLAN-006', name: 'No Security Protocols', category: 'open-network', severity: 'high', checks: 'enabled == false and protocol list empty' },
  { id: 'WLAN-010', name: 'Crowded Channel', category: 'rf-analysis', severity: 'low', checks: '≥3 APs share the same channel' },
  { id: 'WLAN-011', name: 'Overlapping 2.4 GHz Channels', category: 'rf-analysis', severity: 'low', checks: 'two 2.4 GHz APs within 5 channels' },
  { id: 'WLAN-012', name: 'Dense 6 GHz Deployment', category: 'rf-analysis', severity: 'info', checks: '≥5 APs detected in the 6 GHz band' },
  { id: 'WLAN-020', name: 'Extremely Strong Signal', category: 'rf-analysis', severity: 'info', checks: 'RSSI > −20 dBm' },
  { id: 'WLAN-030', name: 'Legacy Protocol Support', category: 'config-weakness', severity: 'low', checks: 'capabilities contain 802.11b / 802.11g' },
];

export const RULE_CATEGORIES: string[] = ['open-network', 'weak-crypto', 'config-weakness', 'rf-analysis'];

export const CONFIDENCE_STATES: string[] = ['confirmed', 'observed', 'probable', 'possible', 'unknown', 'not_observed'];

export const RISK_THRESHOLDS: { range: string; level: string }[] = [
  { range: '80–100', level: 'critical' },
  { range: '60–79', level: 'high' },
  { range: '35–59', level: 'medium' },
  { range: '1–34', level: 'low' },
  { range: '0', level: 'none' },
];

export const GITHUB_URL = 'https://github.com/QYVORA/qyvora-mansa';

export const BUILD_FROM_SOURCE = {
  requirements: 'Go 1.26+ toolchain. No external runtime dependencies.',
  steps: [
    { cmd: 'git clone https://github.com/QYVORA/qyvora-mansa' },
    { cmd: 'cd qyvora-mansa' },
    { cmd: 'make build', note: 'Produces the mansa binary stamped with the build version' },
    { cmd: 'make install-user', note: 'Installs ~/.local/bin/mansa. System-wide: sudo make install' },
  ],
};

export const QUICK_START = [
  'mansa assess --sim',
  'mansa discover --sim',
  'mansa scan --sim',
  'mansa enumerate --sim',
  'mansa observe --sim',
  'mansa analyze',
  'mansa findings',
  'mansa evidence',
  'mansa report -f json --out report.json',
];

export const AUTHORIZED_WARNING = {
  icon: ShieldAlert,
  title: 'Authorized',
  accent: 'Wireless Assessments',
  description:
    'MANSA assesses only the wireless networks and interfaces you explicitly declare and have authorization to test. Live scopes require an explicit authorization acknowledgement, while --sim runs the full deterministic pipeline offline against the built-in simulated dataset.',
};

export const SOURCE_EXAMPLES: ToolSourceExample[] = [
  {
    id: 'entry',
    filename: 'main.go',
    label: 'CLI entry point',
    description: 'The binary hands control to the CLI layer; Execute returns an exit code so callers own process termination.',
    code: 'package main\n\nimport (\n\t"os"\n\n\t"github.com/QYVORA/qyvora-mansa/internal/cli"\n)\n\nfunc main() {\n\tos.Exit(cli.Execute())\n}',
  },
  {
    id: 'pipeline',
    filename: 'internal/pipeline/pipeline.go',
    label: 'Deterministic stage runner',
    description: 'Eight sequential stages — discover → enumerate → observe → analyze → validate → findings → risk → report. RunUntil lets a command stop after any stage while keeping the sequence canonical.',
    code: 'const StageDiscover = "discover"\n// ... StageEnumerate, StageObserve, StageAnalyze,\n//     StageValidate, StageFindings, StageRisk, StageReport\n\nvar StageOrder = []string{\n\tStageDiscover, StageEnumerate, StageObserve, StageAnalyze,\n\tStageValidate, StageFindings, StageRisk, StageReport,\n}',
  },
  {
    id: 'rules',
    filename: 'internal/rules/builtin/builtin.go',
    label: 'Pure-function rules',
    description: 'Every rule is a pure function over the read-only session context, so identical input always yields identical findings.',
    code: 'func openNetworkRule() *rules.Rule {\n\treturn &rules.Rule{\n\t\tID:       "WLAN-001",\n\t\tName:     "Open Wireless Network",\n\t\tCategory: "open-network",\n\t\tSeverity: models.SeverityHigh,\n\t\tDetect: func(ctx *rules.Context) []models.Finding {\n\t\t\t// ... pure function over ctx.APs\n\t\t},\n\t}\n}',
  },
  {
    id: 'risk',
    filename: 'internal/risk/risk.go',
    label: 'Transparent risk scoring',
    description: 'Aggregate risk is the average per-finding score of severity_weight × confidence × exposure_factor × 35 (capped at 100), mapped to a level via LevelFromScore.',
    code: 'total := 0\nfor _, f := range findings {\n\ttotal += models.ScoreFor(f)\n}\navg := total / len(findings)\nreturn avg, string(models.LevelFromScore(avg))',
  },
  {
    id: 'evidence',
    filename: 'internal/evidence/evidence.go',
    label: 'Evidence collection',
    description: 'Every finding carries at least one Evidence record. Each record captures the exact observation that triggered the rule, hashed so it can be independently verified across sessions.',
    code: 'func Collect(sess *models.Session, kind models.EvidenceKind, source, target, detail string) {\n\te := models.Evidence{\n\t\tID: models.NewID("ev"), Kind: kind,\n\t\tSource: source, Target: target, Detail: detail,\n\t}\n\tif e.Hash == "" {\n\t\th := sha256.Sum256([]byte(source + "\\x00" + target + "\\x00" + detail))\n\t\te.Hash = fmt.Sprintf("%x", h)\n\t}\n\tsess.AddEvidence(e)\n}',
  },
];