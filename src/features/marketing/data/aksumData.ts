import { Radar, ListChecks, ScanSearch, GitBranch, Network, FileSearch, Waypoints, ShieldCheck, Crosshair, Gauge, FileText, ShieldAlert, type LucideIcon } from 'lucide-react';
import type { ToolSourceExample } from '../components/tools/ToolSourceSection';

export interface AksumStage {
  id: string;
  name: string;
  icon: LucideIcon;
  desc: string;
}

export const STAGES: AksumStage[] = [
  { id: '01', name: 'IDENTIFY', icon: Radar, desc: 'Format, architecture, linking and hardening posture — PIE/NX/RELRO/canary/fortify with honest unknown values' },
  { id: '02', name: 'ENUMERATE', icon: ListChecks, desc: 'Sections, segments, symbols and imports grouped by security relevance' },
  { id: '03', name: 'STRINGS', icon: ScanSearch, desc: 'Printable-string extraction with URL/path/command/crypto/credential classification and confidence levels' },
  { id: '04', name: 'DISASSEMBLY', icon: GitBranch, desc: 'x86/x86-64 linear sweep with structured operands, resolved branch targets and CET-aware decoding' },
  { id: '05', name: 'FUNCTIONS', icon: Network, desc: 'Multi-source discovery — symbols, entry point, call targets — each function carries provenance and confidence' },
  { id: '06', name: 'GRAPHS', icon: FileSearch, desc: 'Basic-block CFGs with loop and unreachable detection, direct-call graph, code/data cross-references' },
  { id: '07', name: 'DATAFLOW', icon: Waypoints, desc: 'Intra-procedural call-site argument tracking — PLT stubs resolved to import names via relocations, string arguments recovered where statically materialized' },
  { id: '08', name: 'VALIDATION', icon: ShieldCheck, desc: 'Confidence escalation — findings rise to VALIDATED only when independent evidence such as resolved call sites corroborates them' },
  { id: '09', name: 'SURFACE', icon: Crosshair, desc: 'Attack-surface aggregation — entry points, security-relevant import categories, exports and string classes as observation counts' },
  { id: '10', name: 'REPORT', icon: FileText, desc: 'Terminal summary or schema_version-1.0 JSON with per-run SHA-256 anchoring and JSONL event streams' },
];

export interface AksumCheck {
  id: string;
  title: string;
  desc: string;
}

export const CHECKS: AksumCheck[] = [
  { id: 'AKS-HARD', title: 'Hardening posture', desc: 'NX/PIE/RELRO/canary read directly from program headers and dynamic entries — disabled properties are findings' },
  { id: 'AKS-WX', title: 'Writable + executable segments', desc: 'W^X violations detected from segment permission flags' },
  { id: 'AKS-IMP', title: 'Dangerous imports', desc: 'gets, strcpy, sprintf, system, popen and friends — reported as CANDIDATE, never as verdicts' },
  { id: 'AKS-DCS', title: 'Dangerous call sites', desc: 'system/popen/exec-family calls whose string arguments resolve statically are escalated to VALIDATED with callsite evidence' },
  { id: 'AKS-CRY', title: 'Weak crypto signals', desc: 'MD5/SHA1/DES/RC4/ECB markers in strings — escalated only when dataflow resolves corroborating usage' },
  { id: 'AKS-SEC', title: 'Sensitive strings', desc: 'Password/key-shaped naming patterns flagged for manual review' },
  { id: 'AKS-SRF', title: 'Execution surface', desc: 'Process-spawning APIs summarized as attack-surface context' },
];

export const CONFIDENCE_STATES: string[] = ['OBSERVED', 'CANDIDATE', 'SUSPECTED', 'VALIDATED', 'CONFIRMED'];

export const GITHUB_URL = 'https://github.com/QYVORA/qyvora-aksum';

export const BUILD_FROM_SOURCE = {
  requirements: 'Go 1.22+ toolchain. No external runtime dependencies.',
  steps: [
    { cmd: 'git clone https://github.com/QYVORA/qyvora-aksum' },
    { cmd: 'cd qyvora-aksum' },
    { cmd: 'make build', note: 'Produces bin/aksum stamped with the build version' },
    { cmd: 'make install-user', note: 'Installs ~/.local/bin/aksum with desktop entry + logo. System-wide: sudo make install' },
  ],
};

export const QUICK_START = [
  'aksum binary /usr/bin/ls',
  'aksum analyze /usr/bin/ls',
  'aksum surface /usr/bin/ls',
  'aksum functions ./target -f json > funcs.json',
  'aksum xrefs ./target --string "Usage: %s"',
  'aksum analyze ./target --report report.json',
  'aksum dynamic plan ./target --yes',
];

export const AUTHORIZED_WARNING = {
  icon: ShieldAlert,
  title: 'Authorized',
  accent: 'Analysis Only',
  description:
    'AKSUM is a static analysis platform — it reads files, it never executes them or touches a network. Analyze only software you own or have explicit written permission to assess.',
};

export const SOURCE_EXAMPLES: ToolSourceExample[] = [
  {
    id: 'entry',
    filename: 'main.go',
    label: 'CLI entry point',
    description: 'The binary hands control to the CLI layer; Execute returns an exit code so callers own process termination.',
    code: 'package main\n\nimport (\n\t"os"\n\n\t"github.com/QYVORA/qyvora-aksum/internal/cli"\n)\n\nfunc main() {\n\tos.Exit(cli.Execute())\n}',
  },
  {
    id: 'decoder',
    filename: 'internal/disasm/x86/x86.go',
    label: 'Structured decoding',
    description: 'Instructions decode into data (mnemonic, operands, flow class, targets) so downstream stages consume structure, not text dumps. CET endbr64/endbr32 are pre-decoded to prevent desync.',
    code: 'func (d *Decoder) Decode(code []byte, base uint64) ([]disasm.Instruction, error) {\n\tfor off := 0; off < len(code); {\n\t\tif n, name := endbrAt(code[off:]); n > 0 {\n\t\t\t// CET terminator-inhibit: emit synthetic ENDBR instruction\n\t\t\t...\n\t\t}\n\t\tinst, err := x86asm.Decode(code[off:], mode)\n\t\t...',
  },
  {
    id: 'dataflow',
    filename: 'internal/dataflow/dataflow.go',
    label: 'Call-site resolution',
    description: 'The dataflow engine tracks register and stack state through each function body. PLT stubs are matched to import names via relocations, so call sites carry real callee identities and arguments.',
    code: 'cs := e.resolvePLTSite(f, in)\nif cs != nil && len(cs.Args) > 0 {\n\te.sites = append(e.sites, *cs)\n}\n...\ntext, ok := e.strAt(arg.Address) // static string argument',
  },
  {
    id: 'validation',
    filename: 'internal/validation/validation.go',
    label: 'Corroborated escalation',
    description: 'Findings escalate only when independent evidence agrees: a dangerous import becomes VALIDATED when the dataflow engine resolves a call site passing it a static string.',
    code: 'if corroborated(fs[i], site) {\n\tfs[i].Confidence = findings.ConfValidated\n\tfs[i].Evidence = append(fs[i].Evidence, callsiteEvidence(site))\n}',
  },
];
