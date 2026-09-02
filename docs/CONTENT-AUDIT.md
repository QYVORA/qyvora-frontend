# QYVORA Learning Content Deep Audit

**Date:** 2026-09-02 · **Mode:** read-only content audit (no files changed) · **Root:** `/home/wsuits6/WORK/QYVORA/core`

**Verification:** every P0/P1 terminal-engine claim was re-checked directly in SimulatedTerminal source during a follow-up pass (command registry, handlers, parser, VFS payloads, mission templates) — findings confirmed at the cited lines, with one correction noted inside D.4 (redirection `>` does work) and E9 corrected (the `database` field was misdescribed).

**Scope:** every repository surface that delivers learning content — courses, Hacker Protocol Bootcamp (frontend + backend), rooms, lab simulations, missions, room gate quizzes, the SimulatedTerminal (VFS payloads + help text + handlers), walkthrough UI that carries instructional copy, marketing/landing copy that describes the curriculum, and i18n strings.

**Evidence conventions:** each finding quotes the existing wording, cites `file:line` (repo-relative), assigns a severity, and where useful a category from `TECHNICAL_ERROR / MISLEADING_EXPLANATION / MISSING_CONTEXT / OUTDATED_INFORMATION / INCORRECT_TERMINOLOGY / UNCLEAR_EXPLANATION`.

**Severity:** CRITICAL = technically wrong, dangerously misleading, renders broken, or prevents completion; HIGH = major educational problem, unexplained prerequisite, severe wording, or significant progression break; MEDIUM = understandable but unnecessarily difficult / inconsistent / poorly structured; LOW = minor wording or grammar.

---

## A. Executive Summary

### Overall content quality
The curriculum is genuinely strong underneath its roughness. The best files (`web-technologies-101`, `sql-injection-101` lessons, `password-exercises`, most of `sql-injection-data`) explain concepts before using them, scaffold with progressive hints, and keep prose tight. The bootcamp Phase 1 combines narrative (`Valkyrie`), ethics/scope framing, and hands-on terminal steps well. But the delivery layers — rendering, the interactive terminal, quiz correctness, prerequisites metadata, and marketing claims — contain systemic problems that materially damage the beginner experience.

### Biggest weaknesses
1. **The interactive SimulatedTerminal contradicts the lessons it is supposed to execute** (Section D/E, F): students are told to run commands that the engine does not implement — `nmap --version` fails on nmap-101's first lesson, `gzip --help` fails in the Compressing lesson, ~20 bootcamp command steps (`getfacl`, `su`, `visudo -c`, `chsh`, `locate`, `sudoedit`, `strace`, `pgrep`, …) print "command not found", `man` has 4 pages while lessons demo `man find`/`man ssh_config`, and the SUID `find -perm -4000` mini-challenge silently produces nothing.
2. **The bootcamp has three conflicting "sources of truth"** (`bootcampConfig.ts` `id:'hpb'`, `bootcampStructure.ts` "single source of truth" with 19× `steps: []`, backend `bootcamp-config.ts` `id:'bc_1775270338500'`). The backend wins in practice; requests carrying the frontend ID fall through to an empty DB default.
3. **Markdown fences are broken in 9+ course lessons** — callouts and mini-challenges render as literal code (`python-for-hackers-101` py-3/4/5, `web-technologies-101` web-2/4, `web-recon-101` recon-5, `windows-cmd-101` wc-7, `wifi-fundamentals-101` wf-3, `burp-suite-101` burp-9).
4. **Non-English text leaked into English lessons** (`windows-cmd-101` "分配", `burp-suite-101` "实操") and a ~40-line duplicated registry section in `windows-cmd-101` wc-8.
5. **Assumed knowledge outpaces prerequisites**: courses declare prerequisites for only 7 of 12 files; `wifi-fundamentals-101` (needs monitor-mode Linux tooling) and `python-for-hackers-101` (needs bash) declare none; bootcamp Phase 2 room 1 teaches SUID/SGID/GTFOBins before room 2 covers Users/Groups/Permissions; labs like kill-chain assume nmap/hydra/CrackMapExec without teaching or linking to the courses.
6. **Marketing claims inflate the shipped content**: "10 live labs"/"10 Labs"/"10 sandboxed environments" (5 real labs), "20 rooms" (19), "100+ walkthrough steps" (73), "Duration: 12 weeks" (~10.4 h), PoA-blockchain sold as past-tense while the CP page marks it "planned", "75% off" with no base price. Public HPB phase pages render **"0 steps · 20 min"** per room because marketing imports the `steps: []` structure file.
7. **Ethics framing is uneven**: OSINT simulation instructs doxing-style EXIF-GPS extraction and "phish Fatima (weakest password)" with only a villain-narrative hand-wave; nmap/web-recon practice targets third-party hosts (`httpbin.org`, `testphp.vulnweb.com`) without consistent own-network/consent caveats; `wifi-fundamentals-101` and `password-exercises` do include consent framing — the standard varies within one product.

### Strongest areas
- Concept-first explanations in `web-technologies-101` (TCP handshake, HTTP) and `sql-injection-101` (parameterized queries, least privilege).
- `password-exercises`: clean ordered progression (MD5→SHA-256→bcrypt→NTLM→shadow→multi-hash), correct hashcat mode flags, good stretching explanations.
- The progressive-hint / scaffolding model in walkthrough and lab UIs (`WalkthroughStep` hint levels, `ProgressiveHints`) — a well-designed "prepare the learner" mechanism, used consistently in labs.
- Bootcamp Phase 1's ethics/authorization/scope sequence; simulation villains-with-narrative approach that keeps abstract techniques concrete.

### Content architecture verdict
**Mixed.** The repo already has dedicated content/data directories (`student/data/courses`, `student/data/simulations`, `student/data/missions`, `student/constants/bootcamp*.ts`, `i18n/locales`, `marketing/data`) and most walkthrough pages render data rather than text (Section I "GOOD" examples). But three classes violate separation: (1) the bootcamp is split across 3 sources with no single owner; (2) substantial instructional text is embedded in components (`SimulatedTerminal/context/*.ts` VFS payloads, `KillChainLab`, lab diagram node labels, `NetworksPage` "try it yourself", walkthrough chrome); (3) marketing re-hardcodes curriculum facts (lab lists, course minutes, skill labels, "5 phases") instead of importing data.

---

## B. Complete Content Inventory

