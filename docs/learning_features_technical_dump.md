# Technical & Informational Dump: QYVORA Learning & Retention Features

QYVORA incorporates several hands-on learning systems, terminal simulations, interactive playgrounds, and retention-focused gamification engines. This document details the technical implementation, mechanics, and design philosophies of these learning features across both the frontend and backend codebases.

---

## 1. Attack Labs (Hands-On Offensive Security)

The **Attack Labs** form the core of the platform's hands-on offensive security simulations. Rather than reading static material, students complete complex penetration testing and defensive challenges in simulated sandbox environments.

### Supported Labs & Simulated Skills
The platform registers 10 separate interactive labs targeting standard cyber operator disciplines:

| Lab ID | Title | Description / Focus | Associated Skills | CP Reward | File Reference |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`privesc`** | Privilege Escalation | Linux misconfiguration exploitation (SUID, sudo, etc.) | Linux, SUID, Sudo, Capabilities | 50–400 CP | [PrivescLab/index.tsx](file:///home/wsuits6/WORK/QYVORA/core/qyvora-frontend/src/features/student/pages/labs/PrivescLab/index.tsx) |
| **`passwords`**| Password Cracking | Hashing analysis, dict attacks, tools integration | Hashing, John, Hashcat, `/etc/shadow` | 100–300 CP | `PasswordLab` |
| **`webapp`** | Web Exploitation | Simulated web vulnerabilities (XSS, CSRF, IDOR) | XSS, CSRF, IDOR, SQLi | 100–400 CP | `WebExploitationLab` |
| **`sqli`** | SQL Injection | SQL Injection vulnerabilities and exploitation | UNION, Blind, Error-based, Stacked | 200–400 CP | `SqlInjectionLab` |
| **`phishing`** | Phishing Analysis | Social engineering and header investigation | Email Headers, URL Analysis, Social Eng | 150–400 CP | `PhishingLab` |
| **`proxy`** | Web Proxy | HTTP request interception and header tampering | HTTP, Interception, Tampering, Session | 150–400 CP | `ProxyLab` |
| **`traffic`** | Traffic Analysis | Wireshark and pcap packet capture forensics | Wireshark, DNS, ARP, C2 Detection | 150–400 CP | `TrafficLab` |
| **`osint`** | OSINT Recon | Open-source intelligence and recon lookups | WHOIS, DNS, Social Media, Breaches | 150–400 CP | `OsintLab` |
| **`wireless`** | Wireless Security | WiFi security cracking simulations | WPA2, WEP, Evil Twin, Aircrack | 200–400 CP | `WirelessLab` |
| **`killchain`**| Kill Chain | Full chain penetration test (recon to exfiltration)| Full Chain, Recon, Exploit, Exfil | 500–600 CP | `KillChainLab` |

### Interaction Mechanics
Each lab is implemented with:
1. **Interactive File Browser (Sidebar)**: Renders a virtual tree of the target filesystem (as in [TreeItemWrapper](file:///home/wsuits6/WORK/QYVORA/core/qyvora-frontend/src/features/student/pages/labs/PrivescLab/index.tsx#L604-L653)) which dynamically highlights files containing relevant content (like flags or sensitive configuration). Clicking a file triggers a command execution simulation (`cat <file>`) to ease cognitive load and facilitate visual exploration.
2. **Terminal Console Simulation**: Accepts user inputs and maps them to simulated outputs using a fuzzy-matching solution algorithm.
3. **Step-by-Step Progress Tracking**: Shows the student's progress relative to a strict, ordered list of solution commands (e.g. `2 of 4 steps`).
4. **Dynamic Hints System**: Unlocks hints one by one if a user gets stuck, ensuring that they can progress without abandoning the lab, supporting learning momentum.
5. **Secure Flag Submission**: The student submits a flag string (like `FLAG{su1d_b1nary_pr1v_3sc}`) verified by the backend API controller at [lab.controller.ts](file:///home/wsuits6/WORK/QYVORA/core/qyvora-backend/src/modules/student/controllers/lab.controller.ts#L86). Flags are kept server-side only so that students cannot scrape them from the client bundles.

---

## 2. In-Browser Simulated Terminal Engine

Rather than connecting to expensive or insecure virtual machines for basic syntax practice, QYVORA utilizes a custom-built, in-browser shell engine that runs client-side.

> [!NOTE]
> This terminal system supports deep interactivity by implementing a virtual state directory structure, custom environment variable expansion, pipeline piping, and globbing.

### Command Capabilities
The command mapping database registry ([commands.ts](file:///home/wsuits6/WORK/QYVORA/core/qyvora-frontend/src/features/student/components/SimulatedTerminal/engine/commands.ts#L7)) implements handlers mimicking authentic Linux bash outputs:
* **Standard Commands**: `ls`, `cd`, `pwd`, `tree`, `cat`, `echo`, `touch`, `mkdir`, `rm`, `cp`, `mv`, `chmod`, `ln`, `du`, `df`
* **Text Analysis Utilities**: `head`, `tail`, `wc`, `grep`, `find`, `sort`, `sed`, `awk`, `cut`, `uniq`, `tr`, `strings`, `diff`
* **System Metrics**: `whoami`, `id`, `uname`, `date`, `uptime`, `hostname`, `env`, `ps`, `top`, `kill`, `free`, `lsof`, `crontab`, `service`, `systemctl`, `chown`
* **Cryptography & Hashing**: `xxd`, `file`, `md5sum`, `sha256sum`, `exiftool`, `binwalk`
* **Cybersecurity Tools (Mocked)**: `nmap`, `gobuster`, `hydra`, `sqlmap`, `nikto`, `john`, `searchsploit`, `enum4linux`, `smbclient`, `crackmapexec`, `hashcat`, `msfconsole`
* **Networking Tools**: `ping`, `curl`, `wget`, `netstat`, `dig`, `whois`, `ss`, `traceroute`, `arp`, `ip`, `ifconfig`, `tcpdump`
* **Environment & Package Tools**: `python3`, `node`, `git`, `pip`, `apt`, `npm`, `docker`, `tmux`, `make`, `gcc`

### Virtual Network Subnet Labs
In the Network Lab view ([NetworksPage/index.tsx](file:///home/wsuits6/WORK/QYVORA/core/qyvora-frontend/src/features/student/pages/NetworksPage/index.tsx)), the simulated terminal interacts directly with a fake local subnet (`10.0.0.0/24`) configured in [fakeNetwork.ts](file:///home/wsuits6/WORK/QYVORA/core/qyvora-frontend/src/features/student/data/fakeNetwork.ts). 
* **Discovery Scanning**: The user can run commands like `nmap -sn 10.0.0.0/24` to discover active devices.
* **Enumeration**: They can run service scans (`nmap -sV <IP>`) or OS scans (`nmap -O <IP>`) on specific hosts (e.g. gateway, dns-server, file-server, network-printer).
* **Backdoors / Vulnerability Hunt**: Students are challenged to locate 5 hidden servers (e.g. `bastion-host` at `10.0.0.50` or `security-cam` at `10.0.0.200`) which contain simulated backdoors or CVEs like Apache Struts2 RCE or default administrator credentials.

---

## 3. Course Lessons & The Code Playground

The core curriculum consists of structured interactive courses and lessons (defined in [lessons.ts](file:///home/wsuits6/WORK/QYVORA/core/qyvora-frontend/src/features/student/data/courses/lessons.ts)) rendering directly into [CourseLessonPage/index.tsx](file:///home/wsuits6/WORK/QYVORA/core/qyvora-frontend/src/features/student/pages/CourseLessonPage/index.tsx).

### Inline retention elements integrated into lessons:
* **Code Block Syntax Highlighting**: Instructors write lesson material in GitHub-Flavored Markdown. The platform parses the code examples in real-time, matching syntax conventions to prevent dry, flat text reading.
* **Inline Terminal Modals**: If a lesson has `hasTerminal: true` configured, a desktop-inline or mobile-modal `SimulatedTerminal` launches underneath the instructions, pre-configured with a specific title and command set, prompting the student to execute the actions they just read about.
* **Live Sandbox Code Playground**: Integrated via the [CodePlayground.tsx](file:///home/wsuits6/WORK/QYVORA/core/qyvora-frontend/src/shared/components/courses/CodePlayground.tsx) component. This provides a live editable textarea that lets users write code (Python, JavaScript, or Bash) in their browser.
  * **Interactive Output Verification**: Users press a **Run** button to execute the code. A mock runner compares the standard output results to an expected string (e.g. `expectedOutput: 'Hello, Hacker!\nScanning target'`).
  * **Instant Feedback Alerts**: Displays a green confirmation check (`✓ Output matches expected!`) or logs specific mismatch execution errors, supporting error-correction cycles.
* **Inline Quizzes**: Immediate verification quizzes appear at the bottom of lessons ([InlineQuiz.tsx](file:///home/wsuits6/WORK/QYVORA/core/qyvora-frontend/src/shared/components/courses/InlineQuiz.tsx)), allowing students to test their comprehension immediately after studying the material.

---

## 4. Bootcamp Walkthrough Rooms

The **Hacker Protocol Bootcamp** is an intensive, cohort-based curriculum mapping across 5 distinct execution phases configured in [bootcampConfig.ts](file:///home/wsuits6/WORK/QYVORA/core/qyvora-frontend/src/features/student/constants/bootcampConfig.ts).

### Pacing and Progress Features
Within a bootcamp room ([BootcampRoomPage/index.tsx](file:///home/wsuits6/WORK/QYVORA/core/qyvora-frontend/src/features/student/pages/BootcampRoomPage/index.tsx)):
* **Instructor-led Locks (Cohort Pacing)**: The backend checks module locks via [isModuleUnlockedByAdmin](file:///home/wsuits6/WORK/QYVORA/core/qyvora-backend/src/modules/student/controllers/student.controller.ts#L381), which blocks students from skipping ahead, enforcing synchronous, cohort-driven pacing.
* **Active Session Time Tracking**: Tracks total minutes spent inside active rooms via the [useRoomSession](file:///home/wsuits6/WORK/QYVORA/core/qyvora-frontend/src/hooks/useRoomSession.ts) hook, displaying a live timer.
* **Bookmarking and "Got It" Checks**: Students can bookmark specific steps (`HPB Bookmarks`) and check off specific walkthrough subsections as "Got it" to track progress on complex workflows.
* **Interactive Step Navigation**: Support for keyboard shortcuts (`ArrowLeft` / `ArrowRight`) to cycle through walkthrough steps, full-screen viewports, and mobile-friendly navigators.

---

## 5. Gamification, Progression, & Blockchain Integration

To sustain user motivation and reward consistent effort, the platform maps all student actions to a gamified point ledger backed by the blockchain.

### Progression Engine Elements
1. **CyberPoints (CP) rewards**:
   - Completing walkthrough rooms awards **`ROOM_COMPLETION_CP`** (default `250 CP`).
   - Passing room quizzes awards points on success ([grantCompletionReward](file:///home/wsuits6/WORK/QYVORA/core/qyvora-backend/src/modules/student/controllers/student.controller.ts#L425)).
   - Completing attack labs awards points depending on complexity (up to `600 CP`).
2. **Blockchain Ledger Consistency**:
   - Points are not just tracked in a standard database; QYVORA credits points to a transparent blockchain registry (`qyvora-chain` balance).
   - Backend transactions use an **Idempotent Outbox pattern** (`chainOutbox.service.ts`), ensuring transaction safety. Points are safely queued and retried to prevent loss in case the blockchain service experiences downtime.
3. **Streak Tracker**:
   - The backend tracks a rolling calendar of student logins. The [computeStreak](file:///home/wsuits6/WORK/QYVORA/core/qyvora-backend/src/modules/student/controllers/student.controller.ts#L95) function calculates consecutive daily learning streaks (`streakDays`), incentivizing users to log in daily.
4. **Hacker Rankings**:
   - Total CP maps to designated, prestigious hacker titles displayed publicly:
     * **Candidate** (Entry Rank)
     * **Contributor**
     * **Specialist**
     * **Architect**
     * **Vanguard** (Top tier rank)
5. **Real-time Level Ups & UI Feedback**:
   - Event-driven notifications (e.g. `cp_earned`, `rank_change`, `quiz_result`) emit through server WebSockets ([emitNotifications](file:///home/wsuits6/WORK/QYVORA/core/qyvora-backend/src/modules/student/controllers/student.controller.ts#L179-L181)).
   - Immediate audio/visual feedback when a room is completed (such as fireworks, confetti, and CP celebrations).
   - Public Profiles ([CompetitivePage/index.tsx](file:///home/wsuits6/WORK/QYVORA/core/qyvora-frontend/src/features/student/pages/Medal/../CompetitivePage/index.tsx)) which showcase student handles, organization affiliations, streak icons, ranks, and verified blockchain balances.
