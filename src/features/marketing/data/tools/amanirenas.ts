import type { ToolDoc } from './types';

/**
 * AMANIRENAS — offline mobile application assessment.
 *
 * Rule IDs and default severities are taken from the table in `README.md`,
 * which matches the `metadata(...)` calls in `internal/rules/builtin/builtin.go`.
 * Committed report figures come from `reports/result.json`.
 */
const doc: ToolDoc = {
  slug: 'amanirenas',
  seoTitle: 'AMANIRENAS — Offline mobile app assessment',
  seoDescription:
    'AMANIRENAS is a terminal-native offline mobile application security assessment engine. It analyses app profiles and IPA snapshots for secrets, transport, storage, permissions and signing posture with 12 built-in rules.',
  summary:
    'AMANIRENAS reads a mobile application profile — the metadata, permissions, configuration, binaries and API surface recorded from an app — and reports what can be established from it: hardcoded secrets, transport and certificate-pinning posture, local storage handling, WebView usage, cryptography choices, permissions and signing. It never runs app code, and runtime assessment and live device acquisition are refused rather than approximated. Twelve built-in rules produce evidence-backed findings in five output formats.',

  sections: [
    {
      id: 'overview',
      label: 'Overview',
      kicker: 'Orientation',
      title: 'What AMANIRENAS does',
      blocks: [
        {
          kind: 'prose',
          text: 'AMANIRENAS is the mobile-application member of the QYVORA offline assessment family. Where KUSH reads a malware sample, SUNDIATA an identity directory, TIMBUKTU a forensic case and IMHOTEP a cloud snapshot, AMANIRENAS reads an app profile: a JSON record of an application\'s identity, permissions, configuration, embedded secrets, network endpoints and signing state.',
        },
        {
          kind: 'prose',
          text: 'The tool is explicit about what it is not. There is no device connection, no instrumentation, no dynamic analysis and no app execution. A profile that would need a running app to be judged produces a finding saying so, not a guess. That boundary is what makes the tool safe to point at an app you are not allowed to run.',
        },
        {
          kind: 'stages',
          items: [
            {
              name: 'Load the profile',
              detail:
                'Read an app profile from a file, or select the built-in deterministic simulation with --sim. The profile becomes the environment every rule reads from.',
            },
            {
              name: 'Normalise observations',
              detail:
                'Bundle and package identity, entitlements, permissions, transport configuration, storage declarations, embedded strings and signing facts are parsed into typed observations under internal/analysis.',
              emits: 'analysis.Env',
            },
            {
              name: 'Redact secret material',
              detail:
                'Detected secret values are redacted before they reach a finding. The rule reports that a secret exists and where, never the value itself.',
            },
            {
              name: 'Apply the rule set',
              detail:
                'The 12 built-in rules each read the same environment and emit findings with evidence attached.',
              emits: 'rules.Rule → []models.Finding',
            },
            {
              name: 'Score and render',
              detail:
                'Findings are scored into a target-level risk block and rendered in the requested output format.',
              emits: 'output.Format',
            },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Offline only',
          text: 'AMANIRENAS contacts nothing. It reads the profiles you explicitly provide, which makes it deterministic, CI-friendly and safe to run anywhere.',
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
            {
              command: 'git clone https://github.com/QYVORA/qyvora-amanirenas.git && cd qyvora-amanirenas',
              note: 'Clone the repository.',
            },
            { command: 'make build', note: 'Builds bin/amanirenas.' },
            { command: 'make install', note: 'System-wide install to /usr/local/bin. Needs root.' },
            { command: 'make install-user', note: 'Per-user install to ~/.local/bin. No root required.' },
            { command: 'go build ./cmd/amanirenas', note: 'Build the single binary directly.' },
            { command: 'make verify', note: 'Build, test and vet in one step.' },
          ],
        },
        {
          kind: 'note',
          variant: 'warning',
          title: 'The LICENSE file is empty',
          text: 'The README states MIT and the badge says MIT, but the LICENSE file committed in the repository is zero bytes. There is no committed licence text to rely on.',
        },
        {
          kind: 'facts',
          items: [
            { label: 'Module', value: 'github.com/QYVORA/qyvora-amanirenas', mono: true },
            { label: 'Go directive', value: '1.26.5', mono: true },
            { label: 'Entry package', value: './cmd/amanirenas', mono: true },
            { label: 'Binary', value: 'amanirenas', mono: true },
            { label: 'Env namespace', value: 'QYVORA_AMANIRENAS_*', mono: true },
            { label: 'Input flag', value: '--app <profile.json>', mono: true },
            { label: 'Installer', value: 'None — no release assets published yet' },
          ],
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
          kind: 'commands',
          title: 'The assessment path',
          items: [
            { command: 'amanirenas assess --sim', note: 'Analyse the built-in deterministic simulation. No device, no Xcode, no network.' },
            { command: 'amanirenas profile --sim', note: 'Emit a deterministic app profile on stdout.' },
            { command: 'amanirenas assess --app profile.json', note: 'Analyse an app profile from a file.' },
            { command: 'amanirenas assess --app profile.json -o json', note: 'Machine-readable output.' },
            { command: 'amanirenas assess --app profile.json --profile deep', note: 'Profile: quick, standard or deep.' },
            { command: 'amanirenas assess --app profile.json --report-dir ./reports', note: 'Write a report artifact.' },
          ],
        },
        {
          kind: 'commands',
          title: 'Reading the results back',
          items: [
            { command: 'amanirenas findings', note: 'List the findings from the most recent run.' },
            { command: 'amanirenas evidence', note: 'Inspect the evidence chain behind a finding.' },
            { command: 'amanirenas report -o json', note: 'Re-render the stored report from disk.' },
            { command: 'amanirenas rules', note: 'List the rule set with default severities.' },
            { command: 'amanirenas capabilities -o json', note: 'The machine-readable capability manifest.' },
            { command: 'amanirenas sources', note: 'List supported profile sources and their status.' },
          ],
        },
        {
          kind: 'prose',
          text: '`amanirenas` with no arguments opens the interactive console, whose commands are the CLI commands. On a real terminal it is a REPL; piped stdin falls back to a plain line reader.',
        },
        {
          kind: 'definitions',
          items: [
            { term: 'assess', detail: 'Run the analysis pipeline against --sim, --app, or the configured target.' },
            { term: 'profile', detail: 'Generate or emit a deterministic app profile. --out writes it to a file.' },
            { term: 'target add | clear', detail: 'Register or clear the default target.' },
            { term: 'findings', detail: 'Inspect the latest assessment findings.' },
            { term: 'evidence', detail: 'Inspect the evidence chain behind a finding.' },
            { term: 'report', detail: 'Render the latest assessment report from disk.' },
            { term: 'capabilities', detail: 'Machine-readable capability manifest.' },
            { term: 'sources', detail: 'List supported profile sources and their status.' },
            { term: 'rules', detail: 'List the registered rules and default severities.' },
            { term: 'console', detail: 'Interactive console over the same command set.' },
            { term: 'updates check | install', detail: 'Check for, and install, a verified release.' },
          ],
        },
        {
          kind: 'definitions',
          items: [
            { term: '--sim', detail: 'Analyse the built-in deterministic simulation.' },
            { term: '--app', detail: 'Analyse an app profile file (offline JSON).' },
            { term: '--profile', detail: 'Analysis profile: quick, standard, deep.' },
            { term: '--report-dir', detail: 'Write a report artifact to this directory.' },
            { term: '--no-report', detail: 'Do not write any report artifact.' },
            { term: '--table', detail: 'Render findings as a compact table.' },
            { term: '-o, --output', detail: 'Output format: terminal, json, yaml, markdown, html.' },
          ],
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
          text: 'The same architecture as the rest of the offline family, with a mobile-shaped observation set. `internal/mobile` holds the domain knowledge, `internal/analysis` turns a profile document into typed observations, and the rules read only that.',
        },
        {
          kind: 'code',
          lang: 'go',
          path: 'internal/rules/builtin/builtin.go',
          filename: 'internal/rules/builtin/builtin.go',
          caption: 'The 12 built-in rules.',
          code: `func All() []rules.Rule {
\treturn []rules.Rule{
\t\t&hardcodedSecret{},     // AMN-001
\t\t&insecureTransport{},   // AMN-002
\t\t&missingPinning{},      // AMN-003
\t\t&legacyWebView{},       // AMN-004
\t\t&weakCrypto{},          // AMN-005
\t\t&insecureStorage{},     // AMN-006
\t\t&clipboardLeak{},       // AMN-007
\t\t&verboseLogging{},      // AMN-008
\t\t&excessivePermissions{},// AMN-009
\t\t&lowMinimumOS{},        // AMN-010
\t\t&adhocSigning{},        // AMN-011
\t\t&missingTamper{},       // AMN-012
\t}
}`,
        },
        {
          kind: 'prose',
          text: 'Redaction happens before findings are constructed, not at render time. A rule that detects a hardcoded secret reports the location and the kind of secret; the value is replaced upstream, so there is no path where the raw value reaches stdout, a report file or an event stream.',
        },
        {
          kind: 'links',
          items: [
            {
              label: 'internal/rules/builtin/builtin.go',
              href: 'https://github.com/QYVORA/qyvora-amanirenas/blob/main/internal/rules/builtin/builtin.go',
              note: 'The 12 rules, their IDs and default severities.',
            },
            {
              label: 'internal/mobile',
              href: 'https://github.com/QYVORA/qyvora-amanirenas/tree/main/internal/mobile',
              note: 'Mobile domain knowledge: app metadata, permissions, platform posture.',
            },
            {
              label: 'internal/analysis',
              href: 'https://github.com/QYVORA/qyvora-amanirenas/tree/main/internal/analysis',
              note: 'Profile document to typed observations.',
            },
            {
              label: 'internal/evidence',
              href: 'https://github.com/QYVORA/qyvora-amanirenas/tree/main/internal/evidence',
              note: 'Evidence assembly, including secret redaction.',
            },
            {
              label: 'internal/safety',
              href: 'https://github.com/QYVORA/qyvora-amanirenas/tree/main/internal/safety',
              note: 'Authorization checks and the refusal of unimplemented runtime paths.',
            },
            {
              label: 'reports/result.json',
              href: 'https://github.com/QYVORA/qyvora-amanirenas/blob/main/reports/result.json',
              note: 'The committed result of a real --sim run.',
            },
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
          kind: 'table',
          caption: 'AMANIRENAS built-in rules, with default severities.',
          columns: [
            { key: 'id', label: 'ID', mono: true },
            { key: 'name', label: 'Rule' },
            { key: 'severity', label: 'Default', mono: true },
          ],
          rows: [
            { id: 'AMN-001', name: 'Hardcoded secret in app', severity: 'critical' },
            { id: 'AMN-002', name: 'Insecure transport', severity: 'critical' },
            { id: 'AMN-003', name: 'Missing certificate pinning', severity: 'medium' },
            { id: 'AMN-004', name: 'Legacy WebView usage', severity: 'medium' },
            { id: 'AMN-005', name: 'Weak cryptography', severity: 'medium' },
            { id: 'AMN-006', name: 'Insecure local data storage', severity: 'high' },
            { id: 'AMN-007', name: 'Sensitive data copied to clipboard', severity: 'medium' },
            { id: 'AMN-008', name: 'Sensitive data in logs', severity: 'low' },
            { id: 'AMN-009', name: 'Excessive permissions', severity: 'medium' },
            { id: 'AMN-010', name: 'Outdated minimum OS version', severity: 'low' },
            { id: 'AMN-011', name: 'Ad-hoc signing without verified distribution', severity: 'medium' },
            { id: 'AMN-012', name: 'No jailbreak or tamper detection', severity: 'medium' },
          ],
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
            { format: 'json', use: 'Pipelines and the shared machine contract.' },
            { format: 'yaml', use: 'Pipelines that prefer YAML; diffing two runs.' },
            { format: 'markdown', use: 'Pasting into a review or a ticket.' },
            { format: 'html', use: 'A standalone, shareable report file.' },
          ],
        },
        {
          kind: 'note',
          variant: 'warning',
          title: 'The README quickstart comment is wrong',
          text: 'The README annotates `amanirenas assess --sim` with "14 findings, risk 100/100 (critical)". The committed result artifact from an actual --sim run in reports/ records 14 findings at score 56, level medium. The finding count matches; the risk score in the comment does not. Trust reports/result.json.',
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Part of the offline family',
          text: 'AMANIRENAS shares its CLI shape, rule interface, event envelope and result document with KUSH, SUNDIATA, TIMBUKTU and IMHOTEP. Only the input noun changes: `profile`, `sample`, `directory`, `case`, `snapshot`.',
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
            { label: 'internal/cli/cli.go', href: 'https://github.com/QYVORA/qyvora-amanirenas/blob/main/internal/cli/cli.go', note: 'The whole command surface and every flag definition.' },
            { label: 'internal/pipeline', href: 'https://github.com/QYVORA/qyvora-amanirenas/tree/main/internal/pipeline', note: 'Stage orchestration.' },
            { label: 'internal/analysis', href: 'https://github.com/QYVORA/qyvora-amanirenas/tree/main/internal/analysis', note: 'Observation parsing.' },
            { label: 'internal/mobile', href: 'https://github.com/QYVORA/qyvora-amanirenas/tree/main/internal/mobile', note: 'Mobile domain knowledge.' },
            { label: 'internal/rules', href: 'https://github.com/QYVORA/qyvora-amanirenas/tree/main/internal/rules', note: 'Rule interface and registry; builtin/ holds the 12 rules.' },
            { label: 'internal/output/output.go', href: 'https://github.com/QYVORA/qyvora-amanirenas/blob/main/internal/output/output.go', note: 'Format resolution and the renderers.' },
            { label: 'pkg/models', href: 'https://github.com/QYVORA/qyvora-amanirenas/tree/main/pkg/models', note: 'Finding, evidence, severity and confidence types.' },
            { label: 'Makefile', href: 'https://github.com/QYVORA/qyvora-amanirenas/blob/main/Makefile', note: 'Build, test, vet and install layouts.' },
            { label: 'reports/', href: 'https://github.com/QYVORA/qyvora-amanirenas/tree/main/reports', note: 'Committed example reports.' },
          ],
        },
        {
          kind: 'note',
          variant: 'warning',
          title: 'The committed docs and examples are empty files',
          text: 'Every file under this repository\'s docs/ directory, plus examples/basic.json, examples/basic.yaml and configs/config.example.yaml, is committed as a zero-byte placeholder. Links to them open a blank page. The README, the Go source and the committed reports/result.json are the usable material.',
        },
      ],
    },
  ],
};

export default doc;
