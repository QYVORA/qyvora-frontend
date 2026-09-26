import type { ToolDoc } from './types';

/**
 * AKSUM — binary security assessment.
 *
 * The nine pipeline stages are the commands in the README table; the seven
 * static checks are the `check*` functions in `internal/checks/checks.go`;
 * confidence levels and finding IDs are in `internal/findings`.
 */
const doc: ToolDoc = {
  slug: 'aksum',
  seoTitle: 'AKSUM — Binary security assessment',
  seoDescription:
    'AKSUM is a terminal-first binary-security assessment platform for ELF binaries. Structure enumeration, string classification, disassembly, function discovery, call and control-flow graphs, cross-references, and evidence-backed findings with explicit confidence — tri-state hardening properties, seven static checks, deterministic finding IDs.',
  summary:
    'AKSUM takes an ELF binary and tells you what is actually in it. It enumerates structure, extracts and classifies strings, disassembles code, discovers functions with provenance, builds call and control-flow graphs, maps cross-references, and reports candidate weaknesses as findings with explicit confidence. Its discipline is honesty: a property it cannot determine is reported as `unknown`, and a dangerous import on its own is a CANDIDATE, never a verdict.',

  sections: [
    {
      id: 'overview',
      label: 'Overview',
      kicker: 'Orientation',
      title: 'What AKSUM does',
      blocks: [
        {
          kind: 'prose',
          text: 'AKSUM is a reverse-engineering assessment tool, not a vulnerability scanner. It reads a binary, builds a model of it, and reports what it observed — with the reasoning attached. Every finding states what was observed, why the rule fired, and what validation would confirm or clear it.',
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'The honesty rule',
          text: 'AKSUM never guesses. Properties it cannot determine are reported as `unknown` rather than as a default. Hardening flags are tri-state for exactly this reason — a stripped binary with no NX bit recorded is genuinely unknown, not "no NX".',
        },
        {
          kind: 'subheading',
          text: 'The pipeline',
        },
        {
          kind: 'table',
          caption: 'Nine stages, each available as its own command.',
          columns: [
            { key: 'n', label: '#', mono: true },
            { key: 'cmd', label: 'Command', mono: true },
            { key: 'produces', label: 'What it produces' },
          ],
          rows: [
            { n: '01', cmd: 'aksum binary', produces: 'Format, architecture, linking, and PIE / NX / RELRO / canary / fortify as honest tri-state values.' },
            { n: '02', cmd: 'aksum sections / segments / symbols / imports', produces: 'Structural enumeration with permissions, plus classification of security-relevant APIs.' },
            { n: '03', cmd: 'aksum strings', produces: 'Printable strings classified as URL, path, command, crypto or credential. Works on ELF and RAW files.' },
            { n: '04', cmd: 'aksum disassemble', produces: 'Linear-sweep disassembly for x86 and x86-64, with branch targets resolved.' },
            { n: '05', cmd: 'aksum functions', produces: 'Function discovery from three sources — symbols, entry point, call targets — each with provenance and confidence.' },
            { n: '06', cmd: 'aksum calls / cfg', produces: 'The direct-call graph, and per-function basic-block metrics: blocks, edges, loops, unreachable blocks.' },
            { n: '07', cmd: 'aksum xrefs', produces: 'Cross-references to code addresses (--addr) and data strings (--string).' },
            { n: '08', cmd: 'aksum analyze', produces: 'The full pipeline: dataflow-resolved call sites, every static rule, validation escalation, deduplicated findings, severity and confidence summary.' },
            { n: '09', cmd: 'aksum surface', produces: 'Attack-surface aggregation: entry points, risky import categories, exports, string classes.' },
          ],
        },
        {
          kind: 'prose',
          text: '`analyze` is where the real work happens. It resolves PLT stubs to real import names through relocations, tracks call-site arguments through registers and stack slots, and escalates a finding to `VALIDATED` only when a statically resolved call site corroborates it. That escalation is the difference between "this binary imports strcpy" and "this binary calls strcpy".',
        },
      ],
    },

    {
      id: 'install',
      label: 'Install & build',
      kicker: 'Getting it',
      title: 'Installing and building',
      blocks: [
        {
          kind: 'commands',
          title: 'One-liner install',
          items: [
            { command: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-aksum/main/install.sh | bash', note: 'Zero-config installer. Installs the checksum-verified binary plus the aksum icon and desktop entry.' },
            { command: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-aksum/main/install.ps1 | iex', note: 'PowerShell equivalent.' },
            { command: 'make install', note: 'System-wide install (Linux/Unix).' },
            { command: 'make install-user', note: 'Per-user install to ~/.local/bin. No root required.' },
          ],
        },
        {
          kind: 'note',
          variant: 'warning',
          title: 'The aksum installer has a stale URL in its own header comment',
          text: 'The usage comment at the top of install.sh documents the one-liner as `raw.githubusercontent.com/QYVORA/qyvora-aksum-cli/main/install.sh` — note the `-cli` suffix, which is not this repository. The README and the REPO variable inside the script both correctly use QYVORA/qyvora-aksum. Use the README URL, not the comment.',
        },
        {
          kind: 'commands',
          title: 'From source',
          items: [
            { command: 'git clone https://github.com/QYVORA/qyvora-aksum.git && cd qyvora-aksum', note: 'Clone the repository.' },
            { command: 'make build', note: 'Builds bin/aksum.' },
            { command: 'go build -o bin/aksum .', note: 'The entry point is at the repository root, so no ./cmd/ prefix.' },
            { command: 'make verify', note: 'Build, test, vet and lint.' },
          ],
        },
        {
          kind: 'facts',
          items: [
            { label: 'Module', value: 'github.com/QYVORA/qyvora-aksum', mono: true },
            { label: 'Entry point', value: 'main.go (repository root)', mono: true },
            { label: 'Binary', value: 'aksum', mono: true },
            { label: 'Input formats', value: 'ELF, plus RAW for string extraction', mono: true },
            { label: 'Disassembler coverage', value: 'x86 and x86-64', mono: true },
            { label: 'Licence', value: 'MIT (LICENSE committed)', mono: true },
            { label: 'History file', value: '~/.aksum_history', mono: true },
          ],
        },
        {
          kind: 'subheading',
          text: 'Updating',
        },
        {
          kind: 'prose',
          text: '`aksum updates` checks the installed version against the latest official release, downloads the platform artifact, verifies its SHA-256 against the published checksums, and swaps the binary in atomically. Downgrades are refused and a failed update leaves the installed binary untouched.',
        },
      ],
    },

    {
      id: 'usage',
      label: 'Commands',
      kicker: 'Running it',
      title: 'Commands and flags',
      blocks: [
        {
          kind: 'commands',
          title: 'A full analysis',
          items: [
            { command: 'aksum analyze ./target', note: 'Run the whole pipeline and print findings.' },
            { command: 'aksum analyze ./target --report report.json --min-severity low', note: 'Write a full schema-versioned report.' },
            { command: 'aksum analyze ./target -f json', note: 'Machine-readable findings on stdout.' },
            { command: 'aksum binary /usr/bin/ls', note: 'Just the binary properties — format, arch, hardening.' },
            { command: 'aksum strings ./target -f json', note: 'Extracted strings with their classifications.' },
            { command: 'aksum xrefs --string "Usage"', note: 'Cross-references to a data string.' },
          ],
        },
        {
          kind: 'subheading',
          text: 'The console',
        },
        {
          kind: 'prose',
          text: 'Run `aksum` with no subcommand and you get an interactive session with a contextual prompt showing the loaded target. Every one-shot command works in the console, and every one-shot CLI command keeps working unchanged.',
        },
        {
          kind: 'code',
          lang: 'text',
          path: 'README.md',
          filename: 'README.md',
          caption: 'A console session. The prompt shows the loaded target, so you always know what you are looking at.',
          code: `aksum > open /usr/bin/ls
[+] Target loaded
aksum [/usr/bin/ls] > functions --min-confidence high
aksum [/usr/bin/ls] > xrefs --string "Usage"
aksum [/usr/bin/ls] > analyze --min-severity low
aksum [/usr/bin/ls] > quit`,
        },
        {
          kind: 'prose',
          text: '`open` caches the analysis context, so later commands skip re-parsing the file. There is tab completion for commands, aliases (`?`, `b`, `syms`, `dis`) and per-command flags, and arrow-key history that persists in `~/.aksum_history`. `help <command>` documents usage, aliases and flags; an unknown command suggests the closest real one.',
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'The console is scriptable',
          text: 'Pipe a script on stdin — `echo \'help\' | aksum` — and prompts are never echoed. Sessions stay side-effect free, which is what makes the console usable from a test harness.',
        },
        {
          kind: 'subheading',
          text: 'Flags',
        },
        {
          kind: 'definitions',
          items: [
            { term: '-f, --format', detail: 'Output format: terminal, json. Accepted by every command; `--json` works anywhere.' },
            { term: '--report', detail: 'Write a full schema-versioned report to a file.' },
            { term: '--min-severity', detail: 'Filter findings by severity: info, low, medium, high, critical.' },
            { term: '--min-confidence', detail: 'Filter functions by discovery confidence.' },
            { term: '--addr', detail: 'Cross-reference a code address.' },
            { term: '--string', detail: 'Cross-reference a data string.' },
            { term: '--events', detail: 'Append-only JSONL event stream: stdout, stderr, or a file path.' },
            { term: '--insecure-tls', detail: 'Skip TLS verification when fetching a remote binary.' },
            { term: '-v, --verbose', detail: 'Verbose output.' },
            { term: '-q, --quiet', detail: 'Suppress progress output.' },
            { term: '--no-color', detail: 'Disable ANSI colour.' },
          ],
        },
        {
          kind: 'subheading',
          text: 'Event stream',
        },
        {
          kind: 'prose',
          text: '`--events` mirrors the full analysis lifecycle as an append-only JSONL stream: `scan.started`, bracketed `phase.started` / `phase.completed` for strings, dataflow and checks, then `validation.started` / `validation.completed`, `finding.discovered`, `report.generated` and `scan.completed`. This is the interface to automate AKSUM from a script or an agent.',
        },
      ],
    },

    {
      id: 'how-it-works',
      label: 'How it works',
      kicker: 'Internals',
      title: 'How it is built',
      blocks: [
        {
          kind: 'prose',
          text: 'Package boundaries follow the pipeline stages: `internal/loader` opens the file, `internal/binary` reads format and hardening properties, `internal/functions` discovers functions, `internal/disasm` and `internal/cfg` build the code model, `internal/dataflow` resolves call sites, `internal/checks` holds the rules, `internal/validation` escalates confidence, and `internal/findings` owns the deduplication and ID scheme.',
        },
        {
          kind: 'prose',
          text: 'Function discovery is multi-source on purpose. Symbols are the strongest source; the entry point and call targets are weaker but catch functions with no symbol at all. Each discovered function records which source found it, and that provenance becomes its confidence — so a function known only because something calls it is visibly weaker than one with a symbol, and `--min-confidence` can filter on exactly that.',
        },
        {
          kind: 'prose',
          text: 'Deduplication is deterministic. The same observation across runs yields the same finding ID, formed as `AKS-<CATEGORY>-<hash>`, so a finding can be tracked across runs and diffed between two builds of the same target.',
        },
        {
          kind: 'subheading',
          text: 'The seven static checks',
        },
        {
          kind: 'table',
          caption: 'The check functions in internal/checks/checks.go.',
          columns: [
            { key: 'fn', label: 'Check', mono: true },
            { key: 'checks', label: 'What it checks' },
          ],
          rows: [
            { fn: 'checkHardening', checks: 'NX, PIE, RELRO (full and partial), and stack canaries.' },
            { fn: 'checkWritableExec', checks: 'Segments that are both writable and executable.' },
            { fn: 'checkDangerousImports', checks: 'Dangerous imports: gets, strcpy, sprintf, system, popen and similar.' },
            { fn: 'checkDangerousCallSites', checks: 'Statically resolved call sites for those dangerous imports, with argument tracking.' },
            { fn: 'checkSensitiveStrings', checks: 'Credential-shaped strings.' },
            { fn: 'checkWeakCrypto', checks: 'Weak-crypto signals.' },
            { fn: 'checkProcessExecution', checks: 'Process-execution attack surface.' },
          ],
        },
        {
          kind: 'links',
          items: [
            { label: 'main.go', href: 'https://github.com/QYVORA/qyvora-aksum/blob/main/main.go', note: 'Entry point, at the repository root.' },
            { label: 'internal/checks/checks.go', href: 'https://github.com/QYVORA/qyvora-aksum/blob/main/internal/checks/checks.go', note: 'The seven static checks.' },
            { label: 'internal/dataflow', href: 'https://github.com/QYVORA/qyvora-aksum/tree/main/internal/dataflow', note: 'PLT resolution and call-site argument tracking.' },
            { label: 'internal/validation', href: 'https://github.com/QYVORA/qyvora-aksum/tree/main/internal/validation', note: 'Confidence escalation to VALIDATED.' },
            { label: 'internal/findings', href: 'https://github.com/QYVORA/qyvora-aksum/tree/main/internal/findings', note: 'Confidence levels and deterministic finding IDs.' },
            { label: 'internal/functions', href: 'https://github.com/QYVORA/qyvora-aksum/tree/main/internal/functions', note: 'Multi-source function discovery with provenance.' },
            { label: 'docs/Findings.md', href: 'https://github.com/QYVORA/qyvora-aksum/blob/main/docs/Findings.md', note: 'The findings model in detail.' },
            { label: 'docs/Console.md', href: 'https://github.com/QYVORA/qyvora-aksum/blob/main/docs/Console.md', note: 'Full console reference.' },
            { label: 'docs/Validation.md', href: 'https://github.com/QYVORA/qyvora-aksum/blob/main/docs/Validation.md', note: 'How findings are escalated.' },
          ],
        },
      ],
    },

    {
      id: 'reference',
      label: 'Reference',
      kicker: 'Detail',
      title: 'Confidence, findings and output',
      blocks: [
        {
          kind: 'prose',
          text: 'The confidence scale is the heart of AKSUM\'s honesty discipline. It is a five-level ladder, and each level means something specific about how the finding was established.',
        },
        {
          kind: 'table',
          caption: 'Confidence levels.',
          columns: [
            { key: 'level', label: 'Level', mono: true },
            { key: 'means', label: 'What it means' },
          ],
          rows: [
            { level: 'OBSERVED', means: 'Read directly from the file. No inference.' },
            { level: 'CANDIDATE', means: 'A concrete signal that needs review. A dangerous import alone lands here.' },
            { level: 'SUSPECTED', means: 'A pattern match that may well be incidental.' },
            { level: 'VALIDATED', means: 'Corroborated by independent evidence — a statically resolved dangerous call site, for example.' },
            { level: 'CONFIRMED', means: 'Dynamically exercised. Reserved; no executor is bundled, so nothing reaches this today.' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Read the confidence before the severity',
          text: 'Severity rates potential impact if the weakness is real. Confidence rates how well it was established. A critical-severity CANDIDATE is a different proposition from a critical-severity VALIDATED finding, and a report that flattens the two is misleading.',
        },
        {
          kind: 'subheading',
          text: 'What a finding carries',
        },
        {
          kind: 'definitions',
          items: [
            { term: 'Confidence', detail: 'One of the five levels above.' },
            { term: 'Severity', detail: 'info, low, medium, high, critical — potential impact if real.' },
            { term: 'Evidence', detail: 'Machine-checkable records of kind property, import, string, segment or callsite, each with a location.' },
            { term: 'Detection reason', detail: 'Why the rule fired.' },
            { term: 'Validation guidance', detail: 'What would confirm or clear the finding.' },
          ],
        },
        {
          kind: 'code',
          lang: 'json',
          path: 'docs/Reporting.md',
          filename: 'the analyze report',
          caption: 'The report schema, as written by `aksum analyze --report`.',
          code: `{
  "framework": "aksum",
  "schema_version": "1.0",
  "summary": { "functions_discovered": 136, "strings_extracted": 542 },
  "findings": [
    {
      "id": "AKS-MEMORY-1a583006",
      "rule": "dangerous-import-strcpy",
      "severity": "medium",
      "confidence": "CANDIDATE",
      "evidence": [{ "kind": "import", "location": "strcpy" }]
    }
  ]
}`,
        },
        {
          kind: 'prose',
          text: 'Every command accepts `-f json` for machine-readable output; `analyze` can additionally write the full schema-versioned report above with `--report`. The finding ID is deterministic, so `AKS-MEMORY-1a583006` means the same thing across runs and across builds.',
        },
      ],
    },
  ],
};

export default doc;
