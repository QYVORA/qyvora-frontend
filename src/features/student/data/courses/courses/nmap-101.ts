import type { Lesson, Course } from '../types';

const l = (id: string, title: string, instruction: string, extras?: Partial<Lesson>): Lesson => ({
  id, title, instruction, image: null, ...extras,
});

export const LESSONS: Lesson[] = [
    l('nm-1', 'What is Nmap?',
      `**Nmap** (Network Mapper) is the industry standard for network discovery and security auditing. It sends packets to target hosts and analyzes the responses to determine what's running.

\`\`\`bash
# Check if Nmap is installed
nmap --version

# Install if needed
sudo apt install nmap
\`\`\`

Nmap can discover:
- Which hosts are online
- What ports are open on each host
- What services are running on those ports
- What operating system the host is using
- What firewall rules are in place

**Legal use:**
Only scan systems you own or have explicit permission to test. \`scanme.nmap.org\` is provided by the Nmap project for testing.

\`\`\`bash
# Your first Nmap scan
nmap scanme.nmap.org
\`\`\`

This scans the 1000 most common ports. The results show which ports are open and their associated services.

**Try it yourself:** Run \`nmap --version\` to confirm Nmap is installed, then \`nmap scanme.nmap.org\` for your first scan. The output shows open ports and services — the starting point for any network assessment.`,
      { hasTerminal: true, terminalCommands: ['nmap --version', 'nmap scanme.nmap.org'], terminalTitle: 'lesson-terminal' }),

    l('nm-2', 'Basic Scanning',
      `Nmap offers different scan types for different situations.

**Ping sweep** — discover live hosts on a network:

\`\`\`bash
# Find which hosts are online (ICMP echo)
nmap -sn 192.168.1.0/24

# Output:
# Nmap done: 256 IP addresses (5 hosts up)
# 192.168.1.1   → router
# 192.168.1.10  → your machine
# 192.168.1.15  → another device
\`\`\`

The \`-sn\` flag skips port scanning and only checks if hosts are alive.

**TCP SYN scan** (default, requires root):

\`\`\`bash
sudo nmap -sS 192.168.1.1
\`\`\`

This sends a SYN packet, then looks for SYN-ACK responses. An open port responds with SYN-ACK; a closed port responds with RST. It's called a "half-open" scan because it never completes the TCP handshake.

**TCP Connect scan** (no root needed):

\`\`\`bash
nmap -sT 192.168.1.1
\`\`\`

This completes the full TCP handshake. It's slower and more detectable but doesn't require root privileges.

**UDP scan:**

\`\`\`bash
sudo nmap -sU 192.168.1.1
\`\`\`

UDP scans are slower because UDP doesn't have a handshake. Nmap waits for responses or ICMP unreachable messages.

> **Why this matters for hacking:** Scanning is the first phase of any network penetration test. A SYN scan (\`-sS\`) is fast and stealthy — it never completes the TCP handshake, so many targets won't log a full connection. UDP scanning is essential for finding exposed DNS, SNMP, and DHCP services. In red team engagements, adjusting scan speed and type evades detection by network intrusion detection systems (NIDS).

**Mini-challenge:** Run \`sudo nmap -sn 192.168.1.0/24\` (adjust to your subnet) to discover live hosts. Then scan a discovered host with \`-sS -sV\` to find open ports and service versions. This is the exact workflow for network reconnaissance.`,
      { hasTerminal: true, terminalCommands: ['nmap --help | head -5', 'nmap -sn 192.168.1.0/24 2>/dev/null || echo "Adjust subnet or run with sudo"'], terminalTitle: 'lesson-terminal' }),

    l('nm-3', 'Port Discovery',
      `Nmap gives you fine-grained control over which ports to scan.

\`\`\`bash
# Scan specific ports
nmap -p 22,80,443 scanme.nmap.org

# Scan a range
nmap -p 1-1000 scanme.nmap.org

# Scan all 65535 ports (slow!)
nmap -p- scanme.nmap.org

# Scan most common ports (default: 1000)
nmap --top-ports 100 scanme.nmap.org

# Fast scan (100 most common ports)
nmap -F scanme.nmap.org
\`\`\`

**Port states:**
- **open** — an application is listening on this port
- **closed** — no application listening (port is accessible)
- **filtered** — a firewall or filter is blocking the probe
- **unfiltered** — port is accessible but state unknown
- **open|filtered** — Nmap can't determine if open or filtered

\`\`\`bash
# Scan common web ports across multiple hosts
nmap -p 80,443,8080,8443 192.168.1.0/24

# Scan for database ports
nmap -p 3306,5432,27017,6379 192.168.1.0/24
\`\`\`

> **Why this matters for hacking:** Port discovery reveals the attack surface. Open ports are doors into the system. SSH (22), HTTP (80/443), and RDP (3389) are common targets. Finding an unexpected database port (3306, 5432) exposed to the internet is a critical finding — it means the DB is directly reachable without VPN. In CTF challenges and real engagements, scanning ALL ports (\`-p-\`) often reveals non-standard services running on high ports that the default 1000-port scan misses.

Common database ports: 3306 (MySQL), 5432 (PostgreSQL), 27017 (MongoDB), 6379 (Redis). Seeing these exposed is a common security finding.`,
      { hasTerminal: true, terminalCommands: ['nmap --top-ports 10 scanme.nmap.org'], terminalTitle: 'lesson-terminal' }),

    l('nm-4', 'Service Version Detection',
      `Knowing a port is open is useful. Knowing the exact software version is powerful.

\`\`\`bash
# Service version detection
nmap -sV scanme.nmap.org
\`\`\`

\`\`\`
PORT     STATE    SERVICE     VERSION
22/tcp   open     ssh         OpenSSH 6.6.1p1 Ubuntu
80/tcp   open     http        Apache httpd 2.4.7
443/tcp  open     ssl/http    Apache httpd 2.4.7
\`\`\`

The version tells you:
- The exact software (OpenSSH, Apache, nginx)
- The version number (6.6.1p1, 2.4.7)
- The operating system (Ubuntu)

**Why this matters:**
- Version 6.6.1p1 of OpenSSH might have known vulnerabilities
- Apache 2.4.7 has specific CVEs
- Knowing the OS helps tailor further attacks

\`\`\`bash
# Aggressive version detection (more probes, more accurate)
nmap -sV --version-intensity 9 scanme.nmap.org

# Lightweight version detection (faster, less accurate)
nmap -sV --version-intensity 0 scanme.nmap.org
\`\`\`

The intensity ranges from 0 (light) to 9 (heavy). Default is 7. Higher intensity is more accurate but takes longer and creates more traffic.

**Mini-challenge:** Run \`nmap -sV scanme.nmap.org\` and study the version output. For each discovered service, think about what vulnerabilities are associated with that version (e.g., OpenSSH 6.6 has known CVE-2015-5600). This correlation between service version and known vulnerabilities is the core of vulnerability assessment.`,
      { hasTerminal: true, terminalCommands: ['nmap -sV scanme.nmap.org'], terminalTitle: 'lesson-terminal' }),

    l('nm-5', 'OS Fingerprinting',
      `Nmap can identify the operating system of a remote host by analyzing subtle differences in how TCP/IP stacks respond to probes.

\`\`\`bash
# OS detection (requires root)
sudo nmap -O scanme.nmap.org
\`\`\`

\`\`\`
OS details: Linux 2.6.32 - 3.13
Network Distance: 14 hops
\`\`\`

Nmap's OS detection works by sending a series of TCP and UDP packets to open and closed ports, then comparing the responses against a database of known OS fingerprints.

**Combine with version detection for full picture:**

\`\`\`bash
# Aggressive scan: OS + version + scripts + traceroute
sudo nmap -A scanme.nmap.org

# This combines: -O (OS), -sV (version), -sC (default scripts)
# and traceroute
\`\`\`

**Limitations:**
- OS detection is less reliable behind firewalls
- Recent OS versions may not be in Nmap's fingerprint database
- Some systems deliberately obscure their TCP/IP stack
- Load balancers can return mixed results

\`\`\`bash
# Limit OS detection attempts for faster scanning
sudo nmap -O --osscan-limit scanme.nmap.org

# Guess aggressively even with partial data
sudo nmap -O --osscan-guess scanme.nmap.org
\`\`\`

> **Why this matters for hacking:** OS fingerprinting tells you what exploit framework to reach for. A Linux target might need kernel exploits; Windows targets might need SMB or RDP exploits. The \`-A\` flag (aggressive scan) combines OS detection, version detection, default scripts, and traceroute in one command — it's the go-to for comprehensive reconnaissance. Use \`-O\` with \`--osscan-guess\` when dealing with hardened systems that try to obscure their identity.

Despite its limitations, OS fingerprinting is remarkably accurate for identifying the general OS family (Windows vs Linux vs macOS).`,
      { hasTerminal: true, terminalCommands: ['nmap -O scanme.nmap.org 2>/dev/null || echo "Run with sudo for OS detection"'], terminalTitle: 'lesson-terminal' }),

    l('nm-6', 'NSE Scripts',
      `The **Nmap Scripting Engine (NSE)** extends Nmap with automated checks for vulnerabilities, misconfigurations, and more.

\`\`\`bash
# List all available scripts
ls /usr/share/nmap/scripts/
# There are hundreds: http-*, smb-*, ssl-*, dns-*, etc.

# Run default scripts (safe, commonly useful)
nmap -sC scanme.nmap.org

# Run a specific script
nmap --script http-headers scanme.nmap.org

# Run multiple scripts
nmap --script http-title,http-server-header scanme.nmap.org
\`\`\`

**Script categories:**
- **safe** — won't crash services or cause damage
- **intrusive** — might affect the target
- **vuln** — check for specific vulnerabilities
- **exploit** — attempt to exploit vulnerabilities
- **auth** — authentication testing
- **brute** — brute-force attacks
- **discovery** — service and host discovery

\`\`\`bash
# Vulnerability scanning
nmap --script vuln scanme.nmap.org

# HTTP enumeration
nmap --script http-enum scanme.nmap.org

# SSL/TLS testing
nmap --script ssl-enum-ciphers -p 443 scanme.nmap.org

# SMB enumeration (Windows)
nmap --script smb-enum-shares -p 445 192.168.1.1
\`\`\`

**Writing a basic NSE script:**

\`\`\`lua
-- my-script.nse
description = "Check if HTTP title contains 'admin'"
author = "You"
license = "Same as Nmap"

-- Rule: run against port 80
portrule = function(host, port)
    return port.protocol == "tcp" and port.number == 80
end

-- Action: fetch page and check title
action = function(host, port)
    local response = http.get(host, port, "/")
    if response and response.status == 200 then
        if response.body:match("<title>(.-)</title>") then
            return "Page title: " .. response.body:match("<title>(.-)</title>")
        end
    end
end
\`\`\`

Save as \`my-script.nse\` in \`/usr/share/nmap/scripts/\` and run:

\`\`\`bash
nmap --script my-script target.com
\`\`\`

> **Why this matters for hacking:** NSE scripts automate the tedious parts of reconnaissance. Instead of manually checking for each vulnerability, you can run \`--script vuln\` to test hundreds of checks at once. The \`http-enum\` script discovers hidden directories and files — a standard step in web application testing. Always start with safe scripts (\`-sC\`) on production targets, and escalate to intrusive/vuln scripts only with explicit authorization.

**Mini-challenge:** Run \`nmap -sC scanme.nmap.org\` to execute default scripts. Then try \`nmap --script http-headers scanme.nmap.org\` to see HTTP headers. These are the scripts you'll use most often in real engagements.

NSE makes Nmap infinitely extensible. The community has written hundreds of scripts covering everything from HTTP to databases to industrial control systems.`, { hasQuiz: true, quiz: [
        { id: 'nm-6-q1', question: 'Which NSE category is safe to run on production systems?', options: ['exploit', 'intrusive', 'safe', 'brute'], correctIndex: 2, explanation: 'The "safe" category contains scripts designed to not crash services or disrupt operations.' },
        { id: 'nm-6-q2', question: 'What language are NSE scripts written in?', options: ['Python', 'Lua', 'Perl', 'JavaScript'], correctIndex: 1, explanation: 'NSE scripts are written in Lua, a lightweight scripting language embedded in Nmap.' },
      ] }),

    l('nm-7', 'Advanced Scan Types',
      `Beyond SYN and TCP connect scans, Nmap supports several specialized scan types.

**TCP FIN, NULL, and XMAS scans (stealth through firewalls):**
\`\`\`bash
# FIN scan — sends packet with only FIN flag set
nmap -sF target.com

# NULL scan — no flags set
nmap -sN target.com

# XMAS scan — FIN, PSH, URG flags set (lights up like a Christmas tree)
nmap -sX target.com
\`\`\`

These work because closed ports respond with RST, but open ports ignore the packet (per RFC 793). They can bypass some stateless firewalls.

**ACK scan — map firewall rules:**
\`\`\`bash
# ACK scan — never identifies open ports, but maps firewall rules
nmap -sA target.com
# Filtered: port is behind a firewall
# Unfiltered: port is reachable (helps with -sW)
\`\`\`

**Window scan:**
\`\`\`bash
# Window scan — uses TCP window size to determine open vs closed
nmap -sW target.com
# Some systems use specific window sizes for open ports
\`\`\`

**Maimon scan:**
\`\`\`bash
# Sends packet with FIN + PSH flags
nmap -sM target.com
# Rarely useful, but works on some BSD-derived systems
\`\`\`

**Scan combinations:**
\`\`\`bash
# Version detection + default scripts + OS detection + traceroute
nmap -A target.com

# All-in-one: SYN scan + version + scripts + OS + traceroute
            nmap -sS -sV -sC -O -T4 target.com
\`\`\`

> **Why this matters for hacking:** FIN/NULL/XMAS scans exploit RFC behavior — closed ports MUST reply with RST, while open ports drop the packet silently. This lets you bypass stateless firewalls that only block SYN packets. The ACK scan (\`-sA\`) won't find open ports but will map firewall rules, telling you which ports are filtered vs. unfiltered — critical for understanding the defensive posture before committing to an attack path.

**Mini-challenge:** Compare \`nmap -sS scanme.nmap.org\` with \`nmap -sF scanme.nmap.org\` and note the difference in output. If a firewall blocks SYN scans, the FIN scan may still get through. Practice using \`-sA\` to probe firewall rules on a target you control.`),

    l('nm-8', 'Performance & Firewall Evasion',
      `Nmap offers many options to optimize speed and bypass defenses.

**Timing templates (T0-T5):**
\`\`\`bash
# Paranoid (T0) — serializes scans, waits 5 min between probes
nmap -T0 target.com      # IDS evasion, extremely slow

# Sneaky (T1) — 15 seconds between probes
nmap -T1 target.com      # Still evades IDS

# Polite (T2) — 0.4 seconds between probes
nmap -T2 target.com      # Less bandwidth, less IDS attention

# Normal (T3) — default, parallel probes
nmap -T3 target.com      # Default behavior

# Aggressive (T4) — faster, assumes good network
nmap -T4 target.com      # Common for local networks

# Insane (T5) — very fast, may miss open ports
nmap -T5 target.com      # Sacrifices accuracy for speed
\`\`\`

**Evasion techniques:**
\`\`\`bash
# Fragment packets (bypass some packet filters)
nmap -f target.com
nmap --mtu 16 target.com  # Custom fragment size

# Decoy scans (spoof source IPs)
nmap -D 192.168.1.10,10.0.0.1,target.com
# -D decoy1,decoy2,ME — uses your real IP among decoys

# Randomize host and port order
nmap --randomize-hosts target.com
nmap --scan-delay 1s target.com

# Spoof MAC address
nmap --spoof-mac Cisco target.com

# Idle scan (zombie-based, very stealthy)
nmap -sI zombie_host target.com
\`\`\`

**Performance tuning:**
\`\`\`bash
# Increase parallelism
nmap --min-parallelism 50 --max-parallelism 100 target.com

# Adjust timing
nmap --min-rtt-timeout 100ms --max-rtt-timeout 1000ms target.com

# Host group size
nmap --min-hostgroup 64 --max-hostgroup 256 target.com/24

# Retries
nmap --max-retries 1 target.com  # Fewer retries, faster, less accurate
\`\`\`

**Scan specific ports efficiently:**
\`\`\`bash
# Top ports (faster than full scan)
nmap --top-ports 100 target.com

# Speed optimization for large subnets
            nmap -sn -T5 --min-parallelism 100 10.0.0.0/8
# -sn = ping sweep only, fast subnet discovery
\`\`\`

> **Why this matters for hacking:** Timing and evasion are essential in adversarial environments. A T5 scan over a 100Mbps link might still miss ports, but a T0 scan with decoys, fragmentation, and randomized order can evade even well-tuned IDS. In penetration tests, use \`-D\` decoys to obscure your true IP, \`-f\` to bypass simple packet filters, and \`--randomize-hosts\` to avoid pattern detection. The idle scan (\`-sI\`) is the most stealthy — it bounces scan traffic through a "zombie" host so the target never sees your IP.

**Mini-challenge:** Run \`nmap -T4 -F scanme.nmap.org\` (fast, top-100 ports) and time it. Then run \`nmap -T2 -p 22,80,443 scanme.nmap.org\` (slower, specific ports) and compare the timing. Understanding the speed-accuracy tradeoff is crucial for real-world engagements where time windows vary.`),

    l('nm-9', 'Output Formats & Automation',
      `Nmap supports multiple output formats for reporting and automation.

**Output formats:**
\`\`\`bash
# Normal output (human-readable)
nmap -oN scan.txt target.com

# XML output (machine-parsable, best for automation)
nmap -oX scan.xml target.com

# Grepable output (for grep/awk)
nmap -oG scan.grep target.com
# grep "22/open" scan.grep  # Find hosts with SSH open

# All formats at once
nmap -oA scan target.com
# Creates scan.nmap, scan.xml, scan.grep
\`\`\`

**Parsing XML output:**
\`\`\`bash
# Using xsltproc to generate HTML reports
xsltproc scan.xml -o scan.html

# Using Python to parse
python3 -c "
import xml.etree.ElementTree as ET
tree = ET.parse('scan.xml')
for host in tree.findall('.//host'):
    addr = host.find('address').get('addr')
    ports = host.findall('.//port')
    for p in ports:
        print(f'{addr}:{p.get("portid")}/{p.get("protocol")} {p.find("state").get("state")}')
"
\`\`\`

**Automation with bash:**
\`\`\`bash
#!/bin/bash
# auto-scan.sh — scan a list of targets
TARGETS="targets.txt"
OUTDIR="scans/$(date +%Y%m%d-%H%M)"

mkdir -p "$OUTDIR"

while read -r target; do
    echo "Scanning $target..."
    nmap -sS -sV -sC -O -oA "$OUTDIR/$target" "$target"
done < "$TARGETS"

echo "All scans saved to $OUTDIR"
\`\`\`

**Using Ndiff (compare scan results):**
\`\`\`bash
# Compare two scans to see what changed
ndiff scan-before.xml scan-after.xml

# Useful for monitoring (e.g., night vs day scan)
\`\`\`

**Integration with other tools:**
\`\`\`bash
# Feed open ports to other tools
# Get list of HTTP servers
grep "80/open" scan.grep | awk '{print $2}' > http-targets.txt

# Create targets.txt for further scanning
nmap -sV -oG - 192.168.1.0/24 | awk '/open/{print $2}' > live-hosts.txt

# Pipe to nikto (web scanner)
nmap -p80 --open -oG - 192.168.1.0/24 | awk '/80/{print $2}' | while read h; do nikto -h "$h"; done
\`\`\`

Mastering output formats and automation turns Nmap from a one-off scanning tool into the foundation of a complete network reconnaissance pipeline.`, { hasQuiz: true, quiz: [
        { id: 'nm-9-q1', question: 'Which Nmap flag saves output in all formats at once?', options: ['-oN', '-oX', '-oA', '-oG'], correctIndex: 2, explanation: '-oA saves normal, XML, and grepable output simultaneously, creating three files with the given basename.' },
        { id: 'nm-9-q2', question: 'Which Nmap tool compares scan results to show changes?', options: ['ndiff', 'ncat', 'nping', 'nmap-compare'], correctIndex: 0, explanation: 'ndiff compares two Nmap XML output files and highlights differences in open ports and services.' },
      ] }),
];

export const COURSE: Course = {
  id: 'nmap-101',
  title: 'Nmap 101',
  categoryId: 'tools',
  description:
    'The network mapper every hacker must master. Learn to scan hosts, discover services, and fingerprint operating systems.',
  overview:
    'Nmap is the most widely used network discovery tool in security. This course teaches you to scan networks, detect open ports, identify running services, and fingerprint operating systems — the essential first step in any network assessment.',
  estimatedMinutes: 60,
  cpCost: 75,
  learningObjectives: [
      'Perform basic and advanced scans with Nmap',
      'Detect open ports and identify running services',
      'Fingerprint operating systems remotely',
      'Write NSE scripts for automated reconnaissance',
  ],
  skillLevel: 'beginner',
  prerequisites: ["networking-101"],
  popular: true,
  lessons: LESSONS,
};
