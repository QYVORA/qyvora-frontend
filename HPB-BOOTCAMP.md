# HACKER PROTOCOL BOOTCAMP (HPB)

**Bootcamp ID:** bc_1775270338500
**Level:** Beginner
**Duration:** 6 weeks
**Price:** Free
**Status:** Active

## Overview

Hacker Protocol Bootcamp (HPB) teaches beginners to think like hackers — covering networking, Linux, web, and social engineering with hands-on labs and CTFs.

---

## Structure

The bootcamp is organised into **5 modules (phases)**. Each module contains multiple rooms. Rooms are the individual learning sessions — each room maps to one online class/lab session.

| Module | Title | Rooms |
|--------|-------|-------|
| 1 | The Hacker Mindset & Learning Path | 2 |
| 2 | Computer Networking Foundations | 3 |
| 3 | Linux & Terminal Mastery | 4 |
| 4 | Web & Backend Systems | 5 |
| 5 | Psychology & Social Engineering | 4 |

**Total rooms:** 18

---

## Module 1 — The Hacker Mindset & Learning Path

**Description:** Pattern recognition, adversarial thinking, and ethical discipline.

### Room 1.1 — The Hacker Mindset

**Overview:** Frame systems as attack surfaces and map assumptions before tools.

**Topics:**
- Threat modeling basics
- Recon mentality
- Ethical boundaries

---

### Room 1.2 — How to Learn Hacking Effectively

**Overview:** Build a study-execution-review loop that scales.

**Topics:**
- Feedback loops
- Structured notes
- Deliberate practice

---

## Module 2 — Computer Networking Foundations

**Description:** Understand traffic, routing, and exposure to map digital terrain.

### Room 2.1 — Networking Basics

**Overview:** Decode network conversations and trust boundaries.

**Topics:**
- OSI & TCP/IP
- DNS and HTTP flow
- Common protocol weaknesses

---

### Room 2.2 — Networking Intermediate

**Overview:** Convert raw scans into actionable system maps.

**Topics:**
- Subnetting
- Port scanning
- Service fingerprinting

---

### Room 2.3 — Hacker Network Techniques

**Overview:** Model how misconfigurations create exploit paths.

**Topics:**
- Pivot concepts
- Credential exposure
- Segmentation failures

---

## Module 3 — Linux & Terminal Mastery

**Description:** Command-line precision, automation, and environment control.

### Room 3.1 — Linux Basics

**Overview:** Navigate systems, users, and permissions.

**Topics:**
- Filesystem navigation
- Permissions model
- Process inspection

---

### Room 3.2 — Linux Intermediate

**Overview:** Build repeatable CLI workflows.

**Topics:**
- Pipes and redirects
- grep / sed / awk
- Automation patterns

---

### Room 3.3 — Terminal Basics

**Overview:** Use terminal-native tooling to accelerate recon.

**Topics:**
- Session hygiene
- tmux basics
- CLI orchestration

---

### Room 3.4 — Terminal Intermediate

**Overview:** Practice system control drills.

**Topics:**
- Privilege context checks
- Service triage
- Log debugging

---

## Module 4 — Web & Backend Systems

**Description:** Understand app architecture before exploitation.

### Room 4.1 — How the Web Works

**Overview:** Trace client-server interactions.

**Topics:**
- HTTP lifecycle
- Session handling
- Auth boundaries

---

### Room 4.2 — Website Architecture

**Overview:** Identify weak seams in layered systems.

**Topics:**
- Frontend/backend contracts
- API boundaries
- State risks

---

### Room 4.3 — Backend Basics

**Overview:** Track input handling and persistence paths.

**Topics:**
- Validation chains
- Query safety
- Error surface control

---

### Room 4.4 — Backend Intermediate

**Overview:** Map controls that reduce exploitability.

**Topics:**
- Secure defaults
- Rate controls
- Auditability

---

### Room 4.5 — Building a Full Stack App

**Overview:** Connect frontend and backend assumptions.

**Topics:**
- Cross-layer weaknesses
- Privilege boundaries
- Exploit chains

---

## Module 5 — Psychology & Social Engineering

**Description:** Human attack surfaces and ethical social strategy.

### Room 5.1 — Psychology in Hacking

**Overview:** Understand cognitive bias in human systems.

**Topics:**
- Bias mapping
- Trust exploitation patterns
- Context framing

---

### Room 5.2 — Social Engineering Basics

**Overview:** Build ethical simulation flows and pretexts.

**Topics:**
- Pretext design
- Scenario scripting
- Ethical boundaries

---

### Room 5.3 — Social Engineering Intermediate

**Overview:** Practice scenario mapping and response control.

**Topics:**
- Signal extraction
- Multi-step engagement
- Countermeasure awareness

---

### Room 5.4 — Social Engineering Practice

**Overview:** Run safe drills to test human attack paths.

**Topics:**
- Roleplay drills
- Red-team checklists
- Post-mortems

---

## CP Rewards (per room completion)

Each room awards CP on completion. Minimum is 250 CP. Harder/more technical rooms award more.

| Module | Room | Suggested CP |
|--------|------|-------------|
| 1 | The Hacker Mindset | 250 |
| 1 | How to Learn Hacking Effectively | 250 |
| 2 | Networking Basics | 300 |
| 2 | Networking Intermediate | 350 |
| 2 | Hacker Network Techniques | 400 |
| 3 | Linux Basics | 300 |
| 3 | Linux Intermediate | 350 |
| 3 | Terminal Basics | 300 |
| 3 | Terminal Intermediate | 350 |
| 4 | How the Web Works | 300 |
| 4 | Website Architecture | 350 |
| 4 | Backend Basics | 400 |
| 4 | Backend Intermediate | 450 |
| 4 | Building a Full Stack App | 500 |
| 5 | Psychology in Hacking | 300 |
| 5 | Social Engineering Basics | 350 |
| 5 | Social Engineering Intermediate | 400 |
| 5 | Social Engineering Practice | 450 |

CTF completion per module: **500 CP**
Full module completion bonus: **750 CP**

---

## Session Design Notes

Each room = one live online session. Sessions should follow this structure:

1. **Intro (5 min)** — recap previous room, set context for this one
2. **Concept delivery (20–30 min)** — teach the topic using the bullets as the outline
3. **Live demo / lab (15–20 min)** — hands-on walkthrough
4. **Q&A (10 min)**
5. **Assignment / reading** — point to reading links configured in the room

Meeting links are set per room in the admin dashboard under **Bootcamp Management → Content → Room → Meeting Link**.

---

## Admin Configuration Checklist

Before going live with a module:

- [ ] Set `meetingLink` for each room in the Content tab
- [ ] Set `cpReward` per room (see suggested values above)
- [ ] In **Phase Access** tab: toggle "Bootcamp Started" ON
- [ ] Unlock the module (check the module checkbox)
- [ ] Unlock rooms one at a time as sessions go live
- [ ] After each session: release a quiz via the **Quizzes** tab (Module ID + Room ID)
