import type { Lesson, Course } from '../types';

const l = (id: string, title: string, instruction: string, extras?: Partial<Lesson>): Lesson => ({
  id, title, instruction, image: null, ...extras,
});

export const LESSONS: Lesson[] = [
    l('recon-1', 'What is Reconnaissance?',
      `**Reconnaissance** (recon) is the first phase of any security assessment. It's about gathering information about your target before launching any attacks.

There are two types:

**Passive Recon** — gathering information without directly interacting with the target:
- Searching Google, Shodan, Censys
- Checking social media and job postings
- Analyzing certificate transparency logs
- Using WHOIS and DNS records

**Active Recon** — directly interacting with the target's systems:
- Scanning ports with Nmap
- Browsing the website
- Sending probes to discover endpoints
- Directory enumeration

Passive recon leaves no traces. Active recon creates logs on the target's systems. Always start with passive recon.

\`\`\`bash
# Passive: DNS info
dig target.com ANY

# Active: basic web request (leave logs!)
curl -I https://target.com
\`\`\`

The rule: **passive first, active second, exploit last**.`),

    l('recon-2', 'WHOIS & DNS Enumeration',
      `**WHOIS** tells you who owns a domain. This is passive recon — it's public information.

\`\`\`bash
# Basic WHOIS lookup
whois example.com
\`\`\`

WHOIS reveals: registrant name, organization, email, phone, creation/expiration dates, name servers.

**DNS enumeration** reveals more:

\`\`\`bash
# Standard lookups
dig target.com A          # IPv4 addresses
dig target.com AAAA       # IPv6 addresses
dig target.com MX         # Mail servers
dig target.com NS         # Name servers
dig target.com TXT        # Text records (SPF, DKIM, etc.)
dig target.com CNAME      # Canonical names (aliases)

# Zone transfer (rarely works but always worth trying)
dig axfr @ns1.target.com target.com
\`\`\`

A **zone transfer** copies the entire DNS database. Most servers block this, but if it works, you get every subdomain and record.

\`\`\`bash
# Automatic DNS bruteforce with dnsrecon (install first)
dnsrecon -d target.com -D /usr/share/wordlists/dns.txt -t brt
\`\`\`

This tries thousands of common subdomain names. Install with: \`sudo apt install dnsrecon\``),

    l('recon-3', 'Subdomain Enumeration',
      `Subdomains often reveal hidden services, staging environments, and forgotten applications.

**Tools for subdomain enumeration:**

\`\`\`bash
# Sublist3r — uses search engines and DNS
sublist3r -d target.com

# Amass — more thorough, uses many sources
amass enum -d target.com

# Assetfinder — quick and simple
assetfinder --subs-only target.com
\`\`\`

**Why enumerate subdomains?**
- \`admin.target.com\` — admin panel
- \`dev.target.com\` — development server (less secure)
- \`api.target.com\` — API endpoint
- \`test.target.com\` — testing environment
- \`jenkins.target.com\` — CI/CD (often misconfigured)
- \`vpn.target.com\` — VPN access point
- \`git.target.com\` — internal Git server

\`\`\`bash
# Verify found subdomains resolve
for sub in $(cat subdomains.txt); do
    if host "$sub.target.com" > /dev/null 2>&1; then
        echo "$sub.target.com resolves"
    fi
done
\`\`\`

Certificate Transparency logs are also a goldmine:

\`\`\`bash
# Using crt.sh (passive)
curl -s "https://crt.sh/?q=%25.target.com&output=json" \\
  | jq -r '.[].name_value' \\
  | sort -u
\`\`\`

This pulls every SSL certificate issued for \`*.target.com\` and \`target.com\` — a passive way to discover subdomains.`),

    l('recon-4', 'Directory Brute-Forcing',
      `Once you know a host, you need to find hidden files and directories. This is called **directory enumeration** or **directory brute-forcing**.

\`\`\`bash
# ffuf — the modern choice (fast, flexible)
ffuf -u https://target.com/FUZZ -w /usr/share/wordlists/common.txt

# dirb — simpler but effective
dirb https://target.com /usr/share/wordlists/common.txt

# gobuster — another solid option
gobuster dir -u https://target.com -w /usr/share/wordlists/common.txt
\`\`\`

**Common discovery:**
- \`/admin\` , \`/login\` — authentication pages
- \`/backup\` , \`/backups\` — backup files
- \`/.git\` — exposed Git repository
- \`/.env\` — environment variables with secrets
- \`/wp-admin\` , \`/wp-content\` — WordPress
- \`/api\` , \`/v1\` , \`/v2\` — API endpoints
- \`/robots.txt\` — hidden paths listed by the developer
- \`/sitemap.xml\` — all pages the site wants indexed

\`\`\`bash
# ffuf with filtering (hide 404s)
ffuf -u https://target.com/FUZZ \\
  -w /usr/share/seclists/Discovery/Web-Content/common.txt \\
  -fc 404

# File extension brute-forcing
ffuf -u https://target.com/FUZZ.bak \\
  -w /usr/share/seclists/Discovery/Web-Content/common.txt
\`\`\`

**Wordlists** make the difference. The SecLists collection is the standard:

\`\`\`bash
sudo apt install seclists
# Lists are in /usr/share/seclists/
\`\`\``),

    l('recon-5', 'Technology Fingerprinting',
      `**Fingerprinting** identifies the technologies a website uses — the web server, framework, CMS, JavaScript libraries, and more.

**Manual fingerprinting:**

\`\`\`bash
# Check response headers — they reveal server info
curl -I https://target.com
\`\`\`

\`\`\`
HTTP/1.1 200 OK
Server: nginx/1.24.0
X-Powered-By: PHP/8.2
X-Generator: Drupal 10
\`\`\`

Each header tells you what's running.

\`\`\`bash
# Automated fingerprinting with WhatWeb
whatweb https://target.com

# Wappalyzer browser extension (passive in-browser detection)
# Visit https://www.wappalyzer.com/ or install the extension
\`\`\`

WhatWeb output:
\`\`\`
https://target.com [200] Apache[2.4.57], Cookie[PHPSESSID],
HTML5, HTTPServer[Apache/2.4.57], PHP[8.2.0],
WordPress[6.4], jQuery[3.7.1]
\`\`\`

**Why fingerprint matters:**
- Knowing the exact version tells you which CVEs apply
- WordPress sites have known admin paths and vulnerable plugins
- Apache vs Nginx vs IIS have different default configurations
- PHP vs Python vs Node suggest different attack surfaces

\`\`\`bash
# More detailed with WPScan (for WordPress)
wpscan --url https://target.com
\`\`\``),

    l('recon-6', 'Building a Recon Report',
      `Let's put it all together into a systematic recon workflow.

**Phase 1: Passive Recon**

\`\`\`bash
# 1. WHOIS
whois target.com > recon/whois.txt

# 2. DNS enumeration
dig target.com ANY > recon/dns.txt

# 3. Subdomain discovery (passive)
curl -s "https://crt.sh/?q=%25.target.com&output=json" \\
  | jq -r '.[].name_value' | sort -u > recon/subdomains.txt

# 4. Technology lookup
whatweb target.com > recon/tech.txt
\`\`\`

**Phase 2: Active Recon**

\`\`\`bash
# 1. Basic port scan
nmap -sS -sV -F target.com -oN recon/nmap.txt

# 2. Directory enumeration
ffuf -u https://target.com/FUZZ \\
  -w /usr/share/seclists/Discovery/Web-Content/common.txt \\
  -o recon/dirs.json

# 3. Verify subdomains
for sub in $(cat recon/subdomains.txt); do
    curl -sI "https://$sub" -o /dev/null -w "%{http_code} $sub\\n"
done > recon/live-subdomains.txt
\`\`\`

**Phase 3: Analysis**

Review your findings and look for:
- Unusual ports or services
- Admin panels and login pages
- Exposed configuration files
- Outdated software versions
- Subdomains with different technologies

Save everything in a structured format. Documentation is as important as discovery.`, { hasQuiz: true, quiz: [
        { id: 'recon-6-q1', question: 'What is the first phase of a security assessment?', options: ['Exploitation', 'Reconnaissance', 'Reporting', 'Privilege Escalation'], correctIndex: 1, explanation: 'Reconnaissance is always the first phase — you must gather information before you can attack.' },
        { id: 'recon-6-q2', question: 'What tool would you use for passive subdomain enumeration?', options: ['nmap', 'curl against crt.sh', 'hydra', 'sqlmap'], correctIndex: 1, explanation: 'crt.sh queries Certificate Transparency logs — a passive way to find subdomains without touching the target.' },
        { id: 'recon-6-q3', question: 'What is the difference between passive and active reconnaissance?', options: ['Passive is faster', 'Passive leaves no logs on the target', 'Active is always illegal', 'Passive requires more tools'], correctIndex: 1, explanation: 'Passive reconnaissance gathers information without directly interacting with the target, leaving no trace.' },
      ] }),

    l('recon-7', 'Google Hacking & Advanced Dorking',
      `Google indexes everything. Google Dorking finds the sensitive data that wasn't meant to be public.

**Essential Google dorks:**
\`\`\`bash
# Search operators you type into Google:
# site:             Limit to a domain
# inurl:            Word must appear in URL
# intitle:          Word must appear in page title
# filetype:         Specific file format
# intext:           Word must appear in page body
# cache:            Show Google's cached version
# link:             Pages linking to a URL (deprecated)

# Find admin panels
site:target.com inurl:admin

# Find exposed documents
site:target.com filetype:pdf OR filetype:docx OR filetype:xlsx

# Find login pages
site:target.com inurl:login OR inurl:signin OR intitle:"Login"

# Find exposed configuration files
site:target.com filetype:env OR filetype:cfg OR filetype:conf

# Find error messages that reveal info
site:target.com "Fatal error" OR "Warning:" OR "Notice:"

# Find directory listings
site:target.com intitle:"index of"
\`\`\`

**Google Hacking Database (GHDB) — pre-built dorks:**
\`\`\`bash
# Find exposed phpMyAdmin
intitle:phpmyadmin "Welcome to phpMyAdmin" inurl:main.php

# Find web shells already on servers
intitle:"web shell" OR intitle:"c99 shell" OR intitle:"r57 shell"

# Find exposed WordPress configs
inurl:wp-config.php intext:"DB_USER"

# Find exposed .git repositories
inurl:.git intitle:"index of" HEAD

# Find open FTP servers
intitle:"index of" inurl:ftp

# Find security cameras
inurl:"/view.shtml" intitle:"Live View"
\`\`\`

**Automate Google dorking:**
\`\`\`bash
# Use a tool like dorkbot or pagodo
# git clone https://github.com/opsdisk/pagodo.git

# Manual dorking loop (check multiple dorks)
for dork in "inurl:admin" "filetype:env" "intitle:login"; do
    echo "Checking: $dork"
    # You'd use a script to query Google here
done
\`\`\`

**Operational security when dorking:**
- Use a VPN or Tor — Google tracks searches
- Don't click on results unless authorized
- Document findings with screenshots
- Google may block automated queries — use delays

Dorking is completely passive. The target never knows you searched for them.`),

    l('recon-8', 'Automating Recon with Scripts',
      `Manual recon is educational. Automated recon is practical. Build your own recon pipeline.

**Build a simple recon script:**
\`\`\`bash
#!/bin/bash
# basic-recon.sh — automated recon pipeline

TARGET=$1
OUTPUT_DIR="recon-$(echo $TARGET | tr -d '/')"

mkdir -p $OUTPUT_DIR

echo "[*] Starting recon on $TARGET"
echo "[*] Output: $OUTPUT_DIR/"

# Phase 1: DNS Enumeration
echo "[*] Phase 1: DNS Enumeration"
dig $TARGET ANY +short > $OUTPUT_DIR/dns.txt 2>/dev/null
dig $TARGET MX +short >> $OUTPUT_DIR/dns.txt 2>/dev/null

# Phase 2: Subdomain Discovery
echo "[*] Phase 2: Subdomain Discovery"
curl -s "https://crt.sh/?q=%25.$TARGET&output=json" 2>/dev/null | \
  jq -r '.[].name_value' 2>/dev/null | sort -u > $OUTPUT_DIR/subdomains.txt

# Phase 3: Technology Detection
echo "[*] Phase 3: Technology Detection"
curl -sI "https://$TARGET" > $OUTPUT_DIR/headers.txt 2>/dev/null
whatweb $TARGET > $OUTPUT_DIR/tech.txt 2>/dev/null

# Phase 4: Port Scan (basic)
echo "[*] Phase 4: Port Scan"
nmap -F -T4 $TARGET -oN $OUTPUT_DIR/ports.txt 2>/dev/null

echo "[+] Done! Check $OUTPUT_DIR/ for results."
\`\`\`

**Use parallel execution for speed:**
\`\`\`bash
#!/bin/bash
# Fast subdomain check with xargs

TARGET=$1
SUBDOMAIN_LIST=$2

cat $SUBDOMAIN_LIST | xargs -P50 -I{} sh -c '
    host "{}.$1" > /dev/null 2>&1 && echo "{}.$1 resolves"
' _ $TARGET
\`\`\`

**Recon-ng workflow:**
\`\`\`bash
# Recon-ng is a full recon framework
recon-ng

# Within recon-ng:
marketplace refresh
marketplace search github
marketplace install recon/domains-contacts/whois_pocs
modules load recon/domains-hosts/certificate_transparency
options set SOURCE target.com
run
\`\`\`

**Screenshot tools for visual recon:**
\`\`\`bash
# Install eyewitness or gowitness
# Take screenshots of all discovered web servers

# With gowitness:
gowitness scan file -f $OUTPUT_DIR/live-hosts.txt --threads 5

# With eyewitness:
eyewitness --web -f $OUTPUT_DIR/live-hosts.txt --threads 5 --no-prompt
\`\`\`

**Keep your recon organized:**
\`\`\`bash
# Standard directory structure
mkdir -p recon/{passive,active,screenshots,reports}

# Name files consistently
# YYYY-MM-DD_target_scan_type.txt
recon/passive/2024-01-15_target_subdomains.txt
recon/active/2024-01-15_target_nmap.txt
\`\`\``),
];

export const COURSE: Course = {
  id: 'web-recon-101',
  title: 'Web Reconnaissance 101',
  categoryId: 'web-security',
  description:
    'Gather intelligence on web targets. Learn subdomain enumeration, directory brute-forcing, and fingerprinting.',
  overview:
    'Reconnaissance is 80% of hacking. This course teaches you to discover subdomains, identify technologies, find hidden directories, and map out a target’s attack surface using free tools.',
  estimatedMinutes: 55,
  cpCost: 75,
  learningObjectives: [
      'Use tools like Sublist3r and Amass for subdomain enumeration',
      'Perform directory brute-forcing with ffuf and dirb',
      'Fingerprint web technologies using WhatWeb and Wappalyzer',
      'Map out a target’s attack surface from reconnaissance data',
  ],
  skillLevel: 'intermediate',
  prerequisites: ["web-technologies-101"],
  popular: true,
  lessons: LESSONS,
};
