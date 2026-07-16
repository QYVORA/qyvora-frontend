# Icon System

## Overview

QYVORA has a custom SVG icon library with 45+ icons designed specifically for the platform.

**Source:** `src/shared/components/icons/`

## Icon Files

### Brand Icons

| Component | File | Purpose |
|-----------|------|---------|
| `BrandGithubIcon` | `BrandGithubIcon.tsx` | GitHub social link |
| `BrandInstagramIcon` | `BrandInstagramIcon.tsx` | Instagram social link |
| `BrandLinkedinIcon` | `BrandLinkedinIcon.tsx` | LinkedIn social link |
| `BrandTiktokIcon` | `BrandTiktokIcon.tsx` | TikTok social link |
| `BrandWhatsAppIcon` | `BrandWhatsAppIcon.tsx` | WhatsApp social link |
| `BrandXIcon` | `BrandXIcon.tsx` | X (Twitter) social link |
| `BrandYoutubeIcon` | `BrandYoutubeIcon.tsx` | YouTube social link |

### Platform Icons

**Source:** `QyvoraIcons.tsx`

| Icon | Usage |
|------|-------|
| `IconDashboard` | Dashboard navigation |
| `IconBootcamp` | Bootcamp navigation |
| `IconLabs` | Labs navigation |
| `IconMarketplace` | Marketplace navigation |
| `IconSettings` | Settings navigation |
| `IconNotification` | Notification bell |
| `IconTerminal` | Terminal launcher |
| `IconCode` | Code/courses |
| `IconMenu` | Hamburger menu |
| `IconArrowLeft` | Back navigation |
| `IconChevronRight` | Breadcrumb separator |
| `IconArrowRight` | Forward action |
| `IconShield` | Security/bootcamp |
| `IconNetwork` | Networking |
| `IconGithub` | GitHub (platform) |
| `IconLinkedin` | LinkedIn (platform) |
| `IconX` | X/Twitter (platform) |

## Usage Pattern

```tsx
import { IconTerminal, IconDashboard } from '@/shared/components/icons';

// In component
<IconTerminal size={20} />
<IconDashboard size={32} />
```

## NavCard Component

**Source:** `src/shared/components/ui/NavCard.tsx`

Reusable navigation card with icon:

```tsx
<NavCard
  icon={<IconTerminal size={24} />}
  label="Terminal"
  description="Open the terminal"
  badge={3}
  onClick={() => openTerminal()}
/>
```

Props: `icon`, `label`, `description?`, `badge?`, `locked?`, `onClick`

## Development Tools

| File | Purpose |
|------|---------|
| `IconShowcase.tsx` | Visual gallery of all icons |
| `IconTestPage.tsx` | Interactive icon testing page |

## Design Principles

- **Consistent stroke:** 1.5px stroke width
- **Size system:** `size` prop controls dimensions (default: 20px)
- **Color:** Inherits from parent via `currentColor`
- **Accessibility:** Include `aria-hidden="true"` for decorative icons