| # | Category | Name | File (repo-relative) | Location | Approx size | Difficulty | Audience | Source of truth | Issues |
|---|----------|------|----------------------|----------|-------------|-----------|----------|-----------------|--------|
| 1 | Course | Linux Terminal 101 | `qyvora-frontend/src/features/student/data/courses/courses/linux-terminal-101.ts` | whole file | 948 ln | Beginner | Students | Frontend data | `echo` without `-e` (lt-9); SUID/GTFOBins early (lt-4); "reconnaissance triad"; sandbox persona mismatch; 3-5 terminal commands unregistered |
| 2 | Course | Python for Hackers 101 | `.../courses/python-for-hackers-101.ts` | whole file | 930 ln | Beginner→Int | Students | Frontend data | Fence corruption py-3/4/5; port-443 note contradicts quiz; rockyou "14GB"; no prerequisites (needs bash) |
| 3 | Course | Windows CMD 101 | `.../courses/windows-cmd-101.ts` | whole file | 646 ln | Beginner | Students | Frontend data | Chinese text (wc-4); fence corruption (wc-7); duplicated registry section (wc-8); `.bat`/`.cmd` quiz; no prerequisites |
| 4 | Course | Networking 101 | `.../courses/networking-101.ts` | whole file | 584 ln | Beginner | Students | Frontend data | nmap topics before nmap course; un-caveated `-sV --script vuln` on 192.168.1.1 |
| 5 | Course | nmap 101 | `.../courses/nmap-101.ts` | whole file | 545 ln | Beginner | Students | Frontend data | quiz has two correct answers; `10.0.0.0/8` sweep no caveat; terminal can't run `nmap --version` |
| 6 | Course | Wireshark 101 | `.../courses/wireshark-101.ts` | whole file | 615 ln | Beginner | Students | Frontend data | clean; `head/tail/wc` short flags unsupported in terminal; uneven quiz counts |
| 7 | Course | Web Recon 101 | `.../courses/web-recon-101.ts` | whole file | 491 ln | Int | Students | Frontend data | fence corruption (recon-5); ffuf on httpbin.org; `/wp-admin . /wp-content` typo; unquoted `$OUTPUT_DIR` |
| 8 | Course | Web Technologies 101 | `.../courses/web-technologies-101.ts` | whole file | 492 ln | Beginner | Students | Frontend data | fence corruption web-2/web-4; otherwise strongest course |
| 9 | Course | SQL Injection 101 | `.../courses/sql-injection-101.ts` | whole file | 475 ln | Beginner→Int | Students | Frontend data | `OR '1'='1'` precedence error; `testphp.vulnweb.com`; stray indent sql-1 |
| 10 | Course | Burp Suite 101 | `.../courses/burp-suite-101.ts` | whole file | 416 ln | Int | Students | Frontend data | Chinese text (burp-7); unclosed fence (burp-9); `testphp.vulnweb.com` |
| 11 | Course | Wifi Fundamentals 101 | `.../courses/wifi-fundamentals-101.ts` | whole file | 371 ln | Int | Students | Frontend data | fence corruption (wf-3); wf-8 duplicates wf-6; no prerequisites |
| 12 | Course | Git & GitHub 101 | `.../courses/git-github-101.ts` | whole file | 519 ln | Beginner | Students | Frontend data | clean; "master" default branch outdated; minor indents |
| 13 | Course plumbing | Course registry/types | `.../data/courses/{courseData.ts,types.ts,lessons.ts,index.ts}` | registry + types | ~120 ln | — | — | Frontend | lessons registry cross-imports; quiz shape defined once |
| 14 | Bootcamp | Hacker Protocol content | `qyvora-frontend/.../student/constants/bootcampConfig.ts` | 5 phases, 19 rooms, 73 steps | 5,968 ln | Beginner→Adv | Students | *(backend in practice)* | id `hpb` vs backend `bc_…`; phase-count comments wrong; placeholder tokens; Valkyrie drops after Phase 1; `steps` content not mirrored |
| 15 | Bootcamp | Hacker Protocol structure | `qyvora-frontend/.../student/constants/bootcampStructure.ts` | 5 phases 19 rooms | 267 ln | — | Marketing/SEO | Claims "single source of truth" (false) | 19× `steps: []` → public pages show "0 steps"; id mismatch; room-count comments wrong |
| 16 | Bootcamp | Hacker Protocol backend | `qyvora-backend/src/shared/config/bootcamp-config.ts` | 5 modules 19 rooms | 129 ln | — | API/landing | Backend (effective) | `duration: '12 weeks'`; phantom live-session links dropped; id mismatch |
| 17 | Rooms | Room gate quizzes | `qyvora-frontend/.../student/data/quizzes.ts` | 19 rooms × 3 Q | 107 ln | Beginner | Students | Frontend | shape `text` vs `question`; `1:1` q1 verbatim-duplicates `bcq-1` |
| 18 | Lab | Kill Chain | `.../data/simulations/kill-chain-data.ts` | 2 scenarios | ~811 ln | Int→Adv | Students | Frontend | `whois` on private IP; CVE-2023-38408 mislabel; host identity flip; tool assumptions |
| 19 | Lab | OSINT | `.../data/simulations/osint-data.ts` | 5 challenges | ~890 ln | Beginner→Adv | Students | Frontend | doxing/ethics gap; fabricated `grep` output; formulaic narration |
| 20 | Lab | Password attacks | `.../data/simulations/password-exercises.ts` | 6 exercises | ~480 ln | Beginner→Adv | Students | Frontend | "password123 #2" overclaim; shadow-lab ethics framing; clean otherwise |
| 21 | Lab | Privilege escalation | `.../data/simulations/privesc-scenarios.ts` | 10 scenarios | ~2,400 ln | Beginner→Adv | Students | Frontend | `flag_output.txt` path split breaks one trigger; CVE fix version imprecise |
| 22 | Lab | SQL injection | `.../data/simulations/sql-injection-data.ts` | 6 targets | ~850 ln | Beginner→Adv | Students | Frontend | `database` field wrong; lone PostgreSQL outlier |
| 23 | Lab | Shared defs | `.../data/simulations/{types,labAccess,index}.ts` | types/registry | ~120 ln | — | — | Frontend | dead `LabScenario`; split `SqlInjectionTarget` |
| 24 | Mission | Missions (frontend) | `.../data/missions/index.ts` | type re-exports only | 1 ln | — | — | Backend | no mission content shipped |
| 25 | Mission | Daily missions | `qyvora-backend/.../data/missionTemplates.ts` | 4 missions | ~70 ln | Int | Students | Backend | "Network Recon"→privesc lab; `scenario_1` dead refs; hardcoded answers, no data |
| 26 | Mission | Weekly operations | `qyvora-backend/.../data/weeklyOperationTemplates.ts` | 6 steps | ~90 ln | Int | Students | Backend | verification ignores action ref; one room completes several steps |
| 27 | Terminal | VFS injected learning files | `.../SimulatedTerminal/context/{bootcampContent,labContent,courseContent}.ts` | file maps | ~100 ln | — | Students | Frontend component | educational payloads embedded in components |
| 28 | Terminal | Help text & man pages | `.../SimulatedTerminal/engine/handlers/helpTexts.ts` (+ handlers) | command docs | ~1,933 ln | — | Students | Frontend | advertises phantom commands; `man` 4 pages; 20+ taught commands unregistered |
| 29 | Terminal | Sandbox filesystem | `.../SimulatedTerminal/data/defaultFilesystem.ts` etc. | VFS | ~90 ln | — | Students | Frontend | missing `/etc/*`, `/var/log/*`, `/usr/share` paths lessons reference; uid mismatch |
| 30 | Component | Kill-chain lab page | `.../student/pages/labs/KillChainLab/index.tsx` | brief/objectives/debrief | ~200 ln | — | Students | Component | hardcoded narrative, objectives, takeaways, reflection |
| 31 | Component | Lab diagrams | `PrivescLab`, `SqlInjectionLab`, `PasswordLab` overflow nodes | flow labels | ~40 ln | — | Students | Component | educational diagram labels hardcoded |
| 32 | Component | Network lab page | `.../student/pages/NetworksPage/index.tsx` | hero + try-it-yourself | ~200 ln | — | Students | Component | instructional "try it yourself" tips embedded |
| 33 | Component | Walkthrough chrome | `WalkthroughLayout.tsx`, `WalkthroughStep.tsx`, `WalkthroughSidebar.tsx`, `StepNumberHeader.tsx`, `RoomHeader.tsx` | labels + completion text | ~90 ln | — | Students | Component | "Walkthrough complete!" etc. not i18n'd; hint-level labels here |
| 34 | Marketing | Landing data | `.../marketing/data/{learnData,cpPageData,...}.ts` | phase/cp copy | ~200 ln | — | Public | Frontend | phase descs duplicate en.json; "coordinator rules"; "bytecode" |
| 35 | Marketing | Course/lab inventories | `LabsPage.tsx`, `LandingLabsSection.tsx`, `LandingCoursesSection.tsx`, `CoursesCarousel.tsx`, `LabsCarousel.tsx` | hardcoded arrays | ~60 ln | — | Public | Component | 3rd copy of lab list; static minutes/counts; duplicated skill labels |
| 36 | Marketing | Bootcamp pages | `HpbPage.tsx`, `HpbPhasePage.tsx`, `cards/RoomSection.tsx` | hero + stats | ~90 ln | — | Public | Component | "0 steps" bug; "12 weeks"; hardcoded "5 phases" |
| 37 | Marketing | Blogs | `blogs-medium/*.md` + `BlogsPage/*.tsx` | articles | ~600 ln | — | Public | Both (md + tsx duplicate) | "20 rooms"; PoA blockchain past-tense; QuitRoot/QuiteRoot; phase-title drift |
| 38 | i18n | Locales | `src/i18n/locales/*.json` | 19 files | en ~2,700 ln | — | All | Frontend | "10 Labs" ×19; phantom lab registry; dupe of learnData; promo "75% off" |
| 39 | Backend | SiteContent | `qyvora-backend/.../models/SiteContent.ts` | defaults | ~110 ln | — | API | Backend | no learning claims (clean); duplicate stat served |
| 40 | Backend | Public/bootcamp endpoints | `public.controller.ts`, `student-utils.ts` | served bootcamp | ~240 ln | — | API | Backend | hardcoded-course-first; empty DB fallback on id mismatch |

