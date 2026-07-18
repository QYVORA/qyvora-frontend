# Learning Paths

> **Status:** 📋 PLANNED - Design Complete, Not Yet Implemented  
> **Design Phase:** Complete (449 lines)  
> **Implementation Phase:** Not Started  
> **See Also:** `_ROADMAP.md` for implementation timeline

## ⚠️ Implementation Status

**THE LEARNING PATHS FEATURE DOES NOT EXIST YET.** This is a design document for a planned feature.

### What Does NOT Exist
- ❌ NO `/dashboard/learning-paths` route
- ❌ NO `LearningPathsPage` component
- ❌ NO `LearningPathDetailPage` component  
- ❌ NO `LearningPathCard` or `LearningPathStep` components
- ❌ NO `src/features/student/data/learningPaths.ts` data file

### Current State
- ⚠️ Sidebar "Learning Paths" button currently redirects to `/dashboard/bootcamps`
- ⚠️ Single hardcoded bootcamp (`bc_1775270338500`) shown instead

## Problem

The sidebar "Learning Paths" button currently links to `/dashboard/bootcamps`, which immediately redirects to a single hardcoded bootcamp (`bc_1775270338500`). This is a dead end — users see one bootcamp with no sense of progression or choice. There's no way to browse multiple paths or understand what skills each path builds.

## Goal

Replace the bootcamp redirect with a dedicated **Learning Paths** page that groups the 12 existing courses into skill-based guided tracks. Each track is a curated sequence of courses with prerequisites, progress, and a clear "you are here" indicator.

## Current Assets

### Courses (12 total, 6 categories)

| ID | Title | Category | Level | Prerequisites |
|----|-------|----------|-------|---------------|
| `linux-terminal-101` | Linux Terminal 101 | terminal | beginner | — |
| `windows-cmd-101` | Windows CMD 101 | terminal | beginner | — |
| `networking-101` | Networking 101 | networking | beginner | linux-terminal-101 |
| `python-for-hackers-101` | Python for Hackers | programming | beginner | — |
| `git-github-101` | Git & GitHub | programming | beginner | — |
| `web-technologies-101` | Web Technologies | web-security | beginner | networking-101 |
| `web-recon-101` | Web Recon | web-security | intermediate | web-technologies-101 |
| `burp-suite-101` | Burp Suite | tools | intermediate | web-technologies-101 |
| `sql-injection-101` | SQL Injection | web-security | intermediate | web-technologies-101 |
| `wifi-fundamentals-101` | WiFi Fundamentals | wireless | beginner | — |
| `nmap-101` | Nmap | tools | beginner | networking-101 |
| `wireshark-101` | Wireshark | tools | intermediate | networking-101 |

### Existing prerequisite chains

```
linux-terminal-101
  └─ networking-101
       ├─ web-technologies-101
       │    ├─ web-recon-101
       │    ├─ burp-suite-101
       │    └─ sql-injection-101
       ├─ nmap-101
       └─ wireshark-101
```

### Existing progress tracking

- Courses: `localStorage` key `qyvora_course_progress_{courseId}` stores `{ completedLessons, lastLesson }`
- Purchase status: API `GET /cp/transactions` returns purchased course IDs
- No backend learning path endpoint exists yet — all progress is frontend-local

---

## Proposed Learning Tracks

### Track 1: Terminal Foundations
**Icon:** `Terminal` | **Level:** Beginner | **Estimated:** ~140 min

```
1. Linux Terminal 101
2. Windows CMD 101
```

**Purpose:** Get comfortable with both major OS command lines before anything else.

### Track 2: Network Operations
**Icon:** `Globe` | **Level:** Beginner → Intermediate | **Estimated:** ~200 min

```
1. Linux Terminal 101          (prerequisite)
2. Networking 101
3. Nmap 101
4. Wireshark 101
```

**Purpose:** Understand networks from the ground up — protocols, scanning, packet analysis.

### Track 3: Web Security
**Icon:** `Shield` | **Level:** Beginner → Intermediate | **Estimated:** ~250 min

```
1. Networking 101              (prerequisite)
2. Web Technologies 101
3. Web Recon 101
4. SQL Injection 101
5. Burp Suite 101
```

**Purpose:** Full web security pipeline — from understanding HTTP to exploiting and defending.

### Track 4: Developer Toolkit
**Icon:** `Code` | **Level:** Beginner | **Estimated:** ~120 min

```
1. Python for Hackers 101
2. Git & GitHub 101
```

**Purpose:** Essential dev skills for scripting, automation, and collaboration.

### Track 5: Wireless Security
**Icon:** `Wifi` | **Level:** Beginner | **Estimated:** ~70 min

```
1. WiFi Fundamentals 101
```

