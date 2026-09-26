import type { ToolDoc } from './types';

/**
 * TOHA3EE — local and network security assessment.
 *
 * Modules self-register through `init()` under `internal/attacks/*`; the ten
 * categories are recon, enum, osint, mitm, auth, espionage, post, switch, web
 * and wlan. `docs/Declined-Techniques.md` is the reference for what is
 * deliberately absent and why.
 */
const doc: ToolDoc = {
  slug: 'toha3ee',
  seoTitle: 'TOHA3EE — Network security assessment framework',
  seoDescription:
    'TOHA3EE is a Go network and local security assessment framework covering discovery, enumeration, credential auditing, vulnerability identification and authorised exploitation, with 73 modules across ten categories, driven from an interactive REPL, a guided wizard or one-shot commands.',
  summary:
    'TOHA3EE is the broadest framework in the toolkit. It covers the network assessment pipeline end to end — host and service discovery, enumeration, credential auditing, vulnerability identification and authorised exploitation — plus MITM, wireless and switch-layer capability, across ten module categories and 73 modules. It is driven from an interactive REPL, a guided wizard, or one-shot command sequences, and it is scriptable end to end.',

  sections: [
    {
      id: 'overview',
      label: 'Overview',
      kicker: 'Orientation',
      title: 'What TOHA3EE does',
      blocks: [
        {
          kind: 'note',
          variant: 'warning',
          title: 'Read this first',
          text: 'TOHA3EE actively redirects, poisons, decrypts and intercepts network traffic. Use it only on networks you own or are explicitly authorised to test. Running these modules against third parties is illegal in most jurisdictions. docs/Security.md is the place to start.',
        },
        {
          kind: 'prose',
          text: 'The scope is the network assessment pipeline, not a single technique. MITM is one capability among ten module categories — it is easy to assume TOHA3EE is a man-in-the-middle tool because that is the loudest part, but the framework is organised around the whole engagement: recon, enumeration, OSINT, credential auditing, exploitation, and the traffic-interception work that sits alongside them.',
        },
        {
          kind: 'prose',
          text: 'Three surfaces, one tool. The interactive REPL gives you a prompt and a live module set. The guided wizard walks an engagement step by step for people who do not yet know which module to reach for. One-shot commands let you script an exact sequence. All three drive the same module registry, so nothing is available in one surface and missing from another.',
        },
        {
          kind: 'subheading',
          text: 'The ten module categories',
        },
        {
          kind: 'table',
          caption: 'Module categories and their implementation directories under internal/attacks.',
          columns: [
            { key: 'cat', label: 'Category', mono: true },
            { key: 'covers', label: 'Covers' },
          ],
          rows: [
            { cat: 'recon', covers: 'Host and service discovery, port scanning, CVE probing. The largest category.' },
            { cat: 'enum', covers: 'Service and protocol enumeration.' },
            { cat: 'osint', covers: 'Open-source collection. The second largest category.' },
            { cat: 'mitm', covers: 'ARP, DHCP, DHCPv6, DNS and IPv6 poisoning, plus inline HTTP/HTTPS interception.' },
            { cat: 'auth', covers: 'Credential auditing and authentication testing.' },
            { cat: 'espionage', covers: 'Collection of data from a positioned or compromised vantage point.' },
            { cat: 'post', covers: 'Post-exploitation.' },
            { cat: 'switch', covers: 'Switch-layer assessment.' },
            { cat: 'web', covers: 'Web application testing.' },
            { cat: 'wlan', covers: 'Wireless assessment.' },
          ],
        },
        {
          kind: 'prose',
          text: 'Modules self-register. Each attack file declares itself through an `init()` that calls the registry, so adding a module means adding a file and a declaration — there is no central list to edit and no import wiring in the command layer. The registry is assembled from the categories at build time, which is why the count in the documentation and the count at runtime stay in step.',
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
          text: 'TOHA3EE has one-liner installers that fetch the prebuilt binary for your platform from the release page. The installers also update PATH, and the Linux installer installs a desktop entry and icon.',
        },
        {
          kind: 'commands',
          title: 'One-liner install',
          items: [
            { command: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-toha3ee/main/install.sh | bash', note: 'Linux and macOS.' },
            { command: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-toha3ee/main/install.ps1 | iex', note: 'Windows PowerShell.' },
          ],
        },
        {
          kind: 'commands',
          title: 'From source',
          items: [
            { command: 'git clone https://github.com/QYVORA/qyvora-toha3ee.git && cd qyvora-toha3ee', note: 'Clone the repository.' },
            { command: 'make build', note: 'Builds bin/toha3ee.' },
            { command: 'go build -o bin/toha3ee ./cmd/toha3ee', note: 'Equivalent, without make.' },
            { command: 'make verify', note: 'Build, test, vet and lint.' },
          ],
        },
        {
          kind: 'facts',
          items: [
            { label: 'Module', value: 'github.com/QYVORA/qyvora-toha3ee', mono: true },
            { label: 'Entry point', value: 'cmd/toha3ee', mono: true },
            { label: 'Binary', value: 'toha3ee', mono: true },
            { label: 'Licence', value: 'MIT (LICENSE committed)', mono: true },
            { label: 'Modules', value: '73 across 10 categories', mono: true },
            { label: 'Network state', value: 'Active — redirects, poisons, decrypts and intercepts traffic', mono: true },
          ],
        },
        {
          kind: 'subheading',
          text: 'Updating',
        },
        {
          kind: 'prose',
          text: '`toha3ee update` checks for a newer release, verifies the downloaded artifact against the published checksums, and replaces the binary. Because this tool interacts with live network state, read the changelog between versions rather than updating mid-engagement.',
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
          title: 'The surfaces',
          items: [
            { command: 'toha3ee', note: 'Interactive REPL. The default when run with no arguments.' },
            { command: 'toha3ee wizard', note: 'Guided wizard — walks an engagement step by step.' },
            { command: 'toha3ee run <module> --target <host>', note: 'Run one module, one-shot.' },
            { command: 'toha3ee modules', note: 'List every registered module, by category.' },
            { command: 'toha3ee report', note: 'Render findings from the current session.' },
            { command: 'toha3ee script <file>', note: 'Run a scripted sequence of modules.' },
            { command: 'toha3ee build <script>', note: 'Build a repeatable engagement script.' },
            { command: 'toha3ee eval <target>', note: 'Evaluate a target and recommend modules.' },
            { command: 'toha3ee completion', note: 'Generate shell completion scripts.' },
          ],
        },
        {
          kind: 'prose',
          text: '`eval` is the interesting one for a first engagement: point it at a target and it recommends which modules apply, rather than requiring you to already know. `build` and `script` are how TOHA3EE becomes reproducible — a sequence you have tuned once can be saved and re-run identically.',
        },
        {
          kind: 'subheading',
          text: 'Global flags',
        },
        {
          kind: 'definitions',
          items: [
            { term: '-o, --output', detail: 'Output format. See docs/Reporting.md.' },
            { term: '-t, --target', detail: 'The target host, address or CIDR.' },
            { term: '--interface', detail: 'Network interface to use, for MITM and wireless modules.' },
            { term: '--threads', detail: 'Concurrency for scanning modules.' },
            { term: '--timeout', detail: 'Per-operation timeout.' },
            { term: '--rate', detail: 'Rate limit, for scan modules.' },
            { term: '-v, --verbose', detail: 'Verbose output.' },
            { term: '-q, --quiet', detail: 'Suppress progress output.' },
            { term: '--no-color', detail: 'Disable ANSI colour.' },
            { term: '-c, --config', detail: 'Path to a config file.' },
            { term: '--events', detail: 'JSONL event stream for automation.' },
          ],
        },
        {
          kind: 'note',
          variant: 'warning',
          title: 'The REPL is a real terminal surface',
          text: 'TOHA3EE\'s interactive mode drives live network state. Know what you have typed before you hit enter — a module that starts poisoning will keep running until you stop it, and a mistyped interface is a live change to someone else\'s network.',
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
          text: 'The module system is the architecture. `internal/attacks/registry.go` owns registration and lookup; each category package registers its own modules from `init()`; `internal/attacks/common.go` and `context.go` provide the shared execution context every module receives. The command layer never imports a module directly — it asks the registry — so a new module is a new file plus a declaration, and the REPL, the wizard, one-shot commands and scripts all pick it up for free.',
        },
        {
          kind: 'prose',
          text: 'The MITM modules are separated from the rest for a reason. ARP, DHCP, DHCPv6, DNS and IPv6 spoofing share a spoofing base, while inline HTTP/HTTPS interception is a different mechanism again. Keeping them in one category makes the traffic-interception capability auditable in a single directory, which matters for a tool that can alter a network.',
        },
        {
          kind: 'subheading',
          text: 'What is deliberately not here',
        },
        {
          kind: 'prose',
          text: '`docs/Declined-Techniques.md` is the most substantive document in this repository, and it is worth reading before the module reference. It documents, in one place, the techniques TOHA3EE does not implement and why, split into two distinct lists.',
        },
        {
          kind: 'definitions',
          items: [
            {
              term: 'Ethically refused',
              detail:
                'Techniques whose primary purpose is to persist, evade detection, destroy or exfiltrate. The line is drawn where the tool would become an APT-style agent rather than an engagement console. Host persistence is the first entry.',
            },
            {
              term: 'Technically declined',
              detail:
                'Techniques that are legitimate offensive-security work but are not shipped — because the honest implementation needs an external component, because hardware or radio constraints prevent a usable result, or because the effort-to-value ratio is wrong. These appear as Limitations on the affected modules.',
            },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'A gap in the docs is intentional',
          text: 'The distinction matters when you are assessing coverage. A technique in the ethically-refused list will never appear in a future release. A technique in the technically-declined list might, once its blocker is resolved. Reading the module list alone would not tell you which of the two you are looking at.',
        },
        {
          kind: 'links',
          items: [
            { label: 'cmd/toha3ee', href: 'https://github.com/QYVORA/qyvora-toha3ee/tree/main/cmd/toha3ee', note: 'Entry point.' },
            { label: 'internal/attacks/registry.go', href: 'https://github.com/QYVORA/qyvora-toha3ee/blob/main/internal/attacks/registry.go', note: 'The module registry every surface resolves against.' },
            { label: 'internal/attacks/mitm', href: 'https://github.com/QYVORA/qyvora-toha3ee/tree/main/internal/attacks/mitm', note: 'ARP, DHCP, DHCPv6, DNS and IPv6 poisoning, and inline interception.' },
            { label: 'internal/attacks/recon', href: 'https://github.com/QYVORA/qyvora-toha3ee/tree/main/internal/attacks/recon', note: 'The largest module category.' },
            { label: 'docs/Module-Reference.md', href: 'https://github.com/QYVORA/qyvora-toha3ee/blob/main/docs/Module-Reference.md', note: 'All 73 modules, with options and limitations.' },
            { label: 'docs/Declined-Techniques.md', href: 'https://github.com/QYVORA/qyvora-toha3ee/blob/main/docs/Declined-Techniques.md', note: 'What is not implemented, and why. Read this one.' },
            { label: 'docs/Security.md', href: 'https://github.com/QYVORA/qyvora-toha3ee/blob/main/docs/Security.md', note: 'The safety model. Start here if you have not used the tool.' },
            { label: 'docs/Scripting.md', href: 'https://github.com/QYVORA/qyvora-toha3ee/blob/main/docs/Scripting.md', note: 'Scripted and repeatable engagements.' },
            { label: 'docs/Architecture.md', href: 'https://github.com/QYVORA/qyvora-toha3ee/blob/main/docs/Architecture.md', note: 'Module system and design decisions.' },
          ],
        },
      ],
    },

    {
      id: 'reference',
      label: 'Reference',
      kicker: 'Detail',
      title: 'Module reference and output',
      blocks: [
        {
          kind: 'prose',
          text: '`docs/Module-Reference.md` is the complete reference: all 73 modules with their options, and — importantly — their Limitations, which is where technically-declined techniques surface at the module level.',
        },
        {
          kind: 'table',
          caption: 'Repository documentation.',
          columns: [
            { key: 'doc', label: 'Document', mono: true },
            { key: 'audience', label: 'For' },
          ],
          rows: [
            { doc: 'docs/Getting-Started.md', audience: 'Your first engagement.' },
            { doc: 'docs/User-Guide.md', audience: 'Working through the REPL and the wizard.' },
            { doc: 'docs/Scripting.md', audience: 'Repeatable engagements with build and script.' },
            { doc: 'docs/Configuration.md', audience: 'Config keys and precedence.' },
            { doc: 'docs/Cheat-Sheet.md', audience: 'A dense command reference to keep open.' },
            { doc: 'docs/FAQ.md', audience: 'Common questions.' },
            { doc: 'docs/Module-Reference.md', audience: 'All 73 modules, options and limitations.' },
            { doc: 'docs/Declined-Techniques.md', audience: 'What is not implemented, and why.' },
            { doc: 'docs/Security.md', audience: 'The safety model. Read before first use.' },
            { doc: 'docs/Reporting.md', audience: 'Output formats.' },
            { doc: 'docs/Architecture.md', audience: 'Module system and design.' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Start with eval, not with the module list',
          text: 'If you are new to the tool, `toha3ee eval <target>` will tell you which modules apply to what you are facing. That is considerably faster than reading 73 module entries to work out which dozen matter — and the wizard does the same thing interactively if you would rather be asked than told.',
        },
      ],
    },
  ],
};

export default doc;
