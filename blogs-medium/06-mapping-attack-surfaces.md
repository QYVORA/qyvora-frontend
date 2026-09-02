What We Learned From Mapping Real-World Attack Surfaces
Common patterns, recurring findings, and structural weaknesses from hundreds of assessments.

Author: WSUITS6 (Alhassan Osman Wunpini)
Date: 2026-06-24
Tags: Research, Attack Surface, Findings
---

Over the past year, we have been mapping attack surfaces across multiple sectors: fintech, government, e-commerce, healthcare, and telecommunications, using our own reconnaissance tooling to understand the real state of internet-facing security posture. The findings have been consistent, and they have been sobering.

We are sharing some of the patterns we have observed, not targeting specific organisations, but the **recurring themes and structural weaknesses** we see across the board.

If your organisation has never done an external attack surface assessment, there is a high probability that some of these patterns apply to you.

**Finding 01: Shadow Assets Exceed Known Assets**

This is the most common finding in every engagement we have run. On average, organisations have **3-5x more externally-facing assets** than their security team is aware of.

(Known ~30-60% of surface, Unknown (Shadow) ~40-70%, unmonitored, unpatched)

These shadow assets include:

- **Staging environments**, deployed by developers, accessible from the internet, often with default credentials and production-like data
- **Forgotten subdomains**, old marketing sites, archived applications, experiment deployments that were never decommissioned
- **Cloud resources**, storage buckets, databases, and compute instances provisioned outside official cloud accounts or governance policies

In one engagement, we discovered a production database server that a developer had deployed to a cloud account three years earlier and forgotten about. It was still running. It was still accessible from the internet. It contained customer data. **Nobody knew it existed**.

**Finding 02: Exposed Configuration Files and Secrets**

During reconnaissance, we regularly discover **exposed configuration files** containing credentials, API keys, and infrastructure details. The most common offenders:

```
.env, environment variables with database credentials, API keys, and secrets
.git/config, full source code repository disclosure
.aws/credentials - AWS access keys and secret keys
config.json / config.php, application configuration with hardcoded passwords
phpinfo.php, complete PHP configuration including environment variables
robots.txt, sometimes reveals hidden admin paths
swagger.json / openapi.json, full API documentation including auth endpoints
```

What makes this particularly dangerous is that these files are usually exposed through **automated discovery**. Attackers use wordlists with thousands of common paths and check each one against discovered subdomains. If a path returns HTTP 200 with content, they have found something valuable.

In many cases, these exposed files are not the result of malice or negligence: they are the result of **default configurations**. A developer sets up a web server, deploys an application, and the framework's default settings serve static files from the public directory, including the **.env file** or **.git directory** that should have been excluded.

**Finding 03: Misconfigured TLS and Security Headers**

TLS configuration is one of the most common and most easily fixable security issues we find. Over 60% of organisations we assess have at least one of the following issues:

- Weak TLS Protocols: TLS 1.0 / 1.1 Enabled
- Missing HSTS: No Strict Transport Security
- Missing Security Headers: X-Frame-Options, CSP, etc.
- CORS Misconfiguration: Permissive Cross-Origin Policy

Missing security headers are particularly concerning because they expose users to attacks like **clickjacking** (missing X-Frame-Options), **MIME-type sniffing** (missing X-Content-Type-Options), and **cross-site scripting** (missing Content-Security-Policy). These are **simple configuration changes** that have an outsized impact on security posture.

The fix is straightforward, add the appropriate headers at the reverse proxy or web server level. But many organisations do not even know they are missing them until an assessment reveals the gap.

**Finding 04: Dangling DNS and Subdomain Takeover Risk**

Subdomain takeover is one of the most underrated attack vectors we encounter. It occurs when a DNS record points to a third-party service (like AWS, Heroku, GitHub Pages, or Cloudflare) that is no longer provisioned. An attacker who discovers this can claim the service and **serve arbitrary content under your domain**.

```
# Example: dangling CNAME record in DNS
old-blog.target.com.  CNAME  target.github.io.

# If the GitHub Pages site is deleted, anyone can create
# a new GitHub Pages site and claim the subdomain.
# They can now serve malware, phishing pages, or malicious
# JavaScript under old-blog.target.com.

# Result: full subdomain takeover with no exploit required
```

We find dangling DNS records in approximately **1 in 5 organisations**. The most common culprits are abandoned marketing sites, retired SaaS integrations, and decommissioned cloud resources whose DNS records were never cleaned up.

**The Common Thread: Visibility**

Every single finding above traces back to a single root cause: **lack of visibility**. The organisations we assess are not negligent. They are not incompetent. They simply do not have a complete picture of their external attack surface.

Security teams are stretched thin. Developers deploy fast. Cloud resources are created and forgotten. Third-party services are integrated and abandoned. DNS records are pointed and never cleaned up. Over time, the gap between **what security teams know** and **what actually exists** grows wider.

The solution is not to slow down development or add more bureaucracy. The solution is **continuous, automated attack surface visibility**, tools that discover assets automatically, monitor them for changes, and alert when new exposures appear.

CTA: Map Your Surface -- We built Anansi CLI to give organisations the same visibility attackers have. Run it against your own infrastructure and see what we see. No sign-up, no cost, no commitment. Link: https://github.com/QYVORA/qyvora-anansi, Label: Scan Your Organisation
