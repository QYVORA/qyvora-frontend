import type { ToolDoc } from './types';

/**
 * KUSH — offline malware sample analysis.
 *
 * Content is taken from the repository itself: the CLI definition in
 * `internal/cli/cli.go`, the rule set and IDs in
 * `internal/rules/builtin/builtin.go`, the configuration defaults in
 * `internal/config/config.go`, and the install layout in `Makefile`.
 */
const doc: ToolDoc = {
  slug: 'kush',
  seoTitle: 'KUSH — Offline malware sample analysis',
  seoDescription:
    'KUSH is a terminal-native offline malware analysis engine. Hash, metadata, static posture, strings, network indicators and IOC extraction from a sample document, with 14 built-in rules and five output formats.',
  summary:
    'KUSH reads a malware sample description and reports what can be established from it: hashes and provenance, metadata, static posture, strings, imported network indicators and extracted IOCs. It never executes the sample, and any behavioural claim carries its sandbox provenance in the evidence chain. Fourteen built-in rules turn those observations into findings, which render to the terminal, JSON, YAML, Markdown or HTML.',

  sections: [
    {
      id: 'overview',
      label: 'Overview',
      kicker: 'Orientation',
      title: 'What KUSH does',
      description:
        'A static, offline pipeline over a sample document. Nothing is executed and nothing is fetched.',
      blocks: [
        {
          kind: 'prose',
          text: 'KUSH is the malware-analysis member of the QYVORA offline assessment family. Where its siblings read an identity directory, a cloud snapshot, an app profile or a forensic case, KUSH reads a malware sample document — a JSON description of a file, its provenance, and the artefacts recovered from it.',
        },
        {
          kind: 'prose',
          text: 'The design constraint is honesty about provenance. KUSH is a static analyser: it reasons about imports, strings, sections and metadata, and it attaches the origin of each observation to the finding. Where a conclusion would require execution — whether a sample actually beacons, whether an encoded launcher does anything — the finding says so and carries the sandbox provenance instead of asserting a behaviour it cannot see.',
        },
        {
          kind: 'prose',
          text: 'That refusal is a rule, not a caveat. KSH-012 reports dynamic execution on the developer host as refused, at low severity, and the capability manifest advertises `kush.dynamic` as requiring a strongly isolated sandbox. A sample is never run on the machine doing the analysis.',
        },
        {
          kind: 'stages',
          items: [
            {
              name: 'Load the sample',
              detail:
                'Read a sample document from a file, or select the built-in deterministic simulation with --sim. The document becomes the analysis environment every rule reads from.',
            },
            {
              name: 'Normalise observations',
              detail:
                'Hashes, file metadata, section layout, imports and extracted strings are parsed into typed observations under internal/analysis. Nothing is inferred here — this stage only structures what the document states.',
              emits: 'analysis.Env',
            },
            {
              name: 'Derive indicators',
              detail:
                'internal/malware walks the observations for network indicators, URLs, hostnames, addresses, registry keys, file paths and mutex-like names, recording each with the string it came from.',
            },
            {
              name: 'Apply the rule set',
              detail:
                'The 14 built-in rules each read the same environment and emit findings with evidence attached. Rules never call each other and never write state, so a finding can always be traced to the observations that produced it.',
              emits: 'rules.Rule → []models.Finding',
            },
            {
              name: 'Score and render',
              detail:
                'Findings are scored into a target-level risk block and rendered in the requested output format. A report artifact is written unless --no-report is passed.',
              emits: 'output.Format',
            },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Offline by construction',
          text: 'KUSH performs no network access. Its input is a document on disk, and its output is a report on disk or on standard output. The `--sim` flag selects a built-in deterministic dataset, which makes the tool safe to run on an untrusted workstation and reproducible in CI.',
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
          text: 'KUSH ships no one-liner installer and no release assets yet, so the Makefile is the primary path. `go build ./cmd/kush` is the shortest one if you only need the binary.',
        },
        {
          kind: 'commands',
          title: 'From source',
          items: [
            {
              command: 'git clone https://github.com/QYVORA/qyvora-kush.git && cd qyvora-kush',
              note: 'Clone the repository.',
            },
            {
              command: 'make build',
              note: 'Builds bin/kush. Version, commit, date and user are stamped in via -ldflags.',
            },
            {
              command: 'make install',
              note: 'System-wide install to /usr/local/bin/kush. Needs root, and also installs the icon and desktop entry.',
            },
            {
              command: 'make install-user',
              note: 'Per-user install to ~/.local/bin/kush. No root required.',
            },
            {
              command: 'go build ./cmd/kush',
              note: 'Build the single binary directly with the Go toolchain.',
            },
            {
              command: 'make test && make vet',
              note: 'Run the test suite and go vet.',
            },
            {
              command: 'make verify',
              note: 'Build, test and vet in one step.',
            },
          ],
        },
        {
          kind: 'note',
          variant: 'warning',
          title: 'The LICENSE file is empty',
          text: 'The README links an MIT licence and the badge says MIT, but the LICENSE file committed in the repository is zero bytes. The badge is not backed by committed licence text. Treat reuse as unpermitted until a licence is added.',
        },
        {
          kind: 'facts',
          items: [
            { label: 'Module', value: 'github.com/QYVORA/qyvora-kush', mono: true },
            { label: 'Go directive', value: '1.26.5', mono: true },
            { label: 'Entry package', value: './cmd/kush', mono: true },
            { label: 'Binary', value: 'kush', mono: true },
            { label: 'Config', value: 'config.yaml on the search path, or QYVORA_KUSH_* env', mono: true },
            { label: 'Target state', value: '~/.config/qyvora/kush/targets.json', mono: true },
            { label: 'Default profile', value: 'standard', mono: true },
            { label: 'Default report dir', value: 'reports', mono: true },
            { label: 'Installer', value: 'None — no release assets published yet' },
          ],
        },
        {
          kind: 'prose',
          text: 'Configuration is layered, highest precedence first: the `QYVORA_KUSH_*` environment namespace (dots and dashes both become underscores), then a `config.yaml` found on the search path, then the built-in defaults. A missing config file is not an error; a malformed one is.',
        },
      ],
    },

    {
      id: 'usage',
      label: 'Commands',
      kicker: 'Running it',
      title: 'Commands',
      blocks: [
        {
          kind: 'prose',
          text: 'One workflow, two surfaces. The interactive console commands are the CLI commands, so anything you learn in the REPL works verbatim in a script.',
        },
        {
          kind: 'commands',
          title: 'The assessment path',
          items: [
            {
              command: 'kush assess --sim',
              note: 'Analyse the built-in deterministic simulation. No input file, no network.',
            },
            {
              command: 'kush sample --sim',
              note: 'Emit a deterministic sample document on stdout, ready to be edited or stored.',
            },
            {
              command: 'kush sample --sim > sample.json',
              note: 'Write the deterministic sample to a file. This is how you get a valid input document: the committed examples/basic.json is an empty placeholder, so generate your own rather than copying it.',
            },
            {
              command: 'kush assess --sample sample.json -o json',
              note: 'Machine-readable output for pipelines.',
            },
            {
              command: 'kush assess --sample sample.json --profile deep',
              note: 'Analysis profile: quick, standard or deep. Defaults from config.',
            },
            {
              command: 'kush assess --sample sample.json --report-dir ./reports',
              note: 'Write a report artifact into a directory.',
            },
            {
              command: 'kush assess --sample sample.json --no-report',
              note: 'Run the analysis without writing any artifact.',
            },
          ],
        },
        {
          kind: 'prose',
          text: 'The console is the same thing without the process boundary. `kush` with no arguments opens a REPL on a real terminal; piped stdin falls back to a plain line reader.',
        },
        {
          kind: 'commands',
          title: 'Reading the results back',
          items: [
            {
              command: 'kush findings',
              note: 'List the findings from the most recent run.',
            },
            {
              command: 'kush findings --table',
              note: 'Render the findings as a compact table.',
            },
            {
              command: 'kush evidence',
              note: 'Inspect the evidence chain behind the latest assessment.',
            },
            {
              command: 'kush report -o json',
              note: 'Re-render the stored report artifact from disk.',
            },
            {
              command: 'kush rules',
              note: 'List the registered rules with their default severities.',
            },
            {
              command: 'kush capabilities -o json',
              note: 'The machine-readable capability manifest, including the dynamic-execution refusal.',
            },
            {
              command: 'kush sources',
              note: 'List supported sample sources and their status.',
            },
          ],
        },
        {
          kind: 'definitions',
          items: [
            { term: 'assess', detail: 'Run the analysis pipeline against --sim, --sample, or the configured target.' },
            { term: 'sample', detail: 'Generate a deterministic sample malware document. --out writes it to a file.' },
            { term: 'findings', detail: 'Inspect the latest assessment findings. --table for a compact grid.' },
            { term: 'evidence', detail: 'Inspect the evidence chain behind a finding.' },
            { term: 'report', detail: 'Render the latest assessment report from disk.' },
            { term: 'target add | clear', detail: 'Register or clear the default target, so assess needs no flags.' },
            { term: 'capabilities', detail: 'Machine-readable capability manifest: commands, inputs, outputs, determinism.' },
            { term: 'sources', detail: 'List supported sample sources and their status.' },
            { term: 'rules', detail: 'List the registered analysis rules and their default severities.' },
            { term: 'console', detail: 'Interactive console over the same command set.' },
            { term: 'completion', detail: 'Shell completion scripts.' },
            { term: 'updates check | install', detail: 'Check for, and install, a verified release.' },
            { term: 'version', detail: 'Version and build metadata. Also the contract\'s machine-readable identity.' },
          ],
        },
      ],
    },

    {
      id: 'how-it-works',
      label: 'How it works',
      kicker: 'Internals',
      title: 'How it is built',
      description:
        'One shared environment, one rule registry, one renderer. A finding can always be traced to the observation that produced it.',
      blocks: [
        {
          kind: 'prose',
          text: 'KUSH is a pipeline of pure stages. Stage N receives a typed environment produced by stage N-1 and never reaches back. That is what makes a finding explainable: the evidence attached to it is the observation it was derived from, not a narrative assembled after the fact.',
        },
        {
          kind: 'code',
          lang: 'go',
          path: 'internal/rules/builtin/builtin.go',
          filename: 'internal/rules/builtin/builtin.go',
          caption:
            'Every rule reads the same Env and returns findings with evidence. Rules never call each other and never mutate shared state.',
          code: `// All returns the rules implicit in a stock assessment.
func All() []rules.Rule {
\treturn []rules.Rule{
\t\t&suspiciousImports{},      // KSH-001
\t\t&packedBinary{},           // KSH-002
\t\t&unsignedBinary{},         // KSH-003
\t\t&persistenceMechanism{},   // KSH-004
\t\t&c2Beaconing{},            // KSH-005
\t\t&encodedLauncher{},        // KSH-006
\t\t&embeddedPayload{},        // KSH-007
\t\t&userAgentImpersonation{}, // KSH-008
\t\t&networkPrivilegeImports{},// KSH-009
\t\t&highConfidenceIOCs{},     // KSH-010
\t\t&behaviorAnomalies{},      // KSH-011
\t\t&unverifiedDynamic{},      // KSH-012
\t\t&injectionPrimitives{},    // KSH-013
\t\t&writableExecutableSection{}, // KSH-014
\t}
}`,
        },
        {
          kind: 'prose',
          text: 'The rule body itself is small. A rule looks up an observation, and if the condition holds it constructs a finding through a shared helper that fills in the derived fields — rule ID, title, category, recommendation and the evidence chain — so every finding is shaped identically regardless of which rule produced it.',
        },
        {
          kind: 'code',
          lang: 'go',
          path: 'internal/rules/builtin/builtin.go',
          filename: 'internal/rules/builtin/builtin.go',
          caption: 'The shared finding constructor and the metadata defaults.',
          code: `// newFinding fills the derived fields of a finding uniformly.
func newFinding(m rules.Meta, env *analysis.Env, objects []string, attrs map[string]string, ev ...models.Evidence) *models.Finding {
\treturn &models.Finding{
\t\tRuleID:         m.ID,
\t\tTitle:          m.Name,
\t\tCategory:       m.Category,
\t\tDescription:    m.Description,
\t\tRecommendation: m.Recommendation,`,
        },
        {
          kind: 'prose',
          text: 'Confidence defaults to *observed*. A rule that cannot see the behaviour it is describing lowers its confidence rather than asserting it — which is why the behavioural rules KSH-005 and KSH-011 exist alongside KSH-012, the rule that exists specifically to record what the static pass refused to establish.',
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Why the pipeline is boring on purpose',
          text: 'Every stage boundary is a data boundary. There is no shared mutable state between analysis, rules and reporting, so the rule registry is testable in isolation, the renderer is testable against a fixed result document, and a regression in one stage cannot silently change another stage\'s output.',
        },
        {
          kind: 'links',
          items: [
            {
              label: 'internal/rules/builtin/builtin.go',
              href: 'https://github.com/QYVORA/qyvora-kush/blob/main/internal/rules/builtin/builtin.go',
              note: 'The 14 built-in rules, their IDs and the shared finding constructor.',
            },
            {
              label: 'internal/analysis',
              href: 'https://github.com/QYVORA/qyvora-kush/tree/main/internal/analysis',
              note: 'Typed observations: hashes, metadata, sections, imports, strings.',
            },
            {
              label: 'internal/malware',
              href: 'https://github.com/QYVORA/qyvora-kush/tree/main/internal/malware',
              note: 'Indicator derivation — URLs, hosts, addresses, paths, registry keys.',
            },
            {
              label: 'internal/pipeline',
              href: 'https://github.com/QYVORA/qyvora-kush/tree/main/internal/pipeline',
              note: 'Stage orchestration: what runs, in what order.',
            },
            {
              label: 'internal/config/config.go',
              href: 'https://github.com/QYVORA/qyvora-kush/blob/main/internal/config/config.go',
              note: 'Every configuration key with its default — the authoritative config reference.',
            },
            {
              label: 'internal/cli',
              href: 'https://github.com/QYVORA/qyvora-kush/tree/main/internal/cli',
              note: 'The command tree, including sample, which is how you produce a valid input document.',
            },
          ],
        },
        {
          kind: 'note',
          variant: 'warning',
          title: 'The committed docs and examples are empty files',
          text: 'Every file under this repository\'s docs/ directory, plus examples/basic.json, examples/basic.yaml and configs/config.example.yaml, is committed as a zero-byte placeholder. Links to them will open a blank page. The README, the Go source, and the committed reports/result.json are the usable material — and `kush sample --sim` prints a valid input document for you to start from.',
        },
      ],
    },

    {
      id: 'reference',
      label: 'Reference',
      kicker: 'Detail',
      title: 'Flags, rules and output',
      blocks: [
        {
          kind: 'subheading',
          text: 'Global flags',
        },
        {
          kind: 'definitions',
          items: [
            { term: '-o, --output', detail: 'Output format: terminal, json, yaml, markdown, html. Defaults to terminal.' },
            { term: '-q, --quiet', detail: 'Suppress informational terminal output.' },
            { term: '--no-color', detail: 'Disable ANSI colour. NO_COLOR is also honoured.' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'No --config flag',
          text: 'Unlike the other QYVORA frameworks, KUSH has no -c/--config flag. Configuration comes from the QYVORA_KUSH_* environment namespace and a config.yaml found on the search path, which is resolved in internal/config rather than by cobra.',
        },
        {
          kind: 'subheading',
          text: 'assess flags',
        },
        {
          kind: 'definitions',
          items: [
            { term: '--sim', detail: 'Analyse the built-in deterministic simulation.' },
            { term: '--sample', detail: 'Analyse a sample document file (offline JSON).' },
            { term: '--profile', detail: 'Analysis profile: quick, standard or deep. Defaults to standard.' },
            { term: '--report-dir', detail: 'Write a report artifact to this directory. Defaults to reports.' },
            { term: '--no-report', detail: 'Do not write any report artifact.' },
            { term: '--table', detail: 'Render findings as a compact table.' },
          ],
        },
        {
          kind: 'subheading',
          text: 'Configuration keys',
        },
        {
          kind: 'table',
          caption: 'Defaults declared in internal/config/config.go. Override with QYVORA_KUSH_<KEY>.',
          columns: [
            { key: 'key', label: 'Key', mono: true },
            { key: 'default', label: 'Default', mono: true },
            { key: 'effect', label: 'Effect' },
          ],
          rows: [
            { key: 'profile', default: 'standard', effect: 'Depth and width of the run: quick, standard or deep.' },
            { key: 'output', default: 'terminal', effect: 'Default output format.' },
            { key: 'verbose', default: 'false', effect: 'Verbose output.' },
            { key: 'quiet', default: 'false', effect: 'Suppress informational output.' },
            { key: 'json', default: 'false', effect: 'Shorthand for JSON output.' },
            { key: 'authorized', default: 'false', effect: 'Confirm the authorization scope non-interactively.' },
            { key: 'report.dir', default: 'reports', effect: 'Where report artifacts are written.' },
            { key: 'report.format', default: 'terminal', effect: 'Format of the written report artifact.' },
            { key: 'log.level', default: 'info', effect: 'Log verbosity.' },
            { key: 'session.dir', default: '(empty)', effect: 'Override the session store location.' },
            { key: 'target.state', default: '~/.config/qyvora/kush/targets.json', effect: 'Persisted target-manager state.' },
            { key: 'analysis.max_assets', default: '10000', effect: 'Cap on assets processed per run.' },
            { key: 'analysis.secret_scan_enabled', default: 'true', effect: 'Secret detection during analysis.' },
          ],
        },
        {
          kind: 'subheading',
          text: 'The built-in rule set',
        },
        {
          kind: 'prose',
          text: 'Fourteen rules, `KSH-001` through `KSH-014`, registered in `internal/rules/builtin/builtin.go`. Severities are the defaults declared alongside each rule.',
        },
        {
          kind: 'table',
          caption: 'KUSH built-in rules, with default severities.',
          columns: [
            { key: 'id', label: 'ID', mono: true },
            { key: 'name', label: 'Rule' },
            { key: 'severity', label: 'Default', mono: true },
          ],
          rows: [
            { id: 'KSH-001', name: 'Suspicious process-spawning imports', severity: 'high' },
            { id: 'KSH-002', name: 'Packed or high-entropy binary', severity: 'medium' },
            { id: 'KSH-003', name: 'Unsigned binary with no publisher', severity: 'medium' },
            { id: 'KSH-004', name: 'Persistent autostart mechanism', severity: 'high' },
            { id: 'KSH-005', name: 'Command-and-control indicators', severity: 'critical' },
            { id: 'KSH-006', name: 'Encoded command launcher', severity: 'high' },
            { id: 'KSH-007', name: 'Embedded staged payload', severity: 'medium' },
            { id: 'KSH-008', name: 'Browser user-agent impersonation', severity: 'medium' },
            { id: 'KSH-009', name: 'Socket imports with process access', severity: 'medium' },
            { id: 'KSH-010', name: 'Verified high-confidence IOC catalog', severity: 'informational' },
            { id: 'KSH-011', name: 'Behavioral anomalies from sandbox', severity: 'high' },
            { id: 'KSH-012', name: 'Dynamic execution on developer host refused', severity: 'low' },
            { id: 'KSH-013', name: 'Process injection primitives', severity: 'high' },
            { id: 'KSH-014', name: 'Writable-and-executable section', severity: 'medium' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'KSH-012 is a finding, not a failure',
          text: 'It reports that dynamic execution was refused on the developer host. Seeing it in a report is the correct outcome, not a misconfiguration — it is the record that the tool kept its promise.',
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
            { format: 'terminal', use: 'Interactive reading. The default; ANSI colour unless --no-color.' },
            { format: 'json', use: 'Pipelines. The full result document, conforming to the shared contract.' },
            { format: 'yaml', use: 'Pipelines that prefer YAML, and diffing two runs.' },
            { format: 'markdown', use: 'Pasting into an incident ticket or a pull-request comment.' },
            { format: 'html', use: 'A standalone, shareable report file with no external assets.' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Part of the offline family',
          text: 'KUSH shares its CLI shape, rule interface, event envelope and result document with AMANIRENAS, SUNDIATA, TIMBUKTU and IMHOTEP. Only the input noun changes: `sample`, `app`, `directory`, `case`, `snapshot`. Anything written against one works against the others.',
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
          kind: 'prose',
          text: 'The repository is small enough to read end to end. This is the map, in the order the pipeline runs.',
        },
        {
          kind: 'links',
          items: [
            {
              label: 'internal/cli/cli.go',
              href: 'https://github.com/QYVORA/qyvora-kush/blob/main/internal/cli/cli.go',
              note: 'The whole command surface, including every flag definition.',
            },
            {
              label: 'internal/pipeline',
              href: 'https://github.com/QYVORA/qyvora-kush/tree/main/internal/pipeline',
              note: 'Stage orchestration: what runs, in what order.',
            },
            {
              label: 'internal/analysis',
              href: 'https://github.com/QYVORA/qyvora-kush/tree/main/internal/analysis',
              note: 'Observation parsing.',
            },
            {
              label: 'internal/malware',
              href: 'https://github.com/QYVORA/qyvora-kush/tree/main/internal/malware',
              note: 'Indicator and IOC extraction.',
            },
            {
              label: 'internal/rules',
              href: 'https://github.com/QYVORA/qyvora-kush/tree/main/internal/rules',
              note: 'Rule interface and registry; builtin/ holds the 14 rules.',
            },
            {
              label: 'internal/output/output.go',
              href: 'https://github.com/QYVORA/qyvora-kush/blob/main/internal/output/output.go',
              note: 'Format resolution and the five renderers.',
            },
            {
              label: 'internal/config/config.go',
              href: 'https://github.com/QYVORA/qyvora-kush/blob/main/internal/config/config.go',
              note: 'Configuration precedence and every default.',
            },
            {
              label: 'pkg/models',
              href: 'https://github.com/QYVORA/qyvora-kush/tree/main/pkg/models',
              note: 'Finding, evidence, severity and confidence types shared across stages.',
            },
            {
              label: 'Makefile',
              href: 'https://github.com/QYVORA/qyvora-kush/blob/main/Makefile',
              note: 'Build, test, vet and the /usr/local and ~/.local install layouts.',
            },
            {
              label: 'reports/',
              href: 'https://github.com/QYVORA/qyvora-kush/tree/main/reports',
              note: 'Committed example reports — the fastest way to see real output.',
            },
          ],
        },
      ],
    },
  ],
};

export default doc;
