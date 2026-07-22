import type { VFSNode, TerminalState } from '../types';

interface LabFiles {
  name: string;
  content: string;
  permissions?: string;
}

const LAB_FILE_MAP: Record<string, LabFiles[]> = {
  privesc: [
    { name: 'privesc-notes.txt', content: '# Privilege Escalation Checklist\n\n## Enumeration\nfind / -perm -4000 2>/dev/null    # SUID binaries\nsudo -l                           # Sudo permissions\ncat /etc/crontab                  # Cron jobs\nls -la /etc/passwd                # Writable passwd\nuname -a                          # Kernel version\nid                                # Current user/groups\n\n## Techniques\n- SUID binary abuse\n- Sudo misconfiguration (GTFOBins)\n- Cron job hijacking\n- Writable /etc/passwd\n- Kernel exploit\n- Capabilities abuse\n- PATH hijacking\n- Docker group escape\n- NFS no_root_squash\n- Sticky bit race condition' },
    { name: 'target.conf', content: '# Service Configuration\n# This file is owned by root but writable by the service group\n[service]\nuser = www-data\ngroup = service\nexec_start = /opt/service/start.sh\n# TODO: restrict write permissions' },
    { name: 'backup.sh', content: '#!/bin/bash\n# Backup script - runs as root via cron\ntar -czf /tmp/backup.tar.gz /var/www/\nchmod 777 /tmp/backup.tar.gz' },
  ],
  passwords: [
    { name: 'hashes.txt', content: '# Cracked hashes go here\n# Format: hash:type\n# Use: john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt\n\n# MD5\n5f4dcc3b5aa765d61d8327deb882cf99\n\n# SHA-256\nef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f\n\n# bcrypt (cost factor 10)\n$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy\n\n# NTLM\naad3b435b51404eeb9316a57b13b2d41\n\n# Shadow file extract (salted SHA-512)\nappuser:$6$rounds=656000$X4aSqCrM$HcKsbV0Kz1234567890abcdef:19000:0:99999:7:::\nadmin:$6$rounds=656000$Kz8mN2pQ$9876543210fedcba:19000:0:99999:7:::' },
    { name: 'wordlist-small.txt', content: 'password\n123456\nadmin\nroot\nletmein\ntest\nqwerty\nsecret\nmaster\nchangeme\nwelcome\nabc123\npassw0rd\nshadow\npassword1\nsunshine\nsummer\ntrustn01\nletmein1\nqwerty123' },
    { name: 'cracked.txt', content: '# Cracked passwords will appear here after john finishes\n# Run: john --show hashes.txt' },
  ],
  osint: [
    { name: 'recon-notes.txt', content: '# OSINT Recon Notes\n\n## Target Investigation\n\n### Tools Available\n- whois       — Domain registration info\n- dig         — DNS record lookup\n- nslookup    — DNS resolution\n- curl        — HTTP requests\n- theHarvester — Email/subdomain harvesting\n- sherlock    — Username enumeration\n- whatweb     — Web technology detection\n\n## Investigation Steps\n1. WHOIS lookup for target domain\n2. DNS record enumeration (A, MX, TXT, NS)\n3. Subdomain discovery\n4. Email harvesting\n5. Social media enumeration\n6. GitHub dorking for leaked secrets\n7. Shodan search for exposed services' },
    { name: 'target-info.txt', content: '# Target Profile\n\n## NovaCorp\n- Domain: novacorp.com\n- Industry: Technology\n- Employees: ~500\n- HQ: San Francisco, CA\n\n## Known Subdomains\n- mail.novacorp.com\n- dev.novacorp.com\n- api.novacorp.com\n- admin.novacorp.com\n\n## Key Personnel (from LinkedIn)\n- CEO: John Smith\n- CTO: Jane Doe\n- IT Admin: bob.jones' },
    { name: 'harvested-emails.txt', content: '# Harvested Email Addresses\n# Use: theHarvester -d novacorp.com -b google\n\njohn.smith@novacorp.com\njane.doe@novacorp.com\nbob.jones@novacorp.com\nsupport@novacorp.com\nadmin@novacorp.com' },
  ],
  'kill-chain': [
    { name: 'engagement.txt', content: '# Penetration Test Engagement\n\n## Scope\n- Target: 10.0.0.0/24\n- Authorization: Written approval obtained\n- Rules: No data destruction, document everything\n\n## Kill Chain Phases\n1. Reconnaissance — Gather intel on target\n2. Weaponization — Prepare exploits\n3. Delivery — Get initial access\n4. Exploitation — Execute code on target\n5. Installation — Establish persistence\n6. Command & Control — Maintain access\n7. Actions on Objectives — Achieve goals' },
    { name: 'nmap-results.txt', content: '# Nmap Scan Results\n\nNmap scan report for 10.0.0.5\nHOST is up (0.0023s latency)\n\nPORT     STATE  SERVICE  VERSION\n22/tcp   open   ssh      OpenSSH 9.2\n80/tcp   open   http     nginx 1.24\n443/tcp  open   https    nginx 1.24\n3306/tcp open   mysql    MySQL 8.0.35\n8080/tcp open   http     Apache Tomcat 9.0\n\nNmap scan report for 10.0.0.10\nPORT     STATE  SERVICE  VERSION\n22/tcp   open   ssh      OpenSSH 8.9\n445/tcp  open   smb      SMB 3.1.1\n3389/tcp open   rdp      Microsoft Terminal Services' },
    { name: 'credentials.txt', content: '# Gathered Credentials\n\n# From config file leak\nadmin:novaadmin2024\n\n# From default creds\ntomcat:tomcat\nmysql:root\n\n# From phishing simulation\njdoe:Password123!' },
  ],
  'sql-injection': [
    { name: 'sqli-notes.txt', content: '# SQL Injection Notes\n\n## Target: NovaCorp Login Portal\n- URL: http://10.0.0.5/login\n- Parameter: username (POST)\n- DBMS: MySQL 8.0\n\n## Detection\n\' OR 1=1--               # Always true\n\' UNION SELECT NULL--   # Column count test\n\' AND SLEEP(5)--        # Time-based blind\n\n## Exploitation\n\' UNION SELECT username,password FROM users--\n\' UNION SELECT table_name FROM information_schema.tables--\n\' UNION SELECT column_name FROM information_schema.columns WHERE table_name=\'users\'--\n\n## Stacked Queries\n\'; DROP TABLE users;--\n\n## Tools\n- sqlmap (automated)\n- manual injection\n- Burp Suite (proxy/repeater)' },
    { name: 'target-info.txt', content: '# Target Application Info\n\n## NovaCorp Login Portal\n- URL: http://10.0.0.5/login\n- Method: POST\n- Parameters: username, password\n- Database: MySQL 8.0.35\n- Backend: PHP 8.2\n- Server: nginx 1.24\n\n## Database Schema\nTable: users\n  - id INT AUTO_INCREMENT\n  - username VARCHAR(50)\n  - password VARCHAR(255)\n  - email VARCHAR(100)\n  - role ENUM(\'user\',\'admin\')\n\nTable: secrets\n  - id INT AUTO_INCREMENT\n  - secret_key VARCHAR(100)\n  - secret_value TEXT\n  - created_by INT' },
    { name: 'enum-results.txt', content: '# Enumeration Results\n\n## Database Tables\ninformation_schema.tables:\n  - users\n  - secrets\n  - sessions\n  - logs\n\n## Users Table Columns\n  - id\n  - username\n  - password (bcrypt hashed)\n  - email\n  - role\n\n## Sample Users\n  admin:$2a$10$...\n  jdoe:$2a$10$...\n  test:$2a$10$...' },
  ],
};

