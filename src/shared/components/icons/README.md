# QYVORA Icons

Everything icon-related lives in this directory and re-exports from `index.ts`.

## Sources

| Group | Source | Import | Notes |
|---|---|---|---|
| UI icons | `lucide-react` aliased to legacy `Icon*` names | `import { IconDashboard, IconShield } from '@/shared/components/icons'` | Layout/nav, domain, security, dev/terminal, status/time, actions, feedback, arrows, visibility |
| Brand icons | custom SVGs in this folder | `import { BrandXIcon, BrandGithubIcon, BrandLinkedinIcon, BrandWhatsAppIcon, BrandYouTube… } from '@/shared/components/icons'` | `BrandXIcon`, `BrandWhatsAppIcon`, `BrandLinkedinIcon`, `BrandYoutubeIcon`, `BrandGithubIcon`, `BrandMediumIcon`, `BrandTikTokIcon`, `BrandInstagramIcon`. Props: `className` only (`currentColor` fill) |
| Brand / logo marks | `src/shared/components/` (brand, `QyvoraMark`, `CpLogo`, `BootcampBadge`, `CourseBadge`, `LabBadge`, `HpbAvatar`) | direct imports | Dedicated SVG glyphs — never substitute lucide |
| Course glyphs | `course-icons/` (vector-traced artwork) | `import { LinuxTerminal101Icon, SqlInjection101Icon, … } from '@/shared/components/icons'` | one icon per course |

## Rules

- `lucide-react` only for generic UI glyphs, named imports, no emoji as icons.
- Brand/logo/achievement glyphs use their dedicated SVG components (AGENTS.md
  "Profile Pages") — e.g. profile pages never use lucide for achievements,
  bootcamp phases, labs, or courses.
- Icons inherit color via `text-*`/`currentColor`; size via `className` (or `size`
  prop on lucide). Size guidance: inline `h-4 w-4`, buttons `h-3.5–h-5`,
  module chips `h-4 w-4`, feature icons `w-8–w-12`, glyphs `w-11–w-14`.
- No `NavCard` — it was removed from the UI (`docs/DEVELOPER_RULES.md`).

The legacy `QyvoraIcons.tsx` / `LabIcons.tsx` files were removed in an earlier
redesign; all aliases are now lucide re-exports via `index.ts`.