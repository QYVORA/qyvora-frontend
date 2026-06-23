import React from 'react';
import { Search, Globe, Lock, Shield, FileCode, AlertTriangle, Download, Zap, CheckCircle2 } from 'lucide-react';
import { Section, Body, CodeBlock, Heading, Highlight, PhaseCard, OutputBlock } from './shared';

export const AnansiCliBlog: React.FC = () => {
  return (
    <div className="space-y-0">
      {/* ── Introduction ── */}
      <Section>
        <Body>
          Every pentester and bug bounty hunter knows the feeling: you've got a target, but the recon phase takes forever. You're stitching together five different tools, parsing output formats that don't talk to each other, and fighting dependency hell just to get a basic subdomain list.
        </Body>
        <Body>
          <Highlight>Anansi CLI</Highlight> is our answer to that. A single, static binary that does <Highlight>six phases of attack surface intelligence</Highlight> — from subdomain discovery to subdomain takeover detection — in one command. No web UI. No cloud account. No API keys. Just raw technical signal delivered straight to your terminal.
        </Body>
        <Body>
          Named after the West African trickster god Anansi (the spider), this tool embodies the philosophy that <Highlight>intelligence is about weaving together disparate threads</Highlight> into a coherent picture of the attack surface.
        </Body>
      </Section>

      {/* ── Philosophy ── */}
      <Section>
        <Heading>The Philosophy</Heading>
        <Body>
          Anansi CLI was built on three convictions:
        </Body>

        <div className="space-y-6 my-8">
          <div className="p-6 rounded-xl border border-accent/10 bg-accent/5">
            <h3 className="text-lg font-black uppercase tracking-wider mb-2 text-text-primary">1. Single Binary, Zero Friction</h3>
            <p className="text-sm font-mono text-text-secondary leading-[2]">
              You should not need a package manager, a runtime, or a cloud account to run recon. Download one binary, chmod it, and run it. That's it. Go makes this possible — Anansi is compiled to a static binary with <Highlight>zero runtime dependencies</Highlight>.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-accent/10 bg-accent/5">
            <h3 className="text-lg font-black uppercase tracking-wider mb-2 text-text-primary">2. Signal Over Noise</h3>
            <p className="text-sm font-mono text-text-secondary leading-[2]">
              Most recon tools dump everything at you and let you figure out what matters. Anansi flips that — by default, it <Highlight>only shows what it finds</Highlight>. If a subdomain is dead, it's hidden. If a path returns 404, it's suppressed. You get a clean terminal with <Highlight>actionable intelligence</Highlight> and nothing else.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-accent/10 bg-accent/5">
            <h3 className="text-lg font-black uppercase tracking-wider mb-2 text-text-primary">3. Pipeline, Not Point Tool</h3>
            <p className="text-sm font-mono text-text-secondary leading-[2]">
              Recon is not a single step — it's a <Highlight>pipeline</Highlight>. You discover subdomains, probe for live hosts, check TLS configs, audit headers, find exposed paths, and check for takeovers. Anansi runs this entire pipeline in one command, passing data between phases automatically.
            </p>
          </div>
        </div>
      </Section>

      {/* ── The Six Phases ── */}
      <Section>
        <Heading>The Six-Phase Pipeline</Heading>
        <Body>
          When you run <Highlight>anansi target.com</Highlight>, here's what happens under the hood:
        </Body>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
          <PhaseCard icon={Search} name="Phase 01 — Discovery" desc="Subdomain enumeration via crt.sh CT logs + DNS brute-force wordlist" />
          <PhaseCard icon={Globe} name="Phase 02 — Probe" desc="Live HTTP/HTTPS host detection with status codes, servers, and titles" />
          <PhaseCard icon={Lock} name="Phase 03 — TLS" desc="Certificate analysis, SAN extraction, protocol version, and cipher audit" />
          <PhaseCard icon={Shield} name="Phase 04 — Headers" desc="Security header audit and CORS misconfiguration detection" />
          <PhaseCard icon={FileCode} name="Phase 05 — Paths" desc="Exposed file detection — .env, .git, admin panels, backups, API docs" />
          <PhaseCard icon={AlertTriangle} name="Phase 06 — Takeover" desc="Dangling CNAME detection for AWS, Heroku, GitHub Pages, and more" />
        </div>

        <CodeBlock code={`# Full pipeline — one command
anansi target.com

# Deep scan with extended wordlists
anansi target.com --deep

# Specific modules only
anansi target.com --modules discovery,tls,takeover`} />

        <Body>
          Each phase feeds into the next. Discovery finds subdomains → Probe checks which ones are live → TLS analyzes their certificates → Headers audits the live hosts → Paths hunts for exposed files on those hosts → Takeover checks for dangling CNAMEs among the dead subdomains. The data flows <Highlight>automatically</Highlight>.
        </Body>
      </Section>

      {/* ── The Output ── */}
      <Section>
        <Heading>Terminal-First Output</Heading>
        <Body>
          Anansi's output is designed for operators, not managers. No bar charts, no letter grades, no pie charts. Just <Highlight>structured, scannable intelligence</Highlight> you can act on immediately:
        </Body>

        <OutputBlock text={`  ┌─────────────────────────────────────────────────────────┐
  │  ANANSI  Attack Surface Intelligence Engine             │
  │  TARGET  target.com                                     │
  │  TIME    2026-06-20 10:42:01 UTC                        │
  │  BY      QYVORA OffSec // github.com/QYVORA/qyvora-anansi-cli  │
  └─────────────────────────────────────────────────────────┘

  ══ PHASE 01 ── DISCOVERY // subdomain enumeration
  ─────────────────────────────────────────────────────────────
  api.target.com              104.21.44.12    crt.sh    LIVE
  dev.target.com              104.21.44.13    crt.sh    LIVE
  old.target.com              —               wordlist  DEAD
                              CNAME → target.herokuapp.com

  ══ PHASE 05 ── PATHS // exposed endpoint detection
  ─────────────────────────────────────────────────────────────

  [CRITICAL ] Exposed .env File
  ASSET:     https://api.target.com/.env
  DESC:      /.env returned HTTP 200
  EVIDENCE:  APP_KEY=base64:abc123... DB_PASSWORD=prod_pass_here...
  FIX:       Restrict or remove /.env from public access.

  ══ SUMMARY ─────────────────────────────────────────────────
  target      target.com
  duration    1m43s
  subdomains  17 discovered, 11 live
  risk score  74/100
  findings    CRIT:3  HIGH:7  MED:4  LOW:6  INFO:2`} />

        <Body>
          Every finding includes <Highlight>evidence and a fix recommendation</Highlight>. You don't need to cross-reference external documentation — Anansi tells you what's wrong, why it matters, and how to fix it. Critical findings get priority placement so you know exactly where to focus.
        </Body>
      </Section>

      {/* ── Output Formats ── */}
      <Section>
        <Heading>Multiple Output Formats</Heading>
        <Body>
          Terminal output is great for live scanning, but sometimes you need to share findings or integrate with other tools. Anansi supports four output formats:
        </Body>

        <CodeBlock code={`# JSON — pipe to jq or save for downstream tools
anansi target.com --out json > results.json
anansi target.com --out json | jq '.Findings[] | select(.Severity == "CRITICAL")'

# Markdown — drop straight into a report
anansi target.com --out markdown > recon.md

# HTML — generate a premium, high-fidelity dark mode report
anansi target.com --out html > report.html`} />

        <Body>
          The HTML report is particularly useful for client engagements. It generates a <Highlight>standalone, dark-mode report</Highlight> with all findings organized by severity, complete with evidence, fix recommendations, and a summary dashboard. No external CSS or JS required — it's a single self-contained file.
        </Body>
      </Section>

      {/* ── Performance ── */}
      <Section>
        <Heading>Performance Architecture</Heading>
        <Body>
          Recon is IO-bound. The bottleneck is almost always network latency, not CPU. Anansi is built to <Highlight>maximize throughput</Highlight> through aggressive concurrency:
        </Body>
        <ul className="space-y-4 my-8 text-sm md:text-base font-mono text-text-secondary leading-[2]">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <span><Highlight>Native Go DNS Resolver</Highlight> — bypasses slow cgo-blocked system lookups with pure Go goroutines</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <span><Highlight>Concurrent Probing</Highlight> — HTTP probes, TLS analyses, and header checks run in parallel across configurable thread pools</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <span><Highlight>Smart Takeover Filtering</Highlight> — only scans subdomains with verified dead CNAME records instead of testing every candidate</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <span><Highlight>Parallel Path Probing</Highlight> — custom 404 baselines are fetched concurrently, and paths are scanned in parallel</span>
          </li>
        </ul>

        <CodeBlock code={`# Control the throttle
anansi target.com --threads 100    # concurrent workers (default: 50)
anansi target.com --delay 100      # rate-limit in ms between requests
anansi target.com --timeout 10     # per-request timeout in seconds`} />
      </Section>

      {/* ── Installation ── */}
      <Section>
        <Heading>Getting Started</Heading>
        <Body>
          Installing Anansi is a two-step process. No package manager, no runtime, no dependencies:
        </Body>

        <CodeBlock code={`# Step 1: Download the binary
curl -L https://github.com/QYVORA/qyvora-anansi-cli/releases/latest/download/anansi-linux-amd64 -o anansi

# Step 2: Make it executable and install
chmod +x anansi && sudo mv anansi /usr/local/bin/

# Step 3: Run it
anansi target.com`} />

        <Body>
          The binary supports Linux (amd64 and arm64), macOS (Intel and Apple Silicon), and Windows. The same <Highlight>zero-dependency philosophy</Highlight> applies everywhere — download, chmod, run.
        </Body>
      </Section>

      {/* ── Open Source ── */}
      <Section>
        <Body>
          Anansi CLI is <Highlight>open source</Highlight> (MIT license), built by QYVORA from Ghana. It's a single-purpose tool with a single mission: <Highlight>giving operators the tools they need to own the perimeter</Highlight>.
        </Body>
      </Section>

      {/* ── CTA ── */}
      <Section>
        <div className="p-8 md:p-12 rounded-2xl border border-accent/20 bg-accent/5 text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">
            Own the Perimeter
          </h2>
          <p className="text-base md:text-lg text-text-secondary font-mono max-w-2xl mx-auto leading-relaxed mb-8">
            Download Anansi CLI, scan your first target, and see what six phases of intelligence look like in under two minutes. No sign-up required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com/QYVORA/qyvora-anansi-cli"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-accent text-bg font-black uppercase tracking-[0.12em] rounded-xl px-10 py-4 text-sm hover:brightness-110 active:scale-95 transition-all"
            >
              <Download className="w-5 h-5" /> Download Now
            </a>
            <a
              href="/anansi"
              className="inline-flex items-center gap-3 border border-accent/30 text-accent font-black uppercase tracking-[0.12em] rounded-xl px-10 py-4 text-sm hover:bg-accent/5 active:scale-95 transition-all"
            >
              Learn More <Zap className="w-5 h-5" />
            </a>
          </div>
        </div>
      </Section>
    </div>
  );
};
