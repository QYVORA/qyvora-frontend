# QYVORA Simulations — Central Reference

> **Status:** ✅ FULLY IMPLEMENTED  
> **Components:** 19 simulation types, 10 labs, Terminal with 114+ commands  
> **Last Verified:** 2026-07-18

All interactive simulation systems in one place.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  StudentLayout                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  SimulationProvider (global state)                │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐ │  │
│  │  │Discovery│ │ Browser │ │ Network │ │ Panel  │ │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌──────────────────┐  ┌──────────────────────────────┐ │
│  │ SimulatedTerminal │  │  Pages                      │ │
│  │ (global, Ctrl+`)  │  │  ├── CourseLessonPage        │ │
│  └──────────────────┘  │  │   ├── Terminal (inline)     │ │
│                        │  │   ├── CodePlayground        │ │
│                        │  │   └── InlineQuiz            │ │
│                        │  ├── BootcampRoomPage          │ │
│                        │  │   ├── QuizModal             │ │
│                        │  │   └── QuizGateModal         │ │
│                        │  └── Labs (10 labs)            │ │
│                        │      ├── WalkthroughLayout     │ │
│                        │      ├── SimulationPanel       │ │
│                        │      └── 13 simulation widgets │ │
│                        └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 1. SimulatedTerminal — Kali Linux Emulator

**Files:** `src/features/student/components/SimulatedTerminal/`

| File | Purpose |
|------|---------|
| `SimulatedTerminal.tsx` | Radix Dialog wrapper (modal/inline modes) |
| `TerminalShell.tsx` | Terminal UI — keyboard, rendering, persistence |
| `types.ts` | TypeScript interfaces |
| `engine/state.ts` | Input processing, pipeline execution |
| `engine/parser.ts` | Shell tokenizer (quotes, pipes, redirects, globs) |
| `engine/commands.ts` | Command registry (114+ entries) |
| `engine/filesystem.ts` | Virtual filesystem (VFS) utilities |
| `engine/streaming.ts` | Line-by-line output animation |
| `engine/handlers/*.ts` | Command implementations (7 modules) |
| `data/defaultFilesystem.ts` | Kali Linux filesystem tree |
| `context/bootcampContent.ts` | Bootcamp-specific VFS injection |
| `context/courseContent.ts` | Course-specific VFS injection |

**Modes:**
- `modal` — Radix Dialog overlay, centered, `rounded-2xl`
- `inline` — Embedded in page flow, `rounded-2xl overflow-hidden`

**Props:**
```ts
{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: TerminalContext;  // type: 'dashboard' | 'bootcamp' | 'course'
  initialCommands?: string[];
  mode?: 'modal' | 'inline';
  title?: string;
}
```

**Commands (114+):**

| Category | Commands |
|----------|----------|
| Files | `ls`, `cd`, `pwd`, `tree`, `cat`, `echo`, `touch`, `mkdir`, `rm`, `cp`, `mv`, `chmod`, `head`, `tail`, `wc`, `grep`, `find`, `sort`, `less`, `more`, `diff`, `ln`, `du`, `df`, `tar`, `zip`, `unzip`, `xxd`, `strings`, `file`, `md5sum`, `sha256sum`, `awk`, `sed`, `cut`, `uniq`, `tr`, `tee`, `xargs` |
| System | `whoami`, `id`, `uname`, `date`, `cal`, `uptime`, `hostname`, `env`, `ps`, `top`, `kill`, `sudo`, `free`, `lsof`, `crontab`, `service`, `systemctl`, `chown`, `umask`, `jobs`, `bg`, `fg`, `journalctl`, `dmesg`, `who`, `w`, `last`, `groups`, `useradd`, `usermod`, `userdel`, `passwd` |
| Network | `ping`, `curl`, `nmap`, `netstat`, `dig`, `whois`, `ss`, `traceroute`, `arp`, `ip`, `wget`, `scp`, `ssh` |
| Security | `gobuster`, `hydra`, `sqlmap`, `nikto`, `john`, `searchsploit`, `enum4linux`, `smbclient`, `crackmapexec`, `hashcat`, `exiftool`, `binwalk`, `msfconsole`, `nslookup`, `dirb`, `wfuzz`, `whatweb`, `wpscan`, `medusa`, `ncrack`, `cewl` |
| Dev | `python3`, `node`, `git`, `pip`, `apt`, `npm`, `docker`, `tmux`, `screen`, `make`, `gcc` |
| Utility | `clear`, `help`, `history`, `alias`, `export`, `exit`, `man`, `which`, `reset`, `nano`, `vi` |

**Where used:**
- `StudentLayout` — global terminal (Ctrl+` or event)
- `CourseLessonPage` — inline terminal in lessons with `hasTerminal: true`
- `NetworksPage` — modal terminal for network lab

**Docs:** `QYVORA_TERMINAL_SIMULATION_COMMANDS.md`, `docs/TERMINAL_SIMULATION.md`

---

## 2. CodePlayground — In-Browser Code Runner

**File:** `src/shared/components/courses/CodePlayground.tsx`

Simplified code editor with pattern-matched runners for Python, Bash, and JavaScript.

**Props:**
```ts
{
  initialCode: string;
  language?: 'python' | 'bash' | 'javascript';
  expectedOutput?: string;
  title?: string;
}
```

**Features:**
- Syntax-highlighted editor
- Run button with output/error display
- Expected output comparison
- Copy, reset, hint toggle

**Where used:** `CourseLessonPage` — lessons with `hasCodePlayground: true`

---

## 3. InlineQuiz — Course Lesson Quiz

**File:** `src/shared/components/courses/InlineQuiz.tsx`

Sequential multiple-choice quiz embedded in course lessons.

**Props:**
```ts
{
  questions: QuizQuestion[];  // { id, question, options[], correctIndex, explanation }
  title?: string;
  passThreshold?: number;  // default 70%
  onComplete?: (passed: boolean, score: number) => void;
}
```

**Features:**
- One question at a time with progress bar
- Results screen with explanations
- Retry on failure

**Where used:** `CourseLessonPage` — lessons with `quiz` data

---

## 4. QuizModal — Bootcamp Room Quiz

**File:** `src/features/student/components/bootcamp-room/QuizModal.tsx`

Full-screen modal quiz submitted to backend API.

**Props:**
```ts
{
  moduleId: string;
  roomId: string;
  courseId: string;
  onClose: () => void;
  onPassed: () => void;
}
```

**Features:**
- Backend scoring via `POST /student/quiz`
- CP reward on pass
- Answer review on failure
- All questions displayed at once

**Where used:** `BootcampRoomPage` — room completion flow

---

## 5. QuizGateModal — Quiz Gate Prompt

**File:** `src/features/student/components/bootcamp-room/QuizGateModal.tsx`

Interstitial blocking modal when quiz not yet taken.

**Where used:** `BootcampRoomPage` — blocks completion until quiz taken

---

## 6. SimulationPanel — Tabbed Simulation Container

**File:** `src/features/student/components/simulations/SimulationPanel.tsx`

Tabbed container rendering multiple simulation components with expand/collapse.

**Props:**
```ts
{
  simulations: { type: SimulationType; content: ReactNode }[];
  defaultHeight?: string;  // default 'h-[400px]'
}
```

**Features:**
- Tab switching between simulation types
- Maximize/minimize toggle
- Uses `SIMULATION_REGISTRY` for tab labels/icons

**Where used:** `WalkthroughLayout` — all lab pages

---

## 7. SimulationContext — Global State Provider

**File:** `src/features/student/components/simulations/SimulationContext.tsx`

Provides 4 sub-contexts:

| Context | Purpose | Persistence |
|---------|---------|-------------|
| Discovery | Discovered IPs/hostnames | localStorage |
| Panel | Active sim types, open sim | — |
| Network | Active `NetworkProfile` | — |
| Browser | Simulated browser state | — |

**Hooks:** `useSimulation()`, `useDiscovery()`, `useSimulationPanel()`, `useNetworkProfile()`, `useBrowserSim()`

**Where used:** `StudentLayout` — wraps entire student area

---

## 8. BrowserSimulation — Fake Web Browser

**File:** `src/features/student/components/simulations/BrowserSimulation.tsx`

Chrome-like browser with URL bar, navigation, rendered HTML, source/headers/cookies views.

**Props:**
```ts
{
  pages: BrowserPage[];  // { url, title, html, headers, cookies, hiddenElements }
  defaultUrl?: string;
}
```

**Features:**
- Window chrome (dots, lock icon)
- Back/forward/refresh
- Toggle: page source, HTTP headers, cookies (with HttpOnly/Secure flags)

**Where used:** SQL Injection, Web Exploitation, OSINT, Phishing labs

---

## 9. HttpInspector — HTTP Proxy Inspector

**File:** `src/features/student/components/simulations/HttpInspector.tsx`

Burp Suite-like HTTP request/response viewer.

**Props:**
```ts
{
  requests: HttpRequest[];  // { method, url, headers, body, response }
}
```

**Features:**
- Request list sidebar with color-coded methods
- Request/response split view
- Edit mode for request body
- Replay button
- Status code color coding

**Where used:** SQL Injection, Web Exploitation, Proxy labs

---

## 10. SqlConsole — SQL Injection Simulator

**File:** `src/features/student/components/simulations/SqlConsole.tsx`

Interactive SQL console against simulated database tables.

**Props:**
```ts
{
  tables: SqlTable[];  // { name, columns[], rows[] }
  predefinedQueries?: { query: string; description: string }[];
}
```

**Features:**
- Query editor with Run button
- UNION-based injection simulation
- Results in table format with timing
- Query history (last 5, clickable)

**Where used:** SQL Injection Lab

---

## 11. EmailClient — Phishing Email Simulator

**File:** `src/features/student/components/simulations/EmailClient.tsx`

Simulated email client for phishing analysis.

**Props:**
```ts
{
  emails: SimEmail[];  // { from, to, subject, body, isPhishing, indicators[], headers[], attachments[] }
}
```

**Features:**
- Inbox list with phishing warning icons
- Email detail view
- Raw email headers toggle
- Phishing indicators (low/medium/high severity)
- Attachments display

**Where used:** Phishing Lab

---

## 12. PacketViewer — Network Packet Analyzer

**File:** `src/features/student/components/simulations/PacketViewer.tsx`

Wireshark-like packet capture viewer.

**Props:**
```ts
{
  packets: SimPacket[];  // { number, time, src, dst, protocol, length, info, flags, payload, layers[] }
}
```

**Features:**
- Filter by protocol/source/destination
- Color-coded protocol badges (TCP=blue, UDP=green, HTTP=yellow, DNS=purple, ARP=orange)
- Layer-by-layer field inspection
- Payload view

**Where used:** Traffic, Proxy, Wireless, Kill Chain labs

---

## 13. FileExplorer — File System Browser

**File:** `src/features/student/components/simulations/FileExplorer.tsx`

Tree-based file explorer with metadata display.

**Props:**
```ts
{
  files: SimFile[];  // recursive: { name, type, size, modified, permissions, content, hash, children[] }
}
```

**Features:**
- Collapsible directory tree
- Detail pane: type, size, permissions, hash, content
- Size formatting (B/KB/MB)

**Where used:** Password, Privesc, Kill Chain labs

---

## 14. LogViewer — System Log Analyzer

**File:** `src/features/student/components/simulations/LogViewer.tsx`

Log file viewer with filtering.

**Props:**
```ts
{
  sources: SimLogSource[];  // { id, label, entries[] { timestamp, level, source, message } }
}
```

**Features:**
- Source tab switching
- Search by message/source
- Level filters (info/warn/error/debug)
- Severity-coded icons

**Where used:** Traffic, Kill Chain, Privesc labs

---

## 15. ApiExplorer — REST API Tester

**File:** `src/features/student/components/simulations/ApiExplorer.tsx`

Postman-like API explorer.

**Props:**
```ts
{
  endpoints: ApiEndpoint[];  // { id, method, path, description, headers, body, response }
}
```

**Features:**
- Endpoint list with color-coded methods
- Request/response split view
- Editable request body
- Send button with timing

**Where used:** Web Exploitation Lab

---

## 16. PasswordCracker — Brute-Force Simulator

**File:** `src/features/student/components/simulations/PasswordCracker.tsx`

Visual password cracking simulation.

**Props:**
```ts
{
  hashes: PasswordHash[];  // { hash, algorithm, salt, plaintext }
  wordlist: string[];
}
```

**Features:**
- Hash algorithm tab selector
- Start/Stop/Reset controls
- Progress bar with percentage
- Real-time attempt log (last 30 entries)
- 80ms interval per attempt

**Where used:** Password Lab

---

## 17. OsintDashboard — OSINT Hub

**File:** `src/features/student/components/simulations/OsintDashboard.tsx`

Multi-module OSINT dashboard.

**Props:**
```ts
{
  modules: OsintModule[];  // { id, type, label, query, result }
}
```

**Modules:** WHOIS, DNS, Metadata, Social, Images, Search, Timeline

**Where used:** OSINT Lab

---

## 18. NetworkTopology — Network Map

**File:** `src/features/student/components/simulations/NetworkTopology.tsx`

SVG-based network topology diagram.

**Props:**
```ts
{
  nodes: TopologyNode[];  // { id, label, type, ip, x, y, discovered }
  links: TopologyLink[];  // { from, to, label, discovered }
}
```

**Features:**
- Device type icons (router, switch, server, firewall, workstation, printer, IoT)
- Auto-discovery via `useDiscovery()` context
- Undiscovered nodes shown as "???"
- Legend bar

**Where used:** Wireless, Kill Chain labs

---

## 19. TimelineInvestigation — Event Timeline

**File:** `src/features/student/components/simulations/TimelineInvestigation.tsx`

Security event timeline for incident analysis.

**Props:**
```ts
{
  events: TimelineEvent[];  // { id, timestamp, title, description, category, severity, relatedEvents[] }
}
```

**Features:**
- Severity-colored dots
- Category filters (network/process/file/auth/dns/email)
- Detail panel with related event navigation
- Sequence verification exercise

**Where used:** Kill Chain Lab

---

## 20. ProgressiveHints — Tiered Hint System

**File:** `src/features/student/components/simulations/ProgressiveHints.tsx`

4-level progressive hint reveal.

**Props:**
```ts
{
  hints: ProgressiveHint[];  // { level: 1-4, content: string }
  maxLevel?: 1 | 2 | 3 | 4;
}
```

**Where used:** WalkthroughStep — all lab walkthroughs

---

## 21. WalkthroughLayout + WalkthroughStep — Lab Framework

**Files:** `src/shared/components/walkthrough/`

Structured step-by-step lab exercise framework.

**WalkthroughLayout props:**
```ts
{
  title, subtitle, icon, difficulty;
  labId, scenarioId;
  simulations?: SimulationContent[];
  children: WalkthroughStep[];
}
```

**WalkthroughStep props:**
```ts
{
  stepIndex, title, narrative, hint;
  progressiveHints?: ProgressiveHintLevel[];
  commandInstruction?: string;
  mission, objectives[], evidence[], reflection;
  flagId, labId, onFlagSubmit, onComplete;
}
```

**Features:**
- Connection panel (connect/disconnect lab machine)
- Simulation panel with tabs
- Progress tracking
- Step locking/completion
- Flag submission

**Where used:** All 10 lab pages

---

## 22. Simulation Content Factory

**File:** `src/features/student/components/simulations/labSimulationContent.tsx`

Assembles simulation panels per lab type.

| Factory Function | Lab | Simulations |
|-----------------|-----|-------------|
| `createSqlInjectionSimulations()` | SQL Injection | SqlConsole, BrowserSimulation |
| `createWebExploitationSimulations()` | Web Exploitation | BrowserSimulation, HttpInspector, ApiExplorer |
| `createPhishingSimulations()` | Phishing | EmailClient |
| `createPasswordSimulations()` | Password | PasswordCracker, FileExplorer |
| `createOsintSimulations()` | OSINT | OsintDashboard, BrowserSimulation |
| `createTrafficSimulations()` | Traffic | PacketViewer, LogViewer |
| `createProxySimulations()` | Proxy | HttpInspector |
| `createWirelessSimulations()` | Wireless | NetworkTopology, PacketViewer |
| `createKillChainSimulations()` | Kill Chain | TimelineInvestigation, NetworkTopology, LogViewer |
| `createPrivescSimulations()` | Privesc | FileExplorer, LogViewer |

---

## 23. Lab Simulation Registry

**File:** `src/features/student/components/simulations/labSimulations.ts`

| Lab ID | Simulation Types |
|--------|-----------------|
| `sql-injection` | sql-console, browser, http-inspector |
| `web-exploitation` | browser, http-inspector, api-explorer |
| `privesc` | file-explorer, log-viewer |
| `password` | password-cracker, file-explorer |
| `phishing` | email-client, browser |
| `osint` | osint-dashboard, browser |
| `kill-chain` | network-topology, packet-viewer, file-explorer, timeline-investigation |
| `proxy` | http-inspector, packet-viewer |
| `traffic` | packet-viewer, log-viewer |
| `wireless` | network-topology, packet-viewer |

---

## 24. Network Profiles

**File:** `src/features/student/components/simulations/networkProfiles.ts`

6 profiles with realistic device configs (IPs, hostnames, OS, vendor, open ports, services).

| Profile | Used By |
|---------|---------|
| `default` | Fallback |
| `networking` | — |
| `web-exploitation` | Web Exploitation Lab |
| `sql-injection` | SQL Injection Lab |
| `proxy-traffic` | Proxy, Traffic labs |
| `kill-chain` | Kill Chain Lab |

---

## 25. Simulation Data Files

**Directory:** `src/features/student/data/simulations/`

| File | Content |
|------|---------|
| `types.ts` | Shared types |
| `sql-injection-data.ts` | SQL injection targets, tables, queries |
| `web-app-data.ts` | Vulnerable web app simulation |
| `privesc-scenarios.ts` | Privilege escalation scenarios |
| `phishing-data.ts` | Phishing emails with indicators |
| `password-exercises.ts` | Password hashes and wordlists |
| `osint-data.ts` | OSINT targets and modules |
| `traffic-data.ts` | Network packet captures |
| `proxy-data.ts` | HTTP proxy data |
| `wireless-data.ts` | Wireless access points |
| `kill-chain-data.ts` | Kill chain phases and commands |

---

## 26. Lab Pages

| Lab | Route | Page File |
|-----|-------|-----------|
| Hub | `/dashboard/labs` | `pages/labs/LabsPage/index.tsx` |
| SQL Injection | `/dashboard/labs/sql-injection` | `pages/labs/SqlInjectionLab/index.tsx` |
| Web Exploitation | `/dashboard/labs/web-exploitation` | `pages/labs/WebExploitationLab/index.tsx` |
| Privesc | `/dashboard/labs/privesc` | `pages/labs/PrivescLab/index.tsx` |
| Password | `/dashboard/labs/passwords` | `pages/labs/PasswordLab/index.tsx` |
| Phishing | `/dashboard/labs/phishing` | `pages/labs/PhishingLab/index.tsx` |
| OSINT | `/dashboard/labs/osint` | `pages/labs/OsintLab/index.tsx` |
| Proxy | `/dashboard/labs/proxy` | `pages/labs/ProxyLab/index.tsx` |
| Traffic | `/dashboard/labs/traffic` | `pages/labs/TrafficLab/index.tsx` |
| Wireless | `/dashboard/labs/wireless` | `pages/labs/WirelessLab/index.tsx` |
| Kill Chain | `/dashboard/labs/kill-chain` | `pages/labs/KillChainLab/index.tsx` |

---

## 27. Marketing/Blog Terminals

**Files:**
- `src/shared/components/blog/Terminal.tsx` — Lightweight interactive terminal (12 commands)
- `src/shared/components/blog/IdeBlock.tsx` — VS Code-themed syntax-highlighted code block

**Where used:** Blog posts and marketing pages

---

## Component Dependency Map

```
WalkthroughLayout
├── SimulationPanel
│   ├── BrowserSimulation ─────┐
│   ├── HttpInspector ─────────┤
│   ├── SqlConsole ────────────┤
│   ├── EmailClient ───────────┤  All read from
│   ├── PacketViewer ──────────┤  SimulationContext
│   ├── FileExplorer ──────────┤  (Discovery, Browser,
│   ├── LogViewer ─────────────┤   Network, Panel)
│   ├── ApiExplorer ───────────┤
│   ├── PasswordCracker ───────┤
│   ├── OsintDashboard ────────┤
│   ├── NetworkTopology ───────┤
│   ├── TimelineInvestigation ─┘
│   └── ProgressiveHints
├── WalkthroughStep
│   └── Flag submission → useLabConnection
└── LabConnectButton → useLabConnection → API

CourseLessonPage
├── SimulatedTerminal (inline)
├── CodePlayground
└── InlineQuiz

BootcampRoomPage
├── QuizGateModal
└── QuizModal → POST /student/quiz
```
