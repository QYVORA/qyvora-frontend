import type { CommandHandler } from '../../types';

export const gobuster: CommandHandler = (args, state) => {
  const urlIdx = args.indexOf('-u');
  const wordlistIdx = args.indexOf('-w');
  const url = urlIdx !== -1 ? args[urlIdx + 1] : '';
  const wordlist = wordlistIdx !== -1 ? args[wordlistIdx + 1] : '/usr/share/wordlists/dirb/common.txt';
  if (!url) return { output: '', error: 'gobuster: please provide a url (-u)', exitCode: 1 };
  const verbose = args.includes('-v');
  const extensions = args.indexOf('-x') !== -1 ? args[args.indexOf('-x') + 1] : '';
  const discovered = [
    { path: '/admin', status: 200, size: '2.3KB' },
    { path: '/login', status: 200, size: '4.1KB' },
    { path: '/dashboard', status: 302, size: '0B', location: '/login' },
    { path: '/api', status: 200, size: '156B' },
    { path: '/assets', status: 301, size: '0B' },
    { path: '/backup', status: 200, size: '8.7KB' },
    { path: '/config', status: 403, size: '0B' },
    { path: '/robots.txt', status: 200, size: '124B' },
    { path: '/.git', status: 301, size: '0B' },
    { path: '/.env', status: 403, size: '0B' },
  ];
  const lines: string[] = [
    `===============================================================`,
    `Gobuster v3.6 (by OJ Reeves & Christian Mehlmauer)`,
    `===============================================================`,
    `[+] Url:                     ${url}`,
    `[+] Method:                  GET`,
    `[+] Threads:                 10`,
    `[+] Wordlist:                ${wordlist}`,
    `[+] Negative Status codes:   404`,
    `[+] User Agent:              gobuster/3.6`,
    `[+] Timeout:                 10s`,
    `===============================================================`,
    `Starting gobuster in directory enumeration mode`,
    `===============================================================`,
    ...discovered.map(p => {
      const parts = [`/${p.path.padEnd(25)} (Status: ${p.status})`, `[Size: ${p.size}]`];
      if (p.location) parts.push(`[Redirect: ${p.location}]`);
      return parts.join(' ');
    }),
    '',
    'Progress: 4612 / 4612 (100.00%)',
    '===============================================================',
    'Finished',
    '===============================================================',
  ];
  return { output: lines.join('\n'), exitCode: 0, streamLines: lines };
};

export const hydra: CommandHandler = (args, state) => {
  const loginIdx = args.indexOf('-l');
  const userlistIdx = args.indexOf('-L');
  const passlistIdx = args.indexOf('-P');
  const serviceIdx = args.findIndex(a => a.includes('://'));
  const login = loginIdx !== -1 ? args[loginIdx + 1] : 'admin';
  const userlist = userlistIdx !== -1 ? args[userlistIdx + 1] : '/usr/share/wordlists/rockyou.txt';
  const passlist = passlistIdx !== -1 ? args[passlistIdx + 1] : '/usr/share/wordlists/rockyou.txt';
  if (serviceIdx === -1) return { output: '', error: 'hydra: you must specify a service and target', exitCode: 1 };
  const target = args[serviceIdx];
  const [proto, hostPort] = target.split('://');
  const [host, port] = hostPort.split(':');
  const foundPass = 'admin123';
  const lines: string[] = [
    `Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak`,
    '',
    `Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at ${new Date().toLocaleString()}`,
    `[DATA] max ${Math.floor(Math.random() * 16 + 1)} tasks per 1 server, overall ${Math.floor(Math.random() * 32 + 1)} tasks, ${Math.floor(Math.random() * 100 + 100)} login tries (l:1/p:${Math.floor(Math.random() * 100 + 100)})`,
    `[DATA] attacking ${proto}://${host}:${port}/`,
    ...Array.from({ length: 5 }, (_, i) => {
      const usernames = ['admin', 'root', 'user', 'test', 'guest'];
      const passwords = ['password', '123456', 'admin', 'letmein', 'admin123', 'welcome'];
      return `[${proto}][${proto}] host: ${host}   login: ${usernames[i % usernames.length]}   password: ${passwords[i % passwords.length]}   [${Math.floor(Math.random() * 100) + 1} tries]`;
    }),
    `[${proto}][${proto}] host: ${host}   login: ${login}   password: ${foundPass}`,
    `[STATUS] attack finished for ${host} (waiting for children to complete)`,
    `1 of 1 target successfully completed, 1 valid password found`,
    `Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at ${new Date().toLocaleString()}`,
  ];
  return { output: lines.join('\n'), exitCode: 0, streamLines: lines };
};

