# Unified Lab Architecture

QYVORA has **one canonical learning entity: the Lab**.

A learner does not choose between a course, a room and a lab. They find a Lab,
open it, learn, practise and complete it. Bootcamp remains a branded programme
that contains Labs; it is not a competing learning category.

```
Find a Lab -> Open the Lab -> Learn -> Practise -> Complete
```

## 1. Lab formats

`format` is internal metadata that describes how a Lab is delivered. It is not a
separate destination.

| Format | Use | Source of truth |
|--------|-----|-----------------|
| `content` | Structured lessons, markdown, knowledge checks | `src/features/student/data/courses` |
| `hands-on` | Practical exercises, terminals, flags, simulations | `src/features/student/constants/labs.ts` + `pages/labs/*` |
| `hybrid` | Theory plus hands-on practice in one Lab | Content Lab whose lessons include a terminal or code playground |

The canonical catalogue lives in
`src/features/student/data/labs/unified.ts`:

- `UNIFIED_LABS` - every Lab (practical + content).
- `CONTENT_LABS` - former courses, exposed as content/hybrid Labs.
- `PRACTICAL_LABS` - former hands-on labs/rooms.
- `LAB_FORMAT_LABELS` / `LAB_FORMAT_SHORT_LABELS` - display labels.
- `getUnifiedLabById`, `getRecommendedLabs`, `getNewLabs`, `getLabsByFormat`.

The learner-facing discovery surface is `/dashboard/labs`
(`src/features/student/pages/labs/LabsPage`). Format is a filter tab, never a
separate navigation entry.

## 2. Route mapping

Learning routes are preserved. Unification changes discovery and terminology,
not the learning experiences themselves.

| Learner intent | Route |
|----------------|-------|
| Lab discovery | `/dashboard/labs` |
| Content Lab (former course) | `/dashboard/courses/:id` |
| Hands-on Lab | `/dashboard/labs/:id` |
| Bootcamp programme | `/dashboard/bootcamps` |
| Legacy courses listing | `/dashboard/courses` -> redirects to `/dashboard/labs` |

## 3. Content Labs (formerly courses)

These 12 learning experiences are now **Content Labs**. `format` is `content`
or `hybrid` depending on whether the lessons embed a terminal/playground.

| Lab | Difficulty | Category | Minutes | Format | Formerly |
|-----|------------|----------|---------|--------|----------|
| Linux Terminal 101 | beginner | terminal | 70 | hybrid | course |
| Windows CMD 101 | beginner | terminal | 50 | content | course |
| Networking 101 | beginner | networking | 60 | content | course |
| Python for Hackers 101 | beginner | programming | 85 | hybrid | course |
| Git & GitHub 101 | beginner | programming | 55 | content | course |
| Web Technologies 101 | beginner | web-security | 55 | content | course |
| Web Reconnaissance 101 | intermediate | web-security | 55 | content | course |
| Burp Suite 101 | intermediate | tools | 65 | content | course |
| SQL Injection 101 | intermediate | web-security | 85 | content | course |
| Wi-Fi Fundamentals 101 | beginner | wireless | 55 | content | course |
| Nmap 101 | beginner | tools | 60 | hybrid | course |
| Wireshark 101 | intermediate | tools | 65 | content | course |

Source: `src/features/student/data/courses/courses/*.ts`.

## 4. Hands-on Labs (formerly labs/rooms)

| Lab | Difficulty | CP reward | Route |
|-----|------------|-----------|-------|
| Privilege Escalation | beginner-advanced | 50-400 | `/dashboard/labs/privesc` |
| Password Cracking | beginner-advanced | 100-300 | `/dashboard/labs/passwords` |
| SQL Injection | beginner-advanced | 200-400 | `/dashboard/labs/sql-injection` |
| OSINT Recon | beginner-advanced | 150-400 | `/dashboard/labs/osint` |
| Kill Chain | intermediate-advanced | 500-600 | `/dashboard/labs/kill-chain` |
| Broken Access Control | beginner-intermediate | 150-200 | `/dashboard/labs/web-access-control` |
| API Security | intermediate | 200-250 | `/dashboard/labs/api-security` |
| Security Automation | beginner | 150 | `/dashboard/labs/automation` |
| Engagement Methodology | beginner | 150 | `/dashboard/labs/methodology` |
| Network Security | intermediate | 150-200 | `/dashboard/labs/network-security` |
| Wireless Security | beginner-intermediate | 150-200 | `/dashboard/labs/wlan-security` |
| AD Enumeration | intermediate | 200-250 | `/dashboard/labs/ad-enum` |
| Enterprise Attack Paths | advanced | 200-250 | `/dashboard/labs/attack-paths` |

