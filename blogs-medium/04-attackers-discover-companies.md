How Attackers Actually Discover Companies on the Internet
The six-phase reconnaissance pipeline and what it means for your organisation.

Author: WSUITS6 (Alhassan Osman Wunpini)
Date: 2026-06-22
Tags: Recon, Attack Surface, Security
---

Before an attacker launches a single exploit, they need to find you. Not your company website, your **real infrastructure**. The subdomain running a staging environment. The cloud storage bucket with no access policy. The old API endpoint still responding on a forgotten IP address.

This phase is called **reconnaissance**, and it determines everything that follows. A well-executed recon phase can identify critical vulnerabilities before a single line of code is exploited. A poorly protected attack surface means attackers already know more about your infrastructure than your own team does.

This article walks through how attackers discover companies on the internet, and what you can do about it.

**How Recon Works: The Attacker's Pipeline**

Professional reconnaissance follows a structured pipeline. Attackers do not guess, they follow a methodology that systematically expands the attack surface:

Step 01. Surface Enumeration -- Identify the known attack surface: main domains, ASNs, SSL certs, DNS records
Step 02. Subdomain Discovery -- Find every subdomain via certificate transparency logs, DNS brute-force, and crawlers
Step 03. Host Probing -- Check which discovered hosts are live, what ports are open, and what services are running
Step 04. Technology Fingerprinting -- Identify web servers, frameworks, CMS platforms, and their version numbers
Step 05. Directory Enumeration -- Discover exposed paths: admin panels, .env files, API docs, backup archives, staging environments
Step 06. Vulnerability Mapping -- Cross-reference findings against known vulnerabilities and misconfigurations

Each step feeds into the next. A discovered subdomain in Step 02 becomes a target for probing in Step 03. A technology identified in Step 04 reveals known vulnerabilities to check in Step 06. The data flows **automatically** in a well-optimised recon pipeline.

**Subdomain Discovery: The Entry Point**

The most common starting point is **Certificate Transparency (CT) log enumeration**. Every time an organisation issues an SSL/TLS certificate, the certificate is logged publicly. Attackers query these logs to discover subdomains, and they do not need any special access to do so.

```
# Query crt.sh for all logged certificates on target.com
curl -s 'https://crt.sh/?q=%25.target.com&output=json' | jq -r '.[].name_value' | sort -u

api.target.com
dev.target.com
admin.target.com
staging.target.com
jenkins.target.com
grafana.target.com
mail.target.com
vpn.target.com
```

CT logs are just the beginning. Attackers combine this with **DNS brute-forcing**: trying thousands of common subdomain names against the target's DNS servers, and **search engine dorking** to find subdomains indexed by Google that are not in CT logs.

The result is a much larger attack surface than the organisation realises:

- **CT logs**, certificate transparency records (crt.sh, CertSpotter)
- **DNS brute-force**, common subdomain wordlists (subdomains-top1million)
- **Search engines**. Google dorking for site:*.target.com
- **Zone transfers**, misconfigured DNS servers leaking entire zone files

**Technology Fingerprinting**

Once live hosts are identified, attackers **fingerprint** the technology stack. This tells them what software is running, what version, and critically, what known vulnerabilities exist for that specific version.

(Fingerprinting sources: HTTP Response Headers, HTML/JS Analysis, SSL/TLS Certificate, Favicon Hash)

Tools like Wappalyzer, WhatWeb, and the Anansi CLI automatically detect technologies from HTTP responses. Once the stack is identified, attackers cross-reference version numbers against public vulnerability databases (CVEs) to build a **targeted exploit list**.

**Exposed Paths and Misconfigurations**

This is where reconnaissance becomes dangerous. Attackers scan for **exposed paths**, common files and directories that should never be publicly accessible but often are:

```
/.env                # Environment variables. API keys, DB credentials, secrets
/.git/config         # Git repository disclosure, full source code leak
/admin               # Admin panel, often default credentials
/backup              # Backup archives, entire database dumps
/api/docs            # API documentation, endpoint descriptions, auth methods
/.well-known/        # Security.txt, DMARC, and other security configuration files
/swagger.json        # Swagger/OpenAPI spec, full API surface documentation
/phpinfo.php         # PHP info, server configuration, environment variables exposed
```

A single exposed **.env file** can compromise an entire organisation. Attackers have used leaked database credentials from **.env files** to gain direct access to production databases without exploiting any technical vulnerability, they simply used the credentials the application itself uses.

Similarly, a **.git directory exposure** leaks the entire source code of the application, including commit history that may contain accidentally committed secrets, hardcoded API keys, and infrastructure configuration.

**What This Means for Your Organisation**

The uncomfortable truth is that **your organisation has already been discovered**, at least partially. Certificate transparency logs are public. DNS records are public. Your technology stack is visible to anyone who sends an HTTP request to your servers.

The question is not whether attackers can find your infrastructure. The question is **how much of it they can find**, and whether you know what they see.

- Most organisations discover **30-60%** of their own attack surface in internal audits
- Attackers routinely find **3-5x more assets** than organisations know about
- Continuous monitoring reduces the discovery gap from **weeks to minutes**

**Closing the Visibility Gap**

Protecting your attack surface starts with **knowing what exists**. You cannot secure what you cannot see. Here are practical steps your organisation can take today:

1. **Map Your Full Attack Surface** -- Run comprehensive reconnaissance against your own organisation. Use the same techniques attackers use: CT log enumeration, subdomain brute-forcing, technology fingerprinting, to discover everything externally visible.

2. **Eliminate Shadow Assets** -- Shut down or secure any discovered assets that are not meant to be public. Staging environments, old APIs, dev subdomains, if they do not need to be on the internet, remove them or put them behind authentication.

3. **Continuous Monitoring** -- Attack surface discovery is not a one-time exercise. New subdomains are created, new certificates issued, new technologies deployed. Continuous scanning ensures you know about changes when they happen.

CTA: Know Your Attack Surface -- Run an Anansi attack surface intelligence scan against your own organisation. See what attackers see, in under two minutes, from your terminal, for free. Link: https://github.com/QYVORA/qyvora-anansi, Label: Scan Your Surface
