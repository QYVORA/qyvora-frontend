import type { ToolDoc } from './types';

/**
 * JABARI — Android security assessment.
 *
 * The pipeline stages are orchestrated in `internal/orchestration`; the 11
 * rules live in `internal/rules/builtin/builtin.go`; the two target modes are
 * implemented in `internal/transport`.
 */
const doc: ToolDoc = {
  slug: 'jabari',
  seoTitle: 'JABARI — Android security assessment framework',
  seoDescription:
    'JABARI assesses a single authorized Android device over USB (ADB) or by IP, through a seven-stage pipeline with 11 deterministic rules, hashed evidence, risk scoring and terminal, JSON, Markdown or HTML reporting.',
  summary:
    'JABARI assesses one authorized Android device, reached either over USB through ADB or by IP. Discovery, enumeration, analysis, validation, evidence, risk and reporting run in order, and the output is a findings set backed by hashed, reproducible evidence. It is Android-centric by design: given a network address it assesses that address and nothing else, and it never scans the surrounding subnet.',

  sections: [
    {
      id: 'overview',
      label: 'Overview',
      kicker: 'Orientation',
      title: 'What JABARI does',
      blocks: [
        {
          kind: 'prose',
          text: 'JABARI is a device assessment framework, not a network scanner. You either plug the device in over USB, or you already know its IP and are authorized to assess it. The transport abstraction in `internal/transport` means the pipeline never knows which of the two it is talking to.',
        },
        {
          kind: 'prose',
          text: 'Every assessment requires explicit target authorization. Operations are scoped to the declared target, every operation is logged, and every finding carries evidence. There is no path through the tool that reaches a device without a target having been authorized first.',
        },
        {
          kind: 'note',
          variant: 'warning',
          title: 'What JABARI is not',
          text: 'Not a generic network scanner, Wi-Fi scanner, or mass IP scanner. Not a malware or persistence-delivery framework. Not an automated unauthorized-access tool. APK analysis, runtime instrumentation and exploitation validation are roadmap items, not shipped behaviour.',
        },
        {
          kind: 'subheading',
          text: 'The pipeline',
        },
        {
          kind: 'stages',
          items: [
            { name: 'Discovery', detail: 'Identify the device: model, build, Android version, security patch level, ABI.' },
            { name: 'Enumeration', detail: 'Installed applications, permissions, debug state, backup and cleartext-traffic settings.' },
            { name: 'Analysis', detail: 'Run the rule engine over the enumerated device state.' },
            { name: 'Validation', detail: 'Confirm findings before they are reported, so a suspected condition is not recorded as a fact.' },
            { name: 'Evidence', detail: 'Hash and attach reproducible evidence to each confirmed finding.' },
            { name: 'Risk', detail: 'Score severity × confidence per finding and per target.' },
            { name: 'Reporting', detail: 'Render the result in terminal, JSON, Markdown or HTML.' },
          ],
        },
        {
          kind: 'prose',
          text: 'As with the other assessment frameworks, the stages are orchestrated by profiles rather than hard-coded: `quick`, `standard`, `deep`, `application`, `device`, `network`, `compliance` and `research`.',
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
          kind: 'prose',
          text: 'JABARI ships a zero-config installer that detects the platform and installs the checksum-verified prebuilt binary, plus the jabari icon and desktop entry. Building from source needs Go 1.26+, and USB or ADB-over-network targets additionally need the Android platform-tools.',
        },
        {
          kind: 'commands',
          title: 'One-liner install',
          items: [
            { command: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-jabari/main/install.sh | bash', note: 'Installs the binary, icon and desktop entry.' },
            { command: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-jabari/main/install.ps1 | iex', note: 'PowerShell. Installs under %LOCALAPPDATA%\\Programs\\jabari\\bin with a Start Menu shortcut.' },
            { command: 'make install', note: 'System-wide install (Linux/Unix).' },
            { command: 'make install-user', note: 'Per-user install to ~/.local/bin. No root required.' },
          ],
        },
        {
          kind: 'commands',
          title: 'From source',
          items: [
            { command: 'git clone https://github.com/QYVORA/qyvora-jabari.git && cd qyvora-jabari', note: 'Clone the repository.' },
            { command: 'make build', note: 'Builds bin/jabari and the bin/androidsec alias.' },
            { command: 'go build -o bin/jabari ./cmd/jabari', note: 'Equivalent, without make.' },
            { command: 'make verify', note: 'Build, test, vet and lint.' },
          ],
        },
        {
          kind: 'facts',
          items: [
            { label: 'Module', value: 'github.com/QYVORA/qyvora-jabari', mono: true },
            { label: 'Entry point', value: 'cmd/jabari → cli.Execute()', mono: true },
            { label: 'Binary', value: 'jabari (also aliased androidsec)', mono: true },
            { label: 'Licence', value: 'Apache-2.0 (LICENSE committed)', mono: true },
            { label: 'Console prompt', value: 'jabariλ', mono: true },
            { label: 'External dep', value: 'adb (Android platform-tools), for USB and network targets', mono: true },
          ],
        },
        {
          kind: 'subheading',
          text: 'Updating',
        },
        {
          kind: 'prose',
          text: '`jabari updates` checks the installed version against the latest official release, downloads the platform artifact, verifies its SHA-256 against the published `checksums.txt`, and swaps the binary in atomically. `update` works as an alias and is also available inside the console. Downgrades are refused, permission problems are reported rather than escalated around, and any failure leaves the current binary untouched.',
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
          title: 'The three ways to start',
          items: [
            { command: 'jabari', note: 'Metasploit-style interactive console with tab completion, history and a live target/profile status strip. Real terminal only; piped stdin falls back to a plain line reader.' },
            { command: 'jabari assess usb', note: 'Assess a connected device, with an interactive authorization confirmation.' },
            { command: 'jabari assess ip 192.168.1.50', note: 'Assess a specific authorized device by address.' },
            { command: 'jabari assess ip 192.168.1.50 -y --profile deep --json', note: 'Non-interactive, deep profile, JSON report. For automation and CI.' },
          ],
        },
        {
          kind: 'prose',
          text: 'The console is not a separate feature set. Every one-shot command works inside it, and the console adds a coloured prompt, completion and history on top.',
        },
        {
          kind: 'commands',
          title: 'Inside the console',
          items: [
            { command: 'jabariλ > target usb', note: 'Select a target mode interactively.' },
            { command: 'jabariλ > assess', note: 'Run the pipeline against the selected target.' },
            { command: 'jabariλ > report', note: 'Re-render the report from the saved session.' },
            { command: 'jabariλ > help', note: 'Every available command.' },
          ],
        },
        {
          kind: 'subheading',
          text: 'Flags',
        },
        {
          kind: 'definitions',
          items: [
            { term: '-y', detail: 'Non-interactive mode with an explicit authorization assertion. Required for automation.' },
            { term: '--profile', detail: 'Pipeline profile: quick, standard, deep, application, device, network, compliance, research.' },
            { term: '--json', detail: 'Shorthand for a JSON report.' },
            { term: '-o, --output', detail: 'Report format: terminal, json, markdown, html.' },
            { term: '--events', detail: 'JSONL run/stage/finding event stream to stdout, stderr or a file.' },
            { term: '--dry-run', detail: 'Show what would happen without touching the device.' },
            { term: '-c, --config', detail: 'Path to a config file.' },
            { term: '-q, --quiet', detail: 'Suppress progress output.' },
            { term: 'updates', detail: 'Check for a newer release. `update` is an alias.' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Sessions and targets',
          text: 'Each run gets a session ID and a target ID, shown together in the status strip. Reports render from the saved session, so a result can be re-rendered later without reconnecting to the device.',
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
          text: 'Rules are independently testable objects rather than switch statements. Each one is a small value with an ID, a name, a category, a description, a severity, a confidence and an `eval` function. Registering a rule is the entire integration cost, which is why the engine has no special cases and the test suite can exercise each rule without a device.',
        },
        {
          kind: 'prose',
          text: 'Validation is a separate stage from analysis, not a post-filter. A rule proposes; validation confirms. That split is why a suspected condition is not reported as a fact, and why `ConfidenceConfirmed` is a meaningful distinction in the output.',
        },
        {
          kind: 'prose',
          text: 'Evidence is hashed and attached to the finding, so the same observation produces the same hash on every run. That is what makes a JABARI report reproducible — a reader can confirm the evidence behind a finding rather than taking the finding on trust.',
        },
        {
          kind: 'table',
          caption: 'Key packages.',
          columns: [
            { key: 'path', label: 'Path', mono: true },
            { key: 'role', label: 'Responsibility' },
          ],
          rows: [
            { path: 'internal/cli', role: 'Command tree, console REPL, app state.' },
            { path: 'internal/core', role: 'Pipeline stage contracts.' },
            { path: 'internal/orchestration', role: 'The pipeline and its profiles.' },
            { path: 'internal/transport', role: 'USB (ADB) and network target transports behind one interface.' },
            { path: 'internal/target', role: 'Target manager and target modes.' },
            { path: 'internal/discovery', role: 'Device identification.' },
            { path: 'internal/enumeration', role: 'Application, permission and configuration inventory.' },
            { path: 'internal/rules', role: 'Rule contracts, registry, and the 11 built-in rules.' },
            { path: 'internal/validation', role: 'Finding confirmation.' },
            { path: 'internal/evidence', role: 'Evidence hashing and reproduction.' },
            { path: 'internal/risk', role: 'Severity × confidence scoring.' },
            { path: 'internal/poc', role: 'Proof-of-concept module system, with its own safety rules and events.' },
            { path: 'internal/reporting', role: 'Report rendering.' },
            { path: 'internal/i18n', role: 'Message catalogue.' },
          ],
        },
      ],
    },

    {
      id: 'reference',
      label: 'Reference',
      kicker: 'Detail',
      title: 'Rules, PoC modules and output',
      blocks: [
        {
          kind: 'prose',
          text: 'Eleven rules ship in the box, all defined in `internal/rules/builtin/builtin.go`. They cover device configuration, build provenance, exposure, and application posture.',
        },
        {
          kind: 'table',
          caption: 'The built-in rules.',
          columns: [
            { key: 'id', label: 'ID', mono: true },
            { key: 'name', label: 'Rule' },
            { key: 'cat', label: 'Category', mono: true },
          ],
          rows: [
            { id: 'AND-001', name: 'Debuggable Production Device', cat: 'android-configuration' },
            { id: 'AND-002', name: 'Outdated Security Patch Level', cat: 'android-configuration' },
            { id: 'AND-003', name: 'ADB Unauthenticated Access', cat: 'android-configuration' },
            { id: 'AND-004', name: 'Rooted Device', cat: 'android-configuration' },
            { id: 'AND-005', name: 'Application Backup Enabled', cat: 'android-configuration' },
            { id: 'AND-006', name: 'Cleartext Traffic Allowed', cat: 'android-configuration' },
            { id: 'AND-007', name: 'Debuggable Application', cat: 'application-security' },
            { id: 'AND-008', name: 'Outdated Android Version', cat: 'android-configuration' },
            { id: 'AND-009', name: 'Test-Keys Build', cat: 'android-configuration' },
            { id: 'AND-010', name: 'Excessive Dangerous Permissions', cat: 'application-security' },
            { id: 'AND-012', name: 'Debug-Signed APK', cat: 'application-security' },
          ],
        },
        {
          kind: 'note',
          variant: 'warning',
          title: 'The README understates the rule count',
          text: 'The README describes the initial rule set as AND-001 … AND-007. The source registers eleven: AND-001 through AND-010 plus AND-012. AND-011 is absent from the source, so the ID sequence has a gap — the table above is what the binary actually evaluates, not what the README claims.',
        },
        {
          kind: 'subheading',
          text: 'Proof-of-concept modules',
        },
        {
          kind: 'prose',
          text: 'The `internal/poc` package provides a separate module system for proof-of-concept validation, with its own safety rules and its own event stream. It is deliberately isolated from the rule engine: a rule states a condition, a PoC module demonstrates it, and they do not share a code path.',
        },
        {
          kind: 'subheading',
          text: 'Report formats',
        },
        {
          kind: 'definitions',
          items: [
            { term: 'terminal', detail: 'Coloured session summary, severity breakdown and key findings. The default.' },
            { term: 'json', detail: 'Full structured result, for pipelines and CI.' },
            { term: 'markdown', detail: 'For a report body or a pull-request comment.' },
            { term: 'html', detail: 'A standalone shareable report.' },
          ],
        },
        {
          kind: 'prose',
          text: 'Independently of the report format, `--events` writes a JSONL stream of run, stage and finding events to stdout, stderr or a file. That is the interface to build automation on: the report is for people, the event stream is for systems.',
        },
        {
          kind: 'links',
          items: [
            { label: 'cmd/jabari', href: 'https://github.com/QYVORA/qyvora-jabari/tree/main/cmd/jabari', note: 'Entry point.' },
            { label: 'internal/transport', href: 'https://github.com/QYVORA/qyvora-jabari/tree/main/internal/transport', note: 'USB and network transports behind one interface.' },
            { label: 'internal/rules/builtin/builtin.go', href: 'https://github.com/QYVORA/qyvora-jabari/blob/main/internal/rules/builtin/builtin.go', note: 'All 11 rules.' },
            { label: 'internal/poc', href: 'https://github.com/QYVORA/qyvora-jabari/tree/main/internal/poc', note: 'The proof-of-concept module system.' },
            { label: 'internal/validation', href: 'https://github.com/QYVORA/qyvora-jabari/tree/main/internal/validation', note: 'How findings are confirmed.' },
            { label: 'docs/Security-Model.md', href: 'https://github.com/QYVORA/qyvora-jabari/blob/main/docs/Security-Model.md', note: 'Trust boundaries and safety controls.' },
            { label: 'docs/PoC.md', href: 'https://github.com/QYVORA/qyvora-jabari/blob/main/docs/PoC.md', note: 'PoC module system, safety and events.' },
            { label: 'docs/Rules.md', href: 'https://github.com/QYVORA/qyvora-jabari/blob/main/docs/Rules.md', note: 'Rule engine documentation.' },
            { label: 'docs/Roadmap.md', href: 'https://github.com/QYVORA/qyvora-jabari/blob/main/docs/Roadmap.md', note: 'APK analysis, runtime instrumentation, exploitation validation.' },
          ],
        },
      ],
    },
  ],
};

export default doc;
