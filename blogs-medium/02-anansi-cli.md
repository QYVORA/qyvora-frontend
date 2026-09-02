Anansi CLI: Attack Surface Intelligence from the Terminal
Why we built a no-nonsense, single-binary recon engine for operators who hate bloat.

Author: WSUITS6 (Alhassan Osman Wunpini)
Date: 2026-06-20
Tags: Tooling, Recon, CLI
---

Every pentester and bug bounty hunter knows the feeling: you've got a target, but the recon phase takes forever. You're stitching together five different tools, parsing output formats that don't talk to each other, and fighting dependency hell just to get a basic subdomain list.

**Anansi CLI** is our answer to that. A single, static binary that does **six phases of attack surface intelligence**: from subdomain discovery to subdomain takeover detection, in one command. No web UI. No cloud account. No API keys. Just raw technical signal delivered straight to your terminal.

Named after the West African trickster god Anansi (the spider), this tool embodies the philosophy that **intelligence is about weaving together disparate threads** into a coherent picture of the attack surface.

**The Philosophy**

Anansi CLI was built on three convictions:

1. **Single Binary, Zero Friction** -- You should not need a package manager, a runtime, or a cloud account to run recon. Download one binary, chmod it, and run it. That's it. Go makes this possible. Anansi is compiled to a static binary with **zero runtime dependencies**.

2. **Signal Over Noise** -- Most recon tools dump everything at you and let you figure out what matters. Anansi flips that: by default, it **only shows what it finds**. If a subdomain is dead, it's hidden. If a path returns 404, it's suppressed. You get a clean terminal with **actionable intelligence** and nothing else.

3. **Pipeline, Not Point Tool** -- Recon is not a single step, it's a **pipeline**. You discover subdomains, probe for live hosts, check TLS configs, audit headers, find exposed paths, and check for takeovers. Anansi runs this entire pipeline in one command, passing data between phases automatically.

**The Six-Phase Pipeline**

When you run `anansi target.com`, here's what happens under the hood:

Phase 01. Discovery -- Subdomain enumeration via crt.sh CT logs + DNS brute-force wordlist
Phase 02. Probe -- Live HTTP/HTTPS host detection with status codes, servers, and titles
Phase 03. TLS -- Certificate analysis, SAN extraction, protocol version, and cipher audit
Phase 04. Headers -- Security header audit and CORS misconfiguration detection
Phase 05. Paths -- Exposed file detection, .env, .git, admin panels, backups, API docs
Phase 06. Takeover -- Dangling CNAME detection for AWS, Heroku, GitHub Pages, and more

```
# Full pipeline, one command
anansi target.com

# Deep scan with extended wordlists
anansi target.com --deep

# Specific modules only
anansi target.com --modules discovery,tls,takeover
```

Each phase feeds into the next. Discovery finds subdomains -> Probe checks which ones are live -> TLS analyzes their certificates -> Headers audits the live hosts -> Paths hunts for exposed files on those hosts -> Takeover checks for dangling CNAMEs among the dead subdomains. The data flows **automatically**.

**Terminal-First Output**

Anansi's output is designed for operators, not managers. No bar charts, no letter grades, no pie charts. Just **structured, scannable intelligence** you can act on immediately:

```
  +-----------------------------------------------------------+
  |  ANANSI  Attack Surface Intelligence Engine               |
  |  TARGET  target.com                                       |
  |  TIME    2026-06-20 10:42:01 UTC                          |
  |  BY      QYVORA OffSec // github.com/QYVORA/qyvora-anansi|
  +-----------------------------------------------------------+

  == PHASE 01 -- DISCOVERY // subdomain enumeration
  --------------------------------------------------------------
  api.target.com              104.21.44.12    crt.sh    LIVE
  dev.target.com              104.21.44.13    crt.sh    LIVE
  old.target.com             -               wordlist  DEAD
                              CNAME -> target.herokuapp.com

  == PHASE 05 -- PATHS // exposed endpoint detection
  ---------------------------------------------------------------

  [CRITICAL ] Exposed .env File
  ASSET:     https://api.target.com/.env
  DESC:      /.env returned HTTP 200
  EVIDENCE:  APP_KEY=base64:abc123... DB_PASSWORD=prod_pass_here...
  FIX:       Restrict or remove /.env from public access.

  == SUMMARY -----------------------------------------------------
  target      target.com
  duration    1m43s
  subdomains  17 discovered, 11 live
  risk score  74/100
  findings    CRIT:3  HIGH:7  MED:4  LOW:6  INFO:2
```

Every finding includes **evidence and a fix recommendation**. You don't need to cross-reference external documentation. Anansi tells you what's wrong, why it matters, and how to fix it. Critical findings get priority placement so you know exactly where to focus.

**Multiple Output Formats**

Terminal output is great for live scanning, but sometimes you need to share findings or integrate with other tools. Anansi supports four output formats:

```
# JSON: pipe to jq or save for downstream tools
anansi target.com --out json > results.json
anansi target.com --out json | jq '.Findings[] | select(.Severity == "CRITICAL")'

# Markdown, drop straight into a report
anansi target.com --out markdown > recon.md

# HTML: generate a premium, high-fidelity dark mode report
anansi target.com --out html > report.html
```

The HTML report is particularly useful for client engagements. It generates a **standalone, dark-mode report** with all findings organized by severity, complete with evidence, fix recommendations, and a summary dashboard. No external CSS or JS required, it's a single self-contained file.

**Performance Architecture**

Recon is IO-bound. The bottleneck is almost always network latency, not CPU. Anansi is built to **maximize throughput** through aggressive concurrency:

- **Native Go DNS Resolver**, bypasses slow cgo-blocked system lookups with pure Go goroutines
- **Concurrent Probing**. HTTP probes, TLS analyses, and header checks run in parallel across configurable thread pools
- **Smart Takeover Filtering**, only scans subdomains with verified dead CNAME records instead of testing every candidate
- **Parallel Path Probing**, custom 404 baselines are fetched concurrently, and paths are scanned in parallel

```
# Control the throttle
anansi target.com --threads 100    # concurrent workers (default: 50)
anansi target.com --delay 100      # rate-limit in ms between requests
anansi target.com --timeout 10     # per-request timeout in seconds
```

**Getting Started**

Installing Anansi is a two-step process. No package manager, no runtime, no dependencies:

```
# Step 1: Download the binary
curl -L https://github.com/QYVORA/qyvora-anansi/releases/latest/download/anansi-linux-amd64 -o anansi

# Step 2: Make it executable and install
chmod +x anansi && sudo mv anansi /usr/local/bin/

# Step 3: Run it
anansi target.com
```

The binary supports Linux (amd64 and arm64), macOS (Intel and Apple Silicon), and Windows. The same **zero-dependency philosophy** applies everywhere: download, chmod, run.

Anansi CLI is **open source** (MIT license), built by QYVORA from Ghana. It's a single-purpose tool with a single mission: **giving operators the tools they need to own the perimeter**.

CTA: Download Anansi CLI, scan your first target, and see what six phases of intelligence look like in under two minutes. No sign-up required. Links: https://github.com/QYVORA/qyvora-anansi and /anansi
