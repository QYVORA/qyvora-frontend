# Profile Page — Complete UI Design & Layout

## Routing & Access

| Route | Page | Purpose |
|---|---|---|
| `/dashboard/profile` | `ProfilePage.tsx` | Authenticated user's own profile |
| `/dashboard/profile/:username` | `ProfilePage.tsx` | Viewing another user's profile (within dashboard) |
| `/@:handle` | `PublicProfilePage.tsx` | Public-facing profile (outside dashboard, includes `<Navbar />`) |

Both pages share the same visual components but differ in chrome: `ProfilePage` renders inside the student dashboard shell (no extra navbar), while `PublicProfilePage` renders with a `<Navbar />` at the top and a larger top padding (`pt-28 md:pt-24`).

---

## Overall Page Layout

### Student Profile Page (`ProfilePage.tsx`)

```
<div className="bg-bg">                           ← Full page wrapper, dark background
  <SEO ... />                                      ← Head meta tags
  <div className="px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-6">
                                                   ← Content container
    1. LearningOverviewCard (Hero Banner)
    2. Meta Row (info + action buttons)
    3. AchievementsSection
    4. ContributionCalendar (own-profile only)
  </div>
  <EditModal />                                    ← Modal overlay, owned-profile only
</div>
```

**Container padding:** `px-3` (mobile) → `md:px-4` → `lg:px-6`. Top padding `pt-8`. Bottom padding `pb-20 lg:pb-24` (room for mobile bottom nav). Children stacked vertically with `space-y-6`.

### Public Profile Page (`PublicProfilePage.tsx`)

```
<div className="min-h-screen w-full bg-bg">       ← Full viewport, dark bg
  <Navbar />                                       ← Top navigation bar
  <SEO ... />
  <div className="px-4 md:px-12 lg:px-16 pt-28 md:pt-24 pb-20 lg:pb-24 space-y-6">
                                                   ← Wider side padding for public context
    1. LearningOverviewCard
    2. Meta Row (share only)
    3. AchievementsSection
    4. ContributionCalendar
  </div>
</div>
```

Public page uses wider horizontal padding (`px-4 md:px-12 lg:px-16`) and extra top padding to clear the navbar.

---

## Component 1: LearningOverviewCard (Hero / Profile Overview)

**File:** `src/features/student/components/learning/LearningOverviewCard.tsx`

This is the **dominant visual element** — a large accent-colored banner card.

### Outer wrapper
```
data-nav-invert attribute    ← Signals navbar to invert colors over this card
```

### Card itself
```
rounded-2xl border border-bg/20 bg-accent p-8 sm:p-10 lg:p-14
flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 overflow-hidden
```
- **Background:** `bg-accent` (the brand green `#06B66F`)
- **Border radius:** `rounded-2xl`
- **Border:** `border-bg/20` (subtle dark border over the accent)
- **Padding:** `p-8` → `sm:p-10` → `lg:p-14`
- **Layout:** Column on mobile (`flex-col`), row on `sm:` and up (`sm:flex-row`). Items centered vertically on desktop.
- **Overflow hidden** for the background grid pattern
- Contains a `<GridBoxedBackground opacity={0.3} blur={0} mask="none" />` as a decorative background layer

### Avatar
On the profile page, the avatar section renders a **256x256 Identicon** (jdenticon SVG, deterministic from user ID):
```
<div className="w-full h-full bg-black flex items-center justify-center">
  <Identicon value={profileData.id} size={256} className="w-full h-full" />
</div>
```
This sits inside the avatar slot:
```
w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 border-bg/20
shadow-[0_0_40px_rgba(255,255,255,0.1)] shrink-0
```
- Square avatar, `rounded-xl`, with a semi-transparent dark border
- Subtle white glow shadow
- Responsive size: `w-28 h-28` on mobile → `sm:w-32 sm:h-32`

### Title (Username)
```
text-xl sm:text-2xl lg:text-3xl font-black text-bg tracking-tight break-words
```
Rendered as `@username`. Uses `font-black` (extra bold), `text-bg` (dark text on accent background). `break-words` allows long handles to wrap.

### Description (Bio / Rank)
```
text-sm text-bg/70 mt-1.5 max-w-xl
```
Falls back to `"<rank> operator"` if no bio is set.

### Stats Row
Rendered inside a flex container: `flex flex-wrap items-center gap-4 mt-5`

