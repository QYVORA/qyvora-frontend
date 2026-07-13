# QYVORA Custom Icon Library

A complete set of custom SVG icons designed specifically for the QYVORA platform, matching our hacker culture aesthetic and cybersecurity theme.

## 🎨 Design Principles

- **Hacker Culture**: Icons reflect offensive security, terminal commands, and cyber themes
- **Consistent Style**: All icons use 24x24 default viewBox with 2px stroke width
- **Theme-Aware**: Icons use `currentColor` for easy theming with accent color `#06B66F`
- **Accessible**: Proper sizing, hover states, and semantic usage
- **Performance**: Lightweight SVG components with minimal DOM overhead

## 📦 Installation

Icons are located in `/src/shared/components/icons/QyvoraIcons.tsx` and can be imported:

```tsx
// Import specific icons
import { IconDashboard, IconBootcamp, IconLabs } from '@/shared/components/icons/QyvoraIcons';

// Or import the entire icon map
import QyvoraIcons from '@/shared/components/icons/QyvoraIcons';
```

## 🚀 Usage

### Basic Icon Usage

```tsx
import { IconDashboard } from '@/shared/components/icons/QyvoraIcons';

function MyComponent() {
  return (
    <div>
      {/* Default size (24x24) */}
      <IconDashboard />
      
      {/* Custom size */}
      <IconDashboard size={32} />
      
      {/* With custom classes */}
      <IconDashboard size={48} className="text-accent hover:scale-110 transition-transform" />
    </div>
  );
}
```

### Using NavCard Component (TryHackMe Style)

The `NavCard` component creates large, prominent navigation cards with icon on top and label below:

```tsx
import { IconBootcamp } from '@/shared/components/icons/QyvoraIcons';
import { NavCard } from '@/shared/components/ui/NavCard';

function Dashboard() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <NavCard
        icon={<IconBootcamp size={64} />}
        label="Bootcamps"
        description="Start your learning journey"
        href="/student/bootcamps"
        badge={3}
      />
    </div>
  );
}
```

### Inline with Buttons

```tsx
import { IconPlay, IconDownload } from '@/shared/components/icons/QyvoraIcons';

function ActionButtons() {
  return (
    <div className="flex gap-4">
      <button className="btn-primary flex items-center gap-2">
        <IconPlay size={20} />
        Start Lab
      </button>
      
      <button className="btn-secondary flex items-center gap-2">
        <IconDownload size={20} />
        Download Certificate
      </button>
    </div>
  );
}
```

### Status Indicators

```tsx
import { IconCheck, IconClock, IconLock } from '@/shared/components/icons/QyvoraIcons';

function ModuleStatus({ status }: { status: 'completed' | 'in-progress' | 'locked' }) {
  const iconMap = {
    completed: <IconCheck size={20} className="text-accent" />,
    'in-progress': <IconClock size={20} className="text-yellow-500" />,
    locked: <IconLock size={20} className="text-text-muted" />,
  };
  
  return <div>{iconMap[status]}</div>;
}
```

## 📚 Icon Catalog

### Navigation & Dashboard
- **IconDashboard** - Main dashboard overview
- **IconBootcamp** - Bootcamp/course modules
- **IconLabs** - Practice lab environments
- **IconCTF** - Capture The Flag challenges
- **IconChallenges** - Individual challenges
- **IconLeaderboard** - Rankings and leaderboards
- **IconMarketplace** - Resource marketplace
- **IconWallet** - CP balance and transactions

### User & Account
- **IconProfile** - User profile
- **IconSettings** - Settings and preferences
- **IconBadge** - Achievements and badges
- **IconRank** - User rank/level
- **IconCertificate** - Certificates and credentials

### Security & Hacking
- **IconShield** - Security/protection
- **IconLock** - Locked content
- **IconUnlock** - Unlocked content
- **IconHack** - Hacking/offensive security
- **IconExploit** - Exploitation techniques
- **IconBug** - Bug hunting/vulnerabilities
- **IconTarget** - Target systems

### Code & Terminal
- **IconTerminal** - Terminal/command line
- **IconCode** - Source code
- **IconBinary** - Binary code streams
- **IconNetwork** - Network connections