**Purpose:** Standalone wireless track (expandable as more wireless courses are added).

---

## Data Model

### New file: `src/features/student/data/learningPaths.ts`

```typescript
export interface LearningPathCourse {
  courseId: string;          // references COURSES[].id
  required?: boolean;       // if true, must complete before next step (default: true)
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;             // lucide icon name
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  courseIds: string[];      // ordered sequence of course IDs
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'terminal-foundations',
    title: 'Terminal Foundations',
    description: 'Master both major OS command lines.',
    icon: 'Terminal',
    level: 'beginner',
    estimatedMinutes: 140,
    courseIds: ['linux-terminal-101', 'windows-cmd-101'],
  },
  {
    id: 'network-operations',
    title: 'Network Operations',
    description: 'Protocols, scanning, and packet analysis.',
    icon: 'Globe',
    level: 'beginner',
    estimatedMinutes: 200,
    courseIds: ['linux-terminal-101', 'networking-101', 'nmap-101', 'wireshark-101'],
  },
  {
    id: 'web-security',
    title: 'Web Security',
    description: 'From HTTP to exploitation and defense.',
    icon: 'Shield',
    level: 'intermediate',
    estimatedMinutes: 250,
    courseIds: ['networking-101', 'web-technologies-101', 'web-recon-101', 'sql-injection-101', 'burp-suite-101'],
  },
  {
    id: 'developer-toolkit',
    title: 'Developer Toolkit',
    description: 'Scripting, automation, and collaboration.',
    icon: 'Code',
    level: 'beginner',
    estimatedMinutes: 120,
    courseIds: ['python-for-hackers-101', 'git-github-101'],
  },
  {
    id: 'wireless-security',
    title: 'Wireless Security',
    description: 'Wireless networks and their attack surface.',
    icon: 'Wifi',
    level: 'beginner',
    estimatedMinutes: 70,
    courseIds: ['wifi-fundamentals-101'],
  },
];
```

### Progress helper: `getLearningPathProgress(pathId)`

```typescript
function getLearningPathProgress(pathId: string): {
  completed: number;
  total: number;
  percentage: number;
  currentCourseIdx: number;
  purchased: boolean;
} {
  const path = LEARNING_PATHS.find(p => p.id === pathId);
  // Check localStorage for each course's completion
  // Check purchase status for all courses in path
  // Return aggregated progress
}
```

---

## Page Design

### Route: `/dashboard/learning-paths`

**Layout:**
```
┌─────────────────────────────────────────────┐
│ Learning Paths                               │
│ Choose a skill track and follow it end       │
│ to end. Each path is a curated sequence      │
│ of courses with clear progression.           │
├─────────────────────────────────────────────┤
│                                              │
│ ┌──────────────┐  ┌──────────────┐          │
│ │ Terminal     │  │ Network      │          │
│ │ Foundations  │  │ Operations   │          │
│ │              │  │              │          │
│ │ 2 courses    │  │ 4 courses    │          │
│ │ ~140 min     │  │ ~200 min     │          │
│ │ ●●○○ (50%)  │  │ ●○○○ (25%)  │          │
│ │ [Continue]   │  │ [Start]      │          │
│ └──────────────┘  └──────────────┘          │
│                                              │
│ ┌──────────────┐  ┌──────────────┐          │
│ │ Web Security │  │ Developer    │          │
│ │              │  │ Toolkit      │          │
│ │ 5 courses    │  │ 2 courses    │          │
│ │ ~250 min     │  │ ~120 min     │          │
│ │ ○○○○○ (0%)  │  │ ●● (100%)   │          │
│ │ [Start]      │  │ [Review]     │          │
│ └──────────────┘  └──────────────┘          │
│                                              │
│ ┌──────────────┐                             │
│ │ Wireless     │                             │
│ │ Security     │                             │
│ │ 1 course     │                             │
│ │ ~70 min      │                             │
│ │ ○ (0%)       │                             │
│ │ [Start]      │                             │
│ └──────────────┘                             │
└─────────────────────────────────────────────┘
```

### Route: `/dashboard/learning-paths/:pathId`

