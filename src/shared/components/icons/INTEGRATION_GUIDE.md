# QYVORA Icons - Integration Guide

## 📦 What's Been Created

A complete custom SVG icon set for QYVORA with **45+ icons** designed specifically for your hacker culture cybersecurity platform.

### Files Created

```
src/shared/components/icons/
├── QyvoraIcons.tsx          # Main icon library (all 45+ icons)
├── NavCard.tsx              # TryHackMe-style navigation component (in ui/)
├── IconShowcase.tsx         # Usage examples
├── IconTestPage.tsx         # Visual test page (add to router)
├── index.ts                 # Easy imports
├── README.md                # Complete documentation
├── QUICK_START.md           # 30-second quick start
└── INTEGRATION_GUIDE.md     # This file
```

## 🚀 Quick Integration (3 Steps)

### Step 1: Test the Icons (Optional but Recommended)

Add the test page to your router to see all icons visually:

```tsx
// In your router file (e.g., src/app/router.tsx)
import IconTestPage from '@/shared/components/icons/IconTestPage';

// Add this route
{
  path: '/test/icons',
  element: <IconTestPage />
}
```

Visit `/test/icons` in your browser to see all 45+ icons with interactive controls.

### Step 2: Start Using Icons

Import and use anywhere in your app:

```tsx
// In any component
import { IconDashboard, IconBootcamp, IconLabs } from '@/shared/components/icons';

function MyComponent() {
  return (
    <div>
      <IconDashboard size={32} className="text-accent" />
    </div>
  );
}
```

### Step 3: Use NavCard for Dashboard Navigation

Create TryHackMe-style navigation:

```tsx
import { IconBootcamp, IconLabs, IconCTF } from '@/shared/components/icons';
import { NavCard } from '@/shared/components/ui/NavCard';

function StudentDashboard() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <NavCard
        icon={<IconBootcamp size={64} />}
        label="Bootcamps"
        description="Learning paths"
        href="/student/bootcamps"
      />
      
      <NavCard
        icon={<IconLabs size={64} />}
        label="Labs"
        href="/student/labs"
        badge={5}  // Show notification count
      />
      
      <NavCard
        icon={<IconCTF size={64} />}
        label="Advanced CTF"
        href="/student/ctf"
        locked  // Show as locked
      />
    </div>
  );
}
```

## 🎨 Icon Design Features

