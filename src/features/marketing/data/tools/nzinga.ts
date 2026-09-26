import type { ToolDoc } from './types';

/**
 * NZINGA — public-source OSINT collection.
 *
 * Sources live in `internal/intelligence/sources`, the safety contract in
 * `internal/safety/safety.go`, the five rules in
 * `internal/rules/builtin/builtin.go`, and dork packs in `internal/search`.
 */
const doc: ToolDoc = {
  slug: 'nzinga',
  seoTitle: 'NZINGA — Public-source OSINT collection',
  seoDescription:
    'NZINGA collects, normalizes, correlates and reports what can be learned about a target exclusively from public sources. Six collectors, five correlation rules, an SSRF-guarded authorization gate, and five report formats.',
  summary:
    'NZINGA answers one question: what can be learned about a target exclusively from public, open sources? It collects from certificate transparency, DNS, WHOIS, search, GitHub and abuse feeds; normalizes what comes back into entities and relationships; correlates observations into claims; and reports only what the evidence supports. It never reports the absence of something as proof that it is absent.',

  sections: [
    {
      id: 'overview',
      label: 'Overview',
      kicker: 'Orientation',
      title: 'What NZINGA does',
      blocks: [
        {
          kind: 'prose',
          text: 'NZINGA is a collector, not a scanner. Every input it uses is a public source that anyone can query without credentials. Its value is not access — it is normalization and correlation: six sources produce six incompatible shapes of data, and the work is turning them into one entity graph where a hostname observed in a certificate log and the same hostname resolved in DNS are recognizably the same thing.',
        },
        {
          kind: 'prose',
          text: 'The honesty constraint runs through the whole design. Every claim traces to collected observations, so a finding can be walked back to the evidence that produced it. And absence is never treated as absence-proof: if a source returned nothing, the report says the source returned nothing, not that the thing does not exist.',
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Read-mostly, and the gate is authorization',
          text: 'Every source operation is read-only, reversible, and never changes remote state. What requires authorization is not escalation but permission to collect — the distinction is encoded per-operation in internal/safety, not assumed.',
        },
        {
          kind: 'subheading',
          text: 'The pipeline',
        },
        {
          kind: 'stages',
          items: [
            { name: 'Collect', detail: 'Query the enabled public sources for the authorized target.' },
            { name: 'Normalize', detail: 'Reshape each source response into the shared observation model.' },
            { name: 'Graph', detail: 'Build the entity and relationship graph — hosts, certificates, accounts, organisations.' },
            { name: 'Correlate', detail: 'Derive claims from the graph. A claim is an inference, and is kept distinct from an observation.' },
            { name: 'Rules', detail: 'Five deterministic rules evaluate the correlated claims.' },
            { name: 'Risk & report', detail: 'Score, then render in any of five formats from the shared session model.' },
          ],
        },
        {
          kind: 'prose',
          text: 'The observation → claim → finding split is the core of the design. Observations are what a source said. Claims are what NZINGA inferred from observations. Findings are what a rule decided about a claim. Keeping them separate is what lets the report say how confident it is and why.',
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
          text: 'NZINGA ships a zero-config installer that detects OS, CPU and shell, downloads the matching prebuilt binary, verifies it against `checksums.txt`, and falls back to building from source when no release is published. On Linux it also installs the app icon and desktop entry.',
        },
        {
          kind: 'commands',
          title: 'One-liner install',
          items: [
            { command: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-nzinga/main/install.sh | bash', note: 'Downloads the prebuilt binary and verifies its checksum.' },
            { command: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-nzinga/main/install.ps1 | iex', note: 'PowerShell. Installs under %LOCALAPPDATA%\\Programs\\nzinga\\bin.' },
            { command: './install.sh', note: 'Run the installer from a checkout, on a machine with no network access to releases.' },
          ],
        },
        {
          kind: 'commands',
          title: 'From source',
          items: [
            { command: 'git clone https://github.com/QYVORA/qyvora-nzinga.git && cd qyvora-nzinga', note: 'Clone the repository.' },
            { command: 'make build', note: 'Builds bin/nzinga.' },
            { command: 'make check', note: 'gofmt + vet + test.' },
          ],
        },
        {
          kind: 'facts',
          items: [
            { label: 'Module', value: 'github.com/QYVORA/qyvora-nzinga', mono: true },
            { label: 'Entry point', value: 'cmd/nzinga', mono: true },
            { label: 'Binary', value: 'nzinga', mono: true },
            { label: 'Go', value: '1.26+', mono: true },
            { label: 'Licence', value: 'Apache-2.0 (LICENSE and NOTICE committed)', mono: true },
            { label: 'Auth env var', value: 'QYVORA_AUTHORIZED=true', mono: true },
          ],
        },
        {
          kind: 'subheading',
          text: 'Exit codes',
        },
        {
          kind: 'table',
          caption: 'Automation can branch on the exit code instead of parsing output.',
          columns: [
            { key: 'code', label: 'Code', mono: true },
            { key: 'meaning', label: 'Meaning' },
          ],
          rows: [
            { code: '0', meaning: 'Success.' },
            { code: '1', meaning: 'Runtime failure.' },
            { code: '2', meaning: 'Usage error.' },
            { code: '130', meaning: 'Interrupted (128 + SIGINT).' },
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
          title: 'Start here',
          items: [
            { command: 'nzinga assess --sim', note: 'Offline demo pipeline. No network activity, no authorization required.' },
            { command: 'nzinga sources list', note: 'List the enabled public sources.' },
            { command: 'nzinga capabilities', note: 'Print the advertised tool contract, for agents.' },
            { command: 'nzinga report session --format json', note: 'A JSON report from the saved session.' },
            { command: 'nzinga', note: 'Interactive console. A REPL on a real terminal; a plain line reader when piped.' },
          ],
        },
        {
          kind: 'commands',
          title: 'Against a live target',
          items: [
            { command: 'nzinga assess -y domain:example.com', note: 'Authorize the operator and assess. The target type is part of the target string.' },
            { command: 'nzinga assess -y domain:example.com --profile standard -o json', note: 'Machine-readable output for a pipeline.' },
            { command: 'nzinga findings -f json', note: 'List findings as JSON.' },
            { command: 'nzinga relationship graph', note: 'Print the entity and relationship graph.' },
            { command: 'nzinga assess -y domain:example.com --dry-run', note: 'Plan the run and show which sources would execute, without touching the network.' },
          ],
        },
        {
          kind: 'subheading',
          text: 'Commands',
        },
        {
          kind: 'definitions',
          items: [
            { term: 'assess', detail: 'Run the full pipeline against a target.' },
            { term: 'collect', detail: 'Run collection only.' },
            { term: 'analyze', detail: 'Run correlation and rules over the saved session.' },
            { term: 'findings', detail: 'List findings from the current session.' },
            { term: 'graph / relationship', detail: 'Inspect the entity and relationship graph.' },
            { term: 'evidence', detail: 'Show the observations behind a claim or finding.' },
            { term: 'report', detail: 'Render a report — `report session` for the whole session.' },
            { term: 'sources', detail: 'List or show configured public sources.' },
            { term: 'dorks', detail: 'List and run the bundled dork packs.' },
            { term: 'target', detail: 'Set and inspect the target.' },
            { term: 'show', detail: 'Show a stored entity, claim or observation.' },
            { term: 'capabilities', detail: 'The machine-readable tool contract.' },
            { term: 'updates', detail: 'Check for a newer release.' },
            { term: 'version', detail: 'Print version information.' },
          ],
        },
        {
          kind: 'subheading',
          text: 'Flags',
        },
        {
          kind: 'definitions',
          items: [
            { term: '-y, --authorized', detail: 'Assert the operator holds authorization. Or set QYVORA_AUTHORIZED=true.' },
            { term: '--sim', detail: 'Offline deterministic dataset. No network, no authorization needed.' },
            { term: '--profile', detail: 'Pipeline profile, e.g. standard.' },
            { term: '-o, --output', detail: 'terminal, json, markdown, html, yaml.' },
            { term: '-f, --format', detail: 'Format on the subcommands that take one, e.g. findings.' },
            { term: '--json', detail: 'Shorthand for JSON output.' },
            { term: '--dry-run', detail: 'Plan the run without executing any source.' },
            { term: '--events', detail: 'JSONL event stream.' },
            { term: '--dork-provider', detail: 'Search provider to run dork packs through.' },
            { term: '--dork-category', detail: 'Dork pack: general, documents, exposed_services, technology, social.' },
            { term: '--max-queries', detail: 'Cap the number of dork queries in a run.' },
            { term: '-c, --config', detail: 'Path to a config file.' },
            { term: '-q, --quiet', detail: 'Suppress progress output.' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'The gate is enforced in the CLI',
          text: 'Without authorization, live sources are not executed — the check happens in the CLI before any collector is dispatched, not inside each collector. That is why `-y` works uniformly across `assess` and `collect`, and why the test suite can assert the gate rather than trust it.',
        },
      ],
    },

    {
      id: 'how-it-works',
      label: 'How it works',
      kicker: 'Internals',
      title: 'Sources, safety and correlation',
      blocks: [
        {
          kind: 'subheading',
          text: 'The collectors',
        },
        {
          kind: 'table',
          caption: 'Sources in internal/intelligence/sources. All are public and unauthenticated.',
          columns: [
            { key: 'source', label: 'Source', mono: true },
            { key: 'yields', label: 'What it yields' },
          ],
          rows: [
            { source: 'crt.sh', yields: 'Certificates issued for the domain, and the hostnames in their SANs.' },
            { source: 'dns', yields: 'Resolution of discovered hostnames — which names actually point somewhere.' },
            { source: 'whois', yields: 'Registry metadata: registrant, dates, nameservers.' },
            { source: 'search', yields: 'Search-engine results, and the substrate for dork packs.' },
            { source: 'github', yields: 'Public accounts, repositories and commit metadata under a username or organisation.' },
            { source: 'abuseipdb', yields: 'Reputation context for discovered addresses.' },
          ],
        },
        {
          kind: 'subheading',
          text: 'The safety contract',
        },
        {
          kind: 'prose',
          text: 'Every operation carries metadata describing its class, risk level, target type, whether it needs authorization, whether it needs confirmation, whether it changes remote state, and whether it is reversible. The type exists so the contract is data, not a comment — a collector cannot forget to declare itself.',
        },
        {
          kind: 'code',
          lang: 'go',
          path: 'internal/safety/safety.go',
          filename: 'internal/safety/safety.go',
          caption: 'Every collection operation is read-only and reversible. Authorization is the gate, not escalation.',
          code: `// OperationMetadata describes one operation's safety contract. Every nzinga
// source operation is read-only, reversible, and never changes remote state.
type OperationMetadata struct {
\tID           string           \`json:"id"\`
\tName         string           \`json:"name"\`
\tDescription  string           \`json:"description"\`
\tClass        Class            \`json:"class"\`
\tRisk         models.RiskLevel \`json:"risk"\`
\tTargetType   string           \`json:"target_type"\`
\tAuthRequired bool             \`json:"authorization_required"\`
\tConfirm      bool             \`json:"confirmation_required"\`
\tChangesState bool             \`json:"changes_state"\`
\tReversible   bool             \`json:"reversible"\`
}`,
        },
        {
          kind: 'subheading',
          text: 'Correlation',
        },
        {
          kind: 'prose',
          text: 'Correlation is where the tool earns its keep. Two observations of the same entity from different sources become one node; the edges between nodes are relationships with their own provenance. A claim is derived from a set of observations, and a finding is a rule\'s verdict on a claim — so a reader can always walk back from a finding to the raw observations and see exactly what was inferred.',
        },
        {
          kind: 'links',
          items: [
            { label: 'internal/safety/safety.go', href: 'https://github.com/QYVORA/qyvora-nzinga/blob/main/internal/safety/safety.go', note: 'The safety model, as data.' },
            { label: 'internal/intelligence/sources', href: 'https://github.com/QYVORA/qyvora-nzinga/tree/main/internal/intelligence/sources', note: 'The six collectors.' },
            { label: 'internal/intelligence/correlation', href: 'https://github.com/QYVORA/qyvora-nzinga/tree/main/internal/intelligence/correlation', note: 'Observation to claim to finding.' },
            { label: 'internal/rules/builtin/builtin.go', href: 'https://github.com/QYVORA/qyvora-nzinga/blob/main/internal/rules/builtin/builtin.go', note: 'The five rules.' },
            { label: 'internal/search/dorks', href: 'https://github.com/QYVORA/qyvora-nzinga/tree/main/internal/search/dorks', note: 'Five dork packs as YAML. Edit these to add your own.' },
            { label: 'internal/reporting', href: 'https://github.com/QYVORA/qyvora-nzinga/tree/main/internal/reporting', note: 'Five renderers over one session model.' },
            { label: 'docs/Architecture.md', href: 'https://github.com/QYVORA/qyvora-nzinga/blob/main/docs/Architecture.md', note: 'Design and decisions.' },
            { label: 'docs/Security-Model.md', href: 'https://github.com/QYVORA/qyvora-nzinga/blob/main/docs/Security-Model.md', note: 'Authorization, SSRF guard, size caps, honest confidence.' },
          ],
        },
      ],
    },

    {
      id: 'reference',
      label: 'Reference',
      kicker: 'Detail',
      title: 'Rules, dorks and output',
      blocks: [
        {
          kind: 'prose',
          text: 'Five rules are registered in `internal/rules/builtin/builtin.go`. They are correlation rules, not scan checks: each one looks for a pattern across sources rather than a property of a single host.',
        },
        {
          kind: 'table',
          caption: 'The built-in rules.',
          columns: [
            { key: 'id', label: 'ID', mono: true },
            { key: 'name', label: 'Rule' },
          ],
          rows: [
            { id: 'OSINT-001', name: 'Username reuse across sources' },
            { id: 'OSINT-002', name: 'Infrastructure overlap across domains' },
            { id: 'OSINT-003', name: 'Personally identifying email exposed in public registries' },
            { id: 'OSINT-004', name: 'DNS wildcard resolves unknown hostnames' },
            { id: 'OSINT-005', name: 'Correlation claim surfaced as risk input' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'The docs list four rules; the code registers five',
          text: 'docs/Rules.md documents OSINT-001..004. The source also registers OSINT-005, which surfaces a correlation claim as risk input. The table above reflects the source. Note also that OSINT-004 is the reason a single unresolvable hostname in NZINGA output should not be read as "this host is not up" — a wildcard resolver answers for names that were never registered.',
        },
        {
          kind: 'subheading',
          text: 'Dork packs',
        },
        {
          kind: 'prose',
          text: 'Five dork packs ship as YAML under `internal/search/dorks`: `general`, `documents`, `exposed_services`, `technology` and `social`. Each is a plain list of queries, so adding coverage is a YAML edit rather than a code change. Runs are bounded by `--max-queries`, and the provider is selected with `--dork-provider`.',
        },
        {
          kind: 'subheading',
          text: 'Report formats',
        },
        {
          kind: 'prose',
          text: 'All five formats render from the same shared session/report model, and none is a stub. `--json` is a shorthand for `-o json`.',
        },
        {
          kind: 'table',
          columns: [
            { key: 'format', label: 'Format', mono: true },
            { key: 'use', label: 'Use it for' },
          ],
          rows: [
            { format: 'terminal', use: 'Interactive reading. The default.' },
            { format: 'json', use: 'Pipelines. The full session, observations included.' },
            { format: 'yaml', use: 'Diff-friendly review of a session.' },
            { format: 'markdown', use: 'A report body or pull-request comment.' },
            { format: 'html', use: 'A standalone shareable report.' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Extending collection',
          text: 'A new public source is one more OperationMetadata entry plus one collector behind the same interface. The safety contract, the authorization gate and the correlation layer need no changes — which is the point of encoding the contract as data.',
        },
      ],
    },
  ],
};

export default doc;
