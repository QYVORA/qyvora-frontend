import type { ToolDoc } from './types';

/**
 * ANANSI — terminal-first attack surface intelligence.
 *
 * The ten-phase pipeline and module set are declared in `cmd/console.go`
 * (`defaultModules`) and `cmd/root.go`; the phase implementations are the
 * packages under `internal/`; the vulnerability classes, chain templates and
 * version fingerprints are the data files under `internal/assets/wordlists/`.
 */
const doc: ToolDoc = {
  slug: 'anansi',
  seoTitle: 'ANANSI — Attack surface intelligence engine',
  seoDescription:
    'ANANSI is a terminal-first attack surface intelligence engine. Ten phases covering discovery, probing, TLS, headers, paths, tech-stack fingerprinting, takeover, OSINT, exploit chains and active proof-of-exploit, with JSON, Markdown and HTML output.',
  summary:
    'ANANSI takes a domain and runs a ten-phase intelligence pipeline over it: subdomain discovery, live host probing, TLS analysis, security-header checks, path exposure, deep tech-stack fingerprinting, takeover detection, OSINT collection, exploit-chain assembly, and — with explicit authorization — active proof of the findings it discovered. It is the only QYVORA tool that makes live requests, and the only one with an authorization gate. Output is terminal, JSON, Markdown or HTML, and every phase emits JSONL events.',

  sections: [
    {
      id: 'overview',
      label: 'Overview',
      kicker: 'Orientation',
      title: 'What ANANSI does',
      blocks: [
        {
          kind: 'prose',
          text: 'ANANSI is a web attack-surface engine. Give it a domain and it runs a fixed ten-phase pipeline, where each phase consumes the previous phase\'s output. Discovery feeds probing, probing feeds TLS and header analysis, the whole set feeds the tech-stack auditor, and the accumulated findings feed both the chain assembler and the exploit prover.',
        },
        {
          kind: 'prose',
          text: 'By default it filters noise and prints only what was *found*: live subdomains, responding hosts, valid certificates, missing headers, exposed paths, confirmed takeovers. Passing `--verbose` shows every attempted check, including failures — useful when you need to know what was tried, not just what exists.',
        },
        {
          kind: 'stages',
          items: [
            {
              name: '01 · Discovery',
              detail:
                'Subdomains from crt.sh certificate-transparency logs plus DNS brute-force against the subdomain wordlist, with a 60-second TTL cache so later phases never re-query the same name.',
              emits: 'hostnames',
            },
            {
              name: '02 · Probe',
              detail:
                'Live HTTP/HTTPS hosts, collected in parallel: status codes, servers, redirect chains and page titles.',
              emits: 'live hosts',
            },
            {
              name: '03 · TLS',
              detail:
                'Certificate expiry, subject alternative names, protocol version, cipher selection and self-signed detection.',
            },
            {
              name: '04 · Headers',
              detail:
                'Missing security headers and CORS misconfiguration, checked against a header expectations table.',
            },
            {
              name: '05 · Paths',
              detail:
                'Exposed files and directories: .env, .git, configuration files, admin panels, backups and API documentation. A per-host 404 baseline is fetched concurrently so catch-all servers do not produce false positives.',
            },
            {
              name: '06 · Tech-stack',
              detail:
                'Deep audit of any detected platform. Versions are read from generator meta tags, changelog endpoints and static-asset query strings already in the page body; plugins and extensions are enumerated from the same body rather than by extra requests.',
              emits: 'fingerprints',
            },
            {
              name: '07 · Takeover',
              detail:
                'Dangling CNAMEs pointing at unclaimed cloud services, restricted to subdomains with verified dead CNAME records.',
            },
            {
              name: '08 · OSINT',
              detail: 'Emails, phone numbers, employee references and WHOIS registrant data.' },
            {
              name: '09 · Chain',
              detail:
                'Assembles every discovered vulnerability into multi-step escalation paths, scored and ranked, from a low-severity foothold to full compromise.',
              emits: 'exploit chains',
            },
            {
              name: '10 · Exploit',
              detail:
                'Actively proves findings against the authorized target with live request/response evidence. Gated behind --authorized; validation-only behind --exploit-dry-run.',
              emits: 'exploit evidence',
            },
          ],
        },
        {
          kind: 'note',
          variant: 'warning',
          title: 'This tool makes real requests',
          text: 'ANANSI is the only QYVORA framework that contacts a live target. Phases 1 through 9 are reconnaissance against infrastructure you are authorized to test; phase 10 sends proof requests and will not run without `--authorized`. `--exploit-dry-run` takes the lifecycle to the execution boundary and reports what would have run, without running it.',
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
          text: 'ANANSI ships a zero-config installer that detects your OS and architecture, downloads the matching prebuilt binary, verifies its SHA-256 against the published `checksums.txt`, and falls back to building from source if the download fails. There is also a PowerShell installer for Windows.',
        },
        {
          kind: 'commands',
          title: 'One-liner install',
          items: [
            {
              command: 'curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-anansi/main/install.sh | bash',
              note: 'Detects Linux, macOS or Windows-GitBash and amd64/arm64. Installs to ~/.local/bin — no sudo — and adds it to your shell config.',
            },
            {
              command: 'bash install.sh',
              note: 'Run the installer from a clone, if you would rather inspect it first.',
            },
            {
              command: 'irm https://raw.githubusercontent.com/QYVORA/qyvora-anansi/main/install.ps1 | iex',
              note: 'PowerShell installer.',
            },
          ],
        },
        {
          kind: 'commands',
          title: 'From source',
          items: [
            {
              command: 'git clone https://github.com/QYVORA/qyvora-anansi.git && cd qyvora-anansi',
              note: 'Clone the repository.',
            },
            { command: 'make build', note: 'Builds bin/anansi.' },
            { command: 'make install', note: 'System-wide install to /usr/local/bin.' },
            { command: 'make install-user', note: 'Per-user install to ~/.local/bin. No root required.' },
            { command: 'go install github.com/QYVORA/qyvora-anansi@latest', note: 'Install with the Go toolchain.' },
            { command: 'make verify', note: 'Build, test, vet and lint.' },
          ],
        },
        {
          kind: 'facts',
          items: [
            { label: 'Module', value: 'github.com/QYVORA/qyvora-anansi', mono: true },
            { label: 'Go directive', value: '1.26.5', mono: true },
            { label: 'Entry point', value: 'main.go → cmd.Execute()', mono: true },
            { label: 'Binary', value: 'anansi', mono: true },
            { label: 'Licence', value: 'MIT (LICENSE committed)', mono: true },
            { label: 'Default threads', value: '100', mono: true },
            { label: 'Default output', value: 'terminal', mono: true },
            {
              label: 'Runtime deps',
              value: 'cobra, readline, go-colorable, mattn/go-isatty, x/sys',
              mono: true,
            },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'One runtime dependency, and it is a syscall package',
          text: 'Apart from Cobra and the terminal-handling libraries, ANANSI has no third-party runtime dependency. In particular it has no DNS library: resolution goes through a native Go resolver using plain goroutines, which is what lets it run as a static binary without cgo.',
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
          title: 'The usual invocations',
          items: [
            { command: 'anansi target.com', note: 'Run every phase against a domain. Positional argument, no subcommand needed.' },
            { command: 'anansi scan target.com', note: 'Explicit form of the same thing.' },
            { command: 'anansi target.com --deep', note: 'Larger wordlist, more path probing.' },
            { command: 'anansi target.com --verbose', note: 'Show failed and not-found checks, not just hits.' },
            { command: 'anansi target.com -o json > results.json', note: 'Machine-readable output.' },
            {
              command: 'anansi target.com --modules discovery,tls,takeover',
              note: 'Run a subset of phases. Useful to re-run one phase against an earlier result.',
            },
            {
              command: 'anansi target.com --authorized --exploit-dry-run',
              note: 'Take the exploit lifecycle to the execution boundary and print what would run.',
            },
            { command: 'anansi target.com --stealth', note: 'Random user agent, jitter, skip crt.sh, reduced concurrency.' },
          ],
        },
        {
          kind: 'prose',
          text: 'The default module set is declared once, in `cmd/console.go`, and used both as the `--modules` default and as the console\'s MODULES option — so the flag and the interactive shell can never disagree about what "default" means.',
        },
        {
          kind: 'code',
          lang: 'go',
          path: 'cmd/console.go',
          filename: 'cmd/console.go',
          caption: 'The canonical module set, shared by the flag and the console.',
          code: `// defaultModules is the canonical module set used both by the --modules flag
// default and the console's MODULES option.
var defaultModules = []string{
\t"discovery", "probe", "tls", "headers", "paths",
\t"tech", "takeover", "osint", "chain", "exploit",
}`,
        },
        {
          kind: 'subheading',
          text: 'Exploit subcommands',
        },
        {
          kind: 'definitions',
          items: [
            { term: 'exploit list', detail: 'List the built-in exploit modules and what each one proves.' },
            { term: 'exploit info <module>', detail: 'Show one module\'s preconditions and request shape.' },
            { term: 'exploit run <target>', detail: 'Run the exploit phase against a target. Requires --authorized.' },
          ],
        },
        {
          kind: 'subheading',
          text: 'Persistent flags',
        },
        {
          kind: 'definitions',
          items: [
            { term: '-o, --output', detail: 'Output format: terminal, json, markdown, html. Default terminal.' },
            { term: '--out', detail: 'Legacy alias for --output.' },
            { term: '--modules', detail: 'Comma-separated modules to run. Defaults to all ten.' },
            { term: '-t, --threads', detail: 'Concurrent threads. Default 100.' },
            { term: '-v, --verbose', detail: 'Show all results, including not-found and failed items.' },
            { term: '-w, --wordlist', detail: 'Path to a custom subdomain wordlist.' },
            { term: '-r, --recursive', detail: 'Recursive subdomain brute-force on resolved subdomains.' },
            { term: '-m, --mutate', detail: 'Subdomain mutation brute-force based on resolved prefixes.' },
            { term: '--deep', detail: 'Deep scan: larger wordlist, more path probing.' },
            { term: '--timeout', detail: 'Per-request timeout in seconds. Default 5.' },
            { term: '--delay', detail: 'Delay between requests in milliseconds, for rate limiting.' },
            { term: '--stealth', detail: 'Random user agent, jitter, skip crt.sh, reduced concurrency.' },
            { term: '--authorized', detail: 'Confirm authorized testing. Required before exploit modules execute.' },
            { term: '--exploit-dry-run', detail: 'Validation-only exploit phase: no proof requests are sent.' },
            { term: '--output-file', detail: 'Write output to a file instead of stdout.' },
            { term: '--events', detail: 'Emit a JSONL event stream to stdout, stderr or a file path.' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'The console is a shell, not a mode',
          text: 'Running `anansi` with no target opens an interactive console whose commands map onto the same modules and flags. RHOSTS, DEEP, MODULES, TIMEOUT and OUT are settable from the prompt, which is why the module list lives in that file rather than in the root command.',
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
          text: 'The performance work is the interesting part of the design. Four decisions account for most of the speed, and all four are visible in the package layout.',
        },
        {
          kind: 'definitions',
          items: [
            {
              term: 'Native Go DNS resolver',
              detail:
                'internal/probe and internal/discovery resolve through a pure-Go resolver using goroutines, avoiding the cgo-blocked system resolver.',
            },
            {
              term: 'Shared connection pool',
              detail:
                'internal/httpclient holds one process-wide transport with keep-alives, reused by every phase and module. A TCP and TLS handshake happens once per host, not once per request.',
            },
            {
              term: 'TTL DNS cache',
              detail:
                'internal/dnscache caches resolved subdomains for 60 seconds, so the recursive, mutation and TLS-SAN phases never re-query a name the discovery phase already resolved.',
            },
            {
              term: 'Fixed worker pools',
              detail:
                'Paths, discovery, probe and tech-stack all pull from fixed-size pools sized by --threads, rather than spawning a goroutine per job. An 8,000-rule path sweep stays at stable concurrency.',
            },
          ],
        },
        {
          kind: 'prose',
          text: 'False positives are handled by baselining rather than by heuristics. Each live host gets a custom 404 response fetched concurrently, and the deep tech-stack audit adds a soft-404 baseline so a catch-all server does not report every path as exposed.',
        },
        {
          kind: 'prose',
          text: 'The exploit layer is a state machine, not a script. Every run moves `selected → validated → executing → exploited | exploit_failed`, then `cleanup → evidence_captured`. A finding is only marked `exploited` when the module\'s check actually succeeded; when the check could not be confirmed, the result is `exploit_failed` rather than a silent skip. Findings that no module can address resolve to `not-exploitable` so nothing disappears.',
        },
        {
          kind: 'subheading',
          text: 'The data files you can extend',
        },
        {
          kind: 'prose',
          text: 'Four data files under `internal/assets/wordlists/` drive the chain and tech-stack engines. They are plain text, and editing them changes behaviour without touching Go code.',
        },
        {
          kind: 'table',
          caption: 'ANANSI extensible data files.',
          columns: [
            { key: 'file', label: 'File', mono: true },
            { key: 'drives', label: 'Drives' },
          ],
          rows: [
            {
              file: 'internal/assets/wordlists/chain/classes.txt',
              drives:
                '30 vulnerability classes, each with the keywords that match a finding title and the exploitation technique to recommend.',
            },
            {
              file: 'internal/assets/wordlists/chain/chains.txt',
              drives: '18 kill-path templates, from Full Compromise to SSRF Pivot and Data Exfiltration.',
            },
            {
              file: 'internal/assets/wordlists/tech/vulns.txt',
              drives:
                '90 curated, CVE-backed version fingerprints across WordPress core, Drupal, Joomla, Magento, Ghost, MediaWiki, Moodle and high-value WordPress plugins.',
            },
            {
              file: 'internal/assets/wordlists/{paths,probe,headers,takeover,subdomains}/',
              drives: 'The path probes, host probes, header expectations, takeover fingerprints and subdomain wordlist.',
            },
          ],
        },
        {
          kind: 'links',
          items: [
            { label: 'cmd/root.go', href: 'https://github.com/QYVORA/qyvora-anansi/blob/main/cmd/root.go', note: 'Root command, every persistent flag, and the console/CLI share.' },
            { label: 'internal/httpclient', href: 'https://github.com/QYVORA/qyvora-anansi/tree/main/internal/httpclient', note: 'The process-wide transport every phase reuses.' },
            { label: 'internal/dnscache', href: 'https://github.com/QYVORA/qyvora-anansi/tree/main/internal/dnscache', note: 'The 60-second resolution cache.' },
            { label: 'internal/chain', href: 'https://github.com/QYVORA/qyvora-anansi/tree/main/internal/chain', note: 'Exploit-chain assembly and ranking.' },
            { label: 'internal/exploit', href: 'https://github.com/QYVORA/qyvora-anansi/tree/main/internal/exploit', note: 'The exploit state machine and module registry.' },
            { label: 'internal/techstack', href: 'https://github.com/QYVORA/qyvora-anansi/tree/main/internal/techstack', note: 'Platform fingerprinting and version detection.' },
            { label: 'internal/assets/wordlists/tech/', href: 'https://github.com/QYVORA/qyvora-anansi/tree/main/internal/assets/wordlists/tech', note: 'Fingerprints, path rules and version ranges. Edit these to extend coverage.' },
            { label: 'install.sh', href: 'https://github.com/QYVORA/qyvora-anansi/blob/main/install.sh', note: 'The zero-config installer, including its checksum verification.' },
          ],
        },
      ],
    },

    {
      id: 'reference',
      label: 'Reference',
      kicker: 'Detail',
      title: 'Modules, exploit and output',
      blocks: [
        {
          kind: 'table',
          caption: 'The ten modules, in execution order. This is the --modules vocabulary.',
          columns: [
            { key: 'module', label: 'Module', mono: true },
            { key: 'phase', label: 'Phase', mono: true },
            { key: 'finds', label: 'What it produces' },
          ],
          rows: [
            { module: 'discovery', phase: '01', finds: 'Subdomains from CT logs and DNS brute-force.' },
            { module: 'probe', phase: '02', finds: 'Live HTTP/HTTPS hosts, status codes, servers, redirects, titles.' },
            { module: 'tls', phase: '03', finds: 'Certificate expiry, SANs, protocol version, cipher, self-signed.' },
            { module: 'headers', phase: '04', finds: 'Missing security headers, CORS misconfiguration.' },
            { module: 'paths', phase: '05', finds: 'Exposed files, .env, .git, configs, admin panels, backups, API docs.' },
            { module: 'tech', phase: '06', finds: 'Platform versions, plugin and theme enumeration, known-vulnerable version matches.' },
            { module: 'takeover', phase: '07', finds: 'Dangling CNAMEs on unclaimed cloud services.' },
            { module: 'osint', phase: '08', finds: 'Emails, phone numbers, employees, WHOIS registrant data.' },
            { module: 'chain', phase: '09', finds: 'Ranked multi-step exploit paths across vulnerability classes.' },
            { module: 'exploit', phase: '10', finds: 'Live proof-of-exploit evidence. Requires --authorized.' },
          ],
        },
        {
          kind: 'subheading',
          text: 'Built-in exploit modules',
        },
        {
          kind: 'prose',
          text: 'Six modules ship in the box. Module eligibility is derived from the finding\'s vulnerability class, so a finding only ever matches modules that are compatible with it.',
        },
        {
          kind: 'definitions',
          items: [
            { term: 'web/http-trace', detail: 'TRACE method echoing request headers back.' },
            { term: 'web/http-methods', detail: 'Unexpected HTTP methods accepted by the server.' },
            { term: 'web/path-traversal', detail: 'Documented directory traversal.' },
            { term: 'web/open-redirect', detail: 'Server-side redirect confirmation.' },
            { term: 'web/reflected-input', detail: 'Input reflected back in the response.' },
            { term: 'web/directory-listing', detail: 'Auto-index disclosure.' },
          ],
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'What the exploit phase will not do',
          text: 'No process spawning, no payload delivery. Every module is a self-terminating HTTP request to the authorized target. High-risk modules stay disabled unless --authorized is given, and --exploit-dry-run stops at the execution boundary and prints what would have happened.',
        },
        {
          kind: 'subheading',
          text: 'Output formats and events',
        },
        {
          kind: 'table',
          columns: [
            { key: 'format', label: 'Format', mono: true },
            { key: 'use', label: 'Use it for' },
          ],
          rows: [
            { format: 'terminal', use: 'Interactive reading. The default; found items only unless --verbose.' },
            { format: 'json', use: 'Pipelines. The full result, findings and chains included.' },
            { format: 'markdown', use: 'Pasting into a report or a pull-request comment. The top chain appears in the summary.' },
            { format: 'html', use: 'A standalone, shareable report with no external assets.' },
          ],
        },
        {
          kind: 'prose',
          text: 'Independently of the output format, `--events <dest>` writes a JSONL event stream. Exploit lifecycle events are `exploit.selected`, `exploit.validated`, `exploit.started`, `exploit.completed` and `exploit.failed`; `exploit.completed` carries the captured evidence. Point `--events` at a file to keep a machine-readable record alongside a human-readable report.',
        },
        {
          kind: 'note',
          variant: 'info',
          title: 'Customising coverage without code',
          text: 'Add your own fingerprints, path rules and version ranges by editing the files under internal/assets/wordlists/tech/. The chain engine reads classes.txt and chains.txt the same way — both are plain text with a documented line format in their header comments.',
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
            { label: 'main.go', href: 'https://github.com/QYVORA/qyvora-anansi/blob/main/main.go', note: 'Binary entry point. Delegates straight to cmd.Execute().' },
            { label: 'cmd/', href: 'https://github.com/QYVORA/qyvora-anansi/tree/main/cmd', note: 'Root command, exploit subcommands, console and shell. Small and readable.' },
            { label: 'internal/discovery', href: 'https://github.com/QYVORA/qyvora-anansi/tree/main/internal/discovery', note: 'Phase 01 — subdomain discovery.' },
            { label: 'internal/probe', href: 'https://github.com/QYVORA/qyvora-anansi/tree/main/internal/probe', note: 'Phase 02 — live host probing.' },
            { label: 'internal/tls', href: 'https://github.com/QYVORA/qyvora-anansi/tree/main/internal/tls', note: 'Phase 03 — certificate analysis.' },
            { label: 'internal/headers', href: 'https://github.com/QYVORA/qyvora-anansi/tree/main/internal/headers', note: 'Phase 04 — security headers and CORS.' },
            { label: 'internal/paths', href: 'https://github.com/QYVORA/qyvora-anansi/tree/main/internal/paths', note: 'Phase 05 — exposed path probing.' },
            { label: 'internal/techstack', href: 'https://github.com/QYVORA/qyvora-anansi/tree/main/internal/techstack', note: 'Phase 06 — deep platform audit.' },
            { label: 'internal/takeover', href: 'https://github.com/QYVORA/qyvora-anansi/tree/main/internal/takeover', note: 'Phase 07 — dangling CNAME detection.' },
            { label: 'internal/osint', href: 'https://github.com/QYVORA/qyvora-anansi/tree/main/internal/osint', note: 'Phase 08 — contact and registrant data.' },
            { label: 'internal/chain', href: 'https://github.com/QYVORA/qyvora-anansi/tree/main/internal/chain', note: 'Phase 09 — exploit-chain assembly.' },
            { label: 'internal/exploit', href: 'https://github.com/QYVORA/qyvora-anansi/tree/main/internal/exploit', note: 'Phase 10 — the exploit state machine.' },
            { label: 'internal/assets/wordlists/', href: 'https://github.com/QYVORA/qyvora-anansi/tree/main/internal/assets/wordlists', note: 'Every data file the phases read. Extensible without code changes.' },
            { label: 'security_test.go', href: 'https://github.com/QYVORA/qyvora-anansi/blob/main/security_test.go', note: 'Repository-level security assertions.' },
          ],
        },
      ],
    },
  ],
};

export default doc;
