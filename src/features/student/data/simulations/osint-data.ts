import type { QuizQuestion } from './types';

export interface OsintStep {
  tool: string;
  command: string;
  output: string;
  explanation: string;
  quiz?: QuizQuestion[];
}

export interface OsintChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetName: string;
  targetDescription: string;
  steps: OsintStep[];
  cpReward: number;
  skills: string[];
  villain?: {
    name: string;
    alias: string;
    description: string;
  };
  narrative?: string;
}

export const OSINT_CHALLENGES: OsintChallenge[] = [
  {
    id: 'osint-email-1',
    title: 'Email Harvesting',
    description: 'Find employee email addresses for NovaCorp using OSINT techniques.',
    difficulty: 'beginner',
    targetName: 'NovaCorp',
    targetDescription: 'A cybersecurity firm based in Lagos, Nigeria. They have a public website at novacorp.io.',
    villain: {
      name: 'Chen Wei',
      alias: 'The Digital Ghost',
      description: 'A corporate spy who uses email harvesting to launch phishing attacks. His email patterns are predictable.',
    },
    narrative: `> **Valkyrie:** "Chen Wei. The Digital Ghost, harvested NovaCorp's emails to launch a phishing campaign. He didn't write a single line of code. He just searched. That's the terrifying power of OSINT: all the information is already public."

Email addresses are the skeleton key of any corporate attack. They're used for phishing, password resets, social engineering, and lateral movement. Chen Wei built a database of every NovaCorp employee's email using nothing but WHOIS records, DNS queries, and search engines. He never touched NovaCorp's infrastructure, he just read what they'd already published to the world.

## Where Emails Leak

The danger isn't that emails exist: it's that organizations don't realize how many places they expose them. DNS records, social media profiles, job postings, PDF documents, code repositories, each one is a potential email leak. Once an attacker has the email format (\`firstname.lastname@novacorp.io\`), they can **predict every employee's address** and build targeted attacks at scale.

This is why one harvested address is never just one address. The format reveals the pattern, the pattern reveals the whole directory, and the directory becomes the target list for a phishing campaign.

## Recon Flow

\`[Domain Research]\` --> \`[DNS Enumeration]\` --> \`[Email Harvesting]\` --> \`[Pattern Analysis]\` --> \`[Attack Surface Mapping]\`

Start with \`whois\` for registration details, \`dig\` for DNS records, then let theHarvester aggregate emails and hosts from public search engines.`,
    steps: [
      {
        tool: 'whois',
        command: 'whois novacorp.io',
        output: `Domain Name: novacorp.io\nRegistry Domain ID: D503300000040939373-LRMS\nRegistrar WHOIS Server: whois.namecheap.com\nRegistrar: NameCheap, Inc.\nUpdated Date: 2024-01-15T08:30:00Z\nCreation Date: 2022-06-10T14:22:00Z\nRegistry Expiry Date: 2025-06-10T14:22:00Z\nName Server: ns1.digitalocean.com\nName Server: ns2.digitalocean.com\nDNSSEC: unsigned\nRegistrant Email: admin@novacorp.io`,
        explanation: "WHOIS is always the first stop. It reveals the registrant email (admin@novacorp.io), the registrar (NameCheap), and the nameservers (DigitalOcean). This tells us the organization uses NameCheap for domain management and DigitalOcean for hosting, both useful for social engineering. The registrant email confirms the email format and gives us our first verified address. The DNSSEC being 'unsigned' means DNS spoofing is possible, a detail an attacker would note for later.",
        quiz: [
          {
            id: 'osint-whois-q1',
            question: 'Why is WHOIS typically the first OSINT step for a domain?',
            options: [
              'It scans the domain for open ports',
              'It reveals registration details like the registrant email, registrar, and nameservers',
              'It cracks the domain\'s password hashes',
              'It lists all subdomains in real time',
            ],
            correctIndex: 1,
            explanation: 'WHOIS exposes the registrar, registrant email, and nameservers, giving a first verified address and the hosting/provider infrastructure to pivot into further recon.',
          },
          {
            id: 'osint-whois-q2',
            question: 'Why is the "DNSSEC: unsigned" field of interest to an attacker?',
            options: [
              'It means the domain cannot be resolved by DNS',
              'It signals DNS spoofing or cache-poisoning may be possible',
              'It disables all email records',
              'It reveals the registrant\'s password',
            ],
            correctIndex: 1,
            explanation: 'An unsigned zone lacks DNSSEC authentication, so attackers may be able to manipulate DNS answers (spoofing/poisoning) more easily.',
          },
        ],
      },
      {
        tool: 'dig',
        command: 'dig novacorp.io MX',
        output: `;; ANSWER SECTION:\nnovacorp.io.          3600    IN      MX      10 mail.novacorp.io.\nnovacorp.io.          3600    IN      MX      20 mail2.novacorp.io.`,
        explanation: "MX records reveal the mail server hostnames. 'mail.novacorp.io' and 'mail2.novacorp.io' are the mail exchangers. Knowing the mail infrastructure helps us understand the organization's email setup, two MX records suggest redundancy, meaning they take email seriously. These hostnames could also be subdomains worth investigating further. An attacker might try phishing through the mail server or check for misconfigurations that allow email spoofing.",
        quiz: [
          {
            id: 'osint-mx-q1',
            question: 'What does an MX DNS record reveal about an organization?',
            options: [
              'The web server software in use',
              'The hostnames of the mail exchangers (mail servers)',
              'The IP of the site\'s load balancer',
              'The registrar used for the domain',
            ],
            correctIndex: 1,
            explanation: 'MX records specify which mail servers handle email for the domain, revealing the mail infrastructure and potential targets.',
          },
          {
            id: 'osint-mx-q2',
            question: 'Why would multiple MX records be of note during recon?',
            options: [
              'They indicate a misconfigured firewall',
              'They reveal redundant mail infrastructure, meaning email reliability is taken seriously',
              'They increase the domain\'s attack surface by exposing the CDN',
              'They confirm the site uses a CMS',
            ],
            correctIndex: 1,
            explanation: 'Multiple MX records indicate redundant mail servers, a sign the organization invests in email reliability and worth probing for spoofing/misconfigurations.',
          },
        ],
      },
      {
        tool: 'dig',
        command: 'dig novacorp.io TXT',
        output: `;; ANSWER SECTION:\nnovacorp.io.          3600    IN      TXT     "v=spf1 mx a ip4:102.89.23.0/24 include:_spf.google.com ~all"\nnovacorp.io.          3600    IN      TXT     "google-site-verification=abc123def456"`,
        explanation: "TXT records are a treasure trove. The SPF record reveals their IP range (102.89.23.0/24) and confirms they use Google Workspace for email. The Google site verification token tells us they've verified Google services. An attacker could use the IP range for network scanning, and knowing they use Google helps craft convincing phishing emails that look like legitimate Google notifications.",
        quiz: [
          {
            id: 'osint-txt-q1',
            question: 'What sensitive detail can an SPF TXT record leak?',
            options: [
              'The database admin password',
              'The organization\'s allowed IP range for sending mail',
              'The SSH private keys',
              'The customer credit-card numbers',
            ],
            correctIndex: 1,
            explanation: 'SPF records list the IP ranges authorized to send mail, exposing internal networks an attacker can use for scanning.',
          },
          {
            id: 'osint-txt-q2',
            question: 'How can knowing the email provider (e.g. Google Workspace) aid an attacker?',
            options: [
              'It lets them bypass the firewall',
              'It helps craft convincing phishing emails that impersonate legitimate provider notifications',
              'It reveals the root password',
              'It disables SPF protections',
            ],
            correctIndex: 1,
            explanation: 'Tailored phishing that mimics the real email provider is far more effective at tricking employees.',
          },
        ],
      },
      {
        tool: 'theHarvester',
        command: 'theHarvester -d novacorp.io -b all',
        output: `[*] Searching in Google...\n[*] Searching in Bing...\n[*] Searching in DuckDuckGo...\n\n[*] Emails found:\n---------------------\nadmin@novacorp.io\ninfo@novacorp.io\njames.adu@novacorp.io\nfatima.okafor@novacorp.io\nsupport@novacorp.io\nhr@novacorp.io\n\n[*] Hosts found:\n---------------------\nmail.novacorp.io:102.89.23.15\nwww.novacorp.io:102.89.23.10\napi.novacorp.io:102.89.23.20\nvpn.novacorp.io:102.89.23.25`,
        explanation: "theHarvester aggregates results from multiple search engines and public sources. We now have six email addresses and four subdomains with their IP addresses. The emails reveal two naming conventions: 'firstname.lastname' (james.adu, fatima.okafor) and generic roles (admin, info, support, hr). The subdomains are critical: api.novacorp.io and vpn.novacorp.io are high-value targets. An attacker now has enough to launch a targeted phishing campaign against each employee, or brute-force the VPN and API endpoints.",
        quiz: [
          {
            id: 'osint-harvester-q1',
            question: 'What does theHarvester do?',
            options: [
              'It enumerates subdomains by brute-forcing DNS names',
              'It aggregates emails and hosts from multiple public search engines and sources',
              'It cracks password hashes from leaked databases',
              'It fingerprints web-server software versions',
            ],
            correctIndex: 1,
            explanation: 'theHarvester scrapes search engines and public sources to gather email addresses and hostnames for a domain.',
          },
          {
            id: 'osint-harvester-q2',
            question: 'Why are subdomains like api.novacorp.io and vpn.novacorp.io high-value targets?',
            options: [
              'They are always protected by default credentials',
              'They expose internal services that may bypass perimeter security and house sensitive data',
              'They are immune to brute forcing',
              'They contain the domain\'s DNS records',
            ],
            correctIndex: 1,
            explanation: 'API and VPN endpoints are prime targets because they expose internal application logic or remote access channels that may have weaker controls.',
          },
        ],
      },
      {
        tool: 'grep',
        command: 'grep -r "novacorp" /usr/share/wordlists/emails.txt 2>/dev/null || echo "Checking email patterns..."',
        output: `Checking email patterns...\nCommon patterns at novacorp.io:\nfirstname.lastname@novacorp.io\nfirstlast@novacorp.io\nfirst@novacorp.io`,
        explanation: "Pattern analysis reveals the email naming convention. NovaCorp uses firstname.lastname@novacorp.io, we can now predict every employee's email address from their name alone. If we find 'Chen Wei' on LinkedIn, we know his email is chen.wei@novacorp.io without ever checking. This pattern also helps with password reset attacks and social engineering. An attacker could generate thousands of valid email addresses from a company directory and use them for credential stuffing.",
        quiz: [
          {
            id: 'osint-pattern-q1',
            question: 'Why is identifying the email naming convention so valuable?',
            options: [
              'It lets attackers predict any employee\'s email address from their name alone',
              'It reveals the strength of the password hashes',
              'It exposes the IP of the mail server',
              'It disables SPF for the domain',
            ],
            correctIndex: 0,
            explanation: 'Once the firstname.lastname pattern is known, attackers can guess any employee\'s email, enabling targeted phishing and credential stuffing.',
          },
          {
            id: 'osint-pattern-q2',
            question: 'How could a predictable email pattern be weaponized?',
            options: [
              'To bypass two-factor authentication',
              'To launch targeted phishing, password-reset attacks, and credential stuffing',
              'To crack the domain\'s DNS records',
              'To gain direct SSH access',
            ],
            correctIndex: 1,
            explanation: 'Generated addresses feed phishing and password-reset attempts and are replayed in credential-stuffing attacks.',
          },
        ],
      },
    ],
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
    villain: {
      name: 'The Social Engineer',
      alias: 'The Profile Builder',
      description: 'A social engineering expert who builds detailed profiles of targets using public social media data.',
    },
    narrative: `> **Valkyrie:** "The Social Engineer. The Profile Builder, targets employees through social media. Fatima Okafor is his latest target. He doesn't need to hack anything, he just reads what people share publicly."

Social media is a goldmine for attackers, and Fatima's public profiles are an open book. Her Twitter reveals her interests and opinions. Her GitHub shows her coding habits and NovaCorp tools. Her Instagram photos contain GPS coordinates that pinpoint her exact location. The Social Engineer uses all of this to craft **personalized phishing attacks** that are nearly impossible to distinguish from legitimate messages.

## The Trust Exploit

This is the reality of modern social engineering. People share their location, their employer, their technologies, their routines, all voluntarily. The Social Engineer doesn't need to guess. He builds a complete profile from public data, then exploits the trust that comes with appearing to "know" the target. A single Instagram photo with embedded EXIF data can reveal where someone works, what device they use, and where they live.

The methodology matters as much as the tools: enumerate usernames across platforms, map each account to a data source, then extract metadata that humans never think about.

## Social Recon Strategy

\`[Username Search]\` --> \`[Profile Analysis]\` --> \`[Metadata Extraction]\` --> \`[Trust Exploitation]\`

Run \`sherlock\` to find Fatima's accounts across platforms, check GitHub for NovaCorp code, and pull EXIF metadata from her profile photo.`,
    steps: [
      {
        tool: 'sherlock',
        command: 'sherlock fatimaokafor',
        output: `[+] Twitter: https://twitter.com/fatimaokafor\n[+] GitHub: https://github.com/fatimaokafor\n[+] LinkedIn: https://linkedin.com/in/fatima-okafor\n[+] Instagram: https://instagram.com/fatimaokafor\n[+] Medium: https://medium.com/@fatimaokafor\n\n[!] Accounts found: 5`,
        explanation: "Sherlock searches 300+ platforms for the username 'fatimaokafor'. Five accounts found across different services, each one reveals something different. Twitter shows her thoughts and connections. GitHub reveals her technical skills and NovaCorp tools. LinkedIn confirms her employment. Instagram could contain personal photos with metadata. Medium shows her writing and expertise areas. An attacker now has five different vectors to gather intelligence, and the username consistency across platforms tells us she reuses handles, a common but dangerous habit.",
        quiz: [
          {
            id: 'osint-sherlock-q1',
            question: 'What does the Sherlock tool do?',
            options: [
              'It cracks password hashes from a wordlist',
              'It searches hundreds of platforms for a username to find an individual\'s accounts',
              'It enumerates subdomains of a target domain',
              'It scans a host for open ports',
            ],
            correctIndex: 1,
            explanation: 'Sherlock queries many online platforms looking for a given username, mapping out where a target has public accounts.',
          },
          {
            id: 'osint-sherlock-q2',
            question: 'Why is finding the same username across many platforms significant?',
            options: [
              'It proves the target is a security professional',
              'It reveals handle reuse, a habit that aids credential-stuffing and cross-platform profiling',
              'It guarantees the target is vulnerable to XSS',
              'It exposes the target\'s current location',
            ],
            correctIndex: 1,
            explanation: 'Reused usernames make it easier to aggregate data on a person and to attempt the same credentials across services.',
          },
        ],
      },
      {
        tool: 'github-dork',
        command: 'curl -s "https://api.github.com/search/code?q=novacorp+user:fatimaokafor" | jq .items[].html_url',
        output: `"https://github.com/fatimaokafor/novacorp-tools/blob/main/scanner.py"\n"https://github.com/fatimaokafor/novacorp-tools/blob/main/config.example.yml"`,
        explanation: "GitHub code search reveals two NovaCorp-related files. The scanner.py could contain internal tools or scripts with hardcoded IPs, API endpoints, or credentials. The config.example.yml, even as an example, shows the configuration structure and might contain placeholder values that reveal naming conventions. An attacker would read these files for: internal API URLs, database connection strings, third-party service tokens, or any secrets accidentally committed. This is why GitHub dorking is one of the most effective OSINT techniques against tech companies.",
        quiz: [
          {
            id: 'osint-githubdork-q1',
            question: 'What is GitHub dorking?',
            options: [
              'Scanning GitHub servers for open ports',
              'Using GitHub code search to find leaked code, secrets, and internal details in public repositories',
              'Cracking GitHub account passwords',
              'Brute-forcing repository names',
            ],
            correctIndex: 1,
            explanation: 'GitHub dorking searches public code for hardcoded credentials, internal URLs, and other secrets developers accidentally commit.',
          },
          {
            id: 'osint-githubdork-q2',
            question: 'Why is even a config.example.yml file valuable to an attacker?',
            options: [
              'It contains the production database credentials',
              'Its structure reveals naming conventions and possible placeholder values that map internal systems',
              'It is always encrypted with the deploy key',
              'It lists the developer\'s social accounts',
            ],
            correctIndex: 1,
            explanation: 'Example configs reveal how the application is wired, exposing internal hostnames, endpoints, and token conventions worth probing.',
          },
        ],
      },
      {
        tool: 'curl',
        command: 'curl -s https://api.github.com/users/fatimaokafor/repos | jq ".[].name"',
        output: `"novacorp-tools"\n"security-scripts"\n"ctf-writeups"\n"personal-blog"\n"dotfiles"`,
        explanation: "The repository list paints a picture of Fatima's technical life. 'novacorp-tools' confirms she works on NovaCorp infrastructure. 'security-scripts' suggests she handles security tasks. 'ctf-writeups' reveals she participates in capture-the-flag competitions, she knows security, but might have shared too much publicly. 'dotfiles' could contain SSH keys, API tokens, or configuration files. An attacker would examine each repository for leaked secrets, internal knowledge, and potential attack vectors.",
        quiz: [
          {
            id: 'osint-repos-q1',
            question: 'Why is a "dotfiles" repository of particular interest to an attacker?',
            options: [
              'It always contains the database backups',
              'It can hold SSH keys, API tokens, and shell/editor config files with secrets',
              'It lists the target\'s browser history',
              'It stores the deployment passwords in plaintext only',
            ],
            correctIndex: 1,
            explanation: 'dotfiles commonly hold SSH keys, tokens, and config files that can leak credentials if committed publicly.',
          },
          {
            id: 'osint-repos-q2',
            question: 'What does a repository named "novacorp-tools" reveal?',
            options: [
              'The target\'s social security number',
              'That the employee works on internal NovaCorp infrastructure and source code',
              'The target\'s physical office address',
              'That the account is a bot',
            ],
            correctIndex: 1,
            explanation: 'Internal tooling repositories confirm the employee\'s role and expose NovaCorp\'s internal development stack and possible secrets.',
          },
        ],
      },
      {
        tool: 'exiftool',
        command: 'curl -sL https://pbs.twimg.com/profile_images/fatima.jpg -o avatar.jpg && exiftool avatar.jpg',
        output: `File Name                       : avatar.jpg\nFile Size                       : 45 kB\nGPS Latitude                    : 6.5244\nGPS Longitude                   : 3.3792\nGPS Position                    : 6.5244 3.3792\nCamera Make                     : Apple\nCamera Model                    : iPhone 15 Pro`,
        explanation: "EXIF metadata in the profile photo is a goldmine. GPS coordinates (6.5244, 3.3792) place her in Lagos, Nigeria, confirming her physical location. The iPhone 15 Pro tells us her device and operating system, which is useful for targeted malware or social engineering. An attacker could now: send location-based phishing (e.g., 'Join us at this Lagos café for a NovaCorp meetup'), craft device-specific attacks, or use the photo itself for impersonation. This is why security-conscious professionals strip EXIF data before uploading photos.",
        quiz: [
          {
            id: 'osint-exif-q1',
            question: 'What type of sensitive data can EXIF metadata in a photo leak?',
            options: [
              'The photo subject\'s social media passwords',
              'GPS coordinates, device make/model, and capture settings',
              'The photographer\'s bank details',
              'The WiFi network password',
            ],
            correctIndex: 1,
            explanation: 'EXIF data stores camera settings, GPS location, and device info, which can reveal where and on what device a photo was taken.',
          },
          {
            id: 'osint-exif-q2',
            question: 'How can an attacker weaponize EXIF data from a profile photo?',
            options: [
              'To craft location-based phishing and device-specific attacks, and for impersonation',
              'To decrypt the target\'s email',
              'To reset the target\'s passwords remotely',
              'To access the target\'s SSH keys',
            ],
            correctIndex: 0,
            explanation: 'Knowing location and device lets attackers tailor phishing lures and device-targeted exploits.',
          },
        ],
      },
    ],
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
    villain: {
      name: 'The Subdomain Hunter',
      alias: 'The Network Mapper',
      description: 'A reconnaissance specialist who maps entire corporate networks through subdomain enumeration.',
    },
    narrative: `> **Valkyrie:** "The Subdomain Hunter. The Network Mapper, discovered NovaCorp's entire infrastructure through subdomain enumeration. He didn't scan a single port until he knew exactly what was out there."

Subdomains are the hidden architecture of a company. Most organizations don't just run \`www.novacorp.io\`, they have \`api.novacorp.io\` for their API, \`dev.novacorp.io\` for development servers, \`staging.novacorp.io\` for pre-production, \`admin.novacorp.io\` for internal dashboards, and \`jenkins.novacorp.io\` for CI/CD. Each subdomain is a potential entry point, and attackers know that development and staging servers often have weaker security than production.

The Subdomain Hunter found 13 subdomains from multiple sources, certificate transparency logs, DNS brute-forcing, search engine dorking, and passive reconnaissance. The internal tools (Grafana, Jenkins, Git) are especially dangerous because they're often left exposed with default credentials. This is the reconnaissance phase that separates amateurs from professionals: mapping the entire attack surface before launching a single exploit.

## Why Certificate Transparency Matters

Every TLS certificate issued for *.\`novacorp.io\` is logged in public certificate transparency databases. When NovaCorp's developers spun up \`staging.novacorp.io\`, they probably requested a Let's Encrypt cert, and that subdomain name became public record forever. Passive tools like subfinder and amass query these logs (plus search engine indexes and DNS datasets) to discover subdomains the company never advertised. No traffic touches NovaCorp's servers, which makes this phase completely undetectable.

## Subdomain Strategy

\`[Passive Enumeration]\` --> \`[Active Brute-force]\` --> \`[DNS Resolution]\` --> \`[Service Mapping]\` --> \`[Attack Prioritization]\`

Map every subdomain, resolve the live ones to IPs, fingerprint the services, then rank targets by value: internal tooling beats production web servers every time.`,
    steps: [
      {
        tool: 'subfinder',
        command: 'subfinder -d novacorp.io -silent',
        output: `api.novacorp.io\nblog.novacorp.io\ncdn.novacorp.io\ndev.novacorp.io\nmail.novacorp.io\nstaging.novacorp.io\nvpn.novacorp.io\nwww.novacorp.io`,
        explanation: "Subfinder performs passive enumeration by querying certificate transparency logs, DNS databases, and search engines. It finds subdomains that are publicly visible but not always advertised. Eight subdomains discovered, each one a potential entry point. The dev.novacorp.io and staging.novacorp.io are especially interesting because development servers often have weaker security controls, debug endpoints, and sometimes even default credentials. An attacker would prioritize these over production systems.",
        quiz: [
          {
            id: 'osint-subfinder-q1',
            question: 'How does Subfinder discover subdomains?',
            options: [
              'By brute-forcing DNS hostnames with a wordlist',
              'By passive enumeration of certificate transparency logs, DNS databases, and search engines',
              'By cracking the registrar\'s API keys',
              'By port-scanning the entire IP range',
            ],
            correctIndex: 1,
            explanation: 'Subfinder is a passive tool that harvests subdomains from certificate transparency logs and public DNS sources without sending traffic to the target.',
          },
          {
            id: 'osint-subfinder-q2',
            question: 'Why are dev.novacorp.io and staging.novacorp.io attractive targets?',
            options: [
              'They always run on port 53',
              'Development/staging servers often have weaker security, debug endpoints, and default credentials',
              'They cannot be scanned by nmap',
              'They hold the domain\'s WHOIS records',
            ],
            correctIndex: 1,
            explanation: 'Non-production environments frequently lack hardening, exposing debug routes and default logins.',
          },
        ],
      },
      {
        tool: 'amass',
        command: 'amass enum -passive -d novacorp.io 2>/dev/null | head -20',
        output: `admin.novacorp.io\napi.novacorp.io\nblog.novacorp.io\ncdn.novacorp.io\ndev.novacorp.io\ngit.novacorp.io\ngrafana.novacorp.io\njenkins.novacorp.io\nmail.novacorp.io\nmonitoring.novacorp.io\nstaging.novacorp.io\nvpn.novacorp.io\nwww.novacorp.io`,
        explanation: "Amass digs deeper with additional data sources and finds five more subdomains than subfinder. The new discoveries are critical: admin.novacorp.io (likely an internal dashboard), git.novacorp.io (source code hosting), grafana.novacorp.io (monitoring with potential credential exposure), jenkins.novacorp.io (CI/CD with build secrets), and monitoring.novacorp.io (infrastructure visibility). An attacker now has a complete map of NovaCorp's infrastructure. The Jenkins and Git servers are high-priority targets because they contain source code, build secrets, and deployment credentials.",
        quiz: [
          {
            id: 'osint-amass-q1',
            question: 'Why are git.novacorp.io and jenkins.novacorp.io high-priority targets?',
            options: [
              'They contain source code, build secrets, and deployment credentials',
              'They are the only hosts exposing SSH',
              'They control the domain\'s DNS zones',
              'They are always running default web servers',
            ],
            correctIndex: 0,
            explanation: 'Source-control and CI/CD servers hold the crown jewels: code, build secrets, and credentials for deploying to production.',
          },
          {
            id: 'osint-amass-q2',
            question: 'How does Amass differ from Subfinder in scope?',
            options: [
              'Amass only scans IPv6 addresses',
              'Amass uses more data sources and typically discovers additional subdomains beyond passive certificate logs',
              'Amass cracks password hashes instead',
              'Amass only resolves A records',
            ],
            correctIndex: 1,
            explanation: 'Amass aggregates many more passive sources, surfacing subdomains that single-purpose tools miss.',
          },
        ],
      },
      {
        tool: 'dig',
        command: 'for sub in api dev staging admin grafana jenkins; do echo "$sub.novacorp.io: $(dig +short $sub.novacorp.io | head -1)"; done',
        output: `api.novacorp.io: 102.89.23.20\ndev.novacorp.io: 102.89.23.30\nstaging.novacorp.io: 102.89.23.35\nadmin.novacorp.io: 102.89.23.40\ngrafana.novacorp.io: 102.89.23.45\njenkins.novacorp.io: 102.89.23.50`,
        explanation: "DNS resolution confirms which subdomains are active and maps them to IP addresses. All six resolve to the 102.89.23.0/24 range, confirming they're on the same network segment. This is important because it tells an attacker that once they compromise one server, lateral movement to others may be straightforward. The admin server at .40 and Jenkins at .50 are the highest-value targets. An attacker would note these IPs for the next phase: port scanning and service enumeration.",
        quiz: [
          {
            id: 'osint-resolve-q1',
            question: 'Why does it matter that all subdomains resolve to the same 102.89.23.0/24 range?',
            options: [
              'It means they share a CDN and cannot be hacked',
              'It indicates they sit on the same network segment, simplifying lateral movement after a single compromise',
              'It disables port scanning',
              'It guarantees they all use the same passwords',
            ],
            correctIndex: 1,
            explanation: 'Hosts on one network segment are reachable to one another, so a single foothold can often pivot to the rest.',
          },
          {
            id: 'osint-resolve-q2',
            question: 'After DNS resolution maps subdomains to IPs, what is the natural next step?',
            options: [
              'Deleting the DNS zone',
              'Port scanning and service enumeration against the discovered IPs',
              'Cracking the registrar password',
              'Sending phishing mail via MX records',
            ],
            correctIndex: 1,
            explanation: 'Once live hosts and IPs are known, attackers fingerprint open ports and services to find entry points.',
          },
        ],
      },
      {
        tool: 'nmap',
        command: 'nmap -sV -p 80,443,8080,8443 api.novacorp.io dev.novacorp.io admin.novacorp.io',
        output: `PORT     STATE SERVICE  VERSION\n80/tcp   open  http     nginx 1.24.0\n443/tcp  open  ssl/http nginx 1.24.0\n\nPORT     STATE SERVICE  VERSION\n80/tcp   open  http     Node.js Express\n3000/tcp open  http     Node.js Express\n\nPORT     STATE SERVICE  VERSION\n443/tcp  open  ssl/http nginx 1.24.0\n8080/tcp open  http     Grafana 10.2.2`,
        explanation: "Service detection reveals what's actually running. The production API (api.novacorp.io) runs nginx, standard and well-configured. The dev server (dev.novacorp.io) runs Node.js Express on ports 80 and 3000, the Express server on 3000 is likely a development API that bypasses the production nginx proxy, potentially exposing debug endpoints or unprotected routes. The admin server (admin.novacorp.io) has Grafana on port 8080, a monitoring dashboard that could contain infrastructure metrics, alerts, and possibly credentials. An attacker would target the Grafana instance first because it often stores data source passwords and can reveal the entire network topology.",
        quiz: [
          {
            id: 'osint-nmap-q1',
            question: 'Why is an Express server on port 3000 of a dev host a likely target?',
            options: [
              'Port 3000 is always unencrypted and default-password protected',
              'It may be a development API that bypasses the production proxy, exposing debug or unprotected routes',
              'It hosts the domain\'s WHOIS data',
              'It can never run TLS',
            ],
            correctIndex: 1,
            explanation: 'Dev APIs often run directly, without the hardened production proxy, exposing debug endpoints and weaker controls.',
          },
          {
            id: 'osint-nmap-q2',
            question: 'Why do attackers often target a Grafana instance first?',
            options: [
              'It is the only service that accepts SSH',
              'It can store data-source credentials and reveal the full network topology',
              'It shadows the primary IP range',
              'It resets all passwords on login',
            ],
            correctIndex: 1,
            explanation: 'Grafana dashboards and data sources frequently hold credentials and expose how infrastructure is connected.',
          },
        ],
      },
    ],
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
    villain: {
      name: 'The Breach Collector',
      alias: 'The Data Hoarder',
      description: 'A black-hat hacker who collects and sells leaked credentials from data breaches.',
    },
    narrative: `> **Valkyrie:** "The Breach Collector. The Data Hoarder, sold NovaCorp's leaked credentials on the dark web. He didn't hack them. He just bought what was already stolen."

Data breaches are inevitable. What makes them dangerous is **password reuse**. When a LinkedIn password is the same as a NovaCorp admin password, the breach becomes a corporate compromise. The Breach Collector found NovaCorp employees using predictable passwords, company name plus year, simple substitutions, dictionary words. He bought 847 leaked records across three breaches and sold them to the highest bidder.

The NovaCorp-Leak breach is especially damning: it includes internal roles and API keys alongside credentials. This suggests an insider threat or a compromised internal system. Breach analysis isn't just about checking if passwords leaked, it's about understanding patterns. If \`Fatima2024!\` was Fatima's old password, what's her new one? Probably \`Fatima2025!\` or \`fatima2024!\`. **Pattern analysis turns old leaks into new attack vectors.**

## Credential Stuffing Is the Payoff

A single leaked email-password pair is an account take over waiting to happen. Attackers run automated "stuffing" tools that replay leaked credentials against VPN portals, email webmail, GitHub, Jenkins, and Grafana, any service the target is likely to have reused the password on. The victims never see it coming because their primary account still works fine. The only defense is unique passwords per service and mandatory breach monitoring.

## Breach Analysis

\`[Breach Database]\` --> \`[Credential Matching]\` --> \`[Pattern Recognition]\` --> \`[Predictive Attacks]\`

Query the breach indexes, match leaked emails to employees, extract the password habits they reveal, then predict their current and future credentials.`,
    steps: [
      {
        tool: 'breach-check',
        command: 'curl -s "https://api.breachcheck.io/v1/novacorp.io" -H "Authorization: Bearer test-key"',
        output: `{\n  "domain": "novacorp.io",\n  "breaches": 3,\n  "total_records": 847,\n  "breach_details": [\n    {"name": "LinkedIn2023", "date": "2023-08-15", "records": 450, "types": ["email","password","name"]},\n    {"name": "Adobe2024", "date": "2024-01-20", "records": 280, "types": ["email","password"]},\n    {"name": "NovaCorp-Leak", "date": "2024-03-10", "records": 117, "types": ["email","password","role","api_key"]}\n  ]\n}`,
        explanation: "The breach check reveals 847 leaked records across three breaches. LinkedIn2023 exposed names and passwords, useful for social engineering. Adobe2024 exposed email-password pairs, useful for credential stuffing. The NovaCorp-Leak is the most dangerous: it includes roles and API keys, meaning someone had internal access and exfiltrated sensitive data. An attacker now knows which employees appear in which breaches and can target the most exposed individuals first.",
        quiz: [
          {
            id: 'osint-breachcheck-q1',
            question: 'Why is a breach containing roles and API keys especially dangerous?',
            options: [
              'It was caused by magnetic tape corruption',
              'It indicates internal access was exfiltrated, exposing sensitive operational data beyond just logins',
              'It can only affect inactive accounts',
              'It automatically resets all passwords',
            ],
            correctIndex: 1,
            explanation: 'Breaches that carry roles and API keys suggest an insider or compromised internal system, leaking more than mere credentials.',
          },
          {
            id: 'osint-breachcheck-q2',
            question: 'Why search breach databases during OSINT?',
            options: [
              'To predict which employees appear in leaks so the most exposed are prioritized for targeting',
              'To disable email security',
              'To reassign IP addresses',
              'To validate the domain\'s DNSSEC signing',
            ],
            correctIndex: 0,
            explanation: 'Knowing who leaked and what each leak exposed lets attackers rank targets and reuse harvested credentials.',
          },
        ],
      },
      {
        tool: 'grep',
        command: 'grep -i "novacorp" /usr/share/wordlists/breaches.txt 2>/dev/null | head -10',
        output: `james.adu@novacorp.io:password123\nfatima.okafor@novacorp.io:Fatima2024!\nsupport@novacorp.io:support123\nadmin@novacorp.io:admin2024`,
        explanation: "Four leaked credential pairs found. James uses 'password123', one of the most common passwords worldwide. Fatima uses 'Fatima2024!', her name plus year with a simple substitution. Support uses 'support123', predictable and easily guessable. Admin uses 'admin2024', the classic lazy admin password. An attacker can immediately try these against every NovaCorp service: VPN, email, GitHub, Jenkins, Grafana. If any employee reused their leaked password, the attacker gains instant access.",
        quiz: [
          {
            id: 'osint-leaked-q1',
            question: 'Why is password reuse the key danger after a breach?',
            options: [
              'It lets attackers decode TLS traffic',
              'A leaked password replayed against VPN, email, and internal tools can grant instant access',
              'It disables two-factor authentication everywhere',
              'It reveals the target\'s location',
            ],
            correctIndex: 1,
            explanation: 'Replayed leaked credentials unlock whichever services the employee reused them on.',
          },
          {
            id: 'osint-leaked-q2',
            question: 'Where would an attacker immediately try leaked leaked credentials?',
            options: [
              'Only on the breach website itself',
              'VPN, email, GitHub, Jenkins, and Grafana — any service the employee likely reused the password on',
              'On the registrar\'s portal only',
              'On certificate transparency logs',
            ],
            correctIndex: 1,
            explanation: 'Credential stuffing replays leaked pairs against the broadest set of corporate services.',
          },
        ],
      },
      {
        tool: 'analysis',
        command: 'echo "Analyzing breach patterns..." && echo "Common password patterns:" && echo "  - CompanyName + Year: novacorp2024" && echo "  - Name + Year: fatima2024" && echo "  - Simple substitutions: p@ssw0rd"',
        output: `Analyzing breach patterns...\nCommon password patterns:\n  - CompanyName + Year: novacorp2024\n  - Name + Year: fatima2024\n  - Simple substitutions: p@ssw0rd`,
        explanation: "Pattern analysis reveals NovaCorp's password culture. Employees use predictable formats: company name + year, personal name + year, and simple character substitutions. This means an attacker can predict next year's passwords too, 'Fatima2025!', 'novacorp2025', 'admin2025'. Pattern analysis also helps build custom wordlists for brute-force attacks. Instead of trying millions of random passwords, an attacker generates a targeted list based on observed patterns, cracking accounts in minutes instead of hours.",
        quiz: [
          {
            id: 'osint-pattern2-q1',
            question: 'Why does spotting password patterns make old leaks dangerous?',
            options: [
              'It lets attackers predict the target\'s current and future passwords',
              'It uncovers the domain\'s DNS records',
              'It disables brute-force defenses',
              'It reveals the registrar\'s master key',
            ],
            correctIndex: 0,
            explanation: 'Patterns like "Name+Year" let attackers extrapolate current and future credentials from old leaked ones.',
          },
          {
            id: 'osint-pattern2-q2',
            question: 'How do observed patterns improve brute-force attacks?',
            options: [
              'They allow building targeted custom wordlists, cracking accounts far faster than random guesses',
              'They bypass rate limiting automatically',
              'They encrypt the target\'s traffic',
              'They reveal hashing salt values',
            ],
            correctIndex: 0,
            explanation: 'Targeted wordlists reflecting the org\'s habits dramatically reduce the search space for cracking.',
          },
        ],
      },
    ],
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
    villain: {
      name: 'The Phantom Network',
      alias: 'The Intelligence Syndicate',
      description: 'A group of elite hackers who combine OSINT techniques to build comprehensive profiles of their targets.',
    },
    narrative: `> **Valkyrie:** "The Phantom Network. The Intelligence Syndicate, conducted a full recon of NovaCorp. They didn't write a single exploit. They just connected dots that NovaCorp left scattered across the internet."

The Phantom Network is legendary in the hacking community because they prove that **information is the ultimate weapon**. They don't write zero-days or develop malware, they use publicly available information to find vulnerabilities that developers never knew existed. Their methodology is simple: gather everything, connect everything, exploit the gaps.

This full recon mission combines every OSINT technique into a single operation. Domain research reveals the infrastructure. DNS enumeration maps the network. Social profiling identifies human targets. Subdomain discovery finds hidden services. Breach analysis reveals password patterns. The final compilation turns raw data into **actionable intelligence**, a complete attack plan built entirely from public information.

## Intelligence Fusion

The power of full-recon isn't any single tool, it's the correlations between data sources. The WHOIS registrant email \`admin@novacorp.io\` matches the domain admin. The GitHub \`novacorp-tools\` repo lists the same technologies running on \`api.novacorp.io\`. The breach record for \`support@novacorp.io\` (\`support123\`) likely reuses that password on the VPN endpoint \`vpn.novacorp.io\`. Each data point is weak alone; **triangulated together they form a precise attack path**. This is the mindset that separates a scanner from a strategist.

## Full Recon Strategy

\`[Domain Research]\` --> \`[DNS Enumeration]\` --> \`[Social Profiling]\` --> \`[Service Mapping]\` --> \`[Intelligence Compilation]\`

Run every recon phase in order, then synthesize a single intelligence report that identifies the highest-probability entry point.`,
    steps: [
      {
        tool: 'whois',
        command: 'whois novacorp.io',
        output: `Domain Name: novacorp.io\nRegistrar: NameCheap, Inc.\nRegistrant Email: admin@novacorp.io\nName Server: ns1.digitalocean.com\nCreation Date: 2022-06-10`,
        explanation: "Phase 1: Domain registration info. This confirms the registrar (NameCheap), hosting provider (DigitalOcean), and creation date (2022). The domain is relatively young, only 2 years old. An attacker notes the DigitalOcean infrastructure because DigitalOcean droplets have predictable IP ranges and known vulnerabilities. The registrant email gives us our first confirmed address.",
        quiz: [
          {
            id: 'osint-full-whois-q1',
            question: 'Why does a young domain matter during recon?',
            options: [
              'Young domains are immune to scanning',
              'Newer domains/infrastructure often have less mature hardening and smaller security footprint',
              'It speeds up DNS propagation for the attacker',
              'It forces the use of IPv6',
            ],
            correctIndex: 1,
            explanation: 'Recently created domains and infrastructure frequently lack hardened configurations, expanding the viable attack surface.',
          },
          {
            id: 'osint-full-whois-q2',
            question: 'What does WHOIS reveal that kickstarts the rest of recon?',
            options: [
              'The full password database',
              'The registrar, hosting provider, and a verified registrant email',
              'A live list of open ports',
              'The target\'s social media handles',
            ],
            correctIndex: 1,
            explanation: 'Registrar/provider and registrant email provide the first infrastructure and identity anchors for the recon pipeline.',
          },
        ],
      },
      {
        tool: 'dig',
        command: 'dig novacorp.io ANY +short',
        output: `102.89.23.10\nmail.novacorp.io.\nns1.digitalocean.com.\nns2.digitalocean.com.`,
        explanation: "Phase 2: DNS records enumeration. The ANY query returns all record types in one shot. A, MX, NS, TXT records. We get the primary IP (102.89.23.10), mail server (mail.novacorp.io), and nameservers (DigitalOcean). The IP confirms the hosting provider and gives us a starting point for network scanning. Multiple DNS records suggest a mature setup with proper email and redundancy configuration.",
        quiz: [
          {
            id: 'osint-full-dig-q1',
            question: 'What is the value of a DNS ANY query during recon?',
            options: [
              'It returns all record types at once — A, MX, NS, TXT — mapping the infrastructure quickly',
              'It cracks the DNS zone\'s signing keys',
              'It disables DNSSEC',
              'It bypasses the firewall',
            ],
            correctIndex: 0,
            explanation: 'Requesting all records in one shot accelerates mapping IPs, mail servers, and nameservers.',
          },
          {
            id: 'osint-full-dig-q2',
            question: 'What does the primary IP from DNS enable next?',
            options: [
              'Network scanning and service fingerprinting',
              'Automatic password reset',
              'Decryption of email archives',
              'Registration of new subdomains',
            ],
            correctIndex: 0,
            explanation: 'The resolved IP becomes the starting point for port scans and service discovery.',
          },
        ],
      },
      {
        tool: 'theHarvester',
        command: 'theHarvester -d novacorp.io -b all',
        output: `Emails found: admin@novacorp.io, jdoe@novacorp.io, fatima.okafor@novacorp.io, support@novacorp.io\nHosts: www.novacorp.io, mail.novacorp.io, api.novacorp.io, vpn.novacorp.io`,
        explanation: "Phase 3: Email and subdomain harvesting. Four emails and four subdomains discovered. The vpn.novacorp.io is a high-value target. VPN access often bypasses perimeter security. The api.novacorp.io suggests a REST API that could be vulnerable to injection attacks. An attacker now has email addresses for phishing, subdomains for port scanning, and IP addresses for network mapping. Each discovery feeds the next phase.",
        quiz: [
          {
            id: 'osint-full-harvester-q1',
            question: 'Why is a VPN endpoint considered a high-value target?',
            options: [
              'It always runs unpatched software',
              'VPN access bypasses the perimeter, granting a direct path into the internal network',
              'It stores the domain\'s DNS zones',
              'It is resistant to port scanning',
            ],
            correctIndex: 1,
            explanation: 'Compromising the VPN circumvents front-door defenses and drops the attacker inside the trusted network.',
          },
          {
            id: 'osint-full-harvester-q2',
            question: 'What makes discovering an api.novacorp.io subdomain useful?',
            options: [
              'REST APIs may expose injectable or unprotected endpoints worth probing',
              'It reveals the CEO\'s email',
              'It disabled the CDN',
              'It holds the registrar API key',
            ],
            correctIndex: 0,
            explanation: 'Public APIs are common entry points for injection and authentication bypass attempts.',
          },
        ],
      },
      {
        tool: 'sherlock',
        command: 'sherlock jdoe --timeout 10',
        output: `[+] GitHub: https://github.com/jdoe-novacorp\n[+] Twitter: https://twitter.com/jdoe_sec\n[+] LinkedIn: https://linkedin.com/in/john-doe-novacorp`,
        explanation: "Phase 4: Social media profiling of key employee. John Doe's GitHub handle 'jdoe-novacorp' confirms his employer. His Twitter handle 'jdoe_sec' suggests he works in security. His LinkedIn profile reveals his role, tenure, and connections. An attacker could: check his GitHub repos for leaked credentials, analyze his Twitter for security opinions that reveal NovaCorp's defenses, or use his LinkedIn connections for social engineering. The username consistency across platforms is a goldmine for credential stuffing.",
        quiz: [
          {
            id: 'osint-full-sherlock-q1',
            question: 'How does a username hint like "jdoe_sec" aid profiling?',
            options: [
              'It confirms the individual works in security, revealing their skill set and perspective',
              'It disables their accounts',
              'It exposes their current password',
              'It maps their home network',
            ],
            correctIndex: 0,
            explanation: 'Usernames expressing a role help an attacker understand the target\'s responsibilities and knowledge.',
          },
          {
            id: 'osint-full-sherlock-q2',
            question: 'Why is consistent username reuse across platforms valuable?',
            options: [
              'It enables credential-stuffing attempts across all of the target\'s accounts',
              'It guarantees account recovery succeeds',
              'It blocks two-factor authentication',
              'It decrypts the target\'s emails',
            ],
            correctIndex: 0,
            explanation: 'Handle reuse lets attackers aggregate data and replay credentials across every linked service.',
          },
        ],
      },
      {
        tool: 'nmap',
        command: 'nmap -sV -p 22,80,443,8080,8443 api.novacorp.io',
        output: `PORT     STATE SERVICE  VERSION\n22/tcp   open  ssh      OpenSSH 8.9p1\n80/tcp   open  http     nginx 1.24.0\n443/tcp  open  ssl/http nginx 1.24.0\n8080/tcp open  http     Grafana 10.2.2`,
        explanation: "Phase 5: Service enumeration on discovered hosts. OpenSSH on port 22 means brute-force or key-based attacks are possible. Nginx on 80/443 is the web server, standard and well-configured. But Grafana on port 8080 is the real prize, it's a monitoring dashboard that often contains infrastructure metrics, database credentials, and API keys. An attacker would target the Grafana instance with default credentials or known CVEs for Grafana 10.2.2.",
        quiz: [
          {
            id: 'osint-full-nmap-q1',
            question: 'Why is open SSH (port 22) with a version like OpenSSH 8.9p1 of interest?',
            options: [
              'It enables brute-force or key-based attacks and lets attackers look up CVEs for that version',
              'It always contains the database',
              'It hosts the web application',
              'It is encrypted with the site certificate',
            ],
            correctIndex: 0,
            explanation: 'Exposed SSH invites brute force and is a surface to correlate against known exploits for the specific version.',
          },
          {
            id: 'osint-full-nmap-q2',
            question: 'Why is a Grafana instance on port 8080 the "real prize"?',
            options: [
              'It typically holds infrastructure metrics, database credentials, and API keys',
              'It is the only host with a TLS cert',
              'It runs the domain\'s authoritative NS',
              'It hosts the marketing website',
            ],
            correctIndex: 0,
            explanation: 'Monitoring dashboards bundle credentials and reveal infrastructure internals, making them prime first targets.',
          },
        ],
      },
      {
        tool: 'analysis',
        command: 'echo "=== RECON SUMMARY ===" && echo "Domain: novacorp.io (102.89.23.0/24)" && echo "Emails: 4 found" && echo "Subdomains: 8 discovered" && echo "Social profiles: 3 linked" && echo "Open services: 4" && echo "Potential entry points: api.novacorp.io:8080 (Grafana)"',
        output: `=== RECON SUMMARY ===\nDomain: novacorp.io (102.89.23.0/24)\nEmails: 4 found\nSubdomains: 8 discovered\nSocial profiles: 3 linked\nOpen services: 4\nPotential entry points: api.novacorp.io:8080 (Grafana)`,
        explanation: "Phase 6: Compile all findings into actionable intelligence. The summary reveals the attack surface: 4 phishing targets, 8 potential entry points, 3 social profiles for reconnaissance, and 1 high-value target (Grafana). The Phantom Network's methodology is complete, from a single domain name, they've built a comprehensive attack plan. This is the power of OSINT: no exploits, no malware, just information that was already public. The final recommendation would be: phish Fatima (weakest password), exploit Grafana (default credentials), then move laterally through the VPN.",
        quiz: [
          {
            id: 'osint-full-compile-q1',
            question: 'What "product" does full-recon intelligence produce?',
            options: [
              'A single actionable attack plan synthesized by correlating all public data sources',
              'A list of exploit payloads',
              'A backup of the target\'s database',
              'A rendered map of the physical office',
            ],
            correctIndex: 0,
            explanation: 'Weaving WHOIS, DNS, social, subdomain, and breach data into one report yields concrete, prioritized attack paths.',
          },
          {
            id: 'osint-full-compile-q2',
            question: 'Why is OSINT described as "information that was already public"?',
            options: [
              'It requires physically breaking into the target',
              'It relies on connecting publicly available data rather than executing exploits or malware',
              'It works only against internal hosts',
              'It needs privileged network access to begin',
            ],
            correctIndex: 1,
            explanation: 'The technique weaponizes only openly accessible data — no intrusion is required to gather the intelligence.',
          },
        ],
      },
    ],
    cpReward: 400,
    skills: ['WHOIS', 'DNS enumeration', 'Email harvesting', 'Username enumeration', 'Social media analysis', 'Service detection', 'Intelligence compilation'],
  },
];