**Layout:**
```
┌─────────────────────────────────────────────┐
│ ← Back to Learning Paths                     │
│                                              │
│ Web Security                                 │
│ From HTTP to exploitation and defense        │
│ Intermediate · ~250 min · 5 courses          │
│                                              │
│ Progress: ████░░░░░░ 2/5 courses (40%)       │
│                                              │
│ ┌── Step 1 ──────────────── ✓ Complete ──┐  │
│ │ Networking 101                           │  │
│ └─────────────────────────────────────────┘  │
│                    │                          │
│ ┌── Step 2 ──────── ● In Progress ──────┐  │
│ │ Web Technologies 101                    │  │
│ │ Continue lesson 3 of 8                  │  │
│ └─────────────────────────────────────────┘  │
│                    │                          │
│ ┌── Step 3 ──────── ○ Locked ───────────┐  │
│ │ Web Recon 101                           │  │
│ │ Complete Web Technologies first          │  │
│ └─────────────────────────────────────────┘  │
│                    │                          │
│ ┌── Step 4 ──────── ○ Locked ───────────┐  │
│ │ SQL Injection 101                       │  │
│ └─────────────────────────────────────────┘  │
│                    │                          │
│ ┌── Step 5 ──────── ○ Locked ───────────┐  │
│ │ Burp Suite 101                          │  │
│ └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Card Design (LearningPathCard)

Each card on the listing page shows:
- Path title and description
- Icon (from lucide)
- Skill level badge
- Estimated total time
- Course count
- Progress bar with completed/total courses
- Action button: "Start" (not started), "Continue" (in progress), "Review" (100%)
- Locked state if prerequisite courses aren't purchased

### Step Design (on path detail page)

Each step in the path shows:
- Course number (01, 02, 03...)
- Course title
- Status: `completed` (green check), `current` (active border), `locked` (faded, lock icon)
- If current: "Continue lesson X of Y" with link to CourseLessonPage
- If locked: "Complete [Course Name] first"
- If completed: completion timestamp or "Review" link

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/features/student/data/learningPaths.ts` | Path definitions + progress helpers |
| `src/features/student/pages/LearningPathsPage/index.tsx` | Listing page (all paths) |
| `src/features/student/pages/LearningPathDetailPage/index.tsx` | Single path detail with course steps |
| `src/features/student/components/learning-path/LearningPathCard.tsx` | Card component for listing |
| `src/features/student/components/learning-path/LearningPathStep.tsx` | Step component for detail view |

## Files to Modify

| File | Change |
|------|--------|
| `src/app/router.tsx` | Add routes for learning paths, update bootcamp redirect |
| `src/features/student/components/layout/Sidebar.tsx` | Change "Learning Paths" path from `/dashboard/bootcamps` to `/dashboard/learning-paths` |
| `src/features/student/components/layout/SearchBar.tsx` | Update search entry path |
| `src/features/student/components/LearningPathMap.tsx` | Update "View All" link |
| `src/features/student/components/dashboard/ActiveDeployments.tsx` | Update "View All" link |
| `src/features/student/components/layout/StudentTopbar/mobileNav.ts` | Update HPB mobile link |

---

## Implementation Phases

### Phase 1: Sidebar + Route (current session)
- [ ] Create `learningPaths.ts` data file with 5 tracks
- [ ] Add `/dashboard/learning-paths` route (placeholder page)
- [ ] Add `/dashboard/learning-paths/:pathId` route (placeholder page)
- [ ] Update sidebar "Learning Paths" path to `/dashboard/learning-paths`
- [ ] Update SearchBar path
- [ ] Update LearningPathMap "View All" link
- [ ] Update ActiveDeployments "View All" link
- [ ] Update mobile nav HPB link

### Phase 2: Listing Page
- [ ] Build `LearningPathsPage` with grid of `LearningPathCard` components
- [ ] Each card shows progress, course count, estimated time
- [ ] Link cards to `/dashboard/learning-paths/:pathId`

### Phase 3: Detail Page
- [ ] Build `LearningPathDetailPage` with vertical step timeline
- [ ] Each step shows course status (completed/current/locked)
- [ ] Current step links to `CourseLessonPage`
- [ ] Show aggregate progress bar at top

### Phase 4: Progress Integration
- [ ] Implement `getLearningPathProgress()` using localStorage
- [ ] Cross-reference with purchase API for lock states
- [ ] Handle shared courses across paths (e.g., networking-101 appears in 2 paths)

---

## Open Questions

1. **Shared courses across paths:** `networking-101` appears in both Network Operations and Web Security paths. If a user completes it in one path, should it count as completed in the other? (Recommended: yes — progress is per-course, not per-path.)

2. **Purchase model:** Should users need to purchase all courses in a path upfront, or can they purchase individually as they progress? (Recommended: individually — show locked state with "Purchase" CTA for unpurchased courses.)

3. **Bootcamp relationship:** The existing Hacker Protocol Bootcamp (`bc_1775270338500`) is a separate system. Should it appear as a learning path, or stay as its own thing? (Recommended: keep separate for now — bootcamp has backend progress tracking, learning paths are frontend-only.)

4. **Backend sync:** Currently all course progress is localStorage. Should learning path progress eventually sync to the backend? (Recommended: yes, but not in v1.)
