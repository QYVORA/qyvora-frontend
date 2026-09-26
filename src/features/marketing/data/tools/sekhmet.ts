import type { ToolDoc } from './types';

/**
 * SEKHMET — controllable fuzzing campaigns.
 *
 * The campaign loop is documented in the README and implemented across
 * `internal/`; the 17 operators are the `Op*` constants in
 * `internal/mutation/mutation.go`; the six power-scheduling strategies are the
 * `Strategy*` constants.
 */
const doc: ToolDoc = {
  slug: 'sekhmet',
  seoTitle: 'SEKHMET — Fuzzing campaign framework',
  seoDescription:
    'SEKHMET runs a controllable fuzzing campaign against an authorized target: baseline profiling, corpus management, 17 mutation operators, feedback-directed power scheduling, crash classification with SHA-256 dedup, delta-debugging minimization and replay. Process, HTTP and deterministic simulation targets.',
  summary:
    'SEKHMET runs a fuzzing campaign you can actually control. It profiles the target\'s normal behaviour first, so every result is classified against a baseline rather than against a guess. It mutates a corpus with 17 structured operators, schedules operator power from observed coverage novelty, deduplicates crashes by SHA-256 signature, and minimizes anything interesting down to a minimal reproducer.',

  sections: [
    {
      id: 'overview',
      label: 'Overview',
      kicker: 'Orientation',
      title: 'What SEKHMET does',
      blocks: [
        {
          kind: 'prose',
          text: 'The campaign loop is the whole design:',
        },
        {
          kind: 'code',
          lang: 'text',
          path: 'README.md',
          filename: 'README.md',
          caption: 'The SEKHMET campaign loop.',
          code: `Target → Baseline → Corpus → Mutate → Execute → Classify → Dedup → Report`,
        },
        {
          kind: 'prose',
          text: 'The baseline step is what makes SEKHMET different from a generic fuzzer. Before mutating anything, it profiles the target: exit codes, signals, runtime distribution, output variance. A result is then classified against that profile, so a signal the target already produces under normal input is not reported as a crash you found.',
        },
        {
          kind: 'subheading',
          text: 'Execution modes',
        },
        {
          kind: 'definitions',
          items: [
            { term: 'Process', detail: 'Run a local binary, substituting the fuzzed input into a {fuzz} or {stdin} template in the argument list.' },
            { term: 'HTTP', detail: 'Send fuzzed payloads to a known endpoint. Remote targets require explicit authorization acknowledgement.' },
            { term: 'Simulation', detail: 'A deterministic built-in target for CI, testing and learning. No real-world binary, fully reproducible.' },
          ],
        },
        {
          kind: 'note',
          variant: 'warning',
          title: 'What SEKHMET is not',
          text: 'Not an automated vulnerability scanner that attacks anything reachable. Not a malware or persistence-delivery framework. Not an unauthorized-access tool. Local targets are scoped to the declared path; remote HTTP targets require explicit authorization acknowledgement; and --dry-run audits a campaign without executing anything.',
        },
        {
          kind: 'subheading',
          text: 'Feedback-directed mutation',
        },
        {
          kind: 'prose',
          text: 'SEKHMET tracks novelty across three coverage dimensions — behavioral, edge and block — and feeds that into power scheduling. When an input reaches somewhere new, the operators that produced it get more budget; when a run plateaus, the schedule shifts. Six strategies are available: `fast`, `explore`, `exploit`, `rare`, `balanced` and `adaptive`.',
        },
        {
          kind: 'prose',
          text: 'Mutation itself is 17 structured operators, driven by a seeded RNG so a run is reproducible from its seed. The operator set spans bit and byte manipulation, block insert/delete/duplicate/replace, dictionary insertion, delimiter and boundary values, length mutation, splice, arithmetic and inc/dec, interesting-value substitution, and chunk shuffle.',
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
          title: 'Zero-config installers',
          items: [
            { command: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-Sekhmet/main/install.sh | bash', note: 'Linux and macOS. Detects OS and architecture, verifies SHA-256, installs the logo and wires up PATH and the desktop entry.' },
            { command: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-Sekhmet/main/install.ps1 | iex', note: 'Windows PowerShell, same behaviour including the Start Menu entry.' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'The repository URL is capitalised',
          text: 'SEKHMET\'s GitHub repository is QYVORA/qyvora-Sekhmet — capital S in Sekhmet. The Go module path is lower-case. If a link 404s, check the capitalisation.',
        },
        {
          kind: 'commands',
          title: 'From source',
          items: [
            { command: 'git clone https://github.com/QYVORA/qyvora-Sekhmet.git && cd qyvora-Sekhmet', note: 'Clone the repository.' },
            { command: 'make build', note: 'Builds bin/sekhmet.' },
            { command: 'make test-race', note: 'Full test suite with the race detector. Worth running before you trust a campaign.' },
            { command: 'make check', note: 'gofmt + vet + test.' },
            { command: 'sudo make install', note: 'Install to /usr/local/bin with logo and desktop entry.' },
            { command: 'make install-user', note: 'Install to ~/.local/bin. No root required.' },
          ],
        },
        {
          kind: 'facts',
          items: [
            { label: 'Module', value: 'github.com/QYVORA/qyvora-Sekhmet', mono: true },
            { label: 'Entry point', value: 'cmd/sekhmet', mono: true },
            { label: 'Binary', value: 'sekhmet', mono: true },
            { label: 'Go', value: '1.26+', mono: true },
            { label: 'Licence', value: 'Apache-2.0 (LICENSE committed)', mono: true },
            { label: 'Session storage', value: './sessions, relocatable via QYVORA_SEKHMET_SESSION_DIR', mono: true },
            { label: 'Config precedence', value: 'CLI flags > QYVORA_SEKHMET_* env > config file > defaults', mono: true },
          ],
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
          title: 'A campaign, start to finish',
          items: [
            { command: 'sekhmet target set --name example --kind process --cmd "./target" --arg "{fuzz}"', note: 'Register a target. The {fuzz} placeholder is where the mutated input goes.' },
            { command: 'sekhmet baseline --target ./target --samples 64', note: 'Profile normal behaviour. Do this before fuzzing — it is what makes classification meaningful.' },
            { command: 'sekhmet fuzz --target ./target --runs 100000 --jobs 4', note: 'Run the campaign.' },
            { command: 'sekhmet crashes --session <id>', note: 'List deduplicated crashes.' },
            { command: 'sekhmet report --session <id> --format json', note: 'Render the campaign report.' },
          ],
        },
        {
          kind: 'commands',
          title: 'The deterministic simulation target',
          items: [
            { command: 'sekhmet target set --name sim --kind simulation', note: 'Register the built-in simulation target.' },
            { command: 'sekhmet baseline --target sim', note: 'Baseline it.' },
            { command: 'sekhmet fuzz --target sim --runs 100000', note: 'A full run end to end, with no real binary involved.' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Start with the simulation target',
          text: 'The simulation target is the fastest way to see a complete campaign — baseline, corpus, findings, dedup, report — without needing a vulnerable binary. Use it to learn the workflow, then point the same commands at a real target.',
        },
        {
          kind: 'subheading',
          text: 'Commands',
        },
        {
          kind: 'definitions',
          items: [
            { term: 'baseline', detail: 'Profile the target\'s normal behaviour — exit codes, signals, runtime, output variance.' },
            { term: 'fuzz', detail: 'Run a fuzzing campaign.' },
            { term: 'analyze', detail: 'Classify and summarize a session\'s findings.' },
            { term: 'corpus', detail: 'Manage the seed corpus: import, crops, list.' },
            { term: 'crashes', detail: 'List deduplicated crashes from a session.' },
            { term: 'minimize', detail: 'Delta-debug an interesting input down to a minimal reproducer.' },
            { term: 'replay', detail: 'Reproduce an input against a target, to confirm it still crashes.' },
            { term: 'session', detail: 'Manage fuzzing sessions: list, show.' },
            { term: 'report', detail: 'Render a campaign report.' },
            { term: 'target', detail: 'Manage targets: set, list, show.' },
            { term: 'wordlists', detail: 'SecLists integration — list and search without vendoring several gigabytes.' },
            { term: 'capabilities', detail: 'List machine-readable capabilities.' },
            { term: 'version', detail: 'Print version and build information.' },
          ],
        },
        {
          kind: 'subheading',
          text: 'Fuzzing flags',
        },
        {
          kind: 'definitions',
          items: [
            { term: '--runs', detail: 'Total executions for the campaign.' },
            { term: '--jobs', detail: 'Concurrent workers. Default 4.' },
            { term: '--execs', detail: 'Executions per input. Default 0 — run each input once.' },
            { term: '--runtime', detail: 'Wall-clock budget for the campaign.' },
            { term: '--timeout', detail: 'Per-execution timeout. Default 2s.' },
            { term: '--seeds', detail: 'Seed the RNG from a value, to reproduce a campaign exactly.' },
            { term: '--strategy', detail: 'Power scheduling: fast, explore, exploit, rare, balanced, adaptive.' },
            { term: '--corpus', detail: 'Path to a seed corpus directory.' },
            { term: '--wordlist', detail: 'A SecLists wordlist to draw dictionary tokens from.' },
          ],
        },
        {
          kind: 'subheading',
          text: 'Global flags and events',
        },
        {
          kind: 'definitions',
          items: [
            { term: '-c, --config', detail: 'Path to a config file.' },
            { term: '-o, --output', detail: 'Output format: terminal, json, yaml.' },
            { term: '-q, --quiet', detail: 'Suppress progress output.' },
            { term: '--events', detail: 'Emit the JSONL event stream to stdout, stderr or a file.' },
            { term: '--dry-run', detail: 'Audit the campaign without executing anything.' },
            { term: '--timeout', detail: 'Global operation timeout.' },
            { term: '--insecure-tls', detail: 'Skip TLS verification for HTTP targets. Use deliberately.' },
            { term: '-y, --authorized', detail: 'Required before a remote HTTP target is touched.' },
          ],
        },
        {
          kind: 'code',
          lang: 'json',
          path: 'README.md',
          filename: 'README.md',
          caption: 'The event envelope every SEKHMET event uses. Agents and CI consume this directly.',
          code: `{
  "schema_version": "...",
  "timestamp": "...",
  "execution_id": "...",
  "framework": "sekhmet",
  "level": "info",
  "event": "...",
  "data": { }
}`,
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
          text: 'Package boundaries follow the campaign loop rather than generic layering. `internal/mutation` holds the 17 operators and the seeded RNG. `internal/feedback` implements the novelty tracker across behavioral, edge and block coverage. `internal/scheduler` turns that novelty into per-operator power. `internal/execution` owns the run budget, concurrency limits and timeouts. `internal/detection` classifies crashes and hangs. `internal/minimization` is the delta-debugging reducer.',
        },
        {
          kind: 'prose',
          text: 'Crash classification is signal-aware and also matches text from ASan, UBSan and MSan, because not every sanitizer failure arrives as a signal. Everything is then deduplicated by a SHA-256 signature computed over the normalized crash, so the same bug found through twenty different inputs is one entry in `sekhmet crashes`.',
        },
        {
          kind: 'prose',
          text: 'The safety model is wired rather than documented. Execution budgets, input size caps, concurrency limits, authorization gates and dry-run are enforced in the execution path, so a campaign cannot exceed its budget because a flag was omitted. `docs/Safety-Model.md` describes the controls; the code is where they are actually applied.',
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'SecLists without vendoring',
          text: 'The wordlist integration searches and loads words from SecLists on demand. Several gigabytes of wordlists are not committed to this repository — the tool loads what a campaign actually needs.',
        },
        {
          kind: 'links',
          items: [
            { label: 'internal/mutation/mutation.go', href: 'https://github.com/QYVORA/qyvora-Sekhmet/blob/main/internal/mutation/mutation.go', note: 'The 17 operators and the seeded RNG.' },
            { label: 'internal/feedback', href: 'https://github.com/QYVORA/qyvora-Sekhmet/tree/main/internal/feedback', note: 'The behavioral / edges / blocks novelty tracker.' },
            { label: 'internal/scheduler', href: 'https://github.com/QYVORA/qyvora-Sekhmet/tree/main/internal/scheduler', note: 'Power scheduling strategies.' },
            { label: 'internal/detection', href: 'https://github.com/QYVORA/qyvora-Sekhmet/tree/main/internal/detection', note: 'Crash, hang and anomaly classification, with sanitizer text matching.' },
            { label: 'internal/minimization', href: 'https://github.com/QYVORA/qyvora-Sekhmet/tree/main/internal/minimization', note: 'The delta-debugging reducer.' },
            { label: 'internal/execution', href: 'https://github.com/QYVORA/qyvora-Sekhmet/tree/main/internal/execution', note: 'Run budgets, concurrency limits and timeouts.' },
            { label: 'internal/safety', href: 'https://github.com/QYVORA/qyvora-Sekhmet/tree/main/internal/safety', note: 'The wired safety controls.' },
            { label: 'internal/wordlists', href: 'https://github.com/QYVORA/qyvora-Sekhmet/tree/main/internal/wordlists', note: 'SecLists integration.' },
            { label: 'docs/Safety-Model.md', href: 'https://github.com/QYVORA/qyvora-Sekhmet/blob/main/docs/Safety-Model.md', note: 'Safety controls in detail.' },
            { label: 'docs/Security-Model.md', href: 'https://github.com/QYVORA/qyvora-Sekhmet/blob/main/docs/Security-Model.md', note: 'Trust boundaries.' },
            { label: 'docs/Roadmap.md', href: 'https://github.com/QYVORA/qyvora-Sekhmet/blob/main/docs/Roadmap.md', note: 'What is planned beyond the foundation release.' },
          ],
        },
      ],
    },

    {
      id: 'reference',
      label: 'Reference',
      kicker: 'Detail',
      title: 'Operators, strategies and output',
      blocks: [
        {
          kind: 'subheading',
          text: 'The 17 mutation operators',
        },
        {
          kind: 'table',
          caption: 'The operator set, grouped by what it perturbs.',
          columns: [
            { key: 'group', label: 'Group' },
            { key: 'ops', label: 'Operators', mono: true },
          ],
          rows: [
            { group: 'Bit and byte', ops: 'OpBitFlip, OpByteFlip, OpByteInsert, OpByteDelete' },
            { group: 'Block structure', ops: 'OpBlockInsert, OpBlockDelete, OpBlockDuplicate, OpBlockReplace, OpChunkShuffle' },
            { group: 'Values and boundaries', ops: 'OpInterestingValue, OpBoundary, OpArithmetic, OpIncDec' },
            { group: 'Structure and length', ops: 'OpDictionary, OpDelimiterMutation, OpLengthMutation' },
            { group: 'Combination', ops: 'OpSplice' },
          ],
        },
        {
          kind: 'subheading',
          text: 'The six scheduling strategies',
        },
        {
          kind: 'definitions',
          items: [
            { term: 'fast', detail: 'Front-load the cheapest, highest-yield operators. Shallow campaigns and short runs.' },
            { term: 'explore', detail: 'Bias toward operators that produce new coverage.' },
            { term: 'exploit', detail: 'Concentrate budget on paths already showing promise.' },
            { term: 'rare', detail: 'Pursue rarely-hit operators and inputs.' },
            { term: 'balanced', detail: 'The default compromise across all of the above.' },
            { term: 'adaptive', detail: 'Let observed novelty drive the schedule continuously.' },
          ],
        },
        {
          kind: 'subheading',
          text: 'Output',
        },
        {
          kind: 'table',
          columns: [
            { key: 'format', label: 'Format', mono: true },
            { key: 'use', label: 'Use it for' },
          ],
          rows: [
            { format: 'terminal', use: 'Live progress during a campaign. The default.' },
            { format: 'json', use: 'Pipelines and CI. The full session, crashes and signatures included.' },
            { format: 'yaml', use: 'Diff-friendly review of a campaign report.' },
          ],
        },
        {
          kind: 'prose',
          text: 'Sessions persist with live results, so a campaign can be inspected while it runs and re-rendered afterwards. `--events` gives the machine-readable stream, using the shared QYVORA event envelope with `framework: "sekhmet"`.',
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'A good campaign order',
          text: 'Register the target, run `baseline` with enough samples to see the variance, then fuzz. Minimize anything interesting with `sekhmet minimize`, and confirm it still reproduces with `sekhmet replay` before you report it. A crash you have not replayed is a hypothesis.',
        },
      ],
    },
  ],
};

export default doc;
