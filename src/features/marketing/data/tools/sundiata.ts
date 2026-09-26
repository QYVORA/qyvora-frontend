import type { ToolDoc } from './types';

/**
 * SUNDIATA — offline identity and access assessment.
 *
 * Rule IDs and default severities come from the table in `README.md`, which
 * matches the `metadata(...)` calls in `internal/rules/builtin/builtin.go`.
 * Committed report figures come from `reports/result.json`.
 */
const doc: ToolDoc = {
  slug: 'sundiata',
  seoTitle: 'SUNDIATA — Offline identity directory assessment',
  seoDescription:
    'SUNDIATA is a terminal-native identity and access security assessment engine. It analyses offline identity directory snapshots for credential exposure, MFA, privilege mapping and attack paths with 13 built-in rules.',
  summary:
    'SUNDIATA reads an identity directory snapshot and reports what can be established from it: plaintext credential exposure, rotation state, MFA coverage on privileged identities, group membership, excessive privilege and the paths between them. Credential values are redacted before output and never stored, and live directory collection is refused rather than approximated. Thirteen built-in rules produce evidence-backed findings, including a graph-derived attack-path rule that reasons about relationships between identities rather than one account at a time.',

  sections: [
    {
      id: 'overview',
      label: 'Overview',
      kicker: 'Orientation',
      title: 'What SUNDIATA does',
      blocks: [
        {
          kind: 'prose',
          text: 'SUNDIATA is the identity and access member of the QYVORA offline assessment family. Where its siblings read an app profile, a malware sample, a forensic case or a cloud snapshot, SUNDIATA reads an identity directory: a JSON record of identities, their credential state, their group memberships and the relationships between them.',
        },
        {
          kind: 'prose',
          text: 'Two properties make it safe to point at a directory export. First, credential values are redacted before they reach a finding: the tool reports that a credential exists and where, never its value, and never writes one to disk. Second, there is no live collection — no LDAP bind, no domain query, no API call. A directory snapshot you did not explicitly provide is never read.',
        },
        {
          kind: 'prose',
          text: 'The distinguishing capability is relational. Most rules evaluate a single identity. SDT-009 does not: it reconstructs the paths through which an unprivileged identity can reach a sensitive group, and reports the chain rather than the endpoints. That is why the directory document has to carry relationships, not just a flat account list.',
        },
        {
          kind: 'stages',
          items: [
            {
              name: 'Load the directory',
              detail:
                'Read a directory document from a file, or select the built-in deterministic simulation with --sim.',
            },
            {
              name: 'Normalise identities',
              detail:
                'Accounts, groups, roles and their membership edges are parsed into typed observations under internal/analysis.',
              emits: 'analysis.Env',
            },
            {
              name: 'Redact credential material',
              detail:
                'Credential values are stripped and replaced before any rule can observe them, so no finding can carry one.',
            },
            {
              name: 'Build the relationship graph',
              detail:
                'internal/identity resolves membership, delegation and impersonation edges, so relationship rules can reason over paths instead of pairs.',
              emits: 'graph',
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
          title: 'Offline only',
          text: 'SUNDIATA contacts no directory service. It reads the snapshots you explicitly provide, which makes it deterministic, CI-friendly and safe to run against an export of a production directory.',
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
              command: 'git clone https://github.com/QYVORA/qyvora-sundiata.git && cd qyvora-sundiata',
              note: 'Clone the repository.',
            },
            { command: 'make build', note: 'Builds bin/sundiata.' },
            { command: 'make install', note: 'System-wide install to /usr/local/bin. Needs root.' },
            { command: 'make install-user', note: 'Per-user install to ~/.local/bin. No root required.' },
            { command: 'go build ./cmd/sundiata', note: 'Build the single binary directly.' },
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
            { label: 'Module', value: 'github.com/QYVORA/qyvora-sundiata', mono: true },
            { label: 'Go directive', value: '1.26.5', mono: true },
            { label: 'Entry package', value: './cmd/sundiata', mono: true },
            { label: 'Binary', value: 'sundiata', mono: true },
            { label: 'Env namespace', value: 'QYVORA_SUNDIATA_*', mono: true },
            { label: 'Input flag', value: '--directory <directory.json>', mono: true },
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
            { command: 'sundiata assess --sim', note: 'Analyse the built-in deterministic simulation. No domain controller required.' },
            { command: 'sundiata directory --sim', note: 'Emit a deterministic identity directory on stdout.' },
            { command: 'sundiata assess --directory directory.json', note: 'Analyse a directory document from a file.' },
            { command: 'sundiata assess --directory directory.json -o json', note: 'Machine-readable output.' },
            { command: 'sundiata assess --directory directory.json --profile deep', note: 'Profile: quick, standard or deep.' },
            { command: 'sundiata assess --directory directory.json --report-dir ./reports', note: 'Write a report artifact.' },
          ],
        },
        {
          kind: 'commands',
          title: 'Reading the results back',
          items: [
            { command: 'sundiata findings', note: 'List the findings from the most recent run.' },
            { command: 'sundiata evidence', note: 'Inspect the evidence chain behind a finding.' },
            { command: 'sundiata report -o json', note: 'Re-render the stored report from disk.' },
            { command: 'sundiata rules', note: 'List the rule set with default severities.' },
            { command: 'sundiata capabilities -o json', note: 'The machine-readable capability manifest.' },
            { command: 'sundiata sources', note: 'List supported directory sources and their status.' },
          ],
        },
        {
          kind: 'definitions',
          items: [
            { term: 'assess', detail: 'Run the analysis pipeline against --sim, --directory, or the configured target.' },
            { term: 'directory', detail: 'Generate or emit a deterministic identity directory. --out writes it to a file.' },
            { term: 'target add | clear', detail: 'Register or clear the default target.' },
            { term: 'findings', detail: 'Inspect the latest assessment findings.' },
            { term: 'evidence', detail: 'Inspect the evidence chain behind a finding.' },
            { term: 'report', detail: 'Render the latest assessment report from disk.' },
            { term: 'capabilities', detail: 'Machine-readable capability manifest.' },
            { term: 'sources', detail: 'List supported directory sources and their status.' },
            { term: 'rules', detail: 'List the registered rules and default severities.' },
            { term: 'console', detail: 'Interactive console over the same command set.' },
            { term: 'updates check | install', detail: 'Check for, and install, a verified release.' },
          ],
        },
        {
          kind: 'definitions',
          items: [
            { term: '--sim', detail: 'Analyse the built-in deterministic simulation.' },
            { term: '--directory', detail: 'Analyse an identity directory file (offline JSON).' },
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
          text: 'The family architecture, with an identity-domain observation set and a relationship graph that the other siblings do not need. `internal/identity` holds the domain knowledge, `internal/analysis` turns a directory document into typed observations, and the rules read only that.',
        },
        {
          kind: 'code',
          lang: 'go',
          path: 'internal/rules/builtin/builtin.go',
          filename: 'internal/rules/builtin/builtin.go',
          caption: 'The 13 built-in rules.',
          code: `func All() []rules.Rule {
\treturn []rules.Rule{
\t\t&plaintextCredential{},    // SDT-001
\t\t&rotationOverdue{},        // SDT-002
\t\t&privilegedNoMFA{},        // SDT-003
\t\t&passwordNeverExpires{},   // SDT-004
\t\t&disabledWithCredential{}, // SDT-005
\t\t&credentialReuse{},        // SDT-006
\t\t&secretInArtifact{},       // SDT-007
\t\t&excessPrivilege{},        // SDT-008
\t\t&attackPath{},             // SDT-009
\t\t&excessiveImpersonation{}, // SDT-010
\t\t&legacyAdmin{},            // SDT-011
\t\t&legacyCredential{},       // SDT-012
\t\t&longSession{},            // SDT-013
\t}
}`,
        },
        {
          kind: 'prose',
          text: 'Redaction is upstream of the rules, not applied at render time. By the time a rule runs, the credential value is already gone from the environment, so there is no code path — including a new rule added later — that can emit one.',
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Why SDT-009 needs relationships in the document',
          text: 'An attack path is a property of the graph, not of an account. If your directory export is a flat list of accounts with no membership edges, SDT-009 has nothing to traverse and will not fire. That is a property of the input, and the tool reports it rather than guessing.',
        },
        {
          kind: 'links',
          items: [
            {
              label: 'internal/rules/builtin/builtin.go',
              href: 'https://github.com/QYVORA/qyvora-sundiata/blob/main/internal/rules/builtin/builtin.go',
              note: 'The 13 rules, their IDs and default severities.',
            },
            {
              label: 'internal/identity',
              href: 'https://github.com/QYVORA/qyvora-sundiata/tree/main/internal/identity',
              note: 'Identity domain knowledge and relationship-graph construction.',
            },
            {
              label: 'internal/analysis',
              href: 'https://github.com/QYVORA/qyvora-sundiata/tree/main/internal/analysis',
              note: 'Directory document to typed observations.',
            },
            {
              label: 'internal/evidence',
              href: 'https://github.com/QYVORA/qyvora-sundiata/tree/main/internal/evidence',
              note: 'Evidence assembly and credential redaction.',
            },
            {
              label: 'internal/safety',
              href: 'https://github.com/QYVORA/qyvora-sundiata/tree/main/internal/safety',
              note: 'Authorization checks and the refusal of live collection.',
            },
            {
              label: 'reports/result.json',
              href: 'https://github.com/QYVORA/qyvora-sundiata/blob/main/reports/result.json',
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
          caption: 'SUNDIATA built-in rules, with default severities.',
          columns: [
            { key: 'id', label: 'ID', mono: true },
            { key: 'name', label: 'Rule' },
            { key: 'severity', label: 'Default', mono: true },
          ],
          rows: [
            { id: 'SDT-001', name: 'Plaintext credential exposure', severity: 'critical' },
            { id: 'SDT-002', name: 'Credential rotation overdue', severity: 'medium' },
            { id: 'SDT-003', name: 'Privileged identity without MFA', severity: 'high' },
            { id: 'SDT-004', name: 'Password never expires', severity: 'medium' },
            { id: 'SDT-005', name: 'Disabled identity retains access', severity: 'medium' },
            { id: 'SDT-006', name: 'Credential reuse across identities', severity: 'high' },
            { id: 'SDT-007', name: 'Secret material in files', severity: 'high' },
            { id: 'SDT-008', name: 'Excess privilege membership', severity: 'high' },
            { id: 'SDT-009', name: 'Identity attack path to sensitive group', severity: 'critical' },
            { id: 'SDT-010', name: 'Impersonation relationship', severity: 'medium' },
            { id: 'SDT-011', name: 'Legacy privileged account', severity: 'high' },
            { id: 'SDT-012', name: 'Legacy authentication hash exposure', severity: 'high' },
            { id: 'SDT-013', name: 'Excessive session lifetime', severity: 'low' },
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
            { format: 'markdown', use: 'Pasting into an access review.' },
            { format: 'html', use: 'A standalone, shareable report file.' },
          ],
        },
        {
          kind: 'note',
          variant: 'warning',
          title: 'The README quickstart comment is wrong',
          text: 'The README annotates `sundiata assess --sim` with "risk 100/100 (critical)". The committed result artifact from an actual --sim run in reports/ records 22 findings at score 80, level critical. The level matches; the score in the comment does not. Trust reports/result.json.',
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Part of the offline family',
          text: 'SUNDIATA shares its CLI shape, rule interface, event envelope and result document with KUSH, AMANIRENAS, TIMBUKTU and IMHOTEP. Only the input noun changes: `directory`, `sample`, `app`, `case`, `snapshot`.',
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
            { label: 'internal/cli/cli.go', href: 'https://github.com/QYVORA/qyvora-sundiata/blob/main/internal/cli/cli.go', note: 'The whole command surface and every flag definition.' },
            { label: 'internal/pipeline', href: 'https://github.com/QYVORA/qyvora-sundiata/tree/main/internal/pipeline', note: 'Stage orchestration.' },
            { label: 'internal/analysis', href: 'https://github.com/QYVORA/qyvora-sundiata/tree/main/internal/analysis', note: 'Observation parsing.' },
            { label: 'internal/identity', href: 'https://github.com/QYVORA/qyvora-sundiata/tree/main/internal/identity', note: 'Identity domain knowledge and graph construction.' },
            { label: 'internal/rules', href: 'https://github.com/QYVORA/qyvora-sundiata/tree/main/internal/rules', note: 'Rule interface and registry; builtin/ holds the 13 rules.' },
            { label: 'internal/output/output.go', href: 'https://github.com/QYVORA/qyvora-sundiata/blob/main/internal/output/output.go', note: 'Format resolution and the renderers.' },
            { label: 'pkg/models', href: 'https://github.com/QYVORA/qyvora-sundiata/tree/main/pkg/models', note: 'Finding, evidence, severity and confidence types.' },
            { label: 'Makefile', href: 'https://github.com/QYVORA/qyvora-sundiata/blob/main/Makefile', note: 'Build, test, vet and install layouts.' },
            { label: 'reports/', href: 'https://github.com/QYVORA/qyvora-sundiata/tree/main/reports', note: 'Committed example reports.' },
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