Each stat has two parts:
- **Value:** `font-mono text-lg sm:text-xl font-black` with `text-bg` (full) or `text-bg/90` (slightly muted). The `accent: true` stat (CP points) gets full opacity.
- **Label:** `text-[10px] font-black uppercase tracking-widest text-bg/50`

Stats displayed:
| Stat | Label Key | Accent? |
|---|---|---|
| CP points (formatted with `toLocaleString()`) | `student.profile.stats.cp` | Yes (`text-bg`) |
| Rank | `student.profile.rank` | No |
| Labs completed | `student.profile.stats.labs` | No |
| Courses completed | `student.profile.stats.courses` | No |

### Action Button (Edit / Back)
Positioned on the right side on desktop, full-width on mobile.
```
btn-primary !bg-bg !text-accent inline-flex items-center justify-center gap-2
px-8 py-3.5 text-xs w-full sm:w-auto
```
- **Own profile:** "Edit" button with `<Edit3>` icon, opens the EditModal
- **Other profiles / public:** "Back to Home" link with `<IconArrowLeft>` icon, routes to `/`
- Uses the `btn-primary` class but with overridden colors (`!bg-bg !text-accent`) — dark button on the green card
- Has a right arrow icon `<IconArrowRight size={14} />` appended

### Animation
The card animates in with `motion` (framer-motion successor):
- Card opacity: `initial={{ opacity: 0 }}` → `animate={{ opacity: 1 }}` over 0.5s
- Avatar: fade + slide up 8px, 0.15s delay
- Title: fade + slide up 12px, 0.25s delay
- Description: fade + slide up 8px, 0.35s delay
- Stats: fade + slide up 8px, 0.45s delay
- CTA button: spring animation (stiffness 200, damping 20), 0.55s delay

---

## Component 2: Meta Row

A horizontal bar below the hero card with two sections.

### Layout
```
flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
```
Column on mobile, row on `sm:`. Items vertically centered on desktop. Space between left info and right actions.

### Left Side — Info Items
```
flex flex-wrap items-center gap-4 text-xs text-text-muted
```
- **Organization:** `<Activity>` icon (3x3, accent-colored) + organization text
- **Email:** `<Mail>` icon (3x3, accent-colored) + email address (own profile only)

Each info item: `flex items-center gap-1.5`

### Right Side — Action Buttons
```
flex items-center gap-2
```
Two buttons side by side:

1. **"Public View" link** — routes to `/@username`:
   ```
   btn-secondary !text-xs inline-flex items-center gap-2
   ```

2. **ShareProfile button** (see Component 5 below)

---

## Component 3: AchievementsSection

**File:** `src/shared/components/profile/AchievementsSection.tsx`

Two sub-parts:

### Part A: Bootcamp Badge (conditional)
Only rendered if `bootcampCompleted === true`.
```
rounded-2xl border border-border/30 bg-bg-card p-5 flex items-center gap-4
```
- Horizontal card with the `BootcampBadge` image (a `.webp` image asset, `w-16 h-16`)
- Title: `text-sm font-black text-text-primary`
- Description: `text-xs text-text-muted`

### Part B: Achievement Card Grid
Delegates to `AchievementCard` component (`src/shared/components/profile/AchievementCard.tsx`).

#### AchievementCard Container
```
rounded-2xl border border-border/30 bg-bg-card overflow-hidden
```

#### Header
```
px-5 py-4 border-b border-border/30
flex items-center justify-between
```
- Left: Icon (8x8 `rounded-lg`, `bg-accent/10`, with `<Award>` icon in accent) + Title (`text-xs font-black uppercase tracking-widest text-text-muted`)
- Right: Count badge (`px-2 py-1 bg-accent/10 text-accent text-[9px] font-black rounded-lg`)

#### Grid
```
p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3
```
- 2 columns mobile, 3 on `sm:`, 4 on `lg:`. Gap of `3` (0.75rem).

#### Each Achievement Cell
```
relative group flex flex-col items-center text-center p-4 rounded-xl border
transition-all duration-300 hover:scale-[1.02] cursor-default
```
Each cell has rarity-based styling:

| Rarity | Border | Background | Hover Glow |
|---|---|---|---|
| `common` | `border-border/30` | `bg-bg-card` | None |
| `uncommon` | `border-accent/30` | `bg-accent/5` | None |
| `rare` | `border-blue-400/30` | `bg-blue-400/5` | `hover:shadow-[0_0_20px_rgba(96,165,250,0.15)]` |
| `epic` | `border-purple-400/30` | `bg-purple-400/5` | `hover:shadow-[0_0_20px_rgba(192,132,252,0.15)]` |
| `legendary` | `border-amber-400/30` | `bg-amber-400/5` | `hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]` |