### Actions
- **IconPlay** - Start/play
- **IconStop** - Stop/pause
- **IconDownload** - Download files
- **IconUpload** - Upload files
- **IconCheck** - Success/complete
- **IconX** - Close/cancel/error
- **IconPlus** - Add/create
- **IconMinus** - Remove/subtract

### Navigation
- **IconArrowRight** - Navigate forward
- **IconArrowLeft** - Navigate back
- **IconChevronRight** - Expand/next
- **IconMenu** - Menu/hamburger

### UI Elements
- **IconSearch** - Search functionality
- **IconEye** - Show/view
- **IconEyeOff** - Hide/conceal
- **IconNotification** - Notifications with badge
- **IconInfo** - Information
- **IconWarning** - Alerts/warnings

### Engagement
- **IconStar** - Favorites/featured
- **IconHeart** - Like/love
- **IconFire** - Streak/hot content
- **IconClock** - Time/duration

## 🎨 Styling Guidelines

### Color Usage

```tsx
// Primary accent (green #06B66F)
<IconDashboard className="text-accent" />

// Muted/disabled
<IconLock className="text-text-muted" />

// Status colors
<IconCheck className="text-accent" />        // Success
<IconWarning className="text-yellow-500" />  // Warning
<IconX className="text-red-500" />           // Error

// Custom colors
<IconFire className="text-orange-500" />
```

### Sizing Recommendations

| Context | Size | Example |
|---------|------|---------|
| Navigation cards (TryHackMe style) | 64px | `<IconDashboard size={64} />` |
| Large feature cards | 48px | `<IconBootcamp size={48} />` |
| Standard UI | 24px | `<IconSettings size={24} />` (default) |
| Buttons & inline | 20px | `<IconPlay size={20} />` |
| Small indicators | 16px | `<IconCheck size={16} />` |

### Animation Examples

```tsx
// Hover scale
<IconDashboard className="hover:scale-110 transition-transform" />

// Spin animation (loading)
<IconSettings className="animate-spin" />

// Pulse (notification)
<IconNotification className="animate-pulse" />

// Glow on hover
<IconHack className="hover:drop-shadow-[0_0_8px_rgba(6,182,111,0.5)] transition-all" />
```

## 🏗️ NavCard Component Props

```tsx
interface NavCardProps {
  icon: React.ReactNode;          // Icon component (recommended size: 64px)
  label: string;                  // Card title
  description?: string;           // Optional subtitle
  href: string;                   // Navigation link
  isActive?: boolean;             // Highlight as current page
  badge?: string | number;        // Optional badge (count, "NEW", etc.)
  locked?: boolean;               // Show as locked/disabled
  className?: string;             // Additional classes
}
```

### NavCard Features

- ✅ Large icons (64px recommended) positioned at top
- ✅ Clear label text below icon
- ✅ Optional description text
- ✅ Hover effects with scale and glow
- ✅ Active state highlighting
- ✅ Badge support for notifications/counts
- ✅ Locked state with padlock icon
- ✅ Responsive padding and sizing
- ✅ Accessibility-friendly focus states

## 📱 Responsive Behavior

Icons automatically adapt to screen sizes:

```tsx
// NavCard responsive sizing
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
  <NavCard icon={<IconDashboard size={64} />} ... />
</div>

// Icon sizing with breakpoints
<IconBootcamp size={48} className="sm:w-16 sm:h-16" />
```

## 🎯 Best Practices

1. **Consistent Sizing**: Use the recommended sizes for each context
2. **Semantic Usage**: Choose icons that match their function
3. **Color Meaning**: Use accent for active/success, muted for disabled
4. **Accessibility**: Always provide text labels alongside icons
5. **Performance**: Import only the icons you need
6. **Hover States**: Add subtle animations for better UX

## 🔧 Customization

All icons accept standard SVG props:

```tsx
<IconDashboard 
  size={32}
  stroke="currentColor"
  strokeWidth={2.5}
  className="text-accent"
  style={{ filter: 'drop-shadow(0 0 4px rgba(6,182,111,0.3))' }}
/>
```

## 📄 License

These icons are part of the QYVORA platform and follow the project's licensing terms.

---

**Created for QYVORA** - Offensive Security Training Platform