Source: `src/features/student/constants/labs.ts`. The QOSE lab-to-module matrix
(`src/features/student/data/labs/lab-module-matrix.ts`) supplies `isNew` and
track metadata.

## 5. Progress and completion

Progress uses one canonical completion record for all Labs:

- `POST /student/labs/:labId/complete` validates the id against the server-side
  Lab catalogue, records an idempotent `LabCompletion`, records the completion
  in the student progress snapshot and grants the configured CP reward.
- A completed Lab's badge identity is its registry entry in
  `src/shared/learning/labBadges.ts`; the same official image appears on cards,
  completion celebrations and earned-badge surfaces.
- The legacy `POST /student/courses/:courseId/complete` remains temporarily as
  a compatibility alias to the same canonical completion operation.
- Hands-on Lab flags continue to be verified server-side through
  `/student/labs/verify-flag` and connection/progress state through
  `/student/labs/*`.
- Bootcamp progress: existing bootcamp room/session endpoints.
- CP rewards and completion credit: existing CP ledger and
  `RoomCompletionCredit`.

New content-Lab completions are written to `completedLabs`; `completedCourses`
is read only for legacy history. Bootcamp progress and access entitlements
remain independent.

## 6. Community and study planning

The dashboard community card uses authenticated student endpoints backed by
`ActivityLog` and `StudentFollow`:

- `GET /student/community` returns recent recorded learning activity, suggested
  student accounts, and current follower/following counts.
- `GET /student/community/following` and `/student/community/followers` return
  the actual relationship lists.
- `POST` / `DELETE /student/community/:userId/follow` persist follow changes.
- `GET`, `POST`, `PATCH` and `DELETE /student/session-plans` persist and manage
  the authenticated learner's study sessions. Session plan records are scoped
  to their owner.

## 7. BCP points course purchase removed

Purchasing a course with BCP/CP points has been removed end to end:

- Backend: `POST /cp/purchase-course` and `purchaseCourse` controller removed;
  `docs/API_REFERENCE.md` updated.
- Frontend: `CoursePurchaseModal` removed; course pages no longer check purchase
  status or show an unlock wall; `MyCoursesPage` purchase flow removed.
- Preserved: CP balances, the CP ledger, marketplace purchases, hands-on
  scenario unlocks (`POST /cp/purchase-lab`), bootcamp enrolment and paid cohort
  access.

## 8. Administration

Administrators still manage the underlying learning content through the
existing content definitions and QOSE lab matrix. A Lab may be configured as a
content, hands-on or hybrid experience; these are configuration options, not
separate learning products.

## 9. Navigation

The student topbar, sidebar, mobile sidebar and search now expose **Labs** as
the single learning destination. Bootcamp remains its own branded entry.
Legacy `/dashboard/courses` links redirect to `/dashboard/labs`.

## 10. Badge assets

The official badge collection is supplied in:

- `core/COURSE-BADGES/`
- `core/LAB-BADGES/`

These directories reflect the previous organisational grouping only. Badge
artwork is mapped to its Lab by subject and used as that Lab's permanent badge
identity. The same artwork is shown in the catalogue, on completion, and in the
learner's earned-badge collection. Do not regenerate or replace the supplied
artwork.

The centralized registry is `src/shared/learning/labBadges.ts`. Its mapping is:

| Lab | Badge asset |
|-----|-------------|
| Burp Suite 101 | `burp-suite-101.png` |
| Git & GitHub 101 | `git-github-101.png` |
| Linux Terminal 101 | `linux-terminal-101.png` |
| Networking 101 | `networking-101.png` |
| Nmap 101 | `nmap-101.png` |
| Python for Hackers 101 | `python-for-hackers-101.png` |
| SQL Injection 101 | `sql-injection.png` |
| Web Reconnaissance 101 | `web-recon-101.png` |
| Web Technologies 101 | `web-technologies-101.png` |
| Wi-Fi Fundamentals 101 | `wifi-fundamentals-101.png` |
| Windows CMD 101 | `windows-cmd-101.png` |
| Wireshark 101 | `wireshark-101.png` |
| Privilege Escalation | `privesc.png` |
| Password Cracking | `passwords.png` |
| SQL Injection | `sql-injection.png` |
| OSINT Recon | `osint.png` |
| Kill Chain | `kill-chain.png` |
| Broken Access Control | `web-access-control.png` |
| API Security | `api-security.png` |
| Security Automation | `automation.png` |
| Engagement Methodology | `methodology.png` |
| Network Security | `network-security.png` |
| Wireless Security | `wlan-security.png` |
| AD Enumeration | `ad-enum.png` |
| Enterprise Attack Paths | `attack-paths.png` |

The supplied collection contains one SQL Injection image; both the content Lab
`sql-injection-101` and practical Lab `sqli` intentionally share it.