export const sqlmap: CommandHandler = (args, state) => {
  const urlIdx = args.indexOf('-u');
  const url = urlIdx !== -1 ? args[urlIdx + 1] : '';
  if (!url) return { output: '', error: 'sqlmap: no target URL provided. Use -u <url>', exitCode: 1 };
  const batch = args.includes('--batch');
  const level = args.indexOf('--level') !== -1 ? parseInt(args[args.indexOf('--level') + 1]) || 1 : 1;
  const risk = args.indexOf('--risk') !== -1 ? parseInt(args[args.indexOf('--risk') + 1]) || 1 : 1;
  const tables = ['users', 'config', 'sessions', 'logs', 'products'];
  const columns = [
    ['id', 'username', 'password_hash', 'email', 'role', 'created_at'],
    ['key', 'value', 'updated_at'],
    ['session_id', 'user_id', 'token', 'expires_at'],
    ['id', 'action', 'timestamp', 'ip_address'],
    ['id', 'name', 'price', 'stock'],
  ];
  const lines: string[] = [
    '',
    '       ___\n      __H__\n ___ ___[)]_____ ___ ___  {1.8.2#stable}\n|_ -| . [,]     | \'| . |\n|___|_  [(]_|_|_|__,|  _|\n      |_|V...       |_|   https://sqlmap.org',
    '',
    `[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal.`,
    '',
    `[*] starting @ ${new Date().toLocaleString()}`,
    '',
    `[INFO] testing connection to the target URL`,
    `[INFO] checking if the target is protected by some kind of WAF/IPS`,
    `[INFO] testing if the target URL content is stable`,
    `[INFO] target URL content is stable`,
    `[INFO] testing if ${url} is injectable`,
    ...Array.from({ length: 3 }, (_, i) => `[INFO] testing '${i === 0 ? 'AND' : i === 1 ? 'OR' : 'UNION'} boolean-based blind'`),
    `[INFO] ${url} is ${level > 1 ? 'HEAVILY ' : ''}INJECTABLE`,
    `[INFO] retrieving database management system name`,
    `[INFO] the back-end DBMS is MySQL 8.0.35`,
    `[INFO] fetching database names`,
    `[INFO] fetching tables for database 'qyvora'`,
    ...tables.map(t => `[INFO] fetching columns for table '${t}'`),
    `Database: qyvora`,
    `[${tables.length} tables]`,
    '+---------------------------+',
    ...tables.map(t => `| ${t.padEnd(25)} |`),
    '+---------------------------+',
    '',
    `Table: users`,
    `[${columns[0].length} columns]`,
    '+---------------------------+',
    ...columns[0].map(c => `| ${c.padEnd(25)} |`),
    '+---------------------------+',
    '',
    ...(batch ? [
      `[INFO] fetching entries for 'users'`,
      `Table: users (${Math.floor(Math.random() * 50 + 10)} entries)`,
      `+----+----------+--------------------------+--------------------------+--------+--------------------------+`,
      `| id | username | password_hash            | email                    | role   | created_at               |`,
      `+----+----------+--------------------------+--------------------------+--------+--------------------------+`,
      `| 1  | admin    | \$2y$10\$xxxxxxxxxxxxxxxxxx | admin@qyvora.io          | admin  | 2024-01-15 08:30:00      |`,
      `| 2  | student1 | \$2y$10\$yyyyyyyyyyyyyyyyyy | student1@qyvora.io       | user   | 2024-03-22 14:15:00      |`,
      `| 3  | student2 | \$2y$10\$zzzzzzzzzzzzzzzzzz | student2@qyvora.io       | user   | 2024-05-10 09:45:00      |`,
      `+----+----------+--------------------------+--------------------------+--------+--------------------------+`,
    ] : [
      '[INFO] you can add --batch to automatically fetch all entries',
    ]),
    '',
    `[*] ending @ ${new Date().toLocaleString()}`,
  ];
  return { output: lines.join('\n'), exitCode: 0, streamLines: lines };
};

