import React from 'react';
import { AlertTriangle, Shield, Server, Globe, Lock, FileCode, Eye, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { Section, Heading, SubHeading, Body, Highlight, CodeBlock, StatCard, FeatureCard, PhaseCard, BulletList, CTA, InlineDiagram, Divider } from './shared';

export const MappingAttackSurfacesBlog: React.FC = () => {
  return (
    <div className="space-y-0">

      <Section>
        <Body>
          Over the past year, we have conducted attack surface intelligence assessments for organisations across multiple sectors — fintech, government, e-commerce, healthcare, and telecommunications. The findings have been consistent, and they have been sobering.
        </Body>
        <Body>
          We are sharing some of the patterns we have observed. Not the specific vulnerabilities in specific organisations — that would violate our confidentiality commitments — but the <Highlight>recurring themes and structural weaknesses</Highlight> we see across the board.
        </Body>
        <Body>
          If your organisation has never done an external attack surface assessment, there is a high probability that some of these patterns apply to you.
        </Body>
      </Section>

      {/* ── Finding #1 ── */}
      <Section delay={0.1}>
        <Heading>Finding 01: Shadow Assets Exceed Known Assets</Heading>
        <Body>
          This is the most common finding in every engagement we have run. On average, organisations have <Highlight>3-5x more externally-facing assets</Highlight> than their security team is aware of.
        </Body>

        <InlineDiagram>
          <div className="w-full max-w-2xl">
            <svg viewBox="0 0 600 140" className="w-full h-auto" fill="none">
              <text x="300" y="20" textAnchor="middle" className="fill-accent/60 text-[8px] font-mono" fontSize="8">KNOWN vs UNKNOWN ASSETS (AVERAGE ORGANISATION)</text>

              <rect x="60" y="40" width="120" height="60" rx="8" className="fill-accent/20 stroke-accent/40" strokeWidth="1.5" />
              <text x="120" y="68" textAnchor="middle" className="fill-accent text-xs font-mono font-bold uppercase" fontSize="11">Known</text>
              <text x="120" y="86" textAnchor="middle" className="fill-text-muted text-[9px] font-mono" fontSize="9">~30-60% of surface</text>

              <rect x="220" y="40" width="320" height="60" rx="8" className="fill-accent/10 stroke-accent/20" strokeWidth="1" strokeDasharray="4 3" />
              <text x="380" y="68" textAnchor="middle" className="fill-accent text-xs font-mono font-bold uppercase" fontSize="11">Unknown (Shadow)</text>
              <text x="380" y="86" textAnchor="middle" className="fill-text-muted text-[9px] font-mono" fontSize="9">~40-70% of surface — unmonitored, unpatched, unprotected</text>
            </svg>
          </div>
        </InlineDiagram>

        <Body>
          These shadow assets include:
        </Body>

        <BulletList
          items={[
            { icon: <Server className="w-5 h-5 text-accent" />, text: <span><Highlight>Staging environments</Highlight> — deployed by developers, accessible from the internet, often with default credentials and production-like data</span> },
            { icon: <Globe className="w-5 h-5 text-accent" />, text: <span><Highlight>Forgotten subdomains</Highlight> — old marketing sites, archived applications, experiment deployments that were never decommissioned</span> },
            { icon: <Eye className="w-5 h-5 text-accent" />, text: <span><Highlight>Cloud resources</Highlight> — storage buckets, databases, and compute instances provisioned outside official cloud accounts or governance policies</span> },
          ]}
        />

        <Body>
          In one engagement, we discovered a production database server that a developer had deployed to a cloud account three years earlier and forgotten about. It was still running. It was still accessible from the internet. It contained customer data. <Highlight>Nobody knew it existed</Highlight>.
        </Body>
      </Section>

      {/* ── Finding #2 ── */}
      <Section delay={0.2}>
        <Heading>Finding 02: Exposed Configuration Files and Secrets</Heading>
        <Body>
          During reconnaissance, we regularly discover <Highlight>exposed configuration files</Highlight> containing credentials, API keys, and infrastructure details. The most common offenders:
        </Body>

        <CodeBlock code={`.env — environment variables with database credentials, API keys, and secrets
.git/config — full source code repository disclosure
.aws/credentials — AWS access keys and secret keys
config.json / config.php — application configuration with hardcoded passwords
phpinfo.php — complete PHP configuration including environment variables
robots.txt — sometimes reveals hidden admin paths
swagger.json / openapi.json — full API documentation including auth endpoints`} />

        <Body>
          What makes this particularly dangerous is that these files are usually exposed through <Highlight>automated discovery</Highlight>. Attackers use wordlists with thousands of common paths and check each one against discovered subdomains. If a path returns HTTP 200 with content, they have found something valuable.
        </Body>

        <Body>
          In many cases, these exposed files are not the result of malice or negligence — they are the result of <Highlight>default configurations</Highlight>. A developer sets up a web server, deploys an application, and the framework's default settings serve static files from the public directory — including the <Highlight>.env file</Highlight> or <Highlight>.git directory</Highlight> that should have been excluded.
        </Body>
      </Section>

      {/* ── Finding #3 ── */}
      <Section delay={0.3}>
        <Heading>Finding 03: Misconfigured TLS and Security Headers</Heading>
        <Body>
          TLS configuration is one of the most common and most easily fixable security issues we find. Over 60% of organisations we assess have at least one of the following issues:
        </Body>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
          <StatCard icon={<Lock className="w-5 h-5 text-accent" />} label="Weak TLS Protocols" value="TLS 1.0 / 1.1 Enabled" />
          <StatCard icon={<Lock className="w-5 h-5 text-accent" />} label="Missing HSTS" value="No Strict Transport Security" />
          <StatCard icon={<FileCode className="w-5 h-5 text-accent" />} label="Missing Security Headers" value="X-Frame-Options, CSP, etc." />
          <StatCard icon={<AlertTriangle className="w-5 h-5 text-accent" />} label="CORS Misconfiguration" value="Permissive Cross-Origin Policy" />
        </div>

        <Body>
          Missing security headers are particularly concerning because they expose users to attacks like <Highlight>clickjacking</Highlight> (missing X-Frame-Options), <Highlight>MIME-type sniffing</Highlight> (missing X-Content-Type-Options), and <Highlight>cross-site scripting</Highlight> (missing Content-Security-Policy). These are <Highlight>simple configuration changes</Highlight> that have an outsized impact on security posture.
        </Body>

        <Body>
          The fix is straightforward — add the appropriate headers at the reverse proxy or web server level. But many organisations do not even know they are missing them until an assessment reveals the gap.
        </Body>
      </Section>

      {/* ── Finding #4 ── */}
      <Section delay={0.4}>
        <Heading>Finding 04: Dangling DNS and Subdomain Takeover Risk</Heading>
        <Body>
          Subdomain takeover is one of the most underrated attack vectors we encounter. It occurs when a DNS record points to a third-party service (like AWS, Heroku, GitHub Pages, or Cloudflare) that is no longer provisioned. An attacker who discovers this can claim the service and <Highlight>serve arbitrary content under your domain</Highlight>.
        </Body>

        <CodeBlock code={`# Example: dangling CNAME record in DNS
old-blog.target.com.  CNAME  target.github.io.

# If the GitHub Pages site is deleted, anyone can create
# a new GitHub Pages site and claim the subdomain.
# They can now serve malware, phishing pages, or malicious
# JavaScript under old-blog.target.com.

# Result: full subdomain takeover with no exploit required`} />

        <Body>
          We find dangling DNS records in approximately <Highlight>1 in 5 organisations</Highlight>. The most common culprits are abandoned marketing sites, retired SaaS integrations, and decommissioned cloud resources whose DNS records were never cleaned up.
        </Body>
      </Section>

      {/* ── The Common Thread ── */}
      <Section delay={0.5}>
        <Heading>The Common Thread: Visibility</Heading>
        <Body>
          Every single finding above traces back to a single root cause: <Highlight>lack of visibility</Highlight>. The organisations we assess are not negligent. They are not incompetent. They simply do not have a complete picture of their external attack surface.
        </Body>

        <Body>
          Security teams are stretched thin. Developers deploy fast. Cloud resources are created and forgotten. Third-party services are integrated and abandoned. DNS records are pointed and never cleaned up. Over time, the gap between <Highlight>what security teams know</Highlight> and <Highlight>what actually exists</Highlight> grows wider.
        </Body>

        <Body>
          The solution is not to slow down development or add more bureaucracy. The solution is <Highlight>continuous, automated attack surface visibility</Highlight> — tools that discover assets automatically, monitor them for changes, and alert when new exposures appear.
        </Body>
      </Section>

      {/* ── CTA ── */}
      <Section delay={0.6}>
        <CTA
          title="Map Your Surface"
          desc="We built Anansi CLI to give organisations the same visibility attackers have. Run it against your own infrastructure and see what we see. No sign-up, no cost, no commitment."
          href="https://github.com/wsuits6/qyvora-anansi-cli"
          label="Scan Your Organisation"
        />
      </Section>

    </div>
  );
};
