import type { ToolDoc } from './types';

/**
 * IMHOTEP — offline cloud configuration assessment.
 *
 * Rule IDs and default severities come from the table in `README.md`, which
 * matches the `metadata(...)` calls in `internal/rules/builtin/builtin.go`.
 * Committed report figures come from `reports/result.json`.
 */
const doc: ToolDoc = {
  slug: 'imhotep',
  seoTitle: 'IMHOTEP — Offline cloud configuration assessment',
  seoDescription:
    'IMHOTEP is a terminal-native cloud security assessment engine. It analyses offline cloud snapshots for IAM, storage, network, database, container and secret exposure with 14 built-in rules.',
  summary:
    'IMHOTEP reads a cloud snapshot — a record of IAM bindings, storage policies, network exposure, database configuration, container manifests and secret material — and reports what can be established from it: wildcard permissions, publicly readable or writable storage, unencrypted data at rest, internet-exposed administration and databases, privileged or root-running containers, and hardcoded secrets. Provider APIs are never contacted, and secret values are redacted before they reach a finding.',

  sections: [
    {
      id: 'overview',
      label: 'Overview',
      kicker: 'Orientation',
      title: 'What IMHOTEP does',
      blocks: [
        {
          kind: 'prose',
          text: 'IMHOTEP is the cloud-configuration member of the QYVORA offline assessment family. Where its siblings read an app profile, an identity directory, a malware sample or a forensic case, IMHOTEP reads a cloud snapshot: a JSON record of the IAM policies, storage policies, network rules, database settings, container manifests and secret references that describe an account.',
        },
        {
          kind: 'prose',
          text: 'The important property is that the snapshot is a description, not a connection. IMHOTEP never contacts a provider API. Whatever collection produced the snapshot — your own tooling, an export, a hand-written file — the assessment itself is a pure read of that document. That makes it usable in an account you cannot log into, and reproducible in CI.',
        },
        {
          kind: 'prose',
          text: 'Secret material is redacted at collection time, before a rule can observe it. Rules such as SEC-001 report that a hardcoded secret exists and where; there is no code path that emits the value.',
        },
        {
          kind: 'stages',
          items: [
            {
              name: 'Load the snapshot',
              detail:
                'Read a snapshot document from a file, or select the built-in deterministic simulation with --sim. No provider account is required.',
            },
            {
              name: 'Normalise by domain',
              detail:
                'The snapshot is split into typed observations by domain: internal/iam, internal/storage, internal/network, internal/misconfig, internal/containers and internal/secrets.',
              emits: 'analysis.Env',
            },
            {
              name: 'Evaluate exposure',
              detail:
                'Each domain package answers the questions it owns — is this policy public, is this port internet-reachable, does this container run as root — and records the reasoning, not just the verdict.',
            },
            {
              name: 'Apply the rule set',
              detail:
                'The 14 built-in rules each read the environment and emit findings with evidence attached. Rule IDs are namespaced by domain: IAM, STG, NET, DBE, CNT, SEC.',
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
          title: 'Provider-neutral by construction',
          text: 'Because the tool reads a normalised snapshot rather than a provider API, it is not tied to one cloud. The domain packages describe capabilities — IAM, storage, network, database, containers — rather than a vendor\'s resource names. Adapting it to a new provider means writing a collector, not changing a rule.',
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
              command: 'git clone https://github.com/QYVORA/qyvora-imhotep.git && cd qyvora-imhotep',
              note: 'Clone the repository.',
            },
            { command: 'make build', note: 'Builds bin/imhotep.' },
            { command: 'make install', note: 'System-wide install to /usr/local/bin. Needs root.' },
            { command: 'make install-user', note: 'Per-user install to ~/.local/bin. No root required.' },
            { command: 'go build ./cmd/imhotep', note: 'Build the single binary directly.' },
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
            { label: 'Module', value: 'github.com/QYVORA/qyvora-imhotep', mono: true },
            { label: 'Go directive', value: '1.26.5', mono: true },
            { label: 'Entry package', value: './cmd/imhotep', mono: true },
            { label: 'Binary', value: 'imhotep', mono: true },
            { label: 'Env namespace', value: 'QYVORA_IMHOTEP_*', mono: true },
            { label: 'Input flag', value: '--snapshot <snapshot.json>', mono: true },
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
            { command: 'imhotep assess --sim', note: 'Analyse the built-in deterministic simulation. No provider account required.' },
            { command: 'imhotep snapshot --sim', note: 'Emit a deterministic cloud snapshot on stdout.' },
            { command: 'imhotep assess --snapshot snapshot.json', note: 'Analyse a snapshot document from a file.' },
            { command: 'imhotep assess --snapshot snapshot.json -o json', note: 'Machine-readable output.' },
            { command: 'imhotep assess --snapshot snapshot.json --profile deep', note: 'Profile: quick, standard or deep.' },
            { command: 'imhotep assess --snapshot snapshot.json --report-dir ./reports', note: 'Write a report artifact.' },
          ],
        },
        {
          kind: 'commands',
          title: 'Reading the results back',
          items: [
            { command: 'imhotep findings', note: 'List the findings from the most recent run.' },
            { command: 'imhotep evidence', note: 'Inspect the evidence chain behind a finding.' },
            { command: 'imhotep report -o json', note: 'Re-render the stored report from disk.' },
            { command: 'imhotep rules', note: 'List the rule set with default severities.' },
            { command: 'imhotep providers', note: 'List the snapshot providers the tool understands.' },
            { command: 'imhotep capabilities -o json', note: 'The machine-readable capability manifest.' },
          ],
        },
        {
          kind: 'definitions',
          items: [
            { term: 'assess', detail: 'Run the analysis pipeline against --sim, --snapshot, or the configured target.' },
            { term: 'snapshot', detail: 'Generate or emit a deterministic cloud snapshot. --out writes it to a file.' },
            { term: 'target add | clear', detail: 'Register or clear the default target.' },
            { term: 'findings', detail: 'Inspect the latest assessment findings.' },
            { term: 'evidence', detail: 'Inspect the evidence chain behind a finding.' },
            { term: 'report', detail: 'Render the latest assessment report from disk.' },
            { term: 'providers', detail: 'List the snapshot providers the tool understands.' },
            { term: 'capabilities', detail: 'Machine-readable capability manifest.' },
            { term: 'rules', detail: 'List the registered rules and default severities.' },
            { term: 'console', detail: 'Interactive console over the same command set.' },
            { term: 'updates check | install', detail: 'Check for, and install, a verified release.' },
          ],
        },
        {
          kind: 'definitions',
          items: [
            { term: '--sim', detail: 'Analyse the built-in deterministic simulation.' },
            { term: '--snapshot', detail: 'Analyse a snapshot file (offline JSON).' },
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
          text: 'The family architecture with the widest domain surface of the five. IMHOTEP splits its observations by capability rather than by a single object, and its rule IDs are namespaced accordingly, so a finding states which domain raised it without needing the category field.',
        },
        {
          kind: 'code',
          lang: 'go',
          path: 'internal/rules/builtin/builtin.go',
          filename: 'internal/rules/builtin/builtin.go',
          caption: 'The 14 built-in rules.',
          code: `func All() []rules.Rule {
\treturn []rules.Rule{
\t\t&wildcardAction{},     // IAM-001
\t\t&wildcardResource{},   // IAM-002
\t\t&publicReadBucket{},   // STG-001
\t\t&publicWriteBucket{},  // STG-002
\t\t&unencryptedStorage{}, // STG-003
\t\t&internetAdminPort{},  // NET-001
\t\t&publicDatabase{},     // NET-002
\t\t&publicCompute{},      // NET-003
\t\t&unencryptedDatabase{},// DBE-001
\t\t&privilegedContainer{},// CNT-001
\t\t&hostNetworkPod{},     // CNT-002
\t\t&latestImageTag{},     // CNT-003
\t\t&runsAsRoot{},         // CNT-004
\t\t&hardcodedSecret{},    // SEC-001
\t}
}`,
        },
        {
          kind: 'prose',
          text: 'The domain packages are the reason the rule bodies are short. `internal/iam` answers whether a binding grants a wildcard action, `internal/storage` whether a policy is publicly readable, `internal/containers` whether a manifest runs as root. Each package returns the reasoning alongside the verdict, so a rule can attach an explanation rather than a boolean.',
        },
        {
          kind: 'table',
          caption: 'Domain packages and the rule IDs they back.',
          columns: [
            { key: 'domain', label: 'Rule prefix', mono: true },
            { key: 'package', label: 'Package', mono: true },
            { key: 'owns', label: 'What it decides' },
          ],
          rows: [
            { domain: 'IAM', package: 'internal/iam', owns: 'Whether a policy grants wildcard action or wildcard resource scope.' },
            { domain: 'STG', package: 'internal/storage', owns: 'Whether a bucket or container is public, writable, or unencrypted at rest.' },
            { domain: 'NET', package: 'internal/network', owns: 'Whether an administration port, database or compute workload is internet-reachable.' },
            { domain: 'DBE', package: 'internal/misconfig', owns: 'Whether a database is unencrypted at rest.' },
            { domain: 'CNT', package: 'internal/containers', owns: 'Container privilege, network namespace, image-tag immutability and root execution.' },
            { domain: 'SEC', package: 'internal/secrets', owns: 'Hardcoded secret material, redacted before it reaches a finding.' },
          ],
        },
        {
          kind: 'links',
          items: [
            {
              label: 'internal/rules/builtin/builtin.go',
              href: 'https://github.com/QYVORA/qyvora-imhotep/blob/main/internal/rules/builtin/builtin.go',
              note: 'The 14 rules, their IDs and default severities.',
            },
            {
              label: 'internal/cloud',
              href: 'https://github.com/QYVORA/qyvora-imhotep/tree/main/internal/cloud',
              note: 'Cloud snapshot normalisation — the provider-neutral core.',
            },
            {
              label: 'internal/iam',
              href: 'https://github.com/QYVORA/qyvora-imhotep/tree/main/internal/iam',
              note: 'IAM policy evaluation.',
            },
            {
              label: 'internal/storage',
              href: 'https://github.com/QYVORA/qyvora-imhotep/tree/main/internal/storage',
              note: 'Storage policy evaluation.',
            },
            {
              label: 'internal/network',
              href: 'https://github.com/QYVORA/qyvora-imhotep/tree/main/internal/network',
              note: 'Network reachability evaluation.',
            },
            {
              label: 'internal/containers',
              href: 'https://github.com/QYVORA/qyvora-imhotep/tree/main/internal/containers',
              note: 'Container manifest evaluation.',
            },
            {
              label: 'internal/secrets',
              href: 'https://github.com/QYVORA/qyvora-imhotep/tree/main/internal/secrets',
              note: 'Secret detection and redaction.',
            },
            {
              label: 'reports/result.json',
              href: 'https://github.com/QYVORA/qyvora-imhotep/blob/main/reports/result.json',
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
          caption: 'IMHOTEP built-in rules, with default severities, grouped by domain.',
          columns: [
            { key: 'id', label: 'ID', mono: true },
            { key: 'name', label: 'Rule' },
            { key: 'severity', label: 'Default', mono: true },
          ],
          rows: [
            { id: 'IAM-001', name: 'Wildcard action granted', severity: 'high' },
            { id: 'IAM-002', name: 'Wildcard resource scope', severity: 'high' },
            { id: 'STG-001', name: 'Publicly readable storage', severity: 'high' },
            { id: 'STG-002', name: 'Publicly writable storage', severity: 'critical' },
            { id: 'STG-003', name: 'Unencrypted storage at rest', severity: 'medium' },
            { id: 'NET-001', name: 'Administrative port exposed to the internet', severity: 'high' },
            { id: 'NET-002', name: 'Publicly accessible database', severity: 'critical' },
            { id: 'NET-003', name: 'Publicly exposed compute workload', severity: 'high' },
            { id: 'DBE-001', name: 'Unencrypted database at rest', severity: 'medium' },
            { id: 'CNT-001', name: 'Privileged container capability', severity: 'high' },
            { id: 'CNT-002', name: 'Host network namespace', severity: 'medium' },
            { id: 'CNT-003', name: 'Immutability-breaking image tag', severity: 'low' },
            { id: 'CNT-004', name: 'Container runs as root', severity: 'medium' },
            { id: 'SEC-001', name: 'Hardcoded secret material', severity: 'critical' },
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
            { format: 'markdown', use: 'Pasting into a cloud review.' },
            { format: 'html', use: 'A standalone, shareable report file.' },
          ],
        },
        {
          kind: 'note',
          variant: 'warning',
          title: 'The README quickstart comment is wrong',
          text: 'The README annotates `imhotep assess --sim` with "risk 100/100 (critical)". The committed result artifact from an actual --sim run in reports/ records 15 findings at score 76, level high. Neither the score nor the level in the comment matches. Trust reports/result.json.',
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Part of the offline family',
          text: 'IMHOTEP shares its CLI shape, rule interface, event envelope and result document with KUSH, AMANIRENAS, SUNDIATA and TIMBUKTU. Only the input noun changes: `snapshot`, `sample`, `app`, `directory`, `case`.',
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
            { label: 'internal/cli/cli.go', href: 'https://github.com/QYVORA/qyvora-imhotep/blob/main/internal/cli/cli.go', note: 'The whole command surface and every flag definition.' },
            { label: 'internal/pipeline', href: 'https://github.com/QYVORA/qyvora-imhotep/tree/main/internal/pipeline', note: 'Stage orchestration.' },
            { label: 'internal/cloud', href: 'https://github.com/QYVORA/qyvora-imhotep/tree/main/internal/cloud', note: 'Snapshot normalisation.' },
            { label: 'internal/discovery', href: 'https://github.com/QYVORA/qyvora-imhotep/tree/main/internal/discovery', note: 'Resource discovery within a snapshot.' },
            { label: 'internal/rules', href: 'https://github.com/QYVORA/qyvora-imhotep/tree/main/internal/rules', note: 'Rule interface and registry; builtin/ holds the 14 rules.' },
            { label: 'internal/output/output.go', href: 'https://github.com/QYVORA/qyvora-imhotep/blob/main/internal/output/output.go', note: 'Format resolution and the renderers.' },
            { label: 'Makefile', href: 'https://github.com/QYVORA/qyvora-imhotep/blob/main/Makefile', note: 'Build, test, vet and install layouts.' },
            { label: 'reports/', href: 'https://github.com/QYVORA/qyvora-imhotep/tree/main/reports', note: 'Committed example reports.' },
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
