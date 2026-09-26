import type { ToolDoc } from './types';

/**
 * QYVORA-COMMON — the shared machine contract.
 *
 * This is a library plus a conformance runner, not a framework: nothing here
 * is a QYVORA tool binary. `contract/contract.go` is the reference schema and
 * `conformance/runner.go` verifies real binaries against it by shelling out.
 * Note the deliberate non-import: frameworks implement the contract natively.
 */
const doc: ToolDoc = {
  slug: 'qyvora-common',
  seoTitle: 'QYVORA-COMMON — The shared machine contract',
  seoDescription:
    'QYVORA-COMMON defines the minimum machine contract every QYVORA framework honours: identity blocks, a JSONL event envelope, canonical result and finding shapes, standard exit codes, and a conformance runner that verifies real binaries by shelling out to them.',
  summary:
    'QYVORA-COMMON is the layer that makes thirteen separate tools behave like one toolkit. It defines the minimum contract every framework honours — identity blocks, a shared JSONL event envelope, canonical result and finding shapes, standard exit codes and semver version rules — and ships a conformance runner that verifies a real binary against it. The frameworks do not import this module. Each implements the contract natively, and the runner shells out to the actual binary to check.',

  sections: [
    {
      id: 'overview',
      label: 'Overview',
      kicker: 'Orientation',
      title: 'What QYVORA-COMMON is',
      blocks: [
        {
          kind: 'prose',
          text: 'This is not a QYVORA tool. There is no binary to install and nothing to assess a target with. It is a Go module containing a contract package and a conformance runner, and its job is to make the rest of the toolkit predictable to an orchestrator or an agent.',
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'The frameworks do not import this module',
          text: 'This is the most important thing to understand about the design, and it is stated in the package documentation of `contract/contract.go` itself. Each framework implements the contract natively rather than depending on this package. The schemas here are a reference: something to build against and verify with, not a shared library to link against.',
        },
        {
          kind: 'prose',
          text: 'The reason is independence. A framework that imported the contract package would gain a version coupling to it — a change here would ripple into thirteen repositories. Native implementation means each tool can evolve its own internals while its machine-facing surface stays conformant, and the runner is what actually holds that surface honest.',
        },
        {
          kind: 'prose',
          text: 'The contract came out of a machine-layer readiness audit, referenced in the package documentation as section 14 of that audit. It is the minimum viable machine interface: not a description of what each tool does, but the handful of shapes and rules that have to be identical across all of them.',
        },
        {
          kind: 'subheading',
          text: 'What is in the box',
        },
        {
          kind: 'stages',
          items: [
            { name: 'contract/', detail: 'The reference schema: ten types, five exit codes, and validators for version and exit code.' },
            { name: 'conformance/', detail: 'The runner that builds and probes real framework binaries against the contract.' },
            { name: 'cmd/qyvora-conformance/', detail: 'A 139-line CLI over the runner, for a workspace or for binaries you point it at.' },
          ],
        },
        {
          kind: 'facts',
          items: [
            { label: 'Module', value: 'github.com/QYVORA/qyvora-common', mono: true },
            { label: 'Go directive', value: '1.26', mono: true },
            { label: 'Repository size', value: 'contract/contract.go 141 lines, conformance/runner.go 279 lines, cmd/ 139 lines', mono: true },
            { label: 'Frameworks covered', value: '13 — every QYVORA tool binary', mono: true },
            { label: 'Runtime dependencies', value: 'none — standard library only', mono: true },
            { label: 'Licence', value: 'No LICENSE file is committed', mono: true },
            { label: 'README', value: 'None — the package documentation is the documentation', mono: true },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'A small repository on purpose',
          text: 'Roughly 560 lines across three files, with no README, no LICENSE and no dependencies. If you are looking for somewhere to start reading the toolkit, this is the smallest complete file in it — contract/contract.go is a good fifteen minutes, and it tells you what every other tool is expected to look like from the outside.',
        },
      ],
    },

    {
      id: 'install',
      label: 'Build & run',
      kicker: 'Getting it',
      title: 'Building and running the runner',
      blocks: [
        {
          kind: 'prose',
          text: 'There is nothing to install. To build the conformance CLI you need a Go toolchain and a workspace containing the `qyvora-*` repositories, because the runner discovers them by scanning a directory.',
        },
        {
          kind: 'commands',
          title: 'Build the CLI',
          items: [
            { command: 'git clone https://github.com/QYVORA/qyvora-common.git && cd qyvora-common', note: 'Clone the repository.' },
            { command: 'go build -o bin/qyvora-conformance ./cmd/qyvora-conformance', note: 'Build the conformance CLI.' },
            { command: 'go test ./...', note: 'Run the contract and runner tests.' },
          ],
        },
        {
          kind: 'commands',
          title: 'Run it',
          items: [
            { command: 'qyvora-conformance', note: 'Discover the workspace, build every framework, and probe each one. The workspace root defaults to the parent of this module.' },
            { command: 'qyvora-conformance --root ../', note: 'Point at an explicit workspace root.' },
            { command: 'qyvora-conformance --skip-build', note: 'Probe binaries that are already built instead of rebuilding.' },
            { command: 'qyvora-conformance --bin /tmp/qf-mansa', note: 'Test one binary directly, by path.' },
            { command: 'qyvora-conformance --bin /tmp/a.bin:mansa', note: 'Test a binary whose filename does not match the framework name.' },
            { command: 'qyvora-conformance --json', note: 'Emit results as JSON, for CI.' },
          ],
        },
        {
          kind: 'prose',
          text: '`--bin` is the flag that makes the runner useful outside a full workspace. You can point it at a binary you just built, or at a release artifact, and check conformance without cloning thirteen repositories. The `path:name` form exists because a release binary is often renamed.',
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'What the runner does to your machine',
          text: 'By default it runs `go build` in every discovered repository, writing binaries to a build directory. Use `--skip-build` if you do not want that, or `--bin` to avoid discovery entirely. The probes themselves only invoke the built binary with version and validation flags.',
        },
      ],
    },

    {
      id: 'how-it-works',
      label: 'The contract',
      kicker: 'Reference',
      title: 'The machine contract',
      blocks: [
        {
          kind: 'prose',
          text: 'Ten types make up the schema. Eight describe data that flows between a framework and a consumer; two describe what a framework advertises about itself.',
        },
        {
          kind: 'definitions',
          items: [
            { term: 'Identity', detail: 'Framework name, version and optional schema version. Present on every machine stream and result.' },
            { term: 'Envelope', detail: 'The JSONL event envelope: schema_version, timestamp, execution_id, framework, level, event, and an optional data map.' },
            { term: 'Context', detail: 'Ties one run to a result, a target and an optional session.' },
            { term: 'Target', detail: 'What the assessment ran against: type, value and authorization.' },
            { term: 'Command', detail: 'One capability record: name, inputs, outputs, dangerous flag, authorization level, emitted events, deterministic flag.' },
            { term: 'CapabilityManifest', detail: 'The machine-readable capability document: framework, version, and its command list.' },
            { term: 'VersionResult', detail: 'The machine-readable version document: framework, version, commit, date, OS, arch.' },
            { term: 'FindFinding', detail: 'A per-finding record: id, rule, title, severity, confidence, target, evidence, remediation, timestamp.' },
            { term: 'Result', detail: 'The canonical single JSON document for a run: identity, context, findings, evidence, risk, events.' },
            { term: 'Risk', detail: 'The target-level risk block: score, level, and a rationale string.' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'The type is called FindFinding',
          text: 'The finding record type is named `FindFinding`, not `Finding`. That is not a typo in this page — it is the name in the source, and it exists to avoid colliding with the `Find` command vocabulary the frameworks share.',
        },
        {
          kind: 'subheading',
          text: 'Exit codes',
        },
        {
          kind: 'prose',
          text: 'Five exit codes are standard, and the distinction that matters most is the one between usage and runtime. An unknown flag is a usage error. A failure during an authorized run is a runtime error. Getting that backwards would make an orchestrator retry a typo forever.',
        },
        {
          kind: 'table',
          caption: 'Standard exit codes.',
          columns: [
            { key: 'code', label: 'Code', mono: true },
            { key: 'name', label: 'Constant', mono: true },
            { key: 'meaning', label: 'Meaning' },
          ],
          rows: [
            { code: '0', name: 'ExitSuccess', meaning: 'Success.' },
            { code: '1', name: 'ExitRuntime', meaning: 'Runtime failure during an otherwise valid run.' },
            { code: '2', name: 'ExitUsage', meaning: 'Usage error — an unknown flag or command.' },
            { code: '3', name: 'ExitUnsupported', meaning: 'Unsupported or declined. Authorization declines use this code by convention.' },
            { code: '130', name: 'ExitInterrupted', meaning: 'Interrupted (128 + SIGINT).' },
          ],
        },
        {
          kind: 'prose',
          text: 'The contract also enforces a version rule: a shipped binary must report a semantic version, never a bare development marker. `ValidateVersion` checks that with a regular expression matching `v?MAJOR.MINOR.PATCH`, and `IsSemverVersion` exposes the test on its own. A `dev` or `unknown` version string fails conformance.',
        },
        {
          kind: 'code',
          lang: 'go',
          path: 'contract/contract.go',
          filename: 'contract/contract.go',
          caption: 'The canonical result document. One JSON object per run.',
          code: `// Result is the canonical single JSON document for an assessment run.
type Result struct {
\tIdentity Identity      \`json:"identity"\`
\tContext  Context       \`json:"context"\`
\tFindings []FindFinding \`json:"findings,omitempty"\`
\tEvidence []any         \`json:"evidence,omitempty"\`
\tRisk     *Risk         \`json:"risk,omitempty"\`
\tEvents   []string      \`json:"events,omitempty"\`
}`,
        },
      ],
    },

    {
      id: 'conformance',
      label: 'Conformance',
      kicker: 'Verification',
      title: 'How conformance is checked',
      blocks: [
        {
          kind: 'prose',
          text: 'The runner never imports framework code. It builds each framework\'s real binary, executes it, and inspects what comes back — so a check exercises exactly what an orchestrator would see, not what the framework intends.',
        },
        {
          kind: 'prose',
          text: 'Discovery scans a directory for `qyvora-*` entries, excluding this repository, and keeps the ones it recognises. It then works out how to build each: `./cmd/<name>` when that directory holds non-test Go files, otherwise the repository root. That is why the three tools with root entry points — anansi, aksum and mansa — need no special handling.',
        },
        {
          kind: 'subheading',
          text: 'The four checks',
        },
        {
          kind: 'definitions',
          items: [
            {
              term: 'version-semver',
              detail:
                'The version output parses as JSON, the framework field is present and matches, and the version is a semantic version rather than a dev marker.',
            },
            {
              term: 'version-exit0',
              detail: 'The version command exits 0.',
            },
            {
              term: 'usage-exit-2',
              detail: 'An unknown flag exits 2, not 1. This is the usage-versus-runtime distinction.',
            },
            {
              term: 'unknown-cmd-exit-2',
              detail: 'An unknown command exits 2 — but only where the CLI shape allows it to be told apart from a target positional.',
            },
            {
              term: 'capabilities',
              detail: 'When a framework advertises a capabilities command, running it must exit 0. When it does not, the check passes with a note.',
            },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'One check is deliberately skipped for one framework',
          text: 'ANANSI\'s root command accepts an arbitrary positional as a target, so `toha3ee`-style input cannot be distinguished from a valid invocation. The descriptor sets SkipUnknownCmd for it, and the unknown-command check is skipped rather than reported as a pass. A check that cannot be meaningful is marked absent, not marked green.',
        },
        {
          kind: 'subheading',
          text: 'Descriptor differences across the toolkit',
        },
        {
          kind: 'prose',
          text: 'The descriptors are where contract drift becomes visible. Each framework is probed with the argument shape it actually accepts, and three variations are worth knowing about because they are real inconsistencies in the toolkit rather than deliberate design.',
        },
        {
          kind: 'table',
          caption: 'Probe descriptors in conformance/runner.go.',
          columns: [
            { key: 'tool', label: 'Framework', mono: true },
            { key: 'version', label: 'Version args', mono: true },
            { key: 'caps', label: 'Capabilities probed' },
          ],
          rows: [
            { tool: 'aksum', version: 'version --format json', caps: 'No — documented gap' },
            { tool: 'anansi', version: 'version -o json', caps: 'No — documented gap' },
            { tool: 'toha3ee', version: 'version -o json', caps: 'No — documented gap' },
            { tool: 'jabari', version: 'version -o json', caps: 'Yes' },
            { tool: 'nzinga', version: 'version -o json', caps: 'No — documented gap' },
            { tool: 'mansa', version: 'version -o json', caps: 'Yes' },
            { tool: 'shaka', version: 'version -o json', caps: 'No — documented gap' },
            { tool: 'sekhmet', version: 'version -o json', caps: 'No — documented gap' },
            { tool: 'kush, amanirenas, sundiata, timbuktu, imhotep', version: 'version -o json', caps: 'Yes' },
          ],
        },
        {
          kind: 'note',
          variant: 'warning',
          title: 'AKSUM uses a different flag name for the same thing',
          text: 'Every other framework is probed with `-o json`; AKSUM uses `--format json`. Both are accepted by their own tools, but an orchestrator that hard-codes one spelling will fail on the other. The same applies to the output-format flag generally: `-o` is the common spelling, and AKSUM is the exception.',
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'SHAKA has a capabilities command but is not probed for one',
          text: 'SHAKA documents both `shaka capabilities` and `shaka tools`. Its conformance descriptor has no CapJSON entry, so the check passes with the "documented gap" note rather than exercising the command. That is a gap in the descriptor, not an absence of the feature — and it is the kind of thing this repository exists to surface.',
        },
        {
          kind: 'links',
          items: [
            { label: 'contract/contract.go', href: 'https://github.com/QYVORA/qyvora-common/blob/main/contract/contract.go', note: 'The entire contract: ten types, five exit codes, and the version validators. Read this first.' },
            { label: 'conformance/runner.go', href: 'https://github.com/QYVORA/qyvora-common/blob/main/conformance/runner.go', note: 'Workspace discovery, descriptors, the build step and the four checks.' },
            { label: 'cmd/qyvora-conformance/main.go', href: 'https://github.com/QYVORA/qyvora-common/blob/main/cmd/qyvora-conformance/main.go', note: 'The CLI: root, skip-build, bin and json flags.' },
            { label: 'go.mod', href: 'https://github.com/QYVORA/qyvora-common/blob/main/go.mod', note: 'One module, Go 1.26, no dependencies.' },
          ],
        },
      ],
    },
  ],
};

export default doc;
