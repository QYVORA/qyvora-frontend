# QYVORA Badge System Specification: Courses, Labs, and Ranks

> **Scope Note**: This specification governs canonical **Course completion badges**, **Lab completion badges**, and **Rank insignias** across the QYVORA platform. In accordance with platform governance, **Bootcamp badge assets and completion systems are strictly preserved and excluded** from redesign under this specification.

---

## 1. Architectural Overview & Philosophy

The QYVORA achievement and progression badge system embodies a "terminal-born, offensive security" philosophy:
1. **Unframed Vector Insignia**: Badges are the authoritative logos of the technology, tool, or scenario itself—not generic icons boxed into identical gradient cards or gaming inventories.
2. **Transparent Background Integrity**: Every badge renders directly on QYVORA's near-black dark surfaces (`#000000` / `#050505` / `#080808`), preserving its natural silhouette and aspect ratio without artificial background tiles or borders.
3. **Server-Authoritative Awarding**: The client only displays achievements verified and stored by the backend. Achievement records are idempotent, immutable upon issuance, and protected against forged client submissions.
4. **Accessible Micro-Interactions**: Badge interaction on desktop hover, keyboard focus, and mobile tap reveals rich metadata (completion timestamp, category, CP rewards, description) via accessible popovers without modal disruption.

---

## 2. Course Badge Specification

### A. Purpose & Identity
Course badges recognize operator mastery of fundamental and intermediate offensive security disciplines (e.g., Linux Terminal, Burp Suite, Network Reconnaissance, SQL Injection, Wireshark). Each badge acts as a verifiable digital credential of course curriculum completion.

### B. Visual & Asset Requirements
- **Primary Artwork**: The official transparent-background course logo or dedicated vector insignia.
- **Format**: Vector SVG or high-resolution WebP/transparent PNG (256×256px minimum bounding box).
- **Aspect Ratio**: Preserved 1:1 square canvas bounds; artwork centered with intrinsic proportions intact.
- **Rendering**: Rendered with subtle ambient depth (`filter: drop-shadow(0 2px 8px rgba(0,0,0,0.6))`) on QYVORA dark surfaces. Never contained within arbitrary rounded rectangles or cards.
- **Color Discipline**: Accent highlights must harmonize with QYVORA's `#06B66F` accent where applicable.

### C. Identifiers & Metadata Mapping
Every course maps to a canonical identifier in `@/shared/constants/achievements.tsx` and `@/features/student/data/courses/courseData.ts`:

| Course ID | Display Title | Category | Canonical Asset / Component |
|---|---|---|---|
| `linux-terminal-101` | Linux Terminal 101 | `terminal` | `LinuxTerminal101Icon` |
| `networking-101` | Networking Fundamentals | `networking` | `Networking101Icon` |
| `web-recon-101` | Web Reconnaissance | `web-security` | `WebRecon101Icon` |
| `nmap-101` | Network Scanning with Nmap | `tools` | `Nmap101Icon` |
| `burp-suite-101` | Burp Suite Essentials | `tools` | `BurpSuite101Icon` |
| `sql-injection-101` | SQL Injection Fundamentals | `web-security` | `SqlInjection101Icon` |
| `python-for-hackers-101` | Python for Hackers | `programming` | `PythonForHackers101Icon` |
| `wireshark-101` | Wireshark Packet Analysis | `networking` | `Wireshark101Icon` |
| `wifi-fundamentals-101` | Wireless Security Basics | `wireless` | `WifiFundamentals101Icon` |
| `windows-cmd-101` | Windows Command Line | `terminal` | `WindowsCmd101Icon` |
| `git-github-101` | Git & GitHub for Hackers | `tools` | `GitGithub101Icon` |
| `web-technologies-101` | Web Technologies 101 | `web-security` | `WebTechnologies101Icon` |

### D. Awarding Lifecycle & Backend Verification
1. **Completion Event**: When all lessons within a course are completed, the student client initiates an authenticated POST request to `/student/courses/:courseId/complete`.
2. **Server Verification**: The backend validates:
   - All required lessons and associated step quizzes meet passing criteria.
   - The user has an active session.
3. **Idempotent Record**: If verified, the server appends `:courseId` to the user's `completedCourseIds` array and issues the CP reward. If already completed, the endpoint returns the existing record with HTTP 200 without duplicate credit.
4. **Display**: The course logo immediately renders in the user's private and public profiles under `AchievementsSection`.

---

## 3. Lab Badge Specification

### A. Purpose & Identity
Attack Lab badges signify validated hands-on operational capability in live simulation scenarios, including Privilege Escalation, Password Cracking, SQL Injection Exploitation, OSINT Reconnaissance, and Cyber Kill Chain execution.

### B. Visual & Asset Requirements
- **Primary Artwork**: Custom vector emblems defined in `@/shared/components/icons/lab-icons/index.tsx`.
- **Styling**: Distinctive thematic vector styling with transparent background:
  - *Privesc*: Tactical shield with ascending escalation chevron (`#FBBF24`).
  - *Passwords*: Mechanical key mechanism with hash token markers (`#F59E0B`).
  - *SQL Injection*: Multi-tier database cylinder under syringe injection (`#06B66F`).
  - *OSINT*: Dual-focus reconnaissance optic with intelligence network node graph (`#0EA5E9`).
  - *Kill Chain*: Interlocking chain links within targeting reticle (`#DC2626`).