---

## C. Content Architecture Audit

### C.1 — Where each category lives and whether it is separated from UI

| Content | Source of truth | Location | Embedded in UI? | Duplicated? | Verdict |
| --- | --- | --- | --- | --- | --- |
| Courses | Frontend data | `src/features/student/data/courses/courses/*.ts` | No (rendered by `WalkthroughLayout`/lesson page) | Course descriptions re-copied in marketing `LandingCoursesSection`; minutes hardcoded | Good separation, marketing drift |
| Bootcamp | **Three sources**: frontend `bootcampConfig.ts` + `bootcampStructure.ts` + backend `bootcamp-config.ts` | `constants/*` + `qyvora-backend/src/shared/config` | No (step copy in data), but structure copy lives in a stage component | Yes — same rooms described in all three; backend is effective owner | **Broken separation** |
| Rooms | frontend `bootcampConfig` (steps) + `quizzes.ts` (gate quizzes) | `constants/bootcampConfig.ts` + `data/quizzes.ts` | Quizzes in data file, rendered by `QuizModal`/`QuizGateModal` (those are i18n-chrome only) | Gate quiz `1:1` duplicates inline `bcq-1` | Mostly separated; content duplication |
| Labs/simulations | Frontend data | `data/simulations/*.ts` | Data is clean; **but** `context/bootcampContent.ts`, `context/labContent.ts`, `context/courseContent.ts` inject learning files from components; lab pages own briefs/objectives/debrief | Lab list triplicated in marketing; diagram labels in components | Mixed |
| Walkthroughs | Data-driven | `WalkthroughLayout` renders steps from data | Walkthrough instructional chrome (labels, "Claim your CP", hint levels) is component-owned, English-only | — | Partially separated |
| Lessons | Frontend data | `courses/lessons.ts` registry → course files | rendered by course pages | — | Good |
| Missions | Backend templates | `qyvora-backend/.../data/missionTemplates.ts`, `weeklyOperationTemplates.ts` | No | Mission briefs reference labs by ids that match frontend (mostly) | Good structure, broken refs |
| Glossary / terminology | — | none exists | — | Terms explained ad hoc inside lessons | Missing |

### C.2 — Content flow traces (verified)

- **Static (courses/labs/missions an offense)**: data file → import → render via `WalkthroughLayout`/lab pages → learner. Most content follows this clean path.
- **Backend bootcamp flow**: DB → `SiteContent` → `getBootcampCourse` (`student-utils.ts:195-216`) → `getHardCodedCourse(bootcampId)` **first** (`:197-198`) → hardcoded `bootcamp-config.ts`; DB fallback only when id mismatch (`:203-210`) → returns `emptyCourse`. Frontend reconciles by **room title** at render time (`PhaseSection.tsx:31-33`) — fragile coupling.
- **Terminal flow**: `bootcampConfig.ts` step `terminalCommands` → `SimulatedTerminal` engine → registered handlers / `fakeNetwork`. This is the chain that breaks: commander expects commands the handler registry doesn't implement (Section D/F).
- **Quiz flow**: room gate at room end → `QuizModal`/`QuizGateModal` → `ROOM_QUIZ_BANK[f"{moduleId}:{roomId}"]` → fallback `FALLBACK_QUESTIONS`.

### C.3 — Concrete architecture problems

1. **Three bootcamp sources** (CRITICAL maintenance): changing a room title in one house breaks title-matching in the other without any compile error.
2. **Component-owned curriculum** (HIGH): terminal VFS payloads (`ROOM_FILE_MAP` ~40 files, `LAB_FILE_MAP`, practice exercises), `KillChainLab` briefing/debrief, lab diagram labels, `NetworksPage` tips — educational text mixed into UI/state.
3. **Marketing re-implements curriculum facts** (HIGH): lab list ×3, course minutes/counts, skill labels ×2, "5 phases".
4. **Quiz shapes diverge** (MEDIUM): gate quiz objects use `text`; course quiz type uses `question` — one pane of glass for quizzes would need normalization.

---

## D. Beginner-Friendliness Findings

Conventions: `Cat` = problem category (`LANG` language/complexity, `JARGON` unexplained term, `LOAD` cognitive load, `KNOW` assumed knowledge, `STRUCT` structure/pacing). Severity as defined.

### D.1 — Bootcamp

| # | File:lines | Existing wording | Problem | Cat | Sev | Recommendation |
|---|-----------|------------------|---------|-----|-----|----------------|
| D1 | `bootcampConfig.ts` Phase 2 room 1 (SUID/SGID/ACLs/GTFOBins lessons) | room 1 teaches setuid ("SUID (Set User ID) …"), ACLs and GTFOBins | Runs ahead of room 2's own "Users, Groups & Permissions" lesson — permissions concepts used before defined | KNOW | HIGH | Reorder room 1/room 2, or forward-reference room 2 within room 1 |
| D2 | `bootcampConfig.ts` offline-password & brute-force steps (Phases 3–4) | "offline brute-force" / "password hashing" framed as the attack | Concepts (hash types, wordlists, cracking cost) taught here but their courses come later | KNOW | MEDIUM | Link to `password-exercises` lab + nmap/linux lessons, or shrink to "you'll do this for real in the lab" |
| D3 | `bootcampConfig.ts:94` Phase 1 room 1 | `'Hacking, Cracking, Pentesting'` as a job-role list item | "Pentesting" used without expansion; "cracking" colloquial | JARGON | MEDIUM | "Penetration testing (pentesting)" on first use |
| D4 | `bootcampConfig.ts:347` Phase 1 | "The colour of the pentest report" | British "colour" amid US spelling elsewhere; also unexplained "pentest" | LANG | LOW | "color of a penetration test report"; normalize regional spelling once |
| D5 | `bootcampConfig.ts` Phases 2–5 | no `Valkyrie` narrator anywhere after Phase 1 | Consistent persona vanishes; Phase 2–5 steps are plain imperative text — tonal whiplash for beginners | STRUCT | MEDIUM | Reintroduce a lighter narrator or one consistent stylistic A/B |
| D6 | `bootcampConfig.ts:~2875` | `nmap -p 445 --script smb-vuln-ms17-0<target_ip>` | literal `<target_ip>` token reaches the command and truncates the script name | STRUCT | MEDIUM | fix token & name (`smb-vuln-ms17-010`), add own-network note |
| D7 | `bootcampConfig.ts` ~L3407, ~L5424/5504 | `Host: <target_ip>1`, `http://<target_ip>1/admin`, `api.hacker<target_site>` | placeholder mangling in learner-facing copy | STRUCT | LOW | correct tokens |
| D8 | Physical security room (Phase 5 room 3 territory) | lockpicking/cloning exercises framed as "the physical hacker's kit" | Needs legal/ethical framing out loud, like Phase 1 rooms get | KNOW | MEDIUM | add scope/authorization callout |
| D9 | Room gate quizzes `quizzes.ts` (whole) | every room-gate quiz repeats an inline step question (e.g. `1:1` q1 == `bcq-1`) | double-testing same phrasing, not a learning progression | STRUCT | MEDIUM | differentiate gate questions or drop one layer |

### D.2 — Courses