✅ **Hacker Culture Themed**: Terminal, code, exploits, bugs, binary, network icons  
✅ **Consistent Style**: All 24x24 viewBox, 2px stroke, round caps  
✅ **Color Aware**: Use `currentColor` - works with your accent color (#06B66F)  
✅ **Accessible**: Proper sizing and semantic usage  
✅ **Lightweight**: Pure SVG, no dependencies  

## 📚 Complete Icon List (45+ Icons)

### Navigation & Dashboard (8)
- Dashboard, Bootcamp, Labs, CTF, Challenges, Leaderboard, Marketplace, Wallet

### User & Account (5)
- Profile, Settings, Badge, Rank, Certificate

### Security & Hacking (7)
- Shield, Lock, Unlock, Hack, Exploit, Bug, Target

### Code & Terminal (4)
- Terminal, Code, Binary, Network

### Actions (8)
- Play, Stop, Download, Upload, Check, X, Plus, Minus

### Navigation Arrows (4)
- ArrowRight, ArrowLeft, ChevronRight, Menu

### UI Elements (6)
- Search, Eye, EyeOff, Notification, Info, Warning

### Engagement (4)
- Star, Heart, Fire, Clock

## 🎯 Common Use Cases

### 1. Student Dashboard Navigation (TryHackMe Style)

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
  <NavCard icon={<IconDashboard size={64} />} label="Dashboard" href="/dashboard" isActive />
  <NavCard icon={<IconBootcamp size={64} />} label="Bootcamps" href="/bootcamps" badge={3} />
  <NavCard icon={<IconLabs size={64} />} label="Labs" href="/labs" />
  <NavCard icon={<IconCTF size={64} />} label="CTF" href="/ctf" locked />
</div>
```

### 2. Action Buttons

```tsx
<button className="btn-primary flex items-center gap-2">
  <IconPlay size={20} />
  Start Challenge
</button>
```

### 3. Status Indicators

```tsx
<div className="flex items-center gap-2 text-accent">
  <IconCheck size={18} />
  <span>Completed</span>
</div>
```

### 4. Stats Display

```tsx
<div className="flex items-center gap-3">
  <IconWallet size={32} className="text-accent" />
  <div>
    <div className="text-2xl font-bold">1,250 CP</div>
    <div className="text-sm text-text-secondary">Balance</div>
  </div>
</div>
```

### 5. Navigation Menus

```tsx
<nav>
  <a href="/dashboard" className="flex items-center gap-3 p-3">
    <IconDashboard size={24} />
    <span>Dashboard</span>
  </a>
</nav>
```

## 🔧 Customization Examples

### Size Variations

```tsx
<IconDashboard size={16} />  // Small
<IconDashboard size={24} />  // Default
<IconDashboard size={32} />  // Medium
<IconDashboard size={48} />  // Large
<IconDashboard size={64} />  // XL (for NavCards)
```

### Color Variations

```tsx
<IconCheck className="text-accent" />        // Success (green)
<IconWarning className="text-yellow-500" />  // Warning
<IconX className="text-red-500" />           // Error
<IconClock className="text-text-muted" />    // Disabled
```

### With Animations

```tsx
<IconSettings className="animate-spin" />                    // Loading spinner
<IconHack className="hover:scale-110 transition-transform" /> // Hover effect
<IconNotification className="animate-pulse" />               // Pulse effect
```

### With Badges (NavCard)

```tsx
<NavCard badge={5} ... />      // Number badge
<NavCard badge="NEW" ... />    // Text badge
<NavCard locked ... />         // Show lock icon
<NavCard isActive ... />       // Highlight as active
```

## 🎨 Design Guidelines

### Size Recommendations

| Context | Size | Example |
|---------|------|---------|
| NavCards (dashboard) | 64px | TryHackMe-style navigation |
| Feature cards | 48px | Large feature sections |
| Page headers | 32px | Section headings |
| Buttons | 20px | Action buttons |
| Inline text | 16-18px | List items, status |

### Color Usage

```tsx
// Status colors
text-accent          // Success, active, primary (#06B66F)
text-yellow-500      // Warning, in-progress
text-red-500         // Error, danger
text-orange-500      // Streak, hot content
text-text-muted      // Disabled, locked

// Context colors
text-text-primary    // Default text
text-text-secondary  // Secondary text
text-white           // High contrast
```

## 📱 Responsive Behavior

NavCard automatically adapts to screen sizes:

```tsx
// Grid adjusts columns based on screen size
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
  <NavCard ... />
</div>
```

Icons scale with their container:

```tsx
<IconBootcamp className="w-8 h-8 md:w-12 md:h-12" />
```

## 🐛 Troubleshooting

### Icons not showing?

1. Check import path:
```tsx
import { IconDashboard } from '@/shared/components/icons';
// or
import { IconDashboard } from '../../shared/components/icons';
```

2. Verify size prop:
```tsx
<IconDashboard size={24} /> // Must provide size
```

### Icons not colored?

Add color class:
```tsx
<IconDashboard className="text-accent" />
```

### NavCard not working?

1. Check if NavCard.tsx is in `src/shared/components/ui/`
2. Verify imports:
```tsx
import { NavCard } from '@/shared/components/ui/NavCard';
```

## 📖 More Resources

- **Quick Start**: See `QUICK_START.md` for rapid examples
- **Full Docs**: See `README.md` for complete catalog
- **Examples**: See `IconShowcase.tsx` for code examples
- **Visual Test**: Add `/test/icons` route to see all icons

## ✅ Next Steps

1. **Test**: Add IconTestPage to router and visit `/test/icons`
2. **Replace**: Find existing icon usage and replace with custom icons
3. **Integrate**: Use NavCard for student dashboard navigation
4. **Customize**: Adjust sizes and colors to match your needs
5. **Expand**: Add more custom icons as needed (follow existing patterns)

---

**Created for QYVORA** - Matching your hacker culture cybersecurity aesthetic perfectly!
