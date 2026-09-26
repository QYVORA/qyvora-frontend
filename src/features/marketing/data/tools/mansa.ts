import type { ToolDoc } from './types';

/**
 * Mansa — wireless (WLAN) security assessment.
 *
 * The eight pipeline stages are documented in `docs/stages.md` and
 * implemented in `internal/`; the 21 rules live in the rules package; live
 * capture shells out to `iw`.
 */
const doc: ToolDoc = {
  slug: 'mansa',
  seoTitle: 'MANSA — Wireless security assessment framework',
  seoDescription:
    'Mansa assesses wireless networks through an eight-stage pipeline with 21 deterministic WLAN rules, evidence-backed findings and transparent risk scoring. Deterministic --sim mode runs the full pipeline with no wireless hardware and is CI-ready.',
  summary:
    'Mansa assesses wireless networks. It runs the same commands from a terminal-first console and from a one-shot CLI, is deterministic and offline-first under `--sim`, gates live scope behind an authorization check, and produces findings that each carry the observations that produced them. Twenty-one rules cover encryption posture, WPS, management-frame protection, rogue access points and radio conditions.',

  sections: [
    {
      id: 'overview',
      label: 'Overview',
      kicker: 'Orientation',
      title: 'What Mansa does',
      blocks: [
        {
          kind: 'prose',
          text: 'Mansa is a WLAN assessment framework, not a Wi-Fi scanner. Scanning, enumeration and station observation feed a rule engine that reasons about encryption, access-point configuration and radio conditions — the findings are analysis, not a list of SSIDs.',
        },
        {
          kind: 'prose',
          text: 'Two design commitments shape everything else. First, one workflow with two surfaces: the console commands and the CLI commands are the same commands, so nothing you learn in the REPL is console-only. Second, determinism: `--sim` uses a fixed dataset built to exercise every rule, so the same run produces identical findings every time, on a laptop with no radio, in CI.',
        },
        {
          kind: 'subheading',
          text: 'The pipeline',
        },
        {
          kind: 'prose',
          text: 'Every full run executes these stages in order. Each can also be invoked one-shot.',
        },
        {
          kind: 'stages',
          items: [
            { name: '01 · discover', detail: 'Detect wireless interfaces and their capabilities.' },
            { name: '02 · enumerate', detail: 'Scan for nearby access points and build the inventory.' },
            { name: '03 · observe', detail: 'Collect associated client/station observations.' },
            { name: '04 · analyze', detail: 'Apply the deterministic WLAN rules.' },
            { name: '05 · validate', detail: 'Validate and normalize findings and collected data.' },
            { name: '06 · findings', detail: 'Aggregate and deduplicate findings.' },
            { name: '07 · risk', detail: 'Compute risk scores and assign a risk level.' },
            { name: '08 · report', detail: 'Render the requested output format.' },
          ],
        },
        {
          kind: 'definitions',
          items: [
            { term: 'One-shot', detail: '`mansa scan --sim` runs discover → enumerate, persists the data, and returns. No findings, no risk.' },
            { term: 'Full pipeline', detail: '`mansa assess --sim` runs all eight stages. The console `run` command does the same.' },
            { term: 'Re-analysis', detail: '`mansa analyze` loads a saved session and runs only analyze → validate → findings → risk, without re-scanning. Implemented as RunStages([analyze, validate, findings, risk]) so collected data is not overwritten.' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'The event log is an exact trace',
          text: 'At every stage Mansa appends to the session\'s Stages slice, so the stored event log and stage list always match what actually ran. Each stage emits stage.started on entry and stage.completed on success — or stage.completed at level error on failure. A successful `assess --sim` produces exactly 17 events, starting with scan.started and ending with the report stage.',
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
          title: 'From source',
          items: [
            { command: 'git clone https://github.com/QYVORA/qyvora-mansa.git && cd qyvora-mansa', note: 'Clone the repository.' },
            { command: 'make build', note: 'Builds the mansa binary.' },
            { command: 'sudo make install', note: '/usr/local layout. Requires root.' },
            { command: 'make install-user', note: '~/.local layout. No root required.' },
          ],
        },
        {
          kind: 'commands',
          title: 'Release installer',
          items: [
            { command: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-mansa/main/install.sh | sh', note: 'Installs the prebuilt release binary.' },
          ],
        },
        {
          kind: 'facts',
          items: [
            { label: 'Module', value: 'github.com/QYVORA/qyvora-mansa', mono: true },
            { label: 'Binary', value: 'mansa', mono: true },
            { label: 'Canonical entry point', value: 'main.go (root)', mono: true },
            { label: 'Duplicate entry point', value: 'cmd/mansa/main.go — byte-for-byte equivalent, unused by the Makefile', mono: true },
            { label: 'Licence', value: 'MIT (LICENSE and NOTICE committed)', mono: true },
            { label: 'Build flags', value: '-trimpath -ldflags "-s -w" with version injected', mono: true },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'There are two main.go files',
          text: 'The repository has a root main.go and a cmd/mansa/main.go. Both call cli.Execute() and both compile; the Makefile builds the root one. If you are reading the source to understand the entry point, read the root file — the cmd/ copy is a leftover and its package comment is slightly out of date.',
        },
        {
          kind: 'subheading',
          text: 'Live mode requirements',
        },
        {
          kind: 'prose',
          text: 'Without `--sim`, Mansa makes real wireless data-collection calls: `iw dev` to discover interfaces, and `iw dev <iface> scan` to enumerate. That needs root or `CAP_NET_ADMIN` and `CAP_NET_RAW`, an `iw` (or supported backend) on PATH, and confirmed authorization. When authorization is missing and a live command is requested, Mansa exits with an informative message rather than proceeding.',
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
          title: 'Start here',
          items: [
            { command: 'mansa assess --sim', note: 'Full assessment, no hardware, deterministic.' },
            { command: 'mansa capabilities -o json', note: 'The machine-readable capability contract.' },
            { command: 'mansa analyze -o json', note: 'Re-analyze the latest session as JSON.' },
            { command: 'mansa report -f json', note: 'Render the report as JSON.' },
            { command: 'mansa', note: 'Interactive console. A REPL on a real terminal; piped stdin uses a plain line reader.' },
          ],
        },
        {
          kind: 'commands',
          title: 'A console session',
          items: [
            { command: 'mansa', note: 'Start the console.' },
            { command: 'use wlan0', note: 'Select the interface. In the CLI this is --interface wlan0.' },
            { command: 'sim on', note: 'Toggle simulation mode at any point in the session.' },
            { command: 'scan', note: 'Enumerate nearby networks.' },
            { command: 'analyze', note: 'Run the rule engine over the collected data.' },
            { command: 'findings', note: 'Show findings.' },
            { command: 'report --format markdown', note: 'Render a report.' },
            { command: 'exit', note: 'Leave the console.' },
          ],
        },
        {
          kind: 'subheading',
          text: 'Commands',
        },
        {
          kind: 'definitions',
          items: [
            { term: 'assess', detail: 'Run the full eight-stage pipeline.' },
            { term: 'discover', detail: 'Discover wireless interfaces and capabilities.' },
            { term: 'scan', detail: 'Scan for wireless networks and access points.' },
            { term: 'enumerate', detail: 'Enumerate the access-point inventory with filtering.' },
            { term: 'observe', detail: 'Observe wireless clients/stations.' },
            { term: 'analyze', detail: 'Analyze the latest session for security findings.' },
            { term: 'findings', detail: 'Show findings from a session.' },
            { term: 'evidence', detail: 'Show the evidence collected in a session.' },
            { term: 'report', detail: 'Render a formatted report for a session.' },
            { term: 'session', detail: 'Inspect saved sessions.' },
            { term: 'events', detail: 'Show stored events for a session.' },
            { term: 'target', detail: 'Manage assessment targets.' },
            { term: 'capabilities', detail: 'List the machine-readable capability contract.' },
            { term: 'updates', detail: 'Check for and install Mansa updates.' },
            { term: 'completion', detail: 'Generate shell completion scripts.' },
            { term: 'version', detail: 'Print version information.' },
          ],
        },
        {
          kind: 'subheading',
          text: 'Global flags',
        },
        {
          kind: 'definitions',
          items: [
            { term: '-o, --output', detail: 'Output format for the command.' },
            { term: '-f, --format', detail: 'Report format on `report`.' },
            { term: '-y, --authorized', detail: 'Assert authorization for live scope. `authorize` does the same in the console.' },
            { term: '-v, --verbose', detail: 'Verbose output.' },
            { term: '-q, --quiet', detail: 'Suppress progress output.' },
            { term: '--events', detail: 'Emit the JSONL event stream.' },
            { term: '--dry-run', detail: 'Plan the run without collecting.' },
            { term: '--sim', detail: 'Run against the deterministic dataset. No radio, no root, no authorization prompt.' },
            { term: '--interface', detail: 'Select the wireless interface. The console equivalent is `use`.' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Why --sim is the default recommendation',
          text: 'Simulation mode is fully deterministic — two runs with the same interface produce identical access points, stations, observations and findings. It is authorized by default, works offline, and needs no radio. That makes it the right mode for learning the tool, for CI, and for scripted smoke tests. Use live mode when you are assessing a real environment you are authorized to test.',
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
          text: 'The pipeline is an explicit list of stages, not a chain of function calls, and that is what makes one-shot and re-analysis possible without special cases. `scan` is `RunStages([discover, enumerate])`; `assess` is `RunStages` over all eight; `analyze` is `RunStages([analyze, validate, findings, risk])`. The same stage implementation serves all three, which is why a re-analysis cannot accidentally overwrite collected scan data.',
        },
        {
          kind: 'prose',
          text: 'Live capture is delegated to `iw` rather than implemented in Go. That keeps the framework out of monitor-mode and raw-packet territory: the binary shells out, and the rules operate on normalized data. Simulation mode substitutes a fixed dataset at the same boundary, which is exactly why the rules cannot tell the two apart — and why they are testable without hardware.',
        },
        {
          kind: 'prose',
          text: 'Findings carry the observations that produced them, and the risk score is transparent rather than learned. Every finding can be traced back through the session to the evidence items and the events, which is what makes a Mansa report reviewable rather than merely readable.',
        },
        {
          kind: 'links',
          items: [
            { label: 'main.go', href: 'https://github.com/QYVORA/qyvora-mansa/blob/main/main.go', note: 'Canonical entry point.' },
            { label: 'cmd/mansa/main.go', href: 'https://github.com/QYVORA/qyvora-mansa/blob/main/cmd/mansa/main.go', note: 'The duplicate entry point, unused by the build.' },
            { label: 'internal/rules', href: 'https://github.com/QYVORA/qyvora-mansa/tree/main/internal/rules', note: 'The 21 WLAN rules.' },
            { label: 'docs/stages.md', href: 'https://github.com/QYVORA/qyvora-mansa/blob/main/docs/stages.md', note: 'Pipeline stages, one-shot vs. full, session lifecycle and the 17-event trace.' },
            { label: 'docs/modes.md', href: 'https://github.com/QYVORA/qyvora-mansa/blob/main/docs/modes.md', note: 'Simulation vs. live, and interface selection per surface.' },
            { label: 'docs/analysis-rules.md', href: 'https://github.com/QYVORA/qyvora-mansa/blob/main/docs/analysis-rules.md', note: 'Rule documentation.' },
            { label: 'docs/risk-scoring.md', href: 'https://github.com/QYVORA/qyvora-mansa/blob/main/docs/risk-scoring.md', note: 'How risk is computed.' },
            { label: 'docs/authorization.md', href: 'https://github.com/QYVORA/qyvora-mansa/blob/main/docs/authorization.md', note: 'The live-scope authorization gate.' },
          ],
        },
      ],
    },

    {
      id: 'reference',
      label: 'Reference',
      kicker: 'Detail',
      title: 'Rules and output',
      blocks: [
        {
          kind: 'prose',
          text: 'Twenty-one rules ship in the box. They fall into three groups: encryption and authentication posture, access-point configuration, and radio-environment conditions — with a fourth, smaller set covering observed station behaviour.',
        },
        {
          kind: 'table',
          caption: 'The built-in WLAN rules.',
          columns: [
            { key: 'id', label: 'ID', mono: true },
            { key: 'name', label: 'Rule' },
          ],
          rows: [
            { id: 'WLAN-001', name: 'Open Wireless Network' },
            { id: 'WLAN-002', name: 'WEP Encryption Detected' },
            { id: 'WLAN-003', name: 'WPA1 with TKIP Cipher' },
            { id: 'WLAN-004', name: 'WPA2 with TKIP Cipher' },
            { id: 'WLAN-005', name: 'WPS Enabled' },
            { id: 'WLAN-006', name: 'No Security Protocols Advertised' },
            { id: 'WLAN-007', name: 'WPA3 Transition Mode' },
            { id: 'WLAN-008', name: 'Protected Management Frames Disabled' },
            { id: 'WLAN-009', name: 'Hidden SSID' },
            { id: 'WLAN-010', name: 'Crowded Channel' },
            { id: 'WLAN-011', name: 'Overlapping 2.4 GHz Channels' },
            { id: 'WLAN-012', name: 'High Channel Utilization in 6 GHz' },
            { id: 'WLAN-013', name: 'Duplicate SSID / Evil Twin' },
            { id: 'WLAN-014', name: 'Station Associated to Open Network' },
            { id: 'WLAN-015', name: 'Excessive SSID Probing' },
            { id: 'WLAN-016', name: 'Deauthentication Flood' },
            { id: 'WLAN-017', name: 'Cleartext Traffic on Open Network' },
            { id: 'WLAN-018', name: 'Legacy Cipher Traffic' },
            { id: 'WLAN-020', name: 'Extremely Strong Signal Nearby' },
            { id: 'WLAN-021', name: 'Dense 2.4 GHz Deployment' },
            { id: 'WLAN-030', name: 'Legacy Protocol Support' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'The ID sequence has gaps',
          text: 'WLAN-019 and WLAN-022 through WLAN-029 are not registered. The IDs are stable identifiers rather than an index, so a gap in the sequence is expected — it does not indicate a missing rule.',
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'WLAN-021 and WLAN-011 are not the same finding',
          text: 'WLAN-011 reports overlapping 2.4 GHz channels between specific access points — an interference problem. WLAN-021 reports a dense 2.4 GHz deployment — a capacity and planning problem. They can fire together, and they have different remediations.',
        },
        {
          kind: 'subheading',
          text: 'Output',
        },
        {
          kind: 'table',
          columns: [
            { key: 'surface', label: 'Surface', mono: true },
            { key: 'flag', label: 'Flag', mono: true },
            { key: 'use', label: 'Use it for' },
          ],
          rows: [
            { surface: 'Global', flag: '-o, --output', use: 'Output format for any command.' },
            { surface: 'report', flag: '-f, --format', use: 'Report format: terminal, json, markdown, html, yaml.' },
            { surface: 'capabilities', flag: '-o json', use: 'The capability contract, for agents and automation.' },
          ],
        },
        {
          kind: 'prose',
          text: 'Sessions persist to disk, which is what makes re-analysis possible: `mansa analyze` works on a stored session without touching the radio again. `session` inspects saved sessions and `events` replays the stored event log for one.',
        },
      ],
    },
  ],
};

export default doc;