function getDefaultLabFiles(labId: string): LabFiles[] {
  return [
    { name: 'README.md', content: `# ${labId} Lab\n\nWelcome to the ${labId} lab environment.\nUse the terminal to complete the challenges.\nType 'help' for available commands.` },
    { name: 'notes.txt', content: `# Lab Notes\n\nUse this file to keep track of your findings.\nDocument any interesting discoveries here.` },
  ];
}

export function injectLabContent(
  state: TerminalState,
  labId: string,
  _scenarioId?: string,
): TerminalState {
  const root = { ...state.root };

  let homeDir = root.children.find(c => c.name === 'home');
  if (!homeDir) return state;
  let kaliDir = homeDir.children.find(c => c.name === 'kali');
  if (!kaliDir) return state;
  let projectsDir = kaliDir.children.find(c => c.name === 'Projects');
  if (!projectsDir) return state;

  const labFiles = LAB_FILE_MAP[labId] || getDefaultLabFiles(labId);

  const labDir: VFSNode = {
    name: labId,
    type: 'dir',
    children: labFiles.map(f => ({
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

  projectsDir.children = [...projectsDir.children, labDir];

  return {
    ...state,
    cwd: `/home/kali/Projects/${labId}`,
    env: {
      ...state.env,
      LAB_ID: labId,
      LAB_DIR: `/home/kali/Projects/${labId}`,
    },
  };
}
