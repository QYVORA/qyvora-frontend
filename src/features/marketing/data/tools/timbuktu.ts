import type { ToolDoc } from './types';

/**
 * TIMBUKTU — offline incident response and digital forensics.
 *
 * Rule IDs and default severities come from the table in `README.md`, which
 * matches the `metadata(...)` calls in `internal/rules/builtin/builtin.go`.
 * Committed report figures come from `reports/result.json`.
 */
const doc: ToolDoc = {
  slug: 'timbuktu',
  seoTitle: 'TIMBUKTU — Offline incident response and forensics',
  seoDescription:
    'TIMBUKTU is a terminal-native incident response and digital forensics engine. It analyses offline forensic case files for evidence integrity, persistence, artifacts, credential exposure, timelines and IOCs with 13 built-in rules.',
  summary:
    'TIMBUKTU reads a forensic case file — a record of evidence items, filesystem artifacts, process and logon activity, memory observations and network indicators — and reports what it can establish: whether the evidence is intact, what persistence was installed, what was executed, what credentials were exposed, and where the timeline has gaps. Every evidence item is content-hashed and integrity-verified, and the tool never modifies evidence. Thirteen built-in rules produce findings in five output formats.',

  sections: [
    {
      id: 'overview',
      label: 'Overview',
      kicker: 'Orientation',
      title: 'What TIMBUKTU does',
      blocks: [
        {
          kind: 'prose',
          text: 'TIMBUKTU is the incident-response member of the QYVORA offline assessment family. Where its siblings read an app profile, an identity directory, a malware sample or a cloud snapshot, TIMBUKTU reads a forensic case file: a JSON record of evidence items with their hashes, and the artifacts, process activity, logon events, memory observations and network indicators recovered from them.',
        },
        {
          kind: 'prose',
          text: 'Chain of custody is the constraint the tool is built around. Every evidence item is content-hashed and verified before it is used, a failed verification is itself a finding (DFI-001, critical), and nothing in the pipeline writes to an evidence item. In a forensic context that is the difference between a tool you can hand to someone else and one you cannot.',
        },
        {
          kind: 'prose',
          text: 'There is no live host acquisition. TIMBUKTU analyses only the case files you explicitly provide, and says so rather than approximating a collection it cannot do.',
        },
        {
          kind: 'stages',
          items: [
            {
              name: 'Load the case',
              detail:
                'Read a forensic case document from a file, or select the built-in deterministic simulation with --sim. No acquired host is required.',
            },
            {
              name: 'Verify integrity',
              detail:
                'Each evidence item is content-hashed and checked against its recorded digest before anything reads it. A mismatch is reported, not worked around.',
              emits: 'DFI-001 on failure',
            },
            {
              name: 'Normalise observations',
              detail:
                'Filesystem artifacts, autorun entries, scheduled tasks, service definitions, process activity, logon events and network indicators are parsed into typed observations under internal/analysis.',
              emits: 'analysis.Env',
            },
            {
              name: 'Assemble the timeline',
              detail:
                'internal/forensics orders observations into a timeline and records where coverage is missing, so a gap is distinguishable from an absence of activity.',
            },
            {
              name: 'Apply the rule set',
              detail:
                'The 13 built-in rules each read the environment and emit findings with evidence attached.',
              emits: 'rules.Rule → []models.Finding',
            },
            {
              name: 'Score and render',
              detail:
                'Findings are scored into a target-level risk block and rendered in the requested format.',
              emits: 'output.Format',
            },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Evidence is read-only',
          text: 'The pipeline opens evidence items for reading and never writes to them. Report artifacts go to a separate directory, so running an assessment cannot alter the case it is analysing.',
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
              command: 'git clone https://github.com/QYVORA/qyvora-timbuktu.git && cd qyvora-timbuktu',
              note: 'Clone the repository.',
            },
            { command: 'make build', note: 'Builds bin/timbuktu.' },
            { command: 'make install', note: 'System-wide install to /usr/local/bin. Needs root.' },
            { command: 'make install-user', note: 'Per-user install to ~/.local/bin. No root required.' },
            { command: 'go build ./cmd/timbuktu', note: 'Build the single binary directly.' },
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
            { label: 'Module', value: 'github.com/QYVORA/qyvora-timbuktu', mono: true },
            { label: 'Go directive', value: '1.26.5', mono: true },
            { label: 'Entry package', value: './cmd/timbuktu', mono: true },
            { label: 'Binary', value: 'timbuktu', mono: true },
            { label: 'Env namespace', value: 'QYVORA_TIMBUKTU_*', mono: true },
            { label: 'Input flag', value: '--case <case.json>', mono: true },
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
            { command: 'timbuktu assess --sim', note: 'Analyse the built-in deterministic simulation. No acquired host required.' },
            { command: 'timbuktu case --sim', note: 'Emit a deterministic forensic case on stdout.' },
            { command: 'timbuktu assess --case case.json', note: 'Analyse a forensic case file from disk.' },
            { command: 'timbuktu assess --case case.json -o json', note: 'Machine-readable output.' },
            { command: 'timbuktu assess --case case.json --profile deep', note: 'Profile: quick, standard or deep.' },
            { command: 'timbuktu assess --case case.json --report-dir ./reports', note: 'Write a report artifact.' },
          ],
        },
        {
          kind: 'commands',
          title: 'Reading the results back',
          items: [
            { command: 'timbuktu findings', note: 'List the findings from the most recent run.' },
            { command: 'timbuktu evidence', note: 'Inspect the evidence chain — this is where integrity verification is recorded.' },
            { command: 'timbuktu report -o json', note: 'Re-render the stored report from disk.' },
            { command: 'timbuktu rules', note: 'List the rule set with default severities.' },
            { command: 'timbuktu capabilities -o json', note: 'The machine-readable capability manifest.' },
            { command: 'timbuktu sources', note: 'List supported case sources and their status.' },
          ],
        },
        {
          kind: 'definitions',
          items: [
            { term: 'assess', detail: 'Run the analysis pipeline against --sim, --case, or the configured target.' },
            { term: 'case', detail: 'Generate or emit a deterministic forensic case. --out writes it to a file.' },
            { term: 'target add | clear', detail: 'Register or clear the default target.' },
            { term: 'findings', detail: 'Inspect the latest assessment findings.' },
            { term: 'evidence', detail: 'Inspect the evidence chain and integrity verification results.' },
            { term: 'report', detail: 'Render the latest assessment report from disk.' },
            { term: 'capabilities', detail: 'Machine-readable capability manifest.' },
            { term: 'sources', detail: 'List supported case sources and their status.' },
            { term: 'rules', detail: 'List the registered rules and default severities.' },
            { term: 'console', detail: 'Interactive console over the same command set.' },
            { term: 'updates check | install', detail: 'Check for, and install, a verified release.' },
          ],
        },
        {
          kind: 'definitions',
          items: [
            { term: '--sim', detail: 'Analyse the built-in deterministic simulation.' },
            { term: '--case', detail: 'Analyse a forensic case file (offline JSON).' },
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
          text: 'The family architecture, with a forensics-domain observation set and an integrity stage that runs before anything reads evidence. `internal/forensics` holds the domain knowledge, `internal/analysis` turns a case document into typed observations, and the rules read only that.',
        },
        {
          kind: 'code',
          lang: 'go',
          path: 'internal/rules/builtin/builtin.go',
          filename: 'internal/rules/builtin/builtin.go',
          caption: 'The 13 built-in rules.',
          code: `func All() []rules.Rule {
\treturn []rules.Rule{
\t\t&evidenceIntegrity{},   // DFI-001
\t\t&autorunPersistence{}, // DFI-002
\t\t&scheduledTask{},      // DFI-003
\t\t&serviceInstall{},     // DFI-004
\t\t&webShell{},           // DFI-005
\t\t&suspiciousFiles{},    // DFI-006
\t\t&suspiciousProcesses{},// DFI-007
\t\t&masqueradeBinary{},   // DFI-013
\t\t&credentialExposure{}, // DFI-008
\t\t&logonAnomaly{},       // DFI-009
\t\t&networkIndicator{},   // DFI-010
\t\t&hostsTampering{},     // DFI-011
\t\t&timelineGap{},        // DFI-012
\t}
}`,
        },
        {
          kind: 'prose',
          text: 'The timeline is a first-class output, not a rendering detail. Observations carry timestamps, `internal/forensics` orders them and records the intervals where no observation exists, and DFI-012 reports those intervals. The distinction matters: "nothing happened at 03:00" and "we have no data for 03:00" are different conclusions, and only one of them is supportable from a case file.',
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Read DFI-001 first',
          text: 'DFI-001 is the only rule that invalidates the rest of the run. If evidence integrity fails, every other finding is derived from evidence of unknown provenance. The rule is critical for that reason, not because tampering is the most likely event.',
        },
        {
          kind: 'links',
          items: [
            {
              label: 'internal/rules/builtin/builtin.go',
              href: 'https://github.com/QYVORA/qyvora-timbuktu/blob/main/internal/rules/builtin/builtin.go',
              note: 'The 13 rules, their IDs and default severities.',
            },
            {
              label: 'internal/forensics',
              href: 'https://github.com/QYVORA/qyvora-timbuktu/tree/main/internal/forensics',
              note: 'Forensics domain knowledge: integrity verification and timeline assembly.',
            },
            {
              label: 'internal/analysis',
              href: 'https://github.com/QYVORA/qyvora-timbuktu/tree/main/internal/analysis',
              note: 'Case document to typed observations.',
            },
            {
              label: 'internal/evidence',
              href: 'https://github.com/QYVORA/qyvora-timbuktu/tree/main/internal/evidence',
              note: 'Evidence items, hashing and integrity state.',
            },
            {
              label: 'reports/result.json',
              href: 'https://github.com/QYVORA/qyvora-timbuktu/blob/main/reports/result.json',
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
          caption: 'TIMBUKTU built-in rules, with default severities.',
          columns: [
            { key: 'id', label: 'ID', mono: true },
            { key: 'name', label: 'Rule' },
            { key: 'severity', label: 'Default', mono: true },
          ],
          rows: [
            { id: 'DFI-001', name: 'Evidence integrity failure', severity: 'critical' },
            { id: 'DFI-002', name: 'Autorun persistence', severity: 'high' },
            { id: 'DFI-003', name: 'Suspicious scheduled task', severity: 'high' },
            { id: 'DFI-004', name: 'Service with temp image path', severity: 'high' },
            { id: 'DFI-005', name: 'Web shell deployed', severity: 'critical' },
            { id: 'DFI-006', name: 'Suspicious files in unusual locations', severity: 'high' },
            { id: 'DFI-007', name: 'Suspicious process activity', severity: 'critical' },
            { id: 'DFI-008', name: 'Credential material on disk', severity: 'high' },
            { id: 'DFI-009', name: 'Logon anomalies detected', severity: 'medium' },
            { id: 'DFI-010', name: 'Network indicators present', severity: 'medium' },
            { id: 'DFI-011', name: 'HOSTS file modification', severity: 'medium' },
            { id: 'DFI-012', name: 'Timeline coverage gap', severity: 'low' },
            { id: 'DFI-013', name: 'Masquerading system binary', severity: 'high' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Registration order is not ID order',
          text: 'DFI-013 (masquerading system binary) is declared between DFI-007 and DFI-008 in the source, because it is the rule that reads the process-artifact observations. The table above is in ID order for reading; the code is not.',
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
            { format: 'markdown', use: 'Pasting into an incident report.' },
            { format: 'html', use: 'A standalone, shareable report file.' },
          ],
        },
        {
          kind: 'note',
          variant: 'warning',
          title: 'The README quickstart comment is wrong',
          text: 'The README annotates `timbuktu assess --sim` with "risk 100/100 (critical)". The committed result artifact from an actual --sim run in reports/ records 28 findings at score 62, level high. Neither the score nor the level in the comment matches. Trust reports/result.json.',
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Part of the offline family',
          text: 'TIMBUKTU shares its CLI shape, rule interface, event envelope and result document with KUSH, AMANIRENAS, SUNDIATA and IMHOTEP. Only the input noun changes: `case`, `sample`, `app`, `directory`, `snapshot`.',
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
            { label: 'internal/cli/cli.go', href: 'https://github.com/QYVORA/qyvora-timbuktu/blob/main/internal/cli/cli.go', note: 'The whole command surface and every flag definition.' },
            { label: 'internal/pipeline', href: 'https://github.com/QYVORA/qyvora-timbuktu/tree/main/internal/pipeline', note: 'Stage orchestration, including the integrity stage ordering.' },
            { label: 'internal/analysis', href: 'https://github.com/QYVORA/qyvora-timbuktu/tree/main/internal/analysis', note: 'Observation parsing.' },
            { label: 'internal/forensics', href: 'https://github.com/QYVORA/qyvora-timbuktu/tree/main/internal/forensics', note: 'Integrity verification and timeline assembly.' },
            { label: 'internal/evidence', href: 'https://github.com/QYVORA/qyvora-timbuktu/tree/main/internal/evidence', note: 'Evidence items, hashing and integrity state.' },
            { label: 'internal/rules', href: 'https://github.com/QYVORA/qyvora-timbuktu/tree/main/internal/rules', note: 'Rule interface and registry; builtin/ holds the 13 rules.' },
            { label: 'internal/output/output.go', href: 'https://github.com/QYVORA/qyvora-timbuktu/blob/main/internal/output/output.go', note: 'Format resolution and the renderers.' },
            { label: 'Makefile', href: 'https://github.com/QYVORA/qyvora-timbuktu/blob/main/Makefile', note: 'Build, test, vet and install layouts.' },
            { label: 'reports/', href: 'https://github.com/QYVORA/qyvora-timbuktu/tree/main/reports', note: 'Committed example reports.' },
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
