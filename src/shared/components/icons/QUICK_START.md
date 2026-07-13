# QYVORA Icons - Quick Start Guide

## 🚀 Get Started in 30 Seconds

### 1. Import Icons

```tsx
// In any component file
import { IconDashboard, IconBootcamp, IconLabs } from '@/shared/components/icons';
```

### 2. Use in Your Component

```tsx
function MyPage() {
  return (
    <div>
      <IconDashboard size={24} className="text-accent" />
    </div>
  );
}
```

## 🎯 Common Use Cases

### TryHackMe-Style Navigation (Icon Top, Label Bottom)

```tsx
import { IconBootcamp, IconLabs, IconCTF } from '@/shared/components/icons';
import { NavCard } from '@/shared/components/ui/NavCard';

function StudentDashboard() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6">
      <NavCard
        icon={<IconBootcamp size={64} />}
        label="Bootcamps"
        description="Learning paths"
        href="/student/bootcamps"
      />
      
      <NavCard
        icon={<IconLabs size={64} />}
        label="Labs"
        description="Practice environments"
        href="/student/labs"
        badge={5}
      />
      
      <NavCard
        icon={<IconCTF size={64} />}
        label="CTF"
        description="Capture the Flag"
        href="/student/ctf"
        locked
      />
    </div>
  );
}
```

### Buttons with Icons

```tsx
import { IconPlay, IconDownload } from '@/shared/components/icons';

<button className="btn-primary flex items-center gap-2">
  <IconPlay size={20} />
  Start Challenge
</button>

<button className="btn-secondary flex items-center gap-2">
  <IconDownload size={20} />
  Download Certificate
</button>
```

### Status Indicators

```tsx
import { IconCheck, IconClock, IconLock } from '@/shared/components/icons';

// Completed
<div className="flex items-center gap-2 text-accent">
  <IconCheck size={18} />
  <span>Module Complete</span>
</div>

// In Progress
<div className="flex items-center gap-2 text-yellow-500">
  <IconClock size={18} />
  <span>In Progress</span>
</div>

// Locked
<div className="flex items-center gap-2 text-text-muted">
  <IconLock size={18} />
  <span>Locked</span>
</div>
```

### Navigation Menus

```tsx
import { IconDashboard, IconProfile, IconSettings } from '@/shared/components/icons';

function Sidebar() {
  return (
    <nav>
      <a href="/dashboard" className="flex items-center gap-3 p-3 hover:bg-accent/10">
        <IconDashboard size={24} />
        <span>Dashboard</span>
      </a>
      
      <a href="/profile" className="flex items-center gap-3 p-3 hover:bg-accent/10">
        <IconProfile size={24} />
        <span>Profile</span>
      </a>
      
      <a href="/settings" className="flex items-center gap-3 p-3 hover:bg-accent/10">
        <IconSettings size={24} />
        <span>Settings</span>
      </a>
    </nav>
  );
}
```

### Stats Display

```tsx
import { IconWallet, IconFire, IconBadge } from '@/shared/components/icons';

function StatsBar() {
  return (
    <div className="flex gap-6">
      {/* CP Balance */}
      <div className="flex items-center gap-2">
        <IconWallet size={24} className="text-accent" />
        <span className="font-bold">1,250 CP</span>
      </div>
      
      {/* Streak */}
      <div className="flex items-center gap-2">
        <IconFire size={24} className="text-orange-500" />
        <span className="font-bold">7 Day Streak</span>
      </div>
      
      {/* Badges */}
      <div className="flex items-center gap-2">
        <IconBadge size={24} className="text-yellow-500" />
        <span className="font-bold">12 Badges</span>
      </div>
    </div>
  );
}
```

### Notifications

```tsx
import { IconNotification } from '@/shared/components/icons';

// With badge
<button className="relative">
  <IconNotification size={24} />
  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-bg text-xs font-bold rounded-full flex items-center justify-center">
    3
  </span>
</button>
```

## 🎨 Size Guide

| Usage | Size | Class Example |
|-------|------|---------------|
| Hero/Feature | 64-80px | `size={64}` |
| Navigation Cards | 48-64px | `size={64}` |
| Page Headings | 32-40px | `size={32}` |
| Buttons/Lists | 20-24px | `size={20}` |
| Inline Text | 16-18px | `size={16}` |

## 💡 Pro Tips

### 1. Use with Tailwind for Hover Effects

```tsx
<IconHack 
  size={48} 
  className="text-accent hover:scale-110 hover:brightness-110 transition-all duration-300" 
/>
```

### 2. Create Icon Grids

```tsx
<div className="grid grid-cols-4 gap-4">
  {icons.map(icon => (
    <div className="flex flex-col items-center gap-2">
      {icon.component}
      <span>{icon.label}</span>
    </div>
  ))}
</div>
```

### 3. Animated Loading States

```tsx
<IconSettings size={24} className="animate-spin text-accent" />
```

### 4. Badge Notifications

```tsx
<NavCard
  icon={<IconBootcamp size={64} />}
  label="Bootcamps"
  badge={3}  // Shows count
  href="/bootcamps"
/>

<NavCard
  icon={<IconCTF size={64} />}
  label="New Challenge"
  badge="NEW"  // Shows text
  href="/ctf"
/>
```

### 5. Locked Content

```tsx
<NavCard
  icon={<IconChallenges size={64} />}
  label="Advanced Module"
  description="Complete beginner module first"
  locked  // Shows padlock, disabled state
  href="#"
/>
```

## 🔗 Related Components

- **NavCard** - `/src/shared/components/ui/NavCard.tsx`
- **All Icons** - `/src/shared/components/icons/QyvoraIcons.tsx`
- **Examples** - `/src/shared/components/icons/IconShowcase.tsx`

## 📚 Full Documentation

See [README.md](./README.md) for complete icon catalog and detailed documentation.

---

**Questions?** Check the full README or IconShowcase.tsx for more examples!