| # | File:lines | Existing wording | Problem | Cat | Sev | Recommendation |
|---|-----------|------------------|---------|-----|-----|----------------|
| D10 | `linux-terminal-101.ts` lt-4 (~L262) | "a reverse shell listener in a third [terminal]. `kill -9` is the nuclear option for killing hung exploits." | "reverse shell", "exploits", "listener" all appear before taught; the "Why this matters" for background jobs load-tests a beginner | KNOW | MEDIUM | define reverse shell & listener inline or defer to ssh/exploitation lesson |
| D11 | `linux-terminal-101.ts` lt-9 (~L545) | `echo "Host mytarget\n…" >> ~/.ssh/config` (no `-e`) | prints literal `\n`; the same lesson’s mini-challenge uses `echo -e` — contradicting examples confuse learners | LOAD | MEDIUM | use `printf` or add `-e`, keep both examples consistent |
| D12 | `linux-terminal-101.ts` intro | `user@qyvora:~$` persona vs the actual sandbox `kali@kali` | learner's first command runs in a box that doesn't look like the lesson's examples | KNOW | MEDIUM | align tutorial persona with sandbox prompt |
| D13 | `python-for-hackers-101.ts` py-1 L36-37 | comment `# "Port 443 is closed"` under a scan that reports "open" | text asserts the opposite of the output it explains (see E) | STRUCT | HIGH | rewrite comment to match output |
| D14 | `nmap-101.ts` nm-1 quiz & lesson | `nmap --version` vs `nmap -V` both listed as distinct install check commands | two correct answers; beginner can't tell they're the same flag | STRUCT | HIGH | pick one canonical check; explain equivalence |
| D15 | `windows-cmd-101.ts` wc-7 (~L428) | "Why this matters" callout physically inside a code fence | renders as code with `>` and `**` visible — first impression of the course is broken | STRUCT | CRITICAL | move callout out of the fence (F-cluster) |
| D16 | `windows-cmd-101.ts` wc-8 (L485-546) | entire "Common forensic registry locations" section duplicated ~40 lines apart | repeated text looks like a rendering bug | STRUCT | HIGH | delete one copy |
| D17 | `windows-cmd-101.ts` wc-3 | grammar "an breach" | typo-level | LANG | LOW | "a breach" |
| D18 | `sql-injection-101.ts` sql-4 | `admin' OR '1'='1` — "this makes the query always true" | explanation only works via `username='admin'`; precedence is more subtle (E) | STRUCT | MEDIUM | rewrite as "the OR makes the password check true only if 'admin' matches" |
| D19 | `web-recon-101.ts` recon-5 (~L226) | wpscan/`curl` lines stray-indented inside fence; callout mid-fence | broken rendering + jargon ("wpscan", "fuzzing") unexpanded there | STRUCT | HIGH | move callout outside fence; expand wpscan once |
| D20 | `web-recon-101.ts` recon-4 (~L270-280) | `ffuf -w ... -u http://httpbin.org/FUZZ` mini-challenge | active scanning of a third-party service from a course step | KNOW | MEDIUM | use a local/consented target or note permission |
| D21 | `wifi-fundamentals-101.ts` wf-8 | "Why this matters" + mini-challenge reuse wf-6's deauth text verbatim | wrong-context duplication; beginner reads deauth advice during cracking lesson | STRUCT | HIGH | write a cracking-specific callout |
| D22 | Courses quiz counts | many lessons offer 2 questions where siblings offer 3 (nm-6, most sql/recon/wifi lesson quizzes, py-10, ws-6/9) | uneven "did you get it?" checkpoint | STRUCT | LOW | standardize 3 |

### D.3 — Labs / Simulation

| # | File:lines | Existing wording | Problem | Cat | Sev | Recommendation |
|---|-----------|------------------|---------|-----|-----|----------------|
| D23 | `osint-data.ts:348-350` | exiftool step then "send location-based phishing (e.g., 'Join us at this Lagos café…')" | personal doxing + live-phishing instruction with no authorization framing | KNOW | CRITICAL | re-skin as fictionalized data or add an explicit consent/scope lab intro |
| D24 | `osint-data.ts:862` | "phish Fatima (weakest password), exploit Grafana (default credentials)…" | operational targeting language, zero legal boundary | KNOW | CRITICAL | convert to defensive scenario or add authorization notice |
| D25 | `osint-data.ts:188-189` `604-605` | `grep -r … /usr/share/wordlists/emails.txt` then fabricated "Common patterns at novacorp.io" output | command shown doing something real grep can't do; the "output" contradicts the shell semantics the lesson is teaching | LOAD | MEDIUM | show the real grep theHarvester/Jotrey output or use `head` on a curated file |
| D26 | `kill-chain-data.ts` phase 3 | hydra/SSH handshake narrative assumes nmap + credentials concepts | learner who skipped courses is thrown straight in (no lab prerequisite gate) | KNOW | MEDIUM | add a pre-req checklist linking courses; define tool words in-lab |
| D27 | `privesc-scenarios.ts:473-563` | `flag_output.txt` written to `/tmp/` in narrative but `/home/dev/` in hints/trigger/solution | a ch4 trigger that can't fire is the apex of learner frustration | STRUCT | HIGH | unify the path |
| D28 | `password-exercises.ts` shadow lab | vignette frames dump of someone's `/etc/shadow` as "a security researcher who should know better" | no ownership/consent framing; the learner is told to crack a real person's hash | KNOW | MEDIUM | set it on an explicitly owned/lab box |
| D29 | `syndromic` phrasing repeated 5× in OSINT narratives | "He didn't hack… He just searched." / "She didn't write a single exploit…" | narrative formula rote after challenge 2 | LANG | LOW | vary voice |

### D.4 — Terminal & instructional UI

