# QYVORA Simulations — Central Reference

> **Status:** ✅ IMPLEMENTED  
> **Components:** 5 labs (all terminal-based), Terminal with 114+ commands, 12 additional simulation components  
> **Last Verified:** 2026-07-24

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
│                        │  └── Labs (5 labs)             │ │
│                        │      ├── WalkthroughLayout     │ │
│                        │      └── Terminal (breakout)   │ │
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
| `context/labContent.ts` | Lab-specific VFS injection |

**Modes:**
- `modal` — Radix Dialog overlay, centered, `rounded-2xl`
- `inline` — Embedded in page flow, `rounded-2xl overflow-hidden`

**Props:**
```ts
{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: TerminalContext;  // type: 'dashboard' | 'bootcamp' | 'course' | 'lab'
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
- All 5 lab pages — breakout terminal (primary simulation)

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

## 6. WalkthroughLayout + WalkthroughStep — Lab Framework

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
- Progress tracking
- Step locking/completion
- Flag submission

**Where used:** All 5 lab pages

---

## 7. Simulation Content Factory

**File:** `src/features/student/components/simulations/labSimulationContent.tsx`

Assembles simulation content per lab. All 5 implemented labs use the **terminal** simulation type exclusively.

| Factory Function | Lab | Simulation Types |
|-----------------|-----|-----------------|
| `createSqlInjectionSimulations()` | SQL Injection | terminal |
| `createPasswordSimulations()` | Password | terminal |
| `createOsintSimulations()` | OSINT | terminal |
| `createKillChainSimulations()` | Kill Chain | terminal |
| `createPrivescSimulations()` | Privesc | terminal |

---

## 8. Lab Simulation Registry

**File:** `src/features/student/components/simulations/labSimulations.ts`

| Lab ID | Simulation Types |
|--------|-----------------|
| `sql-injection` | terminal |
| `privesc` | terminal |
| `password` | terminal |
| `osint` | terminal |
| `kill-chain` | terminal |

---

## 9. Lab Pages

| Lab | Route | Page File |
|-----|-------|-----------|
| Hub | `/dashboard/labs` | `pages/labs/LabsPage/index.tsx` |
| SQL Injection | `/dashboard/labs/sql-injection` | `pages/labs/SqlInjectionLab/index.tsx` |
| Privesc | `/dashboard/labs/privesc` | `pages/labs/PrivescLab/index.tsx` |
| Password | `/dashboard/labs/passwords` | `pages/labs/PasswordLab/index.tsx` |
| OSINT | `/dashboard/labs/osint` | `pages/labs/OsintLab/index.tsx` |
| Kill Chain | `/dashboard/labs/kill-chain` | `pages/labs/KillChainLab/index.tsx` |

---

## 10. Simulation Data Files

**Directory:** `src/features/student/data/simulations/`

| File | Content |
|------|---------|
| `types.ts` | Shared types |
| `sql-injection-data.ts` | SQL injection targets, tables, queries |
| `privesc-scenarios.ts` | Privilege escalation scenarios |
| `password-exercises.ts` | Password hashes and wordlists |
| `osint-data.ts` | OSINT targets and modules |
| `kill-chain-data.ts` | Kill chain phases and commands |

---

## 11. Additional Simulation Components

The following simulation components exist in `src/features/student/components/simulations/` and are exported, but are **not currently wired into any of the 5 implemented labs**. They are available for use in future lab implementations:

| Component | File | Description |
|-----------|------|-------------|
| `BrowserSimulation` | `BrowserSimulation.tsx` | Chrome-like browser with URL bar, source/headers/cookies views |
| `HttpInspector` | `HttpInspector.tsx` | Burp Suite-like HTTP request/response viewer |
| `EmailClient` | `EmailClient.tsx` | Simulated email client for phishing analysis |
| `PacketViewer` | `PacketViewer.tsx` | Wireshark-like packet capture viewer |
| `FileExplorer` | `FileExplorer.tsx` | Tree-based file explorer with metadata display |
| `LogViewer` | `LogViewer.tsx` | Log file viewer with filtering |
| `SqlConsole` | `SqlConsole.tsx` | Interactive SQL console against simulated tables |
| `ApiExplorer` | `ApiExplorer.tsx` | Postman-like API explorer |
| `PasswordCracker` | `PasswordCracker.tsx` | Visual password cracking simulation |
| `NetworkTopology` | `NetworkTopology.tsx` | SVG-based network topology diagram |
| `OsintDashboard` | `OsintDashboard.tsx` | Multi-module OSINT dashboard |
| `TimelineInvestigation` | `TimelineInvestigation.tsx` | Security event timeline |

These components have full TypeScript interfaces defined in `types.ts` and are registered in the `SIMULATION_REGISTRY`, but no lab currently instantiates them.

---

## 12. Network Profiles

**File:** `src/features/student/components/simulations/networkProfiles.ts`

Profiles with realistic device configs (IPs, hostnames, OS, vendor, open ports, services).

| Profile | Used By |
|---------|---------|
| `default` | Fallback |

---

## 13. Marketing/Blog Terminals

**Files:**
- `src/shared/components/blog/Terminal.tsx` — Lightweight interactive terminal (12 commands)
- `src/shared/components/blog/IdeBlock.tsx` — VS Code-themed syntax-highlighted code block

**Where used:** Blog posts and marketing pages

---

## Component Dependency Map

```
WalkthroughLayout (all 5 labs)
├── SimulatedTerminal (breakout mode, primary simulation)
│   └── TerminalShell → engine (commands, parser, filesystem, streaming)
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
