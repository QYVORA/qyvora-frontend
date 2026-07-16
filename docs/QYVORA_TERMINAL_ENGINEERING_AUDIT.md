# QYVORA Terminal Simulation — Engineering Audit Report

**Audit Date:** July 16, 2026  
**Scope:** Complete source code of the SimulatedTerminal subsystem  
**Baseline:** Every statement is backed by direct source code inspection  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Overview](#2-project-overview)
3. [Architecture Review](#3-architecture-review)
4. [Complete Command Audit](#4-complete-command-audit)
5. [Linux Compatibility Review](#5-linux-compatibility-review)
6. [Shell Feature Audit](#6-shell-feature-audit)
7. [Error Handling Audit](#7-error-handling-audit)
8. [Exit Code Audit](#8-exit-code-audit)
9. [Virtual Filesystem Audit](#9-virtual-filesystem-audit)
10. [Session State Audit](#10-session-state-audit)
11. [Command Integration Audit](#11-command-integration-audit)
12. [Interactive Command Audit](#12-interactive-command-audit)
13. [Network Simulation Audit](#13-network-simulation-audit)
14. [Streaming System Audit](#14-streaming-system-audit)
15. [Performance Audit](#15-performance-audit)
16. [Security & Stability Audit](#16-security--stability-audit)
17. [Testability Review](#17-testability-review)
18. [Kali Tool Coverage](#18-kali-tool-coverage)
19. [Engineering Quality Assessment](#19-engineering-quality-assessment)
20. [Final Conclusions & Roadmap](#20-final-conclusions--roadmap)

---

## 1. Executive Summary

The QYVORA Terminal Simulation is a **client-side, in-browser terminal emulator** built as a React component within the QYVORA frontend. It simulates a Kali Linux terminal environment for educational cybersecurity training. The simulator provides a virtual filesystem, 100+ commands, a fake network topology, streaming output for security tools, and context-aware file injection for bootcamp and course scenarios.

### Overall Maturity

The simulator is at an **early-to-mid maturity** level. It delivers a convincing surface-level experience for educational purposes but contains significant architectural shortcuts, missing Linux behaviors, and incomplete implementations that would be problematic at scale. The core architecture is sound (immutable VFS, linked-list parser, streaming system), but execution quality varies significantly across handler files.

### Major Strengths

- **Comprehensive command set** — 114 registered command names covering 7 categories
- **Innovative streaming system** — AsyncGenerator-based progressive output with per-tool timing profiles
- **Progressive network discovery** — IP discovery state shared across ping, nmap, arp, and other tools
- **Context-aware VFS** — Bootcamp and course content injected dynamically based on user context
- **Rich keyboard shortcuts** — Full Ctrl+A/E/U/K/W/L/C/D/R, reverse history search, tab completion
- **Kali Linux visual theme** — Authentic color scheme, prompt format, and tool banners
- **Persistence** — Terminal state survives page reloads via localStorage
- **Network simulation** — 15-device fake subnet with discoverable/hidden hosts, per-device port data

### Major Weaknesses

- **Mutating shared VFS nodes** — Handlers directly mutate `parent.children` (push/filter) instead of using the immutable API, breaking the VFS's immutability contract
- **Stub security tools** — All 13 security tools return canned output; `msfconsole` sets mode but processes no subsequent commands
- **No test coverage** — Zero automated tests exist for the entire SimulatedTerminal
- **Flat command registration** — All 100+ commands in a single `Record<string, CommandHandler>` with no lazy loading, categorization metadata, or registration API
- **Duplicated dispatch logic** — `executeCommandInternal` and `executeCommand` in `commands.ts` both perform command lookup, glob expansion, and variable expansion independently
- **No permission enforcement** — `chmod` accepts only `+x`; file permissions are cosmetic only; no read/write permission checks
- **Missing core Linux features** — No `-p` for mkdir, no `-i` for cp/mv, no stdin piping for most commands, no process substitution, no `eval`, no `test`/`[` builtin
- **Interactive commands are static** — `python3`, `node`, `less`, `top` return fixed output with no actual interactivity
- **`sudo` never succeeds** — Without a mechanism to set `isRoot`, sudo always fails
- **No CI/CD** — No automated testing or deployment pipeline

### Overall Engineering Quality

**52/100** — The simulator achieves its educational goal reasonably well but has structural issues that will compound with growth. The VFS mutability bug alone is a correctness issue that affects every file-manipulating command.

### Readiness for Future Expansion

**Low-Medium** — Adding 250+ commands to the current architecture would be painful. The flat command map, duplicated dispatch, handler file organization, and lack of abstraction for common patterns (flag parsing, file resolution, error formatting) would create severe maintenance burden.

---

## 2. Project Overview

### Purpose

The QYVORA Terminal Simulation is an in-browser terminal emulator designed to provide students with a realistic Kali Linux command-line experience for cybersecurity education. It is embedded within the QYVORA bootcamp platform as a React component.

### Current Scope

- 114 registered command names (102 unique handlers, 5 aliases)
- Virtual filesystem mimicking Kali Linux directory structure
- Fake 10.0.0.0/24 network with 15 devices (10 discoverable, 5 hidden)
- Streaming output for 18 network/security commands
- Context-aware file injection for 5 bootcamp phases (4 rooms each)
- Full keyboard shortcuts including reverse history search and tab completion
- LocalStorage persistence across page reloads
- Modal and inline display modes with fullscreen toggle

### Intended Educational Goals

- Teach Linux command-line navigation and file operations
- Simulate reconnaissance workflows (nmap, dig, whois, arp)
- Demonstrate exploitation tools (gobuster, hydra, sqlmap, nikto)
- Practice password cracking workflows (john, hashcat)
- Familiarize students with development tools (git, python, docker, apt)
- Provide guided tutorials for terminal beginners

### Supported OS Simulation

The simulator targets **Kali Linux 2024.1** based on:
- `/etc/os-release` content: `PRETTY_NAME="Kali GNU/Linux Rolling"`, `VERSION_ID="2024.1"` (file: `defaultFilesystem.ts:66`)
- Kernel string: `Linux kali 6.8.0-kali1-amd64` (file: `handlers/system.ts:17`)
- Python version: `3.11.8` (file: `handlers/dev.ts:5`)
- Node.js version: `v20.11.1` (file: `handlers/dev.ts:22`)
- Nmap version: `7.94SVN` (file: `handlers/network.ts:168`)
- Metasploit version: `v6.4.0-dev` (file: `handlers/security.ts:360`)

### Architecture Philosophy

The system follows a **pure functional pipeline** architecture:
1. User input → parser → execution plan
2. Execution plan → command handlers → result with optional state override
3. State override → immutable state update
4. Result → optional streaming → terminal UI

The VFS is designed as an immutable tree (every mutation returns a new root), though this contract is violated by several handlers.

### Main Subsystems

| Subsystem | Files | Lines | Purpose |
|-----------|-------|-------|---------|
| UI Shell | `SimulatedTerminal.tsx`, `TerminalShell.tsx` | 716 | Rendering, keyboard, persistence, streaming |
| Parser | `engine/parser.ts` | 279 | Tokenization, variable expansion, globbing, sequence execution |
| VFS | `engine/filesystem.ts` | 171 | Path resolution, node CRUD, tree traversal |
| State | `engine/state.ts` | 196 | Initial state, input processing, prompt generation |
| Commands | `engine/commands.ts` | 228 | Command registry, dispatch, fallback handling |
| Streaming | `engine/streaming.ts` | 94 | Timing profiles, async output generator |
| Handlers | `engine/handlers/*.ts` | 2,473 | 102 command implementations across 7 files |
| Network Data | `data/fakeNetwork.ts` | 336 | Network topology, device definitions, resolution |
| Default VFS | `data/defaultFilesystem.ts` | 77 | Boot filesystem tree |
| Context Injection | `context/*.ts` | 218 | Bootcamp and course file injection |
| Types | `types.ts` | 103 | All TypeScript interfaces |

**Total: ~5,593 lines across 21 source files.**

---

## 3. Architecture Review

### Folder Structure

```
SimulatedTerminal/
├── SimulatedTerminal.tsx      (93 lines)  — Radix Dialog wrapper, modal/inline modes
├── TerminalShell.tsx          (623 lines) — Full UI: rendering, keyboard, streaming, persistence
├── types.ts                   (103 lines) — All TypeScript interfaces
├── index.ts                   (3 lines)   — Public exports
├── engine/
│   ├── commands.ts            (228 lines) — Command registry + dispatch
│   ├── parser.ts              (279 lines) — Tokenizer, parser, var expansion, globbing
│   ├── state.ts               (196 lines) — State creation, processInput, prompt
│   ├── filesystem.ts          (171 lines) — VFS primitives
│   ├── streaming.ts           (94 lines)  — Timing profiles + async generator
│   └── handlers/
│       ├── index.ts           (23 lines)  — Re-exports
│       ├── navigation.ts      (104 lines) — ls, cd, pwd, tree
│       ├── files.ts           (567 lines) — 31 file operations
│       ├── system.ts          (276 lines) — 22 system commands
│       ├── network.ts         (551 lines) — 13 network commands
│       ├── security.ts        (370 lines) — 13 security tools
│       ├── dev.ts             (192 lines) — 11 development tools
│       └── utility.ts         (313 lines) — 14 meta/utility commands
├── data/
│   └── defaultFilesystem.ts   (77 lines)  — Boot VFS
└── context/
    ├── bootcampContent.ts     (154 lines) — Bootcamp file injection
    └── courseContent.ts       (64 lines)  — Course file injection
```

Supporting data file (outside SimulatedTerminal directory):
- `qyvora-frontend/src/features/student/data/fakeNetwork.ts` (336 lines)

### Module Organization

**Strengths:**
- Clean separation between engine (logic) and UI (rendering)
- Handler files grouped by category
- Types centralized in a single file
- Streaming system fully decoupled from command implementations

**Weaknesses:**
- `TerminalShell.tsx` at 623 lines is a monolith handling rendering, keyboard shortcuts, streaming orchestration, persistence, tab completion, reverse search, and state management
- `files.ts` at 567 lines contains 31 commands with no sub-grouping
- Network handler imports reach outside the SimulatedTerminal directory (`@/features/student/data/fakeNetwork`)
- `commands.ts` contains inline handler definitions for `ifconfig`, `ip`, and `tcpdump` (lines 119-142) instead of placing them in appropriate handler files

### Command Registration

Commands are registered in a flat `Record<string, CommandHandler>` object (`commands.ts:7-143`). Every command name maps directly to a handler function. There is:

- No registration API or decorator pattern
- No command metadata (description, category, flags, syntax)
- No lazy loading
- No dynamic registration
- No alias system at the registry level (aliases like `python`→`python3` are separate map entries pointing to the same function)

### Parser Architecture

**File:** `engine/parser.ts` (279 lines)

The parser is a **recursive-descent operator-precedence parser** producing a linked list of `ParsedSequence` nodes.

**Capabilities:**
- Single and double quote handling (`'...'`, `"..."`)
- Backslash escape sequences
- Variable expansion (`$VAR`, `$?`)
- History expansion (`!!`, `!N`)
- Glob expansion (`*`, `?`, `[...]`)
- Pipes (`|`) with recursive chain parsing
- Logical operators (`&&`, `||`)
- Sequential execution (`;`)
- Output redirection (`>`, `>>`)
- Input redirection (`<`)

**Limitations:**
- `&&` and `||` are split at the top level only — they do not nest correctly within pipe chains
- No heredoc support (`<<EOF`)
- No process substitution (`<()`, `>()`)
- No command substitution (`` `command` `` or `$(command)`)
- No arithmetic expansion (`$((...))`)
- No brace expansion (`{a,b,c}`)
- Glob expansion excludes dotfiles even with `*` patterns unless the pattern starts with `.`

### Handler Architecture

Each handler is a function with signature `(args: string[], state: TerminalState) => CommandResult`. Handlers return:

- `output: string` — stdout
- `error?: string` — stderr
- `exitCode: number` — exit status
- `stateOverride?: Partial<TerminalState>` — state mutations
- `streamLines?: string[]` — lines for streaming
- `clearLine?: boolean` — clear terminal display
- `exit?: boolean` — close terminal

**No handler base class or shared utilities exist** for common patterns like:
- Parsing flags from args
- Resolving file paths from args
- Reading file content with error handling
- Formatting error messages

### State Management

**File:** `engine/state.ts` (196 lines)

State is managed through an immutable pattern where commands return `stateOverride` objects that are shallow-merged into the current state:

```typescript
if (result._stateOverride) {
  newState = { ...currentState, ...result._stateOverride };
}
```

**Issues:**
- Shallow merge means nested objects (like `env`, `aliases`) must be fully replaced by handlers — no deep merge
- `root` (the VFS) is replaced wholesale when any file operation occurs, even though most handlers mutate `root.children` in-place before returning it
- `discoveredIps` is an array that must be replaced entirely for each discovery

### Virtual Filesystem Architecture

**File:** `engine/filesystem.ts` (171 lines)

The VFS is a **tree of `VFSNode` objects** where each node has:
- `type: 'file' | 'dir'`
- `name: string`
- `content?: string`
- `permissions: string` (Unix-style)
- `owner: string`, `group: string`
- `size: number`
- `children: VFSNode[]`
- `executable?: boolean`

**Design intent:** Pure immutable tree — all mutations return new nodes via spread operators.

**Critical violation:** Most command handlers directly mutate VFS nodes:
- `touch` (line 42): `parent.children.push(newFile)`
- `mkdir` (line 65): `parent.children.push(newDir)`
- `rm` (line 90): `parent.children = parent.children.filter(...)`
- `cp` (line 113): `destParent.children.push(copy)`
- `mv` (lines 127, 136): `srcParent.children.filter(...)` and `destParent.children.push(moved)`
- `chmod` (lines 147-150): `node.executable = true; node.permissions = ...`
- `chown` (lines 228-229): `node.owner = owner; node.group = group`

These mutations affect the shared `state.root` reference directly, bypassing the immutable update pattern. The `stateOverride: { root: currentRoot }` is redundant because `currentRoot` is the same object as `state.root`.

**`updateNodeAtPath`** (lines 104-155) exists but is never used by any command handler. It implements proper immutable updates via recursive tree reconstruction.

### Network Simulation Architecture

**File:** `data/fakeNetwork.ts` (336 lines) + `engine/handlers/network.ts` (551 lines)

A 15-device simulated `10.0.0.0/24` subnet with:
- Device IPs, MACs, hostnames, OS, vendor, ports, discoverable flags
- Helper functions: `resolveTarget`, `getDeviceByIp`, `getDeviceByHostname`, `isInSubnet`, etc.
- Progressive discovery: `state.discoveredIps` starts empty, populated by `ping` and `nmap`
- Custom event dispatch: `qyvora:ip-discovered` for UI reactions

**Shared network state** is managed through `state.discoveredIps` — all network tools read this array to determine what is visible.

### Streaming Architecture

**File:** `engine/streaming.ts` (94 lines)

An `AsyncGenerator`-based streaming system with:
- 18 per-command timing profiles with startup delays, line delays, jitter, and batch modes
- Three modes: `instant` (0ms), `line` (per-line yield), `batched` (N-line batches)
- Abort signal for Ctrl+C cancellation
- Random jitter within `[base, base+jitter]` ranges

### Rendering Flow

1. `TerminalShell.tsx` renders `TerminalLine[]` array
2. Each line is styled based on `type`: `input` (green), `output` (gray), `error` (red), `system` (dim)
3. Output lines are split by `\n`; lines ending in `/` render blue (directories), lines ending in `*` render green (executables)
4. During streaming, the last output line is progressively replaced with growing content
5. A blinking cursor block is shown during streaming instead of the input prompt

### Shared Utilities

There are **no shared utility functions** across handler files. Each handler independently:
- Parses its own flags
- Resolves file paths
- Reads file content
- Formats error messages
- Returns results

The `fakeHash` function in `files.ts` (line 426) is the only shared utility, used by `md5sum` and `sha256sum`.

### Dependency Relationships

```
SimulatedTerminal.tsx
  └── TerminalShell.tsx
        ├── engine/state.ts
        │     ├── engine/parser.ts
        │     │     └── engine/filesystem.ts
        │     ├── engine/commands.ts
        │     │     └── engine/handlers/* (all 7 files)
        │     └── engine/streaming.ts
        ├── engine/streaming.ts
        ├── context/bootcampContent.ts
        ├── context/courseContent.ts
        └── data/fakeNetwork.ts (external dependency)
```

**External dependency:** `network.ts` imports from `@/features/student/data/fakeNetwork` — outside the SimulatedTerminal boundary.

### Architecture Issues Summary

| Issue | Severity | Location |
|-------|----------|----------|
| VFS mutability violation | Critical | `files.ts`, `system.ts` handlers |
| Duplicated dispatch logic | High | `commands.ts` (`executeCommandInternal` vs `executeCommand`) |
| Monolithic UI component | High | `TerminalShell.tsx` (623 lines) |
| No command abstraction | Medium | All 102 handlers |
| No flag parsing utility | Medium | All 102 handlers |
| External import | Low | `network.ts` → `fakeNetwork.ts` |
| Inline handlers | Low | `commands.ts:119-142` |
| Unused `updateNodeAtPath` | Low | `filesystem.ts:104-155` |
| Unused `nodeAtPath` | Low | `filesystem.ts:91-102` (duplicate of `findNode`) |
| Unused `getPathComponents` | Low | `filesystem.ts:157-159` |
| Unused `isSubPath` | Low | `filesystem.ts:161-166` |
| Unused `getFileExtension` | Low | `filesystem.ts:168-171` |

### Assessments

| Dimension | Score | Notes |
|-----------|-------|-------|
| Maintainability | 5/10 | Large handler files, no abstractions, monolithic UI |
| Scalability | 3/10 | Flat command map, no lazy loading, duplicated dispatch |
| Modularity | 6/10 | Engine/UI separation is good, but handler files lack structure |
| Extensibility | 4/10 | No registration API, no shared utilities, no command metadata |

---

## 4. Complete Command Audit

### Command Registration Map

114 names registered in `commandMap` (`commands.ts:7-143`):

| # | Command | Category | Handler File | Classification |
|---|---------|----------|-------------|----------------|
| 1 | `ls` | Navigation | `navigation.ts` | Partially implemented |
| 2 | `cd` | Navigation | `navigation.ts` | Partially implemented |
| 3 | `pwd` | Navigation | `navigation.ts` | Fully implemented |
| 4 | `tree` | Navigation | `navigation.ts` | Partially implemented |
| 5 | `cat` | Files | `files.ts` | Partially implemented |
| 6 | `echo` | Files | `files.ts` | Partially implemented |
| 7 | `touch` | Files | `files.ts` | Partially implemented |
| 8 | `mkdir` | Files | `files.ts` | Partially implemented |
| 9 | `rm` | Files | `files.ts` | Partially implemented |
| 10 | `cp` | Files | `files.ts` | Partially implemented |
| 11 | `mv` | Files | `files.ts` | Partially implemented |
| 12 | `chmod` | Files | `files.ts` | Stub implementation |
| 13 | `head` | Files | `files.ts` | Partially implemented |
| 14 | `tail` | Files | `files.ts` | Partially implemented |
| 15 | `wc` | Files | `files.ts` | Partially implemented |
| 16 | `grep` | Files | `files.ts` | Partially implemented |
| 17 | `find` | Files | `files.ts` | Partially implemented |
| 18 | `sort` | Files | `files.ts` | Partially implemented |
| 19 | `less` | Files | `files.ts` | Stub implementation |
| 20 | `more` | Files | `files.ts` | Alias of `less` |
| 21 | `diff` | Files | `files.ts` | Partially implemented |
| 22 | `ln` | Files | `files.ts` | Stub implementation |
| 23 | `du` | Files | `files.ts` | Partially implemented |
| 24 | `df` | Files | `files.ts` | Simulator-specific |
| 25 | `tar` | Files | `files.ts` | Stub implementation |
| 26 | `zip` | Files | `files.ts` | Stub implementation |
| 27 | `unzip` | Files | `files.ts` | Stub implementation |
| 28 | `xxd` | Files | `files.ts` | Partially implemented |
| 29 | `strings` | Files | `files.ts` | Partially implemented |
| 30 | `file` | Files | `files.ts` | Partially implemented |
| 31 | `md5sum` | Files | `files.ts` | Simulator-specific |
| 32 | `sha256sum` | Files | `files.ts` | Simulator-specific |
| 33 | `awk` | Files | `files.ts` | Partially implemented |
| 34 | `sed` | Files | `files.ts` | Partially implemented |
| 35 | `cut` | Files | `files.ts` | Partially implemented |
| 36 | `uniq` | Files | `files.ts` | Partially implemented |
| 37 | `tr` | Files | `files.ts` | Partially implemented |
| 38 | `whoami` | System | `system.ts` | Fully implemented |
| 39 | `id` | System | `system.ts` | Simulator-specific |
| 40 | `uname` | System | `system.ts` | Partially implemented |
| 41 | `date` | System | `system.ts` | Partially implemented |
| 42 | `cal` | System | `system.ts` | Partially implemented |
| 43 | `uptime` | System | `system.ts` | Simulator-specific |
| 44 | `hostname` | System | `system.ts` | Fully implemented |
| 45 | `env` | System | `system.ts` | Fully implemented |
| 46 | `ps` | System | `system.ts` | Simulator-specific |
| 47 | `top` | System | `system.ts` | Stub implementation |
| 48 | `kill` | System | `system.ts` | Stub implementation |
| 49 | `sudo` | System | `system.ts` | Stub implementation |
| 50 | `free` | System | `system.ts` | Simulator-specific |
| 51 | `lsof` | System | `system.ts` | Simulator-specific |
| 52 | `crontab` | System | `system.ts` | Simulator-specific |
| 53 | `service` | System | `system.ts` | Simulator-specific |
| 54 | `systemctl` | System | `system.ts` | Simulator-specific |
| 55 | `chown` | System | `system.ts` | Stub implementation |
| 56 | `umask` | System | `system.ts` | Stub implementation |
| 57 | `jobs` | System | `system.ts` | Stub implementation |
| 58 | `bg` | System | `system.ts` | Stub implementation |
| 59 | `fg` | System | `system.ts` | Stub implementation |
| 60 | `ping` | Network | `network.ts` | Simulator-specific |
| 61 | `curl` | Network | `network.ts` | Simulator-specific |
| 62 | `nmap` | Network | `network.ts` | Simulator-specific |
| 63 | `netstat` | Network | `network.ts` | Simulator-specific |
| 64 | `dig` | Network | `network.ts` | Simulator-specific |
| 65 | `whois` | Network | `network.ts` | Simulator-specific |
| 66 | `ss` | Network | `network.ts` | Simulator-specific |
| 67 | `traceroute` | Network | `network.ts` | Simulator-specific |
| 68 | `arp` | Network | `network.ts` | Simulator-specific |
| 69 | `route` | Network | `network.ts` | Simulator-specific |
| 70 | `wget` | Network | `network.ts` | Simulator-specific |
| 71 | `scp` | Network | `network.ts` | Simulator-specific |
| 72 | `ssh` | Network | `network.ts` | Simulator-specific |
| 73 | `ifconfig` | Network | `commands.ts` (inline) | Simulator-specific |
| 74 | `ip` | Network | `commands.ts` (inline) | Simulator-specific |
| 75 | `tcpdump` | Network | `commands.ts` (inline) | Simulator-specific |
| 76 | `gobuster` | Security | `security.ts` | Simulator-specific |
| 77 | `hydra` | Security | `security.ts` | Simulator-specific |
| 78 | `sqlmap` | Security | `security.ts` | Simulator-specific |
| 79 | `nikto` | Security | `security.ts` | Simulator-specific |
| 80 | `john` | Security | `security.ts` | Simulator-specific |
| 81 | `searchsploit` | Security | `security.ts` | Simulator-specific |
| 82 | `enum4linux` | Security | `security.ts` | Simulator-specific |
| 83 | `smbclient` | Security | `security.ts` | Simulator-specific |
| 84 | `crackmapexec` | Security | `security.ts` | Simulator-specific |
| 85 | `hashcat` | Security | `security.ts` | Simulator-specific |
| 86 | `exiftool` | Security | `security.ts` | Simulator-specific |
| 87 | `binwalk` | Security | `security.ts` | Simulator-specific |
| 88 | `msfconsole` | Security | `security.ts` | Stub implementation |
| 89 | `python3` | Dev | `dev.ts` | Stub implementation |
| 90 | `python` | Dev | `dev.ts` | Alias of `python3` |
| 91 | `node` | Dev | `dev.ts` | Stub implementation |
| 92 | `git` | Dev | `dev.ts` | Simulator-specific |
| 93 | `pip` | Dev | `dev.ts` | Simulator-specific |
| 94 | `pip3` | Dev | `dev.ts` | Alias of `pip` |
| 95 | `apt` | Dev | `dev.ts` | Simulator-specific |
| 96 | `npm` | Dev | `dev.ts` | Simulator-specific |
| 97 | `docker` | Dev | `dev.ts` | Simulator-specific |
| 98 | `tmux` | Dev | `dev.ts` | Simulator-specific |
| 99 | `screen` | Dev | `dev.ts` | Alias of `tmux` |
| 100 | `make` | Dev | `dev.ts` | Simulator-specific |
| 101 | `gcc` | Dev | `dev.ts` | Stub implementation |
| 102 | `clear` | Utility | `utility.ts` | Fully implemented |
| 103 | `help` | Utility | `utility.ts` | Fully implemented |
| 104 | `history` | Utility | `utility.ts` | Fully implemented |
| 105 | `alias` | Utility | `utility.ts` | Fully implemented |
| 106 | `export` | Utility | `utility.ts` | Fully implemented |
| 107 | `exit` | Utility | `utility.ts` | Fully implemented |
| 108 | `man` | Utility | `utility.ts` | Partially implemented |
| 109 | `which` | Utility | `utility.ts` | Partially implemented |
| 110 | `reset` | Utility | `utility.ts` | Simulator-specific |
| 111 | `qyvora-help` | Utility | `utility.ts` | Simulator-specific |
| 112 | `tutorial-start` | Utility | `utility.ts` | Simulator-specific |
| 113 | `tutorial-next` | Utility | `utility.ts` | Simulator-specific |
| 114 | `tutorial-reset` | Utility | `utility.ts` | Simulator-specific |

### Classification Summary

| Classification | Count | Description |
|---------------|-------|-------------|
| Fully implemented | 8 | Behaves identically to Linux for supported features |
| Partially implemented | 26 | Core behavior works but missing flags/syntax |
| Stub implementation | 16 | Accepts command but produces canned/minimal output |
| Simulator-specific | 64 | Returns fake data; no real functionality |
| Alias | 3 | Maps to another handler (`python`, `pip3`, `more`, `screen`) |

---

## 5. Linux Compatibility Review

### Overall Compatibility Score: **28/100**

The simulator captures the surface aesthetics of Kali Linux (prompt format, tool banners, directory structure) but deviates significantly in actual behavior. Most commands return hardcoded or deterministic output rather than computing results from actual state.

### Per-Command Compatibility Gaps

#### Navigation

**`ls`** — Missing: `-la` combined output format, `-h` human sizes, `-R` recursive, `-S` sort by size, `-t` sort by time, `-1` single column, `--color`, time display in long format. The long format output does not match Linux `ls -l` spacing or total calculation.

**`cd`** — Missing: `CDPATH`, `pushd`/`popd`. Works for basic cases. `cd -` uses `OLDPWD` correctly.

**`pwd`** — Compatible. Returns `state.cwd`.

**`tree`** — Missing: `-L` depth limit, `--dirsfirst` as long option, `-d` directories only, file size display, hidden file default behavior (Linux shows hidden with `-a`, not by default, which matches). Output format is close but directory/file counting includes the root line in the total.

#### File Operations

**`cat`** — Missing: `-n` line numbers, `-b` non-blank numbering, `-s` squeeze blanks, `-A` show non-printing, reading from stdin, `-` stdin file argument.

**`echo`** — Missing: `-n` no newline, `-e` escape interpretation, `-E` disable escapes. Variable expansion only handles `$VAR` and `$?`, not `${VAR}`, `$((expr))`, or `$[expr]`.

**`touch`** — Missing: `-c` no create, `-t` timestamp, `-d` date string. Does not update timestamps on existing files.

**`mkdir`** — Missing: `-p` (create parents). This is a significant gap — `mkdir -p a/b/c` fails.

**`rm`** — Missing: `-i` interactive, `-v` verbose, `--` end of options. `-rf` parsing works because flags are checked by string inclusion rather than proper argument parsing.

**`cp`** — Missing: `-i` interactive, `-v` verbose, `-p` preserve, `-a` archive, destination-as-directory semantics, multiple source support.

**`mv`** — Missing: `-i` interactive, `-v` verbose, `-n` no-clobber, same-filesystem rename optimization.

**`chmod`** — Only `+x` and `a+x` are recognized. Missing: numeric modes (`755`, `644`), `u+x`, `g+w`, `-x`, `=rwx`, `-R` recursive. All other modes are silently ignored.

**`head`** — Missing: `-c` byte count, multiple files support, `-q` quiet headers. Only supports `-n`.

**`tail`** — Missing: `-f` follow, `-c` byte count, multiple files, `-q` quiet headers. Only supports `-n`.

**`wc`** — Missing: `-l`, `-w`, `-c`, `-m` individual flags. Always shows all three counts. Output format does not pad consistently with Linux.

**`grep`** — Missing: `-v` invert match, `-c` count, `-l` files-with-matches, `-n` line numbers, `-r` recursive, `-w` word boundary, `-A`/`-B`/`-C` context, `-P` PCRE, `-E` extended regex, `-F` fixed strings. Only supports `-i` and substring matching (with `^` triggering regex). The `--color=auto` flag is accepted but not rendered.

**`find`** — Missing: `-size`, `-mtime`, `-perm`, `-user`, `-exec`, `-not`, `-o`, `-maxdepth`, `-mindepth`, `-path`, `-regex`, `-newer`. Only supports `-name` and `-type`.

**`sort`** — Missing: `-n` numeric sort, `-u` unique, `-f` fold case, `-t` field separator, `-k` key specification, `-h` human numeric.

**`less`/`more`** — Not interactive. Shows first 40 lines with a "More" indicator. Missing: scrolling, search (`/pattern`), line numbers, `q` to quit, all interactive functionality.

**`diff`** — Missing: `-u` unified format, `-y` side-by-side, `-r` recursive, `-q` brief. Output format is a custom `NcN` format, not standard unified or ed-style.

**`ln`** — Hard links validate source exists but do nothing. Symbolic links (`-s`) are accepted but produce no VFS modification. Neither creates actual links.

**`du`** — Missing: `-s` summary only, `-a` all files, `--max-depth`, `-c` total. The `-h` flag works. Output format is close.

**`df`** — Completely static. Does not reflect actual VFS state.

**`tar`** — All modes (`-c`, `-x`, `-t`) return canned output. `-t` returns a hardcoded file list unrelated to any archive. Does not create or extract real archives.

**`zip`/`unzip`** — Return confirmation messages only. Do not modify VFS.

**`xxd`** — Produces real hex dump of file content. Compatible with basic `xxd` output format. Missing: `-r` reverse, `-l` length, `-s` seek.

**`strings`** — Extracts real printable strings. Missing: `-n` minimum length, `-a` ASCII only, `-e` encoding selection.

**`file`** — Extension-based type detection. Missing: magic number detection, MIME type output, `-b` brief mode.

**`md5sum`/`sha256sum`** — Use `fakeHash()` which produces deterministic but **incorrect** hashes (djb2 variant, not MD5 or SHA-256). The output format is compatible but the hash values are wrong.

**`awk`** — Only supports `{print $N}` patterns. Missing: field separators (`-F`), pattern matching, `BEGIN`/`END` blocks, built-in variables, arithmetic, string functions, arrays. Cannot handle `awk '{print $1, $3}'` or any real awk scripting.

**`sed`** — Only supports `s/old/new/` and `s/old/new/g`. Missing: `-i` in-place, `-e` multiple expressions, `d` delete, `a` append, `i` insert, line addresses, ranges, `&` back-reference, `\1` group references.

**`cut`** — Supports `-f` and `-d`. Missing: `-c` character ranges, `-b` byte ranges, `--complement`.

**`uniq`** — Only removes consecutive duplicates. Missing: `-c` count, `-d` duplicates only, `-u` unique only, `-i` ignore case, `-f` skip fields, `-s` skip chars.

**`tr`** — Supports character translation and `-d` delete. Missing: `-s` squeeze, `-c` complement, character classes (`[:alpha:]`), ranges (`a-z`).

#### System Information

**`whoami`** — Fully compatible.

**`id`** — Hardcoded output. Does not respect user switching. Compatible format.

**`uname`** — Missing: `-s`, `-n`, `-r`, `-v`, `-m`, `-p`, `-i`, `-o` individual flags.

**`date`** — Missing: format strings (`+%Y-%m-%d`), `-d` date display, `-s` set, `-R` RFC 2822. Uses JavaScript `Date.toString()` which differs from GNU `date` output format.

**`cal`** — Missing: `-3` three months, `-A`/`-B` after/before months. Calendar rendering is close but day alignment may differ from GNU cal.

**`uptime`** — Randomized output. Format is approximately compatible but not stable.

**`hostname`** — Fully compatible.

**`env`** — Fully compatible.

**`ps`** — Hardcoded process list. `aux` and `-ef` output format is close. Missing: actual process tracking, `--sort`, column selection, `-p` PID filter.

**`top`** — Static snapshot, not interactive. Output format is close to real top header. Missing: actual process monitoring, `k` kill, `q` quit, sort changes.

**`kill`** — Accepts signal arguments but does nothing. Always returns exit 0 regardless of signal.

**`sudo`** — Always fails when not root (exit 1 with "incorrect password attempt"). There is no mechanism to enter `isRoot` mode, making `sudo` permanently non-functional for the default user.

**`free`** — Completely static output.

**`lsof`** — Hardcoded list with basic filtering.

**`crontab`** — `-l` returns hardcoded entries. `-e` and `-r` return confirmation messages. No actual cron modification.

**`service`/`systemctl`** — 8 hardcoded services. Status, start, stop, restart, enable, disable produce appropriate messages. `list-units` shows all services.

**`chown`** — Changes owner/group on VFS nodes but uses direct mutation. Missing: `-R` recursive, `--reference` file.

**`umask`** — Returns `0022` always. Does not actually set umask.

**`jobs`/`bg`/`fg`** — Internal job store exists but is always empty. No commands actually add to `JOB_STORE`.

#### Network

All network commands return **simulated output** against the fake 10.0.0.0/24 network. None perform real network operations.

**`ping`** — Simulates realistic per-packet output with randomized RTT. Supports `-c`. Missing: `-i` interval, `-s` packet size, `-t` TTL, `-W` timeout, `-f` flood, `-q` quiet.

**`curl`** — Returns canned HTML/JSON responses based on URL. Supports `-s`, `-X`, `-d`. Missing: `-o` output file, `-L` follow redirects, `-H` headers, `-k` insecure, `-I` head request, `-w` write-out, cookie handling, authentication.

**`nmap`** — Most complete network simulation. Supports `-v`, `-sV`, `-O`, `-p-`, `-sn`, `-Pn`. Output closely matches real nmap 7.94SVN. Missing: `--script` NSE, `-T0`-`-T5` timing, `--open` filter, `-oX` output formats.

**`netstat`/`ss`** — Hardcoded connections. Support flag combinations (`-tln`, `-tuln`, `-i`). Output format is close.

**`dig`** — Simulates DNS responses. Supports `+short`. Missing: `@server`指定 DNS server, record types beyond A, `+trace`, `-x` reverse, `ANY` queries.

**`traceroute`** — Simulates multi-hop routes. Missing: `-I` ICMP, `-U` UDP, `-T` TCP, `-n` numeric only, maximum hops, packet size.

**`ssh`** — Shows connection sequence then closes. Never actually connects. Supports `-v` verbose. Missing: `-p` port, `-l` login, `-i` identity, `-X` X forwarding, key-based auth.

**`wget`** — Shows simulated download output. Does not save to VFS. Missing: `-O` output file, `-c` continue, `-r` recursive, `-q` quiet.

#### Security Tools

All 13 security tools return **canned output**. They are designed to produce realistic tool banners and output for educational purposes.

| Tool | Flags Supported | Real Behavior |
|------|----------------|---------------|
| `gobuster` | `-u`, `-w`, `-v`, `-x` | Fixed directory list |
| `hydra` | `-l`, `-L`, `-P`, `service://` | Always "finds" password |
| `sqlmap` | `-u`, `--batch`, `--level`, `--risk` | Fixed SQLi results |
| `nikto` | `-h` | Fixed vulnerability list |
| `john` | `--wordlist` | Fixed cracked passwords |
| `searchsploit` | (query text) | Searches 5-entry database |
| `enum4linux` | (target) | Fixed enumeration output |
| `smbclient` | `-L` | Fixed share list |
| `crackmapexec` | (target) | Fixed SMB output |
| `hashcat` | `-m` | Fixed cracked hashes |
| `exiftool` | (file) | Randomized metadata |
| `binwalk` | (file) | Fixed firmware output |
| `msfconsole` | (none) | Shows banner, enters mode |

---

## 6. Shell Feature Audit

### Pipes (`|`)

**Implementation:** `parser.ts:200-206, 231-249`. Parsed into a linked list of `PipelineStage` nodes with `pipeToNext = true`. In `state.ts:136-153`, each stage's output becomes the next stage's `state.stdin`.

**Working:** `cat file | grep pattern`, `cat file | sort`, `cat file | uniq`, `cat file | cut -f1`, `cat file | tr a b`, `cat file | awk '{print $1}'`, `cat file | sed 's/old/new/'`.

**Missing:** Only commands that explicitly check `state.stdin` support piped input. Most commands (e.g., `head`, `tail`, `wc`, `find`) ignore stdin entirely.

### Output Redirection (`>`, `>>`)

**Implementation:** `parser.ts:169-178` extracts redirect targets. `state.ts:69-102` writes output to VFS files.

**Working:** `echo text > file`, `echo text >> file`, `command > file`. Creates files in VFS. Append mode works.

**Missing:** No error if redirect target directory doesn't exist (output is silently dropped at `state.ts:76` if parent not found).

### Input Redirection (`<`)

**Implementation:** `parser.ts:171-172` extracts redirect source. `state.ts:47-56` reads file content and passes as `stdin`.

**Working:** `grep pattern < file`, `awk '{print $1}' < file`, `sed 's/old/new/' < file`.

### Quotes

**Implementation:** `parser.ts:92-103` handles single and double quotes.

**Working:** Single quotes suppress all interpretation. Double quotes allow `$VAR` expansion. Backslash handling within quotes is correct.

**Missing:** No nested quote handling. No `$'...'` ANSI-C quoting.

### Escaping

**Implementation:** `parser.ts:83-89, 87-89` handles backslash before non-quote characters.

**Working:** `echo hello\ world`, `echo \$HOME`.

### Variables

**Implementation:** `parser.ts:10-15` expands `$VAR` and `$?` using regex `/\$(\w+|\?)/g`.

**Working:** `$HOME`, `$PATH`, `$?`, `$USER`.

**Missing:** `${VAR}`, `${VAR:-default}`, `$((expr))`, `$(command)`, `$[expr]`, `$#`, `$@`, `$*`, `$0`-`$9`, `$RANDOM`.

### Environment Variables

**Implementation:** `export` command in `utility.ts:178-194` sets `state.env`.

**Working:** `export VAR=value`, `export` (list all), `$VAR` expansion in commands.

### Command Substitution

**Not implemented.** No support for `` `command` `` or `$(command)`.

### Backticks

**Not implemented.** Same as command substitution.

### Globbing

**Implementation:** `parser.ts:33-65` converts glob patterns to regex and matches against VFS children.

**Working:** `ls *.txt`, `cat file?`, `ls [abc]*`.

**Missing:** Dotfiles excluded by default even with `*` unless pattern starts with `.`. No `**` recursive glob. No `{a,b}` brace expansion.

### Aliases

**Implementation:** `utility.ts:156-176` manages `state.aliases`. `state.ts:118-120` expands the first word.

**Working:** `alias ll='ls -la'`, `alias` (list all), `alias name` (show value).

**Default aliases:** `ll=ls -la`, `la=ls -A`, `grep=grep --color=auto`.

**Missing:** No alias expansion for aliases containing other aliases. No unalias command.

### History Expansion

**Implementation:** `parser.ts:17-31` handles `!!` and `!N`.

**Working:** `!!` repeats last command, `!3` repeats history entry 3.

**Missing:** `!string` (prefix search), `!?string` (substring search), `!n:p` (print only), `^old^new` (quick substitution).

### Keyboard Shortcuts

**Implementation:** `TerminalShell.tsx:302-507` handles all keyboard events.

| Shortcut | Status |
|----------|--------|
| `Ctrl+C` | Working (cancels input or aborts streaming) |
| `Ctrl+A` | Working (jump to start) |
| `Ctrl+E` | Working (jump to end) |
| `Ctrl+U` | Working (clear line) |
| `Ctrl+K` | Working (delete to end) |
| `Ctrl+W` | Working (delete word back) |
| `Ctrl+L` | Working (clear screen) |
| `Ctrl+D` | Working (exit on empty input) |
| `Ctrl+R` | Working (reverse history search) |
| `Arrow Up/Down` | Working (history navigation) |
| `Tab` | Working (file/path completion) |
| `Tab Tab` | Working (show all completions) |

### Logical Operators

**Implementation:** `parser.ts:199` splits by first `&&`, `||`, or `;`. `state.ts:150-151` handles short-circuit evaluation.

**Working:** `cmd1 && cmd2`, `cmd1 || cmd2`, `cmd1; cmd2`.

**Missing:** Proper nesting within pipe chains. `cmd1 | cmd2 && cmd3` may not behave correctly because `&&` is split at the top level before pipe handling.

### Sequential Execution

**Working:** `cmd1; cmd2; cmd3` executes all commands in sequence.

### Comments

**Not implemented.** `#` is not treated as a comment delimiter.

### Multi-Command Execution

**Working:** Supported via `&&`, `||`, and `;` operators.

---

## 7. Error Handling Audit

### Command Not Found

**Implementation:** `commands.ts:168-176`. Returns `bash: {cmd}: command not found` with exit code 127. If command starts with `/`, checks VFS for executable (exit 126) or directory (exit 126).

**Verdict:** Compatible with Linux behavior.

### Invalid Flags

**Most handlers silently ignore unknown flags.** For example:
- `ls --foo` — `--foo` is treated as a path argument (not an error)
- `grep -z pattern file` — `-z` is not recognized but doesn't cause an error
- `head -x file` — `-x` is not a recognized flag, defaults to 10 lines

**Missing:** Most handlers should error on invalid flags.

### Missing Files

**Generally handled correctly:**
- `cat nonexistent` → `cat: nonexistent: No such file or directory` (exit 1)
- `grep pattern nonexistent` → `grep: nonexistent: No such file or directory` (exit 2)
- `ls nonexistent` → `ls: cannot access 'nonexistent': No such file or directory` (exit 2)

**Inconsistency:** Exit codes vary — `cat` returns 1, `ls` returns 2, `grep` returns 2 for file not found.

### Missing Arguments

**Generally handled:**
- `touch` → `touch: missing file operand` (exit 1)
- `mkdir` → `mkdir: missing operand` (exit 1)
- `rm` → `rm: missing operand` (exit 1)
- `cp` → `cp: missing file operand` (exit 1)
- `grep` (no pattern) → `grep: missing pattern` (exit 2)
- `grep` (pattern only) → exit 1 (no output)

**Inconsistency:** `cat` with no args returns empty string with exit 0, which is actually correct (Linux `cat` with no args reads stdin indefinitely, but returning empty is a reasonable simulation).

### Permission Errors

**Not enforced.** The VFS has `permissions`, `owner`, and `group` fields but:
- `cat /etc/shadow` succeeds (should require root)
- `chmod 755 /etc/hostname` silently ignores non-`+x` modes
- `rm /etc/hostname` succeeds without error
- `sudo` always fails (no mechanism to become root)

### Invalid Users/Groups

- `chown invaliduser file` — succeeds silently (no validation)
- `chown user:invalidgroup file` — succeeds silently

### Invalid Services

- `service invalid status` → `service: unknown service: invalid` (exit 1) ✓
- `systemctl status invalid` → `Unit invalid.service could not be found.` (exit 1) ✓

### Invalid Hosts

- `ping invalid` → returns `ping: invalid: Temporary failure in name resolution` (exit 1) ✓
- `nmap invalid` → returns `Failed to resolve "invalid"` (exit 1) ✓
- `ssh invalid` → resolves to random IP and shows connection sequence ✓

### Error Consistency Assessment

| Aspect | Rating |
|--------|--------|
| Command not found | Excellent |
| Missing files | Good |
| Missing arguments | Good |
| Invalid flags | Poor (silent ignore) |
| Permission errors | Not implemented |
| User/group validation | Not implemented |
| Error message format | Good (matches Linux conventions) |
| Exit code consistency | Fair (inconsistent across commands) |
| Error vs stdout separation | Good (uses `error` field for stderr) |

---

## 8. Exit Code Audit

### Success Codes

| Command | Expected | Actual | Match |
|---------|----------|--------|-------|
| `ls` (valid) | 0 | 0 | ✓ |
| `cd` (valid) | 0 | 0 | ✓ |
| `pwd` | 0 | 0 | ✓ |
| `cat` (valid) | 0 | 0 | ✓ |
| `grep` (matches found) | 0 | 0 | ✓ |
| `grep` (no matches) | 1 | 1 | ✓ |
| `find` (valid) | 0 | 0 | ✓ |
| `sort` (valid) | 0 | 0 | ✓ |
| `echo` | 0 | 0 | ✓ |
| `touch` | 0 | 0 | ✓ |
| All network tools | 0 | 0 | ✓ |
| All security tools | 0 | 0 | ✓ |
| `which` (found) | 0 | 0 | ✓ |

### Failure Codes

| Command | Expected | Actual | Match |
|---------|----------|--------|-------|
| Command not found | 127 | 127 | ✓ |
| Permission denied (exec path) | 126 | 126 | ✓ |
| `ls` (not found) | 2 | 2 | ✓ |
| `cd` (not found) | 1 | 1 | ✓ |
| `cat` (not found) | 1 | 1 | ✓ |
| `grep` (not found) | 2 | 2 | ✓ |
| `grep` (no pattern) | 2 | 2 | ✓ |
| `mkdir` (exists) | 1 | 1 | ✓ |
| `rm` (not found, no -f) | 1 | 1 | ✓ |
| `cp` (not found) | 1 | 1 | ✓ |
| `mv` (not found) | 1 | 1 | ✓ |
| `touch` (no args) | 1 | 1 | ✓ |
| `kill` (no args) | 2 | 2 | ✓ |
| `sudo` (not root) | 1 | 1 | ✓ |
| `dig` (no query) | 9 | 9 | ✓ |
| `nmap` (no target) | 1 | 1 | ✓ |
| `man` (no entry) | 16 | 16 | ✓ |
| `npm test` | 1 | 1 | ✓ |

### Sequencing Operators

**`&&`** — Short-circuits on nonzero exit code. Verified in `state.ts:150`.
**`||`** — Short-circuits on zero exit code. Verified in `state.ts:151`.
**`;`** — Always continues. Verified in `state.ts:153`.
**`|`** — Pipeline exit code is the last command's exit code. Verified in `state.ts:143`.

### Exit Code Inconsistencies

| Issue | Location |
|-------|----------|
| `kill` always returns 0 even with valid signal/PID | `system.ts:118` |
| `ln -s` always returns 0 even though it does nothing | `files.ts:304` |
| `umask 0777` returns 0 without actually setting | `system.ts:235` |
| `tar` returns 0 for unrecognized options (should be 1) | `files.ts:355` returns 1, but `-c` without `-f` returns 0 |

---

## 9. Virtual Filesystem Audit

### Default Filesystem

**File:** `data/defaultFilesystem.ts`

```
/
├── home/kali/
│   ├── Desktop/     (empty)
│   ├── Documents/   (empty)
│   ├── Downloads/   (empty)
│   ├── Music/       (empty)
│   ├── Pictures/    (empty)
│   ├── Projects/    (empty)
│   ├── Public/      (empty)
│   ├── Templates/   (empty)
│   ├── Videos/      (empty)
│   ├── .bashrc
│   ├── .profile
│   ├── .bash_logout
│   └── welcome.txt
├── etc/
│   ├── hostname     ("kali")
│   ├── hosts
│   ├── passwd
│   ├── shadow
│   └── os-release
├── usr/{bin,share,lib}/  (empty)
├── var/             (empty)
├── tmp/             (drwxrwxrwt)
├── root/            (drwx------)
├── bin/             (empty)
├── sbin/            (empty)
├── lib/             (empty)
├── opt/             (empty)
├── mnt/             (empty)
├── media/           (empty)
├── srv/             (empty)
├── proc/            (dr-xr-xr-x)
├── sys/             (dr-xr-xr-x)
└── dev/             (empty)
```

### File Creation

**Working:** `touch` creates files with `-rw-r--r--` permissions and 0 size. Files appear in VFS correctly.

**Bug:** `touch` uses `parent.children.push(newFile)` (line 42) which mutates the shared reference.

### File Deletion

**Working:** `rm` removes files by filtering `parent.children` (line 90). Directories require `-r`.

**Bug:** Uses `parent.children = parent.children.filter(...)` which mutates the shared reference.

### Directory Creation

**Working:** `mkdir` creates directories with `drwxr-xr-x` permissions.

**Bug:** Uses `parent.children.push(newDir)` (line 65). Does not support `-p` for nested creation.

### Directory Deletion

**Working:** `rm -r` removes directories recursively.

**Missing:** No check for non-empty directories without `-f`. Actually, `rm -r` removes all contents without confirmation, which is correct for `-r`.

### Recursive Operations

- `rm -r` — Working (recursive delete)
- `cp -r` — Partially working (only shallow copy: `const copy = { ...srcNode, name: destName }` at `files.ts:112` — children are shared references, not deep copies)
- `find` — Working (recursive walk)
- `du` — Working (recursive size calculation)
- `tree` — Working (recursive display)

### Rename/Move

**Working:** `mv` removes from source parent and adds to destination parent.

**Bug:** Uses `srcParent.children.filter(...)` and `destParent.children.push(moved)` — both mutate shared references.

### Copy

**Working:** `cp` creates a shallow copy at destination.

**Bug:** Only copies the top-level node (`{ ...srcNode, name: destName }`). Children are shared by reference, so modifying a copied directory's children would also modify the original.

### Permissions

**Fields exist but are not enforced:**
- `chmod +x` / `chmod a+x` — Sets `executable` flag and updates permission string
- No numeric mode support
- No read/write permission checks anywhere
- `chmod` silently ignores all modes except `+x` and `a+x`

### Ownership

**Fields exist:** `owner` and `group` on every node.

**Working:** `chown user file` and `chown user:group file` update the fields.

**Missing:** No actual enforcement. `cat /etc/shadow` works for any user.

### Relative vs Absolute Paths

**Working:**
- `cd /etc` (absolute)
- `cd Documents` (relative to cwd)
- `cd ../..` (parent traversal)
- `cd ~` (home directory)
- `cat /home/kali/welcome.txt` (absolute)
- `ls ~/Desktop` (tilde expansion)

### Hidden Files

**Working:** `ls` hides dotfiles by default. `ls -a` shows them. `ls -la` shows them in long format.

### Symbolic Links

**Not implemented.** `ln -s src dest` returns success but creates nothing in the VFS.

### State Consistency Issues

| Issue | Severity | Description |
|-------|----------|-------------|
| Mutating shared nodes | Critical | All file commands mutate `parent.children` directly |
| Shallow copy in `cp` | High | `cp -r` does not deep-copy children |
| `findNode` vs `nodeAtPath` | Low | Two identical functions exist (`filesystem.ts:37-48` and `91-102`) |
| Redundant root in stateOverride | Low | Handlers return `stateOverride: { root: currentRoot }` but `currentRoot === state.root` |
| No permission enforcement | Medium | Any user can read/write any file |

---

## 10. Session State Audit

### Documented State

| Field | Type | Default | Mutated By |
|-------|------|---------|------------|
| `cwd` | `string` | `/home/kali` | `cd` |
| `user` | `string` | `kali` | Never |
| `hostname` | `string` | `kali` | Never |
| `home` | `string` | `/home/kali` | Never |
| `env` | `Record<string, string>` | 8 vars | `export`, `cd` (OLDPWD) |
| `history` | `string[]` | `[]` | `processInput` (every command) |
| `historyIndex` | `number` | `-1` | UI component (not in state override) |
| `root` | `VFSNode` | Default FS | All file commands |
| `isRoot` | `boolean` | `false` | Never (no mechanism to set) |
| `aliases` | `Record<string, string>` | 3 defaults | `alias` |
| `lastExitCode` | `number` | `0` | `processInput` |
| `inMsfConsole` | `boolean` | `undefined` | `msfconsole` |
| `stdin` | `string` | `undefined` | Pipeline execution |
| `discoveredIps` | `string[]` | `[]` | `ping`, `nmap` |

### State Issues

| Issue | Severity | Description |
|-------|----------|-------------|
| `isRoot` permanently false | High | No command sets `isRoot = true`, making `sudo` permanently non-functional |
| `user` never changes | Medium | `su` command does not exist |
| `hostname` never changes | Low | `hostnamectl` does not exist |
| `inMsfConsole` never resets | Medium | Once set, the prompt changes permanently; no `exit` from msfconsole mode |
| `historyIndex` outside state | Low | UI-only state, not persisted |
| `JOB_STORE` is module-level | Low | Shared across all instances; not per-session |
| No `PS1` rendering | Low | PS1 is in `state.env` but never parsed or rendered |

### Unused State

- `PS1` environment variable is defined but the prompt is generated by `getPrompt()` which hardcodes the format
- `HISTSIZE` is not defined (no history limit)

### Duplicate State

- `historyIndex` exists as both `state.historyIndex` (never used after initialization) and `useState` in `TerminalShell.tsx:180`
- `root` is both in state and directly mutated by handlers

---

## 11. Command Integration Audit

### Verified Working Integrations

| Chain | Status |
|-------|--------|
| `touch file` → `cat file` | ✓ Empty file created, `cat` shows empty |
| `echo "hello" > file` → `cat file` | ✓ Content written via redirect, read by cat |
| `mkdir dir` → `cd dir` → `pwd` | ✓ Directory created, navigated to, path displayed |
| `touch file` → `ls` | ✓ File appears in listing |
| `touch file` → `cp file file2` → `ls` | ✓ Copied file appears |
| `cp file file2` → `mv file2 file3` → `ls` | ✓ Rename works |
| `touch file` → `rm file` → `ls` | ✓ File removed |
| `echo "a\nb\na" > f` → `sort f` → `uniq` | ✓ Via pipes: sorted, then deduplicated |
| `cat file \| grep pattern` | ✓ Piped stdin works for grep |
| `cat file \| awk '{print $1}'` | ✓ Piped stdin works for awk |
| `cat file \| sed 's/old/new/'` | ✓ Piped stdin works for sed |
| `cat file \| cut -f1` | ✓ Piped stdin works for cut |
| `cat file \| uniq` | ✓ Piped stdin works for uniq |
| `nmap 10.0.0.0/24` → `arp` | ✓ Discovered IPs appear in ARP table |
| `ping 10.0.0.5` → `arp` | ✓ Pinged IP appears in ARP table |
| `export VAR=val` → `echo $VAR` | ✓ Environment variable expanded |
| `alias ll='ls -la'` → `ll` | ✓ Alias expanded and executed |

### Broken Integrations

| Chain | Issue |
|-------|-------|
| `mkdir -p a/b/c` | `-p` not supported, fails with "File exists" if any component exists, or creates only the last component |
| `cp -r dir1 dir2` → `touch dir1/newfile` → `ls dir2` | Shallow copy means dir2's children are shared with dir1 |
| `sudo su` → `whoami` | `sudo` always fails; cannot become root |
| `python3` → `print("hello")` | Interactive mode shows `>>>` but next input is a new command, not Python input |
| `msfconsole` → `help` | After entering msfconsole mode, subsequent commands run normally but with `msf6 >` prompt; msfconsole-specific commands are not implemented |
| `ln -s file link` → `cat link` | Link is not created; `cat link` returns "No such file or directory" |
| `tar -c -f archive.tar file` → `tar -t -f archive.tar` | List returns hardcoded files, not the created archive contents |
| `zip archive.zip file` → `unzip archive.zip` | Unzip returns hardcoded output, not the zipped files |
| `kill -9 1234` | No process is actually killed; no feedback |

### Cross-Command Environment Sharing

| Feature | Status |
|---------|--------|
| `$?` across commands | ✓ `lastExitCode` updated after each command |
| `$OLDPWD` from `cd -` | ✓ Set by `cd` handler |
| `HPB_TARGETS` env var | ✓ Set by bootcamp content injection |
| `discoveredIps` across network tools | ✓ Shared via state |
| VFS mutations across commands | ✓ All commands see the same VFS state |
| Aliases across commands | ✓ Alias set by `alias` available immediately |

---

## 12. Interactive Command Audit

### Classification

| Command | Classification | Notes |
|---------|---------------|-------|
| `python3` | Semi-interactive | Shows REPL header with `>>>`, but subsequent input is a new shell command |
| `python` | Alias | Same as `python3` |
| `node` | Semi-interactive | Shows Node.js header with `>`, same limitation |
| `less` / `more` | Stub | Shows first 40 lines with "More" indicator, no scrolling |
| `top` | Stub | Single static snapshot, not interactive |
| `msfconsole` | Stub | Shows banner, changes prompt to `msf6 >`, but no msfconsole commands work |
| `tmux` | Simulator-specific | Subcommands return static output |
| `screen` | Alias | Same as `tmux` |
| `nano` / `vim` / `vi` | Not implemented | No editor commands exist |
| `htop` | Not implemented | No process viewer |
| `ssh` (session) | Stub | Shows connection sequence then closes |
| `docker exec` | Not implemented | `docker` only supports `ps`, `images`, `run`, `build` |
| `npm init` | Semi-interactive | Shows interactive output but is not truly interactive |

**No command is fully interactive.** The closest is `python3` and `node` which display REPL headers, but subsequent input goes to the terminal shell, not the REPL.

---

## 13. Network Simulation Audit

### Network Topology

**File:** `data/fakeNetwork.ts`

| IP | Hostname | OS | Discoverable | Role |
|----|----------|----|:------------:|------|
| 10.0.0.1 | gateway | Cisco IOS 15.7 | ✓ | Router |
| 10.0.0.2 | dns-server | Ubuntu 22.04 | ✓ | DNS (BIND9) |
| 10.0.0.5 | web-server | Debian 12 | ✓ | Corporate web (nginx) |
| 10.0.0.6 | db-server | Ubuntu 20.04 | ✓ | MySQL |
| 10.0.0.10 | file-server | Windows 2022 | ✓ | SMB shares |
| 10.0.0.15 | mail-server | Debian 11 | ✓ | Postfix/Dovecot |
| 10.0.0.20 | admin-pc | Windows 11 | ✓ | Admin workstation |
| 10.0.0.21 | dev-workstation | Fedora 39 | ✓ | Dev machine |
| 10.0.0.25 | network-printer | HP JetDirect | ✓ | Printer |
| 10.0.0.30 | iot-sensor | Embedded Linux | ✓ | IoT device |
| 10.0.0.50 | bastion-host | Ubuntu 22.04 | ✗ | SSH jump box |
| 10.0.0.51 | vulnerable-app | Ubuntu 20.04 | ✗ | Legacy app (Struts2) |
| 10.0.0.100 | backup-server | Debian 12 | ✗ | rsync/Borg |
| 10.0.0.200 | security-cam | Embedded Linux | ✗ | Hikvision |
| 10.0.0.250 | internal-dashboard | Ubuntu 22.04 | ✗ | Grafana (classified) |

Student: `10.0.0.42` (`kali`), MAC `08:00:27:4e:66:a1`.

### Progressive Discovery

The discovery model is well-implemented:
1. `state.discoveredIps` starts empty
2. `ping` adds the target IP to discovered list
3. `nmap` subnet scan adds all discoverable IPs
4. `arp` shows only discovered IPs plus gateway and student
5. Hidden hosts are never added by discovery tools
6. Custom event `qyvora:ip-discovered` dispatched for UI reactions

### Cross-Tool Consistency

| Tool | Reads discoveredIps | Writes discoveredIps |
|------|:--------------------:|:---------------------:|
| `ping` | No | ✓ (target IP) |
| `nmap` | ✓ (for scan output) | ✓ (all discoverable + target) |
| `arp` | ✓ (discovered IPs shown) | No |
| `dig` | No | No |
| `curl` | No | No |
| `ssh` | No | No |
| `traceroute` | No | No (but uses `resolveTarget`) |

**Inconsistency:** `traceroute` to an internal host does not add the IP to `discoveredIps`, unlike `ping` and `nmap`.

### Network Config

```
Subnet:     10.0.0.0/24
Netmask:    255.255.255.0
Gateway:    10.0.0.1
Broadcast:  10.0.0.255
DNS:        10.0.0.2, 8.8.8.8
DHCP Range: 10.0.0.100 - 10.0.0.200
Student IP: 10.0.0.42
```

### Latency Simulation

- `ping`: 0.3-2.3ms randomized RTT
- `nmap`: Random scan timing (1-15 seconds)
- `traceroute`: 0.345ms for internal, 1.234-25.678ms for external
- All other tools: Various startup delays (100-800ms)

---

## 14. Streaming System Audit

### Timing Profiles

18 commands have streaming profiles defined in `streaming.ts:11-31`:

| Command | Startup (ms) | Line Delay (ms) | Mode | Batch Size |
|---------|-------------|-----------------|------|-----------|
| nmap | 800 | [150, 350] | line | — |
| ping | — | [800, 400] | line | — |
| traceroute | 300 | [600, 300] | line | — |
| gobuster | 500 | [40, 80] | line | — |
| hydra | 600 | [200, 400] | line | — |
| sqlmap | 400 | [80, 150] | batched | 3 |
| nikto | 500 | [100, 200] | line | — |
| john | 400 | [150, 300] | line | — |
| hashcat | 300 | [100, 200] | batched | 2 |
| enum4linux | 300 | [80, 150] | line | — |
| crackmapexec | 200 | [100, 200] | line | — |
| binwalk | 200 | [80, 150] | line | — |
| wget | 200 | [50, 100] | line | — |
| ssh | 300 | [100, 200] | line | — |
| scp | 300 | [100, 200] | line | — |
| msfconsole | 600 | [30, 60] | line | — |
| curl | 100 | [30, 60] | line | — |
| dig | 150 | [50, 100] | line | — |
| whois | 100 | [40, 80] | line | — |

### Streaming Implementation

**File:** `engine/streaming.ts` (94 lines)

`streamOutput` is an `AsyncGenerator` that yields progressively larger arrays of strings:
- **line mode:** Yields after each line with `[base, base + jitter]` random delay
- **batched mode:** Yields after every N lines with batch delay
- **instant mode:** Yields all lines at once

### Cancellation

**Working:** Ctrl+C during streaming sets `signal.aborted = true`, which is checked at each yield point. The UI adds `^C` and sets exit code to 130 (`TerminalShell.tsx:280-289`).

### Performance

- All delays use `setTimeout` via a `delay()` helper
- No memory issues — output is accumulated in React state
- The streaming loop is `for await...of` which is properly cancellable via the abort signal

### Realism Assessment

The streaming output creates a convincing impression of real tool execution. The per-command timing profiles are well-calibrated:
- `nmap` scans take ~8-15 seconds (realistic)
- `ping` packets arrive at ~1s intervals (realistic for 4 pings)
- `gobuster` directories appear rapidly (realistic for fast enumeration)
- `hydra` attempts appear at moderate speed (realistic for network brute-force)

---

## 15. Performance Audit

### Command Parsing

The parser is a single-pass character-by-character tokenizer (`parser.ts:67-151`). For typical command lengths (< 1000 characters), this is effectively O(n) and performs well. No performance concerns.

### Command Lookup

`commandMap[cmd]` is a hash table lookup — O(1). No performance concerns.

### VFS Operations

- `findNode`: O(depth × branching_factor) — walks tree. For typical paths (< 10 levels), this is negligible.
- `updateNodeAtPath`: Same complexity but rebuilds the entire path from root.
- Glob expansion: Walks entire directory tree. For large directories, this could be slow.

### Streaming

All streaming uses `setTimeout` with delays. No blocking. The UI remains responsive during streaming.

### Memory Usage

- VFS is stored entirely in memory as a tree of plain objects
- For the default filesystem (~40 nodes), memory usage is negligible
- For bootcamp content (~200+ nodes), still negligible
- Terminal history grows unbounded (no limit)
- `localStorage` persistence serializes the entire VFS tree on every change (debounced to 300ms)

### Scalability Assessment

| Scenario | Estimated Impact |
|----------|-----------------|
| 250 commands | Flat `commandMap` becomes difficult to navigate; handler files grow to ~1500 lines each |
| 500 commands | Handler files become unmaintainable; need module splitting; parser performance unaffected |
| 1000 commands | Flat command map reaches practical limits; need lazy loading, categorization, and registration API |

### Bottlenecks

1. **`TerminalShell.tsx`** — At 623 lines, this component handles too many concerns and will become difficult to maintain
2. **`files.ts`** — At 567 lines with 31 commands, this file needs splitting
3. **No lazy loading** — All 102 handlers are imported eagerly at startup
4. **localStorage serialization** — Serializing the entire VFS tree on every command execution may become slow for large trees

---

## 16. Security & Stability Audit

### Unhandled Exceptions

The system is **generally safe** from unhandled exceptions because:
- All VFS operations use `findNode` which returns `null` on missing paths
- Command handlers check for missing args, files, and flags
- The `try/catch` around `localStorage` operations silently handles storage errors

**Potential crash scenarios:**
1. `curl` POST with malformed JSON (`JSON.parse` at `network.ts:87`) — if the data argument contains invalid JSON, this will throw an unhandled exception
2. `processInput` with deeply nested pipe chains could hit stack overflow on recursive `parse` calls

### Infinite Loops

No infinite loops are possible because:
- All loops are bounded by array lengths or fixed iteration counts
- Streaming loops are cancellable via abort signal
- No recursive operations without depth limits on typical inputs

### Invalid Assumptions

| Assumption | Location | Risk |
|-----------|----------|------|
| `parent` always found after `findNode` | `files.ts:40-43` | If parent doesn't exist, file creation silently fails |
| `args[1]` exists for flag values | `files.ts:156-157` | `head -n` (without number) would parse NaN → defaults to 10 |
| `JSON.parse(data)` succeeds | `network.ts:87` | Malformed curl POST data would throw |
| All commands return `exitCode` | `commands.ts:180-190` | A handler returning `undefined` for exitCode could cause issues |

### Parser Failures

The parser is robust for typical inputs. Edge cases:
- Unterminated quotes: `"hello` → tokenizer continues to end of input, produces single token
- Double `&&`: `cmd1 && && cmd2` → parser handles gracefully
- Empty pipe: `cmd1 | | cmd2` → second pipe produces empty command, which returns exit 0

### Unsafe Mutations

- All VFS mutations are unsafe (direct reference modification)
- `JOB_STORE` is module-level mutable state shared across all terminal instances
- `jobCounter` is module-level mutable state

### Crash Scenarios

| Scenario | Result |
|----------|--------|
| Empty input | Returns empty lines array, no crash |
| Very long input | No length limit; should be fine for reasonable inputs |
| Deeply nested pipes | Recursive `parse` calls; could hit stack overflow at ~10000 levels |
| `curl` with invalid JSON POST data | Unhandled `JSON.parse` exception |
| localStorage quota exceeded | Silently caught by try/catch |
| Multiple terminal instances | `JOB_STORE` is shared; could cause cross-session interference |

### Overall Robustness: **6/10**

The system handles most error cases gracefully but has the `JSON.parse` vulnerability in `curl` and the shared mutable `JOB_STORE` as notable risks.

---

## 17. Testability Review

### Existing Tests

**Zero tests exist for the SimulatedTerminal.** A search of the entire codebase found no test files under:
- `SimulatedTerminal/`
- `engine/`
- `handlers/`

### Testability Assessment

| Component | Testability | Notes |
|-----------|------------|-------|
| `types.ts` | N/A | Type definitions only |
| `filesystem.ts` | High | Pure functions, no dependencies, easily unit-testable |
| `parser.ts` | High | Pure functions (except `expandVars`/`expandGlobbing` which need state), easily unit-testable |
| `state.ts` | High | `createInitialState` and `processInput` are pure functions |
| `streaming.ts` | High | Pure generator, mockable delay function |
| `commands.ts` | Medium | Depends on handler implementations |
| `handlers/files.ts` | High | Each handler is a pure function of (args, state) → result |
| `handlers/network.ts` | Medium | Depends on `fakeNetwork.ts` imports |
| `handlers/security.ts` | High | Pure functions, no external dependencies |
| `handlers/dev.ts` | High | Pure functions |
| `handlers/system.ts` | High | Pure functions (except `JOB_STORE` module state) |
| `handlers/utility.ts` | High | Pure functions |
| `TerminalShell.tsx` | Low | Complex React component with DOM, keyboard, localStorage |
| `SimulatedTerminal.tsx` | Low | React component wrapping Radix Dialog |
| `fakeNetwork.ts` | High | Pure data and functions |

### High-Risk Components Needing Tests First

1. `filesystem.ts` — VFS operations are the foundation; bugs here affect everything
2. `parser.ts` — Incorrect parsing breaks all commands
3. `state.ts` — `processInput` is the main execution pipeline
4. `files.ts` handlers — Most complex handlers with VFS mutations

### Required Test Types

| Type | Scope | Priority |
|------|-------|----------|
| Unit tests | `filesystem.ts`, `parser.ts`, `state.ts`, all handlers | Critical |
| Integration tests | Pipe chains, redirection, variable expansion across commands | High |
| End-to-end tests | Full command execution through `processInput` | High |
| React component tests | `TerminalShell.tsx` keyboard handling, rendering | Medium |
| Property-based tests | Parser edge cases, VFS operations | Medium |

---

## 18. Kali Tool Coverage

### Navigation

| Tool | Status | Coverage |
|------|--------|---------|
| `ls` | Partial | 60% (missing -h, -R, -S, -t, --color) |
| `cd` | Partial | 70% (missing CDPATH, pushd/popd) |
| `pwd` | Full | 100% |
| `tree` | Partial | 70% (missing -L, --dirsfirst) |
| `find` | Partial | 30% (only -name, -type) |
| `locate` | Missing | 0% |
| `realpath` | Missing | 0% |

**Category coverage: ~55%**

### File Operations

| Tool | Status | Coverage |
|------|--------|---------|
| `cat` | Partial | 40% (no -n, -b, -s, stdin) |
| `echo` | Partial | 40% (no -n, -e) |
| `touch` | Partial | 40% (no -c, -t) |
| `mkdir` | Partial | 30% (no -p) |
| `rm` | Partial | 60% (no -i, -v) |
| `cp` | Partial | 30% (no -i, -v, -p, -a) |
| `mv` | Partial | 40% (no -i, -v, -n) |
| `chmod` | Stub | 10% (only +x) |
| `chown` | Stub | 40% (no -R) |
| `head`/`tail` | Partial | 50% (basic -n only) |
| `wc` | Partial | 50% (no -l, -w, -c flags) |
| `grep` | Partial | 25% (no -v, -c, -l, -n, -r, -w, -E, -P) |
| `sort` | Partial | 30% (no -n, -u, -f, -t, -k) |
| `awk` | Stub | 10% (only {print $N}) |
| `sed` | Stub | 10% (only s///) |
| `cut` | Partial | 60% (has -f, -d; missing -c, -b) |
| `uniq` | Partial | 30% (no -c, -d, -u, -i) |
| `tr` | Partial | 50% (has -d; missing -s, -c) |
| `diff` | Partial | 30% (no -u, -y, -r) |
| `less`/`more` | Stub | 5% (not interactive) |
| `ln` | Stub | 0% (no actual links created) |
| `du` | Partial | 60% (has -h; missing -s, -a) |
| `df` | Stub | 0% (static output) |
| `tar` | Stub | 0% (canned output) |
| `zip`/`unzip` | Stub | 0% (canned output) |
| `xxd` | Partial | 70% (basic hex dump) |
| `strings` | Partial | 60% (missing -n, -a) |
| `file` | Partial | 50% (extension-based only) |
| `md5sum`/`sha256sum` | Stub | 0% (fake hashes) |
| `nano`/`vim`/`vi` | Missing | 0% |
| `tee` | Missing | 0% |
| `xargs` | Missing | 0% |

**Category coverage: ~25%**

### Networking

| Tool | Status | Coverage |
|------|--------|---------|
| `ping` | Simulated | 40% (realistic output; missing -i, -s, -t, -W, -f) |
| `ifconfig` | Simulated | 30% (static output) |
| `ip` | Simulated | 30% (only addr, route) |
| `curl` | Simulated | 25% (missing -o, -L, -H, -k, -I, cookies) |
| `wget` | Simulated | 20% (missing -O, -c, -r, -q) |
| `nmap` | Simulated | 70% (good flag support; missing NSE, timing, output formats) |
| `netstat` | Simulated | 50% (good flag support; static data) |
| `ss` | Simulated | 50% (similar to netstat) |
| `dig` | Simulated | 40% (missing @server, record types, +trace) |
| `nslookup` | Missing | 0% |
| `whois` | Simulated | 30% (basic WHOIS data) |
| `traceroute` | Simulated | 40% (missing -I, -U, -T, -n) |
| `arp` | Simulated | 50% (based on discovered IPs) |
| `route` | Simulated | 30% (static output) |
| `tcpdump` | Simulated | 10% (static output, no filtering) |
| `ssh` | Simulated | 15% (shows connection, never connects) |
| `scp` | Simulated | 15% (shows transfer, never transfers) |

**Category coverage: ~35%**

### Reconnaissance

| Tool | Status | Coverage |
|------|--------|---------|
| `nmap` | Simulated | 70% |
| `dnsenum` | Missing | 0% |
| `dnsrecon` | Missing | 0% |
| `theHarvester` | Missing | 0% |
| `recon-ng` | Missing | 0% |
| `spiderfoot` | Missing | 0% |
| `shodan` | Missing | 0% |

**Category coverage: ~10%** (only nmap)

### Enumeration

| Tool | Status | Coverage |
|------|--------|---------|
| `enum4linux` | Simulated | 40% (fixed output) |
| `smbclient` | Simulated | 30% (list shares only) |
| `snmpwalk` | Missing | 0% |
| `ldapsearch` | Missing | 0% |
| `nbtscan` | Missing | 0% |

**Category coverage: ~15%**

### Web Testing

| Tool | Status | Coverage |
|------|--------|---------|
| `gobuster` | Simulated | 40% (fixed directory list) |
| `nikto` | Simulated | 30% (fixed findings) |
| `sqlmap` | Simulated | 40% (good flag support) |
| `burpsuite` | Missing | 0% |
| `dirb` | Missing | 0% |
| `wfuzz` | Missing | 0% |
| `whatweb` | Missing | 0% |
| `wpscan` | Missing | 0% |

**Category coverage: ~15%**

### Password Attacks

| Tool | Status | Coverage |
|------|--------|---------|
| `hydra` | Simulated | 40% (always finds password) |
| `john` | Simulated | 30% (fixed cracked passwords) |
| `hashcat` | Simulated | 30% (fixed cracked hashes) |
| `medusa` | Missing | 0% |
| `ncrack` | Missing | 0% |
| `cewl` | Missing | 0% |

**Category coverage: ~20%**

### Exploitation

| Tool | Status | Coverage |
|------|--------|---------|
| `msfconsole` | Stub | 5% (banner only, no commands) |
| `searchsploit` | Simulated | 30% (5-entry database) |
| `crackmapexec` | Simulated | 20% (fixed output) |
| `metasploit` (all modules) | Missing | 0% |

**Category coverage: ~5%**

### Development

| Tool | Status | Coverage |
|------|--------|---------|
| `python3` | Stub | 15% (version, print(), 1+1) |
| `node` | Stub | 15% (version, console.log()) |
| `git` | Simulator-specific | 50% (init, status, add, commit, log, branch, checkout, diff, push) |
| `pip` | Simulator-specific | 40% (list, install, show) |
| `apt` | Simulator-specific | 40% (update, install) |
| `npm` | Simulator-specific | 40% (init, install, run, test) |
| `docker` | Simulator-specific | 40% (ps, images, run, build) |
| `tmux` | Simulator-specific | 40% (new, ls, attach, kill) |
| `make` | Simulator-specific | 30% (clean, install, default) |
| `gcc` | Stub | 10% (warning message only) |

**Category coverage: ~30%**

### Package Management

| Tool | Status | Coverage |
|------|--------|---------|
| `apt` | Simulator-specific | 40% |
| `pip` | Simulator-specific | 40% |
| `npm` | Simulator-specific | 40% |
| `gem` | Missing | 0% |
| `cargo` | Missing | 0% |

**Category coverage: ~30%**

### System Administration

| Tool | Status | Coverage |
|------|--------|---------|
| `ps` | Simulator-specific | 40% (hardcoded list) |
| `top` | Stub | 20% (static snapshot) |
| `kill` | Stub | 10% (does nothing) |
| `sudo` | Stub | 10% (always fails) |
| `systemctl` | Simulator-specific | 50% (8 services) |
| `service` | Simulator-specific | 50% (8 services) |
| `free` | Simulator-specific | 20% (static) |
| `df` | Stub | 10% (static) |
| `du` | Partial | 60% |
| `crontab` | Simulator-specific | 30% |
| `lsof` | Simulator-specific | 30% |
| `journalctl` | Missing | 0% |
| `dmesg` | Missing | 0% |
| `uptime` | Simulator-specific | 50% |
| `who` | Missing | 0% |
| `w` | Missing | 0% |
| `last` | Missing | 0% |
| `id` | Simulator-specific | 40% (hardcoded) |
| `groups` | Missing | 0% |
| `useradd`/`usermod`/`userdel` | Missing | 0% |
| `passwd` | Missing | 0% |

**Category coverage: ~20%**

### Overall Kali Coverage

| Category | Coverage |
|----------|---------|
| Navigation | ~55% |
| File Operations | ~25% |
| Networking | ~35% |
| Reconnaissance | ~10% |
| Enumeration | ~15% |
| Web Testing | ~15% |
| Password Attacks | ~20% |
| Exploitation | ~5% |
| Development | ~30% |
| Package Management | ~30% |
| System Administration | ~20% |
| **Weighted Average** | **~22%** |

---

## 19. Engineering Quality Assessment

### Code Quality: 55/100

**Strengths:**
- Consistent TypeScript usage with defined interfaces
- Clean function signatures across handlers
- No `any` types in the type definitions (though `commands.ts:180,190` uses `as any` casts)
- Descriptive variable names

**Weaknesses:**
- VFS mutability violations in every file handler
- Duplicated dispatch logic in `commands.ts`
- No shared utilities for common patterns
- `TerminalShell.tsx` is a monolith (623 lines)
- Inconsistent error handling (some commands check all args, others don't)
- `as any` casts in `commands.ts:180,190` and `system.ts:149`

### Maintainability: 45/100

- No abstractions for flag parsing, file resolution, or error formatting
- Adding a new command requires: (1) writing the handler, (2) adding to handler file or creating new file, (3) adding re-export in `handlers/index.ts`, (4) adding to `commandMap` in `commands.ts`
- No command metadata — help text is hardcoded in `utility.ts` and must be kept in sync manually
- Handler files range from 104 to 567 lines with no internal organization

### Modularity: 60/100

- Engine/UI separation is clean
- Streaming system is fully decoupled
- Network simulation is a separate data module
- But handlers have no shared abstractions
- `TerminalShell.tsx` mixes too many concerns

### Extensibility: 40/100

- No registration API for commands
- No command metadata system
- No plugin or extension mechanism
- No dynamic command loading
- Adding 250 commands would require significant refactoring

### Consistency: 50/100

- Error message format is mostly consistent (`command: target: message`)
- Exit codes are mostly correct but vary for similar errors
- Flag parsing is inconsistent (some use `args.includes('-x')`, others parse positionally)
- Output format varies between commands (some use padding, others don't)

### Linux Realism: 30/100

- Prompt format is authentic (`kali@kali:~/path$`)
- Tool banners are realistic (nmap, sqlmap, gobuster, hydra, john, msfconsole)
- Directory structure matches Kali Linux
- But actual command behavior is heavily simplified
- Most commands return canned output
- No permission enforcement
- No process management
- No real networking

### Educational Value: 70/100

- Students learn command syntax and basic operations
- Network tools teach reconnaissance workflows
- Security tools demonstrate tool output formats
- Progressive discovery model teaches systematic exploration
- Bootcamp context injection provides relevant practice files
- Tutorial system guides beginners
- But lack of interactivity limits deeper learning

### Long-term Sustainability: 35/100

- No tests make refactoring risky
- VFS mutability bugs will cause harder-to-diagnose issues as the system grows
- Monolithic handler files will become unwieldy
- No CI/CD means quality relies on manual verification
- `dist/` directories in version control suggest build artifacts are committed

### Overall Score: **52/100**

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Code Quality | 55 | 15% | 8.25 |
| Maintainability | 45 | 15% | 6.75 |
| Modularity | 60 | 10% | 6.00 |
| Extensibility | 40 | 10% | 4.00 |
| Consistency | 50 | 10% | 5.00 |
| Linux Realism | 30 | 15% | 4.50 |
| Educational Value | 70 | 15% | 10.50 |
| Long-term Sustainability | 35 | 10% | 3.50 |
| **Total** | | **100%** | **48.50 → 52** |

*(Adjusted upward slightly for the strong streaming system and network discovery model which are unique innovations.)*

---

## 20. Final Conclusions & Roadmap

### Overall Strengths

1. **The streaming system is genuinely innovative.** Per-tool timing profiles with AsyncGenerator-based progressive output and Ctrl+C cancellation create a convincing simulation of real tool execution. This is the simulator's most technically impressive feature.

2. **The progressive network discovery model is well-designed.** IP discovery shared across ping, nmap, arp, and other tools creates a realistic reconnaissance workflow where students must scan before they can enumerate.

3. **The keyboard shortcut implementation is thorough.** Ctrl+A/E/U/K/W/L/C/D/R, reverse history search, tab completion with double-tab for all matches — this matches real terminal behavior closely.

4. **The context-aware VFS injection is architecturally sound.** Bootcamp phase/room and course lesson content is injected dynamically, allowing the same terminal to serve different educational contexts.

5. **The visual theme is authentic.** Kali-inspired color scheme, prompt format, tool banners, and output formatting create a convincing aesthetic.

6. **Persistence via localStorage** allows students to resume their session across page reloads.

### Overall Weaknesses

1. **VFS mutability violations are the most critical correctness issue.** Every file handler directly mutates shared VFS node references instead of using immutable updates. This means:
   - `cp -r` creates shallow copies where children are shared
   - Undoing operations is impossible
   - Multiple terminal instances would corrupt each other's state
   - React's change detection (if ever applied to VFS) would fail

2. **`sudo` is permanently broken.** There is no mechanism to set `isRoot = true`, making `sudo` always fail. This prevents any root-requiring scenario.

3. **No test coverage whatsoever** for the entire terminal simulation. Any refactoring or feature addition risks regressions.

4. **Most commands return canned output** rather than computing results from actual state. While acceptable for security tools (which can't run in-browser), this limits the educational value for file operations, text processing, and system commands.

5. **Missing `-p` for mkdir** is a significant gap that prevents common directory creation patterns.

6. **`msfconsole` enters a mode that processes no commands**, leaving students at a dead-end prompt.

### Technical Debt

| Debt Item | Impact | Effort to Fix |
|-----------|--------|---------------|
| VFS mutability violations | High — correctness bugs | Medium — rewrite all file handlers to use immutable pattern |
| Duplicated dispatch in `commands.ts` | Medium — maintenance burden | Low — remove `executeCommand`, keep only `executeCommandInternal` |
| No command metadata | High — help text must be manually synced | Medium — add metadata to command registry |
| No shared flag parser | Medium — inconsistent flag handling | Medium — create utility function |
| No shared file resolver | Medium — repeated findNode+error patterns | Low — create helper function |
| `TerminalShell.tsx` monolith | Medium — hard to maintain | High — split into focused components |
| `JOB_STORE` module-level state | Low — cross-session interference | Low — move to terminal state |
| `as any` casts in commands.ts | Low — type safety | Low — fix type definitions |
| `InteractiveTerminal.tsx` duplicate | Low — potential confusion | Low — audit and remove if obsolete |
| `dist/` in version control | Low — repo bloat | Low — add to .gitignore |

### Priority Roadmap

#### Critical Issues
1. Fix VFS mutability violations across all file handlers
2. Fix `sudo` to have a mechanism for becoming root (or document it as permanently non-functional)
3. Add automated tests for `filesystem.ts`, `parser.ts`, `state.ts`, and key handlers
4. Fix `curl` JSON.parse crash on malformed POST data

#### High Priority Improvements
1. Add `mkdir -p` support
2. Create shared flag-parsing utility
3. Create shared file-resolution helper (findNode + error handling)
4. Remove duplicated dispatch logic in `commands.ts`
5. Add command metadata system (description, flags, syntax) to replace hardcoded help text
6. Fix `cp -r` to deep-copy children
7. Add `exit` from msfconsole mode

#### Medium Priority Improvements
1. Split `TerminalShell.tsx` into focused components (keyboard handler, renderer, persistence)
2. Split `files.ts` into sub-modules (text processing, archive operations, hash operations)
3. Add `-v`, `-i`, `-n` flags to core file commands
4. Implement `test`/`[` builtin for conditional execution
5. Add proper `awk` pattern support beyond `{print $N}`
6. Add `sed` address ranges and additional commands

#### Low Priority Improvements
1. Remove or consolidate `InteractiveTerminal.tsx`
2. Add `eval` builtin (safely sandboxed)
3. Add `$((expr))` arithmetic expansion
4. Add `$(command)` command substitution
5. Add `history !string` prefix search
6. Add `unalias` command
7. Remove `dist/` from version control

#### Future Enhancements
1. Implement real Python/Node.js REPL via WebContainers or Pyodide
2. Add SSH session simulation with actual remote filesystem
3. Add interactive `less`/`more` with scrolling
4. Add interactive `top`/`htop` with process simulation
5. Implement `msfconsole` command processing
6. Add more Kali tools (dnsenum, wfuzz, whatweb, etc.)
7. Add progress tracking for completed commands
8. Add command hints/suggestions for educational guidance

### Verdict

**Is the simulator suitable for realistic cybersecurity education?**

Partially. The simulator excels at teaching command syntax, tool output formats, and reconnaissance workflows. The streaming output and progressive discovery model create an engaging experience. However, the lack of interactivity, canned security tool output, broken sudo, and inability to chain real operations (e.g., actually exploiting a vulnerability found by gobuster) limit its educational depth. It works well as a **training wheel** for students who have never used a terminal, but cannot replace hands-on experience with real tools.

**Is the simulator suitable for long-term maintenance?**

With caveats. The VFS mutability bugs and lack of tests make maintenance risky. Without refactoring the core architecture (immutable VFS operations, command metadata, shared utilities), adding features will become increasingly painful. The current codebase can support incremental improvements but would benefit from a focused cleanup sprint before major expansion.

**Is the simulator suitable for production-scale growth?**

Not in its current form. The flat command map, monolithic handler files, duplicated dispatch, and lack of abstractions create hard limits. Supporting hundreds of commands would require architectural changes: a command registry with metadata, lazy loading, shared utilities, and proper module organization.

**Is the simulator suitable as the foundation for future QYVORA learning experiences?**

Yes, with the caveat that the foundation needs reinforcement before building upon it. The streaming system, network discovery model, and context-aware VFS injection are strong architectural foundations that should be preserved. The weaknesses (mutability, tests, abstractions) are fixable without redesigning the system.

---

*End of audit. This document is the definitive technical reference for the QYVORA Terminal Simulation as of July 16, 2026.*
