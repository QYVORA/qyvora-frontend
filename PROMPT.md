# QYVORA — Public Pages & Simulation Route Cleanup

We are working **ONLY on the public-facing pages and public routes** of the QYVORA website.

Do not modify, audit, redesign, or restructure the authenticated dashboard or any dashboard-related routes. **The dashboard is completely outside the scope of this task.**

---

## Main Objective

The main objective is to **simplify the public website**.

We currently have several separate public pages for Courses, Labs, Bootcamps, and other learning-related content.

This is unnecessary because the `/learn` page already serves as the central public entry point for the entire learning ecosystem.

The `/learn` page is already working correctly and should be treated as **finished**.

### IMPORTANT:

**DO NOT MODIFY `/learn`.**

Do not redesign it.

Do not change its layout.

Do not change its cards.

Do not change its content.

Do not change its navigation.

Do not change its structure.

Do not add or remove anything from it.

The `/learn` page already lists the necessary public learning areas through cards, including:

* Courses
* Labs
* Bootcamps
* Simulations
* CyberPoints

Therefore, separate public pages that simply repeat or duplicate this information are unnecessary.

---

# 1. Remove Redundant Public Learning Pages

Because `/learn` already provides the public entry point to these areas, remove the redundant standalone public pages.

### Remove:

```text
/courses
/labs
```

These should no longer exist as separate public pages.

The user should discover these areas through:

```text
/learn
```

The goal is to avoid having multiple places on the public website doing the same job.

---

# 2. Do NOT Touch `/learn`

This is extremely important.

The `/learn` page is **not part of the redesign or cleanup**.

It is already doing exactly what we need.

Think of `/learn` as the public learning hub:

```text
/learn
   │
   ├── Courses
   ├── Labs
   ├── Bootcamps
   ├── Simulations
   └── CyberPoints
```

Those cards provide the public discovery/navigation layer.

Do not create additional public pages just to duplicate those categories.

---

# 3. HPB Is Different

The Hacker Protocol Bootcamp (`HPB`) is a special case.

Keep:

```text
/hpb
```

The `/hpb` page is intentionally implemented as its own public page and should remain.

However, **do not create separate public pages for individual HPB phases.**

Remove the phase-level public routing:

```text
/hpb/:phaseId
```

For example, this should NOT exist:

```text
/hpb/phase1
/hpb/phase2
/hpb/phase3
/hpb/phase4
```

There should only be:

```text
/hpb
```

The HPB page itself can contain whatever information is necessary about the bootcamp and its phases.

The individual phases do not need their own public URLs.

### Specifically

Remove:

```text
/hpb/:phaseId
```

and the associated public phase-page implementation if it becomes unused.

Do not replace it with another phase-based public route.

---

# 4. Simplify the Simulation Public Routes

Simulations are the other major focus of this task.

The public Simulation structure should be extremely simple.

We only need:

```text
/simulations
/simulations/:slug
```

### `/simulations`

This is the main public Simulation page.

It should introduce/list the available simulations.

### `/simulations/:slug`

This represents one specific simulation.

For example:

```text
/simulations/network-recon
/simulations/web-attacks
```

The exact slugs depend on the existing implementation.

---

# 5. Do NOT Create More Simulation Routes

There are currently too many possible decisions/routes around the Simulation experience.

Do not create additional public routes for:

```text
/simulations/:slug/phase
/simulations/:slug/room
/simulations/:slug/module
/simulations/:slug/lesson
/simulations/:slug/task
```

or similar nested structures unless an existing technical requirement absolutely requires one.

The public structure should remain:

```text
/simulations
        ↓
/simulations/:slug
```

That's it.

Keep the public Simulation navigation simple.

---

# 6. Fix the Simulation UI

While simplifying the routes, audit the UI of the Simulation pages.

The current Simulation pages do not properly match the existing QYVORA public UI.

Bring them into the existing QYVORA design system.

Check:

* Typography
* Spacing
* Containers
* Cards
* Buttons
* Navigation
* Icons
* Borders
* Backgrounds
* Responsive behavior
* Mobile layout
* Loading states
* Empty states
* Error states
* Hover/focus states
* Animations
* Shared components

Do not create a completely new design system for Simulations.

Reuse the existing QYVORA public components and design patterns.

The Simulation pages should feel like they belong to the same website as the rest of QYVORA.

---

# 7. The Public Information Architecture

The intended public structure is:

```text
/
│
├── /learn
│     ├── Courses
│     ├── Labs
│     ├── Bootcamps
│     ├── Simulations
│     └── CyberPoints
│
├── /hpb
│
├── /simulations
│     └── /simulations/:slug
│
└── other legitimate public pages
```

The important distinction is:

### `/learn`

Acts as the **public discovery hub** for the learning ecosystem.

### `/hpb`

Remains a dedicated public page because HPB has its own public experience.

### `/simulations`

Remains a dedicated public experience because simulations require their own interaction/UI.

---

# 8. Routes That Must Be Removed

The following public routes should no longer exist:

```text
/courses
/labs
/hpb/:phaseId
```

The following public routes should remain:

```text
/learn
/hpb
/simulations
/simulations/:slug
```

---

# 9. Clean Up the Code

After removing the routes, clean up the public implementation properly.

Audit for:

* Route definitions
* Lazy-loaded page imports
* Navigation links
* Navbar links
* Footer links
* CTA links
* `<Link>` components
* `navigate()` calls
* Redirects
* Unused public page components
* Unused imports
* Dead route-specific code

If a removed public page is no longer used anywhere, remove its dead implementation.

However, do not delete shared components merely because one public page stopped using them.

---

# 10. Scope Restrictions

This task is ONLY about the **public website**.

### DO NOT TOUCH:

* Dashboard
* Authenticated student pages
* Dashboard routing
* Dashboard UI
* Dashboard courses
* Dashboard labs
* Dashboard bootcamp routes
* Student learning functionality
* Admin functionality

Those are completely outside the scope of this task.

Do not make unrelated architectural changes.

---

# 11. Final Verification

After the changes, verify:

### `/learn`

```text
Works exactly as before.
No redesign.
No content changes.
No structural changes.
```

### `/courses`

```text
Removed.
```

### `/labs`

```text
Removed.
```

### `/hpb`

```text
Still works.
```

### `/hpb/phase3`

```text
No longer exists as a public page.
```

### `/simulations`

```text
Works and matches the QYVORA public UI.
```

### `/simulations/:slug`

```text
Works and matches the QYVORA public UI.
```

### Simulation nested routes

```text
Do not create unnecessary nested public routes.
```

---

# Core Principle

The public website should not make users navigate through multiple pages to discover information that is already organized on `/learn`.

**`/learn` is the public learning hub.**

Do not duplicate it.

Keep the public information architecture simple:

```text
/learn
/hpb
/simulations
/simulations/:slug
```

Remove unnecessary public pages instead of creating redirects, duplicate landing pages, or additional nested routes.

The goal is a **smaller, clearer, more intentional public website**, not simply a different collection of routes.

