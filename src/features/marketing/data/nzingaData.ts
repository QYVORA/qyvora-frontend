import { Radar, Database, GitMerge, Network, ScanSearch, ShieldCheck, FileText, ShieldAlert, type LucideIcon } from 'lucide-react';
import type { ToolSourceExample } from '../components/tools/ToolSourceSection';

export interface NzingaStage {
  id: string;
  name: string;
  icon: LucideIcon;
  desc: string;
}

export const STAGES: NzingaStage[] = [
  { id: '01', name: 'DISCOVER', icon: Radar, desc: 'Validate and normalize the target, recording honest discovery hints without fabricating observations' },
  { id: '02', name: 'COLLECT', icon: Database, desc: 'Run enabled public sources (crt.sh CT logs, WHOIS, infrastructure, org, relationships) with bounded concurrency' },
  { id: '03', name: 'NORMALIZE', icon: GitMerge, desc: 'Normalize source payloads into typed observations with provenance: source, observed_at, collected_at, raw_reference' },
  { id: '04', name: 'CORRELATE', icon: Network, desc: 'Link observations across sources into entities and a typed relationship graph' },
  { id: '05', name: 'ANALYZE', icon: ScanSearch, desc: 'Evaluate evidence-backed claims against deterministic rules (OSINT-001..004) with confidence and severity' },
  { id: '06', name: 'VALIDATE', icon: ShieldCheck, desc: 'Confirm every finding traces to collected evidence; no absence is ever reported as absence-proof' },
  { id: '07', name: 'REPORT', icon: FileText, desc: 'Render terminal tables plus schema-versioned JSON, Markdown, HTML, YAML, and JSONL event streams' },
];

export interface NzingaRule {
  id: string;
  title: string;
  desc: string;
}

export const RULES: NzingaRule[] = [
  { id: 'OSINT-001', title: 'Username Reuse Across Sources', desc: 'A username observed on two or more independent platforms, indicating probable identity linkage across services' },
  { id: 'OSINT-002', title: 'Infrastructure Overlap Across Domains', desc: 'Two or more distinct domains resolve to the same hosting (shared IP/ASN), indicating common administration or a shared provider surface' },
  { id: 'OSINT-003', title: 'Personally Identifying Email Exposed', desc: 'An email address associated with the target appears in public WHOIS registry data or certificate logs, exposing a contact vector' },
  { id: 'OSINT-004', title: 'DNS Wildcard Resolves Unknown Hostnames', desc: 'The zone resolves arbitrary non-existent hostnames, degrading passive hostname discovery and subdomain enumeration' },
];

export const GITHUB_URL = 'https://github.com/QYVORA/qyvora-nzinga';

export const BUILD_FROM_SOURCE = {
  requirements: 'Go 1.26+ toolchain. No external runtime dependencies.',
  steps: [
    { cmd: 'git clone https://github.com/QYVORA/qyvora-nzinga' },
    { cmd: 'cd qyvora-nzinga' },
    { cmd: 'make build', note: 'Produces bin/nzinga stamped with build version' },
    { cmd: 'make install-user', note: 'Installs ~/.local/bin/nzinga with desktop entry + logo. System-wide: sudo make install' },
  ],
};

export const QUICK_START = [
  'nzinga assess --sim',
  'nzinga assess -y domain:example.com --profile standard -o json',
  'nzinga sources list',
  'nzinga capabilities',
  'nzinga findings -f json',
  'nzinga relationship graph',
];

export const AUTHORIZED_WARNING = {
  icon: ShieldAlert,
  title: 'Authorized',
  accent: 'Access Only',
  description:
    'nzinga performs authorized reconnaissance only. Live collection requires explicit authorization (--authorized / -y, config, or QYVORA_AUTHORIZED=true); the built-in simulator (--sim) runs offline against a deterministic dataset. --dry-run plans the run and shows which sources would execute without touching the network.',
};

export const SOURCE_EXAMPLES: ToolSourceExample[] = [
  {
    id: 'entry',
    filename: 'cmd/nzinga/main.go',
    label: 'CLI entry point',
    description: 'Single static binary delegating to the CLI layer. Execute returns typed exit codes for pipeline automation.',
    code: 'package main\n\nimport (\n\t"os"\n\n\t"github.com/QYVORA/qyvora-nzinga/internal/cli"\n)\n\nfunc main() {\n\tos.Exit(cli.Execute())\n}',
  },
  {
    id: 'source',
    filename: 'internal/intelligence/sources/crt_sh.go',
    label: 'Source contract',
    description: 'Every public source self-describes its capabilities so the collector only runs sources that exist for the target.',
    code: 'type crtSh struct {\n\tclient *Client\n}\n\nfunc NewCrtSh(client *Client) *crtSh {\n\treturn &crtSh{client: client}\n}\n\nfunc (c *crtSh) Capabilities() []models.Capability {\n\treturn []models.Capability{models.CapCertEnumerate, models.CapSubdomainEnumerate}\n}',
  },
  {
    id: 'pipeline',
    filename: 'internal/pipeline/pipeline.go',
    label: 'Ordered stages',
    description: 'A fixed execution order from target discovery through reporting; each stage consumes the previous stage’s output.',
    code: 'func runStage(name string, ctx context.Context, env *core.Env) error {\n\tswitch name {\n\tcase StageDiscover:\n\t\treturn discover(ctx, env)\n\tcase StageCollect:\n\t\treturn collect(ctx, env)\n\tcase StageNormalize:\n\t\treturn normalize(ctx, env)\n\tcase StageCorrelate:\n\t\treturn correlate(ctx, env)\n\tcase StageAnalyze:\n\t\treturn analyze(ctx, env)\n\tcase StageValidate:\n\t\treturn validate(ctx, env)\n\tcase StageReport:\n\t\treturn report(ctx, env)\n\tdefault:\n\t\treturn fmt.Errorf("unknown stage %q", name)\n\t}\n}',
  },
  {
    id: 'rules',
    filename: 'internal/rules/builtin/builtin.go',
    label: 'Deterministic rules engine',
    description: 'Built-in correlation rules turn evidence-backed claims into findings with confidence, severity, and remediation.',
    code: 'rule := &rules.Rule{\n\tID:          "OSINT-001",\n\tName:        "Username reuse across sources",\n\tCategory:    "identity-reuse",\n\tSeverity:    models.SeverityInformational,\n\tConfidence:  models.ConfidenceProbable,\n\tObjectTypes: []string{"username"},\n\tDetect: func(ctx *rules.Context) []*models.Finding {\n\t\t// observations -> evidence-backed findings\n\t\t...\n\t},\n}',
  },
];