export const nikto: CommandHandler = (args, state) => {
  const hostIdx = args.indexOf('-h');
  const host = hostIdx !== -1 ? args[hostIdx + 1] : '';
  if (!host) return { output: '', error: 'nikto: missing host parameter (-h)', exitCode: 1 };
  const findings = [
    { type: 'info', msg: 'Server: nginx/1.24.0' },
    { type: 'info', msg: 'Retrieved x-powered-by header: Express' },
    { type: 'vuln', msg: '/: Server leaks inodes via ETags, header found with file /, inode: 123456, size: 1234, mtime: 0xABCDEF' },
    { type: 'vuln', msg: '/: The anti-clickjacking X-Frame-Options header is not present.' },
    { type: 'vuln', msg: '/: The X-Content-Type-Options header is not set.' },
    { type: 'info', msg: 'Root page / redirects to: /login' },
    { type: 'vuln', msg: '/admin/: Admin login page found.' },
    { type: 'vuln', msg: '/backup/: Directory listing found.' },
    { type: 'info', msg: '/robots.txt: Contains 2 disallowed entries.' },
    { type: 'info', msg: '/sitemap.xml: Sitemap found.' },
    { type: 'vuln', msg: '/.env: Environment file may be accessible.' },
    { type: 'info', msg: '/api: API endpoint exposed.' },
  ];
  const lines: string[] = [
    `- Nikto v2.5.0`,
    `---------------------------------------------------------------------------`,
    `+ Target IP: ${host.replace(/^https?:\/\//, '').split(':')[0]}`,
    `+ Target Hostname: ${host}`,
    `+ Target Port: ${host.includes(':') ? host.split(':').pop() : '80'}`,
    `+ Start Time: ${new Date().toLocaleString()}`,
    `---------------------------------------------------------------------------`,
    ...findings.map(f => `+ ${f.type === 'vuln' ? '*** ' : ''}${f.msg}${f.type === 'vuln' ? ' ***' : ''}`),
    `---------------------------------------------------------------------------`,
    `${findings.filter(f => f.type === 'vuln').length} host(s) tested`,
    `+ ${findings.length} items checked: ${findings.filter(f => f.type === 'vuln').length} vulnerabilities identified`,
    `---------------------------------------------------------------------------`,
  ];
  return { output: lines.join('\n'), exitCode: 0, streamLines: lines };
};

