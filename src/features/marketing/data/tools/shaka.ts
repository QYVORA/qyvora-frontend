import type { ToolDoc } from './types';

/**
 * SHAKA — Active Directory / Windows security assessment.
 *
 * The six pipeline stages are declared in `internal/orchestration`; the 18
 * rules in `internal/rules/builtin/builtin.go`; the demo figures quoted below
 * are the ones `shaka assess --sim` actually produces.
 */
const doc: ToolDoc = {
  slug: 'shaka',
  seoTitle: 'SHAKA — Active Directory assessment framework',
  seoDescription:
    'SHAKA assesses a single authorized Active Directory domain through a six-stage pipeline — DISCOVER, VERIFY, DEEPEN, CORRELATE, ANALYZE, REPORT — with 18 deterministic rules, a relationship graph, and terminal, JSON, Markdown, HTML and YAML reporting.',
  summary:
    'SHAKA assesses one authorized Active Directory domain and reports what it found. Six stages run in order: discovery seeds the graph, verification and deepening expand it, correlation completes it, analysis runs 18 deterministic rules over it, and reporting renders the result. Everything is read-only, every run passes an authorization gate, and a built-in offline simulator lets you walk the entire pipeline without a live directory.',

  sections: [
    {
      id: 'overview',
      label: 'Overview',
      kicker: 'Orientation',
      title: 'What SHAKA does',
      blocks: [
        {
          kind: 'prose',
          text: 'SHAKA is scoped to exactly one directory. It does not sweep a subnet, does not auto-discover an environment, and does not change state on the domain it assesses. That narrow scope is deliberate: it is a directory assessment tool, not a scanner.',
        },
        {
          kind: 'prose',
          text: 'The output is a relationship graph plus a set of findings. The graph is the primary artifact — users, groups, computers, OUs and trusts as typed nodes, membership and trust as edges — because most directory findings are properties of the graph, not of a single object. A user is not misconfigured in isolation; they are misconfigured *relative to what they can reach*.',
        },
        {
          kind: 'note',
          variant: 'warning',
          title: 'What SHAKA is not',
          text: 'Not a mass scanner — scope is one specified domain plus the trusts that domain declares. Not an unauthorized-access tool — every run passes an authorization gate and there is no command path that proceeds without one. Not an exploitation framework — the foundation release is read-only discovery, enumeration and analysis.',
        },
        {
          kind: 'subheading',
          text: 'The pipeline',
        },
        {
          kind: 'stages',
          items: [
            {
              name: 'DISCOVER',
              detail:
                'Identify the domain, its base DN and its domain controllers over LDAP. This seeds the graph.',
            },
            {
              name: 'VERIFY',
              detail:
                'Run follow-up queries that confirm what discovery and enumeration produced, so findings rest on observed evidence rather than inference.',
            },
            {
              name: 'DEEPEN',
              detail:
                'Expand nested memberships and deeper object detail, bounded by a depth limit and deduplicated.',
            },
            {
              name: 'CORRELATE',
              detail:
                'Complete the relationship graph — nodes, edges and trusts. Every edge is derived from evidence, never manufactured.',
            },
            {
              name: 'ANALYZE',
              detail:
                'Run the deterministic rule engine over the graph, plus identity, trust and Kerberos assessment and attack-path analysis.',
            },
            {
              name: 'REPORT',
              detail:
                'Record findings, evidence and risk, then render the report from the saved session.',
            },
          ],
        },
        {
          kind: 'prose',
          text: 'The stages are not hard-coded into one linear run. They are orchestrated by configurable profiles, and the stages are individually selectable: `quick`, `standard`, `deep`, `directory`, `authentication`, `trust`, `identity`, `compliance` and `research`.',
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
          text: 'SHAKA ships a zero-config installer that detects OS, CPU and shell, downloads the matching prebuilt binary, verifies its SHA-256 against the published `checksums.txt`, and falls back to building from source when no release exists yet.',
        },
        {
          kind: 'commands',
          title: 'One-liner install',
          items: [
            {
              command:
                'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-shaka/master/install.sh | bash',
              note: 'SHAKA is published from the master branch, unlike the rest of the toolkit.',
            },
            {
              command:
                'irm https://raw.githubusercontent.com/QYVORA/qyvora-shaka/master/install.ps1 | iex',
              note: 'PowerShell. Installs under %LOCALAPPDATA%\\Programs\\shaka\\bin, adds it to PATH and creates a Start Menu shortcut.',
            },
            { command: 'make install', note: 'System-wide install (Linux/Unix), including the app icon and desktop entry.' },
            { command: 'make install-user', note: 'Per-user install to ~/.local/bin. No root required.' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'It installs a desktop entry too',
          text: 'On Linux the installer also drops the shaka app icon and a .desktop file, so the tool appears in your app menu with its logo rather than as a bare binary on PATH.',
        },
        {
          kind: 'commands',
          title: 'From source',
          items: [
            { command: 'git clone https://github.com/QYVORA/qyvora-shaka.git && cd qyvora-shaka', note: 'Clone the repository.' },
            { command: 'make build', note: 'Builds bin/shaka.' },
            { command: 'go build -o bin/shaka ./cmd/shaka', note: 'Equivalent, without make.' },
            { command: 'make verify', note: 'Build, test, vet and lint.' },
          ],
        },
        {
          kind: 'facts',
          items: [
            { label: 'Module', value: 'github.com/QYVORA/qyvora-shaka', mono: true },
            { label: 'Entry point', value: 'cmd/shaka → cli.Execute()', mono: true },
            { label: 'Binary', value: 'shaka', mono: true },
            { label: 'Default branch', value: 'master (not main)', mono: true },
            { label: 'Licence', value: 'Apache-2.0 (LICENSE committed)', mono: true },
            { label: 'Config', value: 'viper, QYVORA_SHAKA_* environment namespace', mono: true },
          ],
        },
        {
          kind: 'subheading',
          text: 'Updating',
        },
        {
          kind: 'prose',
          text: 'SHAKA updates itself and verifies what it downloaded. `shaka updates` checks for a newer release; `shaka updates --install` downloads it, verifies the artifact against the published `checksums.txt`, and swaps the binary in atomically. Downgrades are refused, and any failure leaves the installed binary untouched. No Go toolchain or Git required.',
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
          title: 'The four ways to start',
          items: [
            { command: 'shaka', note: 'Metasploit-style interactive console. Requires a real terminal; piped stdin falls back to a plain line reader.' },
            { command: 'shaka assess --sim', note: 'Offline demo assessment. No live directory, auto-authorized. This is the fastest way to see the whole pipeline.' },
            { command: 'shaka assess --endpoint dc01:389', note: 'Live assessment with an interactive authorization confirmation.' },
            {
              command: 'shaka assess --endpoint dc01:389 --user svc-audit -y --json',
              note: 'Non-interactive, for automation. -y is an explicit authorization assertion.',
            },
          ],
        },
        {
          kind: 'prose',
          text: 'Every one-shot command is available in the console, and the console is not a separate feature set — the two modes share the same command tree. `assess`, `findings`, `graph`, `report`, `help` and `exit` all work identically either way.',
        },
        {
          kind: 'subheading',
          text: 'Commands',
        },
        {
          kind: 'definitions',
          items: [
            { term: 'assess', detail: 'Run the pipeline against a target, or against the offline simulator with --sim.' },
            { term: 'discover', detail: 'Run the DISCOVER stage only.' },
            { term: 'enumerate', detail: 'Run discovery and enumeration for a target.' },
            { term: 'analyze', detail: 'Run the rule engine and attack-path analysis over a saved session.' },
            { term: 'report', detail: 'Re-render the report from a saved session at any time.' },
            { term: 'graph', detail: 'Inspect the relationship graph — nodes, edges, shortest paths.' },
            { term: 'findings', detail: 'List findings from the current or a saved session.' },
            { term: 'target', detail: 'Manage targets: add, list, select, remove.' },
            { term: 'tools', detail: 'List available tools with risk and authorization metadata.' },
            { term: 'capabilities', detail: 'Machine-readable capability catalog, for AI agents driving the tool.' },
            { term: 'updates', detail: 'Check for updates; --install to apply. `update` is an alias.' },
          ],
        },
        {
          kind: 'subheading',
          text: 'Connection and target flags',
        },
        {
          kind: 'definitions',
          items: [
            { term: '--endpoint', detail: 'Domain controller address, host:port. LDAP or LDAPS.' },
            { term: '--base-dn', detail: 'Search root. Discovered automatically when omitted.' },
            { term: '--user', detail: 'Bind account.' },
            { term: '--password', detail: 'Bind password. Prefer a config file or environment variable over a flag.' },
            { term: '--tls / --ldaps', detail: 'Transport selection and TLS options.' },
            { term: '--sim', detail: 'Run against the deterministic built-in demo directory. No network.' },
            { term: '--profile', detail: 'Pipeline profile: quick, standard, deep, directory, authentication, trust, identity, compliance, research.' },
            { term: '--stages', detail: 'Select specific stages instead of the whole pipeline.' },
            { term: '-y', detail: 'Non-interactive mode with an explicit authorization assertion.' },
            { term: '-c, --config', detail: 'Path to a config file.' },
            { term: '-o, --output', detail: 'Report format: terminal, json, markdown, html, yaml.' },
            { term: '--json', detail: 'Shorthand for --output json.' },
            { term: '--events', detail: 'Emit a JSONL run/stage/finding event stream to stdout, stderr or a file.' },
            { term: '--dry-run', detail: 'Show what the pipeline would do without querying the directory.' },
            { term: '--timeout', detail: 'Per-operation timeout.' },
            { term: '-q, --quiet', detail: 'Suppress progress output.' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'The authorization gate has no bypass',
          text: 'There is no configuration or command path that proceeds silently without authorization. Interactive runs require a per-target confirmation; non-interactive runs require -y; ambiguous contexts are refused rather than assumed. This is enforced in internal/cli alongside the command tree, not in each command.',
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
          text: 'The design separates transport from analysis. `internal/directory` wraps LDAP — connection, bind, search, paging, normalization — so the pipeline never imports an LDAP library directly. `internal/ldap` underneath is a hand-rolled LDAP/BER client. Swapping the directory backend means implementing one interface, not rewriting six stages.',
        },
        {
          kind: 'prose',
          text: '`internal/graph` models Active Directory as typed nodes and edges with deduplication and confidence merging. Where two observations of the same edge disagree, the higher-confidence one wins and the conflict is recorded rather than silently dropped. Shortest-path analysis over that graph is deterministic, which is what makes attack paths reproducible.',
        },
        {
          kind: 'prose',
          text: 'Evidence is hashed and deduplicated before any rule sees it, so the same observation collected in two stages produces one piece of evidence. A rule\'s confidence score reflects how much independent evidence supports it, not how many times it fired.',
        },
        {
          kind: 'prose',
          text: 'Risk scoring is transparent: severity × confidence × exposure, computed per finding and per target. No learned model, no black box — the inputs are visible in the finding itself, so a reader can disagree with a score without guessing why.',
        },
        {
          kind: 'table',
          caption: 'Key packages.',
          columns: [
            { key: 'path', label: 'Path', mono: true },
            { key: 'role', label: 'Responsibility' },
          ],
          rows: [
            { path: 'cmd/shaka', role: 'Entry point; calls cli.Execute().' },
            { path: 'internal/cli', role: 'Cobra command tree, appState, authorization gate, console REPL, rendering, version and updates.' },
            { path: 'internal/core', role: 'Pipeline stage contracts (Stage, Env).' },
            { path: 'internal/orchestration', role: 'The pipeline and its profiles.' },
            { path: 'internal/config', role: 'viper-based config, QYVORA_SHAKA_* environment namespace.' },
            { path: 'internal/target', role: 'Target manager.' },
            { path: 'internal/validation', role: 'Target validation.' },
            { path: 'internal/directory', role: 'The directory-service abstraction the pipeline talks to.' },
            { path: 'internal/ldap', role: 'Low-level LDAP/BER client.' },
            { path: 'internal/graph', role: 'Typed relationship graph, dedup, confidence merging, shortest paths.' },
            { path: 'internal/rules', role: 'Rule contracts and the 18 built-in rules.' },
            { path: 'internal/evidence', role: 'Evidence collection, hashing, deduplication.' },
            { path: 'internal/risk', role: 'Severity × confidence × exposure scoring.' },
            { path: 'internal/report', role: 'Report rendering in all five formats.' },
          ],
        },
      ],
    },

    {
      id: 'reference',
      label: 'Reference',
      kicker: 'Detail',
      title: 'Rules, reports and the simulator',
      blocks: [
        {
          kind: 'prose',
          text: 'Eighteen rules ship in the box, split across two prefixes. All eighteen are defined in `internal/rules/builtin/builtin.go` and are deterministic — the same directory always produces the same findings.',
        },
        {
          kind: 'table',
          caption: 'The built-in rules.',
          columns: [
            { key: 'id', label: 'ID', mono: true },
            { key: 'name', label: 'Rule' },
          ],
          rows: [
            { id: 'ADM-001', name: 'Privileged Group Membership Discovered' },
            { id: 'ADM-002', name: 'Account Password Never Expires' },
            { id: 'ADM-003', name: 'Kerberos Pre-Authentication Not Required' },
            { id: 'ADM-004', name: 'Unconstrained Delegation' },
            { id: 'ADM-005', name: 'Weak or Legacy Authentication Encryption' },
            { id: 'ADM-006', name: 'External or Forest Trust Present' },
            { id: 'ADM-007', name: 'Kerberoastable Account (SPN Set)' },
            { id: 'ADM-008', name: 'Constrained Delegation Configured' },
            { id: 'ADM-009', name: 'Computer Account Unconstrained Delegation' },
            { id: 'ADM-010', name: 'Computer Allows Resource-Based Constrained Delegation' },
            { id: 'ADM-011', name: 'Risky Service Principal Name Class' },
            { id: 'ADM-012', name: 'Credential Material in Description' },
            { id: 'ADM-013', name: 'Account Has SID History' },
            { id: 'ADM-014', name: 'Privileged Group Membership via Nesting' },
            { id: 'AUTH-001', name: 'Domain Trust Relationship' },
            { id: 'AUTH-002', name: 'Local Administrator Password Not Managed (LAPS)' },
            { id: 'AUTH-003', name: 'Group Policy Linked to Privileged Container' },
            { id: 'AUTH-004', name: 'Weak Domain Password Policy' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'ADM-001 and ADM-014 are not duplicates',
          text: 'ADM-001 catches direct privileged membership, including the adminCount attribute on users. ADM-014 catches the same condition reached indirectly — a user nested inside a group that is itself nested inside a privileged group. Direct and transitive privilege are separate findings, because the remediation differs: one is an ACL question, the other a group-hygiene question.',
        },
        {
          kind: 'subheading',
          text: 'Report formats',
        },
        {
          kind: 'definitions',
          items: [
            { term: 'terminal', detail: 'Coloured, readable output. The default.' },
            { term: 'json', detail: 'The full result, for pipelines and dashboards.' },
            { term: 'markdown', detail: 'For pasting into a report or a pull-request comment.' },
            { term: 'html', detail: 'A standalone shareable report with no external assets.' },
            { term: 'yaml', detail: 'For human-edited config and diff-friendly review.' },
          ],
        },
        {
          kind: 'prose',
          text: 'Reports render from the saved session, not from live state. `shaka report` re-renders at any time, which means an assessment is reproducible without touching the directory again.',
        },
        {
          kind: 'subheading',
          text: 'The offline simulator',
        },
        {
          kind: 'prose',
          text: '`shaka assess --sim` runs the entire pipeline against a deterministic in-memory model of the `corp.example.com` domain. It makes no network calls and is auto-authorized, because there is nothing to authorize against. It is the fastest way to learn the tool, and it is also the fixture the test suite runs against.',
        },
        {
          kind: 'facts',
          title: 'What the demo actually produces',
          items: [
            { label: 'Graph', value: '24 nodes, 36 edges', mono: true },
            { label: 'Risk', value: 'medium, 43/100', mono: true },
            { label: 'Findings', value: '18 across 15 rules', mono: true },
            {
              label: 'Covers',
              value:
                'privileged and nested membership, delegation postures on users and computers, credential hygiene, SID history, LAPS, GPO links, password policy',
            },
          ],
        },
        {
          kind: 'links',
          items: [
            { label: 'cmd/shaka/main.go', href: 'https://github.com/QYVORA/qyvora-shaka/blob/master/cmd/shaka/main.go', note: 'Entry point.' },
            { label: 'internal/orchestration', href: 'https://github.com/QYVORA/qyvora-shaka/tree/master/internal/orchestration', note: 'The pipeline and its profiles.' },
            { label: 'internal/graph', href: 'https://github.com/QYVORA/qyvora-shaka/tree/master/internal/graph', note: 'The relationship graph and shortest-path analysis.' },
            { label: 'internal/directory', href: 'https://github.com/QYVORA/qyvora-shaka/tree/master/internal/directory', note: 'The transport abstraction.' },
            { label: 'internal/ldap', href: 'https://github.com/QYVORA/qyvora-shaka/tree/master/internal/ldap', note: 'Low-level LDAP/BER client.' },
            { label: 'internal/rules/builtin/builtin.go', href: 'https://github.com/QYVORA/qyvora-shaka/blob/master/internal/rules/builtin/builtin.go', note: 'All 18 rules.' },
            { label: 'internal/risk', href: 'https://github.com/QYVORA/qyvora-shaka/tree/master/internal/risk', note: 'Severity × confidence × exposure scoring.' },
            { label: 'docs/Security-Model.md', href: 'https://github.com/QYVORA/qyvora-shaka/blob/master/docs/Security-Model.md', note: 'Trust boundaries and safety controls.' },
            { label: 'docs/Rules.md', href: 'https://github.com/QYVORA/qyvora-shaka/blob/master/docs/Rules.md', note: 'Rule engine documentation.' },
            { label: 'docs/Roadmap.md', href: 'https://github.com/QYVORA/qyvora-shaka/blob/master/docs/Roadmap.md', note: 'What is planned beyond the foundation release.' },
          ],
        },
      ],
    },
  ],
};

export default doc;