| # | File:lines | Existing wording | Problem | Cat | Sev | Recommendation |
|---|-----------|------------------|---------|-----|-----|----------------|
| D30 | `engine/handlers/utility.ts` (help) | `hpb-scan`, `hpb-status`, `hpb-tools` advertised | flagship custom commands that don't exist → "command not found" on the platform's own identity tool | STRUCT | CRITICAL | register the commands or stop advertising them |
| D31 | `engine/handlers/network.ts:151-160` + `nmap-101.ts:37` | "Run `nmap --version` to confirm Nmap is installed" → `nmap: no target specified` (targets filter drops every `-` arg, then errors when none left) | the course's very first command fails inside the tool it teaches (note: `nmap --help` DOES work via the `commands.ts:192` help intercept — adding `-V`/`--version` there is the trivial fix) | STRUCT | CRITICAL | special-case version/info flags or filter before target parsing |
| D32 | `engine/handlers/network.ts:150-160` + `nmap-101.ts:132` | `nmap --top-ports 10 scanme.nmap.org` → "Failed to resolve "10"" (`10` doesn't start with `-`, so it's kept as a "target"); same for any flag that takes a value — `nmap -p 22,80 <host>` → "Failed to resolve "22"" | flag values re-parse as targets | STRUCT | HIGH | parse flag-value pairs before target extraction |
| D33 | `engine/handlers/files.ts:253-263` | `wc -l`/`-w`/`-c` treat the flag as a filename → "No such file or directory" (`head`/`tail` handle `-n` at 229-251 but not `-5`/`-c`) | basic flags unrecognized in a beginner course | STRUCT | MEDIUM | implement count/list flags |
| D34 | `engine/commands.ts` + `engine/handlers/helpTexts.ts` | `gzip`/`gunzip` unregistered → "command not found" (verified: not in `commandMap` 7-167) despite the "Compressing" lesson and `file` typeMap recognizing `gz` | tool-lesson mismatch | STRUCT | MEDIUM | register gzip family |
| D35 | `engine/handlers/network.ts:531-532` | `ssh -V` → args all dropped as flags → usage error | beginner sees error, not version | STRUCT | MEDIUM | handle `ssh -V` |
| D36 | `engine/handlers/utility.ts:225-237` | `which bash` → "which: no bash in (...)" (`bash` absent from `binaryPaths`) | sandbox contradicts bash lesson | STRUCT | MEDIUM | add bash to binaryPaths |
| D37 | `engine/handlers/files.ts:394-396` + `data/defaultFilesystem.ts` + `bootcampConfig.ts:656` | `find / -perm -4000 -type f 2>/dev/null` (the bootcamp's "primary path to root") prints nothing — no node in `defaultFilesystem.ts` has an `s` permission bit, and `matchPerm` is substring matching; `2>/dev/null` is tokenized as one literal arg (`parser.ts` keeps `2>/dev/null`), passed through and ignored | SUID mini-challenge fundamentally broken — the taught signature move returns empty | STRUCT | HIGH | add a real SUID file to the VFS + honor `-perm` semantics and `2>` |
| D38 | `engine/handlers/system.ts:221-224` | `sudo -l` → all args start with `-` → dropped → `command` empty → `{ output: '', exitCode: 0 }` — blank line in the very room that teaches privilege escalation | lesson’s pivot step reads output that never appears (should list sudoers privileges) | STRUCT | HIGH | implement `-l`/`-v` |
| D39 | `WalkthroughLayout.tsx:195` | "Walkthrough complete! Claim your CP below." | hardcoded English completion copy in the shared shell (not i18n) | LANG | MEDIUM | move to i18n keys |
| D40 | `WalkthroughStep.tsx:38` | `['General Guidance','Approach','Tool Hint','Example Command']` | hint-level taxonomy lives in a component | STRUCT | MEDIUM | move to content config/glossary |

**Verified directly from engine source** (all of D30-D38 re-checked line-by-line in the SimulatedTerminal engine Sep 2026): `nmap --version`/`--help`-handling at `commands.ts:192` + `network.ts:151-160`; `man` = exactly 4 pages (ls/cat/grep/nmap, `utility.ts:206-211`) so `man find` → "No manual entry for find" exit 16; `which bash` absent, `utility.ts:225-237`; `qyvora-help` phantom commands (`qyvoraHelp` at `utility.ts:247-271` advertises `hpb-scan/hpb-status/hpb-tools/recon/course-status/lesson-info/practice`, none existed in `commandMap` `commands.ts:7-167` — only `tutorial-start/next/reset` and `qyvora-help` are real); `sudo` at `system.ts:218-235` (empty for `-l`); `id` hardcodes `uid=1001` at `system.ts:12` while `/etc/passwd` in `defaultFilesystem.ts:79` declares `kali:x:1000:1000` — inconsistent identity; `gecos` files absent — `/etc/group`, `/etc/crontab`, `/etc/sudoers`, `/var/log/*`, `/usr/share/nmap/scripts/`, `/usr/share/wordlists/rockyou.txt` do not exist in the VFS while `/usr/share` is an empty dir (`defaultFilesystem.ts:84-89`); `uname -r` reported `6.8.0-kali1-amd64` matches `dmesg` (consistent). Note one claim CORRECTED during verification: `echo Hello > hello.txt` (taught in `tutorialNext`, `utility.ts:301`) DOES create the file — `engine/state.ts:69-79` applies `stdoutRedirect` via `parse`/`executeSequence`, so `>`/`>>`/`<`/`&&`/`||`/pipes work in the real terminal; only `2>` (as in `2>/dev/null`) is not recognized, which is benign for a sim.

All above are in addition to the fence-corruption and mixed-language items flagged as CRITICAL in E.

---

## E. Technical Accuracy Findings

### E.1 — TECHNICAL_ERROR

| # | File:lines | Existing wording | Issue | Sev |
|---|-----------|------------------|-------|-----|
| E1 | `simulations/kill-chain-data.ts:83-87` | `whois 10.0.0.50` returning a full NovaCorp "NetRange: 10.0.0.0 - 10.0.0.255" record | private RFC1918 addresses are not in WHOIS; the output is impossible | CRITICAL |
| E2 | `simulations/kill-chain-data.ts:208` | "OpenSSH 7.9 - Auth Bypass (CVE-2023-38408)" | CVE-2023-38408 is the ssh-agent PKCS#11 RCE, not an OpenSSH 7.9 auth bypass | CRITICAL |
| E3 | `courses/nmap-101.ts` nm-1-q1 | options treat `nmap --version` and `nmap -V` as different answers | `-V` is a case-insensitive alias of `--version`; two correct options | CRITICAL |
| E4 | `courses/python-for-hackers-101.ts` py-1 L36-37 | scan output annotated `# "Port 443 is closed"` | 443 < 1024 → a sane scanner reports "open"; contradicts quiz py-1-q3 | HIGH |
| E5 | `simulations/privesc-scenarios.ts:886` | CVE-2015-1328 "Patched in kernel 3.19.0-21" | Ubuntu fix lines are 3.13.0-24/3.16.0-38/3.19.0-18, not 3.19.0-21 | MEDIUM |
| E6 | `courses/python-for-hackers-101.ts` py-7 | "rockyou.txt — 14GB of real leaked passwords" | wordlist is ~135 MB compressed / ~14 GB is incorrect by two orders of magnitude | MEDIUM |
| E7 | `simulations/osint-data.ts:188` / `:604` | `grep -r … /usr/share/wordlists/*.txt` then fake "Common patterns…" line | real grep can’t produce that output; non-standard wordlist files | MEDIUM |
| E8 | `courses/linux-terminal-101.ts` lt-9 | `echo "Host mytarget\n…" >> ~/.ssh/config` | without `-e` bash prints literal backslash-n; SSH config now broken | MEDIUM |
| E9 | `simulations/sql-injection-data.ts:48-49` | `database: 'novacorp'` (correct — a DB name) + `dbms: 'MySQL 8.0.35'` | minor internal inconsistency: the interactive `sqlmap` handler prints "the back-end DBMS is MySQL 8.0.35" (`handlers/security.ts:114`) while the labelled sim outputs print only "…is MySQL" (`sql-injection-data.ts:163,390`) — version string drifts between the two paths | LOW |
| E9b | `engine/handlers/system.ts:12` vs `data/defaultFilesystem.ts:79` | `id` reports `uid=1001(kali)` while `/etc/passwd` contains `kali:x:1000:1000` | sandbox user identity is internally inconsistent (terminal's own identity tool disagrees with its own `/etc/passwd`); the bootcamp's "view /etc/passwd" step surfaces it | MEDIUM |
| E9c | `engine/handlers/network.ts:399-407` | `whois 10.0.0.50` in the interactive terminal returns "Domain Name: 10.0.0.50 … Registrar URL: namecheap.com" | the whois handler only knows a domain-record shape; it accepts an IP and fabricates a bogus domain record (companion to E1, which is the canned narrative) | MEDIUM |

### E.2 — MISLEADING_EXPLANATION

| # | File:lines | Existing wording | Issue | Sev |
|---|-----------|------------------|-------|-----|
| E10 | `courses/sql-injection-101.ts:169-172,201` | sql-4 lesson + `sql-4-q1` (marked correct = "Because OR '1'='1' is always true, so the query returns the first user") for `WHERE username = 'admin' OR '1'='1' AND password = 'whatever'` | AND binds tighter than OR, so the WHERE reads `username='admin' OR ('1'='1' AND password='whatever')` — the injected clause evaluates FALSE (password won't equal 'whatever'); login succeeds only because the literal `admin` row matches. The "always true" claim only applies to the commented variant `' OR 1=1 --` (which the same lesson also shows correctly at 177-185). The quiz cements a structural misconception | HIGH |
| E11 | `simulations/kill-chain-data.ts:220` | SSH to web host `10.0.0.50` returns `admin@file-srv-01` | same IP gets two host identities across the scenario | HIGH |
| E12 | `simulations/osint-data.ts:732-733` | `dig ANY` + "The ANY query returns all record types in one shot" | modern resolvers minimize/omit ANY answers; oversimplified to the point of wrong for teaching | LOW |
| E13 | `courses/windows-cmd-101.ts` wc-5 q1 & `quizzes.ts '3:2'` q2 | `.bat` vs `.cmd` treated as mutually exclusive; GET excluded from "submit form data" | both are valid script extensions; GET/POST are both used for form submission | MEDIUM |
| E14 | `simulations/password-exercises.ts:279` | "`password123` is the second most common password in the world" | not supported by any canonical wordlist ranking | MEDIUM |

### E.3 — MISSING_CONTEXT

| # | File:lines | Existing wording | Issue | Sev |
|---|-----------|------------------|-------|-----|
| E15 | `courses/nmap-101.ts` nm-8 | `nmap -sn … 10.0.0.0/8` sweep + idle scan narrated as normal practice | no authorization caveat around mass-sweeping /13 networks | MEDIUM |
| E16 | `courses/networking-101.ts` (mini-challenge) | `nmap -sV --script vuln 192.168.1.1` presented as the "next step" | scanning any `192.168.1.1` isn't necessarily yours | MEDIUM |
| E17 | `courses/sql-injection-101.ts` sql-3 / `burp-suite-101.ts` | labs and steps run against `testphp.vulnweb.com` | third-party vulnerable site (often offline); no consent note | MEDIUM |
| E18 | `simulations/privesc-scenarios.ts:813-816` | "Dirty Kernel" challenge: "gcc exploit.c -o exploit" | the exploit file is never placed on the simulated disk; setup gap vs other labs that plant files | MEDIUM |
| E19 | `simulations/kill-chain-data.ts:196` | "OpenSSH 7.9" on an Ubuntu 20.04-era host, and Chrome-era timelines | version anachronism weakens the "realistic" promise | MEDIUM |

### E.4 — OUTDATED_INFORMATION

| # | File:lines | Existing wording | Issue | Sev |
|---|-----------|------------------|-------|-----|
| E20 | `courses/git-github-101.ts` (branch output) | examples show `On branch master` | GitHub default branch is `main` (2020+); a 2026 beginner will see `main` | LOW |
| E21 | `simulations/privesc-scenarios.ts:1091-1094` | builds against `python3.4` / `getcap /usr/bin/python3.4` | Python 3.4 is EOL; target is stated as current box, not "ancient" (that's the kernel chapter) | LOW |
| E22 | bootcamp + marketing | "12 weeks" duration and "100+ walkthrough steps" | not grounded in any shipped structure (see J) | HIGH |
| E23 | `simulations/privesc-scenarios.ts:886` fix table | "Patched in kernel 3.19.0-21" | imprecise fix-tracking date (also E5) | LOW |

### E.5 — INCORRECT_TERMINOLOGY / UNCLEAR_EXPLANATION

| # | File:lines | Existing wording | Issue | Sev |
|---|-----------|------------------|-------|-----|
| E24 | `learnData.ts:32` / `en.json:641` | "intercept packets at the raw bytecode level" | packets carry bits/bytes, not "bytecode" | MEDIUM |
| E25 | `learnData.ts:18` / `en.json:633` | "the legal boundaries, scopes, and coordinator rules" | "coordinator rules"/"scopes" is nonstandard & awkward | LOW |
| E26 | `linux-terminal-101.ts` | "reconnaissance triad" | not a standard term in this exact form; risks being read as jargon | LOW |
| E27 | `privesc-scenarios.ts:514` | "most common privesc vectors" | "privesc" slang unexpanded in learner text (title uses "privilege escalation") | MEDIUM |
| E28 | `simulations/osint-data.ts` | no legal disclaimer before extraction of personal metadata | unclear explanation of why this is allowed in the course vs illegal IRL | HIGH |

### E.6 — Rendering corruption cluster (CRITICAL)

Broken markdown fences mean the learner literally cannot read intended prose — treat as CRITICAL regardless of wording:

| File:lines | Lesson | Broken element |
|---|---|---|
| `python-for-hackers-101.ts` ~190-195 / 252-256 / 315-319 | py-3, py-4, py-5 | "Why this matters" + mini-challenge inside ` ```python `; orphaned statements |
| `web-technologies-101.ts` ~85-91 / 161-168 | web-2, web-4 | callout inside fence |
| `web-recon-101.ts` ~226-233 | recon-5 | wpscan line mid-fence |
| `windows-cmd-101.ts` ~428-443 | wc-7 | callout inside fence |
| `wifi-fundamentals-101.ts` ~102-109 | wf-3 | callout inside fence |
| `burp-suite-101.ts` ~378-390 | burp-9 | closing fence written inline after text — never closes |

### E.7 — Non-English text in English lessons (CRITICAL)

- `windows-cmd-101.ts` wc-4 (~L130): "which device**分配**s IP addresses"
- `burp-suite-101.ts` burp-7 (~L278): "more important than **实操**."

### E.8 — Verified-correct highlights (call these out as the model)

- `password-exercises.ts` hashcat modes (`-m 0/1000/1400/1800/3200`) and sha512crypt, NTLM, bcrypt semantics — correct.
- `sql-injection-data.ts` UNION/boolean-time/error-based steps, `information_schema` explanation — correct and well-pitched.
- `quizzes.ts` all 19×3 gate questions have a defensible correctIndex (only ambiguity noted at `'3:2'`/OWASP-year).
- Wireshark `dns.qry.name matches` regex and `tcp.port == 443` filters — correct.

---

## F. Difficulty & Progression Findings

### F.1 — Prerequisite metadata is incomplete (HIGH)
Only 7 of 12 courses declare `prerequisites` (web-recon/sql/burp→web-technologies; nmap/wireshark→networking; web-technologies→networking; networking→linux-terminal). Missing where needed most:
- `python-for-hackers-101` — its mini-challenges run bash (`python3 -c`, `os.system`) yet declares nothing → assumes earlier terminal skills.
- `wifi-fundamentals-101` — needs monitor-mode Linux tooling + networking theory; declares nothing.

### F.2 — Bootcamp-internal ordering (MEDIUM/HIGH)
- Room 1 of Phase 2 teaches SUID/ACLs/GTFOBins before room 2 (Users, Groups & Permissions).
- Offline-password/brute-force concepts surface in Phase 3–4 rooms before their dedicated courses/labs.
- Phase 5 physical-security room is the only room lacking an in-room legal/consent callout (Phase 1 sets the precedent; not followed).

### F.3 — Labs assume course knowledge they neither teach nor check (MEDIUM)
- `kill-chain-data.ts` narrates nmap→hydra→CrackMapExec→sqlmap without in-lab setup; `osint-data.ts` and `password-exercises.ts` define their tools in-file. Inconsistent hand-off; a learner who starts with the kill-chain lab gets un-gated "enumerate services with nmap" prompts.
- `privesc-scenarios.ts:343` suggests "Overwrite the script with a reverse shell…" — reverse shells are never taught in any course that gates this lab.

### F.4 — Terminal breaks the intended progression (CRITICAL)
Every "try it" step that errors (D30–D38) is a progression failure: the learner is expected to *confirm understanding by running*, and the tool answers with noise. The most damaging: `nmap --version` (first nmap lesson), `gzip --help` (Compressing lesson), `sudo -l` (escalation room), SUID `find -perm -4000` (both course and bootcamp — `defaultFilesystem.ts` has no SUID files at all so the canonical "path to root" command yields nothing), plus `wc -l`/`head -5` in placeholder terminal lessons. All confirmed directly in the engine during verification.

### F.4b — Terminal/sandbox identity drift (HIGH)
The sandbox tells three different stories about the user it simulates: `which bash` says bash is absent, `id` says `uid=1001`, and `/etc/passwd` says `kali` is `uid=1000 gid=1000`; required system files the lessons reference (`/etc/group`, `/etc/crontab`, `/etc/sudoers`, `/var/log/auth.log`, `/usr/share/wordlists/rockyou.txt`) do not exist. Each contradiction surfaces inside a lesson that specifically tells the learner to inspect that artefact.

### F.5 — Difficulty-label vs. material (MEDIUM)
- `wifi-fundamentals-101` is labeled intermediate and its prerequisites are absent; content (monitor mode, packet injection, WPA cracking) is genuinely intermediate but a beginner flagging it "intermediate" still can't gate on the bootcamp chain.
- Bootcamp Phase 5 weeds in social-engineering + phishing content with no phase-level "what you should already know" recap despite carry-over from Phases 3–4.

### F.6 — Even pacing issues (LOW)
Quiz counts vary 2 vs 3 across parallel lessons; OSINT challenges range 3–7 steps; gate quizzes are uniformly 3 — easy standardization win.

### F.7 — Healthy chains (call out explicitly)
Web-technologies→{sql, web-recon, burp}, networking→{nmap, wireshark, web-technologies}, linux-terminal→networking. These verified edges are correct and should be extended, mirrored to the labs, and enforced at run time (check when a learner opens a lab without completing its course).

---

## G. Terminology Audit

| Term | Variants found | Evidence | Consistency issue | Sev |
|---|---|---|---|---|
| Enumeration | `enumerate`, `enumerating`, `enumeration`, "reconnaissance triad" | `web-recon-101.ts:23,35,101,138`; `python-for-hackers-101.ts:731`; `kill-chain-data.ts:130,136,141,161` | Used as a module-level noun before lesson 1 defines it; fine elsewhere | MEDIUM |
| Penetration test | `Pentesting` (`bootcampConfig.ts:94,108`), `pentest reports` (`:347`), "pen test toolkit" (`sql-injection-data.ts:87`), "Full pentest from recon to exploitation" (`en.json:522`), "Penetration Testing" (service pages/SEO), "pentesting networks" (`helpTexts.ts:767`) | multiple | Never expanded at first learner-facing use; mixes "pentest/pentesting/pen test" | MEDIUM |
| Points system | `CyberPoints`, `CP`, `cyber points` (lowercase), `Cyber Coin` (`siteConfig.ts:137`) | `en.json`; `siteConfig.ts:137`; `so.json:595` | three names for one currency | MEDIUM |
| Recon | `recon`, "recon the target · enumerate services · escalate" (`SimulationsPage.tsx:53`) | marketing + lessons | verb-form marketing for beginners with no definition on that surface | LOW |
| privesc | `privesc`, `privilege escalation` | `privesc-scenarios.ts:514` vs title/`topicMap` | slang term unexpanded in lesson body | MEDIUM |
| Reverse shell | `reverse shell`, "reverse shell listener" | `linux-terminal-101.ts:262`, `privesc-scenarios.ts:343`, `bootcampContent.ts:21` | appears before defined (starting at lt-4 "Why this matters") | MEDIUM |
| Lateral movement | `lateral movement`, `pivot`, "pivoting" | `osint-data.ts:44,478`; `kill-chain-data.ts:325-402`; `linux-terminal-101.ts:549` (defined inline — good); `HackerProtocolBootcampBlog.tsx:198` | linux explains it well; labs use it before that course | LOW |
| Narrator | `Valkyrie`, `Valkyria`, `Valkyrie AI` in `CodeBlockRenderer.tsx:284` DIALOGUE regex | renderer | authoring labels inconsistent; persona vanishes after Phase 1 | MEDIUM |
| Brand | `QYVORA` vs `Qyvora`; "an Qyvora Hacker/operative" | `bootcampStructure.ts:115,205,213,262`; backend `bootcamp-config.ts:27` | two casings + wrong article | MEDIUM |
| Attackers | `attacker`, `hacker`, `threat actor` mixed freely | multiple | acceptable register variance; flag none | LOW |
| Regional | `colour` (British) alongside US spellings | `bootcampConfig.ts:347` | inconsistent regional spelling | LOW |
| Org name | `QuitRoot` vs `QuiteRoot` | `blogs-medium/01-…:73` vs `08-…:57`, `siteConfig.ts:129` | conflicting org spelling/naming | MEDIUM |

**Missing entirely:** a shared glossary / term primer. Definitions live ad hoc inside whichever lesson or simulation first needed a term; there is no `glossary` module and no first-use expansion hook (e.g. hover/tooltip or a "Terms" card).

---

## H. Duplication Audit

| # | Content | Locations | Verdict | Sev |
|---|---------|-----------|---------|-----|
| H1 | Bootcamp room definitions & step narrative | `bootcampConfig.ts` + `bootcampStructure.ts` + backend `bootcamp-config.ts` | 3 owners; title-matching coupling; drift risk realized (id mismatch) | CRITICAL |
| H2 | Room gate quiz `1:1` q1 == inline `bcq-1` | `quizzes.ts:4` vs `bootcampConfig.ts:52` | verbatim duplicate question in same room | MEDIUM |
| H3 | SUID/find theory + technique | `kill-chain-data.ts:268` ≈ `privesc-scenarios.ts:66` + quiz | same explanation, twice, with near-identical wording | MEDIUM |
| H4 | "Common forensic registry locations" section | `windows-cmd-101.ts` wc-8, ~40-line repeat (L485-502 vs 529-546) | accidental duplicate | HIGH |
| H5 | wf-8 "Why this matters" + mini-challenge reuse of wf-6 | `wifi-fundamentals-101.ts` | wrong-context duplication (deauth text in cracking lesson) | HIGH |
| H6 | Phase descriptions | `learnData.ts:18-46` == `en.json:633-649` | same strings from two sources | MEDIUM |
| H7 | Lab inventory | `LabsPage.tsx` (marketing `LABS`), `LandingLabsSection.tsx` `LABS`, student `pages/labs/LabsPage` (data-driven) | 3rd copy; CP ranges in one, colors in another | HIGH |
| H8 | Course inventory + minutes | `LandingCoursesSection.tsx` `COURSES` (+minutes) vs `data/courses` | static minutes/counts drift | MEDIUM |
| H9 | Skill labels (Beginner/Intermediate/Advanced) | `CoursesCarousel.tsx:16-20`, `LabsCarousel.tsx:26-30`, `LearningAccordion` | duplicated label maps | LOW |
| H10 | Blogs copy | `blogs-medium/*.md` duplicated as `BlogsPage/*.tsx` strings | two sources for one article | MEDIUM |
| H11 | Marketing "10 Labs / 10 live labs / 10 sandboxed" | `en.json:447-448,471` through all 19 locales | claim contradicts shipped 5; single copy bubble | CRITICAL |
| H12 | "20 rooms" | `blogs-medium/08-…:11,57` + `Hpb2026CaseStudy.tsx:44,174` | contradicts 19; second generation of copy | HIGH |

---

## I. Content Separation Findings

### I.1 — Content that should move into dedicated data/content files

| # | Location (now) | Content owned | Recommendation |
|---|----------------|---------------|----------------|
| I1 | `SimulatedTerminal/context/{bootcampContent,labContent,courseContent}.ts` | ~40 bootcamp files + per-lab notes + practice exercises injected into the fake filesystem | move payloads to `data/terminal-vfs/` per module; context only injects |
| I2 | `labs/KillChainLab/index.tsx:62-63,113-127,137,181,189-202` | lab description, objectives, Mission Debrief, "Key Takeaways", reflection prompt | move to `data/simulations/kill-chain-data.ts` or lab-level content registry |
| I3 | `PrivescLab/SqlInjectionLab/PasswordLab` flow-node labels | educational diagram node names | move to a shared `data/diagrams` const keyed by lab id |
| I4 | `NetworksPage/index.tsx:70-76,95-99,181-196` | hero + "Try it yourself" command tips block | move to `data/` (networks page uses terminal commands lessons define) |
| I5 | `WalkthroughLayout.tsx`, `WalkthroughStep.tsx` (hint-level labels), `WalkthroughSidebar/StepNumberHeader/RoomHeader` defaults | instructional chrome + "Walkthrough complete!" + hint taxonomy | move labels to i18n keys; hint taxonomy to content config |
| I6 | Marketing `LabsPage.tsx`, `LandingLabsSection.tsx`, `LandingCoursesSection.tsx`, `CoursesCarousel`, `LabsCarousel` | hardcoded lab/course inventories + skill labels | single-source from `student/constants` |
| I7 | `SimulationPage.tsx` (DEMO_FILES, "QYVORA - Python Exercise…") | demo learning exercises | move to data or delete (unused demo) |

### I.2 — Where separation is already good (keep the pattern)
- Course step/quiz content lives in `data/courses/**` and is rendered, not authored, by walkthrough components.
- `StepCard`, `QuizModal`, `QuizGateModal`, room sidebar/progress, `LabPage` render from data + i18n — clean.
- `missionTemplates`/`weeklyOperationTemplates` are backend data files with no UI coupling.
- `topicMap.ts` and `bootcampStructure.ts` are "registry" files used by multiple consumers (even if their data is wrong, the pattern is right).

**Overall:** the project has a working content/data architecture for 60% of the surfaces; the 40% embedded in components + the 3-way bootcamp split are the actionable cleanup.

---

## J. Priority Matrix

| Priority | Issue | Location | Why It Matters | Recommended Action |
|---|---|---|---|---|
| **P0** | Terminal can't run its own first-commands (`nmap --version`, `gzip --help`, `ssh -V`, `sudo -l`, SUID `find`, `which bash`, `head/tail/wc` flags, 20+ bootcamp commands) | `engine/handlers/*`, `helpTexts.ts`, `defaultFilesystem.ts`; taught in `bootcampConfig.ts`, `nmap-101.ts`, `linux-terminal-101.ts` | first five minutes of the product = terminal errors | register commands / special-case flag parsing; audit `terminalCommands` vs handler list |
| **P0** | Bootcamp id/structure mismatch (`hpb` vs `bc_1775270338500`) + `steps: []` structure source | `bootcampConfig.ts:17`, `bootcampStructure.ts:67`, backend `bootcamp-config.ts:11`, `getBootcampCourse` | empty courses served; public pages show "0 steps" | converge one id; one structure file; keep content in content file |
| **P0** | Broken markdown fences ×9 lessons + duplicated wc-8 registry | course files listed in E.6 | prose/mini-challenges invisible to learners | move callouts out of fences; dedupe |
| **P0** | Non-English text (`分配`,`实操`) | `windows-cmd-101.ts:130`, `burp-suite-101.ts:278` | learners see untranslated Chinese | replace with English |
| **P0** | Ethics: doxing + "phish Fatima" | `osint-data.ts:348-350,862` | legal/ethical liability + misleading beginners | add authorization framing or fictionalize |
| **P0** | Factual errors: `whois` on private IP; CVE-2023-38408; nmap `--version`/`-V` quiz | `kill-chain-data.ts:83,208`; `nmap-101.ts` | teach wrong facts | correct + add a CI lint for the pattern class |
| **P1** | `qyvora-help` advertises phantom commands | `engine/handlers/utility.ts` | flagship identity tool broken | register or remove |
| **P1** | mini-challenge/triangle answers contradict lessons (py-1 port note) | `python-for-hackers-101.ts:36-37` | learner confusion | align text to output |
| **P1** | Mission/weekly verification ignores referenced content + `scenario_1` dead refs | `missionTemplates.ts`, `weeklyOperationTemplates.ts`, `daily-mission.controller.ts:60-66`, `weekly-operation.controller.ts:60-76` | "Network Recon" completes in wrong lab; missions give hardcoded answers | fix refs; attach data; validate action per step |
| **P1** | Marketing counts wrong: "10 labs", "20 rooms", "100+ steps", "12 weeks", "75% off" | `en.json:447-448,471,974,457`; `blogs-medium/08-…:11`; `HpbPage.tsx:38`; `cpPageData.ts:163-164` | public claims don't match shipped content | reconcile or re-scope copy; add source-of-truth import |
| **P1** | Labs assume untaught knowledge (kill-chain tools, reverse shells) | `kill-chain-data.ts`; `privesc-scenarios.ts:343` | progression broken for lab-first learners | add prerequisite gate + define tools in-lab or link courses |
| **P1** | `an Qyvora`/casing + `QuitRoot`/`QuiteRoot` | `bootcampStructure.ts:115…`; blogs | brand consistency in learner copy | sweep + set casing rule |
| **P2** | Prereq metadata gaps (wifi, python) | `courses/*.ts` (only 7/12 declare) | sequencing correctness | add declared prereqs; mirror to labs |
| **P2** | privesc `flag_output.txt` path split | `privesc-scenarios.ts:416-563` | a trigger can't fire | unify path |
| **P2** | Quiz shape (`text` vs `question`); dead types (`LabScenario`, `SqlInjectionTarget`); `database` wrong | `types.ts`, `quizzes.ts`, `sql-injection-data.ts:830` | maintenance | normalize |
| **P2** | Terminology: pentest/privesc/enumeration first-use expansion; glossary | see G | beginner friction | add glossary + first-use expansion hook |
| **P3** | Bolts/nits: `pyp`-level typos, `<target_ip>1`, "colour", "bytecode", "coordinator rules", blog phase titles, phase-count comments | topical | polish | wide passes |

---

## K. Recommended Content Architecture

Based on the repository's *actual current* structure (it already has `data/courses`, `data/simulations`, `data/missions`, `constants/bootcamp*`, `i18n/locales`, `marketing/data`). Do not introduce a new framework — extend the pattern that already works.

### K.1 — One source of truth per category (fix the bootcamp split first)
- **Bootcamp:** keep a single content file (e.g. `data/bootcamp/*.ts` with rooms + steps + gate-quiz refs) and a *derived* structure (phases/rooms/titles/CP) exported for public pages; backend stores only ids/CP/completion rules (`bootcamp-config.ts`) and never room titles. Kill the title-matching coupling; key on ids.
- **Courses:** already good. Add a shared `types.ts` quiz shape; move first-use definitions to a `glossary.ts`.

### K.2 — Pull component-owned learner text into data
- Move `SimulatedTerminal/context/{bootcampContent,labContent,courseContent}.ts` payloads → `data/terminal-vfs/{bootcamp,labs,courses}/`.
- Move `KillChainLab` briefing/objectives/debrief/reflection into the scenario data; move lab diagram node labels into a shared `data/ui/graphs.ts`.
- Move `NetworksPage` "try it yourself" block behind the terminal-command registry so it can never drift from the handler list.
- Route walkthrough chrome (`WalkthroughLayout`, hint levels) through the same i18n the rest of student UI uses.

### K.3 — Register, don't re-implement, curriculum facts
- Export lab + course inventories (ids, names, CP ranges, minutes) once from `student/data`; marketing components import them. Deletes `LabsPage`/`LandingLabsSection`/`LandingCoursesSection` arrays, `SKILL_LABELS` duplicates, and the "10 labs/phases/steps" copy bubble.

### K.4 — Glossary / terminology module
Add a small `data/glossary.ts` (term → one-line definition) and a first-use expansion rule: every learner-facing surface that introduces "pentest", "privesc", "enumeration", "reverse shell", "lateral movement", "recon", "shell", "vulnerability/exploit" for the first time must expand it before using it as prior knowledge (either inline as courses already do in the best files, or via a Terms card in the walkthrough chrome). This directly addresses the audit's #1 beginner complaint without dumbing down vocabulary.

### K.5 — Consistency gate (cheap, repeatable)
- A content lint that: (a) parses every `.ts` string for unbalanced ``` fences, (b) warns on placeholder tokens `<...>`, (c) asserts course prerequisites are declared for courses that contain `terminalCommands`/scripting content, (d) asserts every `terminalCommands` entry is implemented in a registered terminal handler, (e) checks quiz shapes against shared types. This converts today's recurring failures into compile-time errors.

### K.6 — Explicit "not audited / out of scope"
No changes were made to any repository file during this audit. CSS, colors, spacing, responsiveness, animations, and general UI polish were deliberately excluded; backend non-content architecture and unrelated security issues were not evaluated.