- **Dimensions**: ViewBox `0 0 100 100`, scalable from 48px to 128px without loss of detail.

### C. Identifiers & Registration
| Lab ID | Title | Emblem Component | Dominant Tone |
|---|---|---|---|
| `privesc` | Privilege Escalation Lab | `PrivescLabIcon` | Amber Gold |
| `passwords` | Password Cracking Lab | `PasswordsLabIcon` | Warm Amber |
| `sqli` / `sql-injection` | SQL Injection Lab | `SqlInjectionLabIcon` | QYVORA Green (`#06B66F`) |
| `osint` | OSINT Reconnaissance Lab | `OsintLabIcon` | Cyan Sky |
| `killchain` / `kill-chain` | Cyber Kill Chain Lab | `KillChainLabIcon` | Crimson Red |

### D. Awarding Rules
- **Flag Verification**: Lab completion is granted when the authoritative flag verification endpoint (`/labs/:labId/verify`) records a correct capture.
- **Storage**: Lab IDs are appended to `completedLabIds` in the user record.
- **Graceful Fallback**: If `completedLabIds` is absent in legacy profiles, `AchievementsSection` falls back to the count of completed interactive rooms to award canonical lab badges.

---

## 4. Rank Insignia Specification

### A. Relationship to Progression System
Ranks represent cumulative operator mastery across courses, labs, and CTFs. The rank is authoritative and computed from total earned XP / CyberPoints (CP). Ranks and insignia must NEVER be manually edited by users or calculated from incomplete client cache.

### B. Tier Hierarchy & Progression Thresholds

| Rank Tier | Minimum CP | Aesthetic Theme | Geometric Insignia Structure |
|---|---|---|---|
| **Candidate** | 0 CP | Initialization | Single minimalist chevron with central pulse node within guide shield. |
| **Contributor** | 3,000 CP | Activation | Dual nested chevrons with fortified apex node and lateral alignment pips. |
| **Specialist** | 5,000 CP | Proficiency | Hexagonal tactical crest with tri-tier chevrons and cardinal reticle ticks. |
| **Architect** | 9,000 CP | Mastery | Octagonal cyber-lattice crest with interlocking diamond geometry and vector anchors. |
| **Vanguard** | 17,000 CP | Apex Elite | Apex cyber aegis crest with radiant crown facets, internal core prism, and dual kinetic wings. |

### C. Technical SVG Geometry
- **Components**: Defined in `@/shared/components/profile/RankInsignia.tsx`.
- **ViewBox**: Standardized `0 0 48 48` for exact pixel alignment and optical balance.
- **Stroke Width**: 1.5px to 3px vector paths with `stroke-linecap="round"` and `stroke-linejoin="round"`.
- **Contrast**: Insignia utilizes `currentColor` with contextual class bindings (`text-accent`, `text-text-primary`, `text-text-muted`) to ensure pristine legibility across high-contrast dark environments.
- **Responsive Scales**:
  - `xs`: 16×16px (chips, inline tables)
  - `sm`: 20×20px (meta rows, dropdowns)
  - `md`: 24×24px (standard identity headers)
  - `lg`: 32×32px (large profiles)
  - `xl`: 40×40px (leaderboard podiums, certificate views)

### D. Fallback Behavior
Any unrecognized rank string (e.g. legacy titles or custom roles) is normalized via `normalizeRank()` to `Candidate` and renders `CandidateInsignia` without crashing or breaking layout geometry.

---

## 5. Developer Guide: Registering New Achievements

### Adding a New Course Badge
1. **Asset Creation**: Create a clean vector SVG component in `src/shared/components/icons/course-icons/` following the existing 1:1 transparent bounding box standard.
2. **Icon Mapping**: Export the component in `courseIcons.tsx` and register its mapping in `COURSE_ICON_MAP`.
3. **Achievement Entry**: Add the course definition to `courseData.ts`. `COURSE_ACHIEVEMENTS` in `@/shared/constants/achievements.tsx` will automatically ingest the new course.

### Adding a New Lab Badge
1. **Asset Creation**: Define the new lab vector emblem in `@/shared/components/icons/lab-icons/index.tsx`.
2. **Registry Mapping**: Add the key to `LAB_ICON_MAP`.
3. **Lab Definition**: Add the lab entry to `@/features/student/constants/labs.ts`. `LAB_ACHIEVEMENTS` will automatically derive the new badge.

---

## 6. Security, Privacy, and Duplicate Prevention

1. **Client Trust Model**:
   - The frontend never tells the backend "give me this badge". The frontend only submits proof of work (quiz answers, scenario flags, lesson steps).
   - The backend validates proof against hashed solutions and awards badges server-side.
2. **Idempotent Operations**:
   - Awarding methods use set operations (e.g., `$addToSet` in MongoDB or `ON CONFLICT DO NOTHING` in SQL) to prevent duplicate issuance upon replay.
3. **Public vs. Private Visibility**:
   - Public profile responses from `/public/users/:handle` include only approved badges, display name, handle, rank, CP, and user-authorized social connections (`githubPublic: true`).
   - Private fields (email, OAuth tokens, internal IDs) are omitted server-side.