**Cell internals (top to bottom):**
1. **Icon container:** `w-12 h-12 rounded-xl flex items-center justify-center mb-3` with rarity-colored background
2. **Type icon:** 4x4 lucide icon, color-coded by type (lab=red, course=blue, bootcamp=accent, rank=amber, streak=orange, challenge=purple)
3. **Title:** `text-[10px] font-black uppercase tracking-widest text-text-primary leading-tight mb-1`
4. **Description (optional):** `text-[9px] text-text-muted leading-snug line-clamp-2` (max 2 lines)
5. **Rarity badge (if not common):** `mt-2 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider` with rarity-colored bg/text
6. **Earned date (optional):** `mt-2 text-[8px] text-text-muted/50 font-mono`

#### Empty State (no achievements)
Same card container, but just shows the header + centered message: `text-xs text-text-muted text-center py-4`

#### Animation
Each cell uses `motion.div`:
- `initial={{ opacity: 0, scale: 0.9 }}` → `animate={{ opacity: 1, scale: 1 }}`
- `duration: 0.3`, staggered delay of `idx * 0.05`

---

## Component 4: ContributionCalendar

**File:** `src/shared/components/profile/ContributionCalendar.tsx`

GitHub-style activity heatmap. Only shown on own profile when activity data exists.

### Container
```
rounded-2xl border border-border/30 bg-bg-card p-5
```

### Header
```
flex items-center justify-between mb-3
```
- Left: Title — `text-xs font-black uppercase tracking-widest text-text-muted`
- Right: Summary — `text-[10px] font-mono text-text-muted/60` showing total activities and active days

### Calendar Grid (SVG-based)
Rendered as an `<svg>` element:
- **Cell size:** 11px × 11px (`CELL_SIZE = 11`)
- **Cell gap:** 3px (`CELL_GAP = 3`)
- **Grid:** 52 weeks × 7 days (full year)
- **Total width:** `52 * (11 + 3) = 728px`
- **Total height:** `7 * (11 + 3) + 20 (month labels) = 118px`
- Wrapped in `overflow-x-auto pb-2 -mx-2 px-2` for horizontal scroll on small screens

**Month labels** rendered as `<text>` at y=8, font size 9px, `fill-text-muted/50`. Only shown when the month changes.

**Day labels** (left side): Only Mon, Wed, Fri are shown (others are empty strings). Positioned at x=-4 with `textAnchor="end"`, font size 9px, `fill-text-muted/40`.

**Cells:** Each is a `<rect>` with `rx=2 ry=2` (rounded corners). Color intensity levels:

| Count | Intensity | Class |
|---|---|---|
| 0 | 0 | `bg-accent/5` |
| 1 | 1 | `bg-accent/25` |
| 2-3 | 2 | `bg-accent/50` |
| 4+ | 3 | `bg-accent` (full) |

Today's cell gets an additional `stroke-accent stroke-1` (accent border highlight).

Each cell has a `<title>` tooltip: `"YYYY-MM-DD: N activities"`.

### Legend
```
flex items-center gap-2 mt-2 text-[9px] font-mono text-text-muted/50
```
Shows "Less" → 4 intensity squares (`w-2.5 h-2.5 rounded-sm`) → "More".

---

## Component 5: ShareProfile

**File:** `src/shared/components/ShareProfile.tsx`

A button that opens a modal dialog for sharing the profile.

### Trigger Button
```
flex items-center gap-2 px-4 py-2 bg-bg border border-border hover:border-accent/50
rounded-xl text-xs font-black uppercase tracking-widest text-text-muted transition-all active:scale-95
```
- `<Share2>` icon (3.5x3.5) + translated label
- Press feedback: `active:scale-95` (slight shrink on press)

### Dialog
Uses the shared `DialogContent` wrapper with `title` prop and `maxWidth="max-w-md"`.

**Inside the dialog:**

#### Preview Box
```
p-4 rounded-xl bg-accent/5 border border-accent/10
```
- Share text paragraph: `text-xs text-text-secondary leading-relaxed`
- URL: `text-xs text-text-muted font-mono mt-2 truncate`

#### Platform Grid
Label: `text-[10px] font-black uppercase tracking-widest text-text-muted`

Grid: `grid grid-cols-2 gap-2` (2 columns)

