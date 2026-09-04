import { Radar, Layers3, Repeat2, PlayCircle, Tag, Fingerprint, Waypoints, Gauge, Scissors, FileText, ShieldAlert, type LucideIcon } from 'lucide-react';
import type { ToolSourceExample } from '../components/tools/ToolSourceSection';

export interface SekhmetStage {
  id: string;
  name: string;
  icon: LucideIcon;
  desc: string;
}

export const STAGES: SekhmetStage[] = [
  { id: '01', name: 'BASELINE', icon: Radar, desc: "Profile the target's normal behaviour first: exit codes, signals, runtime and output variance. Every later result is judged against this profile, never fuzzed blindly." },
  { id: '02', name: 'CORPUS', icon: Layers3, desc: 'Persistent seed store with SHA-256 dedup, priority ordering and trimming so interesting inputs survive and noise does not.' },
  { id: '03', name: 'MUTATE', icon: Repeat2, desc: '17 structured operators (bit/byte, block, dictionary insert, JSON structure, boundary, length, splice) driven by a seeded RNG for reproducibility.' },
  { id: '04', name: 'EXECUTE', icon: PlayCircle, desc: 'Three execution modes: process with {fuzz}/{stdin} templates (no shell), HTTP payload delivery, and a deterministic simulation target for CI.' },
  { id: '05', name: 'CLASSIFY', icon: Tag, desc: 'Crash, hang, and anomaly classification relative to the baseline, with ASan / UBSan / MSan report text matching on top of signal detection.' },
  { id: '06', name: 'DEDUP', icon: Fingerprint, desc: 'SHA-256 signature over normalized stderr + signal + exit class collapses thousands of near-identical crashes into unique findings.' },
  { id: '07', name: 'FEEDBACK', icon: Waypoints, desc: 'Novelty scoring over behavioral / edge / block coverage keeps the campaign aimed at code it has not reached yet.' },
  { id: '08', name: 'SCHEDULE', icon: Gauge, desc: 'Power scheduling across fast / explore / exploit / rare / balanced / adaptive strategies, all mutex-safe under parallel workers.' },
  { id: '09', name: 'MINIMIZE', icon: Scissors, desc: 'Delta-debugging reducer turns an interesting input into a minimal reproducer you can actually read.' },
  { id: '10', name: 'REPORT', icon: FileText, desc: 'Terminal, JSON or YAML reporting with a JSONL event stream (schema_version, execution_id, framework) that agents and CI consume directly.' },
];

export interface SekhmetDetector {
  id: string;
  title: string;
  desc: string;
}

export const DETECTORS: SekhmetDetector[] = [
  { id: 'SEK-CRSH', title: 'Crash classification', desc: 'Signal-aware detection (SIGSEGV, SIGABRT, timeout, nonzero exit) with platform signal naming and baseline exit-class comparison' },
  { id: 'SEK-HANG', title: 'Hang / runaway', desc: 'Per-execution timeouts flag stuck or infinite-loop behaviour that never returns' },
  { id: 'SEK-ANOM', title: 'Baseline deviation', desc: 'Results that diverge from the profiled normal distribution (unexpected exit, output variance, runtime spikes) are surfaced as anomalies' },
  { id: 'SEK-SANZ', title: 'Sanitizer reports', desc: 'AddressSanitizer / UBSan / MSan output text matched into typed findings with normalized stderr fingerprinting' },
  { id: 'SEK-SIGN', title: 'Signature dedup', desc: 'SHA-256 fingerprint over normalized stderr + signal + exit class so 1,000 near-identical crashes become one finding' },
];

export const CONFIDENCE_STATES: string[] = ['low', 'medium', 'high', 'confirmed'];

export const GITHUB_URL = 'https://github.com/QYVORA/qyvora-Sekhmet';

export const BUILD_FROM_SOURCE = {
  requirements: 'Go 1.26+ toolchain. No external runtime dependencies.',
  steps: [
    { cmd: 'git clone https://github.com/QYVORA/qyvora-Sekhmet' },
    { cmd: 'cd qyvora-sekhmet' },
    { cmd: 'make build', note: 'Produces bin/sekhmet stamped with the build version' },
    { cmd: 'make install-user', note: 'Installs ~/.local/bin/sekhmet with logo + desktop entry. System-wide: sudo make install' },
  ],
};

export const QUICK_START = [
  'sekhmet target set --name sim --kind simulation',
  'sekhmet baseline --target sim',
  'sekhmet fuzz --target sim --runs 100000',
  'sekhmet crashes --session <id>',
  'sekhmet minimize --input interesting.bin',
  'sekhmet report --session <id> --format json > report.json',
];

export const AUTHORIZED_WARNING = {
  icon: ShieldAlert,
  title: 'Authorized',
  accent: 'Scoped Fuzzing',
  description:
    'SEKHMET is a baseline-aware fuzzing and vulnerability-discovery framework for systems you are authorized to test. Local targets are scoped to the declared path; remote (HTTP) targets require explicit authorization acknowledgement, and --dry-run audits a campaign without executing anything.',
};

export const SOURCE_EXAMPLES: ToolSourceExample[] = [
  {
    id: 'entry',
    filename: 'cmd/sekhmet/main.go',
    label: 'CLI entry point',
    description: 'The binary hands control to the CLI layer; Execute returns an exit code so callers own process termination.',
    code: 'package main\n\nimport (\n\t"os"\n\n\t"github.com/QYVORA/qyvora-sekhmet/internal/cli"\n)\n\nfunc main() {\n\tos.Exit(cli.Execute())\n}',
  },
  {
    id: 'detection',
    filename: 'internal/detection/detection.go',
    label: 'Baseline-relative classification',
    description: 'Every result is classified against the profiled baseline, then further split by crash, hang, anomaly, or sanitizer text. Crashes reduce to a normalized signature for dedup.',
    code: 'res.Class = Classify(exec.Result, base)\nif IsCrash(res) {\n\tsig := Signature(res)\n\tif !e.seen(sig) {\n\t\te.record(res, sig) // first of its kind -> unique finding\n\t}\n}',
  },
  {
    id: 'feedback',
    filename: 'internal/feedback/tracker.go',
    label: 'Novelty tracking',
    description: 'Coverage is hashed into buckets a delay-free hot loop can afford; behavior and edge signatures feed the power scheduler.',
    code: 'if t.Novel(bucket) {\n\t// new edge / block / behavior reached\n\tt.score++\n\treturn true\n}\nreturn false',
  },
  {
    id: 'safety',
    filename: 'internal/safety/safety.go',
    label: 'Guardrails',
    description: 'A Guardian enforces execution budgets, size caps, concurrency limits and authorization gates; a breach stops the campaign cleanly.',
    code: 'if err := g.Allow(op); err != nil {\n\treturn err // campaign halts: budget or guard exceeded\n}',
  },
];