const svg = (bg: string, border: string, lines: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><rect width="400" height="200" fill="${bg}"/><rect x="16" y="16" width="368" height="168" rx="8" fill="${bg.replace('0a', '1a')}" stroke="${border}" stroke-width="1"/><rect x="16" y="16" width="368" height="30" rx="8" fill="${bg.replace('0a', '2a')}"/><circle cx="34" cy="31" r="5" fill="#ff5f57"/><circle cx="50" cy="31" r="5" fill="#ffbd2e"/><circle cx="66" cy="31" r="5" fill="#28c840"/>${lines}</svg>`)}`;

const mono = (x: number, y: number, fill: string, size: number, text: string) =>
  `<text x="${x}" y="${y}" fill="${fill}" font-family="monospace" font-size="${size}">${text}</text>`;

const tspan = (fill: string, text: string) =>
  `<tspan fill="${fill}">${text}</tspan>`;

export const SCENARIO_DIAGRAMS: Record<string, string> = {
  // ── Privesc ──────────────────────────────────────────────────────────────
  'privesc-001': svg('#0a0e0a', '#FBBF24',
    mono(24, 68, '#FBBF24', 14, '$ find / -perm -4000') +
    mono(24, 92, '#888', 12, '/usr/bin/find') +
    mono(24, 112, '#888', 12, '/usr/bin/passwd') +
    mono(24, 142, '#4ade80', 14, '$ find /tmp -exec /bin/bash') +
    mono(24, 168, '#ffbd2e', 13, 'root@server:/# _') +
    `<rect x="24" y="156" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  'privesc-002': svg('#0a0e1a', '#FBBF24',
    mono(24, 68, '#FBBF24', 14, '$ sudo -l') +
    mono(24, 92, '#888', 12, '(root) NOPASSWD: /usr/bin/vim') +
    mono(24, 122, '#4ade80', 14, '$ sudo vim') +
    mono(24, 148, '#ffbd2e', 13, ':!cat /root/flag.txt') +
    mono(24, 172, '#ff5f57', 12, 'FLAG{sudo_vim_3sc4pe}') +
    `<rect x="24" y="136" width="8" height="14" fill="#ffbd2e" opacity="0.6"/>`
  ),

  'privesc-003': svg('#0a0e0a', '#FBBF24',
    mono(24, 68, '#FBBF24', 14, '$ cat /etc/crontab') +
    mono(24, 92, '#888', 12, '* * * * * root /opt/cleanup.sh') +
    mono(24, 122, '#4ade80', 14, '$ echo "#!/bin/bash" > /opt/cleanup.sh') +
    mono(24, 148, '#ffbd2e', 13, '$ sleep 65 && cat flag.txt') +
    mono(24, 172, '#ff5f57', 12, 'FLAG{cr0n_j0b_h1j4ck}') +
    `<rect x="24" y="136" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  'privesc-004': svg('#0a0e1a', '#FBBF24',
    mono(24, 68, '#FBBF24', 14, '$ ls -la /etc/passwd') +
    mono(24, 92, '#ff5f57', 12, '-rw-rw-rw- 1 root root') +
    mono(24, 122, '#4ade80', 14, '$ echo "pwned::0:0" >> /etc/passwd') +
    mono(24, 148, '#ffbd2e', 13, '$ su pwned') +
    mono(24, 172, '#ff5f57', 12, 'root@server:/# _') +
    `<rect x="24" y="136" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'privesc-005': svg('#0a0e0a', '#FBBF24',
    mono(24, 68, '#FBBF24', 14, '$ uname -a') +
    mono(24, 92, '#888', 12, 'Linux 3.13.0-24-generic') +
    mono(24, 118, '#ff5f57', 11, 'CVE-2015-1328') +
    mono(24, 148, '#4ade80', 14, '$ gcc exploit.c -o exploit') +
    mono(24, 172, '#ffbd2e', 13, 'root@server:/# _') +
    `<rect x="24" y="136" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  'privesc-006': svg('#0a0e1a', '#FBBF24',
    mono(24, 68, '#FBBF24', 14, '$ getcap -r / 2>/dev/null') +
    mono(24, 92, '#888', 12, '/usr/bin/python3.4 cap_setuid=ep') +
    mono(24, 122, '#4ade80', 14, '$ python3 -c "import os..."') +
    mono(24, 148, '#ffbd2e', 13, 'root@server:/# _') +
    `<rect x="24" y="136" width="8" height="14" fill="#ffbd2e" opacity="0.6"/>`
  ),

  'privesc-007': svg('#0a0e0a', '#FBBF24',
    mono(24, 68, '#FBBF24', 14, '$ cat /usr/local/bin/backup.sh') +
    mono(24, 92, '#888', 12, 'backup --compress') +
    mono(24, 122, '#4ade80', 14, '$ export PATH=/home/dev/bin:$PATH') +
    mono(24, 148, '#ffbd2e', 13, '$ /usr/local/bin/backup.sh') +
    mono(24, 172, '#ff5f57', 12, 'FLAG{p4th_h1j4ck}') +
    `<rect x="24" y="136" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  'privesc-008': svg('#0a0e1a', '#FBBF24',
    mono(24, 68, '#FBBF24', 14, '$ id') +
    mono(24, 92, '#888', 12, 'groups=docker,1000(trainee)') +
    mono(24, 122, '#4ade80', 14, '$ docker run -v /:/mnt ...') +
    mono(24, 148, '#ffbd2e', 13, 'root@container:/# _') +
    `<rect x="24" y="136" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  'privesc-009': svg('#0a0e0a', '#FBBF24',
    mono(24, 68, '#FBBF24', 14, '$ cat /etc/exports') +
    mono(24, 92, '#ff5f57', 12, '/srv/nfs/data * (no_root_squash)') +
    mono(24, 122, '#4ade80', 14, '$ gcc exploit.c -o /srv/nfs/data/rootsh') +
    mono(24, 148, '#ffbd2e', 13, '$ ./rootsh && cat /root/flag.txt') +
    mono(24, 172, '#ff5f57', 12, 'FLAG{nfs_n0_r00t_squash}') +
    `<rect x="24" y="136" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'privesc-010': svg('#0a0e1a', '#FBBF24',
    mono(24, 68, '#FBBF24', 14, '$ ls -la /tmp/shared/') +
    mono(24, 92, '#ff5f57', 12, 'drwxrwxrwx (NO sticky bit)') +
    mono(24, 122, '#4ade80', 14, '$ ln -s /root/flag.txt scratch.txt') +
    mono(24, 148, '#ffbd2e', 13, '$ cat /var/log/scratch.log') +
    mono(24, 172, '#ff5f57', 12, 'FLAG{st1cky_b1t_r4ce}') +
    `<rect x="24" y="136" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  // ── Password ─────────────────────────────────────────────────────────────
  'pwd-crack-md5-simple': svg('#0a0e1a', '#F59E0B',
    mono(24, 68, '#F59E0B', 14, '$ hashcat -m 0 hash.txt rockyou.txt') +
    mono(24, 96, '#888', 12, '5f4dcc3b5aa765d61d83...') +
    mono(24, 122, '#ff5f57', 12, 'STATUS: Cracked') +
    mono(24, 152, '#4ade80', 14, '5f4dcc3b5aa765d6:password') +
    `<rect x="24" y="140" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  'pwd-crack-sha256-common': svg('#0a0e0a', '#F59E0B',
    mono(24, 68, '#F59E0B', 14, '$ hashcat -m 1400 hash.txt rockyou.txt') +
    mono(24, 96, '#888', 12, '5e884898da28047151d0...') +
    mono(24, 122, '#ff5f57', 12, 'TYPE: SHA-256') +
    mono(24, 152, '#4ade80', 14, 'RESULT: password') +
    `<rect x="24" y="140" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  'pwd-crack-bcrypt': svg('#0a0e1a', '#F59E0B',
    mono(24, 68, '#F59E0B', 14, '$ hashcat -m 3200 bcrypt.txt rockyou.txt') +
    mono(24, 96, '#888', 12, '$2y$10$ZxR3kL5mN7oP...') +
    mono(24, 122, '#ff5f57', 12, 'TYPE: bcrypt (slow)') +
    mono(24, 152, '#4ade80', 14, 'RESULT: s3cur3P@ss') +
    `<rect x="24" y="140" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  'pwd-crack-ntlm-windows': svg('#0a0e0a', '#F59E0B',
    mono(24, 68, '#F59E0B', 14, '$ hashcat -m 1000 ntlm.txt rockyou.txt') +
    mono(24, 96, '#888', 12, '8846f7eaee8fb117ad06...') +
    mono(24, 122, '#ff5f57', 12, 'TYPE: NTLM (Windows)') +
    mono(24, 152, '#4ade80', 14, 'RESULT: password123') +
    `<rect x="24" y="140" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  'pwd-crack-shadow-extract': svg('#0a0e1a', '#F59E0B',
    mono(24, 68, '#F59E0B', 14, '$ unshadow passwd shadow > unshadowed.txt') +
    mono(24, 96, '#888', 12, '$ john --wordlist=rockyou.txt unshadowed.txt') +
    mono(24, 122, '#ff5f57', 12, 'Multiple hash types (SHA-512/bcrypt)') +
    mono(24, 152, '#4ade80', 14, 'appuser:sunshine admin:summer') +
    `<rect x="24" y="140" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  'pwd-crack-multi-hash': svg('#0a0e0a', '#F59E0B',
    mono(24, 68, '#F59E0B', 14, '$ hashcat --show multi_hashes.txt') +
    mono(24, 96, '#888', 11, 'MD5 / SHA-1 / SHA-256 / SHA-512') +
    mono(24, 122, '#ff5f57', 12, '4 hash types detected') +
    mono(24, 152, '#4ade80', 14, 'password, letmein, qwerty...') +
    `<rect x="24" y="140" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  // ── Web Exploitation ─────────────────────────────────────────────────────
  'vuln-001': svg('#0a0e0a', '#EF4444',
    mono(24, 68, '#EF4444', 14, "username: ' OR 1=1 --") +
    mono(24, 96, '#888', 12, 'SELECT * FROM users WHERE...') +
    mono(24, 122, '#ff5f57', 12, 'SQL Injection Login Bypass') +
    mono(24, 152, '#4ade80', 14, '=> Logged in as admin') +
    `<rect x="24" y="140" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  'vuln-002': svg('#0a0e1a', '#EF4444',
    mono(24, 68, '#EF4444', 14, 'GET /profile?user_id=2') +
    mono(24, 96, '#888', 12, '=> Displayed user: john.smith') +
    mono(24, 122, '#ff5f57', 12, 'IDOR — No auth check') +
    mono(24, 152, '#4ade80', 14, 'GET /profile?user_id=0 => admin') +
    `<rect x="24" y="140" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'vuln-003': svg('#0a0e0a', '#EF4444',
    mono(24, 68, '#EF4444', 14, 'GET /api/files/download?path=../../../etc/passwd') +
    mono(24, 96, '#888', 12, 'root:x:0:0:root:/root:/bin/bash') +
    mono(24, 122, '#ff5f57', 12, 'Path Traversal — /etc/passwd leaked') +
    `<rect x="24" y="112" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'vuln-004': svg('#0a0e1a', '#EF4444',
    mono(24, 68, '#EF4444', 14, 'GET /api/users/0') +
    mono(24, 96, '#888', 12, '{"id":0,"role":"admin","email":...}') +
    mono(24, 122, '#ff5f57', 12, 'IDOR — No permission check') +
    mono(24, 152, '#4ade80', 14, 'All user data exposed') +
    `<rect x="24" y="140" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'vuln-005': svg('#0a0e0a', '#EF4444',
    mono(24, 68, '#EF4444', 14, 'host: 127.0.0.1; cat /etc/passwd') +
    mono(24, 96, '#888', 12, 'root:x:0:0:root:/root:/bin/bash') +
    mono(24, 122, '#ff5f57', 12, 'Command Injection — RCE achieved') +
    `<rect x="24" y="112" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'vuln-006': svg('#0a0e1a', '#EF4444',
    mono(24, 68, '#EF4444', 14, '$ jwt_tool token.txt -C -d dict.txt') +
    mono(24, 96, '#888', 12, 'Secret found: 8 chars') +
    mono(24, 122, '#ff5f57', 12, '{"user":"admin","role":"admin"}') +
    mono(24, 152, '#4ade80', 14, 'JWT Forged — Admin access') +
    `<rect x="24" y="140" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  'vuln-007': svg('#0a0e0a', '#EF4444',
    mono(24, 68, '#EF4444', 14, 'GET /search?q=<script>alert(1)</script>') +
    mono(24, 96, '#ff5f57', 12, 'XSS Payload Executed!') +
    mono(24, 122, '#888', 12, 'document.cookie stolen...') +
    `<rect x="24" y="112" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'vuln-008': svg('#0a0e1a', '#EF4444',
    mono(24, 68, '#EF4444', 14, '<form action="/profile/change-password">') +
    mono(24, 96, '#888', 12, 'No CSRF token in form') +
    mono(24, 122, '#ff5f57', 12, 'CSRF — Auto-submit attack') +
    `<rect x="24" y="112" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'vuln-010': svg('#0a0e0a', '#EF4444',
    mono(24, 68, '#EF4444', 14, '<!-- base64: U0VDUkVUX1RPS0VOX0FCQ0RFRkc= -->') +
    mono(24, 96, '#888', 12, '$ echo "..." | base64 -d') +
    mono(24, 122, '#4ade80', 14, 'SECRET_TOKEN_ABCDEFG') +
    `<rect x="24" y="112" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  // ── SQL Injection ────────────────────────────────────────────────────────
  'sqli-union-1': svg('#0a0e0a', '#06B66F',
    mono(24, 68, '#06B66F', 14, "$ sqlmap -u 'login' --dbs") +
    mono(24, 96, '#888', 12, 'available databases [3]:') +
    mono(24, 116, '#888', 12, '[*] information_schema') +
    mono(24, 136, '#888', 12, '[*] novacorp') +
    mono(24, 162, '#4ade80', 14, '$ sqlmap ... -T users --dump') +
    `<rect x="24" y="150" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  'sqli-blind-1': svg('#0a0e1a', '#06B66F',
    mono(24, 68, '#06B66F', 14, "GET /api/search?id=1 AND 1=1") +
    mono(24, 96, '#4ade80', 12, '=> {"found":true}') +
    mono(24, 122, '#ff5f57', 12, "GET /api/search?id=1 AND 1=2") +
    mono(24, 148, '#ff5f57', 12, '=> {"found":false}') +
    mono(24, 172, '#888', 12, 'Boolean-Based Blind confirmed') +
    `<rect x="24" y="160" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'sqli-time-1': svg('#0a0e0a', '#06B66F',
    mono(24, 68, '#06B66F', 14, "GET /api/user?user=admin' AND SLEEP(5)") +
    mono(24, 96, '#888', 12, 'real    0m5.041s') +
    mono(24, 122, '#ff5f57', 12, 'Time-Based Blind — 5s delay') +
    mono(24, 152, '#4ade80', 14, 'Data extracted character by character') +
    `<rect x="24" y="140" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'sqli-error-1': svg('#0a0e1a', '#06B66F',
    mono(24, 68, '#06B66F', 14, "GET /products?category=camera'") +
    mono(24, 96, '#ff5f57', 12, '{"error":"SQL syntax near..."}') +
    mono(24, 122, '#888', 12, 'Error-Based — DB error leaked') +
    mono(24, 152, '#4ade80', 14, '$ sqlmap ... -T secrets --dump') +
    `<rect x="24" y="140" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  'sqli-second-1': svg('#0a0e0a', '#06B66F',
    mono(24, 68, '#06B66F', 14, "POST /register username=admin'--") +
    mono(24, 96, '#888', 12, 'Payload stored in database') +
    mono(24, 122, '#ff5f57', 12, "POST /login username=admin'--") +
    mono(24, 152, '#4ade80', 14, '=> Logged in as admin!') +
    `<rect x="24" y="140" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  'sqli-stacked-1': svg('#0a0e1a', '#06B66F',
    mono(24, 68, '#06B66F', 14, "GET /api/order?id=1;INSERT INTO...") +
    mono(24, 96, '#888', 12, '{"success":true}') +
    mono(24, 122, '#ff5f57', 12, 'Stacked Query — Row injected') +
    mono(24, 152, '#4ade80', 14, 'GET /api/order?id=2 => hacked') +
    `<rect x="24" y="140" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  // ── Phishing ─────────────────────────────────────────────────────────────
  'phishing-credential-harvest': svg('#0a0e1a', '#8B5CF6',
    mono(24, 68, '#8B5CF6', 14, 'From: security@paypa1.com') +
    mono(24, 92, '#ff5f57', 12, '⚠ paypa1.com (L→1)') +
    mono(24, 122, '#888', 12, 'Link: account-support.xyz/verify') +
    mono(24, 152, '#ff5f57', 12, 'SPF: softfail | DKIM: fail') +
    `<rect x="24" y="140" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'phishing-ceo-fraud': svg('#0a0e0a', '#8B5CF6',
    mono(24, 68, '#8B5CF6', 14, 'From: james.richardson-ceo@qyvora.com') +
    mono(24, 92, '#ff5f57', 12, 'Reply-To: outlook.com (MISMATCH)') +
    mono(24, 122, '#888', 12, 'Wire transfer: $47,500') +
    mono(24, 152, '#ff5f57', 12, 'SPF/DKIM/DMARC all FAIL') +
    `<rect x="24" y="140" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'phishing-tech-support': svg('#0a0e1a', '#8B5CF6',
    mono(24, 68, '#8B5CF6', 14, 'From: it-helpdesk@qyv0ra-support.com') +
    mono(24, 92, '#ff5f57', 12, '⚠ qyv0ra (O→0) lookalike') +
    mono(24, 122, '#888', 12, 'Link: it-reset.qyv0ra-portal.com') +
    mono(24, 152, '#ff5f57', 12, 'SPF: fail | DKIM: none') +
    `<rect x="24" y="140" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'phishing-spear-phishing': svg('#0a0e0a', '#8B5CF6',
    mono(24, 68, '#8B5CF6', 14, 'From: sarah.chen@qyvora.com') +
    mono(24, 92, '#ff5f57', 12, 'X-Compromised-Account: TRUE') +
    mono(24, 122, '#888', 12, 'Attachment: Q3_Report.xlsm (macro)') +
    mono(24, 152, '#ff5f57', 12, 'SPF/DKIM/DMARC all PASS') +
    `<rect x="24" y="140" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'phishing-qr-code': svg('#0a0e1a', '#8B5CF6',
    mono(24, 68, '#8B5CF6', 14, 'From: hr-benefits@qyvora-hr.com') +
    mono(24, 92, '#ff5f57', 12, '⚠ QR → benefits-enrollment.qyv0ra-hr.com') +
    mono(24, 122, '#888', 12, 'SPF: softfail | DKIM: fail') +
    mono(24, 152, '#ff5f57', 12, 'Credential harvesting via QR code') +
    `<rect x="24" y="140" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  // ── Proxy ────────────────────────────────────────────────────────────────
  'proxy-intercept-1': svg('#0a0e0a', '#10B981',
    mono(24, 68, '#10B981', 14, 'POST /api/login') +
    mono(24, 92, '#ff5f57', 12, 'username=admin&password=Sup3rS3cret!') +
    mono(24, 122, '#888', 12, 'Cleartext credentials in POST body') +
    mono(24, 152, '#4ade80', 14, '=> Intercepted & captured') +
    `<rect x="24" y="140" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'proxy-tamper-1': svg('#0a0e1a', '#10B981',
    mono(24, 68, '#10B981', 14, 'POST /api/order') +
    mono(24, 92, '#888', 12, 'product_id=1&price=29999') +
    mono(24, 118, '#ff5f57', 12, 'Tamper: price=0') +
    mono(24, 148, '#4ade80', 14, '=> Order confirmed: $0.00') +
    `<rect x="24" y="136" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'proxy-session-1': svg('#0a0e0a', '#10B981',
    mono(24, 68, '#10B981', 14, 'JWT: eyJ1c2VyIjoiYWRtaW4ifQ') +
    mono(24, 92, '#888', 12, 'Base64: {"user":"admin"}') +
    mono(24, 122, '#ff5f57', 12, 'No signature verification') +
    mono(24, 152, '#4ade80', 14, '=> Session hijacked') +
    `<rect x="24" y="140" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  // ── Traffic ──────────────────────────────────────────────────────────────
  'pcap-password-1': svg('#0a0e1a', '#84CC16',
    mono(24, 68, '#84CC16', 14, 'HTTP POST /api/login') +
    mono(24, 92, '#ff5f57', 12, 'username=admin&password=Sup3rS3cret!') +
    mono(24, 122, '#888', 12, 'Protocol: HTTP (cleartext)') +
    mono(24, 152, '#ff5f57', 12, 'Credentials exposed on wire') +
    `<rect x="24" y="140" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'pcap-dns-1': svg('#0a0e0a', '#84CC16',
    mono(24, 68, '#84CC16', 14, 'DNS: aGVsbG8gd29ybGQ.evil-domain.com') +
    mono(24, 96, '#888', 12, 'Base64 subdomain (128 bytes)') +
    mono(24, 122, '#ff5f57', 12, 'DNS Tunneling — Data exfil') +
    mono(24, 152, '#4ade80', 14, 'Decode: "hello world"') +
    `<rect x="24" y="140" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'pcap-arp-1': svg('#0a0e1a', '#84CC16',
    mono(24, 68, '#84CC16', 14, 'ARP: 10.0.0.1 is at aa:bb:cc:dd:ee:ff') +
    mono(24, 96, '#ff5f57', 12, 'Gratuitous ARP (flooding)') +
    mono(24, 122, '#888', 12, 'Response → wrong MAC address') +
    mono(24, 152, '#ff5f57', 12, 'ARP Spoofing — MitM active') +
    `<rect x="24" y="140" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'pcap-c2-1': svg('#0a0e0a', '#84CC16',
    mono(24, 68, '#84CC16', 14, 'GET /api/check?id=desktop01') +
    mono(24, 96, '#888', 12, 'Interval: 60s (regular beacon)') +
    mono(24, 122, '#ff5f57', 12, 'POST /api/report (data exfil)') +
    mono(24, 152, '#888', 12, 'C2: 185.234.72.10') +
    `<rect x="24" y="140" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  // ── OSINT ────────────────────────────────────────────────────────────────
  'osint-email-1': svg('#0a0e1a', '#0EA5E9',
    mono(24, 68, '#0EA5E9', 14, '$ theHarvester -d novacorp.io -b all') +
    mono(24, 96, '#888', 12, 'Emails: admin@novacorp.io') +
    mono(24, 116, '#888', 12, '        fatima.okafor@novacorp.io') +
    mono(24, 142, '#4ade80', 12, 'Hosts: mail.novacorp.io') +
    mono(24, 162, '#4ade80', 12, '       api.novacorp.io') +
    `<rect x="24" y="150" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  'osint-social-1': svg('#0a0e0a', '#0EA5E9',
    mono(24, 68, '#0EA5E9', 14, '$ sherlock fatimaokafor') +
    mono(24, 96, '#888', 12, '[+] GitHub: fatimaokafor') +
    mono(24, 116, '#888', 12, '[+] Twitter: @fatimaokafor') +
    mono(24, 142, '#ff5f57', 12, 'GPS: 6.5244, 3.3792 (Lagos)') +
    mono(24, 162, '#4ade80', 12, 'Accounts found: 5') +
    `<rect x="24" y="150" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  'osint-subdomain-1': svg('#0a0e1a', '#0EA5E9',
    mono(24, 68, '#0EA5E9', 14, '$ subfinder -d novacorp.io -silent') +
    mono(24, 96, '#888', 11, 'api.novacorp.io') +
    mono(24, 112, '#888', 11, 'dev.novacorp.io') +
    mono(24, 128, '#888', 11, 'grafana.novacorp.io') +
    mono(24, 144, '#888', 11, 'staging.novacorp.io') +
    mono(24, 168, '#4ade80', 14, 'Subdomains: 8 discovered') +
    `<rect x="24" y="156" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  'osint-breach-1': svg('#0a0e0a', '#0EA5E9',
    mono(24, 68, '#0EA5E9', 14, '$ curl breachcheck.io/novacorp.io') +
    mono(24, 96, '#ff5f57', 12, '"breaches": 3, "records": 847') +
    mono(24, 122, '#888', 12, 'LinkedIn2023, Adobe2024, Leak') +
    mono(24, 152, '#ff5f57', 12, 'Leaked: admin2024, Fatima2024!') +
    `<rect x="24" y="140" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'osint-full-1': svg('#0a0e1a', '#0EA5E9',
    mono(24, 68, '#0EA5E9', 14, '=== RECON SUMMARY ===') +
    mono(24, 92, '#888', 12, 'Domain: novacorp.io') +
    mono(24, 112, '#888', 12, 'Emails: 4 | Subdomains: 8') +
    mono(24, 132, '#888', 12, 'Social: 3 | Services: 4') +
    mono(24, 160, '#4ade80', 14, 'Entry: grafana.novacorp.io:8080') +
    `<rect x="24" y="148" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  // ── Wireless ─────────────────────────────────────────────────────────────
  'wifi-wpa2-1': svg('#0a0e0a', '#F59E0B',
    mono(24, 68, '#F59E0B', 14, '$ aircrack-ng capture.cap') +
    mono(24, 96, '#888', 12, 'Network: NovaCorp-WiFi') +
    mono(24, 122, '#ff5f57', 12, 'WPA2-PSK handshake captured') +
    mono(24, 152, '#4ade80', 14, 'KEY FOUND: N0vaC0rp!2024') +
    `<rect x="24" y="140" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  'wifi-evil-1': svg('#0a0e1a', '#F59E0B',
    mono(24, 68, '#F59E0B', 14, '$ airodump-ng wlan0mon') +
    mono(24, 96, '#888', 11, '00:1A:2B:3C:4D:5E  NovaCorp-WiFi') +
    mono(24, 116, '#ff5f57', 11, '00:DE:AD:BE:EF:01  NovaCorp-WiFi') +
    mono(24, 142, '#ff5f57', 12, '⚠ Two APs, same SSID — evil twin') +
    mono(24, 162, '#4ade80', 12, 'Rogue: stronger signal (-30)') +
    `<rect x="24" y="150" width="8" height="14" fill="#ff5f57" opacity="0.6"/>`
  ),

  'wifi-wep-1': svg('#0a0e0a', '#F59E0B',
    mono(24, 68, '#F59E0B', 14, '$ aircrack-ng wep_capture.cap') +
    mono(24, 96, '#888', 12, 'Network: LegacyNet-WEP') +
    mono(24, 122, '#ff5f57', 12, 'WEP — fundamentally insecure') +
    mono(24, 152, '#4ade80', 14, 'KEY FOUND: 4A:3B:2C:1D:0E') +
    `<rect x="24" y="140" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  // ── Kill Chain ───────────────────────────────────────────────────────────
  'kc-internal-1': svg('#0a0e1a', '#DC2626',
    mono(24, 68, '#DC2626', 14, 'PHASES: Recon → Enum → Exploit') +
    mono(24, 96, '#888', 12, 'nmap -sn 10.0.0.0/24 → 8 hosts') +
    mono(24, 116, '#888', 12, 'hydra -l admin -P rockyou.txt') +
    mono(24, 142, '#ff5f57', 12, 'SUID find → root shell') +
    mono(24, 168, '#4ade80', 14, 'FLAG{kc_internal_full_chain}') +
    `<rect x="24" y="156" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),

  'kc-web-1': svg('#0a0e0a', '#DC2626',
    mono(24, 68, '#DC2626', 14, 'PHASES: Recon → SQLi → SSH') +
    mono(24, 96, '#888', 12, 'sqlmap → MySQL dumped') +
    mono(24, 116, '#888', 12, 'john → cracked hashes') +
    mono(24, 142, '#ff5f57', 12, 'ssh admin@target → shell') +
    mono(24, 168, '#4ade80', 14, 'FLAG{kc_web_full_chain}') +
    `<rect x="24" y="156" width="8" height="14" fill="#4ade80" opacity="0.6"/>`
  ),
};