export const john: CommandHandler = (args, state) => {
  const targets = args.filter(a => !a.startsWith('-'));
  if (targets.length === 0) return { output: '', error: 'john: no password files specified', exitCode: 1 };
  const wordlist = args.indexOf('--wordlist') !== -1 ? args[args.indexOf('--wordlist') + 1] : '/usr/share/wordlists/rockyou.txt';
  const cracked = [
    { hash: '$2y$10$xxxxxxxxxxxxxxxxxxxxxx', password: 'password123', type: 'bcrypt' },
    { hash: '$2y$10$yyyyyyyyyyyyyyyyyyyyyy', password: 'admin2024!', type: 'bcrypt' },
  ];
  const lines: string[] = [
    `Created directory: /home/kali/.john`,
    `John the Ripper 1.9.0-jumbo-1 OMP [linux-gnu 64-bit x86_64 AVX2]`,
    `Copyright (c) 1996-2023 by Solar Designer and others`,
    `Homepage: https://www.openwall.com/john/`,
    '',
    `Will run 4 OpenMP threads`,
    `Loaded ${Math.floor(Math.random() * 10 + 5)} password hashes with ${Math.floor(Math.random() * 3 + 1)} different salts (${cracked[0].type} [Blowfish 32/64])`,
    `Remaining ${Math.floor(Math.random() * 5 + 1)} password hashes with ${Math.floor(Math.random() * 3 + 1)} different salts`,
    `Proceeding with wordlist:${wordlist}`,
    `Proceeding with incremental:ASCII`,
    ...cracked.map(c => `${c.password.padEnd(20)} (${c.hash.slice(0, 16)}...)`),
    '',
    `${cracked.length}g 0:00:00:${String(Math.floor(Math.random() * 59)).padStart(2, '0')}:${String(Math.floor(Math.random() * 59)).padStart(2, '0')} ${Math.floor(Math.random() * 1000 + 500)}g/s ${Math.floor(Math.random() * 10000 + 5000)}p/s ${Math.floor(Math.random() * 10000 + 5000)}c/s ${Math.floor(Math.random() * 10000 + 5000)}C/s`,
    `Use the "--show --format=bcrypt" option to display all of the cracked passwords reliably`,
    `Session completed.`,
  ];
  return { output: lines.join('\n'), exitCode: 0, streamLines: lines };
};

export const searchsploit: CommandHandler = (args, state) => {
  const query = args.filter(a => !a.startsWith('-')).join(' ');
  if (!query) return { output: '', error: 'searchsploit: missing search term', exitCode: 1 };
  const results = [
    { eid: '50575', title: 'Linux Kernel 5.15 - Privilege Escalation', type: 'local', platform: 'linux', date: '2024-01-15' },
    { eid: '50432', title: 'nginx 1.24.0 - Buffer Overflow', type: 'remote', platform: 'linux', date: '2023-12-20' },
    { eid: '50211', title: 'MySQL 8.0.x - Authentication Bypass', type: 'remote', platform: 'linux', date: '2023-11-05' },
    { eid: '49887', title: 'OpenSSH 8.4p1 - User Enumeration', type: 'remote', platform: 'linux', date: '2023-09-12' },
    { eid: '49500', title: 'sudo 1.8.31 - Privilege Escalation', type: 'local', platform: 'linux', date: '2023-07-28' },
  ].filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.platform.includes(query));
  if (results.length === 0) return { output: `searchsploit: No results found for '${query}'`, exitCode: 1 };
  const lines: string[] = [
    '----------------------------------------------------------------------------------------------',
    ' Exploit Title                                                                 |  E-ID  |  Type  ',
    '----------------------------------------------------------------------------------------------',
    ...results.map(r => ` ${r.title.padEnd(60)} | ${r.eid} | ${r.type.padEnd(6)}`),
    '----------------------------------------------------------------------------------------------',
    `Shellcodes: ${results.length} results`,
    `Papers: 0 results`,
  ];
  return { output: lines.join('\n'), exitCode: 0 };
};

