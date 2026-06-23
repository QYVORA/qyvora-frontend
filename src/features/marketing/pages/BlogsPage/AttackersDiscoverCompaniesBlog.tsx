import React from 'react';
import { Search, Globe, Radio, Server, AlertTriangle, GitBranch, Eye, Shield } from 'lucide-react';
import { Section, Heading, SubHeading, Body, Highlight, CodeBlock, PhaseCard, FeatureCard, StatCard, BulletList, CTA, InlineDiagram } from './shared';

export const AttackersDiscoverCompaniesBlog: React.FC = () => {
  return (
    <div className="space-y-0">

      <Section>
        <Body>
          Before an attacker launches a single exploit, they need to find you. Not your company website — your <Highlight>real infrastructure</Highlight>. The subdomain running a staging environment. The cloud storage bucket with no access policy. The old API endpoint still responding on a forgotten IP address.
        </Body>
        <Body>
          This phase is called <Highlight>reconnaissance</Highlight>, and it determines everything that follows. A well-executed recon phase can identify critical vulnerabilities before a single line of code is exploited. A poorly protected attack surface means attackers already know more about your infrastructure than your own team does.
        </Body>
        <Body>
          This article walks through how attackers discover companies on the internet — and what you can do about it.
        </Body>
      </Section>

      {/* ── The Recon Pipeline ── */}
      <Section>
        <Heading>How Recon Works: The Attacker's Pipeline</Heading>
        <Body>
          Professional reconnaissance follows a structured pipeline. Attackers do not guess — they follow a methodology that systematically expands the attack surface:
        </Body>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
          <PhaseCard icon={Search} name="Step 01 — Surface Enumeration" desc="Identify the known attack surface: main domains, ASNs, SSL certs, DNS records" />
          <PhaseCard icon={GitBranch} name="Step 02 — Subdomain Discovery" desc="Find every subdomain via certificate transparency logs, DNS brute-force, and crawlers" />
          <PhaseCard icon={Radio} name="Step 03 — Host Probing" desc="Check which discovered hosts are live, what ports are open, and what services are running" />
          <PhaseCard icon={Globe} name="Step 04 — Technology Fingerprinting" desc="Identify web servers, frameworks, CMS platforms, and their version numbers" />
          <PhaseCard icon={Eye} name="Step 05 — Directory Enumeration" desc="Discover exposed paths: admin panels, .env files, API docs, backup archives, staging environments" />
          <PhaseCard icon={AlertTriangle} name="Step 06 — Vulnerability Mapping" desc="Cross-reference findings against known vulnerabilities and misconfigurations" />
        </div>

        <Body>
          Each step feeds into the next. A discovered subdomain in Step 02 becomes a target for probing in Step 03. A technology identified in Step 04 reveals known vulnerabilities to check in Step 06. The data flows <Highlight>automatically</Highlight> in a well-optimised recon pipeline.
        </Body>
      </Section>

      {/* ── Subdomain Discovery ── */}
      <Section>
        <Heading>Subdomain Discovery: The Entry Point</Heading>
        <Body>
          The most common starting point is <Highlight>Certificate Transparency (CT) log enumeration</Highlight>. Every time an organisation issues an SSL/TLS certificate, the certificate is logged publicly. Attackers query these logs to discover subdomains — and they do not need any special access to do so.
        </Body>

        <CodeBlock code={`# Query crt.sh for all logged certificates on target.com
curl -s 'https://crt.sh/?q=%25.target.com&output=json' | jq -r '.[].name_value' | sort -u

api.target.com
dev.target.com
admin.target.com
staging.target.com
jenkins.target.com
grafana.target.com
mail.target.com
vpn.target.com`} />

        <Body>
          CT logs are just the beginning. Attackers combine this with <Highlight>DNS brute-forcing</Highlight> — trying thousands of common subdomain names against the target's DNS servers — and <Highlight>search engine dorking</Highlight> to find subdomains indexed by Google that are not in CT logs.
        </Body>

        <Body>
          The result is a much larger attack surface than the organisation realises:
        </Body>

        <BulletList
          items={[
            { icon: <Search className="w-5 h-5 text-accent" />, text: <span><Highlight>CT logs</Highlight> — certificate transparency records (crt.sh, CertSpotter)</span> },
            { icon: <GitBranch className="w-5 h-5 text-accent" />, text: <span><Highlight>DNS brute-force</Highlight> — common subdomain wordlists (subdomains-top1million)</span> },
            { icon: <Globe className="w-5 h-5 text-accent" />, text: <span><Highlight>Search engines</Highlight> — Google dorking for site:*.target.com</span> },
            { icon: <Radio className="w-5 h-5 text-accent" />, text: <span><Highlight>Zone transfers</Highlight> — misconfigured DNS servers leaking entire zone files</span> },
          ]}
        />
      </Section>

      {/* ── Technology Fingerprinting ── */}
      <Section>
        <Heading>Technology Fingerprinting</Heading>
        <Body>
          Once live hosts are identified, attackers <Highlight>fingerprint</Highlight> the technology stack. This tells them what software is running, what version, and — critically — what known vulnerabilities exist for that specific version.
        </Body>

        <InlineDiagram>
          <div className="w-full">
            <svg viewBox="0 0 600 220" className="w-full h-auto" fill="none">
              <text x="300" y="24" textAnchor="middle" className="fill-accent/60 font-mono" fontSize="12">TECHNOLOGY FINGERPRINTING</text>

              <rect x="20" y="45" width="260" height="60" rx="6" className="fill-accent/10 stroke-accent/30" strokeWidth="1" />
              <text x="150" y="68" textAnchor="middle" className="fill-accent font-mono font-bold uppercase" fontSize="13">HTTP Response Headers</text>
              <text x="150" y="90" textAnchor="middle" className="fill-text-muted font-mono" fontSize="11">Server, X-Powered-By, Set-Cookie</text>

              <rect x="320" y="45" width="260" height="60" rx="6" className="fill-accent/10 stroke-accent/30" strokeWidth="1" />
              <text x="450" y="68" textAnchor="middle" className="fill-accent font-mono font-bold uppercase" fontSize="13">HTML / JS Analysis</text>
              <text x="450" y="90" textAnchor="middle" className="fill-text-muted font-mono" fontSize="11">Asset paths, comment tags, framework markers</text>

              <rect x="20" y="140" width="260" height="60" rx="6" className="fill-accent/10 stroke-accent/30" strokeWidth="1" />
              <text x="150" y="163" textAnchor="middle" className="fill-accent font-mono font-bold uppercase" fontSize="13">SSL/TLS Certificate</text>
              <text x="150" y="185" textAnchor="middle" className="fill-text-muted font-mono" fontSize="11">Issuer, SANs, validity period, cipher suites</text>

              <rect x="320" y="140" width="260" height="60" rx="6" className="fill-accent/10 stroke-accent/30" strokeWidth="1" />
              <text x="450" y="163" textAnchor="middle" className="fill-accent font-mono font-bold uppercase" fontSize="13">Favicon Hash</text>
              <text x="450" y="185" textAnchor="middle" className="fill-text-muted font-mono" fontSize="11">MurmurHash3 — matches default framework icons</text>
            </svg>
          </div>
        </InlineDiagram>

        <Body>
          Tools like Wappalyzer, WhatWeb, and the Anansi CLI automatically detect technologies from HTTP responses. Once the stack is identified, attackers cross-reference version numbers against public vulnerability databases (CVEs) to build a <Highlight>targeted exploit list</Highlight>.
        </Body>
      </Section>

      {/* ── Exposed Paths & Misconfigurations ── */}
      <Section>
        <Heading>Exposed Paths and Misconfigurations</Heading>
        <Body>
          This is where reconnaissance becomes dangerous. Attackers scan for <Highlight>exposed paths</Highlight> — common files and directories that should never be publicly accessible but often are:
        </Body>

        <CodeBlock code={`/.env                # Environment variables — API keys, DB credentials, secrets
/.git/config         # Git repository disclosure — full source code leak
/admin               # Admin panel — often default credentials
/backup              # Backup archives — entire database dumps
/api/docs            # API documentation — endpoint descriptions, auth methods
/.well-known/        # Security.txt, DMARC, and other security configuration files
/swagger.json        # Swagger/OpenAPI spec — full API surface documentation
/phpinfo.php         # PHP info — server configuration, environment variables exposed`} />

        <Body>
          A single exposed <Highlight>.env file</Highlight> can compromise an entire organisation. Attackers have used leaked database credentials from <Highlight>.env files</Highlight> to gain direct access to production databases without exploiting any technical vulnerability — they simply used the credentials the application itself uses.
        </Body>

        <Body>
          Similarly, a <Highlight>.git directory exposure</Highlight> leaks the entire source code of the application, including commit history that may contain accidentally committed secrets, hardcoded API keys, and infrastructure configuration.
        </Body>
      </Section>

      {/* ── Why This Matters for Your Organisation ── */}
      <Section>
        <Heading>What This Means for Your Organisation</Heading>
        <Body>
          The uncomfortable truth is that <Highlight>your organisation has already been discovered</Highlight> — at least partially. Certificate transparency logs are public. DNS records are public. Your technology stack is visible to anyone who sends an HTTP request to your servers.
        </Body>

        <Body>
          The question is not whether attackers can find your infrastructure. The question is <Highlight>how much of it they can find</Highlight>, and whether you know what they see.
        </Body>

        <BulletList
          items={[
            { icon: <Eye className="w-5 h-5 text-accent" />, text: <span>Most organisations discover <Highlight>30-60%</Highlight> of their own attack surface in internal audits</span> },
            { icon: <AlertTriangle className="w-5 h-5 text-accent" />, text: <span>Attackers routinely find <Highlight>3-5x more assets</Highlight> than organisations know about</span> },
            { icon: <Shield className="w-5 h-5 text-accent" />, text: <span>Continuous monitoring reduces the discovery gap from <Highlight>weeks to minutes</Highlight></span> },
          ]}
        />
      </Section>

      {/* ── Practical Steps ── */}
      <Section>
        <Heading>Closing the Visibility Gap</Heading>
        <Body>
          Protecting your attack surface starts with <Highlight>knowing what exists</Highlight>. You cannot secure what you cannot see. Here are practical steps your organisation can take today:
        </Body>

        <div className="space-y-4 my-8">
          <FeatureCard
            icon={Search}
            title="Map Your Full Attack Surface"
            desc="Run comprehensive reconnaissance against your own organisation. Use the same techniques attackers use — CT log enumeration, subdomain brute-forcing, technology fingerprinting — to discover everything externally visible."
          />
          <FeatureCard
            icon={Shield}
            title="Eliminate Shadow Assets"
            desc="Shut down or secure any discovered assets that are not meant to be public. Staging environments, old APIs, dev subdomains — if they do not need to be on the internet, remove them or put them behind authentication."
          />
          <FeatureCard
            icon={Radio}
            title="Continuous Monitoring"
            desc="Attack surface discovery is not a one-time exercise. New subdomains are created, new certificates issued, new technologies deployed. Continuous scanning ensures you know about changes when they happen."
          />
        </div>
      </Section>

      {/* ── CTA ── */}
      <Section>
        <CTA
          title="Know Your Attack Surface"
          desc="Run an Anansi attack surface intelligence scan against your own organisation. See what attackers see — in under two minutes, from your terminal, for free."
          href="https://github.com/QYVORA/qyvora-anansi-cli"
          label="Scan Your Surface"
        />
      </Section>

    </div>
  );
};