Each platform button:
```
flex items-center gap-3 px-4 py-3 rounded-xl border border-border text-xs font-bold text-text-primary transition-all
```
Hover states are platform-specific (black for X, blue for LinkedIn, green for WhatsApp, accent for email/copy).

**Platforms:** X (Twitter), LinkedIn, WhatsApp, Email, Copy Link.

Copy link shows a checkmark icon + "Copied" text for 2 seconds after clicking.

---

## Component 6: EditModal (Own Profile Only)

**File:** `src/features/student/components/profile/EditModal.tsx`

Modal dialog for editing profile fields.

### Dialog
`DialogContent` with `title` prop and `maxWidth="max-w-2xl"`.

### Form Layout
```
space-y-4 -mt-2    ← Vertical spacing between fields, slight upward offset
```

### Input Styling (shared across all fields)
```
w-full bg-bg border border-border rounded-xl py-2.5 px-4 text-sm text-text-primary
placeholder:text-text-muted focus:border-accent outline-none transition-all font-mono
```
- `rounded-xl` border radius
- Focus: border changes to accent color (no ring)
- Monospace font

### Labels
```
text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1.5
```

### Fields (top to bottom)
1. **Display Name** — `<input>`, text
2. **Handle** — `<input>`, text + `<HandleSuggestions>` component below (generates handle suggestions from the name)
3. **Organization** — `<input>`, text
4. **Bio** — `<textarea>`, 3 rows, `resize-none`

### Action Buttons
```
flex gap-3 pt-2
```
- **Cancel:** `flex-1 btn-secondary !py-2.5 text-xs`
- **Save:** `flex-1 btn-primary !py-2.5 text-xs flex items-center justify-center gap-2 disabled:opacity-50`
  - Shows `<Loader2>` spinner + "Saving..." text while submitting
  - Shows `<Save>` icon + "Save" text when idle

---

## Component 7: ProfileSkeleton (Loading State)

**File:** `src/features/student/components/StudentSkeletons.tsx` (exported as `ProfileSkeleton`)

Shown while profile data is being fetched. Uses `OverviewCardSkeleton` with `stats={3}` and `action` prop, plus skeleton placeholders for the meta row and an additional card row.

### Skeleton Rows
1. **Overview card:** `OverviewCardSkeleton` (accent-colored skeleton block)
2. **Meta row:** Two skeleton lines left (`h-3 w-28`, `h-3 w-40`) + two button skeletons right (`h-10 w-24 rounded-xl`)
3. **Additional row:** `flex items-center gap-3 rounded-xl border border-border/30 bg-bg-card px-4 py-3` with 3 skeleton elements

---

## Component 8: Identicon (Avatar)

**File:** `src/shared/components/Identicon.tsx`

Generates a deterministic SVG avatar from the user's ID using `jdenticon`. The SVG is sanitized with `dompurify` before rendering. The `size` is set to 256 for high resolution, but CSS (`w-full h-full`) scales it to fit the container. The SVG's `width`/`height` attributes are replaced with `100%` to make it responsive.

---

## Component 9: BootcampBadge

**File:** `src/shared/components/BootcampBadge.tsx`

A simple image component. Renders a `.webp` badge image (`hpb-completion-badge.webp`) at `w-16 h-16` when `completed === true`. Returns `null` otherwise.

---

## Design System Summary

| Aspect | Value |
|---|---|
| Page background | `bg-bg` (dark) |
| Card backgrounds | `bg-bg-card` (dark elevated) |
| Hero card background | `bg-accent` (brand green) |
| Card border radius | `rounded-2xl` |
| Button/input border radius | `rounded-xl` |
| Badge border radius | `rounded-lg` |
| Font | `font-mono` (JetBrains Mono throughout) |
| Section headings | `text-xs font-black uppercase tracking-widest text-text-muted` |
| Stat values | `font-mono text-lg sm:text-xl font-black` |
| Stat labels | `text-[10px] font-black uppercase tracking-widest text-bg/50` |
| Button primary class | `btn-primary` (inverted on accent bg: `!bg-bg !text-accent`) |
| Button secondary class | `btn-secondary` |
| Input focus state | `focus:border-accent` (border color change, no ring) |
| Disabled state | `disabled:opacity-50` |
| Card borders | `border-border/30` (standard), `border-bg/20` (on accent) |
| Transitions | `transition-all duration-300` on cards, `transition-all` on inputs |
| Animation library | `motion/react` (Framer Motion successor) |
| i18n | All user-facing text uses `useTranslation()` with `t()` |