export const enum4linux: CommandHandler = (args, state) => {
  const targets = args.filter(a => !a.startsWith('-'));
  if (targets.length === 0) return { output: '', error: 'enum4linux: missing target', exitCode: 1 };
  const target = targets[0];
  const lines: string[] = [
    `Starting enum4linux v0.9.1 (http://labs.portcullis.co.uk/application/enum4linux/)`,
    `Target: ${target}`,
    `=========================`,
    `|    Target Info    |`,
    `=========================`,
    `Target: ${target}`,
    `NetBIOS Domain: QYVORA-WORKGROUP`,
    `NetBIOS Computer Name: QYVORA-SRV-01`,
    `DNS Domain: qyvora.local`,
    `FQDN: srv01.qyvora.local`,
    ``,
    `=========================`,
    `|    Share Enumeration    |`,
    `=========================`,
    `Sharename       Type      Comment`,
    `---------       ----      -------`,
    `ADMIN$          Disk      Remote Admin`,
    `C$              Disk      Default share`,
    `IPC$            IPC       Remote IPC`,
    `backups         Disk      Weekly backups`,
    `shared          Disk      Team shared folder`,
    ``,
    `=========================`,
    `|    User Enumeration    |`,
    `=========================`,
    `User: administrator (Local, Admin)`,
    `User: guest (Local, Guest)`,
    `User: kali (Domain, User)`,
    `User: student (Domain, User)`,
    `User: backup_admin (Domain, Admin)`,
    ``,
    `enum4linux complete on ${target}`,
  ];
  return { output: lines.join('\n'), exitCode: 0, streamLines: lines };
};

export const smbclient: CommandHandler = (args, state) => {
  const targets = args.filter(a => !a.startsWith('-'));
  const listShares = args.includes('-L');
  if (listShares) {
    const host = targets[0] || 'localhost';
    return {
      output: `\n\tSharename       Type      Comment\n\t---------       ----      -------\n\tADMIN$          Disk      Remote Admin\n\tC$              Disk      Default share\n\tIPC$            IPC       Remote IPC\n\tbackups         Disk      Weekly backups\n\tshared          Disk      Team shared folder\n\n\tServer ${host} (QYVORA-SRV-01) was enumerated successfully.`,
      exitCode: 0,
    };
  }
  return { output: '', error: 'smbclient: usage: smbclient -L <host>', exitCode: 1 };
};

export const crackmapexec: CommandHandler = (args, state) => {
  const targets = args.filter(a => !a.startsWith('-'));
  if (targets.length === 0) return { output: '', error: 'crackmapexec: missing target', exitCode: 1 };
  const target = targets[0];
  const lines: string[] = [
    `CME         10.0.0.42:445 QYVORA-WORKGROUP   (name:SRV01) (domain:QYVORA)`,
    `SMB         10.0.0.42:445 QYVORA-WORKGROUP   [*] Windows 10 / Server 2019 Build 17763 x64 (name:SRV01) (domain:QYVORA)`,
    `SMB         10.0.0.42:445 QYVORA-WORKGROUP   [*] Trying 1 username(s) and 1 password(s)`,
    `SMB         10.0.0.42:445 QYVORA-WORKGROUP   [+] QYVORA\\administrator:admin123 (Pwn3d!)`,
  ];
  return { output: lines.join('\n'), exitCode: 0, streamLines: lines };
};

export const hashcat: CommandHandler = (args, state) => {
  const targets = args.filter(a => !a.startsWith('-'));
  if (targets.length === 0) return { output: '', error: 'hashcat: missing hash file', exitCode: 1 };
  const hashFile = targets[0];
  const modeIdx = args.indexOf('-m');
  const mode = modeIdx !== -1 ? args[modeIdx + 1] : '0';
  const lines: string[] = [
    `hashcat (v6.2.6) starting in benchmark mode`,
    '',
    `OpenCL API (OpenCL 3.0) - Platform #1 [Intel(R) Corporation]`,
    `* Device #1: Intel(R) Core(TM) i7-10750H, skipped`,
    `OpenCL API (OpenCL 2.0) - Platform #2 [NVIDIA Corporation]`,
    `* Device #2: NVIDIA GeForce RTX 3060, 4096/12288 MB allocatable, 8MCU`,
    '',
    `Hash mode: ${mode === '0' ? 'MD5' : mode === '1000' ? 'NTLM' : 'Unknown'}`,
    `Hashfile: ${hashFile}`,
    `Progress.....: 100%`,
    `Time left....: 0 sec`,
    `Candidates...: password123 -> admin2024!`,
    `Cracked......: 2/5 (40.00%)`,
    '',
    `Cracked hashes:`,
    `admin:password123`,
    `root:admin2024!`,
  ];
  return { output: lines.join('\n'), exitCode: 0, streamLines: lines };
};

