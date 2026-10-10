import type { ToolDoc } from './types';

/**
 * AMINA — Operational Security & Host Exposure Assessment Framework.
 *
 * Nine-stage pipeline: DETECT PLATFORM → AUTHORIZE → COLLECT → CORRELATE
 * IDENTITIES → EVALUATE RULES → CORRELATE FINDINGS → FINALIZE → RENDER.
 * 23 collectors under `internal/collectors`, 52 rules, 25 capabilities.
 * Shipped: v0.9.0 published prebuilts, install.sh, self-update, simulation.
 */
const doc: ToolDoc = {
  slug: 'amina',
  seoTitle: 'AMINA — Operational Security & Host Exposure Assessment Framework',
  seoDescription:
    'Amina is QYVORA\'s open-source framework for operational security and host exposure assessment. It answers one question — what does this machine reveal? — by systematically collecting evidence about identity disclosure, network and remote-access exposure, software provenance, binary integrity, credential material, filesystem leakage, developer identity, cloud identity, metadata, persistence and OS hardening, then turning that evidence into deterministic, machine-readable findings with an explicit risk score.',
  summary:
    'AMINA examines the machine it is already running on — local host only, read-only by construction. A nine-stage pipeline runs 23 collectors and 52 rules, correlates identity disclosures, scores risk, and renders terminal, JSON, YAML, Markdown or HTML output. Version v0.9.0 ships a checksum-verified one-liner installer and prebuilt binaries for Linux, macOS and Windows (amd64 and arm64); Android/Termux installs from source. Simulation mode (`amina --simulate`) exercises the identical rule set offline, and self-update (`amina update`) is the single operation that writes to the host.',
  sections: [
    {
      id: 'overview',
      label: 'Overview',
      kicker: 'Orientation',
      title: 'What AMINA does',
      description:
        'A local-host assessment that never modifies the machine and never reports a secret value.',
      blocks: [
        {
          kind: 'prose',
          text: 'Amina is QYVORA\'s open-source framework for operational security and host exposure assessment. It runs on the host it is assessing and reports what an unprivileged local account could observe: identity disclosures, network and remote-access exposure, software provenance, binary integrity, credential material, filesystem leakage, developer identity, cloud identity, metadata, persistence and OS hardening.',
        },
        {
          kind: 'prose',
          text: 'The design constraint is honesty. Credentials found on disk are reported as salted fingerprints, locations and lengths — the value is discarded by the collector that read it, so a report can be shared without sharing the secret. Partial reports are explicit: a collector that cannot read something records why, and the report lists what it did not see.',
        },
        {
          kind: 'stages',
          items: [
            { name: 'Detect platform', detail: 'Identify OS, kernel, arch and capabilities.' },
            { name: 'Authorize', detail: 'Confirm the target is the local host; refuse remote targets.' },
            { name: 'Collect', detail: 'Run every selected collector over the host, concurrently up to --parallelism.' },
            { name: 'Correlate identities', detail: 'Join observations that describe the same operator.' },
            { name: 'Evaluate rules', detail: 'Match the collected snapshot against the 52-rule catalogue.' },
            { name: 'Correlate findings', detail: 'Bridge findings that describe one exposure.' },
            { name: 'Finalize', detail: 'Sort deterministically, score risk, stamp integrity.' },
            { name: 'Render', detail: 'Terminal, JSON, YAML, Markdown or HTML.' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Read-only by construction',
          text: 'Collectors open files to read and nothing else. The one write path is `amina update`, which replaces the binary from a checksum-verified release, asks first, and is the only capability flagged as changing state.',
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
          text: 'Amina v0.9.0 is published as prebuilt archives for Linux, macOS and Windows (amd64 and arm64). Every repository ships a root `install.sh` / `install.ps1` installer that detects the target, downloads the matching artifact, verifies its SHA-256 against the published `checksums.txt`, validates the executable format, and installs atomically into the correct user executable directory. Installers are generated from the shared `qyvora-dist` template.',
        },
        {
          kind: 'commands',
          title: 'Install from a release',
          items: [
            {
              command: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-amina/main/install.sh | bash',
              note: 'Linux and macOS. Detects OS and architecture, verifies SHA-256, installs the binary, icon and desktop entry, and wires up PATH.',
            },
            {
              command: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-amina/main/install.ps1 | iex',
              note: 'Windows PowerShell one-liner.',
            },
            {
              command: 'amina --version',
              note: 'Confirm the installed version after the install.',
            },
          ],
        },
        {
          kind: 'commands',
          title: 'From source',
          items: [
            { command: 'git clone https://github.com/QYVORA/qyvora-amina.git && cd qyvora-amina', note: 'Clone the repository.' },
            { command: 'make build', note: 'Builds bin/amina. Version, commit and date are stamped in via -ldflags.' },
            { command: 'make install', note: 'System-wide install to /usr/local/bin/amina. Needs root.' },
            { command: 'make install-user', note: 'Per-user install to ~/.local/bin/amina. No root required.' },
            { command: 'go build ./cmd/amina', note: 'Build the single binary directly with the Go toolchain (Go 1.26+).' },
          ],
        },
        {
          kind: 'facts',
          items: [
            { label: 'Latest release', value: 'v0.9.0 (published; anansi is the only tool carrying a different tag, v1.1.0)', mono: true },
            { label: 'Module', value: 'github.com/QYVORA/qyvora-amina', mono: true },
            { label: 'Go directive', value: '1.26.5', mono: true },
            { label: 'Entry package', value: './cmd/amina', mono: true },
            { label: 'Binary', value: 'amina', mono: true },
            { label: 'Platforms', value: 'Linux, macOS, Windows (amd64 + arm64)', mono: true },
            { label: 'Android', value: 'Termux — built from source; no prebuilt' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Version reporting',
          text: '`amina version` prints the version (e.g. `v0.9.0`); `amina version -o json` is the contract\'s machine-readable identity. Amina has no `--version`-only contract — the `version` subcommand is the canonical probe.',
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
          kind: 'prose',
          text: 'One workflow, two surfaces. The interactive console commands (via the shared `qyvora-tui` console) are the CLI commands, so anything you learn in the REPL works verbatim in a script.',
        },
        {
          kind: 'commands',
          title: 'Start here',
          items: [
            { command: 'amina --simulate', note: 'Run the identical rule set against the built-in synthetic dataset, offline. 5 findings, max risk 83 (high).' },
            { command: 'amina assess', note: 'Run a live assessment of the local host (default command).' },
            { command: 'amina', note: 'Interactive console on a real terminal; the same run with stdout redirected performs the assessment.' },
            { command: 'amina capabilities -o json', note: 'The machine-readable capability contract.' },
            { command: 'amina update --check', note: 'Verify the self-update path without installing.' },
          ],
        },
        {
          kind: 'commands',
          title: 'Output',
          items: [
            { command: 'amina assess -o json', note: 'Machine-readable output for pipelines.' },
            { command: 'amina assess --format markdown -o report.md', note: 'A standalone, shareable report file.' },
            { command: 'amina assess --min-severity medium', note: 'Filter findings below a severity threshold.' },
            { command: 'amina assess --depth deep', note: 'Exhaustive scans; materially slower. Quick, standard and deep are supported.' },
          ],
        },
        {
          kind: 'definitions',
          items: [
            { term: 'assess', detail: 'Run the full assessment pipeline against the local host (default).' },
            { term: 'tui', detail: 'Open the interactive console over the same command set.' },
            { term: 'capabilities', detail: 'Print the capability registry; `-o json` emits it machine-readably.' },
            { term: 'update', detail: 'Checksum-verified self-update. `--check` verifies without installing; `--dry-run` does the same offline.' },
            { term: 'version', detail: 'Version and build metadata; `-o json` is the contract\'s identity block.' },
          ],
        },
        {
          kind: 'note',
          variant: 'warning',
          title: 'Remote targets are refused',
          text: 'Amina examines the machine it is already running on. A `--remote` target is refused with exit code 3 rather than silently ignored.',
        },
      ],
    },

    {
      id: 'how-it-works',
      label: 'How it works',
      kicker: 'Internals',
      title: 'How it is built',
      description:
        'Deterministic, provenance-tracked, and honest about what a quiet section means.',
      blocks: [
        {
          kind: 'prose',
          text: 'Collectors run concurrently up to `--parallelism` (default: one per CPU, capped at 8), but concurrency is invisible in the output: outcomes are buffered per module and replayed in registry order, so a run with one worker and a run with eight produce the same report.',
        },
        {
          kind: 'prose',
          text: 'Determinism is tested rather than asserted. Findings are sorted by a fixed key, the report ID is derived from report content, and the only volatile field is wall-clock duration — two runs of the same fixture produce byte-identical output, which is what makes reports diffable, cacheable and signable.',
        },
        {
          kind: 'prose',
          text: 'Every stage a depth limit skipped is listed in the report\'s `limitations`, so a quiet section is never mistaken for a clean one. The capability registry is generated from the module table rather than maintained by hand, so a module cannot exist in the framework and be missing from the interface.',
        },
        {
          kind: 'links',
          items: [
            { label: 'internal/collectors', href: 'https://github.com/QYVORA/qyvora-amina/tree/main/internal/collectors', note: 'The 23 collectors, each behind build tags per platform.' },
            { label: 'internal/rules', href: 'https://github.com/QYVORA/qyvora-amina/tree/main/internal/rules', note: 'The 52-rule catalogue (SEC-, PRV-, NET-, ACC-, FS-, SHL-, PER-, PRC-, PST-, PERM-, CLD-, ART-, IDN-, META-, SW-, TOOL-, TMP-, APP-).' },
            { label: 'internal/capabilities', href: 'https://github.com/QYVORA/qyvora-amina/tree/main/internal/capabilities', note: 'The 25-capability registry.' },
            { label: 'cmd/amina', href: 'https://github.com/QYVORA/qyvora-amina/tree/main/cmd/amina', note: 'The CLI entry point.' },
            { label: 'Makefile', href: 'https://github.com/QYVORA/qyvora-amina/blob/main/Makefile', note: 'Build, test, vet and the /usr/local and ~/.local install layouts.' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Self-update is the only mutation',
          text: 'The updater downloads `amina_<version>_<os>_<arch>.<ext>` plus `checksums.txt`, verifies the SHA-256 before writing anything, refuses plain HTTP, and replaces the binary atomically. Go\'s `darwin` maps to the release token `macos`, matching the published artifact names.',
        },
      ],
    },

    {
      id: 'reference',
      label: 'Reference',
      kicker: 'Detail',
      title: 'Risk, rules and output',
      blocks: [
        {
          kind: 'subheading',
          text: 'The rule catalogue',
        },
        {
          kind: 'prose',
          text: '52 rules ship in the box: 2 critical, 22 high, 14 medium, 12 low and 2 informational. Findings carry an evidence state (`observed` or `inferred`), so a scored inference is never mistaken for a measured fact.',
        },
        {
          kind: 'table',
          caption: 'A selection of the built-in rules and their default severities.',
          columns: [
            { key: 'id', label: 'ID', mono: true },
            { key: 'name', label: 'Rule' },
            { key: 'severity', label: 'Default', mono: true },
          ],
          rows: [
            { id: 'SEC-001', name: 'Private key material present', severity: 'critical' },
            { id: 'PRV-002', name: 'System binary modified relative to its package', severity: 'critical' },
            { id: 'ACC-002', name: 'Privileged account with authorized SSH keys', severity: 'high' },
            { id: 'NET-001', name: 'Service listening on a wildcard address', severity: 'high' },
            { id: 'RMT-001', name: 'Password authentication permitted for SSH', severity: 'high' },
            { id: 'SEC-002', name: 'Credential material present', severity: 'high' },
            { id: 'SHL-002', name: 'Credential-shaped content in shell history', severity: 'high' },
            { id: 'PER-001', name: 'Startup entry runs a command from a user-writable location', severity: 'high' },
            { id: 'PERM-002', name: 'Credential or secret file readable by another account', severity: 'high' },
            { id: 'CLD-002', name: 'Cloud credential file present', severity: 'high' },
            { id: 'ACC-004', name: 'Account with a human name in the GECOS field', severity: 'medium' },
            { id: 'IDN-003', name: 'Git author identity configured', severity: 'medium' },
            { id: 'PRC-002', name: 'Process running with an unexpected working directory', severity: 'medium' },
            { id: 'TOOL-001', name: 'Offensive security tooling installed on this host', severity: 'medium' },
            { id: 'IDN-001', name: 'Hostname discloses a name or identifier', severity: 'low' },
            { id: 'SW-002', name: 'Installed software associated with a development project or employer', severity: 'low' },
            { id: 'IDN-002', name: 'Login name disclosed in the environment', severity: 'informational' },
            { id: 'NET-003', name: 'Service reachable only from this host', severity: 'informational' },
          ],
        },
        {
          kind: 'subheading',
          text: 'Risk scoring',
        },
        {
          kind: 'code',
          lang: 'text',
          filename: 'risk model',
          code: `raw = (0.40*impact + 0.20*exploitability + 0.20*exposure + 0.10*privilege) * 25 + sensitivity_bonus*10
raw = clamp(raw, 0, 100)
final = raw * confidence_weight`,
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'A ranking, not a calibrated probability',
          text: 'The risk model is a fixed weighting meant to rank findings within one report, not to predict exploitation.',
        },
        {
          kind: 'subheading',
          text: 'Output formats',
        },
        {
          kind: 'table',
          columns: [
            { key: 'format', label: 'Format', mono: true },
            { key: 'use', label: 'Use it for' },
          ],
          rows: [
            { format: 'terminal', use: 'Interactive reading. The default.' },
            { format: 'json', use: 'Pipelines. The full result document plus the JSONL event stream.' },
            { format: 'yaml', use: 'Pipelines that prefer YAML, and diffing two runs.' },
            { format: 'markdown', use: 'Pasting into an incident ticket or a report.' },
            { format: 'html', use: 'A standalone, shareable report file with no external assets.' },
          ],
        },
        {
          kind: 'prose',
          text: 'All five formats are covered by committed golden files, so a rendering change that alters a byte is a test failure rather than a surprise. Exit codes: `0` success, `1` runtime failure, `2` usage error, `3` unsupported, `130` interrupted.',
        },
      ],
    },

    {
      id: 'repository',
      label: 'Source map',
      kicker: 'Where things are',
      title: 'Where the code lives',
      blocks: [
        {
          kind: 'links',
          items: [
            { label: 'cmd/amina', href: 'https://github.com/QYVORA/qyvora-amina/tree/main/cmd/amina', note: 'The CLI entry point.' },
            { label: 'internal/collectors', href: 'https://github.com/QYVORA/qyvora-amina/tree/main/internal/collectors', note: 'Collector implementations, per-OS build tags.' },
            { label: 'internal/rules', href: 'https://github.com/QYVORA/qyvora-amina/tree/main/internal/rules', note: 'The rule catalogue.' },
            { label: 'internal/capabilities', href: 'https://github.com/QYVORA/qyvora-amina/tree/main/internal/capabilities', note: 'The capability registry.' },
            { label: 'install.sh', href: 'https://github.com/QYVORA/qyvora-amina/blob/main/install.sh', note: 'The generated one-liner installer.' },
            { label: 'README.md', href: 'https://github.com/QYVORA/qyvora-amina/blob/main/README.md', note: 'The authoritative repository documentation.' },
          ],
        },
      ],
    },
  ],
};

export default doc;