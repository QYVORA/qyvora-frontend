import { Radar, ListChecks, ScanSearch, GitBranch, Network, FileSearch, Waypoints, ShieldCheck, Crosshair, Gauge, FileText, ShieldAlert, type LucideIcon } from 'lucide-react';
import type { ToolSourceExample } from '../components/tools/ToolSourceSection';

export interface AksumStage {
  id: string;
  name: string;
  icon: LucideIcon;
  desc: string;
}

export const STAGES: AksumStage[] = [
  { id: '01', name: 'IDENTIFY', icon: Radar, desc: 'Format, architecture, linking and hardening posture. PIE/NX/RELRO/canary/fortify with honest unknown values' },
  { id: '02', name: 'ENUMERATE', icon: ListChecks, desc: 'Sections, segments, symbols and imports grouped by security relevance' },
  { id: '03', name: 'STRINGS', icon: ScanSearch, desc: 'Printable-string extraction with URL/path/command/crypto/credential classification and confidence levels' },
  { id: '04', name: 'DISASSEMBLY', icon: GitBranch, desc: 'x86/x86-64 linear sweep with structured operands, resolved branch targets and CET-aware decoding' },
  { id: '05', name: 'FUNCTIONS', icon: Network, desc: 'Multi-source discovery: symbols, entry point, call targets. Each function carries provenance and confidence' },
  { id: '06', name: 'GRAPHS', icon: FileSearch, desc: 'Basic-block CFGs with loop and unreachable detection, direct-call graph, code/data cross-references' },
  { id: '07', name: 'DATAFLOW', icon: Waypoints, desc: 'Intra-procedural call-site argument tracking. PLT stubs resolved to import names via relocations, string arguments recovered where statically materialized' },
  { id: '08', name: 'VALIDATION', icon: ShieldCheck, desc: 'Confidence escalation: findings rise to VALIDATED only when independent evidence such as resolved call sites corroborates them' },
  { id: '09', name: 'SURFACE', icon: Crosshair, desc: 'Attack-surface aggregation: entry points, security-relevant import categories, exports and string classes as observation counts' },
  { id: '10', name: 'REPORT', icon: FileText, desc: 'Terminal summary or schema_version-1.0 JSON with per-run SHA-256 anchoring and JSONL event streams' },
];

export interface AksumCheck {
  id: string;
  title: string;
  desc: string;
}

export const CHECKS: AksumCheck[] = [
  { id: 'no-nx', title: 'Hardening posture', desc: 'NX/PIE/RELRO/canary read directly from program headers and dynamic entries; violated properties surface as no-nx, no-pie, no-relro, partial-relro and no-canary findings' },
  { id: 'wx-segment', title: 'Writable + executable segments', desc: 'W^X violations detected from segment permission flags' },
  { id: 'dangerous-import-<symbol>', title: 'Dangerous imports', desc: 'gets, strcpy, strcat, sprintf, vsprintf, system and popen reported as CANDIDATE, never as verdicts' },
  { id: 'dangerous-call-<symbol>', title: 'Dangerous call sites', desc: 'Dataflow-resolved calls to the above APIs with a statically materialized string argument; raised to VALIDATED with callsite evidence' },
  { id: 'weak-crypto-<token>', title: 'Weak crypto signals', desc: 'md5, sha1, des, rc4 and ecb markers in strings flagged at SUSPECTED for manual review' },
  { id: 'sensitive-string', title: 'Sensitive strings', desc: 'Password / private-key / api-key shaped naming patterns flagged at SUSPECTED' },
  { id: 'execution-surface', title: 'Execution surface', desc: 'Process-spawning APIs summarized as attack-surface context at OBSERVED' },
];

export const CONFIDENCE_STATES: string[] = ['OBSERVED', 'CANDIDATE', 'SUSPECTED', 'VALIDATED', 'CONFIRMED'];

export const GITHUB_URL = 'https://github.com/QYVORA/qyvora-aksum';

export const BUILD_FROM_SOURCE = {
  requirements: 'Go 1.26+ toolchain. No external runtime dependencies.',
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
    'AKSUM is a static analysis platform: it reads files but never executes them or touches a network. Analyze only software you own or have explicit written permission to assess.',
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
    description: 'The dataflow engine resolves PLT stubs to import names via R_X86_64_JUMP_SLOT relocations (resolveStub) and recovers string arguments where statically materialized (stringAt).',
    code: 'func (e *Engine) resolveStub(f *functions.Function) string {\n\t// scan for jmp qword [rip+disp], resolve the GOT slot\n\t// and look it up in e.gotToSym (built from JUMP_SLOT relocations)\n\t...\n}\n\nsym := e.resolveStub(f)\nif content, isStr := e.stringAt[v.addr]; isStr {\n\t// statically materialized string argument recovered\n\t...\n}',
  },
  {
    id: 'validation',
    filename: 'internal/validation/validation.go',
    label: 'Corroborated escalation',
    description: 'Findings escalate only when independent evidence agrees: a dangerous import becomes VALIDATED when the dataflow engine resolves a call site passing it a statically materialized string. Escalation appends a "callsite" evidence record.',
    code: 'if e.Kind == "import" && e.Location != "" {\n\tsyms = append(syms, e.Location)\n}\n...\nif f.Confidence.Rank() < findings.ConfValidated.Rank() {\n\tf.Confidence = findings.ConfValidated\n\tf.Evidence = append(f.Evidence, findings.Evidence{Kind: findings.KindCallSite, Location: site.Symbol})\n}',
  },
];