export const exiftool: CommandHandler = (args, state) => {
  const filepath = args.filter(a => !a.startsWith('-'))[0];
  if (!filepath) return { output: '', error: 'exiftool: missing filename', exitCode: 1 };
  return {
    output: `ExifTool Version Number         : 12.76\nFile Name                       : ${filepath}\nDirectory                       : /home/kali\nFile Size                       : ${Math.floor(Math.random() * 500 + 50)} kB\nFile Modification Date/Time     : ${new Date().toISOString()}\nFile Permissions                : -rw-r--r--\nFile Type                       : JPEG\nFile Type Extension             : jpg\nMIME Type                       : image/jpeg\nImage Width                     : ${Math.floor(Math.random() * 2000 + 500)}\nImage Height                    : ${Math.floor(Math.random() * 2000 + 500)}\nEncoding Process                : Baseline DCT, Huffman coding\nBits Per Sample                 : 8\nColor Components                : 3\nY Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)\nGPS Latitude                    : ${(Math.random() * 180 - 90).toFixed(6)}\nGPS Longitude                   : ${(Math.random() * 360 - 180).toFixed(6)}\nGPS Position                    : ${(Math.random() * 180 - 90).toFixed(6)} ${(Math.random() * 360 - 180).toFixed(6)}`,
    exitCode: 0,
  };
};

export const binwalk: CommandHandler = (args, state) => {
  const filepath = args.filter(a => !a.startsWith('-'))[0];
  if (!filepath) return { output: '', error: 'binwalk: missing filename', exitCode: 1 };
  const lines: string[] = [
    `DECIMAL       HEXADECIMAL     DESCRIPTION`,
    `--------------------------------------------------------------------------------`,
    `0             0x0             uImage header, header size: 64 bytes, header CRC: 0x${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}, created: ${new Date().toISOString().split('T')[0]}`,
    `64            0x40            LZMA compressed data, properties: 0x5D, dictionary size: 8388608 bytes, uncompressed size: ${Math.floor(Math.random() * 5000000 + 1000000)} bytes`,
    `${Math.floor(Math.random() * 100000 + 50000)}  0x${Math.floor(Math.random() * 0xFFFF + 0x10000).toString(16)}  Squashfs filesystem, little endian, version 4.0, compression: gzip, size: ${Math.floor(Math.random() * 5000000 + 2000000)} bytes, ${Math.floor(Math.random() * 50 + 10)} inodes, blocksize: 131072 bytes, created: ${new Date().toISOString().split('T')[0]}`,
  ];
  return { output: lines.join('\n'), exitCode: 0, streamLines: lines };
};

export const msfconsole: CommandHandler = (args, state) => {
  const banner = [
    '                 _                                                    ',
    '    ___  ___ _ __| |___                                                ',
    '   / __|/ _ \\ \'__| / __|                                              ',
    '   \\__ \\  __/ |  | \\__ \\                                              ',
    '   |___/\\___|_|  |_|___/                                              ',
    '                                                                       ',
    '       =[ metasploit v6.4.0-dev                          ]',
    '+ -- --=[ 2389 exploits - 1234 auxiliary - 422 post       ]',
    '+ -- --=[ 984 payloads - 59 encoders - 10 nops            ]',
    '+ -- --=[ 9 evasion                                       ]',
    '',
    'Metasploit tip: Use sessions -1 to interact with the last session',
    '',
    'msf6 > ',
  ].join('\n');
  return { output: banner, exitCode: 0, stateOverride: { inMsfConsole: true } as any };
};
