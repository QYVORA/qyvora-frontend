export interface OsintStep {
  tool: string;
  command: string;
  output: string;
  explanation: string;
}

export interface OsintChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetName: string;
  targetDescription: string;
  steps: OsintStep[];
  flag: string;
  cpReward: number;
  skills: string[];
}

export const OSINT_CHALLENGES: OsintChallenge[] = [
  {
    id: 'osint-email-1',
    title: 'Email Harvesting',
    description: 'Find employee email addresses for NovaCorp using OSINT techniques.',
    difficulty: 'beginner',
    targetName: 'NovaCorp',
    targetDescription: 'A cybersecurity firm based in Lagos, Nigeria. They have a public website at novacorp.io.',
    steps: [
      {
        tool: 'whois',
        command: 'whois novacorp.io',
        output: `Domain Name: novacorp.io\nRegistry Domain ID: D503300000040939373-LRMS\nRegistrar WHOIS Server: whois.namecheap.com\nRegistrar: NameCheap, Inc.\nUpdated Date: 2024-01-15T08:30:00Z\nCreation Date: 2022-06-10T14:22:00Z\nRegistry Expiry Date: 2025-06-10T14:22:00Z\nName Server: ns1.digitalocean.com\nName Server: ns2.digitalocean.com\nDNSSEC: unsigned\nRegistrant Email: admin@novacorp.io`,
        explanation: 'WHOIS reveals the registrant email admin@novacorp.io and confirms the domain exists.',
      },
      {
        tool: 'dig',
        command: 'dig novacorp.io MX',
        output: `;; ANSWER SECTION:\nnovacorp.io.          3600    IN      MX      10 mail.novacorp.io.\nnovacorp.io.          3600    IN      MX      20 mail2.novacorp.io.`,
        explanation: 'MX records reveal the mail server hostnames.',
      },
      {
        tool: 'dig',
        command: 'dig novacorp.io TXT',
        output: `;; ANSWER SECTION:\nnovacorp.io.          3600    IN      TXT     "v=spf1 mx a ip4:102.89.23.0/24 include:_spf.google.com ~all"\nnovacorp.io.          3600    IN      TXT     "google-site-verification=abc123def456"`,
        explanation: 'TXT records show SPF configuration and Google verification.',
      },
      {
        tool: 'theHarvester',
        command: 'theHarvester -d novacorp.io -b all',
        output: `[*] Searching in Google...\n[*] Searching in Bing...\n[*] Searching in DuckDuckGo...\n\n[*] Emails found:\n---------------------\nadmin@novacorp.io\ninfo@novacorp.io\njames.adu@novacorp.io\nfatima.okafor@novacorp.io\nsupport@novacorp.io\nhr@novacorp.io\n\n[*] Hosts found:\n---------------------\nmail.novacorp.io:102.89.23.15\nwww.novacorp.io:102.89.23.10\napi.novacorp.io:102.89.23.20\nvpn.novacorp.io:102.89.23.25`,
        explanation: 'theHarvester finds email addresses and subdomains from multiple sources.',
      },
      {
        tool: 'grep',
        command: 'grep -r "novacorp" /usr/share/wordlists/emails.txt 2>/dev/null || echo "Checking email patterns..."',
        output: `Checking email patterns...\nCommon patterns at novacorp.io:\nfirstname.lastname@novacorp.io\nfirstlast@novacorp.io\nfirst@novacorp.io`,
        explanation: 'Email format patterns help find additional addresses.',
      },
    ],
    flag: 'FLAG{osint_email_harvest_complete}',
    cpReward: 150,
    skills: ['WHOIS lookup', 'DNS enumeration', 'Email harvesting', 'theHarvester'],
  },
  {
    id: 'osint-social-1',
    title: 'Social Media Recon',
    description: 'Build a profile of NovaCorp employees using social media and code hosting platforms.',
    difficulty: 'intermediate',
    targetName: 'Fatima Okafor',
    targetDescription: 'A developer at NovaCorp. Find her social media profiles and public repositories.',
    steps: [
      {
        tool: 'sherlock',
        command: 'sherlock fatimaokafor',
        output: `[+] Twitter: https://twitter.com/fatimaokafor\n[+] GitHub: https://github.com/fatimaokafor\n[+] LinkedIn: https://linkedin.com/in/fatima-okafor\n[+] Instagram: https://instagram.com/fatimaokafor\n[+] Medium: https://medium.com/@fatimaokafor\n\n[!] Accounts found: 5`,
        explanation: 'sherlock searches username across 300+ platforms.',
      },
      {
        tool: 'github-dork',
        command: 'curl -s "https://api.github.com/search/code?q=novacorp+user:fatimaokafor" | jq .items[].html_url',
        output: `"https://github.com/fatimaokafor/novacorp-tools/blob/main/scanner.py"\n"https://github.com/fatimaokafor/novacorp-tools/blob/main/config.example.yml"`,
        explanation: 'GitHub code search finds repositories mentioning NovaCorp.',
      },
      {
        tool: 'curl',
        command: 'curl -s https://api.github.com/users/fatimaokafor/repos | jq ".[].name"',
        output: `"novacorp-tools"\n"security-scripts"\n"ctf-writeups"\n"personal-blog"\n"dotfiles"`,
        explanation: 'Public repositories reveal tools and interests.',
      },
      {
        tool: 'exiftool',
        command: 'curl -sL https://pbs.twimg.com/profile_images/fatima.jpg -o avatar.jpg && exiftool avatar.jpg',
        output: `File Name                       : avatar.jpg\nFile Size                       : 45 kB\nGPS Latitude                    : 6.5244\nGPS Longitude                   : 3.3792\nGPS Position                    : 6.5244 3.3792\nCamera Make                     : Apple\nCamera Model                    : iPhone 15 Pro`,
        explanation: 'Profile photo contains GPS coordinates (Lagos, Nigeria) and device info.',
      },
    ],
    flag: 'FLAG{osint_social_profile_built}',
    cpReward: 250,
    skills: ['Username enumeration', 'GitHub dorking', 'Metadata extraction', 'Social media analysis'],
  },
  {
    id: 'osint-subdomain-1',
    title: 'Subdomain Enumeration',
    description: 'Discover all subdomains of novacorp.io to map the attack surface.',
    difficulty: 'intermediate',
    targetName: 'novacorp.io',
    targetDescription: 'The main corporate domain. Find all accessible subdomains.',
    steps: [
      {
        tool: 'subfinder',
        command: 'subfinder -d novacorp.io -silent',
        output: `api.novacorp.io\nblog.novacorp.io\ncdn.novacorp.io\ndev.novacorp.io\nmail.novacorp.io\nstaging.novacorp.io\nvpn.novacorp.io\nwww.novacorp.io`,
        explanation: 'subfinder finds subdomains from multiple sources.',
      },
      {
        tool: 'amass',
        command: 'amass enum -passive -d novacorp.io 2>/dev/null | head -20',
        output: `admin.novacorp.io\napi.novacorp.io\nblog.novacorp.io\ncdn.novacorp.io\ndev.novacorp.io\ngit.novacorp.io\ngrafana.novacorp.io\njenkins.novacorp.io\nmail.novacorp.io\nmonitoring.novacorp.io\nstaging.novacorp.io\nvpn.novacorp.io\nwww.novacorp.io`,
        explanation: 'amass discovers additional subdomains including internal tools.',
      },
      {
        tool: 'dig',
        command: 'for sub in api dev staging admin grafana jenkins; do echo "$sub.novacorp.io: $(dig +short $sub.novacorp.io | head -1)"; done',
        output: `api.novacorp.io: 102.89.23.20\ndev.novacorp.io: 102.89.23.30\nstaging.novacorp.io: 102.89.23.35\nadmin.novacorp.io: 102.89.23.40\ngrafana.novacorp.io: 102.89.23.45\njenkins.novacorp.io: 102.89.23.50`,
        explanation: 'DNS resolution confirms which subdomains are active.',
      },
      {
        tool: 'nmap',
        command: 'nmap -sV -p 80,443,8080,8443 api.novacorp.io dev.novacorp.io admin.novacorp.io',
        output: `PORT     STATE SERVICE  VERSION\n80/tcp   open  http     nginx 1.24.0\n443/tcp  open  ssl/http nginx 1.24.0\n\nPORT     STATE SERVICE  VERSION\n80/tcp   open  http     Node.js Express\n3000/tcp open  http     Node.js Express\n\nPORT     STATE SERVICE  VERSION\n443/tcp  open  ssl/http nginx 1.24.0\n8080/tcp open  http     Grafana 10.2.2`,
        explanation: 'Port scanning reveals services running on each subdomain.',
      },
    ],
    flag: 'FLAG{osint_subdomain_surface_mapped}',
    cpReward: 250,
    skills: ['Subdomain enumeration', 'DNS brute-forcing', 'Service detection', 'Attack surface mapping'],
  },
  {
    id: 'osint-breach-1',
    title: 'Data Breach Check',
    description: 'Check if NovaCorp employee credentials have been exposed in data breaches.',
    difficulty: 'beginner',
    targetName: 'NovaCorp',
    targetDescription: 'Check if any NovaCorp email addresses appear in known data breaches.',
    steps: [
      {
        tool: 'breach-check',
        command: 'curl -s "https://api.breachcheck.io/v1/novacorp.io" -H "Authorization: Bearer test-key"',
        output: `{\n  "domain": "novacorp.io",\n  "breaches": 3,\n  "total_records": 847,\n  "breach_details": [\n    {"name": "LinkedIn2023", "date": "2023-08-15", "records": 450, "types": ["email","password","name"]},\n    {"name": "Adobe2024", "date": "2024-01-20", "records": 280, "types": ["email","password"]},\n    {"name": "NovaCorp-Leak", "date": "2024-03-10", "records": 117, "types": ["email","password","role","api_key"]}\n  ]\n}`,
        explanation: 'The breach check reveals NovaCorp has appeared in 3 breaches, including an internal leak.',
      },
      {
        tool: 'grep',
        command: 'grep -i "novacorp" /usr/share/wordlists/breaches.txt 2>/dev/null | head -10',
        output: `james.adu@novacorp.io:password123\nfatima.okafor@novacorp.io:Fatima2024!\nsupport@novacorp.io:support123\nadmin@novacorp.io:admin2024`,
        explanation: 'Leaked credentials found in breach compilation.',
      },
      {
        tool: 'analysis',
        command: 'echo "Analyzing breach patterns..." && echo "Common password patterns:" && echo "  - CompanyName + Year: novacorp2024" && echo "  - Name + Year: fatima2024" && echo "  - Simple substitutions: p@ssw0rd"',
        output: `Analyzing breach patterns...\nCommon password patterns:\n  - CompanyName + Year: novacorp2024\n  - Name + Year: fatima2024\n  - Simple substitutions: p@ssw0rd`,
        explanation: 'Pattern analysis helps predict other employee passwords.',
      },
    ],
    flag: 'FLAG{osint_breach_analysis_complete}',
    cpReward: 150,
    skills: ['Breach database checking', 'Credential analysis', 'Pattern recognition'],
  },
  {
    id: 'osint-full-1',
    title: 'Full Recon Mission',
    description: 'Complete reconnaissance of NovaCorp combining all OSINT techniques to build a comprehensive target profile.',
    difficulty: 'advanced',
    targetName: 'NovaCorp',
    targetDescription: 'Conduct full reconnaissance including DNS, social, subdomain, and breach analysis.',
    steps: [
      {
        tool: 'whois',
        command: 'whois novacorp.io',
        output: `Domain Name: novacorp.io\nRegistrar: NameCheap, Inc.\nRegistrant Email: admin@novacorp.io\nName Server: ns1.digitalocean.com\nCreation Date: 2022-06-10`,
        explanation: 'Phase 1: Domain registration info.',
      },
      {
        tool: 'dig',
        command: 'dig novacorp.io ANY +short',
        output: `102.89.23.10\nmail.novacorp.io.\nns1.digitalocean.com.\nns2.digitalocean.com.`,
        explanation: 'Phase 2: DNS records enumeration.',
      },
      {
        tool: 'theHarvester',
        command: 'theHarvester -d novacorp.io -b all',
        output: `Emails found: admin@novacorp.io, jdoe@novacorp.io, fatima.okafor@novacorp.io, support@novacorp.io\nHosts: www.novacorp.io, mail.novacorp.io, api.novacorp.io, vpn.novacorp.io`,
        explanation: 'Phase 3: Email and subdomain harvesting.',
      },
      {
        tool: 'sherlock',
        command: 'sherlock jdoe --timeout 10',
        output: `[+] GitHub: https://github.com/jdoe-novacorp\n[+] Twitter: https://twitter.com/jdoe_sec\n[+] LinkedIn: https://linkedin.com/in/john-doe-novacorp`,
        explanation: 'Phase 4: Social media profiling of key employee.',
      },
      {
        tool: 'nmap',
        command: 'nmap -sV -p 22,80,443,8080,8443 api.novacorp.io',
        output: `PORT     STATE SERVICE  VERSION\n22/tcp   open  ssh      OpenSSH 8.9p1\n80/tcp   open  http     nginx 1.24.0\n443/tcp  open  ssl/http nginx 1.24.0\n8080/tcp open  http     Grafana 10.2.2`,
        explanation: 'Phase 5: Service enumeration on discovered hosts.',
      },
      {
        tool: 'analysis',
        command: 'echo "=== RECON SUMMARY ===" && echo "Domain: novacorp.io (102.89.23.0/24)" && echo "Emails: 4 found" && echo "Subdomains: 8 discovered" && echo "Social profiles: 3 linked" && echo "Open services: 4" && echo "Potential entry points: api.novacorp.io:8080 (Grafana)"',
        output: `=== RECON SUMMARY ===\nDomain: novacorp.io (102.89.23.0/24)\nEmails: 4 found\nSubdomains: 8 discovered\nSocial profiles: 3 linked\nOpen services: 4\nPotential entry points: api.novacorp.io:8080 (Grafana)`,
        explanation: 'Phase 6: Compile all findings into actionable intelligence.',
      },
    ],
    flag: 'FLAG{osint_full_recon_mastered}',
    cpReward: 400,
    skills: ['WHOIS', 'DNS enumeration', 'Email harvesting', 'Username enumeration', 'Social media analysis', 'Service detection', 'Intelligence compilation'],
  },
];
